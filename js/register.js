$(function(){
  init();
  function init(){
    eventList();
  }
  function eventList(){
    // 获取验证码
    $("#code_btn").on("tap",function(){
      /*
      1 获取手机号码  ->合法性的验证
      2 验证不通过 给出用户提示 同时 return
      3 通过 ->
        1 发送请求
        2 按钮禁用防止狂点
        3 设置文本显示倒计时 到了 启用按钮 设置文本
       */
      var mobile_txt = $("[name='mobile']").val().trim();
      // 判断合法性
      if(!$.checkPhone(mobile_txt)){
        // mui 提示框 mui.toast(提示内容)
        mui.toast("手机号不合法");
        return;
      }
      $.post("users/get_reg_code",{"mobile":mobile_txt},function(res){
        console.log(res.data);
        if(res.meta.status == 200){
          // 禁用按钮
          $("#code_btn").attr("disabled","disabled");
          // 设定倒计时
          var times = 3;
          // 按钮显示倒计时
          $("#code_btn").text(times+"秒后再获取");
          // 开启定时器倒计时
          var timeId = setInterval(function(){
            times--;
            $("#code_btn").text(times+"秒后再获取");
            if(times==0){
              clearInterval(timeId);
              $("#code_btn").removeAttr("disabled");
              $("#code_btn").text("获取验证码");
            }
          },1000);
        }else{
          mui.toast(res.meta.msg);
        }
      })
    })
    // 点击注册
    $("#reg_btn").on("tap",function(){
      /*
      要处理的逻辑
      1 获取所有表单的值 验证是否合法
      2 验证失败 给出用户提示 return
      3 通过 构造参数发送
      4 返回值 成功=>1 提示用户  跳转登录页面
      5 失败=> 提示用户
       */
      var mobile_txt=$("[name='mobile']").val().trim();
      var code_txt=$("[name='code']").val().trim();
      var email_txt=$("[name='email']").val().trim();
      var pwd_txt=$("[name='pwd']").val().trim();
      var pwd2_txt=$("[name='pwd2']").val().trim();
      var gender_txt=$("[name='gender']:checked").val().trim();
      // 判断手机合法性
      if(!$.checkPhone(mobile_txt)){
        // mui提示款
        mui.toast("手机号不合法");
        return;
      }
      // 验证验证码 长度不为4 就是非法，对与错后台验证
      if(code_txt.length!=4){
        mui.toast("验证码不合法");
        return;
      }
      // 验证邮箱
      if(!$.checkEmail(email_txt)){
        mui.toast("邮箱不合法");
        return;
      }
      // 验证密码 长度小于6 非法
      if(pwd_txt.length<6){
        mui.toast("密码不合法");
        return;
      }
      // 验证再次输入密码 是否一致
      if(pwd2_txt!=pwd_txt){
        mui.toast("两次密码不一致");
        return;
      }
      // 都通过验证，发送请求
      // 请求路径：http://api.pyg.ak48.xyz/api/public/v1/users/reg
      // 参数名	参数说明	备注
      // mobile	手机号	必填
      // code	验证码	必填
      // email	邮箱	必填
      // pwd	密码	必填
      // gender	性别	必填
      $.post("users/reg",{
        "mobile":mobile_txt,
        "code":code_txt,
        "email":email_txt,
        "pwd":pwd_txt,
        "gender":gender_txt
      },function(res){
        if(res.meta.status==200){
          mui.toast(res.meta.msg);
          setTimeout(function(){
            location.href="/pages/login.html";
          }, 1000);
        }else{
          mui.toast(res.meta.msg);
        }
      })
    })
  }
})