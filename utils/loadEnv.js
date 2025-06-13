// utils/loadEnv.js
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

function loadEnvironment() {
  const env = process.env.NODE_ENV || 'development';
  const envFile = env === 'production' ? '.env.production' :
                  env === 'test' ? '.env.test' :
                  '.env.development';

  const envPath = path.resolve(__dirname, '..', envFile);

  console.log('--------------------------');
  console.log('Loading environment config');
  console.log('NODE_ENV:', env);
  console.log('Using:', envFile);
  console.log('Path:', envPath);
  console.log('Exists:', fs.existsSync(envPath));

  if (!fs.existsSync(envPath)) {
    console.warn(`⚠️ Warning: ${envFile} not found at ${envPath}`);
    return;
  }

  const result = dotenv.config({ path: envPath, override: true });

  if (result.error) {
    console.error('❌ Error loading env file:', result.error);
  } else {
    console.log('✅ Environment loaded successfully.');
  }

  console.log('--------------------------');
}

module.exports = loadEnvironment;
