import url from '../constants/url';
import Requests from '../utils/request';
import { DriveApi } from '../constants/api';
import { ObjectType } from '../types/basic';
import { GetResponse, DeleteResponse } from '../types/drive/response';

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
   * get data from drive
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
   * delete data from drive
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
}
