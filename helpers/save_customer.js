var conn = require('../database/connectdb');

module.exports = function(data, callback){
    connection = conn();
    connection.connect();
    customerId = null;
    sql = "INSERT INTO bakerry.customer (name, gender, email, address, phone_number) " + 
    "VALUES ( " + " ' " + data.name + " ' " + ",' " + data.gender + " ',' " + data.email + " ',' " + data.address + " ',' " + data.phone + " '); ";
    console.log('Cau truy van: ',sql);
    connection.query(sql, (error, result) => {
        if(error)  throw error;
        return callback(result.insertId);
    });
    connection.end();
}