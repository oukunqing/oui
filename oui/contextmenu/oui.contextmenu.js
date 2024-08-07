
/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.contextmenu 右键菜单插件
*/

; !function () {
    'use strict';

    var SelfPath = $.getScriptSelfPath(true);
    var Config = {
        FilePath: SelfPath,
        FileName: 'oui.contextmenu.',
        FileDir: $.getFilePath(SelfPath),
        //菜单项边距边框尺寸
        ItemMBPWidth: 22,
        ItemMinWidth: 100,
        ItemArrowWidth: 25,
        ItemHeight: 28,    //右键菜单项高度，单位：像素
        IconWidth: 20,      //Icon图标最大尺寸
        IconBoxWidth: 25,
        ItemPaddingHeight: 4,
        MenuBorderHeight: 2
    },
        Cache = {
            menus: {},
            checks: {},
            count: 0,
            itemId: 1
        },
        Factory = {
            loadCss: function (skin, func) {
                $.loadJsScriptCss(Config.FilePath, skin, func, Config.FileName);
                return this;
            },
            checkItemOptions: function () {
                var options = {}, i = 0;
                if (arguments.length > 1 && $.isString(arguments[0], true)) {
                    while (i++ < arguments.length) {
                        if ($.isFunction(arguments[i])) {
                            options = { name: arguments[0], func: arguments[i] };
                            break;
                        }
                    }
                    return options;
                }
                return arguments[0];
            },
            checkOptions: function (options) {
                var items = [];
                if ($.isArray(options)) {
                    items = options;
                } else if ($.isArray(options.items)) {
                    items = options.items;
                } else if ($.isObject(options.items)) {
                    items = [options.items];
                } else if (options.name) {
                    items = [options];
                }
                return $.extend(options, { items: items });
            },
            initCache: function (menu, options, obj, isUpdate) {
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
                if (!isUpdate) {
                    Cache.count += 1;
                }
                return this;
            },
            updateCache: function (menuId, options) {
                var cache = this.getCache(menuId);
                if (!cache) {
                    return this;
                }
                options = Factory.checkOptions(options);
                cache.options = $.extend({
                    items: []
                }, options);
                return this;
            },
            updateItem: function(menuId, items, del) {
                var cache = this.getCache(menuId);
                if (!cache) {
                    return this;
                }
                if (!$.isArray(items)) {
                    items = [items];
                }
                for (var i = 0; i < items.length; i++) {
                    var exist = false;
                    for (var j = 0; j < cache.options.items.length; j++) {
                        var dr = cache.options.items[j];
                        if (items[i].key === dr.key) {
                            if (del) {
                                delete cache.options.items[j];
                            } else {
                                $.extend(dr, items[i]);
                            }
                            exist = true;
                            break;
                        }
                    }
                    if (!exist && !del) {
                        cache.options.items.push(items[i]);
                    }
                }

                return this;
            },
            updateChecked: function (menuId, chbId, checked) {
                var key = this.buildKey(menuId),
                    cache = Cache.checks[key];
                if (!cache) {
                    Cache.checks[key] = {};
                }
                Cache.checks[key][chbId] = { checked: checked };
                return this;
            },
            getChecked: function (menuId, chbId) {
                var key = this.buildKey(menuId);
                var cache = Cache.checks[key];
                if (cache && cache[chbId]) {
                    return cache[chbId].checked;
                }
                return null;
            },
            clearChecked: function (menuId) {
                var key = this.buildKey(menuId),
                    cache = Cache.checks[key];
                if (!cache) {
                    Cache.checks[key] = null;
                }
                return this;
            },
            buildMenuId: function (menuId) {
                return 'oui-context-menu-' + menuId;
            },
            buildItemId: function (menuId) {
                return 'cmenu-' + menuId + '-' + (Cache.itemId++);
            },
            buildKey: function (id) {
                return 'm_' + id;
            },
            buildChbId: function (menuId, id) {
                return 'cmenu-chb-' + menuId + '-' + id;
            },
            getCache: function (menuId) {
                var key = this.buildKey(menuId);
                return Cache.menus[key] || null;
            },
            buildMenu: function (options, isUpdate) {
                options.showIcon = $.getParam(options, ['showIcon', 'icon']);

                var opt = $.extend({
                    id: 'oui-menu',
                    obj: null
                }, options);

                opt.target = $.toElement(opt.target || opt.anchor);
                opt.position = opt.position || opt.pos;
                opt.par = $.extend({}, opt.param || opt.par);

                if (opt.id === 'oui-menu' && $.isElement(opt.obj)) {
                    opt.id = 'oui-menu-' + opt.obj.id;
                }

                var cache = this.getCache(opt.menuId || opt.id), menu;
                if (!cache) {
                    menu = new ContextMenu(opt);
                } else {
                    menu = cache.menu;
                    $.console.log('opt:', opt, menu.opt);
                    
                    if (isUpdate) {
                        menu.update(options);
                    }
                }
                return menu;
            },
            addItem: function (items, insertIndex, show, action) {
                var opt = $.extend({ menuId: '' }, items);
                if (!opt.menuId) {
                    return this;
                }
                if (!opt.id) {
                    opt.id = opt.menuId;
                }
                var menu = Factory.buildMenu(opt);
                switch (action) {
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
            removeMenu: function (menuId) {
                return Factory.hideContextMenu(null, menuId, true);
            },
            closeOpenedBox: function (cache, level) {
                var boxs = cache.boxs || [], c = boxs.length;
                boxs.sort(function (a, b) {
                    return b.level - a.level
                });
                for (var i = c - 1; i >= 0; i--) {
                    var b = boxs[i];
                    if (b.level > level) {
                        $.removeElement(b.box);
                        cache.boxs.splice(i, 1);
                        $.removeClass(b.item, 'cur');
                    }
                }
                return this;
            },
            checkCondition: function (condition) {
                if ($.isFunction(condition)) {
                    return condition();
                }
                if ($.isBoolean(condition)) {
                    return condition;
                }
                if ($.isNumber(condition)) {
                    return condition !== 0;
                }
                return !$.isFunction(condition);
            },
            buildSubMenu: function (parent, pos, items, isSub, cfg, cache, autoWidth, menu) {
                var offset = $.getOffset(parent);
                var opt = {
                    width: cfg.width,
                    height: cfg.height,
                    x: offset.width - 5,
                    y: -Config.ItemHeight - Config.ItemPaddingHeight
                },
                    bs = $.getBodySize(),
                    ss = $.getScrollPosition(),
                    id = parent.id + '-sub',
                    obj = $I(id),
                    level = parent.level + 1;

                if (autoWidth) {
                    opt.width = Factory.getMaxWidth(items) + (cfg.showIcon ? Config.IconBoxWidth : 0);
                }

                if (obj) {
                    return this;
                }

                Factory.closeOpenedBox(cache, parent.level);

                if ((offset.left + opt.x + opt.width - ss.left + 2) > (bs.width)) {
                    opt.x = 5 - opt.width;
                }

                var box = $.createElement('div', id, function (box) {
                    box.className = 'oui-context-menu menu-level-' + level;
                    box.menuId = parent.menuId;
                    box.itemId = Factory.buildItemId(parent.menuId);
                    box.level = level;
                    var cssText = 'left:{x}px;width:{width}px;height:{height}px;margin-top:{y}px;'.format(opt);
                    cssText += cfg.radius ? 'border-radius:' + cfg.radius + 'px;' : '';
                    box.style.cssText = cssText;
                    $.disableEvent(box, 'contextmenu');

                    for (var i = 0; i < items.length; i++) {
                        var dr = items[i];
                        if (dr === 'sep' || dr.sep || dr.type === 'sep') {
                            $.createElement('div', '', function (elem) {
                                elem.className = 'cmenu-sep';
                            }, box);
                        } else if (Factory.checkCondition(dr.condition)) {
                            var itemId = Factory.buildItemId(box.menuId),
                                chbId = Factory.buildChbId(box.menuId, dr.key),
                                checkbox = Factory.buildCheckBox(dr, '', menu.id, chbId),
                                txt = dr.name || dr.txt || dr.text,
                                hasChild = $.isArray(dr.items),
                                disabled = $.isBoolean(dr.disabled || dr.disable, false);

                            $.createElement('div', itemId, function (elem, param) {
                                elem.className = 'cmenu-item' + (disabled ? ' cmenu-disabled' : '');
                                elem.menuId = box.menuId;
                                elem.itemId = itemId;
                                elem.chbId = chbId;
                                elem.level = level;
                                elem.data = param.data;

                                if (!disabled) {
                                    $.disableEvent(elem, 'mousedown', $.cancelBubble);
                                    $.addListener(elem, 'mouseover', function (ev) {
                                        $.cancelBubble();
                                        if (param.hasChild) {
                                            $.addClass(elem, 'cur');
                                            Factory.buildSubMenu(this, $.getEventPosition(ev), param.items, true, cfg, cache, autoWidth, menu);
                                        } else {
                                            Factory.closeOpenedBox(cache, level);
                                        }
                                    });
                                }

                                txt += Factory.buildMenuIcon(cfg, dr, box.menuId, checkbox, level, menu);

                                if (param.hasChild) {
                                    txt += '<i class="cmenu-arrow"></i>';
                                    if (!dr.node && !dr.leaf) {
                                        elem.innerHTML = txt;
                                        $.addListener(elem, 'mouseup', function (ev) {
                                            $.cancelBubble(ev);
                                        });
                                        return false;
                                    }
                                }
                                var func = Factory.buildMenuCallback(dr, cfg);
                                if (!disabled && $.isFunction(func)) {
                                    $.addListener(elem, 'mouseup', function (ev) {
                                        $.cancelBubble(ev);
                                        var par = Factory.buildMenuPar(elem.data, cfg, elem.chbId);
                                        Factory.setChecked(box.menuId, par).hideContextMenu(ev, box.menuId, true);
                                        func(Factory.dealChecked(par, elem), this, menu);
                                    });
                                } else {
                                    $.addListener(elem, 'mouseup', function (ev) {
                                        $.cancelBubble(ev);
                                    });
                                }
                                elem.innerHTML = Factory.buildMenuText(txt, dr, disabled);
                            }, box, { items: dr.items, hasChild: hasChild, data: dr });
                        }
                    }
                    Factory.setMenuIconWidth(menu);
                }, parent);

                var boxSize = $.elemSize(box);
                if (boxSize.top + boxSize.outerHeight > bs.height + ss.top) {
                    box.style.marginTop = (bs.height + ss.top) - (boxSize.top + boxSize.outerHeight) - Config.ItemPaddingHeight + 'px';
                }

                cache.boxs.push({ box: box, level: level, item: parent });
            },
            buildMenuItem: function (dr, menuId, cfg, level, cache, autoWidth, menu) {
                var elem = null;
                if (dr === 'sep' || dr.sep || dr.type === 'sep') {
                    elem = $.createElement('div', '', function (elem) {
                        elem.className = 'cmenu-sep';
                    });
                    return { type: 'sep', elem: elem, height: Config.ItemPaddingHeight * 2 + 1 };
                } else {
                    if (!Factory.checkCondition(dr.condition)) {
                        return null;
                    }
                    var txt = dr.name || dr.txt || dr.text,
                        hasChild = $.isArray(dr.items),
                        itemId = Factory.buildItemId(menuId),
                        chbId = Factory.buildChbId(menuId, dr.key),
                        func = Factory.buildMenuCallback(dr, cfg),
                        par = Factory.buildMenuPar(dr, cfg, chbId),
                        checkbox = Factory.buildCheckBox(dr, '', menuId, chbId),
                        w = autoWidth ? Factory.getContentWidth(dr) + (checkbox ? Config.IconWidth : 0) : 0,
                        disabled = $.isBoolean(dr.disabled || dr.disable, false);

                    if (!txt) {
                        return null;
                    }
                    elem = $.createElement('div', itemId, function (elem) {
                        elem.className = 'cmenu-item' + (disabled ? ' cmenu-disabled' : '');
                        elem.menuId = menuId;
                        elem.itemId = itemId;
                        elem.chbId = chbId;
                        elem.level = level;

                        if (!disabled) {
                            $.disableEvent(elem, 'mousedown', $.cancelBubble);
                            $.addListener(elem, 'mouseover', function (ev) {
                                $.cancelBubble();
                                if (hasChild) {
                                    $.addClass(elem, 'cur');
                                    Factory.buildSubMenu(elem, $.getEventPosition(ev), dr.items, false, cfg, cache, autoWidth, menu);
                                } else {
                                    Factory.closeOpenedBox(cache, level);
                                }
                            });
                        }

                        txt += Factory.buildMenuIcon(cfg, dr, menuId, checkbox, level, menu);

                        if (hasChild) {
                            txt += '<i class="cmenu-arrow"></i>';
                            if (!dr.node && !dr.leaf) {
                                elem.innerHTML = txt;
                                $.addListener(elem, 'mouseup', function (ev) {
                                    $.cancelBubble(ev);
                                });
                                return false;
                            }
                        }
                        if (!disabled && $.isFunction(func)) {
                            $.addListener(elem, 'mouseup', function (ev) {
                                $.cancelBubble(ev);
                                Factory.setChecked(menuId, par).hideContextMenu(ev, menuId, true);
                                func(Factory.dealChecked(par, elem), this, menu);
                            });
                        } else {
                            $.addListener(elem, 'mouseup', function (ev) {
                                $.cancelBubble(ev);
                            });
                        }
                        elem.innerHTML = Factory.buildMenuText(txt, dr, disabled);
                    });
                    return { type: 'menu', elem: elem, height: Config.ItemHeight + Config.ItemPaddingHeight, width: w };
                }
            },
            dealChecked: function (par, elem) {
                //若checked为字符串，表示是单选，判断ID是否为当前ID
                if ($.isString(par.checked) && par.checked === elem.chbId) {
                    par.checked = true;
                }
                delete par['menu_chb_id'];
                return par;
            },
            setChecked: function (menuId, par) {
                var chbId = Factory.buildChbId(menuId, par.key), chb = $I(chbId), key = chbId;
                if (chb !== null) {
                    var isSingle = chb.type === 'radio';
                    if (chb.type === 'radio') {
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
            buildMenuIcon: function (opt, dr, menuId, checkbox, level, menu) {
                if (!menu.icons) {
                    menu.icons = [];
                    menu.iconidx = 0;
                }
                var iconid = menuId + '-menu-icon' + menu.iconidx++;

                if (!menu.icons[level]) {
                    menu.icons[level] = { ids: [iconid], level: level, con: 0 };
                } else {
                    menu.icons[level].ids.push(iconid);
                }     

                var className = 'menu-icon menu-icon-' + level;
                if (opt.showIcon) {
                    var icon = dr.icon || '', img = dr.img || '', cssText = dr.iconCss || dr.iconStyle || '',
                        id = menuId + '-menu-icon',
                        bg = 'background:url(\'' + icon + '\') no-repeat center;',
                        html = '', con = 1;
                    if (img) {
                        html = '<img id="' + iconid + '" src="' + img + '" class="' + className + '" style="' + cssText + '" />' + checkbox;
                    } else if (icon) {
                        html = '<div id="' + iconid + '" class="' + className + '" style="' + bg + cssText + '"></div>' + checkbox;
                    } else {
                        html = '<div id="' + iconid + '" class="' + className + '" style="' + cssText + '">' + checkbox + '</div>';
                        con = 0;
                    }
                    menu.icons[level].con += con + (!checkbox ? 0 : 1);
                    return html;
                }
                return checkbox;
            },
            setMenuIconWidth: function (menu) {
                if (!menu.icons || !menu.icons.length) {
                    return this;
                }
                for (var i = 0; i < menu.icons.length; i++) {
                    var dr = menu.icons[i];
                    if (!dr.con) {
                        for (var j = 0; j < dr.ids.length; j++) {
                            var icon = document.getElementById(dr.ids[j]);
                            if (icon !== null && icon.className.indexOf('menu-icon-' + dr.level) > -1) {
                                icon.style.width = (Config.IconWidth / 2 - 1) + 'px'
                            }
                        }
                    }
                }
                return this;
            },
            buildCheckBox: function (dr, txt, menuId, chbId) {
                var checkbox = dr.checkbox || dr.radio;
                if (!$.isUndefined(checkbox)) {
                    var chbName = 'rb' + checkbox.name,
                        isSingle = (dr.radio || checkbox.single) || false,
                        key = isSingle ? chbName : chbId,
                        cacheChecked = Factory.getChecked(menuId, key),
                        checked = '';

                    //强制选中指定的选项
                    if (checkbox.checked && checkbox.force) {
                        if (isSingle) {
                            Factory.updateChecked(menuId, key, chbId, true);
                        }
                        checked = ' checked="checked" ';
                    } else if (cacheChecked !== null) {
                        if (isSingle) {
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
            buildMenuText: function (txt, dr, disabled) {
                if (!disabled && dr && dr.url) {
                    var target = dr.target ? 'target="' + dr.target + '"' : '';
                    return '<a class="cmenu-link" href="{url}" {1} onmouseup="$.cancelBubble();">{2}</a>'.format(dr, target, txt);
                }
                return txt;
            },
            buildMenuCallback: function (dr, opt) {
                //return dr.callback || dr.func || opt.callback || opt.func;
                var func = $.getParam(dr, 'callback,function,func');
                if (!$.isFunction(func)) {
                    func = $.getParam(opt, 'callback,function,func');
                }
                return func;
            },
            buildMenuPar: function (dr, opt, chbId) {
                var par = $.extend({
                    menu_chb_id: chbId,
                    key: $.getParam(dr, 'key', ''),
                    val: dr.val,
                    action: $.getParam(dr, 'action,key', ''),
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
            buildMenuItems: function (opt, cache, autoWidth, menu) {
                var items = [];

                for (var i = 0; i < opt.items.length; i++) {
                    var dr = opt.items[i];
                    if (dr) {
                        var item = this.buildMenuItem(dr, opt.id, opt, 0, cache, autoWidth, menu);
                        if (item) {
                            items.push(item);
                        }
                    }
                }                
                return items;
            },
            fillMenuItem: function (box, items, opt, isAppend) {
                var height = 8;
                for (var i in items) {
                    box.appendChild(items[i].elem);
                    height += items[i].height;
                }
                if (!isAppend) {
                    //height + padding + border
                    //height += 8 + 2;
                    //height += Config.ItemPaddingHeight * 2 + 2;
                    height -= Config.MenuBorderHeight;
                    if (!opt.height || opt.height === 'auto' || height > opt.height) {
                        box.style.height = (parseInt(box.style.height, 10) + height) + 'px';
                    }
                } else {
                    box.style.height = (parseInt(box.style.height, 10) + height) + 'px';
                }

                return this;
            },
            pushOption: function (items, opt, insertIndex) {
                var index = Factory.getInsertIndex(items, insertIndex);
                if ($.isNumber(index) && index >= 0) {
                    items.splice(index, 0, opt);
                } else {
                    items.push(opt);
                }
                return this;
            },
            getInsertIndex: function (items, insertIndex) {
                var index = insertIndex;
                if ($.isString(insertIndex, true)) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].key === insertIndex) {
                            index = i;
                            break;
                        }
                    }
                }
                return index;
            },
            dealOption: function (items, opt, pkey, insertIndex) {
                if ($.isString(pkey, true) || $.isNumber(pkey)) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].key === pkey) {
                            if (!$.isArray(items[i].items)) {
                                items[i].items = [];
                            }
                            Factory.pushOption(items[i].items, opt, insertIndex);
                            return this;
                        } else if (items[i].items) {
                            return Factory.dealOption(items[i].items, opt, pkey, insertIndex);
                        }
                    }
                }
                Factory.pushOption(items, opt, insertIndex);
                return this;
            },
            fillOptions: function (items, opt, insertIndex) {
                if (!items || !opt) {
                    return this;
                }
                Factory.dealOption(items, opt, opt.pkey || opt.pid, insertIndex);
                return this;
            },
            getContentWidth: function (dr) {
                var txt = dr.name || dr.text || dr.txt,
                    w = $.getContentSize(txt).width + Config.ItemMBPWidth;
                if ($.isArray(dr.items) && dr.items.length > 0) {
                    w += Config.ItemArrowWidth;
                }
                //字母或数字的文字宽度相对窄一些，需要加上5像素
                if (txt && /[a-z0-9]/ig.test(txt)) {
                    w += 5;
                    //每个大写字母宽度加1
                    w += txt.uppercaseLen();
                } else {
                    w += 10;
                }
                //宽度加上10像素
                //额外增加2像素
                return w + 10 + 2;
            },
            getMaxWidth: function (items, box) {
                var width = 0;
                for (var i = 0; i < items.length; i++) {
                    var dr = items[i], w = 0;
                    if ($.isNumber(dr.width)) {
                        w = dr.width;
                    } else {
                        w = Factory.getContentWidth(dr);
                    }
                    if (w > width) {
                        width = w;
                    }
                }
                if (width < Config.ItemMinWidth) {
                    width = Config.ItemMinWidth;
                }
                return width;
            },
            getMenuPosition: function (ev, obj, bs, ss, opt, ts) {
                var pos = {};
                if (ts) {
                    var x = ts.left + opt.x, y = ts.top + ts.height + opt.y;
                    switch (opt.position) {
                        case 7:
                        default:
                            pos = { x: x, y: y };
                            break;
                        case 9:
                            x = ts.left + ts.width - opt.x;
                            pos = { x: x, y: y, self: true };
                            break;
                    }
                } else if (ev && (ev.type === 'contextmenu' || ['follow', 'mousedown'].indexOf(opt.position) > -1)) {
                    //鼠标事件，右键菜单或position位置跟随鼠标
                    pos = $.getEventPosition(ev);
                } else if ($.isElement(obj)) {
                    var offset = $.getOffset(obj);
                    pos = { x: offset.left + opt.x, y: offset.top + offset.height + opt.y };
                } else {
                    return { x: bs.width / 2 + ss.left, y: bs.height / 2 + ss.top, center: true };
                }
                return pos;
            },
            buildContextMenu: function (ev, menu, obj) {
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
                    id = Factory.buildMenuId(menu.id),
                    box = $I(id),
                    autoWidth = ('' + opt.width).toLowerCase() === 'auto',
                    followSize = isAnchor && op.target.tagName === 'INPUT';

                if (!pos) {
                    return this;
                }

                if (autoWidth && followSize) {
                    opt.width = ts.width;
                } else if (!autoWidth && (opt.x + opt.width) > (bs.width + ss.left)) {
                    opt.x = bs.width + ss.left - opt.width;
                }
                if (box) {
                    box.style.left = opt.x + 'px';
                    box.style.top = opt.y + 'px';
                } else {
                    var parentNode = op.parentNode || op.parent;
                    if (!$.isElement(parentNode)) {
                        parentNode = document.body;
                    }
                    box = $.createElement('div', id, function (elem) {
                        elem.className = 'oui-context-menu menu-level-0';
                        elem.level = 0;
                        var cssText = 'left:{x}px;top:{y}px;width:{width}px;height:{height}px;'.format(opt);
                        cssText += opt.radius ? 'border-radius:' + opt.radius + 'px;' : '';
                        cssText += opt.zindex ? 'z-index:' + opt.zindex + ';' : '';
                        elem.style.cssText = cssText;
                        
                        //设置关联关闭样式
                        elem.className = elem.className.addClass('oui-popup-panel');
                        //设置关联关闭函数 
                        elem.hide = function () {
                            menu.hide();
                        };

                        $.disableEvent(elem, 'contextmenu');

                        var items = Factory.buildMenuItems(opt, cache, autoWidth, menu);
                        if (autoWidth && !followSize) {
                            var w = Factory.getMaxWidth(items) + (opt.showIcon ? Config.IconBoxWidth : 0);
                            elem.style.width = w + 'px';
                            opt.width = w;

                            if ((opt.x + opt.width) > (bs.width + ss.left)) {
                                opt.x = bs.width + ss.left - opt.width;
                                elem.style.left = (opt.x - 2) + 'px';
                            }
                        }
                        Factory.fillMenuItem(elem, items, opt);
                        //如果没有菜单项，不显示菜单DIV框
                        if (items.length <= 0) {
                            elem.style.display = 'none';
                        }
                    }, parentNode);

                    var xs = $.elemSize(box);
                    if (pos.self) {
                        box.style.left = (pos.x - xs.width) + 'px';
                    } else if (pos.center) {
                        box.style.left = (xs.style.left - xs.width / 2) + 'px';
                        box.style.top = (xs.style.top - xs.height / 2) + 'px';
                    }

                    if (xs.top + xs.outerHeight > bs.height + ss.top) {
                        box.style.top = (bs.height + ss.top - xs.outerHeight - 2) + 'px';
                    }
                }
                Factory.setMenuIconWidth(menu);

                var first = !menu.box;
                menu.box = box;

                if ((first || op.always) && $.isFunction(op.complete)) {
                    op.complete(menu, first);
                }

                return box;
            },
            hideContextMenu: function (ev, id, hide) {
                var obj = $I('oui-context-menu-' + id);
                if (obj) {
                    if (null === ev && hide) {
                        //return $.removeElement(obj), Cache.count--, this;
                        return $.removeElement(obj), this;
                    };
                    if (hide || !$.isOnElement(obj, ev)) {
                        $.removeElement(obj);
                        //Cache.count--;
                    }
                }
                return this;
            },
            escContextMenu: function (ev) {
                if ($.getKeyCode(ev) === $.keyCode.Esc) {
                    Factory.hideAllContextMenu();
                }
                return this;
            },
            hideAllContextMenu: function () {
                if (Cache.count > 0) {
                    $('.oui-context-menu').each(function (i, obj) {
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
            //菜单出现的条件
            condition: null,
            x: 0,
            y: -1,
            //是否显示图标
            showIcon: false,
            //是否每次显示菜单都回调complete
            always: false,
            complete: null
        }, options);

        this.id = opt.menuId || opt.id;

        this.initial(opt);
    }

    ContextMenu.prototype = {
        initial: function (opt) {
            var that = this,
                obj = $.toElement(opt.obj);

            Factory.initCache(that, opt, obj);

            if ($.isElement(obj)) {
                if (opt.event.toLowerCase() === 'contextmenu') {
                    obj['on' + opt.event] = function (ev) {
                        if (Factory.checkCondition(opt.condition)) {
                            Factory.buildContextMenu(ev, that, obj);
                        }
                        return false;
                    };
                } else {
                    $.addListener(obj, opt.event, function (ev) {
                        if (Factory.checkCondition(opt.condition)) {
                            Factory.buildContextMenu(ev, that, obj);
                        }
                        return false;
                    });
                }
            }

            $.addListener(document, 'keydown', Factory.escContextMenu)
                .addListener(document, 'mousedown', function (ev) {
                    Factory.hideContextMenu(ev, that.id);
                });

            return that;
        },
        update: function (options, isInitial) {
            Factory.updateCache(this.id, options);
            return this;
        },
        updateItem: function(items, del) {
            Factory.updateItem(this.id, items, del);
            return this;
        },
        show: function (ev) {
            var cache = Factory.getCache(this.id);
            Factory.buildContextMenu(ev, this, cache.obj);
            return this;
        },
        hide: function () {
            return Factory.hideContextMenu(null, this.id, true), this;
        },
        isHide: function() {
            return this.box && this.box.style.display === 'none';
        },
        insert: function (items, insertIndex, show, isAdd) {
            var cache = Factory.getCache(this.id),
                opt = items;

            items = Factory.checkItemOptions(items, insertIndex, show);

            if (typeof insertIndex === 'undefined' || (!isAdd && opt !== items)) {
                insertIndex = 0;
            }
            if ($.isArray(items)) {
                for (var i = 0; i < items.length; i++) {
                    Factory.fillOptions(cache.options.items, items[i], insertIndex);
                }
            } else {
                Factory.fillOptions(cache.options.items, items, insertIndex);
            }
            return this;
        },
        add: function (items, show) {
            return this.insert(items, null, show, true);
        },
        sep: function (insertIndex, show) {
            return this.insert({ sep: 1 }, insertIndex, show);
        },
        remove: function () {
            return Factory.hideContextMenu(null, this.id, true), this;
        }
    };

    $.extend({
        contextmenu: function (options, isUpdate) {
            return Factory.buildMenu(options, isUpdate);
        }
    });

    $.extend($.contextmenu, {
        add: function (items, show) {
            return Factory.addItem(items, null, show, 'add');
        },
        insert: function (items, insertIndex, show) {
            return Factory.addItem(items, insertIndex, show, 'insert');
        },
        sep: function (insertIndex, show) {
            return Factory.addItem({ sep: 1 }, insertIndex, show, 'sep');
        },
        remove: function (menuId) {
            return Factory.removeMenu(menuId);
        },
        close: function (menuId) {
            return Factory.removeMenu(menuId);
        },
        closeAll: function () {
            return Factory.hideAllContextMenu();
        },
        hideParentMenu: function () {
            return Factory.hideAllContextMenu();
        },
        updateItem: function (menuId, items, del) {
            return Factory.updateItem(menuId, items, del);
        }
    });

    $.extend({
        cmenu: $.contextmenu
    });

}(OUI);