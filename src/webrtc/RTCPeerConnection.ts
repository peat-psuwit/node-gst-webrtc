import { EventTarget as EventTargetShim, defineEventAttribute } from 'event-target-shim';

import { getIntProperty, getObjectProperty } from './gobjectUtils';
import { Gst, GstWebRTC, globalPipeline, withGstPromise } from './gstUtils';
import { GstRTCIceCandidate } from './RTCIceCandidate';
import { GstRTCSessionDescription } from './RTCSessionDescription';

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

type TEventAttributes = {
  onconnectionstatechange: Event;
  ondatachannel: RTCDataChannelEvent;
  onicecandidate: RTCPeerConnectionIceEvent;
  onicecandidateerror: RTCPeerConnectionIceErrorEvent;
  oniceconnectionstatechange: Event;
  onicegatheringstatechange: Event;
  onnegotiationneeded: Event;
  onsignalingstatechange: Event;
  onstatsended: RTCStatsEvent;
  ontrack: RTCTrackEvent;
};

class GstRTCPeerConnection extends EventTargetShim<TEvents, TEventAttributes, /* mode */ 'standard'> implements RTCPeerConnection {
  _webrtcbin: Gst.Element;
  _conf: RTCConfiguration;

  constructor(conf?: RTCConfiguration) {
    super();

    const bin = Gst.ElementFactory.make('webrtcbin');
    if (!bin) {
      throw new Error('webrtcbin is not installed!');
    }
    this._webrtcbin = bin;
    this._conf = conf || {};

    this._webrtcbin.connect('on-negotiation-needed', this._handleNegotiationNeeded);
    this._webrtcbin.connect('on-ice-candidate', this._handleIceCandidate);
    // TODO: connect to more signals

    globalPipeline.add(this._webrtcbin);
    this._webrtcbin.syncStateWithParent();
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
    // node-gtk doesn't support non-introspected properties.
    const connectionState = getIntProperty(this._webrtcbin, 'connection-state');

    switch (connectionState) {
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
    // See above.
    const iceConnectionState = getIntProperty(this._webrtcbin, 'ice-connection-state');

    switch (iceConnectionState) {
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
    // See above
    const iceGatheringState = getIntProperty(this._webrtcbin, 'ice-gathering-state');

    switch (iceGatheringState) {
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
    const sdp: GstWebRTC.WebRTCSessionDescription = <any>getObjectProperty(this._webrtcbin, prop);
    return GstRTCSessionDescription.fromGstDesc(sdp);
  }

  get localDescription() {
    return this._descriptionFromProp('local-description');
  }

  get remoteDescription() {
    return this._descriptionFromProp('remote-description');
  }

  get currentLocalDescription() {
    return this._descriptionFromProp('current-local-description');
  }

  get currentRemoteDescription() {
    return this._descriptionFromProp('current-remote-description');
  }

  get pendingLocalDescription() {
    return this._descriptionFromProp('`pending-local-description`');
  }

  get pendingRemoteDescription() {
    return this._descriptionFromProp('pending-remote-description');
  }

  get peerIdentity() {
    return Promise.reject(new Error('Not implemented'));
  }

  get sctp() {
    return null;
  }

  get signalingState(): RTCSignalingState {
    const signalingState = getIntProperty(this._webrtcbin, 'signaling-state');

    switch (signalingState) {
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
    throw new Error('Not implemented');
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
