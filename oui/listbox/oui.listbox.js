
/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.listbox 列表框插件
*/

!function(){

    var Config = {
        FilePath: $.getScriptSelfPath(true),
        //菜单项边距边框尺寸
        ItemMBPWidth: 12,
        ItemMinWidth: 60,
        ItemArrowWidth: 35,
        DefaultHeight: 240,
        MaxHeight: 300
    },
    Cache = {
        index: 1,
        menus: {},
        count: 0,
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
        checkOptions: function(obj, options) {
            if(!$.isElement(obj) && !$.isString(obj)) {
                options = obj;
                obj = null;
            } else { 
                obj = $.toElement(obj);
                options = options || {};
            }
            var opt = $.extend({
                id: 'oui-listbox-' + (Cache.index++),
                target: obj,
                show: false,
                width: 'auto',
                height: Config.DefaultHeight
            }, options);

            return opt;
        },
        initCache: function(menu, options) {
            var key = this.buildKey(menu.id);
            Cache.menus[key] = {
                id: menu.id,
                menuId: menu.id,
                menu: menu,
                items: {},
                boxs: [],
                options: $.extend({
                    items: []
                }, options),
                itemId: 1
            };
            Cache.count += 1;
            return this;
        },
        buildListBox: function(obj, options) {
            options = Factory.checkOptions(obj, options);
            return new ListBox(options);
        },
        buildBox: function(options) {
            var box = $.createElement('div', '', function(elem) {
                elem.className = 'oui-listbox';
                Factory.setSizePos(options, elem);
                elem.style.display = options.show ? '' : 'none';
            }, document.body);

            return box;
        },
        getBoxHeight: function(opt, box) {
            var childs = box.childNodes, len = childs.length, th = 0;
            if(len > 0) {
                var es = $.elemSize(childs[0]),
                    h = es.outer.height || es.style.height,
                    bs = $.elemSize(box),
                    maxHeight = opt.maxHeight || Config.MaxHeight;
                th = len * h;
                if(maxHeight && th > maxHeight) {
                    th = maxHeight;
                }
                th += bs.margin.height + bs.border.height + bs.padding.height;
            }
            return th;
        },
        setSizePos: function(opt, box) {
            var offset = $.getOffset(opt.target),
                w = opt.width === 'auto' ? offset.width : $.toCssSizeVal(opt.width),
                h = opt.height === 'auto' ? Factory.getBoxHeight(opt, box) : $.toCssSizeVal(opt.height);
                cssText = 'left:{0}px;top:{1}px;width:{2}px;height:{3}px;'.format(
                    offset.left, 
                    offset.top + offset.height - 3,
                    w,
                    h
                );
            return box.style.cssText = cssText, this;
        },
        setListData: function(m, datas, box, isAppend) {
            if(!$.isArray(datas)) {
                return this;
            }

            var html = [];
            for(var i = 0; i < datas.length; i++) {
                var dr = datas[i], txt = '', val = '';
                if($.isString(dr)) {
                    txt = val = dr;
                } else {
                    txt = dr.name || dr.text || dr.txt;
                    val = dr.value || dr.val || dr.id;
                }
                html.push('<div class="list-item" data="' + val + '">' 
                    + '<a href="javascript:void(0);">' + txt + '</a>'
                    + '<a class="close">×</a>'
                    + '</div>');
            }
            if(isAppend) {
                var con = box.innerHTML;
                box.innerHTML = con + html.join('');
            } else {
                box.innerHTML = html.join('');
            }

            var childs = box.childNodes;
            for(var i = 0; i < childs.length; i++) {
                childs[i].onclick = function() {
                    m.target.value = $.getAttribute(this, 'data');

                    for(var j = 0; j < childs.length; j++) {
                        childs[j].className = 'list-item';
                    }
                    $.addClass(this, 'cur-item');
                };

                var arr = childs[i].childNodes;
                if(arr.length > 1) {
                    arr[1].onclick = function() {
                        $.cancelBubble().removeElement(this.parentNode);
                    };
                }
            }

            Factory.setSizePos(m.options, box);

            return this;
        },
        clearListData: function(m, box) {
            box.innerHTML = '';
            return this;
        },
        show: function(m, show) {
            if(show) {
                m.show();
            }
            return this;
        }
    };


    //先加载样式文件
    Factory.loadCss();

    function ListBox(options) {
        var opt = $.extend({
            id: 'oui-listbox',
            target: null,
            set: {
                event: '',
                callback: null
            }
        }, options);

        this.id = opt.id;
        this.options = options;

        this.initial(options);
    }

    ListBox.prototype = {
        initial: function(opt) {
            var that = this,
                set = opt.set || opt.initial || {},
                func = set.callback || set.func;

            that.target = $.toElement(opt.target);

            if(set && $.isFunction(func)) {
                var events = set.event.split(/[\|,]/g);
                for(var i = 0; i < events.length; i++) {
                    if(events[i]) {
                        $.addListener(that.target, events[i], function() {
                            func(this, that);
                        });
                    }
                }
            }

            $.addListener(that.target, 'click', function(par) {
                $.cancelBubble(function() {
                    that.show();
                });
            });

            $.addListener(document, 'click', function() {
                $.cancelBubble(function() {
                    that.hide();
                });
            });

            //Factory.initCache(that, opt);

            that.box = Factory.buildBox(opt);

            if(opt.items) {
                that.add(opt.items);
            }

            if(!opt.show) {
                that.hide();
            }

            return that;
        },
        show: function(datas) {
            Factory.setListData(this, datas, this.box);
            if(this.box.childNodes.length > 0) {
                this.box.style.display = '';
            }
            return this;
        },
        hide: function() {
            this.box.style.display = 'none';
            return this;
        },
        update: function(datas) {
            Factory.setListData(this, datas, this.box).show(show);
            return this;
        },
        insert: function(datas, insertIndex, show) {
            Factory.setListData(this, datas, this.box, true).show(show);
            return this;
        },
        add: function(datas, show) {
            return this.insert(datas, null, show);
        },
        remove: function() {
            return Factory.hideContextMenu(null, this.id, true), this;
        },
        clear: function() {
            Factory.clearListData(this, this.box);
            return this.hide();
        },
        html: function(html, show) {
            return this.box.innerHTML = html, Factory.show(show), this;
        }
    };

    $.extend({
        listbox: function(obj, options) {
            return Factory.buildListBox(obj, options);
        }
    });

}(OUI);