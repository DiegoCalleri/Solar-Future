const { sendAllDigitalPins, sendDigitalPinsUpdated, sendDigitalPinsCreated,
    sendDigitalPinsDeleted
 } = require('../controllers/digital_pins');
const { findAllDigitalPins, findDigitalPinsById, updateDigitalPins,
    deleteDigitalPins, createDigitalPins, checkIsDigitalPinsExists 
 } = require('../middlewares/digital_pins')

const { digitalWrite } = require('../middlewares')
const { sendArduinoData } = require('../controllers');
const { checkAuth } = require('../middlewares/auth');


const digitalPinsRouter = require('express').Router()


digitalPinsRouter.get('/digital_pins', findAllDigitalPins, sendAllDigitalPins);
digitalPinsRouter.put('/digital_pins/:id', checkAuth, findDigitalPinsById, updateDigitalPins, sendDigitalPinsUpdated);
digitalPinsRouter.delete('/digital_pins/:id', checkAuth, deleteDigitalPins, sendDigitalPinsDeleted);
digitalPinsRouter.post('/digital_pins', checkAuth, findAllDigitalPins, checkIsDigitalPinsExists, createDigitalPins, sendDigitalPinsCreated);

digitalPinsRouter.post('/digital_pins/action', checkAuth, digitalWrite, sendArduinoData);

module.exports = digitalPinsRouter;