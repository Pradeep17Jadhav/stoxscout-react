import {ReactNode, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getPnL, stockInfoGeneratorAll} from '../../helpers/price';
import {updateStocksInfo} from '../../redux/actions/portfolioActions';
import useIndicesFetcher from '../../hooks/useIndicesFetcher';
import useUserFetcher from '../../hooks/useUserFetcher';
import useMarketData from '../../hooks/useMarketFetcher';
import useHoldingsFetcher from '../../hooks/useHoldingsFetcher';
import {updateHoldingSummary} from '../../redux/actions/userActions';
import usePreferencesFetcher from '../../hooks/usePreferencesFetcher';
import {useApp} from '../../hooks/useApp';
import {useUser} from '../../hooks/useUser';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useAuth} from '../../hooks/useAuth';

const AppUpdater = ({children}: {children: ReactNode}) => {
    const dispatch = useDispatch();
    const {isLoading, setIsLoading} = useApp();
    useMarketData();
    useHoldingsFetcher();
    useIndicesFetcher();
    usePreferencesFetcher();
    useUserFetcher();
    const {holdings, isUserLoaded} = useUser();
    const {isAuthenticated} = useAuth();
    const {market, isMarketLoaded} = usePortfolio();

    useEffect(() => {
        if (!holdings || !market?.length) return;

        const updatePortfolio = () => {
            const stockInfo = stockInfoGeneratorAll(holdings, market);
            dispatch(updateStocksInfo(stockInfo));
            dispatch(updateHoldingSummary(getPnL(stockInfo)));
        };
        updatePortfolio();
        const intervalId = setInterval(updatePortfolio, 20000);
        return () => clearInterval(intervalId);
    }, [market, holdings, dispatch]);

    useEffect(() => {
        if (isAuthenticated && !isUserLoaded && !isMarketLoaded) {
            dispatch(setIsLoading(true));
        } else {
            dispatch(setIsLoading(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isLoading || !isUserLoaded || !isMarketLoaded) return;
        dispatch(setIsLoading(false));
    }, [dispatch, isLoading, market.length, setIsLoading, holdings.length, isUserLoaded, isMarketLoaded]);

    return <>{children}</>;
};

export default AppUpdater;
