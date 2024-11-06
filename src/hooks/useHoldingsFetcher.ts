import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {transformTypes} from '../helpers/price';
import {getUserHoldings} from '../api/holdingsAPI';
import {useAuth} from './useAuth';
import {updateUserHoldings} from '../redux/actions/userActions';
import {useCommonErrorChecker} from './useCommonErrorChecker';

const useHoldingsFetcher = () => {
    const dispatch = useDispatch();
    const {isAuthenticated} = useAuth();
    const checkCommonErrors = useCommonErrorChecker();

    useEffect(() => {
        const fetchUserHoldings = async () => {
            if (!isAuthenticated) return;
            try {
                const response = await getUserHoldings();
                const transformedHoldings = transformTypes(response);
                dispatch(updateUserHoldings(transformedHoldings));
            } catch (error) {
                checkCommonErrors(error);
            }
        };
        fetchUserHoldings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);
};

export default useHoldingsFetcher;
