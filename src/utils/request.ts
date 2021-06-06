interface RequestInit {
  payload?: any;
  headers?: { [key: string]: string };
}

interface Request {
  body?: any;
  method?: string;
  baseURL?: string;
  headers?: { [key: string]: string };
}

interface Response {
  status: number;
  response?: any;
  error?: Error;
}

enum Method {
  Put = 'PUT',
  Get = 'GET',
  Post = 'POST',
  Patch = 'PATCH',
  Delete = 'DELETE',
}

export default class Requests {
  private requestConfig: Request;

  /**
   * Requests constructor
   *
   * @param {string} projectKey
   * @param {string} baseURL
   */
  constructor(projectKey: string, baseURL: string) {
    const [projectId] = projectKey.split('_');

    this.requestConfig = {
      baseURL: baseURL.replace(':project_id', projectId),
      headers: {
        'X-API-Key': projectKey,
      },
    };
  }

  /**
   * put sends a HTTP put request
   *
   * @param {string} uri
   * @param {any} payload
   * @returns {Promise<Response>}
   */
  public put(uri: string, payload: any): Promise<Response> {
    return Requests.fetch(uri, {
      ...this.requestConfig,
      body: payload,
      method: Method.Put,
    });
  }

  /**
   * delete sends a HTTP delete request
   *
   * @param {string} uri
   * @param {any} [payload]
   * @returns {Promise<Response>}
   */
  public async delete(uri: string, payload?: any): Promise<Response> {
    return Requests.fetch(uri, {
      ...this.requestConfig,
      body: payload,
      method: Method.Delete,
    });
  }

  /**
   * get sends a HTTP get request
   *
   * @param {string} uri
   * @returns {Promise<Response>}
   */
  public async get(uri: string): Promise<Response> {
    return Requests.fetch(uri, {
      ...this.requestConfig,
      method: Method.Get,
    });
  }

  /**
   * post sends a HTTP post request
   *
   * @param {string} uri
   * @param {any} payload
   * @param {[key: string]: string} headers
   * @returns {Promise<Response>}
   */
  public post(uri: string, init: RequestInit): Promise<Response> {
    return Requests.fetch(uri, {
      ...this.requestConfig,
      body: init.payload,
      method: Method.Post,
      headers: { ...this.requestConfig.headers, ...init.headers },
    });
  }

  /**
   * patch sends a HTTP patch request
   *
   * @param {string} uri
   * @param {any} payload
   * @returns {Promise<Response>}
   */
  public patch(uri: string, payload?: any): Promise<Response> {
    return Requests.fetch(uri, {
      ...this.requestConfig,
      body: payload,
      method: Method.Patch,
    });
  }

  static async fetch(url: string, config: Request): Promise<Response> {
    try {
      const body =
        config.body instanceof Uint8Array
          ? config.body
          : JSON.stringify(config.body);

      const contentType =
        config?.headers?.['Content-Type'] || 'application/json';

      const headers = {
        ...config.headers,
        'Content-Type': contentType,
      };

      const response = await fetch(`${config.baseURL}${url}`, {
        body,
        headers,
        method: config.method,
      });

      if (!response.ok) {
        const data = await response.json();
        const message = data?.errors?.[0] || 'Something went wrong';
        return {
          status: response.status,
          error: new Error(message),
        };
      }

      const blob = await response.blob();

      // check if the response is json
      try {
        const json = JSON.parse(await blob.text());
        return { status: response.status, response: json };
      } catch (err) {
        return { status: response.status, response: blob };
      }
    } catch (err) {
      return { status: 500, error: new Error('Something went wrong') };
    }
  }
}
