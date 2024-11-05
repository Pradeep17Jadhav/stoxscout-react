import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import {formatPrice} from '../../helpers/price';
import {COLUMNS, Sort_Order, StockInformation} from '../../types/transaction';
import './styles.css';
import {useCallback, useState} from 'react';

type Props = {
    stocksInfo: StockInformation[];
    date?: string;
    monthYear?: string;
    year?: string;
    onSort?: (column: string, order: Sort_Order, date?: string) => void;
};
export const HoldingTable = ({stocksInfo, date, monthYear, year, onSort}: Props) => {
    const [sortedBy, setSortedBy] = useState<string>(COLUMNS.SYMBOL);
    const [orderBy, setOrderBy] = useState<Sort_Order>(Sort_Order.DESC);

    const sortByColumn = useCallback(
        (column: string) => {
            if (sortedBy === column) {
                if (orderBy === Sort_Order.ASC) {
                    setOrderBy(Sort_Order.DESC);
                } else {
                    setOrderBy(Sort_Order.ASC);
                }
            } else {
                setSortedBy(column);
                setOrderBy(Sort_Order.ASC);
            }
            onSort?.(column, orderBy, date);
        },
        [date, onSort, orderBy, sortedBy]
    );

    const sortBySymbol = useCallback(() => sortByColumn(COLUMNS.SYMBOL), [sortByColumn]);
    const sortByQuantity = useCallback(() => sortByColumn(COLUMNS.QUANTITY), [sortByColumn]);
    const sortByAvgPrice = useCallback(() => sortByColumn(COLUMNS.AVG_PRICE), [sortByColumn]);
    const sortByLTP = useCallback(() => sortByColumn(COLUMNS.LTP), [sortByColumn]);
    const sortByInvestedValue = useCallback(() => sortByColumn(COLUMNS.INVESTED_VALUE), [sortByColumn]);
    const sortByCurrentValue = useCallback(() => sortByColumn(COLUMNS.CURRENT_VALUE), [sortByColumn]);
    const sortByNetPnl = useCallback(() => sortByColumn(COLUMNS.NET_PNL), [sortByColumn]);
    const sortByNetPnlPercent = useCallback(() => sortByColumn(COLUMNS.NET_PNL_PERCENT), [sortByColumn]);
    const sortByDayPnl = useCallback(() => sortByColumn(COLUMNS.DAY_PNL), [sortByColumn]);
    const sortByDayPnlPercent = useCallback(() => sortByColumn(COLUMNS.DAY_PNL_PERCENT), [sortByColumn]);
    const sortByDayPnlPercentInvestment = useCallback(() => sortByColumn(COLUMNS.DAY_PNL_PERCENT_INV), [sortByColumn]);
    const sortByMaxDays = useCallback(() => sortByColumn(COLUMNS.MAX_DAYS), [sortByColumn]);

    return (
        <TableContainer className="tableContainer" component={Paper}>
            <Table sx={{minWidth: 100}} aria-label="Portfolio" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell className="tableHeaderCell" sx={{minWidth: 100}} onClick={sortBySymbol}>
                            {COLUMNS.SYMBOL}
                        </TableCell>
                        <TableCell className="tableHeaderCell" align="right" onClick={sortByQuantity}>
                            {COLUMNS.QUANTITY}
                        </TableCell>
                        <TableCell className="tableHeaderCell" align="right" onClick={sortByAvgPrice}>
                            {COLUMNS.AVG_PRICE}
                        </TableCell>
                        <TableCell className="tableHeaderCell" align="right" onClick={sortByLTP}>
                            {COLUMNS.LTP}
                        </TableCell>
                        <TableCell className="tableHeaderCell" align="right" onClick={sortByInvestedValue}>
                            {COLUMNS.INVESTED_VALUE}
                        </TableCell>
                        <TableCell className="tableHeaderCell" align="right" onClick={sortByCurrentValue}>
                            {COLUMNS.CURRENT_VALUE}
                        </TableCell>
                        <TableCell className="tableHeaderCell" align="right" onClick={sortByNetPnl}>
                            {COLUMNS.NET_PNL}
                        </TableCell>
                        <TableCell className="tableHeaderCell" align="right" onClick={sortByNetPnlPercent}>
                            {COLUMNS.NET_PNL_PERCENT}
                        </TableCell>
                        <TableCell className="tableHeaderCell" align="right" onClick={sortByDayPnl}>
                            {COLUMNS.DAY_PNL}
                        </TableCell>
                        <TableCell className="tableHeaderCell" align="right" onClick={sortByDayPnlPercent}>
                            {COLUMNS.DAY_PNL_PERCENT}
                        </TableCell>
                        <TableCell className="tableHeaderCell" align="right" onClick={sortByDayPnlPercentInvestment}>
                            {COLUMNS.DAY_PNL_PERCENT_INV}
                        </TableCell>
                        <TableCell className="tableHeaderCell" align="right" onClick={sortByMaxDays}>
                            {COLUMNS.MAX_DAYS}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stocksInfo.map((stockInfo) => (
                        <TableRow
                            key={`${stockInfo.symbol}_${stockInfo.quantity}_${stockInfo.investedValue}`}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {stockInfo.symbol}
                            </TableCell>
                            <TableCell align="right">{stockInfo.quantity}</TableCell>
                            <TableCell align="right">{formatPrice(stockInfo.avgPrice)}</TableCell>
                            <TableCell align="right">{formatPrice(stockInfo.ltp)}</TableCell>
                            <TableCell align="right">{formatPrice(stockInfo.investedValue)}</TableCell>
                            <TableCell align="right">{formatPrice(stockInfo.currentValue)}</TableCell>
                            <TableCell className={stockInfo.pnl >= 0 ? 'profit' : 'loss'} align="right">
                                {formatPrice(stockInfo.pnl)}
                            </TableCell>
                            <TableCell className={stockInfo.pnlpercent >= 0 ? 'profit' : 'loss'} align="right">
                                {stockInfo.pnlpercent.toFixed(2)}%{' '}
                            </TableCell>
                            <TableCell className={stockInfo.totalDayChange >= 0 ? 'profit' : 'loss'} align="right">
                                {formatPrice(stockInfo.totalDayChange)}
                            </TableCell>
                            <TableCell className={stockInfo.percentDayChange >= 0 ? 'profit' : 'loss'} align="right">
                                {formatPrice(stockInfo.percentDayChange)}%{' '}
                            </TableCell>
                            <TableCell
                                className={stockInfo.percentDayChangeOnInvestment >= 0 ? 'profit' : 'loss'}
                                align="right"
                            >
                                {formatPrice(stockInfo.percentDayChangeOnInvestment)}%{' '}
                            </TableCell>
                            <TableCell align="right">{stockInfo.daysMax}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
