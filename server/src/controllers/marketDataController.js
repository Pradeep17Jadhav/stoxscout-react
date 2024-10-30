const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../data/common/marketData.json');

exports.setMarketData = async (req, res) => {
    const newFetchedParsed = req.body;
    const uniqueDataMap = new Map();
    const lastFetchedData = await readFile(filePath);
    newFetchedParsed.forEach((item) => {
        uniqueDataMap.set(item.symbol, item);
    });
    if (lastFetchedData) {
        lastFetchedData.forEach((item) => {
            if (!uniqueDataMap.has(item.symbol)) {
                uniqueDataMap.set(item.symbol, item);
            }
        });
    }
    const newMarketData = Array.from(uniqueDataMap.values())
    fs.writeFile(filePath, JSON.stringify(newMarketData, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error saving data', error: err });
        }
        res.status(200).json({ message: 'Data saved successfully!' });
    });
};

exports.getMarketData = async (req, res) => {
    try {
        const marketData = await readFile(filePath);
        res.status(200).json(marketData);
    } catch (error) {
        res.status(500).json(error);
    }
};


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