import {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, TextField, Typography} from '@mui/material';
import {useAuth} from '../../hooks/useAuth';
import {useAlert} from '../../hooks/useAlert';

import './styles.css';

export const Login = () => {
    const [logging, setLogging] = useState(false);
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const {loginUser, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const {showLinearProcess, hideLinearProcess} = useAlert();

    const handleLogin = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLogging(true);
            showLinearProcess();
            try {
                await loginUser(emailOrUsername, password);
                hideLinearProcess(true);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                }
                hideLinearProcess(false);
            }
            setLogging(false);
        },
        [showLinearProcess, hideLinearProcess, loginUser, emailOrUsername, password]
    );

    const forgotPasswordHandler = useCallback(() => {
        navigate('/forgotPassword');
    }, [navigate]);

    useEffect(() => {
        isAuthenticated && navigate('/');
    }, [isAuthenticated, navigate]);

    const onSetEmailOrUsername = useCallback((e: any) => setEmailOrUsername(e.target.value), []);
    const onSetPassword = useCallback((e: any) => setPassword(e.target.value), []);

    return isAuthenticated ? (
        <></>
    ) : (
        <div className="elevated-container login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <TextField
                    className="form-item"
                    label="Username or Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={emailOrUsername}
                    onChange={onSetEmailOrUsername}
                    autoComplete="email"
                    required
                />
                <TextField
                    className="form-item"
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={onSetPassword}
                    autoComplete="current-password"
                    required
                />
                {error && (
                    <Typography className="form-item" color="error">
                        {error}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    className="primary-button form-item"
                    type="submit"
                    disabled={logging}
                >
                    Login
                </Button>

                <Typography variant="body2" className="form-item" onClick={forgotPasswordHandler}>
                    <span className="text-link">Forgot password</span>
                </Typography>
            </form>
        </div>
    );
};
