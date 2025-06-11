// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadConfig = require('../config/multer');
const imageController = require('../controllers/imageController');

const upload = multer(uploadConfig);

router.post('/upload', upload.single('image'), imageController.uploadImage);

// 处理 multer 错误
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: '文件大小超过限制' });
        }
    }
    next(error);
});

module.exports = router;