
/*
 @Title: oui.frozen.js
 @Description：表头锁定插件
 @Author: oukunqing
 @License：MIT
*/

!function ($) {
    'use strict';

    var Factory = {
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
                    $.removeElement(cache.controls[k]);
                }
                cache.controls = {};
            } else {
                $.removeElement(cache.controls[dir]);
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
        copyAttribute: function (row, rowOld, arrKey) {
            for (var k in arrKey) {
                var key = arrKey[k];
                if (rowOld[key] != null && rowOld[key] != undefined) {
                    row[key] = rowOld[key];
                }
            }
            return this;
        },
        getBoxSize: function(table) {
            var parent = table.parentNode,
                ps = $.elemSize(parent);

            return ps;
        },
        getHead: function(table) {
            var head = table.tHead;
            console.log('head:', head);
            return head;
        },
        buildTable: function(f, dir) {
            var isCol = dir.indexOf('left') >= 0 || dir.indexOf('right') >= 0,
                isRight = dir.indexOf('right') >= 0,
                ts = $.elemSize(f.table),
                bs = $.elemSize(f.box),
                divId = f.id + '-' + dir + '-box',
                tbId = f.id + '-' + dir + '-table';

                console.log('isRight:',isRight);

            var bw = dir === 'head' ? bs.inner.width : 200,
                bh = bs.inner.height,
                tw = dir === 'head' ? ts.width : 100,
                th = ts.height;

            var div = $.createElement('div', divId, function(elem) {
                var cssText = 'position:absolute;overflow:hidden;display:block;width:' + bw + 'px;z-index:999999;';
                if(isCol) {
                    cssText += 'height:' + bh + 'px;border:solid 1px #f00;';
                }
                if(isRight) {
                    cssText += 'left:' + (bs.inner.width + bs.offset.left - bw + bs.padding.width) + 'px;';
                    console.log('bs:', bs)
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
                var cssText = 'width:' + tw + 'px;';
                if(isCol) {
                    cssText += 'height:' + th + 'px;';
                }
                elem.style.cssText = cssText;
                elem.className = f.table.className;
                
            }, div);

            switch(dir) {
                case 'head':
                    var head = Factory.getHead(f.table);
                    if(head) {
                        tb.appendChild(head.cloneNode(true));
                    }
                    f.divHead = div;
                    f.tbHead = tb;
                    break;
                case 'left':
                    for(var i = 0; i<f.table.rows.length; i++) {
                        var row = tb.insertRow(i);
                        row.appendChild(f.table.rows[i].cells[0].cloneNode(true));
                    }
                    f.divLeft = div;
                    f.tbLeft = tb;
                    break;
                case 'right':
                    f.divRight = div;
                    f.tbRight = tb;
                    break;
            }

            f.box.insertBefore(div, f.table);

            return div;
        },
        setPosition: function() {

        }

    };

    function Frozen(options) {

        this.id = options.id;
        this.table = options.table;
        this.box = this.table.parentNode;

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

            return that.build();
        },
        build: function() {
            var that = this;
            Factory.setParam(that.id, 'size', $.getOffset(that.box));

            var head = Factory.buildTable(that, 'head');
            Factory.setControl(that.id, 'head', head);
            var left = Factory.buildTable(that, 'left');
            Factory.setControl(that.id, 'left', left);
            var right = Factory.buildTable(that, 'right');
            Factory.setControl(that.id, 'right', right);


            that.box.onscroll = function () {
                if (that.divHead != null) {
                    console.log('divHead',this.scrollLeft,that.divHead.scrollLeft)
                    that.divHead.scrollLeft = this.scrollLeft;
                }
                if (that.divLeft != null) {
                    that.divLeft.scrollTop = this.scrollTop;
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
                $.removeElement(cache.controls[i]);
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