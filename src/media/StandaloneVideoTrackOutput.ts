import { Gst, globalPipeline } from '../gstUtils';

import NgwMediaStreamTrack, {
  NgwMediaStreamTrackOutput,
} from './MediaStreamTrack';

let idCounter = 0;

/* Display 'video' MediaStreamTrack using autovideosink. */

class StandaloneVideoTrackOutput implements NgwMediaStreamTrackOutput {
  private _track: NgwMediaStreamTrack | null = null;
  private _bin: Gst.Bin;
  private _sinkPad: Gst.Pad;

  private _name = `StandaloneVideoTrackOutput${idCounter++}`;

  constructor() {
    const bin = Gst.parseBinFromDescription(
      'queue ! videoscale ! videoconvert ! autovideosink',
      /* ghostUnlinkedPads */ false);
    if (!bin) {
      throw new Error("Can't create the bin. Broken Gst installation?");
    }

    this._bin = <Gst.Bin>bin;
    this._bin.name = `${this._name}_sinkBin`;

    const queueSinkPad = this._bin.findUnlinkedPad(Gst.PadDirection.SINK);
    if (!queueSinkPad)
      throw new Error("Where is my queue's pad?");
    this._sinkPad = Gst.GhostPad.new('sink', queueSinkPad);
    this._bin.addPad(this._sinkPad);
  }

  get track() {
    return this._track;
  }

  set track(track: NgwMediaStreamTrack | null) {
    if (track === this._track)
      return;

    if (track && track.kind !== 'video')
      throw new Error(`MediaStreamTrack of kind '${track.kind}' not supported.`);

    let wasConnected = false;

    if (this._track) {
      wasConnected = true;
      this._track.disconnect(this);
    }

    if (!track && wasConnected) {
      this._sinkPad.sendEvent(Gst.Event.newEos());
      // TODO: maybe probe for event reaching the sink?
      this._bin.setState(Gst.State.NULL); // or READY?
      globalPipeline.remove(this._bin);
    }

    if (track) {
      if (!wasConnected)
        globalPipeline.add(this._bin);

      track.connect(this);

      if (!wasConnected)
        this._bin.syncStateWithParent();
    }
  }

  getSinkPad() {
    return this._sinkPad;
  }
}

export default StandaloneVideoTrackOutput;
