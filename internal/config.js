class Config {
  constructor(projectKey, host) {

    const frags = projectKey.split('_');

    const projectId = frags[0];

    const _host = host || process.env.DETA_BASE_HOST || 'database.deta.sh/v1';

    this.getProjectKey = () => projectKey;
    this.getProjectId = () => projectId;
    this.getHost = () => _host;
  }

  get projectKey() {
    return this.getProjectKey();
  }

  get projectId() {
    return this.getProjectId();
  }

  get host() {
    return this.getHost();
  }
}

module.exports = Config;
