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

})