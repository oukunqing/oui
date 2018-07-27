
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
        thisFilePath = $.getScriptSelfPath(),
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
        createRow = function (that, container, datas, trees, pids, isAppend) {
            var rowIndex = container.rows.length;
            if (!isDyadicArray(datas)) {
                datas = [datas];
            }
            if (!that.options.showTree || $.isUndefined(trees)) {
                for (var i in datas) {
                    var row = container.insertRow(rowIndex + Number(i));
                    insertCell(that, row, datas[i]);
                }
            } else {
                createTreeRow(that, container, datas, trees, pids, isAppend);
            }
        },
        createTreeRow = function (that, container, datas, trees, pids, isAppend) {
            isAppend = $.isBoolean(isAppend, false);
            for (var i in datas) {
                var d = datas[i], isArray = $.isArray(d), treeData = d.treeData || {};
                if (isArray || pids.indexOf(treeData.pid) >= 0) {
                    var rowIndex = container.rows.length;
                    if (isAppend) {
                        rowIndex = findRowIndex(that, container, treeData.pid);
                    }
                    insertCell(that, container.insertRow(rowIndex), datas[i]);

                    var key = buildKey(treeData.id), hasChild = checkChild(key, trees);
                    if (hasChild) {
                        //递归创建树表格行
                        createTreeRow(that, container, datas, trees, [treeData.id], isAppend);
                    }
                }
            }
            return 0;
        },
        insertCell = function (that, row, data) {
            var isArray = $.isArray(data),
                showTree = that.options.showTree,
                treeCellIndex = that.options.treeCellIndex || 0,
                cellData = isArray ? data : data.cellData || data.cell || data.cells,
                rowData = data.rowData || data.row,
                treeData = data.treeData || data.tree,
                cellIndex = 0,
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
                set = function () {

                };

            for (var i = 0; i < cols; i++) {
                var dr = cellData[i], cell = row.insertCell(cellIndex);
                if (isRow && i === 0) {
                    insertCellProperty(row, rowData);
                }

                var content = dr.content || dr.html || dr.text || dr;
                if (isTree && cellIndex === treeCellIndex) {
                    row.setAttribute('id', buildId(id));
                    //row.setAttribute('tree', '{{id:{id},pid:{pid},level:{level}}}'.format(treeData));
                    row.setAttribute('tree', '{id:' + treeData.id + ',pid:' + treeData.pid + ',level:' + treeData.level + '}');
                    //设置tr创建记录，通过id找tr位置时要用到
                    setTreeFlag(that.tree, id, false);
                    content = buildSwitch(that.tree, id, treeData.level) + content;
                    //临时测试用
                    content += ' [ id: ' + treeData.id + ', pid: ' + treeData.pid + ', level: ' + treeData.level + ' ]';
                    cell.innerHTML = content;

                    var btnSwitch = doc.getElementById(buildSwitchId(id));

                    $.addEventListener(btnSwitch, 'click', function () { func(this, 'toggle'); });

                    if (trigger.cell) {
                        cell.setAttribute('tid', id);
                        $.addEventListener(cell, trigger.cell[0], function () { func(this, trigger.cell[1] || 'toggle'); });
                    }
                    if (trigger.row) {
                        row.setAttribute('tid', id);
                        $.addEventListener(row, trigger.row[0], function () { func(this, trigger.row[1] || 'toggle'); });
                    }
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

            return cell;
        },
        insertCellProperty = function (element, dr) {
            if ($.isObject(dr.style)) {
                for (var k in dr.style) {
                    element.style[k] = dr.style[k];
                }
            } else if ($.isString(dr.style)) {
                element.style.cssText = dr.style;
            }
            if ($.isObject(dr.event)) {
                for (var k in dr.event) {
                    $.addEventListener(element, k, dr.event[k]);
                }
            }
            var attr = dr.attribute || dr.attr || dr.property || dr.prop;
            if ($.isObject(attr)) {
                for (var k in attr) {
                    element.setAttribute(k, attr[k]);
                }
            }
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
            var tr = doc.getElementById(buildId(pid)), rowCount = 0, idx = -1;
            var headRows = container.tagName === 'TBODY' ? getTHeadRows(that.table) : 0;
            if (len > 0 && tr != null) {
                var id = 0, realPid = 0;
                //找到父节点下的最后一个有效的直系子节点所在的行
                for (var i = len - 1; i >= 0; i--) {
                    id = childs[i], idx = getRowIndex(doc.getElementById(buildId(id))) - headRows;
                    if (idx >= 0) {
                        realPid = id;
                        break;
                    }
                }
                //如果没找到，就把父节点当成最后一个子节点所在行
                if (idx < 0) {
                    idx = getRowIndex(doc.getElementById(buildId(pid))) - headRows, realPid = idx >= 0 ? pid : 0;
                }

                if (realPid > 0) {
                    //再递归查找最后一个子节点所占的总行数
                    var trees = getChildIds(that.tree, realPid);
                    rowCount = getRowCount(that, trees, realPid, 0);
                }
            }
            return rowCount + (idx < 0 ? container.rows.length : idx + 1);
        };

    function Table(options) {
        var that = this, op = $.extend({
            table: null,
            parent: doc.body,
            showTree: false,
            treeCellIndex: 0,
            trigger: {
                cell: '',   //['click', 'toggle']
                row: ''     //['click', 'toggle']
            },
            headData: [],
            bodyData: [],
            treeOptions: {}
        }, options), trigger = op.trigger;

        that.options = op;
        that.table = op.table;
        if (op.showTree) {
            that.tree = new TableTree(op.showTree, op.treeOptions || {});
        }

        if (!$.isElement(that.table, 'TABLE')) {
            if (isString(that.table)) {
                op.id = that.table;
                that.table = doc.getElementById(that.table);
            }
            if(that.table === null) {
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
        createHead: function (headData) {
            createRow(this, getContainer(this.table, true), headData);
        },
        createBody: function (bodyData) {
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
        },
        appendBody: function (bodyData) {
            this.createBody(bodyData);
        },
        append: function (bodyData, isHeadData) {
            if (isHeadData) {
                this.createHead(bodyData);
            } else {
                this.createBody(bodyData);
            }
        },
        deleteRow: function (rowIndex) {
            if (this.table.rows.length > rowIndex) {
                this.table.deleteRow(rowIndex);
            }
        },
        clearRow: function (keepRows) {
            keepRows = keepRows || 0;
            for (var i = this.table.rows.length - 1; i >= keepRows; i--) {
                this.table.deleteRow(i);
            }
        },
        getRow: function (ids) {
            if ($.isArray(ids)) {
                var list = [];
                for (var i in ids) {
                    var tr = doc.getElementById(this.tree.buildId(ids[i]));
                    if (tr != null) {
                        list.push(tr);
                    }
                }
                return list;
            } else {
                return doc.getElementById(this.tree.buildId(id));
            }
        }
    };

    function TableTree(isTree, options) {
        if ($.isUndefined(options.className) || $.isEmpty(options.className)) {
            $.loadLinkStyle($.getFilePath(thisFilePath) + $.getFileName(thisFilePath, true) + '.css');
        }
        var that = this;
        that.options = $.extend({
            spaceWidth: 16,
            className: {
                expand: 'table-tree-expand',
                collapse: 'table-tree-collapse'
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
        buildSwitchId = function (id) {
            return 'switch_' + id;
        },
        buildSwitch = function (that, id, len) {
            var a = '<a id="{0}" tid="{1}" expand="1" class="{2}" href="#" style="cursor:pointer;margin-left:{3}px !important;"></a>'.format(
                buildSwitchId(id), id, that.options.className.expand, buildSpace(len, that.options.spaceWidth)
            );
            return a;
        },
        setSwitch = function (that, obj, collapse, isLevel) {
            if (obj === null) {
                return false;
            }
            obj.setAttribute('expand', collapse ? 0 : 1);
            obj.className = that.options.className[collapse ? 'collapse' : 'expand'];
            //obj.innerHTML = collapse ? ' ++ ' : ' -- ';
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
        expandParent: function (id) {
            var key = buildKey(id), data = this.options.treeDatas[key];
            if (data && data.treeData) {
                var pid = data.treeData.pid || 0, pkey = buildKey(pid), pdata = this.options.treeDatas[pkey];
                if (pdata) {
                    var btnSwitch = doc.getElementById(buildSwitchId(pid));
                    if (btnSwitch !== null && btnSwitch.getAttribute('expand') === '0') {
                        this.expand(pid);
                    }
                    this.expandParent(pid);
                }
            }
        },
        toggle: function (id, collapse) {
            var that = this, btnSwitch = doc.getElementById(buildSwitchId(id));
            if (btnSwitch === null) {
                return false;
            }
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
                var obj = doc.getElementById(buildId(ids[i]));
                if (obj !== null) {
                    obj.style.display = collapse ? 'none' : '';
                }
            }
        },
        collapse: function (id) {
            this.toggle(id, true);
        },
        expand: function (id) {
            this.toggle(id, false);
        },
        toggleLevel: function (level, collapse) {
            if (!$.isInteger(level)) {
                return false;
            }
            //按层级展开时，收缩的层级+1
            level = (level < 0 ? 0 : level) + (collapse ? 0 : 1);

            for (var i in this.options.treeDatas) {
                var dr = this.options.treeDatas[i].treeData || {}, id = dr.id;
                var obj = doc.getElementById(buildId(id)), btnSwitch = doc.getElementById(buildSwitchId(id));
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
        },
        collapseLevel: function (level) {
            this.toggleLevel(level, true);
        },
        expandLevel: function (level) {
            this.toggleLevel(level, false);
        },
        toggleAll: function (collapse) {
            for (var i in this.options.treeDatas) {
                var dr = this.options.treeDatas[i].treeData || {}, id = dr.id;
                var obj = doc.getElementById(buildId(id)), btnSwitch = doc.getElementById(buildSwitchId(id));
                if (obj !== null) {
                    obj.style.display = collapse && dr.level > 0 ? 'none' : '';
                }
                //设置当前等级的子级为收缩状态，记录收缩状态
                setSwitch(this, btnSwitch, collapse, false);
                if (dr.level > 0) {
                    setCollapse(this, id, [], collapse);
                }
            }
        },
        collapseAll: function () {
            this.toggleAll(true);
        },
        expandAll: function () {
            this.toggleAll(false);
        },
        remove: function (id, keepSelf) {
            //获取当前节点下的所有子节点
            var childs = getChildIds(this, id), ids = getRowIds(this, childs, true, []), len = ids.length;
            for (var i = len - 1; i >= 0; i--) {
                var tr = doc.getElementById(buildId(ids[i]));
                deleteTableRow(tr);
            }
            if (!keepSelf) {
                deleteTableRow(doc.getElementById(buildId(id)));
            }
        },
        removeChild: function (id) {
            this.remove(id, true);
        },
        select: function (id) {
            var btnSwitch = doc.getElementById(buildSwitchId(id));
            if (btnSwitch !== null) {
                btnSwitch.focus();
            }
        }
    };

    $.Table = Table;
}(OUI);