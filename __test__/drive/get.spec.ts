import { Deta } from '../../src/index';

const projectKey = process.env.PROJECT_KEY || '';
const driveName = process.env.DRIVE_NAME || '';

const drive = Deta(projectKey).Drive(driveName);

describe('Drive#get', () => {
  beforeAll(async () => {
    const name = 'get-a';
    const data = await drive.put(name, { data: 'hello' });
    expect(data).toEqual(name);
  });

  afterAll(async () => {
    const name = 'get-a';
    const data = await drive.delete(name);
    expect(data).toEqual(name);
  });

  it('get file by using name', async () => {
    const data = await drive.get('get-a');
    expect(data).not.toBeNull();
  });

  it('get file by using name that does not exists on drive', async () => {
    const data = await drive.get('get-aa');
    expect(data).toBeNull();
  });

  it.each([
    ['   ', new Error('Name is empty')],
    ['', new Error('Name is empty')],
  ])('get file by using invalid name `get("%s")`', async (name, expected) => {
    try {
      const data = await drive.get(name);
      expect(data).not.toBeNull();
    } catch (err) {
      expect(err).toEqual(expected);
    }
  });
});
