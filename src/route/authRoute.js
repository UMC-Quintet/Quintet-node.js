const passport = require('passport');
const dotenv = require('dotenv');
const auth = require('../controller/authController');

dotenv.config();

module.exports = function (app) {
    //app.get(), app.post() ...
    app.post('/auth/google', auth.loginGoogleUser);


    app.get('/auth/kakao', passport.authenticate("kakao"));
    app.get('/auth/kakao/callback', passport.authenticate('kakao', {failureRedirect: '/home'}),
        (req, res) => {
        res.redirect('/user/login');
    });

    /*app.get('/auth/google', passport.authenticate("google", { scope: ["profile", "email"], accessType: 'offline', prompt: 'consent'}));
    app.get(
        "/auth/google/callback", passport.authenticate("google", { failureRedirect: "/home" }),
        (req, res) => {
            res.redirect("/user/login");
        }
    );

    app.get('/auth/naver', (req, res) => {
        const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_REDIRECT_URI}&state=YOUR_STATE_STRING`;
        res.redirect(naverAuthUrl);
    })
    app.get("/naverLogin", user.naverLogin);*/
}