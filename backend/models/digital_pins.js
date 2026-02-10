const mongoose = require('mongoose');

const digital_pins = new mongoose.Schema({
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
    state: {
        type: Boolean,
        required: false
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

module.exports = mongoose.model('digital_pins', digital_pins);