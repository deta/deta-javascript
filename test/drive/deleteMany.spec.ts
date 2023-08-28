import { expect } from 'chai';
import { Drive } from '../../src/index.node';
import { DRIVE_NAME } from '../utils/constants';

const drive = Drive(DRIVE_NAME);

describe('Drive#deleteMany', () => {
  before(async () => {
    const inputs = ['delete-many-a', 'delete-many/a', 'delete-many/child/a'];

    for (const input of inputs) {
      const data = await drive.put(input, { data: 'hello' });
      expect(data).to.equal(input);
    }
  });

  it('deleteMany files by using names', async () => {
    const names = ['delete-many-a', 'delete-many/a', 'delete-many/child/a'];
    const expected = {
      deleted: ['delete-many-a', 'delete-many/a', 'delete-many/child/a'],
    };
    const data = await drive.deleteMany(names);
    expect(data.deleted).to.have.members(expected.deleted);
  });

  it('deleteMany files by using names that do not exist on drive', async () => {
    const names = ['delete-many-aa', 'delete-many/aa'];
    const expected = {
      deleted: ['delete-many-aa', 'delete-many/aa'],
    };
    const data = await drive.deleteMany(names);
    expect(data.deleted).to.have.members(expected.deleted);
  });

  it('deleteMany files by using valid and invalid names', async () => {
    const names = ['delete-many-aa', 'delete-many/aa', '', '  '];
    const expected = {
      deleted: ['delete-many-aa', 'delete-many/aa'],
      failed: {
        '': 'invalid name',
        '  ': 'invalid name',
      },
    };
    const data = await drive.deleteMany(names);
    expect(data.deleted).to.have.members(expected.deleted);
  });

  const invalidNamesTests = [
    [['   '], new Error("Names can't be empty")],
    [[''], new Error("Names can't be empty")],
    [[], new Error("Names can't be empty")],
    [
      new Array(1001),
      new Error("We can't delete more than 1000 items at a time"),
    ],
  ];

  invalidNamesTests.forEach(([names, expected]) => {
    it(`deleteMany files by using invalid name deleteMany(${JSON.stringify(names)})`, async () => {
      try {
        const data = await drive.deleteMany(names as string[]);
        expect(data).to.deep.equal(names);
      } catch (err) {
        expect(err).to.deep.equal(expected);
      }
    });
  });
});
