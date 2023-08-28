import { expect } from 'chai';
import { Base } from '../../src/index.node';
import { BASE_NAME } from '../utils/constants';

const db = Base(BASE_NAME);

describe('Base#get', () => {
  before(async () => {
    const inputs = [
      [
        { name: 'alex', age: 77, key: 'get_one' },
        { name: 'alex', age: 77, key: 'get_one' },
      ],
    ];

    const promises = inputs.map(async (input) => {
      const [value, expected] = input;
      const data = await db.put(value);
      expect(data).to.deep.equal(expected);
    });

    await Promise.all(promises);
  });

  after(async () => {
    const inputs = [['get_one']];

    const promises = inputs.map(async (input) => {
      const [key] = input;
      const data = await db.delete(key);
      expect(data).to.be.null;
    });

    await Promise.all(promises);
  });

  const testData = [
    ['get_one', { name: 'alex', age: 77, key: 'get_one' }],
    ['this is some random key', null],
  ];

  for(let [key, expected] of testData) {
    it(`get data by using key get("${key}")`, async () => {
      const data = await db.get(key as string);
      expect(data).to.deep.equal(expected);
    });
  }

  const invalidData = [
    ['   ', new Error('Key is empty')],
    ['', new Error('Key is empty')],
    [null, new Error('Key is empty')],
    [undefined, new Error('Key is empty')],
  ];

  for(let [key, expected] of invalidData) {
    it(`get data by using invalid key get("${key}")`, async () => {
      try {
        const data = await db.get(key as string);
        expect(data).to.be.null;
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
    });
  }
});
