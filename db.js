const { Pool } = require('pg');

const pool = new Pool({
    user: 'test',
    host: 'localhost',
    database: 'financial_tracker',
    password: 'root',
    port: 5432,
  });

module.exports = pool;