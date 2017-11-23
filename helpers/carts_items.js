var mysql = require('mysql');
var session = require('express-session');
var conn = require('../database/connectdb');

var cartItems = [];
for(i in sess.shopingCart){
    connection.query(query, function (error, result, fields) {
        if (error) throw error;
         res.render('view_cart', { 
            typesProduct : result,
            logined : sess.userLogin,
            cartTotal : sess.shopingCart
         });
      });
    connection.end();
}