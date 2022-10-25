const { Pool } = require('pg')
require('dotenv').config();
const pool = new Pool({
  connectionString: process.env.dbLink,
})

module.exports = { pool };