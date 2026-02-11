const net = require('net');

// Хранилище активных соединений от модемов
// Ключ: IP модема, Значение: массив сокетов (новые в начале — unshift)
const activeConnections = new Map();
// Все сокеты в порядке подключения (новый в конце) — для приоритета нового при опросе
const connectionOrder = [];

// Ожидающий ответ аналогового датчика: resolve(voltage) вызовет middleware и отдаст значение на фронт
let _pendingAnalogResolve = null;
const registerPendingAnalogResolve = (resolve) => { _pendingAnalogResolve = resolve; };
const resolvePendingAnalog = (voltage) => {
    if (typeof _pendingAnalogResolve === 'function') {
        _pendingAnalogResolve(voltage);
        _pendingAnalogResolve = null;
    }
};

const getTimestamp = () => {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
};

// Удалить сокет из activeConnections и connectionOrder
const removeSocketFromMap = (socket) => {
    if (!socket || !socket.remoteAddress) return;
    const modemKey = socket.remoteAddress;
    if (activeConnections.has(modemKey)) {
        const connections = activeConnections.get(modemKey);
        const index = connections.indexOf(socket);
        if (index > -1) {
            connections.splice(index, 1);
            console.log(`[${getTimestamp()}] 🗑️  Удалено соединение для ${modemKey} (осталось: ${connections.length})`);
            if (connections.length === 0) activeConnections.delete(modemKey);
        }
    }
    const orderIndex = connectionOrder.indexOf(socket);
    if (orderIndex > -1) connectionOrder.splice(orderIndex, 1);
};

const bufferToHex = (buffer) => {
    return Array.from(buffer)
        .map(b => b.toString(16).padStart(2, '0').toUpperCase())
        .join(' ');
};

// Функция для отправки команды на модем через активное соединение
// Приоритет: новое подключение опрашивается первым
const sendCommandToModem = (host, port, command) => {
    let targetSocket = null;

    // Сначала по host: берём первый живой сокет (у этого ключа новые в начале — приоритет нового)
    if (activeConnections.has(host)) {
        const connections = activeConnections.get(host);
        for (const socket of connections) {
            if (!socket.destroyed && socket.writable) {
                targetSocket = socket;
                break;
            }
        }
    }

    // Если не нашли по host — берём самое новое подключение среди всех (с конца connectionOrder)
    if (!targetSocket && connectionOrder.length > 0) {
        for (let i = connectionOrder.length - 1; i >= 0; i--) {
            const socket = connectionOrder[i];
            if (!socket.destroyed && socket.writable) {
                targetSocket = socket;
                console.log(`[${getTimestamp()}] 💡 Используется соединение от ${socket.remoteAddress} (запрошено ${host}:${port}, приоритет нового)`);
                break;
            }
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
                removeSocketFromMap(targetSocket);
                if (!targetSocket.destroyed) targetSocket.destroy();
            } else {
                console.log(`[${getTimestamp()}] ✅ Команда отправлена успешно на модем`);
                targetSocket.setNoDelay(true);
            }
        });
        return true;
    } catch (err) {
        console.error(`[${getTimestamp()}] ❌ Ошибка при записи:`, err.message);
        removeSocketFromMap(targetSocket);
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
    activeConnections.get(modemKey).unshift(socket);
    connectionOrder.push(socket);
    console.log(`[${getTimestamp()}] 💾 Сохранено активное соединение для ${modemKey} (всего: ${activeConnections.get(modemKey).length}, приоритет у нового)`);

    // TCP keepalive — ОС периодически проверяет соединение; после перезагрузки модема соединение будет закрыто
    socket.setKeepAlive(true, 30 * 1000);

    // Обработка ошибок должна быть установлена ДО других обработчиков
    socket.on("error", (err) => {
        if (err.code === 'ECONNRESET') {
            console.log(`[${getTimestamp()}] ⚠️  Модем закрыл соединение: ${clientAddress}`);
        } else {
            console.error(`[${getTimestamp()}] ❌ Ошибка соединения [${clientAddress}]:`, err.code, err.message);
        }
        removeSocketFromMap(socket);
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
                resolvePendingAnalog(voltage);
                response = null;
                
            } else if (/ult:\s*"[\d.]+"/.test(command)) {
                // Формат ult: "3.34" — напряжение от датчика (нормальный ответ, не ошибка)
                const match = command.match(/ult:\s*"([\d.]+)"/);
                const voltage = match ? parseFloat(match[1]) : NaN;
                if (!isNaN(voltage)) {
                    console.log(`[${timestamp}] ✅ Получены данные от аналогового датчика: ult: "${voltage}"`);
                    console.log(`[${timestamp}]    Напряжение: ${voltage} В`);
                    resolvePendingAnalog(voltage);
                }
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
        removeSocketFromMap(socket);
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

// Периодически удаляем из карты и connectionOrder сокеты, уже уничтоженные
const DEAD_SOCKET_CLEANUP_INTERVAL_MS = 60 * 1000;
setInterval(() => {
    for (const [modemKey, connections] of activeConnections.entries()) {
        const alive = connections.filter((s) => !s.destroyed);
        const removed = connections.length - alive.length;
        if (removed > 0) {
            activeConnections.set(modemKey, alive);
            console.log(`[${getTimestamp()}] 🧹 Очистка: удалено ${removed} мёртвых соединений для ${modemKey}`);
            if (alive.length === 0) activeConnections.delete(modemKey);
        }
    }
    const before = connectionOrder.length;
    for (let i = connectionOrder.length - 1; i >= 0; i--) {
        if (connectionOrder[i].destroyed) connectionOrder.splice(i, 1);
    }
    if (connectionOrder.length !== before) {
        console.log(`[${getTimestamp()}] 🧹 Очистка connectionOrder: было ${before}, осталось ${connectionOrder.length}`);
    }
}, DEAD_SOCKET_CLEANUP_INTERVAL_MS);

module.exports = { server, sendCommandToModem, activeConnections, registerPendingAnalogResolve };