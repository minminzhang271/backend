// backend/server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
// const mysql = require('mysql');
const cors = require('cors');
// const bodyParser = require('body-parser');

 
// const path = require('path');
// const { dirname } = require('path');
 

const uploadRoutes =  require('./routes/uploadRoutes')
 


const app = express();



// 中间件
app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());
 


// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);

// 测试数据库连接
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

testConnection();


app.use(uploadRoutes);
// API路由
app.get('/api/posts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单篇文章
app.get('/api/posts/:id', async (req, res) => {

  const query = `
    SELECT posts.*, categories.name as category_name
    FROM posts
    LEFT JOIN categories ON posts.category_id = categories.id
    WHERE posts.id = ?
  `;

    try {
    const [rows] = await pool.query(query, [req.params.id]);
    if(rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    rows[0] && res.json(rows[0]);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  
});

app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;
  
  try {
  
    const [result] = await pool.query(
      'INSERT INTO posts (title, content) VALUES (?, ?)',
      [title, content]
    );

    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


