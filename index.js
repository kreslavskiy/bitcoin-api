'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const nodemailer = require('nodemailer');

module.exports = class BitcoinRate {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'btcapigenesis@gmail.com',
        pass: 'tggochwudsnvlgvy',
      },
    });
  }

  async #createDatabase() {
    const db = {
      rate: 0,
      people: [],
    };
    const content = JSON.stringify(db);
    await fs.promises.appendFile(`${process.cwd()}/database.json`, content);
  }

  async #getDatabase() {
    if (!fs.existsSync('database.json')) await this.#createDatabase();
    const content = fs.readFileSync('database.json', 'utf-8');
    const db = JSON.parse(content);
    return db;
  }

  async #getAllEmails() {
    const emails = new Array();
    const db = await this.#getDatabase();
    for (const subscriber of db.people) {
      if (!emails.includes(subscriber.email)) emails.push(subscriber.email);
    }
    return emails;
  }

  #validateEmail(email) {
    const regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
    if (!regex.test(email)) throw new Error('Bad email');
  }

  async subscribe(name, email) {
    this.#validateEmail(email);
    const db = await this.#getDatabase();
    const allMails = await this.#getAllEmails();
    if (!allMails.includes(email)) {
      db.people.push({ name, email });
      await fs.promises.writeFile('database.json', JSON.stringify(db));
    }
  }

  async currentRate() {
    const db = await this.#getDatabase();
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
  }

  async checkRateChanges() {
    const db = await this.#getDatabase();
    const previosRate = db.rate;
    const currentRate = await this.currentRate();
    return previosRate === currentRate;
  }

  async #sendEmail (from, message, address) {
    const allMails = (await this.#getAllEmails()).join(',');
    await this.transporter.sendMail({
      from: `"${from}" <btcapigenesis@gmail.com>`,
      to: address,
      subject: 'Current BTC rate',
      text: message,
    });
  }

  async informAboutRate(senderName) {
    const db = (await this.#getDatabase());
    const isChanged = await this.checkRateChanges();
    let message = '';
    if (isChanged) message = `BTC rate has changed, now it is ${await this.currentRate()} UAH!`;
    else message = `current BTC rate is ${db.rate} UAH`;
    for (const subscriber of db.people) {
      await this.#sendEmail(senderName, `Hi, ${subscriber.name}, ` + message, subscriber.email);
    }
  }
};
