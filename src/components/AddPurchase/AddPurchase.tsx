import {useCallback, useEffect, useMemo, useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Button,
    Checkbox,
    FormControlLabel,
    TextField
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {addPurchase} from '../../api/holdingsAPI';
import {useAlert} from '../../hooks/useAlert';
import {getHoldingsList} from '../../api/marketAPI';
import './styles.css';

export const AddPurchase = () => {
    const {showSnackBar} = useAlert();
    const [saving, setSaving] = useState(false);
    const [symbol, setSymbol] = useState('');
    const [holdingList, setHoldingList] = useState<string[]>([]);
    const [quantity, setQuantity] = useState('');
    const [avgPrice, setAvgPrice] = useState('');
    const [isIPO, setIsIPO] = useState(false);
    const [isGift, setIsGift] = useState(false);
    const [dateAdded, setDateAdded] = useState<Dayjs | null>(dayjs(new Date().toISOString().split('T')[0]));

    useEffect(() => {
        getHoldingsList()
            .then((stockList: any) => setHoldingList(stockList.nse))
            .catch(() => {
                showSnackBar('Cannot load stock list. Please add your stock name manually.', 'error');
            });
    }, [showSnackBar]);

    const isValidForm = useMemo(() => {
        return symbol !== '' && dateAdded?.isValid() && quantity !== '' && avgPrice !== '';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbol, dateAdded, quantity, avgPrice, isIPO, isGift]);

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
            const newSymbol = symbol.toUpperCase();
            if (!holdingList.includes(newSymbol)) {
                setHoldingList((holdingList) => [...holdingList, newSymbol]);
            }
            addPurchase({
                symbol: newSymbol,
                dateAdded: dateAdded?.valueOf() ?? new Date().getTime(),
                quantity: parseInt(quantity),
                avgPrice: avgPrice.replace(/,/g, ''),
                isGift,
                isIPO
            })
                .then(() => showSnackBar('Purchase added successfully!'))
                .catch(() => showSnackBar('Purchase saving failed. Please try again!', 'error'))
                .finally(() => {
                    setSaving(false);
                });
        },
        [avgPrice, dateAdded, holdingList, isGift, isIPO, quantity, showSnackBar, symbol]
    );

    const onSymbolChange = useCallback(
        (_: unknown, newValue: string | null) => setSymbol(newValue ? newValue.toUpperCase().trim() : ''),
        []
    );

    const onSymbolInput = useCallback((e: any) => setSymbol(e.target.value.toUpperCase().trim()), []);
    const onQuantityChange = useCallback((e: any) => setQuantity(e.target.value), []);
    const onAvgPriceChange = useCallback((e: any) => setAvgPrice(e.target.value), []);
    const onDateChange = useCallback((newValue: Dayjs | null) => setDateAdded(newValue), []);
    const onIsIPOChange = useCallback(() => setIsIPO((isIPO) => !isIPO), []);
    const onIsGiftChange = useCallback(() => () => setIsGift((isGift) => !isGift), []);

    const renderSymbolTextInput = useCallback(
        (params: AutocompleteRenderInputParams) => <TextField {...params} label="Symbol" onInput={onSymbolInput} />,
        [onSymbolInput]
    );

    return (
        <div className="add-holdings-container">
            <form onSubmit={handleAddMore}>
                <div className="addPurchase-container">
                    <Autocomplete
                        className="symbol-autocomplete"
                        freeSolo
                        disablePortal
                        options={holdingList}
                        value={symbol}
                        onChange={onSymbolChange}
                        renderInput={renderSymbolTextInput}
                    />
                    <DatePicker label="Date purchased" value={dateAdded} onChange={onDateChange} />
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
            </form>
        </div>
    );
};
