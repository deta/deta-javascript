/**
 * stringToUint8Array converts string to Uint8Array
 *
 * @param {string} str
 * @returns {Uint8Array}
 */
export function stringToUint8Array(str: string): Uint8Array {
  const array = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i += 1) {
    array[i] = str.charCodeAt(i);
  }
  return array;
}

/**
 * bufferToUint8Array converts Buffer to Uint8Array
 *
 * @param {Buffer} buffer
 * @returns {Uint8Array}
 */
export function bufferToUint8Array(buffer: Buffer): Uint8Array {
  const array = new Uint8Array(buffer.length);
  for (let i = 0; i < buffer.length; i += 1) {
    array[i] = buffer[i];
  }
  return array;
}
