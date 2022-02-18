import { Base } from '../utils/deta';
import { Day } from '../../src/utils/date';
import { BaseGeneral } from '../../src/constants/general';
import { mockSystemTime, useRealTime } from '../utils/general';

const db = Base();

describe('Base#update', () => {
  beforeAll(async () => {
    mockSystemTime();
    const inputs = [
      [
        {
          key: 'update-user-a',
          username: 'jimmy',
          profile: {
            age: 32,
            active: false,
            hometown: 'pittsburgh',
          },
          on_mobile: true,
          likes: ['anime'],
          dislikes: ['comedy'],
          purchases: 1,
        },
        {
          key: 'update-user-a',
          username: 'jimmy',
          profile: {
            age: 32,
            active: false,
            hometown: 'pittsburgh',
          },
          on_mobile: true,
          likes: ['anime'],
          dislikes: ['comedy'],
          purchases: 1,
        },
      ],
    ];

    const promises = inputs.map(async (input) => {
      const [value, expected] = input;
      const data = await db.put(value);
      expect(data).toEqual(expected);
    });

    await Promise.all(promises);
  });

  afterAll(async () => {
    useRealTime();
    const inputs = [['update-user-a']];

    const promises = inputs.map(async (input) => {
      const [key] = input;
      const data = await db.delete(key);
      expect(data).toBeNull();
    });

    await Promise.all(promises);
  });

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
        dislikes: db.util.prepend('action'),
      },
      'update-user-a',
      undefined,
      {
        key: 'update-user-a',
        username: 'jimmy',
        profile: {
          age: 33,
          active: true,
          email: 'jimmy@deta.sh',
        },
        likes: ['anime', 'ramen'],
        dislikes: ['action', 'comedy'],
        purchases: 3,
      },
    ],
    [
      {
        purchases: db.util.increment(),
        likes: db.util.append(['momo']),
        dislikes: db.util.prepend(['romcom']),
      },
      'update-user-a',
      {},
      {
        key: 'update-user-a',
        username: 'jimmy',
        profile: {
          age: 33,
          active: true,
          email: 'jimmy@deta.sh',
        },
        likes: ['anime', 'ramen', 'momo'],
        dislikes: ['romcom', 'action', 'comedy'],
        purchases: 4,
      },
    ],
    [
      {
        purchases: db.util.increment(),
      },
      'update-user-a',
      {
        expireIn: 5,
      },
      {
        key: 'update-user-a',
        username: 'jimmy',
        profile: {
          age: 33,
          active: true,
          email: 'jimmy@deta.sh',
        },
        likes: ['anime', 'ramen', 'momo'],
        dislikes: ['romcom', 'action', 'comedy'],
        purchases: 5,
        [BaseGeneral.TTL_ATTRIBUTE]: new Day().addSeconds(5).getEpochSeconds(),
      },
    ],
    [
      {
        purchases: db.util.increment(),
      },
      'update-user-a',
      {
        expireAt: new Date(),
      },
      {
        key: 'update-user-a',
        username: 'jimmy',
        profile: {
          age: 33,
          active: true,
          email: 'jimmy@deta.sh',
        },
        likes: ['anime', 'ramen', 'momo'],
        dislikes: ['romcom', 'action', 'comedy'],
        purchases: 6,
        [BaseGeneral.TTL_ATTRIBUTE]: new Day().getEpochSeconds(),
      },
    ],
    [
      {
        purchases: db.util.increment(),
      },
      'update-user-a',
      {
        expireIn: 5,
        expireAt: new Date(),
      },
      new Error("can't set both expireIn and expireAt options"),
    ],
  ])(
    'update data `update(%p, "%s", %p)`',
    async (updates, key, options, expected) => {
      try {
        const data = await db.update(updates, key, options);
        expect(data).toBeNull();
        const updatedData = await db.get(key);
        expect(updatedData).toEqual(expected);
      } catch (err) {
        expect(err).toEqual(expected);
      }
    }
  );

  it.each([
    [{}, '   ', new Error('Key is empty')],
    [{}, '', new Error('Key is empty')],
    [{}, null, new Error('Key is empty')],
    [{}, undefined, new Error('Key is empty')],
  ])(
    'update data by using invalid key `update(%p, "%s")`',
    async (updates, key, expected) => {
      try {
        const data = await db.update(updates, key as string);
        expect(data).toBeNull();
      } catch (err) {
        expect(err).toEqual(expected);
      }
    }
  );
});
