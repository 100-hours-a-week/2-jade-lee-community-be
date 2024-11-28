import mysql from 'mysql2/promise'; 
import dotenv from 'dotenv';
dotenv.config();
const db = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            dateStrings: true 
        });
        return connection; 
    } catch (err) {
        console.error('DB connection failed:', err);
        throw err; 
    }
};
export default db;
