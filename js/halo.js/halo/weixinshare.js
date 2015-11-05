halo.use(function(m){
	var config={},_config={link:'',img_url:'',desc:'',title:'',img_width:80,img_height:80,appid:''};//分享参数对象
	if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
		init();
	} else {
		if (document.addEventListener) {
			document.addEventListener("WeixinJSBridgeReady", init, false);
		} else if (document.attachEvent) {
			document.attachEvent("WeixinJSBridgeReady", init);
			document.attachEvent("onWeixinJSBridgeReady", init);
		}
	}
	function init(){
		WeixinJSBridge.on("menu:share:appmessage", shareToFriend);// 监听事件 - 发给朋友
		WeixinJSBridge.on("menu:share:timeline", shareToFriends);// 监听事件 - 朋友圈
	}
	function shareToFriend(){
		var arg={};
		for(var i in _config)arg[i]=config[i]||'';
		arg.appid||(delete arg.appid);
		WeixinJSBridge.invoke("sendAppMessage", arg, function (res) {
			//alert(res.err_msg);
			afterShare(res.err_msg);
		});
	}
	function shareToFriends(){
		var arg={};
		for(var i in _config)arg[i]=config[i]||'';
		arg.appid||(delete arg.appid);
		config.useTitle||(arg.title=config.desc);//朋友圈默认是用desc作title
		config.friendsDesc&&(arg.title=config.friendsDesc);//有frendsDesc时，用friendsDesc作为描述
		WeixinJSBridge.invoke("shareTimeline", arg, function (res) {
			afterShare(res.err_msg);
		});
	}
	function afterShare(err_msg){
		var ret=err_msg.indexOf('ok')>=0||err_msg.indexOf('confirm')?'ok':(err_msg.indexOf('cancel')>=0?'cancel':'fail');
		typeof(config.cb)=='function'&&config.cb(ret);
	}
	halo.add('weixinshare',function(url,img,title,desc,width,height,appid){
		if(typeof(url)=='object'){
			//以对象形式传入参数
			config=url;
		}else if(typeof(url)=='string'){
			config={link:url,img_url:img||'',desc:desc||'',title:title||'',img_width:width||80,img_height:height||80};
			appid&&(config.appid=appid);
		}else{
			config=undefined;
			throw('url expect string type');
		}
		return config;
	});
});