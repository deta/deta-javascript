import { Base } from '../utils/deta';

const db = Base();

describe('Base#delete', () => {
  beforeAll(async () => {
    const inputs = [
      [
        { name: 'alex', age: 77 },
        'delete_two',
        { name: 'alex', age: 77, key: 'delete_two' },
      ],
      [
        'hello, worlds',
        'delete_three',
        { value: 'hello, worlds', key: 'delete_three' },
      ],
      [7, 'delete_four', { value: 7, key: 'delete_four' }],
      [
        ['a', 'b', 'c'],
        'delete_my_abc',
        { value: ['a', 'b', 'c'], key: 'delete_my_abc' },
      ],
    ];

    const promises = inputs.map(async (input) => {
      const [value, key, expected] = input;
      const data = await db.put(value, key as string);
      expect(data).toEqual(expected);
    });

    await Promise.all(promises);
  });

  it.each([
    ['delete_two'],
    ['delete_three'],
    ['delete_four'],
    ['delete_my_abc'],
    ['this is some random key'],
  ])('delete data by using key `delete("%s")`', async (key) => {
    const data = await db.delete(key);
    expect(data).toBeNull();
  });

  it.each([
    ['   ', new Error('Key is empty')],
    ['', new Error('Key is empty')],
    [null, new Error('Key is empty')],
    [undefined, new Error('Key is empty')],
  ])(
    'delete data by using invalid key `delete("%s")`',
    async (key, expected) => {
      try {
        const data = await db.delete(key as string);
        expect(data).toBeNull();
      } catch (err) {
        expect(err).toEqual(expected);
      }
    }
  );
});
