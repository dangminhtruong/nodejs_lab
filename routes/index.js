var express = require('express');
var router = express.Router();
var mysql      = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '789852',
    database : 'bakerry',
    multipleStatements : true
  });
 
  connection.connect();
  
  query1 = 'SELECT * FROM bakerry.products ORDER BY id DESC LIMIT 4 ;' + 
           ' SELECT * FROM bakerry.products WHERE promotion_price != 0 ORDER BY id DESC LIMIT 8;' + 
           'SELECT * FROM bakerry.type_products;'; 
            //get 4 promotion products
  connection.query(query1, function (error, result, fields) {
    if (error) throw error;
    console.log('The solution is: ', result[0].solution);
     res.render('index', { 
       news : result[0],
       olds : result[1],
       typesProduct : result[2]
     });
  });
  
  connection.end();
});

module.exports = router;
