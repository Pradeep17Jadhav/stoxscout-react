import {Button, FormControlLabel, Radio, RadioGroup, SelectChangeEvent, TextField} from '@mui/material';
import {useMemo, useState} from 'react';
import './styles.css';
import {Purchase} from '../../types/purchase';
import {addPurchase} from '../../api/userHoldings';

export const AddPurchase = () => {
    const [symbol, setSymbol] = useState('');
    const [dateAdded, setDateAdded] = useState('');
    const [quantity, setQuantity] = useState('');
    const [avgPrice, setAvgPrice] = useState('');
    const [exchange, setExchange] = useState('NSE');

    const isValidForm = useMemo(() => {
        return symbol !== '' && dateAdded !== '' && quantity !== '' && avgPrice !== '' && exchange !== '';
    }, [symbol, dateAdded, quantity, avgPrice, exchange]);

    const handleAddMore = (event: any) => {
        event.preventDefault();
        addPurchase({
            symbol: symbol.toUpperCase(),
            dateAdded: new Date(dateAdded).getTime(),
            quantity: parseInt(quantity),
            avgPrice: avgPrice.replace(/,/g, ''),
            exchange
        });
        setSymbol('');
        setDateAdded('');
        setQuantity('');
        setAvgPrice('');
    };

    return (
        <form onSubmit={handleAddMore}>
            <div className="addPurchase">
                <TextField
                    label="Symbol"
                    variant="outlined"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    placeholder="IRCTC"
                />
                <TextField
                    label="Date Added"
                    variant="outlined"
                    type="text"
                    value={dateAdded}
                    placeholder="2024-10-25"
                    onChange={(e) => setDateAdded(e.target.value)}
                />
                <TextField
                    label="Quantity"
                    variant="outlined"
                    type="number"
                    value={quantity}
                    placeholder="5"
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <TextField
                    label="Average Price"
                    variant="outlined"
                    type="number"
                    value={avgPrice}
                    placeholder="1234.55"
                    onChange={(e) => setAvgPrice(e.target.value)}
                />
                <RadioGroup
                    value={exchange}
                    onChange={(event: SelectChangeEvent) => setExchange((event.target as HTMLInputElement).value)}
                >
                    <FormControlLabel value="NSE" control={<Radio />} label="NSE" />
                    <FormControlLabel value="BSE" control={<Radio />} label="BSE" />
                </RadioGroup>
                <Button type="submit" variant="contained" disabled={!isValidForm}>
                    Add Purchase
                </Button>
            </div>
        </form>
    );
};
