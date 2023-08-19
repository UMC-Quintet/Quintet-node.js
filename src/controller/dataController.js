// const dataProvider = require('../provider/dataProvider');

// const updateData = (req, res) => {
//     const data = req.body;

//     if (data.username && data.data) {
//         dataProvider.updateUserData(data.username, data.data);
//         res.json({ message: 'Data updated successfully.' });
//     } else {
//         res.status(400).json({ error: 'Invalid data format.' });
//     }
// };

// const getUserData = (req, res) => {
//     const username = req.params.username;
//     const userData = dataProvider.getUserData(username);
//     res.json(userData);
// };

// module.exports = {
//     updateData,
//     getUserData,
// };

//dataController.js
const bodyParser = require('body-parser');
const dataService = require("../service/dataService");

express().use(bodyParser.json());
express().use(bodyParser.urlencoded({extended : false}));

let localData = [];

exports.postData = async (req, res) => {
    const data = req.body;

    if (data.user_id && data.data) {
        const user_id = data.user_id;
        const userLocalData = data.data;

        // 로컬 데이터 업데이트
        localData = localData.concat(userLocalData);
        const localDataSave = await dataService.data(user_id)

        return res.send(response(baseResponse.SUCCESS, localDataSave));

        //res.json({ message: '데이터 전송 성공' });
    } else {
        res.status(400).json({ error: '데이터 전송 실패' });
    }
};
