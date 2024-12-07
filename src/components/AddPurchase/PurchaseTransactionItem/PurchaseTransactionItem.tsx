import {useCallback} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import TextField from '@mui/material/TextField/TextField';
import {DatePicker} from '@mui/x-date-pickers/DatePicker/DatePicker';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton/IconButton';
import {LocalPurchaseTransaction} from '../../../types/purchase';
import './styles.css';
import Grid from '@mui/material/Grid/Grid';

type Props = {
    localPurchaseTransaction: LocalPurchaseTransaction;
    updateTransaction: ({dateAdded, quantity, avgPrice, isGift, isIPO}: Partial<LocalPurchaseTransaction>) => void;
    removeTransaction: () => void;
};

const PurchaseTransactionItem = ({localPurchaseTransaction, updateTransaction, removeTransaction}: Props) => {
    const onDateChange = useCallback(
        (newValue: Dayjs | null) =>
            updateTransaction({dateAdded: newValue || dayjs(new Date().toISOString().split('T')[0])}),
        [updateTransaction]
    );
    const onQuantityChange = useCallback(
        (e: any) => updateTransaction({quantity: e.target.value}),
        [updateTransaction]
    );
    const onAvgPriceChange = useCallback(
        (e: any) => updateTransaction({avgPrice: e.target.value}),
        [updateTransaction]
    );
    const onIsIPOChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => updateTransaction({isIPO: checked}),
        [updateTransaction]
    );
    const onIsGiftChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => updateTransaction({isGift: checked}),
        [updateTransaction]
    );

    return (
        <div className="transaction-container">
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                    <DatePicker
                        className="transaction-item-element"
                        label="Date purchased"
                        value={localPurchaseTransaction.dateAdded}
                        onChange={onDateChange}
                        format="DD/MM/YYYY"
                        slotProps={{
                            textField: {fullWidth: true}
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        className="transaction-item-element"
                        label="Quantity"
                        variant="outlined"
                        type="number"
                        value={localPurchaseTransaction.quantity}
                        placeholder="5"
                        onChange={onQuantityChange}
                        fullWidth
                        InputProps={{
                            inputProps: {
                                min: 0
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        className="transaction-item-element"
                        label="Average Price"
                        variant="outlined"
                        type="number"
                        value={localPurchaseTransaction.avgPrice}
                        placeholder="1234.55"
                        onChange={onAvgPriceChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <div className="transactionItemRight">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={localPurchaseTransaction.isIPO}
                                    onChange={onIsIPOChange}
                                    name="isIPO"
                                    color="primary"
                                />
                            }
                            label="IPO"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={localPurchaseTransaction.isGift}
                                    onChange={onIsGiftChange}
                                    name="isGift"
                                    color="primary"
                                />
                            }
                            label="Gift"
                        />
                        <span className="clearTransactionButton">
                            <IconButton size="small" color="error" onClick={removeTransaction}>
                                <ClearIcon />
                            </IconButton>
                        </span>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default PurchaseTransactionItem;
