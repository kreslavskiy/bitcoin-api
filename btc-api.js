'use strict';

const db = require('./lib/database');
const mailer = require('./lib/mailer');
const parser = require('./lib/parser');
const subscribe = require('./lib/subscribe');

module.exports = { ...db, ...mailer, ...parser, ...subscribe };
