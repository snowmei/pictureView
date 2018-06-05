var imgIds=[];	//用于存储图片的EAF_ID
var paths = [];  //用于存储图片的路径
var imgobj=localStorage.getItem("imgArr");//获取文件列表
var msg=localStorage.getItem("msgObj");
var data; //定义一个全局的接收列表的变量
var initwidthorinitheightarry = [];
function initImageSize(flag){
	var num=$(".scrollPic li.current").index();
	if(flag){
	$("#imagebg li img").each(function(index){
		$(this).css("max-width",$(window).width());
		$(this).css("max-height",$(window).height()-112-7);		
	});
	}

}
$(function () {
	data=JSON.parse(imgobj);//获取文件列表
    //循环文件列表将其显示在下方缩略图
   for(var doccount =0; doccount<data.length; doccount++){
   	    imgIds.push(data[doccount].EAF_ID);
    	var imgUrl = data[doccount].EAF_FILEPATH;  //获取图片的url
    	paths.push(data[doccount].EAF_FILEPATH);
    	var strHtml='';
    	//判断若是pdf，则显示指定缩略图
    	if(imgUrl.split(".")[1] == "pdf"){
    		strHtml+='<li><img id="imgid_'+doccount+'" src="../BomQualitySimple/images/pdf_logo1.png" onclick="scanfile(\'' + doccount +'\')"></li>';
    	   
    	}else{
    		//获取缩略图
			var FileExt=imgUrl.replace(/.+\./,""); //获取后缀
			var strFileName=imgUrl.replace("."+FileExt,"")+"_t.";//获取缩略图名
			var newrurl=strFileName+FileExt;
    		strHtml+='<li><img id="imgid_'+doccount+'" src="'+newrurl+'?time='+(new Date()).getTime()+'" onclick="scanfile(\'' + doccount +'\')"></li>';
    	}
    	$(".scrollPic").append(strHtml);
    }
  /*  //若缩略图少于13张，则隐藏
    if(data.length<=13){
    	$("#nextScroll,#preScroll").css("visibility",'hidden');
    }else{
    	$("#preScroll").addClass("gray")
    }*/
    //默认打开第一个文件
    $(".scrollPic li:eq(0)").addClass("current");
    scanfile(0);
    initImageSize(true);
    getbatchCommentNumber(imgIds[0]);//获取第一张图片的相关评论
    
    nextshow(); //点击下一张
    preshow(); //点击上一张
    

//  smallscroll();//缩略图的滚动
   
})
//点击下一张
function nextshow(){
	$("#shade_r").click(function(){
    	var newIndex=$(".scrollPic li.current").index();
    	if(newIndex>=data.length-1){
    	  newIndex=0;	//如果是最后一张，则赋值给第一张 
    	  $(".scrollPic").animate({left:0},100);
    	}else{
    	  newIndex++;	
    	}
    	scanfile(newIndex);
    	getbatchCommentNumber(imgIds[newIndex]);//获取相关评论
    	if(newIndex>0&&(newIndex%10)==0){
        	$(".scrollPic").animate({left:'-=830px'},100);
        }
    })
}
//点击上一张
function preshow(){
	$("#shade_l").click(function(){
    	var newIndex=$(".scrollPic li.current").index();
    	if(newIndex<=0){
    	  newIndex=data.length-1;	//如果是第一张，则赋值给最后一张
    	  var total=Math.floor(data.length/10);
          $(".scrollPic").animate({left:"-="+830*total+"px"},100);
    	}else{
    	  newIndex--;	
    	}
    	getbatchCommentNumber(imgIds[newIndex]);//获取相关评论
    	scanfile(newIndex);
    	if(newIndex>0&&(parseInt(newIndex+1)%10)==0){
        	$(".scrollPic").animate({left:'+=830px'},100);
        }
    })
}
/*//缩略图滚动
function smallscroll(){
	$("#nextScroll").click(function(){
        $("#preScroll").removeClass("gray")
   	    var left=$(".scrollPic").offset().left;
   	    var num=data.length-15;
        if( left>=(num*(-83)-60)){  
           $(".scrollPic").css({left: '-=83px'});  
        }else{
		   $(this).addClass("gray");
		}
    });
    $("#preScroll").click(function(){
  	    $("#nextScroll").removeClass("gray")
    	var left=$(".scrollPic").offset().left;
        if( left<2 ){  
           $(".scrollPic").css({left: '+=83px'}); 
        }else{
		   $(this).addClass("gray"); 
		}
    })
}*/
//大图预览
function scanfile(index) {
	$(".scrollPic li:eq("+index+")").addClass("current").siblings("li").removeClass("current");
	var IndexData = data[index];
	$("#ifmbimcenter").show();
	$('#imagebg').hide();
    /*当前页及描述*/
    var imgDes = IndexData.EAF_NAME==null?'':IndexData.EAF_NAME;
    var fileindex = index==null?'':parseInt(index)+1;
	var filenumber = data.length==null?'':data.length;
	var title='【'+imgDes+'】 '+fileindex+'/'+filenumber;
	$("#describe").text(title);
    //pdf格式的浏览
    if (IndexData.EAF_FILEPATH.split(".")[1] == "pdf") {
    	//放大缩小按钮隐藏
    	$('.toolbar').find('a.leftspin').hide();
    	$('.toolbar').find('a.rightspin').hide();
    	$('.toolbar').find('a.upimagesize').hide();
    	$('.toolbar').find('a.downimagesize').hide();
    	$('.toolbar').find('a.save').hide();
    	IndexData = data[index];
        $('#ifmbimcenter').attr('src', '/TiBom/FileBrowser/docPreview.jsp?&fileid=' + IndexData.EAF_ID); 
    }
    //图片格式的浏览
    else{
    	//放大缩小按钮显示
    	$('.toolbar').find('a.leftspin').show();
    	$('.toolbar').find('a.rightspin').show();
    	$('.toolbar').find('a.upimagesize').show();
    	$('.toolbar').find('a.downimagesize').show();
    	$('.toolbar').find('a.save').show();
    	$("#ifmbimcenter").hide(); //隐藏pdf预览
    	$('#imagebg').show();
        var imgData=data[index];
        var imgHtml='<li id="'+imgData.EAF_ID+'" data-sPic="'+imgData.EAF_FILEPATH+'?time='+(new Date()).getTime()+'"><table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%"><tr><td align="center" valign="middle"><img class="bannerbg_main" src="'+imgData.EAF_FILEPATH+'?time='+(new Date()).getTime()+'" id="theimage_'+index+'"></img></td></tr></table>';
		imgHtml +='</li>';
        $('#imagebg').html(imgHtml);
		$("#imagebg").height($(window).height()-112);
		$("#imagebg li").height($(window).height()-112);
		$(window).resize(function(){$("#imagebg").height($(window).height()-112);$("#imagebg li").height($(window).height()-112);});
        initImageSize(true);
    }
    
}
//获取文件关联评论数量及评论内容
function getbatchCommentNumber(fileid){
	$('#TaskCommentUl').html('');
	var relobjs = eaf.getRelObjsByLeftObj(fileid, commonCons.getConstant('clsIdFileRComment'));
	 //排序方法
	var compare = function (prop) {
	    return function (obj1, obj2) {
	        var val1 = obj1[prop];
	        var val2 = obj2[prop];
	        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
	            val1 = Number(val1);
	            val2 = Number(val2);
	        }
	        if (val1 > val2) {
	            return -1;
	        } else if (val1 < val2) {
	            return 1;
	        } else {
	            return 0;
	        }
	    }
	}
	// 按照创建时间的排序列进行排序
	relobjs.sort(compare("EAF_CREATETIME_STR"));
    if(relobjs.length==0){// 如果图片评论数为0，则角标隐藏
	 	$("#imgcomnum_"+fileid).hide();
	 }else{
	 	$("#imgcomnum_"+fileid).show();
	 	$("#imgcomnum_"+fileid).html(relobjs.length);
	 }

    authjudgment(commonCons.getConstant('clsIdFileRComment'));

	for (var i = 0; i < relobjs.length; i++) {
		if (iscomdel == true && $('#eaf_uid').val() == relobjs[i].EAF_CREATOR) {
			var slideComment = $('<div class="slide_comment"><div class="comment_content"><span class="nickname">' + relobjs[i].RES_EAF_CREATOR_EAF_NAME + '</span><p>' + relobjs[i].BOM_CONTENT + '</p></div><div class="comment_time_trash"><span class="comment_datetime">' + relobjs[i].EAF_CREATETIME_STR + '&nbsp;&nbsp;&nbsp;</span><i id="' + relobjs[i].EAF_ID + '" class="icon-del" title="删除评论" onclick="delComment(this)"></i></div></div>');
			$('#TaskCommentUl').append(slideComment);
		}
		else {
			var slideComment = $('<div class="slide_comment"><div class="comment_content"><span class="nickname">' + relobjs[i].RES_EAF_CREATOR_EAF_NAME + '</span><p>' + relobjs[i].BOM_CONTENT + '</p></div><div class="comment_time_trash"><span class="comment_datetime">' + relobjs[i].EAF_CREATETIME_STR + '&nbsp;&nbsp;&nbsp;</span></div></div>');
			$('#TaskCommentUl').append(slideComment);
		}
	}
}
//发表评论
function  addComment(){
	if(''==$('#TaskContentInput').val()){
		$.messager.alert('提示', '请输入评论内容');
		return false;
	}
	
	var index=$(".scrollPic li.current").index();
    var fileid = imgIds[index];
	var commentid = eaf.guid();
	var commentCont = $('#TaskContentInput').val();
	
    //评论对象    
    var obj = {"EAF_ID":commentid,
                "BOM_CONTENT": commentCont};
    //保存评论类对象
    eaf.saveObject(commonCons.getConstant('clsIdCommentId'), obj, function (arg) {
        //保存图片与评论关联对象
        var relobj= {};
        relobj.R_EAF_ID = eaf.guid();//关联对象ID
        relobj.R_EAF_R_LEFTID = fileid;//左对象ID
        relobj.R_EAF_R_RIGHTID = commentid;//右对象ID
        relobj.R_EAF_R_LEFTCLSID = commonCons.getConstant('clsIdFile');//左类ID
        relobj.R_EAF_R_RIGHTCLSID = commonCons.getConstant('clsIdCommentId');//右类ID
        eaf.saveRelAndObject(commonCons.getConstant('clsIdFileRComment'), relobj, function (rarg) {
            if (rarg.EAF_ERROR) {
                $.messager.alert('提示', rarg.EAF_ERROR);
            }else{
        		var commentobj = eaf.getObjById(commentid, commonCons.getConstant('clsIdCommentId'))
        		authjudgment(commonCons.getConstant('clsIdFileRComment'));//判断是否有权限删除评论
				if(iscomdel == true){
					var slideComment = $('<div class="slide_comment"><div class="comment_content"><span class="nickname">'+commentobj.RES_EAF_CREATOR_EAF_NAME+'</span><p>'+commentobj.BOM_CONTENT+'</p></div><div class="comment_time_trash"><span class="comment_datetime">'+commentobj.EAF_CREATETIME_STR+'&nbsp;&nbsp;&nbsp;</span><i id="'+commentobj.EAF_ID+'" class="icon-del" title="删除评论" onclick="delComment(this)"></i></div></div>');
				}else{
					var slideComment = $('<div class="slide_comment"><div class="comment_content"><span class="nickname">'+commentobj.RES_EAF_CREATOR_EAF_NAME+'</span><p>'+commentobj.BOM_CONTENT+'</p></div><div class="comment_time_trash"><span class="comment_datetime">'+commentobj.EAF_CREATETIME_STR+'&nbsp;&nbsp;&nbsp;</span></div></div>');
				}
				var relobjs = eaf.getRelObjsByLeftObj(fileid, commonCons.getConstant('clsIdFileRComment'));
			   
				var slideLength = $('#TaskCommentUl').find('.slide_comment').length;
				if(slideLength>0){	
					slideComment.insertBefore($('#TaskCommentUl').find('.slide_comment').eq(0));
				}else{
					$('#TaskCommentUl').append(slideComment);
				}
				$('#TaskContentInput').val('');
            }
        })  
    })
   
}
// 删除评论
function  delComment(obj){
	var index=$(".scrollPic li.current").index();
	$.messager.confirm('提示', '评论删除后无法还原，确认要删除吗？', function (r) {
		if(r){
    		var fileid = imgIds[index];
			var id;
			var rightobjid=obj.id;
			var commentData = {
				"left_id":fileid,
				"right_id":rightobjid,
				"classid":commonCons.getConstant('clsIdFileRComment')
			};
			//删除评论与图片的关联
			agent.askMasterToServer("QualityBom","delProduct","data",commentData,function(r1) {
				  if(r1.EAF_ERROR){
		              $.messager.alert('提示', r1.EAF_ERROR, null, null);
		            }else{
					  $("#"+obj.id).parents('.slide_comment').remove();
		           }	
			})
		}
	})
}
// 判断添加、删除 权限----------
var isadd = false;
var iscomdel = false;
var issave = false;
function authjudgment(classid){
	 isadd = false;
	 iscomdel = false;
	 issave = false;
	//获取操作列表
	    var bztools = [];
	    bztools = ctl.getGridOpersByCls(classid, 'B77C8CD23AE4EF5DBBD243579F82C9A9');
		if(bztools.length>0){
	    	for(var i=0;i<bztools.length;i++){
	    		if('D03F6B2C09BCF21E1214A91630602385'==bztools[i].EAF_ID){// 增加操作id
	    			isadd=true;

	    		}else if('2BFAADD9770C07E522B987E886F056F0'==bztools[i].EAF_ID){// 删除操作id
					iscomdel=true;

	    		}else if('76C50B4F6B1524E47BD26ABB02CCDE09'==bztools[i].EAF_ID){//保存操作id
	    			issave=true;
	    		}
	    	}
	    }
}
function isautosize(num){
	if(rotatearray[num]==-90||rotatearray[num]==-270||rotatearray[num]==90||rotatearray[num]==270){
		autosize_other(num);
    }else{
		autosize(num);
    }	
}
function autosize(num){
	if(initwidthorinitheightarry[num][0]==0|| initwidthorinitheightarry[num][1]==0){
		initwidthorinitheightarry[num][0]=$('#theimage_'+num)[0].offsetHeight;
	    initwidthorinitheightarry[num][1]=$('#theimage_'+num)[0].offsetWidth;

	}
	var height=initwidthorinitheightarry[num][0];
	var	width=initwidthorinitheightarry[num][1];
	if(width>=$(window).width() && height>=($(window).height()-112-7)){
		if(width>=height){
		   var jwidth = $(window).width();
		   var jheight = $(window).width()*height/width;
		   if(jheight>($(window).height()-112-7)){
			   $("#imagebg li img:visible").css("width", jwidth*($(window).height()-112-7)/jheight+'px');
			   $("#imagebg li img:visible").css("height", ($(window).height()-112-7)+'px');	  
		   }else{
			   $("#imagebg li img:visible").css("width", jwidth+'px');
			   $("#imagebg li img:visible").css("height", jheight+'px');	  
		   }	
		  
		}else{
		   var jwidth = widht*($(window).height()-112-7)/height;
		   var jheight = ($(window).height()-112-7);
		   if(jwidth>$(window).width()){
			   $("#imagebg li img:visible").css("width", $(window).width()+'px');
			   $("#imagebg li img:visible").css("height", jheight*$(window).width()/jwidth+'px');  
		   }else{
		      $("#imagebg li img:visible").css("width", jwidth+'px');	
		      $("#imagebg li img:visible").css("height", jheight+'px');	
		   }
		}
	}else if(width < $(window).width() && height>=($(window).height()-112-7)){
		 $("#imagebg li img:visible").css("width", width*($(window).height()-112-7)/height+'px');	
		 $("#imagebg li img:visible").css("height", ($(window).height()-112-7)+'px');	
	}else if(width > $(window).width() && height<($(window).height()-112-7)){
		 $("#imagebg li img:visible").css("width", $(window).width()+'px');	
		 $("#imagebg li img:visible").css("height", $(window).width()*height/width+'px');	
	}
	
}
function autosize_other(num){
	if(initwidthorinitheightarry[num][0]==0 || initwidthorinitheightarry[num][1]==0){
		initwidthorinitheightarry[num][0]=$('#theimage_'+num)[0].offsetHeight;
	    initwidthorinitheightarry[num][1]=$('#theimage_'+num)[0].offsetWidth;

	}
	var width=initwidthorinitheightarry[num][0];
	var	height=initwidthorinitheightarry[num][1];
	if(width>=$(window).width() && height>=($(window).height()-112-7)){
		if(width>=height){
		   var jwidth = $(window).width();
		   var jheight = $(window).width()*height/width;
		   if(jheight>($(window).height()-112-7)){
			   $("#imagebg li img:visible").css("height", jwidth*($(window).height()-112-7)/jheight+'px');
			   $("#imagebg li img:visible").css("width", ($(window).height()-112-7)+'px');	  
		   }else{
			   $("#imagebg li img:visible").css("height", jwidth+'px');
			   $("#imagebg li img:visible").css("width", jheight+'px');	  
		   }	
		  
		}else{
		   var jwidth = widht*($(window).height()-112-7)/height;
		   var jheight = ($(window).height()-112-7);
		   if(jwidth>$(window).width()){
			   $("#imagebg li img:visible").css("height", $(window).width()+'px');
			   $("#imagebg li img:visible").css("width", jheight*$(window).width()/jwidth+'px');  
		   }else{
		      $("#imagebg li img:visible").css("height", jwidth+'px');	
		      $("#imagebg li img:visible").css("width", jheight+'px');	
		   }
		}
	}else if(width < $(window).width() && height>=($(window).height()-112-7)){
		 $("#imagebg li img:visible").css("height", width*($(window).height()-112-7)/height+'px');	
		 $("#imagebg li img:visible").css("width", ($(window).height()-112-7)+'px');	
	}else if(width > $(window).width() && height<($(window).height()-112-7)){
		 $("#imagebg li img:visible").css("height", $(window).width()+'px');	
		 $("#imagebg li img:visible").css("width", $(window).width()*height/width+'px');	
	}
	
}
// 查看缩略图
function moreSmallPic(){
    $(".scrollbg").slideToggle("fast");
}
//放大图片
function upImageSize(){
	var nHeight=Math.ceil($("#imagebg li img:visible")[0].offsetHeight *(1+0.2));
	var nWidth=Math.ceil($("#imagebg li img:visible")[0].offsetWidth *(1+0.2));

	$("#imagebg li img:visible").css("width", nWidth+'px');
	$("#imagebg li img:visible").css("height", nHeight+'px');
	$("#imagebg li img:visible").css("max-width","none");
	$("#imagebg li img:visible").css("max-height","none");
	
}
//缩小图片
function downImageSize(){
	var nHeight=$("#imagebg li img:visible")[0].offsetHeight;
	var	nWidth=$("#imagebg li img:visible")[0].offsetWidth;
	if(nHeight > 10 || nWidth > 10) {
		nHeight=Math.ceil(nHeight *(1-0.2));
		nWidth=Math.ceil(nWidth *(1-0.2));
	}

	$("#imagebg li img:visible").css("width", nWidth+'px');
	$("#imagebg li img:visible").css("height", nHeight+'px');
	$("#imagebg li img:visible").css("max-width","none");
	$("#imagebg li img:visible").css("max-height","none");
	
}
//图片的实际大小
function reverseImageSize(){
    $("#imagebg li img:visible").css("width","auto");
	$("#imagebg li img:visible").css("height", "auto");
	$("#imagebg li img:visible").css("max-width","none");
	$("#imagebg li img:visible").css("max-height","none");
	
}

var rotatearray = [];
var spinFlags=0;
//右旋转
function rightSpin(){
	var index=$(".scrollPic li.current").index();
	if(rotatearray[index]){
		rotatearray[index] = rotatearray[index]+90; 
		if(rotatearray[index]==360){
		  rotatearray[index] = 0;	
		}
	}else{
		rotatearray[index] = 90; 
	}
	$('#theimage_'+index).rotate({
        angle: rotatearray[index]
  });
	//列表图片旋转
	$('#imgid_'+index).rotate({
		angle: rotatearray[index]
 });
  isautosize(index);
  spinFlags++;
}

//左旋转
function leftSpin(){
	var index=$(".scrollPic li.current").index();
	if(rotatearray[index]){
		rotatearray[index] = rotatearray[index]-90; 
		if(rotatearray[index]==-360){
		rotatearray[index] = 0;	
		}
		
	}else{
		rotatearray[index] = -90; 
	}
	$('#theimage_'+index).rotate({
        angle: rotatearray[index]
  });
	//列表图片旋转
	$('#imgid_'+index).rotate({
	    angle: rotatearray[index]
	});
	 isautosize(index);
	spinFlags++;
}
//保存旋转的图片
var pathsrc= eaf.getUrlParam('pathsrc')==null?"":eaf.getUrlParam('pathsrc');
function save(){
	var index=$(".scrollPic li.current").index();
	$.messager.confirm('确认', '您确认要保存此张图片吗?', function (r) {
		var jsondata;
		spinFlags=0;
		if(pathsrc.length==0){
			jsondata = {angle:(rotatearray[index]==undefined?0:rotatearray[index]),path:paths[index]};
		}else{
			jsondata = {angle:(rotatearray[index]==undefined?0:rotatearray[index]),path:paths[index]};
		}
   		if(r){
			$.ajax({
            	url:"/txieasyui?taskFramePN=QualityBom&command=rotateImage&colname=json_ajax&colname1={'dataform':'eui_form_data'}",
            	type:'POST',
            	dataType:'json',
				async:false,
            	data:jsondata,
            	success:function(data){
			       if(data && data.EAF_ERROR){
					  $.messager.alert('系统','错误提示：\n'+data.EAF_ERROR+'\n请联系管理员！');
					  return false;
				    }
	            	if (data.err != undefined && data.err.indexOf('ORA-00001') > -1) { //数据库中的唯一键错误
	            	   var message = $.trim(data.err);
 				       $.messager.alert("提示", message,"error");
					   return false;
	            	}
	            	$.messager.alert('系统','保存成功！');
	            	 //刷新旋转保存在父页面的图片
	                 window.opener.$("#"+imgIds[index]).attr("src", paths[index]+"?"+Math.random());
	                 window.opener.$("#"+imgIds[index]).attr("style", "top:0px;");
	            	 
	                 // 选择图片的ID 
	                 
	                 //本页面图片转换方向后同步转换图片列图片对象方向
//	            	 $("#imgid_"+index).attr("src", paths[index]+"?time="+(new Date()).getTime());
					var objtype = eaf.getUrlParam('operation');
					var objId = eaf.getUrlParam('objId');
					var objPage = eaf.getUrlParam('page');
					if(objPage=="weekcoord" && objtype=="TASKBZ"){
						window.opener.setHtml_other("TP");
					}else if(objtype=="QualityCL" || objtype=="SecurityCL" || objtype=="TASKBZ"){
						if(window.opener.qfSetAttachesInfo){
						   window.opener.qfSetAttachesInfo(objId,"TP");
						}
						if(window.opener.initdiscuss){
						   window.opener.initdiscuss();
						}
					 }else{
						if(pathsrc.length>0){
							if(window.opener.setHtml && bz==null){
						       window.opener.setHtml("TP");
							}
							if(window.opener.setHtml_other && bz!=null){
							   window.opener.setHtml_other("TP"); 	
							}
							window.location.reload();
							return;
						    
						}
						var afterImgs = [];
						for(var i = 0;i<paths.length;i++){
							var objt = eaf.getObjById(paths[i],'5BD06F66831BDB23B6C2F4784A941CB8');
							objt.BIM_DOCTYPE = 'TP';
							afterImgs.push(objt);
						}
						if(window.opener.setphotoeshtml){
							window.opener.setphotoeshtml(afterImgs,'TP');
						}
						common.SetSessionStorage(objId+"TP",eaf.jsonToStr(afterImgs));
					 }
            	}
            });
			
		}
	});
}
//下载当前图片
function downLoad(){
	var now=$(".scrollPic li.current").index();  //获取当前图片的索引
	var url=data[now].EAF_FILEPATH; //获取当前图片的url
	var name=data[now].EAF_NAME + "." + data[now].EAF_FILEEXT; //获取当前图片的名称
	downloadfile(url,name);
}

//删除图片
function savedelete(){
	var index=$(".scrollPic li.current").index();
	$.messager.confirm('确认', '您确认要删除此张图片吗?', function (r) {
        if(r){
        	$('#theimage_'+index).remove();
			$('#imgid_'+index).parents('li').remove();
			
			var leftobjid = imgIds[index];
			//文件与评论的关联ID
			var relclsid = commonCons.getConstant('clsIdFileRComment');					
			var id;
			var rightclsid;
			var leftclsid;
			//根据左对象id和关联id获取关联对象和右类属性
			var relobjs = eaf.getRelObjsByLeftObj(leftobjid, relclsid);
			for(var i=0;i<relobjs.length;i++){
				id = relobjs[i].R_EAF_ID;
				rightclsid = relobjs[i].R_EAF_R_RIGHTCLSID;
				leftclsid = relobjs[i].R_EAF_R_LEFTCLSID;
				break;
			}
			var deleteDocRFileObjects = '["'+id+'"]';
			
			//删除评论与图片的关联
			eaf.saveObjects(relclsid, null, null, deleteDocRFileObjects, function (arg) {
				if(arg.EAF_ERROR){
			  		$.messager.alert('系统','错误提示：\n'+arg.EAF_ERROR+'\n请联系管理员！');
			  		return false;
			  	}else{
			  		$.messager.alert('系统','删除成功！','info', function () { 
                       window.opener.deletepic(index,num,msg);//删除父页面的数组的元素
                    });
			  		$("#TaskCommentUl").children(".slide_comment").html("");
		        }	
			})
			
            
			//将父页面右上角的数量角标-1，如果本来就是1在删除1的情况下，将整个li清除
	  		var imgnum = window.opener.$("#"+imgIds[0]).parents('.imgdiv').find('em.imgtotal').html();
	  		
	  		window.opener.$("#"+imgIds[0]).parents('.imgdiv').find('em.imgtotal').html(parseInt(imgnum)-1);
	  		if(imgnum-1==1){
	  		  window.opener.$("#"+imgIds[0]).parents('.imgdiv').find('.fileimgbg').hide(); 	
	  		  window.opener.$("#"+imgIds[0]).parents('.imgdiv').find('em.imgtotal').hide();
	  		}
	  		if(imgnum-1==0){
	  			var add_img = '<div class="imgBox"><div class="addImg" onclick="showUpload('+msg+')">' +
                                        '<img src="../Common/images/add_img_log1.png">'+
                                    '</div></div>';
	  		    window.opener.$("#"+imgIds[0]).parents('.imgdiv').before(add_img);
	  		    window.opener.$("#"+imgIds[0]).parents('.imgdiv').remove();
	  		    window.close(); //删除最后一张的时候关闭窗口
	  		};
	  		//刷新父页面的图片信息
	  		if(index==0){
	  			if(paths[index+1].split(".")[1] == "pdf"){
	  				window.opener.$("#"+imgIds[0]).attr("src", "../BomQualitySimple/images/pdf_logo.png");
	  			}else{
	  				window.opener.$("#"+imgIds[0]).attr("src", paths[index+1]);	
	  			}
	  		
				window.opener.$("#"+imgIds[0]).attr("style", "top:0px;");
	  		}
			window.opener.$("#"+imgIds[0]).attr("id",imgIds[1]);//将新的id赋给图片元素 
        }
	});

}
