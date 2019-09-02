
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
                w = opt.width === 'auto' ? offset.width : $.toCssSizeVal(opt.width),
                h = opt.height === 'auto' ? 200 : $.toCssSizeVal(opt.height);
            box.style.cssText = 'left:{0}px;top:{1}px;width:{2}px;height:{3}px;display:none;'.format(
                offset.left, 
                offset.top + offset.height - 3,
                w,
                h
            );
            return this;
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
                };

                var arr = childs[i].childNodes;
                if(arr.length > 1) {
                    arr[1].onclick = function() {
                        $.cancelBubble().removeElement(this.parentNode);
                    };
                }
            }

            return this;
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
            var that = this;
            that.target = $.toElement(options.target);

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

            //Factory.initCache(that, options);

            that.box = Factory.buildBox(options);

            return that;
        },
        show: function(datas) {
            Factory.setListData(this, datas, this.box);
            this.box.style.display = '';
            return this;
        },
        hide: function() {
            this.box.style.display = 'none';
            return this;
        },
        update: function(datas) {
            Factory.setListData(this, datas, this.box);
            return this;
        },
        insert: function(datas, insertIndex, show) {
            Factory.setListData(this, datas, this.box, true);
            return this;
        },
        add: function(datas, show) {
            return this.insert(datas, null, show);
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