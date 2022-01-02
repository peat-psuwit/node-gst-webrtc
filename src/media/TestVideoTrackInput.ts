import { Gst } from '../gstUtils';

import NgwBaseTrackInput from './BaseTrackInput';

let idCounter = 0;

class NgwTestVideoTrackInput extends NgwBaseTrackInput {
  readonly kind: 'video';
  readonly label: string;

  constructor(pattern: number = 0 /* smpte */) {
    const name = `TestVideoTrackInput${idCounter++}`;
    const source = Gst.ElementFactory.make('videotestsrc', `${name}_videotestsrc`);
    if (!source)
      throw new Error("Can't make videotestsrc. Broken Gst installation?");

    (<any>source).isLive = true;
    (<any>source).pattern = pattern;

    super(source, name);

    this.kind = 'video';
    this.label = 'videotestsrc Gstreamer element';
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this._source.setState(
      muted ? Gst.State.PAUSED : Gst.State.PLAYING
    );
  }
}

export default NgwTestVideoTrackInput;
