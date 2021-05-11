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

  /**
   * get data from base
   *
   * @param {string} key
   * @returns {Promise<ObjectType | NullType>}
   */
  public async get(key: string): Promise<ObjectType | NullType> {
    const trimedKey = key.trim();
    if (!trimedKey.length) {
      throw new Error('Key is empty');
    }

    const encodedKey = encodeURIComponent(trimedKey);

    const { status, response, error } = await this.requests.get(
      api.GET_ITEMS.replace(':key', encodedKey)
    );

    if (error && status !== 404) {
      throw error;
    }

    if (status === 200) {
      return response;
    }

    return null;
  }

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

    const { error } = await this.requests.delete(
      api.DELETE_ITEMS.replace(':key', encodedKey)
    );
    if (error) {
      throw error;
    }

    return null;
  }

  /**
   * insert data on base
   *
   * @param {DetaType} data
   * @param {string} [key]
   * @returns {Promise<ObjectType>}
   */
  public async insert(data: DetaType, key?: string): Promise<ObjectType> {
    const payload: ObjectType = {
      ...(isObject(data) ? (data as ObjectType) : { value: data }),
      ...(key && { key }),
    };

    const { status, response, error } = await this.requests.post(
      api.INSERT_ITEMS,
      {
        item: payload,
      }
    );
    if (error && status === 409) {
      throw new Error(`Item with key ${key} already exists`);
    }
    if (error) {
      throw error;
    }

    return response;
  }

  public putMany() {}

  public update() {}

  public fetch() {}
}
