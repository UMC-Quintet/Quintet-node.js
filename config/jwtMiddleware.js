const jwt = require('./jwtModules');
const {response, errResponse} = require('./response');
const baseResponse = require('./baseResponseStatus');
const dotenv = require('dotenv');
dotenv.config()

exports.authJWT = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ')[1];
        if (!token) //토큰 없음
            return res.send(errResponse(baseResponse.TOKEN_NOT_EXIST));

        const payload = await jwt.accessVerify(token);
        if (payload.valid === false) { //토큰 유효 X
            if (payload.message === 'expired token') {
                console.log('jwtMiddleware - expired token');
                return res.send(errResponse(baseResponse.EXPIRED_TOKEN));

            } else if (payload.message === 'invalid token') {
                console.log('jwtMiddleware - invalid token');
                return res.send(errResponse(baseResponse.INVALID_TOKEN));

            } else {
                console.log('jwtMiddleware - token err');
                return res.send(errResponse(baseResponse.INVALID_TOKEN));
            }

        } else {
            if (payload.id === undefined) {
                console.log('jwtMiddleware - id undefined');
                return res.send(errResponse(baseResponse.INVALID_TOKEN));
            }
        }

        req.user_id = payload.id;
        next();
    }
}