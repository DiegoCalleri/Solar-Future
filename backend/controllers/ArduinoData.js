const sendArduinoData = (req, res) => {
    res.send(JSON.stringify(req.data))
}

module.exports = sendArduinoData