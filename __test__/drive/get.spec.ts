import { Drive } from '../utils/deta';

const drive = Drive();

describe('Drive#get', () => {
  beforeAll(async () => {
    const inputs = ['get-a', 'get/a', 'get/child/a'];

    const promises = inputs.map(async (input) => {
      const data = await drive.put(input, { data: 'hello' });
      expect(data).toEqual(input);
    });

    await Promise.all(promises);
  });

  afterAll(async () => {
    const inputs = ['get-a', 'get/a', 'get/child/a'];

    const promises = inputs.map(async (input) => {
      const data = await drive.delete(input);
      expect(data).toEqual(input);
    });

    await Promise.all(promises);
  });

  it.each(['get-a', 'get/a', 'get/child/a'])(
    'get file by using name `get("%s")`',
    async (name) => {
      const data = await drive.get(name as string);
      expect(data).not.toBeNull();
    }
  );

  it.each(['get-aa', 'get/aa', 'get/child/aa'])(
    'get file by using name that does not exists on drive `get("%s")`',
    async (name) => {
      const data = await drive.get(name as string);
      expect(data).toBeNull();
    }
  );

  it.each([
    ['   ', new Error('Name is empty')],
    ['', new Error('Name is empty')],
    [null, new Error('Name is empty')],
    [undefined, new Error('Name is empty')],
  ])('get file by using invalid name `get("%s")`', async (name, expected) => {
    try {
      const data = await drive.get(name as string);
      expect(data).not.toBeNull();
    } catch (err) {
      expect(err).toEqual(expected);
    }
  });
});
