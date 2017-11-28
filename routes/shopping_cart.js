var express = require('express');
var router = express.Router();
var session = require('express-session')
var conn = require('../database/connectdb');
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
module.exports = router;
