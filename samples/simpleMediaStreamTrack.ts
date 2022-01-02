import os from 'os';

import * as gi from 'node-gtk';

const GLib = gi.require('GLib', '2.0');
const Gst = gi.require('Gst', '1.0');

// TODO: expose public interfaces. Well, not all of them.

import MediaStreamTrack from '../src/media/MediaStreamTrack';
import TestVideoTrackInput from '../src/media/TestVideoTrackInput';
import StandaloneVideoTrackOutput from '../src/media/StandaloneVideoTrackOutput';

gi.startLoop();
Gst.init(null);

const loop = GLib.MainLoop.new(null, false);

let trackInput = new TestVideoTrackInput(0 /* pattern = ball */);
let track = new MediaStreamTrack(trackInput);

let trackInput2 = new TestVideoTrackInput(18 /* pattern = smpte */);
let track2 = new MediaStreamTrack(trackInput2);

let trackOutput = new StandaloneVideoTrackOutput();
trackOutput.track = track;

// For debugging

// @ts-ignore
globalThis.trackInput = trackInput;
// @ts-ignore
globalThis.track = track;
// @ts-ignore
globalThis.trackOutput = trackOutput;
// @ts-ignore
globalThis.trackInput2 = trackInput2;
// @ts-ignore
globalThis.track2 = track2;

function quit(ret: number) {
  console.log('Quitting...');

  process.exit(ret);
}

GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGINT, () => { quit(0); return false; });
GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGTERM, () => { quit(0); return false; });
GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGHUP, () => { quit(0); return false; });

// This allows debugger to break from time to time.
setTimeout(() => {}, 1000);

function next() {
  trackOutput.track =
    trackOutput.track == track ? track2
    : trackOutput.track == track2 ? null
    : track;
  console.log('Next!');
}

//@ts-ignore
globalThis.next = next;

setInterval(next, 2000);

loop.run();
