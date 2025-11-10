function setMenuActive(mid) {
	var jqid = '#' + mid;
	$('.side-bar li').removeClass('present');
	$('.side-bar li').next('.next-menu').hide();
	$('.next-menu .child-menu').removeClass('current');

	if($(jqid).hasClass('father')) {
		$(jqid).addClass('present');
		$(jqid).find('.fatmenu').removeClass('hide-gray').addClass('show-blue');
		$(jqid).next('.next-menu').show();
	} else if($(jqid).hasClass('single'))
		$(jqid).addClass('present');
	else {
		$('#' + $(jqid).attr('father')).prev().find('.fatmenu').removeClass('hide-gray').addClass('show-blue');
		$('#' + $(jqid).attr('father')).show();
		$(jqid).addClass('current');
	}
}

function onClickFatMenu(menu) {
	if(!menu.hasClass('father'))
		return;
	if(menu.next('.next-menu').is(":hidden")) {
		menu.next('.next-menu').show();
		menu.find('.fatmenu').removeClass('hide-gray').addClass('show-blue');
	} else {
		menu.next('.next-menu').hide();
		menu.find('.fatmenu').removeClass('show-blue').addClass('hide-gray');
	}
}

function addSingleMeun(title, src) {
	var lihtml = '<li class="jumpmenu single" id="' + src + '"><a class="textnoselect">' +
		title + '</a>' +
		'<div class="arrow-blue"></div>' +
		'<div class="blue-line"></div>' +
		'</li>';
	$('#mainmenu').append($(lihtml));
}

function addFatherMeun(title, src) {
	var titidstr = title.replace(/\s*/g,"");
	var lihtml = '<li class="jumpmenu father" id="' + src + '"><a class="textnoselect">' +
		title + '</a>' +
		'<div class="fatmenu hide-gray"></div>' +
		'<div class="blue-line"></div>' +
		'</li>' +
		'<div class="next-menu"' + 'id="fat' + titidstr + '"></div>';
	$('#mainmenu').append($(lihtml));
}

function addSubMeun(fatid, title, src) {
	var fatidstr = fatid.replace(/\s*/g,"");
	var divhtml = '<div class="child-menu jumpmenu" father="fat' + fatidstr + '" id="' + src + '">' +
		'<div class="icon-circle"></div>' +
		'<div class="arrow-blue"></div>' +
		'<div class="blue-line"></div>' +
		'<a class="textnoselect">' + title + '</a></div>';
	$('#fat' + fatidstr).append($(divhtml));
}
//////////
function positionFooter() {
	mainboxHeight = $('.contain').height();
	if (mainboxHeight <= $(window).height())
		$('.footWrap').css('marginTop', $(window).height()-mainboxHeight);
	else
	$('.footWrap').css('marginTop', 50);
}
/////////

$(function() {
	addFatherMeun('ModuleAPI Introduction', 'ModuleAPI_Introduction');
	addSubMeun('ModuleAPI Introduction', 'MODULETECH.GEN2', 'MODULETECH_GEN2');
	addSubMeun('ModuleAPI Introduction', 'MODULELIBRARY', 'MODULELIBRARY');
	addSubMeun('ModuleAPI Introduction', 'MODULETECH', 'MODULETECH');
	addSingleMeun('Reader Life Cycle', 'Reader_Life_Cycle');
	addFatherMeun('Reader Parameters', 'Reader_Parameters');
	addSubMeun('Reader Parameters', 'Get Parameter', 'Get_Parameters');
	addSubMeun('Reader Parameters', 'Set Parameter', 'Set_Parameters');
	addSubMeun('Reader Parameters', 'Parameters Introduction', 'Parameters_Introduction');
	addSingleMeun('Synchronous Inventory', 'Synchronous_Inventory');
	addFatherMeun('ASynchronous Inventory', 'ASynchronous_Inventory');
	addSubMeun('ASynchronous Inventory', 'Start Inventory', 'Start_Inventory');
	addSubMeun('ASynchronous Inventory', 'Stop Inventory', 'Stop_Inventory');
	
	addFatherMeun('Tag Access', 'Tag_Access');
	addSubMeun('Tag Access', 'Read Tag Memory', 'Read_Tag');
	addSubMeun('Tag Access', 'Write Tag Memory', 'Write_Tag');
	addSubMeun('Tag Access', 'Write Tag EPC Code', 'Write_Tag_EPC');
	addSubMeun('Tag Access', 'Lock Tag', 'Lock_Tag');
	addSubMeun('Tag Access', 'Kill Tag', 'kill_Tag');
	addFatherMeun('Peripheral Functions', 'Peripheral_Functions');
	addSubMeun('Peripheral Functions', 'Get GPI', 'Get_GPI');
	addSubMeun('Peripheral Functions', 'Set GPO', 'Set_GPO');
	addSingleMeun('Error Handling', 'Error_Handling');
	
	
	$(".jumpmenu").click(function() {
		var strs = window.location.href.split("/");
		if(($(this).attr("id") + '.html') == strs[strs.length - 1]) {
			onClickFatMenu($(this));
			return;
		}
		var newhref = null;
		if(strs[strs.length - 1] == 'index.html')
			newhref = window.location.href.replace(strs[strs.length - 1], 'html/' + $(this).attr("id") + '.html');
		else
			newhref = window.location.href.replace(strs[strs.length - 1], $(this).attr("id") + '.html');
		window.location.href = newhref;
	});

	var tmpstrs = window.location.href.split("/");
	setMenuActive(tmpstrs[tmpstrs.length - 1].split('.')[0]);

	$(".CpJson").attr('title', "查看多行原始格式");
	$(".CpJsonline").attr('title', "查看单行原始格式");
	$(".Jsonobj").attr('title', "查看对象格式");
	$(".CpJson").click(function() {
		var divjfmt = $(this).parent().next();
		var fmtstr = JSON.stringify($.parseJSON($(this).attr('jsonvalue')), null, "\t");
		divjfmt.css('display', 'none');
		if(!divjfmt.next().hasClass('jsonpre')) {
			var htmlta = '<pre class="jsonpre""></pre>';
			divjfmt.after($(htmlta));
		}
		divjfmt.next().html(fmtstr);
		divjfmt.next().css('display', '');
	});

	$(".CpJsonline").click(function() {
		var divjfmt = $(this).parent().next();
		var fmtstr = JSON.stringify($.parseJSON($(this).prev().attr('jsonvalue')));
		divjfmt.css('display', 'none');
		if(!divjfmt.next().hasClass('jsonpre')) {
			var htmlta = '<pre class="jsonpre"></pre>';
			divjfmt.after($(htmlta));
		}
		divjfmt.next().html(fmtstr);
		divjfmt.next().css('display', '');
	});

	$(".Jsonobj").click(function() {
		var divjfmt = $(this).parent().next();
		if(!divjfmt.next().hasClass('jsonpre'))
			return;
		else
			divjfmt.next().css('display', 'none');
		divjfmt.css('display', '');
	});

	$('.DivJsonFmt').each(function(index, divjfobj) {
		var tmpjqdiv = $(divjfobj);
		tmpjqdiv.JSONView($.parseJSON(tmpjqdiv.prev().children('div').attr('jsonvalue')));
		//		if(tmpjqdiv.height() > 175)
		//			tmpjqdiv.height(175);
	});
	
	SyntaxHighlighter.defaults['toolbar'] = false;
	SyntaxHighlighter.all();

	$(window).load(function() {
		$('a').each(function(index, aobj) {
			var jqaboj = $(aobj);
			if(jqaboj.parent().hasClass('string')) {
				var fatplainstr = jqaboj.parent().html().replace(/<a.*a>/g, jqaboj.html());
				jqaboj.parent().html(fatplainstr);
			}
		});
	});

	$(window).scroll(function() {
		var sbht = $('.side-bar').height();
		var wst = $(window).scrollTop();
		var wndht = document.body.clientHeight;
		var mtop;
		if(wndht < sbht + 40)
			mtop = wst - 40 - (sbht + 52 - wndht);
		else
			mtop = wst - 40;
		if(mtop < 30)
			mtop = 30;
		$('.side-bar').css('margin-top', mtop + 'px');
	});
	

});