import { validationResult } from 'express-validator';
import { v2 as cloudinary } from 'cloudinary';
import "core-js/stable";
import "regenerator-runtime/runtime";
import db from '../dbconnection';

export const addPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            success: false
        });
    }

    if (!req.file.path.endsWith('.jpg') && !req.file.path.endsWith('.png') && !req.file.path.endsWith('jpeg')) {
        return res.status(400).json({
            message: 'File type must be jpg, png or jpeg',
            success: false
        });
    }

    // const filePathList = req.file.path.split('\\');
    // filePathList.shift();
    // const filePath = filePathList.join('\\');

    const result = await cloudinary.uploader.upload(req.file.path);

    db.query('INSERT INTO posts (text, user_id, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', [req.body.text, req.user.id, result.secure_url, new Date(), new Date()], (error, rows) => {
        if (error) {
            return res.status(500).json({
                message: 'Server Error',
                success: false,
                error
            })
        }

        return res.status(201).json({
            message: 'Post added successfully',
            success: true
        });
    });
};

export const getAllPosts = (req, res) => {
    db.query('SELECT * FROM posts', (error, rows) => {
        if (error) {
            return res.status(500).json({
                message: 'Server Error',
                success: false,
                error
            })
        }

        return res.status(200).json({
            message: 'Posts gotten successfully',
            success: true,
            data: rows
        });
    });
};

export const getPost = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            success: false
        });
    }

    db.query('SELECT * FROM posts WHERE id = ?', [req.params.id], (error, rows) => {
        if (error) {
            return res.status(500).json({
                message: 'Server Error',
                success: false,
                error
            })
        }

        if (rows.length < 1) {
            return res.status(404).json({
                message: 'Post does not exist',
                success: false
            });
        }

        return res.status(200).json({
            message: 'Post gotten successfully',
            success: true,
            data: rows[0]
        });
    });
};

export const updatePost = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            success: false
        });
    }

    db.query('SELECT * FROM posts WHERE id = ?', [req.params.id], async (error, rows) => {
        if(error) {
            return res.status(500).json({
                message: 'Server Error',
                success: false,
                error
            });
        }
    
        if(rows.length < 1) {
            return res.status(404).json({
                message: 'This post does not exists',
                success: false
            });
        }

        if(rows[0].user_id !== req.user.id) {
            return res.status(403).json({
                message: "You're not authorized to update this post",
                success: false
            });
        }

        let filePath = '';

        if (req.file) {
            if (!req.file.path.endsWith('.jpg') && !req.file.path.endsWith('.png') && !req.file.path.endsWith('jpeg')) {
                return res.status(400).json({
                    message: 'File type must be jpg, png or jpeg',
                    success: false
                });
            }
        
            // const filePathList = req.file.path.split('\\');
            // filePathList.shift();
            // filePath = filePathList.join('\\');

            const result = await cloudinary.uploader.upload(req.file.path);

            filePath = result.secure_url;
        }

        const update = {};

        if (req.body.text && req.body.text.trim()) update.text = req.body.text.trim();
        if (req.file) update.image_url = filePath;
    
        db.query('UPDATE posts SET ?, updated_at = ? WHERE id = ?', [update, new Date(), req.params.id], (error, rows) => {
            if(error) {
                return res.status(500).json({
                    message: 'Server Error',
                    success: false,
                    error
                });
            }
    
            return res.status(200).json({
                message: 'Post updated successfully',
                success: true,
                data: rows[0]
            });
        });
    })    
};



export const deletePost = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            success: false
        });
    }

    db.query('SELECT * FROM posts WHERE id = ?', [req.params.id], (error, rows) => {
        if(error) {
            return res.status(500).json({
                message: 'Server Error',
                success: false,
                error
            });
        }

       if(rows.length < 1) {
           return res.staus(404).json({
               message: 'This post does not exists',
               success: false
           });
       }


       if(rows[0].user_id !== req.user.id) {
           return res.status(403).json({
               message: "You're not allowed to delete this post",
               success: false
           });
       }

       db.query('DELETE FROM posts WHERE id = ?', [req.params.id], (error, rows) => {
           if(error) {
               return res.status(500).json({
                   message: 'Server Error',
                   success: false,
                   error
               })
           }

           return res.status(200).json({
               message: 'Post deleted successfully',
               success: true,
               data: rows[0]
           })

       })
    });
}


