
require('dotenv').config()
const jwt = require("jsonwebtoken")

const { JWT_SECRET, JWT_TIME } = process.env

const signToken = (data) => {
    return jwt.sign(
        data,
        String(JWT_SECRET),
        {
            algorithm: 'HS256',
            expiresIn: JWT_TIME
        }
    )
}

const verifyToken = (token) => {
    //return jwt.verify(token, String(JWT_SECRET))

    try {
        const decoded = jwt.verify(token, String(JWT_SECRET));
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, message: 'Contraseña mal ingresada' };
    }
}

const decodeToken = (token) => {
    return jwt.decode(token)
}

const getHeadersToken = (req) => {
    const Authorization = req.header("Authorization")

    return Authorization.split("Bearer ")[1] // "Bearer <token>" [bearer, token]
}

module.exports = {
    signToken,
    verifyToken,
    decodeToken,
    getHeadersToken
}