import { Base } from '../utils/deta';
import { Day } from '../../src/utils/date';
import { BaseGeneral } from '../../src/constants/general';
import { mockSystemTime, useRealTime } from '../utils/general';

const db = Base();

describe('Base#insert', () => {
  beforeAll(() => {
    mockSystemTime();
  });

  afterAll(() => {
    useRealTime();
  });

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

  it('insert data with expireIn option', async () => {
    const value = 7;
    const key = 'insert-newKey-one';
    const options = { expireIn: 500 };
    const expected = {
      value: 7,
      key,
      [BaseGeneral.TTL_ATTRIBUTE]: new Day().addSeconds(500).getEpochSeconds(),
    };
    const data = await db.insert(value, key, options);
    expect(data).toEqual(expected);
    const deleteRes = await db.delete(data.key as string);
    expect(deleteRes).toBeNull();
  });

  it('insert data with expireAt option', async () => {
    const value = 7;
    const key = 'insert-newKey-two';
    const options = { expireAt: new Date() };
    const expected = {
      value: 7,
      key,
      [BaseGeneral.TTL_ATTRIBUTE]: new Day().getEpochSeconds(),
    };
    const data = await db.insert(value, key, options);
    expect(data).toEqual(expected);
    const deleteRes = await db.delete(data.key as string);
    expect(deleteRes).toBeNull();
  });

  it.each([
    [
      7,
      'insert-newKey-three',
      { expireIn: 5, expireAt: new Date() },
      new Error("can't set both expireIn and expireAt options"),
    ],
    [
      7,
      'insert-newKey-three',
      { expireIn: 'invalid' },
      new Error('option expireIn should have a value of type number'),
    ],
    [
      7,
      'insert-newKey-three',
      { expireIn: new Date() },
      new Error('option expireIn should have a value of type number'),
    ],
    [
      7,
      'insert-newKey-three',
      { expireIn: {} },
      new Error('option expireIn should have a value of type number'),
    ],
    [
      7,
      'insert-newKey-three',
      { expireIn: [] },
      new Error('option expireIn should have a value of type number'),
    ],
    [
      7,
      'insert-newKey-three',
      { expireAt: 'invalid' },
      new Error('option expireAt should have a value of type number or Date'),
    ],
    [
      7,
      'insert-newKey-three',
      { expireAt: {} },
      new Error('option expireAt should have a value of type number or Date'),
    ],
    [
      7,
      'insert-newKey-three',
      { expireAt: [] },
      new Error('option expireAt should have a value of type number or Date'),
    ],
  ])(
    'by passing data as first parameter, key as second parameter and invalid options as third parameter `insert(%p, "%s", %p)`',
    async (value, key, options, expected) => {
      try {
        const data = await db.insert(value, key, options as any);
        expect(data).toBeNull();
      } catch (err) {
        expect(err).toEqual(expected);
      }
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
