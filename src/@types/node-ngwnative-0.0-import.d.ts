
type NgwNative00 = typeof import('./node-ngwnative-0.0.js').default;

declare global {
    interface NodeGtkGi {
        require(ns: 'NgwNative', ver?: '0.0'): NgwNative00;
    }
}

export default NodeGtkGi;

