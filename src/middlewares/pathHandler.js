export const pathHandler = (req, res, next) => {
    console.error(`${req.method} ${req.url} not found path`)
    return res.json({
        statusCode: 404,
        message: `${req.method} ${req.url} not found path`
    })
}