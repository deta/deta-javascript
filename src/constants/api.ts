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
  LIST_FILES: '/files?prefix=:prefix&limit=:limit&last=:last',
};
