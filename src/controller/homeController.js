//homeController.js
const homeProvider = require("../provider/homeProvider");
const {response, errResponse} = require("../../config/response");
const baseResponse = require("../../config/baseResponseStatus");

// 입력한 날짜가 포함된 한 주의 시작 날짜와 끝 날짜를 계산하는 함수
function getWeekRange() {
  const date = new Date();
  const day = date.getDay(); // 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  const diff = date.getDate() - day + (day === 0 ? -6 : 0); // 해당 주의 첫 날짜
  const startOfWeek = new Date(date.setDate(diff));

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6); // 해당 주의 마지막 날짜

  return { start: startOfWeek, end: endOfWeek };
}

exports.getHome = async function getQuintetCheckRecordsAPI(req, res) {
  try {
    const userId = req.query.user_id;
    const { start, end } = getWeekRange();
    const quintetCheckResult = await homeProvider.retrieveQuintetCheck(userId, start, end);
    const result = {
      user_id : userId,
      startOfWeek : start,
      endOfWeek : end,
      weeklyData : quintetCheckResult
    }

    return res.send(response(baseResponse.SUCCESS, result));
  } catch (error) {
    console.log(error);
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
}


