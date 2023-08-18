const express = require('express');
const session = require('express-session')
const compression = require('compression');
const methodOverride = require('method-override');
const passport = require('passport')
const passportConfig = require('../src/passport');
const cookieParser = require('cookie-parser');
var cors = require('cors');

module.exports = function () {
    const app = express();
    passportConfig(app);

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());

    app.use(cookieParser())

    app.use(session({
        secret: 'quintet secret value',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000
        },
        rolling: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/', () => {
        console.log("루트 페이지로 접속하셨습니다.");
    });

    require('../src/route/guideRoute')(app);
    require('../src/route/staticRoute')(app);
    require('../src/route/recordRoute')(app);
    require('../src/route/authRoute')(app);
    require('../src/route/userRoute')(app);
    require('../src/route/homeRoute')(app);

    return app;
};