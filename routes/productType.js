var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var conn = require('../database/connectdb');
/* GET users listing. */
router.get('/:id', function(req, res, next) {

  connection = conn();
  connection.connect();

  query = 'SELECT * FROM bakerry.products where id_type = ' + req.params.id + 
  '; SELECT * FROM bakerry.products where promotion_price != 0 order by rand() limit 3;' +
  'SELECT * FROM bakerry.type_products;';
  connection.query(query, function (error, result, fields) {
    if (error) throw error;
    console.log('The solution is: ', result[0].solution);
     res.render('product_types', { 
       products : result[0],
       randomProducts : result[1],
       typesProduct : result[2]
     });
  });
  
  connection.end();

});

module.exports = router;
