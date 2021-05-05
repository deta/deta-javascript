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
      'by only passing data without key `put(%p)`',
      async (input, expected) => {
        const data = await db.put(input);
        expect(data).toEqual(expect.objectContaining(expected));
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
      'by only passing data without key `insert(%p)`',
      async (input, expected) => {
        const data = await db.insert(input);
        expect(data).toEqual(expect.objectContaining(expected));
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
          { name: 'Beverly', hometown: 'Copernicus City', key: 'one' },
          'dude',
          ['Namaskāra', 'marhabaan', 'hello', 'yeoboseyo'],
        ],
        {
          processed: {
            items: [
              {
                hometown: 'Copernicus City',
                key: 'one',
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
    ])('putMany items`putMany("%s")`', async (items, expected) => {
      const data = await db.putMany(items);
      expect(data).toMatchObject(expected);
    });
  });

  describe('Base#delete', () => {
    it.each([['one'], ['this is some random key'], ['newKey'], ['my_abc2']])(
      'delete data by using key `delete("%s")`',
      async (key) => {
        const data = await db.delete(key);
        expect(data).toBeNull();
      }
    );
  });
});
