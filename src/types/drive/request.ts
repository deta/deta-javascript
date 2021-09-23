export interface PutOptions {
  data?: string | Uint8Array | Buffer;
  path?: string;
  contentType?: string;
}

export interface ListOptions {
  recursive?: boolean;
  prefix?: string;
  limit?: number;
  last?: string;
}
