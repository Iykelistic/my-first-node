import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import "core-js/stable";
import "regenerator-runtime/runtime";
import db from '../dbconnection';

dotenv.config();

export const signup = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400)[0].json({
            message: errors.array().msg,
            success: false
        });
    }

    db.query('SELECT * FROM auth WHERE username = ?', [req.body.username], (error, rows) => {
        if (error) {
            return res.status(500).json({
                message: 'Server Error',
                success: false,
                error
            })
        }

        if (rows.length > 0) {
            return res.status(409).json({
                message: 'This username already exists',
                success: false
            });
        }

        const { firstName, lastName, email, username, password } = req.body;

        const hashedPassword = bcrypt.hashSync(password, Number(process.env.SALT));

        db.query('INSERT INTO auth (first_name, last_name, email, username, password) VALUES(?, ?, ?, ?, ?)',
        [firstName, lastName, email, username, hashedPassword], (error, rows) => {
            if (error) {
                return res.status(500).json({
                    message: 'Server Error',
                    success: false,
                    error
                })
            }

            const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: 86400 });

            return res.status(201).json({
                message: 'User registered successfully',
                success: true,
                data: {
                    token,
                    firstName,
                    lastName,
                    email,
                    username
                }
            });
        });
    });
};

export const login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            success: false
        });
    }

    db.query('SELECT * FROM auth WHERE username = ?', [req.body.username], (error, rows) => {
        if (error) {
            return res.status(500).json({
                message: 'Server Error',
                success: false,
                error
            })
        }

        if (rows.length < 1) {
            return res.status(400).json({
                message: 'The username or password is incorrect',
                success: false
            });
        }

        const passwordMatch = bcrypt.compareSync(req.body.password, rows[0].password);

        if (!passwordMatch) {
            return res.status(400).json({
                message: 'The username or password is incorrect',
                success: false
            });
        }

        const token = jwt.sign({ username: req.body.username }, process.env.SECRET_KEY, { expiresIn: 86400 });

        return res.status(200).json({
            message: 'User logged in successfully',
            success: true,
            data: {
                token,
                firstName: rows[0].first_name,
                lastName: rows[0].last_name,
                email: rows[0].email,
                username: rows[0].username
            }
        });
    });
};

export const forgotPassword = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            success: false
        });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const { username } = req.body;

    db.query('SELECT * FROM auth WHERE username = ?', [username], (error, rows) => {
        if (error) {
            return res.status(500).json({
                message: 'Server Error',
                success: false,
                error
            })
        }

        if (rows.length < 1) {
            return res.status(404).json({
                message: 'This username does not exist',
                success: false
            });
        }

        const token = Math.floor(Math.random() * 899999) + 100000;
        const expiryDate = new Date(Date.now() + (60000 * 60));

        db.query('INSERT INTO tokens (token, expiry_date, user_id) VALUES (?, ?, ?)', [token, expiryDate, rows[0].id], async (error) => {
            if (error) {
                return res.status(500).json({
                    message: 'Server Error',
                    success: false,
                    error
                })
            }

            const msg = {
                to: rows[0].email, // Change to your recipient
                from: 'ikechukwujames902@gmail.com', // Change to your verified sender
                templateId: process.env.VERIFY_EMAIL_TEMPLATE,
                dynamicTemplateData: {
                    name: rows[0].first_name,
                    token: token
                }
            };
    
            try {
                await sgMail.send(msg);
            
                console.log('Email sent');
        
                return res.status(200).json({
                    message: `Check your email for your reset token, it expires in one hour`,
                    success: true
                });
            } catch (error) {
                console.error(error);
            }
        });
    });
};

export const resetPassword = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            success: false
        });
    }

    db.query('SELECT * FROM tokens WHERE token = ?', [Number(req.body.token)], (error, rows) => {
        if (error) {
            return res.status(500).json({
                message: 'Server Error',
                success: false,
                error
            })
        }

        if (rows.length < 1) {
            return res.status(400).json({
                message: 'Invalid token',
                success: false
            });
        }

        if (new Date() > new Date(rows[0].expiry_date)) {
            return res.status(400).json({
                message: 'The token has expired',
                success: false
            });
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, Number(process.env.SALT));

        const param = { password: hashedPassword };

        db.query('UPDATE auth SET ? WHERE id = ?', [param, rows[0].user_id], (error) => {
            if (error) {
                return res.status(500).json({
                    message: 'Server Error',
                    success: false,
                    error
                })
            }

            db.query('DELETE FROM tokens WHERE token = ?', [Number(req.body.token)], (error) => {
                if (error) {
                    return res.status(500).json({
                        message: 'Server Error',
                        success: false,
                        error
                    })
                }

                return res.status(200).json({
                    message: 'Your password has been reset successfully',
                    success: true
                });
            });
        });
    });
};