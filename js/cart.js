$(function(){
  init();
  function init(){
    // 判断是否已经登录
    if(!$.checkLogin()){
      // 重新跳转到登录页面
      sessionStorage.setItem("pageName",location.href);
      location.href = "/pages/login.html";
      return;
    }else{
      $("body").fadeIn(500);
    }
    getCartData();
    eventList();
  }

  function eventList(){
    // 给加号和减号添加tap 计算总价格
    $(".p_cart_content").on("tap","button",function(){
      countAll();
    })

    // 点击编辑-完成
    $("#edit_btn").on("tap",function(){
      $("body").toggleClass("edit_status");
      if($("body").hasClass("edit_status")){
        $("#edit_btn").text("完成");
      }else {
        $("#edit_btn").text("编辑");
      }
    })

  }
  // 查询购物车数据
  function getCartData() {
    // 获取token
    var token = $.token();
    // 发送ajax 获取数据
    $.ajax({
      "url": "my/cart/all",
      "headers": {
        Authorization: token
      },
      success: function (res) {
        // console.log(res);

        if (res.meta.status == 200) {
          var cart_info = JSON.parse(res.data.cart_info);
          console.log(cart_info);
          var html = template("mainTpl", {
            data: cart_info
          });
          // console.log(html);
          $(".pyg_cart ul").html(html);
          // 初始化数字输入框
          mui(".mui-numbox").numbox();
          countAll();
        } else {
          console.log(res.meta.msg);
          // 我加的判断
          mui.toast("未登录");
          // 在会话存储中保存当前页面的路径，用户登录后可以跳转回来
          sessionStorage.setItem("pageName", location.href);
          setTimeout(function () {
            location.href = "/pages/login.html";
          }, 1000)
        }
      }
    })
  }

  // 计算总价格
  function countAll(){
    /*
    1 获取所有的li标签
    2 循环
          1 计算每一个li标签对应的商品的总价格
          2 叠加不同种类的商品的价格
          3 把总价格赋值给对应标签
     */
    var lis = $(".p_cart_content li");
    var total = 0;
    for(var i=0;i<lis.length;i++){
      var obj = $(lis[i]).data("obj");
      // console.log(obj);
      // 单价
      var tmp_goods_price = obj.goods_price;
      // console.log(tmp_goods_price);
      // 购买的数量
      var nums = $(lis[i]).find(".mui-numbox-input").val();
      total+=tmp_goods_price*nums;
    }
    $(".total_price").text(total);
  }
})