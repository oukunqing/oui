
!function(){

    var Config = {
        FilePath: $.getScriptSelfPath(true)
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
        buildSubMenu: function(parent, pos, items, isSub, cfg) {
            var offset = $.getOffset(parent);
            var opt = {
                width: cfg.width,
                height: cfg.height,
                x: offset.width - 5,
                y: -24 - 3
            }, 
            id = parent.id + '-sub',
            obj = $I(id),
            level = parent.level + 1;



            if(obj) {
                return this;
            }

            $.createElement('div', id, function(box) {
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
                        hasChild = $.isArray(dr.items);

                    $.createElement('div', id, function(elem, subItems) {
                        elem.className = 'cmenu-item';
                        elem.menuId = box.menuId;
                        elem.itemId = id;
                        elem.level = level;

                        $.addListener(elem, 'mousedown', function(ev) {
                            $.cancelBubble();
                            return false;
                        });
                        if(hasChild) {
                            txt += '<i class="cmenu-arrow"></i>';
                            $.addListener(elem, 'mouseover', function(ev) {
                                $.cancelBubble();
                                Factory.buildSubMenu(this, $.getEventPosition(ev), subItems, true, cfg);
                            });
                            
                            $.addListener(elem, 'mouseout', function(ev) {
                                $.cancelBubble();
                                var sub = $I(elem.id + '-sub');
                                if(!$.isOnElement(sub, ev)) {
                                    $.removeElement(sub);
                                }
                            });
                            
                        } else {
                            var func = Factory.buildMenuCallback(dr, cfg),
                                par = Factory.buildMenuPar(dr, cfg);
                            if($.isFunction(func)){
                                $.addListener(elem, 'click', function(ev) {
                                    $.cancelBubble();
                                    Factory.hideContextMenu(ev, box.menuId, true);
                                    func(par, this);
                                });
                            }
                        }

                        elem.innerHTML = txt;

                    }, box, false, dr.items);
                }                
            }, parent);
        },
        buildMenuItem: function(dr, menuId, cfg, level) {
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
                    par = Factory.buildMenuPar(dr, cfg);

                elem = $.createElement('div', id, function(elem) {
                    elem.className = 'cmenu-item';
                    elem.menuId = menuId;
                    elem.itemId = id;
                    elem.level = level;

                    $.addListener(elem, 'mousedown', function(ev) {
                        $.cancelBubble();
                        return false;
                    });

                    if(hasChild) {
                        txt += '<i class="cmenu-arrow"></i>';
                        $.addListener(elem, 'mouseover', function(ev) {
                            $.cancelBubble();
                            Factory.buildSubMenu(elem, $.getEventPosition(ev), dr.items, false, cfg, ++level);
                        });
                        
                        $.addListener(elem, 'mouseout', function(ev) {
                            $.cancelBubble();
                            var sub = $I(id + '-sub');
                            if(!$.isOnElement(sub, ev)) {
                                $.removeElement(sub);
                            }
                        });
                        
                    } else {
                        if($.isFunction(func)) {
                            $.addListener(elem, 'click', function(ev) {
                                $.cancelBubble();
                                Factory.hideContextMenu(ev, menuId, true);
                                func(par, this);
                            });
                        }
                    }
                    elem.innerHTML = txt;
                });
                return { type: 'menu', elem: elem, height: 24 };
            }
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
        buildMenuItems: function(opt) {
            console.log('buildMenuItems opt: ', opt);
            var items = [];

            for(var i = 0; i < opt.items.length; i++) {
                var dr = opt.items[i];
                if(dr) {
                    items.push(this.buildMenuItem(dr, opt.id, opt, 0));
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
        fillOptions: function(isInsert, items, opt, insertIndex) {
            if(isInsert) {
                items.splice(insertIndex, 0, opt);
            } else {
                items.push(opt);
            }
            return items;
        },
        buildContextMenu: function(ev, menu) {
            var cache = Factory.getCache(menu.id),
                bs = $.getBodySize(),
                pos = $.getEventPosition(ev), 
                opt = $.extend({
                    width: 240,
                    height: 'auto'
                }, cache.options, pos),
                id = 'oui-context-menu-' + menu.id,
                obj = $I(id);

            if((opt.x + opt.width) > bs.width) {
                opt.x -= (opt.x + opt.width) - bs.width;
            }

            if(obj) {
                obj.style.left = opt.x + 'px';
                obj.style.top = opt.y + 'px';
            } else {
                obj = $.createElement('div', id, function(elem) {
                    elem.className = 'oui-context-menu menu-level-0';
                    elem.level = 0;
                    elem.style.cssText = 'left:{x}px;top:{y}px;width:{width}px;height:{height}px;'.format(opt);
                    $.disableEvent(elem, 'contextmenu');

                    Factory.fillMenuItem(elem, Factory.buildMenuItems(opt), opt);
                }, document.body);
            }
            return obj;
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
            var options = {}, i = 1;
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
            return that.build(options);
        },
        build: function(options) {
            return this;
        },
        insert: function(options, insertIndex, show) {
            options = Factory.checkOptions(options, insertIndex, show);

            var cache = Factory.getCache(this.id),
                isInsert = $.isNumber(insertIndex) && insertIndex >= 0;

            if($.isString(insertIndex, true)) {
                for(var i = 0; i < cache.options.items.length; i++ ) {
                    if(cache.options.items[i].id === insertIndex) {
                        insertIndex = i;
                        isInsert = true;
                        break;
                    }
                }
            }
            if($.isArray(options)) {
                for(var i = 0; i < options.length; i++) {
                    Factory.fillOptions(isInsert, cache.options.items, options[i], insertIndex);
                }
            } else {
                Factory.fillOptions(isInsert, cache.options.items, options, insertIndex);
            }
            return this;
        },
        add: function(options, show) {
            return this.insert(options, null, show);
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

}(OUI);