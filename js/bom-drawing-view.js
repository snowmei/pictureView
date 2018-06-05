/**
 * Created by admin on 2016/10/14.
 */
function showdocfile(data){
    var IsDisplay = data.ISDISPLAY;
    var width = data.WIDTH;
    var height = data.HEIGHT;
    if (IsDisplay) {
        //$("#FormAnchor").html("");
        $("#FormAnchor").html('<table class="ThumbnailArea"><tr><td class="ThumbnailImg">' +
        '<img  id="ThumbnailImg" src="" alt=""/></td><td class="ThumbnailInfo"><table><tr><th width="100%" colspan="2" ' +
        'class="ThumbnailInfoTitile"></th></tr><tr><table class="ThumbnailInfoTable"></table></tr></table></td></tr> </table>');
        //$('#ThumbnailImg').css("width", 500);
        //$('#ThumbnailImg').css("height", 500);
        var arr = new Array();
        arr = data.EAF_FILEPATH.split("/");
        var lengthext = arr[arr.length - 1].length;
        var length = data.EAF_FILEPATH.length;
        var path = data.EAF_FILEPATH.substring(0, length - lengthext);
//				imagePath = path + data.EAF_ID + "_Thum." + data.EAF_THUMEXT; //文件对应的缩略图地址
//				thumPath = path + data.EAF_ID + "." + data.EAF_FILEEXT; //源文件地址
        imagePath = data.EAF_FILEPATH; //文件对应的缩略图地址
        thumPath = data.EAF_FILEPATH; //源文件地址
        //  var fileName = data.EAF_NAME + "." + data.EAF_FILEEXT;//源文件名称
        //  var url = eaf.getDownUrl(thumPath, fileName);  //从服务器获取源文件
        $.ajax({
            url: imagePath,
            type: "GET",
            cache: false,
            async: false,
            timeout: 40000,
            dataType: "text",
            success: function () {
                $('#ThumbnailImg').attr("src", imagePath);
            },
            error: function () { //如果没有默认的对应文件类型的缩略图，找默认的缩量图
                //如果全部文件都没有缩量图，按文件优先级找到对应文件类型的缩量图
                var filerule = eaf.ajaxGet(eaf.getObjsToFrameUrl("ItemService", "operItem"), {
                    clsid: "",
                    functionName: "getFileRule"
                });
                if (filerule.rows.length > 0) {
                    for (var i = 0; i < filerule.rows.length; i++) {
                        if (filerule.rows[i].EAF_FILETYPE == data.EAF_FILEEXT) {
                            thumPath = "/upload/thum/" + filerule.rows[i].EAF_FILETYPE + "_Thum." + filerule.rows[i].EAF_THUMEXT;
                            //  var url = eaf.getDownUrl(thumPath, filerule.rows[i].EAF_FILETYPE + "_Thum." + filerule.rows[i].EAF_THUMEXT);
                            $.ajax({
                                url: thumPath,
                                type: "GET",
                                cache: false,
                                async: false,
                                timeout: 40000,
                                dataType: "text",
                                success: function () {
                                    $('#ThumbnailImg').attr("src", thumPath);
                                },
                                error: function () { //如果没有默认的对应文件类型的缩略图，找默认的缩量图
                                    thumPath = "/upload/thum/Default_Thum.jpg";
                                    $('#ThumbnailImg').attr("src", thumPath);
                                }
                            });
                        }
                    }
                }
            }
        });

        //$(".ThumbnailInfoTable").append("<tr><td>名称</td><td>" + data.EAF_NAME + "." + data.EAF_FILEEXT + "</td></tr><tr><td>修改时间</td><td>" + data.EAF_MODIFYTIME_STR + "</td></tr><tr><td>修改人</td><td>" + data.RES_EAF_MODIFIER_EAF_NAME + "</td></tr>")
        //$("#info").html("<tr><td>名称</td><td>" + data.EAF_NAME + "." + data.EAF_FILEEXT + "</td></tr><tr><td>修改时间</td><td>" + data.EAF_MODIFYTIME_STR + "</td></tr><tr><td>修改人</td><td>" + data.RES_EAF_MODIFIER_EAF_NAME + "</td></tr>")
    }
}
/**
 * 单个下载文件
 * url 文件地址
 * name 文件名称
 */


function downloadfile(url,name)
{
    //alert(url)
   // alert(name)
   eaf.downFile(url,name);
}
