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

    if (items.length >= 25)
      throw new Error("We can't put more than 25 items at a time");

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
}
module.exports = Base;
