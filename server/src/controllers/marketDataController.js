const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../data/common/marketData.json');
const indicesfilePath = path.join(__dirname, '../../data/common/indicesMarketData.json');

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

exports.setIndicesData = async (req, res) => {
    const newFetchedParsed = req.body;
    const uniqueDataMap = new Map();
    const lastFetchedData = await readFile(indicesfilePath);
    newFetchedParsed.forEach((item) => {
        uniqueDataMap.set(item.indexSymbol, item);
    });
    if (lastFetchedData) {
        lastFetchedData.forEach((item) => {
            if (!uniqueDataMap.has(item.indexSymbol)) {
                uniqueDataMap.set(item.indexSymbol, item);
            }
        });
    }
    const newMarketData = Array.from(uniqueDataMap.values())
    fs.writeFile(indicesfilePath, JSON.stringify(newMarketData, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error saving data', error: err });
        }
        res.status(200).json({ message: 'Data saved successfully!' });
    });
};

exports.getIndicesData = async (req, res) => {
    try {
        const indices = await readFile(indicesfilePath);
        const filteredIndices = indices.filter(index => index.indexSymbol === 'NIFTY 50' || index.indexSymbol === 'NIFTY BANK')
        res.status(200).json(filteredIndices);
    } catch (error) {
        res.status(500).json(error);
    }
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