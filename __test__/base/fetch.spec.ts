import { Deta } from '../../src/index.node';

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
      [
        {
          key: 'fetch-key-1',
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
          key: 'fetch-key-1',
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
          key: 'fetch-key-1',
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
    ],
    [
      { 'user_age?lte': 43 },
      [
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
    ],
    [
      { 'user_age?gte': 43 },
      [
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
    ],
    [
      { 'hometown?pfx': 'San' },
      [
        {
          key: 'fetch-key-1',
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
    ],
    [
      { 'email?contains': '@email.com' },
      [
        {
          key: 'fetch-key-3',
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
          key: 'fetch-key-3',
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
    ],
    [
      { 'user_age?ne': 51 },
      [
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
    ],
  ])('fetch data by using fetch query `fetch(%p)`', async (query, expected) => {
    const { value } = await db.fetch(query).next();
    expect(value).toEqual(expected);
  });

  it.each([
    [
      { name: 'Wesley' },
      1,
      [
        {
          key: 'fetch-key-1',
          name: 'Wesley',
          user_age: 27,
          hometown: 'San Francisco',
          email: 'wesley@deta.sh',
        },
      ],
    ],
    [{ name: 'Wesley' }, 0, undefined],
  ])(
    'fetch data using query and pages `fetch(%p, "%s")`',
    async (query, page, expected) => {
      const { value } = await db.fetch(query, page).next();
      expect(value).toEqual(expected);
    }
  );

  it.each([
    [
      { 'user_age?r': [20, 45] },
      1,
      1,
      [
        {
          key: 'fetch-key-1',
          name: 'Wesley',
          user_age: 27,
          hometown: 'San Francisco',
          email: 'wesley@deta.sh',
        },
      ],
    ],
  ])(
    'fetch data using query, pages and buffer `fetch(%p, "%s", "%s")`',
    async (query, page, buffer, expected) => {
      const { value } = await db.fetch(query, page, buffer).next();
      expect(value).toEqual(expected);
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
    const { value } = await db.fetch().next();
    expect(value).toEqual(expected);
  });
});
