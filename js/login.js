$(function(){
  init();
  function init(){
    eventList();
  }
  function eventList(){
    // 点击登录
    $("#login_btn").on("tap",function(){
      /*
      1 验证合法性
      2 非法给出提示
      3 合法跳转页面 暂时 index.html
       */
      var mobile_txt = $("[name='mobile']").val().trim();
      var pwd_txt = $("[name='pwd']").val().trim();
      // 验证手机
      if(!$.checkPhone(mobile_txt)){
        mui.toast("手机不合法");
        return;
      }
      // 验证密码 长度小于6 非法
      if(pwd_txt.length<6){
        mui.toast("密码不合法");
        return;
      }
      /*
      请求路径：http://api.pyg.ak48.xyz/api/public/v1/login
      参数名	参数说明	备注
      username	用户名	必填
      password	密码	必填
       */
      $.post("login",{
        "username": mobile_txt,
        "password": pwd_txt
      },function(res){
        // console.log(res);
        if(res.meta.status == 200){
          // console.log("cg");
          // 提示
          mui.toast(res.meta.msg);

          // 登录成功，存储用户信息到永久存储中
          localStorage.setItem("userinfo",JSON.stringify(res.data));
          setTimeout(function(){
            // 直接跳转首页体验不好，判断是否有来源页面 没有再去跳转到首页
            var pageName = sessionStorage.getItem("pageName");
            if(pageName){
              location.href=pageName;
            }else{
            location.href="/index.html";
            }
          }, 1000);
        }else{
          mui.toast(res.meta.msg);
        }
      })
    })
  }
})