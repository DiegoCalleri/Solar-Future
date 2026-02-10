const authRouter = require("express").Router();
const { login } = require('../controllers')

authRouter.post("/auth/login", login)

module.exports = authRouter;