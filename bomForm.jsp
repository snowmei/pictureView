<%@ include file='/main/head.jsp' %>
<script src="<%=eafapppath %>/main/UserInterface/control.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/TiBom/Common/bomForm.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/TiBom/commonConstant.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/TiBom/common.js" type="text/javascript"></script>
<div data-options="region: 'center',title: '' " style="width:100%;height:100%;overflow:auto;">
    <form id="uie_div_form" style="width:100%;height:100%;overflow:auto;">
    </form>
</div>
<script type="text/javascript">
    var alertTitle = "提示";
    var clsid = eaf.getUrlParam('clsid');  //类ID
    var uiid = eaf.getUrlParam('uiid'); //表单界面id
    var objid = eaf.getUrlParam('objid'); //对象ID
    var eafshow = eaf.getUrlParam('eafshow'); //是否只读,eafshow='true'
    var edit = eaf.getUrlParam('edit');
    var divform = $('#uie_div_form');
    var eafform;
    var param = {};

    var origEAF_CODE;

    //机车信息 修改时判断是否重复
    var origbomcx;
    var origbomch;
    var origbomtraincode;
    var origBOM_SERIALNUMBER;
    var origBOM_PARTCLASSIFY;


    var bompartclassify = eaf.getUrlParam('bompartclassify');//配件分类
    var bomname = eaf.getUrlParam('bomname');//名称
    var bomsyscode = eaf.getUrlParam('bomsyscode');//系统编码
    var bompartcode = eaf.getUrlParam('bompartcode');//零部件编码

    $(function () {

        param.groups = ctl.getAttrGroupByCls(clsid, uiid); //获取属性组
        param.attrs = ctl.getAttrExByCls(clsid, uiid, objid); //获取属性
        if (clsid != commonCons.getConstant('clsIdComponents')) {

            for (var m = 0; m < param.attrs.length; m++) {
                if (param.attrs[m].EAF_CNAME == 'EAF_CODE') {
                    param.attrs.splice(m, 1);
                    m--;
                }
            }
        }
        if (bompartclassify == null) {
            param.tools = ctl.getFormOpersByCls(clsid, uiid); //获取操作
        }
        var fromobj = ctl.getObjDefaultById(objid, clsid, param.attrs); //获取单个对象（包括默认值）
        eafform = new eaf_form(divform, param, clsid, objid, fromobj);

        if (edit == 'true') {
            if (clsid == commonCons.getConstant('clsIdTrain')) {
                origbomcx = $("#BOM_CX").textbox('getValue');
                origbomch = $("#BOM_CH").textbox('getValue');
                origbomtraincode = $("#BOM_TRAIN_CODE").textbox('getValue');
            }
            if (clsid == commonCons.getConstant('clsIdMachine')) {
                origBOM_SERIALNUMBER = $("#BOM_SERIALNUMBER").textbox('getValue');
                origBOM_PARTCLASSIFY = $("#BOM_PARTCLASSIFY").textbox('getValue');
                origbomtraincode = $("#BOM_TRAIN_CODE").textbox('getValue');
            }
            if (clsid == commonCons.getConstant('clsIdComponents')) {
                origEAF_CODE = $("#EAF_CODE").textbox('getValue');

            }

        }
        if (clsid == commonCons.getConstant('clsIdComponents')) {
            $("#BOM_PARTCLASSIFY").textbox
            ({
                onChange: function (newValue, oldValue) {
                    var obj = eaf.getObjsByClsAttr(commonCons.getConstant('clsIdPartclassify'), 'EAF_NAME', newValue);
                    if (obj.length > 0) {
                        $("#BOM_SYSCODE").textbox('setValue', obj[0].BOM_SYSCODE);
                        $("#BOM_PARTCODE").textbox('setValue', obj[0].BOM_PARTCODE);
                        $("#EAF_NAME").textbox('setValue', obj[0].EAF_NAME);
                    }
                }
            })
        }
        if (clsid == commonCons.getConstant('clsIdPart')) {
            $("#BOM_PARTCLASSIFY").textbox({disabled: true});
            $("#EAF_NAME").textbox({disabled: true});
            if (bomsyscode != "undefined") {
                $("#BOM_SYSCODE").textbox('setValue', bomsyscode);
            }
            if (bompartcode != "undefined") {
                $("#BOM_PARTCODE").textbox('setValue', bompartcode);
            }
            if (bomname != "undefined") {
                $("#EAF_NAME").textbox('setValue', bomname);
            }
            if (bompartclassify != "undefined") {
                $("#BOM_PARTCLASSIFY").textbox('setValue', bompartclassify);
            }
        }
    });
    //保存
    function uie_frm_save(fn) {

        if (clsid == commonCons.getConstant('clsIdTrain')) {

            if ($("#BOM_CX").length == 0 || $("#BOM_CH").length == 0)
                return -1;
            var bomcx = $("#BOM_CX").textbox('getValue');
            var bomch = $("#BOM_CH").textbox('getValue');
            if (!(edit == 'true' && origbomcx == bomcx && origbomch == bomch)) {
                var rule = '{"groupOp":"and","rules":[{"field":"BOM_CX","attrType":"0","op":"eq","data":"' + bomcx + '","isParameter":false},{"field":"BOM_CH","attrType":"0","op":"eq","data":"' + bomch + '","isParameter":false}],"groups":[]}';
                if (common.IsEafExistByRule(clsid, rule) == "0") //判断车型车号是否重复
                {
                    return;
                }

            }
            var bomtraincode = $("#BOM_TRAIN_CODE").textbox('getValue');
            if (!(edit == 'true' && bomtraincode == origbomtraincode)) {
                if (common.IsTrainCodeExist(clsid, bomtraincode) == "0") //判断机车编码是否重复
                {
                    return;
                }
            }
        }
        if (clsid == commonCons.getConstant('clsIdMachine')) {

            if ($("#BOM_SERIALNUMBER").length == 0 || $("#BOM_PARTCLASSIFY").length == 0)
                return -1;
            var BOM_SERIALNUMBER = $("#BOM_SERIALNUMBER").textbox('getValue');
            var BOM_PARTCLASSIFY = $("#BOM_PARTCLASSIFY").textbox('getValue');
            if (!(edit == 'true' && origBOM_SERIALNUMBER == BOM_SERIALNUMBER && origBOM_PARTCLASSIFY == BOM_PARTCLASSIFY)) {
                var rule = '{"groupOp":"and","rules":[{"field":"BOM_SERIALNUMBER","attrType":"0","op":"eq","data":"' + BOM_SERIALNUMBER + '","isParameter":false},{"field":"BOM_PARTCLASSIFY","attrType":"0","op":"eq","data":"' + BOM_PARTCLASSIFY + '","isParameter":false}],"groups":[]}';
                if (common.IsEafExistByRule(clsid, rule) == "0") //判断零件是否重复
                {
                    return;
                }
            }
        }

        if (clsid == commonCons.getConstant('clsIdComponents')) {
            if ($("#EAF_CODE").length == 0)
                return -1;
            if (!(origEAF_CODE == $("#EAF_CODE").textbox('getValue') && edit == 'true')) {
                if (common.IsEafCodeExist() == "0") {
                    return;
                }
            }

        }


        eafform.uie_frm_save(fn);
    }
    //关闭返回值
    function getResult() {
        if (bompartclassify != null) {//替换新配件特殊处理
            if (!divform.form('validate')) {
                return;
            }
            if (eaf_formshow == true) {
                if (fn)  fn();
                return;
            }
            var updated = divform.serializeObject();
            var ifrmeafs = $("iframe[name^=ifmeaf_]")
            for (var i = 0; i < ifrmeafs.length; i++) {
                try {
                    var ifrmeaf = eaf.getIframWin(ifrmeafs[i]);
                    if (ifrmeaf.objectlist.datagrid('getChanges').length > 0)
                        ifrmeaf.uie_dgd_save();
                    var rownumbs = ifrmeaf.objectlist.datagrid('getRows').length;
                    var ifmprop = ifrmeafs[i].name.substr(7);
                    updated[ifmprop] = rownumbs;
                } catch (e) {
                }
            }
            var data = {
                classId: clsid,
                insertObjects: '[]',
                updateObjects: '[' + eaf.jsonToStr(eaf.escapejson(updated)) + ']',
                deleteObjects: '[]'
            };
            eaf.saveData2('ObjectService', 'SaveObjects', data, function (r) {
            });
            return divform.serializeObject();
        } else {
            return divform.serializeObject();
        }
    }
</script>
<style>
    .easyui-fluid {
        width: 100%;
        height: 95%;
    }
</style>
<%@ include file='/main/footer.jsp' %>
