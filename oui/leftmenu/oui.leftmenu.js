
/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.leftmenu 左栏菜单插件
*/

!function($) {
    'use strict';

    var Config = {
        FilePath: $.getScriptSelfPath(true),
        DefaultSkin: 'default',
        IsDefaultSkin: function(skin) {
            return (!$.isUndefined(skin) ? skin : Config.GetSkin()) === Config.DefaultSkin;
        },
        Skin: '',
        GetSkin: function() {
            if(!Config.Skin) {
                Config.Skin = Config.FilePath.getQueryString('skin') || Config.DefaultSkin;
            }
            return Config.Skin;
        }
    },
    Util = {
        clickTimer: null,
        checkOptions: function(options) {
            var opt = $.extend({}, options);

            return opt;
        },
        buildId: function(dr, opt) {
            return 'oui-menu-' + opt.id + '-' + (dr.id || dr.key);
        },
        buildItem: function(dr, opt, isCur) {
            var css = '', boxStyle = '', txtstyle = '';
            if(opt.style.txt) {
                css = opt.style.txt + ';';
                txtstyle = ' style="' + css + '"';
            }
            if (opt.maxHeight) {
                boxStyle += ' style="max-height:' + opt.maxHeight + 'px;"';
            }
            var html = [
                '<li class="item', isCur ? ' cur' : '', '"', boxStyle, '>',
                '<a id="', Util.buildId(dr, opt), '"',
                    ' class="text" key="', dr.id, '" url="', dr.url, '"', txtstyle, '>', 
                dr.name, 
                '</a>',
                '</li>'
            ];
            return html.join('');
        },
        getCurIndex: function(items) {
            var index = -1, closeAble = true;
            for (var i = 0; i < items.length; i++) {
                var dr = items[i];
                if (!dr.closeAble) {
                    closeAble = false;
                }
                if (dr.show || dr.load) {
                    index = i;
                    break;
                }
            }
            if(!closeAble && index < 0) {
                index = 0;
            }
            return index;
        },
        createItem: function(dr, opt, isCur) {
            var txtstyle = '';
            if(opt.style.txt) {
                txtstyle = ' style="' + opt.style.txt + '"';
            }

            var li = document.createElement('LI');
            li.className = 'item' + (isCur ? ' cur' : '');
            if (opt.maxHeight) {
                li.style.cssText = 'max-height:' + opt.maxHeight + 'px;';
            }
            li.innerHTML = [
                '<a id="{0}" class="text" key="{1}" url="{2}"', txtstyle, '>', dr.name, '</a>'
            ].join('').format(Util.buildId(dr, opt), dr.id || dr.key || '', dr.url || '');

            return li;
        },
        showItem: function(container, item, func, reload) {
            console.log('item:', item, ', reload: ', reload);
            var obj = item.childNodes[0],
                key = $.getAttribute(obj, 'key'),
                url = $.getAttribute(obj, 'url');

            if ($.isFunction(func)) {
                func({key: key, url: url, reload: reload});
            }
            $.removeClass(container.querySelectorAll('li.cur'), 'cur');
            if (item) {
                $.addClass(item, 'cur');
            }
            return this;
        },
        setCur: function(container, item) {
            $.removeClass(container.querySelectorAll('li.cur'), 'cur');
            if (item) {
                $.addClass(item, 'cur');
            }
            return this;
        },
        setEvent: function(container, item, opt, curFunc) {
            var obj = item.childNodes[0],
                func = curFunc || opt.callback;
            $.addListener(obj, opt.event || 'click', function() {
                Util.showItem(container, item, func, false);
            });
            if (opt.dblclickReload) {
                $.addListener(obj, 'dblclick', function() {
                    Util.showItem(container, item, func, true);
                });
            }
            return this;
        }
    },
    Cache = {
        menus: {},
        count: 0,
        index: 0
    },
    Factory = {
        initCache: function(objId, options, obj) {
            var key = this.buildKey(objId);
            Cache.menus[key] = {
                objId: objId,
                obj: obj,
                options: options,
                items: {},
                ids: [],
                closeItems: {},
                closeIds: [],
                cur: null
            };
            Cache.count += 1;
            return this;
        },
        buildKey: function(objId) {
            return 't_' + objId;
        },
        setCache: function(objId, opt, menu, con, iframe) {
            var cache = this.getCache(objId);
            if(cache) {
                var itemId = opt.id;
                cache.items[itemId] = {
                    objId: objId,
                    itemId: itemId,
                    closeAble: opt.closeAble,
                    iframe: iframe,
                    opt: opt,
                    menu: menu,
                    con: con
                };
                cache.ids.push(itemId);
                this.setClosedItem(cache, itemId, opt, true);
            }
            return this;
        },
        getCache: function(objId) {
            var key = this.buildKey(objId);
            return Cache.menus[key] || null;
        },
        buildMenu: function(container, options) {
            var box = $.toElement(container);
            if(!$.isElement(box)) {
                console.log('oui.leftmenu: ', '参数输入错误');
                return null;
            }
            var par = $.extend({}, options),
                id = 'oui-leftmenu-' + (par.id || box.id || Cache.index++),
                opt = $.extend({}, options, {id: id}),
                cache = Factory.getCache(opt.id);

            if(!cache) {
                return new LeftMenu(box, opt);
            }
            return cache.obj;
        },          
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
    };

    //先加载(默认)样式文件
    Factory.loadCss(Config.DefaultSkin);
    //加载指定的(默认)样式文件
    if(!Config.IsDefaultSkin()) {
        Factory.loadCss(Config.GetSkin());
    }

    function LeftMenu (container, options) {
        var that = this;
        that.container = $.toElement(container);
        if(!$.isElement(that.container)) {
            return false;
        }

        var cfg = {
            id: 'oui-leftmenu',
            skin: Config.DefaultSkin,       //样式: default, blue
            //lang: 'chinese',              //chinese, english
            //lang: Config.GetLang(),         //语言 Chinese,English
            type: 'switch',     //switch, scroll
            event: 'click',     //click, mouseover
            position: '',           //right 表示右栏菜单，默认为空
            width: 33,          //宽度
            height: 0,          //高度
            index: 0,           //默认设置的当前项的索引
            maxHeight: 240,
            dblclickReload: false,  //双击重载
            showContextMenu: true,  //右键菜单（功能未完成）
            style: {                
                //box: 'margin: 0 5px;',
                //tab: 'margin: 0 5px 0 0;',
                //txt: 'font-size:14px;',
                //panel: 'overflow: hidden;'
            },
            items: [],
            callback: function(par) {
                console.log(par);
            }
        }, opt = Util.checkOptions(options);

        $.extend(cfg.style, opt.style);
        //再删除参数中的style，防止参数覆盖
        delete opt.style;

        that.options = $.extend(cfg, opt);
        that.id = that.options.id || '';
        that.items = {};

        that.initial(that.options);
    }

    LeftMenu.prototype = {
        initial: function(opt) {
            var that = this, cssTab = '';

            if(!opt.index) {
                opt.index = Util.getCurIndex(opt.items);
            }

            Factory.initCache(that.id, opt, that);

            if (opt.skin !== Config.DefaultSkin) {
                cssTab = ' oui-leftmenu-' + opt.skin;
                if (opt.position  === 'right') {
                    cssTab += ' oui-rightmenu-' + opt.skin;
                }
                Factory.loadCss(opt.skin);
            }
            $.addClass(that.container, 'oui-leftmenu' + (opt.position  === 'right' ? ' oui-rightmenu' : '') + cssTab);

            that.size({width: opt.width, height: opt.height});

            that.box = $.createElement('UL', '', function(elem) {
                var items = [], 
                    isFrm = typeof DocumentFragment === 'function',
                    frm = isFrm ? new DocumentFragment() : null;
                for (var i = 0; i < opt.items.length; i++) {
                    var dr = opt.items[i], key = dr.id || dr.key,
                        item = Util.createItem(dr, opt, opt.index === i);
                    items.push(item);
                    isFrm ? frm.appendChild(item) : elem.appendChild(item);
                    Util.setEvent(that.container, item, opt, dr.callback);

                    that.items[key] = {key: key, item: item, func: dr.callback};
                }
                if (isFrm) {
                    elem.appendChild(frm);
                }
                for (var j = 0; j < items.length; j++) {
                    var li = items[j];                    
                    if (li.childNodes[0].offsetHeight > opt.maxHeight) {
                        li.title = opt.items[j].name;
                    }
                }
            }, that.container);

            return this;
        },
        size: function(size) {
            var that = this;
            size = $.extend({width: 0, height: 0}, size);

            if (size.width && !isNaN(size.width)) {
                that.container.style.width = size.width + 'px';
            }
            if (size.height && !isNaN(size.height)) {
                that.container.style.height = size.height + 'px';
            }
            return this;
        },
        add: function(cfg) {
            var that = this,
                opt = that.options,
                key = cfg.id || cfg.key,
                item = Util.createItem(cfg, opt);

            that.box.appendChild(item);
            Util.setEvent(that.container, item, opt, cfg.callback);

            that.items[key] = {key: key, item: item, func: cfg.callback};

            if (item.childNodes[0].offsetHeight > opt.maxHeight) {
                item.title = cfg.name;
            }

            return that;
        },
        show: function(key) {
            var that = this,
                dr = that.items[key];

            if (dr) {
                Util.showItem(that.container, dr.item, dr.callback || that.options.callback, false);
            }
            return that;
        },
        cur: function(key) {
            var that = this,
                dr = key ? that.items[key] : null;

            Util.setCur(that.container, dr ? dr.item : null);
            return that;
        }
    };

    $.extend({
        leftmenu: function(container, options) {
            return Factory.buildMenu(container, options);
        }
    });
}(OUI);