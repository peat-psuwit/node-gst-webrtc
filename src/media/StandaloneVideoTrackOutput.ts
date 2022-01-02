import { Gst, GST_CLOCK_TIME_NONE } from '../gstUtils';

import NgwMediaStreamTrack, {
  NgwMediaStreamTrackOutput,
} from './MediaStreamTrack';

let idCounter = 0;

/* Display 'video' MediaStreamTrack using autovideosink. */

class StandaloneVideoTrackOutput implements NgwMediaStreamTrackOutput {
  private _track: NgwMediaStreamTrack | null = null;
  private _bin: Gst.Bin;
  private _proxySrc: Gst.Element;

  private _name = `StandaloneVideoTrackOutput${idCounter++}`;

  constructor() {
    // TODO: support parent pipeline
    const bin = Gst.parseLaunch(
      'proxysrc name=src ! videoscale ! videoconvert ! autovideosink');
    if (!bin) {
      throw new Error("Can't create the bin. Broken Gst installation?");
    }

    this._bin = <Gst.Bin>bin;
    this._bin.name = `${this._name}_sinkBin`;
    (<Gst.Pipeline>this._bin).useClock(Gst.SystemClock.obtain());

    this._proxySrc = <Gst.Element>this._bin.getByName('src');
  }

  get track() {
    return this._track;
  }

  set track(track: NgwMediaStreamTrack | null) {
    if (track === this._track)
      return;

    if (track && track.kind !== 'video')
      throw new Error(`MediaStreamTrack of kind '${track.kind}' not supported.`);

    if (this._track) {
      // TODO: maybe the pipeline has to be stopped first?
      this._track.removeOutput((<any>this._proxySrc).proxysink);

      if (!track) {
        this._bin.setState(Gst.State.NULL); // or READY?
      }
    }

    if (track) {
      (<any>this._proxySrc).proxysink = track.addOutput();

      if (!this._track) {
        /*
         * Make sure that everything runs on the same base time.
         * Theoretically, we can distribute our base time to our clients.
         * In practice, we'll hit the MxN problem which, while there's
         * probably a solution, I'm not bothered to find. Just set them
         * all to 0;
         */
        this._bin.setStartTime(<any>GST_CLOCK_TIME_NONE);
        this._bin.setBaseTime(0);

        this._bin.setState(Gst.State.PLAYING);
      }
    }

    this._track = track;
  }
}

export default StandaloneVideoTrackOutput;
