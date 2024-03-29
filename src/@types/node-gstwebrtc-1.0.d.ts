
/*
 * Type Definitions for node-gtk (https://github.com/romgrk/node-gtk)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in ts-for-gir itself or create a bug report on https://github.com/gjsify/ts-for-gir
 */

import './node-gstwebrtc-1.0-import.d.ts';
    
/**
 * GstWebRTC-1.0
 */

import type GstSdp from './node-gstsdp-1.0.js';
import type Gst from './node-gst-1.0.js';
import type GObject from './node-gobject-2.0.js';
import type GLib from './node-glib-2.0.js';
import type GModule from './node-gmodule-2.0.js';

export namespace GstWebRTC {

/**
 * See https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-24#section-4.1.1
 * for more information.
 */
enum WebRTCBundlePolicy {
    /**
     * none
     */
    NONE,
    /**
     * balanced
     */
    BALANCED,
    /**
     * max-compat
     */
    MAX_COMPAT,
    /**
     * max-bundle
     */
    MAX_BUNDLE,
}
enum WebRTCDTLSSetup {
    /**
     * none
     */
    NONE,
    /**
     * actpass
     */
    ACTPASS,
    /**
     * sendonly
     */
    ACTIVE,
    /**
     * recvonly
     */
    PASSIVE,
}
enum WebRTCDTLSTransportState {
    /**
     * new
     */
    NEW,
    /**
     * closed
     */
    CLOSED,
    /**
     * failed
     */
    FAILED,
    /**
     * connecting
     */
    CONNECTING,
    /**
     * connected
     */
    CONNECTED,
}
/**
 * See <http://w3c.github.io/webrtc-pc/#dom-rtcdatachannelstate>
 */
enum WebRTCDataChannelState {
    /**
     * new
     */
    NEW,
    /**
     * connection
     */
    CONNECTING,
    /**
     * open
     */
    OPEN,
    /**
     * closing
     */
    CLOSING,
    /**
     * closed
     */
    CLOSED,
}
/**
 * See <https://www.w3.org/TR/webrtc/#dom-rtcerrordetailtype> for more information.
 */
enum WebRTCError {
    /**
     * data-channel-failure
     */
    DATA_CHANNEL_FAILURE,
    /**
     * dtls-failure
     */
    DTLS_FAILURE,
    /**
     * fingerprint-failure
     */
    FINGERPRINT_FAILURE,
    /**
     * sctp-failure
     */
    SCTP_FAILURE,
    /**
     * sdp-syntax-error
     */
    SDP_SYNTAX_ERROR,
    /**
     * hardware-encoder-not-available
     */
    HARDWARE_ENCODER_NOT_AVAILABLE,
    /**
     * encoder-error
     */
    ENCODER_ERROR,
    /**
     * invalid-state (part of WebIDL specification)
     */
    INVALID_STATE,
    /**
     * GStreamer-specific failure, not matching any other value from the specification
     */
    INTERNAL_FAILURE,
}
enum WebRTCFECType {
    /**
     * none
     */
    NONE,
    /**
     * ulpfec + red
     */
    ULP_RED,
}
enum WebRTCICEComponent {
    /**
     * RTP component
     */
    RTP,
    /**
     * RTCP component
     */
    RTCP,
}
/**
 * See <http://w3c.github.io/webrtc-pc/#dom-rtciceconnectionstate>
 */
enum WebRTCICEConnectionState {
    /**
     * new
     */
    NEW,
    /**
     * checking
     */
    CHECKING,
    /**
     * connected
     */
    CONNECTED,
    /**
     * completed
     */
    COMPLETED,
    /**
     * failed
     */
    FAILED,
    /**
     * disconnected
     */
    DISCONNECTED,
    /**
     * closed
     */
    CLOSED,
}
/**
 * See <http://w3c.github.io/webrtc-pc/#dom-rtcicegatheringstate>
 */
enum WebRTCICEGatheringState {
    /**
     * new
     */
    NEW,
    /**
     * gathering
     */
    GATHERING,
    /**
     * complete
     */
    COMPLETE,
}
enum WebRTCICERole {
    /**
     * controlled
     */
    CONTROLLED,
    /**
     * controlling
     */
    CONTROLLING,
}
/**
 * See https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-24#section-4.1.1
 * for more information.
 */
enum WebRTCICETransportPolicy {
    /**
     * all
     */
    ALL,
    /**
     * relay
     */
    RELAY,
}
/**
 * https://w3c.github.io/mediacapture-main/#dom-mediastreamtrack-kind
 */
enum WebRTCKind {
    /**
     * Kind has not yet been set
     */
    UNKNOWN,
    /**
     * Kind is audio
     */
    AUDIO,
    /**
     * Kind is audio
     */
    VIDEO,
}
/**
 * See <http://w3c.github.io/webrtc-pc/#dom-rtcpeerconnectionstate>
 */
enum WebRTCPeerConnectionState {
    /**
     * new
     */
    NEW,
    /**
     * connecting
     */
    CONNECTING,
    /**
     * connected
     */
    CONNECTED,
    /**
     * disconnected
     */
    DISCONNECTED,
    /**
     * failed
     */
    FAILED,
    /**
     * closed
     */
    CLOSED,
}
/**
 * See <http://w3c.github.io/webrtc-pc/#dom-rtcprioritytype>
 */
enum WebRTCPriorityType {
    /**
     * very-low
     */
    VERY_LOW,
    /**
     * low
     */
    LOW,
    /**
     * medium
     */
    MEDIUM,
    /**
     * high
     */
    HIGH,
}
enum WebRTCRTPTransceiverDirection {
    /**
     * none
     */
    NONE,
    /**
     * inactive
     */
    INACTIVE,
    /**
     * sendonly
     */
    SENDONLY,
    /**
     * recvonly
     */
    RECVONLY,
    /**
     * sendrecv
     */
    SENDRECV,
}
/**
 * See <http://w3c.github.io/webrtc-pc/#dom-rtcsctptransportstate>
 */
enum WebRTCSCTPTransportState {
    /**
     * new
     */
    NEW,
    /**
     * connecting
     */
    CONNECTING,
    /**
     * connected
     */
    CONNECTED,
    /**
     * closed
     */
    CLOSED,
}
/**
 * See <http://w3c.github.io/webrtc-pc/#rtcsdptype>
 */
enum WebRTCSDPType {
    /**
     * offer
     */
    OFFER,
    /**
     * pranswer
     */
    PRANSWER,
    /**
     * answer
     */
    ANSWER,
    /**
     * rollback
     */
    ROLLBACK,
}
/**
 * See <http://w3c.github.io/webrtc-pc/#dom-rtcsignalingstate>
 */
enum WebRTCSignalingState {
    /**
     * stable
     */
    STABLE,
    /**
     * closed
     */
    CLOSED,
    /**
     * have-local-offer
     */
    HAVE_LOCAL_OFFER,
    /**
     * have-remote-offer
     */
    HAVE_REMOTE_OFFER,
    /**
     * have-local-pranswer
     */
    HAVE_LOCAL_PRANSWER,
    /**
     * have-remote-pranswer
     */
    HAVE_REMOTE_PRANSWER,
}
enum WebRTCStatsType {
    /**
     * codec
     */
    CODEC,
    /**
     * inbound-rtp
     */
    INBOUND_RTP,
    /**
     * outbound-rtp
     */
    OUTBOUND_RTP,
    /**
     * remote-inbound-rtp
     */
    REMOTE_INBOUND_RTP,
    /**
     * remote-outbound-rtp
     */
    REMOTE_OUTBOUND_RTP,
    /**
     * csrc
     */
    CSRC,
    /**
     * peer-connectiion
     */
    PEER_CONNECTION,
    /**
     * data-channel
     */
    DATA_CHANNEL,
    /**
     * stream
     */
    STREAM,
    /**
     * transport
     */
    TRANSPORT,
    /**
     * candidate-pair
     */
    CANDIDATE_PAIR,
    /**
     * local-candidate
     */
    LOCAL_CANDIDATE,
    /**
     * remote-candidate
     */
    REMOTE_CANDIDATE,
    /**
     * certificate
     */
    CERTIFICATE,
}
function webrtcErrorQuark(): GLib.Quark
function webrtcSdpTypeToString(type: WebRTCSDPType): string | null
module WebRTCDTLSTransport {

    // Constructor properties interface

    interface ConstructorProperties extends Gst.Object.ConstructorProperties {

        // Own constructor properties of GstWebRTC-1.0.GstWebRTC.WebRTCDTLSTransport

        certificate?: string | null
        client?: boolean | null
        sessionId?: number | null
    }

}

interface WebRTCDTLSTransport {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCDTLSTransport

    certificate: string | null
    client: boolean
    readonly remoteCertificate: string | null
    readonly sessionId: number
    readonly state: WebRTCDTLSTransportState
    readonly transport: WebRTCICETransport
    __gtype__: number

    // Conflicting methods

    /**
     * Increments the reference count on `object`. This function
     * does not take the lock on `object` because it relies on
     * atomic refcounting.
     * 
     * This object returns the input parameter to ease writing
     * constructs like :
     *  result = gst_object_ref (object->parent);
     * @returns A pointer to @object
     */
    ref(): Gst.Object

    // Overloads of ref

    /**
     * Increases the reference count of `object`.
     * 
     * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
     * of `object` will be propagated to the return type (using the GCC typeof()
     * extension), so any casting the caller needs to do on the return type must be
     * explicit.
     * @returns the same @object
     */
    ref(): GObject.Object
    /**
     * Increases the reference count of `object`.
     * 
     * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
     * of `object` will be propagated to the return type (using the GCC typeof()
     * extension), so any casting the caller needs to do on the return type must be
     * explicit.
     * @returns the same @object
     */
    ref(): GObject.Object

    // Class property signals of GstWebRTC-1.0.GstWebRTC.WebRTCDTLSTransport

    connect(sigName: "notify::certificate", callback: (...args: any[]) => void): number
    on(sigName: "notify::certificate", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::certificate", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::certificate", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::certificate", ...args: any[]): void
    connect(sigName: "notify::client", callback: (...args: any[]) => void): number
    on(sigName: "notify::client", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::client", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::client", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::client", ...args: any[]): void
    connect(sigName: "notify::remote-certificate", callback: (...args: any[]) => void): number
    on(sigName: "notify::remote-certificate", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::remote-certificate", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::remote-certificate", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::remote-certificate", ...args: any[]): void
    connect(sigName: "notify::session-id", callback: (...args: any[]) => void): number
    on(sigName: "notify::session-id", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::session-id", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::session-id", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::session-id", ...args: any[]): void
    connect(sigName: "notify::state", callback: (...args: any[]) => void): number
    on(sigName: "notify::state", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::state", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::state", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::state", ...args: any[]): void
    connect(sigName: "notify::transport", callback: (...args: any[]) => void): number
    on(sigName: "notify::transport", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::transport", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::transport", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::transport", ...args: any[]): void
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

class WebRTCDTLSTransport extends Gst.Object {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCDTLSTransport

    static name: string

    // Constructors of GstWebRTC-1.0.GstWebRTC.WebRTCDTLSTransport

    constructor(config?: WebRTCDTLSTransport.ConstructorProperties) 
    _init(config?: WebRTCDTLSTransport.ConstructorProperties): void
}

module WebRTCDataChannel {

    // Signal callback interfaces

    /**
     * Signal callback interface for `close`
     */
    interface CloseSignalCallback {
        (): void
    }

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

    /**
     * Signal callback interface for `send-data`
     */
    interface SendDataSignalCallback {
        (data: any | null): void
    }

    /**
     * Signal callback interface for `send-string`
     */
    interface SendStringSignalCallback {
        (data: string | null): void
    }


    // Constructor properties interface

    interface ConstructorProperties extends GObject.Object.ConstructorProperties {

        // Own constructor properties of GstWebRTC-1.0.GstWebRTC.WebRTCDataChannel

        bufferedAmountLowThreshold?: number | null
        id?: number | null
        label?: string | null
        maxPacketLifetime?: number | null
        maxRetransmits?: number | null
        negotiated?: boolean | null
        ordered?: boolean | null
        priority?: WebRTCPriorityType | null
        protocol?: string | null
    }

}

interface WebRTCDataChannel {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCDataChannel

    readonly bufferedAmount: number
    bufferedAmountLowThreshold: number
    readonly id: number
    readonly label: string | null
    readonly maxPacketLifetime: number
    readonly maxRetransmits: number
    readonly negotiated: boolean
    readonly ordered: boolean
    readonly priority: WebRTCPriorityType
    readonly protocol: string | null
    readonly readyState: WebRTCDataChannelState
    __gtype__: number

    // Owm methods of GstWebRTC-1.0.GstWebRTC.WebRTCDataChannel

    /**
     * Close the `channel`.
     */
    close(): void
    /**
     * Send `data` as a data message over `channel`.
     * @param data a #GBytes or %NULL
     */
    sendData(data: any | null): void
    /**
     * Send `str` as a string message over `channel`.
     * @param str a string or %NULL
     */
    sendString(str: string | null): void

    // Own signals of GstWebRTC-1.0.GstWebRTC.WebRTCDataChannel

    connect(sigName: "close", callback: WebRTCDataChannel.CloseSignalCallback): number
    on(sigName: "close", callback: WebRTCDataChannel.CloseSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "close", callback: WebRTCDataChannel.CloseSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "close", callback: WebRTCDataChannel.CloseSignalCallback): NodeJS.EventEmitter
    emit(sigName: "close", ...args: any[]): void
    connect(sigName: "on-buffered-amount-low", callback: WebRTCDataChannel.OnBufferedAmountLowSignalCallback): number
    on(sigName: "on-buffered-amount-low", callback: WebRTCDataChannel.OnBufferedAmountLowSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-buffered-amount-low", callback: WebRTCDataChannel.OnBufferedAmountLowSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-buffered-amount-low", callback: WebRTCDataChannel.OnBufferedAmountLowSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-buffered-amount-low", ...args: any[]): void
    connect(sigName: "on-close", callback: WebRTCDataChannel.OnCloseSignalCallback): number
    on(sigName: "on-close", callback: WebRTCDataChannel.OnCloseSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-close", callback: WebRTCDataChannel.OnCloseSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-close", callback: WebRTCDataChannel.OnCloseSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-close", ...args: any[]): void
    connect(sigName: "on-error", callback: WebRTCDataChannel.OnErrorSignalCallback): number
    on(sigName: "on-error", callback: WebRTCDataChannel.OnErrorSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-error", callback: WebRTCDataChannel.OnErrorSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-error", callback: WebRTCDataChannel.OnErrorSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-error", ...args: any[]): void
    connect(sigName: "on-message-data", callback: WebRTCDataChannel.OnMessageDataSignalCallback): number
    on(sigName: "on-message-data", callback: WebRTCDataChannel.OnMessageDataSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-message-data", callback: WebRTCDataChannel.OnMessageDataSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-message-data", callback: WebRTCDataChannel.OnMessageDataSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-message-data", ...args: any[]): void
    connect(sigName: "on-message-string", callback: WebRTCDataChannel.OnMessageStringSignalCallback): number
    on(sigName: "on-message-string", callback: WebRTCDataChannel.OnMessageStringSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-message-string", callback: WebRTCDataChannel.OnMessageStringSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-message-string", callback: WebRTCDataChannel.OnMessageStringSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-message-string", ...args: any[]): void
    connect(sigName: "on-open", callback: WebRTCDataChannel.OnOpenSignalCallback): number
    on(sigName: "on-open", callback: WebRTCDataChannel.OnOpenSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-open", callback: WebRTCDataChannel.OnOpenSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-open", callback: WebRTCDataChannel.OnOpenSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-open", ...args: any[]): void
    connect(sigName: "send-data", callback: WebRTCDataChannel.SendDataSignalCallback): number
    on(sigName: "send-data", callback: WebRTCDataChannel.SendDataSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "send-data", callback: WebRTCDataChannel.SendDataSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "send-data", callback: WebRTCDataChannel.SendDataSignalCallback): NodeJS.EventEmitter
    emit(sigName: "send-data", ...args: any[]): void
    connect(sigName: "send-string", callback: WebRTCDataChannel.SendStringSignalCallback): number
    on(sigName: "send-string", callback: WebRTCDataChannel.SendStringSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "send-string", callback: WebRTCDataChannel.SendStringSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "send-string", callback: WebRTCDataChannel.SendStringSignalCallback): NodeJS.EventEmitter
    emit(sigName: "send-string", ...args: any[]): void

    // Class property signals of GstWebRTC-1.0.GstWebRTC.WebRTCDataChannel

    connect(sigName: "notify::buffered-amount", callback: (...args: any[]) => void): number
    on(sigName: "notify::buffered-amount", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::buffered-amount", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::buffered-amount", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::buffered-amount", ...args: any[]): void
    connect(sigName: "notify::buffered-amount-low-threshold", callback: (...args: any[]) => void): number
    on(sigName: "notify::buffered-amount-low-threshold", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::buffered-amount-low-threshold", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::buffered-amount-low-threshold", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::buffered-amount-low-threshold", ...args: any[]): void
    connect(sigName: "notify::id", callback: (...args: any[]) => void): number
    on(sigName: "notify::id", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::id", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::id", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::id", ...args: any[]): void
    connect(sigName: "notify::label", callback: (...args: any[]) => void): number
    on(sigName: "notify::label", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::label", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::label", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::label", ...args: any[]): void
    connect(sigName: "notify::max-packet-lifetime", callback: (...args: any[]) => void): number
    on(sigName: "notify::max-packet-lifetime", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::max-packet-lifetime", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::max-packet-lifetime", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::max-packet-lifetime", ...args: any[]): void
    connect(sigName: "notify::max-retransmits", callback: (...args: any[]) => void): number
    on(sigName: "notify::max-retransmits", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::max-retransmits", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::max-retransmits", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::max-retransmits", ...args: any[]): void
    connect(sigName: "notify::negotiated", callback: (...args: any[]) => void): number
    on(sigName: "notify::negotiated", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::negotiated", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::negotiated", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::negotiated", ...args: any[]): void
    connect(sigName: "notify::ordered", callback: (...args: any[]) => void): number
    on(sigName: "notify::ordered", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::ordered", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::ordered", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::ordered", ...args: any[]): void
    connect(sigName: "notify::priority", callback: (...args: any[]) => void): number
    on(sigName: "notify::priority", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::priority", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::priority", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::priority", ...args: any[]): void
    connect(sigName: "notify::protocol", callback: (...args: any[]) => void): number
    on(sigName: "notify::protocol", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::protocol", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::protocol", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::protocol", ...args: any[]): void
    connect(sigName: "notify::ready-state", callback: (...args: any[]) => void): number
    on(sigName: "notify::ready-state", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::ready-state", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::ready-state", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::ready-state", ...args: any[]): void
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

class WebRTCDataChannel extends GObject.Object {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCDataChannel

    static name: string

    // Constructors of GstWebRTC-1.0.GstWebRTC.WebRTCDataChannel

    constructor(config?: WebRTCDataChannel.ConstructorProperties) 
    _init(config?: WebRTCDataChannel.ConstructorProperties): void
}

module WebRTCICETransport {

    // Signal callback interfaces

    /**
     * Signal callback interface for `on-new-candidate`
     */
    interface OnNewCandidateSignalCallback {
        (object: string | null): void
    }

    /**
     * Signal callback interface for `on-selected-candidate-pair-change`
     */
    interface OnSelectedCandidatePairChangeSignalCallback {
        (): void
    }


    // Constructor properties interface

    interface ConstructorProperties extends Gst.Object.ConstructorProperties {

        // Own constructor properties of GstWebRTC-1.0.GstWebRTC.WebRTCICETransport

        component?: WebRTCICEComponent | null
    }

}

interface WebRTCICETransport {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCICETransport

    readonly component: WebRTCICEComponent
    readonly gatheringState: WebRTCICEGatheringState
    readonly state: WebRTCICEConnectionState
    __gtype__: number

    // Conflicting methods

    /**
     * Increments the reference count on `object`. This function
     * does not take the lock on `object` because it relies on
     * atomic refcounting.
     * 
     * This object returns the input parameter to ease writing
     * constructs like :
     *  result = gst_object_ref (object->parent);
     * @returns A pointer to @object
     */
    ref(): Gst.Object

    // Overloads of ref

    /**
     * Increases the reference count of `object`.
     * 
     * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
     * of `object` will be propagated to the return type (using the GCC typeof()
     * extension), so any casting the caller needs to do on the return type must be
     * explicit.
     * @returns the same @object
     */
    ref(): GObject.Object
    /**
     * Increases the reference count of `object`.
     * 
     * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
     * of `object` will be propagated to the return type (using the GCC typeof()
     * extension), so any casting the caller needs to do on the return type must be
     * explicit.
     * @returns the same @object
     */
    ref(): GObject.Object

    // Own signals of GstWebRTC-1.0.GstWebRTC.WebRTCICETransport

    connect(sigName: "on-new-candidate", callback: WebRTCICETransport.OnNewCandidateSignalCallback): number
    on(sigName: "on-new-candidate", callback: WebRTCICETransport.OnNewCandidateSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-new-candidate", callback: WebRTCICETransport.OnNewCandidateSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-new-candidate", callback: WebRTCICETransport.OnNewCandidateSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-new-candidate", ...args: any[]): void
    connect(sigName: "on-selected-candidate-pair-change", callback: WebRTCICETransport.OnSelectedCandidatePairChangeSignalCallback): number
    on(sigName: "on-selected-candidate-pair-change", callback: WebRTCICETransport.OnSelectedCandidatePairChangeSignalCallback, after?: boolean): NodeJS.EventEmitter
    once(sigName: "on-selected-candidate-pair-change", callback: WebRTCICETransport.OnSelectedCandidatePairChangeSignalCallback, after?: boolean): NodeJS.EventEmitter
    off(sigName: "on-selected-candidate-pair-change", callback: WebRTCICETransport.OnSelectedCandidatePairChangeSignalCallback): NodeJS.EventEmitter
    emit(sigName: "on-selected-candidate-pair-change", ...args: any[]): void

    // Class property signals of GstWebRTC-1.0.GstWebRTC.WebRTCICETransport

    connect(sigName: "notify::component", callback: (...args: any[]) => void): number
    on(sigName: "notify::component", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::component", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::component", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::component", ...args: any[]): void
    connect(sigName: "notify::gathering-state", callback: (...args: any[]) => void): number
    on(sigName: "notify::gathering-state", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::gathering-state", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::gathering-state", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::gathering-state", ...args: any[]): void
    connect(sigName: "notify::state", callback: (...args: any[]) => void): number
    on(sigName: "notify::state", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::state", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::state", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::state", ...args: any[]): void
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

class WebRTCICETransport extends Gst.Object {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCICETransport

    static name: string

    // Constructors of GstWebRTC-1.0.GstWebRTC.WebRTCICETransport

    constructor(config?: WebRTCICETransport.ConstructorProperties) 
    _init(config?: WebRTCICETransport.ConstructorProperties): void
}

module WebRTCRTPReceiver {

    // Constructor properties interface

    interface ConstructorProperties extends Gst.Object.ConstructorProperties {
    }

}

interface WebRTCRTPReceiver {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCRTPReceiver

    /**
     * The DTLS transport for this receiver
     */
    readonly transport: WebRTCDTLSTransport
    __gtype__: number

    // Conflicting methods

    /**
     * Increments the reference count on `object`. This function
     * does not take the lock on `object` because it relies on
     * atomic refcounting.
     * 
     * This object returns the input parameter to ease writing
     * constructs like :
     *  result = gst_object_ref (object->parent);
     * @returns A pointer to @object
     */
    ref(): Gst.Object

    // Overloads of ref

    /**
     * Increases the reference count of `object`.
     * 
     * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
     * of `object` will be propagated to the return type (using the GCC typeof()
     * extension), so any casting the caller needs to do on the return type must be
     * explicit.
     * @returns the same @object
     */
    ref(): GObject.Object
    /**
     * Increases the reference count of `object`.
     * 
     * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
     * of `object` will be propagated to the return type (using the GCC typeof()
     * extension), so any casting the caller needs to do on the return type must be
     * explicit.
     * @returns the same @object
     */
    ref(): GObject.Object

    // Class property signals of GstWebRTC-1.0.GstWebRTC.WebRTCRTPReceiver

    connect(sigName: "notify::transport", callback: (...args: any[]) => void): number
    on(sigName: "notify::transport", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::transport", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::transport", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::transport", ...args: any[]): void
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

/**
 * An object to track the receiving aspect of the stream
 * 
 * Mostly matches the WebRTC RTCRtpReceiver interface.
 * @class 
 */
class WebRTCRTPReceiver extends Gst.Object {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCRTPReceiver

    static name: string

    // Constructors of GstWebRTC-1.0.GstWebRTC.WebRTCRTPReceiver

    constructor(config?: WebRTCRTPReceiver.ConstructorProperties) 
    _init(config?: WebRTCRTPReceiver.ConstructorProperties): void
}

module WebRTCRTPSender {

    // Constructor properties interface

    interface ConstructorProperties extends Gst.Object.ConstructorProperties {

        // Own constructor properties of GstWebRTC-1.0.GstWebRTC.WebRTCRTPSender

        /**
         * The priority from which to set the DSCP field on packets
         */
        priority?: WebRTCPriorityType | null
    }

}

interface WebRTCRTPSender {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCRTPSender

    /**
     * The priority from which to set the DSCP field on packets
     */
    priority: WebRTCPriorityType
    /**
     * The DTLS transport for this sender
     */
    readonly transport: WebRTCDTLSTransport
    __gtype__: number

    // Owm methods of GstWebRTC-1.0.GstWebRTC.WebRTCRTPSender

    /**
     * Sets the content of the IPv4 Type of Service (ToS), also known as DSCP
     * (Differentiated Services Code Point).
     * This also sets the Traffic Class field of IPv6.
     * @param priority The priority of this sender
     */
    setPriority(priority: WebRTCPriorityType): void

    // Conflicting methods

    /**
     * Increments the reference count on `object`. This function
     * does not take the lock on `object` because it relies on
     * atomic refcounting.
     * 
     * This object returns the input parameter to ease writing
     * constructs like :
     *  result = gst_object_ref (object->parent);
     * @returns A pointer to @object
     */
    ref(): Gst.Object

    // Overloads of ref

    /**
     * Increases the reference count of `object`.
     * 
     * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
     * of `object` will be propagated to the return type (using the GCC typeof()
     * extension), so any casting the caller needs to do on the return type must be
     * explicit.
     * @returns the same @object
     */
    ref(): GObject.Object
    /**
     * Increases the reference count of `object`.
     * 
     * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
     * of `object` will be propagated to the return type (using the GCC typeof()
     * extension), so any casting the caller needs to do on the return type must be
     * explicit.
     * @returns the same @object
     */
    ref(): GObject.Object

    // Class property signals of GstWebRTC-1.0.GstWebRTC.WebRTCRTPSender

    connect(sigName: "notify::priority", callback: (...args: any[]) => void): number
    on(sigName: "notify::priority", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::priority", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::priority", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::priority", ...args: any[]): void
    connect(sigName: "notify::transport", callback: (...args: any[]) => void): number
    on(sigName: "notify::transport", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::transport", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::transport", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::transport", ...args: any[]): void
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

/**
 * An object to track the sending aspect of the stream
 * 
 * Mostly matches the WebRTC RTCRtpSender interface.
 * @class 
 */
class WebRTCRTPSender extends Gst.Object {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCRTPSender

    static name: string

    // Constructors of GstWebRTC-1.0.GstWebRTC.WebRTCRTPSender

    constructor(config?: WebRTCRTPSender.ConstructorProperties) 
    _init(config?: WebRTCRTPSender.ConstructorProperties): void
}

module WebRTCRTPTransceiver {

    // Constructor properties interface

    interface ConstructorProperties extends Gst.Object.ConstructorProperties {

        // Own constructor properties of GstWebRTC-1.0.GstWebRTC.WebRTCRTPTransceiver

        /**
         * Caps representing the codec preferences.
         */
        codecPreferences?: Gst.Caps | null
        /**
         * Direction of the transceiver.
         */
        direction?: WebRTCRTPTransceiverDirection | null
        mlineindex?: number | null
        receiver?: WebRTCRTPReceiver | null
        sender?: WebRTCRTPSender | null
    }

}

interface WebRTCRTPTransceiver {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCRTPTransceiver

    /**
     * Caps representing the codec preferences.
     */
    codecPreferences: Gst.Caps
    /**
     * The transceiver's current directionality, or none if the
     * transceiver is stopped or has never participated in an exchange
     * of offers and answers. To change the transceiver's
     * directionality, set the value of the direction property.
     */
    readonly currentDirection: WebRTCRTPTransceiverDirection
    /**
     * Direction of the transceiver.
     */
    direction: WebRTCRTPTransceiverDirection
    /**
     * The kind of media this transceiver transports
     */
    readonly kind: WebRTCKind
    /**
     * The media ID of the m-line associated with this transceiver. This
     * association is established, when possible, whenever either a
     * local or remote description is applied. This field is null if
     * neither a local or remote description has been applied, or if its
     * associated m-line is rejected by either a remote offer or any
     * answer.
     */
    readonly mid: string | null
    readonly mlineindex: number
    readonly receiver: WebRTCRTPReceiver
    readonly sender: WebRTCRTPSender
    __gtype__: number

    // Conflicting methods

    /**
     * Increments the reference count on `object`. This function
     * does not take the lock on `object` because it relies on
     * atomic refcounting.
     * 
     * This object returns the input parameter to ease writing
     * constructs like :
     *  result = gst_object_ref (object->parent);
     * @returns A pointer to @object
     */
    ref(): Gst.Object

    // Overloads of ref

    /**
     * Increases the reference count of `object`.
     * 
     * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
     * of `object` will be propagated to the return type (using the GCC typeof()
     * extension), so any casting the caller needs to do on the return type must be
     * explicit.
     * @returns the same @object
     */
    ref(): GObject.Object
    /**
     * Increases the reference count of `object`.
     * 
     * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
     * of `object` will be propagated to the return type (using the GCC typeof()
     * extension), so any casting the caller needs to do on the return type must be
     * explicit.
     * @returns the same @object
     */
    ref(): GObject.Object

    // Class property signals of GstWebRTC-1.0.GstWebRTC.WebRTCRTPTransceiver

    connect(sigName: "notify::codec-preferences", callback: (...args: any[]) => void): number
    on(sigName: "notify::codec-preferences", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::codec-preferences", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::codec-preferences", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::codec-preferences", ...args: any[]): void
    connect(sigName: "notify::current-direction", callback: (...args: any[]) => void): number
    on(sigName: "notify::current-direction", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::current-direction", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::current-direction", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::current-direction", ...args: any[]): void
    connect(sigName: "notify::direction", callback: (...args: any[]) => void): number
    on(sigName: "notify::direction", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::direction", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::direction", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::direction", ...args: any[]): void
    connect(sigName: "notify::kind", callback: (...args: any[]) => void): number
    on(sigName: "notify::kind", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::kind", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::kind", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::kind", ...args: any[]): void
    connect(sigName: "notify::mid", callback: (...args: any[]) => void): number
    on(sigName: "notify::mid", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::mid", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::mid", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::mid", ...args: any[]): void
    connect(sigName: "notify::mlineindex", callback: (...args: any[]) => void): number
    on(sigName: "notify::mlineindex", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::mlineindex", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::mlineindex", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::mlineindex", ...args: any[]): void
    connect(sigName: "notify::receiver", callback: (...args: any[]) => void): number
    on(sigName: "notify::receiver", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::receiver", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::receiver", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::receiver", ...args: any[]): void
    connect(sigName: "notify::sender", callback: (...args: any[]) => void): number
    on(sigName: "notify::sender", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::sender", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::sender", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::sender", ...args: any[]): void
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

/**
 * Mostly matches the WebRTC RTCRtpTransceiver interface.
 * @class 
 */
class WebRTCRTPTransceiver extends Gst.Object {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCRTPTransceiver

    static name: string

    // Constructors of GstWebRTC-1.0.GstWebRTC.WebRTCRTPTransceiver

    constructor(config?: WebRTCRTPTransceiver.ConstructorProperties) 
    _init(config?: WebRTCRTPTransceiver.ConstructorProperties): void
}

module WebRTCSCTPTransport {

    // Constructor properties interface

    interface ConstructorProperties extends Gst.Object.ConstructorProperties {
    }

}

interface WebRTCSCTPTransport {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCSCTPTransport

    readonly maxChannels: number
    readonly maxMessageSize: number
    readonly state: WebRTCSCTPTransportState
    readonly transport: WebRTCDTLSTransport
    __gtype__: number

    // Conflicting methods

    /**
     * Increments the reference count on `object`. This function
     * does not take the lock on `object` because it relies on
     * atomic refcounting.
     * 
     * This object returns the input parameter to ease writing
     * constructs like :
     *  result = gst_object_ref (object->parent);
     * @returns A pointer to @object
     */
    ref(): Gst.Object

    // Overloads of ref

    /**
     * Increases the reference count of `object`.
     * 
     * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
     * of `object` will be propagated to the return type (using the GCC typeof()
     * extension), so any casting the caller needs to do on the return type must be
     * explicit.
     * @returns the same @object
     */
    ref(): GObject.Object
    /**
     * Increases the reference count of `object`.
     * 
     * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
     * of `object` will be propagated to the return type (using the GCC typeof()
     * extension), so any casting the caller needs to do on the return type must be
     * explicit.
     * @returns the same @object
     */
    ref(): GObject.Object

    // Class property signals of GstWebRTC-1.0.GstWebRTC.WebRTCSCTPTransport

    connect(sigName: "notify::max-channels", callback: (...args: any[]) => void): number
    on(sigName: "notify::max-channels", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::max-channels", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::max-channels", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::max-channels", ...args: any[]): void
    connect(sigName: "notify::max-message-size", callback: (...args: any[]) => void): number
    on(sigName: "notify::max-message-size", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::max-message-size", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::max-message-size", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::max-message-size", ...args: any[]): void
    connect(sigName: "notify::state", callback: (...args: any[]) => void): number
    on(sigName: "notify::state", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::state", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::state", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::state", ...args: any[]): void
    connect(sigName: "notify::transport", callback: (...args: any[]) => void): number
    on(sigName: "notify::transport", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    once(sigName: "notify::transport", callback: (...args: any[]) => void, after?: boolean): NodeJS.EventEmitter
    off(sigName: "notify::transport", callback: (...args: any[]) => void): NodeJS.EventEmitter
    emit(sigName: "notify::transport", ...args: any[]): void
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

class WebRTCSCTPTransport extends Gst.Object {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCSCTPTransport

    static name: string

    // Constructors of GstWebRTC-1.0.GstWebRTC.WebRTCSCTPTransport

    constructor(config?: WebRTCSCTPTransport.ConstructorProperties) 
    _init(config?: WebRTCSCTPTransport.ConstructorProperties): void
}

interface WebRTCDTLSTransportClass {
}

abstract class WebRTCDTLSTransportClass {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCDTLSTransportClass

    static name: string
}

interface WebRTCDataChannelClass {
}

abstract class WebRTCDataChannelClass {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCDataChannelClass

    static name: string
}

interface WebRTCICETransportClass {
}

abstract class WebRTCICETransportClass {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCICETransportClass

    static name: string
}

interface WebRTCRTPReceiverClass {
}

abstract class WebRTCRTPReceiverClass {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCRTPReceiverClass

    static name: string
}

interface WebRTCRTPSenderClass {
}

abstract class WebRTCRTPSenderClass {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCRTPSenderClass

    static name: string
}

interface WebRTCRTPTransceiverClass {
}

abstract class WebRTCRTPTransceiverClass {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCRTPTransceiverClass

    static name: string
}

interface WebRTCSCTPTransportClass {
}

abstract class WebRTCSCTPTransportClass {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCSCTPTransportClass

    static name: string
}

interface WebRTCSessionDescription {

    // Own fields of GstWebRTC-1.0.GstWebRTC.WebRTCSessionDescription

    /**
     * the #GstWebRTCSDPType of the description
     * @field 
     */
    type: WebRTCSDPType
    /**
     * the #GstSDPMessage of the description
     * @field 
     */
    sdp: GstSdp.SDPMessage

    // Owm methods of GstWebRTC-1.0.GstWebRTC.WebRTCSessionDescription

    copy(): WebRTCSessionDescription
    /**
     * Free `desc` and all associated resources
     */
    free(): void
}

/**
 * See <https://www.w3.org/TR/webrtc/#rtcsessiondescription-class>
 * @record 
 */
class WebRTCSessionDescription {

    // Own properties of GstWebRTC-1.0.GstWebRTC.WebRTCSessionDescription

    static name: string

    // Constructors of GstWebRTC-1.0.GstWebRTC.WebRTCSessionDescription

    constructor(type: WebRTCSDPType, sdp: GstSdp.SDPMessage) 
    static new(type: WebRTCSDPType, sdp: GstSdp.SDPMessage): WebRTCSessionDescription
}

}

export default GstWebRTC;
// END