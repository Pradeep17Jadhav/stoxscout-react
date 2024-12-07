import {useCallback, useMemo} from 'react';
import dayjs from 'dayjs';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Grid from '@mui/material/Grid/Grid';
import IconButton from '@mui/material/IconButton/IconButton';
import TextField from '@mui/material/TextField/TextField';
import {ClearIcon, DatePicker} from '@mui/x-date-pickers';
import {Holdings, Transaction} from '../../../types/transaction';
import MagnyFireDialog from '../../Dialog/Dialog';
import {useAlert} from '../../../hooks/useAlert';
import './styles.css';

type Props = {
    open: boolean;
    holdings: Holdings;
    activeSymbol: string | null;
    setOpen: (open: boolean) => void;
};

const StockEditor = ({open, setOpen, holdings, activeSymbol}: Props) => {
    const {showSnackBar} = useAlert();
    const holding = useMemo(
        () => holdings.find((holding) => holding.symbol === activeSymbol),
        [activeSymbol, holdings]
    );

    const handleSave = useCallback(() => {
        showSnackBar(
            'Editing your stock purchases feature is still under development. Feel free to provide feedback!',
            'info'
        );
    }, [showSnackBar]);

    const renderRow = (transaction: Transaction) => {
        return (
            <Grid
                key={transaction.avgPrice + transaction.dateAdded + transaction.quantity}
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={12} sm={6} md={3}>
                    <DatePicker
                        className="transaction-item-element"
                        label="Date purchased"
                        value={dayjs(new Date(transaction.dateAdded).toISOString().split('T')[0])}
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
                        value={transaction.quantity}
                        placeholder="5"
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
                        value={transaction.avgPrice}
                        placeholder="1234.55"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <div className="transactionItemRight">
                        <FormControlLabel
                            control={<Checkbox checked={transaction.isIPO} name="isIPO" color="primary" />}
                            label="IPO "
                        />
                        <FormControlLabel
                            control={<Checkbox checked={transaction.isGift} name="isGift" color="primary" />}
                            label="Gift"
                        />
                        <span className="clearTransactionButton">
                            <IconButton size="small" color="error">
                                <ClearIcon />
                            </IconButton>
                        </span>
                    </div>
                </Grid>
            </Grid>
        );
    };

    return activeSymbol ? (
        <MagnyFireDialog
            open={open && !!activeSymbol}
            title="Edit stock purchases"
            rightButtonText="Save"
            onRightButtonClick={handleSave}
            onLeftButtonClick={handleSave}
            setOpen={setOpen}
        >
            <div className="stock-editor">{holding?.transactions.map((transaction) => renderRow(transaction))}</div>
        </MagnyFireDialog>
    ) : (
        <></>
    );
};

export default StockEditor;
