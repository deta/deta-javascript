import { NullType, ObjectType, ArrayType } from './basic';

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
