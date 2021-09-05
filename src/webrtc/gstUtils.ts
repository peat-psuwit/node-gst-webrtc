import * as gi from 'node-gtk';

// For convenience
export const GLib = gi.require('GLib', '2.0');
export const GObject = gi.require('GObject', '2.0');
export const Gst = gi.require('Gst', '1.0');
export const GstWebRTC = gi.require('GstWebRTC', '1.0');
export const GstSDP = gi.require('GstSdp', '1.0');

export const globalPipeline = (() => {
  Gst.init(null);
  const pipeline = Gst.Pipeline.new('webrtc-global-pipeline');
  pipeline.setState(Gst.State.PLAYING);
  return pipeline;
})();

// Node-gtk doesn't handle circular reference well, and GstPromise doesn't have
// a way to change the changeFunc, so we have to create a change function that
// doesn't capture the GstPromise itself in a closure to prevent circular reference.
function getGstPromiseChangeFuncForResolveReject(
  resolve: (s: Gst.Structure) => void,
  reject: (reason: any) => void,
) {
  return function changeFunc (gstPromise: Gst.Promise) {
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
  }
}

export function withGstPromise(f: (p: Gst.Promise) => void): Promise<Gst.Structure> {
  return new Promise<Gst.Structure>((resolve, reject) => {
    const gstPromise = Gst.Promise.newWithChangeFunc(
      getGstPromiseChangeFuncForResolveReject(resolve, reject));
    f(gstPromise);
  });
}
