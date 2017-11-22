var express = require('express');
var router = express.Router();
var session = require('express-session')

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

router.get('/show', (req, res, next) => {
    
});

module.exports = router;
