const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const digital_pins = require('./digital_pins');
const analog_sensors = require('./analog_sensors');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    digital_pins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: digital_pins
    }],
    analog_sensors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: analog_sensors
    }]
})


userSchema.statics.findUserByCredentials = function (email, password) {
    return this.findOne({ email })
        .then(user => {
            if (!user) {
                return Promise.reject(new Error("Неправильные почта"));
            }
            console.log(Number(password), user.password)
            return bcrypt.compare(password, user.password)
            
                .then(mathced => {
                    console.log(mathced)
                    if (!mathced) {
                        return Promise.reject(new Error("Неправильный пароль"));
                    }

                    return user;
                })

        })
}


module.exports = mongoose.model('users', userSchema);