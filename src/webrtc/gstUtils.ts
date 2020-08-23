import * as gi from 'node-gtk';

// For convenience
export const Gst = gi.require('Gst', '1.0');
export const GstWebRTC = gi.require('GstWebRTC', '1.0');

export const globalPipeline = (() => {
  Gst.init(null);
  const pipeline = Gst.Pipeline.new('webrtc-global-pipeline');
  pipeline.setState(Gst.State.PLAYING);
  return pipeline;
})();

export function withGstPromise(f: (p: Gst.Promise) => void): Promise<Gst.Structure> {
  return new Promise<Gst.Structure>((resolve, reject) => {
    const gstPromise = Gst.Promise.newWithChangeFunc(() => {
      switch (gstPromise.wait()) {
        case Gst.PromiseResult.EXPIRED:
          reject(new Error('GstPromise is expired.'));
          break;
        case Gst.PromiseResult.INTERRUPTED:
          reject(new Error('GstPromise is interrupted.'));
          break;
        case Gst.PromiseResult.REPLIED:
          resolve(gstPromise.getReply());
      }
    });

    f(gstPromise);
  });
}
