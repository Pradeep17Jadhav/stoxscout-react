import {authRequest, HttpMethod, request} from '.';
import {endpoints} from './apiConfig';

const registerAPI = async (name: string, username: string, email: string, password: string) => {
    const {response, data} = await request(endpoints.register, {
        method: HttpMethod.POST,
        body: {name, username, email, password}
    });

    if (response.status === 204) return null;

    if (response.status === 400) {
        if (data.type === 'validation') {
            const messages = data.errors
                .map((err: any) => {
                    switch (err.type) {
                        case 'name_required':
                            return 'Name is required.';
                        case 'username_required':
                            return 'Username is required.';
                        case 'email_required':
                            return 'Email is required.';
                        case 'password_required':
                            return 'Password is required.';
                        case 'password_too_short':
                            return 'Password must be at least 8 characters long.';
                        case 'password_no_lowercase':
                            return 'Password must contain at least one lowercase letter.';
                        case 'password_no_uppercase':
                            return 'Password must contain at least one uppercase letter.';
                        case 'password_no_number':
                            return 'Password must contain at least one number.';
                        case 'password_no_special':
                            return 'Password must contain at least one special character.';
                        default:
                            return 'Please correct the errors in your submission.';
                    }
                })
                .join(' ');
            throw new Error(messages);
        } else {
            if (data.type === 'username_taken') {
                throw new Error('Username is already taken.');
            }
            if (data.type === 'email_taken') {
                throw new Error('Email is already in use.');
            }
            throw new Error('Invalid input. Please check your data and try again.');
        }
    }
    if (response.status === 409) {
        throw new Error('A conflict occurred. Please try again.');
    }
    if (!response.ok) {
        throw new Error('Signup failed. Please try again later.');
    }
    return data;
};

const loginAPI = async (username: string, password: string) => {
    const {response, data} = await request(endpoints.login, {
        method: HttpMethod.POST,
        body: {username, password}
    });
    if (response.status === 204) return null;
    if (response.status === 401) {
        throw new Error('Invalid username or password. Please try again');
    }
    if (!response.ok) {
        throw new Error('Login failed. Please try again');
    }
    return data;
};

const logoutAPI = async () => {
    const {data} = await authRequest(endpoints.logout, {
        method: HttpMethod.POST
    });
    return data;
};

const forgotPasswordAPI = async (emailOrUsername: string) => {
    const {response, data} = await request(endpoints.forgotPassword, {
        method: HttpMethod.POST,
        body: {emailOrUsername}
    });
    if (response.status === 404) {
        throw new Error(`Invalid email or username. No user is not registered with ${emailOrUsername}`);
    }
    if (!response.ok || response.status === 500) {
        throw new Error('Cannot send OTP to your email address. Please try later.');
    }
    return data;
};

const verifyOtpAPI = async (emailOrUsername: string, otp: number) => {
    const {response, data} = await request(endpoints.verifyOtp, {
        method: HttpMethod.POST,
        body: {emailOrUsername, otp}
    });
    if (response.status === 400) {
        throw new Error('Incorrect OTP entered. Please enter correct OTP.');
    }
    if (response.status === 404) {
        throw new Error(`Invalid email or username. No user is not registered with ${emailOrUsername}`);
    }
    if (!response.ok || response.status === 500) {
        throw new Error('Could not verify OTP to the email address. Please try later.');
    }
    return data;
};

const updatePasswordAPI = async (resetToken: string, newPassword: string) => {
    const {response, data} = await request(endpoints.updatePassword, {
        method: HttpMethod.POST,
        body: {resetToken, newPassword}
    });
    if (response.status === 400 || response.status === 404) {
        throw new Error('Invalid attempt! Please try again.');
    }
    if (!response.ok || response.status === 500) {
        throw new Error('Could not update the password. Please try later.');
    }
    return data;
};

export {registerAPI, loginAPI, logoutAPI, forgotPasswordAPI, verifyOtpAPI, updatePasswordAPI};
