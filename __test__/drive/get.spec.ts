import { Deta } from '../../src/index';

const projectKey = process.env.PROJECT_KEY || '';
const driveName = process.env.DRIVE_NAME || '';

const drive = Deta(projectKey).Drive(driveName);

describe.only('Drive#get', () => {
  it('get data by using name', async () => {
    const data = await drive.get('a.png');
    expect(data).not.toBeNull();
  });

  it('get data by using name that does not exists on drive', async () => {
    const data = await drive.get('aa.png');
    expect(data).toBeNull();
  });

  it.each([
    ['   ', new Error('Name is empty')],
    ['', new Error('Name is empty')],
  ])('get data by using invalid name `get("%s")`', async (key, expected) => {
    try {
      const data = await drive.get(key);
      expect(data).not.toBeNull();
    } catch (err) {
      expect(err).toEqual(expected);
    }
  });
});
