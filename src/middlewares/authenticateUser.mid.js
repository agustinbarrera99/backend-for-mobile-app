import jwt from "jsonwebtoken"

export const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.json({
            statusCode: 403,
            message: "Bad auth!"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.session =  { user: decoded }
        next()
    } catch (error) {
        next(error)
    }
}