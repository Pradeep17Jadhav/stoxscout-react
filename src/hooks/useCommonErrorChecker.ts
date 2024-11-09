import {AuthError} from '../errors/AuthError';
import {useAuth} from './useAuth';

export const useCommonErrorChecker = () => {
    const {logoutUser} = useAuth();

    const checkCommonErrors = (error: Error | unknown) => {
        if (error instanceof AuthError) {
            logoutUser();
        }
    };

    return checkCommonErrors;
};
