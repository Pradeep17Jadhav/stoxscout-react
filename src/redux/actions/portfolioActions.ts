import {Index} from '../../types/indices';
import {MarketData} from '../../types/marketData';
import {StockInformation} from '../../types/transaction';

export type PortfolioAction =
    | {type: 'UPDATE_STOCKS_INFO'; payload: StockInformation[]}
    | {type: 'UPDATE_INDICES_DATA'; payload: Index[]}
    | {type: 'UPDATE_MARKET_DATA'; payload: MarketData};

export const updateStocksInfo = (payload: StockInformation[]): PortfolioAction => ({
    type: 'UPDATE_STOCKS_INFO',
    payload
});

export const updateIndicesData = (payload: Index[]): PortfolioAction => ({
    type: 'UPDATE_INDICES_DATA',
    payload
});

export const updateMarketData = (payload: MarketData): PortfolioAction => ({
    type: 'UPDATE_MARKET_DATA',
    payload
});
