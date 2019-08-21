
/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.tab Tab插件
*/

!function($) {

    var Config = {
        FilePath: $.getScriptSelfPath(true),        
        defaultLongPressTime: 512,    //长按最小时长，单位：毫秒
        defaultLongPressInterval: 40,  //长按滚动间隔，单位：毫秒
    },
    Util = {
        isTrue: function(opt, keys) {
            if(opt) {

            }
        },
        buildSwitch: function(t, opt, dir) {
            var div = $.createElement('div', '', function(elem) {
                elem.className = 'tab-switch tab-switch-' + dir;
                var style = '';
                if(opt.tabHeight) {
                    var height = opt.tabHeight - 2;
                    elem.style.height = height + 'px';
                    style = 'margin-top:' + (height - 12) / 2 + 'px;';
                }
                elem.innerHTML = '<a class="arrow arrow-' + dir + '" style="' + style + '"></a>';
            }, t.tabContainer);
            return div;
        },
        initialTab: function(t, opt) {
            t.left = Util.buildSwitch(t, opt, 'left');
            Util.scrollAction(t, t.left, 'left');

            var div = $.createElement('div', '', function(elem) {
                elem.className = 'tab-box';
                if(opt.style.box) {
                    elem.style.cssText = opt.style.box;
                }
                if(opt.tabHeight) {
                    elem.style.height = (opt.tabHeight - 2) + 'px';
                }
            }, t.tabContainer);
            t.box = div;

            var ul = $.createElement('ul', '', function(elem) {
                elem.className = 'tab-container';
            }, div);
            t.container = ul;

            t.right = Util.buildSwitch(t, opt, 'right');
            Util.scrollAction(t, t.right, 'right');

            return this;
        },
        buildTab: function(t, opt, cfg, insertIndex) {
            var elem = $.createElement('li', '', function(elem) {
                elem.className = 'tab';
                elem.id = cfg.id + '-' + opt.id;
                elem.itemId = opt.id;

                if(cfg.style.tab) {
                    elem.style.cssText = cfg.style.tab;
                }
                var txtStyle = '', closeStyle = '';
                if(cfg.style.txt) {
                    txtStyle = cfg.style.txt;
                }
                if(cfg.tabHeight) {
                    var height = cfg.tabHeight - 2;
                    elem.style.height = height + 'px';
                    closeStyle = 'margin-top:' + parseInt((height - 17) / 2, 10) + 'px;';
                    txtStyle += ';line-height:' + (height) + 'px;';
                }
                var con = '<a class="tab-txt" href="javascript:void(0);" style="{1}">{name}</a>';
                if(opt.closeAble) {
                    con += '<a class="close" title="" style="{2}">×</a>';
                }
                elem.innerHTML = con.format(opt, txtStyle, closeStyle);
                window.setTimeout(function(){
                    var txt = elem.childNodes[0],
                        txtW = $.getOuterSize(txt).width,
                        btn = opt.closeAble ? elem.childNodes[1] : null,
                        btnW = $.getOuterSize(btn).width;

                    if($.isNumber(cfg.maxWidth) && cfg.maxWidth > 60 && (txtW + btnW) > cfg.maxWidth) {
                        var ps = $.getPaddingSize(txt),
                            ms = $.getMarginSize(txt),
                            es = $.getElementSize(elem);
                        elem.style.width = cfg.maxWidth + 'px';
                        txt.style.width = (cfg.maxWidth - ps.width - ms.width - btnW - es.border.width - 2) + 'px';
                        txt.title = $.getInnerText(txt);
                    }
                }, 5);
            });

            if($.isNumber(insertIndex)) {
                t.container.insertBefore(elem, t.container.childNodes[insertIndex]);
            } else if($.isString(insertIndex, true)) {
                var existingItem = document.getElementById(cfg.id + '-' + insertIndex);
                t.container.insertBefore(elem, existingItem);
            } else {
                t.container.appendChild(elem);
            }

            var childs = elem.childNodes;
            for(var i=0; i<childs.length; i++) {
                if(childs[i].className === 'close') {
                    childs[i]['onclick'] = function() {
                        t.close(opt.id);
                        $.cancelBubble();
                    };
                } else {
                    /*
                    childs[i]['on' + cfg.eventName] = function() {
                        t.show(opt.id);
                    };
                    */
                }
            }

            elem['on' + cfg.eventName] = function() {
                t.show(opt.id);
            };

            if(cfg.showContextMenu) {                    
                elem['oncontextmenu'] = function(ev) {
                    $.cancelBubble();
                    Util.buildContextMenu(t, ev, this.itemId);
                    return false;
                };
            }

            var div = $.createElement('div', opt.id, function(elem) {
                elem.className = 'tab-panel';
                var html = '<a class="pos-mark" name="' + opt.id + '"></a>';
                if($.isString(opt.url, true)) {
                    html += '<iframe class="tab-iframe" width="100%" height="' + cfg.conHeight + 'px" src="' + opt.url + '"' +
                        ' frameborder="0" scrolling="auto"></iframe>';
                } else {
                    html += opt.html || '';
                }
                elem.innerHTML = html;
                elem.style.display = 'none';

            }, t.conContainer);

            Factory.setCache(t.id, opt.id, elem, div);
            return this;
        },
        setSize: function(t, func) {
            window.clearTimeout(this.sizeTimer);
            this.sizeTimer = window.setTimeout(function() {
                var ts = $.getInnerSize(t.tabContainer),
                    s = $.elemSize(t.box), 
                    tw = Util.getItemSize(t),
                    als = $.getOuterSize(t.left).width,
                    ars = $.getOuterSize(t.right).width,
                    w = ts.width- s.margin.width - s.padding.width - s.border.width,
                    bw = w - als - ars;

                $('.oui-tabs .tab-switch').each(function(){
                    $(this)[tw < bw ? 'hide' : 'show']();
                });

                var als2 = $.getOuterSize(t.left).width,
                    ars2 = $.getOuterSize(t.right).width,
                    bw2 = w - als2 - ars2;

                if(tw < bw2) {
                    tw = bw2;
                }

                //设置 tab box 宽度
                t.box.style.width = bw2 + 'px';
                t.box.style.left = als2 + 'px';
                //设置 tab 项实际总宽度
                t.container.style.width = tw + 'px';

                if($.isFunction(func)) {
                    func();
                }
            }, 20);
            return this;
        },
        getItemSize: function(t) {
            var w = 0, 
                s = $.elemSize(t.container),
                childs = t.container.childNodes,
                len = childs.length;

            for(var i = len - 1; i >= 0; i--) {
                w += $.getElementSize(childs[i]).outerWidth;
            }
            w += s.padding.width;
            //如果总宽度超出屏幕宽度，则加上滚动条的宽度
            if(w > $.getScreenSize().width) {
                w += 17;
            }
            return w;
        },
        scrollAction: function(t, btn, dir) {
            if(t.getOptions.dblclickScroll) {                
                $.addEventListener(btn, 'dblclick', function () {
                    Util.scrollTo(t, dir, 0, true);
                });
            }
            $.addEventListener(btn, 'mousedown', function () {
                window.clearTimeout(t.timerLongPress);
                t.timerLongPress = window.setTimeout(function () {
                    Util.longPressScroll(t, dir, false);
                }, Config.defaultLongPressTime);

                Util.scrollTo(t, dir);
            });
            
            $.addEventListener(btn, 'mouseup', function () {
                Util.longPressScroll(t, dir, true);
            });
            $.addEventListener(btn, 'mouseout', function () {
                Util.longPressScroll(t, dir, true);
            });
            return this;
        },
        longPressScroll: function(t, dir, isStop) {
            if(isStop) {
                window.clearTimeout(t.timerLongPress);
                window.clearInterval(t.timerLongPress2);
            }
            t.timerLongPress2 = window.setInterval(function () {
                if(isStop || Util.scrollOver(t)) {
                    window.clearInterval(t.timerLongPress2);
                    return false;
                }
                Util.scrollTo(t, dir);
            }, Config.defaultLongPressInterval);
            return this;
        },
        scrollTo: function(t, dir, pos, goto) {
            var distance = 10;
            if($.isNumber(pos)) {
                distance = pos;
            }
            if($.isBoolean(goto, false)) {                
                t.box.scrollLeft = dir === 'left' ? distance : t.container.clientWidth - distance;
                return this;
            }
            return t.box.scrollLeft += (dir === 'left' ? -distance : distance), this;
        },
        scrollOver: function(t) {
            return t.box.scrollLeft <= 0 || t.box.scrollLeft >= t.box.scrollWidth;
        },
        setTabPosition: function(t, item) {
            var bs = $.getInnerSize(t.box),
                ts = $.getOuterSize(item),
                isCenter = t.getOptions().center,
                centerOffset = isCenter ? ts.width / 2 - bs.width / 2 : 0;

            if(item.offsetLeft < t.box.scrollLeft) {
                Util.scrollTo(t, 'left', item.offsetLeft + centerOffset, true);
            } else if((item.offsetLeft + item.offsetWidth - bs.width) > t.box.scrollLeft) {
                Util.scrollTo(t, 'right', item.offsetLeft + item.offsetWidth - bs.width - t.box.scrollLeft - centerOffset);
            }
            return this;
        },
        buildMenuContent: function(t, itemId) {
            var html = [
                '<a class="item disabled"><i class="skey">Ctrl+X</i>关闭当前标签页</a>',
                '<div class="sep"></div>',
                '<a class="item">关闭全部标签页</a>',
                '<a class="item">关闭其他标签页</a>',
                '<a class="item">关闭左侧标签页</a>',
                '<a class="item">关闭右侧标签页</a>',
                '<div class="sep"></div>',
                '<a class="item">重新加载</a>',
                '<a class="item disabled">全部重新加载</a>',
                '<div class="sep"></div>',
                '<a class="item">重新打开关闭的标签页</a>',
                '<a class="item">重新打开关闭的全部标签页</a>'
            ];
            var width = 256, height = 0;
            for(var i = 0; i<html.length; i++) {
                if(html[i].indexOf('<a') === 0) {
                    height += 24;
                } else {
                    height += 9;
                }
            }
            return { text: html.join(''), width: width, height: height + 6 + 2 };
        },
        buildContextMenu: function(t, ev, itemId) {
            var pos = $.getEventPosition(ev), 
                menuId = 'oui-tabs-' + t.id + '-menu',
                obj = $I(menuId),
                con = this.buildMenuContent(t, itemId);

            if(obj) {
                obj.innerHTML = con.text;
                obj.style.left = pos.x + 'px';
                obj.style.top = pos.y + 'px';
            } else {
                obj = $.createElement('div', menuId, function(elem) {
                    elem.className = 'oui-tabs-context-menu';
                    elem.style.cssText = 'z-index:99999999;left:{x}px;top:{y}px;width:{1}px;height:{2}px;'.format(pos, con.width, con.height);
                    elem.innerHTML = con.text;
                }, document.body);
            }

            var childs = obj.childNodes, len = childs.length;
            for(var i = 0; i < len; i++) {
                var item = childs[i];
                if(item.tagName === 'A' && item.className.indexOf('disabled') < 0) {
                    $.addListener(item, 'click', function() {

                        console.log('menu: ', this.innerHTML);

                        Util.hideContextMenu(ev, t, true);
                    });
                }
            }

            return this;
        },
        hideContextMenu: function(ev, t, hide) {
            console.log('hideContextMenu:', ev, t);
            var obj = $I('oui-tabs-' + t.id + '-menu');
            if(obj && hide) {
                $.removeElement(obj);
            }
            return this;
        }
    },
    Cache = {
        count: 0,
        tabs: {},
        cur: null
    },
    Factory = {
        initCache: function(objId, options, obj) {
            var key = this.buildKey(objId);
            Cache.tabs[key] = {
                objId: objId,
                obj: obj,
                options: options,
                items: {}
            };
            Cache.count++;
            return this;
        },
        buildKey: function(objId) {
            return 't_' + objId;
        },
        getCache: function(objId) {
            var key = this.buildKey(objId);
            return Cache.tabs[key] || null;
        },
        getCount: function(cache) {
            return cache ? cache.count : 0;
        },
        getItem: function(cache, idx) {
            if(!cache) {
                return null;
            }
            if(!$.isNumber(idx)) {
                idx = 0;
            }
            var i = 0;
            for(var k in cache.items) {
                if(i++ === idx) {
                    return cache.items[k];
                }
            }
            return null;
        },
        delItem: function(t, itemId) {
            var cache = Factory.getCache(t.id);
            if($.isBoolean(itemId, false)) {
                for(var k in cache.items) {
                    $.removeElement(cache.items[k].con);
                    $.removeElement(cache.items[k].tab);
                }
            } else {
                if(cache.items[itemId]) {
                    $.removeElement(cache.items[itemId].con);
                    $.removeElement(cache.items[itemId].tab);
                }
            }
            return this;
        },
        getLast: function(objId) {
            var cache = this.getCache(objId),
                item = null;
            if(cache) {
                for(var k in cache.items) {
                    item = cache.items[k];
                }
            }
            return item;
        },
        getCur: function() {
            return Cache.cur;
        },
        setCur: function(cur) {
            Cache.cur = cur;
            return this;
        },
        getOptions: function(objId) {
            var key = 't_' + objId;
            var cache = Cache.tabs[key];
            if(cache) {
                return cache.options;
            }
            return null;
        },
        setCache: function(objId, itemId, tab, con) {
            var cache = this.getCache(objId);
            if(null !== cache) {
                cache.items[itemId] = {
                    objId: objId,
                    itemId: itemId,
                    tab: tab,
                    con: con
                };
            }
            return this;
        },
        delCache: function(objId, itemId) {
            var cache = this.getCache(objId);
            if(null !== cache) {
                if($.isBoolean(objId, false)) {
                    for(var k in cache.items) {
                        delete cache.items[k];
                    }
                    Cache.count = 0;
                } else {
                    if(cache.items[itemId]) {
                        delete cache.items[itemId];
                        Cache.count--;
                    }
                }
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
        buildTab: function(tabContainer, conContainer, options) {
            var tab = $.toElement(tabContainer),
                con = $.toElement(conContainer),
                opt = $.extend({
                    id: 'oui-tabs-' + new Date().getMilliseconds(),
                }, options);

            if(!$.isElement(tab) || !$.isElement(con)) {
                console.log('oui.tab: ', '参数输入错误');
                return null;
            }

            var cache = Factory.getCache(opt.id);
            if(!cache) {
                return new Tab(tab, con, opt);
            }
            return cache.obj;
        },
        getObjIds: function(objId, itemId) {
            var opt = {};
            if($.isObject(objId)) {
                opt.objId = objId.objId || objId.tabId;
                if($.isUndefined(itemId)) {
                    opt.itemId = objId.itemId || objId.id;
                }
            } else {
                opt.objId = objId;
                opt.itemId = itemId;
            }
            return opt;
        },
        insert: function(options, insertIndex, show) {
            var opt = this.getObjIds(options),
                cache = this.getCache(opt.objId);
            return cache ? cache.obj.insert(options, insertIndex, show) : null;
        },
        show: function(objId, itemId) {
            var opt = this.getObjIds(objId, itemId),
                cache = this.getCache(opt.objId);
            return cache ? cache.obj.show(opt.itemId, func) : null;
        },
        remove: function(objId, itemId) {
            var opt = this.getObjIds(objId, itemId),
                cache = this.getCache(opt.objId);
            return cache ? ($.isUndefined(itemId) ? cache.obj.closeAll() : cache.obj.close(itemId)) : null;
        }
    };

    //先加载(默认)样式文件
    Factory.loadCss('default');

    function Tab(tabContainer, conContainer, options) {
        var that = this;
        that.tabContainer = tabContainer;
        that.conContainer = conContainer;

        that.tabContainer.className = 'oui-tabs';
        that.conContainer.className = 'oui-tab-contents';

        /*
        var div = $.createElement('div', '', function(elem) {
            elem.className = 'oui-tabs';
        }, tabContainer);
        that.tabContainer = div;
        */
        var opt = $.extend({
            id: 'oui-tabs-' + new Date().getMilliseconds(),
            skin: 'default',    //样式: default, blue
            eventName: 'click',
            dblclickScroll: false,
            showContextMenu: true,
            maxWidth: 240,
            tabHeight: 30,
            conHeight: 400,
            style: {                
                //box: 'margin: 0 5px;',
                //tab: 'margin: 0 5px 0 0;',
                //txt: 'font-size:14px;'
            }
        }, options);

        that.id = opt.id || '';

        if (opt.skin !== 'default') {
            /*
            Factory.loadCss(opt.skin, function () {
                that.initial(opt);
            });
            */
            Factory.loadCss(opt.skin);
        }
        that.initial(opt);
    }

    Tab.prototype = {
        initial: function(options) {
            var that = this;
            Factory.initCache(that.id, options, that);
            Util.initialTab(that, options);
            $.addListener(window, 'resize', function() {
                Util.setSize(that);
            });
            $.addListener(document, 'mousedown', function(ev) {
                Util.hideContextMenu(ev, that);
            });
            return that;
        },
        getOptions: function() {
            return Factory.getOptions(this.id);
        },
        add: function(options, show) {
            return this.insert(options, null, show);
        },
        insert: function(options, insertIndex, show) {
            var that = this,
                cfg = that.getOptions(),
                opt = $.extend({
                    closeAble: true
                }, options);

            Util.buildTab(that, opt, that.getOptions(), insertIndex)
                .setSize(that, function() {
                    if($.isBoolean(show, false)) {
                        that.show(opt.id);
                    }
                });

            if($.isFunction(opt.func)) {
                opt.func(opt, that);
            } else if($.isFunction(cfg.callback)) {
                cfg.callback(opt, that);
            }

            return that;
        },
        show: function(itemId, func) {
            var that = this,
                cfg = that.getOptions(),
                cache = Factory.getCache(that.id);
            if(null === cache) {
                return that;
            }
            for(var k in cache.items) {
                $.removeClass(cache.items[k].tab, 'cur');
                $(cache.items[k].con).hide();
            }
            var cur = cache.items[itemId] 
                || (Factory.getCount(cache) === 1 ? Factory.getItem(cache) : null) 
                || Factory.getCur();

            if(cur) {
                $.addClass(cur.tab, 'cur');
                $(cur.con).show();
                Factory.setCur(cur);
                Util.setTabPosition(that, cur.tab);
            }

            Util.setSize(that);

            if($.isFunction(func)) {
                func(itemId, that);
            } else if($.isFunction(cfg.callback)) {
                cfg.callback(itemId, that);
            }

            return that;
        },
        close: function(itemId) {
            var that = this,
                cur = Factory.getCur(),
                change = false,
                newId = '';

            Factory.delItem(that, itemId).delCache(that.id, itemId);

            if(cur) {
                //关闭当前页，需要重新设置一个新的当前页
                if(itemId === cur.itemId) {
                    change = true;
                    var item = Factory.setCur(null).getLast(that.id);
                    if(item) {
                        newId = item.itemId;
                    }
                }
            }

            if(change) {
                that.show(newId);
            } else {
                Util.setSize(that);
            }
            return that;
        },
        closeAll: function() {
            var that = this;
            Factory.delItem(that, true).delCache(that.id).setCur(null);
            Util.setSize(that);
            return that;
        }
    };

    function TabPage() {

    }

    TabPage.prototype = {
        
    };

    $.extend({
        tab: function(tabContainer, conContainer, options) {
            return Factory.buildTab(tabContainer, conContainer, options);
        }
    });

    $.extend($.tab, {
        add: function(options, show) {
            return Factory.insert(options, null, show);
        },
        insert: function(options, insertIndex, show) {
            return Factory.insert(options, insertIndex, show);
        },
        show: function(objId, itemId, func) {
            return Factory.show(objId, itemId, func);
        },
        remove: function(objId, itemId) {
            return Factory.remove(objId, itemId);
        },
        close: function(objId, itemId) {
            return Factory.remove(objId, itemId);
        },
        closeAll: function(objId) {
            return Factory.remove(objId);
        }
    });
}(OUI);