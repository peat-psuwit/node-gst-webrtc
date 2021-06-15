import os from 'os';

import * as gi from 'node-gtk';

const GLib = gi.require('GLib', '2.0');
const Gst = gi.require('Gst', '1.0');

gi.startLoop();
Gst.init(null);

const loop = GLib.MainLoop.new(null, false)

const pipeline = Gst.parseLaunch('videotestsrc ! videoconvert ! autovideosink');
if (!pipeline) {
  console.log('Cannot create pipeline');
  process.exit(1);
}

pipeline.setState(Gst.State.PLAYING);

const [stateChange] = pipeline.getState(/* timeout */ Gst.SECOND * 3);

function quit(ret: number) {
  console.log('Quitting...');
  pipeline?.setState(Gst.State.NULL);
  pipeline?.getState(Gst.SECOND);
  process.exit(ret);
}

if (stateChange != Gst.StateChangeReturn.SUCCESS) {
  console.log(`State change is ${Gst.Element.stateChangeReturnGetName(stateChange)}`);
  quit(1);
}

GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGINT, () => { quit(0); return false; });
GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGTERM, () => { quit(0); return false; });
GLib.unixSignalAdd(GLib.PRIORITY_DEFAULT, os.constants.signals.SIGHUP, () => { quit(0); return false; });

loop.run();
