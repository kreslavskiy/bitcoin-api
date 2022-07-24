'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

const parse = async () => {
  const data = await axios.get('https://uabanks.com.ua/kurs/btc/')
    .then(html => {
        const $ = cheerio.load(html.data);
        const text = $('body > div.container > div.page-kurs-header > div > div > center:nth-child(3) > b').text();
        return text;
    });
  return Number(data.slice(0, data.indexOf('.')).replace(' ', ''));
};
