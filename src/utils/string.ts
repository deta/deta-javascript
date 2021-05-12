/**
 * isString returns if the provided value is an instance of string
 *
 * @param {any} value
 * @returns {boolean}
 */
export function isString(value: any): boolean {
  return typeof value === 'string' || value instanceof String;
}
