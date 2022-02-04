let redis = require("redis");

var redisclient = redis.createClient({
    legacyMode: true
});
(async () => {
    await redisclient.connect();
})();

module.exports = redisclient;
