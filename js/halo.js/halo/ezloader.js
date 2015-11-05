/*
	@author:leeenx
	@滚动加载功能
*/
halo.use(function(m){
	halo.add('ezloader',function(preload_distance){
		var getTop = function(e) {
	       var offset = e.offsetTop;
	       if(e.offsetParent!=null){
	         offset += getTop(e.offsetParent);
	       }         
	       return offset;
	    },wh=window.screen.height,listenscroll=function(){
	    	window.addEventListener('scroll',load)
	    },unlistenscroll=function(){
	    	window.removeEventListener('scroll',load)
	    },load=function(){
	    	var st=document.body.scrollTop||document.documentElement.scrollTop;
	    	for(var i=0,len=shake.length;i<len;++i){
	    		if(st+preload_distance>=shake[i][0]){
	    			shake[i][2]||(function(i){
	    				_shake[i].onload=function(){
	    					//console.log(i);
	    					//_shake[i].className='imgshake';
	    					if(typeof(o.load_change)=='function')o.load_change(_shake[i]);
	    					if(++has_loaded==len){
	    						unlistenscroll();//取消监听
	    					};
	    				};
	    				shake[i][2]=1;//表示不用再加载了
	    				_shake[i].src=shake[i][1];
	    			}(i));
	    		}
	    	}
	    },has_loaded=0,_shake=document.querySelectorAll('[data-ez]'),shake=[];
		for(var i=0,len=_shake.length;i<len;++i){
			shake[i]=[getTop(_shake[i]),_shake[i].getAttribute('data-ez'),0];
			_shake[i].removeAttribute('data-ez');
		};
		preload_distance=preload_distance||0;
		preload_distance+=wh;
		load();//载入第一屏
		listenscroll();//开始监听
		var o={};
		return o;
	});
});