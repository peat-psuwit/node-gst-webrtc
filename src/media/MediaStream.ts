import {
    EventTarget as EventTargetShim,
    getEventAttributeValue,
    setEventAttributeValue
} from 'event-target-shim';

import { GLib } from '../gstUtils';

import NgwMediaStreamTrack from './MediaStreamTrack';

type TEvents = {
  "addtrack": MediaStreamTrackEvent;
  "removetrack": MediaStreamTrackEvent;
};

export default class NgwMediaStream
                extends EventTargetShim<TEvents, /* mode */ 'strict'>
                implements MediaStream
{
  readonly id: string;

  private _tracks: Map<string, NgwMediaStreamTrack>;

  constructor(streamOrTracks?: NgwMediaStream | NgwMediaStreamTrack[], id?: string) {
    super();

    this.id = id || GLib.uuidStringRandom();

    if (!streamOrTracks) {
      this._tracks = new Map();
    } else if (Array.isArray(streamOrTracks)) {
      this._tracks = new Map();
      for (const track of streamOrTracks) {
        this._tracks.set(track.id, track);
      }
    } else {
      this._tracks = new Map(streamOrTracks._tracks);
    }
  }

  get active() {
    for (const [, track] of this._tracks) {
      if (!track._ended)
        return true;
    }

    return false;
  }

  getAudioTracks(): NgwMediaStreamTrack[] {
    let ret = [];

    for (const [, track] of this._tracks) {
      if (track.kind == 'audio')
        ret.push(track);
    }

    return ret;
  }

  getVideoTracks(): NgwMediaStreamTrack[] {
    let ret = [];

    for (const [, track] of this._tracks) {
      if (track.kind == 'video')
        ret.push(track);
    }

    return ret;
  }

  getTracks(): NgwMediaStreamTrack[] {
    return Array.from(this._tracks.values());
  }

  getTrackById(id: string): NgwMediaStreamTrack | null{
    return this._tracks.get(id) || null;
  }

  addTrack(track: NgwMediaStreamTrack) {
    if (this._tracks.has(track.id))
      return;

    this._tracks.set(track.id, track);
    this.dispatchEvent({
      type: 'addtrack',
      track,
    });
  }

  removeTrack(track: NgwMediaStreamTrack) {
    if (this._tracks.delete(track.id))
      this.dispatchEvent({
        type: 'removetrack',
        track,
      });
  }

  clone(): NgwMediaStream {
    let clonedTracks = [];

    for (let [, track] of this._tracks) {
      clonedTracks.push(track.clone());
    }

    return new NgwMediaStream(clonedTracks);
  }

  // BEGIN generated event getters & setters; TEventTarget = MediaStream
  get onaddtrack(): EventTargetShim.CallbackFunction<MediaStream, MediaStreamTrackEvent> | null {
    return getEventAttributeValue<MediaStream, MediaStreamTrackEvent>(this, 'addtrack');
  }
  set onaddtrack(value) {
    setEventAttributeValue(this, 'addtrack', value);
  }

  get onremovetrack(): EventTargetShim.CallbackFunction<MediaStream, MediaStreamTrackEvent> | null {
    return getEventAttributeValue<MediaStream, MediaStreamTrackEvent>(this, 'removetrack');
  }
  set onremovetrack(value) {
    setEventAttributeValue(this, 'removetrack', value);
  }

  // END generated event getters & setters
}
