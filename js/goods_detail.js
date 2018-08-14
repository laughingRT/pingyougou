$(function(){
  // 全局变量存储商品详情信息
  var GoodsObj;
  init();
  function init(){
    getDatail();
    eventList();
  }

  // 点击事件
  function eventList(){
    $(".add_btn").on("tap",function(){

      // 未登录之前 是没有token的，直接获取报错 判断
      if(!localStorage.getItem("userinfo")){
        // 没有信息 未登录过
        mui.toast("未登录");
        // 在会话存储中保存当前页面的路径，用户登录后可以跳转回来
        sessionStorage.setItem("pageName", location.href);
        setTimeout(function () {
          location.href = "/pages/login.html";
        }, 1000)
        return;
      }
      // 商品的对象 GoodsObj
      var obj = {
        "cat_id": GoodsObj.cat_id,
        "goods_id": GoodsObj.goods_id,
        "goods_name": GoodsObj.goods_name,
        "goods_number": GoodsObj.goods_number,
        "goods_price": GoodsObj.goods_price,
        "goods_weight": GoodsObj.goods_weight,
        "goods_small_logo": GoodsObj.goods_small_logo
      };
        // 未登录之前 是没有token的，直接获取报错

      var token = JSON.parse(localStorage.getItem("userinfo")).token;
      // 发送token 请求头 需要用ajax
      $.ajax({
        "url":"my/cart/add",
        "type": "post",
        "data": {info:JSON.stringify(obj)},
        "headers": {Authorization: token},
        success: function(res){
          console.log(res);
          //  无效token
          if (res.meta.status == 401) {
            mui.toast("未登录");
            // 在会话存储中保存当前页面的路径，用户登录后可以跳转回来
            sessionStorage.setItem("pageName", location.href);
            setTimeout(function () {
              location.href = "/pages/login.html";
            }, 1000)
          }else if(res.meta.status==200){
            // 添加成功
            // 弹出确认框是否跳转购物车页面 还是留在当前页面
            mui.confirm("是否跳转到购物车页面","添加成功",["跳转","取消"],function(etype){
              if(etype.index==0){
                // 跳转
                setTimeout(function(){
                  location.href = "/pages/cart.html";
                },1000)
              }else if(etype.index==1){
                // 不跳转 没逻辑处理
              }
            })
          }
        }
      })

      // post请求无法发送请求头带token
      // $.post("my/cart/add",{
      //   "info": JSON.stringify(obj)
      // },function(res){
      //   console.log(res);
        
      //   // 有参数还需要token

      //   // 无效token
      //   if(res.meta.status==401){
      //     mui.toast("未登录");
      //     // 在会话存储中保存当前页面的路径，用户登录后可以跳转回来
      //     sessionStorage.setItem("pageName",location.href);
      //     setTimeout(function(){
      //       location.href="/pages/login.html";
      //     },1000)
      //   }
      // })
    })
  }
  // 获取数据
  function getDatail(){
    $.get("goods/detail",{
      "goods_id": $.getURLValue("goods_id")
    },function(res){
      // console.log(res);
      // 把商品信息赋值给全局变量
      GoodsObj = res.data;
      var html = template("mainTpl",{"data":res.data});
      $(".pyg_view").html(html);
      
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
      });
    })
  }
})