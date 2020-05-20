const _Base = require('./services/base');
const _Config = require('./config');

class Deta {
  constructor(projectKey, host) {
    const config = new _Config(projectKey, host);
    this.getConfig = () => config;
  }

  get config() {
    return this.getConfig();
  }

  Base(tableName) {
    return new _Base(this, tableName);
  }
}

module.exports = Deta;
