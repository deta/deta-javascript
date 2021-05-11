import { NullType } from '../basic';

export type GetResponse = Buffer | NullType;

export type DeleteResponse = string;

export interface DeleteManyResponse {
  deleted: string[];
  failed: { [key: string]: string };
}

export type ListResponse = AsyncGenerator<string[], void, void>;
