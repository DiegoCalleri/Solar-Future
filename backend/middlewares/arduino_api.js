const net = require('net')

const digitalWrite = (req, res, next) => {
    const { number, switchOn, host, port } = req.body
    try {
        const client = new net.Socket();
        client.connect(port, host, function () {
            client.write('D0' + number + '0' + Number(switchOn));
        })

        client.on('data', function (data) {
            if (data) {
                try {
                    req.data = { "data": data.subarray(0, 5).toString() };
                    next();
                    client.end()
                }
                catch (err) {
                    req.data = { "data": "null" };
                    next();
                    client.end()
                }
            }
        });
    }
    catch (err) {
        console.log(err)
    }
}


const analogRead = (req, res, next) => {
    const { number, host, port } = req.body
    try {
        const client = new net.Socket();
        client.connect(port, host, function () {
            client.write('A' + number);
        })

        client.on('data', function (data) {
            if (data) {
                try {
                    req.data = { "data": data.subarray(0, 5).toString() };
                    next();
                    client.end()
                }
                catch (err) {
                    req.data = { "data": "null" };
                    next();
                    client.end()
                }
            }
        });

    }
    catch (err) {
        console.log(err)
    }

}



module.exports = { digitalWrite, analogRead } 