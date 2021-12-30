import { Gst, globalPipeline } from '../gstUtils';

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

  protected _source: TSource;
  protected _teeMux: NgwTeeMultiplexer;

  protected _name: string;

  constructor(source: TSource, name: string) {
    globalPipeline.add(source);
    source.syncStateWithParent();
    

    this._source = source;
    this._name = name;
    this._teeMux = new NgwTeeMultiplexer(globalPipeline, source, `${name}_tee`);
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
}

export default NgwBaseTrackInput;
