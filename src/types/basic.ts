export type BasicType = string | number | boolean;

export type NullType = null;

export type UndefinedType = undefined;

export type ObjectType = {
  [key: string]: ObjectType | ArrayType | BasicType | NullType | UndefinedType;
};

export type ArrayType = Array<
  ArrayType | ObjectType | BasicType | NullType | UndefinedType
>;

export type DetaType = ArrayType | ObjectType | BasicType;

export type DeleteResponse = NullType;

export type PutResponse = ObjectType | NullType;

export type GetResponse = ObjectType | NullType;

export type InsertResponse = ObjectType;

export interface PutManyResponse {
  processed: {
    items: ArrayType;
  };
}
