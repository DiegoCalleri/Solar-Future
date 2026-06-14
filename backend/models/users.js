const bcrypt = require('bcryptjs');
const { getPool } = require('../database/pool');
const { rowToApi, rowsToApi } = require('../database/rowToApi');

const normalizeIds = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr
        .map((item) => (typeof item === 'string' ? item : item?._id || item?.id))
        .filter(Boolean)
        .map(String);
};

const attachDevices = async (client, userId) => {
    const dp = await client.query(
        `SELECT d.* FROM digital_pins d
         INNER JOIN user_digital_pins udp ON udp.digital_pin_id = d.id
         WHERE udp.user_id = $1`,
        [userId]
    );
    const as = await client.query(
        `SELECT a.* FROM analog_sensors a
         INNER JOIN user_analog_sensors uas ON uas.analog_sensor_id = a.id
         WHERE uas.user_id = $1`,
        [userId]
    );
    const user = (await client.query('SELECT * FROM users WHERE id = $1', [userId])).rows[0];
    if (!user) return null;
    return {
        ...rowToApi(user),
        digital_pins: rowsToApi(dp.rows),
        analog_sensors: rowsToApi(as.rows),
    };
};

const find = async () => {
    const pool = getPool();
    const usersRes = await pool.query('SELECT * FROM users ORDER BY username');
    const result = [];
    for (const row of usersRes.rows) {
        const withDevices = await attachDevices(pool, row.id);
        result.push(withDevices);
    }
    return result;
};

const findById = async (id) => {
    const pool = getPool();
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rowToApi(res.rows[0]);
};

const findByIdWithDevices = async (id) => {
    const pool = getPool();
    return attachDevices(pool, id);
};

const create = async (body) => {
    const pool = getPool();
    const { username, password, email, role } = body;
    const res = await pool.query(
        `INSERT INTO users (username, password, email, role)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [username, password, email, role || 'user']
    );
    return rowToApi(res.rows[0]);
};

const update = async (id, body) => {
    const pool = getPool();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const fields = [];
        const values = [];
        let i = 1;
        for (const key of ['username', 'password', 'email', 'role']) {
            if (body[key] !== undefined) {
                fields.push(`${key} = $${i++}`);
                values.push(body[key]);
            }
        }
        if (fields.length) {
            values.push(id);
            await client.query(
                `UPDATE users SET ${fields.join(', ')} WHERE id = $${i}`,
                values
            );
        }
        if (body.digital_pins !== undefined) {
            const ids = normalizeIds(body.digital_pins);
            await client.query('DELETE FROM user_digital_pins WHERE user_id = $1', [id]);
            for (const pinId of ids) {
                await client.query(
                    'INSERT INTO user_digital_pins (user_id, digital_pin_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [id, pinId]
                );
            }
        }
        if (body.analog_sensors !== undefined) {
            const ids = normalizeIds(body.analog_sensors);
            await client.query('DELETE FROM user_analog_sensors WHERE user_id = $1', [id]);
            for (const sensorId of ids) {
                await client.query(
                    'INSERT INTO user_analog_sensors (user_id, analog_sensor_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [id, sensorId]
                );
            }
        }
        await client.query('COMMIT');
        const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return rowToApi(res.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const findByIdAndDelete = async (id) => {
    const pool = getPool();
    const res = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return rowToApi(res.rows[0]);
};

const findUserByCredentials = (email, password) => {
    const pool = getPool();
    return pool
        .query('SELECT * FROM users WHERE email = $1', [email])
        .then((res) => {
            const user = res.rows[0];
            if (!user) {
                return Promise.reject(new Error('Неправильные почта'));
            }
            return bcrypt.compare(password, user.password).then((matched) => {
                if (!matched) {
                    return Promise.reject(new Error('Неправильный пароль'));
                }
                return rowToApi(user);
            });
        });
};

module.exports = {
    find,
    findById,
    findByIdWithDevices,
    create,
    update,
    findByIdAndDelete,
    findUserByCredentials,
};
