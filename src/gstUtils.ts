import NgwNative from './@types/node-ngwnative-0.0';

// For convenience
import GLib from './@types/node-glib-2.0';
import GObject from './@types/node-gobject-2.0';
import Gst from './@types/node-gst-1.0';
import GstWebRTC from './@types/node-gstwebrtc-1.0';
import GstSDP from './@types/node-gstsdp-1.0';

export { GLib, GObject, Gst, GstWebRTC, GstSDP, };

// Coutersy initialization
Gst.init(null);

// We need this because node-gtk exposes guint64 as a double, but it can't handle
// UINT64_MAX.
export const GST_CLOCK_TIME_NONE = BigInt.asUintN(/* width */ 64, -1n);

export function withGstPromise(f: (p: Gst.Promise) => void) {
  return new Promise<Gst.Structure | null>((resolve, reject) => {
    let gstPromiseWrapper = new NgwNative.Promise();

    gstPromiseWrapper.once("on-changed", () => {
      // Pull gstPromiseWrapper itself into the closure.
      let gstPromise = gstPromiseWrapper.getGstPromise();

      switch (gstPromise.wait()) {
        case Gst.PromiseResult.EXPIRED:
          reject(new Error('GstPromise is expired.'));
          break;
        case Gst.PromiseResult.INTERRUPTED:
          reject(new Error('GstPromise is interrupted.'));
          break;
        case Gst.PromiseResult.REPLIED:
          let reply = gstPromise.getReply();
          if (reply && reply.hasField('error')) {
            let errorV = <GObject.Value>reply.getValue('error');
            let error = <GLib.Error>errorV.getBoxed();
            errorV.unset();
  
            reject(new Error(error.message || undefined));
          } else {
            resolve(reply);
          }
      }
    });

    f(gstPromiseWrapper.getGstPromise());
  });
}
