
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

module RTCDataChannel {

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

    // Own fields of NgwNative-0.0.NgwNative.RTCDataChannel

    parentInstance: GObject.Object

    // Own virtual methods of NgwNative-0.0.NgwNative.RTCDataChannel

    handleBufferedAmountLow(): void
    handleClose(): void
    handleError(error: GLib.Error): void
    handleMessageData(bytes: any): void
    handleMessageString(string: string | null): void
    handleOpen(): void

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

interface RTCDataChannelClass {

    // Own fields of NgwNative-0.0.NgwNative.RTCDataChannelClass

    parentClass: GObject.ObjectClass
    handleBufferedAmountLow: (self: RTCDataChannel) => void
    handleClose: (self: RTCDataChannel) => void
    handleError: (self: RTCDataChannel, error: GLib.Error) => void
    handleMessageData: (self: RTCDataChannel, bytes: any) => void
    handleMessageString: (self: RTCDataChannel, string: string | null) => void
    handleOpen: (self: RTCDataChannel) => void
}

abstract class RTCDataChannelClass {

    // Own properties of NgwNative-0.0.NgwNative.RTCDataChannelClass

    static name: string
}

}

export default NgwNative;
// END