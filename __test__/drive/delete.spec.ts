import { Drive } from '../utils/deta';

const drive = Drive();

describe('Drive#delete', () => {
  beforeAll(async () => {
    const name = 'delete-a';
    const data = await drive.put(name, { data: 'hello' });
    expect(data).toEqual(name);
  });

  it('delete file by using name', async () => {
    const name = 'delete-a';
    const data = await drive.delete(name);
    expect(data).toEqual(name);
  });

  it('delete file by using name that does not exists on drive', async () => {
    const name = 'delete-aa';
    const data = await drive.delete(name);
    expect(data).toEqual(name);
  });

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
