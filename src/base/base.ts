import api from '../constants/api';
import url from '../constants/url';
import Requests from '../utils/request';
import { isObject } from '../utils/object';
import { DetaType, NullType, ObjectType } from '../types/basic';

export default class Base {
  private requests: Requests;

  /**
   * Base constructor
   *
   * @param {string} projectKey
   * @param {string} baseName
   */
  constructor(projectKey: string, baseName: string) {
    const baseURL = url.BASE_HOST_URL.replace(':base_name', baseName);
    this.requests = new Requests(projectKey, baseURL);
  }

  /**
   * put data on base
   *
   * @param {DetaType} data
   * @param {string} [key]
   * @returns {Promise<ObjectType | NullType>}
   */
  public async put(
    data: DetaType,
    key?: string
  ): Promise<ObjectType | NullType> {
    const payload: ObjectType[] = [
      {
        ...(isObject(data) ? (data as ObjectType) : { value: data }),
        ...(key && { key }),
      },
    ];

    const { response, error } = await this.requests.put(api.PUT_ITEMS, {
      items: payload,
    });
    if (error) {
      throw error;
    }

    return response?.processed?.items?.[0] || null;
  }

  public get() {}

  public delete() {}

  public insert() {}

  public putMany() {}

  public update() {}

  public fetch() {}
}
