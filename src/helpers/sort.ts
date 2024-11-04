import {
    COLUMNS,
    DateWiseStockInformation,
    MonthWiseStockInformation,
    Sort_Order,
    StockInformation,
    YearWiseStockInformation
} from '../types/transaction';

const sortByProperty = (
    array: StockInformation[],
    prop: keyof StockInformation,
    order: Sort_Order = Sort_Order.ASC
) => {
    const slicedArray = array.slice();
    const sortedArray = slicedArray.sort((a, b) => {
        const aValue = a[prop] as unknown as number;
        const bValue = b[prop] as unknown as number;
        return order === Sort_Order.ASC ? aValue - bValue : bValue - aValue;
    });
    return sortedArray;
};

const sortBySymbol = (array: StockInformation[], order: Sort_Order = Sort_Order.ASC) =>
    array
        .slice()
        .sort((a, b) =>
            order === Sort_Order.ASC ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol)
        );

const sortByPnl = (array: StockInformation[], order: Sort_Order) => sortByProperty(array, 'pnl', order);
const sortByPnlPercent = (array: StockInformation[], order: Sort_Order) => sortByProperty(array, 'pnlpercent', order);
const sortByLtp = (array: StockInformation[], order: Sort_Order) => sortByProperty(array, 'ltp', order);

const sortByDayChange = (array: StockInformation[], order: Sort_Order = Sort_Order.ASC) =>
    sortByProperty(array, 'totalDayChange', order);

const sortByDayChangePercent = (array: StockInformation[], order: Sort_Order = Sort_Order.ASC) =>
    sortByProperty(array, 'percentDayChange', order);

const sortByDayChangePercentOnInvestment = (array: StockInformation[], order: Sort_Order = Sort_Order.ASC) =>
    sortByProperty(array, 'percentDayChangeOnInvestment', order);

const sortByDaysMax = (array: StockInformation[], order: Sort_Order) => sortByProperty(array, 'daysMax', order);

const sortByCurrentValue = (array: StockInformation[], order: Sort_Order) =>
    sortByProperty(array, 'currentValue', order);

const sortByInvestedValue = (array: StockInformation[], order: Sort_Order) =>
    sortByProperty(array, 'investedValue', order);

const sortByAvgPrice = (array: StockInformation[], order: Sort_Order) => sortByProperty(array, 'avgPrice', order);

const sortByQuantity = (array: StockInformation[], order: Sort_Order) => sortByProperty(array, 'quantity', order);

const sort = (
    stocksInfo: StockInformation[],
    column: string,
    order: Sort_Order = Sort_Order.DESC
): StockInformation[] => {
    if (column === COLUMNS.SYMBOL) {
        return sortBySymbol(stocksInfo, order);
    }
    if (column === COLUMNS.DAY_PNL) {
        return sortByDayChange(stocksInfo, order);
    }
    if (column === COLUMNS.DAY_PNL_PERCENT) {
        return sortByDayChangePercent(stocksInfo, order);
    }
    if (column === COLUMNS.DAY_PNL_PERCENT_INVESTMENT) {
        return sortByDayChangePercentOnInvestment(stocksInfo, order);
    }
    if (column === COLUMNS.INVESTED_VALUE) {
        return sortByInvestedValue(stocksInfo, order);
    }
    if (column === COLUMNS.LTP) {
        return sortByLtp(stocksInfo, order);
    }
    if (column === COLUMNS.NET_PNL) {
        return sortByPnl(stocksInfo, order);
    }
    if (column === COLUMNS.NET_PNL_PERCENT) {
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
