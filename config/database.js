// config/database.js
const dotenv = require('dotenv');
const path = require('path');

// console.log('Loading database configuration...');
// console.log('Current environment:', process.env.NODE_ENV || 'development');

// 加载对应的 env 文件
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
const envPath = path.resolve(__dirname, '..', envFile); // ← 上一级目录（根目录）

// console.log('Using environment file:', envFile);
// console.log('Environment file path:', envPath);

// 修正：使用 envPath 而不是 envFile
dotenv.config({ path: envPath });

// console.log('Database configuration loaded from .env file');
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_NAME:', process.env.DB_NAME);
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