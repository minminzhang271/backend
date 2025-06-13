// config/database.js
require('../utils/loadEnv')(); 
// console.log('Environment variables:', process.env);
console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'undefined');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const mysql = require('mysql2/promise');
const pool = mysql.createPool(dbConfig);

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };