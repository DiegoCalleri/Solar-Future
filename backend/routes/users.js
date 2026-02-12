const userRouter = require('express').Router();

const { findAllUsers, findUserById, createUser, updateUser, 
    checkEmptyNameAndEmail, deleteUser, hashPassword,
    findUserByIdDevices, checkUserIsAdmin } = require('../middlewares/users')
const { sendAllUsers, sendUserCreated, sendUserUpdated, sendUserDeleted, sendMe } = require('../controllers/users');
const { checkAuth } = require("../middlewares/auth.js");
const { checkAdmin } = require("../middlewares/checkAdmin.js");


userRouter.get('/users', findAllUsers, sendAllUsers);
userRouter.get('/users/devices/:id', findUserByIdDevices, sendAllUsers);
// Проверяем админа ДО получения данных пользователя, чтобы проверить роль авторизованного пользователя
userRouter.get('/users/:id', checkAuth, checkAdmin, findUserById, sendAllUsers);
userRouter.delete("/users/:id", checkAuth, deleteUser, sendUserDeleted);
userRouter.post("/users", checkAuth, checkEmptyNameAndEmail, hashPassword, createUser, sendUserCreated);
userRouter.put("/users/:id", checkAuth, checkEmptyNameAndEmail, hashPassword, updateUser, sendUserUpdated);
userRouter.get("/me", checkAuth, sendMe);


module.exports = userRouter;