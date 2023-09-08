
type Gst10 = typeof import('./node-gst-1.0.js').default;

declare global {
    interface NodeGtkGi {
        require(ns: 'Gst', ver?: '1.0'): Gst10;
    }
}

export default NodeGtkGi;

