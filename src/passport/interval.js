const axios = require("axios");
const userService = require("../service/userService");
const cachedUser = require("./cachedUser");
const dotenv = require('dotenv');

dotenv.config();

let intervalObj = null;
module.exports = {
    startKakaoInterval: (refresh_token, user) => {
        return setInterval(async () => {
            try {
                console.log("인터벌로 넘어왔습니다.");
                const url = "https://kauth.kakao.com/oauth/token";
                const data = {
                    grant_type: "refresh_token",
                    client_id: process.env.KAKAO_REST_API_KEY,
                    refresh_token: refresh_token
                }
                await axios.post(url, data, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
                })
                    .then(async function (res) {
                        if (res.data.refresh_token)
                            await userService.updateRefreshToken(user.user_id, res.data.refresh_token);
                        cachedUser.setUser({
                            user_id: user.id,
                            username: user.username,
                            provider: user.provider,
                            accessToken: res.data.access_token
                        });
                        console.log(cachedUser.getUser());
                    })
                    .catch(function(err){
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        }, 5 * 60 * 60 * 1000);
    },

    startGoogleInterval: (refresh_token, user) => {
        return setInterval(async () => {
            try {
                console.log("인터벌로 넘어왔습니다.");
                const url = "https://oauth2.googleapis.com/token";
                const data = {
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    grant_type: "refresh_token",
                    refresh_token: refresh_token
                }
                await axios.post(url, data, {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(async function (res) {
                        cachedUser.setUser({
                            user_id: user.id,
                            username: user.username,
                            provider: user.provider,
                            accessToken: res.data.access_token
                        });
                        console.log(cachedUser.getUser());
                    })
                    .catch(function (err) {
                        console.log(err);
                    });

            } catch (e) {
                console.log(e);
            }
        }, 59 * 60 * 60 * 1000);
    },

    stopInterval: (interval) => {
        clearInterval(interval);
        console.log("accessToken 갱신 중단");
    },

    setInterval: (interval) => {
        intervalObj = interval;
    },

    getInterval: () => intervalObj
}