$(function (){
  var BaseUrl = "http://api.pyg.ak48.xyz/";
  // 导入模板变量
  template.defaults.imports.iconUrl = BaseUrl;

  // 发送请求的个数
  var ajaxNums = 0;
  // 修改接口的使用方式
  // 拦截器  在每一次发送请求 之前对请求做一些处理
  $.ajaxSettings.beforeSend = function(xhr,obj){
    obj.url = BaseUrl+"api/public/v1/"+ obj.url;
    ajaxNums++;
    $("body").addClass("wait");
  }

  // 拦截器  在每一次请求回来做的逻辑
  $.ajaxSettings.complete = function(){
    ajaxNums--;
    if(ajaxNums == 0){
      $("body").removeClass("wait");
    }
  }

  // 有获取地址的参数函数常用，调整到公共文件，方便调用
  // 根据url上的key来获取值
  // function getURLValue(name) {
  //   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  //   var r = window.location.search.substr(1).match(reg);
  //   if (r != null) return decodeURI(r[2]);
  //   return null;
  // }

  // getURLValue()要设置为全局函数方便其他文件调用，但是裸放（不在函数内）不安全，此时设置为$的属性或者方法即可
  // 拓展zepto->给$对象添加自定义的属性和方法
  $.extend($,{
    getURLValue: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
    },
    checkPhone: function (phone) {
      if (!(/^1[34578]\d{9}$/.test(phone))) {
        return false;
      } else {
        return true;
      }
    },
    checkEmail: function (myemail) {　　
      var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
      if (myReg.test(myemail)) {　　　　
        return true;　　
      } else {　　　　
        return false;
      }
    },
    checkLogin:function(){
      // 判断永久存储中有没有userinfo
      return localStorage.getItem("userinfo");
    },
    token:function (){
      // 如果userinfo 存在 返回token 否则返回""
      var token;
      if(!localStorage.getItem("userinfo")){
        token = "";
      }else {
        token = JSON.parse(localStorage.getItem("userinfo")).token;
      }
      return token;
    },
    // 把当前页面存放到 会话存储 中
    setPage:function(){
      sessionStorage.setItem("pageName", location.href);
    },
    // 把页面的URL从 会话存储 中取出
    getPage: function(){
      return sessionStorage.getItem("pageName");
    },
    // 把用户信息存放到 永久存储 中
    setUser: function(obj){
      localStorage.setItem("userinfo",JSON.stringify(obj));
    },
    // 从 永久存储 中取出 用户信息
    getUser: function(){
      return localStorage.getItem("userinfo")?JSON.parse(localStorage.getItem("userinfo")):false;
    },
    // 删除永久存储中的userinfo数据
    removeUser: function(){
      localStorage.removeItem("userinfo");
    }
  });
})