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
    new Promise(function(resolve, reject) {
        connection = conn();
        connection.connect();
        sql = "INSERT INTO bakerry.customer (name, gender, email, address, phone_number) " + 
        "VALUES ( " + " ' " + req.query.name + " ' " + ",' " + req.query.gender + " ',' " + req.query.email + " ',' " + req.query.address + " ',' " + req.query.phone + " '); ";
        connection.query(sql, (error, result) => {
            if(error){
                console.log(err);
                reject(err);
            };
            resolve(result.insertId);
        });
        connection.end();
    }).then(function(userId){
        return new Promise((resolve, reject) => {
            connection = conn();
            connection.connect();
            var today = moment(new Date()).format("YYYY/MM/DD");
        
            var sql = "INSERT INTO bakerry.bills (id_customer, date_order, total, payment, note, status)" + 
                      " VALUES (" + "'" + userId + " ',' " + today + " '," 
                      + summary(sess.shopingCart) + ",' " + req.query.payment + "','" + req.query.note + "','" + 'Dang cho' + "'"+ ");";
            connection.query(sql, (error, results, fields) => {
                if(error){
                    reject(error);
                };
                resolve(results.insertId);
            });
            connection.end();
        });
    }).then((billId) => {
        return new Promise((resolve, reject) => {
            for(i in sess.shopingCart){
                connection = conn();
                connection.connect();
                let sql = "INSERT INTO bakerry.bill_detail (id_bill, id_product, quantity, unit_price) VALUES ( " + 
                billId + "," + sess.shopingCart[i].productId + "," + sess.shopingCart[i].quantity  +  "," + sess.shopingCart[i].productPrice + ")";
                connection.query(sql, (error, results, fields) => {
                    if(error){
                        reject();
                    }
                });
                connection.end();
            }
            resolve(billId);
        });
    }).then((billId) => {
        connection = conn();
        connection.connect();
        let sql = "SELECT products.name as productname, bill_detail.quantity, bill_detail.unit_price FROM bakerry.bill_detail " + 
        "INNER JOIN bakerry.products ON (bill_detail.id_product = products.id) WHERE id_bill = " + billId;
        connection.query(sql, (error, results, fields) => {
            if(error) throw error;
            sess.shopingCart = undefined;
            res.send(results);
        });
        connection.end();
    }).catch((error) => {
        console.log(error);
    });
});
//------------------------------
module.exports = router;
