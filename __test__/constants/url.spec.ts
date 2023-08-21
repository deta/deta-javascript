import url from '../../src/constants/url';
import { KeyType } from '../../src/types/key';

describe('base url', () => {
  it.each([
    ['database.deta.sh', 'https://database.deta.sh/v1/:project_id/:base_name'],
    ['   ', 'https://database.deta.sh/v1/:project_id/:base_name'],
    ['', 'https://database.deta.sh/v1/:project_id/:base_name'],
  ])('passed host path `url.base("%s")`', (host, expected) => {
    const path = url.base(KeyType.ProjectKey, host);
    expect(path).toEqual(expected);
  });

  it('host path set in environment variable', () => {
    process.env.DETA_BASE_HOST = 'database.deta.sh';
    const path = url.base(KeyType.ProjectKey);
    expect(path).toEqual('https://database.deta.sh/v1/:project_id/:base_name');
  });

  it('host is not passed', () => {
    const path = url.base(KeyType.ProjectKey);
    expect(path).toEqual('https://database.deta.sh/v1/:project_id/:base_name');
  });
});

describe('drive url', () => {
  it.each([
    ['drive.deta.sh', 'https://drive.deta.sh/v1/:project_id/:drive_name'],
    ['   ', 'https://drive.deta.sh/v1/:project_id/:drive_name'],
    ['', 'https://drive.deta.sh/v1/:project_id/:drive_name'],
  ])('passed host path `url.drive("%s")`', (host, expected) => {
    const path = url.drive(KeyType.ProjectKey, host);
    expect(path).toEqual(expected);
  });

  it('host path set in environment variable', () => {
    process.env.DETA_DRIVE_HOST = 'drive.deta.sh';
    const path = url.drive(KeyType.ProjectKey);
    expect(path).toEqual('https://drive.deta.sh/v1/:project_id/:drive_name');
  });

  it('host is not passed', () => {
    const path = url.drive(KeyType.ProjectKey);
    expect(path).toEqual('https://drive.deta.sh/v1/:project_id/:drive_name');
  });
});
