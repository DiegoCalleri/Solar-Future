const users = require('../models/users');

const checkAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).send({ message: "Необходима авторизация" });
        }

        const user = await users.findById(req.user._id);
        if (!user) {
            return res.status(404).send({ message: "Пользователь не найден" });
        }

        if (user.role !== 'admin') {
            return res.status(403).send({ message: "Доступ запрещён. Требуется роль администратора" });
        }

        req.userData = user;
        next();
    } catch (err) {
        console.error('checkAdmin error:', err);
        return res.status(500).send({ message: "Ошибка проверки прав доступа" });
    }
};

module.exports = { checkAdmin };
