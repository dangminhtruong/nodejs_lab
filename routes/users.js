var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');
var conn = require('../database/connectdb');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

/* GET users listing. */
router.get('/login', function(req, res, next) {
  connection = conn();
  connection.connect();

    query = 'SELECT * FROM bakerry.type_products;';
    connection.query(query, function (error, result, fields) {
      if (error) throw error;
      console.log('The solution is: ', result[0].solution);

      res.render('login', {
        typesProduct: result
      });
    });


    connection.end();
});

router.post('/login', urlencodedParser, (req, res) => {
  connection = conn();
  connection.connect();
  query = "SELECT * FROM bakerry.users WHERE email = '" + req.body.userEmail + "'  AND password = '" + req.body.userPass + " ' " + 
  '; SELECT * FROM bakerry.type_products';

  connection.query(query, function (error, result, fields) {
    if (error) throw error;
    if(result[0].length > 0 ){
      var sess = req.session;
      sess.userLogin = result[0][0].full_name;
      res.redirect('/');
    }else{
      res.render('login', {
        typesProduct : result[1],
        loginErrors : 'Your login details is not correct !'
      });
    }
  });

  connection.end();  
});

//Register 

router.get('/register', (req, res) => {
  connection = conn();
  connection.connect();
  query = 'SELECT * FROM bakerry.type_products';

  connection.query(query, (error, result, fields) => {
    if (error) throw error;
    res.render('register', {
      typesProduct :  result
    });
  });
  connection.end();
});

module.exports = router;
