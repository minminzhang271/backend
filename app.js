// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const postRoutes = require('./routes/postRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api', postRoutes);
app.use(uploadRoutes);
app.use('/api/images', imageRoutes);
// 启动服务器
async function startServer() {
  try {
    await testConnection();
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
}

startServer();