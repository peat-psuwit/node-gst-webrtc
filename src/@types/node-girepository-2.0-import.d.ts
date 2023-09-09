
type GIRepository20 = typeof import('./node-girepository-2.0.js').default;

declare global {
    interface NodeGtkGi {
        require(ns: 'GIRepository', ver?: '2.0'): GIRepository20;
    }
}

export default NodeGtkGi;

