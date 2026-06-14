const jwt = require('jsonwebtoken');
const users = require('../models/users');

const login = (req, res) => {
    const { email, password } = req.body;
    const secret = process.env.JWT_SECRET;

    users
        .findUserByCredentials(email, password)
        .then((user) => {
            if (!secret) {
                return res.status(500).send({ message: 'JWT_SECRET не задан' });
            }
            const token = jwt.sign({ _id: user._id, role: user.role }, secret, {
                expiresIn: '24h',
            });
            res.status(200).send({
                _id: user._id,
                username: user.username,
                email: user.email,
                jwt: token,
            });
        })
        .catch((error) => {
            if (!res.headersSent) {
                res.status(401).send({ message: error.message });
            }
        });
};

module.exports = { login };
