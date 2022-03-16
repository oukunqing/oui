
/*
 @Title: OUI.switch.js
 @Description：面板缩放拉伸插件
 @Author: oukunqing
 @License：MIT
*/

;!function ($) {
    'use strict';
    
    var Config = {
        id: 0,
        caches: {},
        buildKey: function(opt) {
            return 'sw_' + (opt.id || Config.id);
        },
        initCache: function(opt) {
            if (!opt.id) {
                Config.id += 1;
            }
            var key = Config.buildKey(opt);
            Config.caches[key] = {
                shade_id: 'oui_switch_shade_body_001',
                switch_shade_id: 'oui_switch_shade_switch_001',
                direction: true,   //true表示水平方向，false表示垂直方向
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
        setCache: function(opt, oar) {
            var key = Config.buildKey(opt),
                cache = Config.caches[key];
            if (cache) {
                $.extend(cache, par);
            }
            return this;
        },
        getCache: function(opt) {
            var key = Config.buildKey(opt),
                cache = Config.caches[key];
            return cache;
        }
    };

    var Factory = {
        initial: function(options) {
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

            if($.isNumber(cache.options.direction) || $.isString(cache.options.direction)) {
                cache.direction = cache.direction === 1 || ('' + cache.direction).toLowerCase() === 'horizontal';
            }

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
        showShade: function(options) {
            var cache = Config.getCache(options), id = cache.shade_id, shade = $I(id);
            var bs = $.getBodySize();
            if (null === shade) {
                $.createElement('div', id, function(elem) {
                    elem.style.cssText = 'background:#000;width:' + bs.width + 'px;height:' + bs.height + 'px;'
                        + 'display:block;position:absolute;'
                        + 'overflow:hidden;opacity:0;z-index:' + (cache.zindex - 1) + ';'
                        + '-moz-user-select:none;-khtml-user-select:none;user-select:none;-ms-user-select:none;';
                }, $I(options.parent) || document.body);
            } else {
                shade.style.display = 'block';
                shade.style.width = bs.width + 'px';
                shade.style.height = bs.height + 'px';
            }

            var box = $I(options.switchbox),
                bar = $I(cache.switch_shade_id),
                size = $.getOffset(box, true),
                w = size.width,
                h = size.height,
                left = size.left,
                top = size.top;
            if (null === bar) {
                $.createElement('div', cache.switch_shade_id, function(elem) {
                    elem.style.cssText = 'width:' + w + 'px;height:' + h + 'px;'
                        + 'display:block;position:absolute;background:#dfe8f6;border:dotted 1px #99bbe8;color:#999;line-height:1em;'
                        + 'margin:0;padding:0;box-sizing:content-box;font-size:10px;font-family:Arial;word-break:break-all;'
                        + (cache.direction ? 'left:' + left + 'px;cursor:ew-resize;' : 'top:' + top + 'px;cursor:ns-resize;')
                        + 'overflow:hidden;opacity:0.5;z-index:' + cache.zindex + ';text-align:center;vertical-align:middle;'
                        + '-moz-user-select:none;-khtml-user-select:none;user-select:none;-ms-user-select:none;';                    
                }, $I(options.parent) || document.body);
            } else {
                //bar.className = options.switch_bar || '';
                bar.style.display = 'block';
                bar.style.width = w + 'px';
                bar.style.height = h + 'px';
                if (cache.direction) {
                    bar.style.left = left + 'px';
                } else {
                    bar.style.top = top + 'px';
                }
            }

            return this;
        },
        hideShade: function(cache) {            
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
        showValue: function(cache, val) {
            if (!cache.options.showValue) {
                return this;
            }
            var bar = $I(cache.switch_shade_id);
            if (null !== bar) {
                bar.innerHTML = [
                    '<div style="display:block;overflow:hidden;padding:0;margin:0;border:none;',
                    cache.direction ? 'position:absolute;vertical-align:middle;display:table-cell;top:48%;' : 'margin:0 auto;',
                    '">',
                    val,
                    '</div>'
                ].join('');
            }
            return this;
        },
        mouseDown: function(options) {
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

                Factory.showShade(options);

                var size = $.getOffset(cache.switch_shade_id, true);
                cache.box = { w: size.width, h: size.height };

                var ev = $.getEventPosition();
                cache.start = cache.direction ? ev.x : ev.y;
                Factory.showValue(cache, cache.start);
                
                $.addListener(document, 'mousemove', function(){
                    Factory.mouseMove(cache);
                });
                $.addListener($I(cache.switch_shade_id), 'mousemove', function(){
                    Factory.mouseMove(cache);
                });

                $.addListener(document, 'mouseup', function(){
                    Factory.mouseUp(cache);
                });
                $.addListener($I(cache.switch_shade_id), 'mouseup', function(){
                    Factory.mouseUp(cache);
                });
            });
            return this;
        },
        mouseMove: function(cache) {
            if (cache.dragStart && !cache.dragAble) {
                $('#' + cache.switch_shade_id).show();
                cache.dragAble = true;
            }
            if (!cache.dragAble) {
                return false;
            }
            var ev = $.getEventPosition();
            if (cache.direction) {
                if (ev.x > cache.min && ev.x < cache.bs.width - cache.min) {
                    cache.end = ev.x;
                    $('#' + cache.switch_shade_id).css('left', cache.end - parseInt(cache.box.w, 10) / 2);
                }
            } else {
                if (ev.y > cache.min && ev.y < cache.bs.height - cache.min) {
                    cache.end = ev.y;
                    $('#' + cache.switch_shade_id).css('top', cache.end - parseInt(cache.box.h, 10) / 2);
                }
            }
            Factory.showValue(cache, cache.end);
            return this;
        },
        mouseUp: function(cache) {
            $('#' + cache.switch_shade_id).hide();
            Factory.hideShade(cache);

            if (!cache.dragAble) {
                return this;
            }
            cache.dragAble = false;
            cache.dragStart = false;

            if ($.isFunction(cache.options.callback)) {
                cache.callback({ start: cache.start, end: cache.end, value: cache.end - cache.start });
            }
            return this;
        }
    };

    $.extend({
        switcher: function(options) {
            return Factory.initial(options);
        }
    });

}(OUI);