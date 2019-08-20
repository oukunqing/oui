
/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.tab Tab插件
*/

!function($) {

    var Config = {
        FilePath: $.getScriptSelfPath(true)
    },
    Util = {
        initialTab: function(t, opt) {
            var left = $.createElement('a', '', function(elem) {
                elem.className = 'tab-switch tab-switch-left';
                elem.innerHTML = 'L';
            }, t.tabContainer);
            t.left = left;

            var div = $.createElement('div', '', function(elem) {
                elem.className = 'tab-box';
            }, t.tabContainer);
            t.box = div;

            var ul = $.createElement('div', '', function(elem) {
                elem.className = 'tab-container';
            }, div);
            t.container = ul;

            var right = $.createElement('a', '', function(elem) {
                elem.className = 'tab-switch tab-switch-right';
                elem.innerHTML = 'R';
            }, t.tabContainer);
            t.right = right;

            return this;
        },
        buildTab: function(t, opt, cfg, insertIndex) {
            var elem = $.createElement('a', '', function(elem) {
                elem.className = 'tab';
                elem.id = cfg.id + '-' + opt.id;
                var con = '<span class="tab-txt" href="#{id}">{name}</span>';
                if(opt.closeAble) {
                    con += '<i class="close" title="">×</i>';
                }
                elem.innerHTML = con.format(opt);
                window.setTimeout(function(){
                    var es = $.getElementSize(elem);
                    if($.isNumber(cfg.maxWidth) && cfg.maxWidth > 60 && es.width > cfg.maxWidth) {
                        var txt = elem.childNodes[0],
                            btn = elem.childNodes[1],
                            ps = $.getPaddingSize(txt),
                            ms = $.getMarginSize(txt),
                            cs = $.getElementSize(btn).outerWidth;

                        elem.style.width = cfg.maxWidth + 'px';
                        txt.style.width = (cfg.maxWidth - ps.width - ms.width - cs - es.border.width) + 'px';
                        console.log('txt size: ', cfg.maxWidth, cfg.maxWidth, ps.width, ms.width, cs, es.border.width)
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

            }, t.contents);

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
            this.sizeTimer = window.setTimeout(function(){
                var s = $.elemSize(t.box);
                //设置 tab box 宽度
                t.box.style.width = (t.tabContainer.clientWidth - s.margin.width - s.padding.width - 32) + 'px';
                //设置 tab 项实际总宽度
                t.container.style.width = Util.getTabSize(t) + 'px';
                console.log(Util.getTabSize(t));
            }, 5);
            return this;
        },
        getTabSize: function(t) {
            var w = 0, 
                s = $.elemSize(t.container),
                childs = t.container.childNodes;
            for(var i = 0; i < childs.length; i++) {
                console.log($.getElementSize(childs[i]));
                w += $.getElementSize(childs[i]).outerWidth;
            }
            return w + s.padding.width;
        },
        scrollTo: function(t) {

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
            maxWidth: 240
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
        add: function(options) {
            return this.insert(options, null);
        },
        insert: function(options, insertIndex) {            
            var opt = $.extend({
                closeAble: true
            }, options);

            Util.buildTab(this, opt, Factory.getOptions(this.id), insertIndex);

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
            if(cache.tabs[id]) {
                $.addClass(cache.tabs[id].tab, 'cur');
                $(cache.tabs[id].con).show();
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
            Factory.delCache(this.id, id);
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