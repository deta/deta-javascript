import { expect } from "chai";
import { Base } from "../../src/index.node";
import { DetaType } from "../../src/types/basic";
import { PutManyOptions } from "../../src/types/base/request";
import { Day } from "../../src/utils/date";
import { BaseGeneral } from "../../src/constants/general";
import { mockSystemTime, useRealTime } from "../utils/general";
import { BASE_NAME } from "../utils/constants";

const db = Base(BASE_NAME);

describe("Base#putMany", () => {
  before(() => {
    mockSystemTime();
  });

  after(() => {
    useRealTime();
  });

  const itemsWithoutKeyTests = [
    [
      [
        { name: "Beverly", hometown: "Copernicus City" },
        "dude",
        ["Namaskāra", "marhabaan", "hello", "yeoboseyo"],
      ],
      {
        processed: {
          items: [
            {
              hometown: "Copernicus City",
              name: "Beverly",
            },
            {
              value: "dude",
            },
            {
              value: ["Namaskāra", "marhabaan", "hello", "yeoboseyo"],
            },
          ],
        },
      },
    ],
  ];
  itemsWithoutKeyTests.forEach(([items, expected]) => {
    it(`putMany items, without key putMany(${JSON.stringify(
      items
    )})`, async () => {
      const data = await db.putMany(items as DetaType[]);
      const sanitizedData = JSON.parse(JSON.stringify(data));
      sanitizedData.processed.items = sanitizedData.processed.items.map(
        (item: any) => {
          const { key, ...rest } = item as any;
          return rest;
        }
      );
      expect(sanitizedData).to.deep.equal(expected);

      for (let val of data?.processed?.items) {
        const deleteRes = await db.delete((val as any)?.key);
        expect(deleteRes).to.be.null;
      }
    });
  });

  it("putMany data with expireIn option", async () => {
    const items = [
      { name: "Beverly", hometown: "Copernicus City" },
      { name: "Jon", hometown: "New York" },
    ];
    const options = {
      expireIn: 233,
    };
    const expected = {
      processed: {
        items: [
          {
            hometown: "Copernicus City",
            name: "Beverly",
            [BaseGeneral.TTL_ATTRIBUTE]: new Day()
              .addSeconds(233)
              .getEpochSeconds(),
          },
          {
            hometown: "New York",
            name: "Jon",
            [BaseGeneral.TTL_ATTRIBUTE]: new Day()
              .addSeconds(233)
              .getEpochSeconds(),
          },
        ],
      },
    };
    const data = await db.putMany(items as DetaType[], options);
    const sanitizedData = JSON.parse(JSON.stringify(data));
    sanitizedData.processed.items = sanitizedData.processed.items.map(
      (item: any) => {
        const { key, ...rest } = item as any;
        return rest;
      }
    );
    expect(sanitizedData).to.deep.equal(expected);

    for (let val of data?.processed?.items) {
      const deleteRes = await db.delete((val as any)?.key);
      expect(deleteRes).to.be.null;
    }
  });

  it("putMany data with expireAt option", async () => {
    const items = [
      { name: "Beverly", hometown: "Copernicus City" },
      { name: "Jon", hometown: "New York" },
    ];
    const options = {
      expireAt: new Date(),
    };
    const expected = {
      processed: {
        items: [
          {
            hometown: "Copernicus City",
            name: "Beverly",
            [BaseGeneral.TTL_ATTRIBUTE]: new Day().getEpochSeconds(),
          },
          {
            hometown: "New York",
            name: "Jon",
            [BaseGeneral.TTL_ATTRIBUTE]: new Day().getEpochSeconds(),
          },
        ],
      },
    };
    const data = await db.putMany(items as DetaType[], options);
    const sanitizedData = JSON.parse(JSON.stringify(data));
    sanitizedData.processed.items = sanitizedData.processed.items.map(
      (item: any) => {
        const { key, ...rest } = item as any;
        return rest;
      }
    );
    expect(sanitizedData).to.deep.equal(expected);

    for (let val of data?.processed?.items) {
      const deleteRes = await db.delete((val as any)?.key);
      expect(deleteRes).to.be.null;
    }
  });

  const itemsWithInvalidOptionsTests = [
    [
      [
        { name: "Beverly", hometown: "Copernicus City" },
        { name: "Jon", hometown: "New York" },
      ],
      {
        expireIn: 5,
        expireAt: new Date(),
      },
      new Error("can't set both expireIn and expireAt options"),
    ],
    [
      [
        { name: "Beverly", hometown: "Copernicus City" },
        { name: "Jon", hometown: "New York" },
      ],
      { expireIn: "invalid" },
      new Error("option expireIn should have a value of type number"),
    ],
    [
      [
        { name: "Beverly", hometown: "Copernicus City" },
        { name: "Jon", hometown: "New York" },
      ],
      { expireIn: new Date() },
      new Error("option expireIn should have a value of type number"),
    ],
    [
      [
        { name: "Beverly", hometown: "Copernicus City" },
        { name: "Jon", hometown: "New York" },
      ],
      { expireIn: {} },
      new Error("option expireIn should have a value of type number"),
    ],
    [
      [
        { name: "Beverly", hometown: "Copernicus City" },
        { name: "Jon", hometown: "New York" },
      ],
      { expireIn: [] },
      new Error("option expireIn should have a value of type number"),
    ],
    [
      [
        { name: "Beverly", hometown: "Copernicus City" },
        { name: "Jon", hometown: "New York" },
      ],
      { expireAt: "invalid" },
      new Error("option expireAt should have a value of type number or Date"),
    ],
    [
      [
        { name: "Beverly", hometown: "Copernicus City" },
        { name: "Jon", hometown: "New York" },
      ],
      { expireAt: {} },
      new Error("option expireAt should have a value of type number or Date"),
    ],
    [
      [
        { name: "Beverly", hometown: "Copernicus City" },
        { name: "Jon", hometown: "New York" },
      ],
      { expireAt: [] },
      new Error("option expireAt should have a value of type number or Date"),
    ],
  ];
  itemsWithInvalidOptionsTests.forEach(([items, options, expected]) => {
    it(`putMany items, with invalid options putMany(${JSON.stringify(
      items
    )}, ${JSON.stringify(options)})`, async () => {
      try {
        const data = await db.putMany(
          items as DetaType[],
          options as PutManyOptions
        );
        expect(data).to.be.null;
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
    });
  });

  const itemsWithKeyTests = [
    [
      [
        {
          key: "put-many-key-1",
          name: "Wesley",
          user_age: 27,
          hometown: "San Francisco",
          email: "wesley@deta.sh",
        },
        {
          key: "put-many-key-2",
          name: "Beverly",
          user_age: 51,
          hometown: "Copernicus City",
          email: "beverly@deta.sh",
        },
        {
          key: "put-many-key-3",
          name: "Kevin Garnett",
          user_age: 43,
          hometown: "Greenville",
          email: "kevin@email.com",
        },
      ],
      {
        processed: {
          items: [
            {
              key: "put-many-key-1",
              name: "Wesley",
              user_age: 27,
              hometown: "San Francisco",
              email: "wesley@deta.sh",
            },
            {
              key: "put-many-key-2",
              name: "Beverly",
              user_age: 51,
              hometown: "Copernicus City",
              email: "beverly@deta.sh",
            },
            {
              key: "put-many-key-3",
              name: "Kevin Garnett",
              user_age: 43,
              hometown: "Greenville",
              email: "kevin@email.com",
            },
          ],
        },
      },
    ],
  ];
  itemsWithKeyTests.forEach(([items, expected]) => {
    it(`putMany items, with key putMany(${JSON.stringify(
      items
    )})`, async () => {
      const data = await db.putMany(items as DetaType[]);
      expect(data).to.deep.include(expected);
      for (let val of data?.processed?.items) {
        const deleteRes = await db.delete((val as any)?.key);
        expect(deleteRes).to.be.null;
      }
    });
  });

  it("putMany items is not an instance of array", async () => {
    const value: any = "hello";
    try {
      const res = await db.putMany(value);
      expect(res).to.be.null;
    } catch (err) {
      expect(err).to.deep.equal(new Error("Items must be an array"));
    }
  });

  it("putMany items length is more then 25", async () => {
    const items = new Array(26);
    try {
      const res = await db.putMany(items);
      expect(res).to.be.null;
    } catch (err) {
      expect(err).to.deep.equal(
        new Error("We can't put more than 25 items at a time")
      );
    }
  });

  it("putMany items length is zero", async () => {
    const items = new Array(0);
    try {
      const res = await db.putMany(items);
      expect(res).to.be.null;
    } catch (err) {
      expect(err).to.deep.equal(new Error("Items can't be empty"));
    }
  });
});