import { Gst, GstWebRTC } from '../gstUtils';

import NgwRTCPeerConnection from "./RTCPeerConnection";

class NgwRTCRtpSender implements RTCRtpSender {
  private _pc: NgwRTCPeerConnection
  private _srcPad: Gst.Pad;
  private _gstSender: GstWebRTC.WebRTCRTPSender;

  constructor(
    pc: NgwRTCPeerConnection,
    sinkPad: Gst.Pad,
    gstSender: GstWebRTC.WebRTCRTPSender,
  ) {
    this._pc = pc;
    this._srcPad = sinkPad;
    this._gstSender = gstSender;
  }

  get dtmf(): RTCDTMFSender | null {
    return null; // Not implemented.
  }

  get track(): MediaStreamTrack | null {
    return null; // Not implemented.
  }

  get transport(): RTCDtlsTransport | null {
    return null; // Not implemented;
  }

  getParameters(): RTCRtpSendParameters {
    throw new Error('Not implemented.');
  }

  async getStats(): Promise<RTCStatsReport> {
    throw new Error('Not implemented.');
  }

  async replaceTrack(withTrack: MediaStreamTrack | null): Promise<void> {
    throw new Error('Not implemented.');
  }

  async setParameters(parameters: RTCRtpSendParameters): Promise<void> {
    throw new Error('Not implemented.');
  }

  setStreams(...streams: MediaStream[]): void {
    throw new Error('Not implemented.');
  }
}

export default NgwRTCRtpSender;
