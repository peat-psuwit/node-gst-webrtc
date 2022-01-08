import { Gst } from '../gstUtils';

import NgwBaseTrackInput from './BaseTrackInput';

let idCounter = 0;

class NgwTestAudioTrackInput extends NgwBaseTrackInput {
  readonly kind: 'audio';
  readonly label: string;

  constructor(wave: number = 0 /* sine */) {
    const name = `TestVideoAudioInput${idCounter++}`;
    const source = Gst.ElementFactory.make('audiotestsrc', `${name}_audiotestsrc`);
    if (!source)
      throw new Error("Can't make audiotestsrc. Broken Gst installation?");

    (<any>source).isLive = true;
    (<any>source).wave = wave;

    super(source, name);

    this.kind = 'audio';
    this.label = 'audiotestsrc Gstreamer element';
  }
}

export default NgwTestAudioTrackInput;
