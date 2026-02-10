const net = require('net');

const setClient = (port, host) => {
    const client = new net.Socket();
    client.connect(port, host, () => {
        console.log('Отправил запрос на порт 8000');
        client.write('Пинг!!!');
    });

    client.on('data', (data) => {
        console.log('Ответ от server:', data.toString());
        client.end();
    });

    client.on('close', () => {
        console.log('Connection closed');
    });

    client.on('error', (err) => {
        console.error('Connection error:', err);
    });
}


module.exports = setClient;