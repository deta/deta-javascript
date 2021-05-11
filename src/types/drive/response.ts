import { NullType } from '../basic';

export type GetResponse = Buffer | NullType;

export type DeleteResponse = string;

export interface DeleteManyResponse {
  deleted: string[];
  failed: { [key: string]: string };
}
