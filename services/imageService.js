// services/imageService.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const sharpConfig = require('../config/sharp');

class ImageService {
    async compressImage(inputPath, outputPath, options = {}) {
        const defaultOptions = sharpConfig.default;
        const finalOptions = { ...defaultOptions, ...options };
        
        try {
            await sharp(inputPath)
                .resize(finalOptions.width, finalOptions.height, {
                    fit: finalOptions.fit,
                    withoutEnlargement: true
                })
                .jpeg({ quality: finalOptions.quality })
                .toFile(outputPath);
        } catch (error) {
            throw new Error(`图片压缩失败: ${error.message}`);
        }
    }

    async createThumbnail(inputPath, outputPath) {
        try {
            await this.compressImage(inputPath, outputPath, sharpConfig.thumbnail);
        } catch (error) {
            throw new Error(`缩略图生成失败: ${error.message}`);
        }
    }

    async deleteFile(filePath) {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.error(`文件删除失败: ${error.message}`);
        }
    }
}

module.exports = new ImageService();