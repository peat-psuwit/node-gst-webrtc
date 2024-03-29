import { Buffer, Blob as NodeBlob } from 'buffer';

import NgwNative from '../@types/node-ngwnative-0.0';

import {
  GLib, GObject, GstWebRTC,
} from '../gstUtils';

import { NgwRTCErrorEvent } from './events';

type TEvents = {
  "bufferedamountlow": Event;
  "close": Event;
  "error": Event;
  "message": MessageEvent;
  "open": Event;
  "closing": Event;
};

class NgwRTCDataChannel extends EventTarget implements RTCDataChannel {
  private _gstdatachannel: GstWebRTC.WebRTCDataChannel;
  private _nativedelegate: NgwNative.RTCDataChannel | null;
  private _binaryType: 'blob' | 'arraybuffer' = 'blob';
  private _glibConnectIds: number[];

  constructor(gstdatachannel: GstWebRTC.WebRTCDataChannel) {
    super();

    this._gstdatachannel = gstdatachannel;
    this._nativedelegate = NgwNative.RTCDataChannel.new(gstdatachannel);
    this._glibConnectIds = [
      this._nativedelegate.connect('on-buffered-amount-low', this._handleBufferedAmountLow),
      this._nativedelegate.connect('on-close', this._handleClose),
      this._nativedelegate.connect('on-error', this._handleError),
      this._nativedelegate.connect('on-message-data', this._handleMessageData),
      this._nativedelegate.connect('on-message-string', this._handleMessageString),
      this._nativedelegate.connect('on-open', this._handleOpen),
    ]
  }

  /*
   * Becacuse Gst sends data in parallel, we can get on-buffered-amount-low
   * signal multiple times before the current task yield to the event loop.
   * So, de-bouce it by using setTimeout(), which should run after all queued,
   * duplicated signals are handled.
   */

  private _hasPendingBufferedAmountLow = false;

  private _emitBufferedAmountLow = () => {
    this._hasPendingBufferedAmountLow = false;

    if (this.bufferedAmount > this.bufferedAmountLowThreshold) {
      // This is now redundant. Signal should be fired again after we're actually below it.
      return;
    }

    this.dispatchEvent(new Event('bufferedamountlow'));
  }

  private _handleBufferedAmountLow = () => {
    if (!this._hasPendingBufferedAmountLow) {
      this._hasPendingBufferedAmountLow = true;
      setTimeout(this._emitBufferedAmountLow, 0 /* ms */);
    }
  }

  _disconnectGlibSignals() {
    if (!this._nativedelegate)
      return;

    for (let id of this._glibConnectIds) {
      this._nativedelegate.disconnect(id);
    }
    this._nativedelegate = null;
  }

  private _handleClose = async () => {
    this.dispatchEvent(new Event('close'));

    this._disconnectGlibSignals();
  }

  private _handleError = async (error: GLib.Error) => {
    // Well, we receive errors in terms of GError, which can report a variety
    // of errors. I don't have a good way to translate this to proper RTCError,
    // so let's just dispatch a generic error. Also, we don't really want to
    // bring in DOMException for an RTCError, so we just lie about the
    // type here.

    let rtcError: any = new Error(error.message || undefined);
    rtcError.errorDetail = "data-channel-failure";

    this.dispatchEvent(new NgwRTCErrorEvent('error', { error: rtcError }));
  }

  // MessageEvent is a bit complicated, so I have a helper function.
  private _dispatchMessageEvent(data: string | ArrayBufferLike | NodeBlob | null) {
    this.dispatchEvent(new MessageEvent('message', {
      data: data,
      origin: "null", // Opaque origin
      lastEventId: '', // ???
      source: null,
      ports: [],
    }));
  }

  private _handleMessageData = async (data: GLib.Bytes | null) => {
    if (!data) {
      return this._dispatchMessageEvent(null);
    }

    const arrayView = Uint8Array.from(data.getData() || []);
    const blobOrBuffer = this._binaryType == 'blob' ? new NodeBlob([arrayView]) : arrayView.buffer;
    this._dispatchMessageEvent(blobOrBuffer);
  }

  private _handleMessageString = async (data: string | null) => {
    this._dispatchMessageEvent(data);
  }

  private _handleOpen = async () => {
    this.dispatchEvent(new Event('open'));
  }

  get binaryType() {
    return this._binaryType;
  }

  set binaryType(value) {
    // TS doesn't enforce runtime behavior
    switch (value) {
      case 'blob':
      case 'arraybuffer':
        this._binaryType = value;
        break;
      default:
        throw new SyntaxError('Invalid value for binaryType');
    }
  }

  /*
   * Implementing `bufferedAmount` to the spec is tricky. It says that the
   * increase (due to send()) is instant, but the decrease, if sending happens
   * in parallel, has to be queued. However, GstWebRTCDataChannel doesn't have
   * that mechanism until _very_ recently (currently in master), and even then,
   * it uses g_object_notify() which, due to node-gtk, will block the streaming
   * thread until we're returned to the event queue.
   *
   * What we're doing here is, whenever bufferedAmount is read or send() is
   * called, the value from Gst side is read once and then cached. Then, a
   * setTimeout() callback is used to reset the state so that, when we yield
   * back to the event loop, the next get() bufferedAmount gets the latest
   * amount.
   */
  private _bufferedAmount: number = -1;

  private _resetBufferedAmount = () => {
    this._bufferedAmount = -1;
  }

  private _cacheBufferedAmount() {
    if (this._bufferedAmount === -1) {
      setTimeout(this._resetBufferedAmount, 0 /* ms */);

      // This shouldn't go below 0.
      this._bufferedAmount = (<any>this._gstdatachannel).bufferedAmount;
    }
  }

  get bufferedAmount() {
    this._cacheBufferedAmount();
    return this._bufferedAmount;
  }

  get bufferedAmountLowThreshold() {
    return (<any>this._gstdatachannel).bufferedAmountLowThreshold;
  }

  set bufferedAmountLowThreshold(value) {
    (<any>this._gstdatachannel).bufferedAmountLowThreshold = value;
  }

  get id() {
    return (<any>this._gstdatachannel).id;
  }

  get label() {
    return (<any>this._gstdatachannel).label;
  }

  get maxPacketLifeTime() {
    return (<any>this._gstdatachannel).maxPacketLifeTime;
  }

  get maxRetransmits() {
    return (<any>this._gstdatachannel).maxRetransmits;
  }

  get negotiated() {
    return (<any>this._gstdatachannel).negotiated;
  }

  get ordered() {
    return (<any>this._gstdatachannel).ordered;
  }

  get protocol() {
    return (<any>this._gstdatachannel).protocol;
  }

  get readyState(): RTCDataChannelState {
    switch ((<any>this._gstdatachannel).readyState) {
      case GstWebRTC.WebRTCDataChannelState.CLOSED:
      default:
        return 'closed';
      case GstWebRTC.WebRTCDataChannelState.CLOSING:
        return 'closing';
      case GstWebRTC.WebRTCDataChannelState.CONNECTING:
      // https://w3c.github.io/webrtc-pc/#dom-rtcdatachannelstate
      // ["connecting"] is the initial state of an RTCDataChannel object, ...
      case GstWebRTC.WebRTCDataChannelState.NEW:
        return 'connecting';
      case GstWebRTC.WebRTCDataChannelState.OPEN:
        return 'open';
    }
  }

  async send(data: string | Blob | NodeBlob | ArrayBuffer | ArrayBufferView) {
    this._cacheBufferedAmount();

    if (typeof data === 'string') {
      this._gstdatachannel.emit('send-string', data);
      this._bufferedAmount += Buffer.byteLength(data, 'utf-8');
      return;
    }

    let arrayBuffer: ArrayBuffer;

    if (data instanceof NodeBlob) {
      arrayBuffer = await data.arrayBuffer();
    } else if (ArrayBuffer.isView(data)) {
      arrayBuffer = data.buffer;
    } else if (data instanceof ArrayBuffer) {
      arrayBuffer = data;
    } else {
      throw new TypeError('Invalid data type passed in.');
    }

    const arrayView = new Uint8Array(arrayBuffer);

    // FIXME: node-gtk DOES accept typed array for an array argument.
    const gbytes = new GLib.Bytes(<any>arrayView);
    this._gstdatachannel.emit('send-data', gbytes);
    this._bufferedAmount += arrayView.byteLength;
  }

  close() {
    this._gstdatachannel.emit('close');
  }

  // BEGIN generated event getters & setters; TEventTarget = RTCDataChannel
  private _onbufferedamountlow: ((this: RTCDataChannel, ev: Event) => any) | null = null;
  get onbufferedamountlow() {
    return this._onbufferedamountlow;
  }
  set onbufferedamountlow (value) {
    if (this._onbufferedamountlow)
      this.removeEventListener('bufferedamountlow', <EventListener>this._onbufferedamountlow);
    if (value)
      this.addEventListener('bufferedamountlow', <EventListener>value);
    this._onbufferedamountlow = value;
  }

  private _onclose: ((this: RTCDataChannel, ev: Event) => any) | null = null;
  get onclose() {
    return this._onclose;
  }
  set onclose (value) {
    if (this._onclose)
      this.removeEventListener('close', <EventListener>this._onclose);
    if (value)
      this.addEventListener('close', <EventListener>value);
    this._onclose = value;
  }

  private _onerror: ((this: RTCDataChannel, ev: Event) => any) | null = null;
  get onerror() {
    return this._onerror;
  }
  set onerror (value) {
    if (this._onerror)
      this.removeEventListener('error', <EventListener>this._onerror);
    if (value)
      this.addEventListener('error', <EventListener>value);
    this._onerror = value;
  }

  private _onmessage: ((this: RTCDataChannel, ev: MessageEvent) => any) | null = null;
  get onmessage() {
    return this._onmessage;
  }
  set onmessage (value) {
    if (this._onmessage)
      this.removeEventListener('message', <EventListener>this._onmessage);
    if (value)
      this.addEventListener('message', <EventListener>value);
    this._onmessage = value;
  }

  private _onopen: ((this: RTCDataChannel, ev: Event) => any) | null = null;
  get onopen() {
    return this._onopen;
  }
  set onopen (value) {
    if (this._onopen)
      this.removeEventListener('open', <EventListener>this._onopen);
    if (value)
      this.addEventListener('open', <EventListener>value);
    this._onopen = value;
  }

  private _onclosing: ((this: RTCDataChannel, ev: Event) => any) | null = null;
  get onclosing() {
    return this._onclosing;
  }
  set onclosing (value) {
    if (this._onclosing)
      this.removeEventListener('closing', <EventListener>this._onclosing);
    if (value)
      this.addEventListener('closing', <EventListener>value);
    this._onclosing = value;
  }

  // END generated event getters & setters
}

export default NgwRTCDataChannel;
