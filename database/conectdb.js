var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '789852',
    database : 'bakerry',
    multipleStatements : true
  });

  module.exports = connection;