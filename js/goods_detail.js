$(function(){
  init();
  function init(){
    getDatail();
    
  }
  function getDatail(){
    $.get("goods/detail",{
      "goods_id": $.getURLValue("goods_id")
    },function(res){
      // console.log(res);
      var html = template("mainTpl",{"data":res.data});
      $(".pyg_view").html(html);
      
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
      });
    })
  }
})