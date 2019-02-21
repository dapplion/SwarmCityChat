/**
 * Wrap socket.io methods to provide a standard response and safeguard against errors
 * @param {Function} handler
 */
const wrapErrors = handler => async (data, callback) => {
  if (!callback || typeof callback !== "function") {
    console.log("WARNING: Socket did not emitted a function to acknowledge");
    callback = () => {};
  }
  try {
    const res = await handler(data);
    callback({
      error: null,
      data: res || {}
    });
  } catch (e) {
    callback({
      error: e.stack
    });
  }
};

module.exports = wrapErrors;
