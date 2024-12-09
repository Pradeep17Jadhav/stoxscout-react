import {useCallback, useEffect, useMemo, useState} from 'react';
import dayjs from 'dayjs';
import {Autocomplete, AutocompleteRenderInputParams, Button, TextField} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {bulkAddHoldings} from '../../api/holdingsAPI';
import {useAlert} from '../../hooks/useAlert';
import {getHoldingsList} from '../../api/marketAPI';
import {LocalPurchaseTransaction, LocalPurchase, Purchase} from '../../types/purchase';
import PurchaseTransactionItem from './PurchaseTransactionItem/PurchaseTransactionItem';
import {getDefaultLocalPurchase} from './helper';
import {generateRandomNumericId} from '../../helpers/utils';
import './styles.css';

export const AddPurchase = () => {
    const {showSnackBar, showLinearProcess, hideLinearProcess} = useAlert();
    const [saving, setSaving] = useState(false);
    const [symbol, setSymbol] = useState('');
    const [holdingList, setHoldingList] = useState<string[]>([]);
    const [localPurchase, setLocalPurchase] = useState<LocalPurchase>(getDefaultLocalPurchase());

    const removeTransaction = useCallback(
        (id: number) => () => {
            setLocalPurchase((prevPurchase) => {
                return {
                    ...prevPurchase,
                    transactions: prevPurchase.transactions.filter((transaction) => {
                        return transaction.id !== id;
                    })
                };
            });
        },
        []
    );

    const updateTransaction = useCallback(
        (id: number) =>
            ({dateAdded, quantity, avgPrice, isGift, isIPO}: Partial<LocalPurchaseTransaction>) => {
                setLocalPurchase((prevPurchase) => {
                    return {
                        ...prevPurchase,
                        transactions: prevPurchase.transactions.map((transaction) => {
                            const updatedPurchase = {
                                ...transaction,
                                ...(dateAdded === undefined ? {} : {dateAdded}),
                                ...(quantity === undefined ? {} : {quantity}),
                                ...(avgPrice === undefined ? {} : {avgPrice}),
                                ...(isGift === undefined ? {} : {isGift}),
                                ...(isIPO === undefined ? {} : {isIPO})
                            };
                            return transaction.id === id ? updatedPurchase : transaction;
                        })
                    };
                });
            },
        []
    );

    const addLocalTransaction = useCallback(() => {
        const newTransaction = {
            id: generateRandomNumericId(),
            dateAdded: dayjs(new Date().toISOString().split('T')[0]),
            quantity: '',
            avgPrice: '',
            isGift: false,
            isIPO: false
        };
        setLocalPurchase((prevPurchase) => {
            return {
                ...prevPurchase,
                transactions: [...prevPurchase.transactions, newTransaction]
            };
        });
    }, []);

    const isLastTransactionUnedited = useCallback(() => {
        const len = localPurchase.transactions.length;
        const lastTransaction = localPurchase.transactions[len - 1];
        const defaultTransaction = getDefaultLocalPurchase().transactions[0];
        return (
            lastTransaction.avgPrice === defaultTransaction.avgPrice &&
            lastTransaction.quantity === defaultTransaction.quantity &&
            lastTransaction.dateAdded.toISOString() === defaultTransaction.dateAdded.toISOString() &&
            lastTransaction.isGift === defaultTransaction.isGift &&
            lastTransaction.isIPO === defaultTransaction.isIPO
        );
    }, [localPurchase.transactions]);

    const isValidTransaction = useCallback(
        (transaction: LocalPurchaseTransaction) =>
            transaction.dateAdded?.isValid() && transaction.quantity !== '' && transaction.avgPrice !== '',
        []
    );

    const isValidForm = useMemo(
        () =>
            symbol !== '' && localPurchase.transactions.length && localPurchase.transactions.every(isValidTransaction),
        [isValidTransaction, localPurchase.transactions, symbol]
    );

    const handleAddMore = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!isValidForm) {
                return;
            }
            setSaving(true);
            showLinearProcess();
            const newSymbol = symbol.trim().toUpperCase().split('-')[0];
            if (!holdingList.includes(newSymbol)) {
                setHoldingList((holdingList) => [...holdingList, newSymbol]);
            }

            const newPurchases: Purchase[] = [];
            localPurchase.transactions.forEach((transaction) => {
                newPurchases.push({
                    symbol: newSymbol,
                    dateAdded: transaction.dateAdded.valueOf(),
                    quantity: parseInt(transaction.quantity),
                    avgPrice: transaction.avgPrice.replace(/,/g, ''),
                    isGift: transaction.isGift,
                    isIPO: transaction.isIPO
                });
            });
            bulkAddHoldings(newPurchases)
                .then(() => {
                    showSnackBar(
                        `Purchase of ${newSymbol} with ${newPurchases.length} transactions added successfully!`
                    );
                    hideLinearProcess();
                    setLocalPurchase(getDefaultLocalPurchase());
                })
                .catch(() => {
                    showSnackBar('Purchase saving failed. Please try again!', 'error');
                    hideLinearProcess(false);
                })
                .finally(() => {
                    setSaving(false);
                });
        },
        [
            hideLinearProcess,
            holdingList,
            isValidForm,
            localPurchase.transactions,
            showLinearProcess,
            showSnackBar,
            symbol
        ]
    );

    const onSymbolChange = useCallback(
        (_: unknown, newValue: string | null) => setSymbol(newValue ? newValue.toUpperCase().trim() : ''),
        []
    );

    const onSymbolInput = useCallback((e: any) => setSymbol(e.target.value.toUpperCase().trim()), []);

    const createRowsFromPaste = useCallback(
        (validatedRows: string[][]) => {
            const isLastUnedited = isLastTransactionUnedited();
            if (isLastUnedited && validatedRows.length) {
                const lastTransactionId = localPurchase.transactions[localPurchase.transactions.length - 1].id;
                removeTransaction(lastTransactionId)();
            }
            validatedRows.forEach((row: string[]) => {
                const newTransaction = {
                    id: generateRandomNumericId(),
                    dateAdded: dayjs(new Date(row[0]).toISOString().split('T')[0]),
                    quantity: row[1],
                    avgPrice: row[2],
                    isGift: false,
                    isIPO: false
                };
                setLocalPurchase((prevPurchase) => {
                    return {
                        ...prevPurchase,
                        transactions: [...prevPurchase.transactions, newTransaction]
                    };
                });
            });
        },
        [isLastTransactionUnedited, localPurchase.transactions, removeTransaction]
    );

    const onPaste = useCallback(
        (e: ClipboardEvent) => {
            const clipboardData = e.clipboardData?.getData('Text');
            if (clipboardData) {
                const rows = clipboardData.split('\n').map((row) => row.replace(/\r$/, ''));
                const validatedRows = rows
                    .map((row) => {
                        const rawColumns = row.split('\t').map((column) => column.trim());
                        const columns = rawColumns.map((column) => column.replace(/,/g, ''));
                        if (columns.length === 1 && holdingList.includes(columns[0].trim())) {
                            setSymbol(columns[0].trim());
                            return null;
                        }
                        if (columns.length !== 5) {
                            return null;
                        }
                        const [dateAdded, quantity, price, age, pnl] = columns;
                        const isValidDate = !isNaN(Date.parse(dateAdded));
                        if (!isValidDate) {
                            return null;
                        }
                        const isValidInt = Number.isInteger(Number(quantity));
                        if (!isValidInt) {
                            return null;
                        }
                        const isValidNum = (numStr: string) => {
                            const num = Number(numStr);
                            return !isNaN(num) && (num === parseInt(numStr, 10) || num === parseFloat(numStr));
                        };
                        if (![price, age, pnl].every(isValidNum)) {
                            return null;
                        }
                        return columns.slice(0, 3);
                    })
                    .filter((row): row is string[] => row !== null);
                createRowsFromPaste(validatedRows);
            }
        },
        [createRowsFromPaste, holdingList]
    );

    const renderSymbolTextInput = useCallback(
        (params: AutocompleteRenderInputParams) => <TextField {...params} label="Symbol" onInput={onSymbolInput} />,
        [onSymbolInput]
    );

    useEffect(() => {
        getHoldingsList()
            .then((stockList: any) => setHoldingList(stockList.nse))
            .catch(() => {
                showSnackBar('Cannot load stock list. Please add your stock name manually.', 'error');
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        document.addEventListener('paste', onPaste);
        return () => {
            document.removeEventListener('paste', onPaste);
        };
    }, [onPaste]);

    return (
        <div className="elevated-container addPurchase-container">
            <h2>Add Purchase</h2>
            <form className="add-purchase-form" onSubmit={handleAddMore}>
                <Autocomplete
                    className="symbol-autocomplete"
                    freeSolo
                    disablePortal
                    options={holdingList}
                    value={symbol}
                    onChange={onSymbolChange}
                    renderInput={renderSymbolTextInput}
                />
                {localPurchase.transactions.map((transaction) => (
                    <PurchaseTransactionItem
                        key={transaction.id}
                        localPurchaseTransaction={transaction}
                        updateTransaction={updateTransaction(transaction.id)}
                        removeTransaction={removeTransaction(transaction.id)}
                    />
                ))}

                <Button
                    className="secondary-button center"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addLocalTransaction}
                    sx={{width: 'auto'}}
                >
                    Add Transaction
                </Button>
                <Button
                    className="primary-button center"
                    type="submit"
                    variant="contained"
                    disabled={!isValidForm || saving}
                    sx={{width: 'auto'}}
                >
                    {saving ? 'Saving...' : 'Add Purchase'}
                </Button>
            </form>
        </div>
    );
};
