
/*
 @Title: OUI.Table.js
 @Description：表格/树形表格插件
 @Author: oukunqing
 @License：MIT
*/

!function ($) {
    'use strict';

    var doc = document,
        head = document.getElementsByTagName('head')[0],
        thisFilePath = $.getScriptSelfPath(true),
        CELL_LINE_NUMBER = 'cell-line-number',
        CELL_CHECKBOX = 'cell-checkbox',
        TABLE_INDEX = 1,
        isCellSpan = function (span) {
            return $.isNumber(span) && span > 0;
        },
        isString = function () {
            for (var i = 0; i < arguments.length; i++) {
                if ($.isString(arguments[i]) && arguments[i].length > 0) {
                    return true;
                }
            }
            return false;
        },
        isDyadicArray = function (data) {
            if ($.isArray(data) && data.length > 0) {
                return $.isArray(data[0]) || $.isObject(data[0]);
            }
            return false;
        },
        deleteTableRow = function (tr) {
            if (tr !== null && tr.parentNode != null) {
                if (tr.parentNode.tagName === 'TBODY' || tr.parentNode.tagName === 'THEAD') {
                    tr.parentNode.parentNode.deleteRow(tr.rowIndex);
                } else if (tr.parentNode.tagName === 'TABLE') {
                    tr.parentNode.deleteRow(tr.rowIndex);
                }
            }
        },
        getRowIndex = function (tr) {
            return tr !== null ? tr.rowIndex : -1;
        },
        getTHeadRows = function (tb) {
            return $.isObject(tb) && tb.tagName === 'TABLE' && tb.tHead ? tb.tHead.rows.length : 0;
        },
        getContainer = function (tb, isHead) {
            if (isHead) {
                return tb.tHead || tb.createTHead();
            } else {
                return tb.tBodies[0] || tb.createTBody();
            }
        },
        isTHead = function(container){
            return container.tagName === 'THEAD';
        },
        createRow = function (that, container, datas, trees, pids, isAppend) {
            var rowIndex = container.rows.length, op = that.options;
            if (!isDyadicArray(datas)) {
                datas = [datas];
            }
            console.log(container.tagName);
            var isHead = isTHead(container), len = datas.length, inserted = false;
            if (!that.options.showTree || $.isUndefined(trees)) {
                for (var i in datas) {
                    var row = container.insertRow(rowIndex + Number(i));
                    insertCell(that, row, datas[i], isHead);

                    if(!isHead || !inserted){
                        insertCheckboxCell(that, row, isHead, len);
                        insertLineNumberCell(that, row, isHead, len);
                        inserted = true;
                    }
                }
            } else {
                createTreeRow(that, container, datas, trees, pids, isAppend);
            }
        },
        createTreeRow = function (that, container, datas, trees, pids, isAppend) {
            var op = that.options, isHead = isTHead(container), len = datas.length, inserted = false;
            isAppend = $.isBoolean(isAppend, false);
            for (var i in datas) {
                var d = datas[i], isArray = $.isArray(d), treeData = d.treeData || {};
                if (isArray || pids.indexOf(treeData.pid) >= 0) {
                    var rowIndex = container.rows.length;
                    if (isAppend) {
                        rowIndex = findRowIndex(that, container, treeData.pid);
                    }
                    var row = container.insertRow(rowIndex);
                    insertCell(that, row, datas[i], isHead);

                    if(!isHead || !inserted){
                        insertCheckboxCell(that, row, isHead, len);
                        insertLineNumberCell(that, row, isHead, len);
                        inserted = true;
                    }

                    var key = buildKey(treeData.id), hasChild = checkChild(key, trees);
                    if (hasChild) {
                        //递归创建树表格行
                        createTreeRow(that, container, datas, trees, [treeData.id], isAppend);
                    }
                }
            }
            return 0;
        },
        getOptionValue = function(dr){
            if($.isString(dr)){
                return dr;
            }
            var keys = ['content', 'html', 'text'];
            for(var i in keys){
                var key = keys[i];
                if(!$.isUndefined(dr[key])){
                    return dr[key];
                }
            }
            return '';
        },
        insertLineNumberCell = function(that, row, isHead, rowCount){
            var op = that.options;
            if(op.showLineNumber){
                var cell = row.insertCell(0);
                cell.className = CELL_LINE_NUMBER;
                if(isHead){
                    if(rowCount > 1){
                        cell.rowSpan = rowCount;
                    }
                    cell.innerHTML = '序号';
                } else {
                    cell.innerHTML = '';
                }
            }
        },
        showQuickMenu = function(sender, menu, ev){
            var obj = $I(menu), show = obj.style.display === 'none';
            //toggle方式显示快捷菜单
            obj.style.display = show ? 'block' : 'none';

            if(show){                
                obj.style.left = ev.clientX + 'px';
                obj.style.top = ev.clientY + 'px';
            }

            if(!sender.first){
                $.addEventListener(document, 'click', function(){
                    obj.style.display = 'none';
                });
            }
            sender.first = 1;
            $.cancelBubble();
        },
        insertCheckboxCell = function(that, row, isHead, rowCount){
            var op = that.options;
            if(op.showCheckbox){
                var cell = row.insertCell(0), id = that.id + '-chb', menu = id + '-menu';
                cell.className = CELL_CHECKBOX;                 
                if(isHead){
                    if(rowCount > 1){
                        cell.rowSpan = rowCount;
                    }
                    var html = '<input type="checkbox" id="' + id + '" />';
                    
                    if(op.showQuickMenu){
                        if(op.showQuickMenuButton){
                            html += '<a id=' + (id + '-a') + ' class="quick-a">&or;</a>';
                        }
                        html += '<div id="' + (menu) + '" class="quick-menu" style="display:none;">'
                            + '<a v="1">全选</a>'
                            + '<a v="0">不选</a>'
                            + '<a v="2">反选</a>'
                            + '</div>';
                    }
                    cell.innerHTML = html;

                    $.addEventListener($I(id), 'click', function(ev){
                        $.setChecked(id, this.checked ? 1 : 0);
                        ev.stopPropagation();
                    });

                    if(op.showQuickMenu){
                        if(op.showQuickMenuButton){
                            $.addEventListener($I(id + '-a'), 'click', function(ev){ showQuickMenu(this, menu, ev); });
                        } else {
                            $.addEventListener(cell, 'click', function(ev){ showQuickMenu(this, menu, ev); });
                        }
                        $('#' + menu + ' a').each(function(i, obj){
                            $.addEventListener(obj, 'click', function(){
                                var action = parseInt(obj.getAttribute('v'), 10);
                                $.setChecked(id, action);
                                //设置表头中的复选框状态
                                $I(id).checked = action === 1 ? true : action === 0 ? false : !$I(id).checked;
                                //隐藏快捷菜单DIV
                                this.parentNode.style.display = 'none';
                                $.cancelBubble();
                            });
                        });
                    }
                } else {
                    cell.innerHTML = '<input type="checkbox" name="' + id + '" />';
                }
            }
        },
        getCheckedRow = function(that, name){
            name = name || (that.id + '-chb');
            var arr = $N(name, {attribute: {checked: true}});

            console.log('getCheckedRow: ', arr);
        },
        insertCell = function (that, row, data, isHead) {
            var isArray = $.isArray(data),
                showTree = that.options.showTree,
                treeCellIndex = that.options.treeCellIndex || 0,
                cellData = isArray ? data : data.cellData || data.cell || data.cells,
                rowData = data.rowData || data.row,
                treeData = data.treeData || data.tree,
                cellIndex = 0, startIndex = row.cells.length,
                cols = !$.isUndefined(cellData) ? cellData.length : 0,
                isRow = $.isObject(rowData) && !$.isEmpty(rowData),
                isTree = showTree && $.isObject(treeData) && !$.isEmpty(treeData),
                id = isTree ? treeData.id : '',
                func = function (obj, action) {
                    //that.tree.toggle(this.getAttribute('tid'));
                    //需要给相关的tr td 和 图标 设置 tid 属性
                    that.tree[action || 'toggle'](obj.getAttribute('tid'));
                    $.cancelBubble();
                },
                trigger = that.options.trigger,
                set = function (obj, id, configs) {
                    obj.setAttribute('tid', id);
                    $.setStyle(obj, 'cursor', 'default');
                    $.addEventListener(obj, configs[0], function () { func(this, configs[1] || 'toggle'); });
                };

            for (var i = 0; i < cols; i++) {
                var dr = cellData[i], cell = row.insertCell(startIndex + cellIndex);
                if (isRow && i === 0) {
                    insertCellProperty(row, rowData);
                }

                var content = getOptionValue(dr);
                //如果用了树形结构，排序会引起顺序错乱，所以不允许排序
                if (isTree && cellIndex === treeCellIndex) {
                    row.setAttribute('id', buildId(id));
                    //row.setAttribute('tree', '{{id:{id},pid:{pid},level:{level}}}'.format(treeData));
                    row.setAttribute('tree', '{id:' + treeData.id + ',pid:' + treeData.pid + ',level:' + treeData.level + '}');
                    //设置tr创建记录，通过id找tr位置时要用到
                    setTreeFlag(that.tree, id, false);
                    content = buildSwitch(that.tree, id, treeData.level) + content;
                    if($.isDebug()){
                        //临时测试用
                        content += ' [ id: ' + treeData.id + ', pid: ' + treeData.pid + ', level: ' + treeData.level + ' ]';
                    }
                    cell.innerHTML = content;

                    var btnSwitch = $I(buildSwitchId(id));

                    $.addEventListener(btnSwitch, 'click', function () { func(this, 'toggle'); });

                    trigger.cell && set(cell, id, trigger.cell || []);
                    trigger.row && set(row, id, trigger.row || []);
                } else {
                    cell.innerHTML = content;
                }

                if ($.isObject(dr)) {
                    if (isCellSpan(dr.rowSpan)) { cell.rowSpan = dr.rowSpan; }
                    if (isCellSpan(dr.colSpan)) { cell.colSpan = dr.colSpan; }

                    insertCellProperty(cell, dr);
                }
                cellIndex++;
            }
        },
        insertCellProperty = function (elem, dr) {
            $.setStyle(elem, dr.style, true);

            if ($.isObject(dr.event)) {
                for (var k in dr.event) {
                    $.addEventListener(elem, k, dr.event[k]);
                }
            }
            var attr = dr.attribute || dr.attr || dr.property || dr.prop;
            $.setAttribute(elem, attr, true);
        },
        checkChild = function (key, trees) {
            if (trees !== null) {
                var childs = trees[key];
                if (childs && childs.length > 0) {
                    return true;
                }
            }
            return false;
        },
        getRowCount = function (that, trees, pid, rowCount) {
            for (var i in trees) {
                if (!hasTreeFlag(that.tree, trees[i])) {
                    break;
                }
                rowCount++;
                var childs = getChildIds(that.tree, trees[i]);
                if ($.isArray(childs)) {
                    getRowCount(that, childs, trees[i], rowCount);
                }
            }
            return rowCount;
        },
        findRowIndex = function (that, container, pid) {
            var childs = getChildIds(that.tree, pid), len = childs.length;
            var tr = $I(buildId(pid)), rowCount = 0, idx = -1;
            var headRows = container.tagName === 'TBODY' ? getTHeadRows(that.table) : 0;
            if (len > 0 && tr != null) {
                var id = 0, realPid = 0;
                //找到父节点下的最后一个有效的直系子节点所在的行
                for (var i = len - 1; i >= 0; i--) {
                    id = childs[i], idx = getRowIndex($I(buildId(id))) - headRows;
                    if (idx >= 0) {
                        realPid = id;
                        break;
                    }
                }
                //如果没找到，就把父节点当成最后一个子节点所在行
                if (idx < 0) {
                    idx = getRowIndex($I(buildId(pid))) - headRows, realPid = idx >= 0 ? pid : 0;
                }

                if (realPid > 0) {
                    //再递归查找最后一个子节点所占的总行数
                    var trees = getChildIds(that.tree, realPid);
                    rowCount = getRowCount(that, trees, realPid, 0);
                }
            }
            return rowCount + (idx < 0 ? container.rows.length : idx + 1);
        },
        findRow = function(obj) {
            if(obj !== null) {
                var parent = obj.parentNode;
                if(parent !== null) {
                    return parent.tagName === 'TR' ? parent : findRow(parent);
                }
            }
            return null;
        },
        setRowStyle = function(force, className){
            var that = this, op = that.options, css = className || op.alternateClassName;
            if((!force && !op.alternate) || !css){
                return false;
            }
            if(op.timerAlternate){
                window.clearTimeout(op.timerAlternate);
            }
            op.timerAlternate = window.setTimeout(function(){
                var tb = that.table, headRows = getTHeadRows(tb), rows = tb.rows.length, idx = 0;                
                for(var i = headRows; i < rows; i++){
                    var tr = tb.rows[i];
                    $.removeClass(tr, css);
                    if(idx++ % 2 === 0){
                        $.addClass(tr, css);
                    }
                }
            }, 320);
        },
        setLineNumber = function(force){
            var that = this, op = that.options;
            if(!force && !op.showLineNumber){
                return false;
            }
            if(op.timerLineNumber){
                window.clearTimeout(op.timerLineNumber);
            }
            op.timerLineNumber = window.setTimeout(function(){
                var tb = that.table, headRows = getTHeadRows(tb), rows = tb.rows.length, idx = 0;
                for(var i = headRows; i < rows; i++){
                    var cell = tb.rows[i].cells[0];
                    if(cell){
                        cell.innerHTML = ++idx;
                    }
                }
            }, 320);
        },
        callback = function(func, value){
            $.isFunction(func) && func(value);
        };

    function Table(options) {
        /*
        options = options || {};
        if ($.isUndefined(options.className) || $.isEmpty(options.className)) {
            $.loadLinkStyle($.getFilePath(thisFilePath) + $.getFileName(thisFilePath, true).replace('.min', '') + '.css');
        }
        */
        $.loadLinkStyle($.getFilePath(thisFilePath) + $.getFileName(thisFilePath, true).replace('.min', '') + '.css');

        var that = this, op = $.extend({
            table: null,                            //表格（对象 或 Id 或 null)，为null则自动创建表格对象（可以不设置）
            parent: doc.body,                       //表格父节点，默认为 document.body （可以不设置）
            showLineNumber: false,                  //是否显示行号（若为true，则自动增加一列用于显示行号）
            showCheckbox: false,                    //是否显示复选框
            showQuickMenu: false,                   //是否显示复选框快捷菜单
            showQuickMenuButton: false,             //是否显示复选框快捷菜单按钮
            alternate: false,                       //是否设置交替行样式（背景色）
            alternateClassName: 'alternate',        //交替行的样式
            className: '',                          //指定表格样式
            showTree: false,                        //是否显示树形结构，boolean值： true | false, 默认为false（可以不设置）
            treeCellIndex: 0,                       //要显示树形结构的列索引，从0开始，默认为0（可以不设置）
            trigger: {                              //树形收缩/展开触发器，若cell和row同时设置了不同的事件，可能会有事件冒泡
                cell: '',   //['click', 'toggle']       //点击列触发事件，数组或字符串，第1个元素为事件：(click, dblclick)，第2个元素为动作： (toggle, expand, collapse)
                row: ''     //['click', 'toggle']       //点击行触发事件，数组或字符串，第1个元素为事件：(click, dblclick)，第2个元素为动作： (toggle, expand, collapse)
            },
            headData: [],                           //初始化时要创建的表格头部数据（可以不设置），数据格式参考示例说明
            bodyData: [],                           //初始化时要创建的表格主体数据（可以不设置），数据格式参考示例说明
            treeOptions: {                          //树形结构参数
                //spaceWidth: 16,                       //树形每一层之间的缩进距离，单位为px，默认为16px（可以不设置）
                /*className: {                          //树形结构箭头图标样式
                    expand: 'expand',                   //节点展开时的样式
                    collapse: 'collapse',                //节点收缩时的样式
                    selected: 'selected'
                },
                */
                //className: ['expand', 'collapse', 'selected']     //可以数组形式，第1个元素为节点展开的样式
            }
        }, options), trigger = op.trigger;

        that.id = 'oui-table-' + (TABLE_INDEX++);
        that.options = op;
        that.table = op.table;
        if (op.showTree) {
            that.tree = new TableTree(op.showTree, op.treeOptions || {});
            that.tree.Table = that;
        }

        if (!$.isElement(that.table, 'TABLE')) {
            if (isString(that.table)) {
                op.id = that.table;
                that.table = $I(that.table);
            }
            if (that.table === null) {
                var id = that.table;
                that.table = doc.createElement('TABLE');
                that.table.id = op.id || '';
                that.table.className = op.className || '';
                op.parent.appendChild(that.table);
            }
        }
        if (that.table === null) {
            return false;
        }

        $.addClass(that.table, 'oui-table');

        if(op.showTree){
            $.addClass(that.table, 'oui-table-tree');
        }

        if($.isString(op.alternate, true)){
            op.alternateClassName = op.alternate;
            op.alternate = true;
        }

        if(op.showCheckbox){
            if(!$.isBoolean(options.showQuickMenu)){
                op.showQuickMenu = true;
            }
        }

        if ($.isString(trigger.cell)) {
            op.trigger.cell = [trigger.cell, 'toggle'];
        }
        if ($.isString(trigger.row)) {
            op.trigger.row = [trigger.row, 'toggle'];
        }

        //先清除所有行，防止重复添加
        that.clearRow();

        if (op.headData) {
            that.createHead(op.headData);
        }
        if (op.bodyData) {
            that.createBody(op.bodyData);
        }

    }

    Table.prototype = {
        createHead: function (headData, func) {
            return createRow(this, getContainer(this.table, true), headData), callback(func), this;
        },
        createBody: function (bodyData, func) {
            if (bodyData.length === 0) {
                return false;
            }
            var that = this, container = getContainer(that.table, false), isAppend = container.rows.length > 0;
            if (that.options.showTree) {
                var ds = that.tree.initial(bodyData);
                createRow(that, container, ds.datas, ds.trees, ds.pids, isAppend);
            } else {
                createRow(that, container, bodyData);
            }
            return setRowStyle.call(this), setLineNumber.call(this), callback(func), this;
        },
        appendBody: function (bodyData, func) {
            return this.createBody(bodyData, func), this;
        },
        append: function (bodyData, isHeadData, func) {
            if($.isFunction(isHeadData)){
                func = isHeadData, isHeadData = false;
            }
            if (isHeadData) {
                this.createHead(bodyData, func);
            } else {
                this.createBody(bodyData, func);
            }
            return this;
        },
        deleteRow: function (rowIndex, func) {
            if (this.table.rows.length > rowIndex) {
                this.table.deleteRow(rowIndex);
            }
            return setRowStyle.call(this), setLineNumber.call(this), callback(func), this;
        },
        clearRow: function (keepRows, func) {
            keepRows = keepRows || 0;
            for (var i = this.table.rows.length - 1; i >= keepRows; i--) {
                this.table.deleteRow(i);
            }
            return callback(func), this;
        },
        getRow: function (ids) {
            if ($.isArray(ids)) {
                var list = [];
                for (var i in ids) {
                    var tr = $I(this.tree.buildId(ids[i]));
                    if (tr != null) {
                        list.push(tr);
                    }
                }
                return list;
            } else {
                return $I(this.tree.buildId(id));
            }
        },
        getCheckedRow: function(){
            return getCheckedRow(this);
        },
        alternate: function(className){
            return setRowStyle.call(this, true, className), this;
        }
    };

    function TableTree(isTree, options) {
        /*
        if ($.isUndefined(options.className) || $.isEmpty(options.className)) {
            $.loadLinkStyle($.getFilePath(thisFilePath) + $.getFileName(thisFilePath, true).replace('.min', '') + '.css');
        }
        */
        var that = this;
        that.options = $.extend({
            spaceWidth: 16,
            className: {
                expand: 'expand',
                collapse: 'collapse',
                selected: 'selected'
            }
        }, options);

        $.extend(that.options, {
            treeDatas: {}, treeFlags: {}, treeCache: {}, treeIndex: {}
        });

        var className = that.options.className;
        if ($.isArray(className)) {
            that.options.className = {
                expand: className[0],
                collapse: className[1] || ''
            };
        }

        that.enabled = $.isBoolean(isTree) ? isTree : false;
    }

    TableTree.prototype = {
        initial: function (bodyData) {
            var that = this;
            if (!that.enabled) {
                return { datas: bodyData, trees: null };
            }

            if (!isDyadicArray(bodyData)) {
                bodyData = [bodyData];
            }
            var len = bodyData.length, keys = {}, trees = {}, arr = [], datas = [], pids = [];
            for (var i = 0; i < len; i++) {
                var dr = bodyData[i];
                //如果数据结构中没有 treeData 属性，则加上这个属性，因为排序时需要通过这个属性
                if ($.isUndefined(dr.treeData)) {
                    dr.treeData = dr.tree || null;
                }
                var isArray = $.isArray(dr), treeData = isArray ? null : dr.treeData;
                if (isArray || !$.isObject(treeData) || $.isEmpty(treeData)) {
                    arr.push({ level: 0, data: dr });
                } else {
                    var key = buildKey(treeData.id);
                    //检测是否已存在相同的ID，防止重复创建
                    if (!isExist(that, key)) {
                        that.options.treeDatas[key] = dr;
                        setKeyValue(keys, key, treeData.id);
                        arr.push({ level: treeData.level || i, data: dr });
                    }
                }
            }

            for (var i = 0, c = arr.length; i < c; i++) {
                var dr = arr[i].data, isArray = $.isArray(dr), treeData = dr.treeData;
                var isTree = $.isObject(treeData) && !$.isEmpty(treeData);
                if (isTree) {
                    var key = buildKey(treeData.id), pkey = buildKey(treeData.pid);
                    //设置层级，找不到父级节点的层级设置为0，父级节点设置为-1
                    //上级节点为-1的行会追加到表格的最后
                    setLevel(that, dr.treeData, pkey, hasParent(that, pkey));

                    if (i === 0 || $.isUndefined(keys[pkey])) {
                        pids.push(treeData.pid || 0);
                    }
                    setKeyValue(trees, pkey, treeData.id);
                    setKeyValue(that.options.treeIndex, pkey, treeData.id);
                    trees[key] = [];
                }
                datas.push(dr);
            }
            //按level层级排序(升序)
            datas = quickSort(datas, 'level');

            return { datas: datas, trees: trees, pids: pids };
        },
        expandParent: function (id, func) {
            var key = buildKey(id), data = this.options.treeDatas[key];
            if (data && data.treeData) {
                var pid = data.treeData.pid || 0, pkey = buildKey(pid), pdata = this.options.treeDatas[pkey];
                if (pdata) {
                    var btnSwitch = $I(buildSwitchId(pid));
                    if (btnSwitch !== null && btnSwitch.getAttribute('expand') === '0') {
                        this.expand(pid);
                    }
                    this.expandParent(pid, func);
                }
            }
            return callback(func), this;
        },
        toggle: function (id, collapse, func) {
            var that = this, btnSwitch = $I(buildSwitchId(id));
            if (btnSwitch !== null) {
                //判断收缩还是展开
                collapse = $.isBoolean(collapse, btnSwitch.getAttribute('expand') === '1');
                setSwitch(that, btnSwitch, collapse, false);

                //展开时，需要检查父级节点是否是展开状态，若为收缩则展开
                if (!collapse) {
                    that.expandParent(id);
                }

                //获取当前节点下的所有子节点
                var childs = getChildIds(that, id), ids = getRowIds(that, childs, collapse, []);
                //记录收缩状态
                setCollapse(that, id, ids, collapse);

                for (var i = ids.length - 1; i >= 0; i--) {
                    var obj = $I(buildId(ids[i]));
                    if (obj !== null) {
                        obj.style.display = collapse ? 'none' : '';
                    }
                }
            }
            return callback(func), this;
        },
        collapse: function (id, func) {
            return this.toggle(id, true, func), this;
        },
        expand: function (id, func) {
            return this.toggle(id, false, func), this;
        },
        toggleLevel: function (level, collapse, func) {
            if ($.isInteger(level)) {
                //按层级展开时，收缩的层级+1
                level = (level < 0 ? 0 : level) + (collapse ? 0 : 1);

                for (var i in this.options.treeDatas) {
                    var dr = this.options.treeDatas[i].treeData || {}, id = dr.id;
                    var obj = $I(buildId(id)), btnSwitch = $I(buildSwitchId(id));
                    if (obj !== null) {
                        obj.style.display = dr.level <= level ? '' : 'none';
                    }
                    if (dr.level === level) {
                        //设置当前等级的子级为收缩状态，记录收缩状态
                        setSwitch(this, btnSwitch, true, true);
                        setCollapse(this, id, [], true);
                    } else if (!collapse && dr.level < level) {
                        //按层级展开时，设置当前等级为展开状态
                        setSwitch(this, btnSwitch, false, true);
                    }
                }
            }
            return callback(func), this;
        },
        collapseLevel: function (level, func) {
            return this.toggleLevel(level, true, func), this;
        },
        expandLevel: function (level, func) {
            return this.toggleLevel(level, false, func), this;
        },
        toggleAll: function (collapse, func) {
            for (var i in this.options.treeDatas) {
                var dr = this.options.treeDatas[i].treeData || {}, id = dr.id;
                var obj = $I(buildId(id)), btnSwitch = $I(buildSwitchId(id));
                if (obj !== null) {
                    obj.style.display = collapse && dr.level > 0 ? 'none' : '';
                }
                //设置当前等级的子级为收缩状态，记录收缩状态
                setSwitch(this, btnSwitch, collapse, false);
                if (dr.level > 0) {
                    setCollapse(this, id, [], collapse);
                }
            }
            return callback(func), this;
        },
        collapseAll: function (func) {
            return this.toggleAll(true, func), this;
        },
        expandAll: function (func) {
            return this.toggleAll(false, func), this;
        },
        remove: function (id, keepSelf, func) {
            if($.isFunction(keepSelf)){
                func = keepSelf, keepSelf = false;
            }
            var obj = $I(buildId(id));
            if(obj === null){
                return callback(func, false), this; 
            }
            //获取当前节点下的所有子节点
            var childs = getChildIds(this, id), ids = getRowIds(this, childs, true, []), len = ids.length;
            for (var i = len - 1; i >= 0; i--) {
                var tr = $I(buildId(ids[i]));
                deleteTableRow(tr);
            }
            if (!keepSelf) {
                deleteTableRow(obj);
            }
            setLineNumber.call(this.Table);

            return callback(func, true), this;
        },
        removeChild: function (id, func) {
            return this.remove(id, true, func), this;
        },
        select: function (id, func) {
            var that = this, op = that.options, fa = $I(buildFocusId(id)), find = fa !== null;
            if (find) {
                var tr = findRow(fa);
                if(tr !== null) {
                    if(that.selector){
                        $.removeClass(that.selector, op.className.selected);
                    }
                    that.selector = tr;

                    $.addClass(tr, op.className.selected);
                }
                fa.focus();
            }
            return callback(func, find), this;
        }
    };

    var buildKey = function (id) {
        return 'k_' + id;
    },
        buildId = function (id) {
            return 'tr_' + id;
        },
        setKeyValue = function (data, key, value) {
            if ($.isUndefined(data[key])) {
                data[key] = [];
            }
            if (!$.isUndefined(value)) {
                data[key].push(value);
            }
            return data;
        },
        hasParent = function (that, key) {
            return !$.isUndefined(that.options.treeDatas[key]);
        },
        getChildIds = function (that, pid) {
            var pkey = buildKey(pid);
            return that.options.treeIndex[pkey] || [];
        },
        setLevel = function (that, data, pkey, hasParent) {
            if (!hasParent) {
                data.level = 0, data.pid = 0;
            } else {
                var pdata = that.options.treeDatas[pkey];
                if (pdata && pdata.treeData && $.isInteger(pdata.treeData.level)) {
                    data.level = parseInt(1 + pdata.treeData.level, 10);
                }
            }
        },
        setTreeFlag = function (that, id, isDel) {
            var key = 'm_' + id;
            if (isDel) {
                if (!$.isUndefined(that.options.treeFlags[key])) {
                    delete that.options.treeFlags[key];
                }
            } else {
                that.options.treeFlags[key] = 1;
            }
        },
        hasTreeFlag = function (that, id) {
            var key = 'm_' + id;
            return !$.isUndefined(that.options.treeFlags[key]);
        },
        isExist = function (that, key) {
            return !$.isUndefined(that.options.treeDatas[key]);
        },
        getRowIds = function (that, trees, collapse, rows) {
            for (var i in trees) {
                var id = trees[i];
                if (!hasTreeFlag(that, id)) {
                    break;
                }
                rows.push(id);

                //展开时需要屏蔽之前被收缩的子节点
                if (!isCollapse(that, id) || collapse) {
                    var childs = that.options.treeIndex[buildKey(id)];
                    if ($.isArray(childs)) {
                        getRowIds(that, childs, collapse, rows);
                    }
                }
            }
            return rows;
        },
        buildSpace = function (len, spaceWidth) {
            var w = 0;
            for (var i = 0; i < len; i++) {
                w += (spaceWidth || 16);
            }
            return w;
        },
        buildFocusId = function(id){
            return 'focus_' + id;
        },
        buildSwitchId = function (id) {
            return 'switch_' + id;
        },
        buildSwitch = function (that, id, len) {
            var f = '<a id="' + buildFocusId(id) + '" class="table-tree-focuser" href="#" /></a>';
            var a = '<a id="{0}" tid="{1}" expand="1" class="{2}" style="cursor:pointer;margin-left:{3}px !important;"></a>'.format(
                buildSwitchId(id), id, that.options.className.expand, buildSpace(len, that.options.spaceWidth)
            );
            return f + a;
        },
        setSwitch = function (that, obj, collapse, isLevel) {
            if (obj === null) {
                return false;
            }
            obj.setAttribute('expand', collapse ? 0 : 1);
            obj.className = that.options.className[collapse ? 'collapse' : 'expand'];
        },
        setCollapse = function (that, pid, ids, collapse) {
            var key = buildKey(pid);
            if (collapse) {
                that.options.treeCache[key] = [];
                for (var i in ids) {
                    that.options.treeCache[key].push(ids[i]);
                }
            } else {
                if (!$.isUndefined(that.options.treeCache[key])) {
                    delete that.options.treeCache[key];
                }
            }
        },
        isCollapse = function (that, id) {
            var key = buildKey(id);
            return !$.isUndefined(that.options.treeCache[key]);
        },
        quickSort = function (arr, key) {
            if (0 === arr.length) {
                return [];
            }
            var left = [], right = [], pivot = arr[0], c = arr.length;
            for (var i = 1; i < c; i++) {
                arr[i].treeData[key] < pivot.treeData[key] ? left.push(arr[i]) : right.push(arr[i]);
            }
            return quickSort(left, key).concat(pivot, quickSort(right, key));
        };

    $.Table = Table;
}(OUI);