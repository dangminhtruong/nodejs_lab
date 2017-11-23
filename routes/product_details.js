var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');
var conn = require('../database/connectdb');
//var connection = require('../database/conectdb');
/* GET users listing. */
router.get('/:id', function(req, res, next) {
    connection = conn();
    connection.connect();
    var sess = req.session;
query = 'SELECT * FROM bakerry.type_products;' + 
        'SELECT * FROM bakerry.products WHERE id = ' + req.params.id + 
        ';SELECT * FROM bakerry.products where promotion_price != 0 order by rand() limit 3;';

connection.query(query, function (error, result, fields) {
    if (error) throw error;
    console.log('The solution is: ', result[0].solution);
     res.render('product_details', { 
       typesProduct : result[0],
       product : result[1],
       randomProducts : result[2],
       logined : sess.userLogin,
       cartTotal : sess.shopingCart
     });
  });

  connection.end();

});

module.exports = router;
