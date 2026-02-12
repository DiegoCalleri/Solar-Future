const orders = require('../models/orders')


const createOrders = async (req, res, next) => {
    console.log("POST /orders", req.body);
    try {
        req.digitalPin = await orders.create(req.body);
        next();
    }
    catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ message: "Ошибка при добавлении нового заказа" }))
    }
}

const findAllOrders = async (req, res, next) => {
    console.log('GET /orders')
    try {
        req.orders = await orders.find({}).sort({ date: -1 }); // Сортировка по дате (новые сначала)
        next();
    } catch (err) {
        res.status(500).send({ message: "Ошибка при получении заказов" });
    }
}

module.exports = { createOrders, findAllOrders };
