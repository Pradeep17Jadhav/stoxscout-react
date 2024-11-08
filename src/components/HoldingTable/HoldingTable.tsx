import {useCallback, useState} from 'react';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import {formatPrice} from '../../helpers/price';
import {COLUMNS, SORT_ORDER, StockInformation} from '../../types/transaction';
import {DEFAULT_COLUMNS} from '../../types/userPreferences';
import './styles.css';

type Props = {
    stocksInfo: StockInformation[];
    date?: string;
    monthYear?: string;
    year?: string;
    onSort?: (column: DEFAULT_COLUMNS, order: SORT_ORDER, date?: string) => void;
    visibleColumns?: DEFAULT_COLUMNS[];
};
export const HoldingTable = ({stocksInfo, date, monthYear, year, onSort, visibleColumns}: Props) => {
    const [sortedBy, setSortedBy] = useState<DEFAULT_COLUMNS>(DEFAULT_COLUMNS.SYMBOL);
    const [orderBy, setOrderBy] = useState<SORT_ORDER>(SORT_ORDER.DESC);

    const sortByColumn = useCallback(
        (column: DEFAULT_COLUMNS) => {
            if (sortedBy === column) {
                if (orderBy === SORT_ORDER.ASC) {
                    setOrderBy(SORT_ORDER.DESC);
                } else {
                    setOrderBy(SORT_ORDER.ASC);
                }
            } else {
                setSortedBy(column);
                setOrderBy(SORT_ORDER.ASC);
            }
            onSort?.(column, orderBy, date);
        },
        [date, onSort, orderBy, sortedBy]
    );

    const sortBySymbol = useCallback(() => sortByColumn(DEFAULT_COLUMNS.SYMBOL), [sortByColumn]);
    const sortByQuantity = useCallback(() => sortByColumn(DEFAULT_COLUMNS.QUANTITY), [sortByColumn]);
    const sortByAvgPrice = useCallback(() => sortByColumn(DEFAULT_COLUMNS.AVG_PRICE), [sortByColumn]);
    const sortByLTP = useCallback(() => sortByColumn(DEFAULT_COLUMNS.LTP), [sortByColumn]);
    const sortByInvestedValue = useCallback(() => sortByColumn(DEFAULT_COLUMNS.INVESTED_VALUE), [sortByColumn]);
    const sortByCurrentValue = useCallback(() => sortByColumn(DEFAULT_COLUMNS.CURRENT_VALUE), [sortByColumn]);
    const sortByNetPnl = useCallback(() => sortByColumn(DEFAULT_COLUMNS.NET_PNL), [sortByColumn]);
    const sortByNetPnlPercent = useCallback(() => sortByColumn(DEFAULT_COLUMNS.NET_PNL_PERCENT), [sortByColumn]);
    const sortByDayPnl = useCallback(() => sortByColumn(DEFAULT_COLUMNS.DAY_PNL), [sortByColumn]);
    const sortByDayPnlPercent = useCallback(() => sortByColumn(DEFAULT_COLUMNS.DAY_PNL_PERCENT), [sortByColumn]);
    const sortByDayPnlPercentInvestment = useCallback(
        () => sortByColumn(DEFAULT_COLUMNS.DAY_PNL_PERCENT_INV),
        [sortByColumn]
    );
    const sortByMaxDays = useCallback(() => sortByColumn(DEFAULT_COLUMNS.MAX_DAYS), [sortByColumn]);

    const shouldShowColumn = useCallback(
        (column: DEFAULT_COLUMNS) => {
            if (!visibleColumns || visibleColumns?.length === 0) {
                return true;
            }
            return visibleColumns.includes(column);
        },
        [visibleColumns]
    );

    return (
        <TableContainer className="tableContainer" component={Paper} style={{height: '100'}}>
            <Table sx={{minWidth: 100}} aria-label="Portfolio" stickyHeader>
                <TableHead>
                    <TableRow>
                        {shouldShowColumn(DEFAULT_COLUMNS.SYMBOL) && (
                            <TableCell
                                className="tableHeaderCell"
                                sx={{minWidth: 80, maxWidth: 150}}
                                onClick={sortBySymbol}
                            >
                                {COLUMNS[DEFAULT_COLUMNS.SYMBOL]}
                            </TableCell>
                        )}
                        {shouldShowColumn(DEFAULT_COLUMNS.QUANTITY) && (
                            <TableCell className="tableHeaderCell" align="right" onClick={sortByQuantity}>
                                {COLUMNS[DEFAULT_COLUMNS.QUANTITY]}
                            </TableCell>
                        )}
                        {shouldShowColumn(DEFAULT_COLUMNS.AVG_PRICE) && (
                            <TableCell className="tableHeaderCell" align="right" onClick={sortByAvgPrice}>
                                {COLUMNS[DEFAULT_COLUMNS.AVG_PRICE]}
                            </TableCell>
                        )}
                        {shouldShowColumn(DEFAULT_COLUMNS.LTP) && (
                            <TableCell className="tableHeaderCell" align="right" onClick={sortByLTP}>
                                {COLUMNS[DEFAULT_COLUMNS.LTP]}
                            </TableCell>
                        )}
                        {shouldShowColumn(DEFAULT_COLUMNS.INVESTED_VALUE) && (
                            <TableCell className="tableHeaderCell" align="right" onClick={sortByInvestedValue}>
                                {COLUMNS[DEFAULT_COLUMNS.INVESTED_VALUE]}
                            </TableCell>
                        )}
                        {shouldShowColumn(DEFAULT_COLUMNS.CURRENT_VALUE) && (
                            <TableCell className="tableHeaderCell" align="right" onClick={sortByCurrentValue}>
                                {COLUMNS[DEFAULT_COLUMNS.CURRENT_VALUE]}
                            </TableCell>
                        )}
                        {shouldShowColumn(DEFAULT_COLUMNS.NET_PNL) && (
                            <TableCell className="tableHeaderCell" align="right" onClick={sortByNetPnl}>
                                {COLUMNS[DEFAULT_COLUMNS.NET_PNL]}
                            </TableCell>
                        )}
                        {shouldShowColumn(DEFAULT_COLUMNS.NET_PNL_PERCENT) && (
                            <TableCell className="tableHeaderCell" align="right" onClick={sortByNetPnlPercent}>
                                {COLUMNS[DEFAULT_COLUMNS.NET_PNL_PERCENT]}
                            </TableCell>
                        )}
                        {shouldShowColumn(DEFAULT_COLUMNS.DAY_PNL) && (
                            <TableCell className="tableHeaderCell" align="right" onClick={sortByDayPnl}>
                                {COLUMNS[DEFAULT_COLUMNS.DAY_PNL]}
                            </TableCell>
                        )}
                        {shouldShowColumn(DEFAULT_COLUMNS.DAY_PNL_PERCENT) && (
                            <TableCell className="tableHeaderCell" align="right" onClick={sortByDayPnlPercent}>
                                {COLUMNS[DEFAULT_COLUMNS.DAY_PNL_PERCENT]}
                            </TableCell>
                        )}
                        {shouldShowColumn(DEFAULT_COLUMNS.DAY_PNL_PERCENT_INV) && (
                            <TableCell
                                className="tableHeaderCell"
                                align="right"
                                onClick={sortByDayPnlPercentInvestment}
                            >
                                {COLUMNS[DEFAULT_COLUMNS.DAY_PNL_PERCENT_INV]}
                            </TableCell>
                        )}
                        {shouldShowColumn(DEFAULT_COLUMNS.MAX_DAYS) && (
                            <TableCell className="tableHeaderCell" align="right" onClick={sortByMaxDays}>
                                {COLUMNS[DEFAULT_COLUMNS.MAX_DAYS]}
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stocksInfo.map((stockInfo) => (
                        <TableRow
                            key={`${stockInfo.symbol}_${stockInfo.quantity}_${stockInfo.investedValue}`}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            {shouldShowColumn(DEFAULT_COLUMNS.SYMBOL) && (
                                <TableCell component="th" scope="row">
                                    {stockInfo.symbol}
                                </TableCell>
                            )}
                            {shouldShowColumn(DEFAULT_COLUMNS.QUANTITY) && (
                                <TableCell align="right">{stockInfo.quantity}</TableCell>
                            )}
                            {shouldShowColumn(DEFAULT_COLUMNS.AVG_PRICE) && (
                                <TableCell align="right">{formatPrice(stockInfo.avgPrice)}</TableCell>
                            )}
                            {shouldShowColumn(DEFAULT_COLUMNS.LTP) && (
                                <TableCell align="right">{formatPrice(stockInfo.ltp)}</TableCell>
                            )}
                            {shouldShowColumn(DEFAULT_COLUMNS.INVESTED_VALUE) && (
                                <TableCell align="right">{formatPrice(stockInfo.investedValue)}</TableCell>
                            )}
                            {shouldShowColumn(DEFAULT_COLUMNS.CURRENT_VALUE) && (
                                <TableCell align="right">{formatPrice(stockInfo.currentValue)}</TableCell>
                            )}
                            {shouldShowColumn(DEFAULT_COLUMNS.NET_PNL) && (
                                <TableCell className={stockInfo.pnl >= 0 ? 'profit' : 'loss'} align="right">
                                    {formatPrice(stockInfo.pnl)}
                                </TableCell>
                            )}
                            {shouldShowColumn(DEFAULT_COLUMNS.NET_PNL_PERCENT) && (
                                <TableCell className={stockInfo.pnlpercent >= 0 ? 'profit' : 'loss'} align="right">
                                    {stockInfo.pnlpercent?.toFixed(2)}%{' '}
                                </TableCell>
                            )}
                            {shouldShowColumn(DEFAULT_COLUMNS.DAY_PNL) && (
                                <TableCell className={stockInfo.totalDayChange >= 0 ? 'profit' : 'loss'} align="right">
                                    {formatPrice(stockInfo.totalDayChange)}
                                </TableCell>
                            )}
                            {shouldShowColumn(DEFAULT_COLUMNS.DAY_PNL_PERCENT) && (
                                <TableCell
                                    className={stockInfo.percentDayChange >= 0 ? 'profit' : 'loss'}
                                    align="right"
                                >
                                    {formatPrice(stockInfo.percentDayChange)}%{' '}
                                </TableCell>
                            )}
                            {shouldShowColumn(DEFAULT_COLUMNS.DAY_PNL_PERCENT_INV) && (
                                <TableCell
                                    className={stockInfo.percentDayChangeOnInvestment >= 0 ? 'profit' : 'loss'}
                                    align="right"
                                >
                                    {formatPrice(stockInfo.percentDayChangeOnInvestment)}%{' '}
                                </TableCell>
                            )}
                            {shouldShowColumn(DEFAULT_COLUMNS.MAX_DAYS) && (
                                <TableCell align="right">{stockInfo.daysMax}</TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
