const passport = require('passport')
module.exports = function (app) {
    //app.get(), app.post() ...
    app.get('/auth/kakao', passport.authenticate("kakao"));
    app.get('/auth/kakao/callback', passport.authenticate('kakao', {failureRedirect: '/home'}),
        (req, res) => {
        res.redirect('/user/login');
    });

    app.get('/auth/google', passport.authenticate("google", { scope: ["profile", "email"], accessType: 'offline', prompt: 'consent'}));
    app.get(
        "/auth/google/callback", passport.authenticate("google", { failureRedirect: "/home" }),
        (req, res) => {
            res.redirect("/user/login");
        }
    );

}