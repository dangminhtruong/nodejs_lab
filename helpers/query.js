var conn = require('../database/connectdb');
var tada = null;
module.exports = (sql,sess, req, res) => {
    connection = conn();
    connection.connect();
    connection.query(sql, (error, result, fields) => {
        if(error) throw error;
        tada =  result[0];
    });
    connection.end();
}