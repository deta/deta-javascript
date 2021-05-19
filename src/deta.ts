import BaseClass from './base';
import DriveClass from './drive';

export default class Deta {
  private projectKey: string;

  /**
   * Deta constructor
   *
   * @param {string} projectKey
   */
  constructor(projectKey: string) {
    this.projectKey = projectKey;
  }

  /**
   * Base returns instance of Base class
   *
   * @param {string} baseName
   * @returns {BaseClass}
   */
  public Base(baseName: string): BaseClass {
    const name = baseName.trim();
    if (!name) {
      throw new Error('Base name is not defined');
    }
    return new BaseClass(this.projectKey, name);
  }

  /**
   * Drive returns instance of Drive class
   *
   * @param {string} driveName
   * @returns {DriveClass}
   */
  public Drive(driveName: string): DriveClass {
    const name = driveName.trim();
    if (!name) {
      throw new Error('Drive name is not defined');
    }
    return new DriveClass(this.projectKey, name);
  }
}
