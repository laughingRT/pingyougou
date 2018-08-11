$(function(){
  var QueryObj = {
    query: "",
    cid: getValue("cid"),
    pagenum: 1,
    pagesize: 8
  };
  // 总页数
  var totalPage = 1;
  init();
  function init(){
    mui.init({
      pullRefresh: {
        container: ".pyg_view",
        down: {
          auto: true,
          //  触发下拉刷新时自动触发
          callback: function () {
            // 发送ajax请求 获取数据 动态渲染
            // 渲染用了append ，刷新的之前先清空
            $(".pyg_view ul").html("");
            QueryObj.pagenum = 1;
            // 重置 上拉组件
            // search();
            search(function(){
              mui('.pyg_view').pullRefresh().endPulldownToRefresh();
              // 重置 上拉组件
              mui('.pyg_view').pullRefresh().refresh(true);
            });
            // mui('.pyg_view').pullRefresh().endPulldownToRefresh();
          }
        },
        up: {
          //  触发上拉刷新时自动触发
          callback: function () {
            if(QueryObj.pagenum>=totalPage){
              console.log("没有数据了");
              mui('.pyg_view').pullRefresh().endPullupToRefresh(true);
              return;
            }else{
              QueryObj.pagenum++;
              // search();
              search(function(){
                mui('.pyg_view').pullRefresh().endPullupToRefresh();
              });
            }
              // mui('.pyg_view').pullRefresh().endPullupToRefresh();
          }
        }
      }
    });
  }

  // 根据url上的key来获取值
  function getValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
  }

  // 获取列表数据
  function search(callback){
    $.get("goods/search",QueryObj,function(res){
      // console.log(res);
      // 总页数
      totalPage = Math.ceil(res.data.total / QueryObj.pagesize);
      // console.log("总页数"+totalPage);
      var html = template("mainTpl",{arr:res.data.goods});
      // 为了加载下一页 目的不断去append 追加
      $(".pyg_view ul").append(html);

      callback&&callback();
    })
  }
})