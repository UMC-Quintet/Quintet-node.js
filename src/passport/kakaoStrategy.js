const dotenv = require('dotenv');
const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const userProvider = require("../provider/userProvider");
const userService = require("../service/userService");
const interval = require("./interval");

dotenv.config();

module.exports = () => {
    passport.use(
        new KakaoStrategy({
            clientID: process.env.KAKAO_REST_API_KEY,
            callbackURL: process.env.KAKAO_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let exUser = await userProvider.getUserBySnsId(profile.id, profile.provider);
                interval.setInterval(interval.startKakaoInterval(refreshToken, exUser));
                if (exUser) {
                    const user = {
                        user_id: exUser.id,
                        username: exUser.username,
                        provider: exUser.provider,
                        accessToken: accessToken,
                    };
                    done(null, user);
                } else {
                    console.log("해당 유저 없음");
                    await userService.insertNewUser(profile.username, profile._json.kakao_account.email, profile.provider, refreshToken, profile.id);
                    const newUser = userProvider.getUserBySnsId(profile.id, profile.provider);
                    interval.setInterval(interval.startKakaoInterval(refreshToken, newUser));
                    const user = {
                        user_id: newUser.id,
                        username: newUser.username,
                        provider: newUser.provider,
                        accessToken: accessToken,
                    };
                    done(null, user);
                }
            } catch (error) {
                console.log(error)
                done(error)
            }
        })
    );
}

