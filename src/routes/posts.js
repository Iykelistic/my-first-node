import express from 'express';
import middlewares from '../middlewares';
import { postsValidate, postIdValidate,  } from '../middlewares/validation';
import { addPost, getAllPosts, getPost, updatePost, deletePost } from '../controllers/posts';
import upload from '../upload';

const { tokenValidate } = middlewares;

const postsRouter = express.Router();

postsRouter.post('/', tokenValidate, upload.single('image'), postsValidate, addPost);
postsRouter.get('/', tokenValidate, getAllPosts);
postsRouter.get('/:id', tokenValidate, postIdValidate, getPost);
postsRouter.patch('/:id', tokenValidate, upload.single('image'), updatePost);
postsRouter.delete('/:id', tokenValidate, deletePost);


export default postsRouter;