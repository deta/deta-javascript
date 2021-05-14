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
 * @returns {BaseClass}
 */
export function Base(baseName: string): BaseClass {
  return Deta().Base(baseName);
}

/**
 * Drive returns instance of Drive class
 *
 * @param {string} driveName
 * @returns {DriveClass}
 */
export function Drive(driveName: string): DriveClass {
  return Deta().Drive(driveName);
}
