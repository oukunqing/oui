
/*
 @Title: oui.frozen.js
 @Description：冻结空格（表头锁定）插件
 @Author: oukunqing
 @License：MIT
*/

!function ($) {
    'use strict';

    var Config = {
        FilePath: $.getScriptSelfPath(true)
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
        buildFrozen: function(table, options) {
            var id = '';
            if($.isElement(table)) {
                id = table.id;
            } else if($.isString(table, true)) {
                id = table;
                table = $.toElement(table);
            }

            var opt = $.extend({
                id: id,
                table: table,
                fixHead: true,
                rows: 1,
                cols: 0,
                right: 0,
                colStartRowIndex: 0,
                background: '#fff',
                zindex: 99999,
                showSplitLine: true,
                splitLineColor: '#99bbe8',
                borderWidth: 1,
                isFixedSize: false,
                isBootstrap: false
            }, options);

            var cache = Factory.getCache(opt.id);
            if(cache) {
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
        cloneElement: function(type, elem, elemObj, rowIndex, options) {
            elem.className = elemObj.className;
            elem.style.cssText = elemObj.style.cssText;
            var arrKey = [];

            if(type === 'row') {
                arrKey = ['ondblclick', 'onclick', 'onmouseover', 'onmouseout'];
            } else { // cell
                arrKey = ['ondblclick', 'onclick', 'onmouseover', 'onmouseout'];
                //从指定的行开始计算（并采用）列宽
                if(rowIndex >= options.colStartRowIndex) {
                    var ss = $.getStyleSize(elemObj), w = ss.width;
                    if(!w) {
                        w = elemObj.clientWidth;
                    }
                    elem.style.width = w + 'px';
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
        buildRows: function(tbTarget, tbSource, dir, options) {
            var offset = 0, 
                rows = options.rows,
                cols = options.cols,
                container = tbSource.tHead !== null ? tbTarget.createTHead() : tbTarget,
                arrRowCut = [],
                arrCellCut = [],
                isRight = dir.indexOf('right') >= 0;

            switch(dir) {
                case 'head':
                    var head = Factory.getHead(tbSource), isOver = false;
                    if(options.fixHead && head) {
                        tbTarget.appendChild(head.cloneNode(true));
                        var headRows = head.rows.length;
                        offset = headRows;
                        rows = cols > 0 && rows < headRows ? headRows : rows;
                        isOver = rows <= headRows;
                    }
                    if(!isOver) {
                        for(var i = offset; i < rows; i++) {
                            var rowOld = tbSource.rows[i];
                            container = Factory.createTBody(tbTarget, rowOld) || container;
                            var row = container.insertRow(container.rows.length);
                            Factory.cloneElement('row', row, rowOld);

                            for(var j = 0; j < rowOld.cells.length; j++) {
                                var cellOld = rowOld.cells[j];
                                var cell = cellOld.cloneNode(true);
                                Factory.cloneElement('cell', cell, cellOld, i, options);
                                row.appendChild(cell);
                            }
                        }
                    }
                    break;
                case 'left':
                case 'head-left':
                case 'right':
                case 'head-right':
                    if(dir === 'left' || dir === 'right') {
                        rows = tbSource.rows.length;
                    }
                    if(isRight) {
                        cols = options.right;
                    }
                    for(var i = offset; i < rows; i++) {
                        var rowOld = tbSource.rows[i], c = rowOld.cells.length, cut = arrCellCut[i] || 0;
                        container = Factory.createTBody(tbTarget, rowOld) || container;
                        var row = container.insertRow(container.rows.length);
                        Factory.cloneElement('row', row, rowOld);

                        for(var j = 0; j < cols - cut; j++) {
                            var cellOld = isRight ? rowOld.cells[c - j - 1] : rowOld.cells[j];
                            if(cellOld) {
                                var cell = cellOld.cloneNode(true);
                                Factory.cloneElement('cell', cell, cellOld, i, options);
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
                isCol = dir === 'left' || dir === 'right',
                isHeadCol = dir === 'head-left' || dir === 'head-right',
                isRight = dir.indexOf('right') >= 0,
                ts = $.elemSize(f.table),
                bs = $.elemSize(f.box),
                divId = f.id + '-' + dir + '-box',
                tbId = f.id + '-' + dir + '-table';

            if((isHead && ts.height < bs.inner.height) || (isCol && ts.width < bs.inner.width)) {
                return undefined;
            }
            var div = $.createElement('div', divId, function(elem) {
                elem.className = 'oui-frozen-box';
                var cssText = isHead ? ('width:' + bs.inner.width + 'px;') : isCol ? ('height:' + bs.inner.height + 'px;') : '';
                elem.style.cssText = cssText;

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
                var cssText = isHead ? ('width:' + ts.width + 'px;') : isCol ? ('height:' + ts.height + 'px;') : '';
                elem.style.cssText = cssText;
                elem.className = f.table.className;                
            }, div);

            Factory.buildRows(tb, f.table, dir, options).setControl(f.id, dir, { box: div, table: tb });

            f.box.insertBefore(div, f.table);

            if(isRight) {
                //设置右边固定列的box起始位置：inner width + 左偏移 + 右边框 + padding - div宽度
                var left = (bs.inner.width + bs.offset.left + bs.border.right + bs.padding.width - $.elemSize(div).width);
                div.style.left = left + 'px';
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
            if (ctls.head) {
                ctls.head.box.scrollLeft = box.scrollLeft;
            }
            if (ctls.left && ctls.left.box) {
                ctls.left.box.scrollTop = box.scrollTop;
            }
            if (ctls.right && ctls.right.box) {
                ctls.right.box.scrollTop = box.scrollTop;
            }
            return this;
        }

    };

    //先加载样式文件
    Factory.loadCss();

    function Frozen(options) {
        this.id = options.id;
        this.table = options.table;
        this.box = this.table.parentNode;

        $.addClass(this.box, 'oui-frozen').addClass(this.table, 'oui-frozen');

        return this.initial(options);
    }

    Frozen.prototype = {
        initial: function(opt) {
            var that = this;

            //that.box.style.position = 'relative';

            Factory.setCache(that.id, opt, that);

            $.addListener(window, 'resize', function() {
                //that.resize();
                that.rebuild();
            });

            return that.build(opt);
        },
        build: function(opt) {
            var that = this, cache = Factory.getCache(that.id);
            if(!$.isObject(opt)) {
                opt = cache.options;
            }
            var head = Factory.buildTable(that, 'head', opt), left, right;

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
            Factory.setParam(that.id, 'size', $.getOffset(that.box))
                .setParam(that.id, 'show', true)
                .setScrollPosition(cache.controls, that.box);

            that.box.onscroll = function () {
                var cache = Factory.getCache(that.id),
                    ctls = cache.controls;
                Factory.setScrollPosition(ctls, this);
            };

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
            var changed = Factory.isResize(cache, that);
            if(!changed) {
                return that;
            }

            return that.clear().build();
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