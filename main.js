var href= window.location.href;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
   if(request.getUrl){
    var path=get_full()
    sendResponse({"u":path})
   }
})

function get_full(){
    var id=getUrlParam('id');
    var path=location.protocol+"//"+location.host+location.pathname
    if(id!=null)
        path+='?id='+id
    return path
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}