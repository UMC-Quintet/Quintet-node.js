const {response, errResponse} = require("../../config/response");
const baseResponse = require("../../config/baseResponseStatus");
const {OAuth2Client} = require('google-auth-library');
const userProvider = require("../provider/userProvider");
const userService = require("../service/userService");
const dotenv = require("dotenv");
const customJWT = require('../../config/jwtModules');
const jwt = require('jsonwebtoken');
const jwksClient = require("jwks-rsa");
const redisClient = require('../../config/redisConfig');

dotenv.config();

// 구글 로그인
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.loginGoogleUser = async function (req, res) {
    let googleId = null;
    let name = null;
    let email = null;

    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        googleId = payload['sub']; //유저의 구글 SnsId
        name = payload.name;
        email = payload.email;

    } catch (e) { //유효성 검증에 실패했을 경우
        console.log(e);
        return res.send(errResponse(baseResponse.INVALID_TOKEN));
    }

    try {
        let exUser = await userProvider.getUserBySnsId(googleId, 'google');
        if(exUser){
            console.log(exUser); //해당 유저 존재 시 콘솔 출력
        } else {
            console.log("해당 유저 없음");
            await userService.insertNewUser(name, name, email, 'google', null, googleId);
        }

        exUser = await userProvider.getUserBySnsId(googleId, 'google');
        const accessToken = await userProvider.getAccessToken(exUser);

        const refreshToken = await customJWT.refreshSign();
        await userService.updateRefreshToken(exUser.id, refreshToken);

        return res.header('Authorization', `Bearer ${accessToken}`).send(response(baseResponse.SUCCESS));

    } catch (e) {
        console.log('loginGoogleUser join: ' + e);
        return res.send(errResponse(baseResponse.DB_ERROR));
    }
};

// 애플 로그인
const verifyDecode = (decode) => {
    return (
        decode.iss === "https://appleid.apple.com" &&
        decode.aud === process.env.APPLE_CLIENT_ID &&
        Date.now() / 1000 <= decode.exp
    )
}
exports.loginAppleUser = async function (req, res) {
    const { username, email, idToken } = req.body.idToken;
    let appleId = null;
    try {
        const client = await jwksClient({
            jwksUri: 'https://appleid.apple.com/auth/keys'
        });
        const tokenHeader = jwt.decode(idToken.split('.')[0]);
        const tokenKid = tokenHeader.kid;
        const key = await client.getSigningKey(tokenKid);
        const publicKey = key.getPublicKey();

        const decode = jwt.verify(idToken, publicKey);
        console.log(decode); //TODO: nonce 값이 뭔지 확인하기

        if (verifyDecode(decode))
            appleId = decode.sub;

    } catch (e) {
        console.log('loginAppleUser verify: ' + e);
        return res.send(errResponse(baseResponse.INVALID_TOKEN));
    }

    try {
        let exUser = await userProvider.getUserBySnsId(appleId, 'apple');
        if(exUser){
            console.log(exUser); //해당 유저 존재 시 콘솔 출력
        } else {
            console.log("해당 유저 없음");
            await userService.insertNewUser(username, username, email, 'apple', null, appleId);
        }

        exUser = await userProvider.getUserBySnsId(appleId, 'apple');
        const accessToken = await userProvider.getAccessToken(exUser);

        const refreshToken = await customJWT.refreshSign();
        await userService.updateRefreshToken(exUser.id, refreshToken);

        return res.header('Authorization', `Bearer ${accessToken}`).send(response(baseResponse.SUCCESS));
    } catch (e) {
        console.log('loginAppleUser join: ' + e);
        return res.send(errResponse(baseResponse.DB_ERROR));
    }
}

// 테스트 로그인
exports.loginTestUser = async function (req, res) {
    const {testSnsId, name, email} = req.body;
    try {
        let exUser = await userProvider.getUserBySnsId(testSnsId, 'test');
        if(exUser){
            console.log(exUser); //해당 유저 존재 시 콘솔 출력
        } else {
            console.log("해당 유저 없음");
            await userService.insertNewUser(name, name, email, 'test', null, testSnsId);
        }

        exUser = await userProvider.getUserBySnsId(testSnsId, 'test');
        const tokens = await userProvider.getAccessToken(exUser);
        const refreshToken = await customJWT.refreshSign();
        await redisClient.set(`${exUser.id}`, `${refreshToken}`, { EX: 365 * 24 * 60 * 60 }); //1년 만료
        const expire = await redisClient.ttl(`${exUser.id}`);
        console.log(expire);
        const testval = await redisClient.get(`${exUser.id}`);
        console.log(testval);
        //await userService.updateRefreshToken(exUser.id, refreshToken);

        return res.header('Authorization', `Bearer ${tokens}`).send(response(baseResponse.SUCCESS));
    } catch (e) {
        console.log(e);
        return res.send(errResponse(baseResponse.INVALID_TOKEN));
    }
}