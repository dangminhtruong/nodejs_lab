var mysql = require('mysql');
var conn = function() {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '789852',
        database : 'bakerry',
        multipleStatements : true
      });
    return connection;
}

module.exports = conn;