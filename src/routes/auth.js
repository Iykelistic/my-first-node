import express from 'express';
import { signupValidate, loginValidate, forgotPasswordValidate, resetPasswordValidate } from '../middlewares/validation';
import { signup, login, forgotPassword, resetPassword } from '../controllers/auth';

const authRouter = express.Router();

authRouter.post('/signup', signupValidate, signup);
authRouter.post('/login', loginValidate, login);
authRouter.post('/forgot_password', forgotPasswordValidate, forgotPassword);
authRouter.post('/reset_password', resetPasswordValidate, resetPassword);

export default authRouter;