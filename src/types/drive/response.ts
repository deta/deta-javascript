import { NullType } from '../basic';

export type GetResponse = Uint8Array | NullType;

export type DeleteResponse = string;

export interface DeleteManyResponse {
  deleted: string[];
  failed: { [key: string]: string };
}

export interface ListResponse {
  names: string[];
  paging: {
    size: number;
    last: string;
  };
}

export type PutResponse = string;

export interface UploadResponse {
  response?: any;
  error?: Error;
}
