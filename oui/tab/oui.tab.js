
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
            var ul = $.createElement('ul', '', function(elem) {
                elem.className = 'container';
            }, t.tabs);
            t.container = ul;
        },
        buildTab: function(t, opt) {
            var li = $.createElement('li', '', function(elem) {
                elem.className = 'tab';
                var html = '<a class="close" title="点击关闭标签">×</a><a href="#{id}">{name}</a>'.format(opt);
                console.log($.getContentSize(html));
                var fs = $.getContentSize(html);
                elem.style.width = fs.width + 'px';
                elem.innerHTML = html;
            }, t.tabs);
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
            t.container.appendChild(li);
            var childs = li.childNodes;
            for(var i=0; i<childs.length; i++) {
                if(childs[i].className === 'close') {
                    childs[i].onclick = function() {
                        console.log('tab-close: ', this.innerHTML);
                        t.close(opt.id);
                        $.cancelBubble();
                    };
                } else {
                    childs[i].onclick = function() {
                        console.log('tab: ', this.innerHTML);
                        t.show(opt.id);
                        //$.addClass(this.parentNode, 'cur');
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

            Factory.setCache(t.id, opt.id, li, div);
        },
        delTab: function(t, id) {
            var cache = Factory.getCache(t.id);
            if(cache.tabs[id]) {
                $.removeElement(cache.tabs[id].con);
                $.removeElement(cache.tabs[id].tab);
            }
        }
    },
    Cache = {
        ids: [],
        tabs: {}
    },
    Factory = {
        initCache: function(id) {
            var key = 't_' + id;
            Cache.ids.push({ key: key, id: id });
            Cache.tabs[key] = {
                tabs: {}
            };
        },
        getCache: function(id) {
            var key = 't_' + id;
            return Cache.tabs[key] || null;
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
                if(cache.tabs[tid]) {
                    delete cache.tabs[tid];
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
        this.tabs = tabContainer;
        this.contents = conContainer;

        this.tabs.className = 'oui-tabs';
        this.contents.className = 'oui-tab-contents';

        options = options || { id: '123' };

        this.id = options.id || '';
        this.initial(options);
    }

    Tab.prototype = {
        initial: function(options) {
            Factory.initCache(this.id);
            Util.initialTab(this, options);
            return this;
        },
        add: function(options) {
            Util.buildTab(this, options);
            return this;
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
            return this;
        },
        close: function(id) {
            Util.delTab(this, id);
            Factory.delCache(this.id, id);
            return this;
        },
        closeAll: function() {

            return this;
        }
    };

    function TabPage() {

    }

    TabPage.prototype = {
        
    };

    function Factory() {

    }

    $.extendNative($, { Tab: Tab }, '$');
}(OUI);