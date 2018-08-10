$(function(){
  init();
  function init(){
    setHTML();
    var leftScroll = new IScroll(".left");
  }
  function setHTML(){
    // 设计稿的宽度/基础值 = 要适配的屏幕的宽度 / fz
    // fz=要适配的屏幕的宽度*基础值/设计稿的宽度

    // 基础值
    var baseVal = 100;
    // 设计稿的宽度
    var pageWidth = 375;
    // 当前屏幕的宽度
    var screenWidth = document.querySelector("html").offsetWidth;
    //要设置的fontsize
    var fz = screenWidth * baseVal / pageWidth;

    //赋值给HTML标签
    document.querySelector("html").style.fontSize = fz+"px";
  }

  // 方便调试
  window.onresize = function(){
    setHTML();
  }
})