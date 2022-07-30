'use strict';

const fs = require('fs');

const createDatabase = async () => {
  const db = {
    rate: 0,
    people: [],
  };
  const content = JSON.stringify(db);
  await fs.promises.appendFile(`${process.cwd()}/database.json`, content);
};

const getDatabase = async () => {
  if (!fs.existsSync('database.json')) await createDatabase();
  const content = fs.readFileSync('database.json', 'utf-8');
  const db = JSON.parse(content);
  return db;
}

module.exports = { getDatabase };
