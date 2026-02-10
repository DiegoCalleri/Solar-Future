const sendOrderCreated = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({message: `Ваш вопрос успешно зарегистрирован. 
        Сотрудники Solar Future вернуться к Вам с ответом в ближайшее время`}));
};

module.exports = sendOrderCreated