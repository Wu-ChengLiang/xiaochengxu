import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    path: process.env.DATABASE_PATH || './database/mingyi.db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_here',
  },
};