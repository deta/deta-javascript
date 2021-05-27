import { Deta, Base, Drive } from '../src/index';

const projectKey = process.env.PROJECT_KEY || '';
const dbName = process.env.DB_NAME || '';
const driveName = process.env.DRIVE_NAME || '';

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

  it('passing host name', async () => {
    const base = Deta(projectKey).Base(dbName, 'database.deta.sh');
    expect(base).not.toBeNull();
    const data = await base.put({ key: 'deta-base-test' });
    expect(data).toEqual({ key: 'deta-base-test' });
  });

  it('passing host name using environment variable', async () => {
    process.env.DETA_BASE_HOST = 'database.deta.sh';
    const base = Deta(projectKey).Base(dbName);
    expect(base).not.toBeNull();
    const data = await base.put({ key: 'deta-base-test1' });
    expect(data).toEqual({ key: 'deta-base-test1' });
  });

  afterAll(async () => {
    const base = Deta(projectKey).Base(dbName, 'database.deta.sh');

    const inputs = [['deta-base-test'], ['deta-base-test1']];

    const promises = inputs.map(async (input) => {
      const [key] = input;
      const data = await base.delete(key);
      expect(data).toBeNull();
    });

    await Promise.all(promises);
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

  it('passing host name', async () => {
    const drive = Deta(projectKey).Drive(driveName, 'drive.deta.sh');
    expect(drive).not.toBeNull();
    const data = await drive.put('deta-drive-test', { data: 'Hello World' });
    expect(data).toEqual('deta-drive-test');
  });

  it('passing host name using environment variable', async () => {
    process.env.DETA_DRIVE_HOST = 'drive.deta.sh';
    const drive = Deta(projectKey).Drive(driveName);
    expect(drive).not.toBeNull();
    const data = await drive.put('deta-drive-test1', { data: 'Hello World' });
    expect(data).toEqual('deta-drive-test1');
  });

  afterAll(async () => {
    const drive = Deta(projectKey).Drive(driveName, 'drive.deta.sh');
    const names = ['deta-drive-test', 'deta-drive-test1'];
    const expected = {
      deleted: ['deta-drive-test', 'deta-drive-test1'],
    };
    const data = await drive.deleteMany(names);
    expect(data).toEqual(expected);
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

  it('passing host name', async () => {
    process.env.DETA_PROJECT_KEY = projectKey;
    const base = Base(dbName, 'database.deta.sh');
    expect(base).not.toBeNull();
    const data = await base.put({ key: 'base-test' });
    expect(data).toEqual({ key: 'base-test' });
  });

  it('passing host name using environment variable', async () => {
    process.env.DETA_PROJECT_KEY = projectKey;
    process.env.DETA_BASE_HOST = 'database.deta.sh';
    const base = Base(dbName);
    expect(base).not.toBeNull();
    const data = await base.put({ key: 'base-test1' });
    expect(data).toEqual({ key: 'base-test1' });
  });

  afterAll(async () => {
    const base = Deta(projectKey).Base(dbName, 'database.deta.sh');

    const inputs = [['base-test'], ['base-test1']];

    const promises = inputs.map(async (input) => {
      const [key] = input;
      const data = await base.delete(key);
      expect(data).toBeNull();
    });

    await Promise.all(promises);
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

  it('passing host name', async () => {
    process.env.DETA_PROJECT_KEY = projectKey;
    const drive = Drive(driveName, 'drive.deta.sh');
    expect(drive).not.toBeNull();
    const data = await drive.put('drive-test', { data: 'Hello World' });
    expect(data).toEqual('drive-test');
  });

  it('passing host name using environment variable', async () => {
    process.env.DETA_PROJECT_KEY = projectKey;
    process.env.DETA_DRIVE_HOST = 'drive.deta.sh';
    const drive = Drive(driveName);
    expect(drive).not.toBeNull();
    const data = await drive.put('drive-test1', { data: 'Hello World' });
    expect(data).toEqual('drive-test1');
  });

  afterAll(async () => {
    const drive = Deta(projectKey).Drive(driveName, 'drive.deta.sh');
    const names = ['drive-test', 'drive-test1'];
    const expected = {
      deleted: ['drive-test', 'drive-test1'],
    };
    const data = await drive.deleteMany(names);
    expect(data).toEqual(expected);
  });
});
