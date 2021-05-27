import url from '../../src/constants/url';

describe('base url', () => {
  it.each([
    [
      'database.deta.sh/v1',
      'https://database.deta.sh/v1/:project_id/:base_name',
    ],
    ['   ', 'https://database.deta.sh/v1/:project_id/:base_name'],
    ['', 'https://database.deta.sh/v1/:project_id/:base_name'],
  ])('passed host path `url.base("%s")`', (host, expected) => {
    const path = url.base(host);
    expect(path).toEqual(expected);
  });

  it('host path set in environment variable', () => {
    process.env.DETA_BASE_HOST = 'database.deta.sh/v1';
    const path = url.base();
    expect(path).toEqual('https://database.deta.sh/v1/:project_id/:base_name');
  });

  it('host is not passed', () => {
    const path = url.base();
    expect(path).toEqual('https://database.deta.sh/v1/:project_id/:base_name');
  });
});

describe('drive url', () => {
  it.each([
    ['drive.deta.sh/v1', 'https://drive.deta.sh/v1/:project_id/:drive_name'],
    ['   ', 'https://drive.deta.sh/v1/:project_id/:drive_name'],
    ['', 'https://drive.deta.sh/v1/:project_id/:drive_name'],
  ])('passed host path `url.drive("%s")`', (host, expected) => {
    const path = url.drive(host);
    expect(path).toEqual(expected);
  });

  it('host path set in environment variable', () => {
    process.env.DETA_DRIVE_HOST = 'drive.deta.sh/v1';
    const path = url.drive();
    expect(path).toEqual('https://drive.deta.sh/v1/:project_id/:drive_name');
  });

  it('host is not passed', () => {
    const path = url.drive();
    expect(path).toEqual('https://drive.deta.sh/v1/:project_id/:drive_name');
  });
});
