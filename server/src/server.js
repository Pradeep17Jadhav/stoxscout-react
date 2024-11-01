const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const signupValidation = require('./validators/signupValidation');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send('Unauthorized. Please log in.');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

const indicesController = require('./controllers/indicesController');
const marketDataController = require('./controllers/marketDataController');
const userHoldingsController = require('./controllers/userHoldingsController');
const usersController = require('./controllers/userController');

app.get('/holdings', userHoldingsController.getHoldings);
app.get('/userHoldingsList', userHoldingsController.getUserHoldingsList);

app.post('/api/holding', userHoldingsController.addHolding);

app.post('/api/indices', indicesController.setIndicesData);
app.get('/api/indices', authenticateToken, indicesController.getIndicesData);

app.get('/api/marketData', authenticateToken, marketDataController.getMarketData);
app.post('/api/marketData', marketDataController.setMarketData);

app.post('/api/signup', signupValidation, usersController.signup);
app.post('/api/login', usersController.login);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
