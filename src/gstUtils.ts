import { setImmediate as resolveImmediate } from 'timers/promises';

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

async function rejectImmediate(reason: any): Promise<any> {
  await resolveImmediate();
  throw reason;
}

// Node-gtk doesn't handle circular reference well, and GstPromise doesn't have
// a way to change the changeFunc, so we have to create a change function that
// doesn't capture the GstPromise itself in a closure to prevent circular reference.
function getGstPromiseChangeFuncForResolveReject(
  resolve: (s: Promise<Gst.Structure | null>) => void,
  reject: (reason: any) => void,
) {
  return function changeFunc (gstPromise: Gst.Promise) {
    switch (gstPromise.wait()) {
      case Gst.PromiseResult.EXPIRED:
        resolve(rejectImmediate(new Error('GstPromise is expired.')));
        break;
      case Gst.PromiseResult.INTERRUPTED:
        resolve(rejectImmediate(new Error('GstPromise is interrupted.')));
        break;
      case Gst.PromiseResult.REPLIED:
        let reply = gstPromise.getReply();
        if (reply && reply.hasField('error')) {
          let errorV = <GObject.Value>reply.getValue('error');
          let error = <GLib.Error>errorV.getBoxed();
          errorV.unset();

          resolve(rejectImmediate(new Error(error.message || undefined)));
        } else {
          resolve(resolveImmediate(reply));
        }
    }
  }
}

export function withGstPromise(f: (p: Gst.Promise) => void) {
  return new Promise<Gst.Structure | null>((resolve, reject) => {
    const gstPromise = Gst.Promise.newWithChangeFunc(
      getGstPromiseChangeFuncForResolveReject(resolve, reject));
    f(gstPromise);
  });
}
