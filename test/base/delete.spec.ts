import { expect } from 'chai';
import { Base } from '../../src/index.node';
import { BASE_NAME } from '../utils/constants';

const db = Base(BASE_NAME);

describe('Base#delete', function() {
  
  before(async function() {
    const inputs = [
      [{ name: 'alex', age: 77 }, 'delete_two', { name: 'alex', age: 77, key: 'delete_two' }],
      ['hello, worlds', 'delete_three', { value: 'hello, worlds', key: 'delete_three' }],
      [7, 'delete_four', { value: 7, key: 'delete_four' }],
      [['a', 'b', 'c'], 'delete_my_abc', { value: ['a', 'b', 'c'], key: 'delete_my_abc' }],
    ];

    const promises = inputs.map(async (input) => {
      const [value, key, expected] = input;
      const data = await db.put(value, key as string);
      expect(data).to.deep.equal(expected);
    });

    await Promise.all(promises);
  });

  ['delete_two', 'delete_three', 'delete_four', 'delete_my_abc', 'this is some random key']
    .forEach(function(key) {
      it(`delete data by using key delete("${key}")`, async function() {
        const data = await db.delete(key);
        expect(data).to.be.null;
      });
    });

  [
    ['   ', new Error('Key is empty')],
    ['', new Error('Key is empty')],
    [null, new Error('Key is empty')],
    [undefined, new Error('Key is empty')],
  ].forEach(function([key, expected]) {
    it(`delete data by using invalid key delete("${key}")`, async function() {
      try {
        const data = await db.delete(key as string);
        expect(data).to.be.null;
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
    });
  });
});
