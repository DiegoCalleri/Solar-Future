const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('orders', orderSchema);