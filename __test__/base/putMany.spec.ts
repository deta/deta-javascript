import { Deta } from '../../src/index';

const projectKey = process.env.PROJECT_KEY || '';
const dbName = process.env.DB_NAME || '';

const db = Deta(projectKey).Base(dbName);

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
});
