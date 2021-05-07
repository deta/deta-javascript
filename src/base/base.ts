import api from '../constants/api';
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
    this.requests = new Requests(projectKey, baseName);
  }

  /**
   * put data on base
   *
   * @param {DetaType} data
   * @param {string} [key]
   * @returns {Promise<DetaType | NullType>}
   */
  public async put(data: DetaType, key?: string): Promise<DetaType | NullType> {
    const payload: ObjectType[] = [
      {
        ...(isObject(data) ? (data as ObjectType) : { value: data }),
        ...(key && { key }),
      },
    ];

    const { status, response } = await this.requests.put(api.PUT_ITEMS, {
      items: payload,
    });

    return (status === 207 && response?.processed?.items[0]) || null;
  }

  public get() {}

  public delete() {}

  public insert() {}

  public putMany() {}

  public update() {}

  public fetch() {}
}
