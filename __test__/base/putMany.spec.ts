import { Base } from '../utils/deta';
import { Day } from '../../src/utils/date';
import { BaseGeneral } from '../../src/constants/general';
import { mockSystemTime, useRealTime } from '../utils/general';

const db = Base();

describe('Base#putMany', () => {
  beforeAll(() => {
    mockSystemTime();
  });

  afterAll(() => {
    useRealTime();
  });

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
  ])('putMany items, without key `putMany(%p)`', async (items, expected) => {
    const data = await db.putMany(items);
    expect(data).toMatchObject(expected);
    data?.processed?.items.forEach(async (val: any) => {
      const deleteRes = await db.delete(val.key);
      expect(deleteRes).toBeNull();
    });
  });

  it.each([
    [
      [
        { name: 'Beverly', hometown: 'Copernicus City' },
        { name: 'Jon', hometown: 'New York' },
      ],
      {
        expireIn: 233,
      },
      {
        processed: {
          items: [
            {
              hometown: 'Copernicus City',
              name: 'Beverly',
              [BaseGeneral.TTL_ATTRIBUTE]: new Day()
                .addSeconds(233)
                .getEpochSeconds(),
            },
            {
              hometown: 'New York',
              name: 'Jon',
              [BaseGeneral.TTL_ATTRIBUTE]: new Day()
                .addSeconds(233)
                .getEpochSeconds(),
            },
          ],
        },
      },
    ],
    [
      [
        { name: 'Beverly', hometown: 'Copernicus City' },
        { name: 'Jon', hometown: 'New York' },
      ],
      {
        expireAt: new Date(),
      },
      {
        processed: {
          items: [
            {
              hometown: 'Copernicus City',
              name: 'Beverly',
              [BaseGeneral.TTL_ATTRIBUTE]: new Day().getEpochSeconds(),
            },
            {
              hometown: 'New York',
              name: 'Jon',
              [BaseGeneral.TTL_ATTRIBUTE]: new Day().getEpochSeconds(),
            },
          ],
        },
      },
    ],
    [
      [
        { name: 'Beverly', hometown: 'Copernicus City' },
        { name: 'Jon', hometown: 'New York' },
      ],
      {
        expireIn: 5,
        expireAt: new Date(),
      },
      new Error("can't set both expireIn and expireAt options"),
    ],
    [
      [
        { name: 'Beverly', hometown: 'Copernicus City' },
        { name: 'Jon', hometown: 'New York' },
      ],
      { expireIn: 'invalid' },
      new Error('option expireIn should have a value of type number'),
    ],
    [
      [
        { name: 'Beverly', hometown: 'Copernicus City' },
        { name: 'Jon', hometown: 'New York' },
      ],
      { expireIn: new Date() },
      new Error('option expireIn should have a value of type number'),
    ],
    [
      [
        { name: 'Beverly', hometown: 'Copernicus City' },
        { name: 'Jon', hometown: 'New York' },
      ],
      { expireIn: {} },
      new Error('option expireIn should have a value of type number'),
    ],
    [
      [
        { name: 'Beverly', hometown: 'Copernicus City' },
        { name: 'Jon', hometown: 'New York' },
      ],
      { expireIn: [] },
      new Error('option expireIn should have a value of type number'),
    ],
    [
      [
        { name: 'Beverly', hometown: 'Copernicus City' },
        { name: 'Jon', hometown: 'New York' },
      ],
      { expireAt: 'invalid' },
      new Error('option expireAt should have a value of type number or Date'),
    ],
    [
      [
        { name: 'Beverly', hometown: 'Copernicus City' },
        { name: 'Jon', hometown: 'New York' },
      ],
      { expireAt: {} },
      new Error('option expireAt should have a value of type number or Date'),
    ],
    [
      [
        { name: 'Beverly', hometown: 'Copernicus City' },
        { name: 'Jon', hometown: 'New York' },
      ],
      { expireAt: [] },
      new Error('option expireAt should have a value of type number or Date'),
    ],
  ])(
    'putMany items, with options `putMany(%p, %p)`',
    async (items, options, expected) => {
      try {
        const data = await db.putMany(items, options as any);
        expect(data).toMatchObject(expected);
        data?.processed?.items.forEach(async (val: any) => {
          const deleteRes = await db.delete(val.key);
          expect(deleteRes).toBeNull();
        });
      } catch (err) {
        expect(err).toEqual(expected);
      }
    }
  );

  it.each([
    [
      [
        {
          key: 'put-many-key-1',
          name: 'Wesley',
          user_age: 27,
          hometown: 'San Francisco',
          email: 'wesley@deta.sh',
        },
        {
          key: 'put-many-key-2',
          name: 'Beverly',
          user_age: 51,
          hometown: 'Copernicus City',
          email: 'beverly@deta.sh',
        },
        {
          key: 'put-many-key-3',
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
              key: 'put-many-key-1',
              name: 'Wesley',
              user_age: 27,
              hometown: 'San Francisco',
              email: 'wesley@deta.sh',
            },
            {
              key: 'put-many-key-2',
              name: 'Beverly',
              user_age: 51,
              hometown: 'Copernicus City',
              email: 'beverly@deta.sh',
            },
            {
              key: 'put-many-key-3',
              name: 'Kevin Garnett',
              user_age: 43,
              hometown: 'Greenville',
              email: 'kevin@email.com',
            },
          ],
        },
      },
    ],
  ])('putMany items, with key `putMany(%p)`', async (items, expected) => {
    const data = await db.putMany(items);
    expect(data).toMatchObject(expected);
    data?.processed?.items.forEach(async (val: any) => {
      const deleteRes = await db.delete(val.key);
      expect(deleteRes).toBeNull();
    });
  });

  it('putMany items is not an instance of array', async () => {
    const value: any = 'hello';
    try {
      await db.putMany(value);
    } catch (err) {
      expect(err).toEqual(new Error('Items must be an array'));
    }
  });

  it('putMany items length is more then 25', async () => {
    const items = new Array(26);
    try {
      await db.putMany(items);
    } catch (err) {
      expect(err).toEqual(
        new Error("We can't put more than 25 items at a time")
      );
    }
  });

  it('putMany items length is zero', async () => {
    const items = new Array(0);
    try {
      await db.putMany(items);
    } catch (err) {
      expect(err).toEqual(new Error("Items can't be empty"));
    }
  });
});
