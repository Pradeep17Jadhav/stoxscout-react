import {Index} from '../../types/indices';
import {MarketData} from '../../types/marketData';
import {StockInformation} from '../../types/transaction';
import {PortfolioAction} from '../actions/portfolioActions';

export type PortfolioState = {
    stocksInfo: StockInformation[];
    indicesData: Index[];
    marketData: MarketData;
};

export const initialState: PortfolioState = {
    stocksInfo: [],
    indicesData: [],
    marketData: []
};

export const portfolioReducer = (state: PortfolioState = initialState, action: PortfolioAction): PortfolioState => {
    switch (action.type) {
        case 'UPDATE_STOCKS_INFO':
            return {...state, stocksInfo: action.payload};
        case 'UPDATE_INDICES_DATA':
            return {...state, indicesData: action.payload};
        case 'UPDATE_MARKET_DATA':
            return {...state, marketData: action.payload};
        default:
            return state;
    }
};
