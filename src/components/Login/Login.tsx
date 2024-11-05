import {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, TextField, Typography} from '@mui/material';
import {useAuth} from '../../hooks/useAuth';

import './styles.css';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const {loginUser, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const handleLogin = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            try {
                await loginUser(username, password);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                }
            }
        },
        [loginUser, password, username]
    );

    useEffect(() => {
        isAuthenticated && navigate('/');
    }, [isAuthenticated, navigate]);

    const onSetUsername = useCallback((e: any) => setUsername(e.target.value), []);
    const onSetPassword = useCallback((e: any) => setPassword(e.target.value), []);

    return isAuthenticated ? (
        <></>
    ) : (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="addPurchase">
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={onSetUsername}
                        required
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={onSetPassword}
                        required
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </div>
            </form>
        </div>
    );
};
