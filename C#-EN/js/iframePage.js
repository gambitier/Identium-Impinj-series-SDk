/**
 * Created by Administrator on 2017/6/22.
 */
$(function(){
    $('.content-title').on("click",function(){
        var iconTri=$(this).find('.icon_triangle');
        var content=$(this).siblings('.content_inner');
        if($(iconTri).hasClass('open')){
            $(iconTri).removeClass('open');
            $(content).removeClass('block');                       		
        }else{
            $(iconTri).addClass('open');
            $(content).addClass('block');
        }
        
        mainboxHeight = $('.contain').height();
        if (mainboxHeight <= $(window).height())
        	$('.footWrap').css('marginTop', $(window).height()-mainboxHeight);
        else
        	$('.footWrap').css('marginTop', 50);
         					

    })
    $('.tab_box li').on('click',function(){
        var tab_inner= $(this).closest('ul').siblings('.tab_inner');
        var $thisVal=$(this).attr('value');
        $('.tab_box li').removeClass('cur');
        $(this).addClass('cur');
        $(tab_inner).find('.tab_innerCell').removeClass('show');
        $(tab_inner).find('.tab_innerCell[value= '+ $thisVal +']').addClass('show');
    })
});