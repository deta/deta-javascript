const _Deta = require('./internal/deta');

function Deta(projectKey, host) {
  return new _Deta(projectKey, host);
}

let exportObj = { Deta };

try {
  const { App } = require("detalib");
  exportObj.app = App();
  exportObj.App = App;
} catch (e) {

}

module.exports = exportObj;
