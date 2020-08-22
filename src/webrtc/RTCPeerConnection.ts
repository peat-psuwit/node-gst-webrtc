import { EventTarget as EventTargetShim, defineEventAttribute } from 'event-target-shim';

import { Gst, globalPipeline } from './gstUtils';
import { GstRTCIceCandidate } from './RTCIceCandidate';

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
    return 'new';
  }

  get iceConnectionState(): RTCIceConnectionState {
    return 'new';
  }

  get iceGatheringState(): RTCIceGatheringState {
    return 'new';
  }

  get idpErrorInfo() {
    return null;
  }

  get idpLoginUrl() {
    return null;
  }

  get localDescription() {
    return null;
  }

  get remoteDescription() {
    return null;
  }

  get currentLocalDescription() {
    return null;
  }

  get currentRemoteDescription() {
    return null;
  }

  get pendingLocalDescription() {
    return null;
  }

  get pendingRemoteDescription() {
    return null;
  }

  get peerIdentity() {
    return Promise.reject(new Error('Not implemented'));
  }

  get sctp() {
    return null;
  }

  get signalingState(): RTCSignalingState {
    return 'closed';
  }

  addIceCandidate(candidate: RTCIceCandidateInit | RTCIceCandidate): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }

  addTrack(track: MediaStreamTrack, ...streams: MediaStream[]): RTCRtpSender {
    throw new Error('Not implemented');
  }

  addTransceiver(trackOrKind: MediaStreamTrack | string, init?: RTCRtpTransceiverInit): RTCRtpTransceiver {
    throw new Error('Not implemented');
  }

  close(): void {
    throw new Error('Not implemented');
  }

  createAnswer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit> {
    return Promise.reject(new Error('Not implemented'));
  }

  createDataChannel(label: string, dataChannelDict?: RTCDataChannelInit): RTCDataChannel {
    throw new Error('Not implemented');
  }

  createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit> {
    return Promise.reject(new Error('Not implemented'));
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

  setLocalDescription(description: RTCSessionDescriptionInit): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }

  setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
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
