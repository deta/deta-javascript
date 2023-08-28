import { expect } from "chai";
import { Base } from "../../src/index.node";
import { ObjectType } from "../../src/types/basic";
import { UpdateOptions } from "../../src/types/base/request";
import { Day } from "../../src/utils/date";
import { BaseGeneral } from "../../src/constants/general";
import { mockSystemTime, useRealTime } from "../utils/general";
import { BASE_NAME } from "../utils/constants";

const db = Base(BASE_NAME);

describe("Base#update", () => {
  before(async () => {
    mockSystemTime();

    const inputs = [
      [
        {
          key: "update-user-a",
          username: "jimmy",
          profile: {
            age: 32,
            active: false,
            hometown: "pittsburgh",
          },
          on_mobile: true,
          likes: ["anime"],
          dislikes: ["comedy"],
          purchases: 1,
        },
        {
          key: "update-user-a",
          username: "jimmy",
          profile: {
            age: 32,
            active: false,
            hometown: "pittsburgh",
          },
          on_mobile: true,
          likes: ["anime"],
          dislikes: ["comedy"],
          purchases: 1,
        },
      ],
    ];

    for (const input of inputs) {
      const [value, expected] = input;
      const data = await db.put(value);
      expect(data).to.deep.equal(expected);
    }
  });

  after(async () => {
    useRealTime();

    const inputs = [["update-user-a"]];

    for (const input of inputs) {
      const [key] = input;
      const data = await db.delete(key);
      expect(data).to.be.null;
    }
  });

  const updateDataTests = [
    [
      {
        "profile.age": 33,
        "profile.active": true,
        "profile.email": "jimmy@deta.sh",
        "profile.hometown": db.util.trim(),
        on_mobile: db.util.trim(),
        purchases: db.util.increment(2),
        likes: db.util.append("ramen"),
        dislikes: db.util.prepend("action"),
      },
      "update-user-a",
      undefined,
      {
        key: "update-user-a",
        username: "jimmy",
        profile: {
          age: 33,
          active: true,
          email: "jimmy@deta.sh",
        },
        likes: ["anime", "ramen"],
        dislikes: ["action", "comedy"],
        purchases: 3,
      },
    ],
    [
      {
        purchases: db.util.increment(),
        likes: db.util.append(["momo"]),
        dislikes: db.util.prepend(["romcom"]),
      },
      "update-user-a",
      {},
      {
        key: "update-user-a",
        username: "jimmy",
        profile: {
          age: 33,
          active: true,
          email: "jimmy@deta.sh",
        },
        likes: ["anime", "ramen", "momo"],
        dislikes: ["romcom", "action", "comedy"],
        purchases: 4,
      },
    ],
  ];
  updateDataTests.forEach(([updates, key, options, expected]) => {
    it(`update data update(${JSON.stringify(
      updates
    )}, "${key}", ${JSON.stringify(options)})`, async () => {
      const data = await db.update(
        updates as ObjectType,
        key as string,
        options as UpdateOptions
      );
      expect(data).to.be.null;
      const updatedData = await db.get(key as string);
      expect(updatedData).to.deep.equal(expected);
    });
  });

  const invalidOptionsUpdateTests = [
    [
      {
        purchases: db.util.increment(),
      },
      "update-user-a",
      {
        expireIn: 5,
        expireAt: new Date(),
      },
      new Error("can't set both expireIn and expireAt options"),
    ],
    [
      {
        purchases: db.util.increment(),
      },
      "update-user-a",
      { expireIn: "invalid" },
      new Error("option expireIn should have a value of type number"),
    ],
    [
      {
        purchases: db.util.increment(),
      },
      "update-user-a",
      { expireIn: new Date() },
      new Error("option expireIn should have a value of type number"),
    ],
    [
      {
        purchases: db.util.increment(),
      },
      "update-user-a",
      { expireIn: {} },
      new Error("option expireIn should have a value of type number"),
    ],
    [
      {
        purchases: db.util.increment(),
      },
      "update-user-a",
      { expireIn: [] },
      new Error("option expireIn should have a value of type number"),
    ],
    [
      {
        purchases: db.util.increment(),
      },
      "update-user-a",
      { expireAt: "invalid" },
      new Error("option expireAt should have a value of type number or Date"),
    ],
    [
      {
        purchases: db.util.increment(),
      },
      "update-user-a",
      { expireAt: {} },
      new Error("option expireAt should have a value of type number or Date"),
    ],
    [
      {
        purchases: db.util.increment(),
      },
      "update-user-a",
      { expireAt: [] },
      new Error("option expireAt should have a value of type number or Date"),
    ],
  ];
  invalidOptionsUpdateTests.forEach(([updates, key, options, expected]) => {
    it(`update data with invalid options update(${JSON.stringify(
      updates
    )}, "${key}", ${JSON.stringify(options)})`, async () => {
      try {
        const data = await db.update(
          updates as ObjectType,
          key as string,
          options as UpdateOptions
        );
        expect(data).to.be.null;
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
    });
  });

  it("update data with expireIn option", async () => {
    const updates = {
      purchases: db.util.increment(),
    };
    const key = "update-user-a";
    const options = {
      expireIn: 5,
    };
    const expected = {
      key,
      username: "jimmy",
      profile: {
        age: 33,
        active: true,
        email: "jimmy@deta.sh",
      },
      likes: ["anime", "ramen", "momo"],
      dislikes: ["romcom", "action", "comedy"],
      purchases: 5,
      [BaseGeneral.TTL_ATTRIBUTE]: new Day().addSeconds(5).getEpochSeconds(),
    };
    const data = await db.update(updates, key, options);
    expect(data).to.be.null;
    const updatedData = await db.get(key);
    expect(updatedData).to.deep.equal(expected);
  });

  it("update data with expireAt option", async () => {
    const updates = {
      purchases: db.util.increment(),
    };
    const key = "update-user-a";
    const options = {
      expireAt: new Date(),
    };
    const expected = {
      key,
      username: "jimmy",
      profile: {
        age: 33,
        active: true,
        email: "jimmy@deta.sh",
      },
      likes: ["anime", "ramen", "momo"],
      dislikes: ["romcom", "action", "comedy"],
      purchases: 6,
      [BaseGeneral.TTL_ATTRIBUTE]: new Day().getEpochSeconds(),
    };
    const data = await db.update(updates, key, options);
    expect(data).to.be.null;
    const updatedData = await db.get(key);
    expect(updatedData).to.deep.equal(expected);
  });

  const invalidKeyUpdateTests = [
    [{}, "   ", new Error("Key is empty")],
    [{}, "", new Error("Key is empty")],
    [{}, null, new Error("Key is empty")],
    [{}, undefined, new Error("Key is empty")],
  ];
  invalidKeyUpdateTests.forEach(([updates, key, expected]) => {
    it(`update data by using invalid key update(${JSON.stringify(
      updates
    )}, "${key}")`, async () => {
      try {
        const data = await db.update(updates as ObjectType, key as string);
        expect(data).to.be.null;
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
    });
  });
});