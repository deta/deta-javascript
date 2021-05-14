const base = process.env.DETA_BASE_HOST?.trim() || 'database.deta.sh/v1';
const drive = process.env.DETA_DRIVE_HOST?.trim() || 'drive-staging.deta.sh/v1';

export default {
  BASE_HOST_URL: `https://${base}/:project_id/:base_name`,
  DRIVE_HOST_URL: `https://${drive}/:project_id/:drive_name`,
};
