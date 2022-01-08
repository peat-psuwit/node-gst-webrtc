import NgwMediaStreamTrack from './MediaStreamTrack';
import NgwStandaloneTrackOutput from './StandaloneTrackOutput';

let idCounter = 0;

class StandaloneStreamOutput {
  readonly name = `StandaloneStreamOutput${idCounter++}`;

  private _stream: MediaStream | null = null;
  private _outputs = new Map<NgwMediaStreamTrack, NgwStandaloneTrackOutput>();

  private _addTrack(track: MediaStreamTrack) {
    if (!(track instanceof NgwMediaStreamTrack)) {
      console.warn(`Cannot play non-Ngw track ${track.id}`);
      return;
    }

    if (track.kind != 'video' && track.kind != 'audio') {
      console.warn(`Cannot play track ${track.id} of kind ${track.kind}`);
      return;
    }

    if (this._outputs.has(track)) {
      console.warn(`Track ${track.id} already exists?`);
      return;
    }

    let output = new NgwStandaloneTrackOutput(track.kind);
    output.track = track;
    this._outputs.set(track, output);
  }

  private _handleAddTrack = (ev: MediaStreamTrackEvent) => {
    this._addTrack(ev.track);
  }

  private _removeTrack(track: MediaStreamTrack) {
    if (!(track instanceof NgwMediaStreamTrack)) {
      console.warn(`Cannot play non-Ngw track ${track.id}`);
      return;
    }

    let output = this._outputs.get(track);
    if (!output) {
      console.warn(`Trying to remove non-existance track ${track.id}?`);
      return;
    }

    output.track = null;
    this._outputs.delete(track);
  }

  private _handleRemoveTrack(ev: MediaStreamTrackEvent) {
    this._removeTrack(ev.track);
  }

  get srcObject(): MediaStream | null {
    return this._stream;
  }

  set srcObject(src: MediaStream | null) {
    // TODO: maybe a more elaborate way to test for duplicates.
    if (this._stream) {
      for (const [, output] of this._outputs) {
        output.track = null;
      }
      this._outputs.clear();

      this._stream.removeEventListener('addtrack', this._handleAddTrack);
      this._stream.removeEventListener('removetrack', this._handleRemoveTrack);
    }

    if (src) {
      for (let track of src.getTracks()) {
        this._addTrack(track);
      }

      src.addEventListener('addtrack', this._handleAddTrack);
      src.addEventListener('removetrack', this._handleRemoveTrack);
    }

    this._stream = src;
  }
}

export default StandaloneStreamOutput;
