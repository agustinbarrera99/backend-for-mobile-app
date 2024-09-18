export const isAuth = (req, res, next) => {
    try {
        if(!req.session.user) {
            return res.json({
                statusCode: 401,
                message: "Bad auth!"
            })
        }
        next()
    } catch (error) {
        next(error)
    }
}