
/*
	@Title: OUI
	@Description：JS通用代码库
	@Author: oukunqing
	@License：MIT

	$.timebar 时间限制
*/

!function ($) {
    'use strict';

    var Config = {
        FilePath: $.getScriptSelfPath(true),
        FileName: 'oui.timebar.',
        MinTickWidth: 36,
        MinTickMinutes: 1
    };

    //先加载样式文件
    $.loadJsScriptCss(Config.FilePath, '', function() {}, Config.FileName);

    var Cache = {
    	caches: {},
    	getCache: function(id) {
    		return Cache.caches['ts_' + id];
    	},
    	setCache: function (id, ts) {
    		Cache.caches['ts_' + id] = {
    			id: id,
    			ts: ts,
    		};
    		return this;
    	}
    };

    var Factory = {
        buildTimeBar: function(id, options) {
            var opt = {};
            if ($.isElement(id)) {
                $.extend(opt, options, { box: id, id: id.id });
            } else if ($.isString(id, true)) {
                var box = $.toElement(id);
                $.extend(opt, options, { box: box, id: id });
            } else {
                $.extend(opt, id, options);
            }
            if (!opt.box) {
                return null;
            }
            var cache = Cache.getCache(opt.id), ts;
            if (cache) {
                ts = cache.ts.update(opt);
            } else {
                ts = new TimeBar(opt);
            }
            Cache.setCache(opt.id, ts);
            return ts;
        },
        buildElement: function (ts) {
            var opt = ts.options,
                obj = ts.elements,
                canvas = document.createElement('CANVAS');

            $.addClass(obj.box, 'oui-timebar');
            obj.box.style.height = opt.height + 'px';

            canvas.className = 'oui-timebar-canvas';
            obj.box.appendChild(canvas);

            $.extend(obj, {
                canvas: canvas,
                ctx: canvas.getContext('2d')
            });

            if (opt.showPanel) {
                var bar = document.createElement('DIV'),
                    html = opt.rules.length > 1 ? [
                        '<a class="sub"></a>',
                        '<a class="add"></a>'
                    ] : [];

                if (opt.showOrigin) {
                    html.push('<a class="ori"></a>');
                }
                if (opt.showReload) {
                    html.push('<a class="rel"></a>');
                }

                bar.className = 'oui-timebar-bar';
                bar.innerHTML = html.join('');
                obj.box.appendChild(bar);
            }

            return this;
        },
        setSize: function (ts) {
            var obj = ts.elements,
                width = obj.box.offsetWidth,
                height = obj.box.offsetHeight;

            obj.canvas.width = width;
            obj.canvas.height = height;

            return this;
        },
        getTimeRange: function (ts) {
            var cache = ts.cache,
                rule = Factory.getRule(ts),
                tickMinutes = rule.minutes,
                dt = cache.defaultTime.toString().toDate(),
                offset = cache.offset,
                seconds = Factory.getTimeOffset(ts, offset),
                start = parseInt(seconds - (seconds % (tickMinutes * 60)), 10),
                end = start + tickMinutes * 60;

            function _dt() {
                return cache.defaultTime.toString().toDate();
            }

            return {
                startTime: _dt().addSeconds(start).format(),
                endTime: _dt().addSeconds(end).format(),
                currentTime: _dt().addSeconds(seconds).format() 
            };
        },
        getTimeOffset: function (ts, offset) {
            var cache = ts.cache,
                rule = Factory.getRule(ts),
                tickWidth = rule.width,
                tickMinutes = rule.minutes,
                dt = cache.defaultTime.toString().toDate();

            // 时间刻度的最小单位是分钟，而这里要以秒来计算时间偏移，所以这里要乘以60
            return (offset > 0 ? -1 : 1) * Math.abs(offset) * (tickMinutes / tickWidth * 60);
        },
        setOffset: function (ts) {
            var cache = ts.cache,
                rule = Factory.getRule(ts),
                tickWidth = rule.width,
                tickMinutes = rule.minutes,
                seconds = cache.currentTime.timeSpan(cache.defaultTime).totalSeconds,
                offset = seconds / (tickMinutes / tickWidth * 60);

            cache.offset = -offset;

            return this;
        },
        checkOffsetLimit: function (ts) {
            var cache = ts.cache,
                opt = ts.options,
                rule = Factory.getRule(ts);

            if ($.isDate(opt.maxTime)) {
                // 左边最大偏移像素
                var leftMaxOffset = Math.abs(opt.maxTime.timeSpan(cache.defaultTime).totalSeconds) / rule.seconds;                
                if (cache.offset < 0 && cache.offset < -leftMaxOffset) {
                    cache.offset = -leftMaxOffset;
                }
                cache.leftMaxOffset = leftMaxOffset;
            }

            if ($.isDate(opt.minTime)) {
                // 右边最大偏移像素
                var rightMaxOffset = Math.abs(opt.minTime.timeSpan(cache.defaultTime).totalSeconds) / rule.seconds;      
                if (cache.offset > 0 && cache.offset > rightMaxOffset) {
                    cache.offset = rightMaxOffset;
                }
                cache.rightMaxOffset = rightMaxOffset;
            }
            return this;
        },
        buildStrokeStyle: function(color, opacity) {
            if (opacity === 1) {
                return color;
            }
            var str = color.substr(1), len = str.length, numbers = [];

            if (len === 6) {
                numbers.push(parseInt('0x' + str[0] + str[1]));
                numbers.push(parseInt('0x' + str[2] + str[3]));
                numbers.push(parseInt('0x' + str[4] + str[5]));
            } else if (len === 3) {
                numbers.push(parseInt('0x' + str[0] + str[0]));
                numbers.push(parseInt('0x' + str[1] + str[1]));
                numbers.push(parseInt('0x' + str[2] + str[2]));
            }
            numbers.push(opacity);

            return 'rgba(' + numbers.join(',') + ')';
        },
        getDataLines: function (ts) {
            var opt = ts.options;
            if (!$.isDate(opt.minTime) || !$.isDate(opt.maxTime)) {
                return [];
            }
            var center = ts.elements.canvas.width / 2,
                cache = ts.cache,
                offset = ts.cache.offset,
                defaultTs = cache.defaultTime.getTime() / 1000,
                seconds = opt.maxTime.timeSpan(opt.minTime).totalSeconds,
                rule = Factory.getRule(ts),
                width = parseInt(seconds / rule.seconds, 10),
                data = cache.data,/* [
                    1746691176,1746691206,1746691236,1746691266,1746691296,1746691326,1746691356,1746691386,
                    1746691416,1746691446,1746691476,1746691506,1746691536,1746691566,1746691596,1746691626,
                    1746691656,1746691686,1746691716,1746691746
                ],*/
                points = [], lines = [],
                i = 0, j = 0, c = width;

            for(i = 0; i < c; i++) {
                points[i] = 0;
            }

            for (i = 0; i < data.length; i++) {
                var s = data[i] + 86400 - defaultTs,
                    p = parseInt(s / rule.seconds, 10) + (s % rule.seconds ? 1 : 0);
                points[p] = 1;
            }

            for (i = 0; i < c; i++) {
                if (points[i]) {
                    if (j > 0) {
                        var p = lines[j - 1], n1 = i - p.x, n2 = i - (p.x + p.w);
                        if (n2 <= 1) {
                            p.w += 1;
                        } else if (n1 <= 1) {
                            ;
                        } else {
                            lines.push({ x: i, w: 1 });
                            j++;
                        }
                    } else {
                        lines.push({ x: i, w: 1 });
                        j++;
                    }
                }
            }

            if (lines.length > 0) {
                $.console.log('getDataLines:', seconds, rule, width, points, lines);
            }
            return lines;
        },
        drawScale: function (ts, clientX) {
            var obj = ts.elements,
                opt = ts.options,
                canvas = obj.canvas,
                ctx = obj.ctx,
                width = canvas.width,
                height = canvas.height,
                center = parseInt(width / 2, 10),
                cache = ts.cache,
                //刻度高度
                tickHeight = cache.tickHeight,
                //刻度间距
                //tickWidth = cache.tickWidth,
                rule = Factory.getRule(ts),
                tickWidth = rule.width,
                tickMinutes = rule.minutes,
                //（左、右）刻度总宽度
                scaleWidth = 0,
                //刻度数量，左右两边的刻度数量不一定相等
                tickCount = 0;

            Factory.checkOffsetLimit(ts);

            var offset = cache.offset,
                mode = Math.abs(offset) <= center ? 3 : offset < 0 ? 1 : 2;

            //清除所有
            ctx.clearRect(0, 0, width, height);

            // cache.defaultTime 是 Date 对象
            // 这里为什么不直接用 dt = cache.defaultTime，而要复制一个Date
            // 是因为下面用了 dt.addMinutes() 方法
            var dt = _dt();

            // 数据线
            var dataLines = Factory.getDataLines(ts);
            for (var i = 0; i < dataLines.length; i++) {
                var dr = dataLines[i], x = dr.x + center + offset;
                _drawline(ctx, '#00ff00', 0.9, dr.w, x + dr.w / 2, x + dr.w / 2, height - tickHeight + 1, height);
            }

            // 画右边刻度
            if (mode % 2 > 0) {
                var w = $.isNumber(cache.leftMaxOffset) && !opt.showRight ? (cache.leftMaxOffset + cache.offset + 1) : center;
                if (w > center) {
                    w = center;
                }
                scaleWidth = Math.abs(offset) + w;
                tickCount = parseInt(scaleWidth / tickWidth, 10) + (scaleWidth % tickWidth ? 1 : 0);
                _drawscale(tickCount, 0);
            }

            dt = _dt();
            // 画左边刻度
            if (mode > 1) {
                var w = $.isNumber(cache.rightMaxOffset) && !opt.showLeft ? (cache.rightMaxOffset - cache.offset + 1) : center;
                if (w > center) {
                    w = center;
                }
                scaleWidth = offset + w;
                tickCount = parseInt(scaleWidth / tickWidth, 10) + (scaleWidth % tickWidth ? 1 : 0);
                _drawscale(tickCount, 1);
            }

            //画水平线
            _drawline(ctx, '#555', 1, 2, 0, width, height - tickHeight, height - tickHeight);

            //画中心线
            _drawline(ctx, '#fc0', 0.9, 2, center, center, 0, height);
            
            var seconds = Factory.getTimeOffset(ts, offset);
            cache.currentTime = _dt().addSeconds(seconds);
            //画当前时间
            _drawtext(ctx, cache.currentTime.format(), '14px Arial', '#ccc', center, height - tickHeight - 16);

            if (clientX) {
                dt = _dt();
                seconds = Factory.getTimeOffset(ts, -((clientX - cache.offset) - (width / 2)));
                //画鼠标位置的时间
                _drawtext(ctx, dt.addSeconds(seconds).format(), '12px Arial', '#ddd', clientX, 12);
            } 

            function _dt() {
                return cache.defaultTime.format().toDate();
            }

            function _drawline (ctx, color, opacity, lineWidth, x0, x1, y0, y1) {
                ctx.beginPath();
                ctx.moveTo(x0, y0);
                ctx.lineTo(x1, y1);
                //ctx.strokeStyle = color;
                ctx.strokeStyle = Factory.buildStrokeStyle(color, opacity);
                ctx.lineWidth = lineWidth;
                ctx.stroke();
            }

            function _drawtext(ctx, text, font, color, x, y) {
                ctx.font = font;
                ctx.fillStyle = color;
                ctx.textAlign = 'center';
                ctx.fillText(text, x, y);
            }

            function _drawscale (count, left) {
                for (var i = 0; i < count; i++) {
                    var x = (left ? -1 : 1) * (i * tickWidth) + (center + offset);
                    _drawline(ctx, '#999', 1, 1, x, x, height - tickHeight + 1, height);
                    dt.addMinutes((left ? -1 : 1) * (i ? 1 : 0) * tickMinutes);
                    _drawtext(ctx, dt.format('HH:mm'), '12px Arial', '#aaa', x, height - tickHeight - 4);
                }
            }

            return this.callback(ts);
        },
        callback: function (ts) {
            var that = this,
                opt = ts.options,
                cache = ts.cache;

            if ($.isFunction(opt.callback)) {
                var range = $.toJsonString(Factory.getTimeRange(ts));
                if (range === cache.range) {
                    return that;
                }
                cache.range = range;

                $.debounce({
                    id: 'oui-timebar' + ts.id,
                    delay: 100,
                    timeout: 5000
                }, function() {
                    opt.callback(range, ts);
                });                
            }
            return that;
        },
        getRule: function(ts) {
            var rules = ts.options.rules,
                len = rules.length,
                level = ts.cache.ruleLevel;

            level = level < 0 ? 0 : level >= len ? len - 1 : level;

            return rules[level];
        },
        setRuleLevel: function(ts, action) {
            var cache = ts.cache,
                len = ts.options.rules.length,
                level = cache.ruleLevel + action;

            level = level < 0 ? 0 : level >= len ? len - 1 : level;

            cache.ruleLevel = level;

            return this.setOffset(ts).drawScale(ts);
        },
        resetOffset: function (ts, reload) {
            var cache = ts.cache;
            if (reload) {
                cache.currentTime = new Date();
            } else {
                cache.currentTime = cache.originTime;
            }
            return this.setOffset(ts).drawScale(ts);
        },
        checkOptions: function(options) {
            var opt = $.extend({
                height: 60,
                tickHeight: 20,
                time: new Date(),
                //比例尺：两种写法
                /*rules: [
                    {width:120,minutes:120},{width:120,minutes:60},{width:120,minutes:30},{width:240,minutes:30},
                    {width:120,minutes:10},{width:120,minutes:5},{width:240,minutes:5}
                ],
                */
                rules: [
                    [120,120],[120,60],[120,30],[240,30],[120,10],[120,5],[240,5]
                ],
                // 默认比例索引
                level: 1,
                data: [],
                callback: function (data, t) {
                    console.log('timebar-callback:', data, t);
                },
                // 最小时间限制
                minTime: null,
                // 最大时间限制
                maxTime: null,
                // 是否显示左边最小时间外的部分
                showLeft: true,
                // 是否显示右边最大时间外的部分
                showRight: true,
                // 是否显示控制面板
                showPanel: true,
                // 是否显示“回到原点”按钮
                showOrigin: false,
                // 是否显示“重新加载”按钮
                showReload: false
            }, options);

            if (!$.isDate(opt.time)) {
                opt.time = opt.time.toString().toDate();
            }
            if (!$.isDate(opt.minTime) && ($.isString(opt.minTime, true) || $.isNumber(opt.minTime))) {
                opt.minTime = opt.minTime.toDate();
            }
            if (!$.isDate(opt.maxTime) && ($.isString(opt.maxTime, true) || $.isNumber(opt.maxTime))) {
                opt.maxTime = opt.maxTime.toDate();
            }

            if (!$.isArray(opt.rules)) {
                opt.rules = [{width:120, minutes:60}];
            }
            var rules = [];
            for (var i = 0; i < opt.rules.length; i++) {
                var dr = opt.rules[i], d;
                if ($.isArray(dr)) {
                    d = {width:dr[0], minutes:dr[1]};
                } else if ($.isObject(dr) && dr.width && dr.minutes) {
                    d = dr;
                } else if ($.isString(dr, true)) {
                    var arr = dr.split(/[,|;]/);
                    d = {width:arr[0], minutes:arr[1]};
                }
                if (d.width < Config.MinTickWidth) {
                    d.width = Config.MinTickWidth;
                }
                if (d.minutes < Config.MinTickMinutes) {
                    d.minutes = Config.MinTickMinutes;
                }
                //每个像素表示的秒数
                d.seconds = d.minutes / d.width * 60;

                rules.push(d);
            }
            opt.rules = rules;

            if (!$.isArray(opt.data)) {
                opt.data = [];
            }

            return opt;
        }
    };

    function TimeBar(options) {
        this.cache = {
            offset: 0,
            dragging: false,
            lastX: 0,
            startTime: '',
            endTime: '',
            range: ''
        };
        this.initial(options).build();
    }

    TimeBar.prototype = {
        initial: function(options) {
            var that = this,
                opt = Factory.checkOptions(options);

            that.options = opt;
            that.id = that.options.id;
            if (!that.elements) {
                that.elements = { box: opt.box };
            }
            $.extend(that.cache, {
                defaultTime: opt.time.dayStart().toDate(),
                originTime: opt.time,
                currentTime: opt.time,
                data: opt.data || [],
                tickHeight: opt.tickHeight,
                ruleLevel: opt.level
            });

            return that;
        },
        build: function(options) {
            var that = this,
                cache = that.cache,
                obj = that.elements;

            if (!obj.canvas) {
                Factory.buildElement(that);

                $.addListener(window, 'resize', function() {
                    Factory.setSize(that).drawScale(that);
                });

                $.addListener(obj.box, 'click', function(e) {
                    $.cancelBubble(e);

                    var elem = e.target,
                        css = elem.className;

                    switch(css) {
                    case 'add':
                        Factory.setRuleLevel(that, 1);
                        break;
                    case 'sub':
                        Factory.setRuleLevel(that, -1);
                        break;
                    case 'ori':
                        Factory.resetOffset(that);
                        break;
                    case 'rel':
                        Factory.resetOffset(that, 1);
                        break;
                    }
                });

                $.addListener(obj.box, 'mousedown', function(e) {
                    var elem = e.target,
                        css = elem.className;

                    if (e.target.className.indexOf('oui-timebar') < 0) {
                        return true;
                    }
                    cache.dragging = true;
                    cache.lastX = e.offsetX;
                    Factory.drawScale(that);
                });

                document.addEventListener('mousemove', (e) => {
                    if (cache.dragging) {
                        var dx = e.offsetX - cache.lastX;
                        cache.offset += dx;
                        cache.lastX = e.offsetX;
                        Factory.checkOffsetLimit(that).drawScale(that);
                    } else if (e.target.className.indexOf('oui-timebar') > -1) {
                        Factory.drawScale(that, e.clientX - obj.box.offsetLeft);
                    }
                });

                obj.box.addEventListener('mouseout', () => {
                    Factory.drawScale(that);
                });

                document.addEventListener('mouseup', () => {
                    cache.dragging = false;
                });
            }            
        
            Factory.setSize(that).setOffset(that).drawScale(that);

            return that;
        },
        update: function (options) {
            var that = this,
                opt = $.extend(that.options, options);

            return that.initial(opt).build();
        }
    };

    $.extend({
        timebar: function (id, options) {
            return Factory.buildTimeBar(id, options);
        }
    });

}(OUI);