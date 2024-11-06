import {DEFAULT_COLUMNS} from './userPreferences';

export type Transaction = {
    dateAdded: number;
    quantity: number;
    avgPrice: number;
    isGift?: boolean;
    isIPO?: boolean;
    exchange?: string;
};

export type StockInformation = {
    symbol: string;
    quantity: number;
    avgPrice: number;
    investedValue: number;
    currentValue: number;
    pnl: number;
    pnlpercent: number;
    daysMax: number;
    ltp: number;
    totalDayChange: number;
    percentDayChange: number;
    percentDayChangeOnInvestment: number;
};

export type Holdings = HoldingItem[];
export type DateWiseHoldings = DateWiseHoldingItem[];
export type DateWiseHoldingItem = {
    date: string;
    holdings: Holdings;
};
export type DateWiseStockInformation = {
    date: string;
    stocksInfo: StockInformation[];
}[];

export type MonthWiseHoldings = MonthWiseHoldingItem[];
export type MonthWiseHoldingItem = {
    month: string;
    holdings: Holdings;
};
export type MonthWiseStockInformation = {
    monthYear: string;
    stocksInfo: StockInformation[];
}[];

export type YearWiseHoldings = YearWiseHoldingItem[];
export type YearWiseHoldingItem = {
    year: string;
    holdings: Holdings;
};
export type YearWiseStockInformation = {
    year: string;
    stocksInfo: StockInformation[];
}[];

export type HoldingItem = {
    symbol: string;
    transactions: Transaction[];
};

export type HoldingSummary = {
    totalInvestedValue: string;
    totalCurrentValue: string;
    totalPnl: string;
    totalPnlPercentage: string;
    totalDayChange: string;
    totalDayChangePercentage: string;
};

export enum SORT_ORDER {
    ASC = 1,
    DESC = 2
}

export const COLUMNS = {
    [DEFAULT_COLUMNS.SYMBOL]: 'SYMBOL',
    [DEFAULT_COLUMNS.QUANTITY]: 'QUANTITY',
    [DEFAULT_COLUMNS.AVG_PRICE]: 'AVG PRICE',
    [DEFAULT_COLUMNS.LTP]: 'LTP',
    [DEFAULT_COLUMNS.INVESTED_VALUE]: 'INVESTED VALUE',
    [DEFAULT_COLUMNS.CURRENT_VALUE]: 'CURRENT VALUE',
    [DEFAULT_COLUMNS.NET_PNL]: 'NET P&L',
    [DEFAULT_COLUMNS.NET_PNL_PERCENT]: 'NET P&L %',
    [DEFAULT_COLUMNS.DAY_PNL]: 'DAY P&L',
    [DEFAULT_COLUMNS.DAY_PNL_PERCENT]: 'DAY P&L %',
    [DEFAULT_COLUMNS.DAY_PNL_PERCENT_INV]: 'DAY P&L % INV',
    [DEFAULT_COLUMNS.MAX_DAYS]: 'MAX DAYS'
};
