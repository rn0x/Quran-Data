// config.js
import dotenv from 'dotenv';
dotenv.config(); 

const config = {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL || 'sqlite://path_to_your_db',
    secretKey: process.env.SECRET_KEY || 'your_secret_key',
    apiRateLimit: process.env.API_RATE_LIMIT || 200
};

export default config;
