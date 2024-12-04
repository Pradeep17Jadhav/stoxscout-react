import {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, TextField, Typography} from '@mui/material';
import {useAuth} from '../../hooks/useAuth';

import './styles.css';

export const Login = () => {
    const [logging, setLogging] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const {loginUser, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const handleLogin = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLogging(true);
            try {
                await loginUser(username, password);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                }
            }
            setLogging(false);
        },
        [loginUser, password, username]
    );

    const forgotPasswordHandler = useCallback(() => {
        navigate('/forgotPassword');
    }, [navigate]);

    useEffect(() => {
        isAuthenticated && navigate('/');
    }, [isAuthenticated, navigate]);

    const onSetUsername = useCallback((e: any) => setUsername(e.target.value), []);
    const onSetPassword = useCallback((e: any) => setPassword(e.target.value), []);

    return isAuthenticated ? (
        <></>
    ) : (
        <div className="credential-container">
            <>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <TextField
                        className="form-item"
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={onSetUsername}
                        autoComplete="username"
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
                    <Button variant="contained" color="primary" className="form-item" type="submit" disabled={logging}>
                        Login
                    </Button>

                    <Typography variant="body2" className="form-item" onClick={forgotPasswordHandler}>
                        <span className="text-link">Forgot password</span>
                    </Typography>
                </form>
            </>
        </div>
    );
};
