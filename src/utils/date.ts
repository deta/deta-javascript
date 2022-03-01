export class Day {
  private date: Date;

  /**
   * Day constructor
   *
   * @param {Date} [date]
   */
  constructor(date?: Date) {
    this.date = date || new Date();
  }

  /**
   * addSeconds returns new Day object
   * by adding provided number of seconds.
   *
   * @param {number} seconds
   * @returns {Day}
   */
  public addSeconds(seconds: number): Day {
    this.date = new Date(this.date.getTime() + 1000 * seconds);
    return this;
  }

  /**
   * getEpochSeconds returns number of seconds after epoch.
   *
   * @returns {number}
   */
  public getEpochSeconds(): number {
    return Math.floor(this.date.getTime() / 1000.0);
  }
}
