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

export enum Sort_Order {
    ASC = 'ASC',
    DESC = 'DESC'
}

export const COLUMNS = {
    SYMBOL: 'SYMBOL',
    QUANTITY: 'QUANTITY',
    AVG_PRICE: 'AVG PRICE',
    LTP: 'LTP',
    INVESTED_VALUE: 'INVESTED VALUE',
    CURRENT_VALUE: 'CURRENT VALUE',
    DAY_PNL: 'DAY P&L',
    DAY_PNL_PERCENT: 'DAY P&L %',
    DAY_PNL_PERCENT_INV: 'DAY P&L % INV',
    NET_PNL: 'NET P&L',
    NET_PNL_PERCENT: 'NET P&L %',
    MAX_DAYS: 'MAX DAYS'
};
