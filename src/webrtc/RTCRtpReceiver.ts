import NgwMediaStreamTrack, {
  NgwMediaStreamTrackInput,
} from '../media/MediaStreamTrack';
import NgwTeeMultiplexer from '../media/TeeMultiplexer';

import { Gst, GstWebRTC } from '../gstUtils';

import NgwRTCPeerConnection from './RTCPeerConnection';

function mutedAudioElement() {
  let element = Gst.ElementFactory.make('audiotestsrc');
  if (!element)
    throw new Error('Fail to create audiotestsrc?');

  (<any>element).isLive = true;
  (<any>element).wave = 4; // silence;

  return element;
}

function mutedVideoElement() {
  let element = Gst.ElementFactory.make('videotestsrc');
  if (!element)
    throw new Error('Fail to create videotestsrc?');

  (<any>element).isLive = true;
  (<any>element).pattern = 2; // black;

  return element;
}

class NgwRTCRtpReceiver implements RTCRtpReceiver, NgwMediaStreamTrackInput
{
  private _kind: 'video' | 'audio';
  private _pc: NgwRTCPeerConnection
  private _srcPad?: Gst.Pad;
  private _gstReceiver: GstWebRTC.WebRTCRTPReceiver;

  private _mutedElement: Gst.Element | null;
  private _decodeElement: Gst.Element | null = null;
  private _decodePad: Gst.Pad | null = null;
  private _teeMux: NgwTeeMultiplexer;

  private _tracks = new Set<NgwMediaStreamTrack>();

  readonly track: NgwMediaStreamTrack;

  constructor(
    kind: 'video' | 'audio',
    pc: NgwRTCPeerConnection,
    gstReceiver: GstWebRTC.WebRTCRTPReceiver,
  ) {
    this._kind = kind;
    this._pc = pc;
    this._gstReceiver = gstReceiver;

    // RTPReceiver's track starts off muted.
    this._mutedElement = kind === 'audio' ? mutedAudioElement()
                                          : mutedVideoElement();
    pc.getPipeline().add(this._mutedElement);

    let srcPad = this._mutedElement.getStaticPad('src')!;
    this._teeMux = new NgwTeeMultiplexer(pc.getPipeline(), srcPad, `remote ${kind}`);

    this._mutedElement.syncStateWithParent();

    this.track = new NgwMediaStreamTrack(this);
  }

  private _padAddedConnectId = -1;

  // Called by PeerConnection, should be called exactly once.
  _connectToPad(srcPad: Gst.Pad) {
    this._srcPad = srcPad;

    // TODO: proper error handling
    this._decodeElement = Gst.ElementFactory.make('decodebin')!;
    this.getPipeline().add(this._decodeElement);

    let sinkPad = this._decodeElement.getStaticPad('sink')!;
    srcPad.link(sinkPad);

    this._padAddedConnectId = this._decodeElement.connect('pad-added', this._handlePadAdded);

    this._decodeElement.syncStateWithParent();
  }

  private _handlePadAdded = (newPad: Gst.Pad) => {
    if (newPad.direction !== Gst.PadDirection.SRC)
      return;

    this._decodePad = newPad;

    this._mutedElement!.setState(Gst.State.NULL);

    this._teeMux.changeSrcPad(newPad);

    this.getPipeline().remove(this._mutedElement!);
    this._mutedElement = null;

    this._decodeElement!.disconnect(this._padAddedConnectId);
  }

  // RTPReceiver interface

  get transport(): RTCDtlsTransport | null {
    return null; // Not implemented.
  }

  getContributingSources(): RTCRtpContributingSource[] {
    return []; // Not implemented;
  }

  getParameters(): RTCRtpReceiveParameters {
    throw new Error('Not implemented.');
  }

  getStats(): Promise<RTCStatsReport> {
    throw new Error('Not implemented.');
  }

  getSynchronizationSources(): RTCRtpSynchronizationSource[] {
    return []; // Not implemented;
  }

  // NgwMediaStreamTrackInput interface

  get kind(): 'audio' | 'video' {
    return this._kind;
  }

  get label(): string {
    return `remote ${this._kind}`;
  }

  get muted(): boolean {
    return this._mutedElement !== null;
  }

  getPipeline(): Gst.Pipeline {
    return this._pc.getPipeline();
  }

  connect(track: NgwMediaStreamTrack): void {
    if (this._tracks.has(track)) {
      return;
    }

    this._tracks.add(track);
    this._teeMux.addPeer(track.getSinkPad());
  }

  disconnect(track: NgwMediaStreamTrack): void {
    if (!this._tracks.has(track)) {
      return;
    }

    this._tracks.delete(track);
    this._teeMux.removePeer(track.getSinkPad());
  }

  start(): void {
    // TODO: what to do? The stream is controlled by webrtcbin
  }

  stop(): void {
    // TODO: what to do? The stream is controlled by webrtcbin
  }
}

export default NgwRTCRtpReceiver;
