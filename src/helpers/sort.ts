import { COLUMNS, Order, StockInformation } from "../types/transaction";

const sortByProperty = (
  array: StockInformation[],
  prop: string,
  order: Order = "asc"
) => {
  const slicedArray = array.slice();
  const sortedArray = slicedArray.sort(
    (a: StockInformation, b: StockInformation) =>
      // @ts-ignore
      order === "asc" ? a[prop] - b[prop] : b[prop] - a[prop]
  );
  return sortedArray;
};

const sortBySymbol = (array: StockInformation[], order: Order = "asc") =>
  array
    .slice()
    .sort((a, b) =>
      order === "asc"
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol)
    );

const sortByPnl = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "pnl", order);
const sortByPnlPercent = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "pnlpercent", order);
const sortByLtp = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "ltp", order);

const sortByDayChange = (array: StockInformation[], order: Order = "asc") =>
  sortByProperty(array, "totalDayChange", order);

const sortByDayChangePercent = (
  array: StockInformation[],
  order: Order = "asc"
) => sortByProperty(array, "percentDayChange", order);

const sortByDaysMax = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "daysMax", order);

const sortByCurrentValue = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "currentValue", order);

const sortByInvestedValue = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "investedValue", order);

const sortByAvgPrice = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "avgPrice", order);

const sortByQuantity = (array: StockInformation[], order: Order) =>
  sortByProperty(array, "quantity", order);

const sort = (
  stocksInfo: StockInformation[],
  column: string,
  order: Order = "asc"
): StockInformation[] => {
  if (column === COLUMNS.SYMBOL) {
    return sortBySymbol(stocksInfo, order);
  }
  if (column === COLUMNS.TOTAL_DAY_CHANGE) {
    return sortByDayChange(stocksInfo, order);
  }
  if (column === COLUMNS.TOTAL_DAY_CHANGE_PERCENT) {
    return sortByDayChangePercent(stocksInfo, order);
  }
  if (column === COLUMNS.INVESTED_VALUE) {
    return sortByInvestedValue(stocksInfo, order);
  }
  if (column === COLUMNS.LTP) {
    return sortByLtp(stocksInfo, order);
  }
  if (column === COLUMNS.PNL) {
    return sortByPnl(stocksInfo, order);
  }
  if (column === COLUMNS.PNL_PERCENT) {
    return sortByPnlPercent(stocksInfo, order);
  }
  if (column === COLUMNS.MAX_DAYS) {
    return sortByDaysMax(stocksInfo, order);
  }
  if (column === COLUMNS.QUANTITY) {
    return sortByQuantity(stocksInfo, order);
  }
  if (column === COLUMNS.AVG_PRICE) {
    return sortByAvgPrice(stocksInfo, order);
  }
  if (column === COLUMNS.CURRENT_VALUE) {
    return sortByCurrentValue(stocksInfo, order);
  }
  return stocksInfo;
};

export { sortBySymbol, sort };
