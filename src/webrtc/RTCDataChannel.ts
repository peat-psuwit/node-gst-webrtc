import {
  EventTarget as EventTargetShim,
  getEventAttributeValue,
  setEventAttributeValue
} from 'event-target-shim';

import {
  GLib, GObject, GstWebRTC,
} from './gstUtils';

type TEvents = {
  "bufferedamountlow": Event;
  "close": Event;
  "error": RTCErrorEvent;
  "message": MessageEvent;
  "open": Event;
};

class GstRTCDataChannel extends EventTargetShim<TEvents, /* mode */ 'strict'> implements RTCDataChannel {
  // There's no GIR definition for GstWebRTCDataChannel, for some reason.
  _gstdatachannel: GObject.Object;
  _binaryType: 'blob' | 'arraybuffer' = 'blob';

  constructor(gstdatachannel: GObject.Object) {
    super();

    this._gstdatachannel = gstdatachannel;
    gstdatachannel.connect('on-buffered-amount-low', this._handleBufferedAmountLow);
    gstdatachannel.connect('on-close', this._handleClose);
    gstdatachannel.connect('on-error', this._handleError);
    gstdatachannel.connect('on-message-data', this._handleMessageData);
    gstdatachannel.connect('on-message-string', this._handleMessageString);
    gstdatachannel.connect('on-open', this._handleOpen);
  }

  _handleBufferedAmountLow = () => {
    this.dispatchEvent({ type: 'bufferedamountlow' });
  }

  _handleClose = () => {
    this.dispatchEvent({ type: 'close' });
  }

  _handleError = (error: GLib.Error) => {
    // Well, we receive errors in terms of GError, which can report a variety
    // of errors. I don't have a good way to translate this to proper RTCError,
    // so let's just dispatch a generic error. Also, we don't really want to
    // bring in DOMException for an RTCError, so we just lie about the
    // type here.

    let rtcError: any = new Error(error.message);
    rtcError.errorDetail = "data-channel-failure";

    this.dispatchEvent({ type: 'error', error: rtcError });
  }

  // MessageEvent is a bit complicated, so I have a helper function.
  _dispatchMessageEvent(data: string | ArrayBufferLike) {
    this.dispatchEvent({
      type: 'message',
      data: data,
      origin: "null", // Opaque origin
      lastEventId: '', // ???
      source: null,
      ports: [],
    });
  }

  _handleMessageData = (data: GLib.Bytes) => {
    if (this._binaryType == 'blob') {
      throw new Error("We cannot creat a blob in NodeJS!");
    }

    const arrayView = Uint8Array.from(data.getData());
    this._dispatchMessageEvent(arrayView.buffer);
  }

  _handleMessageString = (data: string) => {
    this._dispatchMessageEvent(data);
  }

  _handleOpen = () => {
    this.dispatchEvent({ type: 'open' });
  }

  get binaryType() {
    return this._binaryType;
  }

  set binaryType(value) {
    // TS doesn't enforce runtime behavior
    switch (value) {
      case 'blob':
        console.warn("Blob isn't a thing in NodeJS. We will throw if a binary data arrives.");
        // Fall-through
      case 'arraybuffer':
        this._binaryType = value;
        break;
      default:
        throw new SyntaxError('Invalid value for binaryType');
    }
  }

  get bufferedAmount() {
    return (<any>this._gstdatachannel).bufferedAmount;
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

  send(data: string | Blob | ArrayBuffer | ArrayBufferView) {
    if (typeof data === 'string') {
      return (<any>this._gstdatachannel).sendString(data);
    }

    let arrayBuffer: ArrayBuffer;

    if (ArrayBuffer.isView(data)) {
      arrayBuffer = data.buffer;
    } else if (data instanceof ArrayBuffer) {
      arrayBuffer = data;
    } else {
      throw new TypeError('Invalid data type passed in.');
    }

    const arrayView = new Uint8Array(arrayBuffer);

    const gbytes = new GLib.Bytes(arrayView);
    (<any>this._gstdatachannel).sendData(gbytes);
  }

  close() {
    (<any>this._gstdatachannel).close();
  }

  // BEGIN generated event getters & setters; TEventTarget = RTCDataChannel
  get onbufferedamountlow(): EventTargetShim.CallbackFunction<RTCDataChannel, Event> | null {
    return getEventAttributeValue<RTCDataChannel, Event>(this, 'bufferedamountlow');
  }
  set onbufferedamountlow(value) {
    setEventAttributeValue(this, 'bufferedamountlow', value);
  }

  get onclose(): EventTargetShim.CallbackFunction<RTCDataChannel, Event> | null {
    return getEventAttributeValue<RTCDataChannel, Event>(this, 'close');
  }
  set onclose(value) {
    setEventAttributeValue(this, 'close', value);
  }

  get onerror(): EventTargetShim.CallbackFunction<RTCDataChannel, RTCErrorEvent> | null {
    return getEventAttributeValue<RTCDataChannel, RTCErrorEvent>(this, 'error');
  }
  set onerror(value) {
    setEventAttributeValue(this, 'error', value);
  }

  get onmessage(): EventTargetShim.CallbackFunction<RTCDataChannel, MessageEvent> | null {
    return getEventAttributeValue<RTCDataChannel, MessageEvent>(this, 'message');
  }
  set onmessage(value) {
    setEventAttributeValue(this, 'message', value);
  }

  get onopen(): EventTargetShim.CallbackFunction<RTCDataChannel, Event> | null {
    return getEventAttributeValue<RTCDataChannel, Event>(this, 'open');
  }
  set onopen(value) {
    setEventAttributeValue(this, 'open', value);
  }

  // END generated event getters & setters
}

export default GstRTCDataChannel;
