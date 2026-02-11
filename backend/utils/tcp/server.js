const net = require('net');

const getTimestamp = () => {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
};

const bufferToHex = (buffer) => {
    return Array.from(buffer)
        .map(b => b.toString(16).padStart(2, '0').toUpperCase())
        .join(' ');
};

const server = net.createServer((socket) => {
    const clientAddress = `${socket.remoteAddress || 'unknown'}:${socket.remotePort || 'unknown'}`;
    
    console.log(`\n[${getTimestamp()}] 📡 Новое подключение от модема: ${clientAddress}`);

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

module.exports = server;