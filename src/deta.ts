import BaseClass from './base';

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
      throw Error('Base name is not defined');
    }
    return new BaseClass(this.projectKey, name);
  }
}
