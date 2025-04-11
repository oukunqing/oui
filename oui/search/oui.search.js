
/*
 @Title: OUI.search.js
 @Description：输入框搜索列表插件
 @Author: oukunqing
 @License：MIT
*/

!function ($) {
    'use strict';

    var Config = {
        id: 0,
        caches: {},
        buildKey: function (id) {
            return 'sp_' + (id || Config.id);
        },
        initCache: function (search) {
            var key = Config.buildKey(search.id),
                cache = Config.caches[key];

            if (cache) {
                return this;
            }
            Config.caches[key] = {
                search: search,
                data: null,
            };

            return this;
        },
        setCache: function (search, data) {
            var key = Config.buildKey(search.id),
                cache = Config.caches[key];

            if (cache) {
                cache.data = data;
            }
            return this;
        },
        getCache: function (id) {
            var key = Config.buildKey(id),
                cache = Config.caches[key];
            return cache;
        }
    };

    var Factory = {
        initial: function(id, options) {
            var opt = {id:'', element:''};
            if ($.isElement(id)) {
                $.extend(opt, options, { element: id });
            } else if ($.isString(id, true)) {
                $.extend(opt, options, { element: $.toElement(id) });
            } else if ($.isObject(id) && $.isUndefined(options)) {
                opt = $.extend({}, id);
            } else if ($.isObject(options)) {
                opt = $.extend({}, options);
            }

            var elem = $.toElement(opt.element || opt.id);
            if (!$.isElement(elem)) {
                return null;
            }
            $.extend(opt, { element: elem, id: elem.id });

            var cache = Config.getCache(opt.id);

            elem.setAttribute('data-search-id', opt.id);

            if (cache) {
                return cache.search;
            } else {
                var search = new Search(opt);
                return search;
            }
        },
        buildPanel: function(search, par) {
            var opt = search.options,
                elem = opt.element,
                id = opt.id;

            var div = document.querySelector('div.oui-search-list-panel-' + id);
            if (div) {
                return div;
            }
            div = document.createElement('div');
            div.className = 'oui-search-list-panel oui-search-list-panel-' + id;
            div.style.display = 'none';
            div.innerHTML = [
                '<style type="text/css">',
                '.oui-search-list-panel-', id, '{', 
                'font-size:14px;font-family:Arial,宋体;',
                '}',
                '.oui-search-list-panel-', id, ' ul,.oui-search-list-panel-', id, ' li {', 
                'margin:0;padding:0;list-style:none;',
                '}',
                '.oui-search-list-panel-', id, ' .item {', 
                'height:30px;line-height:28px;border:none;box-sizing:border-box;margin:0 1px; padding:0 10px;cursor:pointer;',
                '}',
                '.oui-search-list-panel-', id, ' .item:hover {background:#f1f1f1;}',
                '</style>',
                '<div class="oui-search-panel-body"></div>'
            ].join('');

            document.body.appendChild(div);

            var body = div.querySelector('div.oui-search-panel-body');
            $.addListener(body, 'click', function(ev) {
                $.cancelBubble(ev);
                Factory.selectItem(ev, search);
            });

            return div;
        },
        showPanel: function(search, show) {
            var opt = search.options,
                elem = opt.element,
                id = opt.id,
                div = document.querySelector('div.oui-search-list-panel-' + id);

            if (!div) {
                return this;
            }
            if (show) {
                var size = $.getOffset(elem),
                    width = opt.width || size.width,
                    maxHeight = opt.height || 500,
                    cssText = [
                        'margin:0;padding:0',
                        'border:solid 1px #ccc',
                        'box-sizing:border-box',
                        'border-bottom-left-radius:5px',
                        'border-bottom-right-radius:5px',
                        'overflow:auto;position:absolute',
                        'width:' + width + 'px',
                        'max-height:' + (maxHeight) + 'px',
                        'left:' + size.left + 'px',
                        'top:' + (size.top + size.height - 1) + 'px'
                    ];

                if (width > size.width) {
                    cssText.push('border-top-right-radius:5px');
                }
                div.style.cssText = cssText.join(';');

                div.style.display = 'block';
            } else {
                div.style.display = 'none';
            }
            return this;
        },
        showList: function(search, data) {
            console.log('showList:', data);
            var opt = search.options,
                elem = opt.element,
                id = opt.id,
                div = document.querySelector('div.oui-search-list-panel-' + id);

            if (!div) {
                return this;
            }

            Config.setCache(search, null);

            var body = div.querySelector('div.oui-search-panel-body');
            if (!data) {
                body.innerHTML = '';
                return this;
            }

            var list = $.isArray(data) ? data : data.list,                
                html = ['<ul>'];

            if (!$.isArray(list)) {                
                return this;
            }

            Config.setCache(search, list);

            var show = $.isFunction(opt.show) ? opt.show : function(dr) {
                return dr.name || dr.text;
            };

            for (var i = 0; i < list.length; i++) {
                var dr = list[i],
                    text = show(dr);

                html.push(['<li class="item" data-idx="', i, '">', text, '</li>'].join(''));
            }

            html.push('</ul>');

            body.innerHTML = html.join('');

            return this;
        },
        selectItem: function (ev, search) {
            var opt = search.options,
                elem = ev.target;

            if (elem.tagName !== 'LI') {
                return this;
            }
            var idx = elem.getAttribute('data-idx').toInt(),
                data = (Config.getCache(search.id) || {}).data;

            if (!data) {
                return this.showPanel(search, false);
            }
            return this.callback(search, data[idx] || {}, elem);
        },
        callback: function(search, dr, item) {
            var opt = search.options, text = '',
                idx = item ? item.getAttribute('data-idx').toInt() : -1;

            if (dr) {
                text = dr.name || dr.text || item.innerText;                
            }

            opt.element.value = text;

            $.setAttribute(opt.element, 'data-search-idx', idx);

            if ($.isFunction(opt.callback)) {
                opt.callback(opt.element, dr, search);
            }
            return this.showPanel(search, false);
        },
        isDisplay: function(search) {
            var opt = search.options,
                div = document.querySelector('div.oui-search-list-panel-' + opt.id);

            if (!div) {
                return false;
            }
            return div.style.display !== 'none';
        },
        clearSelected: function(search) {
            var opt = search.options;
            if (!opt.strict) {
                return this;
            }
            switch(opt.strict) {
            case 1:
                // 如果输入框已经选中了之前搜索出的选项，则可以不清除
                if ((opt.element.getAttribute('data-search-idx') || '').toInt(-1) < 0) {
                    this.callback(search, null, null);
                }
                break;
            case 2:
                // 必须选中当前搜索出的选项，否则就清除
                this.callback(search, null, null);
                break;
            }

            return this;
        },
        hideOther: function(search) {
            var panels = document.querySelectorAll('div.oui-search-list-panel');
            if (!panels || !panels.length) {
                return this;
            }
            for (var i = 0; i < panels.length; i++) {
                panels[i].style.display = 'none';
            }
            return this;
        }
    };

    function Search(options) {
        this.options = $.extend({
            // 3种模式：0-非严格，1-严格，2-非常严格
            strict: 0
        }, options);

        Config.initCache(this);

        this.initial();
    }

    Search.prototype = {
        initial: function() {
            var that = this,
                opt = this.options,
                elem = opt.element,
                get = opt.get || opt.func,
                func = function(data) {
                    Factory.showPanel(that, true).showList(that, data);
                };

            if (!$.isFunction(get)) {
                get = function(elem, resolve) {};
            }

            that.panel = Factory.buildPanel(that, opt);

            $.addListener(document, 'click', function(ev) {
                if (Factory.isDisplay(that)) {
                    Factory.clearSelected(that);
                }
                Factory.showPanel(that, false);
            });
            $.addListener(elem, 'click', function(ev) {
                $.cancelBubble(ev);
                Factory.hideOther(that);
                if (Factory.isDisplay(that)) {
                    Factory.clearSelected(that).showPanel(that, false);
                }
            });

            $.addListener(elem, 'keyup', function(ev) {
                var val = elem.value.trim();
                if (!val) {
                    Factory.showList(that, null).showPanel(that, false);
                    return false;
                }
                /*$.debounce({
                    id: 'oui-search-' + .id,
                    delay: 100,
                    timeout: 5000
                }, function() {
                    new Promise(function (resolve, reject) {
                        get(elem, func);
                    });
                });*/
                new Promise(function (resolve, reject) {
                    get(elem, func);
                });
            });

            return this;
        },
        update: function(data) {
            Factory.showList(this, data);
            return this;
        },
        show: function () {
            Factory.showPanel(this, true);
            return this;
        },
        hide: function () {
            Factory.showPanel(this, false);
            return this;
        }
    };

    $.extend({
        search: function (id, options) {
            return Factory.initial(id, options);
        }
    });

}(OUI);