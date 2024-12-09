import {AuthError} from '../errors/AuthError';
import {useAlert} from './useAlert';
import {useAuth} from './useAuth';

export const useCommonErrorChecker = () => {
    const {logoutUser} = useAuth();
    const {showSnackBar} = useAlert();

    const checkCommonErrors = (error: Error | unknown) => {
        if (error instanceof AuthError) {
            logoutUser();
            let errorReason = '';
            const type = error.type;
            if (type === 'token_expired' || type === 'invalid_token') {
                errorReason = 'your login session has expired';
            } else if (type === 'user_not_found') {
                errorReason = 'your account is not present anymore or it is deactivated';
            }
            showSnackBar(`You have been logged out as ${errorReason}. Please log in again.`);
        }
    };

    return checkCommonErrors;
};
