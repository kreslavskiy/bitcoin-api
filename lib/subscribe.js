'use strict';

const database = require('./database');
const fs = require('fs');

const getAllEmails = async () => {
  const emails = new Array();
  const db = await database.getDatabase();
  for (const subscriber of db.people) {
    if (!emails.includes(subscriber.email)) emails.push(subscriber.email);
  }
  return emails;
};

const validateEmail = (email) => {
  const regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
  if (!regex.test(email)) throw new Error('Bad email');
};

const subscribe = async (name, email) => {
  validateEmail(email);
  const db = await database.getDatabase();
  const allMails = await getAllEmails();
  if (!allMails.includes(email)) {
    db.people.push({ name, email });
    await fs.promises.writeFile('database.json', JSON.stringify(db));
    return 200;
  } else return 409;
};

module.exports = { subscribe };
