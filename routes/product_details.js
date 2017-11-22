var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var conn = require('../database/connectdb');
//var connection = require('../database/conectdb');
/* GET users listing. */
router.get('/:id', function(req, res, next) {
    connection = conn();
    connection.connect();

query = 'SELECT * FROM bakerry.type_products;' + 
        'SELECT * FROM bakerry.products WHERE id = ' + req.params.id + 
        ';SELECT * FROM bakerry.products where promotion_price != 0 order by rand() limit 3;';

connection.query(query, function (error, result, fields) {
    if (error) throw error;
    console.log('The solution is: ', result[0].solution);
     res.render('product_details', { 
       typesProduct : result[0],
       product : result[1],
       randomProducts : result[2]
     });
  });

  connection.end();

});

module.exports = router;
