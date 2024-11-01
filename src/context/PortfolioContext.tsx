import React, { ReactNode, useEffect, useReducer } from 'react';
import useMarketData from '../hooks/useMarketData';
import useUserHoldings from '../hooks/useUserHoldings';
import { getPnL, stockInfoGeneratorAll } from '../helpers/price';
import { initialState, PortfolioAction, portfolioReducer } from './portfolioReducer';
import useIndicesData from '../hooks/useIndicesData';

export type PortfolioContextType = {
    state: typeof initialState;
    dispatch: React.Dispatch<PortfolioAction>;
}

export const PortfolioContext = React.createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(portfolioReducer, initialState);
    const { marketData } = useMarketData(dispatch);
    const { userHoldings } = useUserHoldings(dispatch);
    useIndicesData(dispatch);

    useEffect(() => {
        if (!userHoldings || !marketData || !marketData.length) return;
        const updatePortfolio = () => {
            const stockInfo = stockInfoGeneratorAll(userHoldings, marketData);
            dispatch({ type: 'UPDATE_STOCKS_INFO', payload: stockInfo });
            dispatch({ type: 'UPDATE_HOLDING_SUMMARY', payload: getPnL(stockInfo) });
        };
        updatePortfolio();
        const intervalId = setInterval(updatePortfolio, 20000);
        return () => clearInterval(intervalId);
    }, [marketData, userHoldings]);

    return (
        <PortfolioContext.Provider value={{ state, dispatch }}>
            {children}
        </PortfolioContext.Provider>
    );
};