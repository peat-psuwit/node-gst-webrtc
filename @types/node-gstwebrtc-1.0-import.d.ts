
type GstWebRTC10 = typeof import('./node-gstwebrtc-1.0.js').default;

declare global {
    interface NodeGtkGi {
        require(ns: 'GstWebRTC', ver?: '1.0'): GstWebRTC10;
    }
}

export default NodeGtkGi;

