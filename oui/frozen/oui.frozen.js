
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
        copyElement: function (row, rowOld, arrKey) {
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

        },
        buildTable: function(f, dir) {
            var ts = $.elemSize(f.table),
                bs = $.elemSize(f.box);

            var div = $.createElement('div', '', function(elem) {
                elem.style.cssText = 'position:absolute;overflow:hidden;display:block;width:' + bs.inner.width + 'px;z-index:999999;border: solid 1px #f00;';

            });

            var tb = $.createElement('table', '', function(elem) {
                elem.style.cssText = 'width:' + ts.width + 'px;border:solid 1px #00f;';
                
            }, div);

            f.box.insertBefore(div, f.table);
            f.divHead = div;
            f.tbHead = tb;

            return this;
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

            $.addListener(window, 'resize', function() {
                that.resize();
            });

            Factory.setCache(that.id, opt, that);

            return that.build();
        },
        build: function() {
            var that = this;
            Factory.buildTable(that, 'head');


            that.box.onscroll = function () {
                if (that.divHead != null) {
                    console.log('divHead',this.scrollLeft,that.divHead.scrollLeft)
                    that.divHead.scrollLeft = 100;
                }
                if (that.divLeft != null) {
                    that.divLeft.scrollTop = this.scrollTop;
                }
            };

            return that;
        },
        show: function() {

            return this;
        },
        hide: function() {

            return this;
        },
        clear: function() {

            return this;
        },
        update: function() {

            return this;
        },
        resize: function() {

            console.log('resize:', this.id);
            return this;
        }
    };

    $.extend({
        frozen: function(obj, options) {
            return Factory.buildFrozen(obj, options);
        }
    });

}(OUI);