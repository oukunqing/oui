
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
        }
    };

    function Timer(options) {
        var opt = $.extend({
            id: 'oui-timer',
            interval: 60,
            callback: null
        }, options);

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
            var _ = this;
            _.cache.enable = true;
            _.cache.paused = false;

            if (_.cache.timer !== null) {
                window.clearInterval(_.cache.timer);
            }
            var pause_times = 0, interval_ms = 1000;

            _.cache.timer = window.setInterval(function () {
                if (!_.cache.enable) {
                    return false;
                }
                if (!_.cache.paused) {
                    _.cache.number = Factory.checkNumber(_.cache.number, _.cache.options.interval + 1);
                    _.cache.number = (_.cache.number - 1 * interval_ms / 1000).round(3);
                    if(_.cache.number < 0) {
                        _.cache.number = 0;
                    }
                    pause_times = 0;
                } else {
                    pause_times++;
                }
                if (pause_times < 2 && $.isFunction(func)) {
                    func(parseInt(_.cache.number, 10), _.cache.paused);
                }
            }, interval_ms);

            if ($.isFunction(func)) {
                _.cache.number = Factory.checkNumber(_.cache.number, _.cache.options.interval);
                func(parseInt(_.cache.number, 10), _.cache.paused);
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
            var _ = this;
            _.cache.paused = action ? true : false;
            if ($.isFunction(func)) {
                func(parseInt(_.cache.number, 10), _.cache.paused);
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