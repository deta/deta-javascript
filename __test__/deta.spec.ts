import { Deta } from '../src/index';

describe('Deta', () => {
  it.each([
    ['   ', new Error('Project key is not defined')],
    ['', new Error('Project key is not defined')],
  ])('invalid project key `Deta("%s")`', async (name, expected) => {
    try {
      const deta = Deta(name);
      expect(deta).not.toBeNull();
    } catch (err) {
      expect(err).toEqual(expected);
    }
  });
});

describe('Deta#Base', () => {
  it.each([
    ['   ', new Error('Base name is not defined')],
    ['', new Error('Base name is not defined')],
  ])('invalid base name `Base("%s")`', async (name, expected) => {
    try {
      const base = Deta('test').Base(name);
      expect(base).not.toBeNull();
    } catch (err) {
      expect(err).toEqual(expected);
    }
  });
});

describe('Deta#Drive', () => {
  it.each([
    ['   ', new Error('Drive name is not defined')],
    ['', new Error('Drive name is not defined')],
  ])('invalid drive name `Drive("%s")`', async (name, expected) => {
    try {
      const drive = Deta('test').Drive(name);
      expect(drive).not.toBeNull();
    } catch (err) {
      expect(err).toEqual(expected);
    }
  });
});
