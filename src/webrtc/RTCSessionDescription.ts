import {
  GstWebRTC,
  GstSDP,
} from '../gstUtils';

class NgwRTCSessionDescription implements RTCSessionDescription {
  readonly sdp: string;
  readonly type: RTCSdpType;

  constructor(init?: RTCSessionDescriptionInit) {
    this.sdp = init?.sdp ?? '';
    this.type = init?.type ?? 'answer';
  }

  static sdpTypeToString(type: GstWebRTC.WebRTCSDPType): RTCSdpType {
    switch (type) {
      case GstWebRTC.WebRTCSDPType.OFFER:
      default:
        return 'offer';
      case GstWebRTC.WebRTCSDPType.PRANSWER:
        return 'pranswer';
      case GstWebRTC.WebRTCSDPType.ANSWER:
        return 'answer';
      case GstWebRTC.WebRTCSDPType.ROLLBACK:
        return 'rollback';
    }
  }

  static sdpTypeFromString(str: RTCSdpType): GstWebRTC.WebRTCSDPType {
    switch (str) {
      case 'offer':
        return GstWebRTC.WebRTCSDPType.OFFER;
      case 'pranswer':
        return GstWebRTC.WebRTCSDPType.PRANSWER;
      case 'answer':
        return GstWebRTC.WebRTCSDPType.ANSWER;
      case 'rollback':
        return GstWebRTC.WebRTCSDPType.ROLLBACK;
    }
  }

  static fromGstDesc(desc: GstWebRTC.WebRTCSessionDescription) {
    return new NgwRTCSessionDescription({
      // https://github.com/gjsify/ts-for-gir/issues/108
      sdp: desc.sdp.asText()!,
      type: NgwRTCSessionDescription.sdpTypeToString(desc.type),
    });
  }

  toGstDesc() {
    const [ret, sdp] = GstSDP.sdpMessageNewFromText(this.sdp);
    if (ret != GstSDP.SDPResult.OK) {
      throw new Error('sdpMessageNewFromText()');
    }

    return GstWebRTC.WebRTCSessionDescription.new(
      NgwRTCSessionDescription.sdpTypeFromString(this.type),
      sdp
    );
  }

  toJSON() {
    return {
      sdp: this.sdp,
      type: this.type,
    };
  }
}

export default NgwRTCSessionDescription
