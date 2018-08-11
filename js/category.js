$(function(){
  // 需要用到的全局变量
  // 后台返回来的数据
  var Datas;
  // 左侧滚动条
  var LeftScroll;
  init();
  function init(){
    setHTML();
    eventList();
    getCategories();
  }

  // 注册事件
  function eventList(){
    // 分类名点击切换样式 绑定委托
    $(".left").on("tap","li",function(){
      //获取点击对象的缩影
      var index = $(this).index();
      // var index = $(this).data("index");
      console.log(index);
      $(this).addClass("active").siblings().removeClass("active");
      // 设置回弹效果
      LeftScroll.scrollToElement(this);
      // 同步显示右边详情
      renderRight(index);
    })
  }

// 动态获取左侧数据
  function getCategories(){
    $.get("categories",function(res){
      // 渲染分类名
      var html = template("leftTpl",{arr:res.data});
      $(".left ul").html(html);
      // 初始化左边滑动
      LeftScroll = new IScroll(".left");
      // console.log(res);
      // console.log(res.data[0].children);
      // var html2 = template("rightTpl",{arr:res.data[0].children});
      // $(".right").html(html2);
      // 赋值给全局变量使右侧函数可以调用
      Datas = res.data;
      renderRight(0);//渲染初始值
    })
  }

  // 根据索引来渲染右侧的数据
  function renderRight(index){
    // 渲染右侧数据，Datas全局变量可以使用
    var arr = Datas[index].children
    var html2 = template("rightTpl",{arr:arr});
    $(".right").html(html2);

    var num = $(".right img").length;
    // console.log(num);

    // 最后一张加载的图片加载完，自动执行
    $(".right img").on("load",function(){
      num--;
      if(num == 0){
        new IScroll(".right");
      }
    })
  }

  // 设置字体rem
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