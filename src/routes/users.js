import express from 'express';
import { getUser, getUsers, addUser, updateUser, deleteUser } from '../controllers/users';
import middlewares from '../middlewares';

const { checkUser, checkId, validateUser, tokenValidate } = middlewares;

const usersRouter = express.Router();

usersRouter.get('/', tokenValidate, getUsers);
usersRouter.get('/:id', checkId, checkUser, getUser);
usersRouter.post('/', validateUser, addUser);
usersRouter.patch('/:id', checkId, checkUser, updateUser);
usersRouter.delete('/:id', checkId, checkUser, deleteUser);

export default usersRouter;