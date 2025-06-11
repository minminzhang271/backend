// controllers/imageController.js
const { pool } = require('../config/database');
const imageService = require('../services/imageService');
const path = require('path');
const fs = require('fs').promises;



function insertData(file, imageInfo) {
  console.log('insertData');

  // 插入数据的 SQL 查询
  const query = `
    INSERT INTO myblogimages (
      filename, filepath, filesize, mimetype, upload_date,
      compressed_filename, compressed_path,
      thumbnail_filename, thumbnail_path
    ) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?)
  `;

  // 占位符对应的值
  const values = [
    file.filename,
    file.path,
    file.size,
    file.mimetype,
    imageInfo.compressed.filename,
    imageInfo.compressed.path,
    imageInfo.thumbnail.filename,
    imageInfo.thumbnail.path,
  ];

  // 执行数据库查询
  pool.query(query, values, (error, results) => {
    if (error) {
      console.error('数据库插入失败:', error);
      throw new Error('数据库插入失败'); // 可选择抛出异常或调用错误处理函数
    } else {
      console.log('图片信息已存储到数据库，ID:', results.insertId);
    }
  });
}

class ImageController {
    async uploadImage(req, res) {
        if (!req.file) {
            return res.status(400).json({ error: '请选择要上传的图片' });
        }
    
        try {
            // 创建压缩后的图片存储目录
            const compressedDir = 'uploads/compressed';
            const thumbnailDir = 'uploads/thumbnails';
            await Promise.all([
                fs.mkdir(compressedDir, { recursive: true }),
                fs.mkdir(thumbnailDir, { recursive: true })
            ]);

            // 生成文件路径
            const compressedFilename = 'compressed-' + req.file.filename;
            const thumbnailFilename = 'thumbnail-' + req.file.filename;
            const compressedPath = path.join(compressedDir, compressedFilename);
            const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);

            // 并行处理压缩图片和缩略图
            await Promise.all([
                imageService.compressImage(req.file.path, compressedPath),
                imageService.createThumbnail(req.file.path, thumbnailPath)
            ]);

 
            const imageInfo = {
                    original: {
                        filename: req.file.filename,
                        path: req.file.path
                    },
                    compressed: {
                        filename: compressedFilename,
                        path: compressedPath
                    },
                    thumbnail: {
                        filename: thumbnailFilename,
                        path: thumbnailPath
                    }
            }


             insertData(req.file, imageInfo);
            res.json({
                message: '图片上传处理成功',
                data: imageInfo
            });
        } catch (error) {
            // 清理已上传的文件
            if (req.file) {
                await imageService.deleteFile(req.file.path);
            }
            res.status(500).json({ error: error.message });
        }
    }

    // 其他控制器方法...
}

module.exports = new ImageController();