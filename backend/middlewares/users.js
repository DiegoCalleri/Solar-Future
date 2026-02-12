const { request } = require('express');
const users = require('../models/users');
const bcrypt = require("bcryptjs");

const findAllUsers = async (req, res, next) => {
    console.log('GET /users')
    req.user = await users.find({})
        .populate('digital_pins')
        .populate('analog_sensors');

    next()
}

const findUserById = async (req, res, next) => {
    console.log("GET /users/:id");
    try {
        // Сохраняем данные авторизованного пользователя перед перезаписью
        req.authUser = req.user; // req.user содержит данные из JWT (авторизованный пользователь)
        
        // Получаем данные запрашиваемого пользователя
        req.requestedUser = await users.findById(req.params.id);
        if (!req.requestedUser) {
            return res.status(404).send({ message: "Пользователь не найден" });
        }
        // Устанавливаем запрашиваемого пользователя в req.user для отправки клиенту
        req.user = req.requestedUser;
        next();
    }
    catch (err) {
        return res.status(404).send({ message: "Пользователь не найден" });
    }
}

const findUserByIdDataFromBodyGET = async (req, res, next) => {
    try {
        req.user = await users.findById(req.body._id);
        if (!req.user) {
            return res.status(404).send({ message: "Пользователь не найден" });
        }
        next();
    }
    catch (err) {
        return res.status(404).send({ message: "Пользователь не найден" });
    }
}

const createUser = async (req, res, next) => {
    console.log("POST /users");
    console.log(req.body)
    try {
        req.user = await users.create(req.body);
        next();
    }
    catch (err) {
        return res.status(400).send({ message: "Ошибка при создании пользователя" });
    }
}

const updateUser = async (req, res, next) => {
    console.log("PUT /users/:id");
    try {
        req.user = await users.findByIdAndUpdate(req.params.id, req.body);
        if (!req.user) {
            return res.status(404).send({ message: "Пользователь не найден" });
        }
        next();
    }
    catch (err) {
        return res.status(404).send({ message: "Ошибка при обновлении пользователя" });
    }
}


const checkEmptyNameAndEmail = async (req, res, next) => {
    // При создании пользователя пароль обязателен, при редактировании - нет
    const isUpdate = req.method === 'PUT';
    
    if (!req.body.username || !req.body.email) {
        return res.status(400).send({ message: "Введите имя и email" });
    }
    
    // Пароль обязателен только при создании (POST)
    if (!isUpdate && !req.body.password) {
        return res.status(400).send({ message: "Введите пароль" });
    }
    
    next();
};


const deleteUser = async (req, res, next) => {
    console.log("DELETE /users/:id");
    try {
        req.user = await users.findByIdAndDelete(req.params.id);
        if (!req.user) {
            return res.status(404).send({ message: "Пользователь не найден" });
        }
        next();
    } catch (error) {
        return res.status(400).send({ message: "Ошибка при удалении пользователя" });
    }
};


const hashPassword = async(req, res, next) => {
    try {
        // Если пароль не передан, пропускаем хеширование
        if (!req.body.password) {
            return next();
        }
        
        // Проверяем, не является ли пароль уже хешем (bcrypt хеши начинаются с $2a$, $2b$ и т.д.)
        if (req.body.password.startsWith('$2a$') || req.body.password.startsWith('$2b$') || req.body.password.startsWith('$2y$')) {
            // Пароль уже захеширован, не хешируем повторно
            return next();
        }
        
        // Хешируем только если пароль не является хешем
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt)
        req.body.password = hash;
        next();
    }

    catch (err) {
        return res.status(400).send({ message: "Ошибка хеширования пароля" });
    }
}


const findUserByIdDevices = async (req, res, next) => {
    try {
        req.user = await users.findById(req.params.id)
            .populate('digital_pins')
            .populate('analog_sensors');
        if (!req.user) {
            return res.status(404).send({ message: "Пользователь не найден" });
        }
        next();
    }
    catch (err) {
        return res.status(404).send({ message: "Пользователь не найден" });
    }
}


const checkUserIsAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(404).send({ message: "Пользователь не найден" });
    }
    
    if (req.user.role == 'admin') {
        next()
    }
    else {
        res.status(200).send({ message: "Вы обычный пользователь. Ничего личного, просто бизнес" })
    }
}


module.exports = { findAllUsers, findUserById, createUser, 
    updateUser, checkEmptyNameAndEmail, deleteUser, 
    hashPassword, findUserByIdDevices, checkUserIsAdmin }