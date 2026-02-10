const sensorRouter = require('express').Router();
const { findAllAnalogSensors, findAnalogSensorsById, createAnalogSensors,
    deleteAnalogSensors, updateAnalogSensors, checkIsAnalogSensorsExists } = require('../middlewares/analog_sensors')
const { sendAllAnalogSensors, sendAnalogSensorsUpdated, sendAnalogSensorsDeleted,
    sendAnalogSensorsCreated
} = require('../controllers/analog_sensors')

const { analogRead } = require('../middlewares');
const { sendArduinoData } = require('../controllers');

sensorRouter.get('/analog_sensors', findAllAnalogSensors, sendAllAnalogSensors);
sensorRouter.post('/analog_sensors', findAllAnalogSensors, checkIsAnalogSensorsExists, createAnalogSensors, sendAnalogSensorsCreated);
sensorRouter.delete('/analog_sensors/:id', deleteAnalogSensors, sendAnalogSensorsDeleted)
sensorRouter.put('/analog_sensors/:id', findAnalogSensorsById, updateAnalogSensors, sendAnalogSensorsUpdated)
sensorRouter.post('/analog_sensors/data', analogRead, sendArduinoData);

module.exports = sensorRouter;