import api from '../constants/api';
import Requests from '../utils/request';
import { isObject } from '../utils/object';
import {
  DetaType,
  ObjectType,
  GetResponse,
  PutResponse,
  DeleteResponse,
  InsertResponse,
  PutManyResponse,
} from '../types/basic';

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
   * @returns {Promise<PutResponse>}
   */
  public async put(data: DetaType, key?: string): Promise<PutResponse> {
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
   * @returns {Promise<GetResponse>}
   */
  public async get(key: string): Promise<GetResponse> {
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
   * @returns {Promise<DeleteResponse>}
   */
  public async delete(key: string): Promise<DeleteResponse> {
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
   * @returns {Promise<InsertResponse>}
   */
  public async insert(data: DetaType, key?: string): Promise<InsertResponse> {
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

  /**
   * putMany data on base
   *
   * @param {DetaType} items
   * @returns {Promise<PutManyResponse>}
   */
  public async putMany(items: DetaType[]): Promise<PutManyResponse> {
    if (!(items instanceof Array)) {
      throw new Error('Items must be an array');
    }

    if (items.length > 25) {
      throw new Error("We can't put more than 25 items at a time");
    }

    const payload: ObjectType[] = items.map((item) =>
      isObject(item) ? (item as ObjectType) : { value: item }
    );

    const { response, error } = await this.requests.put(api.PUT_ITEMS, {
      items: payload,
    });
    if (error) {
      throw error;
    }

    return response;
  }

  public update() {}

  public fetch() {}
}
