const { Deta } = require('../index.js');

const db = Deta(process.env.PROJECT_KEY).Base(process.env.DB_NAME);

describe('Test base', () => {
  describe('can load env', () => {
    it('PROJECT_KEY', () => {
      expect(process.env.PROJECT_KEY).toBeDefined();
      expect(process.env.PROJECT_KEY.trim()).not.toEqual('');
    });

    it('DB_NAME', () => {
      expect(process.env.DB_NAME).toBeDefined();
      expect(process.env.DB_NAME.trim()).not.toEqual('');
    });
  });

  describe('Base#put', () => {
    it.each([
      [
        { name: 'alex', age: 77 },
        { name: 'alex', age: 77 },
      ],
      ['hello, worlds', { value: 'hello, worlds' }],
      [7, { value: 7 }],
    ])(
      'by only passing data, without key `put(%p)`',
      async (input, expected) => {
        const data = await db.put(input);
        expect(data).toEqual(expect.objectContaining(expected));
        const deleteRes = await db.delete(data.key);
        expect(deleteRes).toBeNull();
      }
    );

    it('by passing data and key in object itself', async () => {
      const input = { name: 'alex', age: 77, key: 'one' };
      const data = await db.put(input);
      expect(data).toEqual(input);
    });

    it.each([
      [{ name: 'alex', age: 77 }, 'two', { name: 'alex', age: 77, key: 'two' }],
      ['hello, worlds', 'three', { value: 'hello, worlds', key: 'three' }],
      [7, 'four', { value: 7, key: 'four' }],
      [['a', 'b', 'c'], 'my_abc', { value: ['a', 'b', 'c'], key: 'my_abc' }],
    ])(
      'by passing data as first parameter and key as second parameter `put(%p, "%s")`',
      async (value, key, expected) => {
        const data = await db.put(value, key);
        expect(data).toEqual(expected);
      }
    );
  });

  describe('Base#get', () => {
    it.each([
      ['one', { name: 'alex', age: 77, key: 'one' }],
      ['this is some random key', null],
    ])('get data by using key `get("%s")`', async (key, expected) => {
      const data = await db.get(key);
      expect(data).toEqual(expected);
    });
  });

  describe('Base#insert', () => {
    it.each([
      [
        { name: 'alex', age: 77 },
        { name: 'alex', age: 77 },
      ],
      ['hello, worlds', { value: 'hello, worlds' }],
      [7, { value: 7 }],
    ])(
      'by only passing data, without key `insert(%p)`',
      async (input, expected) => {
        const data = await db.insert(input);
        expect(data).toEqual(expect.objectContaining(expected));
        const deleteRes = await db.delete(data.key);
        expect(deleteRes).toBeNull();
      }
    );

    it.each([
      [
        {
          key: 'user-a',
          username: 'jimmy',
          profile: {
            age: 32,
            active: false,
            hometown: 'pittsburgh',
          },
          on_mobile: true,
          likes: ['anime'],
          purchases: 1,
        },
        {
          key: 'user-a',
          username: 'jimmy',
          profile: {
            age: 32,
            active: false,
            hometown: 'pittsburgh',
          },
          on_mobile: true,
          likes: ['anime'],
          purchases: 1,
        },
      ],
    ])(
      'by passing data and key in object itself `insert(%p)`',
      async (input, expected) => {
        const data = await db.insert(input);
        expect(data).toEqual(expected);
      }
    );

    it.each([
      [
        { name: 'alex', age: 77 },
        'two',
        new Error('Item with key two already exists'),
      ],
      [
        'hello, worlds',
        'three',
        new Error('Item with key three already exists'),
      ],
      [7, 'newKey', { value: 7, key: 'newKey' }],
      [['a', 'b', 'c'], 'my_abc2', { value: ['a', 'b', 'c'], key: 'my_abc2' }],
    ])(
      'by passing data as first parameter and key as second parameter `insert(%p, "%s")`',
      async (value, key, expected) => {
        try {
          const data = await db.insert(value, key);
          expect(data).toEqual(expected);
        } catch (err) {
          expect(err).toEqual(expected);
        }
      }
    );
  });

  describe('Base#putMany', () => {
    it.each([
      [
        [
          { name: 'Beverly', hometown: 'Copernicus City' },
          'dude',
          ['Namaskāra', 'marhabaan', 'hello', 'yeoboseyo'],
        ],
        {
          processed: {
            items: [
              {
                hometown: 'Copernicus City',
                name: 'Beverly',
              },
              {
                value: 'dude',
              },
              {
                value: ['Namaskāra', 'marhabaan', 'hello', 'yeoboseyo'],
              },
            ],
          },
        },
      ],
    ])(
      'putMany items, without key `putMany("%s")`',
      async (items, expected) => {
        const data = await db.putMany(items);
        expect(data).toMatchObject(expected);
        data.processed.items.forEach(async (val) => {
          const deleteRes = await db.delete(val.key);
          expect(deleteRes).toBeNull();
        });
      }
    );

    it.each([
      [
        [
          {
            key: 'key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
          {
            key: 'key-2',
            name: 'Beverly',
            user_age: 51,
            hometown: 'Copernicus City',
            email: 'beverly@deta.sh',
          },
          {
            key: 'key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
        {
          processed: {
            items: [
              {
                key: 'key-1',
                name: 'Wesley',
                user_age: 27,
                hometown: 'San Francisco',
                email: 'wesley@deta.sh',
              },
              {
                key: 'key-2',
                name: 'Beverly',
                user_age: 51,
                hometown: 'Copernicus City',
                email: 'beverly@deta.sh',
              },
              {
                key: 'key-3',
                name: 'Kevin Garnett',
                user_age: 43,
                hometown: 'Greenville',
                email: 'kevin@email.com',
              },
            ],
          },
        },
      ],
    ])('putMany items, with key `putMany("%s")`', async (items, expected) => {
      const data = await db.putMany(items);
      expect(data).toMatchObject(expected);
    });
  });

  describe('Base#update', () => {
    it.each([
      [
        {
          'profile.age': 33,
          'profile.active': true,
          'profile.email': 'jimmy@deta.sh',
          'profile.hometown': db.util.trim(),
          on_mobile: db.util.trim(),
          purchases: db.util.increment(2),
          likes: db.util.append('ramen'),
        },
        'user-a',
        {
          key: 'user-a',
          username: 'jimmy',
          profile: {
            age: 33,
            active: true,
            email: 'jimmy@deta.sh',
          },
          likes: ['anime', 'ramen'],
          purchases: 3,
        },
      ],
    ])('update data `update(%p, "%s")`', async (updates, key, expected) => {
      const data = await db.update(updates, key);
      expect(data).toBeNull();
      const updatedData = await db.get(key);
      expect(updatedData).toEqual(expected);
    });
  });

  describe('Base#fetch', () => {
    it.each([
      [
        { 'user_age?lt': 30 },
        [
          {
            key: 'key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
        ],
      ],
      [
        { user_age: 27 },
        [
          {
            key: 'key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
        ],
      ],
      [
        { user_age: 27, name: 'Wesley' },
        [
          {
            key: 'key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
        ],
      ],
      [
        { 'user_age?gt': 27 },
        [
          {
            key: 'key-2',
            name: 'Beverly',
            user_age: 51,
            hometown: 'Copernicus City',
            email: 'beverly@deta.sh',
          },
          {
            key: 'key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      ],
      [
        { 'user_age?lte': 43 },
        [
          {
            key: 'key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
          {
            key: 'key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      ],
      [
        { 'user_age?gte': 43 },
        [
          {
            key: 'key-2',
            name: 'Beverly',
            user_age: 51,
            hometown: 'Copernicus City',
            email: 'beverly@deta.sh',
          },
          {
            key: 'key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      ],
      [
        { 'hometown?pfx': 'San' },
        [
          {
            key: 'key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
        ],
      ],
      [
        { 'user_age?r': [20, 45] },
        [
          {
            key: 'key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
          {
            key: 'key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      ],
      [
        { 'email?contains': '@email.com' },
        [
          {
            key: 'key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      ],
      [
        { 'email?not_contains': '@deta.sh' },
        [
          {
            key: 'key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      ],
      [
        [{ 'user_age?gt': 50 }, { hometown: 'Greenville' }],
        [
          {
            key: 'key-2',
            name: 'Beverly',
            user_age: 51,
            hometown: 'Copernicus City',
            email: 'beverly@deta.sh',
          },
          {
            key: 'key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      ],
    ])(
      'fetch data by using fetch query `fetch(%p)`',
      async (query, expected) => {
        const { value } = await db.fetch(query).next();
        expect(value).toEqual(expected);
      }
    );
  });

  describe('Base#delete', () => {
    it.each([
      ['one'],
      ['two'],
      ['three'],
      ['four'],
      ['my_abc'],
      ['this is some random key'],
      ['newKey'],
      ['my_abc2'],
      ['user-a'],
      ['key-1'],
      ['key-2'],
      ['key-3'],
    ])('delete data by using key `delete("%s")`', async (key) => {
      const data = await db.delete(key);
      expect(data).toBeNull();
    });
  });
});
