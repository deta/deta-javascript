import { KeyType } from '../types/key';

const url = {
  BASE: `:protocol://:host/v1/:project_id/:base_name`,
  DRIVE: `:protocol://:host/v1/:project_id/:drive_name`,
};

/**
 * base function returns API URL for base
 *
 * @param {string} [host]
 * @param {KeyType} keyType
 * @returns {string}
 */
function base(keyType: KeyType, host?: string): string {
  const browserAppTokenHost = typeof window !== 'undefined' && keyType === KeyType.DummyKey
    ? `${window.location.host}/__space/v0/base`
    : undefined;

  const nodeHost = typeof process !== 'undefined'
    ? process.env.DETA_BASE_HOST?.trim()
    : undefined;

  host = host?.trim() ? host : undefined;
  const hostPath = host?.trim() ?? browserAppTokenHost ?? nodeHost ?? 'database.deta.sh';
  const protocol = browserAppTokenHost?.startsWith('localhost') ? 'http' : 'https';

  return url.BASE.replace(':protocol', protocol).replace(':host', hostPath);
}

/**
 * drive function returns API URL for drive
 *
 * @param {string} [host]
 * @param {KeyType} keyType
 * @returns {string}
 */
function drive(keyType: KeyType, host?: string): string {
  const browserAppTokenHost = typeof window !== 'undefined' && keyType === KeyType.DummyKey
    ? `${window.location.host}/__space/v0/drive`
    : undefined;

  const nodeHost = typeof process !== 'undefined'
    ? process.env.DETA_DRIVE_HOST?.trim()
    : undefined;

  host = host?.trim() ? host : undefined;
  const hostPath = host?.trim() ?? browserAppTokenHost ?? nodeHost ?? 'drive.deta.sh';
  const protocol = browserAppTokenHost?.startsWith('localhost') ? 'http' : 'https';

  return url.DRIVE.replace(':protocol', protocol).replace(':host', hostPath);
}

export default {
  base,
  drive,
};
