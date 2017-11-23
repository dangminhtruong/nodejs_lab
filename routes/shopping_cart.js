var express = require('express');
var router = express.Router();
var session = require('express-session')
var conn = require('../database/connectdb');
/* GET users listing. */
router.get('/remove/:id', function(req, res, next) {
  
});

router.get('/add/:id', (req, res, next) => {
    var sess = req.session;
    if(!sess.shopingCart){
        sess.shopingCart =  [
            {
                productId : req.params.id,
                quantity : 1
            },
        ];
    }else{
       for(i in sess.shopingCart){ 
        if(sess.shopingCart[i].productId === req.params.id){
            sess.shopingCart[i].quantity += 1;
        }else{
            sess.shopingCart.push({
                productId : req.params.id,
                quantity : 1
            });
        }
       }
    }
    res.send(sess.shopingCart);
});

router.get('/view-cart', (req, res, next) => {
    connection = conn();
    connection.connect();
    var sess = req.session;
    var aggregate = require('../helpers/carts_items');
    query = 'SELECT * FROM bakerry.type_products;' + 
            'SELECT * FROM bakerry.products where id IN(' + aggregate(sess.shopingCart) + ')';
            console.log(query);
     connection.query(query, function (error, result, fields) {
         if (error) throw error;
          res.render('view_cart', { 
             typesProduct : result[0],
             logined : sess.userLogin,
             cartTotal : sess.shopingCart,
             cartContent : result[1]
          });
       });
    connection.end();
});

module.exports = router;
