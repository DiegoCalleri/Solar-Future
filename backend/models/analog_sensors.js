const mongoose = require('mongoose');

const analog_sensors = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    host: {
        type: String,
        required: true
    },
    port: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('analog_sensors', analog_sensors);