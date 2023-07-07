
/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.timeplan 时间计划表插件
*/

!function($) {
    'use strict';

    var Config = {
        FilePath: $.getScriptSelfPath(true),
        DefaultSkin: 'default',
        IsDefaultSkin: function(skin) {
            return (!$.isUndefined(skin) ? skin : Config.GetSkin()) === Config.DefaultSkin;
        },
        Skin: '',
        GetSkin: function() {
            if(!Config.Skin) {
                Config.Skin = Config.FilePath.getQueryString('skin') || Config.DefaultSkin;
            }
            return Config.Skin;
        }
    },
    Util = {
        checkOptions: function(options) {
            var opt = $.extend({}, options);

            return opt;
        },
        buildId: function(dr, opt) {
            return 'oui-menu-' + opt.id + '-' + (dr.id || dr.key);
        },
        buildOptions: function(len) {
            var html = [];
            for (var i = 0; i < len; i++) {
                var num = i.padLeft(2, '0');
                html.push('<option value="{0}">{0}</option>'.format(num));
            }
            return html.join('');
        },
        createItem: function(opt, i) {
            var li = document.createElement('LI');
            li.className = 'item item-' + i + ' disabled';

            if(opt.style.item) {
                li.style.cssText = opt.style.item;
            }

            li.innerHTML = [
                '<label class="chb-label">',
                '<input class="chb cs cs-{0}" type="checkbox" value="', i, '" />',
                '<span>', (i + 1).padLeft(2, '0'),'</span>',
                opt.intervalAble ? '<span>' + (opt.name || '') + '间隔</span>' : '',
                '</label>',
                opt.intervalAble ? [
                    '<input type="text" class="form-control vs vs-{0} interval" disabled="disabled" />',
                    '<span style="margin-right:10px;">分钟</span>'
                ].join('') : '',
                '<select class="form-control ts ts-{0}" disabled="disabled">', Util.buildOptions(24), '</select>',
                '<i>:</i>',
                '<select class="form-control ts ts-{0}" disabled="disabled">', Util.buildOptions(60), '</select>',
                '<i class="sep">-</i>',
                '<select class="form-control ts ts-{0}" disabled="disabled">', Util.buildOptions(24), '</select>',
                '<i>:</i>',
                '<select class="form-control ts ts-{0}" disabled="disabled">', Util.buildOptions(60), '</select>',
            ].join('').format(i);

            return li;
        },
        setEvent: function(container, item, opt) {
            var callback = opt.callback;
            var chb = item.querySelectorAll('.chb')[0];
            $.addListener(chb, 'click', function() {
                Util.setStatus(container, this.value, this.checked);
            });
        },
        setStatus: function(container, idx, checked) {
            var cs = container.querySelectorAll('.cs-' + idx),
                vs = container.querySelectorAll('.vs-' + idx),
                ts = container.querySelectorAll('.ts-' + idx),
                li = container.querySelectorAll('.item-' + idx);

            if(!li || li.length <= 0) {
                return this;
            }
            checked ? $.removeClass(li[0], 'disabled') : $.addClass(li[0], 'disabled');
            cs[0].checked = checked;
            if (checked) {
                vs[0] ? vs[0].disabled = false : null;
                for(var i = 0; i < ts.length; i++){
                    ts[i].disabled = false;
                }
            } else {
                vs[0] ? vs[0].disabled = true : null;
                for(var i = 0; i < ts.length; i++){
                    ts[i].disabled = true;
                }
            }
            return this;
        },
        setValue: function(container, idx, dr) {
            var cs = container.querySelectorAll('.cs-' + idx),
                vs = container.querySelectorAll('.vs-' + idx),
                ts = container.querySelectorAll('.ts-' + idx),
                li = container.querySelectorAll('.item-' + idx);

            if(!cs || cs.length <= 0 || !ts || ts.length <= 0) {
                return this;
            }

            if(!$.isBoolean(dr, true)) {
                $.addClass(li[0], 'disabled');
                cs[0].checked = false;
                if (vs[0]) {
                    vs[0].value = '';
                    vs[0].disabled = true;
                }
                for(var i = 0; i < ts.length; i++) {
                    ts[i].value = '00';
                    ts[i].disabled = true;
                }
                return this;
            }

            $.removeClass(li[0], 'disabled');
            cs[0].checked = true;
            if (vs[0]) {
                vs[0].value = dr.interval || dr.val;
                vs[0].disabled = false;
            }
            for(var i = 0; i < ts.length; i++) {
                var s1 = dr.start.padLeft(4, '0'),
                    s2 = dr.end.padLeft(4, '0'),
                    values = [
                        s1.substr(0, 2), 
                        s1.substr(2, 2),
                        s2.substr(0, 2),
                        s2.substr(2, 2)
                    ];
                ts[i].value = values[i] || '00';
                ts[i].disabled = false;
            }
            return this;
        },
        getValue: function(container, idx) {
            var list = [], postfix = idx >= 0 ? '-' + idx : '',
                cs = container.querySelectorAll('.cs' + postfix),
                vs = container.querySelectorAll('.vs' + postfix),
                ts = container.querySelectorAll('.ts' + postfix),
                hasVal = vs && vs.length > 0,
                step = 4,
                pos = 0;

            for (var i = 0; i < cs.length; i++) {
                if (cs[i].checked) {
                    var dr = {};
                    dr.num = idx >= 0 ? idx : i;
                    if (hasVal) {
                        dr.interval = vs[i].value.toInt();
                    }
                    pos = i * step;
                    var start = ts[pos + 0].value + ts[pos + 1].value.padLeft(2, '0'),
                        end = ts[pos + 2].value + ts[pos + 3].value.padLeft(2, '0');


                    dr.start = start.toInt();
                    dr.end = end.toInt();
                    list.push(dr);
                }
            }
            return list;
        },
        checkValue: function(list, opt) {
            var data = { result: true },
                len = list.length;

            for (var i = 0; i < len; i++) {
                var x = list[i], xi = x.num || i;
                if (x.start === x.end) {
                    data.result = false;
                    data.index = xi;
                    data.msg = '第' + (xi + 1) + '组时间范围设置错误';
                    return data;
                }
                if(opt.intervalAble) {
                    data.result = false;
                    data.index = xi;
                    if (x.interval <= 0) {
                        data.msg = '请输入第' + (xi + 1) + '组时间的' + opt.name + '间隔';
                        return data;
                    } else if (x.interval < opt.minInterval) {
                        data.msg = opt.name + '间隔不能小于' + opt.minInterval + '分钟';
                        return data;
                    } else if(x.interval > opt.maxInterval) {
                        data.msg = opt.name + '间隔不能超过' + opt.maxInterval + '分钟';
                        return data;
                    }
                    delete data.index;
                    data.result = true;
                }
                for (var j = 0; j < len; j++) {
                    var y = list[j], yi = y.num || j;
                    if (i === j || x.num === y.num) {
                        continue;
                    }
                    if ((y.start >= x.start && y.start <= x.end) || 
                        (y.end >= x.start && y.end <= x.end)) {
                        data.result = false;
                        data.indexs = [xi, yi];
                        data.msg = '第' + (xi + 1) + '组时间与第' + (yi + 1) + '组时间有交叉重叠';
                        return data;
                    }
                }
            }
            data.list = list;

            return data;
        }
    },
    Cache = {
        plans: {},
        count: 0,
        index: 0
    },
    Factory = {
        initCache: function(objId, options, obj) {
            var key = this.buildKey(objId);
            Cache.plans[key] = {
                objId: objId,
                obj: obj,
                options: options,
                items: {},
                ids: [],
                closeItems: {},
                closeIds: [],
                cur: null
            };
            Cache.count += 1;
            return this;
        },
        buildKey: function(objId) {
            return 't_' + objId;
        },
        setCache: function(objId, opt, menu, con, iframe) {
            var cache = this.getCache(objId);
            if(cache) {
                var itemId = opt.id;
                cache.items[itemId] = {
                    objId: objId,
                    itemId: itemId,
                    closeAble: opt.closeAble,
                    iframe: iframe,
                    opt: opt,
                    menu: menu,
                    con: con
                };
                cache.ids.push(itemId);
                this.setClosedItem(cache, itemId, opt, true);
            }
            return this;
        },
        getCache: function(objId) {
            var key = this.buildKey(objId);
            return Cache.plans[key] || null;
        },
        buildPlan: function(container, options) {
            var box = $.toElement(container);
            if(!$.isElement(box)) {
                console.log('oui.timeplan: ', '参数输入错误');
                return null;
            }
            var par = $.extend({}, options),
                id = 'oui-timeplan-' + (par.id || box.id || Cache.index++),
                opt = $.extend({}, options, {id: id}),
                cache = Factory.getCache(opt.id);

            if(!cache) {
                return new TimePlan(box, opt);
            }
            return cache.obj;
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
    };

    //先加载(默认)样式文件
    Factory.loadCss(Config.DefaultSkin);
    //加载指定的(默认)样式文件
    if(!Config.IsDefaultSkin()) {
        Factory.loadCss(Config.GetSkin());
    }

    function TimePlan (container, options) {
        var that = this;
        that.container = $.toElement(container);
        if(!$.isElement(that.container)) {
            return false;
        }

        var cfg = {
            id: 'oui-timeplan',
            name: '',
            skin: Config.DefaultSkin,       //样式: default, blue
            maxCount: 12,
            curCount: 4,
            intervalAble: false,
            minInterval: 5,
            maxInterval: 1440,
            style: {  
                //item: 'margin: 5px 25px 10px 0;',
            },
            callback: function(par) {
                console.log(par);
            }
        }, opt = Util.checkOptions(options);

        $.extend(cfg.style, opt.style);
        //再删除参数中的style，防止参数覆盖
        delete opt.style;

        that.options = $.extend(cfg, opt);
        that.id = that.options.id || '';
        that.items = {};

        that.initial(that.options);
    }

    TimePlan.prototype = {
        initial: function(opt) {
            var that = this, cssTab = '';

            Factory.initCache(that.id, opt, that);

            $.addClass(that.container, 'oui-timeplan' + cssTab);

            that.box = $.createElement('UL', '', function(elem) {
                var frm = new DocumentFragment();
                for (var i = 0; i < opt.curCount; i++) {
                    var item = Util.createItem(opt, i);
                    frm.appendChild(item);
                    Util.setEvent(that.container, item, opt);
                }
                elem.appendChild(frm);
            }, that.container);

            return this;
        },
        status: function(idx, count, checked) {
            if ($.isBoolean(count) && $.isUndefined(checked)) {
                checked = count;
                count = null;
            }
            if ($.isUndefined(checked)) {
                checked = true;
            }
            var that = this;
            if (count && count > 0) {
                for(var i = 0; i < count; i++) {
                    Util.setStatus(that.container, i, checked);
                }
            } else {
                Util.setStatus(that.container, idx, checked);
            }
            return that;
        },
        clear: function (idx) {
            var that = this,
                count = that.container.querySelectorAll('.cs').length;
            if (!$.isNumber(idx)) {
                idx = 0;
            }
            Util.setValue(that.container, idx, false);
            if (count > 0) {
                for (var i = idx + 1; i < count - idx; i++) {
                    Util.setValue(that.container, i, false);
                }
            }
            return that;
        },
        set: function(par) {
            var that = this;

            if (!$.isArray(par)) {
                par = [par];
            }

            for (var i = 0; i < par.length; i++) {
                var dr = par[i];
                Util.setValue(that.container, i, dr);
            }
            return that;
        },
        setValue: function(par) {
            return this.set(par);
        },
        get: function(idx) {
            var that = this;
            var list = Util.getValue(that.container, idx),
                check = Util.checkValue(list, this.options);

            if (!check.result) {
                return check;
            }
            return { result: true, list: list };
        },
        getValue: function(idx) {
            return this.get(idx);
        },
        checkValue: function(list) {
            return Util.checkValue(list, this.options);
        },
        add: function(count) {
            var that = this,
                opt = that.options,
                idx = that.container.querySelectorAll('.cs').length;

            if (!$.isNumber(count)) {
                count = 1;
            }

            if (idx + count > opt.maxCount) {
                count = opt.maxCount - idx;
            }

            for (var i = 0; i < count; i++) {
                var item = Util.createItem(opt, idx + i);
                that.container.appendChild(item);
                Util.setEvent(that.container, item, opt);
            }
            return that;
        }
    };

    $.extend({
        timeplan: function(container, options) {
            return Factory.buildPlan(container, options);
        }
    });
}(OUI);