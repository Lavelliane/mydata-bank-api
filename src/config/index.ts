import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Config interface
interface Config {
  bankOrgCode: string;
  jwtSecretKey: string;
  myDataClientId?: string;
  myDataClientSecret?: string;
  myDataPublicKey?: string;
  port: number;
}

// Validate and export config
const config: Config = {
  bankOrgCode: process.env.BANK_ORG_CODE || '',
  jwtSecretKey: process.env.JWT_SECRET_KEY || '',
  myDataClientId: process.env.MYDATA_CLIENT_ID,
  myDataClientSecret: process.env.MYDATA_CLIENT_SECRET,
  myDataPublicKey: process.env.MYDATA_PUBLIC_KEY,
  port: parseInt(process.env.PORT || '3000', 10)
};

// Validate required environment variables
const requiredEnvVars = ['BANK_ORG_CODE', 'JWT_SECRET_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export default config;