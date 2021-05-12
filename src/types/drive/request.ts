export interface PutOptions {
  data?: string | Buffer;
  path?: string;
  contentType?: string;
}

export interface ListOptions {
  prefix?: string;
  limit?: number;
  last?: string;
}
