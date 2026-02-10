require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('./middlewares/cors');
const apiRouter = require('./routes/api');


const connectToDatabase = require('./database/connect')
const app = express();
const port = process.env.PORT || 4000;
connectToDatabase()

app.use(cors, 
        bodyParser.json(), 
        express.static(path.join(__dirname, 'public')),
        apiRouter);
app.get('/', (req, res) => {
  res.send('Home Route');
});

app.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);