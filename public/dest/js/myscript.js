if($('.loader') != 'undefined'){
    $('.loader').hide();
};
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

$(document).ready(function($){
    $('.cart_update').change(function(){
        $('.loader').show();
        var productId = $(this).attr('id');
        var quantity = $(this).val();
        var url = '/shopping-cart/update';
        var data = {
            id : productId,
            qty : quantity
        };
        var success = function(respon){
            console.log(respon);
            setTimeout(function(){
                  $('.loader').hide(); 
            }, 300);
            $('#signle_total' + productId).html(respon.newTotalPrice);
            $('#cart_summary').html(respon.newCartTotal + 'vnđ');
        };
        var dataType = 'json';
        $.get(url, data, success, dataType);
    });
});

$(document).ready(($) => {
    $('.cart_remove').click(function(){
        var id = $(this).val();
        var url = '/shopping-cart/remove/' + id;
        var success = function(respon){
            $('#item' + id).remove();
        };
        var dataType = 'text';

        swal({
            title: "Ban muốn bỏ sản phẩm này ?",
            text: "Sản phẩm này sẽ bị loại bỏ khỏi giỏ hàng của bạn!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                $.get(url, success, dataType);
                swal("Đã bỏ sản phẩm ra giỏ hàng!", {
                    icon: "success",
                });
            } else {
                swal("Đã giữ lại sản phẩm trong giỏ hàng !");
            }
        });
    });
});

$(document).ready(function($){
    $('#submit_payment').click(function() {
        var ten_kh = $('#customer_name').val();
        var dia_chi_kh = $('#customer_address').val();
        var so_dt_kh = $('#customer_phone').val();
        var email_kh = $('#customer_email').val();
        var hinh_thuc_thanh_toan = $('#form-thanh-toan select[name=customer_payment]').val()
        var gioi_tinh_kh = $('#form-thanh-toan input[name=customer_gender]:checked').val();
        var ghi_chu_don_hang = $('#customer_note').val();
        var url = '/shopping-cart/payment';
        var data = {
            name : ten_kh,
            address : dia_chi_kh,
            phone : so_dt_kh,
            email : email_kh,
            payment : hinh_thuc_thanh_toan,
            gender : gioi_tinh_kh,
            note : ghi_chu_don_hang
        }
        var success = function(respon) {
            console.log(respon);
            let tbody = '';
            let total = 0;
            for(i in respon){
                tbody += '<tr><td>' + respon[i].productname + '</td><td>'+ respon[i].quantity + '</td><td>' + respon[i].unit_price + 'vnđ</td></tr>';
                total += respon[i].unit_price;
            }
            $('#tenKhHd').html(ten_kh);
            $('#diaChiKhHd').html(dia_chi_kh);
            $('#soDtKhHd').html(soDtKhHd);
            $('#emailKhHd').html(email_kh);
            $('#cachThanhToanHd').html(hinh_thuc_thanh_toan);
            $('#item_payment_table').append(tbody);
            $('#tongThanhToanHD').html(total);
            $('#datHangThanhCong').modal('show');
            $('#closeDatHangThanhCong').click(function(){
                location.replace("http://localhost:3000");
            });
        }
        var dataType = 'json';
        console.log(data);
        $.get(url, data, success, dataType);
    });
});

$(document).ready(function() {
    $('#user_checkout').click(function(){
        
    });
});