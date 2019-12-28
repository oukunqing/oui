
/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.contextmenu 右键菜单插件
*/

!function(){
    'use strict';
    
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
        checkItemOptions: function() {
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
        },
        checkOptions: function(options) {
            var items = [];
            if($.isArray(options)) {
                items = options;
            } else if($.isArray(options.items)) {
                items = options.items;
            } else if($.isObject(options.items)) {
                items = [options.items];
            } else if(options.name) {
                items = [options];
            }
            return $.extend(options, {items: items});
        },
        initCache: function(menu, options, obj, isUpdate) {
            var key = this.buildKey(menu.id);
            options = Factory.checkOptions(options);
            Cache.menus[key] = {
                id: menu.id,
                obj: obj,
                menuId: menu.id,
                menu: menu,
                items: {},
                boxs: [],
                options: $.extend({
                    items: []
                }, options),
                itemId: 1
            };
            if(!isUpdate) {
                Cache.count += 1;
            }
            return this;
        },
        updateCache: function(menu, options) {
            var key = this.buildKey(menu.id);
            options = Factory.checkOptions(options);
            Cache.menus[key].options = $.extend({
                items: []
            }, options);
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
        buildMenu: function(options, isUpdate) {
            var opt = $.extend({
                id: 'oui-menu',
                obj: null
            }, options);

            opt.target = $.toElement(opt.target || opt.anchor);
            opt.position = opt.position || opt.pos;
            opt.par = $.extend({}, opt.param || opt.par);

            if(opt.id === 'oui-menu' && $.isElement(opt.obj)) {
                opt.id = 'oui-menu-' + opt.obj.id;
            }

            var cache = this.getCache(opt.menuId || opt.id), menu;
            if(!cache) {
                menu = new ContextMenu(opt);
            } else {
                menu = cache.menu;
                if(isUpdate) {
                    menu.update(options);
                }
            }
            return menu;
        },
        addItem: function(items, insertIndex, show, action) {
            var opt = $.extend({ menuId: '' }, items);
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
                var cssText = 'left:{x}px;width:{width}px;height:{height}px;margin-top:{y}px;'.format(opt);
                cssText += cfg.radius ? 'border-radius:' + cfg.radius + 'px;' : '';
                box.style.cssText = cssText;
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
                        elem.data = param.data;

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
                            if(!dr.node && !dr.leaf) {
                                elem.innerHTML = txt;
                                $.addListener(elem, 'mouseup', function(ev){
                                    $.cancelBubble(ev);
                                });
                                return false;
                            }
                        }
                        var func = Factory.buildMenuCallback(dr, cfg);
                        if(!disabled && $.isFunction(func)) {
                            $.addListener(elem, 'mouseup', function(ev) {
                                $.cancelBubble(ev);
                                Factory.hideContextMenu(ev, box.menuId, true);
                                var par = Factory.buildMenuPar(elem.data, cfg);
                                func(par, this);
                            });
                        } else {                            
                            $.addListener(elem, 'mouseup', function(ev){
                                $.cancelBubble(ev);
                            });
                        }
                        elem.innerHTML = Factory.buildMenuText(txt, dr, disabled);
                    }, box, { items: dr.items, hasChild: hasChild, data: dr });
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
                    
                if(!txt) {
                    return null;
                }
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
                        if(!dr.node && !dr.leaf) {
                            elem.innerHTML = txt;
                            $.addListener(elem, 'mouseup', function(ev){
                                $.cancelBubble(ev);
                            });
                            return false;
                        }
                    }                    
                    if(!disabled && $.isFunction(func)) {
                        $.addListener(elem, 'mouseup', function(ev) {
                            $.cancelBubble(ev);
                            Factory.hideContextMenu(ev, menuId, true);
                            func(par, this);
                        });
                    } else {
                        $.addListener(elem, 'mouseup', function(ev){
                            $.cancelBubble(ev);
                        });
                    }
                    elem.innerHTML = Factory.buildMenuText(txt, dr, disabled);
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
            }, dr.par);

            return $.extend({}, opt.par, par);
        },
        buildMenuItems: function(opt, cache, autoWidth) {
            var items = [];

            for(var i = 0; i < opt.items.length; i++) {
                var dr = opt.items[i];
                if(dr) {
                    var item = this.buildMenuItem(dr, opt.id, opt, 0, cache, autoWidth);
                    if(item) {
                        items.push(item);
                    }
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
        getMenuPosition: function(ev, obj, bs, ss, opt, ts) {
            var pos = {};
            if(ts) {
                var x = ts.left + opt.x, y = ts.top + ts.height + opt.y;
                switch(opt.position) {
                    case 7:
                    default:
                        pos = { x: x, y: y };  
                        break;
                    case 9:
                        x = ts.left + ts.width - opt.x;
                        pos = { x: x, y: y, self: true };
                        break;
                }
            } else if(ev && ev.type === 'contextmenu') {
                pos = $.getEventPosition(ev);
            } else if($.isElement(obj)) {
                var offset = $.getOffset(obj);
                pos = { x: offset.left + opt.x, y: offset.top + offset.height + opt.y };
            } else {
                return { x: bs.width / 2 + ss.left, y: bs.height / 2 + ss.top, center: true };
            }
            return pos;
        },
        buildContextMenu: function(ev, menu, obj) {
            var cache = Factory.getCache(menu.id),
                op = cache.options,
                isAnchor = $.isElement(op.target),
                ts = isAnchor ? $.getOffset(op.target) : null,
                bs = $.getBodySize(),
                ss = $.getScrollPosition(),
                pos = Factory.getMenuPosition(ev, obj, bs, ss, op, ts), 
                opt = $.extend({
                    width: 240,
                    height: 'auto'
                }, cache.options, pos),
                id = 'oui-context-menu-' + menu.id,
                box = $I(id),
                autoWidth = ('' + opt.width).toLowerCase() === 'auto',
                followSize = isAnchor && op.target.tagName === 'INPUT';

            if(!pos) {
                return this;
            }

            if(autoWidth && followSize) {
                opt.width = ts.width;
            } else if(!autoWidth && (opt.x + opt.width) > (bs.width + ss.left)) {
                opt.x = bs.width + ss.left - opt.width;
            }
            if(box) {
                box.style.left = opt.x + 'px';
                box.style.top = opt.y + 'px';
            } else {
                box = $.createElement('div', id, function(elem) {
                    elem.className = 'oui-context-menu menu-level-0';
                    elem.level = 0;
                    var cssText = 'left:{x}px;top:{y}px;width:{width}px;height:{height}px;'.format(opt);
                    cssText += opt.radius ? 'border-radius:' + opt.radius + 'px;' : '';
                    elem.style.cssText = cssText;

                    $.disableEvent(elem, 'contextmenu');

                    var items = Factory.buildMenuItems(opt, cache, autoWidth);
                    if(autoWidth && !followSize) {
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

                var xs = $.elemSize(box);
                if(pos.self) {
                    box.style.left = (pos.x - xs.width) + 'px';
                } else if(pos.center) {
                    box.style.left = (xs.style.left - xs.width / 2) + 'px';
                    box.style.top = (xs.style.top - xs.height / 2) + 'px';
                }

                if(xs.top + xs.outerHeight > bs.height + ss.top) {
                    box.style.top = (bs.height + ss.top - xs.outerHeight - 2) + 'px';
                }
            }
            return box;
        },
        hideContextMenu: function(ev, id, hide) {
            var obj = $I('oui-context-menu-' + id);
            if(obj) {
                if(null === ev && hide) {
                    //return $.removeElement(obj), Cache.count--, this;
                    return $.removeElement(obj), this;
                };
                if(hide || !$.isOnElement(obj, ev)) {
                    $.removeElement(obj);
                    //Cache.count--;
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
        }
    };


    //先加载样式文件
    Factory.loadCss();

    function ContextMenu(options) {
        var opt = $.extend({
            id: 'oui-menu',
            obj: null,
            radius: 5,
            //触发事件，默认为contextmenu（即右键菜单），也可以是 click
            event: 'contextmenu', 
            //以下参数作为目标停靠时用
            target: null,   //anchor
            position: 7,
            x: 0,
            y: -1
        }, options);

        this.id = opt.menuId || opt.id;

        this.initial(opt);
    }

    ContextMenu.prototype = {
        initial: function(opt) {
            var that = this,
                obj = $.toElement(opt.obj);

            Factory.initCache(that, opt, obj);

            if($.isElement(obj)) {
                obj['on' + opt.event] = function(ev) {
                    return Factory.buildContextMenu(ev, that, obj), false;
                };
            }

            $.addListener(document, 'keydown', Factory.escContextMenu)
                .addListener(document, 'mousedown', function(ev) {
                    Factory.hideContextMenu(ev, that.id);
                });

            return that;
        },
        update: function(options, isInitial) {
            Factory.updateCache(this, options);
            return this;
        },
        show: function(ev) {
            var cache = Factory.getCache(this.id);
            Factory.buildContextMenu(ev, this, cache.obj);
            return this;
        },
        hide: function() {
            return Factory.hideContextMenu(null, this.id, true), this;
        },
        insert: function(items, insertIndex, show, isAdd) {
            var cache = Factory.getCache(this.id),
                opt = items;

            items = Factory.checkItemOptions(items, insertIndex, show);

            if(typeof insertIndex === 'undefined' || (!isAdd && opt !== items)) {
                insertIndex = 0;
            }
            if($.isArray(items)) {
                for(var i = 0; i < items.length; i++) {
                    Factory.fillOptions(cache.options.items, items[i], insertIndex);
                }
            } else {
                Factory.fillOptions(cache.options.items, items, insertIndex);
            }
            return this;
        },
        add: function(items, show) {
            return this.insert(items, null, show, true);
        },
        sep: function(insertIndex, show) {
            return this.insert({ sep: 1 }, insertIndex, show);
        },
        remove: function() {
            return Factory.hideContextMenu(null, this.id, true), this;
        }
    };

    $.extend({
        contextmenu: function(options, isUpdate) {
            return Factory.buildMenu(options, isUpdate);
        }
    });

    $.extend($.contextmenu, {
        add: function(items, show) {
            return Factory.addItem(items, null, show, 'add');
        },
        insert: function(items, insertIndex, show) {
            return Factory.addItem(items, insertIndex, show, 'insert');
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