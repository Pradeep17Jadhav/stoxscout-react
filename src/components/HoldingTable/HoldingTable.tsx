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
import { COLUMNS, StockInformation } from "../../types/transaction";

type Props = {
  stocksInfo: StockInformation[];
  onSort: (column: string) => void;
};
export const HoldingTable = ({ stocksInfo, onSort }: Props) => {
  return (
    <TableContainer className="tableContainer" component={Paper}>
      <Table sx={{ minWidth: 100 }} aria-label="Portfolio" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ minWidth: 200 }}
              onClick={() => onSort(COLUMNS.SYMBOL)}
            >
              {COLUMNS.SYMBOL}
            </TableCell>
            <TableCell align="right" onClick={() => onSort(COLUMNS.QUANTITY)}>
              {COLUMNS.QUANTITY}
            </TableCell>
            <TableCell align="right" onClick={() => onSort(COLUMNS.AVG_PRICE)}>
              {COLUMNS.AVG_PRICE}
            </TableCell>
            <TableCell align="right" onClick={() => onSort(COLUMNS.LTP)}>
              {COLUMNS.LTP}
            </TableCell>
            <TableCell
              align="right"
              onClick={() => onSort(COLUMNS.INVESTED_VALUE)}
            >
              {COLUMNS.INVESTED_VALUE}
            </TableCell>
            <TableCell
              align="right"
              onClick={() => onSort(COLUMNS.CURRENT_VALUE)}
            >
              {COLUMNS.CURRENT_VALUE}
            </TableCell>
            <TableCell
              align="right"
              onClick={() => onSort(COLUMNS.TOTAL_DAY_CHANGE)}
            >
              {COLUMNS.TOTAL_DAY_CHANGE}
            </TableCell>
            <TableCell
              align="right"
              onClick={() => onSort(COLUMNS.TOTAL_DAY_CHANGE_PERCENT)}
            >
              {COLUMNS.TOTAL_DAY_CHANGE_PERCENT}
            </TableCell>
            <TableCell align="right" onClick={() => onSort(COLUMNS.PNL)}>
              {COLUMNS.PNL}
            </TableCell>
            <TableCell
              align="right"
              onClick={() => onSort(COLUMNS.PNL_PERCENT)}
            >
              {COLUMNS.PNL_PERCENT}
            </TableCell>
            <TableCell align="right" onClick={() => onSort(COLUMNS.MAX_DAYS)}>
              {COLUMNS.MAX_DAYS}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stocksInfo.map((stockInfo) => (
            <TableRow
              key={stockInfo.symbol}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {stockInfo.symbol}
              </TableCell>
              <TableCell align="right">{stockInfo.quantity}</TableCell>
              <TableCell align="right">
                {formatPrice(stockInfo.avgPrice)}
              </TableCell>{" "}
              <TableCell align="right">{formatPrice(stockInfo.ltp)}</TableCell>
              <TableCell align="right">
                {formatPrice(stockInfo.investedValue)}
              </TableCell>
              <TableCell align="right">
                {formatPrice(stockInfo.currentValue)}
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
                {formatPrice(stockInfo.percentDayChange)}
              </TableCell>
              <TableCell
                className={stockInfo.pnl >= 0 ? "profit" : "loss"}
                align="right"
              >
                {formatPrice(stockInfo.pnl)}
              </TableCell>
              <TableCell
                className={stockInfo.pnl >= 0 ? "profit" : "loss"}
                align="right"
              >
                {stockInfo.pnlpercent.toFixed(2)}
              </TableCell>
              <TableCell align="right">{stockInfo.daysMax}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
