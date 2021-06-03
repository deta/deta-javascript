import fetch from 'node-fetch';

// fetch polyfill for nodejs
// @ts-ignore
globalThis.fetch = fetch;

let app; // eslint-disable-line
let App; // eslint-disable-line

try {
  const { App: lib } = require('detalib');
  app = lib();
  App = lib;
} catch {
  // ignore error
}

export { app, App };

export * from './index';
