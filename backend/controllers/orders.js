const sendOrderCreated = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({message: `Ваш вопрос успешно зарегистрирован. 
        Сотрудники Solar Future вернуться к Вам с ответом в ближайшее время`}));
};

const sendAllOrders = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.orders));
};

module.exports = { sendOrderCreated, sendAllOrders };
