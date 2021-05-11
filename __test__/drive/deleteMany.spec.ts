import { Deta } from '../../src/index';

const projectKey = process.env.PROJECT_KEY || '';
const driveName = process.env.DRIVE_NAME || '';

const drive = Deta(projectKey).Drive(driveName);

describe.only('Drive#deleteMany', () => {
  it('deleteMany files by using names', async () => {
    const names = ['delete-many-a.png'];
    const expected = {
      deleted: ['delete-many-a.png'],
    };
    const data = await drive.deleteMany(names);
    expect(data).toEqual(expected);
  });

  it('deleteMany files by using names that does not exists on drive', async () => {
    const names = ['delete-many-aa.png'];
    const expected = {
      deleted: ['delete-many-aa.png'],
    };
    const data = await drive.deleteMany(names);
    expect(data).toEqual(expected);
  });

  it('deleteMany files by using valid and invalid names', async () => {
    const names = ['delete-many-aa.png', '', '  '];
    const expected = {
      deleted: ['delete-many-aa.png'],
      failed: {
        '': 'invalid name',
        '  ': 'invalid name',
      },
    };
    const data = await drive.deleteMany(names);
    expect(data).toEqual(expected);
  });

  it.each([
    [['   '], new Error("Names can't be empty")],
    [[''], new Error("Names can't be empty")],
    [[], new Error("Names can't be empty")],
    [
      new Array(1001),
      new Error("We can't delete more than 1000 items at a time"),
    ],
  ])(
    'deleteMany files by using invalid name `deleteMany(%s)`',
    async (names, expected) => {
      try {
        const data = await drive.deleteMany(names);
        expect(data).toEqual(names);
      } catch (err) {
        expect(err).toEqual(expected);
      }
    }
  );
});
