# SwarmCityChat

Temporal chat solution while a p2p / decentralized solution is being developed

## Usage

Connect using the socket.io client to the root domain without any location, with the following options

```js
const url "http(s)://yourdomain.io"
const options = {
  transports: ["websocket"],
};
const socket = require("socket.io-client")(url, options);
```

### Methods

- subscribe:

```js
const data = { hashtagAddress, itemHash, accessKeys, metadata };
sender.emit("subscribe", data, acknowledgement);
```

- message:

```js
const data = { hashtagAddress, itemHash, message };
sender.emit("message", data, acknowledgement);
```

- chatChanged:

```js
sender.on("chatChanged", chatObject => {
  // display chat metadata
  // Loop accessKeys and find yours
  // decrypt messages with our accessKey
});
```

```js
chatObject = {
  accessKeys: ["secret-access-key-1", "secret-access-key-2"],
  messages: ["secret-message-1", "secret-message-2"],
  metadata: { description: "item-1" }
};
```

### Acknowledgement

Callback to know if the action triggered by the emit was successful

```js
function acknowledgement(res) {
  if (res.error) {
    // display error
  } else {
    // do something with res.data if necessary
  }
}
```

- on success:

```js
const res = {
  error: null,
  data: res || {}
};
```

- on error:

```js
const res = {
  error: e.stack
};
```
