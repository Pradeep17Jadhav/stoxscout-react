const fs = require('fs');
const path = require('path');

const holdingsPath = path.join(__dirname, '../../data/pradeepjadhav/holdings.json');
const scriptListPath = path.join(__dirname, '../../data/common/scriptList.json');

exports.getHoldings = async (req, res) => {
    try {
        const holdingsData = await readHoldings();
        res.json(holdingsData);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.getUserHoldingsList = async (req, res) => {
    try {
        const holdingsData = await readHoldings();
        const holdingsList = await getHoldingsList(holdingsData);
        res.json(holdingsList);
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
                return res.status(500).json({ message: 'Error saving data', error: err });
            }
            res.status(200).json({ message: 'Data saved successfully!' });
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

const getHoldingsListByExchange = (holdings, exchange) =>
    holdings
        .filter(holding => holding.transactions.some(transaction => transaction.exchange === exchange))
        .map(holding => holding.symbol);

const getHoldingsList = async (holdingsData) => {
    const { holdings } = holdingsData;
    const nseList = getHoldingsListByExchange(holdings, 'NSE');
    const bseList = getHoldingsListByExchange(holdings, 'BSE');
    return {
        nse: nseList,
        bse: await convertBseListToCodes(bseList)
    }
}

const convertBseListToCodes = async (bseList) => {
    const scriptListData = await readScriptList();
    return scriptListData.map(script => {
        if (bseList.some(bseListItem => bseListItem === script.nse)) {
            return script.bse !== 'N/A' ? script.bse : null;
        }
    }).filter(bseCode => !!bseCode)
}

const readHoldings = async () => readFile(holdingsPath);
const readScriptList = async () => readFile(scriptListPath);

const readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject({ error: 'Error reading file' });
            }
            try {
                const res = JSON.parse(data);
                resolve(res);
            } catch (parseErr) {
                reject({ error: 'Error parsing JSON' });
            }
        });
    });
}

const addPurchase = (holdingsData, jsonData) => {
    const { symbol, dateAdded, quantity, avgPrice, exchange } = jsonData;
    const { holdings } = holdingsData;
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
