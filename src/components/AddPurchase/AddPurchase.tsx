import {Alert, Button, Checkbox, FormControlLabel, Snackbar, TextField} from '@mui/material';
import {useCallback, useMemo, useState} from 'react';
import {addPurchase} from '../../api/holdingsAPI';
import './styles.css';

export const AddPurchase = () => {
    const [saving, setSaving] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [symbol, setSymbol] = useState('');
    const [dateAdded, setDateAdded] = useState('');
    const [quantity, setQuantity] = useState('');
    const [avgPrice, setAvgPrice] = useState('');
    const [isIPO, setIsIPO] = useState(false);
    const [isGift, setIsGift] = useState(false);

    const isValidForm = useMemo(() => {
        return symbol !== '' && dateAdded !== '' && quantity !== '' && avgPrice !== '';
    }, [symbol, dateAdded, quantity, avgPrice]);

    const clearForm = useCallback(() => {
        setSymbol('');
        setDateAdded('');
        setQuantity('');
        setAvgPrice('');
    }, []);

    const handleAddMore = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setSaving(true);
            addPurchase({
                symbol: symbol.toUpperCase(),
                dateAdded: new Date(dateAdded).getTime(),
                quantity: parseInt(quantity),
                avgPrice: avgPrice.replace(/,/g, ''),
                isGift,
                isIPO
            })
                .then(() => setSnackMessage('Purchase added successfully!'))
                .catch(() => setSnackMessage('Purchase saving failed. Please try again!'))
                .finally(() => {
                    setSaving(false);
                    setSnackbarOpen(true);
                });
        },
        [avgPrice, dateAdded, isGift, isIPO, quantity, symbol]
    );

    const handleSnackbarClose = useCallback(() => {
        setSnackbarOpen(false);
    }, []);

    const onSymbolChange = useCallback((e: any) => setSymbol(e.target.value.toUpperCase()), []);
    const onDateAddedChange = useCallback((e: any) => setDateAdded(e.target.value), []);
    const onQuantityChange = useCallback((e: any) => setQuantity(e.target.value), []);
    const onAvgPriceChange = useCallback((e: any) => setAvgPrice(e.target.value), []);
    const onIsIPOChange = useCallback(() => setIsIPO((isIPO) => !isIPO), []);
    const onIsGiftChange = useCallback(() => () => setIsGift((isGift) => !isGift), []);

    return (
        <form onSubmit={handleAddMore}>
            <div className="addPurchase">
                <TextField
                    label="Symbol"
                    variant="outlined"
                    value={symbol}
                    onChange={onSymbolChange}
                    placeholder="IRCTC"
                />
                <TextField
                    label="Date Added"
                    variant="outlined"
                    type="text"
                    value={dateAdded}
                    placeholder="2024-10-25"
                    onChange={onDateAddedChange}
                />
                <TextField
                    label="Quantity"
                    variant="outlined"
                    type="number"
                    value={quantity}
                    placeholder="5"
                    onChange={onQuantityChange}
                />
                <TextField
                    label="Average Price"
                    variant="outlined"
                    type="number"
                    value={avgPrice}
                    placeholder="1234.55"
                    onChange={onAvgPriceChange}
                />
                <FormControlLabel
                    control={<Checkbox checked={isIPO} onChange={onIsIPOChange} name="isIPO" color="primary" />}
                    label="Allotted in IPO "
                />
                <FormControlLabel
                    control={<Checkbox checked={isGift} onChange={onIsGiftChange} name="isGift" color="primary" />}
                    label="Received as a gift"
                />
                <Button type="submit" variant="contained" disabled={!isValidForm || saving}>
                    {saving ? 'Saving...' : 'Add Purchase'}
                </Button>
                <Button variant="contained" onClick={clearForm} disabled={saving}>
                    Clear
                </Button>
            </div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={handleSnackbarClose} severity="success" variant="filled" sx={{width: '100%'}}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        </form>
    );
};
