import { Gst } from '../gstUtils';

import NgwTeeMultiplexer from './TeeMultiplexer';

export default class NgwProxyMultiplexer {
  private _bin: Gst.Bin;
  private _teeMux: NgwTeeMultiplexer;
  private _namePrefix: string;

  private _proxySinkCounter = 0;
  private _proxySinks = new Set<Gst.Element>();

  constructor(bin: Gst.Bin, src: Gst.Element, namePrefix: string) {
    this._bin = bin;
    this._teeMux = new NgwTeeMultiplexer(bin, src, `${namePrefix}_tee`);
    this._namePrefix = namePrefix;
  }

  addOutput() {
    const proxySink = Gst.ElementFactory.make(
        'proxysink', `${this._namePrefix}_proxySink${this._proxySinkCounter}`);

    if (!proxySink) {
      throw new Error("Can't create GstProxySink?");
    }

    this._proxySinkCounter++;

    this._bin.add(proxySink);
    proxySink.syncStateWithParent();

    const sinkPad = <Gst.Pad>proxySink.getStaticPad('sink');
    this._teeMux.addPeer(sinkPad);

    this._proxySinks.add(proxySink);

    return proxySink;
  }

  removeOutput(proxySink: Gst.Element) {
    if (!this._proxySinks.has(proxySink)) {
      throw new Error("Trying to disconnect non-existent output?");
    }

    this._proxySinks.delete(proxySink);

    const sinkPad = <Gst.Pad>proxySink.getStaticPad('sink');
    this._teeMux.removePeer(sinkPad);

    proxySink.setState(Gst.State.NULL);
    this._bin.remove(proxySink);
  }

  outputCount() {
    return this._proxySinks.size;
  }
}
