var express = require('express');
var router = express.Router();
var session = require('express-session')
var conn = require('../database/connectdb');
var summary = require('../helpers/cart_sumary');
var addCustomer = require('../helpers/save_customer');
var saveBill = require('../helpers/save_bills');
var moment = require('moment');
/* GET users listing. */
//------------------------------
router.get('/add/:id', (req, res, next) => {
    var sess = req.session;
//----------DEFINE CUSTOM FUNCTION-------------
    var price = (data) => {
        if(data.promotion_price != 0 ){
            return data.promotion_price;
        }else{
            return data.unit_price;
        }
    };
    var checkIfExist =  (data) => {
        var id = null;
        for(i in data){ 
            if(data[i].productId === req.params.id){
                id = i;
            }
        }
        return id;
    };
//----------------------
    if(!sess.shopingCart){
        connection = conn();
        connection.connect();
        var query = 'SELECT * FROM bakerry.products where id = ' + req.params.id;
        connection.query(query, function (error, result, fields) { 
            sess.shopingCart =  [
                {
                    productId : req.params.id,
                    quantity : 1,
                    productName : result[0].name,
                    productPrice : price(result[0])
                },
            ];
            res.send(sess.shopingCart);
        });
        connection.end();
    }else{
       var id = checkIfExist(sess.shopingCart);
       if(id != null ){
        sess.shopingCart[id].quantity += 1 ;
        res.send(sess.shopingCart);
       }else{
        connection = conn();
        connection.connect();
        var query = 'SELECT * FROM bakerry.products where id = ' + req.params.id;
        connection.query(query, function (error, result, fields) { 
            if(error) throw error;
            sess.shopingCart.push(
                {
                    productId : req.params.id,
                    quantity : 1,
                    productName : result[0].name,
                    productPrice : price(result[0])
                },
            );
            res.send(sess.shopingCart);
        });
        connection.end();
       }
    }
});
//------------------------------
router.get('/view-cart', (req, res, next) => {
    connection = conn();
    connection.connect();
    var sess = req.session;
    var aggregate = require('../helpers/carts_items');
    query = 'SELECT * FROM bakerry.type_products;';
            console.log(query);
     connection.query(query, function (error, result, fields) {
         if (error) throw error;
          res.render('view_cart', { 
             typesProduct : result,
             logined : sess.userLogin,
             cartTotal : sess.shopingCart,
             sum : summary(sess.shopingCart)
          });
       });
    connection.end();
});
//------------------------------
router.get('/update', (req, res, next) => {
    var sess = req.session;
     for(i in sess.shopingCart){
         if(sess.shopingCart[i].productId == req.query.id){
             sess.shopingCart[i].quantity = req.query.qty;
             res.send(sess.shopingCart[i].quantity);
             break;
         };
    }
});
//------------------------------
router.get('/remove/:id', function(req, res, next) {
    var sess = req.session;
    for(i in sess.shopingCart){
        if(sess.shopingCart[i].productId == req.params.id ){
            sess.shopingCart.splice(i,1);
            res.send('removed');
            break;
        }
    }
});
//------------------------------
router.get('/payment', (req, res) => {
    var sess = req.session;
    addCustomer(req.query, function(customerId){
        connection = conn();
        connection.connect();
        var today = moment(new Date()).format("YYYY/MM/DD");
        var sql = "INSERT INTO bakerry.bills (id_customer, date_order, total, payment, note, status)" + 
                  " VALUES (" + "'" + customerId + " ',' " + today + " '," 
                  + summary(sess.shopingCart) + ",' " + 'Khi giao hang' + "','" + 'khong' + "','" + 'Dang cho' + "'"+ ");";
        console.log('Cau truy van', sql);
        connection.query(sql, (error, results, fields) => {
            if(error) throw error;
            console.log('addbill');
            console.log(results.insertId);
           // return callback(results.insertId);
        });
    
        connection.end();
    });
    res.send('successfull');
});
//------------------------------
module.exports = router;