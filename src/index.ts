import DetaClass from './deta';
import BaseClass from './base';
import DriveClass from './drive';
import { KeyType } from './types/key';

/**
 * Deta returns instance of Deta class
 *
 * @param {string} [projectKey]
 * @param {string} [authToken]
 * @returns {DetaClass}
 */
export function Deta(projectKey?: string, authToken?: string): DetaClass {
  const token = authToken?.trim();
  const key = projectKey?.trim();
  if (token && key) {
    return new DetaClass(token, KeyType.AuthToken, key);
  }

  const apiKey = key || (typeof process !== 'undefined' ? process.env.DETA_PROJECT_KEY?.trim() : undefined);
  if (apiKey) {
    return new DetaClass(apiKey, KeyType.ProjectKey, apiKey.split('_')[0]);
  }

  if (typeof window !== 'undefined') {
    return new DetaClass('dummy', KeyType.DummyKey, 'dummy');
  }

  throw new Error('Project key is not defined');
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
