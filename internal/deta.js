const _Base = require('./services/base');
const mail = require('./deta/internal/mail');
const _Config = require('./config');

class Deta {
  constructor(projectKey, host) {
    const config = new _Config(projectKey, host);
    this.getConfig = () => config;
  }

  get config() {
    return this.getConfig();
  }

  sendMail (to, subject, message, charset = 'UTF-8') {
    return mail(to, subject, message, charset = 'UTF-8');
  }

  Base(tableName) {
    return new _Base(this, tableName);
  }
}

let exportObj = { Deta };

try {
  const App = require("detalib");
  exportObj.app = App();
  exportObj.App = App;
} catch (e) {

}

module.exports = exportObj;