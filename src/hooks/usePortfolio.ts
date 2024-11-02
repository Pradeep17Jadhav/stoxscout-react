import { useContext } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';
import { initialState, PortfolioAction } from '../context/portfolioReducer';

type UsePortfolioType = typeof initialState & {
    dispatch: React.Dispatch<PortfolioAction>;
};

export const usePortfolio = (): UsePortfolioType => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error('usePortfolio must be used within an PortfolioProvider');
    }
    const { state, dispatch } = context;
    return { ...state, dispatch };
};