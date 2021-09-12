import os from 'os';

import * as gi from 'node-gtk';

const GLib = gi.require('GLib', '2.0');
const Gst = gi.require('Gst', '1.0');

// TODO: expose public interfaces. Well, not all of them.
import { globalPipeline } from '../src/gstUtils';

import MediaStreamTrack from '../src/media/MediaStreamTrack';
import TestVideoTrackInput from '../src/media/TestVideoTrackInput';
import StandaloneVideoTrackOutput from '../src/media/StandaloneVideoTrackOutput';

gi.startLoop();
Gst.init(null);

const loop = GLib.MainLoop.new(null, false);

let trackInput = new TestVideoTrackInput();
let track = new MediaStreamTrack(trackInput);

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
globalThis.globalPipeline = globalPipeline;

function quit(ret: number) {
  console.log('Quitting...');

  Gst.debugBinToDotFile(globalPipeline, Gst.DebugGraphDetails.ALL, 'simpleTrack_quit');

  globalPipeline.setState(Gst.State.NULL);
  globalPipeline.getState(Gst.SECOND);
  process.exit(ret);
}

GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGINT, () => { quit(0); return false; });
GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGTERM, () => { quit(0); return false; });
GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGHUP, () => { quit(0); return false; });

// This allows debugger to break from time to time.
setTimeout(() => {}, 1000);

loop.run();
