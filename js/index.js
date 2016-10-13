$(function () {
    var tudos=[];
    var content=$('.content');
    var input=$('input');
    var all=$('.all');
    if(localStorage.datetudos){
        tudos=JSON.parse(localStorage.datetudos);
        render();
    }else{
        localStorage.datetudos=JSON.stringify(tudos);
    }
    function render(){
        content.empty();
        localStorage.datetudos=JSON.stringify(tudos);
        $.each(tudos,function(i,v){
            $('<li><span class=" finished icon-font icon-passthrough"></span> <p>'+v.title+'</p><span class="delete icon-font icon-delete"></span><span class="xiugai icon-font icon-xiugai"></span></li>').addClass(function(){
                if(v.state){
                    return "done";
                }
            }).appendTo('.content')
            $('input').val('')
        })
    }
//    时间
    function time(){
        var date=new Date();
        var hour=date.getHours();
        var second=date.getSeconds();
        var minute=date.getMinutes();
        minute=(minute<10)?("0"+minute):minute;
        hour=(hour<10)?("0"+hour):hour;
        second=(second<10)?("0"+second):second;
        $('.time').text(hour+":"+minute+":"+second);
    }
    setInterval(time,1000);
//    分类选项卡
    all.addClass('active');
    all.on('click',function(){
        $('.link li').removeClass('active');
        $(this).addClass('active');
        $('.content li').css({display:"block"});
        $('.num').text(0);
        numb();
    });
    $('.end').on('click',function(){
        $('.link li').removeClass('active');
        $(this).addClass('active');
        $('.content li').css({display:"none"})
        $('.content .done').css({display:"block"});
        numb();
    });
    $('.wei').on('click',function(){
        $('.link li').removeClass('active');
        $(this).addClass('active');
        $('.content li').css({display:"block"});
        $('.done').css({display:"none"});
        numb();
    });
    $('.clear').on('click',function(){
        $(this).addClass('active');
        $(tudos).each(function(i,v){
            console.log(v);
            if(v.state){
               tudos.splice(i,1);
            }
        });
        render();
        numb();
    });
    content.on('click','li .finished',function(){
        var li=$(this).closest('li');
        var i=li.index();
        li.toggleClass('done');
        tudos[i].state=1;
        localStorage.datetudos=JSON.stringify(tudos);
        numb()
    });
    content.on('click','li .delete',function(){
        $(this).closest('li').addClass('feichu').queue(function(){
            $(this).delay(800).dequeue();
        });
        var i=$(this).closest('li').index();
        tudos.splice(i,1);
        localStorage.datetudos=JSON.stringify(tudos);
        render();
        numb();

    });

    //添加
    $('.add').on('click',function(){
        input.slideToggle();
        input.focus();
    })

    //修改
    $('.content li').on('click','.xiugai',function(){
        $(this).addClass('make');
        input.slideDown();
        input.focus();
        var tex=$(this).closest('li').text()
        input.val(tex);

    })

    //滑动事件
    var left=null;
    content.on('touchstart','li',function(e){
        left=e.originalEvent.changedTouches[0].pageX;
    });

    content.on('touchmove','li',function(e){
        n=e.originalEvent.changedTouches[0].pageX;
        if(n-left>40){
            $(this).closest('li').css("transform","translate3d(0.4rem,0,0)")
        }
        if(n-left<-30){
            $(this).closest('li').css("transform","translate3d(0,0,0)");
        }
    });
    content.on('touchend','li',function(e){
        n=e.originalEvent.changedTouches[0].pageX;
        if(n-left>40){
          // $(this).css("transform","translate3d(0.3rem,0,0)")
        }
    });


    //空格键
    function numb(){
        var reg=/active/g;
        var l=$('.done').length
        if(reg.test($('.all').attr('class'))){
            $('.num').text($('.content li').length);
        }
        if(reg.test($('.end').attr('class'))){
            $('.num').text(l);
        }
        if(reg.test($('.wei').attr('class'))){
            $('.num').text($('.content li').length-l);
        }
    }
    numb();
    $(document).on('keyup',function(e){
        var text=$('input').val();
        if(text.length==0){
            return;
        }

     if(e.keyCode==13){
         if($('.make').length==0){
             alert(1)
         $('.make').closest('li').find('p').text(text);
         $('.make').removeClass('make');
         return;
        }else{
             tudos.push({title:text,state:0,isDel:0});
             render();
             numb();
         }

      }
    });
})