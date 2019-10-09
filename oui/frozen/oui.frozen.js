
/*
 @Title: oui.frozen.js
 @Description：表头锁定插件
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
                controls: {}
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
                rows: 1,
                cols: 0
            }, options);

            var cache = Factory.getCache(opt.id);
            if(cache) {
                return cache.frozen;
            } else {
                return new Frozen(opt);
            }
        },
        isTHeadRow: function (row) {
            return row.parentNode && row.parentNode.tagName === 'THEAD';
        },
        isTHeadRow: function (row) {
            return row.parentNode !== null && row.parentNode.tagName === 'THEAD';
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
            console.log('head:', head);
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
        cloneElement: function(type, elem, elemObj) {
            elem.className = elemObj.className;
            elem.style.cssText = elemObj.style.cssText;
            var arrKey = [];

            if(type === 'row') {
                arrKey = ['ondblclick', 'onclick', 'onmouseover', 'onmouseout'];
            } else { // cell
                arrKey = ['ondblclick', 'onclick', 'onmouseover', 'onmouseout'];
                var ss = $.getStyleSize(elemObj);
                elem.style.width = ss.width + 'px';
            }

            Factory.copyAttribute(elem, elemObj, []);

            return elem;
        },
        buildRows: function(tbTarget, tbSource, dir, options) {
            var offset = 0, 
                rows = options.rows,
                cols = options.cols,
                container = tbSource.tHead !== null ? tbTarget.createTHead() : tbTarget,
                size = {};

            switch(dir) {
                case 'head':
                    var head = Factory.getHead(tbSource), isOver = false;
                    if(options.fixHead && head) {
                        tbTarget.appendChild(head.cloneNode(true));
                        var headRows = head.rows.length;
                        if(cols > 0 && rows < headRows) {
                            rows = headRows;
                        }
                        offset = headRows;
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

                                Factory.cloneElement('cell', cell, cellOld);

                                row.appendChild(cell);
                            }
                        }
                    }
                    break;
                case 'left':
                case 'head-left':
                    if(dir === 'left') {
                        rows = tbSource.rows.length;
                    }
                    for(var i = offset; i < rows; i++) {
                        var rowOld = tbSource.rows[i];
                        container = Factory.createTBody(tbTarget, rowOld) || container;
                        var row = container.insertRow(container.rows.length);

                        Factory.cloneElement('row', row, rowOld);

                        for(var j = 0; j < cols; j++) {
                            var cellOld = rowOld.cells[j];
                            var cell = cellOld.cloneNode(true);

                            Factory.cloneElement('cell', cell, cellOld);

                            row.appendChild(cell);
                        }
                    }
                    break;
                case 'right':
                case 'head-right':
                    cols = options.right;
                    if(dir === 'right') {
                        rows = tbSource.rows.length;
                    }
                    for(var i = offset; i < rows; i++) {
                        var rowOld = tbSource.rows[i], c = rowOld.cells.length;
                        container = Factory.createTBody(tbTarget, rowOld) || container;
                        var row = container.insertRow(container.rows.length);

                        Factory.cloneElement('row', row, rowOld);

                        for(var j = cols - 1; j >= 0; j--) {
                            var cellOld = rowOld.cells[c - 1 - j];
                            var cell = cellOld.cloneNode(true);

                            Factory.cloneElement('cell', cell, cellOld);

                            row.appendChild(cell);
                        }
                    }
                    break;
            }

            return size;
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

                console.log('isRight:',isRight);

            if(isHead && ts.height < bs.inner.height) {
                return undefined;
            } else if(isCol && ts.width < bs.inner.width) {
                return undefined;
            }

            var bw = dir === 'head' ? bs.inner.width : 200,
                bh = bs.inner.height,
                tw = dir === 'head' ? ts.width : 100,
                th = ts.height;

            var div = $.createElement('div', divId, function(elem) {
                elem.className = 'oui-frozen-box';
                var cssText = '';
                if(isHead) {
                    cssText = 'width:' + bw + 'px;';
                } else if(isCol) {
                    cssText += 'height:' + bh + 'px;';
                }
                elem.style.cssText = cssText;
                if($.isFirefox) {
                    $.addListener(elem, 'DOMMouseScroll', function(e) {
                        // 这里用 +=，因为火狐浏览器下，向下滚动是负值
                        f.box.scrollTop += e.wheelDelta || e.detail;
                    });
                } else {
                    // 同步鼠标滚轮事件
                    elem.onmousewheel = function(e) {
                        // 这里用 -=，因为向下滚动是负值
                        f.box.scrollTop -= e.wheelDelta || e.detail;
                    };
                }
            });
            var tb = $.createElement('table', tbId, function(elem) {
                var cssText = '';
                if(isHead) {
                    cssText = 'width:' + tw + 'px;';
                } else if(isCol) {
                    cssText += 'height:' + th + 'px;';
                }
                elem.style.cssText = cssText;
                elem.className = f.table.className;                
            }, div);

            var size = Factory.buildRows(tb, f.table, dir, options);

            Factory.setControl(f.id, dir, { box: div, table: tb });

            f.box.insertBefore(div, f.table);

            if(isRight){
                var left = (bs.inner.width + bs.offset.left + bs.border.width + bs.padding.width - $.elemSize(div).width);
                div.style.left = left + 'px';
                console.log('div:', $.elemSize(div), $.elemSize(tb));
            }
            for(var k in size) {
                div.style[k] = size[k] + 'px';
            }

            return div;
        },
        setPosition: function() {

        }

    };

    //先加载样式文件
    Factory.loadCss();

    function Frozen(options) {

        var opt = $.extend({
            fixHead: true,
            rows: 0,
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

        this.id = options.id;
        this.table = opt.table;
        this.box = this.table.parentNode;

        return this.initial(opt);
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
            var that = this;
            if(!$.isObject(opt)) {
                var cache = Factory.getCache(that.id);
                opt = cache.options;
            }
            Factory.setParam(that.id, 'size', $.getOffset(that.box));

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

            that.box.onscroll = function () {
                var cache = Factory.getCache(that.id),
                    ctls = cache.controls;
                if (ctls.head) {
                    ctls.head.box.scrollLeft = this.scrollLeft;
                }
                if (ctls.left != null) {
                    ctls.left.box.scrollTop = this.scrollTop;
                }
                if (ctls.right != null) {
                    ctls.right.box.scrollTop = this.scrollTop;
                }
            };

            return that;
        },
        rebuild: function() {
            var that = this,
                cache = Factory.getCache(that.id);

            if(!cache) {
                return that.build();
            }

            var size = cache.size, 
                curSize = $.getOffset(that.box),
                changed = size.width !== curSize.width || size.height !== curSize.height;

            if(!changed) {
                return that;
            }

            return that.clear().build();
        },
        show: function() {

            return this;
        },
        hide: function() {

            return this;
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

}(OUI);