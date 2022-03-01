import { Base } from '../utils/deta';

const db = Base();

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
      const deleteRes = await db.delete(data.key as string);
      expect(deleteRes).toBeNull();
    }
  );

  it.each([
    [
      {
        key: 'insert-user-a',
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
        key: 'insert-user-a',
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
      const deleteRes = await db.delete(data.key as string);
      expect(deleteRes).toBeNull();
    }
  );

  it.each([
    [7, 'insert-newKey', { value: 7, key: 'insert-newKey' }],
    [
      ['a', 'b', 'c'],
      'insert-my-abc2',
      { value: ['a', 'b', 'c'], key: 'insert-my-abc2' },
    ],
  ])(
    'by passing data as first parameter and key as second parameter `insert(%p, "%s")`',
    async (value, key, expected) => {
      const data = await db.insert(value, key);
      expect(data).toEqual(expected);
      const deleteRes = await db.delete(data.key as string);
      expect(deleteRes).toBeNull();
    }
  );

  it.each([
    [
      { name: 'alex', age: 77 },
      'insert-two',
      new Error('Item with key insert-two already exists'),
    ],
    [
      'hello, worlds',
      'insert-three',
      new Error('Item with key insert-three already exists'),
    ],
  ])(
    'by passing key that already exist `insert(%p, "%s")`',
    async (value, key, expected) => {
      const data = await db.insert(value, key); // simulate key already exists
      try {
        const res = await db.insert(value, key);
        expect(res).toBeNull();
      } catch (err) {
        expect(err).toEqual(expected);
      }
      // cleanup
      const deleteRes = await db.delete(data.key as string);
      expect(deleteRes).toBeNull();
    }
  );
});
