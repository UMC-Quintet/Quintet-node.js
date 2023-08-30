const {response, errResponse} = require("../../config/response");
const baseResponse = require("../../config/baseResponseStatus");
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();
const userProvider = require("../provider/userProvider");
const userService = require("../service/userService");
const dotenv = require("dotenv");

dotenv.config();

exports.loginGoogleUser = async function (req, res) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const googleId = payload['sub']; //유저의 구글 SnsId

        let exUser = userProvider.getUserBySnsId(googleId, 'google');
        if(exUser){
            console.log(exUser); //해당 유저 존재 시 콘솔 출력
        } else {
            console.log("해당 유저 없음");
            await userService.insertNewUser(payload.name, payload.email, 'google', refreshToken, googleId);
        }

        exUser = userProvider.getUserBySnsId(googleId, 'google');
        const token = await userProvider.getGoogleToken(exUser);

        return res.send(response(baseResponse.SUCCESS, token));

    } catch (e) { //유효성 검증에 실패했을 경우
        console.log(e);
        return res.send(errResponse(baseResponse.INVALID_TOKEN));
    }
};