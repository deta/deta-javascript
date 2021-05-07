import axios, { AxiosRequestConfig } from 'axios';

export default class Requests {
  private host: string = 'https://database.deta.sh/v1/:project_id/:base_name';

  private requestConfig: AxiosRequestConfig;

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
}
