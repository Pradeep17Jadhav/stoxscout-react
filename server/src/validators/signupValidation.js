const {body} = require('express-validator');

const signupValidation = [
    body('name').isLength({min: 6, max: 50}),
    body('username').isLength({min: 6, max: 30}),
    body('email').isEmail().normalizeEmail(),
    body('password')
        .isLength({min: 8})
        .withMessage('Password must be at least 8 characters long.')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter.')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter.')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number.')
        .matches(/[\W_]/)
        .withMessage('Password must contain at least one special character.')
];

module.exports = {signupValidation};
