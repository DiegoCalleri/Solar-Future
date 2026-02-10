# Solar Future

Веб-приложение для мониторинга параметров солнечной панели SDM-50 и управления реле: Arduino, Node.js, Next.js, MongoDB.

## Стек и структура

| Часть       | Технологии              | Папка    |
|------------|--------------------------|----------|
| Backend API| Node.js, Express, MongoDB, JWT | `api/`   |
| Frontend   | Next.js, React, Redux    | `next/`  |
| Железо     | Arduino                  | `hardware/` |

**Нормы проекта:**
- Backend: REST API, разделение на роуты, контроллеры, модели, middleware.
- Frontend: компонентная структура, Redux для состояния.
- Общие: `.env` не коммитить, зависимости фиксировать (lock-файлы в репозитории).

Схемы и скриншоты настройки лежат в [`docs/images/`](docs/images/).

---

## Цель и задачи

Цель pet-проекта: разработка веб-приложения для мониторинга параметров (напряжения) солнечной панели SDM-50 и управления реле с использованием аппаратной платформы Arduino, серверной платформы Node.js и фреймворка Next.js.

Задачи:
1. Разработка схемы электрической цепи;
2. Тестирование электрический цепи со скриптами, написанными на JS:
   - Проверка работоспособности платы MAX485;
   - Проверка корректной работы Arduino с GSM-модемом; 
3. Разработка backend на NodeJS:
   - Разработка мидлвар, роутов, контроллеров;
   - Описание схем БД, настройка работы с MongoDB;
   - Настройка аутентификации и JWT;
4. Разработка frontend на NextJS:
   - Разработка компонентов React;
   - Настройка стора Redux;
5. Сборка шкафа диспетчеризации;
6. Настройка виртуальной машины и публикация в сети:
   - Получение доменных имен;
   - Выпуск SSL-сертификата;
   - Настройка GSM-модема

Дальнейшие планы:
- Переход на использование веб-сокетов;
- Замена GSM-модема в пользу платы SIM800L


#### Настройка диспетчерского ПО:
1. Арендуйте облачный сервер;
2. [Откройте порт](https://timeweb.cloud/docs/windows-guides/otkrytie-portov-v-brandmauehre-windows-server) для входящих соединений модемов Promodem;
3. Установите [GSMService](https://promodem.ru/produkty/po-dlya-modemov-serii-gsm-i-3g/sluzhba-dannykh-gsmservice-.html); 
4. Скачайте программу [GSMConfig](https://promodem.ru/produkty/po-dlya-nb-iot-3g-gprs-loggery/servisnoe-po-promodem-config.html);
5. Задайте в ПО GSMConfig во вкладке "Настройки подключений" IP и порт;
6. Во вкладке "Настройки подключений" после обновления информации нужно нажать "Обновить"
--------

#### Настройка GSM-модема:
*Этот пункт нужно выполнять с того хоста, куда физически по USB-интерфейсу можно подключить модем*
1. Откройте GSMConfig;
2. Во вкладке "Настройка канала связи" оставляем все, как есть
3. Залейте актуальную прошивку в модем;
4. Задайте IP и порт диспетчерского компа во вкладке "Настройки подключений";
5. Во вкладке "Таблица соответствия" создайте новое подключение. 
6. Обязательно прочитайте параметры и укажите порт. По указанному TCP-порту на стороне сервера будет определен модем
-------

#### Полезные инструменты:
1. [Hercules](https://www.hw-group.com/software/hercules-setup-utility)
2. [Сайт Promodem](https://promodem.ru/)
3. [GSM Config](https://promodem.ru/produkty/po-dlya-nb-iot-3g-gprs-loggery/servisnoe-po-promodem-config.html)
4. [GSM Service](https://promodem.ru/produkty/po-dlya-modemov-serii-gsm-i-3g/sluzhba-dannykh-gsmservice-.html)
5. [Видеоинструкция](https://www.youtube.com/watch?v=HPCJwuaTbRk)


#### Запуск c использованием Docker
1. docker up docker-compose.yml
2. Адрес хоста для docker - host.docker.internal


#### Запуск без использования Docker
##### Запуск backend
1. cd api
2. npm i
3. npm run dev
##### Запуск frontend
1. cd next 
2. npm i
3. npm run dev
##### Запуск mongod
1. cd mongo/db 
2. mongod --dbpath ./ --port 27017