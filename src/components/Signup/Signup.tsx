import {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, TextField, Typography} from '@mui/material';
import {useAuth} from '../../hooks/useAuth';

import './styles.css';

export const Signup = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const {registerUser, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const handleSignup = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            try {
                await registerUser(name.trim(), username.trim(), email.trim(), password.trim());
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                }
            }
        },
        [email, name, password, registerUser, username]
    );

    useEffect(() => {
        isAuthenticated && navigate('/');
    }, [isAuthenticated, navigate]);

    const onSetName = useCallback((e: any) => setName(e.target.value), []);
    const onSetUsername = useCallback((e: any) => setUsername(e.target.value), []);
    const onSetEmail = useCallback((e: any) => setEmail(e.target.value), []);
    const onSetPassword = useCallback((e: any) => setPassword(e.target.value), []);

    return isAuthenticated ? (
        <></>
    ) : (
        <div className="login-container">
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                <div className="addPurchase">
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={onSetName}
                        required
                    />
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
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={onSetEmail}
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
                    {error && (
                        <div>
                            {error.split('. ').map((errMsg, index) => (
                                <Typography key={index} color="error">
                                    {errMsg}
                                </Typography>
                            ))}
                        </div>
                    )}
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Signup
                    </Button>
                </div>
            </form>
        </div>
    );
};
