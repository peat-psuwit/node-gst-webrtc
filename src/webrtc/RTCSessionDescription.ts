import * as gi from 'node-gtk';

const GstWebRTC = gi.require('GstWebRTC', '1.0');
const GstSDP_ = gi.require('GstSdp', '1.0');

class GstRTCSessionDescription implements RTCSessionDescription {
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
    return new GstRTCSessionDescription({
      sdp: desc.sdp.asText(),
      type: GstRTCSessionDescription.sdpTypeToString(desc.type),
    });
  }

  toGstDesc() {
    const [ret, sdp] = GstSDP_.sdpMessageNewFromText(this.sdp);
    if (ret != GstSDP_.SDPResult.OK) {
      throw new Error('sdpMessageNewFromText()');
    }

    return GstWebRTC.WebRTCSessionDescription.new(
      GstRTCSessionDescription.sdpTypeFromString(this.type),
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

export default GstRTCSessionDescription
