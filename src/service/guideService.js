const {pool} = require("../../config/database");
const guideProvider = require("../provider/guideProvider");
const guideDao = require("../dao/guideDao");
const baseResponse = require("../../config/baseResponseStatus");
const {response, errResponse} = require("../../config/response");

const {connect} = require("http2");
const dotenv = require('dotenv');

dotenv.config()

// Service: Create, Update, Delete 비즈니스 로직 처리

/*
exports.guideApi = async function (parameter) {
    try {

    } catch (err) {

    }
}
*/
