/**
 * Utility to keep db ids consistent
 * @param {String} hashtagAddress
 * @param {String} itemHash
 * @returns {String}
 */
function getId(hashtagAddress, itemHash) {
  if (!hashtagAddress) throw Error("hashtagAddress must be defined");
  if (!itemHash) throw Error("itemHash must be defined");
  return `${hashtagAddress}/${itemHash}`;
}

module.exports = getId;
