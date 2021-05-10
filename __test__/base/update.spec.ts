import { Deta } from '../../src/index';

const projectKey = process.env.PROJECT_KEY || '';
const dbName = process.env.DB_NAME || '';

const db = Deta(projectKey).Base(dbName);

describe('Base#update', () => {
  beforeAll(async () => {
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
      },
      'update-user-a',
      {
        key: 'update-user-a',
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
