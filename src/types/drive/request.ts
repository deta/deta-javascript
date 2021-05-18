export interface PutOptions {
  data?: string | Uint8Array;
  path?: string;
  contentType?: string;
}

export interface ListOptions {
  prefix?: string;
  limit?: number;
  last?: string;
}
