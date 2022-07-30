'use strict';

const btc = require('./btc-api');

const test = async () => {
  const curr = await btc.currentRate(); 
  console.log(curr);
  await btc.subscribe('Misha', 'mishak1000236@gmail.com');
  await btc.informAboutRate('my app'); 
};

test();
