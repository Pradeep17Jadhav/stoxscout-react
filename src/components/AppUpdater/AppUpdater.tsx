import {ReactNode, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useColorScheme} from '@mui/material/styles/CssVarsProvider';
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
import usePreferences from '../../hooks/usePreferences';
import {THEME} from '../../types/userPreferences';

const AppUpdater = ({children}: {children: ReactNode}) => {
    const dispatch = useDispatch();
    const {setMode} = useColorScheme();
    const {theme} = usePreferences();
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
    }, [dispatch, isAuthenticated, isMarketLoaded, isUserLoaded, setIsLoading]);

    useEffect(() => {
        if (!isLoading || !isUserLoaded || !isMarketLoaded) return;
        dispatch(setIsLoading(false));
    }, [dispatch, isLoading, market, setIsLoading, holdings, isUserLoaded, isMarketLoaded]);

    useEffect(() => {
        setMode(theme === THEME.DARK ? 'dark' : 'light');
    }, [setMode, theme]);

    return <>{children}</>;
};

export default AppUpdater;
