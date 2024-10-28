const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

const marketDataController = require('./controllers/marketDataController');
const userHoldingsController = require('./controllers/userHoldingsController');

app.get('/marketData', marketDataController.getMarketData);
app.post('/marketData', marketDataController.setMarketData);
app.get('/holdings', userHoldingsController.getHoldings);
app.get('/userHoldingsList', userHoldingsController.getUserHoldingsList);
app.post('/addPurchase', userHoldingsController.addPurchase);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
