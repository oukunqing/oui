
/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.timer 定时器
*/

!function ($) {
    'use strict';

    var Cache = {
        timers: {}
    };

    var Factory = {
        buildTimer: function (options) {
            var opt = $.extend({
                id: 'oui-timer'
            }, options);

            if ($.isFunction(options)) {
                opt.callback = options;
            }
            
            var cache = Factory.getCache(opt.id);
            if (cache !== null) {
                return cache.timer.initial($.extend(cache.options, opt));
            } else {
                return new Timer(opt);
            }
        },
        timerAction: function (id, action, options, func) {
            if ($.isFunction(options)) {
                func = options;
                options = {};
            }
            var cache = Factory.getCache(id);
            if (cache !== null) {
                cache.timer[action](func, options);
                return cache.timer;
            }
            return null;
        },
        initCache: function (timer, options) {
            var key = 'timer-' + timer.id;
            Cache.timers[key] = {
                id: timer.id,
                timer: timer,
                options: options,
                interval: options.interval,
                timing: 0,
                enable: false
            };
            return this;
        },
        updateCache: function (timer, options) {
            var key = 'timer-' + timer.id;
            $.extend(Cache.timers[key], options);
            return this;
        },
        getCache: function (id) {
            var key = 'timer-' + id;
            return Cache.timers[key] || null;
        },
        checkNumber: function (number, interval) {
            if (number <= 0 || number > interval) {
                number = interval;
            }
            return number;
        },
        buildInfo: function(opt, num, paused, func) {
            var html = [], 
                elem = $.toElement(opt.element),
                name = $.isString(opt.name, true) ? opt.name : '';

            if (!$.isFunction(func)) {
                func = opt.callback;
            }
            if ($.isElement(elem)) {
                if (paused) {
                    html = opt.texts.pause;
                } else if (num <= 0) {
                    html = opt.texts.doing;                    
                } else {
                    html = opt.texts.delay.format(num);
                }
                elem.innerHTML = html.join('');
            }

            if ($.isFunction(func)) {
                func(num, paused);
            }

            return this;
        }
    };

    function Timer(options) {
        var cfg = {            
            id: 'oui-timer',
            interval: 60,
            element: null,
            texts: {
                pause: '<span style="color:#f00;">已暂停刷新</span>',
                doing: '正在刷新...',
                delay: '<span style="color:#f00;margin-right:2px;">{0}</span>秒后刷新'
            },
            callback: null
        };
        options = $.extend({}, options);
        $.extend(cfg.texts, options.texts);
        delete options.texts;

        var opt = $.extend(cfg, options),
            elem = $.toElement(opt.element);

        if (opt.interval <= 0) {
            opt.interval = 60;
        }

        this.cache = {
            timer: null,
            number: opt.interval,
            enable: false,
            paused: false,
            options: opt
        };

        this.id = opt.id;
        this.initial(opt);
    }

    Timer.prototype = {
        initial: function (opt) {
            if($.isNumber(opt) && opt > 0) {
                opt = { interval: opt };
            }
            //频率参数有变化时
            if (opt.interval !== this.cache.options.interval) {
                $.extend(this.cache.options, opt);
                //计时器计数重新开始
                this.cache.number = opt.interval;
            }
            Factory.initCache(this, opt);
            return this;
        },
        start: function (func) {
            var _ = this, cfg = _.cache;
            cfg.enable = true;
            cfg.paused = false;

            if (cfg.timer !== null) {
                window.clearInterval(cfg.timer);
            }
            var pause_times = 0, interval_ms = 1000;

            cfg.timer = window.setInterval(function () {
                if (!cfg.enable) {
                    return false;
                }
                if (!_.cache.paused) {
                    cfg.number = Factory.checkNumber(cfg.number, cfg.options.interval + 1);
                    cfg.number = (cfg.number - 1 * interval_ms / 1000).round(3);
                    if(cfg.number < 0) {
                        cfg.number = 0;
                    }
                    pause_times = 0;
                } else {
                    pause_times++;
                }
                if (pause_times < 2 && $.isFunction(func)) {
                    //func(parseInt(cfg.number, 10), cfg.paused);
                    Factory.buildInfo(cfg.options, parseInt(cfg.number, 10), cfg.paused, func);
                }
            }, interval_ms);

            if ($.isFunction(func)) {
                cfg.number = Factory.checkNumber(cfg.number, cfg.options.interval);
                //func(parseInt(cfg.number, 10), cfg.paused);
                Factory.buildInfo(cfg.options, parseInt(cfg.number, 10), cfg.paused, func);
            }
            return _;
        },
        stop: function (func) {
            var _ = this;
            _.cache.enable = false;

            if (_.cache.timer !== null) {
                window.clearInterval(_.cache.timer);
            }
            if ($.isFunction(func)) {
                func();
            }
            return _;
        },
        pause: function (func, action) {
            var _ = this, cfg = _.cache;
            cfg.paused = action ? true : false;
            if ($.isFunction(func)) {
                //func(parseInt(cfg.number, 10), cfg.paused);
                Factory.buildInfo(cfg.options, parseInt(cfg.number, 10), cfg.paused, func);
            }
            return _;
        },
        reset: function (func, options) {
            var _ = this;
            if($.isNumber(options) && options > 0) {
                options = { interval: options };
            }

            var opt = $.extend({
                interval: null
            }, options);

            if ($.isNumber(opt.interval) && opt.interval > 0) {
                _.cache.options.interval = opt.interval;
            }
            _.cache.number = _.cache.options.interval;
            _.cache.paused ? _.pause(func, true) : _.start(func);

            return _;
        },
        interval: function(func, interval) {
            if($.isNumber(func)) {
                interval = func;
                func = null;
            }
            var _ = this;

            if(!$.isNumber(interval) || interval <= 0) {
                return _;
            }
            _.cache.options.interval = interval;
            _.cache.number = _.cache.options.interval;

            return _;
        }
    };

    $.extend({
        timer: function (options) {
            return Factory.buildTimer(options);
        }
    });

    $.extend($.timer, {
        start: function (id, options, func) {
            return Factory.timerAction(id, 'start', options, func);
        },
        stop: function (id, options, func) {
            return Factory.timerAction(id, 'stop', options, func);
        },
        pause: function (id, action, func) {
            return Factory.timerAction(id, 'pause', action, func);
        },
        reset: function (id, options, func) {
            return Factory.timerAction(id, 'reset', options, func);
        },
        interval: function (id, interval) {
            return Factory.timerAction(id, 'interval', interval);
        }
    });

}(OUI);