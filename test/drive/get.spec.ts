import { expect } from 'chai';
import { Drive } from '../../src/index.node';
import { DRIVE_NAME } from '../utils/constants';

const drive = Drive(DRIVE_NAME);

describe('Drive#get', () => {
  const fileContent = '{"hello":"world"}';

  before(async () => {
    const inputs = ['get-a', 'get/a', 'get/child/a'];

    for (const input of inputs) {
      const data = await drive.put(input, { data: fileContent });
      expect(data).to.equal(input);
    }
  });

  after(async () => {
    const inputs = ['get-a', 'get/a', 'get/child/a'];

    for (const input of inputs) {
      const data = await drive.delete(input);
      expect(data).to.equal(input);
    }
  });

  const validNames = ['get-a', 'get/a', 'get/child/a'];
  validNames.forEach((name) => {
    it(`get file by using name get("${name}")`, async () => {
      const data = await drive.get(name);
      expect(data).to.not.be.null;
      const value = await data?.text();
      expect(value).to.equal(fileContent);
    });
  });

  const nonExistingNames = ['get-aa', 'get/aa', 'get/child/aa'];
  nonExistingNames.forEach((name) => {
    it(`get file by using name that does not exist on drive get("${name}")`, async () => {
      const data = await drive.get(name);
      expect(data).to.be.null;
    });
  });

  const invalidNamesTests = [
    ['   ', new Error('Name is empty')],
    ['', new Error('Name is empty')],
    [null, new Error('Name is empty')],
    [undefined, new Error('Name is empty')],
  ];

  invalidNamesTests.forEach(([name, expected]) => {
    it(`get file by using invalid name get("${name}")`, async () => {
      try {
        const data = await drive.get(name as string);
        expect(data).to.not.be.null;
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
    });
  });
});
