import url from '../constants/url';
import Requests from '../utils/request';
import { DriveApi } from '../constants/api';
import { ObjectType } from '../types/basic';

import {
  GetResponse,
  ListResponse,
  DeleteResponse,
  DeleteManyResponse,
} from '../types/drive/response';

export default class Drive {
  private requests: Requests;

  /**
   * Drive constructor
   *
   * @param {string} projectKey
   * @param {string} driveName
   */
  constructor(projectKey: string, driveName: string) {
    const baseURL = url.DRIVE_HOST_URL.replace(':drive_name', driveName);
    this.requests = new Requests(projectKey, baseURL);
  }

  /**
   * get file from drive
   *
   * @param {string} name
   * @returns {Promise<GetResponse>}
   */
  public async get(name: string): Promise<GetResponse> {
    const trimedName = name.trim();
    if (!trimedName.length) {
      throw new Error('Name is empty');
    }

    const encodedName = encodeURIComponent(trimedName);

    const { status, response, error } = await this.requests.get(
      DriveApi.GET_FILE.replace(':name', encodedName)
    );
    if (status === 400 && error) {
      return null;
    }

    if (error) {
      throw error;
    }

    return response;
  }

  /**
   * delete file from drive
   *
   * @param {string} name
   * @returns {Promise<DeleteResponse>}
   */
  public async delete(name: string): Promise<DeleteResponse> {
    const trimedName = name.trim();
    if (!trimedName.length) {
      throw new Error('Name is empty');
    }

    const payload: ObjectType = {
      names: [name],
    };

    const { response, error } = await this.requests.delete(
      DriveApi.DELETE_FILES,
      payload
    );
    if (error) {
      throw error;
    }

    return response?.deleted?.[0] || name;
  }

  /**
   * deleteMany file from drive
   *
   * @param {string[]} names
   * @returns {Promise<DeleteManyResponse>}
   */
  public async deleteMany(names: string[]): Promise<DeleteManyResponse> {
    if (!names.length) {
      throw new Error("Names can't be empty");
    }

    if (names.length > 1000) {
      throw new Error("We can't delete more than 1000 items at a time");
    }

    const payload: ObjectType = {
      names,
    };

    const { status, response, error } = await this.requests.delete(
      DriveApi.DELETE_FILES,
      payload
    );

    if (status === 400 && error) {
      throw new Error("Names can't be empty");
    }

    if (error) {
      throw error;
    }

    return response;
  }

  /**
   * list files from drive
   *
   * @param {number} [limit]
   * @param {string} [prefix]
   * @returns {ListResponse}
   */
  public async *list(limit: number = 1000, prefix: string = ''): ListResponse {
    const uri = DriveApi.LIST_FILES.replace(':prefix', prefix);

    let lastValue = '';

    while (true) {
      const finalUrl = uri
        .replace(':limit', limit.toString())
        .replace(':last', lastValue);

      const { response, error } = await this.requests.get(finalUrl);
      if (error) {
        throw error;
      }

      yield response.names;

      lastValue = response?.paging?.last;

      if (!lastValue) {
        break;
      }
    }
  }
}
