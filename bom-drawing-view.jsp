<%@ include file='/main/head.jsp' %>
<script src="<%=eafapppath %>/main/UserInterface/control.js" type="text/javascript"></script>
<script type="text/javascript" src="js/jquery.rotate.min.js"></script>
<script type="text/javascript" src="js/bom-view.js"></script>
<script src="js/bom-drawing-view.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/TiBom/common.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/TiBom/commonConstant.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/TiBom/agent.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/TiBom/Coordination/strophejs/strophe.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/TiBom/Coordination/bomCoordination.js" type="text/javascript"></script>
<link type="text/css" rel="stylesheet" href="css/bom-drawing-view.css" />
<div data-options="region:'center',title:''" style="padding:0;">
	<!--在线浏览部分-->
	<div id="showcontent"> 
		<div id="describe"></div>
        <iframe name="ifmbimcenter" id="ifmbimcenter" src=""></iframe>
        <ul class="imagebg" id="imagebg"></ul>
         <!--上一张下一张图标-->
	    <span  id="shade_l">
			<span><a id="left_img_btn" ondragstart="return false;" hidefocus="true" class="s_pre" ></a></span>
		</span>
		<span id= "shade_r">
			<span><a id="right_img_btn" ondragstart="return false;" hidefocus="true" class="s_next" ></a></span>
		</span>
		<!--工具条(九宫格、放大缩小、旋转删除等)-->
		<div class="bottom-wrap">
			<div class="toolbarwrap">
				<div class="toolbar">
					<a onclick="moreSmallPic()" title="更多缩略图" class="moresmallpic"></a>
					<a onclick="upImageSize()" title="放大" class="upimagesize"></a>
					<a onclick="downImageSize()"  title="缩小" class="downimagesize"></a>
					<a onclick="reverseImageSize()"  title="实际大小" class="reverseimagesize"></a>
					<a onclick="leftSpin()"  title="左旋转" class="leftspin"></a>
			        <a onclick="rightSpin()"  title="右旋转" class="rightspin"></a>
			        <a onclick="save()"  title="保存" class="save"></a>
			        <a onclick="downLoad()"  title="下载" class="download"></a>
			        <a onclick="savedelete()" title="删除" class="delete"></a>
				</div>
			</div>
			<div class="scrollbg" style="position:relative;bottom:0px;width:100%;left:0px">
				<!--<a id="preScroll" ><</a>-->
				<div id="scrollContainer">
					<ul class="scrollPic">
					</ul>
				</div>
				<!--<a id="nextScroll" >></a>-->
			</div>
	   </div>
	</div>
	<!--评论部分-->
	<div class="pic_comment">
		<h3 class="title"><span class="icon_comment">评论</span><span class="icon_close"></span></h3>
        <div id="TaskCommentUl" class="comment_wrap">
            <div class="slide_comment">
            </div> 
        </div>
        <textarea wrap="hard" id="TaskContentInput" class="form-control"  placeholder="输入评论..." rows="3" maxlength="150"></textarea>
        <div class="btn-div">
            <button id="addSaveComment" class="btn btn-success" onclick="addComment()">保存</button>
        </div>
	</div>
</div>

<script type="text/javascript">
var num=eaf.getUrlParam('num');//获取是第几个加号
var isdelete=eaf.getUrlParam('isdelete'); // 获取是否具有删除权限的标示
if(isdelete == 'false' || !isdelete){// 如果没有删除权限，则不能删除
   $('.toolbar').find('a.delete').hide();
}else{
   $('.toolbar').find('a.delete').show();
}

</script>
<%@ include file='/main/footer.jsp' %>