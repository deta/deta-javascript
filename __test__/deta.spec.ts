import { Deta, Base, Drive } from '../src/index';

describe('Deta', () => {
  it.each([
    ['   ', new Error('Project key is not defined')],
    ['', new Error('Project key is not defined')],
  ])('invalid project key `Deta("%s")`', (name, expected) => {
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
  ])('invalid base name `Base("%s")`', (name, expected) => {
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
  ])('invalid drive name `Drive("%s")`', (name, expected) => {
    try {
      const drive = Deta('test').Drive(name);
      expect(drive).not.toBeNull();
    } catch (err) {
      expect(err).toEqual(expected);
    }
  });
});

describe('Base', () => {
  it.each([
    ['   ', new Error('Base name is not defined')],
    ['', new Error('Base name is not defined')],
  ])('invalid base name `Base("%s")`', (name, expected) => {
    try {
      process.env.DETA_PROJECT_KEY = 'test';
      const base = Base(name);
      expect(base).not.toBeNull();
    } catch (err) {
      expect(err).toEqual(expected);
    }
  });

  it('Project key is not defined in current environment', () => {
    try {
      const base = Base('deta-base');
      expect(base).not.toBeNull();
    } catch (err) {
      expect(err).toEqual(new Error('Project key is not defined'));
    }
  });
});

describe('Drive', () => {
  it.each([
    ['   ', new Error('Drive name is not defined')],
    ['', new Error('Drive name is not defined')],
  ])('invalid drive name `Drive("%s")`', (name, expected) => {
    try {
      process.env.DETA_PROJECT_KEY = 'test';
      const drive = Drive(name);
      expect(drive).not.toBeNull();
    } catch (err) {
      expect(err).toEqual(expected);
    }
  });

  it('Project key is not defined in current environment', () => {
    try {
      const drive = Drive('deta-drive');
      expect(drive).not.toBeNull();
    } catch (err) {
      expect(err).toEqual(new Error('Project key is not defined'));
    }
  });
});
