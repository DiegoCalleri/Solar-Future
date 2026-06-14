const { getPool } = require('../database/pool');
const { rowToApi, rowsToApi } = require('../database/rowToApi');

const find = async () => {
    const pool = getPool();
    const res = await pool.query('SELECT * FROM orders ORDER BY date DESC');
    return rowsToApi(res.rows);
};

const create = async (body) => {
    const pool = getPool();
    const { date, username, email, question, number } = body;
    const res = await pool.query(
        `INSERT INTO orders (date, username, email, question, number)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [date, username, email, question, number]
    );
    return rowToApi(res.rows[0]);
};

module.exports = { find, create };
