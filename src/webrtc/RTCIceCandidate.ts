class NgwRTCIceCandidate implements RTCIceCandidate {
  readonly candidate: string;
  readonly sdpMLineIndex: number | null;
  readonly sdpMid: string | null;
  readonly usernameFragment: string | null;

  constructor(init: RTCIceCandidateInit) {
    this.candidate = init.candidate ?? '';
    this.sdpMLineIndex = init.sdpMLineIndex ?? null;
    this.sdpMid = init.sdpMid ?? null;
    this.usernameFragment = init.usernameFragment ?? null;
  }

  toJSON() {
    return {
      candidate: this.candidate,
      sdpMLineIndex: this.sdpMLineIndex,
      sdpMid: this.sdpMid,
      usernameFragment: this.usernameFragment,
    };
  }

  // Stub; probably be able to provide by parsing those 4 properties.
  get address(): string | null { return null; }
  get component(): RTCIceComponent | null { return null; };
  get foundation(): string | null { return null; };
  get port(): number | null { return null; };
  get priority(): number | null { return null; }
  get protocol(): RTCIceProtocol | null { return null; }
  get relatedAddress(): string | null { return null; }
  get relatedPort(): number | null { return null; }
  get tcpType(): RTCIceTcpCandidateType | null { return null; }
  get type(): RTCIceCandidateType | null { return null; }
}

export default NgwRTCIceCandidate;
