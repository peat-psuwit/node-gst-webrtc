
/*
 * Type Definitions for node-gtk (https://github.com/romgrk/node-gtk)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in ts-for-gir itself or create a bug report on https://github.com/gjsify/ts-for-gir
 */

import './node-ngwnative-0.0-import.d.ts';
    
/**
 * NgwNative-0.0
 */

import type GstWebRTC from './node-gstwebrtc-1.0.js';
import type GstSdp from './node-gstsdp-1.0.js';
import type Gst from './node-gst-1.0.js';
import type GObject from './node-gobject-2.0.js';
import type GLib from './node-glib-2.0.js';
import type GModule from './node-gmodule-2.0.js';

export namespace NgwNative {

module Promise {

    // Signal callback interfaces

    /**
     * Signal callback interface for `on-changed`
     */
    interface OnChangedSignalCallback {
        (): void
    }


    // Constructor properties interface

    interface ConstructorProperties extends GObject.Object.ConstructorProperties {
    }

}

interface Promise {

    // Own properties of NgwNative-0.0.NgwNative.Promise

    __gtype__: number

    // Owm methods of NgwNative-0.0.NgwNative.Promise

    getGstPromise(): Gst.Promise

    // Own signals of NgwNative-0.0.NgwNative.Promise

    connect(sigName: "on-changed", callback: Promise.OnChangedSignalCallback): number
    on(sigName: "on-changed", callback: Promise.OnChangedSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-changed", callback: Promise.OnChangedSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-changed", callback: Promise.OnChangedSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-changed", ...args: any[]): void

    // Class property signals of NgwNative-0.0.NgwNative.Promise

    connect(sigName: "notify::__gtype__", callback: (...args: any[]) => void): number
    on(sigName: "notify::__gtype__", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::__gtype__", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::__gtype__", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::__gtype__", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    on(sigName: string, callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: string, callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: string, callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

class Promise extends GObject.Object {

    // Own properties of NgwNative-0.0.NgwNative.Promise

    static name: string

    // Constructors of NgwNative-0.0.NgwNative.Promise

    constructor(config?: Promise.ConstructorProperties) 
    constructor() 
    static new(): Promise
    _init(config?: Promise.ConstructorProperties): void
}

module RTCDataChannel {

    // Signal callback interfaces

    /**
     * Signal callback interface for `on-buffered-amount-low`
     */
    interface OnBufferedAmountLowSignalCallback {
        (): void
    }

    /**
     * Signal callback interface for `on-close`
     */
    interface OnCloseSignalCallback {
        (): void
    }

    /**
     * Signal callback interface for `on-error`
     */
    interface OnErrorSignalCallback {
        (error: GLib.Error): void
    }

    /**
     * Signal callback interface for `on-message-data`
     */
    interface OnMessageDataSignalCallback {
        (data: any | null): void
    }

    /**
     * Signal callback interface for `on-message-string`
     */
    interface OnMessageStringSignalCallback {
        (data: string | null): void
    }

    /**
     * Signal callback interface for `on-open`
     */
    interface OnOpenSignalCallback {
        (): void
    }


    // Constructor properties interface

    interface ConstructorProperties extends GObject.Object.ConstructorProperties {

        // Own constructor properties of NgwNative-0.0.NgwNative.RTCDataChannel

        gstDataChannel?: GstWebRTC.WebRTCDataChannel | null
    }

}

interface RTCDataChannel {

    // Own properties of NgwNative-0.0.NgwNative.RTCDataChannel

    readonly gstDataChannel: GstWebRTC.WebRTCDataChannel
    __gtype__: number

    // Own signals of NgwNative-0.0.NgwNative.RTCDataChannel

    connect(sigName: "on-buffered-amount-low", callback: RTCDataChannel.OnBufferedAmountLowSignalCallback): number
    on(sigName: "on-buffered-amount-low", callback: RTCDataChannel.OnBufferedAmountLowSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-buffered-amount-low", callback: RTCDataChannel.OnBufferedAmountLowSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-buffered-amount-low", callback: RTCDataChannel.OnBufferedAmountLowSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-buffered-amount-low", ...args: any[]): void
    connect(sigName: "on-close", callback: RTCDataChannel.OnCloseSignalCallback): number
    on(sigName: "on-close", callback: RTCDataChannel.OnCloseSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-close", callback: RTCDataChannel.OnCloseSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-close", callback: RTCDataChannel.OnCloseSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-close", ...args: any[]): void
    connect(sigName: "on-error", callback: RTCDataChannel.OnErrorSignalCallback): number
    on(sigName: "on-error", callback: RTCDataChannel.OnErrorSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-error", callback: RTCDataChannel.OnErrorSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-error", callback: RTCDataChannel.OnErrorSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-error", ...args: any[]): void
    connect(sigName: "on-message-data", callback: RTCDataChannel.OnMessageDataSignalCallback): number
    on(sigName: "on-message-data", callback: RTCDataChannel.OnMessageDataSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-message-data", callback: RTCDataChannel.OnMessageDataSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-message-data", callback: RTCDataChannel.OnMessageDataSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-message-data", ...args: any[]): void
    connect(sigName: "on-message-string", callback: RTCDataChannel.OnMessageStringSignalCallback): number
    on(sigName: "on-message-string", callback: RTCDataChannel.OnMessageStringSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-message-string", callback: RTCDataChannel.OnMessageStringSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-message-string", callback: RTCDataChannel.OnMessageStringSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-message-string", ...args: any[]): void
    connect(sigName: "on-open", callback: RTCDataChannel.OnOpenSignalCallback): number
    on(sigName: "on-open", callback: RTCDataChannel.OnOpenSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-open", callback: RTCDataChannel.OnOpenSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-open", callback: RTCDataChannel.OnOpenSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-open", ...args: any[]): void

    // Class property signals of NgwNative-0.0.NgwNative.RTCDataChannel

    connect(sigName: "notify::gst-data-channel", callback: (...args: any[]) => void): number
    on(sigName: "notify::gst-data-channel", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::gst-data-channel", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::gst-data-channel", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::gst-data-channel", ...args: any[]): void
    connect(sigName: "notify::__gtype__", callback: (...args: any[]) => void): number
    on(sigName: "notify::__gtype__", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::__gtype__", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::__gtype__", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::__gtype__", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    on(sigName: string, callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: string, callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: string, callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

class RTCDataChannel extends GObject.Object {

    // Own properties of NgwNative-0.0.NgwNative.RTCDataChannel

    static name: string

    // Constructors of NgwNative-0.0.NgwNative.RTCDataChannel

    constructor(config?: RTCDataChannel.ConstructorProperties) 
    constructor(gstdatachannel: GstWebRTC.WebRTCDataChannel) 
    static new(gstdatachannel: GstWebRTC.WebRTCDataChannel): RTCDataChannel
    _init(config?: RTCDataChannel.ConstructorProperties): void
}

interface PromiseClass {

    // Own fields of NgwNative-0.0.NgwNative.PromiseClass

    parentClass: GObject.ObjectClass
}

abstract class PromiseClass {

    // Own properties of NgwNative-0.0.NgwNative.PromiseClass

    static name: string
}

interface RTCDataChannelClass {

    // Own fields of NgwNative-0.0.NgwNative.RTCDataChannelClass

    parentClass: GObject.ObjectClass
}

abstract class RTCDataChannelClass {

    // Own properties of NgwNative-0.0.NgwNative.RTCDataChannelClass

    static name: string
}

}

export default NgwNative;
// END