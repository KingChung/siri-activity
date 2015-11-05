/*
	@author:leeenx
	@paipai浮层登录
*/
halo.add('paipailogin',function(){
	var loginWrap=document.createElement('div');
	loginWrap.style.cssText='position:absolute; width:100%; height:100%; left:0; top:0; background-color:#fff; display:none;';
	try{document.domain='paipai.com'}catch(e){}
	if('paipai.com'==document.domain){
		//paipai.com域名下，可直接使用线上的中转页
		var ru='http://www.paipai.com/halo/paipai/afterLogin.html';
	}else{
		//跨域，需要使用自己建立的中转页面
		var ru=window.location.protocol+'//'+window.location.host+window.location.pathname.replace(/\/[^\/]*$/,'')+'/afterLogin.html';
	}
	ru=encodeURIComponent(ru);
	document.body.appendChild(loginWrap);
	var callback=function(){};
	halo.afterPaipaiLogin=function(skey,uin){
		loginWrap.style.display='none';
		callback(skey,uin);
		callback=function(){};//执行完成后注销回调函数
	}
	return function(cb){
		typeof(cb)=='function'&&(callback=cb);
		loginWrap.innerHTML='<iframe frameborder="0" scrolling="no" src="http://www.paipai.com/halo/paipai/login.html?v='+new Date().getTime()+'&ru='+ru+'" width="100%" height="100%"></iframe>';
		loginWrap.style.display='block';
	}
}());