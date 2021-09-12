import { Gst } from '../gstUtils';

import NgwBaseTrackInput from './BaseTrackInput';

class NgwTestVideoTrackInput extends NgwBaseTrackInput {
  readonly kind: 'video';
  readonly label: string;

  constructor() {
    const source = Gst.ElementFactory.make('videotestsrc');
    if (!source)
      throw new Error("Can't make videotestsrc. Broken Gst installation?");

    super(source);

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
