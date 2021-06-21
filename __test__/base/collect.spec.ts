import { Deta } from '../../src/index.node';
import { CollectOptions } from '../../src/types/base/request';

const projectKey = process.env.PROJECT_KEY || '';
const dbName = process.env.DB_NAME || '';

const db = Deta(projectKey).Base(dbName);

describe('Base#collect', () => {
  beforeAll(async () => {
    const inputs = [
      [
        {
          key: 'collect-key-1',
          name: 'Wesley',
          user_age: 27,
          hometown: 'San Francisco',
          email: 'wesley@deta.sh',
        },
        {
          key: 'collect-key-1',
          name: 'Wesley',
          user_age: 27,
          hometown: 'San Francisco',
          email: 'wesley@deta.sh',
        },
      ],
      [
        {
          key: 'collect-key-2',
          name: 'Beverly',
          user_age: 51,
          hometown: 'Copernicus City',
          email: 'beverly@deta.sh',
        },
        {
          key: 'collect-key-2',
          name: 'Beverly',
          user_age: 51,
          hometown: 'Copernicus City',
          email: 'beverly@deta.sh',
        },
      ],
      [
        {
          key: 'collect-key-3',
          name: 'Kevin Garnett',
          user_age: 43,
          hometown: 'Greenville',
          email: 'kevin@email.com',
        },
        {
          key: 'collect-key-3',
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
    const inputs = [['collect-key-1'], ['collect-key-2'], ['collect-key-3']];

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
      [
        {
          key: 'collect-key-1',
          name: 'Wesley',
          user_age: 27,
          hometown: 'San Francisco',
          email: 'wesley@deta.sh',
        },
      ],
    ],
    [
      { user_age: 27 },
      [
        {
          key: 'collect-key-1',
          name: 'Wesley',
          user_age: 27,
          hometown: 'San Francisco',
          email: 'wesley@deta.sh',
        },
      ],
    ],
    [
      { user_age: 27, name: 'Wesley' },
      [
        {
          key: 'collect-key-1',
          name: 'Wesley',
          user_age: 27,
          hometown: 'San Francisco',
          email: 'wesley@deta.sh',
        },
      ],
    ],
    [
      { 'user_age?gt': 27 },
      [
        {
          key: 'collect-key-2',
          name: 'Beverly',
          user_age: 51,
          hometown: 'Copernicus City',
          email: 'beverly@deta.sh',
        },
        {
          key: 'collect-key-3',
          name: 'Kevin Garnett',
          user_age: 43,
          hometown: 'Greenville',
          email: 'kevin@email.com',
        },
      ],
    ],
    [
      { 'user_age?lte': 43 },
      [
        {
          key: 'collect-key-1',
          name: 'Wesley',
          user_age: 27,
          hometown: 'San Francisco',
          email: 'wesley@deta.sh',
        },
        {
          key: 'collect-key-3',
          name: 'Kevin Garnett',
          user_age: 43,
          hometown: 'Greenville',
          email: 'kevin@email.com',
        },
      ],
    ],
    [
      { 'user_age?gte': 43 },
      [
        {
          key: 'collect-key-2',
          name: 'Beverly',
          user_age: 51,
          hometown: 'Copernicus City',
          email: 'beverly@deta.sh',
        },
        {
          key: 'collect-key-3',
          name: 'Kevin Garnett',
          user_age: 43,
          hometown: 'Greenville',
          email: 'kevin@email.com',
        },
      ],
    ],
    [
      { 'hometown?pfx': 'San' },
      [
        {
          key: 'collect-key-1',
          name: 'Wesley',
          user_age: 27,
          hometown: 'San Francisco',
          email: 'wesley@deta.sh',
        },
      ],
    ],
    [
      { 'user_age?r': [20, 45] },
      [
        {
          key: 'collect-key-1',
          name: 'Wesley',
          user_age: 27,
          hometown: 'San Francisco',
          email: 'wesley@deta.sh',
        },
        {
          key: 'collect-key-3',
          name: 'Kevin Garnett',
          user_age: 43,
          hometown: 'Greenville',
          email: 'kevin@email.com',
        },
      ],
    ],
    [
      { 'email?contains': '@email.com' },
      [
        {
          key: 'collect-key-3',
          name: 'Kevin Garnett',
          user_age: 43,
          hometown: 'Greenville',
          email: 'kevin@email.com',
        },
      ],
    ],
    [
      { 'email?not_contains': '@deta.sh' },
      [
        {
          key: 'collect-key-3',
          name: 'Kevin Garnett',
          user_age: 43,
          hometown: 'Greenville',
          email: 'kevin@email.com',
        },
      ],
    ],
    [
      [{ 'user_age?gt': 50 }, { hometown: 'Greenville' }],
      [
        {
          key: 'collect-key-2',
          name: 'Beverly',
          user_age: 51,
          hometown: 'Copernicus City',
          email: 'beverly@deta.sh',
        },
        {
          key: 'collect-key-3',
          name: 'Kevin Garnett',
          user_age: 43,
          hometown: 'Greenville',
          email: 'kevin@email.com',
        },
      ],
    ],
    [
      { 'user_age?ne': 51 },
      [
        {
          key: 'collect-key-1',
          name: 'Wesley',
          user_age: 27,
          hometown: 'San Francisco',
          email: 'wesley@deta.sh',
        },
        {
          key: 'collect-key-3',
          name: 'Kevin Garnett',
          user_age: 43,
          hometown: 'Greenville',
          email: 'kevin@email.com',
        },
      ],
    ],
  ])(
    'collect data by using collect query `collect(%p)`',
    async (query, expected) => {
      const { items } = await db.collect(query);
      expect(items).toEqual(expected);
    }
  );

  it.each([
    [
      { name: 'Wesley' },
      { limit: 1 },
      {
        paging: {
          size: 1,
        },
        items: [
          {
            key: 'collect-key-1',
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
        paging: {
          size: 1,
          last: 'collect-key-1',
        },
        items: [
          {
            key: 'collect-key-1',
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
      { limit: 1, last: 'collect-key-1' },
      {
        paging: {
          size: 1,
        },
        items: [
          {
            key: 'collect-key-3',
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
        paging: {
          size: 2,
        },
        items: [
          {
            key: 'collect-key-2',
            name: 'Beverly',
            user_age: 51,
            hometown: 'Copernicus City',
            email: 'beverly@deta.sh',
          },
          {
            key: 'collect-key-3',
            name: 'Kevin Garnett',
            user_age: 43,
            hometown: 'Greenville',
            email: 'kevin@email.com',
          },
        ],
      },
    ],
  ])(
    'collect data using query and options `collect(%p, %p)`',
    async (query, options, expected) => {
      const res = await db.collect(query, options as CollectOptions);
      expect(res).toEqual(expected);
    }
  );

  it('collect data `collect()`', async () => {
    const expected = [
      {
        key: 'collect-key-1',
        name: 'Wesley',
        user_age: 27,
        hometown: 'San Francisco',
        email: 'wesley@deta.sh',
      },
      {
        key: 'collect-key-2',
        name: 'Beverly',
        user_age: 51,
        hometown: 'Copernicus City',
        email: 'beverly@deta.sh',
      },
      {
        key: 'collect-key-3',
        name: 'Kevin Garnett',
        user_age: 43,
        hometown: 'Greenville',
        email: 'kevin@email.com',
      },
    ];
    const { items } = await db.collect();
    expect(items).toEqual(expected);
  });
});
