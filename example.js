'use strict';

const BitcoinRate = require('./index.js');

const test = async () => {
  const api = new BitcoinRate();
  await api.subscribe('Misha', 'mishak1000236@gmail.com');
  await api.informAboutRate('My BTC app');
};

test();
