// controllers/uploadController.js
const { pool } = require('../config/database');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有文件上传' });
    }

 
    try {
      const [result] = await pool.query(
        'INSERT INTO myblogimages (filename, filepath, filesize, mimetype, upload_date) VALUES (?, ?, ?, ?, NOW())',
        [
          req.file.originalname,
          req.file.filename,
          req.file.size,
          req.file.mimetype
        ]
      );

      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

      res.json({
        url: imageUrl,
        id: result.insertId,
        filename: req.file.originalname
      });
    } finally {
       console.log('res', res);
    }
  } catch (error) {
    console.error('上传错误:', error);
    // res.status(500).json({ error: '文件上传失败' });
  }
};

module.exports = {
  uploadImage
};