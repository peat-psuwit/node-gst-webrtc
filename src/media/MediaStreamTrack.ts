import {
    EventTarget as EventTargetShim,
    getEventAttributeValue,
    setEventAttributeValue
} from 'event-target-shim';

import { GLib } from '../gstUtils';

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

  private _input: NgwMediaStreamTrackInput;

  readonly id = GLib.uuidStringRandom();

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
  }

  get kind() {
    return this._input.kind;
  }

  get label() {
    return this._input.label;
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
}

export interface NgwMediaStreamTrackInput {
  readonly kind: string;
  readonly label: string;
  readonly muted: boolean;
}

class OverconstrainedError extends Error {
  readonly constraint: string;
  constructor(constraint: string, message?: string) {
    super(message);

    this.constraint = constraint;
  }
}
