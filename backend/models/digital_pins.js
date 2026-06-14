const { getPool } = require('../database/pool');
const { rowToApi, rowsToApi } = require('../database/rowToApi');

const find = async () => {
    const pool = getPool();
    const res = await pool.query('SELECT * FROM digital_pins ORDER BY name');
    return rowsToApi(res.rows);
};

const findById = async (id) => {
    const pool = getPool();
    const res = await pool.query('SELECT * FROM digital_pins WHERE id = $1', [id]);
    return rowToApi(res.rows[0]);
};

const create = async (body) => {
    const pool = getPool();
    const { name, image, description, state, number, host, port } = body;
    const res = await pool.query(
        `INSERT INTO digital_pins (name, image, description, state, number, host, port)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, image, description, state ?? null, number, host, port]
    );
    return rowToApi(res.rows[0]);
};

const findByIdAndUpdate = async (id, body) => {
    const pool = getPool();
    const fields = [];
    const values = [];
    let i = 1;
    for (const key of ['name', 'image', 'description', 'state', 'number', 'host', 'port']) {
        if (body[key] !== undefined) {
            fields.push(`${key} = $${i++}`);
            values.push(body[key]);
        }
    }
    if (!fields.length) return findById(id);
    values.push(id);
    const res = await pool.query(
        `UPDATE digital_pins SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
        values
    );
    return rowToApi(res.rows[0]);
};

const findByIdAndDelete = async (id) => {
    const pool = getPool();
    const res = await pool.query('DELETE FROM digital_pins WHERE id = $1 RETURNING *', [id]);
    return rowToApi(res.rows[0]);
};

module.exports = { find, findById, create, findByIdAndUpdate, findByIdAndDelete };
