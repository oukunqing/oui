
/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.contextmenu 右键菜单插件
*/

;!function () {
    'use strict';
    
    var SelfPath = $.getScriptSelfPath(true);
    var Config = {
        FilePath: SelfPath,
        FileDir: $.getFilePath(SelfPath),
        //菜单项边距边框尺寸
        ItemMBPWidth: 22,
        ItemMinWidth: 80,
        ItemArrowWidth: 35,
        IconWidth: 25
    },
    Cache = {
        menus: {},
        checks: {},
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
        updateChecked: function(menuId, chbId, checked) {
            var key = this.buildKey(menuId),
                cache = Cache.checks[key];
            if(!cache) {
                Cache.checks[key] = {};
            }
            Cache.checks[key][chbId] = { checked: checked };
            return this;
        },
        getChecked: function(menuId, chbId) {
            var key = this.buildKey(menuId);
            var cache = Cache.checks[key];
            if(cache && cache[chbId]) {
                return cache[chbId].checked;
            }
            return null;
        },
        clearChecked: function(menuId) {
            var key = this.buildKey(menuId),
                cache = Cache.checks[key];
            if(!cache) {
                Cache.checks[key] = null;
            }
            return this;
        },
        buildItemId: function(menuId) {
            return 'cmenu-' + menuId + '-' + (Cache.itemId++);
        },
        buildKey: function(id) {
            return 'm_' + id;
        },
        buildChbId: function(menuId, id) {
            return 'cmenu-chb-' + menuId + '-' + id;
        },
        getCache: function(menuId) {
            var key = this.buildKey(menuId);
            return Cache.menus[key] || null;
        },
        buildMenu: function(options, isUpdate) {

            options.showIcon = $.getParam(options, ['showIcon', 'icon']);

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
                opt.width = Factory.getMaxWidth(items) + (cfg.showIcon ? Config.IconWidth : 0);
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

                for(var i = 0; i < items.length; i++) {
                    var dr = items[i],
                        itemId = Factory.buildItemId(box.menuId),
                        chbId = Factory.buildChbId(box.menuId, dr.key),
                        txt = dr.name || dr.txt || dr.text,
                        hasChild = $.isArray(dr.items),
                        disabled = $.isBoolean(dr.disabled || dr.disable, false);

                    $.createElement('div', itemId, function(elem, param) {
                        elem.className = 'cmenu-item' + (disabled ? ' cmenu-disabled' : '');
                        elem.menuId = box.menuId;
                        elem.itemId = itemId;
                        elem.chbId = chbId;
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

                        txt += Factory.buildMenuIcon(cfg, dr);

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
                                var par = Factory.buildMenuPar(elem.data, cfg, elem.chbId);
                                Factory.setChecked(box.menuId, par).hideContextMenu(ev, box.menuId, true);
                                func(Factory.dealChecked(par, elem), this);
                            });
                        } else {
                            $.addListener(elem, 'mouseup', function(ev){
                                $.cancelBubble(ev);
                            });
                        }
                        elem.innerHTML = Factory.buildMenuText(txt, dr, disabled, box.menuId, chbId);
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
                    itemId = Factory.buildItemId(menuId),
                    chbId = Factory.buildChbId(menuId, dr.key),
                    func = Factory.buildMenuCallback(dr, cfg),
                    par = Factory.buildMenuPar(dr, cfg, chbId),
                    w = autoWidth ? Factory.getContentWidth(dr) : 0,
                    disabled = $.isBoolean(dr.disabled || dr.disable, false);
                    
                if(!txt) {
                    return null;
                }
                elem = $.createElement('div', itemId, function(elem) {
                    elem.className = 'cmenu-item' + (disabled ? ' cmenu-disabled' : '');
                    elem.menuId = menuId;
                    elem.itemId = itemId;
                    elem.chbId = chbId;
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

                    txt += Factory.buildMenuIcon(cfg, dr);

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
                            Factory.setChecked(menuId, par).hideContextMenu(ev, menuId, true);
                            func(Factory.dealChecked(par, elem), this);
                        });
                    } else {
                        $.addListener(elem, 'mouseup', function(ev){
                            $.cancelBubble(ev);
                        });
                    }
                    elem.innerHTML = Factory.buildMenuText(txt, dr, disabled, menuId, chbId);
                });
                return { type: 'menu', elem: elem, height: 24, width: w };
            }
        },
        dealChecked: function(par, elem) {
            //若checked为字符串，表示是单选，判断ID是否为当前ID
            if($.isString(par.checked) && par.checked === elem.chbId) {
                par.checked = true;
            }
            delete par['menu_chb_id'];
            return par;
        },
        setChecked: function(menuId, par) {
            var chbId = Factory.buildChbId(menuId, par.key), chb = $I(chbId), key = chbId;
            if(chb !== null) {
                var isSingle = chb.type === 'radio';
                if(chb.type === 'radio') {
                    //单选框，指定当前选中的元素ID
                    par.checked = par.menu_chb_id;
                    key = chb.name;
                } else {
                    par.checked = !chb.checked;
                }
                Factory.updateChecked(menuId, key, par.checked, isSingle);
            }
            return this;
        },
        buildMenuIcon: function(opt, dr) {
            if(opt.showIcon) {
                var icon = dr.icon || '', img = dr.img || '', cssText = dr.iconCss || dr.iconStyle;
                if(img) {
                    return '<img src="' + img + '" class="menu-icon" style="' + cssText + '" />';
                } else if(icon) {
                    return '<div class="menu-icon" style="background:url(\'' + icon + '\') no-repeat center;' + cssText + '"></div>';
                } else {
                    return '<div class="menu-icon" style="' + cssText + '"></div>';
                }
            }
            return '';
        },
        buildMenuText: function(txt, dr, disabled, menuId, chbId) {
            if(!disabled && dr && dr.url) {
                var target = dr.target ? 'target="' + dr.target + '"' : '';
                return '<a class="cmenu-link" href="{url}" {1} onmouseup="$.cancelBubble();">{2}</a>'.format(dr, target, txt);
            }
            var checkbox = dr.checkbox || dr.radio;
            if(!$.isUndefined(checkbox)) {
                var chbName = 'rb' + checkbox.name,
                    isSingle = (dr.radio || checkbox.single) || false,
                    key = isSingle ? chbName : chbId,
                    cacheChecked = Factory.getChecked(menuId, key), 
                    checked = '';

                //强制选中指定的选项
                if(checkbox.checked && checkbox.force) {
                    if(isSingle) {
                        Factory.updateChecked(menuId, key, chbId, true);
                    }
                    checked = ' checked="checked" ';
                } else if(cacheChecked !== null) {
                    if(isSingle) {
                        //单选框，判断选中的元素ID是否为当前ID
                        checked = cacheChecked === chbId ? ' checked="checked" ' : '';
                    } else {
                        checked = cacheChecked ? ' checked="checked" ' : '';
                    }
                } else {
                    checked = $.isBoolean(checkbox, false) || checkbox.checked ? ' checked="checked" ' : '';
                }
                return [
                    '<label class="cm-chb-label">',
                    (!isSingle ? 
                        '<input type="checkbox" class="cm-chb" ' + checked + ' id="' + chbId + '" />' :
                        '<input type="radio" class="cm-chb" ' + checked + ' id="' + chbId + '"' + ' name="' + chbName + '" />'
                    ),
                    '<span>', txt, '</span>',
                    '</label>'
                ].join('');
            }
            return txt;
        },
        buildMenuCallback: function(dr, opt) {
            return dr.callback || dr.func || opt.callback || opt.func;
        },
        buildMenuPar: function(dr, opt, chbId) {
            var par = $.extend({
                menu_chb_id: chbId,
                key: dr.key || '',
                val: dr.val,
                action: dr.action || dr.key || '',
                name: dr.name || dr.text || dr.txt
            }, dr.par);

            /*
            if($.isBoolean(dr.checkbox) || $.isObject(dr.checkbox)) {
                par.checkbox = $.extend({
                    checked: false
                }, dr.checkbox);
            }
            */

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
            //数字的宽度相对窄一些，需要加上5像素
            if(/[a-z0-9]/ig.test(txt)) {
                w += 5;
            }
            //宽度加上10像素
            //额外增加2像素
            return w + 10 + 2;
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
            } else if(ev && (ev.type === 'contextmenu' || ['follow', 'mousedown'].indexOf(opt.position) > -1)) {
                //鼠标事件，右键菜单或position位置跟随鼠标
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
                var parentNode = op.parentNode || op.parent;
                if(!$.isElement(parentNode)) {
                    parentNode = document.body;
                }
                box = $.createElement('div', id, function(elem) {
                    elem.className = 'oui-context-menu menu-level-0';
                    elem.level = 0;
                    var cssText = 'left:{x}px;top:{y}px;width:{width}px;height:{height}px;'.format(opt);
                    cssText += opt.radius ? 'border-radius:' + opt.radius + 'px;' : '';
                    cssText += opt.zindex ? 'z-index:' + opt.zindex + ';' : '';
                    elem.style.cssText = cssText;

                    $.disableEvent(elem, 'contextmenu');

                    var items = Factory.buildMenuItems(opt, cache, autoWidth);
                    if(autoWidth && !followSize) {
                        var w = Factory.getMaxWidth(items) + (opt.showIcon ? Config.IconWidth : 0);
                        elem.style.width = w + 'px';
                        opt.width = w;

                        if((opt.x + opt.width) > (bs.width + ss.left)) {
                            opt.x = bs.width + ss.left - opt.width;
                            elem.style.left = (opt.x - 2) + 'px';
                        }
                    }
                    Factory.fillMenuItem(elem, items, opt);
                }, parentNode);

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
            zindex: 99999999,
            //创建的右键菜单容器
            parentNode: null,
            //触发事件，默认为contextmenu（即右键菜单），也可以是 click, mouseover
            event: 'contextmenu', 
            //以下参数作为目标停靠时用
            target: null,   //anchor
            position: 7,
            x: 0,
            y: -1,
            //是否显示图标
            showIcon: false
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
                if(opt.event.toLowerCase() === 'contextmenu') {
                    obj['on' + opt.event] = function(ev) {
                        return Factory.buildContextMenu(ev, that, obj), false;
                    };
                } else {
                    $.addListener(obj, opt.event, function(ev) {
                        return Factory.buildContextMenu(ev, that, obj), false;
                    });
                }
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