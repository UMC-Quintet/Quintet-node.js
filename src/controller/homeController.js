//homeController.js
//const quintetCheckRecords = require('./sampleDB');
const homeProvider = require("../../app/Home/homeProvider");


// 입력한 날짜가 포함된 한 주의 시작 날짜와 끝 날짜를 계산하는 함수
function getWeekRange(dateString) {
  const date = new Date(dateString);
  const day = date.getDay(); // 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 해당 주의 첫 날짜
  const startOfWeek = new Date(date.setDate(diff));

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6); // 해당 주의 마지막 날짜

  return { start: startOfWeek, end: endOfWeek };
}



exports.getHome = async function getQuintetCheckRecordsAPI(req, res) {
  try {
    const userId = req.query.user_id;
    const date = req.query.date;
    const { start, end } = getWeekRange(date);
    const quintetCheckResult = await homeProvider.retrieveQuintetCheck();
    const records = quintetCheckResult.filter(
      (record) =>
        record.user_id === userId &&
        new Date(record.date) >= start && // 해당 주의 시작 날짜보다 크거나 같고
        new Date(record.date) <= end // 해당 주의 끝 날짜보다 작거나 같은 기록을 필터링
    );
    


    if (records) {
      return res.status(200).json({
        isSuccess: true,
        code: 200,
        message: "Success",
        result: records,
      });
    } else {
      return res.status(404).json({
        isSuccess: false,
        code: 404,
        message: "No records found",
        result: [],
      });
    }
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      code: 500,
      message: "Server Error",
      result: [],
    });
  }
}


