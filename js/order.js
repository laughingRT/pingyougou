$(function(){
  init();
  function init(){
    // 判断是否已经登录
    if(!$.checkLogin()){
      //重新跳转到登录页面
      $.setPage();
      location.href="/pages/login.html";
      return;
    }else{
      $("body").fadeIn(500);
    }
    // 查询订单
    queryOrders();
  }

  // 查询订单
  function queryOrders(){
    $.ajax({
      url: "my/orders/all",
      type: "get",
      data: {
        type:1
      },
      headers: {
        Authorization: $.token()
      },
      success:function(res){
        if(res.meta.status==200){
          var arr=res.data;
          var html = template("liTpl",{arr:arr});
          // console.log(html);
          $("#item1 ul").html(html);
        }else{
          mui.toast(tes.meta.msg);
        }
      }
    })
  }
})