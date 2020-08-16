import * as gi from 'node-gtk';

// For convenience
export const Gst = gi.require('Gst', '1.0');

export const globalPipeline = (() => {
  Gst.init(null);
  const pipeline = Gst.Pipeline.new('webrtc-global-pipeline');
  pipeline.setState(Gst.State.PLAYING);
  return pipeline;
})();
