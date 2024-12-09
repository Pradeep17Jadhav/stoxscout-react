import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, TextField, Typography} from '@mui/material';
import {useAuth} from '../../hooks/useAuth';
import {useAlert} from '../../hooks/useAlert';
import './styles.css';

export const Signup = () => {
    const [signingUp, setSigningUp] = useState(false);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const {registerUser, isAuthenticated} = useAuth();
    const {showLinearProcess, hideLinearProcess} = useAlert();
    const navigate = useNavigate();

    const handleSignup = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setSigningUp(true);
            showLinearProcess();
            try {
                await registerUser(name.trim(), username.trim(), email.trim(), password.trim());
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                }
                hideLinearProcess(false);
            }
            setSigningUp(false);
            hideLinearProcess();
        },
        [email, hideLinearProcess, name, password, registerUser, showLinearProcess, username]
    );

    useEffect(() => {
        isAuthenticated && navigate('/');
    }, [isAuthenticated, navigate]);

    const onSetName = useCallback((e: any) => setName(e.target.value), []);
    const onSetUsername = useCallback((e: any) => setUsername(e.target.value), []);
    const onSetEmail = useCallback((e: any) => setEmail(e.target.value), []);
    const onSetPassword = useCallback((e: any) => setPassword(e.target.value), []);

    const {nameValid, nameError, nameHelperText} = useMemo(() => {
        let nameHelperText = '';
        let nameError = true;
        let nameValid = false;
        if (name === '') {
            return {nameValid, nameError: false, nameHelperText};
        }
        if (name.length < 6 || name.length > 30) {
            nameHelperText = 'Name should have 6 to 30 letters';
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            nameHelperText = 'Name should not have numbers and special characters';
        } else {
            nameError = false;
            nameValid = true;
        }
        return {nameValid, nameError, nameHelperText};
    }, [name]);

    const {usernameValid, usernameError, usernameHelperText} = useMemo(() => {
        let usernameHelperText = '';
        let usernameError = true;
        let usernameValid = false;
        if (username === '') {
            return {usernameValid, usernameError: false, usernameHelperText};
        }
        const errors = [];
        if (username.length < 6 || username.length > 30) {
            errors.push('be between 6 to 30 characters long');
        }
        if (/[^a-zA-Z0-9]/.test(username)) {
            errors.push('not contain special characters or spaces');
        }
        if (errors.length > 0) {
            usernameHelperText = `Username must ${errors.join(', ')}.`;
        } else {
            usernameError = false;
            usernameValid = true;
        }
        return {usernameValid, usernameError, usernameHelperText};
    }, [username]);

    const {emailValid, emailError, emailHelperText} = useMemo(() => {
        let emailHelperText = '';
        let emailError = true;
        let emailValid = false;
        if (email === '') {
            return {emailValid, emailError: false, emailHelperText};
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            emailHelperText = 'Please enter a valid email address.';
        } else {
            emailError = false;
            emailValid = true;
        }
        return {emailValid, emailError, emailHelperText};
    }, [email]);

    const {passwordValid, passwordError, passwordHelperText} = useMemo(() => {
        let passwordHelperText = '';
        let passwordError = true;
        let passwordValid = false;
        if (password === '') {
            return {passwordValid, passwordError: false, passwordHelperText};
        }

        const containsUsername = username && new RegExp(username, 'i').test(password);
        const containsName = name
            ? name.split(/\s+/).some((part) => password.toLowerCase().includes(part.toLowerCase()))
            : false;

        const errors = [];
        if (password.length < 8 || password.length > 30) {
            errors.push('be 8 to 30 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('contain an uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('contain a lowercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('contain a number');
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
            errors.push('contain a special character');
        }
        if (/\s/.test(password)) {
            errors.push('not contain spaces');
        }
        if (containsUsername || containsName) {
            errors.push('not contain part of your name or username');
        }
        if (errors.length > 0) {
            passwordHelperText = `Password must ${errors.join(', ')}.`;
        } else {
            passwordError = false;
            passwordValid = true;
        }
        return {passwordValid, passwordError, passwordHelperText};
    }, [name, password, username]);

    const isFormValid = useMemo(
        () => nameValid && usernameValid && emailValid && passwordValid,
        [emailValid, nameValid, passwordValid, usernameValid]
    );

    return isAuthenticated ? (
        <></>
    ) : (
        <div className="elevated-container signup-container">
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                <TextField
                    className="form-item"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={onSetName}
                    required
                    error={nameError}
                    helperText={nameHelperText}
                />
                <TextField
                    className="form-item"
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={onSetUsername}
                    required
                    error={usernameError}
                    helperText={usernameHelperText}
                />
                <TextField
                    className="form-item"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={onSetEmail}
                    required
                    error={emailError}
                    helperText={emailHelperText}
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
                    required
                    error={passwordError}
                    helperText={passwordHelperText}
                />
                {error && (
                    <div className="form-item">
                        {error.split('. ').map((errMsg, index) => (
                            <Typography key={index} color="error">
                                {errMsg}
                            </Typography>
                        ))}
                    </div>
                )}
                <Button
                    className="primary-button form-item"
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={signingUp || !isFormValid}
                >
                    Signup
                </Button>
            </form>
        </div>
    );
};
