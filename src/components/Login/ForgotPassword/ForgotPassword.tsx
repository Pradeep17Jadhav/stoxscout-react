import TextField from '@mui/material/TextField/TextField';
import OTPInput from '../../OTPInput/OTPInput';
import {useCallback, useState} from 'react';
import Typography from '@mui/material/Typography/Typography';
import Button from '@mui/material/Button/Button';
import InputAdornment from '@mui/material/InputAdornment/InputAdornment';
import IconButton from '@mui/material/IconButton/IconButton';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {forgotPasswordAPI, updatePasswordAPI, verifyOtpAPI} from '../../../api/authAPI';
import Snackbar from '@mui/material/Snackbar/Snackbar';
import Alert, {AlertColor} from '@mui/material/Alert/Alert';
import {validatePassword} from '../../../helpers/authHelpers';

const OTP_LENGTH = 6;

type Props = {
    toggleForgotPassword: () => void;
};

export const ForgotPassword = ({toggleForgotPassword}: Props) => {
    const [email, setEmail] = useState('');
    const [snackBarSeverity, setSnackBarSeverity] = useState<AlertColor>('success');
    const [generatingOtp, setGeneratingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [otpGenerated, setOtpGenerated] = useState(false);
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const clearForm = useCallback(() => {
        setOtp('');
        setEmail('');
        setShowPassword(false);
        setPassword('');
        setRepeatPassword('');
        setGeneratingOtp(false);
        setOtpGenerated(false);
        setResetToken('');
    }, []);

    const returnToLoginScreen = useCallback(() => {
        clearForm();
        toggleForgotPassword();
    }, [clearForm, toggleForgotPassword]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const generateOtp = useCallback(async () => {
        setGeneratingOtp(true);
        forgotPasswordAPI(email)
            .then(() => {
                setSnackBarSeverity('success');
                setSnackMessage(`OTP sent to ${email}`);
                setSnackbarOpen(true);
                setOtpGenerated(true);
            })
            .catch((error: any) => {
                setSnackBarSeverity('error');
                setSnackMessage(error.message);
                setSnackbarOpen(true);
                clearForm();
            })
            .finally(() => setGeneratingOtp(false));
    }, [clearForm, email]);

    const submitOtp = useCallback(async () => {
        setVerifyingOtp(true);
        verifyOtpAPI(email, parseInt(otp))
            .then(({resetToken}) => {
                if (email) {
                    setResetToken(resetToken);
                }
            })
            .catch((error: any) => {
                setOtp('');
                setSnackBarSeverity('error');
                setSnackMessage(error.message);
                setSnackbarOpen(true);
            })
            .finally(() => setVerifyingOtp(false));
    }, [email, otp]);

    const updatePassword = useCallback(async () => {
        setUpdatingPassword(true);
        updatePasswordAPI(resetToken, password)
            .then(() => {
                setSnackBarSeverity('success');
                setSnackMessage('Password updated successfully! Redirecting you to login page in 5 secondsa!');
                setSnackbarOpen(true);
                clearForm();
                setTimeout(() => returnToLoginScreen(), 5000);
            })
            .catch((error: any) => {
                setSnackBarSeverity('error');
                setSnackMessage(error.message);
                setSnackbarOpen(true);
                returnToLoginScreen();
            })
            .finally(() => setUpdatingPassword(false));
    }, [resetToken, password, clearForm, returnToLoginScreen]);

    const handleSnackbarClose = useCallback(() => {
        setSnackbarOpen(false);
    }, []);

    const validatePasswords = useCallback((password: string, repeatPassword: string) => {
        const errors = validatePassword(password, repeatPassword);
        if (errors) {
            setError(errors);
            setIsValid(false);
        } else {
            setError('');
            setIsValid(true);
        }
    }, []);

    const onSetEmail = useCallback((e: any) => setEmail(e.target.value), []);
    const onSetNewPassword = useCallback(
        (e: any) => {
            setPassword(e.target.value);
            validatePasswords(e.target.value, repeatPassword);
        },
        [repeatPassword, validatePasswords]
    );
    const onSetNewRepeatPassword = useCallback(
        (e: any) => {
            setRepeatPassword(e.target.value);
            validatePasswords(password, e.target.value);
        },
        [password, validatePasswords]
    );

    return (
        <>
            <h2>Reset Password</h2>
            {!resetToken && !otpGenerated && (
                <>
                    <TextField
                        className="form-item"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={onSetEmail}
                        autoComplete="email"
                        required
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        className="form-item"
                        type="submit"
                        disabled={!email || generatingOtp}
                        onClick={generateOtp}
                    >
                        {generatingOtp ? 'Generating OTP' : 'Generate OTP'}
                    </Button>
                </>
            )}
            {otpGenerated && !resetToken && (
                <>
                    <Typography variant="body2" className="form-item">
                        Enter OTP received on your email address
                    </Typography>
                    <OTPInput value={otp} onChange={setOtp} length={OTP_LENGTH} onlyNumber />
                    <Button
                        variant="contained"
                        color="primary"
                        className="form-item"
                        type="submit"
                        disabled={generatingOtp || otp.length !== OTP_LENGTH}
                        onClick={submitOtp}
                    >
                        {verifyingOtp ? 'Verifying' : 'Submit'}
                    </Button>
                </>
            )}
            {resetToken && (
                <>
                    <TextField
                        className="form-item"
                        label="New Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={onSetNewPassword}
                        required
                    />
                    <TextField
                        className="form-item"
                        value={repeatPassword}
                        type={showPassword ? 'text' : 'password'}
                        label="Re-enter new Password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        onChange={onSetNewRepeatPassword}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePasswordVisibility} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        className="form-item"
                        type="submit"
                        disabled={updatingPassword || !isValid}
                        onClick={updatePassword}
                    >
                        {updatingPassword ? 'Updating Password' : 'Update Password'}
                    </Button>
                    {error && (
                        <div className="form-item">
                            {error.split('.').map((errMsg, index) => (
                                <Typography key={index} color="error">
                                    {errMsg}
                                </Typography>
                            ))}
                        </div>
                    )}
                </>
            )}
            <Typography variant="body2" className="form-item">
                <a onClick={returnToLoginScreen}>Back to Login</a>
            </Typography>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={handleSnackbarClose} severity={snackBarSeverity} variant="filled" sx={{width: '100%'}}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        </>
    );
};
