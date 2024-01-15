const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");
const userService = require("../../src/service/userService");
const userProvider = require("../../src/provider/userProvider");
const dotenv = require('dotenv');
const customJWT = require("../../config/jwtModules");
const redisClient = require('../../config/redisConfig');

dotenv.config();
function removeDuplicate(arr) {
    const dateMap = new Map();

    for(let i = 0; i < arr.length; i++){
        const item = arr[i];
        const { date } = item;

        if(!dateMap.has(date)) { //map에 없는 날짜일때만
            dateMap.set(date, i); //map에 date:i 저장 -> 겹치는 date를 가지는 뒷 데이터는 map에 못들어옴
        }
    }

    const idx = Array.from(dateMap.values()); //map에 저장된 i로 배열 생성
    const result = [];
    for (let i = 0; i < arr.length; i++){
        if(idx.includes(i)) { //배열에 i가 있으면
            result.push(arr[i]); //result에 arr 값을 추가한다.
        }
    }

    return result;
}

exports.refresh = async function (req, res) {
    const refreshToken = req.body.refreshToken;
    const decode = await customJWT.refreshVerify(refreshToken, req.user_id);
    if (decode.valid) {
        const userInfo = await userProvider.getUserById(req.user_id);
        const accessToken = await userProvider.createAccessToken(userInfo.id); //atk 발급
        const newRefreshToken = await customJWT.refreshSign(); //rtk 발급
        await redisClient.set(`${userInfo.id}`, `${newRefreshToken}`, { EX: 365 * 24 * 60 * 60 }); //rtk 갱신

        return res.header('Authorization', `Bearer ${accessToken}`).send(response(baseResponse.SUCCESS, newRefreshToken));
    } else {
        return res.send(errResponse(baseResponse.INVALID_TOKEN));
    }
}

exports.getProfile = async function (req, res) {
    const userProfile = await userProvider.getUserById(req.user_id);

    return res.send(response(baseResponse.SUCCESS, userProfile));
}

exports.patchNickName = async function (req, res) {
    const nickname = req.body.newNickname;

    if(nickname.length > 10) {
        return res.send(errResponse(baseResponse.USERNAME_LENGTH));
    } else {
        await userService.updateUserName(req.user_id, nickname);
        const changeNickname = await userProvider.getUserNicknameById(req.user_id);

        return res.send(response(baseResponse.SUCCESS, changeNickname));
    }
};

exports.logOut = async function (req, res) {
    try {
        localStorage.removeItem(`${req.user_id}`);

        return res.send(response(baseResponse.SUCCESS));
    } catch (err) {
        console.log('App - Log Out Err: ' + err);
        return res.send(errResponse(baseResponse.LOG_OUT_ERROR));
    }
}

exports.deleteUser = async function (req, res) {
    const deleteUserResult = await userService.deleteUserData(req.user_id);

    return res.send(deleteUserResult);
};

exports.postData = async (req, res) => {
    const user_id = req.user_id;
    const userLocalData = removeDuplicate(req.body.data);

    const localDataSave = await userService.postLocalData(user_id, userLocalData);

    return res.send(localDataSave);
};