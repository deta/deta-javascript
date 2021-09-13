import BaseUtils from './utils';
import url from '../constants/url';
import { KeyType } from '../types/key';
import Requests from '../utils/request';
import { BaseApi } from '../constants/api';
import { isObject } from '../utils/object';
import { FetchOptions } from '../types/base/request';
import { Action, ActionTypes } from '../types/action';
import { DetaType, CompositeType, ArrayType, ObjectType } from '../types/basic';

import {
  GetResponse,
  PutResponse,
  FetchResponse,
  DeleteResponse,
  InsertResponse,
  UpdateResponse,
  PutManyResponse,
} from '../types/base/response';

export default class Base {
  private requests: Requests;

  public util: BaseUtils;

  /**
   * Base constructor
   *
   * @param {string} key
   * @param {KeyType} type
   * @param {string} projectId
   * @param {string} baseName
   * @param {string} [host]
   */
  constructor(
    key: string,
    type: KeyType,
    projectId: string,
    baseName: string,
    host?: string
  ) {
    const baseURL = url
      .base(host)
      .replace(':base_name', baseName)
      .replace(':project_id', projectId);
    this.requests = new Requests(key, type, baseURL);
    this.util = new BaseUtils();
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

    const { response, error } = await this.requests.put(BaseApi.PUT_ITEMS, {
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
    const trimmedKey = key?.trim();
    if (!trimmedKey) {
      throw new Error('Key is empty');
    }
    const encodedKey = encodeURIComponent(trimmedKey);

    const { status, response, error } = await this.requests.get(
      BaseApi.GET_ITEMS.replace(':key', encodedKey)
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
    const trimmedKey = key?.trim();
    if (!trimmedKey) {
      throw new Error('Key is empty');
    }
    const encodedKey = encodeURIComponent(trimmedKey);

    const { error } = await this.requests.delete(
      BaseApi.DELETE_ITEMS.replace(':key', encodedKey)
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
      BaseApi.INSERT_ITEMS,
      {
        payload: {
          item: payload,
        },
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
   * @param {DetaType[]} items
   * @returns {Promise<PutManyResponse>}
   */
  public async putMany(items: DetaType[]): Promise<PutManyResponse> {
    if (!(items instanceof Array)) {
      throw new Error('Items must be an array');
    }

    if (!items.length) {
      throw new Error("Items can't be empty");
    }

    if (items.length > 25) {
      throw new Error("We can't put more than 25 items at a time");
    }

    const payload: ObjectType[] = items.map((item) =>
      isObject(item) ? (item as ObjectType) : { value: item }
    );

    const { response, error } = await this.requests.put(BaseApi.PUT_ITEMS, {
      items: payload,
    });
    if (error) {
      throw error;
    }

    return response;
  }

  /**
   * update data on base
   *
   * @param {ObjectType} updates
   * @param {string} key
   * @returns {Promise<UpdateResponse>}
   */
  public async update(
    updates: ObjectType,
    key: string
  ): Promise<UpdateResponse> {
    const trimmedKey = key?.trim();
    if (!trimmedKey) {
      throw new Error('Key is empty');
    }
    const payload: {
      set: ObjectType;
      increment: ObjectType;
      append: ObjectType;
      prepend: ObjectType;
      delete: ArrayType;
    } = {
      set: {},
      increment: {},
      append: {},
      prepend: {},
      delete: [],
    };

    Object.entries(updates).forEach(([objKey, objValue]) => {
      const action =
        objValue instanceof Action
          ? objValue
          : new Action(ActionTypes.Set, objValue);

      const { operation, value } = action;
      switch (operation) {
        case ActionTypes.Trim: {
          payload.delete.push(objKey);
          break;
        }
        default: {
          payload[operation][objKey] = value;
        }
      }
    });

    const encodedKey = encodeURIComponent(trimmedKey);
    const { error } = await this.requests.patch(
      BaseApi.PATCH_ITEMS.replace(':key', encodedKey),
      payload
    );
    if (error) {
      throw error;
    }

    return null;
  }

  /**
   * fetch data from base
   *
   * @param {CompositeType} [query]
   * @param {FetchOptions} [options]
   * @returns {Promise<FetchResponse>}
   */
  public async fetch(
    query: CompositeType = [],
    options?: FetchOptions
  ): Promise<FetchResponse> {
    const { limit = 1000, last = '' } = options || {};

    const payload = {
      query: Array.isArray(query) ? query : [query],
      limit,
      last,
    };

    const { response, error } = await this.requests.post(BaseApi.QUERY_ITEMS, {
      payload,
    });
    if (error) {
      throw error;
    }

    const { items, paging } = response;
    const { size: count, last: resLast } = paging;

    return { items, count, last: resLast };
  }
}
