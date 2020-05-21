const BaseService = require('./base-service');

class Base extends BaseService {
  constructor(deta, tableName) {
    super(deta);
    this.getTableName = () => tableName;
  }

  get tableName() {
    return this.getTableName();
  }

  async get(key) {
    if (typeof key !== 'string') throw new TypeError('Key must be a string');

    // request method is GET by default
    const { status, response } = await this.request(
      `/${this.tableName}/items/${key}`
    );

    if (status === 404) return null;
    return response;
  }

  async put(item, key) {
    /** store (put) an item in the database. Overrides an item if key already exists.
     *
     * `key` could be provided as function argument or a field in the data object.
     * If `key` is not provided, the server will generate a random 12 chars key.
     */
    const payload =
      item instanceof Object && item.constructor === Object
        ? item
        : { value: item };

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

    const _items = [];

    items.map((item) => {
      if (typeof item !== 'object') _items.push({ value: item });
      else _items.push(item);
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

    if (typeof key !== 'string') throw new TypeError('Key must be a string');

    const { response } = await this.request(
      `/${this.tableName}/items/${key}`,
      {},
      'DELETE'
    );

    return null;
  }

  async insert(item, key) {
    const payload =
      item instanceof Object && item.constructor === Object
        ? item
        : { value: item };

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

  async *fetch(query = [], limit, buffer) {
    /* fetch items from the database.
     * `query` is an optional filter or list of filters. Without filter, it will return the whole db.
     * `limit` is the maximim number of items to be returned. default is None but the maximum is 1MB.
     *
     * Returns a generator, should be looped over until no results are left.
     */

    let _status = undefined;
    let _last = undefined;
    let _items = undefined;
    let _count = 0;

    do {
      const payload = {
        query,
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

      if (_count + items.length > limit) {
        const remainderSize = _count + items.length - limit;

        // terminate the iterator after yielding the leftovers
        yield items.slice(0, limit - remainderSize - 1);
        return;
      }

      yield items;

      _last = last;
      _status = status;
      _items = items;
      _count = _count + items.length;
    } while (_status === 200 && _last && _items.length > 0 && _count < limit);
  }
}
module.exports = Base;
