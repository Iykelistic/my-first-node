import db from '../dbconnection';

const checkUser = (req, res, next) => {
    const { id } = req.params;

    db.query('SELECT * FROM users WHERE id = ?', [id], (error, rows) => {
        if (error) {
            return res.status(500).json({
                message: 'Server Error',
                success: false,
                error
            });
        }

        if (rows.length < 1) {
            res.status(404).json({
                message: 'User does not exist',
                success: false
            })
        } else {
            req.user = rows[0];
            next();
        }
    });
};

export default checkUser;