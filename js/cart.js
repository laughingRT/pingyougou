$(function(){
  init();
  function init(){
    // 判断是否已经登录
    if(!$.checkLogin()){
      // 重新跳转到登录页面
      $.setPage();
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
        /* 
        0 判断有没有商品
        1 获取所有的li标签
        2 循环 li标签
          1 获取 li 身上 obj
          2 改变 obj里面 obj.amount(要购买的数量) = 所在li标签的 里面 input 标签的值
          3 再去构造请求的参数 infos:{}
        */
        var lis = $(".p_cart_content li");
        // 0 判断有没有商品
        if(lis.length == 0){
          mui.toast("您还没有购买商品");
          return;
        }
        // 需要发送到后台的infos 对象
        var infos = {};
        for(var i=0;i<lis.length;i++){
          var li=lis[i];
          // 商品对象
          var obj = $(li).data("obj");
          // 改变购买的数量
          obj.amount = $(li).find(".mui-numbox-input").val();
          infos[obj.goods_id] = obj;
        }
        console.log(infos);
        // 同步数据
        syncCart(infos);
      }
    })

    // 删除
    $("#delete_btn").on("tap",function(){
      /*
      1 获取已经选中的复选框的个数
          如果长度 0 提示：还没有选中任何商品
          长度 不为 0
      2 弹出确定框 确定要删除 确定 取消
      3 确定：=》
      4 删除 接口-同步购物车
        方法1 10种商品 2 删除第一种 3 发送被删除的商品的购物车ID到后台。。。
        方法2 10中商品 2 删除第一种 3 发送后（未选中）9中商品到后台
      5 获取未删除的li标签 构造参数 发送请求
      6 发送请求 
          删除失败 弹出提示 status
          删除成功 重新发送请求 渲染页面
       */
      // 先判断是否选中 提示 还没有选中任何商品
      var chks = $(".p_cart_content [name='g_chk']:checked");
      if(chks.length==0){
        mui.toast("还没有选中商品");
        return;
      }
      // 2 弹出确认框 确认要删除 确定 取消
      mui.confirm("确定要删除吗?","警告",["确定","取消"],function(etype){
        // 确定
        if(etype.index==0){
          // 获取未被选中的商品 获取 未被选中的复选框的的父亲 li
          var unSelectLis = $(".p_cart_content [name='g_chk']").not(":checked").parents("li");
          //未被删除的对象字段
          var infos = {};
          for(var i = 0;i<unSelectLis.length;i++){
            // js dom 对象
            var li = unSelectLis[i];
            var obj = $(li).data("obj");
            infos[obj.goods_id] = obj;
          }
          // 发送请求删除数据
          // $.ajax({
          //   url: "my/cart/sync",
          //   type: "post",
          //   data: {
          //     infos:JSON.stringify(infos)
          //   },
          //   headers: {
          //     Authorization: $.token()
          //   },
          //   success: function(res){
          //     // console.log(res);
          //     // 成功
          //     if(res.meta.status==200){
          //       mui.toast("删除成功");
          //       getCartData();
          //     }else{
          //       // 失败
          //       mui.toast(res.meta.msg);
          //     }
          //   }
          // })
          syncCart(infos);
        }else if(etype.index==1) {
          // 取消
          console.log("取消了");
        }
      })
    })

    // 生成订单
    $(".o_create").on("tap",function(){
      /* 
      1 判断有无数据 有误商品
      2 构造请求的参数
      */
     var lis = $(".p_cart_content li");
     if(lis.length == 0){
       mui.toast("您还没有购买商品");
       return;
     }

      // 构造需要的参数
      var paramsObj = {
        // 获取总的价格
        order_price: $(".total_price").text(),
        // 地址暂时写固定
        consignee_addr: "广州天河吉山",
        // 数组，遍历添加
        goods: []
      };
      for(var i=0;i<lis.length;i++){
        // 获取所有的li商品列表
        var li = lis[i];
        // 获取存储在li的商品数据
        var obj = $(li).data("obj");
        // 定义一个数组
        var tmp = {
          goods_id: obj.goods_id,
          goods_price: obj.goods_price,
          goods_number: $(li).find(".mui-numbox-input").val()
        };
        // 添加到数组中
        paramsObj.goods.push(tmp);
      }
      console.log(paramsObj);
      // 发送请求
      orderCreate(paramsObj);
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
          // 判断有没有商品
          if(res.data.cart_info){
            var cart_info = JSON.parse(res.data.cart_info);
            // console.log(cart_info);
            var html = template("mainTpl", {
              data: cart_info
            });
            // console.log(html);
            $(".pyg_cart ul").html(html);
            // 初始化数字输入框
            mui(".mui-numbox").numbox();
            countAll();
          }
        } else {
          console.log(res.meta.msg);
          // 我加的判断
          mui.toast("未登录");
          // 在会话存储中保存当前页面的路径，用户登录后可以跳转回来
          $.setPage();
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

  // 同步购物车数据
  function syncCart(infos){
    // 发送请求更改数据
    $.ajax({
      url: "my/cart/sync",
      type: "post",
      data: {
        infos: JSON.stringify(infos)
      },
      headers:{
        Authorization: $.token()
      },
      success: function(res){
        // console.log(res);
        // 成功
        if(res.meta.status == 200){
          mui.toast(res.meta.msg);
          getCartData();
        }else{
        // 失败
          mui.toast(res.meta.msg);
        }
      }
    })
  }

  // 生成订单
  function orderCreate(params){
    $.ajax({
      url: "my/orders/create",
      type: "post",
      data: params,
      headers: {
        Authorization: $.token()
      },
      success: function(res){
        // 成功
        if(res.meta.status==200){
          mui.toast(res.meta.msg);
          // 跳转至订单页面
          setTimeout(function(){
            location.href= "/pages/order.html";
          },1000)
        }else{
          // 失败
          mui.toast(res.meta.msg);
        }
      }
    })
  }
})