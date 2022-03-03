
/*
 @Title: OUI.switch.js
 @Description：面板缩放拉伸插件
 @Author: oukunqing
 @License：MIT
*/

;!function ($) {
    'use strict';
    
    var Config = {
        shade_id: 'oui_switch_shade_body_001',
        switch_shade_id: 'oui_switch_shade_switch_001',
        direction: true,   //true表示水平方向，false表示垂直方向
        zindex: 99999999,
        start: 0,
        value: 0,
        min: 80,
        options: {
            panel: '',
            parent: '',
            switchbox: '',
            switchbar: '',
            callback: null,
            click: null
        },
        box: {
            w: 0,
            h: 0
        }
    };

    var Factory = {
        initial: function(options) {
            if ($.isNullOrUndefined(options)) {
                return this;
            }
            if ($.isFunction(options.callback)) {
                Config.callback = options.callback;
            }
            $.extend(Config.options, options);

            if ($.isNumber(Config.options.min)) {
                Config.min = Config.options.min;
            }

            if($.isNumber(Config.options.direction) || $.isString(Config.options.direction)) {
                Config.direction = Config.direction === 1 || ('' + Config.direction).toLowerCase() === 'horizontal';
            }

            Config.value = $('#' + Config.options.panel).width();

            if ($I(Config.options.switchbar) !== null) {
                $('#' + Config.options.switchbar).mousedown(function (ev) {
                    $.cancelBubble(ev);
                });

                $('#' + Config.options.switchbar).click(function () { 
                    if ($.isFunction(Config.options.click)) {
                        Config.options.click();
                    }
                });
            }

            Factory.mouseDown(Config.options);

            return this;
        },
        showShade: function(options) {
            var id = Config.shade_id, shade = $I(id);
            var bs = $.getBodySize();
            if (null === shade) {
                $.createElement('div', id, function(elem) {
                    elem.style.cssText = 'background:#000;width:' + bs.width + 'px;height:' + bs.height + 'px;'
                        + 'display:block;position:absolute;'
                        + 'overflow:hidden;opacity:0;z-index:' + (Config.zindex - 1) + ';'
                        + '-moz-user-select:none;-khtml-user-select:none;user-select:none;-ms-user-select:none;';
                }, $I(options.parent) || document.body);
            } else {
                shade.style.display = 'block';
                shade.style.width = bs.width + 'px';
                shade.style.height = bs.height + 'px';
            }

            var box = $I(options.switchbox),
                bar = $I(Config.switch_shade_id),
                size = $.getOffset(box, true),
                w = size.width,
                h = size.height,
                left = size.left - parseInt(w / 2, 10),
                top = size.top - parseInt(h / 2, 10);
            if (null === bar) {
                $.createElement('div', Config.switch_shade_id, function(elem) {
                    elem.style.cssText = 'width:' + w + 'px;height:' + h + 'px;'
                        + 'display:block;position:absolute;background:#dfe8f6;border:dotted 1px #99bbe8;'
                        + 'margin:0;padding:0;box-sizing: content-box;'
                        + (Config.direction ? 'left:' + left + 'px;cursor:ew-resize;' : 'top:' + top + 'px;cursor:ns-resize;')
                        + 'overflow:hidden;opacity:0.5;z-index:' + Config.zindex + ';'
                        + '-moz-user-select:none;-khtml-user-select:none;user-select:none;-ms-user-select:none;';
                }, $I(options.parent) || document.body);
            } else {
                //bar.className = options.switch_bar || '';
                bar.style.display = 'block';
                bar.style.width = w + 'px';
                bar.style.height = h + 'px';
                if (Config.direction) {
                    bar.style.left = left + 'px';
                } else {
                    bar.style.top = top + 'px';
                }
            }

            return this;
        },
        hideShade: function() {            
            var id = Config.shade_id, shade = $I(id), bar = $I(Config.switch_shade_id);
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
        mouseDown: function(options) {
            var id = options.switchbox || options.switch, obj = $I(id);
            if (null === obj) {
                return this;
            }
            $('#' + id).mousedown(function () {
                if (0 === Config.value || !$.isDisplay(options.panel)) {
                    return false;
                }
                Config.bs = $.getBodySize();
                Config.dragStart = true;

                var size = $.getOffset(Config.switch_shade_id, true);
                Config.box = { w: size.width, h: size.height };
                console.log('box-size: ', Config.box);

                var ev = $.getEventPosition();
                Config.start = Config.direction ? ev.x : ev.y;
                
                Factory.showShade(options);

                $.addListener(document, 'mousemove', Factory.mouseMove);
                $.addListener($I(Config.switch_shade_id), 'mousemove', Factory.mouseMove);

                $.addListener(document, 'mouseup', Factory.mouseUp);
                $.addListener($I(Config.switch_shade_id), 'mouseup', Factory.mouseUp);
            });
            return this;
        },
        mouseMove: function() {
            if (Config.dragStart && !Config.dragAble) {
                $('#' + Config.switch_shade_id).show();
                Config.dragAble = true;
            }
            if (!Config.dragAble) {
                return false;
            }
            var ev = $.getEventPosition();
            if (Config.direction) {
                if (ev.x > Config.min && ev.x < Config.bs.width - Config.min) {
                    Config.value = ev.x - parseInt(Config.box.w, 10);
                    $('#' + Config.switch_shade_id).css('left', Config.value);
                }
            } else {
                if (ev.y > Config.min && ev.y < Config.bs.height - Config.min) {
                    Config.value = ev.y - parseInt(Config.box.h, 10);
                    $('#' + Config.switch_shade_id).css('top', Config.value);
                }
            }
            return this;
        },
        mouseUp: function() {
            $('#' + Config.switch_shade_id).hide();
            Factory.hideShade();

            if (!Config.dragAble) {
                return this;
            }
            Config.dragAble = false;
            Config.dragStart = false;

            if ($.isFunction(Config.options.callback)) {
                Config.callback({ start:Config.start, value:Config.value });
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