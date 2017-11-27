$(document).ready(function($) {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 150) {
            $(".header-bottom").addClass('fixNav')
        } else {
            $(".header-bottom").removeClass('fixNav')
        }
    })
});

jQuery(document).ready(function($) {
    'use strict';

    // color box

    //color
    jQuery('#style-selector').animate({
        left: '-213px'
    });

    jQuery('#style-selector a.close').click(function(e) {
        e.preventDefault();
        var div = jQuery('#style-selector');
        if (div.css('left') === '-213px') {
            jQuery('#style-selector').animate({
                left: '0'
            });
            jQuery(this).removeClass('icon-angle-left');
            jQuery(this).addClass('icon-angle-right');
        } else {
            jQuery('#style-selector').animate({
                left: '-213px'
            });
            jQuery(this).removeClass('icon-angle-right');
            jQuery(this).addClass('icon-angle-left');
        }
    });
});


$(document).ready(function($){
    $('.add-to-cart').click(function(){
        var productId = $(this).val();
        var url = '/shopping-cart/add/' + productId;
        var data = {
            id : productId
        };

        var success = (respon) => {
            swal({
                title: "Cám ơn!",
                text: "Bạn vừa thêm một sản phẩm vào giỏ hàng!",
                icon: "success",
                button: "Ok",
            });
            $('#cartSumItem').html(respon.length);
        }
        var dataType = 'json';
        
        $.get(url, data, success, dataType);
    });
});

$(document).ready(function(){
    
});