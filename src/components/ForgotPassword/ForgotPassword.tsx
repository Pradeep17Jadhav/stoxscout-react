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
    const {showSnackBar} = useAlert();
    const [email, setEmail] = useState('');
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
        navigate('/login');
    }, [clearForm, navigate]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const generateOtp = useCallback(async () => {
        setGeneratingOtp(true);
        forgotPasswordAPI(email)
            .then(() => {
                showSnackBar(`OTP sent to ${email}`);
                setOtpGenerated(true);
            })
            .catch((error: any) => {
                showSnackBar(error.message, 'error');
                clearForm();
            })
            .finally(() => setGeneratingOtp(false));
    }, [clearForm, email, showSnackBar]);

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
                showSnackBar(error.message, 'error');
            })
            .finally(() => setVerifyingOtp(false));
    }, [email, otp, showSnackBar]);

    const updatePassword = useCallback(async () => {
        setUpdatingPassword(true);
        updatePasswordAPI(resetToken, password)
            .then(() => {
                showSnackBar('Password updated successfully! Redirecting you to login page in 5 seconds!');
                clearForm();
                setTimeout(() => returnToLoginScreen(), 5000);
            })
            .catch((error: any) => {
                showSnackBar(error.message, 'error');
                returnToLoginScreen();
            })
            .finally(() => setUpdatingPassword(false));
    }, [resetToken, password, showSnackBar, clearForm, returnToLoginScreen]);

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
        <div className="elevated-container">
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
            <Typography className="form-item" variant="body2" onClick={returnToLoginScreen}>
                <span className="text-link">Back to Login</span>
            </Typography>
        </div>
    );
};
