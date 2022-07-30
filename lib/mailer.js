'use strict';

const nodemailer = require('nodemailer');
const database = require('./database');
const parser = require('./parser');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'btcapigenesis@gmail.com',
    pass: 'tggochwudsnvlgvy',
  },
});

const sendEmail = async (from, message, address) => {
  try {
    await transporter.sendMail({
      from: `"${from}" <btcapigenesis@gmail.com>`,
      to: address,
      subject: 'Current BTC rate',
      text: message,
    });
    return 200;
  } catch (error) {
    if (error) return 400;
  }
};

const informAboutRate = async (senderName) => {
  const db = await database.getDatabase();
  const isChanged = await parser.checkRateChanges();
  let message = '';
  if (isChanged) message = `BTC rate has changed, now it is ${await parser.currentRate()} UAH!`;
  else message = `current BTC rate is ${db.rate} UAH`;
  for (const subscriber of db.people) {
    await sendEmail(senderName, `Hi, ${subscriber.name}, ` + message, subscriber.email);
  }
};

module.exports = { informAboutRate };
