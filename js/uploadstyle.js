/**
 * Created by molong on 2017/8/7.
 */

var UpLoadStyle = function(){
//  this.filedata=[],this.fileinfo=[],
    this.fileArry=[];
    this.thumbnailWidth = 100;   //缩略图高度和宽度 （单位是像素），当宽高度是0~1的时候，是按照百分比计算，具体可以看api文档
    this.thumbnailHeight = 100;
    //获取配置文件
    this.fileconfig = eaf.ajaxGet('/ueditor/jsp/controller.jsp?action=config');
    this.exts = this.fileconfig.imageAllowFiles;
}

UpLoadStyle.prototype = {
    //初始化构建
    uploadInit:function(data,fn){
        //预设数据
        var msg = {
            container:"diaWin",//容器id,
            extensions: 'gif,jpg,jpeg,bmp,png,pdf',
			mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png,application/pdf'
        };
        $.extend(msg,data);
        //创建容器
        this.creatDom(msg.container,msg.extensions);
        //上传文件的存储内容,这一步要放到创建容器之后才能获得
        this.$list = $("#thelist");
        //创建上传
        var request = {
            clsid:msg.clsid,
            extensions:msg.extensions,
            mimeTypes:msg.mimeTypes
        };
        this.uploadCreat(request);
        //关闭按钮流程
        this.closeProcess("close");
        //确定按钮流程
        //处理回调函数,回调函数里返回确认流程获得的数据
        if(!fn){
            return;
        }else{
            this.sendProcess("saveBtn",fn);
        }

    },
/**************************************************************/
    //初始化容器
    creatDom:function(id,accept){
        $("body").find('.masklayer').remove();
    	var layer=$('<div class="masklayer"></div>')
        var contain = $("#"+id).addClass("diaWin");
        var panel = $("<div class='diaWinbor'><h3 class='title'>上传文件</h3>" +
        "<img id='close' class='close'  src='/TiBom/Common/images/dlt.png'/>" +
        "<div class='winbox' id='uploader'> " +
            "<div class='info-head'><a  id='uploadsend'>添加文件</a></div>" +
            "<div class='info-body'><span class='info-tip1'>文件</span><span class='info-tip2'>状态</span><span class='info-tip3'>&nbsp;</span><span class='info-tip4  info-right'>操作</span></div>" +
            "<div class='info-footer'><ul id='thelist' class='uploader-list'></ul></div>" +
            "<p class='saveContain'><a id='saveBtn'  class='sav_btn'>确定</a></p>" +
        "</div></div>");
        contain.append(panel);
        //判断上传文件的格式，并给出相应的提示
        if(accept.indexOf("gif,jpg,jpeg,bmp,png")>-1&&accept.indexOf("pdf")==-1){
        	var str="<span class='limit'>(* 只允许上传图片格式的文件)</span>";
        	$("#uploadsend").before(str);
        }
        if(accept=="gif,jpg,jpeg,bmp,png,pdf"){
        	var str="<span class='limit'>(* 只允许上传图片和pdf格式的文件)</span>";
        	$("#uploadsend").before(str);
        }
        $("body").append(layer);
        $('.diaWin').show();
    },
    //创建上传功能
    uploadCreat:function(data){
        var $this = this;
        if(data.extensions.indexOf("pdf")>-1){
        	//判断当前浏览器是否为火狐
        	if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){  
	            data.mimeTypes='image/*,application/pdf';//解决火狐浏览器上传控件不过滤问题
	        }else{
	            data.mimeTypes='image/gif,image/jpg,image/jpeg,image/bmp,image/png,application/pdf';//解决WebUploader在谷歌浏览器中反应缓慢迟钝
	        }
        }else{
        	if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){  
	            data.mimeTypes='image/*';//解决火狐浏览器上传控件不过滤问题
	        }else{
	            data.mimeTypes='image/gif,image/jpg,image/jpeg,image/bmp,image/png';//解决WebUploader在谷歌浏览器中反应缓慢迟钝
	        }
        }
        
       
/**************************************************************/
        //初始化webupload
        uploader = WebUploader.create({
            //往服务器带参数
            formData: {
                session: $('#eaf_sessionid').val(),
                clsid: data.clsid //给saveMainFile方法里用的,这个方法可以获得已经上传的文件数据
            },
            // swf文件路径
            swf: eaf.getEafAppPath() + '/ueditor/third-party/webuploader/Uploader.swf',  // swf文件路径
            // 选择文件的按钮。可选。
            pick: '#uploadsend',
            //是否自动上传
            auto: true,
            //接收的文件类型
            accept:{
             title: 'Images',
             extensions: data.extensions,
             mimeTypes: data.mimeTypes

             },
            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false,
            threads:1//上传并发数。允许同时最大上传进程数,为了保证文件上传顺序  
        });

        /**************************************************************/
        // 设置文件接收服务器||某个文件开始上传前触发，一个文件只会触发一次.
        uploader.on('uploadStart', function (file) {
            var ext = "." + file.ext.toLowerCase();
            var actiontype = "uploadfile";
            if ($.inArray(ext, $this.exts) > -1) {
                actiontype = "uploadimage";
            }
            var actionurl = getAction(actiontype);
            if (!actionurl) {
                actionurl = '/ueditor/jsp/controller.jsp?action=' + actiontype;
                var baseurl = eaf.ajaxGet('/ueditor/jsp/controller.jsp?action=filesvrurl');//获取文件服务器
                actionurl = baseurl + actionurl;
            }
            uploader.option('server', actionurl);
        });
/**************************************************************/
        // 当有文件添加进来的时候
        uploader.on( 'fileQueued', function( file ) {  // webuploader事件.当选择文件后，文件被加载到文件队列中，触发该事件。等效于 uploader.onFileueued = function(file){...} ，类似js的事件定义。
            var $li = $(
                    '<li id="' + file.id + '" class="file-item thumbnail">' +
                    '<div class="info-tip1 "><p class=" info">'  + file.name + '</p></div>' +
                    '</li>'
                ),
               // $img = $li.find('img'),//缩略图节点
                $percent = $li.find('.progress .progress-bar');//进度条节点
            // 避免重复创建
            if ( !$percent.length ) {
                $percent = $('<div class="info-tip2 progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '<p class="msgtip">等待上传</p>'+
                '</div>').appendTo( $li ).find('.progress-bar');

                $('<p class="sucess-state info-tip3"></p>').appendTo($li);
                $('<div class="info-tip4"><img id="delete" class="delete" src="/TiBom/Common/images/delete.png" /></div>').appendTo($li);
            }
            //删除操作
            $li.on('click','.delete',function(){
                //从上传队列里删除
                uploader.removeFile(file,true);
                //从容器里删除
                var $de = $('#'+file.id);
                $de.remove();
                //从上传服务器返回的信息列表里删除
                for(var i=0;i< $this.fileArry.length;i++){
                    if($this.fileArry[i].id == file.id){
                        $this.fileArry.splice(i,1);
                    }
                }
            });
            // $list为容器jQuery实例
            $this.$list.append($li);
            //让滚动条始终在底部
            $(".info-footer").scrollTop( $(".info-footer")[0].scrollHeight );
            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // thumbnailWidth x thumbnailHeight 为 100 x 100
            /*        uploader.makeThumb( file, function( error, src ) {   //webuploader方法
             if ( error ) {
             $img.replaceWith('<span>不能预览</span>');
             return;
             }

             $img.attr( 'src', src );
             }, thumbnailWidth, thumbnailHeight );*/
        });

/**************************************************************/
        // 文件上传过程中创建进度条实时显示。
        uploader.on( 'uploadProgress', function( file, percentage ) {
            var $li = $( '#'+file.id ),
                $percent = $li.find('.progress .progress-bar');

            $li.find(".msgtip").text("上传中");
            $li.find(".sucess-state").text(parseInt(percentage * 100)+ '%');
            $percent.css( 'width', percentage * 100 + '%' );


        });

/**************************************************************/
        //文件上传成功
        uploader.on( 'uploadSuccess', function(file,data) {
//          $this.filedata.push(data);//文件对应的数据
//          $this.fileinfo.push(file);//文件
            var $li = $( '#'+file.id),
                $msg = "已上传";
            var $icon = $("<img src='/TiBom/Common/images/right.png' style='width:13px;'/>");
            //上传成功对号图标
            $li.find(".sucess-state").text(" ");
            $li.find(".sucess-state").append($icon);
            //上传成功提示
            setTimeout(function(){
                $li.find(".msgtip").text("上传成功");
            },500);
            //把上传到服务器的文件列表通过这个方法放到一个数组里返回过来
//          $this.fileArry = $this.saveMainFile($this.filedata,$this.fileinfo);
            var fileobj=$this.saveMainFile(data,file);
            $this.fileArry.push(fileobj);
        });
/**************************************************************/
        //上传失败
        uploader.on( 'uploadError', function( file ) {
            var $li = $( '#'+file.id ),
                $percent = $li.find('.progress .progress-bar');
            $li.find('.msgtip').text('上传失败');
            //更换文件名前面的显示图标
            $("#"+file.id).find(".info").css({"background":"url('../images/grey.png') no-repeat left center"});
            //进度条置灰
            $percent.css( 'backgroundColor',"lightgrey");
        });
/**************************************************************/
        //上传完成
        uploader.on( 'uploadComplete', function( file ) {
            $( '#'+file.id ).find('.progress.active .progress-bar').css({background:"linear-gradient(#5EC55E, #43D943)"});
        });
    },
    //发送流程
    sendProcess:function(id,fn){
        var $this = this;
        //绑定点击事件,执行传过来的回调函数
        $("#"+id).bind('click',function(){
            var len =  $this.$list.children();
            if(len.length==0){
                top.$.messager.alert('提示', '请选择上传的文件！');
            }else{
            	//判断是否有未完成上传的文件
            	if($(".info-footer").text().indexOf("上传中")>-1||$(".info-footer").text().indexOf("等待上传")>-1){
            	    uploader.stop();
            		parent.$.messager.alert('提示', '请等待文件全部上传完成后再点击确定！','info', function () { 
                        uploader.upload();
                    });
            	}else{
            		var resultArray =  $this.fileArry;//获得已经上传的文件列表
                    fn(resultArray);//返回到回调函数里
            	}
               
//              $this.fileArry = [];
            }
        });
    },
    //关闭按钮
    closeProcess:function(id){
        var $this = this;
        //绑定点击事件,执行传过来的回调函数
        $("#"+id).bind('click',function(){
            var len2 =  $this.$list.children();
            if(len2.length!=0){
                top.$.messager.confirm('提示', '有未保存的上传文件,是否关闭？',function(r){
                   if(r){
                   	   $('#diaWin').removeClass('diaWin').html('');
                   	   $(".masklayer").hide();//关闭弹窗及遮罩层
//                     parent.$('#' + eaf.getUrlParam('eafpdlg')).dialog('destroy');
                   }
                });
            }else{
            	$('#diaWin').removeClass('diaWin').html('');
            	$(".masklayer").hide();//关闭弹窗及遮罩层
//              parent.$('#' + eaf.getUrlParam('eafpdlg')).dialog('destroy');
            }
        });
    },
    //从服务器上获得已经上传的文件信息
     saveMainFile:function(filedata,fileinfo){
        var filserver = eaf.readData('FileStorage', 'GetFileServerByRule', { clsid: clsid });
        if (filedata) {
//          var fileobjs = new Array();
//          for (var i = 0; i < filedata.length; i++) {
                //if (filedata[i].state == 'SUCCESS') {
                //uploader.upload();
                //文件名称删除后缀
                var arr=new Array();
//              arr = fileinfo[i].name.split(".");
                arr = fileinfo.name.split(".");
                var lengthext=arr[arr.length-1].length;
//              var length= fileinfo[i].name.length;
//              var name=fileinfo[i].name.substring(0,length-lengthext-1);
                var length= fileinfo.name.length;
                var name=fileinfo.name.substring(0,length-lengthext-1);

                var fileid = eaf.guid();
                var fileobj = {
                    clsid:"78802E6CAC854E56B8B0E087B7A5971F",
                    "EAF_ID": fileid,
                    EAF_FILEPATH: filedata.url,
                    "EAF_FILEEXT": fileinfo.ext,
                    EAF_NAME: name,//fileinfo[i].name.split(".")[0],
                    EAF_FILESIZE: fileinfo.size2,
                    //EAF_FILEEDITTIME: eaf.Dateformat(new Date(fileinfo[i].lastModifiedDate)),
                    EAF_FILESERVER: filserver.EAF_URL,
                    BOM_OBJ_CLASS:clsid,
                    BOM_OBJ_EAF_ID: $("#EAF_ID").val(),
                    BOM_HASTHUM:"1", //为了测试缩略图功能方便，暂时设置所有的文件都包含缩略图
                    BOM_FILETYPE: fileinfo.ext,
                    id:fileinfo.id //增加返回参数ID,为了和删除做匹配 add by molong
                };
//              fileobjs.push(fileobj);
//          }
        }
//      return fileobjs;
        return fileobj;
    }
}