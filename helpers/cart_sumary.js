module.exports = function(cart){
    var sumary = 0;
    for(i in cart){
        sumary += cart[i].productPrice;
    }
    return sumary;
}