import { Deta } from '../../src/index.node';

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
    const deleteRes = await db.delete(data?.key as string);
    expect(deleteRes).toBeNull();
  });

  it('by passing data and key in object itself', async () => {
    const input = { name: 'alex', age: 77, key: 'put_one' };
    const data = await db.put(input);
    expect(data).toEqual(input);
    const deleteRes = await db.delete(data?.key as string);
    expect(deleteRes).toBeNull();
  });

  it.each([
    [
      { name: 'alex', age: 77 },
      'put_two',
      { name: 'alex', age: 77, key: 'put_two' },
    ],
    [
      'hello, worlds',
      'put_three',
      { value: 'hello, worlds', key: 'put_three' },
    ],
    [7, 'put_four', { value: 7, key: 'put_four' }],
    [
      ['a', 'b', 'c'],
      'put_my_abc',
      { value: ['a', 'b', 'c'], key: 'put_my_abc' },
    ],
    [
      { key: 'put_hello', value: ['a', 'b', 'c'] },
      'put_my_abc',
      { value: ['a', 'b', 'c'], key: 'put_my_abc' },
    ],
    [
      { key: 'put_hello', world: ['a', 'b', 'c'] },
      'put_my_abc',
      { world: ['a', 'b', 'c'], key: 'put_my_abc' },
    ],
  ])(
    'by passing data as first parameter and key as second parameter `put(%p, "%s")`',
    async (value, key, expected) => {
      const data = await db.put(value, key);
      expect(data).toEqual(expected);
      const deleteRes = await db.delete(data?.key as string);
      expect(deleteRes).toBeNull();
    }
  );
});
