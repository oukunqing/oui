
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
            return 'sp_' + (opt.id || Config.id);
        },
        initCache: function (opt, panel) {
            if (!opt.id) {
                Config.id += 1;
            }
            return this;
        },
        setCache: function (opt, par) {
            var key = Config.buildKey(opt),
                cache = Config.caches[key];
            if (cache) {
                $.extend(cache, par);
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
            var opt = {}, elem;
            if ($.isObject(id) && $.isUndefined(options)) {
                opt = id;
            } else if ($.isObject(options)) {
                opt = $.extend({}, options);
                elem = $.toElement(id);
            }
            if (!elem) {                
                elem = $.toElement(opt.element || opt.id);
            }
            if (!$.isElement(elem)) {
                return null;
            }
            var cache = Config.getCache()

            if (!elem.id) {
                elem.setAttribute('data-search-id', Config.id++);
            }

            console.log('elem:', elem);
        }
    };

    function Search(options) {
        this.options = $.extend({}, options);

        this.initial();
    }

    Search.prototype = {
        initial: function() {

            return this;
        },
        show: function () {

            return this;
        },
        hide: function () {

            return this;
        }
    };

    $.extend({
        search: function (id, options) {
            return Factory.initial(id, options);
        }
    });

}(OUI);