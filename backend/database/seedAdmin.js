const bcrypt = require('bcryptjs');
const { getPool } = require('./pool');

async function seedAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return;

    const pool = getPool();
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
        `INSERT INTO users (username, email, password, role)
         VALUES ($1, $2, $3, 'admin')
         ON CONFLICT (email) DO UPDATE SET
           username = EXCLUDED.username,
           password = EXCLUDED.password,
           role = 'admin'`,
        ['admin', email, hash]
    );
    console.log('Admin user seeded:', email);
}

module.exports = { seedAdmin };
