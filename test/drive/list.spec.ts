import { expect } from 'chai';
import { Drive } from '../../src/index.node';
import { DRIVE_NAME } from '../utils/constants';

const drive = Drive(DRIVE_NAME);

describe('Drive#list', () => {
  before(async () => {
    const inputs = [
      'list-a',
      'list-b',
      'list-c',
      'list/a',
      'list/b',
      'list/child/a',
      'list/child/b',
    ];

    for (const input of inputs) {
      const data = await drive.put(input, { data: 'hello' });
      expect(data).to.equal(input);
    }
  });

  after(async () => {
    const names = [
      'list-a',
      'list-b',
      'list-c',
      'list/a',
      'list/b',
      'list/child/a',
      'list/child/b',
    ];
    const expected = {
      deleted: [
        'list-a',
        'list-b',
        'list-c',
        'list/a',
        'list/b',
        'list/child/a',
        'list/child/b',
      ],
    };
    const data = await drive.deleteMany(names);
    expect(data.deleted).to.have.members(expected.deleted);
  });

  it('list files', async () => {
    const expected = {
      names: [
        'list-a',
        'list-b',
        'list-c',
        'list/a',
        'list/b',
        'list/child/a',
        'list/child/b',
      ],
    };
    const data = await drive.list();
    expect(data).to.deep.equal(expected);
  });

  const listFilesTests = [
      [
        { limit: 1 },
        {
          paging: {
            size: 1,
            last: 'list-a',
          },
          names: ['list-a'],
        },
      ],
      [
        { limit: 2, prefix: 'list-' },
        {
          paging: {
            size: 2,
            last: 'list-b',
          },
          names: ['list-a', 'list-b'],
        },
      ],
      [
        {
          limit: 2,
          prefix: 'list',
          last: 'list/child/a',
        },
        {
          names: ['list/child/b'],
        },
      ],
      [
        {
          limit: 2,
          prefix: 'list',
          last: 'list/child/a',
          recursive: true,
        },
        {
          names: ['list/child/b'],
        },
      ],
      [
        {
          prefix: 'list/',
          recursive: false,
        },
        {
          names: ['list/a', 'list/b', 'list/child/'],
        },
      ],
      [
        {
          limit: 2,
          prefix: 'list/',
          recursive: false,
        },
        {
          paging: {
            size: 2,
            last: 'list/b',
          },
          names: ['list/a', 'list/b'],
        },
      ],
      [
        {
          limit: 1,
          last: 'list/a',
          prefix: 'list/',
          recursive: false,
        },
        {
          paging: {
            size: 1,
            last: 'list/b',
          },
          names: ['list/b'],
        },
      ],
      [
        {
          limit: 2,
          last: 'list/a',
          prefix: 'list/',
          recursive: false,
        },
        {
          names: ['list/b', 'list/child/'],
        },
      ],
      [
        {
          prefix: 'list',
          recursive: false,
        },
        {
          names: ['list-a', 'list-b', 'list-c', 'list/'],
        },
      ],
      [
        {
          prefix: '/list',
          recursive: false,
        },
        {
          names: [],
        },
      ],
  ];

  listFilesTests.forEach(([option, expected]) => {
    it(`list files with options ${JSON.stringify(option)}`, async () => {
      const data = await drive.list(option);
      expect(data).to.deep.equal(expected);
    });
  });
});
