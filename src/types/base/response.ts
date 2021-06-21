import { NullType, ObjectType, ArrayType } from '../basic';

export type DeleteResponse = NullType;

export type PutResponse = ObjectType | NullType;

export type GetResponse = ObjectType | NullType;

export type InsertResponse = ObjectType;

export interface PutManyResponse {
  processed: {
    items: ArrayType;
  };
}

export type UpdateResponse = NullType;

export type FetchResponse = AsyncGenerator<ObjectType[], void, void>;

export interface CollectResponse {
  items: ObjectType[];
  paging: {
    size: number;
    last: string;
  };
}
