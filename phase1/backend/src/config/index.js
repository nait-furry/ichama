const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'please-change-this-secret';
const DATABASE_URL = process.env.DATABASE_URL || '';
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  PORT,
  JWT_SECRET,
  DATABASE_URL,
  NODE_ENV,
};
