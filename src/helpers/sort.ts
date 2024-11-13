import {
    DateWiseStockInformation,
    MonthWiseStockInformation,
    SORT_ORDER,
    StockInformation,
    YearWiseStockInformation
} from '../types/transaction';
import {DEFAULT_COLUMNS} from '../types/userPreferences';

const sortByProperty = (
    array: StockInformation[],
    prop: keyof StockInformation,
    order: SORT_ORDER = SORT_ORDER.ASC
) => {
    const slicedArray = array.slice();
    const sortedArray = slicedArray.sort((a, b) => {
        const aValue = a[prop] as unknown as number;
        const bValue = b[prop] as unknown as number;
        return order === SORT_ORDER.ASC ? aValue - bValue : bValue - aValue;
    });
    return sortedArray;
};

const sortBySymbol = (array: StockInformation[], order: SORT_ORDER = SORT_ORDER.ASC) =>
    array
        .slice()
        .sort((a, b) =>
            order === SORT_ORDER.ASC ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol)
        );

const sortByPnl = (array: StockInformation[], order: SORT_ORDER) => sortByProperty(array, 'pnl', order);
const sortByPnlPercent = (array: StockInformation[], order: SORT_ORDER) => sortByProperty(array, 'pnlpercent', order);
const sortByLtp = (array: StockInformation[], order: SORT_ORDER) => sortByProperty(array, 'ltp', order);

const sortByDayChange = (array: StockInformation[], order: SORT_ORDER = SORT_ORDER.ASC) =>
    sortByProperty(array, 'totalDayChange', order);

const sortByDayChangePercent = (array: StockInformation[], order: SORT_ORDER = SORT_ORDER.ASC) =>
    sortByProperty(array, 'percentDayChange', order);

const sortByDayChangePercentOnInvestment = (array: StockInformation[], order: SORT_ORDER = SORT_ORDER.ASC) =>
    sortByProperty(array, 'percentDayChangeOnInvestment', order);

const sortByDaysMax = (array: StockInformation[], order: SORT_ORDER) => sortByProperty(array, 'daysMax', order);

const sortByCurrentValue = (array: StockInformation[], order: SORT_ORDER) =>
    sortByProperty(array, 'currentValue', order);

const sortByInvestedValue = (array: StockInformation[], order: SORT_ORDER) =>
    sortByProperty(array, 'investedValue', order);

const sortByAvgPrice = (array: StockInformation[], order: SORT_ORDER) => sortByProperty(array, 'avgPrice', order);

const sortByQuantity = (array: StockInformation[], order: SORT_ORDER) => sortByProperty(array, 'quantity', order);

const sort = (
    stocksInfo: StockInformation[],
    column: number,
    order: SORT_ORDER = SORT_ORDER.DESC
): StockInformation[] => {
    if (column === DEFAULT_COLUMNS.SYMBOL) {
        return sortBySymbol(stocksInfo, order);
    }
    if (column === DEFAULT_COLUMNS.QUANTITY) {
        return sortByQuantity(stocksInfo, order);
    }
    if (column === DEFAULT_COLUMNS.AVG_PRICE) {
        return sortByAvgPrice(stocksInfo, order);
    }
    if (column === DEFAULT_COLUMNS.LTP) {
        return sortByLtp(stocksInfo, order);
    }
    if (column === DEFAULT_COLUMNS.INVESTED) {
        return sortByInvestedValue(stocksInfo, order);
    }
    if (column === DEFAULT_COLUMNS.CURRENT_VALUE) {
        return sortByCurrentValue(stocksInfo, order);
    }
    if (column === DEFAULT_COLUMNS.NET_PNL) {
        return sortByPnl(stocksInfo, order);
    }
    if (column === DEFAULT_COLUMNS.NET_PNL_PERCENT) {
        return sortByPnlPercent(stocksInfo, order);
    }
    if (column === DEFAULT_COLUMNS.DAY_PNL) {
        return sortByDayChange(stocksInfo, order);
    }
    if (column === DEFAULT_COLUMNS.DAY_PNL_PERCENT) {
        return sortByDayChangePercent(stocksInfo, order);
    }
    if (column === DEFAULT_COLUMNS.DAY_PNL_PERCENT_INV) {
        return sortByDayChangePercentOnInvestment(stocksInfo, order);
    }
    if (column === DEFAULT_COLUMNS.MAX_DAYS) {
        return sortByDaysMax(stocksInfo, order);
    }
    return stocksInfo;
};

const sortHoldingsByDate = (dateWiseStockInfo: DateWiseStockInformation) => {
    const stockInfoWithEpoch = dateWiseStockInfo.map((stocksInfo) => {
        const {date} = stocksInfo;
        const [day, month, year] = date.split('-').map(Number);
        const dateObject = new Date(year, month - 1, day);
        const epochTimestamp = dateObject.getTime();
        return {...stocksInfo, epochTimestamp};
    });
    stockInfoWithEpoch.sort((a, b) => b.epochTimestamp - a.epochTimestamp);
    return stockInfoWithEpoch.map(({epochTimestamp, ...rest}) => rest);
};

const sortHoldingsByMonth = (monthWiseStockInfo: MonthWiseStockInformation) => {
    const stockInfoWithEpoch = monthWiseStockInfo.map((stocksInfo) => {
        const {monthYear} = stocksInfo;
        const [month, year] = monthYear.split('-').map(Number);
        const dateObject = new Date(year, month - 1, 15);
        const epochTimestamp = dateObject.getTime();
        return {...stocksInfo, epochTimestamp};
    });
    stockInfoWithEpoch.sort((a, b) => b.epochTimestamp - a.epochTimestamp);
    return stockInfoWithEpoch.map(({epochTimestamp, ...rest}) => rest);
};

const sortHoldingsByYear = (yearWiseStockInfo: YearWiseStockInformation) =>
    yearWiseStockInfo
        .map((stocksInfo) => ({
            ...stocksInfo,
            year: parseInt(stocksInfo.year)
        }))
        .sort((a, b) => b.year - a.year)
        .map(({year, ...rest}) => ({
            ...rest,
            year: year.toString()
        }));

export {sortBySymbol, sort, sortHoldingsByDate, sortHoldingsByMonth, sortHoldingsByYear};
