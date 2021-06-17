const auth_helper = require('../helpers/auth.helper')

let isAuth = async (req, res, next) => {
    const tokenFromClient = await req.body.token || req.query.token || req.headers["x-access-token"];
    // console.log(tokenFromClient == "undefined")
    if (tokenFromClient) {
        try {
            const decoded = await auth_helper.verifyToken(tokenFromClient, process.env.SECRET_TOKEN_KEY);
            req.user = decoded
            next();
        } catch (error) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }
    } else {
        return res.status(403).send({
            msg: 'No token provided',
        });
    }
}

module.exports = {
    isAuth
}