import React, {useCallback, useState} from 'react';
import * as XLSX from 'xlsx';
import {Button, Typography} from '@mui/material';
import {bulkAddHoldings} from '../../api/holdingsAPI';
import {Purchase} from '../../types/purchase';
import useHoldingsFetcher from '../../hooks/useHoldingsFetcher';
import {useAlert} from '../../hooks/useAlert';
import './styles.css';

const HoldingsUploader = () => {
    const [processing, setProcessing] = useState(false);
    const {refreshHoldings} = useHoldingsFetcher();
    const {showSnackBar, showLinearProcess, hideLinearProcess} = useAlert();

    const processSheetData = useCallback(
        async (data: any[]) => {
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
                showSnackBar('Error processing the file. Please check if contains valid holding details.', 'error');
                setProcessing(false);
                hideLinearProcess(false);
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
                        symbol: symbol.trim().toUpperCase().split('-')[0],
                        quantity: parseInt(quantity, 10),
                        avgPrice,
                        dateAdded: new Date().getTime()
                    };

                    newHoldings.push(purchase);
                }
            }
            try {
                if (newHoldings.length) {
                    await bulkAddHoldings(newHoldings);
                    showSnackBar(
                        `Success! Total ${newHoldings.length} holdings added to your portfolio. Visit Portfolio to view updated holdings.`
                    );
                    refreshHoldings();
                    hideLinearProcess();
                    setProcessing(false);
                    return;
                } else {
                    showSnackBar('There are no holdings in your file to add.');
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    showSnackBar(err.message, 'error');
                }
            }
            hideLinearProcess(false);
            setProcessing(false);
        },
        [hideLinearProcess, refreshHoldings, showSnackBar]
    );

    const handleFileChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setProcessing(true);
            showLinearProcess();
            const file = event.target.files?.[0];
            if (!file) {
                showSnackBar('No file selected.', 'error');
                setProcessing(false);
                hideLinearProcess(false);
                return;
            }
            if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                showSnackBar('Please upload a valid .xlsx file.', 'error');
                setProcessing(false);
                hideLinearProcess(false);
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
                    showSnackBar('Error processing the file. Please check if contains valid holding details.', 'error');
                    setProcessing(false);
                    hideLinearProcess(false);
                }
            };
            reader.onerror = () => {
                showSnackBar('Error reading the file. Please try again.', 'error');
                setProcessing(false);
                hideLinearProcess(false);
            };
            reader.readAsArrayBuffer(file);
        },
        [processSheetData, hideLinearProcess, showLinearProcess, showSnackBar]
    );

    return (
        <div className="elevated-container">
            <div className="holding-uploader-points">
                <Typography variant="body1" gutterBottom>
                    {'1. Go to '}
                    <a href="https://console.zerodha.com/portfolio/holdings" target="_blank" rel="noreferrer">
                        {'https://console.zerodha.com/portfolio/holdings'}
                    </a>{' '}
                    and login to your Zerodha account
                    <br /> 2. Click on &quot;Download: XLSX&quot; link (just above the holdings table)
                    <br /> 3. Save the file on you computer. This file contains info of your holdings on Zerodha
                    <br /> 4. Come back to this page
                    <br /> 5. Click on the Select XLSX File button and select the file you just downloaded.
                    <br /> 6. Sit back and relax! You file is NOT uploaded to our server. Only the data related to your
                    holdings is sent.
                </Typography>
            </div>
            <input type="file" accept=".xlsx" onInput={handleFileChange} style={{display: 'none'}} id="file-upload" />
            <label htmlFor="file-upload">
                <Button className="primary-button" variant="contained" component="span">
                    {processing ? 'Processing the file...' : 'Select XLSX File'}
                </Button>
            </label>
        </div>
    );
};

export default HoldingsUploader;
