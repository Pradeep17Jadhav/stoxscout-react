export type Transaction = {
  dateAdded: number;
  quantity: number;
  avgPrice: number;
  portfolioId: string;
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
};

export type DateWiseStockInformation = {
  date: string;
  stocksInfo: StockInformation[];
}[];

export type Holdings = HoldingItem[];
export type DateWiseHoldings = DateWiseHoldingItem[];
export type DateWiseHoldingItem = {
  date: string;
  holdings: Holdings;
};

export type HoldingItem = {
  symbol: string;
  transactions: Transaction[];
};

export type HoldingInfo = {
  totalInvestedValue: string;
  totalCurrentValue: string;
  totalPnl: string;
  totalPnlPercentage: string;
  totalDayChange: string;
  totalDayChangePercentage: string;
};

export type Order = "asc" | "desc" | "unordered";

export const COLUMNS = {
  SYMBOL: "SYMBOL",
  QUANTITY: "QUANTITY",
  AVG_PRICE: "AVG PRICE",
  LTP: "LTP",
  INVESTED_VALUE: "INVESTED VALUE",
  CURRENT_VALUE: "CURRENT VALUE",
  TOTAL_DAY_CHANGE: "TOTAL DAY CHANGE",
  TOTAL_DAY_CHANGE_PERCENT: "TOTAL DAY CHANGE %",
  PNL: "P&L",
  PNL_PERCENT: "P&L %",
  MAX_DAYS: "MAX DAYS",
};
