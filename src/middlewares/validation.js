import { body, param } from 'express-validator';

export const signupValidate = [
    body('email').exists().trim().isEmail().normalizeEmail().withMessage('Please enter a valid email'), 
    body('firstName').exists().trim().withMessage('Please enter your first name'), 
    body('lastName').exists().trim().withMessage('Please enter your lastname'), 
    body('username').exists().trim().withMessage('Please enter your username'),
    body('password').exists().trim().isLength({ min: 8 }).withMessage('Please enter a password with at least eight (8) characters')
];

export const loginValidate = [
    body('username').exists().trim().withMessage('Please enter your username'),
    body('password').exists().trim().withMessage('Please enter your password')
];

export const postsValidate = [
    body('text').exists().trim().withMessage('You cannot submit an empty post')
];

export const postIdValidate = [
    param('id').isInt().withMessage('Your post ID is invalid')
];

export const forgotPasswordValidate = [
    body('username').exists().trim().withMessage('Please enter your username')
];

export const resetPasswordValidate = [
    body('token').exists().trim().withMessage('Please enter your reset token'),
    body('password').exists().trim().isLength({ min: 8 }).withMessage('Please enter a password with at least eight (8) characters')
];

/*export const updateidValidate = [
    param('id').isInt().withMessage('Your ID is invalid')
]*/