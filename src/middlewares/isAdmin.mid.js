import jwt from "jsonwebtoken"

export const isAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const userData = jwt.verify(token, process.env.SECRET_KEY);
        if(userData.role != 1) {
            return res.json({
                statusCode: 401,
                message: "Bad Auth!"
            })
        }
        next()
    } catch (error) {
        next(error)
    }
}