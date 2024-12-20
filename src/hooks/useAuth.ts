import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {registerAPI, loginAPI, logoutAPI} from '../api/authAPI';
import {updateUserHoldings} from '../redux/actions/userActions';
import {RootState} from '../redux/reducers/rootReducer';
import {setIsAuthenticated} from '../redux/actions/authActions';

export type UseAuthType = {
    isAuthenticated: boolean;
    registerUser: (name: string, username: string, email: string, password: string) => void;
    loginUser: (emailOrUsername: string, password: string) => void;
    logoutUser: () => void;
};

export const useAuth = (): UseAuthType => {
    const {isAuthenticated} = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const registerUser = useCallback(
        async (name: string, username: string, email: string, password: string) => {
            const res = await registerAPI(name, username, email, password);
            localStorage.setItem('token', res.token);
            dispatch(setIsAuthenticated(true));
            navigate('/');
        },
        [dispatch, navigate]
    );

    const loginUser = useCallback(
        async (emailOrUsername: string, password: string) => {
            const res = await loginAPI(emailOrUsername, password);
            localStorage.setItem('token', res.token);
            dispatch(setIsAuthenticated(true));
            navigate('/');
        },
        [dispatch, navigate]
    );

    const logoutUser = useCallback(async () => {
        localStorage.removeItem('token');
        dispatch(setIsAuthenticated(false));
        dispatch(updateUserHoldings([]));
        navigate('/login');
        await logoutAPI();
    }, [dispatch, navigate]);

    return {isAuthenticated, registerUser, loginUser, logoutUser};
};
