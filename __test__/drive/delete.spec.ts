import { Drive } from '../utils/deta';

const drive = Drive();

describe('Drive#delete', () => {
  beforeAll(async () => {
    const inputs = ['delete-a', 'delete/a', 'delete/child/a'];

    const promises = inputs.map(async (input) => {
      const data = await drive.put(input, { data: 'hello' });
      expect(data).toEqual(input);
    });

    await Promise.all(promises);
  });

  it.each(['delete-a', 'delete/a', 'delete/child/a'])(
    'delete file by using name `delete("%s")`',
    async (name) => {
      const data = await drive.delete(name as string);
      expect(data).toEqual(name);
    }
  );

  it.each(['delete-aa', 'delete/aa', 'delete/child/aa'])(
    'delete file by using name that does not exists on drive `delete("%s")`',
    async (name) => {
      const data = await drive.delete(name as string);
      expect(data).toEqual(name);
    }
  );

  it.each([
    ['   ', new Error('Name is empty')],
    ['', new Error('Name is empty')],
    [null, new Error('Name is empty')],
    [undefined, new Error('Name is empty')],
  ])(
    'delete file by using invalid name `delete("%s")`',
    async (name, expected) => {
      try {
        const data = await drive.delete(name as string);
        expect(data).toEqual(name);
      } catch (err) {
        expect(err).toEqual(expected);
      }
    }
  );
});
