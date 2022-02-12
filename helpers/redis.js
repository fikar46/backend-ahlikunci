let redis = require("redis");

var redisclient = redis.createClient();

module.exports = redisclient;
