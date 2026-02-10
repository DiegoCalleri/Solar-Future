const sendAllAnalogSensors = (req,res) => {
    res.send(req.analogSensorsArray)
}

const sendAnalogSensorsUpdated = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({message: 'Датчик успешно обновлен'}));
};

const sendAnalogSensorsCreated = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: 'Датчик успешно добавлен'}));
};

const sendAnalogSensorsDeleted = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: 'Датчик успешно удален'}));
};

module.exports = { sendAllAnalogSensors, 
    sendAnalogSensorsDeleted, 
    sendAnalogSensorsCreated, 
    sendAnalogSensorsUpdated };