const BaseService = require('./base-service');

let isObject = i => Object.prototype.toString.call(i) === "[object Object]";

class Trim{}

class Increment{
  constructor(value){
    this.val = value;
    if (!value){
      this.val = 1 
    }
  }
}

class Append{
  constructor(value){
    this.val = value;
    if (!Array.isArray(value)){
      this.val = [value];
    }
  }
}

class Prepend{
  constructor(value){
    this.val = value;
    if (!Array.isArray(value)){
      this.val = [value];
    }
  }
}


class Base extends BaseService {
  constructor(deta, tableName) {
    super(deta);
    this.getTableName = () => tableName;
    this.util = {
      trim : () => new Trim(),
      increment: (value) => new Increment(value),
      append: (value) => new Append(value),
      prepend: (value) => new Prepend(value)
    };
  }

  get tableName() {
    return this.getTableName();
  }

  async get(key) {
    if (typeof key !== 'string') {
      throw new TypeError('Key must be a string');
    } else if (key === ''){
      throw new Error('Key is empty')
    }

    // encode key
    key = encodeURIComponent(key)

    // request method is GET by default
    const { status, response } = await this.request(
      `/${this.tableName}/items/${key}`
    );

    if (status === 404) {
      return null;
    } else if (status === 400){
      throw new Error(response.errors[0])
    }
    return response;
  }

  async put(item, key) {
    /** store (put) an item in the database. Overrides an item if key already exists.
     *
     * `key` could be provided as function argument or a field in the data object.
     * If `key` is not provided, the server will generate a random 12 chars key.
     */
    const payload = isObject(item) ? item : { value: item };

    if (key) payload['key'] = key;

    const { status, response } = await this.request(
      `/${this.tableName}/items`,
      {
        items: [payload],
      },
      'PUT'
    );

    return response && status === 207
      ? response['processed']['items'][0]
      : null;
  }

  async putMany(items) {
    if (!(items instanceof Array))
      throw new TypeError('Items must be an array');

    if (items.length >= 25)
      throw new Error("We can't put more than 25 items at a time");

    const _items = [];

    items.map((item) => {
      if (isObject(item)) _items.push(item);
      else _items.push({ value: item });
    });

    const { status, response } = await this.request(
      `/${this.tableName}/items`,
      {
        items: _items,
      },
      'PUT'
    );
    return response;
  }

  async delete(key) {
    /* Delete an item from the database
     * key: the key of item to be deleted
     */

    if (typeof key !== 'string') {
      throw new TypeError('Key must be a string');
    } else if (key === ''){
      throw new Error('Key is empty')
    }

    // encode key
    key = encodeURIComponent(key)
    const { response } = await this.request(
      `/${this.tableName}/items/${key}`,
      {},
      'DELETE'
    );

    return null;
  }

  async insert(item, key) {

    const payload = isObject(item) ? item : { value: item };
    if (key) payload['key'] = key;

    const { status, response } = await this.request(
      `/${this.tableName}/items`,
      {
        item: payload,
      },
      'POST'
    );

    if (status === 201) return response;
    else if (status == 409)
      throw new Error(`Item with key ${key} already exists`);
  }

  async *fetch(query = [], pages = 10, buffer = undefined) {
    /* Fetch items from the database.
     *
     * 'query' is a filter or a list of filters. Without filter, it'll return the whole db
     * Returns a generator with all the result.
     *  We will paginate the request based on `buffer`.
     */
    if (pages <= 0) return;
    const _query = Array.isArray(query) ? query : [query];

    let _status;
    let _last;
    let _items;
    let _count = 0;

    do {
      const payload = {
        query: _query,
        limit: buffer,
        last: _last,
      };

      const { status, response } = await this.request(
        `/${this.tableName}/query`,
        payload,
        'POST'
      );

      const { paging, items } = response;
      const { last } = paging;

      yield items;

      _last = last;
      _status = status;
      _items = items;
      _count += 1;
    } while (_status === 200 && _last && pages > _count);
  }

  async update(updates, key){
    if(typeof key !== 'string') {
      throw new TypeError('Key must be a string');
    } else if (key === ''){
      throw new Error('Key is empty');
    }

    if(!isObject(updates)) throw new TypeError('Updates must be a JSON object');

    const payload = {set: {}, increment: {}, append: {}, prepend: {}, delete: []};
    
    for (let [key, value] of Object.entries(updates)) {
      if (value instanceof Trim){
        payload.delete.push(key);
      } else if (value instanceof Increment){
        payload.increment[key] = value.val;
      } else if (value instanceof Append){
        payload.append[key] = value.val;
      } else if (value instanceof Prepend){
        payload.prepend[key] = value.val;
      } else {
        payload.set[key] = value;
      }
    }

    // encode key
    key = encodeURIComponent(key)
    const {status, response } = await this.request(
      `/${this.tableName}/items/${key}`,
      payload, 
      'PATCH'
    );

    if (status == 200){
      return null;
    } else if (status == 404){
      throw new Error(`Key '${key}' not found`);
    } else{
      throw new Error(response.errors[0]);
    }
  }
}
module.exports = Base;