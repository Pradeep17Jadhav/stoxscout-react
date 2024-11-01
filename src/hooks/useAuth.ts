import { useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginAPI, logoutAPI } from "../api/authAPI";

export type UseAuthType = {
    isAuthenticated: boolean;
    loginUser: (username: string, password: string) => void;
    logoutUser: () => void;
}

export const useAuth = (): UseAuthType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    const { isAuthenticated, setIsAuthenticated } = context;
    const navigate = useNavigate();

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
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        await logoutAPI();
        navigate('/login');
    }, [navigate]);

    return { isAuthenticated, loginUser, logoutUser };
};