import { Deta } from '../../src/index.node';

const projectKey = process.env.PROJECT_KEY || '';
const driveName = process.env.DRIVE_NAME || '';

const drive = Deta(projectKey).Drive(driveName);

describe('Drive#list', () => {
  beforeAll(async () => {
    const inputs = [['list-a'], ['list-b'], ['list-c']];

    const promises = inputs.map(async (input) => {
      const [name] = input;
      const data = await drive.put(name, { data: 'hello' });
      expect(data).toEqual(name);
    });

    await Promise.all(promises);
  });

  afterAll(async () => {
    const names = ['list-a', 'list-b', 'list-c'];
    const expected = {
      deleted: ['list-a', 'list-b', 'list-c'],
    };
    const data = await drive.deleteMany(names);
    expect(data).toEqual(expected);
  });

  it('list files', async () => {
    const expected = {
      names: ['list-a', 'list-b', 'list-c'],
    };
    const data = await drive.list();
    expect(data).toEqual(expected);
  });

  it('list files using limit', async () => {
    const expected = {
      paging: {
        size: 1,
        last: 'list-a',
      },
      names: ['list-a'],
    };
    const data = await drive.list({ limit: 1 });
    expect(data).toEqual(expected);
  });

  it('list files using prefix', async () => {
    const expected = {
      paging: {
        size: 2,
        last: 'list-b',
      },
      names: ['list-a', 'list-b'],
    };
    const data = await drive.list({ limit: 2, prefix: 'list-' });
    expect(data).toEqual(expected);
  });

  it('list files using last', async () => {
    const expected = {
      names: ['list-c'],
    };
    const data = await drive.list({ limit: 2, prefix: 'list', last: 'list-b' });
    expect(data).toEqual(expected);
  });
});
