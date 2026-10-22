/**
 * Stand-in for Node built-ins (`fs`, `path`, `sharp`, `onnxruntime-node`)
 * when Transformers.js is bundled for the browser worker. An empty module
 * tells the library to use the remote WASM build instead of the filesystem.
 */
const empty = {};

export default empty;
