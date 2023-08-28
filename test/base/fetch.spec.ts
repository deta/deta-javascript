import { expect } from "chai";
import { Base } from "../../src/index.node";
import { CompositeType } from "../../src/types/basic";
import { FetchOptions } from "../../src/types/base/request";
import { BASE_NAME } from "../utils/constants";

const db = Base(BASE_NAME);

describe("Base#fetch", function () {
  before(async function () {
    const inputs = [
      [
        {
          key: "fetch-key-1",
          name: "Wesley",
          user_age: 27,
          hometown: "San Francisco",
          email: "wesley@deta.sh",
        },
        {
          key: "fetch-key-1",
          name: "Wesley",
          user_age: 27,
          hometown: "San Francisco",
          email: "wesley@deta.sh",
        },
      ],
      [
        {
          key: "fetch-key-2",
          name: "Beverly",
          user_age: 51,
          hometown: "Copernicus City",
          email: "beverly@deta.sh",
        },
        {
          key: "fetch-key-2",
          name: "Beverly",
          user_age: 51,
          hometown: "Copernicus City",
          email: "beverly@deta.sh",
        },
      ],
      [
        {
          key: "fetch-key-3",
          name: "Kevin Garnett",
          user_age: 43,
          hometown: "Greenville",
          email: "kevin@email.com",
        },
        {
          key: "fetch-key-3",
          name: "Kevin Garnett",
          user_age: 43,
          hometown: "Greenville",
          email: "kevin@email.com",
        },
      ],
    ];

    for (const input of inputs) {
      const [value, expected] = input;
      const data = await db.put(value);
      expect(data).to.deep.equal(expected);
    }
  });

  after(async function () {
    const inputs = [["fetch-key-1"], ["fetch-key-2"], ["fetch-key-3"]];

    for (const input of inputs) {
      const [key] = input;
      const data = await db.delete(key);
      expect(data).to.be.null;
    }
  });

  const fetchDataQueries = [
    [
      { key: "fetch-key-1" },
      {
        count: 1,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
        ],
      },
    ],
    [
      { "key?pfx": "fetch" },
      {
        count: 3,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      { "key?>": "fetch-key-2" },
      {
        count: 1,
        items: [
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      { "key?<": "fetch-key-2" },
      {
        count: 1,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
        ],
      },
    ],
    [
      { "key?>=": "fetch-key-2" },
      {
        count: 2,
        items: [
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      { "key?<=": "fetch-key-2" },
      {
        count: 2,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
        ],
      },
    ],
    [
      { "key?r": ["fetch-key-1", "fetch-key-3"] },
      {
        count: 3,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      [
        { "key?>=": "fetch-key-1", "user_age?>": 40, "user_age?<": 50 },
        { "key?>=": "fetch-key-1", "user_age?<": 40 },
      ],
      {
        count: 2,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      [{ name: "Wesley" }, { user_age: 51 }],
      {
        count: 2,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
        ],
      },
    ],
    [
      { "user_age?lt": 30 },
      {
        count: 1,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
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
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
        ],
      },
    ],
    [
      { user_age: 27, name: "Wesley" },
      {
        count: 1,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
        ],
      },
    ],
    [
      { "user_age?gt": 27 },
      {
        count: 2,
        items: [
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      { "user_age?lte": 43 },
      {
        count: 2,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      { "user_age?gte": 43 },
      {
        count: 2,
        items: [
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      { "hometown?pfx": "San" },
      {
        count: 1,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
        ],
      },
    ],
    [
      { "user_age?r": [20, 45] },
      {
        count: 2,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      { "email?contains": "@email.com" },
      {
        count: 1,
        items: [
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      { "email?not_contains": "@deta.sh" },
      {
        count: 1,
        items: [
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      [{ "user_age?gt": 50 }, { hometown: "Greenville" }],
      {
        count: 2,
        items: [
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      { "user_age?ne": 51 },
      {
        count: 2,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      { fetch_does_not_exist: "fetch_value_does_not_exist" },
      {
        count: 0,
        last: undefined,
        items: [],
      },
    ],
    [
      {},
      {
        count: 3,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      [],
      {
        count: 3,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
  ];
  fetchDataQueries.forEach(function ([query, expected]) {
    it(`fetch data by using fetch query fetch(${JSON.stringify(
      query
    )})`, async function () {
      const res = await db.fetch(query as CompositeType);
      expect(res).to.deep.include(expected);
    });
  });

  const fetchWithOptsQueries = [
    [
      { name: "Wesley" },
      { limit: 1 },
      {
        count: 1,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
        ],
      },
    ],
    [
      { "user_age?ne": 51 },
      { limit: 1 },
      {
        count: 1,
        last: "fetch-key-1",
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
        ],
      },
    ],
    [
      { "user_age?ne": 51 },
      { limit: 1, last: "fetch-key-1" },
      {
        count: 1,
        items: [
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      [{ "user_age?gt": 50 }, { hometown: "Greenville" }],
      { limit: 2 },
      {
        count: 2,
        items: [
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      [],
      { limit: 2 },
      {
        count: 2,
        last: "fetch-key-2",
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
        ],
      },
    ],
    [
      {},
      { limit: 2 },
      {
        count: 2,
        last: "fetch-key-2",
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
        ],
      },
    ],
    [
      {},
      { limit: 3 },
      {
        count: 3,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
    [
      [],
      { limit: 3 },
      {
        count: 3,
        items: [
          {
            key: "fetch-key-1",
            name: "Wesley",
            user_age: 27,
            hometown: "San Francisco",
            email: "wesley@deta.sh",
          },
          {
            key: "fetch-key-2",
            name: "Beverly",
            user_age: 51,
            hometown: "Copernicus City",
            email: "beverly@deta.sh",
          },
          {
            key: "fetch-key-3",
            name: "Kevin Garnett",
            user_age: 43,
            hometown: "Greenville",
            email: "kevin@email.com",
          },
        ],
      },
    ],
  ];
  fetchWithOptsQueries.forEach(function ([query, options, expected]) {
    it(`fetch data using query and options fetch(${JSON.stringify(
      query
    )}, ${JSON.stringify(options)})`, async function () {
      const res = await db.fetch(
        query as CompositeType,
        options as FetchOptions
      );
      expect(res).to.deep.include(expected);
    });
  });

  it("fetch data fetch()", async function () {
    const expected = [
      {
        key: "fetch-key-1",
        name: "Wesley",
        user_age: 27,
        hometown: "San Francisco",
        email: "wesley@deta.sh",
      },
      {
        key: "fetch-key-2",
        name: "Beverly",
        user_age: 51,
        hometown: "Copernicus City",
        email: "beverly@deta.sh",
      },
      {
        key: "fetch-key-3",
        name: "Kevin Garnett",
        user_age: 43,
        hometown: "Greenville",
        email: "kevin@email.com",
      },
    ];
    const { items } = await db.fetch();
    expect(items).to.deep.equal(expected);
  });

  const invalidKeyQueries = [
    [{ "key?": "fetch-key-one" }, new Error("Bad query")],
    [{ "key??": "fetch-key-one" }, new Error("Bad query")],
    [{ "key?pfx": 12 }, new Error("Bad query")],
    [{ "key?r": [] }, new Error("Bad query")],
    [{ "key?r": ["fetch-key-one"] }, new Error("Bad query")],
    [{ "key?r": "Hello world" }, new Error("Bad query")],
    [{ "key?>": 12 }, new Error("Bad query")],
    [{ "key?>=": 12 }, new Error("Bad query")],
    [{ "key?<": 12 }, new Error("Bad query")],
    [{ "key?<=": 12 }, new Error("Bad query")],
    [{ "key?random": "fetch-key-one" }, new Error("Bad query")],
    [
      [{ "key?<=": "fetch-key-one" }, { key: "fetch-key-one" }],
      new Error("Bad query"),
    ],
    [
      [{ "key?<=": "fetch-key-one" }, { "key?<=": "fetch-key-two" }],
      new Error("Bad query"),
    ],
    [[{ user_age: 27 }, { "key?<=": "fetch-key-two" }], new Error("Bad query")],
    [
      [
        { user_age: 27, key: "fetch-key-two", "key?>": "fetch-key-three" },
        { "key?<=": "fetch-key-two" },
      ],
      new Error("Bad query"),
    ],
  ];
  invalidKeyQueries.forEach(function ([query, expected]) {
    it(`fetch data using invalid fetch key query fetch(${JSON.stringify(
      query
    )})`, async function () {
      try {
        const res = await db.fetch(query as CompositeType);
        expect(res).to.be.null;
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
    });
  });

  const invalidQueries = [
    [{ "name?": "Beverly" }, new Error("Bad query")],
    [{ "name??": "Beverly" }, new Error("Bad query")],
    [{ "?": "Beverly" }, new Error("Bad query")],
    [{ "user_age?r": [] }, new Error("Bad query")],
    [{ "user_age?r": [21] }, new Error("Bad query")],
    [{ "name?random": "Beverly" }, new Error("Bad query")],
    [{ "name?pfx": 12 }, new Error("Bad query")],
  ];
  invalidQueries.forEach(function ([query, expected]) {
    it(`fetch data using invalid fetch query fetch(${JSON.stringify(
      query
    )})`, async function () {
      try {
        const res = await db.fetch(query as CompositeType);
        expect(res).to.be.null;
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
    });
  });
});
