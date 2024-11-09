import {useDispatch, useSelector} from 'react-redux';
import {PortfolioState} from '../redux/reducers/portfolioReducer';
import {RootState} from '../redux/reducers/rootReducer';
import {PortfolioAction} from '../redux/actions/portfolioActions';
import {StockInformation} from '../types/transaction';
import {Index} from '../types/indices';
import {MarketData} from '../types/market';
import {useMemo} from 'react';

type UsePortfolioType = {
    dispatch: React.Dispatch<PortfolioAction>;
    isMarketLoaded: boolean;
    stocksInfo: StockInformation[];
    indices: Index[];
    market: MarketData;
};

export const usePortfolio = (): UsePortfolioType => {
    const dispatch = useDispatch();
    const state: PortfolioState = useSelector((state: RootState) => state.portfolio);

    const isMarketLoaded = useMemo(
        () => state.indicesData.loaded && state.marketData.loaded,
        [state.indicesData.loaded, state.marketData.loaded]
    );
    return {
        dispatch,
        isMarketLoaded,
        stocksInfo: state.stocksInfo,
        indices: state.indicesData.indices,
        market: state.marketData.market
    };
};
