import { Gst, globalPipeline } from '../gstUtils';

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

  private _tracksAndPads: Map<NgwMediaStreamTrack, Gst.Pad> = new Map();

  protected _source: TSource;
  protected _tee: Gst.Element;

  protected _name: string;

  constructor(source: TSource, name: string) {
    const tee = Gst.ElementFactory.make('tee', `${name}_tee`);
    if (!tee)
      throw new Error("Can't create tee element. Broken Gst installation?");

    globalPipeline.add(source);
    globalPipeline.add(tee);

    // This simplify things.
    (<any>tee).allowNotLinked = true;

    source.link(tee);

    source.syncStateWithParent();
    tee.syncStateWithParent();

    this._source = source;
    this._tee = tee;
    this._name = name;
  }

  get muted() {
    return this._muted;
  }

  protected set muted(muted: boolean) {
    this._muted = muted;

    for (let [track, ] of this._tracksAndPads) {
      // TODO: notify input muted / not muted.
      // Tracks are expected to handle it by itself.
    }
  }

  connect(track: NgwMediaStreamTrack) {
    const srcPad = this._tee.getRequestPad('src_%u');
    if (!srcPad)
      throw new Error('Request new pad failed. What the hell?');

    const sinkPad = track.getSinkPad();

    srcPad.link(sinkPad);

    this._tracksAndPads.set(track, srcPad);
  }

  disconnect(track: NgwMediaStreamTrack) {
    let srcPad = this._tracksAndPads.get(track);
    if (!srcPad) {
      // TODO: is this necessary?
      console.warn('NgwBaseTrackInput: disconnect a non-connecting track?');
      return;
    }

    // Block the pad, to avoid unneccessary error.
    // TODO: is this needed, given we already set allowNotLinked?
    srcPad.addProbe(
      Gst.PadProbeType.DATA_DOWNSTREAM,
      () => { return Gst.PadProbeReturn.DROP; });

    const sinkPad = track.getSinkPad();
    srcPad.unlink(sinkPad);

    this._tee.releaseRequestPad(srcPad);
    this._tracksAndPads.delete(track);
  }
}

export default NgwBaseTrackInput;
