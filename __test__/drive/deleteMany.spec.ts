import { Drive } from '../utils/deta';

const drive = Drive();

describe('Drive#deleteMany', () => {
  beforeAll(async () => {
    const inputs = ['delete-many-a', 'delete-many/a', 'delete-many/child/a'];

    const promises = inputs.map(async (input) => {
      const data = await drive.put(input, { data: 'hello' });
      expect(data).toEqual(input);
    });

    await Promise.all(promises);
  });

  it('deleteMany files by using names', async () => {
    const names = ['delete-many-a', 'delete-many/a', 'delete-many/child/a'];
    const expected = {
      deleted: ['delete-many-a', 'delete-many/a', 'delete-many/child/a'],
    };
    const data = await drive.deleteMany(names);
    data.deleted.sort();
    expect(data).toEqual(expected);
  });

  it('deleteMany files by using names that does not exists on drive', async () => {
    const names = ['delete-many-aa', 'delete-many/aa'];
    const expected = {
      deleted: ['delete-many-aa', 'delete-many/aa'],
    };
    const data = await drive.deleteMany(names);
    data.deleted.sort();
    expect(data).toEqual(expected);
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
    data.deleted.sort();
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
