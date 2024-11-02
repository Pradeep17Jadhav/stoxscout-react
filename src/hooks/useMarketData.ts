import { useEffect, useState } from 'react';
import { MarketData } from '../types/marketData';
import { PortfolioAction } from '../context/portfolioReducer';
import { useAuth } from './useAuth';
import { getMarket } from '../api/marketAPI';
import { isMarketTime } from '../helpers/utils';

const useMarketData = (dispatch: React.Dispatch<PortfolioAction>) => {
    const [marketData, setMarketData] = useState<MarketData>([]);
    const { isAuthenticated } = useAuth();

    const fetchMarketData = () => {
        if (!isAuthenticated) return;
        getMarket()
            .then((response) => {
                dispatch({ type: 'UPDATE_MARKET_DATA', payload: response });
                setMarketData(response);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchMarketData();
        const intervalId = setInterval(() => {
            if (!isMarketTime()) return;
            fetchMarketData();
        }, 20000);
        return () => clearInterval(intervalId);
    }, [isAuthenticated]);

    return { marketData };
};

export default useMarketData;
