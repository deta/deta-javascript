import { expect } from 'chai';
import { Drive } from '../../src/index.node';
import { DRIVE_NAME } from '../utils/constants';

const drive = Drive(DRIVE_NAME);

describe('Drive#delete', () => {
  before(async () => {
    const inputs = ['delete-a', 'delete/a', 'delete/child/a'];

    for (const input of inputs) {
      const data = await drive.put(input, { data: 'hello' });
      expect(data).to.equal(input);
    }
  });

  ['delete-a', 'delete/a', 'delete/child/a'].forEach((name) => {
    it(`delete file by using name delete("${name}")`, async () => {
      const data = await drive.delete(name);
      expect(data).to.equal(name);
    });
  });

  ['delete-aa', 'delete/aa', 'delete/child/aa'].forEach((name) => {
    it(`delete file by using name that does not exist on drive delete("${name}")`, async () => {
      const data = await drive.delete(name);
      expect(data).to.equal(name);
    });
  });

  const invalidNameTests = [
    ['   ', new Error('Name is empty')],
    ['', new Error('Name is empty')],
    [null, new Error('Name is empty')],
    [undefined, new Error('Name is empty')],
  ];
  
  invalidNameTests.forEach(([name, expected]) => {
    it(`delete file by using invalid name delete("${name}")`, async () => {
      try {
        const data = await drive.delete(name as string);
        expect(data).to.equal(name);
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
    });
  });
});
