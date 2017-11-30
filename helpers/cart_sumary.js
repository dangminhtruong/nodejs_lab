module.exports = function(cart){
    var sumary = 0;
    for(i in cart){
        sumary += cart[i].productPrice;
    }
    return sumary;
}

var fs = require("fs");
var nodemailer = require("nodemailer");
var ejs = require("ejs");
var transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'testmail@zoho.com',
        pass: '123456'
    }
});
