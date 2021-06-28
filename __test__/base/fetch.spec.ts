import { Deta } from '../../src/index.node';
import { FetchOptions } from '../../src/types/base/request';

const projectKey = process.env.PROJECT_KEY || '';
const dbName = process.env.DB_NAME || '';

const db = Deta(projectKey).Base(dbName);

describe('Base#fetch', () => {
  beforeAll(async () => {
    const inputs = [
      [
        {
          key: 'fetch-key-1',
          name: 'Wesley',
          user_age: 27,
          hometown: 'San Francisco',
          email: 'wesley@deta.sh',
        },
        {
          key: 'fetch-key-1',
          name: 'Wesley',
          user_age: 27,
          hometown: 'San Francisco',
          email: 'wesley@deta.sh',
        },
      ],
      [
        {
          key: 'fetch-key-2',
          name: 'Beverly',
          user_age: 51,
          hometown: 'Copernicus City',
          email: 'beverly@deta.sh',
        },
        {
          key: 'fetch-key-2',
          name: 'Beverly',
          user_age: 51,
          hometown: 'Copernicus City',
          email: 'beverly@deta.sh',
        },
      ],
      [
        {
          key: 'fetch-key-3',
          name: 'Kevin Garnett',
          user_age: 43,
          hometown: 'Greenville',
          email: 'kevin@email.com',
        },
        {
          key: 'fetch-key-3',
          name: 'Kevin Garnett',
          user_age: 43,
          hometown: 'Greenville',
          email: 'kevin@email.com',
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
    const inputs = [['fetch-key-1'], ['fetch-key-2'], ['fetch-key-3']];

    const promises = inputs.map(async (input) => {
      const [key] = input;
      const data = await db.delete(key);
      expect(data).toBeNull();
    });

    await Promise.all(promises);
  });

  it.each([
    [
      { 'user_age?lt': 30 },
      {
        count: 1,
        items: [
          {
            key: 'fetch-key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
        ],
      },
    ],
    [
      { user_age: 27 },
      {
        count: 1,
        items: [
          {
            key: 'fetch-key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
        ],
      },
    ],
    [
      { user_age: 27, name: 'Wesley' },
      {
        count: 1,
        items: [
          {
            key: 'fetch-key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
        ],
      },
    ],
    [
      { 'user_age?gt': 27 },
      {
        count: 2,
        items: [
          {
            key: 'fetch-key-2',
            name: 'Beverly',
            user_age: 51,
            hometown: 'Copernicus City',
            email: 'beverly@deta.sh',
          },
          {
            key: 'fetch-key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      },
    ],
    [
      { 'user_age?lte': 43 },
      {
        count: 2,
        items: [
          {
            key: 'fetch-key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
          {
            key: 'fetch-key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      },
    ],
    [
      { 'user_age?gte': 43 },
      {
        count: 2,
        items: [
          {
            key: 'fetch-key-2',
            name: 'Beverly',
            user_age: 51,
            hometown: 'Copernicus City',
            email: 'beverly@deta.sh',
          },
          {
            key: 'fetch-key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      },
    ],
    [
      { 'hometown?pfx': 'San' },
      {
        count: 1,
        items: [
          {
            key: 'fetch-key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
        ],
      },
    ],
    [
      { 'user_age?r': [20, 45] },
      {
        count: 2,
        items: [
          {
            key: 'fetch-key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
          {
            key: 'fetch-key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      },
    ],
    [
      { 'email?contains': '@email.com' },
      {
        count: 1,
        items: [
          {
            key: 'fetch-key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      },
    ],
    [
      { 'email?not_contains': '@deta.sh' },
      {
        count: 1,
        items: [
          {
            key: 'fetch-key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      },
    ],
    [
      [{ 'user_age?gt': 50 }, { hometown: 'Greenville' }],
      {
        count: 2,
        items: [
          {
            key: 'fetch-key-2',
            name: 'Beverly',
            user_age: 51,
            hometown: 'Copernicus City',
            email: 'beverly@deta.sh',
          },
          {
            key: 'fetch-key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      },
    ],
    [
      { 'user_age?ne': 51 },
      {
        count: 2,
        items: [
          {
            key: 'fetch-key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
          {
            key: 'fetch-key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      },
    ],
  ])('fetch data by using fetch query `fetch(%p)`', async (query, expected) => {
    const res = await db.fetch(query);
    expect(res).toEqual(expected);
  });

  it.each([
    [
      { name: 'Wesley' },
      { limit: 1 },
      {
        count: 1,
        items: [
          {
            key: 'fetch-key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
        ],
      },
    ],
    [
      { 'user_age?ne': 51 },
      { limit: 1 },
      {
        count: 1,
        last: 'fetch-key-1',
        items: [
          {
            key: 'fetch-key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
        ],
      },
    ],
    [
      { 'user_age?ne': 51 },
      { limit: 1, last: 'fetch-key-1' },
      {
        count: 1,
        items: [
          {
            key: 'fetch-key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      },
    ],
    [
      [{ 'user_age?gt': 50 }, { hometown: 'Greenville' }],
      { limit: 2 },
      {
        count: 2,
        items: [
          {
            key: 'fetch-key-2',
            name: 'Beverly',
            user_age: 51,
            hometown: 'Copernicus City',
            email: 'beverly@deta.sh',
          },
          {
            key: 'fetch-key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      },
    ],
    [
      [],
      { limit: 2 },
      {
        count: 2,
        last: 'fetch-key-2',
        items: [
          {
            key: 'fetch-key-1',
            name: 'Wesley',
            user_age: 27,
            hometown: 'San Francisco',
            email: 'wesley@deta.sh',
          },
          {
            key: 'fetch-key-2',
            name: 'Beverly',
            user_age: 51,
            hometown: 'Copernicus City',
            email: 'beverly@deta.sh',
          },
        ],
      },
    ],
  ])(
    'fetch data using query and options `fetch(%p, %p)`',
    async (query, options, expected) => {
      const res = await db.fetch(query, options as FetchOptions);
      expect(res).toEqual(expected);
    }
  );

  it('fetch data `fetch()`', async () => {
    const expected = [
      {
        key: 'fetch-key-1',
        name: 'Wesley',
        user_age: 27,
        hometown: 'San Francisco',
        email: 'wesley@deta.sh',
      },
      {
        key: 'fetch-key-2',
        name: 'Beverly',
        user_age: 51,
        hometown: 'Copernicus City',
        email: 'beverly@deta.sh',
      },
      {
        key: 'fetch-key-3',
        name: 'Kevin Garnett',
        user_age: 43,
        hometown: 'Greenville',
        email: 'kevin@email.com',
      },
    ];
    const { items } = await db.fetch();
    expect(items).toEqual(expected);
  });
});
