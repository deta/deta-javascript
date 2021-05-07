import BaseClass from './base';

export default class Deta {
  private projectKey: string;

  constructor(projectKey: string) {
    this.projectKey = projectKey;
  }

  public Base(baseName: string): BaseClass {
    const name = baseName.trim();
    if (!name) {
      throw Error('Base name is not defined');
    }
    return new BaseClass(this.projectKey, name);
  }
}
