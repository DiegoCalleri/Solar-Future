const userRouter = require('express').Router();

const { findAllUsers, findUserById, createUser, updateUser, 
    checkEmptyNameAndEmail, deleteUser, hashPassword,
    findUserByIdDevices, checkUserIsAdmin } = require('../middlewares/users')
const { sendAllUsers, sendUserCreated, sendUserUpdated, sendUserDeleted, sendMe } = require('../controllers/users');
const { checkAuth } = require("../middlewares/auth.js");


userRouter.get('/users', findAllUsers, sendAllUsers);
userRouter.get('/users/:id', findUserById, checkUserIsAdmin, sendAllUsers);
userRouter.get('/users/devices/:id', findUserByIdDevices, sendAllUsers);
userRouter.delete("/users/:id", deleteUser, sendUserDeleted);
userRouter.post("/users", hashPassword, createUser, checkEmptyNameAndEmail, sendUserCreated);
userRouter.put("/users/:id", hashPassword, updateUser, checkEmptyNameAndEmail, sendUserUpdated);
userRouter.get("/me", checkAuth, sendMe);


module.exports = userRouter;