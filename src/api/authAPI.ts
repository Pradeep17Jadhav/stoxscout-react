import {authRequest, HttpMethod, request} from '.';
import {endpoints} from './apiConfig';

const registerAPI = async (name: string, username: string, email: string, password: string) => {
    const response = await request(endpoints.register, {
        method: HttpMethod.POST,
        body: {name, username, email, password}
    });

    if (response.status === 204) return null;

    if (response.status === 400) {
        const errorData = await response.json();
        if (errorData.type === 'validation') {
            const messages = errorData.errors
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
            if (errorData.type === 'username_taken') {
                throw new Error('Username is already taken.');
            }
            if (errorData.type === 'email_taken') {
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
    return response.json();
};

const loginAPI = async (username: string, password: string) => {
    const response = await request(endpoints.login, {
        method: HttpMethod.POST,
        body: {username, password}
    });
    if (response.status === 204) return null;
    if (response.status === 401) {
        throw new Error('Unauthorized: Invalid username or password.');
    }
    if (!response.ok) {
        throw new Error('Login failed');
    }
    return response.json();
};

const logoutAPI = async () => {
    const response = await authRequest(endpoints.logout, {
        method: HttpMethod.POST
    });
    if (response.status === 204) return null;
    if (response.status === 401) {
        throw new Error('Unauthorized: You must be logged in to logout.');
    }
    if (!response.ok) {
        throw new Error('Logout failed');
    }
    return response.json();
};

export {registerAPI, loginAPI, logoutAPI};
