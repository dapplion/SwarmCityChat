const crypto = require("crypto");

/**
 * Utility to generate fake addresses and item hashes
 * @param {Integer} bytes
 * @returns {String} "0x1234acbd1234acbd1234acbd1234acbd"
 */
function randomHexString(bytes) {
  return "0x" + crypto.randomBytes(bytes).toString("hex");
}

module.exports = randomHexString;
