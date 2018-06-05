<%@page pageEncoding="UTF-8"%>
<%@ include file='/main/head.jsp' %>
<script src="<%=eafapppath %>/main/UserInterface/control.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/main/UserInterface/form.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/TiBom/common.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/TiBom/agent.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/TiBom/commonConstant.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=eafapppath %>/ueditor/third-party/webuploader/webuploader.js"></script>
<script src="<%=eafapppath %>/TiBom/upload.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/TiBom/Common/js/uploadstyle.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/TiBom/Common/js/plusload.js" type="text/javascript"></script>
<%--<link rel="stylesheet" href="css/esg-drawing-add.css">--%>
<link rel="stylesheet" href="/Tibom/css/normalize.css"/>
<link rel="stylesheet" href="/Tibom/Common/css/webuploader.css"/>
<link href="/Tibom/Common/css/plusload.css" rel="stylesheet" type="text/css">
<style>
	.makebox .add:first-child:hover{
		background:url(icon-del-gray-hover.png) no-repeat left!important; 
	}
</style>
<div id="plusContainer"></div>
<div id="diaWin"></div>
<script>
 var clsid = commonCons.getConstant('clsIdChangeGraphDoc');  //类ID 
$(function(){
	//创建实例
	var plus=new plusObject({BOM_CONTAINER:"plusContainer", 
							BOM_NUM:0,
							BOM_CLSID:clsid,
							BOM_ISDELETE:true,
							BOM_FARR:[{BOM_FTITLE:'删除',
							        BOM_FNAEME:'delete1()',
							        BOM_FICON:'../images/icon-del.png'
							       }
							      ],
							BOM_EXTENSIONS:'gif,jpg,jpeg,bmp,png',    
							BOM_MIMETYPES:'image/gif,image/jpg,image/jpeg,image/bmp,image/png'
	                        });
	//创建参数
    var data1 = {
        BOM_CONTAINER:"plusContainer",
        BOM_NAME:'变更通知单',
        BOM_NUM:1,
        BOM_CLSID:clsid,
        BOM_ISDELETE:false
        
    };
    var plus1=new plusObject(data1);
    
   
})
 function delete1(){
    alert(parseInt(2+3));
}
</script>
<%@ include file='/main/footer.jsp' %>