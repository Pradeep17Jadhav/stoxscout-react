import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useAuth} from './useAuth';
import {getIndices} from '../api/indicesAPI';
import {isMarketTime} from '../helpers/utils';
import {updateIndicesData} from '../redux/actions/portfolioActions';

const useIndicesData = () => {
    const dispatch = useDispatch();
    const {isAuthenticated} = useAuth();

    const fetchIndicesData = () => {
        if (!isAuthenticated) return;
        getIndices()
            .then((response) => {
                dispatch(updateIndicesData(response));
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
};

export default useIndicesData;
