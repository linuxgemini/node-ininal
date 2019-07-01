# node-ininal

API wrapper for the Turkish Fintech company "ininal".

Get your keys from [here](https://developer.ininal.com/).

Docs are available [here](https://linuxgemini.github.io/node-ininal/classes/ininal.html#constructor).

```js
const sandbox = true;

const Ininal = require("ininal");

// https://linuxgemini.github.io/node-ininal/classes/ininal.html#constructor
const ininal = new Ininal.Client("api_key-from_ininal", "secret_key-from_ininal", sandbox);

// you are ready!
```
