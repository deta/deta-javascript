import { Deta } from '../../src/index';

const projectKey = process.env.PROJECT_KEY || '';
const dbName = process.env.DB_NAME || '';

const db = Deta(projectKey).Base(dbName);

describe('Base#put', () => {
  it.each([
    [
      { name: 'alex', age: 77 },
      { name: 'alex', age: 77 },
    ],
    ['hello, worlds', { value: 'hello, worlds' }],
    [7, { value: 7 }],
  ])('by only passing data, without key `put(%p)`', async (input, expected) => {
    const data = await db.put(input);
    expect(data).toEqual(expect.objectContaining(expected));
  });

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
    [
      { key: 'hello', value: ['a', 'b', 'c'] },
      'my_abc',
      { value: ['a', 'b', 'c'], key: 'my_abc' },
    ],
    [
      { key: 'hello', world: ['a', 'b', 'c'] },
      'my_abc',
      { world: ['a', 'b', 'c'], key: 'my_abc' },
    ],
  ])(
    'by passing data as first parameter and key as second parameter `put(%p, "%s")`',
    async (value, key, expected) => {
      const data = await db.put(value, key);
      expect(data).toEqual(expected);
    }
  );
});
