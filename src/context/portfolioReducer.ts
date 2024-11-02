import { Index } from '../types/indices';
import { MarketData } from '../types/marketData';
import { Holdings, HoldingSummary, StockInformation } from '../types/transaction';

export type PortfolioState = {
    holdingSummary: HoldingSummary;
    stocksInfo: StockInformation[];
    indicesData: Index[];
    userHoldings: Holdings;
    marketData: MarketData;
};

export const initialState: PortfolioState = {
    holdingSummary: {
        totalPnl: '0',
        totalInvestedValue: '0',
        totalCurrentValue: '0',
        totalPnlPercentage: '0',
        totalDayChange: '0',
        totalDayChangePercentage: '0',
    },
    stocksInfo: [],
    indicesData: [],
    marketData: [],
    userHoldings: [],
};

export type PortfolioAction =
    | { type: 'UPDATE_STOCKS_INFO'; payload: StockInformation[] }
    | { type: 'UPDATE_HOLDING_SUMMARY'; payload: HoldingSummary }
    | { type: 'UPDATE_INDICES_DATA'; payload: Index[] }
    | { type: 'UPDATE_USER_HOLDINGS'; payload: Holdings }
    | { type: 'UPDATE_MARKET_DATA'; payload: MarketData }

export const portfolioReducer = (state: PortfolioState, action: PortfolioAction): PortfolioState => {
    switch (action.type) {
        case 'UPDATE_STOCKS_INFO':
            return { ...state, stocksInfo: action.payload };
        case 'UPDATE_HOLDING_SUMMARY':
            return { ...state, holdingSummary: action.payload };
        case 'UPDATE_INDICES_DATA':
            return { ...state, indicesData: action.payload };
        case 'UPDATE_USER_HOLDINGS':
            return { ...state, userHoldings: action.payload };
        case 'UPDATE_MARKET_DATA':
            return { ...state, marketData: action.payload };
        default:
            return state;
    }
};