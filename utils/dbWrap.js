/**
 * Wraps a level db instance to provide custom behaviour
 * It automatically parses and stringifies content
 * `NOTE` values on the db of this app will be either objects or arrays
 *
 * It adds two custom methods for merging arrays and objects
 *
 * @param {Object} db level db instance
 */
function wrapDb(db) {
  function parse(val) {
    return val ? JSON.parse(val) : val;
  }

  function correctKey(key) {
    if (!key) throw Error("key is not defined");
    return key.toLowerCase();
  }

  /**
   * Returns value at key parsed
   * @param {String} key
   */
  function get(key) {
    key = correctKey(key);
    return db
      .get(key)
      .then(parse)
      .catch(err => {
        if (err.message.includes("Key not found")) return null;
        else throw err;
      });
  }

  /**
   * Set value at key after stringifying
   * @param {String} key
   * @param {*} data
   */
  function set(key, data) {
    key = correctKey(key);
    return db.put(key, JSON.stringify(data));
  }

  /**
   * Assumes value at key is an array and pushes the new value into it
   * data can be an array of elements or a single element
   * @param {String} key
   * @param {Array} data
   */
  async function push(key, data) {
    key = correctKey(key);
    const prevData = (await get(key)) || [];
    // Ensure data types
    if (!Array.isArray(prevData))
      throw Error(
        `prevData must be an array to do db.push: ${JSON.stringify(prevData)}`
      );
    if (!Array.isArray(data))
      throw Error(
        `data must be an array to do db.push: ${JSON.stringify(data)}`
      );
    return await set(key, [...prevData, ...data]);
  }

  async function merge(key, data) {
    key = correctKey(key);
    const prevData = (await get(key)) || {};
    // Ensure data types
    if (typeof prevData !== "object" || Array.isArray(prevData))
      throw Error(
        `prevData must be an object to do db.merge: ${JSON.stringify(prevData)}`
      );
    if (typeof data !== "object" || Array.isArray(data))
      throw Error(
        `data must be an object to do db.merge: ${JSON.stringify(data)}`
      );
    return await set(key, { ...prevData, ...data });
  }

  return {
    get,
    set,
    push,
    merge
  };
}

module.exports = wrapDb;
