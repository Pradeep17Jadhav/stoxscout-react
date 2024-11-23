import {Index} from '../../types/indices';
import {MarketData} from '../../types/market';
import {StockInformation} from '../../types/transaction';
import {PortfolioAction} from '../actions/portfolioActions';

export type PortfolioState = {
    stocksInfo: StockInformation[];
    indicesData: {
        indices: Index[];
        loaded: boolean;
    };
    marketData: {
        market: MarketData;
        updatedAt?: string;
        loaded: boolean;
    };
};

export const initialState: PortfolioState = {
    stocksInfo: [],
    indicesData: {
        indices: [],
        loaded: false
    },
    marketData: {
        market: [],
        updatedAt: undefined,
        loaded: false
    }
};

export const portfolioReducer = (state: PortfolioState = initialState, action: PortfolioAction): PortfolioState => {
    switch (action.type) {
        case 'UPDATE_STOCKS_INFO':
            return {...state, stocksInfo: action.payload};
        case 'UPDATE_INDICES_DATA':
            return {
                ...state,
                indicesData: {
                    ...state.indicesData,
                    indices: action.payload,
                    loaded: true
                }
            };
        case 'UPDATE_MARKET_DATA':
            return {
                ...state,
                marketData: {
                    ...state.marketData,
                    market: action.payload.market,
                    updatedAt: action.payload.updatedAt,
                    loaded: true
                }
            };
        default:
            return state;
    }
};
