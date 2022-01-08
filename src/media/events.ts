export class NgwMediaStreamTrackEvent extends Event implements MediaStreamTrackEvent {
  readonly track: MediaStreamTrack;

  constructor(type: string, eventInitDict: MediaStreamTrackEventInit) {
    super(type, eventInitDict);

    this.track = eventInitDict.track;
  }
}
