var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/remove/:id', function(req, res, next) {
  
});

router.get('/add/:id', (req, res, next) => {
    res.send('Sir, you are connected');
});

router.get('/show', (req, res, next) => {
    
});

module.exports = router;
