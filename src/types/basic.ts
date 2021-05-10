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

export type UpdateResponse = NullType;

export enum ActionTypes {
  Set = 'set',
  Trim = 'trim',
  Increment = 'increment',
  Append = 'append',
  Prepend = 'prepend',
}

export class Action {
  public readonly operation: ActionTypes;

  public readonly value: any;

  constructor(action: ActionTypes, value?: any) {
    this.operation = action;
    this.value = value;
  }
}
