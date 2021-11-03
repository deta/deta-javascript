import fetch from 'node-fetch';
import { DetaLib, DetaLibApp } from './types/libjs';

// fetch polyfill for nodejs
if (!globalThis.fetch) {
  // @ts-ignore
  globalThis.fetch = fetch;
}

let app: DetaLib;
let App: DetaLibApp;

try {
  const { App: lib } = require('detalib');
  app = lib();
  App = lib;
} catch {
  // ignore error
}

export { app, App };

export * from './index';
