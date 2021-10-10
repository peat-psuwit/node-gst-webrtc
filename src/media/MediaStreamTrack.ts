import {
    EventTarget as EventTargetShim,
    getEventAttributeValue,
    setEventAttributeValue
} from 'event-target-shim';

import {
  GLib,
  Gst,
  globalPipeline,
} from '../gstUtils';

type TEvents = {
    "ended": Event;
    "mute": Event;
    "unmute": Event;
};

const CLONE_COOKIE = Symbol('NgwMediaStreamTrack_CloneCookie');

export default class NgwMediaStreamTrack
                extends EventTargetShim<TEvents, /* mode */ 'strict'>
                implements MediaStreamTrack
{
  private _enabled: boolean;
  // For the benefit of MediaStream.
  _ended: boolean;
  private _contentHint = '';

  private _input: NgwMediaStreamTrackInput;

  private _queue: Gst.Element;
  private _tee: Gst.Element;

  private _outputsAndPads: Map<NgwMediaStreamTrackOutput, Gst.Pad> = new Map();

  readonly id = GLib.uuidStringRandom();
  private _name = `MediaStreamTrack_${this.id.substr(0, 8)}`;

  constructor(input: NgwMediaStreamTrackInput);
  constructor(otherTrack: NgwMediaStreamTrack, cookie: typeof CLONE_COOKIE);

  constructor(inputOrTrack: NgwMediaStreamTrackInput | NgwMediaStreamTrack, cookie?: typeof CLONE_COOKIE) {
    super();

    if (inputOrTrack instanceof NgwMediaStreamTrack) {
      if (cookie !== CLONE_COOKIE) {
        throw new Error("Using clone constructor from outside the class.");
      }

      this._enabled = inputOrTrack._enabled;
      this._ended = inputOrTrack._ended;

      this._input = inputOrTrack._input;
    } else {
      this._enabled = true;
      this._ended = false

      this._input = inputOrTrack;
    }

    const queue = Gst.ElementFactory.make('queue', `${this._name}_queue`);
    const tee = Gst.ElementFactory.make('tee', `${this._name}_tee`);

    if (!queue || !tee)
      throw new Error("Can't make necessary elements. Broken Gst installation?");

    // This simplify things.
    (<any>tee).allowNotLinked = true;

    globalPipeline.add(queue);
    globalPipeline.add(tee);

    queue.link(tee);

    queue.syncStateWithParent();
    tee.syncStateWithParent();

    this._queue = queue;
    this._tee = tee;

    this._input.connect(this);
  }

  get kind() {
    return this._input.kind;
  }

  get label() {
    return this._input.label;
  }

  get contentHint() {
    return this._contentHint;
  }

  set contentHint(contentHint: string) {
    // TODO: maybe do the validation on the value.
    this._contentHint = contentHint;
    // TODO: maybe do some applicable adjustment.
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(enabled: boolean) {
    this._enabled = enabled;
    // TODO: disconnect/reconnect the media from input.
  }

  get muted() {
    return this._input.muted;
  }

  get readyState() {
    if (this._ended)
      return 'ended';
    else
      return 'live';
  }

  clone(): NgwMediaStreamTrack {
    return new NgwMediaStreamTrack(this, CLONE_COOKIE);
  }

  stop(): void {
    if (this._ended)
      return;

    // TODO: disconnect the media from input.

    this._ended = true;
    // Note: 'ended' event not fired in this case.
  }

  // Constrants system is not implemented at the moment.

  getCapabilities(): MediaTrackCapabilities {
    return {};
  }

  getConstraints(): MediaTrackConstraints {
    return {};
  }

  getSettings(): MediaTrackSettings {
    // TODO: Perhaps this one we should query from input.
    return {};
  }

  async applyConstraints(constraints?: MediaTrackConstraints): Promise<void> {
    throw new OverconstrainedError("", "Constrants system is not implemented.");
  }

  // BEGIN generated event getters & setters; TEventTarget = MediaStreamTrack
  get onended(): EventTargetShim.CallbackFunction<MediaStreamTrack, Event> | null {
    return getEventAttributeValue<MediaStreamTrack, Event>(this, 'ended');
  }
  set onended(value) {
    setEventAttributeValue(this, 'ended', value);
  }

  get onmute(): EventTargetShim.CallbackFunction<MediaStreamTrack, Event> | null {
    return getEventAttributeValue<MediaStreamTrack, Event>(this, 'mute');
  }
  set onmute(value) {
    setEventAttributeValue(this, 'mute', value);
  }

  get onunmute(): EventTargetShim.CallbackFunction<MediaStreamTrack, Event> | null {
    return getEventAttributeValue<MediaStreamTrack, Event>(this, 'unmute');
  }
  set onunmute(value) {
    setEventAttributeValue(this, 'unmute', value);
  }

  // END generated event getters & setters

  // Following is interface for inputs.
  getSinkPad(): Gst.Pad {
    // We're sure this pad exists within 'queue'.
    return <Gst.Pad>this._queue.getStaticPad('sink');
  }

  // Following is interface for outputs.
  connect(output: NgwMediaStreamTrackOutput) {
    const srcPad = this._tee.getRequestPad('src_%u');
    if (!srcPad)
      throw new Error('Request new pad failed. What the hell?');

    const sinkPad = output.getSinkPad();

    srcPad.link(sinkPad);

    this._outputsAndPads.set(output, srcPad);
  }

  disconnect(output: NgwMediaStreamTrackOutput) {
    let srcPad = this._outputsAndPads.get(output);
    if (!srcPad) {
      // TODO: is this necessary?
      console.warn('NgwBaseTrackInput: disconnect a non-connecting output?');
      return;
    }

    // Block the pad, to avoid unneccessary error.
    // TODO: is this needed, given we already set allowNotLinked?
    srcPad.addProbe(
      Gst.PadProbeType.DATA_DOWNSTREAM,
      () => { return Gst.PadProbeReturn.DROP; });

    const sinkPad = output.getSinkPad();
    srcPad.unlink(sinkPad);

    this._tee.releaseRequestPad(srcPad);
    this._outputsAndPads.delete(output);
  }
}

export interface NgwMediaStreamTrackInput {
  readonly kind: 'audio' | 'video';
  readonly label: string;
  readonly muted: boolean;

  connect(track: NgwMediaStreamTrack): void;
  disconnect(track: NgwMediaStreamTrack): void;
}

export interface NgwMediaStreamTrackOutput {
  getSinkPad(): Gst.Pad;
}

class OverconstrainedError extends Error {
  readonly constraint: string;
  constructor(constraint: string, message?: string) {
    super(message);

    this.constraint = constraint;
  }
}
