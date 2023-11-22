const {response, errResponse} = require("../../config/response");
const baseResponse = require("../../config/baseResponseStatus");
const {OAuth2Client} = require('google-auth-library');
const appleAuth = require('apple-auth');
const appleConfig = require('../../config/apple.json');
const auth = new appleAuth(appleConfig, appleConfig.private_key_path);
const userProvider = require("../provider/userProvider");
const userService = require("../service/userService");
const dotenv = require("dotenv");
const jwt = require('../../config/jwtModules');

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.loginGoogleUser = async function (req, res) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const googleId = payload['sub']; //유저의 구글 SnsId

        let exUser = await userProvider.getUserBySnsId(googleId, 'google');
        if(exUser){
            console.log(exUser); //해당 유저 존재 시 콘솔 출력
        } else {
            console.log("해당 유저 없음");
            await userService.insertNewUser(payload.name, payload.email, 'google', null, googleId);
        }

        exUser = await userProvider.getUserBySnsId(googleId, 'google');
        const accessToken = await userProvider.getGoogleToken(exUser);

        const refreshToken = await jwt.refreshSign();
        await userService.updateRefreshToken(exUser.id, refreshToken);

        return res.header('Authorization', `Bearer ${accessToken}`).send(response(baseResponse.SUCCESS));

    } catch (e) { //유효성 검증에 실패했을 경우
        console.log(e);
        return res.send(errResponse(baseResponse.INVALID_TOKEN));
    }
};

exports.loginAppleUser = async function (req, res) {
    const idToken = req.body.idToken;
    try {
        const decodedToken = await auth.verifyIdToken(idToken, {
            audience: 'client_id',
            ignoreExpiration: true,
        });
        console.log(decodedToken);
    } catch (e) {
        console.log(e);
        return res.send(errResponse(baseResponse.INVALID_TOKEN));
    }
}

exports.loginTestUser = async function (req, res) {
    const {testSnsId, name, email} = req.body;
    try {
        let exUser = await userProvider.getUserBySnsId(testSnsId, 'test');
        if(exUser){
            console.log(exUser); //해당 유저 존재 시 콘솔 출력
        } else {
            console.log("해당 유저 없음");
            await userService.insertNewUser(name, email, 'test', null, testSnsId);
        }

        exUser = await userProvider.getUserBySnsId(testSnsId, 'test');
        const tokens = await userProvider.getGoogleToken(exUser);
        const refreshToken = await jwt.refreshSign();
        await userService.updateRefreshToken(exUser.id, refreshToken);

        return res.header('Authorization', `Bearer ${tokens}`).send(response(baseResponse.SUCCESS));
    } catch (e) {
        console.log(e);
        return res.send(errResponse(baseResponse.INVALID_TOKEN));
    }
}