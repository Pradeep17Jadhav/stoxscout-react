import {useCallback, useMemo, useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import {Alert, Button, Checkbox, FormControlLabel, Snackbar, TextField} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {addPurchase} from '../../api/holdingsAPI';
import './styles.css';

export const AddPurchase = () => {
    const [saving, setSaving] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [avgPrice, setAvgPrice] = useState('');
    const [isIPO, setIsIPO] = useState(false);
    const [isGift, setIsGift] = useState(false);
    const [dateAdded, setDateAdded] = useState<Dayjs | null>(dayjs(new Date().toISOString().split('T')[0]));

    const isValidForm = useMemo(() => {
        return symbol !== '' && dateAdded?.isValid() && quantity !== '' && avgPrice !== '';
    }, [symbol, dateAdded, quantity, avgPrice]);

    const clearForm = useCallback(() => {
        setSymbol('');
        setDateAdded(dayjs(new Date().toISOString().split('T')[0]));
        setQuantity('');
        setAvgPrice('');
    }, []);

    const handleAddMore = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setSaving(true);
            console.log(dateAdded?.valueOf());
            addPurchase({
                symbol: symbol.toUpperCase(),
                dateAdded: dateAdded?.valueOf() ?? new Date().getTime(),
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
    const onQuantityChange = useCallback((e: any) => setQuantity(e.target.value), []);
    const onAvgPriceChange = useCallback((e: any) => setAvgPrice(e.target.value), []);
    const onDateChange = useCallback((newValue: Dayjs | null) => setDateAdded(newValue), []);
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
                <DatePicker label="Controlled picker" value={dateAdded} onChange={onDateChange} />
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
