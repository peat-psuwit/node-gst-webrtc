/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="Gst-1.0.d.ts" />
/// <reference path="GstWebRTC-1.0.d.ts" />
/// <reference path="GObject-2.0.d.ts" />
/// <reference path="GModule-2.0.d.ts" />
/// <reference path="GLib-2.0.d.ts" />
/// <reference path="GstSdp-1.0.d.ts" />
    
declare module 'node-gtk' {
    export function require(ns: string, ver?: string): any;
    export function require(ns: 'Gst'): typeof Gst;
    export function require(ns: 'Gst', ver?: '1.0'): typeof Gst;
    export function require(ns: 'GstWebRTC'): typeof GstWebRTC;
    export function require(ns: 'GstWebRTC', ver?: '1.0'): typeof GstWebRTC;
    export function require(ns: 'GObject'): typeof GObject;
    export function require(ns: 'GObject', ver?: '2.0'): typeof GObject;
    export function require(ns: 'GModule'): typeof GModule;
    export function require(ns: 'GModule', ver?: '2.0'): typeof GModule;
    export function require(ns: 'GLib'): typeof GLib;
    export function require(ns: 'GLib', ver?: '2.0'): typeof GLib;
    export function require(ns: 'GstSdp'): typeof GstSdp;
    export function require(ns: 'GstSdp', ver?: '1.0'): typeof GstSdp;
    export function startLoop(): void;
}
