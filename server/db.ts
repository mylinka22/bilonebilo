import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in .env');
}

export const pool = new Pool({
    connectionString,
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error connecting to PostgreSQL:', err);
    } else {
        console.log('✅ Connected to PostgreSQL successfully');
    }
});
