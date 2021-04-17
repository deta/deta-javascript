const _Base = require('./services/base');
const email = require('./services/email');
const _Config = require('./config');

class Deta {
  constructor(projectKey, authToken, host) {
    let configParams;
    if (authToken) {
      configParams = {
        authType: 'bearer',
        projectId: projectKey,
        authToken,
        host,
      };
    } else {
      configParams = {
        authType: 'api-key',
        projectKey,
        host,
      };
    }
    const config = new _Config(configParams);
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
