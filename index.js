'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

module.exports = class BitcoinRate {
  constructor() {
    this.rate; // Exchange rate of 1 BTC in UAH
  }

  async parse() {
    try {
      const data = await axios
        .get('https://uabanks.com.ua/kurs/btc/')
        .then((html) => {
          const $ = cheerio.load(html.data);
          const text = $(
            'body > div.container > div.page-kurs-header > div > div > center:nth-child(3) > b'
          ).text();
          return text;
        });
      const exchangeRate = data.slice(0, data.indexOf('.')).replace(' ', '');
      this.rate = Number(exchangeRate);
    } catch (error) {
      const red = '\x1b[31m';
      console.log(red, error.message, '\x1b[0m');
    }
    return this.rate;
  }
};
