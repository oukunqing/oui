
/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.contextmenu 右键菜单插件
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
        menus: {},
        count: 0,
        itemId: 1
    },
    Factory = {
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
        buildItemId: function(menuId) {
            return 'cmenu-' + menuId + '-' + (Cache.itemId++);
        },
        buildKey: function(id) {
            return 'm_' + id;
        },
        getCache: function(menuId) {
            var key = this.buildKey(menuId);
            return Cache.menus[key] || null;
        },
        buildMenu: function(options) {
            var opt = $.extend({
                id: '',
                obj: null
            }, options);
            var cache = this.getCache(opt.menuId || opt.id);
            if(!cache) {
                return new ContextMenu(opt);
            }
            return cache.menu;
        },
        addItem: function(options, insertIndex, show, action) {
            var opt = $.extend({ menuId: '' }, options);
            if(!opt.menuId) {
                return this;
            }
            if(!opt.id) {
                opt.id = opt.menuId;
            }
            var menu = Factory.buildMenu(opt);
            switch(action) {
                case 'add':
                case 'insert':
                    menu.insert(opt, insertIndex, show);
                    break;
                case 'sep':
                    menu.sep(insertIndex, show);
                    break;
            }
            return this;
        },
        removeMenu: function(menuId) {
            return Factory.hideContextMenu(null, menuId, true);
        },
        closeOpenedBox: function(cache, level) {
            var boxs = cache.boxs || [], c = boxs.length;
            boxs.sort(function(a, b) {
                return b.level - a.level
            });
            for(var i = c - 1; i >= 0; i--) {
                var b = boxs[i];
                if(b.level > level) {
                    $.removeElement(b.box);
                    cache.boxs.splice(i, 1);
                    $.removeClass(b.item, 'cur');
                }
            }
            return this;
        },
        buildSubMenu: function(parent, pos, items, isSub, cfg, cache, autoWidth) {
            var offset = $.getOffset(parent);
            var opt = {
                width: cfg.width,
                height: cfg.height,
                x: offset.width - 5,
                y: -24 - 3
            },
            bs = $.getBodySize(),
            ss = $.getScrollPosition(),
            id = parent.id + '-sub',
            obj = $I(id),
            level = parent.level + 1;

            if(autoWidth) {
                opt.width = Factory.getMaxWidth(items);
            }

            if(obj) {
                return this;
            }

            Factory.closeOpenedBox(cache, parent.level);

            if((offset.left + opt.x + opt.width - ss.left + 2) > (bs.width)) {
                opt.x = 5 - opt.width;
            }

            var box = $.createElement('div', id, function(box) {
                box.className = 'oui-context-menu menu-level-' + level;
                box.menuId = parent.menuId;
                box.itemId = Factory.buildItemId(parent.menuId);
                box.level = level;
                box.style.cssText = 'left:{x}px;width:{width}px;height:{height}px;margin-top:{y}px;'.format(opt);
                $.disableEvent(box, 'contextmenu');

                var html = [];
                for(var i = 0; i < items.length; i++) {
                    var dr = items[i],
                        id = Factory.buildItemId(box.menuId),
                        txt = dr.name || dr.txt || dr.text,
                        hasChild = $.isArray(dr.items),
                        disabled = $.isBoolean(dr.disabled || dr.disable, false);

                    $.createElement('div', id, function(elem, param) {
                        elem.className = 'cmenu-item' + (disabled ? ' cmenu-disabled' : '');
                        elem.menuId = box.menuId;
                        elem.itemId = id;
                        elem.level = level;

                        if(!disabled) {
                            $.disableEvent(elem, 'mousedown', $.cancelBubble);
                            $.addListener(elem, 'mouseover', function(ev) {
                                $.cancelBubble();
                                if(param.hasChild) {
                                    $.addClass(elem, 'cur');
                                    Factory.buildSubMenu(this, $.getEventPosition(ev), param.items, true, cfg, cache, autoWidth);
                                } else {
                                    Factory.closeOpenedBox(cache, level);
                                }
                            });
                        }

                        if(param.hasChild) {
                            txt += '<i class="cmenu-arrow"></i>';
                            elem.innerHTML = txt;
                        } else {
                            var func = Factory.buildMenuCallback(dr, cfg);
                            if(!disabled && $.isFunction(func)) {
                                var par = Factory.buildMenuPar(dr, cfg);
                                $.addListener(elem, 'mouseup', function(ev) {
                                    $.cancelBubble();
                                    Factory.hideContextMenu(ev, box.menuId, true);
                                    func(par, this);
                                });
                            }
                            elem.innerHTML = Factory.buildMenuText(txt, dr, disabled);
                        }
                    }, box, false, { items: dr.items, hasChild: hasChild });
                }                
            }, parent);

            var boxSize = $.elemSize(box);
            if(boxSize.top + boxSize.outerHeight > bs.height + ss.top) {
                box.style.marginTop = (bs.height + ss.top) - (boxSize.top + boxSize.outerHeight) - 3 + 'px';
            }

            cache.boxs.push({box: box, level: level, item: parent});
        },
        buildMenuItem: function(dr, menuId, cfg, level, cache, autoWidth) {
            var elem = null;
            if(dr === 'sep' || dr.sep || dr.type === 'sep') {
                elem = $.createElement('div', '', function(elem) {
                    elem.className = 'cmenu-sep';
                });
                return { type: 'sep', elem: elem, height: 9 };
            } else {
                var txt = dr.name || dr.txt || dr.text,
                    hasChild = $.isArray(dr.items),
                    id = Factory.buildItemId(menuId),
                    func = Factory.buildMenuCallback(dr, cfg),                    
                    par = Factory.buildMenuPar(dr, cfg),
                    w = autoWidth ? Factory.getContentWidth(dr) : 0,
                    disabled = $.isBoolean(dr.disabled || dr.disable, false);

                elem = $.createElement('div', id, function(elem) {
                    elem.className = 'cmenu-item' + (disabled ? ' cmenu-disabled' : '');
                    elem.menuId = menuId;
                    elem.itemId = id;
                    elem.level = level;

                    if(!disabled) {
                        $.disableEvent(elem, 'mousedown', $.cancelBubble);
                        $.addListener(elem, 'mouseover', function(ev) {
                            $.cancelBubble();
                            if(hasChild) {
                                $.addClass(elem, 'cur');
                                Factory.buildSubMenu(elem, $.getEventPosition(ev), dr.items, false, cfg, cache, autoWidth);
                            } else {
                                Factory.closeOpenedBox(cache, level);
                            }
                        });
                    }

                    if(hasChild) {
                        txt += '<i class="cmenu-arrow"></i>';
                        elem.innerHTML = txt;
                    } else {
                        if(!disabled && $.isFunction(func)) {
                            $.addListener(elem, 'mouseup', function(ev) {
                                $.cancelBubble();
                                Factory.hideContextMenu(ev, menuId, true);
                                func(par, this);
                            });
                        }
                        elem.innerHTML = Factory.buildMenuText(txt, dr, disabled);
                    }
                });
                return { type: 'menu', elem: elem, height: 24, width: w };
            }
        },
        buildMenuText: function(txt, dr, disabled) {
            if(!disabled && dr && dr.url) {
                if(dr.target) {
                    return '<a class="cmenu-link" href="{0}" target="{1}" onmouseup="$.cancelBubble();">{2}</a>'.format(dr.url, dr.target, txt);
                } else {
                    return '<a class="cmenu-link" href="{0}" onmouseup="$.cancelBubble();">{1}</a>'.format(dr.url, txt);
                }
            }
            return txt;
        },
        buildMenuCallback: function(dr, opt) {
            return dr.callback || dr.func || opt.callback || opt.func;
        },
        buildMenuPar: function(dr, opt) {
            var par = $.extend({
                key: dr.key || '',
                action: dr.action || dr.key || '',
                name: dr.name || dr.text || dr.txt
            }, dr.par, opt.param || opt.par);
            return par;
        },
        buildMenuItems: function(opt, cache, autoWidth) {
            var items = [];

            for(var i = 0; i < opt.items.length; i++) {
                var dr = opt.items[i];
                if(dr) {
                    items.push(this.buildMenuItem(dr, opt.id, opt, 0, cache, autoWidth));
                }                
            }

            return items;
        },
        fillMenuItem: function(box, items, opt, isAppend) {
            var height = 0;
            for(var i in items) {
                box.appendChild(items[i].elem);
                height += items[i].height;
            }
            if(!isAppend) {
                //height + padding + border
                height += 8;
                if(!opt.height || opt.height === 'auto' || height > opt.height) {
                    box.style.height = height + 'px';
                }
            } else {
                box.style.height = parseInt(box.style.height, 10) + height;
            }

            return this;
        },
        pushOption: function(items, opt, insertIndex) {
            var index = Factory.getInsertIndex(items, insertIndex);
            if($.isNumber(index) && index >= 0) {
                items.splice(index, 0, opt);
            } else {
                items.push(opt);
            }
            //items.push(opt);
            return this;
        },
        getInsertIndex: function(items, insertIndex) {
            var index = insertIndex;
            if($.isString(insertIndex, true)) {
                for(var i = 0; i < items.length; i++ ) {
                    if(items[i].key === insertIndex) {
                        index = i;
                        break;
                    }
                }
            }
            return index;
        },
        dealOption: function(items, opt, pkey, insertIndex) {
            if($.isString(pkey, true) || $.isNumber(pkey)) {                
                for(var i = 0; i < items.length; i++) {
                    if(items[i].key === pkey) {
                        if(!$.isArray(items[i].items)) {
                            items[i].items = [];
                        }
                        Factory.pushOption(items[i].items, opt, insertIndex);
                        return this;
                    } else if(items[i].items) {
                        return Factory.dealOption(items[i].items, opt, pkey, insertIndex);
                    }
                }
            }
            Factory.pushOption(items, opt, insertIndex);
            return this;
        },
        fillOptions: function(items, opt, insertIndex) {
            if(!items || !opt) {
                return this;
            }
            Factory.dealOption(items, opt, opt.pkey || opt.pid, insertIndex);
            return this;
        },
        getContentWidth: function(dr) {
            var txt = dr.name || dr.text || dr.txt;
            var w = $.getContentSize(txt).width + Config.ItemMBPWidth;
            if($.isArray(dr.items) && dr.items.length > 0) {
                w += Config.ItemArrowWidth;
            }
            return w;
        },
        getMaxWidth: function(items, box) {
            var width = 0;
            for(var i = 0; i < items.length; i++) {
                var dr = items[i], w = 0;
                if($.isNumber(dr.width)) {
                    w = dr.width;
                } else {
                    w = Factory.getContentWidth(dr);
                }
                if(w > width) {
                    width = w;
                }
            }
            if(width < Config.ItemMinWidth) {
                width = Config.ItemMinWidth;
            }
            return width;
        },
        buildContextMenu: function(ev, menu) {
            var cache = Factory.getCache(menu.id),
                bs = $.getBodySize(),
                ss = $.getScrollPosition(),
                pos = $.getEventPosition(ev), 
                opt = $.extend({
                    width: 240,
                    height: 'auto'
                }, cache.options, pos),
                id = 'oui-context-menu-' + menu.id,
                box = $I(id),
                autoWidth = ('' + opt.width).toLowerCase() === 'auto';

            if(!autoWidth && (opt.x + opt.width) > (bs.width + ss.left)) {
                opt.x = bs.width + ss.left - opt.width;
            }
            if(box) {
                box.style.left = opt.x + 'px';
                box.style.top = opt.y + 'px';
            } else {
                box = $.createElement('div', id, function(elem) {
                    elem.className = 'oui-context-menu menu-level-0';
                    elem.level = 0;
                    elem.style.cssText = 'left:{x}px;top:{y}px;width:{width}px;height:{height}px;'.format(opt);
                    $.disableEvent(elem, 'contextmenu');

                    var items = Factory.buildMenuItems(opt, cache, autoWidth);
                    if(autoWidth) {
                        var w = Factory.getMaxWidth(items);
                        elem.style.width = w + 'px';
                        opt.width = w;

                        if((opt.x + opt.width) > (bs.width + ss.left)) {
                            opt.x = bs.width + ss.left - opt.width;
                            elem.style.left = (opt.x - 2) + 'px';
                        }
                    }

                    Factory.fillMenuItem(elem, items, opt);
                }, document.body);

                var boxSize = $.elemSize(box);
                if(boxSize.top + boxSize.outerHeight > bs.height + ss.top) {
                    box.style.top = (bs.height + ss.top - boxSize.outerHeight - 2) + 'px';
                }
            }
            return box;
        },
        hideContextMenu: function(ev, id, hide) {
            var obj = $I('oui-context-menu-' + id);
            if(obj) {
                if(null === ev && hide) {
                    return $.removeElement(obj), Cache.count--, this;
                };
                if(hide || !$.isOnElement(obj, ev)) {
                    $.removeElement(obj);
                    Cache.count--;
                }
            }
            return this;
        },
        escContextMenu: function(ev) {
            if($.getKeyCode(ev) === $.keyCode.Esc) {
                Factory.hideAllContextMenu();
            }
            return this;
        },
        hideAllContextMenu: function() {
            if(Cache.count > 0) {
                $('.oui-context-menu').each(function(i, obj){
                    $.removeElement(obj);
                });
                //$.removeListener(document, 'keydown', Factory.escContextMenu);
            }
            return this;
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
        checkOptions: function() {
            var options = {}, i = 0;
            if(arguments.length > 1 && $.isString(arguments[0], true)) {
                while(i++ < arguments.length) {
                    if($.isFunction(arguments[i])) {
                        options = { name: arguments[0], func: arguments[i] };
                        break;
                    }
                }            
                return options;
            }
            return arguments[0];
        }
    };


    //先加载样式文件
    Factory.loadCss();

    function ContextMenu(options) {
        var opt = $.extend({
            id: 'oui-menu',
            obj: null
        }, options);

        this.id = opt.menuId || opt.id;

        this.initial(options);
    }

    ContextMenu.prototype = {
        initial: function(options) {
            var that = this,
                obj = $.toElement(options.obj);

            Factory.initCache(that, options);

            obj.oncontextmenu = function(ev) {
                return Factory.buildContextMenu(ev, that), false;
            };

            $.addListener(document, 'keydown', Factory.escContextMenu)
                .addListener(document, 'mousedown', function(ev) {
                    Factory.hideContextMenu(ev, that.id);
                });
            return that;
        },
        insert: function(options, insertIndex, show, isAdd) {
            var cache = Factory.getCache(this.id),
                opt = options,
                items = [];

            options = Factory.checkOptions(options, insertIndex, show);

            if(typeof insertIndex === 'undefined' || (!isAdd && opt !== options)) {
                insertIndex = 0;
            }
            if($.isArray(options)) {
                for(var i = 0; i < options.length; i++) {
                    Factory.fillOptions(cache.options.items, options[i], insertIndex);
                }
            } else {
                Factory.fillOptions(cache.options.items, options, insertIndex);
            }
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
        contextmenu: function(options) {
            return Factory.buildMenu(options);
        }
    });

    $.extend($.contextmenu, {
        add: function(options, show) {
            return Factory.addItem(options, null, show, 'add');
        },
        insert: function(options, insertIndex, show) {
            return Factory.addItem(options, insertIndex, show, 'insert');
        },
        sep: function(insertIndex, show) {
            return Factory.addItem({ sep: 1 }, insertIndex, show, 'sep');
        },
        remove: function(menuId) {
            return Factory.removeMenu(menuId);
        },
        close: function(menuId) {
            return Factory.removeMenu(menuId);
        },
        closeAll: function() {
            return Factory.hideAllContextMenu();
        },
        hideParentMenu: function() {
            return Factory.hideAllContextMenu();
        }
    });

    $.extend({
        cmenu: $.contextmenu
    });

}(OUI);