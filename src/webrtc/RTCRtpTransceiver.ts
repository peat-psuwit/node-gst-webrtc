import { GstWebRTC } from '../gstUtils';

import NgwRTCRtpSender from './RTCRtpSender';
import NgwRTCRtpReceiver from './RTCRtpReceiver';

class NgwRTCRtpTransceiver implements RTCRtpTransceiver {
  readonly sender: NgwRTCRtpSender;
  readonly receiver: NgwRTCRtpReceiver;

  private _gstTrans: GstWebRTC.WebRTCRTPTransceiver;

  constructor(
    gstTrans: GstWebRTC.WebRTCRTPTransceiver,
    jsSender: NgwRTCRtpSender,
    jsReceiver: NgwRTCRtpReceiver,
  ) {
    this._gstTrans = gstTrans;
    this.sender = jsSender;
    this.receiver = jsReceiver;
  }

  get mid() {
    let mid = this._gstTrans.mid;
    if (mid && mid.length === 0) {
      return null;
    }
    return mid;
  }

  get direction(): RTCRtpTransceiverDirection {
    switch(this._gstTrans.direction) {
      case GstWebRTC.WebRTCRTPTransceiverDirection.NONE:
      case GstWebRTC.WebRTCRTPTransceiverDirection.INACTIVE:
      default:
        return 'inactive';
      case GstWebRTC.WebRTCRTPTransceiverDirection.RECVONLY:
        return 'recvonly';
      case GstWebRTC.WebRTCRTPTransceiverDirection.SENDONLY:
        return 'sendonly';
      case GstWebRTC.WebRTCRTPTransceiverDirection.SENDRECV:
        return 'sendrecv';
    }
  }

  get currentDirection(): RTCRtpTransceiverDirection | null {
    switch(this._gstTrans.currentDirection) {
      case GstWebRTC.WebRTCRTPTransceiverDirection.NONE:
      default:
        return null;
      case GstWebRTC.WebRTCRTPTransceiverDirection.INACTIVE:
        return 'inactive';
      case GstWebRTC.WebRTCRTPTransceiverDirection.RECVONLY:
        return 'recvonly';
      case GstWebRTC.WebRTCRTPTransceiverDirection.SENDONLY:
        return 'sendonly';
      case GstWebRTC.WebRTCRTPTransceiverDirection.SENDRECV:
        return 'sendrecv';
    }
  }

  stop(): void {
    throw new Error('GstWebRTCBin does not support stopping a transceiver, yet.');
  }

  // Not in TS, but in WebRTC 1.0 spec.
  setCodecPreferences(codecs: RTCRtpCodecCapability[]): void {
    throw new Error('Not implemented.');
  }
}

export default NgwRTCRtpTransceiver;
