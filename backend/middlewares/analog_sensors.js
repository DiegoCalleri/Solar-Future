const analog_sensors = require('../models//analog_sensors');


const findAllAnalogSensors = async (req, res, next) => {
    console.log('GET /analog sensors')
    req.analogSensorsArray = await analog_sensors.find({});
    next()
}


const findAnalogSensorsById = async (req, res, next) => {
    console.log("GET /analogSensors/:id");
    try {
        req.digitalPin = await analog_sensors.findById(req.params.id);
        next();
    }
    catch (err) {
        res.status(404).send({ message: "Устройство не найдено" })
    }
}


const updateAnalogSensors = async (req, res, next) => {
    try {
        req.analogSensor = await analog_sensors.findByIdAndUpdate(req.params.id, req.body)
        next()
    }

    catch (err) {
        res.status(404).send({ message: "Ошибка при обновлении датчика" })
    }
}



const deleteAnalogSensors = async (req, res, next) => {
    try {
        req.analogSensor = await analog_sensors.findByIdAndDelete(req.params.id)
        next()
    }

    catch (err) {
        res.status(404).send({ message: "Ошибка при удалении датчика" })
    }
}


const createAnalogSensors = async (req, res, next) => {
    console.log("POST /analog_sensors", req.body);
    try {
        req.analogSensor = await analog_sensors.create(req.body);
        next();
    }
    catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ message: "Ошибка при добавлении нового датчика" }))
    }
}

const checkIsAnalogSensorsExists = async (req, res, next) => {
    const isInArray = req.analogSensorsArray.find((item) => {
        return req.body.name === item.name;
    });

    if (isInArray) {
        res.status(400).send({ message: "Устройство с таким названием уже существует" });
    } else {
        next();
    }
};

module.exports = {findAllAnalogSensors, findAnalogSensorsById, createAnalogSensors,
    deleteAnalogSensors, updateAnalogSensors, checkIsAnalogSensorsExists
}