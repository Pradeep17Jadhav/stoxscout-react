const fs = require('fs');
const path = require('path');

const holdingsPath = path.join(
    __dirname,
    '../data/pradeepjadhav/holdings.json'
);

const readHoldings = async () => 
{
    return new Promise((resolve, reject) => 
    {
        fs.readFile(holdingsPath, 'utf8', (err, data) => 
        {
            if (err) 
            {
                return reject({ error: 'Error reading file' });
            }
            try 
            {
                const holdings = JSON.parse(data);
                resolve(holdings);
            }
            catch (parseErr) 
            {
                reject({ error: 'Error parsing JSON' });
            }
        });
    });
};

exports.getHoldings = async (req, res) => 
{
    try 
    {
        const holdings = await readHoldings();
        res.json(holdings);
    }
    catch (error) 
    {
        res.status(500).json(error);
    }
};

exports.addPurchase = async (req, res) => 
{
    const jsonData = req.body;
    try 
    {
        const holdings = await readHoldings();
        res.json(holdings);
    }
    catch (error) 
    {
        res.status(500).json(error);
    }
    fs.writeFile(holdingsPath, JSON.stringify(jsonData, null, 2), (err) => 
    {
        if (err) 
        {
            return res.status(500).json({ message: 'Error saving data', error: err });
        }
        res.status(200).json({ message: 'Data saved successfully!' });
    });
};
