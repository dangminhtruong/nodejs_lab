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
      res.render('login', {
        typesProduct: result
      });
    });
    connection.end();
});

router.post('/login', urlencodedParser, (req, res) => {
  connection = conn();
  connection.connect();
  query = "SELECT count(*) as confirm, full_name, id FROM bakerry.users WHERE email = '" + req.body.userEmail + "'  AND password = '" + req.body.userPass + "'" + 
  '; SELECT * FROM bakerry.type_products';

  connection.query(query, function (error, result, fields) {
    if (error) throw error;
    if(result[0][0].confirm !== 0 ){
      var sess = req.session;
      sess.userLogin = {
        userName : result[0][0].full_name,
        userId : result[0][0].id
      };
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

router.post('/register', urlencodedParser,(req, res) => {
  connection = conn();
  connection.connect();
  sql = "SELECT * FROM bakerry.type_products;" + 
        "INSERT INTO bakerry.users (full_name, email, password, phone, address, user_rights) " + 
        "VALUES('" + req.body.userFullName + "','" + req.body.userEmail + "','" + req.body.userPass + 
        "','" + req.body.userPhone + "','" + req.body.userAddress + "',0);";
  connection.query(sql, (error, results, fields) => {
    if(error) throw error;
    res.render('login', {
      typesProduct : results[0],
      registerSucces : 'Register successfull !'
    });
  });
  connection.end();
});

router.get('/logout', (req, res) => {
  var sess = req.session;
  sess.userLogin = undefined;
  res.redirect('/');
});

router.get('/profile', (req, res) => {
  connection = conn();
  connection.connect();
  var sess = req.session;
  sql = "SELECT * FROM bakerry.type_products;" + 
        "SELECT full_name, email, phone, address, avata FROM bakerry.users where id = " + sess.userLogin.userId;
  connection.query(sql, (error, results, fields ) => {
    res.render('profile', {
      typesProduct : results[0],
      userInfo : results[1][0],
      logined : sess.userLogin
    });
  });
  connection.end();
});

router.post('/update-infor',urlencodedParser, (req, res) => {
  connection = conn();
  connection.connect();
  var sess = req.session;
  let sql = "UPDATE bakerry.users SET full_name ='" + req.body.edit_name + 
            "',email ='" + req.body.edit_email + "',phone ='" + req.body.edit_phone + 
            "',address='" + req.body.edit_address + "' WHERE id=" + sess.userLogin.userId;
  connection.query(sql, (error, results) => {
    if(error) throw error;
    res.redirect('/users/profile');
  });
  connection.end();
});

router.post('/update-password', urlencodedParser, (req, res) => {
  var sess = req.session;
  new Promise((resolve, reject) => {
    connection = conn();
    connection.connect();
    let sql = "SELECT count(*) as num FROM bakerry.users WHERE password=" + req.body.current_pass + 
              " AND id=" + sess.userLogin.userId;
    connection.query(sql, (error, results) => {
        if(error){
          reject(error);
        }else{
          resolve(results);
        }
    });
    connection.end();
  }).then((results) => {
    if(results[0].num == 1 && req.body.new_pass === req.body.re_new_pass){
      connection = conn();
      connection.connect();
      let sql = "SELECT * FROM bakerry.type_products;" + 
      "SELECT full_name, email, phone, address, avata FROM bakerry.users where id = " + sess.userLogin.userId +   
      "; UPDATE bakerry.users SET password = " + req.body.new_pass + " WHERE id = " + sess.userLogin.userId;
      connection.query(sql, (error, results) => {
        if(error) throw error;
        res.render('profile', {
          typesProduct : results[0],
          userInfo : results[1][0],
          logined : sess.userLogin,
          alert : {
            type : "success",
            content : "Update pasword successfull"
          }
        });
      });
      connection.end();
    }else{
      connection = conn();
      connection.connect();
      let sql = "SELECT * FROM bakerry.type_products;" + 
      "SELECT full_name, email, phone, address, avata FROM bakerry.users where id = " + sess.userLogin.userId;
      connection.query(sql, (error, results) => {
        if(error) throw error;
        res.render('profile', {
          typesProduct : results[0],
          userInfo : results[1][0],
          logined : sess.userLogin,
          alert : {
            type : "danger",
            content : "Update pasword failer"
          }
        });
      });
      connection.end();
      res.redirect('back');
    }
  }).catch((error)=>{
    console.log(error);
  });
});

module.exports = router;
