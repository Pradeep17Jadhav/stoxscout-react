import { useEffect, useState } from 'react';
import { transformTypes } from '../helpers/price';
import { getUserHoldings } from '../api/holdingsAPI';
import { Holdings } from '../types/transaction';
import { PortfolioAction } from '../context/portfolioReducer';
import { useAuth } from './useAuth';

const useUserHoldings = (dispatch: React.Dispatch<PortfolioAction>) => {
    const [userHoldings, setUserHoldings] = useState<Holdings>([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchUserHoldings = async () => {
            if (!isAuthenticated) return;
            try {
                const response = await getUserHoldings();
                const transformedHoldings = transformTypes(response);
                setUserHoldings(transformedHoldings);
                dispatch({ type: 'UPDATE_USER_HOLDINGS', payload: transformedHoldings });
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserHoldings();
    }, [isAuthenticated]);

    return { userHoldings };
};

export default useUserHoldings;