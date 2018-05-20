var knex = require('./knex.js');

function beginTransaction(cb) {
  return knex.transaction(cb);
}

module.exports = {
  beginTransaction: beginTransaction
};
