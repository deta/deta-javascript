class Config {
  constructor(projectKey, host) {
    /*  "a" is the region (used by the backend)
     *  "0" is a reserved flag, might be used by the backend
     *  "abcxyz" is the project id.
     *  "_" is a separator
     *  "somerandomstring..." is the actual secret part of the key. */

    const frags = projectKey.split('_');

    const projectId = frags[0].substring(2);

    const _host = host || process.env.DETA_BASE_HOST;
    if (!_host) throw new Error('Host not defined!');

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
