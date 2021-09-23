import { Drive } from '../utils/deta';

const drive = Drive();

describe('Drive#list', () => {
  beforeAll(async () => {
    const inputs = [
      'list-a',
      'list-b',
      'list-c',
      'list/a',
      'list/b',
      'list/child/a',
      'list/child/b',
    ];

    const promises = inputs.map(async (input) => {
      const data = await drive.put(input, { data: 'hello' });
      expect(data).toEqual(input);
    });

    await Promise.all(promises);
  });

  afterAll(async () => {
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
    expect(data).toEqual(expected);
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
      names: ['list/child/b'],
    };
    const data = await drive.list({
      limit: 2,
      prefix: 'list',
      last: 'list/child/a',
    });
    expect(data).toEqual(expected);
  });
});
