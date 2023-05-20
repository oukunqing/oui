
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
        initCache: function (opt) {
            if (!opt.id) {
                Config.id += 1;
            }
            var key = Config.buildKey(opt);
            Config.caches[key] = {
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
        setCache: function (opt, oar) {
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
            if ($.isNullOrUndefined(options)) {
                return this;
            }
            Config.initCache(options);
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
                        cache.options.click();
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
                        + 'display:block;position:absolute;'
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
            var cache = Config.getCache(options);
            var id = options.switchbox || options.switch, obj = $I(id);
            if (null === obj) {
                return this;
            }
            $('#' + id).mousedown(function () {
                if (0 === cache.value || !$.isDisplay(options.panel)) {
                    return false;
                }
                cache.bs = $.getBodySize();
                cache.dragStart = true;

                Config.cache = cache;

                Factory.showShade(cache);

                var size = $.getOffset(cache.switch_shade_id, true);
                cache.box = { w: size.width, h: size.height };

                var ev = $.getEventPosition();
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
            }
            if (!cache.dragAble) {
                return false;
            }
            var ev = $.getEventPosition(), pass = false, pos, border,wh;
            if (cache.horizontal) {
                pos = ev.x;
                border = cache.bs.width;
                wh = parseInt(cache.box.w, 10) / 2;
            } else {
                pos = ev.y;
                border = cache.bs.height;
                wh = parseInt(cache.box.h, 10) / 2;
            }
            if (cache.direction === 'left' || cache.direction === 'up') {
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

            if (!cache.dragAble) {
                return this;
            }
            cache.dragAble = false;
            cache.dragStart = false;

            $.removeEventListener(document, 'mousemove', Factory.mouseMove);
            $.removeEventListener(document, 'mouseup', Factory.mouseUp);

            if ($.isFunction(cache.options.callback)) {
                cache.callback({ start: cache.start, end: cache.end, value: cache.end - cache.start });
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