const {errResponse} = require("../../config/response");
const baseResponse = require("../../config/baseResponseStatus");
const axios = require("axios");
const userProvider = require("../provider/userProvider");

module.exports = function (app) {
    const user = require("../controller/userController");
    //app.get(), app.post() ...

    app.patch('/user', user.patchUserName);

    /*app.get('/user/logout', async function (req, res, next) {
        try {
            if(req.user){
                console.log(typeof(req.user.provider));
                if(req.user.provider === 'kakao'){
                    const userSnsId = userProvider.getSnsID(req.user.user_id);
                    const url = "https://kapi.kakao.com/v1/user/logout";
                    const data = {
                        target_id_type: "user_id",
                        target_id: userSnsId
                    }
                    const logoutRes = await axios.post(url, data, {
                        headers: {'Authorization': `Bearer ${req.user.accessToken}` }
                    });
                    console.log(logoutRes.data.id);
                }
                req.logout((err) => {
                    if (err) {
                        console.error("Error during logout:", err);
                        return next(err);
                    }

                    interval.stopInterval(interval.getInterval());
                    res.clearCookie('userData');
                    req.session.destroy(); // 세션 파괴
                    res.redirect('/');
                });
            } else {
                res.send(errResponse(baseResponse.SESSION_ERROR));
            }
        } catch (err) {
            console.log(`App - Session Error\n : ${err.message}`);
            res.send(errResponse(baseResponse.SESSION_ERROR));
        }
    });*/

    //app.get('/user/delete', user.deleteUser);

    app.post('/user/data', user.postData); //비회원->회원 전환 라우트
}