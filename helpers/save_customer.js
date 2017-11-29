var conn = require('../database/connectdb');
var moment = require('moment');
var summary = require('../helpers/cart_sumary');
var session = require('express-session');

module.exports = function(data){
new Promise(function(resolve, reject) {
        connection = conn();
        connection.connect();
        sql = "INSERT INTO bakerry.customer (name, gender, email, address, phone_number) " + 
        "VALUES ( " + " ' " + data.name + " ' " + ",' " + data.gender + " ',' " + data.email + " ',' " + data.address + " ',' " + data.phone + " '); ";
        connection.query(sql, (error, result) => {
            if(error){
                console.log(err);
                reject(err);
            };
            resolve(result.insertId, data);
        });
        connection.end();
    }).then(function(userId, data){
        console.log('Promise then customerId:', userId);
        console.log('Promise then data:', data);
        connection = conn();
        connection.connect();
        var today = moment(new Date()).format("YYYY/MM/DD");
        
        var sql = "INSERT INTO bakerry.bills (id_customer, date_order, total, payment, note, status)" + 
                  " VALUES (" + "'" + userId + " ',' " + today + " '," 
                  + summary(sess.shopingCart) + ",' " + data.payment + "','" + data.note + "','" + 'Dang cho' + "'"+ ");";
        console.log('Cau truy van them bill', sql);
        connection.query(sql, (error, results, fields) => {
            if(error) throw error;
            console.log(results.insertId);
        });
        connection.end();
    }).catch((error) => {
        console.log(error);
    });
}
