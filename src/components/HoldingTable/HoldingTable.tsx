import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { formatPrice } from "../../helpers/price";
import { COLUMNS, Order, StockInformation } from "../../types/transaction";
import "./styles.css";
import { useState } from "react";

type Props = {
  stocksInfo: StockInformation[];
  date?: string;
  year?: string;
  onSort: (column: string, order: Order, date?: string) => void;
};
export const HoldingTable = ({ stocksInfo, date, year, onSort }: Props) => {
  const [sortedBy, setSortedBy] = useState<string>(COLUMNS.SYMBOL);
  const [orderBy, setOrderBy] = useState<Order>(Order.DESC);

  const sortByColumn = (column: string) => {
    if (sortedBy === column) {
      if (orderBy === Order.ASC) {
        setOrderBy(Order.DESC);
      } else {
        setOrderBy(Order.ASC);
      }
    } else {
      setSortedBy(column);
      setOrderBy(Order.ASC);
    }
    onSort(column, orderBy, date);
  };

  return (
    <TableContainer className="tableContainer" component={Paper}>
      <Table sx={{ minWidth: 100 }} aria-label="Portfolio" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              className="tableHeaderCell"
              sx={{ minWidth: 100 }}
              onClick={() => sortByColumn(COLUMNS.SYMBOL)}
            >
              {COLUMNS.SYMBOL}
            </TableCell>
            <TableCell
              className="tableHeaderCell"
              align="right"
              onClick={() => sortByColumn(COLUMNS.QUANTITY)}
            >
              {COLUMNS.QUANTITY}
            </TableCell>
            <TableCell
              className="tableHeaderCell"
              align="right"
              onClick={() => sortByColumn(COLUMNS.AVG_PRICE)}
            >
              {COLUMNS.AVG_PRICE}
            </TableCell>
            <TableCell
              className="tableHeaderCell"
              align="right"
              onClick={() => sortByColumn(COLUMNS.LTP)}
            >
              {COLUMNS.LTP}
            </TableCell>
            <TableCell
              className="tableHeaderCell"
              align="right"
              onClick={() => sortByColumn(COLUMNS.INVESTED_VALUE)}
            >
              {COLUMNS.INVESTED_VALUE}
            </TableCell>
            <TableCell
              className="tableHeaderCell"
              align="right"
              onClick={() => sortByColumn(COLUMNS.CURRENT_VALUE)}
            >
              {COLUMNS.CURRENT_VALUE}
            </TableCell>
            <TableCell
              className="tableHeaderCell"
              align="right"
              onClick={() => sortByColumn(COLUMNS.NET_PNL)}
            >
              {COLUMNS.NET_PNL}
            </TableCell>
            <TableCell
              className="tableHeaderCell"
              align="right"
              onClick={() => sortByColumn(COLUMNS.NET_PNL_PERCENT)}
            >
              {COLUMNS.NET_PNL_PERCENT}
            </TableCell>
            <TableCell
              className="tableHeaderCell"
              align="right"
              onClick={() => sortByColumn(COLUMNS.DAY_PNL)}
            >
              {COLUMNS.DAY_PNL}
            </TableCell>
            <TableCell
              className="tableHeaderCell"
              align="right"
              onClick={() => sortByColumn(COLUMNS.DAY_PNL_PERCENT)}
            >
              {COLUMNS.DAY_PNL_PERCENT}
            </TableCell>
            <TableCell
              className="tableHeaderCell"
              align="right"
              onClick={() => sortByColumn(COLUMNS.DAY_PNL_PERCENT_INVESTMENT)}
            >
              {COLUMNS.DAY_PNL_PERCENT_INVESTMENT}
            </TableCell>
            <TableCell
              className="tableHeaderCell"
              align="right"
              onClick={() => sortByColumn(COLUMNS.MAX_DAYS)}
            >
              {COLUMNS.MAX_DAYS}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stocksInfo.map((stockInfo) => (
            <TableRow
              key={`${stockInfo.symbol}_${stockInfo.quantity}_${stockInfo.investedValue}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {stockInfo.symbol}
              </TableCell>
              <TableCell align="right">{stockInfo.quantity}</TableCell>
              <TableCell align="right">
                {formatPrice(stockInfo.avgPrice)}
              </TableCell>
              <TableCell align="right">{formatPrice(stockInfo.ltp)}</TableCell>
              <TableCell align="right">
                {formatPrice(stockInfo.investedValue)}
              </TableCell>
              <TableCell align="right">
                {formatPrice(stockInfo.currentValue)}
              </TableCell>
              <TableCell
                className={stockInfo.pnl >= 0 ? "profit" : "loss"}
                align="right"
              >
                {formatPrice(stockInfo.pnl)}
              </TableCell>
              <TableCell
                className={stockInfo.pnlpercent >= 0 ? "profit" : "loss"}
                align="right"
              >
                {stockInfo.pnlpercent.toFixed(2)}%{" "}
              </TableCell>
              <TableCell
                className={stockInfo.totalDayChange >= 0 ? "profit" : "loss"}
                align="right"
              >
                {formatPrice(stockInfo.totalDayChange)}
              </TableCell>
              <TableCell
                className={stockInfo.percentDayChange >= 0 ? "profit" : "loss"}
                align="right"
              >
                {formatPrice(stockInfo.percentDayChange)}%{" "}
              </TableCell>
              <TableCell
                className={
                  stockInfo.percentDayChangeOnInvestment >= 0
                    ? "profit"
                    : "loss"
                }
                align="right"
              >
                {formatPrice(stockInfo.percentDayChangeOnInvestment)}%{" "}
              </TableCell>
              <TableCell align="right">{stockInfo.daysMax}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
