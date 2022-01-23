import { Gst } from '../gstUtils';

// Pad probe, to be used below. Written here to prevent closure problem.
function padProbe_alwaysDrop() {
  return Gst.PadProbeReturn.DROP;
}

export default class NgwTeeMultiplexer {
  private _tee: Gst.Element;

  constructor(bin: Gst.Bin, srcPad: Gst.Pad, teeName: string) {
    const tee = Gst.ElementFactory.make('tee', teeName);
    if (!tee)
      throw new Error("Can't create tee element. Broken Gst installation?");

    // This simplify things.
    (<any>tee).allowNotLinked = true;

    bin.add(tee);
    tee.syncStateWithParent();

    let sinkPad = tee.getStaticPad('sink')!;
    srcPad.link(sinkPad);

    this._tee = tee;
  }

  changeSrcPad(newPad: Gst.Pad) {
    let sinkPad = this._tee.getStaticPad('sink')!;
    let oldPad = sinkPad.getPeer()!;

    // It's expected that the old pad's element will be stopped soon.
    oldPad.addProbe(Gst.PadProbeType.DATA_DOWNSTREAM, padProbe_alwaysDrop);
    oldPad.unlink(sinkPad);

    newPad.link(sinkPad);
  }

  addPeer(sinkPad: Gst.Pad) {
    const srcPad = this._tee.getRequestPad('src_%u');
    if (!srcPad)
      throw new Error('Request new pad failed. What the hell?');

    let ret = srcPad.link(sinkPad);

    if (ret != Gst.PadLinkReturn.OK) {
      console.error(`Cannot add ${sinkPad.parent.name}/${sinkPad.name} as ` +
                    `${this._tee.name}'s peer: ${Gst.Pad.linkGetName(ret)}`);
      this._tee.releaseRequestPad(srcPad);
    }

    return ret;
  }

  removePeer(sinkPad: Gst.Pad) {
    const srcPad = sinkPad.getPeer();
    if (!srcPad || srcPad.parent != this._tee) {
      console.warn(`${sinkPad.parent.name}/${sinkPad.name} is not ${this._tee.name}'s peer`);
      return false;
    }

    // Block the pad, to avoid unneccessary error.
    // TODO: is this needed, given we already set allowNotLinked?
    srcPad.addProbe(Gst.PadProbeType.DATA_DOWNSTREAM, padProbe_alwaysDrop);

    let ret = srcPad.unlink(sinkPad);
    this._tee.releaseRequestPad(srcPad);
    return ret;
  }
}
