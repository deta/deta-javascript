export interface FetchOptions {
  limit?: number;
  last?: string;
}

export interface PutOptions {
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
