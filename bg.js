$(function(){
    chrome.contextMenus.create({type:"normal",title:"净化链接并复制到剪贴板",onclick:fuzhi,contexts:["all"],enabled:true},function(){
    })
    function fuzhi(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {            
            chrome.tabs.sendMessage(tabs[0].id, {getUrl: "get" }, function(response) {
                // console.log(response.u);
				if(response){
					var path=response.u;
					if(!$('#sirui_input_url_hidden').length)
						$('body').append('<input type="text" id="sirui_input_url_hidden" style="position:absolute;left:-9999px;top:-9999px;">')
					$('#sirui_input_url_hidden').val(path).select();
					document.execCommand("Copy");
					alert("成功复制到剪贴板啦！")
				}
            });      
        });
    }
})


