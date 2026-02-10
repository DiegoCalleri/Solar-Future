const { sendAllDigitalPins, sendDigitalPinsUpdated, sendDigitalPinsCreated,
    sendDigitalPinsDeleted
 } = require('../controllers/digital_pins');
const { findAllDigitalPins, findDigitalPinsById, updateDigitalPins,
    deleteDigitalPins, createDigitalPins, checkIsDigitalPinsExists 
 } = require('../middlewares/digital_pins')

const { digitalWrite } = require('../middlewares')
const { sendArduinoData } = require('../controllers');


const digitalPinsRouter = require('express').Router()


digitalPinsRouter.get('/digital_pins', findAllDigitalPins, sendAllDigitalPins);
digitalPinsRouter.put('/digital_pins/:id', findDigitalPinsById, updateDigitalPins, sendDigitalPinsUpdated);
digitalPinsRouter.delete('/digital_pins/:id', deleteDigitalPins, sendDigitalPinsDeleted);
digitalPinsRouter.post('/digital_pins', findAllDigitalPins, checkIsDigitalPinsExists, createDigitalPins, sendDigitalPinsCreated);

digitalPinsRouter.post('/digital_pins/action', digitalWrite, sendArduinoData);

module.exports = digitalPinsRouter;