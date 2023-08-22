const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");
const userService = require("../../src/service/userService");
const userProvider = require("../../src/provider/userProvider");
const axios = require('axios');
const dotenv = require('dotenv');

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

exports.getUserInfo = async function (req, res) {
    if(req.isAuthenticated()){
        const userData = {
            logged_in: 'true',
            user_id: req.user.user_id,
            username: req.user.username
        }
        res.cookie('userData', JSON.stringify(userData), {maxAge: 7 * 24 * 60 * 60 * 1000}); //일단 7일간 유지되도록 설정
        return res.redirect('/home');
    } else {
        return res.send(errResponse(baseResponse.USER_UNAUTHORIZED));
    }
};

exports.patchUserName = async function (req, res) {
    /*const username = req.user.username;
    const user_id = req.user.user_id;*/
    const {user_id, username} = req.body;

    if(username.length > 10) {
        return res.send(errResponse(baseResponse.USERNAME_LENGTH))
    } else {
        await userService.updateUserName(user_id, username);
        return res.send(response(baseResponse.SUCCESS, { username : username }));
    }
};

exports.deleteUser = async function (req, res) {
    //const user_id = req.user.user_id;
    const user_id = req.query.user_id;
    await userService.deleteUserData(user_id);

    res.redirect('/user/logout');
};

exports.postData = async (req, res) => {
    const user_id = req.body.user_id;
    const userLocalData = removeDuplicate(req.body.data);

    const localDataSave = await userService.postLocalData(user_id, userLocalData);

    return res.send(localDataSave);
};

exports.naverLogin = async (req, res) => {
    const code = req.query.code;

    const tokenResponse = await axios.post(
        "https://nid.naver.com/oauth2.0/token",
        qs.stringify({
            grant_type: "authorization_code",
            client_id: process.env.NAVER_CLIENT_ID,
            client_secret: process.env.NAVER_CLIENT_SECRET,
            code: code,
            state: "YOUR_STATE_STRING",
            redirect_uri: process.env.NAVER_REDIRECT_URI,
        })
    );
    const  accessToken = tokenResponse.data.access_token; //TODO: 갱신 로직 추가

    const userInfoResponse = await axios.get(
        "https://openapi.naver.com/v1/nid/me",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const userInfo = userInfoResponse.data.response;
    let exUser = await userProvider.getUserBySnsId(userInfo.id, 'naver');
    if(exUser) {
        const user = {
            user_id: exUser.id,
            username: exUser.username,
            provider: exUser.provider,
            accessToken: accessToken,
        };

        req.user = user;
    } else {
        console.log("해당 유저 없음");
        await userService.insertNewUser(userInfo.nickname, userInfo.email, 'naver', 'refreshtokens', userInfo.id); //refreshToken을 어떻게 발급받는지 몰라서 일단 임의의 값을 넣도록 함
        const newUser = userProvider.getUserBySnsId(userInfo.id, 'naver');
        const user = {
            user_id: newUser.id,
            username: newUser.username,
            provider: newUser.provider,
            accessToken: accessToken,
        };
        req.user = user;
    }


    return res.redirect('/user/login');
};