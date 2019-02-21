const expect = require("chai").expect;
const randomHexString = require("./randomHexString");
const removeDirContents = require("./removeDirContents");

/**
 * The purpose of this test is to make sure that the db utilities
 * and manipulations work fine.
 * - A typicall lifecycle of a chatObject will be simulated
 * - Create it from scratch
 * - Add metadata
 * - Add accessKey (one)
 * - Add accessKeys (multiple)
 * - Add message (one)
 * - Add messages (multiple)
 */

// Randomize to avoid data collisions with other tests.
// It's hard to clean the level db during a test
const hashtagAddress = randomHexString(20);
const itemHash = randomHexString(32);

const id = `${hashtagAddress}/${itemHash}`;
const metadata1 = { name: "oh my" };
const metadata2 = { desc: "good" };
const metadata = { ...metadata1, ...metadata2 };
const accessKey1 = "secret-access-key-1";
const accessKey2 = "secret-access-key-2";
const accessKey3 = "secret-access-key-3";
const accessKeys = [accessKey1, accessKey2, accessKey3];
const message1 = "secret-message-1";
const message2 = "secret-message-2";
const message3 = "secret-message-3";
const messages = [message1, message2, message3];

const updateChat = require("../utils/updateChat");

describe("UpdateChat util", () => {
  it("Should create new chat object", async () => {
    const chatObject = await updateChat(id, {});
    expect(chatObject).to.deep.equal({
      accessKeys: [],
      messages: [],
      metadata: {}
    });
  });

  it("Should append metadata", async () => {
    const chatObject = await updateChat(id, { metadata: metadata1 });
    expect(chatObject).to.deep.equal({
      accessKeys: [],
      messages: [],
      metadata: metadata1
    });
  });

  it("Should append a second metadata", async () => {
    const chatObject = await updateChat(id, { metadata: metadata2 });
    expect(chatObject).to.deep.equal({
      accessKeys: [],
      messages: [],
      metadata
    });
  });

  it("Should push an accessKey", async () => {
    const chatObject = await updateChat(id, { accessKey: accessKey1 });
    expect(chatObject).to.deep.equal({
      accessKeys: [accessKey1],
      messages: [],
      metadata
    });
  });

  it("Should push a second array of accessKeys", async () => {
    const chatObject = await updateChat(id, {
      accessKeys: [accessKey2, accessKey3]
    });
    expect(chatObject).to.deep.equal({
      accessKeys,
      messages: [],
      metadata
    });
  });

  it("Should push an message", async () => {
    const chatObject = await updateChat(id, { message: message1 });
    expect(chatObject).to.deep.equal({
      accessKeys,
      messages: [message1],
      metadata
    });
  });

  it("Should push a second array of messages", async () => {
    const chatObject = await updateChat(id, { messages: [message2, message3] });
    expect(chatObject).to.deep.equal({
      accessKeys,
      messages,
      metadata
    });
  });

  after(() => {
    removeDirContents("./db");
  });
});
