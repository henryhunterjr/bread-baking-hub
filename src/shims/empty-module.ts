// Empty shim to prevent bundling server-only modules like 'jsdom' into the browser build.
// Any code that imports 'jsdom' in the client will receive this harmless stub instead.
export default {} as any;
export const JSDOM = undefined as any;
