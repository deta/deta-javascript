import axios, { AxiosInstance, AxiosInterceptorManager } from 'axios';

interface Response {
  status: number;
  data: any;
  error?: Error;
}

export default class Requests {
  private host: string = 'https://database.deta.sh/v1/:project_id/:base_name';

  private api: AxiosInstance;

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

    this.api = axios.create({
      baseURL,
      headers: {
        'X-API-Key': projectKey,
        'Content-Type': 'application/json',
      },
    });

    const responseInterceptor: AxiosInterceptorManager<Response> = this.api
      .interceptors.response;

    responseInterceptor.use(
      (response) => {
        const { status, data } = response;
        return { status, data };
      },
      (error) => {
        const { response } = error;
        const { status, data } = response;
        const { errors } = data;
        return { status, error: new Error(errors[0]) };
      }
    );
  }

  /**
   * put sends a HTTP put request
   *
   * @param {string} uri
   * @param {any} payload
   * @returns {Promise<Response>}
   */
  public put(uri: string, payload: any): Promise<Response> {
    return this.api.put(uri, payload);
  }
}
