import {useCallback, useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import {registerAPI, loginAPI, logoutAPI} from '../api/authAPI';

export type UseAuthType = {
    isAuthenticated: boolean;
    registerUser: (name: string, username: string, email: string, password: string) => void;
    loginUser: (username: string, password: string) => void;
    logoutUser: () => void;
};

export const useAuth = (): UseAuthType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    const {isAuthenticated, setIsAuthenticated} = context;
    const navigate = useNavigate();

    const registerUser = useCallback(
        async (name: string, username: string, email: string, password: string) => {
            const res = await registerAPI(name, username, email, password);
            localStorage.setItem('token', res.token);
            setIsAuthenticated(true);
            navigate('/');
        },
        [navigate]
    );

    const loginUser = useCallback(
        async (username: string, password: string) => {
            const res = await loginAPI(username, password);
            localStorage.setItem('token', res.token);
            setIsAuthenticated(true);
            navigate('/');
        },
        [navigate]
    );

    const logoutUser = useCallback(async () => {
        await logoutAPI();
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    }, [navigate]);

    return {isAuthenticated, registerUser, loginUser, logoutUser};
};
