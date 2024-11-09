import {useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useAuth} from './useAuth';
import {useCommonErrorChecker} from './useCommonErrorChecker';
import {getUserInformation} from '../api/userAPI';
import {updateUserInformation} from '../redux/actions/userActions';

const useUserFetcher = () => {
    const dispatch = useDispatch();
    const {isAuthenticated} = useAuth();
    const checkCommonErrors = useCommonErrorChecker();

    const fetchUserInformation = useCallback(() => {
        if (!isAuthenticated) return;
        getUserInformation()
            .then((userInfo) => {
                if (userInfo && Object.keys(userInfo).length !== 0) {
                    dispatch(updateUserInformation(userInfo));
                }
            })
            .catch((error) => {
                checkCommonErrors(error);
            });
    }, [checkCommonErrors, dispatch, isAuthenticated]);

    useEffect(() => {
        fetchUserInformation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);
};

export default useUserFetcher;
