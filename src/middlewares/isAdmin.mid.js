export const isAdmin = (req, res, next) => {
    try {
        if(req.user.role != 1) {
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