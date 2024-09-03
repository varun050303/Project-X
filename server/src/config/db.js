// src/db.js
import pkg from 'pg';
const { Pool } = pkg;
// // Debugging: Log environment variables to check if they're correctly loaded
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '****' : 'Not set'); // Masking password for security
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('DB_PORT:', process.env.DB_PORT);
const poolConfig = {
    connectionString: process.env.DB_URI,
};

if (process.env.NODE_ENV === "production") {
    poolConfig.ssl = {
        rejectUnauthorized: false, // Important for Supabase connection
    };
}


const pool = new Pool(poolConfig);


pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;