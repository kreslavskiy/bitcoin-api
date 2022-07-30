# Bitcoin API

This API is created to get current BTC to UAH rate and inform subscribers about rate changes.
Dependencies: nodemailer, cheerio, axios.

## Usage

To use API clone the repository to your local machine and run ```npm install```. Then import [btc-api.js](https://github.com/kreslavskiy/bitcoin-api/blob/master/btc-api.js) file to file you want to use API in.

API usage is demonstrated in [example.js](https://github.com/kreslavskiy/bitcoin-api/blob/master/example.js) file.

```js
'use strict';

const btc = require('./btc-api');

const test = async () => {
  const curr = await btc.currentRate(); 
  console.log(curr);
  await btc.subscribe('Misha', 'mishak1000236@gmail.com');
  await btc.informAboutRate('my app'); 
};

test();
```

We can see, that ```btc.currentRate()``` method get currebt rate of BTC in UAH. It also puts this data to local JSON database. ```btc.subscribe('Misha', 'mishak1000236@gmail.com')``` adds to local file database record about user 'Misha' with email mishak1000236@gmail.com. You can subscribe only 1 user at once. ```btc.informAboutRate('my app')``` method gets all subscribers data and informs them about current BTC rate, as a parameter it requires sender name, it can be any String.

## Testing

You can test API by running [example.js](https://github.com/kreslavskiy/bitcoin-api/blob/master/example.js) file or by using [Dockerfile](https://github.com/kreslavskiy/bitcoin-api/blob/master/Dockerfile).
