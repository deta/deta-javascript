import DetaClass from './deta';
import BaseClass from './base';
import DriveClass from './drive';

/**
 * Deta returns instance of Deta class
 *
 * @param {string} [projectKey]
 * @returns {DetaClass}
 */
export function Deta(projectKey?: string): DetaClass {
  const key = projectKey?.trim() || process.env.DETA_PROJECT_KEY?.trim();
  if (!key) {
    throw new Error('Project key is not defined');
  }
  return new DetaClass(key);
}

/**
 * Base returns instance of Base class
 *
 * @param {string} baseName
 * @param {string} [host]
 * @returns {BaseClass}
 */
export function Base(baseName: string, host?: string): BaseClass {
  return Deta().Base(baseName, host);
}

/**
 * Drive returns instance of Drive class
 *
 * @param {string} driveName
 * @param {string} [host]
 * @returns {DriveClass}
 */
export function Drive(driveName: string, host?: string): DriveClass {
  return Deta().Drive(driveName, host);
}
