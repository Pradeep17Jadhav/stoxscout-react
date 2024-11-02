import {useState} from 'react';
import {Button, TextField, Typography} from '@mui/material';
import {useAuth} from '../../hooks/useAuth';

import './styles.css';

export const Signup = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const {registerUser} = useAuth();

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await registerUser(name, username, email, password);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
    };

    return (
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
                        onChange={(e) => setName(e.target.value.trim())}
                        required
                    />
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.trim())}
                        required
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.trim())}
                        required
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value.trim())}
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
