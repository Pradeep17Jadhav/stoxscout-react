import {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import TextField from '@mui/material/TextField/TextField';
import Typography from '@mui/material/Typography/Typography';
import Button from '@mui/material/Button/Button';
import InputAdornment from '@mui/material/InputAdornment/InputAdornment';
import IconButton from '@mui/material/IconButton/IconButton';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {forgotPasswordAPI, updatePasswordAPI, verifyOtpAPI} from '../../api/authAPI';
import OTPInput from '../OTPInput/OTPInput';
import {validatePassword} from '../../helpers/authHelpers';
import {useAlert} from '../../hooks/useAlert';

const OTP_LENGTH = 6;

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const {showSnackBar, showLinearProcess, hideLinearProcess} = useAlert();
    const [emailOrUsername, setEmailOrUsername] = useState('');
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
    const [error, setError] = useState<string | null>(null);

    const clearForm = useCallback(() => {
        setOtp('');
        setEmailOrUsername('');
        setShowPassword(false);
        setPassword('');
        setRepeatPassword('');
        setGeneratingOtp(false);
        setOtpGenerated(false);
        setResetToken('');
    }, []);

    const returnToLoginScreen = useCallback(() => {
        clearForm();
        navigate('/login');
    }, [clearForm, navigate]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const generateOtp = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setGeneratingOtp(true);
            showLinearProcess();
            forgotPasswordAPI(emailOrUsername)
                .then(() => {
                    hideLinearProcess();
                    const isEmail = emailOrUsername.indexOf('@') !== -1 && emailOrUsername.indexOf('.') !== -1;
                    const message = `OTP sent to email address ${isEmail ? emailOrUsername : ` associated with ${emailOrUsername}`}`;
                    showSnackBar(message);
                    setOtpGenerated(true);
                })
                .catch((error: any) => {
                    showSnackBar(error.message, 'error');
                    hideLinearProcess(false);
                    clearForm();
                })
                .finally(() => setGeneratingOtp(false));
        },
        [clearForm, emailOrUsername, hideLinearProcess, showLinearProcess, showSnackBar]
    );

    const submitOtp = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            showLinearProcess();
            setVerifyingOtp(true);
            verifyOtpAPI(emailOrUsername, parseInt(otp))
                .then(({resetToken}) => {
                    if (emailOrUsername) {
                        setResetToken(resetToken);
                    }
                    hideLinearProcess();
                })
                .catch((error: any) => {
                    setOtp('');
                    showSnackBar(error.message, 'error');
                    hideLinearProcess(false);
                })
                .finally(() => setVerifyingOtp(false));
        },
        [emailOrUsername, hideLinearProcess, otp, showLinearProcess, showSnackBar]
    );

    const updatePassword = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            showLinearProcess();
            setUpdatingPassword(true);
            updatePasswordAPI(resetToken, password)
                .then(() => {
                    hideLinearProcess();
                    showSnackBar('Password updated successfully! Now you can login with your new credentials.');
                    clearForm();
                    returnToLoginScreen();
                })
                .catch((error: any) => {
                    showSnackBar(error.message, 'error');
                    hideLinearProcess(false);
                    returnToLoginScreen();
                })
                .finally(() => setUpdatingPassword(false));
        },
        [showLinearProcess, resetToken, password, hideLinearProcess, showSnackBar, clearForm, returnToLoginScreen]
    );

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

    const onSetEmail = useCallback((e: any) => setEmailOrUsername(e.target.value), []);
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
        <div className="elevated-container">
            <h2>Reset Password</h2>
            {!resetToken && !otpGenerated && (
                <form onSubmit={generateOtp}>
                    <TextField
                        className="form-item"
                        label="Email or Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={emailOrUsername}
                        onChange={onSetEmail}
                        autoComplete="email"
                        required
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        className="primary-button form-item"
                        type="submit"
                        disabled={!emailOrUsername || generatingOtp}
                    >
                        {generatingOtp ? 'Generating OTP' : 'Generate OTP'}
                    </Button>
                </form>
            )}
            {otpGenerated && !resetToken && (
                <form onSubmit={submitOtp}>
                    <Typography variant="body2" className="form-item">
                        Enter OTP received on your email address
                    </Typography>
                    <OTPInput value={otp} onChange={setOtp} length={OTP_LENGTH} onlyNumber />
                    <Button
                        variant="contained"
                        color="primary"
                        className="primary-button form-item"
                        type="submit"
                        disabled={generatingOtp || otp.length !== OTP_LENGTH}
                    >
                        {verifyingOtp ? 'Verifying' : 'Submit'}
                    </Button>
                </form>
            )}
            {resetToken && (
                <form onSubmit={updatePassword}>
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
                        autoFocus
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
                        className="primary-button form-item"
                        type="submit"
                        disabled={updatingPassword || !isValid}
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
                </form>
            )}
            <Typography className="form-item" variant="body2" onClick={returnToLoginScreen}>
                <span className="text-link">Back to Login</span>
            </Typography>
        </div>
    );
};
