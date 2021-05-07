/**
 * isObject returns if the provided value is an instance of object
 *
 * @param {any} value
 * @returns {boolean}
 */
export function isObject(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Object]';
}
