// config/sharp.js
const sharpConfig = {
  default: {
      width: 800,
      height: 800,
      quality: 80,
      fit: 'inside'
  },
  thumbnail: {
      width: 200,
      height: 200,
      quality: 60,
      fit: 'cover'
  }
};

module.exports = sharpConfig;