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