const JWT = require('jsonwebtoken');

async function generateToken(user, secretTokenKey, tokenLife) {
    try {
        return await JWT.sign(user, secretTokenKey,
            {
                algorithm: 'HS256',
                expiresIn: tokenLife
            })
    } catch (error) {
        throw Error(error.message)
    }
}

async function verifyToken(token, secretTokenKey) {
    try {
        return JWT.verify(token, secretTokenKey);
    } catch (error) {
        throw Error(error.message)
    }
}

module.exports ={
    generateToken,
    verifyToken
}