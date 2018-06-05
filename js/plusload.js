 var mainfile=commonCons.getConstant('clsIdMainFile');//主文档类id
var arrObj={};//定义全局对象，用于存储每个加号的数组
var tempObj;
function plusObject(data){
	//设置默认数据
    var msg = {
    	BOM_ISDELETE:true,
    	BOM_EXTENSIONS:'gif,jpg,jpeg,bmp,png,pdf',    
		BOM_MIMETYPES:'image/gif,image/jpg,image/jpeg,image/bmp,image/png,application/pdf'
    };
    $.extend(msg,data);
    this.init(msg);
    var arr=[];
    arrObj[msg.BOM_NUM]=arr;
}
plusObject.prototype={
	//初始化构建
	init:function(msg){
		//创建加号容器
        this.creatDom(msg);
	},
    /*创建加号容器*/
    creatDom:function(msg){
        var contain = $("#"+msg.BOM_CONTAINER);
        //若没有传content参数，做为空的处理
        if(!msg.BOM_NAME){
        	msg.BOM_NAME='';
        }
        var plusstr=$('<div class="imgContainer" id="imgContainer'+msg.BOM_NUM+'">'+
                            '<div class="imgBox"><div class="addImg" onclick="showUpload('+JSON.stringify(msg).replace(/\"/g,"'")+')">' +
                                '<img src="../Common/images/add_img_log1.png">'+
                                '</div></div>'+
                                '<p class="imgDes">'+msg.BOM_NAME+'</p>'+
                        '</div>');
        contain.append(plusstr);
    }
 
}

function showUpload(msg){
	var uncle = new UpLoadStyle();//实例化对象
    //创建上传文件时用的参数
    var data = {
        container:"diaWin",
        clsid:msg.BOM_CLSID,
        extensions:msg.BOM_EXTENSIONS,
        mimeTypes:msg.BOM_MIMETYPES
    };
    //初始化,回调函数返回已经上传的文件列表信息
    uncle.uploadInit(data,function(data){
    	saveFile2Svr(data);
    	//将续传的数组连接到
    	for(var i=0;i<tempObj.length;i++){
    	   arrObj[msg.BOM_NUM].push(tempObj[i]);
    	}
    	$('#diaWin').removeClass('diaWin').empty();
        $(".masklayer").remove();//关闭弹窗及遮罩层
        for(var i=0;i<1;i++){
    		var imgstr='<div class="imgdiv" id="imgdiv'+msg.BOM_NUM+'">'+
    		               '<em class="imgtotal">'+tempObj.length+'</em>'+
    		               '<div class="fileimgbg" onclick="viewImg('+JSON.stringify(tempObj).replace(/\"/g,"'")+','+JSON.stringify(msg).replace(/\"/g,"'")+')"></div>'+
    		               '<div class="imgwrap" onclick="viewImg('+JSON.stringify(tempObj).replace(/\"/g,"'")+','+JSON.stringify(msg).replace(/\"/g,"'")+')">';
    		//若是pdf，则使用指定的图片
            if(tempObj[i].EAF_FILEPATH.split(".")[1] == "pdf"){
        		imgstr+='<a class="pic">'+
    		                '<img src="../Common/images/pdf_logo.png" class="imgsize"/>'+
    		            '</a></div>';
            //若为图片，则放置图片
            }else{
            	imgstr+='<a class="pic">'+
        		            '<img id="'+tempObj[i].EAF_ID+'" src="'+tempObj[i].EAF_FILEPATH+'" class="imgsize"/>'+
        		        '</a></div>';
            }
    		imgstr+='<p class="sideinfo">'+
    		            '<span class="morechoices">'+
    		                '<em class="iconjiao"></em>'+
    		            '</span></p>'+
    			   '<div class="makebox">'+
    		            '<p><span class="iconAddContinue"  title="继续上传" onclick="continueupload(this'+','+JSON.stringify(msg).replace(/\"/g,"'")+')" >继续上传</span></p>'+
    		            '<p><span class="lookbig" title="查看大图" onclick="viewImg('+JSON.stringify(tempObj).replace(/\"/g,"'")+','+JSON.stringify(msg).replace(/\"/g,"'")+')">查看大图</span></p>'+
    		        '</div></div>';
        }
        //将图片添加到指定的容器
    	$("#imgContainer"+msg.BOM_NUM+"").find(".imgBox").before(imgstr);
    	
    	//添加自定义的方法
    	if(msg.BOM_FARR){
        	var fnstr='';
        	for(var r=0;r<msg.BOM_FARR.length;r++){
        		fnstr+='<p><span  class="add" style="background:url('+msg.BOM_FARR[r].BOM_FICON+') no-repeat left" '+
        		       'title="'+msg.BOM_FARR[r].BOM_FTITLE+'" onclick="'+msg.BOM_FARR[r].BOM_FNAEME+'">'+
        		        msg.BOM_FARR[r].BOM_FTITLE+'</span></p>';
        	}
        	$(".imgContainer").eq(msg.BOM_NUM).find(".makebox").append(fnstr);
        }
    	
    	//如果数量为1，则隐藏文件夹和数字
        if(tempObj.length==1){
        	$("#imgdiv"+msg.BOM_NUM+"").find(".imgtotal").hide();
        	$("#imgdiv"+msg.BOM_NUM+"").find(".fileimgbg").hide();
        }
        //将盛放图片的容器，替换对应的加号的容器
        $("#imgContainer"+msg.BOM_NUM+"").find(".imgBox").remove();
        
        //点击右下角的点，出现续传、查看大图等功能
        makeBoxToggle(msg.BOM_NUM);
    }); 
}
/*续传功能
  obj是当前操作的元素，
  msgobj是传过来初始化的对象，
      用于在浏览图片删除时使用
 */
function continueupload(obj,msgobj){
	var uncle = new UpLoadStyle();//实例化对象
    //创建上传文件时用的参数
    var data = {
        container:"diaWin",
        clsid:msgobj.BOM_CLSID,
        extensions:msgobj.BOM_EXTENSIONS,
        mimeTypes:msgobj.BOM_MIMETYPES
    };
    //初始化,回调函数返回已经上传的文件列表信息
    uncle.uploadInit(data,function(data){
    	saveFile2Svr(data);
    	//将续传的数组连接到
    	for(var i=0;i<tempObj.length;i++){
    	   arrObj[msgobj.BOM_NUM].push(tempObj[i]);
    	}
    	//关闭弹窗及遮罩层
    	$('#diaWin').removeClass('diaWin').empty();
        $(".masklayer").remove();
        
    	var imgnum = $(obj).parents('.imgContainer').find('em.imgtotal').html();
				$(obj).parents('.imgContainer').find('em.imgtotal').html(parseInt(imgnum) + parseInt(data.length));
				$(obj).parents('.imgContainer').find('.fileimgbg').show();
				$(obj).parents('.imgContainer').find('em.imgtotal').show();
	    //续传后在线浏览
        $(".imgContainer").eq(msgobj.BOM_NUM).find(".fileimgbg").click(function(){
             viewImg(arrObj[msgobj.BOM_NUM],msgobj);
        });	
        $(".imgContainer").eq(msgobj.BOM_NUM).find(".lookbig").click(function(){
             viewImg(arrObj[msgobj.BOM_NUM],msgobj);
        });	  
    })
}
/*在线浏览功能
  imgObj是要浏览的图片，
  name加号的名称，msgobj是传过来初始化的对象，
      用于在浏览图片删除时使用
 **/
function viewImg(imgObj,msgObj){
	if(typeof(msgObj)=="object"){
	  var img=msgObj;
	  msgObj=JSON.stringify(msgObj).replace(/\"/g,"'");
	}
	if(typeof(msgObj)=="string"){
	  var img=JSON.parse(msgObj.replace(/'/g, '"'));
	}
	localStorage.setItem("imgArr",JSON.stringify(imgObj));//将对象存在localStorage中
	localStorage.setItem("msgObj",msgObj);//将对象存在localStorage中
	
	//获取所有的图片
	var sUrl = '/TiBom/Common/bom-drawing-view.jsp?num='+img.BOM_NUM+'&isdelete='+img.BOM_ISDELETE;
    window.open (sUrl,'图片','left=0,top=0,width='+ (screen.availWidth - 15) +',height='+ (screen.availHeight-65) +',scrollbars,resizable=yes,toolbar=no');
}

//右下角点击效果
function makeBoxToggle(x){
	var $sideinfo=$(".imgContainer").eq(x).find(".sideinfo");
    $sideinfo.on('click','.morechoices',function(event){
    	//其他的隐藏
	  	$('.imgContainer').find(".makebox").slideUp(30);
	    $('.imgContainer').find('p.sideinfo').find('span.morechoices em').hide();
        $('.imgContainer').find('p.sideinfo').find('span.morechoices').removeClass('active');
    	
    	$(this).addClass('active');
    	$(this).children(".iconjiao").show();
        $(this).parent().next(".makebox").slideDown(300);
    	
        event.stopPropagation();
    })
    $('body').click(function(){
		$('.imgContainer').find(".makebox").slideUp(30);
		$('.imgContainer').find('p.sideinfo').find('span.morechoices').removeClass('active');
		$('.imgContainer').find('p.sideinfo').find('span.morechoices em').hide();
	});
}

function saveFile2Svr(insertObjects) {
	//add by shy 20160712:前端只保存文件，文档及其关联在点击“保存”时后台处理
	eaf.saveObjects(mainfile, null, (insertObjects.length == 0 ? null :  insertObjects), null, function (arg) {
		var aJson = []; //文档转换JSON数组
		for(var r=0;r<insertObjects.length;r++){
			var fileConvertObj = new Object();
			fileConvertObj.path = insertObjects[r].EAF_FILEPATH;
		    fileConvertObj.EAF_ID = insertObjects[r].EAF_ID;
		    aJson.push(fileConvertObj);
		}
		//文件转换
		$.ajax({url:"/txieasyui?taskFramePN=FileManagement&command=DocSwitchToSWF&colname=json_ajax&colname1={'dataform':'eui_form_data'}",
			type:'POST',
			dataType:'json',
			async:false,
			data:{
				'JSONARRAY':JSON.stringify(aJson)
			},
			success:function(data){
				if(data && data.EAF_ERROR){
					parent.$.messager.alert('系统','错误提示：\n'+data.EAF_ERROR+'\n请联系管理员！');
					return false;
				}
				else{
                    tempObj=insertObjects;
				}
			}
	   })
    })
}

/*图片浏览的删除
  key是删除数组的索引，
  num是第几个加号，
  msgobj是传过来初始化的对象，
      用于在浏览图片删除时使用
 **/
function deletepic(key,num,msg){
	//删除的是图纸的图片
	arrObj[num].splice(key,1);
	
	viewImg(arrObj[num],msg);//删除的时候就重新获取数据	

	$(".imgContainer").eq(num).find(".fileimgbg").click(function(){
    	viewImg(arrObj[num],msg);
    })
    $(".imgContainer").eq(num).find(".lookbig").click(function(){
    	viewImg(arrObj[num],msg);
    })
    //当只有一张图片的时候
    $(".imgContainer").eq(num).find("a.pic").click(function(){
    	viewImg(arrObj[num],msg);
    })
}