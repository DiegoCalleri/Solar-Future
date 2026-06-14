const fs = require('fs');
const path = require('path');
const { getPool } = require('./pool');
const { seedAdmin } = require('./seedAdmin');

async function connectToDatabase() {
    try {
        const pool = getPool();
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schema);
        await seedAdmin();
        console.log('Success connect to PostgreSQL');
    } catch (err) {
        console.log('Failed to connect to PostgreSQL');
        console.error(err);
    }
}

module.exports = connectToDatabase;
