const fs = require("fs");
const path = require("path");

/**
 * Test utility to clean a folder's content syncronously with fs
 * @param {String} directory
 */

function removeDirContents(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    fs.unlinkSync(path.join(directory, file));
  }
}

module.exports = removeDirContents;
