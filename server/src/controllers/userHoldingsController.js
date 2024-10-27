const fs = require('fs');
const path = require('path');

const holdingsPath = path.join(__dirname, '../../data/pradeepjadhav/holdings.json');

exports.getHoldings = async (req, res) => {
    try {
        const holdingsData = await readHoldings();
        res.json(holdingsData);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.addPurchase = async (req, res) => {
    const jsonData = req.body;
    try {
        const holdingsData = await readHoldings();
        const updatedHoldings = addPurchase(holdingsData, jsonData);
        fs.writeFile(holdingsPath, JSON.stringify(updatedHoldings, null, 2), (err) => {
            if (err) {
                return res.status(500).json({message: 'Error saving data', error: err});
            }
            res.status(200).json({message: 'Data saved successfully!'});
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

const readHoldings = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile(holdingsPath, 'utf8', (err, data) => {
            if (err) {
                return reject({error: 'Error reading file'});
            }
            try {
                const holdingsData = JSON.parse(data);
                resolve(holdingsData);
            } catch (parseErr) {
                reject({error: 'Error parsing JSON'});
            }
        });
    });
};

const addPurchase = (holdingsData, jsonData) => {
    const {symbol, dateAdded, quantity, avgPrice, exchange} = jsonData;
    const {holdings} = holdingsData;
    const existingStock = holdings.find((stock) => stock.symbol === symbol);
    let updatedHoldingsData;

    if (existingStock) {
        updatedHoldingsData = holdings.map((holding) => {
            if (holding.symbol === symbol) {
                return {
                    ...holding,
                    transactions: [
                        ...holding.transactions,
                        {
                            dateAdded,
                            quantity,
                            avgPrice,
                            exchange
                        }
                    ]
                };
            }
            return holding;
        });
    } else {
        const newHolding = {
            symbol,
            transactions: [
                {
                    dateAdded,
                    quantity,
                    avgPrice,
                    exchange
                }
            ]
        };
        updatedHoldingsData = [...holdings, newHolding];
    }
    return {
        holdings: updatedHoldingsData,
        lastUpdated: Date.now()
    };
};
