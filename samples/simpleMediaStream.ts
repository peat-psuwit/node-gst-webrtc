import os from 'os';

import * as gi from 'node-gtk';

const GLib = gi.require('GLib', '2.0');
const Gst = gi.require('Gst', '1.0');

// TODO: expose public interfaces. Well, not all of them.

import MediaStream from '../src/media/MediaStream';
import MediaStreamTrack from '../src/media/MediaStreamTrack';
import TestVideoTrackInput from '../src/media/TestVideoTrackInput';
import TestAudioTrackInput from '../src/media/TestAudioTrackInput';
import StandaloneStreamOutput from '../src/media/StandaloneStreamOutput';

gi.startLoop();
Gst.init(null);

const loop = GLib.MainLoop.new(null, false);

let trackInput = new TestVideoTrackInput(0 /* pattern = ball */);
let track = new MediaStreamTrack(trackInput);

let trackInputA = new TestAudioTrackInput(5 /* wave = white-noise */);
let trackA = new MediaStreamTrack(trackInputA);

let stream = new MediaStream([track, trackA]);
let output = new StandaloneStreamOutput();
output.srcObject = stream;

function quit(ret: number) {
  console.log('Quitting...');

  process.exit(ret);
}

GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGINT, () => { quit(0); return false; });
GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGTERM, () => { quit(0); return false; });
GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGHUP, () => { quit(0); return false; });

// This allows debugger to break from time to time.
setTimeout(() => {}, 1000);

loop.run();
