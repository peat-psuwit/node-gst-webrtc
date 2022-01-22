/* eslint-disable @typescript-eslint/triple-slash-reference */
import * as Gst10 from './Gst-1.0';
import * as GstWebRTC10 from './GstWebRTC-1.0';
import * as GObject20 from './GObject-2.0';
import * as GModule20 from './GModule-2.0';
import * as GLib20 from './GLib-2.0';
import * as GstSdp10 from './GstSdp-1.0';

    export function require(ns: string, ver?: string): any;
        export function require(ns: 'Gst', ver: '1.0'): typeof Gst10;
        export function require(ns: 'GstWebRTC', ver: '1.0'): typeof GstWebRTC10;
        export function require(ns: 'GObject', ver: '2.0'): typeof GObject20;
        export function require(ns: 'GModule', ver: '2.0'): typeof GModule20;
        export function require(ns: 'GLib', ver: '2.0'): typeof GLib20;
        export function require(ns: 'GstSdp', ver: '1.0'): typeof GstSdp10;
    export function startLoop(): void;
