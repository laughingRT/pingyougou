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
    }
  })
})