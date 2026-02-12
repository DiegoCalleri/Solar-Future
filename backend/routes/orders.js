const { createOrders, findAllOrders } = require('../middlewares/orders')
const { sendOrderCreated, sendAllOrders } = require('../controllers/orders')
const { checkAuth } = require('../middlewares/auth')
const { checkAdmin } = require('../middlewares/checkAdmin')
const ordersRouter = require('express').Router()

ordersRouter.post('/orders', createOrders, sendOrderCreated);
ordersRouter.get('/orders', checkAuth, checkAdmin, findAllOrders, sendAllOrders);

module.exports = ordersRouter;