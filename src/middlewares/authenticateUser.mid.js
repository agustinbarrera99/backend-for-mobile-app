export const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({
            statusCode: 403,
            message: "Bad auth!"
        });
    }
    try {
        next();
    } catch (error) {
        next(error)
    }
};