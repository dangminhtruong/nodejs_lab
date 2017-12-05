var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET home page. */
router.get('/index', function(req, res, next) {
    res.render('admin_panel/index'); 
});

module.exports = router;
