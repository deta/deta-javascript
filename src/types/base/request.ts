export interface FetchOptions {
  limit?: number;
  last?: string;
  desc?: boolean;
}

export interface PutOptions {
  expireIn?: number;
  expireAt?: Date | number;
}

export interface InsertOptions {
  expireIn?: number;
  expireAt?: Date | number;
}

export interface PutManyOptions {
  expireIn?: number;
  expireAt?: Date | number;
}

export interface UpdateOptions {
  expireIn?: number;
  expireAt?: Date | number;
}
