import axios, { AxiosRequestConfig } from 'axios';

export default class Requests {
  private host: string = 'https://database.deta.sh/v1/:project_id/:base_name';

  private requestConfig: AxiosRequestConfig;

  /**
   * Requests constructor
   *
   * @param {string} projectKey
   * @param {string} baseName
   */
  constructor(projectKey: string, baseName: string) {
    const [projectId] = projectKey.split('_');

    const baseURL = this.host
      .replace(':project_id', projectId)
      .replace(':base_name', baseName);

    this.requestConfig = {
      baseURL,
      headers: {
        'X-API-Key': projectKey,
        'Content-Type': 'application/json',
      },
    };
  }

  /**
   * put sends a HTTP put request
   *
   * @param {string} uri
   * @param {any} payload
   * @returns {Promise<any>}
   */
  public async put(uri: string, payload: any): Promise<any> {
    try {
      const { status, data } = await axios.put(
        uri,
        payload,
        this.requestConfig
      );
      return { status, response: data };
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * delete sends a HTTP delete request
   *
   * @param {string} uri
   * @returns {Promise<any>}
   */
  public async delete(uri: string): Promise<any> {
    try {
      const { status, data } = await axios.delete(uri, this.requestConfig);
      return { status, response: data };
    } catch (err) {
      throw new Error(err);
    }
  }
}
