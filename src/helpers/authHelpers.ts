export const validatePassword = (password: string, repeatPassword: string): string => {
    let errors = '';
    if (password.length < 8) {
        errors += 'Password must be at least 8 characters long.';
    }
    if (!/[0-9]/.test(password)) {
        errors += 'Password must contain at least one number.';
    }
    if (!/[a-z]/.test(password)) {
        errors += 'Password must contain at least one lowercase letter.';
    }
    if (!/[A-Z]/.test(password)) {
        errors += 'Password must contain at least one uppercase letter.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors += 'Password must contain at least one special character.';
    }
    if (password !== repeatPassword) {
        errors += 'Both the passwords should match.';
    }
    return errors;
};
