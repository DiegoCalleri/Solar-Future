const sendAllDigitalPins = (req,res) => {
    res.send(req.digitalPinsArray)
}

const sendDigitalPinsUpdated = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({message: 'Устройство успешно обновлено'}));
};

const sendDigitalPinsCreated = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: 'Устройство успешно добавлено'}));
};

const sendDigitalPinsDeleted = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: 'Устройство успешно удалено'}));
};

module.exports = { sendAllDigitalPins, sendDigitalPinsUpdated, sendDigitalPinsCreated, sendDigitalPinsDeleted };