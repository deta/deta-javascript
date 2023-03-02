import fetch from 'node-fetch';

// fetch polyfill for nodejs
if (!globalThis.fetch) {
  // @ts-ignore
  globalThis.fetch = fetch;
}

export * from './index';
