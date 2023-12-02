const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");
const userService = require("../../src/service/userService");
const userProvider = require("../../src/provider/userProvider");
const dotenv = require('dotenv');
const customJWT = require("../../config/jwtModules");

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
        const accessToken = await userProvider.getAccessToken(userInfo.id);
        const refreshToken = await customJWT.refreshSign();
        await userService.updateRefreshToken(userInfo.id, refreshToken);

        return res.header('Authorization', `Bearer ${accessToken}`).send(response(baseResponse.SUCCESS));
    } else {
        return res.send(errResponse(baseResponse.INVALID_TOKEN));
    }
}

exports.patchNickName = async function (req, res) {
    const nickname = req.body.nickname;

    if(nickname.length > 10) {
        return res.send(errResponse(baseResponse.USERNAME_LENGTH))
    } else {
        await userService.updateUserName(req.user_id, nickname);
        return res.send(response(baseResponse.SUCCESS, { username : nickname }));
    }
};

/*exports.deleteUser = async function (req, res) {
    //const user_id = req.user.user_id;
    const user_id = req.query.user_id;
    await userService.deleteUserData(user_id);

    res.redirect('/user/logout');
};*/

exports.postData = async (req, res) => {
    const user_id = req.body.user_id;
    const userLocalData = removeDuplicate(req.body.data);

    const localDataSave = await userService.postLocalData(user_id, userLocalData);

    return res.send(localDataSave);
};