const _Deta = require('./internal/deta');

function Deta(projectKey, host) {
  return new _Deta(projectKey, host);
}

module.exports = Deta;
