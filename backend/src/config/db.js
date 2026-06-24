const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const normalizePlaceholders = (sql) => {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
};

module.exports = {
  query: (sql, params) => pool.query(sql, params),
  execute: async (sql, params = []) => {
    const result = await pool.query(normalizePlaceholders(sql), params);
    return [result.rows, result];
  },
  end: () => pool.end(),
};
