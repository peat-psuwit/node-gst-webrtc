
type GstSdp10 = typeof import('./node-gstsdp-1.0.js').default;

declare global {
    interface NodeGtkGi {
        require(ns: 'GstSdp', ver?: '1.0'): GstSdp10;
    }
}

export default NodeGtkGi;

