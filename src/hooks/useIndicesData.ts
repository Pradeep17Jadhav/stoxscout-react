import {useEffect, useState} from 'react';
import {Index} from '../types/indices';
import {PortfolioAction} from '../context/portfolioReducer';
import {useAuth} from './useAuth';
import {getIndices} from '../api/indicesAPI';
import {isMarketTime} from '../helpers/utils';

const useIndicesData = (dispatch: React.Dispatch<PortfolioAction>) => {
    const [indicesData, setIndicesData] = useState<Index[]>([]);
    const {isAuthenticated} = useAuth();

    const fetchIndicesData = () => {
        if (!isAuthenticated) return;
        getIndices()
            .then((response) => {
                setIndicesData(response);
                dispatch({type: 'UPDATE_INDICES_DATA', payload: response});
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchIndicesData();
        const intervalId = setInterval(() => {
            if (!isMarketTime()) return;
            fetchIndicesData();
        }, 20000);
        return () => clearInterval(intervalId);
    }, [isAuthenticated]);

    return {indicesData};
};

export default useIndicesData;
