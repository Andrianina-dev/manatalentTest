const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'yamabiko.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  user: process.env.DB_PORT || '3000',
  password: process.env.DB_PASSWORD || 'uSrdnqCRaKAnwWIJYnEUNhLZQUrrlBgc',
  database: process.env.DB_NAME || 'railway',
  waitForConnections: true,
  //connectionLimit: 10,
});

module.exports = pool;
