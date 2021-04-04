import { EventTarget as EventTargetShim, defineEventAttribute } from 'event-target-shim';

import { Gst, GstWebRTC, globalPipeline, withGstPromise } from './gstUtils';
import { GstRTCIceCandidate } from './RTCIceCandidate';
import { GstRTCSessionDescription } from './RTCSessionDescription';

// Specify options actually used, and thus will have defaults.
interface GstRTCConfiguration extends RTCConfiguration {
  iceServers: RTCIceServer[];
}

function fillConfigDefault(inConf: RTCConfiguration = {}): GstRTCConfiguration {
  const defaultIceServer: RTCIceServer = {
    urls: ['stun:stun.l.google.com:19302']
  };

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
  statsended: RTCStatsEvent;
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
  _webrtcbin: Gst.Element;
  _conf: GstRTCConfiguration;

  constructor(conf?: RTCConfiguration) {
    super();

    const bin = Gst.ElementFactory.make('webrtcbin');
    if (!bin) {
      throw new Error('webrtcbin is not installed!');
    }
    this._webrtcbin = bin;
    this._conf = fillConfigDefault(conf);

    this._addIceServers();

    this._webrtcbin.connect('on-negotiation-needed', this._handleNegotiationNeeded);
    this._webrtcbin.connect('on-ice-candidate', this._handleIceCandidate);
    // TODO: connect to more signals

    globalPipeline.add(this._webrtcbin);
    this._webrtcbin.syncStateWithParent();
  }

  _addIceServers() {
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

  _handleNegotiationNeeded = () => {
    // There's nothing to be put in the event.
    this.dispatchEvent<'negotiationneeded'>({ type: 'negotiationneeded' });
  }

  // FIXME: signature not verified yet.
  _handleIceCandidate = ($obj: Gst.Element, sdpMLineIndex: number, candidate: string) => {
    const candidateObj = new GstRTCIceCandidate({ sdpMLineIndex, candidate });
    this.dispatchEvent<'icecandidate'>({ type: 'icecandidate', candidate: candidateObj, url: null });
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
    // webrtcbin doesn't have an explicit close(), but changing state to NULL
    // should close the connection.
    this._webrtcbin.setState(Gst.State.NULL);
    // TODO: additional cleanup
  }

  async createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit> {
    // Currently webrtcbin doesn't use options, thus do nothing for now.
    const structure = await withGstPromise((promise) => {
      this._webrtcbin.emit('create-offer', null, promise);
    });

    const gvalue: GObject.Value = structure.getValue('offer');
    const sdp: GstWebRTC.WebRTCSessionDescription = <any>gvalue.getObject();
    gvalue.unset();

    return GstRTCSessionDescription.fromGstDesc(sdp);
  }

  async createAnswer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit> {
    // Currently webrtcbin doesn't use options, thus do nothing for now.
    const structure = await withGstPromise((promise) => {
      this._webrtcbin.emit('create-answer', null, promise);
    });

    const gvalue: GObject.Value = structure.getValue('answer');
    const sdp: GstWebRTC.WebRTCSessionDescription = <any>gvalue.getObject();
    gvalue.unset();

    return GstRTCSessionDescription.fromGstDesc(sdp);
  }

  createDataChannel(label: string, dataChannelDict?: RTCDataChannelInit): RTCDataChannel {
    throw new Error('Not implemented');
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
}

[
  'connectionstatechange',
  'datachannel',
  'icecandidate',
  'icecandidateerror',
  'iceconnectionstatechange',
  'icegatheringstatechange',
  'negotiationneeded',
  'signalingstatechange',
  'statsended',
  'track',
].forEach((eventName) => { defineEventAttribute(GstRTCPeerConnection.prototype, eventName); })

export default GstRTCPeerConnection;
