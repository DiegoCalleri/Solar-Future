require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('./middlewares/cors');
const apiRouter = require('./routes/api');


const connectToDatabase = require('./database/connect');
const { server: tcpServer } = require('./utils/tcp/server');

const app = express();
const port = process.env.PORT || 4000;
const tcpPort = process.env.TCP_PORT || 7070;

connectToDatabase();

app.use(cors, 
        bodyParser.json(), 
        express.static(path.join(__dirname, 'public')),
        express.static(path.join(__dirname, 'uploads')), // Раздача загруженных файлов
        apiRouter);
app.get('/', (req, res) => {
  res.send('Home Route');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, http://localhost:${port}`);
});

tcpServer.listen(tcpPort, () => {
  console.log(`TCP server (modem) listening on port ${tcpPort}`);
});

// Обработка ошибок TCP сервера
tcpServer.on('error', (err) => {
  console.error(`TCP Server error:`, err.code, err.message);
});