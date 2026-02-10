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


module.exports = createOrders;