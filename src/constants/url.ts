const url = {
  BASE: `https://:host/:project_id/:base_name`,
  DRIVE: `https://:host/:project_id/:drive_name`,
};

/**
 * base function returns API URL for base
 *
 * @param {string} [host]
 * @returns {string}
 */
function base(host?: string): string {
  const hostPath =
    host?.trim() || process.env.DETA_BASE_HOST?.trim() || 'database.deta.sh/v1';
  return url.BASE.replace(':host', hostPath);
}

/**
 * drive function returns API URL for drive
 *
 * @param {string} [host]
 * @returns {string}
 */
function drive(host?: string): string {
  const hostPath =
    host?.trim() || process.env.DETA_DRIVE_HOST?.trim() || 'drive.deta.sh/v1';
  return url.DRIVE.replace(':host', hostPath);
}

export default {
  base,
  drive,
};
