
/*
 @Title: oui.frozen.js
 @Description：冻结空格（表头锁定）插件
 @Author: oukunqing
 @License：MIT
*/

!function ($) {
    'use strict';

    var Config = {
        FilePath: $.getScriptSelfPath(true),
        Index: 1
    },
    Factory = {
        loadCss: function (skin, func) {
            var path = Config.FilePath,
                name = $.getFileName(path, true),
                dir = $.getFilePath(path);

            if ($.isString(skin, true)) {
                dir += 'skin/' + skin + '/';
            }
            $.loadLinkStyle(dir + name.replace('.min', '') + '.css', function () {
                if ($.isFunction(func)) {
                    func();
                }
            });
            return this;
        },
        timers: {},
        caches: {},
        buildKey: function(id) {
            return 'frozen-' + id;
        },
        getCache: function(id) {
            var key = Factory.buildKey(id);
            return Factory.caches[key];
        },
        setCache: function(id, options, f) {
            var key = Factory.buildKey(id);
            Factory.caches[key] = {
                id: id,
                frozen: f,
                options: options,
                controls: {},
                show: true,
                size: {}
            };
            return this;
        },
        setControl: function(id, dir, obj) {
            var cache = Factory.getCache(id);
            if(!cache) {
                return this;
            }
            cache.controls[dir] = obj;
            return this;
        },
        setOptions: function(id, key, val) {
            var cache = Factory.getCache(id);
            if(!cache) {
                return this;
            }
            cache.options[key] = val;
            return this;
        },
        setParam: function(id, key, val) {
            var cache = Factory.getCache(id);
            if(!cache) {
                return this;
            }
            cache[key] = val;
            return this;
        },
        removeControl: function(id, dir) {
            var cache = Factory.getCache(id);
            if(!cache) {
                return this;
            }
            if(dir === 'clear') {
                for(var k in cache.controls) {
                    $.removeElement(cache.controls[k].box);
                }
                cache.controls = {};
            } else {
                $.removeElement(cache.controls[dir].box);
                delete cache.controls[dir];
            }
            return this;
        },
        checkOptions: function(options) {
            var opt = $.extend({}, options);
            opt.complete = opt.complete || opt.callback;
            opt.rows = parseInt('0' + (opt.rows || opt.head || opt.top), 10);
            opt.cols = parseInt('0' + (opt.cols || opt.columns || opt.left), 10);
            opt.right = parseInt('0' + (opt.right), 10);
            opt.foot = parseInt('0' + (opt.foot || opt.bottom), 10);
            opt.border = opt.border || opt.borderStyle || '';
            opt.splitLineColor = opt.splitLineColor || opt.borderColor || '#99bbe8';
            opt.showSplitLine = opt.showSplitLine || opt.showBorder;

            return opt;
        },
        buildFrozen: function(table, options) {
            var id = '';
            if($.isElement(table)) {
                id = table.id || $.getAttribute(table, 'frozenid');
                if(!id) {
                    id = 'oui-frozen-' + (Config.Index++);
                }
            } else if($.isString(table, true)) {
                id = table;
                table = $.toElement(table);
            }
            if(!$.isElement(table)) {
                return null;
            }

            var opt = $.extend({
                id: id,
                table: table,
                fixHead: true,
                rows: 1,    //head,top
                cols: 0,    //left
                right: 0,
                foot: 0,    //bottom
                debounce: true,
                colStartRowIndex: 0,
                background: '#fff',
                zindex: 99999,
                showSplitLine: true,
                border: '',
                splitLineColor: '#99bbe8',  //borderColor
                borderWidth: 1,
                isFixedSize: false,
                isBootstrap: false,
                complete: function(f) {

                }
            }, Factory.checkOptions(options));

            var cache = Factory.getCache(opt.id), isFrozen = $.getAttribute(table, 'frozenid');
            if(cache && isFrozen) {
                return cache.frozen;
            } else {
                return new Frozen(opt);
            }
        },
        getFrozen: function(id) {
            var cache = Factory.getCache(id);
            if(cache) {
                return cache.frozen;
            }
            return {};
        },
        isTHeadRow: function (row) {
            return row.parentNode && row.parentNode.tagName === 'THEAD';
        },
        createTBody: function (table, row) {
            if (!Factory.isTHeadRow(row) && !table.created) {
                var tbody = table.createTBody();
                table.created = true;
                return tbody;
            }
            return false;
        },
        getHead: function(table) {
            var head = table.tHead;
            return head;
        },
        copyAttribute: function (elem, elemOld, arrKey) {
            for (var k in arrKey) {
                var key = arrKey[k];
                if (elemOld[key] !== null && elemOld[key] !== undefined) {
                    elem[key] = elemOld[key];
                }
            }
            return this;
        },
        cloneElement: function(f, type, elem, elemObj, rowIndex, options, dir) {
            elem.className = elemObj.className;
            elem.style.cssText = elemObj.style.cssText;
            var arrKey = [];

            if(type === 'row') {
                arrKey = ['ondblclick', 'onclick', 'onmouseover', 'onmouseout'];
            } else { // cell
                arrKey = ['ondblclick', 'onclick', 'onmouseover', 'onmouseout'];
                //从指定的行开始计算（并采用）列宽
                if(rowIndex >= options.colStartRowIndex) {
                    var ws = $.getStyleSize(elemObj), w = ws.width || elemObj.clientWidth;
                    elem.style.width = w + 'px';
                }
                if(elemObj.rowSpan > 1 || dir) {
                    var hs = $.getStyleSize(elemObj), h = hs.height || elemObj.clientHeight;
                    elem.style.height = h + 'px';
                }
            }

            Factory.copyAttribute(elem, elemObj, []);

            return elem;
        },
        setSpanCount: function (arr, idx, span) {
            if (arr[idx] === undefined) {
                arr[idx] = 0;
            }
            arr[idx] += span;
            return this;
        },
        setCut: function(cut, cell, i, j, cols, arrCellCut) {
            if(j < cols) {
                if(cell.rowSpan > 1) {
                    for (var k = 1; k < cell.rowSpan; k++) {
                        Factory.setSpanCount(arrCellCut, i + k, cell.colSpan);
                    }
                } else if(cell.colSpan > 1) {
                    Factory.setSpanCount(arrCellCut, i, cell.colSpan - 1);
                    cut = cell.colSpan - 1;
                }
            }
            return cut;
        },
        buildRows: function(f, tbTarget, tbSource, dir, options) {
            var offset = 0, 
                rowsLen = tbSource.rows.length,
                rows = options.rows,
                cols = options.cols,
                container = tbSource.tHead !== null ? tbTarget.createTHead() : tbTarget,
                arrRowCut = [],
                arrCellCut = [],
                isRight = dir.indexOf('right') >= 0,
                isFoot = dir.indexOf('foot') >= 0,
                isCorner = dir.indexOf('-') > 0;

            switch(dir) {
                case 'head':
                    var head = Factory.getHead(tbSource), isOver = false;
                    if(options.fixHead && head) {
                        tbTarget.appendChild(head.cloneNode(true));
                        var headRows = head.rows.length;
                        offset = headRows;
                        if(cols > 0 && rows < headRows) {
                            rows = headRows;
                            Factory.setOptions(f.id, 'rows', rows);
                        }

                        isOver = rows <= headRows;
                    }
                    if(!isOver) {
                        for(var i = offset; i < rows; i++) {
                            var rowOld = tbSource.rows[i];
                            container = Factory.createTBody(tbTarget, rowOld) || container;
                            var row = container.insertRow(container.rows.length);
                            Factory.cloneElement(f, 'row', row, rowOld);

                            for(var j = 0; j < rowOld.cells.length; j++) {
                                var cellOld = rowOld.cells[j];
                                var cell = cellOld.cloneNode(true);
                                Factory.cloneElement(f, 'cell', cell, cellOld, i, options);
                                row.appendChild(cell);
                            }
                        }
                    }
                    break;
                case 'left':
                case 'right':
                case 'head-left':
                case 'head-right':
                case 'foot-left':
                case 'foot-right':
                    if(dir === 'left' || dir === 'right') {
                        rows = rowsLen;
                    } else if(isFoot) {
                        rows = options.foot;
                    }
                    if(isRight) {
                        cols = options.right;
                    }
                    for(var i = offset; i < rows; i++) {
                        var rowOld = isFoot ? tbSource.rows[rowsLen - i - 1] : tbSource.rows[i],
                            c = rowOld.cells.length,
                            cut = arrCellCut[i] || 0;

                        container = Factory.createTBody(tbTarget, rowOld) || container;
                        var row = container.insertRow(isFoot ? 0 : container.rows.length);
                        Factory.cloneElement(f, 'row', row, rowOld);

                        for(var j = 0; j < cols - cut; j++) {
                            var cellOld = isRight ? rowOld.cells[c - j - 1] : rowOld.cells[j];
                            if(cellOld) {
                                var cell = cellOld.cloneNode(true), colSpan = cell.colSpan;
                                //判断行中的行是否全合并，若全合并则清除该列内容
                                if(colSpan >= c) {
                                    cell.innerHTML = '';
                                }
                                //判断合并列数是否超出冻结列数
                                if(colSpan > cols - j) {
                                    cell.colSpan = cols - j;
                                }

                                Factory.cloneElement(f, 'cell', cell, cellOld, i, options, dir);
                                cut = Factory.setCut(cut, cell, i, j, cols, arrCellCut);
                                if(isRight) {
                                    row.insertBefore(cell, row.childNodes[0]);
                                } else {
                                    row.appendChild(cell);
                                }
                            }
                        }
                    }
                    break;
                case 'foot':
                    rows = options.foot;
                    for(var i = offset; i < rows; i++) {
                        var rowOld = tbSource.rows[rowsLen - i - 1];
                        container = Factory.createTBody(tbTarget, rowOld) || container;
                        //这里要倒着插入行
                        var row = container.insertRow(0);
                        Factory.cloneElement(f, 'row', row, rowOld);

                        for(var j = 0; j < rowOld.cells.length; j++) {
                            var cellOld = rowOld.cells[j];
                            var cell = cellOld.cloneNode(true);
                            Factory.cloneElement(f, 'cell', cell, cellOld, i, options);
                            row.appendChild(cell);
                        }
                    }
                    break;

            }
            return this;
        },
        getBoxSize: function(table) {
            var parent = table.parentNode,
                ps = $.elemSize(parent);

            return ps;
        },
        buildTable: function(f, dir, options) {
            var isHead = dir === 'head',
                isFoot = dir === 'foot',
                isCol = dir === 'left' || dir === 'right',
                isHeadCol = dir === 'head-left' || dir === 'head-right',
                isRight = dir.indexOf('right') >= 0,
                isBottom = dir.indexOf('foot') >= 0,
                ts = $.elemSize(f.table),
                bs = $.elemSize(f.box),
                divId = f.id + '-' + dir + '-box',
                tbId = f.id + '-' + dir + '-table';

            if((isHead && ts.height < bs.inner.height) || (isCol && ts.width < bs.inner.width)) {
                return undefined;
            }
            var div = $.createElement('div', divId, function(elem) {
                elem.className = 'oui-frozen-box';
                var cssText = isHead || isFoot ? ('width:' + bs.inner.width + 'px;') : isCol ? ('height:' + bs.inner.height + 'px;') : '';
                if(options.zindex > 0) {
                    cssText += 'z-index:' + options.zindex + ';';
                }
                if(cssText) {
                    elem.style.cssText = cssText;
                }
                Factory.setBorder(elem, dir, options);

                // 同步鼠标滚轮事件
                if($.isFirefox) {
                    $.addListener(elem, 'DOMMouseScroll', function(e) {
                        // 这里用 +=，因为火狐浏览器下，向下滚动是负值
                        f.box.scrollTop += e.wheelDelta || e.detail;
                    });
                } else {
                    elem.onmousewheel = function(e) {
                        // 这里用 -=，因为向下滚动是负值
                        f.box.scrollTop -= e.wheelDelta || e.detail;
                    };
                }
            });
            var tb = $.createElement('table', tbId, function(elem) {
                var cssText = isHead || isFoot ? ('width:' + ts.width + 'px;') : isCol ? ('height:' + ts.height + 'px;') : '';
                if(cssText) {
                    elem.style.cssText = cssText;
                }
                elem.className = f.table.className + ' oui-frozen-table';
            }, div);

            Factory.buildRows(f, tb, f.table, dir, options).setControl(f.id, dir, { box: div, table: tb });

            f.box.insertBefore(div, f.table);

            if(isRight) {
                //设置右边固定列的box起始位置：inner width + 左偏移 + 右边框 + padding - div宽度
                var left = (bs.inner.width + bs.offset.left + bs.border.right + bs.padding.width - $.elemSize(div).width);
                div.style.left = left + 'px';
            }
            if(isBottom) {
                var top = (bs.inner.height + bs.offset.top + bs.border.bottom + bs.padding.height - $.elemSize(div).height);
                div.style.top = top + 'px';
            }

            return div;
        },
        isResize: function(cache, f) {
            var size = cache.size, 
                curSize = $.getOffset(f.box),
                changed = size.width !== curSize.width || size.height !== curSize.height;

            return changed;
        },
        setScrollPosition: function(ctls, box) {
            if (ctls.head && ctls.head.box) {
                ctls.head.box.scrollLeft = box.scrollLeft;
            }
            if (ctls.foot && ctls.foot.box) {
                ctls.foot.box.scrollLeft = box.scrollLeft;
            }
            if (ctls.left && ctls.left.box) {
                ctls.left.box.scrollTop = box.scrollTop;
            }
            if (ctls.right && ctls.right.box) {
                ctls.right.box.scrollTop = box.scrollTop;
            }
            return this;
        },
        setBorder: function(obj, dir, opt) {
            if(!opt.showSplitLine) {
                return this;
            }
            var style = opt.border || ('solid ' + (opt.borderWidth || 1) + 'px' + (opt.splitLineColor || '#99bbe8'));

            if(dir === 'head' || dir === 'head-left' || dir === 'head-right') {
                obj.style.borderBottom = style;
            } else if(dir === 'foot' || dir === 'foot-left' || dir === 'foot-right') {
                obj.style.borderTop = style;
            }
            if(dir === 'left' || dir === 'head-left' || dir === 'foot-left') {
                obj.style.borderRight = style;
            } else if(dir === 'right' || dir === 'head-right' || dir === 'foot-right') {
                obj.style.borderLeft = style;
            }
            return this;
        },
        setDebounce: function(f) {
            f.clear();
                            
            var ft = Factory.timers[f.id], ts = new Date().getTime();
            if(!ft) {
                ft = Factory.timers[f.id] = { timer: null, last: ts };
                return f.build();
            }
            window.clearTimeout(ft.timer);

            if(ts - ft.last > 5000) {   
                ft.last = ts;
                return f.build();
            }
            ft.timer = window.setTimeout(function() {
                ft.last = new Date().getTime();
                f.build();
            }, 100);

            return this;
        }

    };

    //先加载样式文件
    Factory.loadCss();

    function Frozen(options) {
        this.id = options.id;
        this.table = options.table;
        this.box = this.table.parentNode;
        this.rowHeights = [];

        //$.addClass(this.box, 'oui-frozen').addClass(this.table, 'oui-frozen');

        return this.initial(options);
    }

    Frozen.prototype = {
        initial: function(opt) {
            var that = this;

            var position = $.getElementStyle(that.box, 'position');
            if(position === 'relative') {
                that.box.style.position = 'inherit';
            }

            Factory.setCache(that.id, opt, that);

            $.addListener(window, 'resize', function() {
                return that.rebuild();
            });

            return that.build(opt);
        },
        build: function(opt) {
            var that = this, cache = Factory.getCache(that.id);
            if(!$.isObject(opt)) {
                opt = cache.options;
            }
            var head = Factory.buildTable(that, 'head', opt), left, right, foot;

            if(opt.cols > 0) {
                left = Factory.buildTable(that, 'left', opt);
            }
            if(opt.right > 0) {
                right = Factory.buildTable(that, 'right', opt);
            }
            if(head && left) {
                var headLeft = Factory.buildTable(that, 'head-left', opt);
            }
            if(head && right) {
                var headRightt = Factory.buildTable(that, 'head-right', opt);
            }
            if(opt.foot > 0) {
                foot = Factory.buildTable(that, 'foot', opt)
            }
            if(foot && left) {
                var footLeft = Factory.buildTable(that, 'foot-left', opt);
            }
            if(foot && right) {
                var footRightt = Factory.buildTable(that, 'foot-right', opt);
            }

            Factory.setParam(that.id, 'size', $.getOffset(that.box))
                .setParam(that.id, 'show', true)
                .setScrollPosition(cache.controls, that.box);

            that.box.onscroll = function () {
                var cache = Factory.getCache(that.id),
                    ctls = cache.controls;
                Factory.setScrollPosition(ctls, this);
            };

            $.setAttribute(that.table, 'frozenid', that.id);

            if($.isFunction(opt.complete)) {
                opt.complete(that);
            }

            return that;
        },
        rebuild: function() {
            var that = this,
                cache = Factory.getCache(that.id);
            if(!cache) {
                return that.build();
            } else if(!cache.show) {
                return that;
            }
            if(!Factory.isResize(cache, that)) {
                return that;
            }
            //return that.clear().build();

            var opt = cache.options;
            if(!opt.debounce) {
                return that.clear().build();
            }

            return Factory.setDebounce(that), that;
        },
        show: function(isShow) {
            var show = $.isBoolean(isShow, true),
                cache = Factory.getCache(this.id),
                changed = Factory.isResize(cache, this);

            Factory.setParam(this.id, 'show', show);

            if(changed) {
                return this.clear().build();
            }

            for(var i in cache.controls) {
                var box = cache.controls[i].box;
                box.style.display = show ? '' : 'none';
            }
            return this;
        },
        hide: function() {
            return this.show(false);
        },
        clear: function() {
            var cache = Factory.getCache(this.id);
            for(var i in cache.controls) {
                $.removeElement(cache.controls[i].box);
            }
            cache.controls = {};
            return this;
        },
        update: function() {
            return this.rebuild();
        },
        resize: function() {
            return this.rebuild();
        }
    };

    $.extend({
        frozen: function(obj, options) {
            return Factory.buildFrozen(obj, options);
        }
    });

    $.extend($.frozen, {
        show: function (id, isShow) {
            var frozen = Factory.getFrozen(id);
            if(frozen && $.isFunction(frozen.show)) {
                frozen.show(isShow);
            }
            return this;
        },
        hide: function (id) {
            return this.show(id, false);
        },
        clear: function (id) {
            var frozen = Factory.getFrozen(id);
            if(frozen && $.isFunction(frozen.clear)) {
                frozen.clear();
            }
        }
    });

}(OUI);