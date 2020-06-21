const _Base = require('./services/base');
const email = require('./services/mail');
const _Config = require('./config');


class Deta {
  constructor(projectKey, host) {
    const config = new _Config(projectKey, host);
    this.getConfig = () => config;
  }

  get config() {
    return this.getConfig();
  }
  
  async sendMail(to, subj, mess, charSet) {
    return email(to, subj, mess, charSet);
  }


  Base(tableName) {
    return new _Base(this, tableName);
  }
}

module.exports = Deta;
