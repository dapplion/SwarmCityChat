// Init server
// For this configuration, the socket.io client must connect to "http://yourdomain.io" without location
// Since there is not going to be any other WS client in the same server, it's ok
const port = process.env.PORT || 3000;
const io = require("socket.io")(port);
console.log(`App listening at port ${port}`);
// Utils
const wrapErrors = require("./utils/wrapErrors");
const updateChat = require("./utils/updateChat");
const getId = require("./utils/getId");

io.on("connection", socket => {
  console.log(`Socket id ${socket.id} connected`);
  socket.on(
    "subscribe",
    wrapErrors(async data => {
      /**
       * data = {
       *   hashtagAddress: 0x1234abcd...,
       * 	 itemHash: 0x9876fedc...,
       * 	 accessKeys: [ "encrypted_key" ],
       *   metadata: { key: "value" }
       * }
       */

      // 1. Update accessKeys and metadata + get updated chat object
      const id = getId(data.hashtagAddress, data.itemHash);
      const chatObject = await updateChat(id, data);
      // 2. Should subscribe the emitter to the chat room
      socket.join(`chat-${id}`);
      // 3. Emit the full chat to the just joinned socket
      socket.emit("chatChanged", chatObject);
      console.log(`Socket id ${socket.id} subscribed to ${id}`);
    })
  );

  socket.on(
    "message",
    wrapErrors(async data => {
      /**
       * data = {
       *   hashtagAddress: 0x1234abcd...,
       *   itemHash: 0x9876fedc...,
       * 	 message: [ "encrypted_message" ],
       * }
       */

      // 1. Update messages + get updated chat object
      const id = getId(data.hashtagAddress, data.itemHash);
      const chatObject = await updateChat(id, data);
      // 2. Should broadcast to everyone in the room, including the sender
      io.in(`chat-${id}`).emit("chatChanged", chatObject);
      console.log(`Socket id ${socket.id} send a new message to ${id}`);
    })
  );
});
