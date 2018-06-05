function eaf_form(divform, param, clsid, objid, fromobj) {
    var fromwidth;
    //var uiid = uiid;
    var init = function () {
        if (!fromobj.EAF_ID) {
            if (objid && "undefined" != typeof objid)   fromobj.EAF_ID = objid;
            else  fromobj.EAF_ID = eaf.guid();
        }
        if ("undefined" != typeof eafshow && eafshow)eaf_formshow =(eafshow == 'true');
        else if(param.tools && param.tools.length == 0) eaf_formshow = true;
        if (typeof uiid == 'undefined' || !uiid) {
            uiid = '03128627BC074D1C89FB1C88C7157C0D';
        }
        var formconfig = eaf.readData("UserInterface", "GetUIConfigById", { clsid: clsid, uiid: uiid }); //表单界面配置
        //var formconfig = eaf.getObjById(eaf.getKeyfromTwo(clsid, uiid), 'E8D2A266288288E1E79001E428498331'); //表单界面配置
        fromwidth = ctl.getFromWidth(divform);
        //构建工具栏
        if (param.tools) {
            var uie_div = $('<div id="divtools" style="height:auto;background: #eee;"></div>').appendTo(divform);
            $.each(param.tools, function (i, row) {
                if("undefined" != typeof eafshow && eafshow=='true' && row.EAF_ICON =='icon-save')
                    return false;
                $('<a href="#" id="' +row.EAF_ID+'" class="easyui-linkbutton" data-options="plain:true,iconCls:\'' + row.EAF_ICON + '\'"  onclick="ctl.execToolEvent(\'' + escape(row.EAF_EVENT) + '\');">' + row.EAF_NAME + '</a>').appendTo(uie_div);
                if (row.EAF_JSFILE == '-') {
                    $('<div class="eaf-datagrid-toolbar"><div class="datagrid-btn-separator"></div></div>').appendTo(uie_div);
                }
            });
        }
        var k = 0;
        //无属性组属性
        var ungroupcols = [];
        $.each(param.attrs, function (i, row) {
            if (!row.EAF_GROUP || !param.groups) {
                if (row.EAF_FORMSHOW == 'Y') {
                    ungroupcols.push(row);
                } else {
                    $('<input type="hidden" id="' + row.EAF_CNAME + '" name="' + row.EAF_CNAME + '" value="' + ctl.getctlvalue(row, fromobj) + '"> ').appendTo(divform);
                }
            }
            else {
                var hid = true;
                $.each(param.groups, function (gi2, gn2) {
                    if(gn2.EAF_ID == row.EAF_GROUP){ hid = false;}
                });
                if (hid == true) {
                    $('<input type="hidden" id="' + row.EAF_CNAME + '" name="' + row.EAF_CNAME + '" value="' + ctl.getctlvalue(row, fromobj) + '"> ').appendTo(divform);
                }
            }
        });
        if (ungroupcols.length > 0) {
            createGrid(ungroupcols, k, {});
            k = k + 1;
        }
        //构建属性组
        if (param.groups) {
            $.each(param.groups, function (gi, gn) {
                var groupcols = [];
                $.each(param.attrs, function (i, row) {
                    if (gn.EAF_ID == row.EAF_GROUP) {
                        if (row.EAF_FORMSHOW == 'Y') {
                            groupcols.push(row);
                        }
                        else {
                            $('<input type="hidden" id="' + row.EAF_CNAME + '" name="' + row.EAF_CNAME + '" value="' + ctl.getctlvalue(row, fromobj) + '"> ').appendTo(divform);
                        }
                    }
                });
                if (groupcols.length && groupcols.length > 0) {
                    createGrid(groupcols, k, gn);
                    k = k + 1;
                }
            });
        }
        $.parser.parse();
        if (eaf_formshow==true) {
            $('input,textarea').attr("disabled", "disabled");
            $('input').css("border-style", "none");
            //$('.textbox-addon').hide();
            $('.textbox-icon:not(.icon-eye)').hide();
            $('.textbox-addon').css("right", "0");
            $('.textbox-button').hide();
            $('.textbox-text').each(function (i, val) {
                $(val).width($(val).width() + 56);
            });
            //            $.each(param.attrs, function (i, row) {
            //                if (row.EAF_CTLTYPE == 'richtextbox') {
            //                    var ue = UE.getEditor(row.EAF_CNAME);
            //                    if (ue) {
            //                        ue.ready(function () {
            //                            //$('.edui-box').hide();
            //                            var uehtml = ue.getContent();
            //                            $('#' + row.EAF_CNAME).html(uehtml);
            //                            //$('.edui-editor-toolbarbox').hide();
            //                            //$('.edui-editor-wordcount').hide();
            //                            //ue.setDisabled();
            //                        });
            //                    }
            //                }
            //            });
        }
        //表单加载后处理事件
        if (formconfig && formconfig.EAF_AFTERLOAD) {
            var afterload = formconfig.EAF_AFTERLOAD;
            var dataurl2 = afterload.split('|');
            var UserDef;
            if (dataurl2.length == 1) {
                UserDef = afterload;
                eaf.runJs(UserDef);
            }
            else {
                var UserFile = dataurl2[0];
                var UserDef = afterload.substr(UserFile.length + 1);
                if (UserFile) {
                    //$.getScript(UserFile);
                    $.getScript(UserFile, function () {
                        eval(UserDef);
                    });
                }
                else
                    eaf.runJs(UserDef);
            }
            //eval("(" +  UserDef + ")");
            //eval(UserDef);
            //eaf.runJs(UserDef);
        }
    };
    init();
    function createGrid(groupcols, k, gn) {
        if (!gn.EAF_COL) {//没有指定列数，则计算出能够显示的列数
            gn.EAF_COL = parseInt((fromwidth - 15) / 243);//parseInt(fromwidth / 235);
        }
        var gnpanel = divform;
        if (gn.EAF_NAME) {
            //创建属性组标题
            var icon = 'layout-button-down';
            gnpanel = $('<div id="gnpanel' + gn.EAF_ID + '" style="margin:0px 0px 5px 0px"></div>').appendTo(divform).panel({
                headerCls: 'eaf-formgroup',
                title: gn.EAF_NAME,
                closed: false,
                //width: fromwidth, 
                //doSize: true,
                //fit: true,
                collapsible: true,
                doSize: false,
                iconCls: 'icon-tip'
                //,tools: [{
                //    iconCls: icon,
                //    handler: function () {
                //        $('#gntable' + k).toggle("slow");
                //    }
                //}]
            });
        }
        //创建属性组内容
        var gntable = $('<div id="gntable' + k + '" ></div>').appendTo(gnpanel);
        //var colwidth = 243 - 75 - 5; //  300 - 80 - 25; // -2; //计算出每一列的宽度
        var colwidth = 242 - 70 - 10 - 10 - 2;
        ctl.createTables(groupcols, gntable, fromobj, gn.EAF_COL, colwidth);

        //        var rowcols = new Array();
        //        var colwidth = Math.floor(fromwidth / gn.EAF_COL) - 100 - 25; // -2; //计算出每一列的宽度
        //        for (var i = 0; i < groupcols.length; i++) {
        //            rowcols.push(groupcols[i]);
        //            if (groupcols[i].EAF_ISNEWROW = '是' || rowcols.length == gn.EAF_COL) {//当数据长度等于列数时，创建新行 
        //                //wd = Math.floor(twid / colNum) - 100 - 2; //计算行的显示宽度 总宽度/列数－lable宽度 并留出5px
        //                ctl.createRows(rowcols, gntable, colwidth, fromobj);
        //                rowcols.length = 0; //数组清0
        //            }
        //        }
        //        if (rowcols.length > 0) {//总记录数不能整除列数时，不足一行的记录单独计算       
        //            ctl.createRows(rowcols, gntable, colwidth, fromobj);
        //        }

    }
    //    function createRows(rowcols, table, colwidth) {
    //        var tr = $('<div style="margin:5px 5px 5px 10px"></div>'); //上右下左
    //        $.each(rowcols, function (i, row) {
    //            //创建行数据到表格
    //            var colwidth2 = colwidth;
    //            if (colwidth2 < row.EAF_WIDTH) {
    //                colwidth2 = parseInt(row.EAF_WIDTH) + 30;
    //            }
    //            var fr = $('<span style="width:100px;display:inline-block;" > <lable  for="span' + row.EAF_CNAME + '">' + row.EAF_NAME + ':</lable></span><span id="span' + row.EAF_CNAME + '" style="width:' + colwidth2 + 'px;display:inline-block"></span>');
    //            tr.appendTo(table);
    //            fr.appendTo(tr);
    //            ctl.getPropCtl(row, $('#span' + row.EAF_CNAME), getctlvalue(row));

    //        });
    //    }
    this.uie_frm_save = function (fn) {
        if (!divform.form('validate')) {
            return;
        }
        if (eaf_formshow == true){
            if (fn)  fn();
            return;
        }
        var updated = divform.serializeObject();
        var ifrmeafs = $("iframe[name^=ifmeaf_]")
        for (var i = 0; i < ifrmeafs.length; i++) {
            try {
                var ifrmeaf = eaf.getIframWin(ifrmeafs[i]);
                if(ifrmeaf.objectlist.datagrid('getChanges').length>0)
                    ifrmeaf.uie_dgd_save();
                var rownumbs = ifrmeaf.objectlist.datagrid('getRows').length;
                var ifmprop = ifrmeafs[i].name.substr(7);
                updated[ifmprop] = rownumbs;
            } catch (e) {}
        }
        //eaf.alertjson(updated);
        //var updated = JSON.stringify(escapejson(tgname.datagrid('getChanges', "updated")));
        var data = {
            classId: clsid,
            insertObjects: '[]',
            updateObjects: '[' + eaf.jsonToStr(eaf.escapejson(updated)) + ']',
            deleteObjects: '[]'
        };
        eaf.saveData2('ObjectService', 'SaveObjects', data, function (r) {
            //$("#AC86CDE46F7E6A26E17CF194D3F2B00D", parent.document).dialog('collapse')；
            try {
                if (fn) {
                    fn(r);
                }else{
                    $.messager.alert(eaf.getLabel('eaf_common_cue'), eaf.getLabel('eaf_formrel_success'));
                }
                var eafpdlg = eaf.getUrlParam('eafpdlg');
                if (eafpdlg) {
                    var dlg = $("#" + eafpdlg, parent.document);
                    //dlg.panel('options').execfn = 'true';
                    dlg.attr('execfn', 'true');
                }
                var linkdialog = top.$('#' + eafpdlg);
                linkdialog.dialog('close');
            } catch (e) {
            }
        });
    }
    //    this.getform = function () {
    //        return uie_editingId;
    //    }
}

function esg_eaf_form(divform, param, clsid, objid, fromobj) {
    var fromwidth;
    //var uiid = uiid;
    var init = function () {
        if (!fromobj.EAF_ID) {
            if (objid && "undefined" != typeof objid)   fromobj.EAF_ID = objid;
            else  fromobj.EAF_ID = eaf.guid();
        }
        if ("undefined" != typeof eafshow && eafshow)eaf_formshow =(eafshow == 'true');
        else if(param.tools && param.tools.length == 0) eaf_formshow = true;
        if (typeof uiid == 'undefined' || !uiid) {
            uiid = '03128627BC074D1C89FB1C88C7157C0D';
        }
        var formconfig = eaf.readData("UserInterface", "GetUIConfigById", { clsid: clsid, uiid: uiid }); //表单界面配置
        //var formconfig = eaf.getObjById(eaf.getKeyfromTwo(clsid, uiid), 'E8D2A266288288E1E79001E428498331'); //表单界面配置
        fromwidth = ctl.getFromWidth(divform);
        //构建工具栏
        if (param.tools) {
            var uie_div = $('<div id="divtools" style="height:auto;background: #eee;"></div>').appendTo(divform);
            $.each(param.tools, function (i, row) {
                if("undefined" != typeof eafshow && eafshow=='true' && row.EAF_ICON =='icon-save')
                    return false;
                $('<a href="#" id="' +row.EAF_ID+'" class="easyui-linkbutton" data-options="plain:true,iconCls:\'' + row.EAF_ICON + '\'"  onclick="ctl.execToolEvent(\'' + escape(row.EAF_EVENT) + '\');">' + row.EAF_NAME + '</a>').appendTo(uie_div);
                if (row.EAF_JSFILE == '-') {
                    $('<div class="eaf-datagrid-toolbar"><div class="datagrid-btn-separator"></div></div>').appendTo(uie_div);
                }
            });
        }
        var k = 0;
        //无属性组属性
        var ungroupcols = [];
        $.each(param.attrs, function (i, row) {
            if (!row.EAF_GROUP || !param.groups) {
                if (row.EAF_FORMSHOW == 'Y') {
                    ungroupcols.push(row);
                } else {
                    $('<input type="hidden" id="' + row.EAF_CNAME + '" name="' + row.EAF_CNAME + '" value="' + ctl.getctlvalue(row, fromobj) + '"> ').appendTo(divform);
                }
            }
            else {
                var hid = true;
                $.each(param.groups, function (gi2, gn2) {
                    if(gn2.EAF_ID == row.EAF_GROUP){ hid = false;}
                });
                if (hid == true) {
                    $('<input type="hidden" id="' + row.EAF_CNAME + '" name="' + row.EAF_CNAME + '" value="' + ctl.getctlvalue(row, fromobj) + '"> ').appendTo(divform);
                }
            }
        });
        if (ungroupcols.length > 0) {
            createGrid(ungroupcols, k, {});
            k = k + 1;
        }
        //构建属性组
        if (param.groups) {
            $.each(param.groups, function (gi, gn) {
                var groupcols = [];
                $.each(param.attrs, function (i, row) {
                    if (gn.EAF_ID == row.EAF_GROUP) {
                        if (row.EAF_FORMSHOW == 'Y') {
                            groupcols.push(row);
                        }
                        else {
                            $('<input type="hidden" id="' + row.EAF_CNAME + '" name="' + row.EAF_CNAME + '" value="' + ctl.getctlvalue(row, fromobj) + '"> ').appendTo(divform);
                        }
                    }
                });
                if (groupcols.length && groupcols.length > 0) {
                    createGrid(groupcols, k, gn);
                    k = k + 1;
                }
            });
        }
        $.parser.parse();
        if (eaf_formshow==true) {
            $('input,textarea').attr("disabled", "disabled");
            $('input').css("border-style", "none");
            //$('.textbox-addon').hide();
            $('.textbox-icon:not(.icon-eye)').hide();
            $('.textbox-addon').css("right", "0");
            $('.textbox-button').hide();
            $('.textbox-text').each(function (i, val) {
                $(val).width($(val).width() + 56);
            });
            //            $.each(param.attrs, function (i, row) {
            //                if (row.EAF_CTLTYPE == 'richtextbox') {
            //                    var ue = UE.getEditor(row.EAF_CNAME);
            //                    if (ue) {
            //                        ue.ready(function () {
            //                            //$('.edui-box').hide();
            //                            var uehtml = ue.getContent();
            //                            $('#' + row.EAF_CNAME).html(uehtml);
            //                            //$('.edui-editor-toolbarbox').hide();
            //                            //$('.edui-editor-wordcount').hide();
            //                            //ue.setDisabled();
            //                        });
            //                    }
            //                }
            //            });
        }
        //表单加载后处理事件
        if (formconfig && formconfig.EAF_AFTERLOAD) {
            var afterload = formconfig.EAF_AFTERLOAD;
            var dataurl2 = afterload.split('|');
            var UserDef;
            if (dataurl2.length == 1) {
                UserDef = afterload;
                eaf.runJs(UserDef);
            }
            else {
                var UserFile = dataurl2[0];
                var UserDef = afterload.substr(UserFile.length + 1);
                if (UserFile) {
                    //$.getScript(UserFile);
                    $.getScript(UserFile, function () {
                        eval(UserDef);
                    });
                }
                else
                    eaf.runJs(UserDef);
            }
            //eval("(" +  UserDef + ")");
            //eval(UserDef);
            //eaf.runJs(UserDef);
        }
    };
    init();
    function createGrid(groupcols, k, gn) {
        if (!gn.EAF_COL) {//没有指定列数，则计算出能够显示的列数
            gn.EAF_COL = parseInt((fromwidth - 15) / 243);//parseInt(fromwidth / 235);
        }
        var gnpanel = divform;
        if (gn.EAF_NAME) {
            //创建属性组标题
            var icon = 'layout-button-down';
            gnpanel = $('<div id="gnpanel' + gn.EAF_ID + '" style="margin:0px 0px 5px 0px"></div>').appendTo(divform).panel({
                headerCls: 'eaf-formgroup',
                title: gn.EAF_NAME,
                closed: false,
                //width: fromwidth, 
                //doSize: true,
                //fit: true,
                collapsible: true,
                doSize: false,
                iconCls: 'icon-tip'
                //,tools: [{
                //    iconCls: icon,
                //    handler: function () {
                //        $('#gntable' + k).toggle("slow");
                //    }
                //}]
            });
        }
        //创建属性组内容
        var gntable = $('<div id="gntable' + k + '" ></div>').appendTo(gnpanel);
        //var colwidth = 243 - 75 - 5; //  300 - 80 - 25; // -2; //计算出每一列的宽度
        var colwidth = 242 - 70 - 10 - 10 - 2;
        createTables(groupcols, gntable, fromobj, gn.EAF_COL, colwidth, null);
        var trfirst = gnpanel.find("div").first().find("div").first();
        //var trlast = divform.find("tr").last();
        var btnsearch = $('<div id="alteration" style="margin:12px 0px 0px 92px"><a href="#"  class="sbyl" style="text-decoration:underline;color:blue;" onclick="historical_alteration()">历史变更</a></div>').appendTo(trfirst);

        //        var rowcols = new Array();
        //        var colwidth = Math.floor(fromwidth / gn.EAF_COL) - 100 - 25; // -2; //计算出每一列的宽度
        //        for (var i = 0; i < groupcols.length; i++) {
        //            rowcols.push(groupcols[i]);
        //            if (groupcols[i].EAF_ISNEWROW = '是' || rowcols.length == gn.EAF_COL) {//当数据长度等于列数时，创建新行 
        //                //wd = Math.floor(twid / colNum) - 100 - 2; //计算行的显示宽度 总宽度/列数－lable宽度 并留出5px
        //                ctl.createRows(rowcols, gntable, colwidth, fromobj);
        //                rowcols.length = 0; //数组清0
        //            }
        //        }
        //        if (rowcols.length > 0) {//总记录数不能整除列数时，不足一行的记录单独计算       
        //            ctl.createRows(rowcols, gntable, colwidth, fromobj);
        //        }

    }
    //    function createRows(rowcols, table, colwidth) {
    //        var tr = $('<div style="margin:5px 5px 5px 10px"></div>'); //上右下左
    //        $.each(rowcols, function (i, row) {
    //            //创建行数据到表格
    //            var colwidth2 = colwidth;
    //            if (colwidth2 < row.EAF_WIDTH) {
    //                colwidth2 = parseInt(row.EAF_WIDTH) + 30;
    //            }
    //            var fr = $('<span style="width:100px;display:inline-block;" > <lable  for="span' + row.EAF_CNAME + '">' + row.EAF_NAME + ':</lable></span><span id="span' + row.EAF_CNAME + '" style="width:' + colwidth2 + 'px;display:inline-block"></span>');
    //            tr.appendTo(table);
    //            fr.appendTo(tr);
    //            ctl.getPropCtl(row, $('#span' + row.EAF_CNAME), getctlvalue(row));

    //        });
    //    }
    //createTables(groupcols, gntable, fromobj, gn.EAF_COL, colwidth);
    //创建表单和查询表单用 20160316 edit by shy:copy from control.js and edited to show or hide.
    function createTables(groupcols, gntable, fromobj, colnumb, colwidth, op) {
        var rowcols = new Array();
        var rownumb=0;
        for (var i = 0; i < groupcols.length; i++) {
            rowcols.push(groupcols[i]);
            if (groupcols[i].EAF_ISNEWROW == 'Y') {//当数据长度等于列数时，创建新行 
                //wd = Math.floor(twid / colNum) - 100 - 2; //计算行的显示宽度 总宽度/列数－lable宽度 并留出5px
                rowcols.pop();
                ctl.createRows(rowcols, gntable, colwidth, fromobj, op, rownumb++);
                rowcols.length = 0; //数组清0
                rowcols.push(groupcols[i]);
            }
            if (rowcols.length == colnumb) {//当数据长度等于列数时，创建新行 
                //wd = Math.floor(twid / colNum) - 100 - 2; //计算行的显示宽度 总宽度/列数－lable宽度 并留出5px
                ctl.createRows(rowcols, gntable, colwidth, fromobj, op, rownumb++);
                rowcols.length = 0; //数组清0
            }
        }
        if (rowcols.length > 0) {//总记录数不能整除列数时，不足一行的记录单独计算       
            ctl.createRows(rowcols, gntable, colwidth, fromobj, op, rownumb++);
        }
       
    }
    this.uie_frm_save = function (fn) {
        if (!divform.form('validate')) {
            return;
        }
        if (eaf_formshow == true){
            if (fn)  fn();
            return;
        }
        var updated = divform.serializeObject();
        var ifrmeafs = $("iframe[name^=ifmeaf_]")
        for (var i = 0; i < ifrmeafs.length; i++) {
            try {
                var ifrmeaf = eaf.getIframWin(ifrmeafs[i]);
                if(ifrmeaf.objectlist.datagrid('getChanges').length>0)
                    ifrmeaf.uie_dgd_save();
                var rownumbs = ifrmeaf.objectlist.datagrid('getRows').length;
                var ifmprop = ifrmeafs[i].name.substr(7);
                updated[ifmprop] = rownumbs;
            } catch (e) {}
        }
        //eaf.alertjson(updated);
        //var updated = JSON.stringify(escapejson(tgname.datagrid('getChanges', "updated")));
        var data = {
            classId: clsid,
            insertObjects: '[]',
            updateObjects: '[' + eaf.jsonToStr(eaf.escapejson(updated)) + ']',
            deleteObjects: '[]'
        };
        eaf.saveData2('ObjectService', 'SaveObjects', data, function (r) {
            //$("#AC86CDE46F7E6A26E17CF194D3F2B00D", parent.document).dialog('collapse')；
            try {
                if (fn) {
                    fn(r);
                }else{
                    $.messager.alert(eaf.getLabel('eaf_common_cue'), eaf.getLabel('eaf_formrel_success'));
                }
                var eafpdlg = eaf.getUrlParam('eafpdlg');
                if (eafpdlg) {
                    var dlg = $("#" + eafpdlg, parent.document);
                    //dlg.panel('options').execfn = 'true';
                    dlg.attr('execfn', 'true');
                }
                var linkdialog = top.$('#' + eafpdlg);
                linkdialog.dialog('close');
            } catch (e) {
            }
        });
    }
    //    this.getform = function () {
    //        return uie_editingId;
    //    }
}