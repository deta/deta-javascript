const fetchModule = require('../fetch');
const https = require('https');
const { FetchError } = require('node-fetch');

class BaseService {
  constructor(deta) {
    this._getDeta = () => deta;
    const options = {keepAlive: true};
    const agent = new https.Agent(options);
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
    const { projectKey, authToken, authType } = this._deta.config;

    if (authType === "api-key"){
      return {
        'X-API-Key': projectKey,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Authorization': authToken,
      'Content-Type': 'application/json'
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

    var response = {};
    try {
      response = await _fetch(`${this._baseURL}${route}`, request);
    } catch (e){
      // retry on fetchError
      if (e instanceof FetchError){
        response = await _fetch(`${this._baseURL}${route}`, request);
      } else{
        throw e
      }
    }
    
    const status = response.status;
    if (status === 401){
      throw new Error("Unauthorized");
    }

    const data = await response.json();
    return { status, response: data };
  }
}

module.exports = BaseService;
