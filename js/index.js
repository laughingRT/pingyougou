$(function(){
  init();
  function init(){
    getSwiperData();
    getCatitems();
    getGoodslist();
  }

  //动态获取轮播图数据
  function getSwiperData(){
    $.get("home/swiperdata","",function(ret){
      // console.log(ret);
      var html = template("swiperTpl",{"arr":ret.data});
      // console.log(html);
      $(".mui-slider").html(html);

      //获得slider插件对象
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 1000//自动轮播周期，若为0则不自动播放，默认为0；
      });
    },'json')
  }

  //动态获取首页导航数据
  function getCatitems(){
    $.get("home/catitems","",function(ret){
      // console.log(ret);
      var html = template("navTpl",{arr:ret.data});
      $(".index_nav").html(html);
    },'json')
  }

  // 动态获取商品列表
  function getGoodslist(){
    $.get("home/goodslist",function(ret){
    // console.log(ret.data[0].goods[1].goods_price);
    var html =template("goodsTpl",{"arr":ret.data});
    // console.log(html);
    $(".index_goodlist").html(html);
    })
  }
})