'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const database = require('./database');

const currentRate = async () => {
  const db = await database.getDatabase();
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
    db.rate = Number(exchangeRate);
    await fs.promises.writeFile('database.json', JSON.stringify(db));
    return db.rate;
  } catch (error) {
    const red = '\x1b[31m';
    console.log(red, error.message, '\x1b[0m');
  }
};

const checkRateChanges = async () => {
  const db = await database.getDatabase();
  const prevRate = db.rate;
  const curRate = await currentRate();
  return prevRate !== curRate;
};

module.exports = { currentRate, checkRateChanges };
