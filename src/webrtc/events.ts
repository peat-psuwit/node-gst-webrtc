export class NgwRTCDataChannelEvent extends Event implements RTCDataChannelEvent {
  readonly channel: RTCDataChannel;

  constructor(type: string, eventInitDict: RTCDataChannelEventInit) {
    super(type, eventInitDict);

    this.channel = eventInitDict.channel;
  }
}

export class NgwRTCPeerConnectionIceEvent extends Event implements RTCPeerConnectionIceEvent {
  readonly candidate: RTCIceCandidate | null;

  constructor(type: string, eventInitDict: RTCPeerConnectionIceEventInit) {
    super(type, eventInitDict);

    this.candidate = eventInitDict.candidate ?? null;
  }
}

export class NgwRTCPeerConnectionIceErrorEvent extends Event implements RTCPeerConnectionIceErrorEvent {
  readonly address: string | null;
  readonly errorCode: number;
  readonly errorText: string;
  readonly port: number | null;
  readonly url: string;

  constructor(type: string, eventInitDict: RTCPeerConnectionIceErrorEventInit) {
    super(type, eventInitDict);

    this.address = eventInitDict.address ?? null;
    this.errorCode = eventInitDict.errorCode;
    // TODO: implement this properly
    this.errorText = `Unknown error ${eventInitDict.errorCode}`;
    this.port = eventInitDict.port ?? null;
    this.url = eventInitDict.url ?? '';
  }
}

export class NgwRTCTrackEvent extends Event implements RTCTrackEvent {
  readonly receiver: RTCRtpReceiver;
  readonly streams: ReadonlyArray<MediaStream>;
  readonly track: MediaStreamTrack;
  readonly transceiver: RTCRtpTransceiver;

  constructor(type: string, eventInitDict: RTCTrackEventInit) {
    super(type, eventInitDict);

    this.receiver = eventInitDict.receiver;
    this.streams = eventInitDict.streams || [];
    this.track = eventInitDict.track;
    this.transceiver = eventInitDict.transceiver;
  }
}
