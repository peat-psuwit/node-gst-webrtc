import { EventTarget as EventTargetShim, getEventAttributeValue, setEventAttributeValue } from 'event-target-shim';

import {
  GLib,
  GObject,
  Gst,
  GstWebRTC,
  globalPipeline,
  withGstPromise
} from './gstUtils';

import GstRTCDataChannel from './RTCDataChannel';
import GstRTCIceCandidate from './RTCIceCandidate';
import GstRTCSessionDescription from './RTCSessionDescription';

// Specify options actually used, and thus will have defaults.
interface GstRTCConfiguration extends RTCConfiguration {
  iceServers: RTCIceServer[];
}

function fillConfigDefault(inConf?: RTCConfiguration | null): GstRTCConfiguration {
  const defaultIceServer: RTCIceServer = {
    urls: ['stun:stun.l.google.com:19302']
  };

  if (!inConf)
    inConf = {};

  return {
    ...inConf,
    iceServers: (inConf.iceServers && inConf.iceServers.length > 0) ? inConf.iceServers : [defaultIceServer]
  }
}

type TEvents = {
  connectionstatechange: Event;
  datachannel: RTCDataChannelEvent;
  icecandidate: RTCPeerConnectionIceEvent;
  icecandidateerror: RTCPeerConnectionIceErrorEvent;
  iceconnectionstatechange: Event;
  icegatheringstatechange: Event;
  negotiationneeded: Event;
  signalingstatechange: Event;
  track: RTCTrackEvent;
};


function validateHostPort(hostPort: string) {
  const splitted = hostPort.split(':');

  if (splitted.length == 1) {
    return true;
  } else if (splitted.length == 2) {
    const port = splitted[1];
    // port should consists of numbers only.
    return /^[0-9]+$/.test(port);
  } else {
    return false;
  }
}

class GstRTCPeerConnection extends EventTargetShim<TEvents, /* mode */ 'strict'> implements RTCPeerConnection {
  private _webrtcbin: Gst.Element;
  private _conf: GstRTCConfiguration;
  private _closedRequested = false;
  private _glibConnectIds: number[];

  // We need a Map here because if e.g. the 'on-data-channel' signal comes up
  // after createDataChannel() is called, we want to make sure that we put
  // the same JS wrapper as the one created in createDataChannel() in the event.
  // I've considered WeakMap, but it won't help us release the backing object
  // sooner at all, as the JS wrapper need to hold the backing object, and if
  // the wrapper is reachable via the WeakMap, so does the backing object and
  // then WeakMap won't consider GC the wrapper.
  private _dataChannels: Map<GObject.Object, GstRTCDataChannel> = new Map();

  constructor(conf?: RTCConfiguration | null) {
    super();

    const bin = Gst.ElementFactory.make('webrtcbin');
    if (!bin) {
      throw new Error('webrtcbin is not installed!');
    }
    this._webrtcbin = bin;
    this._conf = fillConfigDefault(conf);

    this._addIceServers();

    this._glibConnectIds = [
      this._webrtcbin.connect('on-negotiation-needed', this._handleNegotiationNeeded),
      this._webrtcbin.connect('on-ice-candidate', this._handleIceCandidate),
      this._webrtcbin.connect('on-data-channel', this._handleDataChannel),
    ];
    // TODO: connect to more signals

    globalPipeline.add(this._webrtcbin);
    this._webrtcbin.syncStateWithParent();
  }

  private _addIceServers() {
    const {iceServers} = this._conf;
    let stunServerSet = false;
    let turnServerSet = false;

    for (const server of iceServers) {
      // FIXME: spec seems to suggest that all URIs inside a server entry are used,
      // however, I'm not sure if this (recursively add all URIs) is correct.

      let urls: string[];
      if (Array.isArray(server.urls)) {
        if (server.urls.length == 0) {
          throw new SyntaxError('Empty server URL entry.');
        }
        urls = server.urls;
      } else {
        urls = [server.urls];
      }

      for (const url of urls) {
        // STUN & TURN URIs are unusual in that it doesn't contain '//'.
        // However, GstWebRTCBin uses a normal URL so that username/password can
        // be inserted. Thus, some magic is needed to transform between them.
        // When parsed by URL class, host & port will instead be in `pathname`.
        const urlParsed = new URL(url); // Throw if it can't parse URL.
        const proto = urlParsed.protocol; // Contains ':'.
        const hostPort = urlParsed.pathname;

        // Catch URI error here so that WebRTCBin won't emit async error later.
        if (!validateHostPort(hostPort)) {
          throw new TypeError(`Invalid ICE server URI "${url}".`);
        }

        switch (proto) {
          case 'stun:':
          case 'stuns:': {
            if (stunServerSet) {
              console.warn('GstWebRTCBin does not support more than 1 STUN server. ' + 
                           'The later server(s) will be ignored.');
              continue;
            }

            const gstUrl = `${proto}//${hostPort}`;
            (<any>this._webrtcbin).stunServer = gstUrl;
            stunServerSet = true;
            break;
          }
          case 'turn:':
          case 'turns:': {
            if (server.credentialType && server.credentialType !== 'password') {
              throw new TypeError(`Unsupported TURN server credential type ${server.credentialType}`);
            }
            if (typeof server.username !== 'string' || typeof server.credential !== 'string') {
              throw new TypeError(`TURN server credential for ${url} is omitted.`);
            }

            if (turnServerSet) {
              console.warn("This version of Gst doesn't have 'add-turn-server' and " +
                           "multiple TURN servers are passed in. " +
                           "All later servers will be ignored.");
              continue;
            }

            // Use URL object to ensure proper username/password escape.
            let gstUrl = new URL(`${proto}//${hostPort}`);
            gstUrl.username = server.username;
            gstUrl.password = server.credential;
            try {
              this._webrtcbin.emit('add-turn-server', gstUrl.toString());
            } catch (e) {
              if (!e || typeof e.message !== 'string' || !e.message.startsWith('Invalid signal '))
                throw e;
              // This version of Gst doesn't have 'add-turn-server' yet. Fallback to the
              // old method.
              (<any>this._webrtcbin).turnServer = gstUrl.toString();
              turnServerSet = true;
            }
            break;
          }
          default:
            throw new TypeError(`Unsupported ICE server protocol ${proto}.`);
        }
      }
    }
  }

  private _handleDataChannel = (gstdatachannel: GObject.Object) => {
    let jsdatachannel = this._dataChannels.get(gstdatachannel);

    if (!jsdatachannel)
      jsdatachannel = this._createJsDataChannel(gstdatachannel);

    this.dispatchEvent({ type: 'datachannel', channel: jsdatachannel });
  }

  private _handleNegotiationNeeded = () => {
    // There's nothing to be put in the event.
    this.dispatchEvent<'negotiationneeded'>({ type: 'negotiationneeded' });
  }

  private _handleIceCandidate = (sdpMLineIndex: number, candidate: string) => {
    const candidateObj = new GstRTCIceCandidate({ sdpMLineIndex, candidate });
    this.dispatchEvent<'icecandidate'>({ type: 'icecandidate', candidate: candidateObj });
  }

  // libnice's document seems to say so.
  readonly canTrickleIceCandidates = true;

  // Stubs
  get connectionState(): RTCPeerConnectionState {
    switch ((<any>this._webrtcbin).connectionState) {
      case GstWebRTC.WebRTCPeerConnectionState.NEW:
      default:
        return 'new';
      case GstWebRTC.WebRTCPeerConnectionState.CONNECTING:
        return 'connecting';
      case GstWebRTC.WebRTCPeerConnectionState.CONNECTED:
        return 'connected';
      case GstWebRTC.WebRTCPeerConnectionState.DISCONNECTED:
        return 'disconnected';
      case GstWebRTC.WebRTCPeerConnectionState.FAILED:
        return 'failed';
      case GstWebRTC.WebRTCPeerConnectionState.CLOSED:
        return 'closed';
    }
  }

  get iceConnectionState(): RTCIceConnectionState {
    switch ((<any>this._webrtcbin).iceConnectionState) {
      case GstWebRTC.WebRTCICEConnectionState.NEW:
      default:
        return 'new';
      case GstWebRTC.WebRTCICEConnectionState.CHECKING:
        return 'checking';
      case GstWebRTC.WebRTCICEConnectionState.CONNECTED:
        return 'connected';
      case GstWebRTC.WebRTCICEConnectionState.COMPLETED:
        return 'completed';
      case GstWebRTC.WebRTCICEConnectionState.FAILED:
        return 'failed';
      case GstWebRTC.WebRTCICEConnectionState.DISCONNECTED:
        return 'disconnected';
      case GstWebRTC.WebRTCICEConnectionState.CLOSED:
        return 'closed';
    }
  }

  get iceGatheringState(): RTCIceGatheringState {
    switch ((<any>this._webrtcbin).iceGatheringState) {
      case GstWebRTC.WebRTCICEGatheringState.NEW:
      default:
        return 'new';
      case GstWebRTC.WebRTCICEGatheringState.GATHERING:
        return 'gathering';
      case GstWebRTC.WebRTCICEGatheringState.COMPLETE:
        return 'complete';
    }
  }

  get idpErrorInfo() {
    return null;
  }

  get idpLoginUrl() {
    return null;
  }

  _descriptionFromProp(prop: string) {
    const sdp: GstWebRTC.WebRTCSessionDescription | null = (<any>this._webrtcbin)[prop]
    if (!sdp)
      return null;
    return GstRTCSessionDescription.fromGstDesc(sdp);
  }

  get localDescription() {
    return this._descriptionFromProp('localDescription');
  }

  get remoteDescription() {
    return this._descriptionFromProp('remoteDescription');
  }

  get currentLocalDescription() {
    return this._descriptionFromProp('currentLocalDescription');
  }

  get currentRemoteDescription() {
    return this._descriptionFromProp('currentRemoteDescription');
  }

  get pendingLocalDescription() {
    return this._descriptionFromProp('`pendingLocalDescription`');
  }

  get pendingRemoteDescription() {
    return this._descriptionFromProp('pendingRemoteDescription');
  }

  get peerIdentity() {
    return Promise.reject(new Error('Not implemented'));
  }

  get sctp() {
    return null;
  }

  get signalingState(): RTCSignalingState {
    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/close
    // Once [close()] returns, the signaling state as returned by RTCPeerConnection.
    // signalingState is 'closed'.
    if (this._closedRequested)
      return 'closed';

    switch ((<any>this._webrtcbin).signalingState) {
      case GstWebRTC.WebRTCSignalingState.STABLE:
      default:
        return 'stable';
      case GstWebRTC.WebRTCSignalingState.CLOSED:
        return 'closed';
      case GstWebRTC.WebRTCSignalingState.HAVE_LOCAL_OFFER:
        return 'have-local-offer';
      case GstWebRTC.WebRTCSignalingState.HAVE_REMOTE_OFFER:
        return 'have-remote-offer';
      case GstWebRTC.WebRTCSignalingState.HAVE_LOCAL_PRANSWER:
        return 'have-local-pranswer';
      case GstWebRTC.WebRTCSignalingState.HAVE_REMOTE_PRANSWER:
        return 'have-remote-pranswer';
    }
  }

  async addIceCandidate(candidate: RTCIceCandidateInit | RTCIceCandidate): Promise<void> {
    const {candidate: candidateStr, sdpMLineIndex} = candidate;
    if (typeof candidateStr != 'string' || typeof sdpMLineIndex != 'number') {
      return;
    }

    // 'add-ice-candidate' doesn't accept GstPromise, so nothing we can do to signal completion.
    this._webrtcbin.emit('add-ice-candidate', sdpMLineIndex, candidateStr);
    return;
  }

  addTrack(track: MediaStreamTrack, ...streams: MediaStream[]): RTCRtpSender {
    throw new Error('Not implemented');
  }

  addTransceiver(trackOrKind: MediaStreamTrack | string, init?: RTCRtpTransceiverInit): RTCRtpTransceiver {
    throw new Error('Not implemented');
  }

  close(): void {
    this._closedRequested = true;

    setTimeout(() => {
      globalPipeline.remove(this._webrtcbin);
      this._webrtcbin.setState(Gst.State.NULL);

      for (let [, ch] of this._dataChannels) {
        ch._disconnectGlibSignals();
      }
      this._dataChannels.clear();

      // node-gtk doesn't handle cyclic reference well, so we have to break
      // the cycle for it.
      for (let id of this._glibConnectIds) {
        this._webrtcbin.disconnect(id);
      }

      return false;
    }, 0 /* ms */);
  }

  async createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit> {
    // Currently webrtcbin doesn't use options, thus do nothing for now.
    const opts = Gst.Structure.newEmpty('offer-options');
    const structure = await withGstPromise((promise) => {
      this._webrtcbin.emit('create-offer', opts, promise);
    });

    const gvalue: GObject.Value = structure.getValue('offer');
    const sdp: GstWebRTC.WebRTCSessionDescription = <any>gvalue.getBoxed();
    gvalue.unset();

    return GstRTCSessionDescription.fromGstDesc(sdp);
  }

  async createAnswer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit> {
    // Currently webrtcbin doesn't use options, thus do nothing for now.
    const opts = Gst.Structure.newEmpty('offer-options');
    const structure = await withGstPromise((promise) => {
      this._webrtcbin.emit('create-answer', opts, promise);
    });

    const gvalue: GObject.Value = structure.getValue('answer');
    const sdp: GstWebRTC.WebRTCSessionDescription = <any>gvalue.getBoxed();
    gvalue.unset();

    return GstRTCSessionDescription.fromGstDesc(sdp);
  }

  private _createJsDataChannel(gstdatachannel: GObject.Object) {
    const jsdatachannel = new GstRTCDataChannel(gstdatachannel);
    this._dataChannels.set(gstdatachannel, jsdatachannel);

    // We want to know when it's closed, so that we can drop its reference
    // from our map.
    const closeHandler = () => {
      this._dataChannels.delete(gstdatachannel);
      jsdatachannel.removeEventListener('close', closeHandler);
    }
    jsdatachannel.addEventListener('close', closeHandler);

    return jsdatachannel;
  }

  createDataChannel(label: string, options: RTCDataChannelInit = {}): RTCDataChannel {
    // https://w3c.github.io/webrtc-pc/#dom-peerconnection-createdatachannel

    // Conditions checked here are also checked inside webrtcbin's signal handler, but
    // it doesn't set any error state except return null. To be able to distinguish
    // each kind of errors, check them manually here.

    if (this.signalingState === 'closed') {
      // Note: spac calls for InvalidStateError, which seems to be unavailable
      throw new Error('A data channel cannot be created while the connection is closed.');
    }

    if ((new TextEncoder().encode(label)).length > 65535)
      throw new TypeError('The label is too long.');

    const gstOpts = Gst.Structure.newEmpty('data-channel-opts');

    // GstStructure.setValue() take GValue...
    const gValue = new GObject.Value();

    if (typeof options.ordered === 'boolean') {
      gValue.init((<any>GObject).TYPE_BOOLEAN);
      gValue.setBoolean(options.ordered);
      gstOpts.setValue('ordered', gValue);
      gValue.unset();
    }

    if (typeof options.maxPacketLifeTime === 'number') {
      if (typeof options.maxRetransmits === 'number'){
        throw new TypeError('maxPacketLifeTime and maxRetransmits must not be set at the same time.');
      }

      gValue.init((<any>GObject).TYPE_INT);
      gValue.setInt(options.maxPacketLifeTime);
      gstOpts.setValue('max-packet-lifetime', gValue);
      gValue.unset();
    }

    if (typeof options.maxRetransmits === 'number') {
      gValue.init((<any>GObject).TYPE_INT);
      gValue.setInt(options.maxRetransmits);
      gstOpts.setValue('max-retransmits', gValue);
      gValue.unset();
    }

    if (typeof options.protocol === 'string') {
      if (new TextEncoder().encode(options.protocol).length > 65535) {
        throw new TypeError('options.protocol is too long.');
      }

      gValue.init((<any>GObject).TYPE_STRING);
      gValue.setString(options.protocol);
      gstOpts.setValue('protocol', gValue);
      gValue.unset();
    }

    if (typeof options.negotiated === 'boolean') {
      if (options.negotiated && typeof options.id !== 'number') {
        throw new TypeError('Negotiated data channel requires an id.');
      }

      gValue.init((<any>GObject).TYPE_BOOLEAN);
      gValue.setBoolean(options.negotiated);
      gstOpts.setValue('negotiated', gValue);
      gValue.unset();
    }

    if (typeof options.id === 'number') {
      if (options.id >= 65535) {
        throw new TypeError('options.id is too high.');
      }

      gValue.init((<any>GObject).TYPE_INT);
      gValue.setInt(options.id);
      gstOpts.setValue('id', gValue);
      gValue.unset();
    }

    // FIXME: remove the cast when the emit's signature is fixed.
    const gstdatachannel: GObject.Object | null = <any>this._webrtcbin.emit('create-data-channel', label, gstOpts);
    if (!gstdatachannel) {
      // At this point, it's likely that the error are related to channel's id.
      // But webrtcbin reports error to warning log only, so there's no way we
      // can know for sure what's the problem.
      throw new Error('Cannot create the backing GstWebRTCDataChannel.');
    }

    return this._createJsDataChannel(gstdatachannel);
  }

  getConfiguration(): RTCConfiguration {
    return {...this._conf};
  }

  getIdentityAssertion(): Promise<string> {
    return Promise.reject(new Error('Not implemented'));
  }

  getReceivers(): RTCRtpReceiver[] {
    throw new Error('Not implemented');
  }

  getSenders(): RTCRtpSender[] {
    throw new Error('Not implemented');
  }

  getStats(selector?: MediaStreamTrack | null): Promise<RTCStatsReport> {
    return Promise.reject(new Error('Not implemented'));
  }

  getTransceivers(): RTCRtpTransceiver[] {
    throw new Error('Not implemented');
  }

  removeTrack(sender: RTCRtpSender): void {
    throw new Error('Not implemented');
  }

  restartIce(): void {
    throw new Error('Not implemented');
  }

  setConfiguration(configuration: RTCConfiguration): void {
    throw new Error('Not implemented');
  }

  setIdentityProvider(provider: string, options?: RTCIdentityProviderOptions): void {
    throw new Error('Not implemented');
  }

  async setLocalDescription(description: RTCSessionDescriptionInit): Promise<void> {
    const gstDesc = new GstRTCSessionDescription(description).toGstDesc();
    await withGstPromise((promise) => {
      this._webrtcbin.emit('set-local-description', gstDesc, promise);
    });
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    const gstDesc = new GstRTCSessionDescription(description).toGstDesc();
    await withGstPromise((promise) => {
      this._webrtcbin.emit('set-remote-description', gstDesc, promise);
    });
  }

  // BEGIN generated event getters & setters; TEventTarget = RTCPeerConnection
  get onconnectionstatechange(): EventTargetShim.CallbackFunction<RTCPeerConnection, Event> | null {
    return getEventAttributeValue<RTCPeerConnection, Event>(this, 'connectionstatechange');
  }
  set onconnectionstatechange(value) {
    setEventAttributeValue(this, 'connectionstatechange', value);
  }

  get ondatachannel(): EventTargetShim.CallbackFunction<RTCPeerConnection, RTCDataChannelEvent> | null {
    return getEventAttributeValue<RTCPeerConnection, RTCDataChannelEvent>(this, 'datachannel');
  }
  set ondatachannel(value) {
    setEventAttributeValue(this, 'datachannel', value);
  }

  get onicecandidate(): EventTargetShim.CallbackFunction<RTCPeerConnection, RTCPeerConnectionIceEvent> | null {
    return getEventAttributeValue<RTCPeerConnection, RTCPeerConnectionIceEvent>(this, 'icecandidate');
  }
  set onicecandidate(value) {
    setEventAttributeValue(this, 'icecandidate', value);
  }

  get onicecandidateerror(): EventTargetShim.CallbackFunction<RTCPeerConnection, RTCPeerConnectionIceErrorEvent> | null {
    return getEventAttributeValue<RTCPeerConnection, RTCPeerConnectionIceErrorEvent>(this, 'icecandidateerror');
  }
  set onicecandidateerror(value) {
    setEventAttributeValue(this, 'icecandidateerror', value);
  }

  get oniceconnectionstatechange(): EventTargetShim.CallbackFunction<RTCPeerConnection, Event> | null {
    return getEventAttributeValue<RTCPeerConnection, Event>(this, 'iceconnectionstatechange');
  }
  set oniceconnectionstatechange(value) {
    setEventAttributeValue(this, 'iceconnectionstatechange', value);
  }

  get onicegatheringstatechange(): EventTargetShim.CallbackFunction<RTCPeerConnection, Event> | null {
    return getEventAttributeValue<RTCPeerConnection, Event>(this, 'icegatheringstatechange');
  }
  set onicegatheringstatechange(value) {
    setEventAttributeValue(this, 'icegatheringstatechange', value);
  }

  get onnegotiationneeded(): EventTargetShim.CallbackFunction<RTCPeerConnection, Event> | null {
    return getEventAttributeValue<RTCPeerConnection, Event>(this, 'negotiationneeded');
  }
  set onnegotiationneeded(value) {
    setEventAttributeValue(this, 'negotiationneeded', value);
  }

  get onsignalingstatechange(): EventTargetShim.CallbackFunction<RTCPeerConnection, Event> | null {
    return getEventAttributeValue<RTCPeerConnection, Event>(this, 'signalingstatechange');
  }
  set onsignalingstatechange(value) {
    setEventAttributeValue(this, 'signalingstatechange', value);
  }

  get ontrack(): EventTargetShim.CallbackFunction<RTCPeerConnection, RTCTrackEvent> | null {
    return getEventAttributeValue<RTCPeerConnection, RTCTrackEvent>(this, 'track');
  }
  set ontrack(value) {
    setEventAttributeValue(this, 'track', value);
  }

  // END generated event getters & setters
}

export default GstRTCPeerConnection;
