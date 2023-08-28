import { expect } from "chai";
import { Base } from "../../src/index.node";
import { DetaType } from "../../src/types/basic";
import { InsertOptions } from "../../src/types/base/request";
import { Day } from "../../src/utils/date";
import { BaseGeneral } from "../../src/constants/general";
import { mockSystemTime, useRealTime } from "../utils/general";
import { BASE_NAME } from "../utils/constants";

const db = Base(BASE_NAME);

describe("Base#insert", () => {
  before(() => {
    mockSystemTime();
  });

  after(() => {
    useRealTime();
  });

  const onlyDataTests = [
    [
      { name: "alex", age: 77 },
      { name: "alex", age: 77 },
    ],
    ["hello, worlds", { value: "hello, worlds" }],
    [7, { value: 7 }],
  ];
  onlyDataTests.forEach(([input, expected]) => {
    it(`by only passing data, without key insert(${JSON.stringify(
      input
    )})`, async () => {
      const data = await db.insert(input);
      expect(data).to.deep.include(expected);
      const deleteRes = await db.delete(data.key as string);
      expect(deleteRes).to.be.null;
    });
  });

  const dataAndKeyInObjectTests = [
    [
      {
        key: "insert-user-a",
        username: "jimmy",
        profile: {
          age: 32,
          active: false,
          hometown: "pittsburgh",
        },
        on_mobile: true,
        likes: ["anime"],
        purchases: 1,
      },
      {
        key: "insert-user-a",
        username: "jimmy",
        profile: {
          age: 32,
          active: false,
          hometown: "pittsburgh",
        },
        on_mobile: true,
        likes: ["anime"],
        purchases: 1,
      },
    ],
  ];
  dataAndKeyInObjectTests.forEach(([input, expected]) => {
    it(`by passing data and key in object itself insert(${JSON.stringify(
      input
    )})`, async () => {
      const data = await db.insert(input);
      expect(data).to.deep.equal(expected);
      const deleteRes = await db.delete(data.key as string);
      expect(deleteRes).to.be.null;
    });
  });

  const dataFirstKeySecondTests = [
    [7, "insert-newKey", { value: 7, key: "insert-newKey" }],
    [
      ["a", "b", "c"],
      "insert-my-abc2",
      { value: ["a", "b", "c"], key: "insert-my-abc2" },
    ],
  ];
  dataFirstKeySecondTests.forEach(([value, key, expected]) => {
    it(`by passing data as first parameter and key as second parameter insert(${JSON.stringify(
      value
    )}, "${key}")`, async () => {
      const data = await db.insert(value as DetaType, key as string);
      expect(data).to.deep.equal(expected);
      const deleteRes = await db.delete(data.key as string);
      expect(deleteRes).to.be.null;
    });
  });

  it("insert data with expireIn option", async () => {
    const value = 7;
    const key = "insert-newKey-one";
    const options = { expireIn: 500 };
    const expected = {
      value: 7,
      key,
      [BaseGeneral.TTL_ATTRIBUTE]: new Day().addSeconds(500).getEpochSeconds(),
    };
    const data = await db.insert(value, key, options);
    expect(data).to.deep.equal(expected);
    const deleteRes = await db.delete(data.key as string);
    expect(deleteRes).to.be.null;
  });

  it("insert data with expireAt option", async () => {
    const value = 7;
    const key = "insert-newKey-two";
    const options = { expireAt: new Date() };
    const expected = {
      value: 7,
      key,
      [BaseGeneral.TTL_ATTRIBUTE]: new Day().getEpochSeconds(),
    };
    const data = await db.insert(value, key, options);
    expect(data).to.deep.equal(expected);
    const deleteRes = await db.delete(data.key as string);
    expect(deleteRes).to.be.null;
  });

  const invalidOptionsTests = [
    [
      7,
      "insert-newKey-three",
      { expireIn: 5, expireAt: new Date() },
      new Error("can't set both expireIn and expireAt options"),
    ],
    [
      7,
      "insert-newKey-three",
      { expireIn: "invalid" },
      new Error("option expireIn should have a value of type number"),
    ],
    [
      7,
      "insert-newKey-three",
      { expireIn: new Date() },
      new Error("option expireIn should have a value of type number"),
    ],
    [
      7,
      "insert-newKey-three",
      { expireIn: {} },
      new Error("option expireIn should have a value of type number"),
    ],
    [
      7,
      "insert-newKey-three",
      { expireIn: [] },
      new Error("option expireIn should have a value of type number"),
    ],
    [
      7,
      "insert-newKey-three",
      { expireAt: "invalid" },
      new Error("option expireAt should have a value of type number or Date"),
    ],
    [
      7,
      "insert-newKey-three",
      { expireAt: {} },
      new Error("option expireAt should have a value of type number or Date"),
    ],
    [
      7,
      "insert-newKey-three",
      { expireAt: [] },
      new Error("option expireAt should have a value of type number or Date"),
    ],
  ];
  invalidOptionsTests.forEach(([value, key, options, expected]) => {
    it(`by passing data as first parameter, key as second parameter and invalid options as third parameter insert(${JSON.stringify(
      value
    )}, "${key}", ${JSON.stringify(options)})`, async () => {
      try {
        const data = await db.insert(
          value as DetaType,
          key as string,
          options as InsertOptions
        );
        expect(data).to.be.null;
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
    });
  });

  const keyAlreadyExistsTests = [
    [
      { name: "alex", age: 77 },
      "insert-two",
      new Error("Item with key insert-two already exists"),
    ],
    [
      "hello, worlds",
      "insert-three",
      new Error("Item with key insert-three already exists"),
    ],
  ];
  keyAlreadyExistsTests.forEach(([value, key, expected]) => {
    it(`by passing key that already exist insert(${JSON.stringify(
      value
    )}, "${key}")`, async () => {
      const data = await db.insert(value as DetaType, key as string);
      try {
        const res = await db.insert(value as DetaType, key as string);
        expect(res).to.be.null;
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
      const deleteRes = await db.delete(data.key as string);
      expect(deleteRes).to.be.null;
    });
  });
});
