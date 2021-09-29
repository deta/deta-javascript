import { Deta } from '../../src/index.node';

export function Drive() {
  const projectKey = process.env.PROJECT_KEY || '';
  const driveName = process.env.DRIVE_NAME || '';

  if (process.env.USE_AUTH_TOKEN === 'true') {
    const token = process.env.AUTH_TOKEN || '';
    return Deta(projectKey.split('_')[0], token).Drive(driveName);
  }

  return Deta(projectKey).Drive(driveName);
}

export function Base() {
  const projectKey = process.env.PROJECT_KEY || '';
  const dbName = process.env.DB_NAME || '';

  if (process.env.USE_AUTH_TOKEN === 'true') {
    const token = process.env.AUTH_TOKEN || '';
    return Deta(projectKey.split('_')[0], token).Base(dbName);
  }

  return Deta(projectKey).Base(dbName);
}
