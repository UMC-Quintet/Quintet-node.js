const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");
const userService = require("../../src/service/userService")

exports.getUserInfo = async function (req, res) {
    if(req.isAuthenticated()){
        const userData = {
            logged_in: 'true',
            user_id: req.user.user_id,
            username: req.user.username
        }
        res.cookie('userData', JSON.stringify(userData), {maxAge: 7 * 24 * 60 * 60 * 1000});
        return res.send(response(baseResponse.SUCCESS, userData));
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
        const patchUserNameResult = await userService.updateUserName(user_id, username);
        return res.send(patchUserNameResult)
    }
};

exports.deleteUser = async function (req, res) {
    //const user_id = req.user.user_id;
    const user_id = req.query.user_id;
    await userService.deleteUserData(user_id);

    res.redirect('/user/logout');
};