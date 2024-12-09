export class AuthError extends Error {
    type: string;

    constructor(type: string) {
        super();
        this.name = 'AuthError';
        this.type = type;
        this.message = 'Unauthorized. Please login again.';

        if (type === 'token_expired') {
            this.message = 'Your login has timed out. Please login again.';
        } else if (type === 'invalid_token') {
            this.message = 'Invalid session. Please login again.';
        } else if (type === 'user_not_found') {
            this.message = 'User not found. Please login again.';
        }

        Object.setPrototypeOf(this, AuthError.prototype);
    }
}
