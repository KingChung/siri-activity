/*
    @author:leeenx
    @自定义事件
*/
halo.use(function(m){
    //事件统一
    var TOUCH='stop',BEFORE_TOUCH='',TOUCH_X=0,TOUCH_Y=0,OFFSET_X=0,OFFSET_Y=0,vector_x=0,vector_y=0,sense_x=10,sense_y=10/*手指灵敏度*/,min_vector=50/*手势成立最小位移*/,gesture_time=500/*200毫秒内手指完成手势*/,start_time=0,end_time=0,longpress_time=500;
    if('ontouchstart' in document){
        var touchstart='touchstart',touchend='touchend',touchmove='touchmove';
    }else{
        var touchstart='mousedown',touchend='mouseup',touchmove='mousemove';
    }
    document.body.addEventListener(touchstart,
        function(e){
            TOUCH='start',BEFORE_TOUCH='',OFFSET_X=0,OFFSET_Y=0,vector_x=0,vector_y=0,start_time=new Date().getTime();
            if('touchstart'==touchstart){
                var touchers=e.changedTouches||e.targetTouches,toucher=touchers[0];
                TOUCH_X=toucher.pageX,TOUCH_Y=toucher.pageY;
            }else{
                TOUCH_X=e.clientX,TOUCH_Y=e.clientY;
            }
        },true);
    document.body.addEventListener(touchmove,
        function(e){
            if('start'!=TOUCH&&'move'!=TOUCH)return ;
            var offset_x=0,offset_y=0;
            if('touchstart'==touchstart){
                var touchers=e.changedTouches||e.targetTouches,toucher=touchers[0];
                vector_x=toucher.pageX-TOUCH_X,vector_y=toucher.pageY-TOUCH_Y;
                offset_x=Math.abs(vector_x),offset_y=Math.abs(vector_y);
            }else{
                offset_x=Math.abs(e.clientX-TOUCH_X),offset_y=Math.abs(e.clientY-TOUCH_Y);
            }
            if(offset_x>sense_x||offset_y>sense_y){
                BEFORE_TOUCH=TOUCH,
                TOUCH='move';//手指移动在sense_x,sense_y内都不算move
            }
            OFFSET_X=offset_x,OFFSET_Y=offset_y;
            end_time=new Date().getTime();
        },true);
    document.body.addEventListener(touchend,function(e){
        BEFORE_TOUCH=TOUCH,TOUCH='stop';
    },true);
    document.body.addEventListener('touchcancel',function(e){BEFORE_TOUCH=TOUCH,TOUCH='stop';},true);
    var uievent={
        //新事件的名字 - 如果与原生事件重名，原生事件将会被覆盖
        'touchmove':[
            function(e,cb){
                if('move'==TOUCH){//符合事件，触发事件回调
                    cb.call(this,e);
                }
            },
            touchmove//对应的原生事件（如果是组合事件，就是最后一个被触发的组合事件）
        ],
        'flick':[
            function(e,cb){
                if('start'==BEFORE_TOUCH){
                    cb.call(this,e);
                }
            },
            touchend
        ],
        'gesture_left':[
            function(e,cb){
                //手势向左
                if(OFFSET_X>=OFFSET_Y&&vector_x<=-1*min_vector&&(end_time-start_time<=gesture_time)){
                    cb.call(this,e);
                }
            },
            touchend
        ],
        'gesture_right':[
            function(e,cb){
                if(OFFSET_X>=OFFSET_Y&&vector_x>=min_vector&&(end_time-start_time<=gesture_time)){
                    cb.call(this,e);
                }
            },
            touchend
        ],
        'gesture_up':[
            function(e,cb){
                //手势向上
                if(OFFSET_Y>=OFFSET_X&&vector_y<=-1*min_vector&&(end_time-start_time<=gesture_time)){
                    cb.call(this,e);
                }
            },
            touchend
        ],
        'gesture_down':[function(e,cb){
                //手势向下
                if(OFFSET_Y>=OFFSET_X&&vector_y>=min_vector&&(end_time-start_time<=gesture_time)){
                    cb.call(this,e);
                }
            },
            touchend
        ],
        'release':[function(e,cb){
                if('move'==BEFORE_TOUCH||'start'==BEFORE_TOUCH){
                    cb.call(this,e);
                }
            },
            touchend
        ],
        'forcerelease':[function(e,cb){
                //touchmove后touchend/touchcancel
                if('move'==BEFORE_TOUCH||'start'==BEFORE_TOUCH){
                    cb.call(this,e);
                }
            },
            'touchcancel'
        ],
        'hold':[function(e,cb){
                var _this=this,_start_time=start_time;
                setTimeout(function(){
                    if(_start_time==start_time&&'stop'!=TOUCH){
                        cb.call(_this,e);
                    }
                },longpress_time)
            },
            touchstart
        ],
        'dblclick':[function(e,cb){
            if(isDblClk()){
                cb.call(this,e);
            }
        },
            touchend
        ]
    };
    var isDblClk=function(){
        var timestamp=0;
        return function(){
            if('start'!=BEFORE_TOUCH)return ;//需要是两次flick才算是dblclk
            var _timestamp=new Date().getTime();
            if(_timestamp-timestamp<=500){
                //.5s内的连点为double click事件
                timestamp=0;//置0为下次一次double click做准备
                return true;
            }else{
                timestamp=_timestamp;
                return false;
            }
        }
    }();
    halo.add('uievent',uievent);
});