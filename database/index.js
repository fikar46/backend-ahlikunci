const mysql = require('mysql');
const conn = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'fikar123',
    database:'ahlikunci',
    port: 3306
});  
module.exports = conn;

