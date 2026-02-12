const sensorRouter = require('express').Router();
const { findAllAnalogSensors, findAnalogSensorsById, createAnalogSensors,
    deleteAnalogSensors, updateAnalogSensors, checkIsAnalogSensorsExists } = require('../middlewares/analog_sensors')
const { sendAllAnalogSensors, sendAnalogSensorsUpdated, sendAnalogSensorsDeleted,
    sendAnalogSensorsCreated
} = require('../controllers/analog_sensors')

const { analogRead } = require('../middlewares');
const { sendArduinoData } = require('../controllers');
const { checkAuth } = require('../middlewares/auth');

sensorRouter.get('/analog_sensors', findAllAnalogSensors, sendAllAnalogSensors);
sensorRouter.post('/analog_sensors', checkAuth, findAllAnalogSensors, checkIsAnalogSensorsExists, createAnalogSensors, sendAnalogSensorsCreated);
sensorRouter.delete('/analog_sensors/:id', checkAuth, deleteAnalogSensors, sendAnalogSensorsDeleted);
sensorRouter.put('/analog_sensors/:id', checkAuth, findAnalogSensorsById, updateAnalogSensors, sendAnalogSensorsUpdated);
sensorRouter.post('/analog_sensors/data', checkAuth, analogRead, sendArduinoData);

module.exports = sensorRouter;