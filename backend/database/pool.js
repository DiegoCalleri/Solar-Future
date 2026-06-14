const { Pool } = require('pg');

let pool;

const getPool = () => {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error('DATABASE_URL не задан');
        }
        pool = new Pool({ connectionString });
    }
    return pool;
};

module.exports = { getPool };
