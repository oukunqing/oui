
/*
 @Title: OUI.switch.js
 @Description：面板缩放拉伸插件
 @Author: oukunqing
 @License：MIT
*/

!function ($) {
    'use strict';

    var Config = {
        minKeepSize: 150,
        id: 0,
        caches: {},
        buildKey: function (opt) {
            return 'sw_' + (opt.id || Config.id);
        },
        initCache: function (opt, panel) {
            if (!opt.id) {
                Config.id += 1;
            }
            var key = Config.buildKey(opt);
            Config.caches[key] = {
                panel: panel,
                bar: null,
                first: true,
                shade_id: 'oui_switch_shade_body_001',
                switch_shade_id: 'oui_switch_shade_switch_001',
                direction: 'left',  //1-left,2-up,3-right,4-down
                minKeepSize: Config.minKeepSize,
                zindex: 99999999,
                start: 0,
                end: 0,
                value: 0,
                min: 80,
                options: {
                    panel: '',
                    parent: '',
                    switchbox: '',
                    switchbar: '',
                    callback: null,
                    click: null,
                    showValue: true
                },
                box: {
                    w: 0,
                    h: 0
                }
            };
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
        getCache: function (opt) {
            var key = Config.buildKey(opt),
                cache = Config.caches[key];
            return cache;
        }
    };

    var Factory = {
        direction: function(opt) {
            var val, dir = opt.direction || opt.position;
            switch(dir) {
            case 1:
            case 'left':
                val = 'left';
                break;
            case 2:
            case 'up':
                val = 'up';
                break;
            case 3:
            case 'right':
                val = 'right';
                break;
            case 4:
            case 'down':
                val = 'down';
                break;
            default:
                val = 'left';
                break;
            }
            return val;
        },
        horizontal: function(dir) {
            return dir === 'left' || dir === 'right';
        },
        initial: function (options) {
            var that = this;
            if ($.isNullOrUndefined(options)) {
                return that;
            }
            that.elem = $I(options.panel);
            if (that.elem === null) {
                return that;
            }
            Config.initCache(options, that.elem);
            var cache = Config.getCache(options);

            if ($.isFunction(options.callback)) {
                cache.callback = options.callback;
            }
            $.extend(cache.options, options);

            if ($.isNumber(cache.options.min)) {
                cache.min = cache.options.min;
            }
            if ($.isNumber(cache.options.max)) {
                cache.max = cache.options.max;
            }
            cache.direction = this.direction(cache.options);
            cache.horizontal = this.horizontal(cache.direction);
            cache.minKeepSize = cache.options.minKeepSize || Config.minKeepSize;

            cache.value = $('#' + cache.options.panel).width();

            if ($I(cache.options.switchbar) !== null) {
                $('#' + cache.options.switchbar).mousedown(function (ev) {
                    $.cancelBubble(ev);
                });

                $('#' + cache.options.switchbar).click(function () {
                    if ($.isFunction(cache.options.click)) {
                        cache.options.click(that.elem);
                    }
                });
            }

            Factory.mouseDown(cache.options);

            return this;
        },
        showShade: function (cache) {
            var id = cache.shade_id, shade = $I(id);
            var bs = $.getBodySize();
            if (null === shade) {
                $.createElement('div', id, function (elem) {
                    elem.style.cssText = 'background:#000;width:' + bs.width + 'px;height:' + bs.height + 'px;'
                        + 'display:block;position:absolute;top:0;left:0;border:none;margin:0;padding:0;'
                        + 'overflow:hidden;opacity:0;z-index:' + (cache.zindex - 1) + ';'
                        + '-moz-user-select:none;-khtml-user-select:none;user-select:none;-ms-user-select:none;';
                }, $I(cache.options.parent) || document.body);
            } else {
                shade.style.display = 'block';
                shade.style.width = bs.width + 'px';
                shade.style.height = bs.height + 'px';
            }
            var box = $I(cache.options.switchbox),
                bar = $I(cache.switch_shade_id),
                size = $.getOffset(box, false),
                w = size.width,
                h = size.height,
                left = size.left,
                top = size.top;
            if (null === bar) {
                $.createElement('div', cache.switch_shade_id, function (elem) {
                    elem.style.cssText = 'width:' + w + 'px;height:' + h + 'px;'
                        + 'display:block;position:absolute;background:#dfe8f6;border:dotted 1px #99bbe8;color:#999;line-height:1em;'
                        + 'margin:0;padding:0;box-sizing:content-box;font-size:10px;font-family:Arial;word-break:break-all;'
                        + 'left:' + left + 'px;top:' + top + 'px;'
                        + (cache.horizontal ? 'cursor:ew-resize;' : 'cursor:ns-resize;')
                        + 'overflow:hidden;opacity:0.5;z-index:' + cache.zindex + ';text-align:center;vertical-align:middle;'
                        + '-moz-user-select:none;-khtml-user-select:none;user-select:none;-ms-user-select:none;';
                }, $I(cache.options.parent) || document.body);
            } else {
                //bar.className = options.switch_bar || '';
                bar.style.display = 'block';
                bar.style.width = w + 'px';
                bar.style.height = h + 'px';
                if (cache.horizontal) {
                    bar.style.left = left + 'px';
                } else {
                    bar.style.top = top + 'px';
                }
            }

            return this;
        },
        hideShade: function (cache) {
            var id = cache.shade_id, shade = $I(id), bar = $I(cache.switch_shade_id);
            if (null !== shade) {
                shade.style.display = 'none';
                $.removeElement(shade);
            }
            if (null !== bar) {
                bar.style.display = 'none';
                $.removeElement(bar);
            }
            return this;
        },
        showValue: function (cache, val) {
            if (!cache.options.showValue) {
                return this;
            }
            var bar = $I(cache.switch_shade_id);
            if (null !== bar) {
                bar.innerHTML = [
                    '<div style="display:block;overflow:hidden;padding:0;margin:0;border:none;',
                    cache.horizontal ? 'position:absolute;vertical-align:middle;display:table-cell;top:48%;' : 'margin:0 auto;',
                    '">',
                    val,
                    '</div>'
                ].join('');
            }
            return this;
        },
        mouseDown: function (options) {
            var that = this,
                cache = Config.getCache(options),
                id = options.switchbox || options.switch, 
                obj = $I(id);
            if (null === obj) {
                return that;
            }
            $('#' + id).mousedown(function () {
                if (0 === cache.value || !$.isDisplay(options.panel)) {
                    return false;
                }
                cache.bs = $.getBodySize();
                cache.dragStart = true;

                Config.cache = cache;

                Factory.showShade(cache);

                var size = $.getOffset(cache.switch_shade_id, true),
                    offset = $.getOffset(cache.panel),
                    dir = cache.direction,
                    ev = $.getEventPosition();

                cache.size = dir === 'left' || dir === 'right' ? offset.width : offset.height;
                cache.box = { w: size.width, h: size.height };
                cache.start = cache.horizontal ? ev.x : ev.y;
                
                Factory.showValue(cache, cache.start);

                if (cache.first) {
                    $.addListener(document, 'mousemove', Factory.mouseMove);
                    $.addListener($I(cache.switch_shade_id), 'mousemove', Factory.mouseMove);

                    $.addListener(document, 'mouseup', Factory.mouseUp);
                    $.addListener($I(cache.switch_shade_id), 'mouseup', Factory.mouseUp);
                }
                //cache.first = false;
            });
            return this;
        },
        mouseMove: function () {
            var cache = Config.cache;
            if (cache.dragStart && !cache.dragAble) {
                $('#' + cache.switch_shade_id).show();
                cache.dragAble = true;
            } else {
                cache.dragAble = false;
            }
            if (!cache.dragAble) {
                return false;
            }
            var ev = $.getEventPosition(), pass = false, pos, border, wh, dir = cache.direction;
            if (cache.horizontal) {
                pos = ev.x;
                border = cache.bs.width;
                wh = parseInt(cache.box.w, 10) / 2;
            } else {
                pos = ev.y;
                border = cache.bs.height;
                wh = parseInt(cache.box.h, 10) / 2;
            }
            if (dir === 'left' || dir === 'up') {
                pass = (pos > cache.min) && (!cache.max || pos < cache.max) && (pos < border - cache.minKeepSize);
            } else {
                pass = (pos < border - cache.min) && (!cache.max || pos > border - cache.max) &&  (pos > cache.minKeepSize);
            }
            if (pass) {
                cache.end = pos;
                $('#' + cache.switch_shade_id).css(cache.horizontal ? 'left' : 'top', cache.end - wh);
            }

            Factory.showValue(cache, cache.end);
            return this;
        },
        mouseUp: function () {
            var cache = Config.cache;
            $('#' + cache.switch_shade_id).hide();
            Factory.hideShade(cache);
            cache.dragStart = false;

            if (!cache.dragAble) {
                return this;
            }
            cache.dragAble = false;

            $.removeEventListener(document, 'mousemove', Factory.mouseMove);
            $.removeEventListener(document, 'mouseup', Factory.mouseUp);

            var start = cache.start,
                end = cache.end,
                value = cache.end - cache.start,
                dir = cache.direction,
                size = dir === 'left' || dir === 'up' ? cache.size + value : cache.size - value;

            if ($.isFunction(cache.options.callback)) {
                cache.callback({ 
                    panel: cache.panel, size: size, start: start, end: end, value: value
                });
            }
            return this;
        }
    };

    $.extend({
        switcher: function (options) {
            return Factory.initial(options);
        }
    });

}(OUI);