

;!function () {
    'use strict';
    
    var Config = {
        FilePath: $.getScriptSelfPath(true),
        //菜单项边距边框尺寸
        ItemMBPWidth: 22,
        ItemMinWidth: 80,
        ItemArrowWidth: 35,
        Index: 1
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
        buildMenu: function(options, isUpdate) {
            var opt = $.extend({
                obj: null
            }, options);

            return new QuickMenu(opt);
        },
        buildQuickMenu: function(opt) {
            var id = 'oui-qmenu-' + opt.id;
            var obj = $I(id);
            if(obj !== null) {
                $.removeElement(obj);
            }
            var box = $.createElement('div', id, function(box) {
                box.className = 'oui-qmenu';
                if($.isString(opt.className, true)) {
                    box.className += ' ' + opt.className;
                }
                var cssText = 'display:none;';
                cssText += opt.radius ? 'border-radius:' + opt.radius + 'px;' : '';
                if($.isString(opt.style, true)) {
                    cssText += opt.style;
                }
                box.style.cssText = cssText;

                if($.isString(opt.html, true)) {
                    box.appendChild(Factory.buildHtml(opt.html));
                } else {
                    box.appendChild(Factory.buildItems(opt.items, opt));
                }
            }, document.body);

            return box;
        },
        buildItems: function(items, opt) {
            var df = document.createDocumentFragment();

            var html = [];
            for(var i = 0; i < items.length; i++) {
                var dr = items[i], elem;
                if(dr === 'sep' || dr.sep || dr.type === 'sep') {
                    elem = $.createElement('div', '', function(elem) {
                        elem.className = 'qmenu-sep';
                    });
                } else {
                    elem = Factory.buildItem(dr, i, opt);
                }
                df.appendChild(elem);
            }
            return df;
        },
        buildItem: function (dr, i, opt) {            
            var elem = $.createElement('div', '', function(elem) {
                elem.className = 'qmenu-item';
                if($.isString(dr)) {
                    dr = { name: dr };
                }
                var txt = dr.name || dr.txt || dr.text,
                    disabled = $.isBoolean(dr.disabled || dr.disable, false);

                if(dr && dr.url) {
                    var target = dr.target ? 'target="' + dr.target + '"' : '';
                    elem.innerHTML = '<a class="qmenu-link" href="{url}" {1} onmouseup="$.cancelBubble();">{2}</a>'.format(dr, target, txt);
                } else {
                    elem.innerHTML = txt;
                    var func = dr.callback || dr.func || opt.callback;
                    if(!disabled && $.isFunction(func)) {
                        $.addListener(elem, 'click', function() {
                            var par = $.extend({ key: dr.key }, dr.param || dr.par);
                            func(par, i);
                        });
                    }
                }
            });

            return elem;
        },
        buildHtml: function(html) {
            var elem = $.createElement('div', '', function(elem) {
                elem.innerHTML = html;
            });
            return elem;
        },
        addItem: function() {

        },
        showMenu: function(ev, btn, obj, position) {
            obj.style.display = '';
            var left = btn.offsetLeft,
                leftL = btn.offsetLeft - obj.offsetWidth,
                leftR = btn.offsetLeft + btn.offsetWidth,
                top = btn.offsetTop,
                topB = btn.offsetTop + btn.offsetHeight,
                topT = btn.offsetTop - btn.offsetHeight;

            var dic = { '1': 'topleft', '2': 'top', '3': 'topright', '4': 'left', '5': 'center', '6': 'right', 
                        '7': 'bottomleft', '8': 'bottom', '9': 'bottomright' };
            var pos = dic['' + position] || position;

            switch(pos.toLowerCase().replace('-', '')) {
                case 'topleft':
                    top = topT;
                    break;
                case 'topcenter':
                case 'top':
                    top = topT;
                    left = btn.offsetLeft + btn.offsetWidth / 2 - obj.offsetWidth / 2;
                    break;
                case 'topright':
                    top = topT;
                    left = btn.offsetLeft + btn.offsetWidth - obj.offsetWidth;
                    break;
                case 'left':
                    left = leftL;
                    top = btn.offsetTop + btn.offsetHeight / 2 - obj.offsetHeight / 2;
                    break;
                case 'lefttop':
                    left = leftL;
                    break;
                case 'leftbottom':
                    left = leftL;
                    top = btn.offsetTop + btn.offsetHeight - obj.offsetHeight;
                    break;
                case 'center':
                    left = btn.offsetLeft + btn.offsetWidth / 2 - obj.offsetWidth / 2;
                    top = btn.offsetTop + btn.offsetHeight / 2 - obj.offsetHeight / 2;
                    break;
                case 'right':
                    left = leftR;
                    top = btn.offsetTop + btn.offsetHeight / 2 - obj.offsetHeight / 2;
                    break;
                case 'righttop':
                    left = leftR;
                    break;
                case 'rightbottom':
                    left = leftR;
                    top = btn.offsetTop + btn.offsetHeight - obj.offsetHeight;
                    break;
                case 'bottomleft':
                    top = topB;
                    break;
                case 'bottomcenter':
                case 'bottom':
                    top = topB;
                    left = btn.offsetLeft + btn.offsetWidth / 2 - obj.offsetWidth / 2;
                    break;
                case 'bottomright':
                    top = topB;
                    left = btn.offsetLeft + btn.offsetWidth - obj.offsetWidth;
                    break;
            }
            obj.style.left = left + 'px';
            obj.style.top = top + 'px';

            return this;
        },
        hideMenu: function(ev, obj, force) {
            if(force || !$.isOnElement(obj, ev)) {
                obj.style.display = 'none';
            }
            return this;
        }
    };

    //先加载样式文件
    Factory.loadCss();

    function QuickMenu(options) {
        var opt = $.extend({
            id: Config.Index++,
            obj: null,
            radius: 5,
            position: 7,
            x: 0,
            y: -1,
            //菜单项
            items: [],
            //HTML内容代替菜单项
            html: '',
            //自定义样式
            style: '',
            className: ''
        }, options);

        this.id = opt.menuId || opt.id;

        this.initial(opt);
    }

    QuickMenu.prototype = {
        initial: function(opt) {
            this.obj = $.toElement(opt.obj);
            this.box = Factory.buildQuickMenu(opt);

            $.qmenu.init(this.obj, this.box, { position: opt.position });
        },
        show: function() {
            if($.isElement(this.box)) {
                this.box.style.display = '';
            }
            return this;
        },
        hide: function() {
            if($.isElement(this.box)) {
                this.box.style.display = 'none';
            }
            return this;
        },
        build: function() {

        },
        update: function() {

        }
    };


    $.extend({
        quickmenu: function(options, isUpdate) {
            return Factory.buildMenu(options, isUpdate);
        }
    });

    $.extend($.quickmenu, {
        init: function (btn, box, options) {
            btn = $.toElement(btn);
            box = $.toElement(box);
            if(!$.isElement(box)) {
                return this;
            }
            btn.style.cursor = 'pointer';
            box.style.position = 'absolute';
            box.style.margin = '0 0 0 0';

            var opt = $.extend({}, options);
            var pos = opt.position || opt.pos;

            $.addListener(btn, 'mouseover', function (event, btn) {
                Factory.showMenu(event, this, box, pos);
            });

            $.addListener(btn, 'mouseout', function (event, btn) {
                Factory.hideMenu(event, box, false);
            });

            $.addListener(box, ['mouseover','mouseout'], function (event, btn) {
                Factory.hideMenu(event, box, false);
            });
            return this;
        },
        hide: function(box) {
            box = $.toElement(box);
            if(!$.isElement(box)) {
                return this;
            }
            box.style.display = 'none';
            return this;
        },
        add: function(items, show) {
            return Factory.addItem(items, null, show, 'add');
        },
        insert: function(items, insertIndex, show) {
            return Factory.addItem(items, insertIndex, show, 'insert');
        },
        sep: function(insertIndex, show) {
            return Factory.addItem({ sep: 1 }, insertIndex, show, 'sep');
        }
    });

    $.extend({
        qmenu: $.quickmenu
    });

}(OUI);