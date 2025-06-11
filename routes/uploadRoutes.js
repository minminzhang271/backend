const express = require('express');
const router = express.Router();
const uploadConfig = require('../config/uploadConfig');
const { uploadImage } = require('../controllers/uploadController');

// 静态文件服务
router.use('/uploads', express.static('uploads'));

// 上传图片路由
router.post('/api/upload', uploadConfig.single('file'), uploadImage);

module.exports = router;