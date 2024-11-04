import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/reducers/rootReducer';
import {getPnL, stockInfoGeneratorAll} from '../../helpers/price';
import {updateStocksInfo} from '../../redux/actions/portfolioActions';
import useIndicesData from '../../hooks/useIndicesFetcher';
import useMarketData from '../../hooks/useMarketFetcher';
import useHoldingsFetcher from '../../hooks/useHoldingsFetcher';
import {updateHoldingSummary} from '../../redux/actions/userActions';

const PortfolioUpdater = ({children}: {children: any}) => {
    const dispatch = useDispatch();
    useMarketData();
    useHoldingsFetcher();
    useIndicesData();
    const {userHoldings} = useSelector((state: RootState) => state.user);
    const {marketData} = useSelector((state: RootState) => state.portfolio);

    useEffect(() => {
        if (!userHoldings || !marketData || !marketData.length) return;

        const updatePortfolio = () => {
            const stockInfo = stockInfoGeneratorAll(userHoldings, marketData);
            dispatch(updateStocksInfo(stockInfo));
            dispatch(updateHoldingSummary(getPnL(stockInfo)));
        };

        updatePortfolio();
        const intervalId = setInterval(updatePortfolio, 20000);
        return () => clearInterval(intervalId);
    }, [marketData, userHoldings, dispatch]);

    return <>{children}</>;
};

export default PortfolioUpdater;
