$(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {            
        chrome.tabs.sendMessage(tabs[0].id, {getUrl: "get" }, function(response) {
            // console.log(response.u);
			if(response){
				$('#pureurl').val(response.u);
			}
        });      
    });

    $('.copy').click(function(){
        var v=$('#pureurl').val()
        if(v!=""){
            $('#pureurl').select();
            document.execCommand("Copy");
            layer.msg("成功复制到剪贴板啦！",{time:721},function(){
                window.close()
            })
        }
    })
})