const createOrders = require('../middlewares/orders')
const sendOrderCreated = require('../controllers/orders')
const ordersRouter = require('express').Router()

ordersRouter.post('/orders', createOrders, sendOrderCreated);

module.exports = ordersRouter;