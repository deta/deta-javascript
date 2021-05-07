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

    const { status, data: response, error } = await this.requests.put(
      api.PUT_ITEMS,
      {
        items: payload,
      }
    );

    if (status !== 207 && error) {
      throw error;
    }

    return response?.processed?.items[0];
  }

  public get() {}

  /**
   * delete data on base
   *
   * @param {string} key
   * @returns {Promise<NullType>}
   */
  public async delete(key: string): Promise<NullType> {
    const trimedKey = key.trim();
    if (!trimedKey.length) {
      throw new Error('Key is empty');
    }

    const encodedKey = encodeURIComponent(trimedKey);

    await this.requests.delete(api.DELETE_ITEMS.replace(':key', encodedKey));

    return null;
  }

  public insert() {}

  public putMany() {}

  public update() {}

  public fetch() {}
}
