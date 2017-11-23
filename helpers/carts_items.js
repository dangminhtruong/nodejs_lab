module.exports = (cart) => {
    var cartItems = [];
    for(i in cart ){
        cartItems.push(cart[i].productId);
    }
    var result = cartItems.join(',');
    return result;
};