const passport = require("passport");
const userProvider = require("../provider/userProvider");
const userService = require("../service/userService");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require('dotenv');
const interval = require('./interval');

dotenv.config();

module.exports = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let exUser = await userProvider.getUserBySnsId(profile.id, profile.provider);
                    console.log(exUser);
                    if (exUser) {
                        await userService.updateRefreshToken(exUser.id, refreshToken);
                        await interval.setInterval(interval.startGoogleInterval(refreshToken, exUser));
                        const user = {
                            user_id: exUser.id,
                            username: exUser.username,
                            provider: exUser.provider,
                            accessToken: accessToken,
                        };
                        console.log(user);
                        done(null, user);
                    } else {
                        console.log("해당 유저 없음");
                        await userService.insertNewUser(profile.displayName, profile._json.email, profile.provider, refreshToken, profile.id);
                        const newUser = await userProvider.getUserBySnsId(profile.id, profile.provider);
                        await interval.setInterval(interval.startGoogleInterval(refreshToken, newUser));
                        const user = {
                            user_id: newUser.id,
                            username: newUser.username,
                            provider: newUser.provider,
                            accessToken: accessToken,
                        };
                        console.log(user);
                        done(null, user);
                    }
                } catch (err) {
                    console.error("Error inserting user:", err);
                    return done(err, null);
                }
            }
        )
    );
}