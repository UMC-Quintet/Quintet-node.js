const redis = require('redis');
const client = redis.createClient({legacyMode: true});

client.on('connect', () => {
    console.log('redisConfig 연결에 성공했습니다.');
});
client.on('error', () => {
    console.log('redisConfig 연결 중 에러가 발생했습니다.');
});
client.connect().then();

const redisClient = client.v4;

module.exports = redisClient;