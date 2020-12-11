import express from 'express';
import usersRouter from './users';
import authRouter from './auth';
import postsRouter from './posts';

const router = express.Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/posts', postsRouter);

export default router;