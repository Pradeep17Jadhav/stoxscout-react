import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useAuth} from './useAuth';
import {getIndices} from '../api/indicesAPI';
import {isMarketTime} from '../helpers/utils';
import {updateIndicesData} from '../redux/actions/portfolioActions';
import {useCommonErrorChecker} from './useCommonErrorChecker';

const useIndicesData = () => {
    const dispatch = useDispatch();
    const {isAuthenticated} = useAuth();
    const checkCommonErrors = useCommonErrorChecker();

    const fetchIndicesData = () => {
        if (!isAuthenticated) return;
        getIndices()
            .then((response) => {
                dispatch(updateIndicesData(response));
            })
            .catch((error) => {
                checkCommonErrors(error);
            });
    };

    useEffect(() => {
        fetchIndicesData();
        const intervalId = setInterval(() => {
            if (!isMarketTime()) return;
            fetchIndicesData();
        }, 20000);
        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);
};

export default useIndicesData;
