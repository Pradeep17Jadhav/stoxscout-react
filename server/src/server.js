const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { signupValidation } = require('./validators/signupValidation');
const { authenticateToken } = require('./middlewares/authMiddleware')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const indicesController = require('./controllers/indicesController');
const marketDataController = require('./controllers/marketDataController');
const userHoldingsController = require('./controllers/userHoldingsController');
const usersController = require('./controllers/authController');

app.get('/userHoldingsList', authenticateToken, userHoldingsController.getUserHoldingsList);

app.get('/api/holdings', authenticateToken, userHoldingsController.getHoldings);
app.post('/api/holding', authenticateToken, userHoldingsController.addHolding);

app.post('/api/indices', indicesController.setIndicesData);
app.get('/api/indices', authenticateToken, indicesController.getIndicesData);

app.get('/api/marketData', authenticateToken, marketDataController.getMarketData);
app.post('/api/marketData', marketDataController.setMarketData);

app.post('/api/signup', signupValidation, usersController.signup);
app.post('/api/login', usersController.login);
app.post('/api/logout', authenticateToken, usersController.logout);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
