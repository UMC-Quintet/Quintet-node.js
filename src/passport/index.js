const passport = require('passport');
const userProvider = require('../provider/userProvider');
const kakao = require('./kakaoStrategy');
const google = require('./googleStrategy');
const cachedUser = require("./cachedUser");

module.exports = () => {
    passport.serializeUser((user, done) => {
        cachedUser.setUser(user);
        done(null, user);
    });

    passport.deserializeUser(async(user, done) => {
        try {
            const user = cachedUser.getUser();
            if(user){
                done(null, user);
            } else {
                const fetchedUser = await userProvider.getUserById(user.user_id);
                const userData = {
                    user_id: fetchedUser.id,
                    username: fetchedUser.username,
                    provider: fetchedUser.provider,
                    accessToken: user.access_token
                };
                console.log(`Session for userId: ${user.user_id}`);
                done(null, userData);
            }
        } catch (err) {
            done(err, null);
        }
    });

    kakao();
    google();
}