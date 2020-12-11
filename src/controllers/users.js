import db from '../dbconnection';

export const getUsers = (req, res) => {

    db.query('SELECT * FROM users', (error, rows) => {
        if (error) {
            return res.status(500).json({
                message: 'Server Error',
                success: false,
                error
            })
        }

        return res.status(200).json({
            message: 'Users retrieved successfully',
            success: true,
            data: req.user
        });
    });
};

export const getUser = (req, res) => {
    return res.status(200).json({
        message: 'User retrieved successfully',
        success: true,
        data: req.user
    });
};

export const addUser = (req, res) => {
    db.query('SELECT * FROM users WHERE firstName = ? AND lastName = ?', [req.body.firstName, req.body.lastName], (error, rows) => {
        if (error) {
            return res.status(500).json({
                message: 'Server Error',
                success: false,
                error
            })
        }

        if (rows.length > 0) {
            return res.status(409).json({
                message: 'User already exists',
                success: false
            });
        }

        db.query('INSERT INTO users (firstName, lastName) VALUES(?, ?)',
            [req.body.firstName.trim(), req.body.lastName.trim()],
            (error, rows) => {
                if (error) {
                    return res.status(500).json({
                        message: 'Server Error',
                        success: false,
                        error
                    })
                }

                return res.status(201).json({
                    message: 'User added successfully',
                    success: true
                });
        });

    });
};

export const updateUser = (req, res) => {
    const { id } = req.params;

    // const userIndex = users.findIndex(myUser => myUser.id === Number(id));

    // const updatedUser = {...users[userIndex]};

    // if (req.body.firstName && req.body.firstName.trim()) updatedUser.firstName = req.body.firstName;
    // if (req.body.lastName && req.body.lastName.trim()) updatedUser.lastName = req.body.lastName;

    // users.splice(userIndex, 1, updatedUser);

    const entries = {};

    if (req.body.firstName && req.body.firstName.trim()) entries.firstName = req.body.firstName;
    if (req.body.lastName && req.body.lastName.trim()) entries.lastName = req.body.lastName;

    db.query('UPDATE users SET ? WHERE id = ?', [entries, id], (error, rows) => {
        if (error) {
            return res.status(500).json({
                message: 'Server Error',
                success: false,
                error
            })
        }

        return res.status(200).json({
            message: 'User updated successfully',
            success: true
        });
    });
};

export const deleteUser = (req, res) => {
    const { id } = req.params;

    // onst userIndex = users.findIndex(myUser => myUser.id === Number(id));

    // users.splice(userIndex, 1);

    db.query('DELETE FROM users WHERE id = ?', [id], (error, rows) => {
        if (error) {
            return res.status(500).json({
                message: 'Server Error',
                success: false,
                error
            })
        }

        return res.status(200).json({
            message: 'User deleted successfully',
            success: true
        })
    });
};