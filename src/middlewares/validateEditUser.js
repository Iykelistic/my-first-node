const validateEditUser = (req, res, next) => {
    console.log(!req.body.firstName);
    console.log(req.body.firstName.trim() === '');
    if (!!req.body.firstName && req.body.firstName.trim() === '') {
        res.status(400).json({
            message: 'You must enter your first name',
            success: false
        });
    } else if (!!req.body.lastName && req.body.lastName.trim() === '') {
        res.status(400).json({
            message: 'You must enter your last name',
            success: false
        });
    } else {
        next();
    }
};

export default validateEditUser;