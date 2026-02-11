const net = require('net')

const digitalWrite = (req, res, next) => {
    const { number, switchOn, host, port } = req.body
    
    console.log(`\n[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] 🔌 digitalWrite запрос:`);
    console.log(`   Параметры: pin=${number}, state=${switchOn}`);
    console.log(`   Подключение к модему: ${host}:${port}`);
    
    try {
        const client = new net.Socket();
        
        client.on('connect', function () {
            const command = 'D0' + number + '0' + Number(switchOn);
            console.log(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] ✅ Подключено к модему ${host}:${port}`);
            console.log(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] 📤 Отправка команды на модем: "${command}"`);
            client.write(command);
        });
        
        client.on('error', function (err) {
            console.error(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] ❌ Ошибка подключения к модему ${host}:${port}:`, err.message);
            req.data = { "data": "null" };
            next();
        });

        client.on('data', function (data) {
            console.log(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] 📥 Получен ответ от модема: "${data.toString()}"`);
            if (data) {
                try {
                    req.data = { "data": data.subarray(0, 5).toString() };
                    next();
                    client.end()
                }
                catch (err) {
                    console.error(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] ❌ Ошибка обработки ответа:`, err.message);
                    req.data = { "data": "null" };
                    next();
                    client.end()
                }
            }
        });
        
        client.on('close', function () {
            console.log(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] 🔌 Соединение с модемом закрыто`);
        });
        
        console.log(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] 🔄 Попытка подключения к модему ${host}:${port}...`);
        client.connect(port, host);
    }
    catch (err) {
        console.error(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] ❌ Ошибка создания TCP клиента:`, err.message);
    }
}


const analogRead = (req, res, next) => {
    const { number, host, port } = req.body
    
    console.log(`\n[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] 🔌 analogRead запрос:`);
    console.log(`   Параметры: sensor=${number}`);
    console.log(`   Подключение к модему: ${host}:${port}`);
    
    try {
        const client = new net.Socket();
        
        client.on('connect', function () {
            const command = 'A' + number;
            console.log(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] ✅ Подключено к модему ${host}:${port}`);
            console.log(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] 📤 Отправка команды на модем: "${command}"`);
            client.write(command);
        });
        
        client.on('error', function (err) {
            console.error(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] ❌ Ошибка подключения к модему ${host}:${port}:`, err.message);
            req.data = { "data": "null" };
            next();
        });

        client.on('data', function (data) {
            console.log(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] 📥 Получен ответ от модема: "${data.toString()}"`);
            if (data) {
                try {
                    req.data = { "data": data.subarray(0, 5).toString() };
                    next();
                    client.end()
                }
                catch (err) {
                    console.error(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] ❌ Ошибка обработки ответа:`, err.message);
                    req.data = { "data": "null" };
                    next();
                    client.end()
                }
            }
        });
        
        client.on('close', function () {
            console.log(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] 🔌 Соединение с модемом закрыто`);
        });
        
        console.log(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] 🔄 Попытка подключения к модему ${host}:${port}...`);
        client.connect(port, host);
    }
    catch (err) {
        console.error(`[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] ❌ Ошибка создания TCP клиента:`, err.message);
    }

}



module.exports = { digitalWrite, analogRead } 