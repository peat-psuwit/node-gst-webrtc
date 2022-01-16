import { Gst, GST_CLOCK_TIME_NONE } from '../gstUtils';

import NgwTeeMultiplexer from './TeeMultiplexer';
import NgwMediaStreamTrack, {
  NgwMediaStreamTrackInput,
} from './MediaStreamTrack';

/*
 * Because essentially everyone need to be able to connect to multiple
 * MediaStreamTrack to support clonning, this class is written as a
 * helper of sort.
 */

abstract class NgwBaseTrackInput<TSource extends Gst.Element = Gst.Element>
          implements NgwMediaStreamTrackInput
{
  abstract readonly kind: 'audio' | 'video';
  abstract readonly label: string;
  
  private _muted = false;

  private _tracks: Set<NgwMediaStreamTrack> = new Set();

  protected _pipeline: Gst.Pipeline;

  protected _source: TSource;
  protected _teeMux: NgwTeeMultiplexer;

  protected _name: string;

  private _usageCount = 0;

  constructor(source: TSource, name: string) {
    // Expect simple source.
    let srcPad = source.getStaticPad('src');
    if (!srcPad)
      throw new Error('Simple track input requires element with src pad.');

    const pipeline = new Gst.Pipeline();
    pipeline.name = name;

    pipeline.add(source);
    this._teeMux = new NgwTeeMultiplexer(pipeline, srcPad, `${name}_tee`);

    // Make sure to have the same clock.
    pipeline.useClock(Gst.SystemClock.obtain());
    // Keep the pipeline ready, until something connects to it.
    pipeline.setState(Gst.State.READY);

    this._pipeline = pipeline;
    this._source = source;
    this._name = name;
  }

  get muted() {
    return this._muted;
  }

  protected set muted(muted: boolean) {
    this._muted = muted;

    for (let track of this._tracks) {
      // TODO: notify input muted / not muted.
      // Tracks are expected to handle it by itself.
    }
  }

  connect(track: NgwMediaStreamTrack) {
    const sinkPad = track.getSinkPad();

    this._teeMux.addPeer(sinkPad);
  }

  disconnect(track: NgwMediaStreamTrack) {
    if (!this._tracks.has(track)) {
      console.warn('NgwBaseTrackInput: disconnect a non-connecting track?');
      return;
    }

    this._teeMux.removePeer(track.getSinkPad());
  }

  getPipeline() {
    return this._pipeline;
  }

  // Called when one of the tracks has a client
  start() {
    this._usageCount++;

    if (this._usageCount != 1) {
      // We're already running.
      return;
    }

    /*
     * Make sure that everything runs on the same base time.
     * Theoretically, we can distribute our base time to our clients.
     * In practice, we'll hit the MxN problem which, while there's
     * probably a solution, I'm not bothered to find. Just set them
     * all to 0;
     */
    this._pipeline.setStartTime(<any>GST_CLOCK_TIME_NONE);
    this._pipeline.setBaseTime(0);

    this._pipeline.setState(Gst.State.PLAYING);
  }

  stop() {
    this._usageCount--;

    if (this._usageCount != 0) {
      // Nothing to do. Someone else still uses it.
      return;
    }

    // Nothing uses this pipeline now. Set it to READY so that we use less
    // resource, but are still ready for the new clients.
    this._pipeline.setState(Gst.State.READY);
  }
}

export default NgwBaseTrackInput;
