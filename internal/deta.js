const _Base = require('./services/base');
const email = require('./services/email');
const _Config = require('./config');


class Deta {
  constructor(projectKey, host) {
    const config = new _Config(projectKey, host);
    this.getConfig = () => config;
  }

  get config() {
    return this.getConfig();
  }
  
  async sendEmail(to, subj, mess, charset) {
    return email(to, subj, mess, charset);
  }


  Base(tableName) {
    return new _Base(this, tableName);
  }
}

module.exports = Deta;
