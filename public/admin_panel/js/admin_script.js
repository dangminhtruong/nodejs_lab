var global_url = 'http://localhost/www/alleybarker.com';
/*-----------------------------------------*/
$(document).ready(function($) {
    $("#timTuNgay").datepicker({
        dateFormat: 'yy-mm-dd'
    });
    $("#timDenNgay").datepicker({
        dateFormat: 'yy-mm-dd'
    });
});
//---------------------------------------------
var toggle = true;

$(".sidebar-icon").click(function() {
    if (toggle) {
        $(".page-container").addClass("sidebar-collapsed").removeClass("sidebar-collapsed-back");
        $("#menu span").css({
            "position": "absolute"
        });
    } else {
        $(".page-container").removeClass("sidebar-collapsed").addClass("sidebar-collapsed-back");
        setTimeout(function() {
            $("#menu span").css({
                "position": "relative"
            });
        }, 400);
    }
    toggle = !toggle;
});
//--------------------------------------------
if (document.getElementById("line-chart") != undefined) {
    var url = "/admin/chart";
    var data = {};
    var success = function(result) {
        new Chart(document.getElementById("line-chart"), {
            type: 'line',
            data: {
                labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
                datasets: [{
                    data: [result.T2, result.T3, result.T4, result.T5, result.T6, result.T7, result.CN],
                    label: "Tổng doanh thu",
                    borderColor: "#3e95cd",
                    fill: false
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Tổng doanh thu các ngày trong tuần'
                }
            }
        });
    }
    var dataType = 'json';
    $.get(url, data, success, dataType);

}
//---------------------------------------------------------
$(document).ready(function($) {
    $('.edit_cate_a').click(function() {
        var cate_id = $(this).val();
        var token = $('#cate_edit_token').val();
        var url = '/admin/cate/edit-data';
        var data = {
            _token: token,
            id: cate_id
        }
        var success = function(result) {
            $('#cate_edit_name').val(result.name);
            $('#cate_edit_desc').val(result.desc);
            $('#cate_edit_id').val(cate_id);
            $('#edit_cate').collapse();
        }
        var dataType = 'json';
        $.post(url, data, success, dataType);
    });
});
/*------------------------------------*/
$(document).ready(function($) {
    $('.bill_cancel').click(function() {
        var id = $(this).val()
        var check_bill_status = $('#status' + id).val();

        if (check_bill_status == 'Đang chờ') {

            var url = "/admin/oders/oder-cancel";
            var data = {
                bill_id: id
            }
            var success = function() {
                $('#bill' + id).remove();
            }
            var dataType = 'text';

            swal({
                    title: "Ban muốn bỏ đơn hàng này ?",
                    text: "Đơn hàng này sẽ bị loại bỏ!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {
                        swal("Loại bỏ đơn hàng số" + id + " thành công!", {
                            icon: "success",
                        });
                        $.get(url, data, success, dataType);
                    } else {
                        swal("Bạn đã giữ lại đơn hàng thành công!");
                    }
                });


        } else {
            alert('Xin lỗi, bạn không thể hủy đơn hàng đã hoàn tất !');
        }
    });
});
/*------------------------------------*/
$(document).ready(function($) {
    $('.bill_update').click(function() {
        var id = $(this).val();
        var curent_status = $('#status' + id).val();
        console.log(curent_status);
        var url = "/admin/oders/update-status";
        var data = {
            id_bill: id,
            status: curent_status
        };
        var success = function() {
            $('#btn' + id).attr('disabled', "disabled");
            $('#option1' + id).attr('selected', 'selected');
        };
        var dataType = 'text';
        $.get(url, data, success, dataType);
    });
});
/*--------------------------------------*/
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
/*---------------------------------------*/
$(document).ready(function() {
    var url = "/admin/pice-chart-data";
    var data = {

    };
    var dataType = 'json';
    var success = function(result) {
        var type_name = [];
        var type_data = [];
        var bg_color = [];
        for (i in result) {
            type_name.push(result[i].name);
            type_data.push(result[i].sum_pr);
            bg_color.push(getRandomColor());
        }
        new Chart(document.getElementById("pie-chart"), {
            type: 'pie',
            data: {
                labels: type_name,
                datasets: [{
                    label: "Population (millions)",
                    backgroundColor: bg_color,
                    data: type_data
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Đồ thị tỷ lệ sản phẩm bán ra'
                }
            }
        });
    }
    $.get(url, data, success, dataType);
});

/*------------------------------------------LOC DON HANG--------------------------------------------------*/
$(document).ready(function($) {
    $('#timKiemDonHang').click(function() {
        var url = '';
        var token = $('#token').val();
        var start_date = $('#timTuNgay').val();
        var end_date = $('#timDenNgay').val();

        var timTheoTuanThang = $('#timTheoTuanThang').val();
        var timTheoTinhTrang = $('#timTheoTinhTrang').val();
        /*------------------CAL BACK----------------------------*/
        var callback = function() {
            /*----------------*/
            $('.bill_cancel').click(function() {
                var id = $(this).val();
                var url = "/admin/oders/oder-cancel";
                var data = {
                    bill_id: id
                }
                var success = function() {
                    $('#bill' + id).remove();
                }
                var dataType = 'text';
                swal({
                        title: "Bạn muốn bỏ đơn hàng này ?",
                        text: "Đơn hàng này sẽ bị loại bỏ!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                    .then((willDelete) => {
                        if (willDelete) {
                            swal("Loại bỏ đơn hàng số " + id + " thành công!", {
                                icon: "success",
                            });
                            $.get(url, data, success, dataType);
                        } else {
                            swal("Bạn đã giữ lại đơn hàng thành công!");
                        }
                    });
            });
            /*----------------*/
            $('.bill_update').click(function() {
                var id = $(this).val();
                var curent_status = $('#status' + id).val();
                console.log(curent_status);
                var url = "/admin/oders/update-status";
                var data = {
                    id_bill: id,
                    status: curent_status
                };
                var success = function() {
                    $('#btn' + id).attr('disabled', "disabled");
                    $('#option1' + id).attr('selected', 'selected');
                };
                var dataType = 'text';
                $.get(url, data, success, dataType);
            });
        }

        /*---------------END CALLBACK------------------------------------*/
        /*----------------TIM THEO TUAN THANG----------------------------*/
        if (timTheoTuanThang == 'timTrongTuan' && timTheoTinhTrang == 'dangCho') {
            var url = "/admin/oders/week-processing";
            $('#hienThiDonHang').load(url, callback)
        } else if (timTheoTuanThang == 'timTrongTuan' && timTheoTinhTrang == 'hoanTat') {
            var url = "/admin/oders/week-done";
            $('#hienThiDonHang').load(url, callback)
        } else if (timTheoTuanThang == 'timTrongThang' && timTheoTinhTrang == 'dangCho') {
            var url = "/admin/oders/month-processing";
            $('#hienThiDonHang').load(url, callback)
        } else if (timTheoTuanThang == 'timTrongThang' && timTheoTinhTrang == 'hoanTat') {
            var url = "/admin/oders/month-done";
            $('#hienThiDonHang').load(url, callback)
        } else if (timTheoTuanThang == 'timTrongTuan') {
            var url = "/admin/oders/week-report";
            $('#hienThiDonHang').load(url, callback);
        } else if (timTheoTuanThang == 'timTrongThang') {
            var url = "/admin/oders/month-report";
            $('#hienThiDonHang').load(url, callback);
        }
        /*----------------TIM THEO NGAY---------------------------------*/
        if (start_date != '' && end_date != '' && timTheoTinhTrang == 'dangCho') {
            var data = {
                _token: token,
                start: start_date,
                end: end_date
            }
            var url = "/admin/oders/start-end-processing";
            $('#hienThiDonHang').load(url, data, callback);
        } else if (start_date != '' && end_date != '' && timTheoTinhTrang == 'hoanTat') {
            var data = {
                _token: token,
                start: start_date,
                end: end_date
            }
            var url = "/admin/oders/start-end-done";
            $('#hienThiDonHang').load(url, data, callback);
        } else if (start_date != '' && end_date != '') {
            var data = {
                _token: token,
                start: start_date,
                end: end_date
            }
            var url = "/admin/oders/start-end-date-report";
            $('#hienThiDonHang').load(url, data, callback);
        }
        /*-----------------TIM THEO NGAY--------------------------------*/
        else if (timTheoTinhTrang == 'dangCho' && timTheoTuanThang == 'null') {
            var url = "/admin/oders/processing-report";
            $('#hienThiDonHang').load(url, data, callback);
        }
        /*----------------------------------------------------------------*/
    });
});

/*------------------------------------------------------------------*/
$(document).ready(function() {
    $('#timTheoTuanThang').change(function() {
        var tam = $('#timTheoTuanThang').val();
        if (tam != 'null') {
            $('#timTuNgay').prop("disabled", true);
            $('#timDenNgay').prop("disabled", true);
        } else {
            $('#timTuNgay').prop("disabled", false);
            $('#timDenNgay').prop("disabled", false);
        }
    });
    //------------
    $('#timTuNgay').change(function() {
        var tam1 = $('#timTuNgay').val();
        var tam2 = $('#timDenNgay').val();
        if (tam1 != '') {
            $('#timTheoTuanThang').prop("disabled", true);
        } else if (tam1 == '' && tam2 == '') {
            $('#timTheoTuanThang').prop("disabled", false);
        }
    });
    //-------
    $('#timDenNgay').change(function() {
        var tam1 = $('#timTuNgay').val();
        var tam2 = $('#timDenNgay').val();
        if (tam2 != '') {
            $('#timTheoTuanThang').prop("disabled", true);
        } else if (tam1 == '' && tam2 == '') {
            $('#timTheoTuanThang').prop("disabled", false);
        }
    });
});
$(document).ready(function($){
    $(".btn-delete-product").click(function(){
        var id = $(this).val();
        console.log(id);
        swal({
          title: "Bạn muốn xóa sản phẩm này ?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            document.getElementById('link' + id).click();
            
          } else {
            swal("Hủy xóa thành công !");
          }
        });
    });
});

$(document).ready(function(){
    $('.delete_cate').click(function(){
        let id = $(this).val();
        let url = '/admin/cate/delete-cate/' + id;
        let data = {
            "cateId" : id
        }
        let success = function(respon){
            if (respon == 0) {
                swal("Không thể xóa !");
            }else{
                $('$cate' + id).remove();
            }
        }
        let dataType = 'text';

        swal({
                        title: "Bạn muốn xóa ?",
                        text: "Loại sản phẩm này sẽ bị loại bỏ!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                    .then((willDelete) => {
                        if (willDelete) {
                            swal("Loại bỏ đơn hàng số " + id + " thành công!", {
                                icon: "success",
                            });
                            $.get(url, data, success, dataType);
                        } else {
                            swal("Bạn đã giữ lại đơn hàng thành công!");
                        }
                    });
    });
});