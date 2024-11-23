import {Index} from '../../types/indices';
import {MarketData} from '../../types/market';
import {StockInformation} from '../../types/transaction';

type MarketDataPayload = {
    market: MarketData;
    updatedAt: string;
};

export type PortfolioAction =
    | {type: 'UPDATE_STOCKS_INFO'; payload: StockInformation[]}
    | {type: 'UPDATE_INDICES_DATA'; payload: Index[]}
    | {type: 'UPDATE_MARKET_DATA'; payload: MarketDataPayload};

export const updateStocksInfo = (payload: StockInformation[]): PortfolioAction => ({
    type: 'UPDATE_STOCKS_INFO',
    payload
});

export const updateIndicesData = (payload: Index[]): PortfolioAction => ({
    type: 'UPDATE_INDICES_DATA',
    payload
});

export const updateMarketData = (payload: MarketDataPayload): PortfolioAction => ({
    type: 'UPDATE_MARKET_DATA',
    payload
});
