
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
        buildSwitch: function(t, opt, dir) {
            var div = $.createElement('div', '', function(elem) {
                elem.className = 'tab-switch tab-switch-' + dir;
                var style = '';
                if(opt.height) {
                    elem.style.height = opt.height + 'px';
                    style = 'margin-top:' + (opt.height - 12) / 2 + 'px;';
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
                if(opt.height) {
                    elem.style.height = opt.height + 'px';
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
                if(cfg.style.tab) {
                    elem.style.cssText = cfg.style.tab;
                }
                var txtStyle = '', closeStyle = '';
                if(cfg.style.txt) {
                    txtStyle = cfg.style.txt;
                }
                if(cfg.height) {
                    elem.style.height = cfg.height + 'px';
                    closeStyle = 'margin-top:' + parseInt((cfg.height - 17) / 2, 10) + 'px;';
                    txtStyle += ';line-height:' + (cfg.height) + 'px;';
                }
                var con = '<a class="tab-txt" href="#{id}" style="{1}">{name}</a>';
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
            /*
            var a = $.createElement('a', '', function(elem) {
                elem.innerHTML = opt.name;
                elem.href = '#' + opt.id;
                elem.onclick = function() {
                    console.log('tab: ', this.innerHTML);
                    t.show(opt.id);
                };
            }, li);
            */

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
                    childs[i]['on' + cfg.eventName] = function() {
                        t.show(opt.id);
                    };
                }
            }

            var div = $.createElement('div', opt.id, function(elem) {
                elem.className = 'tab-panel';
                var html = '<a class="pos-mark" name="' + opt.id + '"></a>';
                if($.isString(opt.url, true)) {
                    html += '<iframe class="tab-iframe" width="100%" height="400px" src="' + opt.url + '"' +
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
        delTab: function(t, id) {
            var cache = Factory.getCache(t.id);
            if($.isBoolean(id, false)) {
                for(var k in cache.tabs) {
                    $.removeElement(cache.tabs[k].con);
                    $.removeElement(cache.tabs[k].tab);
                }
            } else {
                if(cache.tabs[id]) {
                    $.removeElement(cache.tabs[id].con);
                    $.removeElement(cache.tabs[id].tab);
                }
            }
            return this;
        },
        setSize: function(t) {
            window.clearTimeout(this.sizeTimer);
            this.sizeTimer = window.setTimeout(function() {
                var ts = $.getInnerSize(t.tabContainer),
                    s = $.elemSize(t.box), 
                    tw = Util.getTabSize(t),
                    als = $.getOuterSize(t.left).width,
                    ars = $.getOuterSize(t.right).width,
                    w = ts.width- s.margin.width - s.padding.width - s.border.width,
                    bw = w - als - ars;

                    console.log('als: ', als, ars);

                $('.oui-tabs .tab-switch').each(function(){
                    $(this)[tw < bw ? 'hide' : 'show']();
                })

                var als2 = $.getOuterSize(t.left).width,
                    ars2 = $.getOuterSize(t.right).width,
                    bw2 = w - als2 - ars2;

                if(tw < bw2) {
                    tw = bw2;
                }

                //设置 tab 项实际总宽度
                t.container.style.width = tw + 'px';
                //设置 tab box 宽度
                t.box.style.width = bw2 + 'px';
                t.box.style.left = als2 + 'px';
            }, 20);
            return this;
        },
        getTabSize: function(t) {
            var w = 0, 
                s = $.elemSize(t.container),
                childs = t.container.childNodes,
                len = childs.length;

            console.log('childs: ', childs);

            for(var i = len - 1; i >= 0; i--) {
                w += $.getElementSize(childs[i]).outerWidth;

                console.log('childs w: ', $.getElementSize(childs[i]).outerWidth, w);
            }
            return w + s.padding.width;
        },
        scrollAction: function(t, btn, dir) {
            $.addEventListener(btn, 'dblclick', function () {
                Util.scrollTo(t, dir, 0);
            });
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
        scrollTo: function(t, dir, pos) {
            console.log('scrollTo: ', dir, pos, t.getOptions())
            if($.isNumber(pos)) {
                t.box.scrollLeft = dir === 'left' ? pos : t.container.clientWidth - pos;
                return this;
            }
            return t.box.scrollLeft += (dir === 'left' ? -10 : 10), this;
        },
        scrollOver: function(t) {
            return t.box.scrollLeft <= 0 || t.box.scrollLeft >= t.box.scrollWidth;
        }
    },
    Cache = {
        ids: [],
        tabs: {}
    },
    Factory = {
        initCache: function(id, options) {
            var key = 't_' + id;
            Cache.ids.push({ key: key, id: id });
            Cache.tabs[key] = {
                options: options,
                tabs: {}
            };
        },
        getCache: function(id) {
            var key = 't_' + id;
            return Cache.tabs[key] || null;
        },
        getOptions: function(id) {
            var key = 't_' + id;
            var cache = Cache.tabs[key];
            if(cache) {
                return cache.options;
            }
            return null;
        },
        setCache: function(id, tid, tab, con) {
            var cache = this.getCache(id);
            if(null !== cache) {
                cache.tabs[tid] = {
                    tab: tab,
                    con: con
                };
            }
        },
        delCache: function(id, tid) {
            var cache = this.getCache(id);
            if(null !== cache) {
                if($.isBoolean(id, false)) {
                    for(var k in cache.tabs) {
                        delete cache.tabs[k];
                    }
                } else {
                    if(cache.tabs[tid]) {
                        delete cache.tabs[tid];
                    }
                }
            }
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
        }
    };

    //先加载(默认)样式文件
    Factory.loadCss('default');

    function Tab(tabContainer, conContainer, options) {
        this.tabContainer = tabContainer;
        this.conContainer = conContainer;

        this.tabContainer.className = 'oui-tabs';
        this.conContainer.className = 'oui-tab-contents';

        options = $.extend({
            id: 'oui-tabs-' + new Date().getMilliseconds(),
            eventName: 'click',
            maxWidth: 240,
            style: {
                height: 28
            }
        }, options);

        this.id = options.id || '';        
        this.initial(options);
    }

    Tab.prototype = {
        initial: function(options) {
            Factory.initCache(this.id, options);
            Util.initialTab(this, options);
            return this;
        },
        getOptions: function() {
            return Factory.getOptions(this.id);
        },
        add: function(options) {
            return this.insert(options, null);
        },
        insert: function(options, insertIndex) {            
            var opt = $.extend({
                closeAble: true
            }, options);

            Util.buildTab(this, opt, this.getOptions(), insertIndex);

            return Util.setSize(this), this;
        },
        show: function(id) {
            var cache = Factory.getCache(this.id);
            if(null === cache) {
                return this;
            }
            for(var k in cache.tabs) {
                $.removeClass(cache.tabs[k].tab, 'cur');
                $(cache.tabs[k].con).hide();
            }
            var cur = cache.tabs[id];
            if(cur) {
                $.addClass(cur.tab, 'cur');
                $(cur.con).show();
            }

            return Util.setSize(this), this;
        },
        close: function(id) {
            Util.delTab(this, id);
            Factory.delCache(this.id, id);
            Util.setSize(this);
            return this;
        },
        closeAll: function() {
            Util.delTab(this, true);
            Factory.delCache(this.id);
            Util.setSize(this);
            return this;
        }
    };

    function TabPage() {

    }

    TabPage.prototype = {
        
    };

    $.extendNative($, { Tab: Tab }, '$');

    $.extend({
        tab: function(tabContainer, conContainer, options) {

        }
    });

    $.extend($.tab, {
        add: function() {

        },
        insert: function() {

        },
        remove: function() {

        },
        del: function() {

        }
    });
}(OUI);