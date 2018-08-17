$(function(){
  init();
  function init(){
    // 判断是否登录
    if(!$.checkLogin()){
      // 重新跳转到登录页面
      $.setPage();
      location.href="/pages/login.html";
      return;
    }else{
      $("body").fadeIn(500);
    }
    getUserInfo();
    eventList();
  }

  //注册点击事件
  function eventList(){
    // 退出
    $("#loginOutBtn").on("tap",function(){
      mui.confirm("确定退出吗？","提示",["确定","取消"],function (etype){
        if(etype.index == 0){
          //确定
          $.removeUser();
          $.setPage();
          location.href = "/pages/login.html";
        }else if(etype.index == 1){
          // 取消
        }
      })
    })
  }

  // 获取用户资料
  function getUserInfo(){
    $.ajax({
      url: "my/users/userinfo",
      type: "get",
      headers: {
        Authorization: $.token()
      },
      success:function(res){
        // 成功
        if(res.meta.status==200){
          var html = template("userTpl",{data:res.data});
          // console.log(html);
          $(".userinfo").html(html);
        }else{
          // 失败
          console.log(res.meta.msg);
        }
      }
    })
  }
})