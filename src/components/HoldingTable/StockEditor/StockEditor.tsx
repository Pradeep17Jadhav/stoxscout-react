import React, {useEffect, useState} from 'react';
import {useCallback, useMemo} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Grid from '@mui/material/Grid/Grid';
import IconButton from '@mui/material/IconButton/IconButton';
import TextField from '@mui/material/TextField/TextField';
import RestoreIcon from '@mui/icons-material/Restore';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import {ClearIcon, DatePicker} from '@mui/x-date-pickers';
import {EditableTransaction, Holdings, Transaction} from '../../../types/transaction';
import MagnyFireDialog from '../../Dialog/Dialog';
import {useAlert} from '../../../hooks/useAlert';
import './styles.css';
import {editHolding} from '../../../api/holdingsAPI';
import useHoldingsFetcher from '../../../hooks/useHoldingsFetcher';

type Props = {
    open: boolean;
    holdings: Holdings;
    activeSymbol: string | null;
    setOpen: (open: boolean) => void;
};

const StockEditor = React.memo(
    ({open, setOpen, holdings, activeSymbol}: Props) => {
        const {showSnackBar} = useAlert();
        const {refreshHoldings} = useHoldingsFetcher();
        const [updating, setUpdating] = useState(false);
        const holding = useMemo(
            () => holdings.find((holding) => holding.symbol === activeSymbol),
            [activeSymbol, holdings]
        );
        const [editableTransactions, setEditableTransactions] = useState<EditableTransaction[]>([]);

        const refreshEditableTransactions = useCallback(() => {
            if (!holding) {
                return;
            }
            const newEditableTransactions = holding.transactions.map((transaction) => ({
                transaction: {...transaction},
                deleted: false
            }));
            setEditableTransactions(newEditableTransactions);
        }, [holding]);

        useEffect(() => {
            if (holding) {
                refreshEditableTransactions();
            }
        }, [holding, refreshEditableTransactions]);

        const updatedTransactions = useMemo(() => {
            if (!holding) return;
            return editableTransactions.filter((editableTransaction) => {
                if (editableTransaction.deleted) {
                    return true;
                }
                const updatedTransaction = editableTransaction.transaction;
                const originalTransaction = holding.transactions.find(
                    (originalTransaction) => originalTransaction._id === updatedTransaction._id
                );
                if (!originalTransaction) {
                    return false;
                }
                return !(
                    updatedTransaction.dateAdded === originalTransaction.dateAdded &&
                    updatedTransaction.quantity === originalTransaction.quantity &&
                    updatedTransaction.avgPrice === originalTransaction.avgPrice &&
                    updatedTransaction.isGift === originalTransaction.isGift &&
                    updatedTransaction.isIPO === originalTransaction.isIPO
                );
            });
        }, [editableTransactions, holding]);

        const clearForm = useCallback(() => {
            refreshEditableTransactions();
        }, [refreshEditableTransactions]);

        const handleSave = useCallback(() => {
            if (!holding || !updatedTransactions) {
                return;
            }
            setUpdating(true);
            editHolding(holding.symbol, updatedTransactions)
                .then((result) => {
                    let message = `Updated ${holding.symbol} successfully! Updated ${result.updatedCount} transaction${result.updatedCount === 1 ? '' : 's'} and deleted ${result.deletedCount} transaction${result.deletedCount === 1 ? '' : 's'}.`;
                    if (result.message === 'holding_deleted') {
                        message = `Updated ${holding.symbol} successfully! Removed entire holding of ${holding.symbol} as there are no transactions.`;
                    }
                    showSnackBar(message);
                    clearForm();
                    refreshHoldings();
                    setOpen(false);
                })
                .catch((error) => showSnackBar(error.message || 'Edit failed. Please try again!', 'error'))
                .finally(() => {
                    setUpdating(false);
                });
        }, [clearForm, holding, refreshHoldings, setOpen, showSnackBar, updatedTransactions]);

        const updateTransaction = useCallback(({_id, ...fields}: Partial<Transaction>, deleted?: boolean) => {
            setEditableTransactions((prevEditableTransactions) =>
                prevEditableTransactions.map((editableTransaction) => {
                    const transaction = editableTransaction.transaction;
                    return transaction._id === _id
                        ? {...editableTransaction, transaction: {...transaction, ...fields}, deleted: !!deleted}
                        : editableTransaction;
                })
            );
        }, []);

        const isValidTransaction = useCallback((editableTransaction: EditableTransaction) => {
            const transaction = editableTransaction.transaction;
            return transaction.dateAdded && transaction.quantity && transaction.avgPrice;
        }, []);

        const isValidForm = useMemo(
            () => editableTransactions.length && editableTransactions.every(isValidTransaction),
            [editableTransactions, isValidTransaction]
        );

        const onDateChange = useCallback(
            (_id: string) => (newValue: Dayjs | null) => {
                updateTransaction({_id, dateAdded: newValue?.valueOf()});
            },
            [updateTransaction]
        );
        const onQuantityChange = useCallback(
            (_id: string) => (e: any) => {
                updateTransaction({_id, quantity: parseInt(e.target.value)});
            },
            [updateTransaction]
        );

        const onAvgPriceChange = useCallback(
            (_id: string) => (e: any) => {
                updateTransaction({_id, avgPrice: parseFloat(e.target.value)});
            },
            [updateTransaction]
        );

        const onIsIPOChange = useCallback(
            (_id: string) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                updateTransaction({_id, isIPO: checked});
            },
            [updateTransaction]
        );

        const onIsGiftChange = useCallback(
            (_id: string) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                updateTransaction({_id, isGift: checked});
            },
            [updateTransaction]
        );

        const removeTransactionHandler = useCallback(
            (_id: string, deleted?: boolean) => () => {
                updateTransaction({_id}, !deleted);
            },
            [updateTransaction]
        );

        const renderRow = (editableTransaction: EditableTransaction) => {
            const transaction = editableTransaction.transaction;
            return (
                <Grid key={transaction._id} container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <DatePicker
                            className="transaction-item-element"
                            label="Date purchased"
                            value={
                                transaction.dateAdded
                                    ? dayjs(new Date(transaction.dateAdded).toLocaleString().split(',')[0])
                                    : null
                            }
                            format="DD/MM/YYYY"
                            onChange={onDateChange(transaction._id)}
                            disabled={editableTransaction.deleted}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: !transaction.dateAdded,
                                    helperText: !transaction.dateAdded ? 'Incorrect date' : ''
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            className="transaction-item-element"
                            label="Quantity"
                            variant="outlined"
                            type="number"
                            value={transaction.quantity ?? ''}
                            placeholder="5"
                            fullWidth
                            onChange={onQuantityChange(transaction._id)}
                            error={!transaction.quantity || !Number(transaction.quantity)}
                            helperText={
                                !transaction.quantity || !Number(transaction.quantity) ? 'Enter correct quantity' : ''
                            }
                            disabled={editableTransaction.deleted}
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
                            value={transaction.avgPrice ?? ''}
                            placeholder="1234.55"
                            onChange={onAvgPriceChange(transaction._id)}
                            error={!transaction.avgPrice || !Number(transaction.avgPrice)}
                            helperText={
                                !transaction.avgPrice || !Number(transaction.avgPrice) ? 'Enter correct price' : ''
                            }
                            disabled={editableTransaction.deleted}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <div className="transactionItemRight">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={transaction.isIPO}
                                        name="isIPO"
                                        color="primary"
                                        onChange={onIsIPOChange(transaction._id)}
                                    />
                                }
                                disabled={editableTransaction.deleted}
                                label="IPO"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={transaction.isGift}
                                        name="isGift"
                                        color="primary"
                                        onChange={onIsGiftChange(transaction._id)}
                                    />
                                }
                                disabled={editableTransaction.deleted}
                                label="Gift"
                            />
                            <span className="clearTransactionButton">
                                <Tooltip
                                    title={editableTransaction.deleted ? 'Restore transaction' : 'Remove transaction'}
                                >
                                    <IconButton
                                        size="small"
                                        color={editableTransaction.deleted ? 'success' : 'error'}
                                        onClick={removeTransactionHandler(transaction._id, editableTransaction.deleted)}
                                    >
                                        {editableTransaction.deleted ? <RestoreIcon /> : <ClearIcon />}
                                    </IconButton>
                                </Tooltip>
                            </span>
                        </div>
                    </Grid>
                </Grid>
            );
        };

        return activeSymbol ? (
            <MagnyFireDialog
                open={open && !!activeSymbol}
                title={activeSymbol}
                rightButtonText="Save"
                onRightButtonClick={handleSave}
                onLeftButtonClick={clearForm}
                setOpen={setOpen}
                leftButtonDisabled={updating}
                rightButtonDisabled={!isValidForm || updating || !updatedTransactions?.length}
                loading={updating}
            >
                <div className="stock-editor">{editableTransactions.map((transaction) => renderRow(transaction))}</div>
            </MagnyFireDialog>
        ) : (
            <></>
        );
    },
    (prevProps, nextProps) => {
        return prevProps.open === nextProps.open;
    }
);
StockEditor.displayName = 'StockEditor';
export default StockEditor;
