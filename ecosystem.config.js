// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'mblog-backend',                 // PM2 中显示的应用名
      script: './app.js',          // 启动文件
      instances: 1,                   // 可改为 'max' 启用多核
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',

      env: {
        NODE_ENV: 'development'       // 默认环境（pm2 start）
      },

      env_production: {
        NODE_ENV: 'production'        // 生产环境（pm2 start --env production）
      }
    }
  ]
};
