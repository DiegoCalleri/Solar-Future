const { getPool } = require('../database/pool');
const { rowToApi, rowsToApi } = require('../database/rowToApi');

const find = async () => {
    const pool = getPool();
    const res = await pool.query('SELECT * FROM team_members ORDER BY created_at ASC');
    return rowsToApi(res.rows);
};

const findById = async (id) => {
    const pool = getPool();
    const res = await pool.query('SELECT * FROM team_members WHERE id = $1', [id]);
    return rowToApi(res.rows[0]);
};

const create = async (body) => {
    const pool = getPool();
    const { name, description, skills, organization, image, group: groupVal } = body;
    const res = await pool.query(
        `INSERT INTO team_members (name, description, skills, organization, image, "group")
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
            name,
            description || '',
            skills || [],
            organization || '',
            image || '',
            groupVal || 'участник',
        ]
    );
    return rowToApi(res.rows[0]);
};

const findByIdAndUpdate = async (id, body) => {
    const pool = getPool();
    const fields = [];
    const values = [];
    let i = 1;
    const map = {
        name: 'name',
        description: 'description',
        skills: 'skills',
        organization: 'organization',
        image: 'image',
        group: '"group"',
    };
    for (const [key, col] of Object.entries(map)) {
        if (body[key] !== undefined) {
            fields.push(`${col} = $${i++}`);
            values.push(body[key]);
        }
    }
    if (fields.length) {
        fields.push(`updated_at = NOW()`);
    }
    if (!fields.length) return findById(id);
    values.push(id);
    const res = await pool.query(
        `UPDATE team_members SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
        values
    );
    return rowToApi(res.rows[0]);
};

const findByIdAndDelete = async (id) => {
    const pool = getPool();
    const res = await pool.query('DELETE FROM team_members WHERE id = $1 RETURNING *', [id]);
    return rowToApi(res.rows[0]);
};

module.exports = { find, findById, create, findByIdAndUpdate, findByIdAndDelete };
