import { GLib } from '../gstUtils';

import { NgwMediaStreamTrackEvent } from './events';
import NgwMediaStreamTrack from './MediaStreamTrack';

type TEvents = {
  "addtrack": MediaStreamTrackEvent;
  "removetrack": MediaStreamTrackEvent;
};

export default class NgwMediaStream
                extends EventTarget
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
    this.dispatchEvent(new NgwMediaStreamTrackEvent('addtrack', { track }));
  }

  removeTrack(track: NgwMediaStreamTrack) {
    if (this._tracks.delete(track.id))
      this.dispatchEvent(new NgwMediaStreamTrackEvent('removetrack', { track }));
  }

  clone(): NgwMediaStream {
    let clonedTracks = [];

    for (let [, track] of this._tracks) {
      clonedTracks.push(track.clone());
    }

    return new NgwMediaStream(clonedTracks);
  }

  // BEGIN generated event getters & setters; TEventTarget = MediaStream
  private _onaddtrack: ((this: MediaStream, ev: MediaStreamTrackEvent) => any) | null = null;
  get onaddtrack() {
    return this._onaddtrack;
  }
  set onaddtrack (value) {
    if (this._onaddtrack)
      this.removeEventListener('addtrack', <EventListener>this._onaddtrack);
    if (value)
      this.addEventListener('addtrack', <EventListener>value);
    this._onaddtrack = value;
  }

  private _onremovetrack: ((this: MediaStream, ev: MediaStreamTrackEvent) => any) | null = null;
  get onremovetrack() {
    return this._onremovetrack;
  }
  set onremovetrack (value) {
    if (this._onremovetrack)
      this.removeEventListener('removetrack', <EventListener>this._onremovetrack);
    if (value)
      this.addEventListener('removetrack', <EventListener>value);
    this._onremovetrack = value;
  }

  // END generated event getters & setters
}
