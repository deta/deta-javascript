import { expect } from 'chai';
import { Drive } from '../../src/index.node';
import { PutOptions } from '../../src/types/drive/request';
import { DRIVE_NAME } from '../utils/constants';

const drive = Drive(DRIVE_NAME);

describe('Drive#put', () => {
  after(async () => {
    const names = [
      'put-data',
      'put-data-1',
      'put-data-2',
      'put-data/a',
      'put-data/child/a',
      'put-test.svg',
    ];
    const expected = {
      deleted: [
        'put-data',
        'put-data-1',
        'put-data-2',
        'put-data/a',
        'put-data/child/a',
        'put-test.svg',
      ],
    };
    const data = await drive.deleteMany(names);
    expect(data.deleted).to.have.members(expected.deleted);
  });

  it('put file', async function(this: Mocha.Context) {
    // if running in a browser, skip this test
    if (typeof window !== 'undefined') {
      this.skip();
      return Promise.resolve();
    }

    const name = 'put-test.svg';
    const data = await drive.put(name, {
      path: 'test/files/logo.svg',
    });

    expect(data).to.equal(name);
  });

  ['put-data', 'put-data/a', 'put-data/child/a'].forEach((name) => {
    it(`put data put("${name}")`, async () => {
      const data = await drive.put(name, {
        data: 'Hello world',
      });

      expect(data).to.equal(name);
    });
  });

  it('put data with contentType', async () => {
    const name = 'put-data-1';
    const data = await drive.put(name, {
      data: 'Hello world',
      contentType: 'text/plain',
    });

    expect(data).to.equal(name);
  });

  it('put data as Buffer', async function(this: Mocha.Context) {
    // if running in a browser, skip this test
    if (typeof window !== 'undefined') {
      this.skip();
      return Promise.resolve();
    }

    const name = 'put-data-2';
    const data = await drive.put(name, {
      data: Buffer.from('Hello world, Hello'),
    });

    expect(data).to.equal(name);
  });

  const putTests = [
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
        null,
        {
          data: 'Hello world',
          contentType: 'text/plain',
        },
        new Error('Name is empty'),
      ],
      [
        undefined,
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
  ];

  putTests.forEach(([name, body, expectedError]) => {
    it(`put file by using invalid name or body put("${name}", ${JSON.stringify(body)})`, async () => {
      try {
        const data = await drive.put(name as string, body as PutOptions);
        expect(data).to.not.be.null;
      } catch (err) {
        expect(err).to.deep.equal(expectedError);
      }
    });
  });
});
