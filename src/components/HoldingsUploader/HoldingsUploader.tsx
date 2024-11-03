import React, {useState} from 'react';
import * as XLSX from 'xlsx';
import {Button, Typography, Box} from '@mui/material';
import {uploadHoldings} from '../../api/holdingsAPI';
import {useNavigate} from 'react-router-dom';
import {Purchase} from '../../types/purchase';

const HoldingsUploader = () => {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setError('No file selected.');
            return;
        }
        if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            setError('Please upload a valid .xlsx file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, {type: 'array'});
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                processSheetData(jsonData);
            } catch (error) {
                setError('Error processing the file. Please check its content.');
            }
        };
        reader.onerror = () => {
            setError('Error reading the file. Please try again.');
        };
        reader.readAsArrayBuffer(file);
    };

    const processSheetData = async (data: any[]) => {
        let headers: string[] = [];
        let startRow = -1;
        for (let i = 0; i < data.length; i++) {
            if (data[i][0] === 'Symbol') {
                headers = data[i] as string[];
                startRow = i + 1;
                break;
            }
        }
        if (startRow === -1) {
            alert('No valid header row found.');
            return;
        }

        const symbolIndex = headers.indexOf('Symbol');
        const quantityIndex = headers.indexOf('Quantity Available');
        const avgPriceIndex = headers.indexOf('Average Price');
        const newHoldings: Purchase[] = [];

        for (let i = startRow; i < data.length; i++) {
            const row = data[i];
            if (row.every((cell: any) => cell === undefined || cell === null || cell === '')) {
                break;
            }
            const symbol = row[symbolIndex];
            const quantity = row[quantityIndex];
            const avgPrice = row[avgPriceIndex];

            if (symbol && quantity !== undefined && avgPrice !== undefined) {
                const purchase: Purchase = {
                    symbol: symbol.trim().toUpperCase(),
                    quantity: parseInt(quantity, 10),
                    avgPrice,
                    dateAdded: new Date().getTime()
                };

                newHoldings.push(purchase);
            }
        }
        try {
            if (newHoldings.length) {
                await uploadHoldings(newHoldings);
                setError('Holdings added successfully, redirecting back to dashboard in 5 seconds!');
                setTimeout(() => navigate('/'), 5000);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
    };

    return (
        <Box sx={{padding: 2}}>
            <Typography variant="h6" gutterBottom>
                {'1. Go to '}
                <a href="https://console.zerodha.com/portfolio/holdings" target="_blank">
                    {'https://console.zerodha.com/portfolio/holdings'}
                </a>{' '}
                and login to your Zerodha account
                <br /> 2. Click on "Download: XLSX" link (just above the holdings table)
                <br /> 3. Save the file on you computer. This file contains info of your holdings on Zerodha
                <br /> 4. Come back to this page
                <br /> 5. Click on the Select files button and select the file you just download
                <br /> 6. Sit back and relax! You file is NOT uploaded to our server. Just the data of your holdings is
                sent.
            </Typography>
            <input type="file" accept=".xlsx" onChange={handleFileChange} style={{display: 'none'}} id="file-upload" />
            <label htmlFor="file-upload">
                <Button variant="contained" component="span">
                    Select XLSX File
                </Button>
            </label>
            {error && (
                <div>
                    {error.split('. ').map((errMsg, index) => (
                        <Typography key={index} color="error">
                            {errMsg}
                        </Typography>
                    ))}
                </div>
            )}
        </Box>
    );
};

export default HoldingsUploader;
