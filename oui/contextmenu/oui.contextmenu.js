
!function(){

    var Config = {
        FilePath: $.getScriptSelfPath(true)
    },
    Cache = {
        menus: {},
        count: 0
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
                }, options)
            };
            Cache.count += 1;
            return this;
        },
        buildKey: function(id) {
            return 'm_' + id;
        },
        setCache: function(menuId, opt, menu) {
            var cache = this.getCache(menuId);
            if(cache) {
                var itemId = opt.id;
                cache.items[itemId] = {
                    menuId: menuId,
                    itemId: itemId,
                    opt: opt
                };
            }
            return this;
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
        buildMenuItem: function(dr, menuId, callback, param) {
            var elem = null;
            if(dr === 'sep' || dr.sep || dr.type === 'sep') {
                elem = $.createElement('div', '', function(elem) {
                    elem.className = 'cmenu-sep';
                });
                return { type: 'sep', elem: elem, height: 9 };
            } else {
                var func = dr.func || callback, 
                    txt = dr.name || dr.txt || dr.text,
                    elem = $.createElement('div', '', function(elem) {
                        elem.innerHTML = txt;
                        elem.className = 'cmenu-item';
                        if($.isFunction(func)) {
                            elem.par = param;
                            elem.func = func;
                            elem.menuId = menuId;
                            $.addListener(elem, 'click', function(ev) {
                                Factory.hideContextMenu(ev, this.menuId, true);
                                this.func(elem.par, this);
                            });
                        }
                    });
                return { type: 'menu', elem: elem, height: 24 };
            }
        },
        buildMenuItems: function(opt) {
            var items = [],
                callback = opt.callback || opt.func,
                param = opt.param || opt.par;

            for(var i = 0; i < opt.items.length; i++) {
                var dr = opt.items[i];
                if(dr) {
                var par = $.extend({
                    key: dr.key || '',
                    action: dr.action || dr.key || '',
                    name: dr.name || dr.text || dr.txt
                }, dr.par || param);
                    items.push(this.buildMenuItem(dr, opt.id, callback, par));
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
                pos = $.getEventPosition(ev), 
                opt = $.extend({
                    width: 256,
                    height: 'auto'
                }, cache.options, pos),
                id = 'oui-context-menu-' + menu.id,
                obj = $I(id);

            if(obj) {
                obj.innerHTML = con.text;
                obj.style.left = pos.x + 'px';
                obj.style.top = pos.y + 'px';
            } else {
                obj = $.createElement('div', id, function(elem) {
                    elem.className = 'oui-context-menu';
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
                var offset = $.getOffsetSize(obj),
                    pos = $.getEventPosition(ev);
                if(hide
                    || pos.x < offset.left || pos.y < offset.top
                    || pos.x > (offset.left + offset.width)
                    || pos.y > (offset.top + offset.height)) {
                    $.removeElement(obj);
                    Cache.count--;
                    //$.removeListener(document, 'keydown', Factory.escContextMenu);
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