import { Deta } from '../../src/index';

const projectKey = process.env.PROJECT_KEY || '';
const driveName = process.env.DRIVE_NAME || '';

const drive = Deta(projectKey).Drive(driveName);

describe('Drive#put', () => {
  afterAll(async () => {
    const names = ['put-test.svg', 'put-data', 'put-data-1', 'put-data-2'];
    const expected = {
      deleted: ['put-test.svg', 'put-data', 'put-data-1', 'put-data-2'],
    };
    const data = await drive.deleteMany(names);
    expect(data).toEqual(expected);
  });

  it('put file', async () => {
    const name = 'put-test.svg';
    const data = await drive.put(name, {
      path: '__test__/files/logo.svg',
    });

    expect(data).toEqual(name);
  });

  it('put data', async () => {
    const name = 'put-data';
    const data = await drive.put(name, {
      data: 'Hello world',
    });

    expect(data).toEqual(name);
  });

  it('put data with contentType', async () => {
    const name = 'put-data-1';
    const data = await drive.put(name, {
      data: 'Hello world',
      contentType: 'text/plain',
    });

    expect(data).toEqual(name);
  });

  it('put data as Buffer', async () => {
    const name = 'put-data-2';
    const data = await drive.put(name, {
      data: Buffer.from('Hello world, Hello'),
    });

    expect(data).toEqual(name);
  });

  it.each([
    [
      '   ',
      {
        data: 'Hello world',
        contentType: 'text/plain',
      },
      new Error('Name is empty'),
    ],
    [
      '',
      {
        data: 'Hello world',
        contentType: 'text/plain',
      },
      new Error('Name is empty'),
    ],
    [
      'put-data-2',
      {
        path: '__test__/files/logo.svg',
        data: 'Hello world',
        contentType: 'text/plain',
      },
      new Error('Please only provide data or a path. Not both'),
    ],
    [
      'put-data-3',
      {
        contentType: 'text/plain',
      },
      new Error('Please provide data or a path. Both are empty'),
    ],
    [
      'put-data-4',
      {
        data: 12 as any,
        contentType: 'text/plain',
      },
      new Error(
        'Unsupported data format, expected data to be one of: string | Uint8Array | Buffer'
      ),
    ],
  ])(
    'put file by using invalid name or body `put("%s", %p)`',
    async (name, body, expected) => {
      try {
        const data = await drive.put(name, body);
        expect(data).not.toBeNull();
      } catch (err) {
        expect(err).toEqual(expected);
      }
    }
  );
});
