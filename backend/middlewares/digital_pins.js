const digital_pins = require('../models/digital_pins');


const findAllDigitalPins = async (req, res, next) => {
    console.log('GET /digital_pins')
    req.digitalPinsArray = await digital_pins.find({});
    next()
}

const findDigitalPinsById = async (req, res, next) => {
    console.log("GET /digital_pins/:id");
    try {
        req.digitalPin = await digital_pins.findById(req.params.id);
        next();
    }
    catch (err) {
        res.status(404).send({ message: "Устройство не найдено" })
    }
}

const updateDigitalPins = async (req, res, next) => {
    try {
        req.digitalPin = await digital_pins.findByIdAndUpdate(req.params.id, req.body)
        console.log(req.digitalPin);
        next()
    }

    catch (err) {
        res.status(404).send({ message: "Ошибка при обновлении устройства" })
    }
}



const deleteDigitalPins = async (req, res, next) => {
    try {
        req.digitalPin = await digital_pins.findByIdAndDelete(req.params.id)
        next()
    }

    catch (err) {
        res.status(404).send({ message: "Ошибка при удалении устройства" })
    }
}


const createDigitalPins = async (req, res, next) => {
    console.log("POST /digital_pins");
    try {
        req.digitalPin = await digital_pins.create(req.body);
        next();
    }
    catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ message: "Ошибка при добавлении нового устройства" }))
    }
}


const checkIsDigitalPinsExists = async (req, res, next) => {
    console.log(req.digitalPinsArray, req.body)
    const isInArray = req.digitalPinsArray.find((item) => {
        return req.body.name === item.name;
    });

    if (isInArray) {
        res.status(400).send({ message: "Устройство с таким названием уже существует" });
    } else {
        next();
    }
};

module.exports = { findAllDigitalPins, findDigitalPinsById, 
    updateDigitalPins, 
    deleteDigitalPins, 
    createDigitalPins,
    checkIsDigitalPinsExists} 