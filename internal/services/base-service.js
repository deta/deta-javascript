const fetchModule = require('../fetch');
const https = require('https');

class BaseService {
  constructor(deta) {
    this._getDeta = () => deta;
    const agent = new https.Agent({ keepAlive: true });
    this._getAgent = () => agent;
  }

  get _agent() {
    return this._getAgent();
  }

  get _deta() {
    return this._getDeta();
  }

  get _baseURL() {
    const { projectId, host } = this._deta.config;
    return `https://${host}/${projectId}`;
  }

  get headers() {
    const { projectKey } = this._deta.config;

    return {
      'X-API-Key': projectKey,
      'Content-Type': 'application/json',
    };
  }

  async request(route, payload, method = 'GET') {
    const { fetch: _fetch } = fetchModule;

    const request = {
      method,
      headers: this.headers,
    };

    if (method !== 'GET') request['body'] = JSON.stringify(payload);
    request['agent'] = this._agent;

    const response = await _fetch(`${this._baseURL}${route}`, request);
    const status = response.status;

    const data = await response.json();
    return { status, response: data };
  }
}

module.exports = BaseService;
