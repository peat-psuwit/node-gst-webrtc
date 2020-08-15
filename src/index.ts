import * as gi from 'node-gtk';

const Gst = gi.require('Gst', '1.0');
const Gtk = gi.require('Gtk', '3.0');

gi.startLoop();
Gst.init(null);

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

process.on('SIGINT', () => { quit(0) });
process.on('SIGTERM', () => { quit(0) });

setTimeout(() => { /* nothing -- why is this needed? */ }, 0 /* ms */);

Gtk.main();
