<%@ include file='/main/head.jsp' %>
	<script type="text/javascript" src="/js/FlexPaper/FlexPaper.js"></script>
	<script type="text/javascript" src="/js/FlexPaper/flexpaper_flash.js"></script>
	<script type="text/javascript" src="/js/ActiveX/FlaDisplay.js"></script>
<style>
	/*处理关闭按钮错位*/
	.window .window-header .panel-tool{
		position:absolute;
		top:15px;
	}
/*文件描述*/
#describe{
	width:80%;
	margin:0 auto;
	margin-bottom: 20px;
	padding:10px 0;
	line-height:20px;
	color:#333;
	clear:both;
	font-size:14px;
	font-family:'微软雅黑';
	text-align:center;
}
</style>
<div style="width:100%;height:100%;background-color:#eeeeee" id="primary">
	<div style="padding-top:30px;text-align:center">点击左侧文件进行预览</div>
</div>

<script>
	var fclsid = "78802E6CAC854E56B8B0E087B7A5971F";//文件类id
	var timer;//定时器
	showDoc(eaf.getUrlParam('fileid'));
	function showDoc(FILE_ID){
		// 通过文档id获取文件
		var fileObjs = eaf.getObjsByClsAttr(fclsid, 'EAF_ID', FILE_ID);
		showDocInfo(FILE_ID, fileObjs);//在页面中输出文件信息
	}

	//展示文件信息
    function showDocInfo(EAF_ID, relobjs){
		var json = relobjs[0];
		
		var filePath = json.EAF_FILEPATH;
			if(json.BOM_CONVPATH && json.BOM_CONVPATH  != ""){
				var swfPath = "{/"+ json.BOM_CONVPATH + "[*,0].swf," + json.BOM_CONVPAGE + "}";
				addFlexPaper("","100", "100", swfPath, "primary");
			}else{
				$.messager.alert("提示", "文件正在处理中，暂不能打开!");
				//定时加载转换文档
				timer = setInterval(function(){
					var data = eaf.getObjById(json.EAF_ID, fclsid);
					if(data.BOM_CONVPATH && data.BOM_CONVPATH  != ""){
						window.location.reload();
					}
				}, 3000);
			}

	}

	//检查文本域的长度，不能超过100
	function checkLength(){
		var text = $("#keyWordAddArea").val();
		if(text.length >= 100){
			text = text.substring(0, 100);
			$("#keyWordAddArea").val(text);
			$("#keyWordAddArea").css("style","readonly:true;");
		}
	}
    
	function repSpace(s){
		return s.replace(/[ ]/g,"");
	}

	//格式化文件大小
	function formatSize(size){//格式化文件大小
		size = parseFloat(size);
		if(size<1024){ 
			return size.toFixed(2)+" B";
		}else{
			size = size/1024;
			if(size<1024){
				return size.toFixed(2)+" KB";
			}else{
				size = size/1024;
				if(size<1024){ 
					return size.toFixed(2)+" MB";
				}else{
					size = size/1024;
					return size.toFixed(2)+" GB";
				}
			}
		}
	}
	
	//获取样式
	function getStyle(obj,attr){
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}
		return getComputedStyle(obj,false)[attr];
	}
	//放大
	function upImageSize(){
		$("#picture").css("max-width","none");
		$("#picture").css("max-height","none");
		var nHeight=Math.ceil(parseInt(getStyle(document.getElementById('picture'),'height')) *(1+0.2));
		var nWidth=Math.ceil(parseInt(getStyle(document.getElementById('picture'),'width')) *(1+0.2));

		$("#picture").css("width", nWidth+'px');
		$("#picture").css("height", nHeight+'px');
	}
	//缩小
	function downImageSize(){
		$("#picture").css("max-width","none");
		$("#picture").css("max-height","none");
		var nHeight=parseInt(getStyle(document.getElementById('picture'),'height'));
		var	nWidth=parseInt(getStyle(document.getElementById('picture'),'width'));
		if(nHeight > 10 || nWidth > 10) {
			nHeight=Math.ceil(nHeight *(1-0.2));
			nWidth=Math.ceil(nWidth *(1-0.2));
		}

		$("#picture").css("width", nWidth+'px');
		$("#picture").css("height", nHeight+'px');
	}
	
	function display(){
		if($("#col_box").is(":visible")==false){
			$("#col_box").show();
			$(".left").css("width","72%");
			$(".right").css("width","28%");
		}else{
			$("#col_box").hide();
			$(".right").css("width","2%");
			$(".left").css("width","98%")
		}
}
	function openModel(pviewid,pbuildid,pprojid,pfileid){
//		$("#primary").html("<iframe width='100%' height='100%' src='/bim/BimModel/DesignModel.jsp?viewid="+pviewid+"&build="+pbuildid+"&proj="+pprojid+"&viewport="+pfileid+"&_="+new Date().getTime()+"' frameborder='0'></iframe>");
		var src = "/bim/BimModel/DesignModel.jsp?viewid="+pviewid+"&build="+pbuildid+"&proj="+pprojid+"&viewport="+pfileid+"&_="+new Date().getTime();
		$("#primary").find("iframe").attr("src",src);
	}

/*图片描述*/
var pdfDes = eaf.getUrlParam('pdfDes');
if('输入文字描述'!=pdfDes){
	$('#FlexPaper_').before('<div id="describe"></div>')
	$('#describe').html(pdfDes);
}	
</script>
<%@ include file='/main/footer.jsp' %>
