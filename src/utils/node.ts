/**
 * isNode returns true if the runtime environment is node
 *
 * @returns {boolean}
 */
export function isNode(): boolean {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null
  );
}
