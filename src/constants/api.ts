export const BaseApi = {
  PUT_ITEMS: '/items',
  QUERY_ITEMS: '/query',
  INSERT_ITEMS: '/items',
  GET_ITEMS: '/items/:key',
  PATCH_ITEMS: '/items/:key',
  DELETE_ITEMS: '/items/:key',
};

export const DriveApi = {
  GET_FILE: '/files/download?name=:name',
  DELETE_FILES: '/files',
  LIST_FILES:
    '/files?prefix=:prefix&recursive=:recursive&limit=:limit&last=:last',
  INIT_CHUNK_UPLOAD: '/uploads?name=:name',
  UPLOAD_FILE_CHUNK: '/uploads/:uid/parts?name=:name&part=:part',
  COMPLETE_FILE_UPLOAD: '/uploads/:uid?name=:name',
};
