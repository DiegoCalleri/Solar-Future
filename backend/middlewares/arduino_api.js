const net = require('net')
const { sendCommandToModem, activeConnections } = require('../utils/tcp/server');

const getTimestamp = () => {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
};

const digitalWrite = (req, res, next) => {
    const { number, switchOn, host, port } = req.body
    
    console.log(`\n[${getTimestamp()}] 🔌 digitalWrite запрос:`);
    console.log(`   Параметры: pin=${number}, state=${switchOn}`);
    console.log(`   Модем: ${host}:${port}`);
    
    const command = 'D0' + number + '0' + Number(switchOn);
    
    // Пытаемся отправить команду через активное соединение от модема
    // Модем подключается к серверу на порту 7070, поэтому используем его IP
    const success = sendCommandToModem(host, port, command);
    
    if (success) {
        // Команда отправлена, ждем ответ через TCP сервер
        // Ответ придет через событие 'data' в TCP сервере
        // Устанавливаем таймаут для ожидания ответа
        const timeout = setTimeout(() => {
            console.log(`[${getTimestamp()}] ⏱️  Таймаут ожидания ответа от модема`);
            req.data = { "data": "timeout" };
            next();
        }, 20000);
        
        // Сохраняем callback для обработки ответа
        // Ответ будет обработан в TCP сервере и сохранен в req
        req._commandTimeout = timeout;
        req._command = command;
    } else {
        console.error(`[${getTimestamp()}] ❌ Не удалось отправить команду - нет активного соединения с модемом ${host}:${port}`);
        console.log(`[${getTimestamp()}] 💡 Доступные соединения:`, Array.from(activeConnections.keys()));
        req.data = { "data": "no_connection" };
        next();
    }
}


const analogRead = (req, res, next) => {
    const { number, host, port } = req.body
    
    console.log(`\n[${getTimestamp()}] 🔌 analogRead запрос:`);
    console.log(`   Параметры: sensor=${number}`);
    console.log(`   Модем: ${host}:${port}`);
    
    const command = 'A' + number;
    
    // Пытаемся отправить команду через активное соединение от модема
    const success = sendCommandToModem(host, port, command);
    
    if (success) {
        // Команда отправлена, ждем ответ через TCP сервер (20 сек — модем может отвечать медленно)
        const timeout = setTimeout(() => {
            console.log(`[${getTimestamp()}] ⏱️  Таймаут ожидания ответа от модема`);
            req.data = { "data": "timeout" };
            next();
        }, 20000);
        
        req._commandTimeout = timeout;
        req._command = command;
    } else {
        console.error(`[${getTimestamp()}] ❌ Не удалось отправить команду - нет активного соединения с модемом ${host}:${port}`);
        console.log(`[${getTimestamp()}] 💡 Доступные соединения:`, Array.from(activeConnections.keys()));
        req.data = { "data": "no_connection" };
        next();
    }

}



module.exports = { digitalWrite, analogRead } 