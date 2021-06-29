import { Action } from './action';

export type BasicType = string | number | boolean;

export type NullType = null;

export type UndefinedType = undefined;

export type ObjectType = {
  [key: string]:
    | ObjectType
    | ArrayType
    | BasicType
    | NullType
    | UndefinedType
    | Action;
};

export type ArrayType = Array<
  ArrayType | ObjectType | BasicType | NullType | UndefinedType
>;

export type CompositeType = ArrayType | ObjectType;

export type DetaType = ArrayType | ObjectType | BasicType;
