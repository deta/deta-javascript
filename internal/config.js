class Config {
  constructor(config) {
    const _host = config.host || process.env.DETA_BASE_HOST || 'database.deta.sh/v1';

    const _authType = config.authType;

    var _projectKey, _projectId, _authToken;

    if (config.authType === "api-key"){
      _projectKey = config.projectKey || process.env.DETA_PROJECT_KEY;
      if (!_projectKey) {
        throw new Error('Project key is not defined');
      }
      _projectId = _projectKey.split('_')[0];
    } else {
      _authToken = config.authToken;
      _projectId = config.projectId;
    }

    this.getProjectKey = () => _projectKey;
    this.getProjectId = () => _projectId;
    this.getHost = () => _host;
    this.getAuthToken = () => _authToken;
    this.getAuthType = () => _authType;
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

  get authToken(){
    return this.getAuthToken();
  }

  get authType(){
    return this.getAuthType();
  }
}

module.exports = Config;
