const wrapDb = require("./dbWrap");
const db = wrapDb(require("level")(process.env.DB_PATH || "./db"));

/**
 * Utility to update and construct a chat object.
 * It is abstracted to ease testing and simplify the main server.js file
 *
 * @param {String} id
 * @param {Object} data
 * @return {Object}
 */
async function updateChat(
  id,
  { metadata, accessKey, accessKeys, message, messages }
) {
  // Append accessKey(s)
  if (accessKey) await db.push(`${id}/accessKeys`, [accessKey]);
  else if (accessKeys) await db.push(`${id}/accessKeys`, accessKeys);
  // Append message(s)
  if (message) await db.push(`${id}/messages`, [message]);
  else if (messages) await db.push(`${id}/messages`, messages);
  // Apend metadata
  if (metadata) await db.merge(`${id}/metadata`, metadata);

  return {
    accessKeys: (await db.get(`${id}/accessKeys`)) || [],
    messages: (await db.get(`${id}/messages`)) || [],
    metadata: (await db.get(`${id}/metadata`)) || {}
  };
}

module.exports = updateChat;
