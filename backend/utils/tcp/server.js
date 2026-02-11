const net = require('net');

// Хранилище активных соединений от модемов
// Ключ: host:port (из БД устройств), Значение: массив активных сокетов
const activeConnections = new Map();

const getTimestamp = () => {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
};

const bufferToHex = (buffer) => {
    return Array.from(buffer)
        .map(b => b.toString(16).padStart(2, '0').toUpperCase())
        .join(' ');
};

// Функция для отправки команды на модем через активное соединение
const sendCommandToModem = (host, port, command) => {
    // Ищем соединение по IP адресу модема (host) или используем первое доступное
    let targetSocket = null;
    
    // Сначала пытаемся найти по host (IP адресу)
    if (activeConnections.has(host)) {
        const connections = activeConnections.get(host);
        for (const socket of connections) {
            if (!socket.destroyed && socket.writable) {
                targetSocket = socket;
                break;
            }
        }
    }
    
    // Если не нашли по host, используем первое доступное соединение
    if (!targetSocket) {
        for (const [key, connections] of activeConnections.entries()) {
            for (const socket of connections) {
                if (!socket.destroyed && socket.writable) {
                    targetSocket = socket;
                    console.log(`[${getTimestamp()}] 💡 Используется соединение от ${key} (запрошено ${host}:${port})`);
                    break;
                }
            }
            if (targetSocket) break;
        }
    }
    
    if (!targetSocket) {
        console.log(`[${getTimestamp()}] ⚠️  Нет активных соединений от модемов`);
        console.log(`[${getTimestamp()}] 💡 Доступные соединения:`, Array.from(activeConnections.keys()));
        return false;
    }
    
    // Отправляем команду
    try {
        const commandWithNewline = command + '\r\n';
        console.log(`[${getTimestamp()}] 📤 Отправка команды на модем: "${command.trim()}"`);
        targetSocket.write(commandWithNewline, 'utf8', (err) => {
            if (err) {
                console.error(`[${getTimestamp()}] ❌ Ошибка отправки команды:`, err.message);
            } else {
                console.log(`[${getTimestamp()}] ✅ Команда отправлена успешно на модем`);
                targetSocket.setNoDelay(true);
            }
        });
        return true;
    } catch (err) {
        console.error(`[${getTimestamp()}] ❌ Ошибка при записи:`, err.message);
        return false;
    }
};

const server = net.createServer((socket) => {
    const clientAddress = `${socket.remoteAddress || 'unknown'}:${socket.remotePort || 'unknown'}`;
    
    console.log(`\n[${getTimestamp()}] 📡 Новое подключение от модема: ${clientAddress}`);
    
    // Сохраняем соединение для возможной отправки команд
    // Используем IP адрес модема как ключ (можно расширить для идентификации по host:port из БД)
    const modemKey = socket.remoteAddress || 'unknown';
    if (!activeConnections.has(modemKey)) {
        activeConnections.set(modemKey, []);
    }
    activeConnections.get(modemKey).push(socket);
    console.log(`[${getTimestamp()}] 💾 Сохранено активное соединение для ${modemKey} (всего: ${activeConnections.get(modemKey).length})`);

    // Обработка ошибок должна быть установлена ДО других обработчиков
    socket.on("error", (err) => {
        // ECONNRESET - это нормальная ситуация, когда клиент закрывает соединение
        if (err.code === 'ECONNRESET') {
            console.log(`[${getTimestamp()}] ⚠️  Модем закрыл соединение: ${clientAddress}`);
        } else {
            console.error(`[${getTimestamp()}] ❌ Ошибка соединения [${clientAddress}]:`, err.code, err.message);
        }
    });

    socket.on("data", (data) => {
        try {
            const timestamp = getTimestamp();
            const dataSize = data.length;
            const hexData = bufferToHex(data);
            
            // Безопасное преобразование в текст (только валидные UTF-8 символы)
            let textData = '';
            try {
                textData = data.toString('utf8').replace(/[\x00-\x1F\x7F-\x9F]/g, '.'); // Заменяем управляющие символы
            } catch (e) {
                textData = '[невалидный UTF-8]';
            }
            
            const asciiData = Array.from(data)
                .map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.')
                .join('');

            console.log(`\n[${timestamp}] 📥 Данные от модема [${clientAddress}]:`);
            console.log(`   Размер: ${dataSize} байт`);
            console.log(`   HEX:    ${hexData}`);
            if (textData && textData.trim()) {
                console.log(`   Текст:  ${textData}`);
            }
            console.log(`   ASCII:  ${asciiData}`);
            
            // Парсим данные от модема/Arduino
            const command = textData.trim();
            let response = null;
            
            // Обработка данных от модема/Arduino
            if (command.startsWith('D') && command.length >= 5) {
                // Команда управления digital pin от модема (формат: D0701 = D + pin 07 + state 01)
                // Это запрос от модема - нужно отправить команду управления обратно на модем
                const pinStr = command.substring(1, 3);
                const actionStr = command.substring(3, 5);
                const pinNumber = parseInt(pinStr);
                const action = parseInt(actionStr);
                
                console.log(`[${timestamp}] 📋 Получен запрос команды управления digital pin: ${command}`);
                console.log(`[${timestamp}]    Парсинг: pin=${pinNumber}, action=${action}`);
                
                // Отправляем команду управления обратно на модем для передачи в Arduino
                // Формат: D + номер_пина(2 цифры) + действие(2 цифры) + \r\n
                response = command + '\r\n';
                console.log(`[${timestamp}] 📤 Отправка команды управления на модем: "${response.trim()}"`);
                
            } else if (command.startsWith('A') && command.length >= 2) {
                // Команда чтения аналогового датчика от модема (формат: A0, A1 и т.д.)
                const sensorNumber = command.substring(1);
                console.log(`[${timestamp}] 📋 Получен запрос команды чтения аналогового датчика: ${command}`);
                console.log(`[${timestamp}]    Номер датчика: ${sensorNumber}`);
                
                // Отправляем команду чтения обратно на модем для передачи в Arduino
                response = command + '\r\n';
                console.log(`[${timestamp}] 📤 Отправка команды чтения на модем: "${response.trim()}"`);
                
            } else if (!isNaN(parseFloat(command)) && (command === '200' || command === '400')) {
                // Ответ от Arduino после выполнения команды digital pin
                // "200" = HIGH (включено), "400" = LOW (выключено)
                console.log(`[${timestamp}] ✅ Получен ответ от Arduino (digital pin): ${command}`);
                console.log(`[${timestamp}]    Статус: ${command === '200' ? 'HIGH (включено)' : 'LOW (выключено)'}`);
                // Не отправляем ответ - это данные от Arduino
                response = null;
                
            } else if (!isNaN(parseFloat(command)) && command.includes('.')) {
                // Числовое значение с точкой - это данные от аналогового датчика (например, "12.34")
                const voltage = parseFloat(command);
                console.log(`[${timestamp}] ✅ Получены данные от аналогового датчика: ${command}`);
                console.log(`[${timestamp}]    Напряжение: ${voltage} В`);
                // Не отправляем ответ - это данные от Arduino
                response = null;
                
            } else {
                // Неизвестная команда или формат
                console.log(`[${timestamp}] ⚠️  Неизвестный формат данных: ${command}`);
                // Не отправляем ответ на неизвестные данные
                response = null;
            }
            
            // Отправляем команду управления на модем только если это запрос команды
            if (response) {
                try {
                    // Проверяем, что сокет еще открыт и готов к записи
                    if (socket.destroyed || !socket.writable) {
                        console.error(`[${timestamp}] ❌ Сокет закрыт или не готов к записи`);
                        return;
                    }
                    
                    console.log(`[${timestamp}] 📡 Отправка команды управления на модем...`);
                    socket.write(response, 'utf8', (err) => {
                        if (err) {
                            console.error(`[${timestamp}] ❌ Ошибка отправки команды на модем:`, err.message);
                        } else {
                            console.log(`[${timestamp}] ✅ Команда управления успешно отправлена на модем: "${response.trim()}"`);
                            // Отключаем алгоритм Nagle для немедленной отправки
                            if (socket.writable) {
                                socket.setNoDelay(true);
                            }
                        }
                    });
                } catch (writeErr) {
                    console.error(`[${timestamp}] ❌ Ошибка при записи команды на модем:`, writeErr.message);
                }
            }
        } catch (err) {
            console.error(`[${getTimestamp()}] ❌ Ошибка обработки данных:`, err.message);
        }
    });

    socket.on("close", (hadError) => {
        if (hadError) {
            console.log(`[${getTimestamp()}] 🔌 Соединение закрыто с ошибкой: ${clientAddress}`);
        } else {
            console.log(`[${getTimestamp()}] 🔌 Соединение закрыто клиентом: ${clientAddress}`);
        }
        
        // Удаляем соединение из активных
        const modemKey = socket.remoteAddress || 'unknown';
        if (activeConnections.has(modemKey)) {
            const connections = activeConnections.get(modemKey);
            const index = connections.indexOf(socket);
            if (index > -1) {
                connections.splice(index, 1);
                console.log(`[${getTimestamp()}] 🗑️  Удалено соединение для ${modemKey} (осталось: ${connections.length})`);
                if (connections.length === 0) {
                    activeConnections.delete(modemKey);
                }
            }
        }
    });
    
    // Обработка события 'drain' - буфер отправки освободился
    socket.on('drain', () => {
        console.log(`[${getTimestamp()}] 💧 Буфер отправки освобожден: ${clientAddress}`);
    });
    
    // Обработка события 'end' - клиент закрыл соединение для записи
    socket.on('end', () => {
        console.log(`[${getTimestamp()}] 🔚 Клиент закрыл соединение для записи: ${clientAddress}`);
    });
});

// Обработка ошибок на уровне сервера
server.on('error', (err) => {
    console.error(`[${getTimestamp()}] ❌ Ошибка TCP сервера:`, err.code, err.message);
    // Не завершаем процесс, сервер продолжит работу
});

module.exports = { server, sendCommandToModem, activeConnections };