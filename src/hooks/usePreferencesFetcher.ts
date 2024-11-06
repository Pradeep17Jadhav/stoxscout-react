import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useAuth} from './useAuth';
import {updateUserPreferences} from '../redux/actions/userActions';
import {getPreference} from '../api/userAPI';
import {useCommonErrorChecker} from './useCommonErrorChecker';

const usePreferenceFetcher = () => {
    const dispatch = useDispatch();
    const {isAuthenticated} = useAuth();
    const checkCommonErrors = useCommonErrorChecker();

    const fetchPreference = () => {
        if (!isAuthenticated) return;
        getPreference()
            .then((preferences) => {
                if (preferences) {
                    dispatch(updateUserPreferences(preferences));
                }
            })
            .catch((error) => {
                checkCommonErrors(error);
            });
    };

    useEffect(() => {
        fetchPreference();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);
};

export default usePreferenceFetcher;
