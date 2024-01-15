const {errResponse} = require("../../config/response");
const baseResponse = require("../../config/baseResponseStatus");
const axios = require("axios");
const userProvider = require("../provider/userProvider");
const {authChecker} = require("../../config/jwtMiddleware");
const user = require("../controller/userController");

module.exports = function (app) {
    //app.get(), app.post() ...
    app.post('/auth/refresh', authChecker, user.refresh);

    app.get('/user', authChecker, user.getProfile);

    app.patch('/user', authChecker, user.patchNickName);

    app.get('/user/logout', authChecker, user.logOut);

    app.get('/user/delete', authChecker, user.deleteUser);

    app.post('/user/data', authChecker, user.postData); //비회원->회원 전환 라우트
}