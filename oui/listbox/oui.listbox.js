
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
        ItemArrowWidth: 35
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
                width: 'auto',
                height: 200
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
        setSizePos: function(opt, box) {
            var offset = $.getOffset(opt.target)
                w = (opt.width === 'auto' ? offset.width : $.toCssSizeVal(opt.width)) - 2,
                h = (opt.height === 'auto' ? 200 : $.toCssSizeVal(opt.height)) - 2;
            box.style.cssText = 'left:{0}px;top:{1}px;width:{2}px;height:{3}px;display:none;'.format(
                offset.left, 
                offset.top + offset.height - 3,
                w,
                h
            );
            return this;
        },
        setListData: function(datas) {

        }
    };


    //先加载样式文件
    Factory.loadCss();

    function ListBox(options) {

        var opt = $.extend({
            id: 'oui-listbox',
            target: null
        }, options);

        this.id = opt.id;

        this.initial(options);
    }

    ListBox.prototype = {
        initial: function(options) {
            var that = this,
                target = $.toElement(options.target);

            $.addListener(target, 'click', function(par) {
                $.cancelBubble(function() {
                    that.show();
                });
            });

            $.addListener(document, 'click', function() {
                $.cancelBubble(function() {
                    that.hide();
                });
            });

            //Factory.initCache(that, options);

            that.box = Factory.buildBox(options);

            return that;
        },
        show: function(datas) {
            this.box.style.display = '';
            return this;
        },
        hide: function() {
            this.box.style.display = 'none';
            return this;
        },
        update: function() {
            
        },
        insert: function(options, insertIndex, show, isAdd) {
            var cache = Factory.getCache(this.id),
                opt = options,
                items = [];

            return this;
        },
        add: function(options, show) {
            return this.insert(options, null, show, true);
        },
        sep: function(insertIndex, show) {
            return this.insert({ sep: 1 }, insertIndex, show);
        },
        remove: function() {
            return Factory.hideContextMenu(null, this.id, true), this;
        }
    };

    $.extend({
        listbox: function(obj, options) {
            return Factory.buildListBox(obj, options);
        }
    });

}(OUI);