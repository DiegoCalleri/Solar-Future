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
            
            // Безопасная отправка ответа с обработкой ошибок
            try {
                // Проверяем, что сокет еще открыт и готов к записи
                if (socket.destroyed || !socket.writable) {
                    console.error(`[${timestamp}] ❌ Сокет закрыт или не готов к записи`);
                    return;
                }
                
                // Отправляем ответ с переносом строки для Arduino Serial
                const response = 'Понг!!!\r\n';
                console.log(`[${timestamp}] 📤 Отправка ответа: "${response.trim()}"`);
                
                socket.write(response, 'utf8', (err) => {
                    if (err) {
                        console.error(`[${timestamp}] ❌ Ошибка отправки ответа:`, err.message);
                    } else {
                        console.log(`[${timestamp}] ✅ Ответ успешно отправлен: "${response.trim()}"`);
                        // Принудительно сбрасываем буфер отправки
                        if (socket.writable) {
                            socket.setNoDelay(true); // Отключаем алгоритм Nagle для немедленной отправки
                        }
                    }
                });
                
                // Дополнительная задержка для гарантии отправки данных
                // НЕ закрываем соединение - пусть модем сам решает когда закрывать
                
            } catch (writeErr) {
                console.error(`[${timestamp}] ❌ Ошибка при записи:`, writeErr.message);
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