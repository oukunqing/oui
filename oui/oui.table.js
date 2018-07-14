
!function ($) {
    'use strict';

    var doc = document,
        head = document.getElementsByTagName('head')[0],
        thisFilePath = $.getScriptFilePath(),
        isCellSpan = function (span) {
            return $.isNumber(span) && span > 0;
        },
        isString = function () {
            for (var i = 0; i < arguments.length; i++) {
                if ($.isString(arguments[i])&& arguments[i].length > 0) {
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
        };


    function Table(options) {
        var that = this;
        that.options = $.extend({
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
        }, options),
            that.table = that.options.table,
            that.tree = new TableTree(that.options.showTree, that.options.treeOptions || {});

        var trigger = that.options.trigger;
        if ($.isString(trigger.cell)) {
            that.options.trigger.cell = [trigger.cell, 'toggle'];
        }
        if ($.isString(trigger.row)) {
            that.options.trigger.row = [trigger.row, 'toggle'];
        }
        if (!$.isElement(that.table, 'TABLE')) {
            if (isString(that.table)) {
                that.table = doc.getElementById(that.table);
            } else {
                that.table = doc.createElement('TABLE');
                that.options.parent.appendChild(that.table);
            }
        }
        if (that.table === null) {
            return false;
        }

        if (that.options.headData) {
            that.createHead(that.options.headData);
        }
        if (that.options.bodyData) {
            that.createBody(that.options.bodyData);
        }
    }

    Table.prototype = {
        getContainer: function (isHead) {
            try {
                if (isHead) {
                    return this.table.tHead || this.table.createTHead();
                } else {
                    return this.table.tBodies[0] || this.table.createTBody();
                }
            } catch (e) {
                return this.table;
            }
        },
        createHead: function (headData) {
            this.createRow(this.getContainer(true), headData);
        },
        createBody: function (bodyData) {
            if (bodyData.length === 0) {
                return false;
            }
            var that = this, container = that.getContainer(false), isAppend = container.rows.length > 0;
            if (that.options.showTree) {
                var ds = this.tree.initial(bodyData);
                that.createRow(container, ds.datas, ds.trees, ds.pids, isAppend);
            } else {
                that.createRow(container, bodyData);
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
            for (var i = this.table.rows.length - 1; i >= keepRows; i--) {
                this.table.deleteRow(i);
            }
        },
        createRow: function (container, datas, trees, pids, isAppend) {
            var rowIndex = container.rows.length;
            if (!isDyadicArray(datas)) {
                datas = [datas];
            }
            if (!this.options.showTree || $.isUndefined(trees)) {
                for (var i in datas) {
                    var row = container.insertRow(rowIndex + Number(i));
                    this.insertCell(row, datas[i]);
                }
            } else {
                this.createTreeRow(container, datas, trees, pids, isAppend);
            }
        },
        createTreeRow: function (container, datas, trees, pids, isAppend) {
            isAppend = $.isBoolean(isAppend, false);
            for (var i in datas) {
                var d = datas[i], isArray = $.isArray(d), treeData = d.treeData || {};
                if (isArray || pids.indexOf(treeData.pid) >= 0) {
                    var rowIndex = container.rows.length;
                    if (isAppend) {
                        rowIndex = this.findRowIndex(container, treeData.pid);
                    }
                    this.insertCell(container.insertRow(rowIndex), datas[i]);

                    var key = this.tree.buildKey(treeData.id), hasChild = this.checkChild(key, trees);
                    if (hasChild) {
                        //递归创建树表格行
                        this.createTreeRow(container, datas, trees, [treeData.id], isAppend);
                    }
                }
            }
            return 0;
        },
        insertCell: function (row, data) {
            var that = this,
                isArray = $.isArray(data),
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
                    $.stopBubble();
                },
                trigger = that.options.trigger,
                set = function(){

                };

            for (var i = 0; i < cols; i++) {
                var dr = cellData[i], cell = row.insertCell(cellIndex);
                if (isRow && i === 0) {
                    that.insertCellProperty(row, rowData);
                }

                var content = dr.content || dr.html || dr.text || dr;
                if (isTree && cellIndex === treeCellIndex) {
                    row.setAttribute('id', that.tree.buildId(id));
                    //row.setAttribute('tree', '{{id:{id},pid:{pid},level:{level}}}'.format(treeData));
                    row.setAttribute('tree', '{id:' + treeData.id + ',pid:' + treeData.pid + ',level:' + treeData.level + '}');
                    //设置tr创建记录，通过id找tr位置时要用到
                    that.tree.setMap(id, false);
                    content = that.tree.buildSwitch(id, treeData.level) + content;
                    //临时测试用
                    content += ' [ id: ' + treeData.id + ', pid: ' + treeData.pid + ', level: ' + treeData.level + ' ]';
                    cell.innerHTML = content;

                    var btnSwitch = doc.getElementById(that.tree.buildSwitchId(id));

                    $.addListener(btnSwitch, 'click', function () { func(this, 'toggle'); });

                    if (trigger.cell) {
                        cell.setAttribute('tid', id);
                        $.addListener(cell, trigger.cell[0], function () { func(this, trigger.cell[1] || 'toggle'); });
                    }
                    if (trigger.row) {
                        row.setAttribute('tid', id);
                        $.addListener(row, trigger.row[0], function () { func(this, trigger.row[1] || 'toggle'); });
                    }
                } else {
                    cell.innerHTML = content;
                }

                if ($.isObject(dr)) {
                    if (isCellSpan(dr.rowSpan)) { cell.rowSpan = dr.rowSpan; }
                    if (isCellSpan(dr.colSpan)) { cell.colSpan = dr.colSpan; }

                    that.insertCellProperty(cell, dr);
                }
                cellIndex++;
            }

            return cell;
        },
        insertCellProperty: function (element, dr) {
            if ($.isObject(dr.style)) {
                for (var k in dr.style) {
                    element.style[k] = dr.style[k];
                }
            } else if ($.isString(dr.style)) {
                element.style.cssText = dr.style;
            }
            if ($.isObject(dr.event)) {
                for (var k in dr.event) {
                    $.addListener(element, k, dr.event[k]);
                }
            }
            var attr = dr.attribute || dr.attr || dr.property || dr.prop;
            if ($.isObject(attr)) {
                for (var k in attr) {
                    element.setAttribute(k, attr[k]);
                }
            }
        },
        checkChild: function (key, trees) {
            if (trees !== null) {
                var childs = trees[key];
                if (childs && childs.length > 0) {
                    return true;
                }
            }
            return false;
        },
        findRowIndex: function (container, pid) {
            var childs = this.tree.getChildIds(pid), len = childs.length;
            var tr = doc.getElementById(this.tree.buildId(pid)), rowCount = 0, idx = -1;
            var headRows = container.tagName === 'TBODY' ? getTHeadRows(this.table) : 0;
            if (len > 0 && tr != null) {
                var id = 0, realPid = 0;
                //找到父节点下的最后一个有效的直系子节点所在的行
                for (var i = len - 1; i >= 0; i--) {
                    id = childs[i], idx = getRowIndex(doc.getElementById(this.tree.buildId(id))) - headRows;
                    if (idx >= 0) {
                        realPid = id;
                        break;
                    }
                }
                //如果没找到，就把父节点当成最后一个子节点所在行
                if (idx < 0) {
                    idx = getRowIndex(doc.getElementById(this.tree.buildId(pid))) - headRows, realPid = idx >= 0 ? pid : 0;
                }

                if (realPid > 0) {
                    //再递归查找最后一个子节点所占的总行数
                    var trees = this.tree.getChildIds(realPid);
                    rowCount = this.getRowCount(trees, realPid, 0);
                }
            }
            return rowCount + (idx < 0 ? container.rows.length : idx + 1);
        },
        getRowCount: function (trees, pid, rowCount) {
            for (var i in trees) {
                if (!this.tree.hasMap(trees[i])) {
                    break;
                }
                rowCount++;
                var childs = this.tree.getChildIds(trees[i]);
                if ($.isArray(childs)) {
                    this.getRowCount(childs, trees[i], rowCount);
                }
            }
            return rowCount;
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

        this.options = $.extend({
            spaceWidth: 16,
            className: {
                expand: 'table-tree-expand',
                collapse: 'table-tree-collapse'
            }
        }, options);

        var className = this.options.className;
        if ($.isArray(className)) {
            this.options.className = {
                expand: className[0],
                collapse: className[1] || ''
            };
        }

        this.isTree = $.isBoolean(isTree) ? isTree : false;
        this.collapseCache = {};
        this.datas = {};
        this.trees = {};
        this.maps = {};
    }

    TableTree.prototype = {
        buildKey: function (id) {
            return 'k_' + id;
        },
        buildId: function (id) {
            return 'tr_' + id;
        },
        setKeyValue: function (data, key, value) {
            if ($.isUndefined(data[key])) {
                data[key] = [];
            }
            if (!$.isUndefined(value)) {
                data[key].push(value);
            }
            return data;
        },
        hasParent: function (key) {
            return !$.isUndefined(this.datas[key]);
        },
        getChildIds: function (pid) {
            var pkey = this.buildKey(pid);
            return this.trees[pkey] || [];
        },
        setLevel: function (data, pkey, hasParent) {
            if (!hasParent) {
                data.level = 0, data.pid = 0;
            } else {
                var pdata = this.datas[pkey];
                if (pdata && pdata.treeData && $.isInteger(pdata.treeData.level)) {
                    data.level = parseInt(1 + pdata.treeData.level, 10);
                }
            }
        },
        setMap: function (id, isDel) {
            var key = 'm_' + id;
            if (isDel) {
                if (!$.isUndefined(this.maps[key])) {
                    delete this.maps[key];
                }
            } else {
                this.maps[key] = 1;
            }
        },
        hasMap: function (id) {
            var key = 'm_' + id;
            return !$.isUndefined(this.maps[key]);
        },
        isExist: function (key) {
            return !$.isUndefined(this.datas[key]);
        },
        initial: function (bodyData) {
            if (!this.isTree) {
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
                    var key = this.buildKey(treeData.id);
                    //检测是否已存在相同的ID，防止重复创建
                    if (!this.isExist(key)) {
                        this.datas[key] = dr;
                        this.setKeyValue(keys, key, treeData.id);
                        arr.push({ level: treeData.level || i, data: dr });
                    }
                }
            }

            for (var i = 0, c = arr.length; i < c; i++) {
                var dr = arr[i].data, isArray = $.isArray(dr), treeData = dr.treeData;
                var isTree = $.isObject(treeData) && !$.isEmpty(treeData);
                if (isTree) {
                    var key = this.buildKey(treeData.id), pkey = this.buildKey(treeData.pid);
                    //设置层级，找不到父级节点的层级设置为0，父级节点设置为-1
                    //上级节点为-1的行会追加到表格的最后
                    this.setLevel(dr.treeData, pkey, this.hasParent(pkey));

                    if (i === 0 || $.isUndefined(keys[pkey])) {
                        pids.push(treeData.pid || 0);
                    }
                    this.setKeyValue(trees, pkey, treeData.id);
                    this.setKeyValue(this.trees, pkey, treeData.id);
                    trees[key] = [];
                }
                datas.push(dr);
            }
            //按level层级排序(升序)
            datas = this.quickSort(datas, 'level');

            return { datas: datas, trees: trees, pids: pids };
        },
        getRowIds: function (trees, collapse, rows) {
            for (var i in trees) {
                var id = trees[i];
                if (!this.hasMap(id)) {
                    break;
                }
                rows.push(id);

                //展开时需要屏蔽之前被收缩的子节点
                if (!this.isCollapse(id) || collapse) {
                    var childs = this.trees[this.buildKey(id)];
                    if ($.isArray(childs)) {
                        this.getRowIds(childs, collapse, rows);
                    }
                }
            }
            return rows;
        },
        buildSpace: function (len, char) {
            var w = 0;
            for (var i = 0; i < len; i++) {
                w += (this.options.spaceWidth || 16);
            }
            return w;
        },
        buildSwitchId: function (id) {
            return 'switch_' + id;
        },
        buildSwitch: function (id, width) {
            var a = '<a id="{0}" tid="{1}" expand="1" class="{2}" href="#" style="cursor:pointer;margin-left:{3}px !important;"></a>'.format(
                this.buildSwitchId(id), id, this.options.className.expand, this.buildSpace(width)
            );
            return a;
        },
        setSwitch: function (obj, collapse, isLevel) {
            if (obj === null) {
                return false;
            }
            obj.setAttribute('expand', collapse ? 0 : 1);
            obj.className = this.options.className[collapse ? 'collapse' : 'expand'];
            //obj.innerHTML = collapse ? ' ++ ' : ' -- ';
        },
        setCollapse: function (pid, ids, collapse) {
            var key = this.buildKey(pid);
            if (collapse) {
                this.collapseCache[key] = [];
                for (var i in ids) {
                    this.collapseCache[key].push(ids[i]);
                }
            } else {
                if (!$.isUndefined(this.collapseCache[key])) {
                    delete this.collapseCache[key];
                }
            }
        },
        isCollapse: function (id) {
            var key = this.buildKey(id);
            return !$.isUndefined(this.collapseCache[key]);
        },
        expandParent: function (id) {
            var key = this.buildKey(id), data = this.datas[key];
            if (data && data.treeData) {
                var pid = data.treeData.pid || 0, pkey = this.buildKey(pid), pdata = this.datas[pkey];
                if (pdata) {
                    var btnSwitch = doc.getElementById(this.buildSwitchId(pid));
                    if (btnSwitch !== null && btnSwitch.getAttribute('expand') === '0') {
                        this.expand(pid);
                    }
                    this.expandParent(pid);
                }
            }
        },
        toggle: function (id, collapse) {
            var btnSwitch = doc.getElementById(this.buildSwitchId(id));
            if (btnSwitch === null) {
                return false;
            }
            //判断收缩还是展开
            collapse = $.isBoolean(collapse, btnSwitch.getAttribute('expand') === '1');
            this.setSwitch(btnSwitch, collapse, false);

            //展开时，需要检查父级节点是否是展开状态，若为收缩则展开
            if (!collapse) {
                this.expandParent(id);
            }

            //获取当前节点下的所有子节点
            var childs = this.getChildIds(id), ids = this.getRowIds(childs, collapse, []);
            //记录收缩状态
            this.setCollapse(id, ids, collapse);

            for (var i = ids.length - 1; i >= 0; i--) {
                var obj = doc.getElementById(this.buildId(ids[i]));
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

            for (var i in this.datas) {
                var dr = this.datas[i].treeData || {}, id = dr.id;
                var obj = doc.getElementById(this.buildId(id)), btnSwitch = doc.getElementById(this.buildSwitchId(id));
                if (obj !== null) {
                    obj.style.display = dr.level <= level ? '' : 'none';
                }
                if (dr.level === level) {
                    //设置当前等级的子级为收缩状态，记录收缩状态
                    this.setSwitch(btnSwitch, true, true);
                    this.setCollapse(id, [], true);
                } else if (!collapse && dr.level < level) {
                    //按层级展开时，设置当前等级为展开状态
                    this.setSwitch(btnSwitch, false, true);
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
            for (var i in this.datas) {
                var dr = this.datas[i].treeData || {}, id = dr.id;
                var obj = doc.getElementById(this.buildId(id)), btnSwitch = doc.getElementById(this.buildSwitchId(id));
                if (obj !== null) {
                    obj.style.display = collapse && dr.level > 0 ? 'none' : '';
                }
                //设置当前等级的子级为收缩状态，记录收缩状态
                this.setSwitch(btnSwitch, collapse, false);
                if (dr.level > 0) {
                    this.setCollapse(id, [], collapse);
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
            var childs = this.getChildIds(id), ids = this.getRowIds(childs, true, []), len = ids.length;
            for (var i = len - 1; i >= 0; i--) {
                var tr = doc.getElementById(this.buildId(ids[i]));
                deleteTableRow(tr);
            }
            if (!keepSelf) {
                deleteTableRow(doc.getElementById(this.buildId(id)));
            }
        },
        removeChild: function (id) {
            this.remove(id, true);
        },
        select: function (id) {
            var btnSwitch = doc.getElementById(this.buildSwitchId(id));
            if (btnSwitch !== null) {
                btnSwitch.focus();
            }
        },
        quickSort: function (arr, key) {
            if (0 === arr.length) {
                return [];
            }
            var left = [], right = [], pivot = arr[0], c = arr.length;
            for (var i = 1; i < c; i++) {
                arr[i].treeData[key] < pivot.treeData[key] ? left.push(arr[i]) : right.push(arr[i]);
            }
            return this.quickSort(left, key).concat(pivot, this.quickSort(right, key));
        }
    };

    $.Table = Table;
}(OUI);