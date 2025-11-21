/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.gmap 网格地图
*/

!function ($) {
    'use strict';

    var Config = {
        FilePath: $.getScriptSelfPath(true),
        FileName: 'oui.gmap.',
        TextFont: '12px Arial',
        ScaleLevels: [
            { val: 1000 * 1000, min: 500 * 1000, text: '1000公里' },
            { val: 500 * 1000, min: 200 * 1000, text: '500公里' },
            { val: 200 * 1000, min: 100 * 1000, text: '200公里' },
            { val: 100 * 1000, min: 75 * 1000, text: '100公里' },
            { val: 75 * 1000, min: 50 * 1000, text: '75公里' },
            { val: 50 * 1000, min: 25 * 1000, text: '50公里' },
            { val: 25 * 1000, min: 20 * 1000, text: '25公里' },
            { val: 20 * 1000, min: 10 * 1000, text: '20公里' },
            { val: 10 * 1000, min: 5 * 1000, text: '10公里' },
            { val: 5 * 1000, min: 2 * 1000, text: '5公里' },
            { val: 2 * 1000, min: 1 * 1000, text: '2公里' },
            { val: 1 * 1000, min: 500, text: '1公里' },

            { val: 500, min: 200, text: '500米' },
            { val: 200, min: 100, text: '200米' },
            { val: 100, min: 50, text: '100米' },
            { val: 50, min: 25, text: '50米' },
            { val: 25, min: 20, text: '25米' },
            { val: 20, min: 10, text: '20米' },
            { val: 10, min: 5, text: '10米' },
            { val: 5, min: 2, text: '5米' },
            { val: 2, min: 1, text: '2米' },
            { val: 1, min: 0.5, text: '1米' },

            { val: 0.5, min: 0.25, text: '50厘米' },
            { val: 0.25, min: 0.2, text: '25厘米' },
            { val: 0.2, min: 0.1, text: '20厘米' },
            { val: 0.1, min: 0.05, text: '10厘米' },
            { val: 0.05, min: 0.02, text: '5厘米' },
            { val: 0.02, min: 0.01, text: '2厘米' },
            { val: 0.01, min: 0.005, text: '1厘米' },
            { val: 0.005, min: 0.004, text: '5毫米' }
        ],
        //经纬度距离，1度所表示的距离，单位：米
        DegreeDistance: 111320,
        DistanceWidth: 50,
        //高度距离，高度数字1所表示的距离，单位：米
        HeightDistance: 1,
        HeightLevels: [
            { val: 5 * 1000, min: 4.5 * 1000, text: '5公里' },
            { val: 4.5 * 1000, min: 4 * 1000, text: '4.5公里' },
            { val: 4 * 1000, min: 3.5 * 1000, text: '4公里' },
            { val: 3.5 * 1000, min: 3 * 1000, text: '3.5公里' },
            { val: 3 * 1000, min: 2.5 * 1000, text: '3公里' },
            { val: 2.5 * 1000, min: 2 * 1000, text: '2.5公里' },
            { val: 2 * 1000, min: 1 * 1000, text: '2公里' },
            { val: 1 * 1000, min: 800, text: '1公里' },

            { val: 750, min: 500, text: '750米' },
            { val: 500, min: 400, text: '500米' },
            { val: 400, min: 300, text: '400米' },
            { val: 300, min: 200, text: '300米' },


            { val: 200, min: 100, text: '200米' },
            { val: 100, min: 50, text: '100米' },
            { val: 75, min: 50, text: '75米' },
            { val: 50, min: 25, text: '50米' },
            { val: 25, min: 20, text: '25米' },
            { val: 20, min: 10, text: '20米' },
            { val: 10, min: 5, text: '10米' },
            { val: 5, min: 2, text: '5米' },
            { val: 2, min: 1, text: '2米' },
            { val: 1, min: 0.5, text: '1米' },

            { val: 0.5, min: 0.25, text: '50厘米' },
            { val: 0.25, min: 0.2, text: '25厘米' },
            { val: 0.2, min: 0.1, text: '20厘米' },
            { val: 0.1, min: 0.05, text: '10厘米' },
            { val: 0.05, min: 0.02, text: '5厘米' },
            { val: 0.02, min: 0.01, text: '2厘米' },
            { val: 0.01, min: 0.005, text: '1厘米' },
            { val: 0.005, min: 0.004, text: '5毫米' }
        ]
    };

    //先加载样式文件
    $.loadJsScriptCss(Config.FilePath, '', function() {}, Config.FileName);

    var Cache = {
        caches: {},
        timers: {},
        getCache: function(id) {
            return Cache.caches['gm_' + id];
        },
        setCache: function (id, map) {
            Cache.caches['gm_' + id] = {
                id: id,
                map: map,
            };
            return this;
        }
    };

    var Factory = {
        buildMap: function (id, options) {
            var opt = {};
            if ($.isElement(id)) {
                $.extend(opt, options, { canvas: id, id: id.id });
            } else if ($.isString(id, true)) {
                var canvas = $.toElement(id);
                $.extend(opt, options, { canvas: canvas, id: id });
            } else {
                $.extend(opt, id, options);
                opt.canvas = $.toElement(opt.canvas);
            }

            if (!opt.canvas || !$.isElement (opt.canvas)) {
                return null;
            }
            var cache = Cache.getCache(opt.id), map;
            if (cache) {
                map = cache.map;
            } else {
                map = new Map(opt);
                Cache.setCache(opt.id, map);
            }
            return map;
        },
        isPoint: function (point) {
            if (point && $.isObject(point) && $.isNumber(point.latitude) && $.isNumber(point.longitude)) {
                return true;
            }
            return false;
        },
        // 经纬度转换为Canvas坐标
        latLngToCanvas: function (map, point) {
            let view = map.view, 
                opt = map.options,
                canvas = map.canvas,
                center = map.center(),
                lat = point[opt.vertical ? 'height' : 'latitude'],
                lng = point[opt.vertical ? 'distance' : 'longitude'],
                x, y;

            // 简化的经纬度到平面坐标的转换
            // 实际应用中可能需要使用墨卡托投影等更精确的方法
            x = (lng - center.longitude) * view.scale + canvas.width / 2 + view.offsetX;
            y = (center.latitude - lat) * view.scale + canvas.height / 2 + view.offsetY;

            return { x, y };
        },
        getTextSize: function (text, fontSize) {
            return $.getContentSize(text, { cssText: 'font-size:' + fontSize + 'px;' });
        },
        setTextPosition: function (map, position, pointPos, radius, fontSize, text) {
            let that = this, canvas = map.canvas,
                textPos = {}, pos = pointPos, 
                textSize = that.getTextSize(text, fontSize),
                // 垂直居中的文字偏移
                offsetY = fontSize / 3, fontPadding = 3,
                leftPos = pos.x - radius - fontPadding,
                rightPos = pos.x + radius + fontPadding;

            switch(position){
            case 0:
                if (rightPos + textSize.width > canvas.width) {
                    rightPos = canvas.width - textSize.width;
                }
                textPos = { x: rightPos, y: pos.y + radius + textSize.height };
                break;
            case 1:
                textPos = { x: leftPos - textSize.width, y: pos.y - radius - fontPadding };
                break;
            case 4:
                textPos = { x: leftPos - textSize.width, y: pos.y + offsetY };
                break;
            case 7:
                textPos = { x: leftPos - textSize.width, y: pos.y + radius + textSize.height + fontPadding };
                break;
            case 2:
                textPos = { x: pos.x - textSize.width / 2, y: pos.y - radius - fontPadding };
                break;
            case 5:
                textPos = { x: pos.x - textSize.width / 2, y: pos.y + offsetY };
                break;
            case 8:
                textPos = { x: pos.x - textSize.width / 2, y: pos.y + radius + textSize.height + fontPadding };
                break;
            case 3:
                textPos = { x: rightPos, y: pos.y - radius - fontPadding };
                break;
            case 6:
                textPos = { x: rightPos, y: pos.y + offsetY };
                break;
            case 9:
                textPos = { x: rightPos, y: pos.y + radius + textSize.height + fontPadding };
                break;
            }
            return textPos;
        },
        setDistancePosition: function (map, position, pointPos, posTo, radius, fontSize, text) {
            let that = this, view = map.view, canvas = map.canvas,
                distancePos = {}, pos = pointPos,
                textSize = that.getTextSize(text, fontSize),
                fontPadding = 3,
                floatPos = pos.x + radius + fontPadding;

            switch(position) {
            case 0:
                distancePos = { x: floatPos, y: pos.y + radius + textSize.height  };
                break;
            case 1:
                distancePos = { x: floatPos, y: posTo.y + radius + textSize.height  };
                break;
            case 2:
                distancePos = { x: (pos.x + posTo.x) / 2, y: (pos.y + posTo.y) / 2 };
                break;
            }

            if (view.overview && distancePos.x + textSize.width > canvas.width) {
                distancePos.x = canvas.width - textSize.width - fontPadding;
            }

            return distancePos;
        },
        render: function (map) {
            const that = this, view = map.view, canvas = map.canvas, ctx = map.ctx;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            that.drawGrid(map);
            that.drawPoints(map);
            that.drawCenter(map);

            that.showPanel(map);

            that.drawRules(map);
            that.drawPosition(map);

            return that;
        },
        drawGrid: function (map) {
            const opt = map.options;

            if (!opt.showGridSize) {
                return this;
            }
            let view = map.view, canvas = map.canvas, ctx = map.ctx,
                style = $.extend({
                    width: 50, height: 50, fixed: true, lineWidth: 0.1, color: '#000', dash: [1, 1]
                }, opt.gridStyle),
                gridWidth = style.width * (style.fixed ? 1 : view.scale),
                gridHeight = style.height * (style.fixed ? 1 : view.scale),
                lineWidth = style.lineWidth,
                startX = (view.offsetX % gridWidth + gridWidth) % gridWidth,
                startY = (view.offsetY % gridHeight + gridHeight) % gridHeight;
            
            ctx.strokeStyle = style.color;
            ctx.lineWidth = lineWidth;
            ctx.setLineDash(!style.dash ? [] : style.dash);

            // 细线条配置：关闭抗锯齿（提升清晰度）
            ctx.imageSmoothingEnabled = false;
            
            // 绘制垂直线
            for (let x = startX; x < canvas.width; x += gridWidth) {
                ctx.beginPath();
                ctx.moveTo(x + lineWidth, 0);
                ctx.lineTo(x + lineWidth, canvas.height);
                ctx.stroke();
            }
            
            // 绘制水平线
            for (let y = startY; y < canvas.height; y += gridHeight) {
                ctx.beginPath();
                ctx.moveTo(0, y + lineWidth);
                ctx.lineTo(canvas.width, y + lineWidth);
                ctx.stroke();
            }
            return this;
        },
        drawLine: function (map, ctx, pos1, pos2, lineStyle) {
            var that = this,
                style = $.extend({
                    color: '#f00',
                    width: 1,
                    dash: false
                }, lineStyle);

            ctx.beginPath();

            ctx.setLineDash(!style.dash ? [] : style.dash);

            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(pos2.x, pos2.y);

            ctx.strokeStyle = style.color;
            ctx.lineWidth = style.width;
            ctx.lineCap = 'round';

            ctx.stroke();
            ctx.fill();

            return that;
        },
        drawCenter: function (map) {
            if (!map.options.showCenter) {
                return this;
            }
            var point = map.center();
            point = $.extend({radius: 5, color: '#000', name: '中心点', textStyle: {
                color: '#f00', position: 8
            }}, point);
            return this.drawPoint(point, map);  
        },
        drawText: function (ctx, text, pos, textStyle) {
            let style = $.extend({color: '#333', font: Config.TextFont}, textStyle);
            // 绘制标签
            ctx.fillStyle = style.color;
            ctx.font = style.font;
            ctx.fillText(text, pos.x, pos.y);
            return this;
        },
        dealDistance: function (distance, style) {
            if (distance > 1000) {
                distance = (distance / 1000).round(style.decimal);
                style.unit = 'km';
            } else {
                if (style.ratio > 1) {
                    distance = (distance * style.ratio).round(style.decimal);
                } else {
                    distance = distance.round(style.decimal);
                }
            }
            return distance;
        },
        drawVerticalLine: function (map, point, pointTo, style) {
            let that = this, ctx = map.ctx, 
                pos = that.latLngToCanvas(map, point), 
                posTo, potTmp;

            if (point.distance === pointTo.distance || point.height === pointTo.height) {
                posTo = that.latLngToCanvas(map, pointTo);
                that.drawLine(map, ctx, pos, posTo, style);
            } else {
                let pointTmp = { distance: point.distance, height: pointTo.height };
                potTmp = that.latLngToCanvas(map, pointTmp);
                that.drawLine(map, ctx, pos, potTmp, style);

                pointTmp = { distance: pointTo.distance, height: pointTo.height };
                posTo = that.latLngToCanvas(map, pointTmp);
                that.drawLine(map, ctx, potTmp, posTo, style);
            }

            return this;
        },
        drawPoint: function (map, point) {
            let that = this,
                opt = map.options,
                ctx = map.ctx,
                radius = point.radius || 4,
                pos = that.latLngToCanvas(map, point),
                lines = that.getParamArray(point.lines || point.line),
                distances = that.getParamArray(point.distances || point.distance),
                texts = that.getParamArray(point.texts || point.text || point.name, true),
                i, pointTo, posTo, style = {},
                text, textPos, fontSize;

            // 绘制点
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = point.color || '#f00';
            ctx.fill();

            if (opt.showLine) {
                for (i = 0; i < lines.length; i++) {
                    // 找线条的另一个点，必须是在地图中已经注册过的点
                    pointTo = that.getPointCache(map, lines[i]);
                    style = $.extend({}, opt.lineStyle, point.lineStyle, lines[i]);
                    if (pointTo) {
                        if (opt.vertical && style.vertical) {
                            that.drawVerticalLine(map, point, pointTo, style);
                        } else {
                            posTo = that.latLngToCanvas(map, pointTo);
                            that.drawLine(map, ctx, pos, posTo, style);
                        }
                    }
                }
            }
            if (opt.showText) {
                for (i = 0; i < texts.length; i++) {
                    style = $.extend({}, opt.textStyle, point.textStyle, texts[i]);
                    fontSize = parseInt(style.font, 10);
                    text = that.getPointText(texts[i]);
                    textPos = that.setTextPosition(map, style.position, pos, radius, fontSize, text);
                    that.drawText(ctx, text, textPos, style);
                }
            }
            if (opt.showDistance) {
                let distance, heightDistance;
                for (i = 0; i < distances.length; i++) {
                    // 找到要计算距离的点，必须是在地图中已经注册过的点
                    pointTo = that.getPointCache(map, distances[i]);
                    if (pointTo) {
                        if (opt.vertical) {
                            distance = point.height - pointTo.height;
                        } else {
                            distance = $.calcLocationDistance(point, pointTo, opt.plane);
                        }
                        style = $.extend({}, opt.distanceStyle, point.distanceStyle, distances[i]);
                        fontSize = parseInt(style.font, 10);

                        if (style.maxDistance && distance > style.maxDistance) {
                            continue;
                        }
                        distance = that.dealDistance(distance, style);

                        text = (style.prefix || '') +  distance + style.unit;
                        if (!opt.vertical && opt.showHeight) {
                            style = $.extend({}, opt.distanceStyle, point.distanceStyle, distances[i]);
                            heightDistance = point.height - pointTo.height;
                            if (!isNaN(heightDistance)) {
                                heightDistance = that.dealDistance(heightDistance, style);
                                text += ' (高差:' + heightDistance + style.unit + ')';
                            }
                        }
                        textPos = that.setDistancePosition(map, style.position, pos, posTo, radius, fontSize, text);

                        that.drawText(ctx, text, textPos, style);
                    }
                }
            }

            return that;
        },
        drawPoints: function (map) {
            let that = this, points = map.view.points, ctx = map.ctx, len = points.length;
            for (var i = 0; i < len; i++) {
                that.drawPoint(map, points[i]);
            }
            return this;
        },
        showRules: function (map, vertical) {
            let that = this,
                opt = map.options, view = map.view,
                box = map.panels.scaleRule,
                nodes = box ? box.querySelectorAll('div') : undefined,
                attr = 'width',
                rule = that.getScaleLevel(map, view.scaleLevel, view.scale, vertical),
                ruleWidth = rule.width || 50,
                ruleText = rule.text;

            if (!box) {
                return that;
            }

            if (!nodes || !nodes.length) {
                box.innerHTML = [
                    '<div class="text"></div>',
                    '<div class="line2"></div>',
                    '<div class="line"></div>',
                ].join('');
                nodes = box.querySelectorAll('div');
            }

            nodes[0].style[attr] = (ruleWidth + 4) + 'px';
            nodes[0].innerHTML = ruleText;

            nodes[1].style[attr] = ruleWidth + 'px';
            nodes[2].style[attr] = ruleWidth + 'px';

            return that;
        },
        drawRules: function (map, force) {
            this.showRules(map, map.options.vertical);
            return this;
        },
        showPosition: function (map, point) {
            let that = this, 
                opt = map.options, 
                view = map.view, 
                elem = map.panels.position;

            if (!elem) {
                return that;
            }

            if (!point) {
                point = view.curPoint;
            }
            if (!opt.showPosition || !that.isPoint(point)) {
                elem.innerHTML = '';
                return that;
            }
            if (opt.vertical) {
                elem.innerHTML = [point.latitude.round(3), point.longitude.round(3)].join(',');
            } else {
                elem.innerHTML = [point.latitude, point.longitude].join(',');
            }

            return that;
        },
        showTitle: function (map, title) {
            let opt = map.options, canvas = map.canvas, elem = map.panels.title;
            if (!opt.showTitle || !elem) {
                return this;
            }

            if (title !== null) {
                title = title || opt.title;
                elem.innerHTML = title;
            }
            elem.style.left = (canvas.width / 2 - elem.offsetWidth / 2) + 'px';

            return this;
        },
        buildPanel: function (map) {
            function _build (className, zindex, html) {
                let div = document.createElement('DIV');
                div.className = className;
                div.style.cssText = [ 'z-index:', zindex, ';' ].join('');
                div.innerHTML = html || '';
                map.box.appendChild(div);

                return div;
            }
            let opt = map.options,
                zindex = parseInt('0' + $.getElementStyle(map.canvas, 'z-index'), 10) + 1,
                div = _build('oui-gmap-bottom', zindex, [
                    '<div class="oui-gmap-position" style="z-index:', zindex + 2, ';"></div>',
                    '<div class="oui-gmap-rule"></div>',
                    '<div class="oui-gmap-shade" style="z-index:', zindex + 1, ';"></div>'
                ].join(''));

            if (opt.showRule) {
                map.box.appendChild(div);
                map.panels.bottom = div;
                map.panels.position = div.childNodes[0];
                map.panels.scaleRule = div.childNodes[1];
            }

            if (opt.showScale) {
                div = _build('oui-gmap-scale', zindex, [
                    '<a class="center" title="中心点"></a>',
                    '<a class="overview', opt.showOverview ? ' press' : '', '" title="', opt.showOverview ? '退出全览' : '固定全览', '"></a>',
                    '<a class="add level" title="放大一级">+</a>',
                    '<a class="sub level" title="缩小一级">-</a>',
                ].join(''));
                map.panels.scale = div;

                let nodes = div.querySelectorAll('A');
                for(var i = 0; i < nodes.length; i++) {
                    $.addListener(nodes[i], 'click', function(e) {
                        let node = this;
                        $.debounce({
                            id:'oui-gmap-', delay:150, timeout:2000
                        }, function(e) {
                            switch(node.className.split(' ')[0]) {
                            case 'center':
                                map.center(true);
                                break;
                            case 'overview':
                                // 全览按钮为切换模式
                                let overview = map.options.showOverview;
                                map.options.showOverview = !overview;
                                map.overview(map.options.showOverview);
                                $.setClass(node, 'press', opt.showOverview ? 'add' : 'remove');
                                node.title = opt.showOverview ? '退出全览' : '固定全览';
                                break;
                            case 'add':
                                map.scaleLevel(null, 1);
                                break;
                            case 'sub':
                                map.scaleLevel(null, -1);
                                break;
                            }
                        });
                    });
                }
            }

            if (opt.showTitle) {
                div = _build('oui-gmap-title', zindex, [].join(''));
                map.panels.title = div;
            }

            return this;
        },
        showPanel: function (map) {
            let panels = map.panels, canvas = map.canvas;

            panels.bottom.style.width = canvas.width + 'px';
            return this;
        },
        drawPosition: function (map, point) {
            return this.showPosition(map, point);
        },
        setPointCache: function (map) {
            let view = map.view, caches = {}, points = view.points, len = points.length, i, key, p;
            for (i = 0; i < len; i++) {
                p = points[i];
                if (!p.id) {
                    p.id = i;
                }
                key = 'pc_' + p.id;
                caches[key] = points[i];
            }
            view.caches = caches;

            return this;
        },
        getPointCache: function (map, pointTo) {
            let caches = map.view.caches, key;
            if (this.isPoint(pointTo)) {
                return pointTo;
            }
            if ($.isObject(pointTo)) {
                if (this.isPoint(pointTo.point || pointTo.id)) {
                    return pointTo.point || pointTo.id;
                }
                key = 'pc_' + pointTo.id;
            } else {
                key = 'pc_' + pointTo;
            }
            var point = caches[key];

            return this.isPoint(point) ? point : null;
        },
        getParamArray: function (arg, text) {
            var arr = [];
            if ($.isArray(arg)) {
                arr = arg;
            } else if ($.isObject(arg)) {
                arr = [arg];
            } else if($.isString(arg)) {
                if (text) {
                    arr = [{ text: arg }];
                } else {
                    arr = [{ id: arg }];
                }
            }
            return arr;
        },
        getPointText: function (arg) {
            if ($.isString(arg)) {
                return arg;
            }
            if ($.isObject(arg)) {
                return arg.text || arg.name;
            }
            return null;
        },
        setOffset: function (map, offsetX, offsetY) {
            if ($.isNumber(offsetY)) {
                map.view.offsetX = offsetX;
            }
            if ($.isNumber(offsetY)) {
                map.view.offsetY = offsetY;
            }
            return this;
        },
        setCenter: function (map, point) {
            if (!this.isPoint(point)) {
                return this;
            }
            let opt = map.options,
                lat = point['latitude'],
                lng = point['longitude'];

            if (opt.vertical && typeof point['distance'] !== 'undefined') {
                lat = point['height'];
                lng = point['distance'];
            }

            map.view.curCenter = {
                latitude: lat,
                longitude: lng,
                height: point.height,
            };
            this.setOffset(map, 0, 0);

            return this;
        },
        calcPolygonCenter: function (points, vertical) {
            if (!$.isArray(points) || points.length <= 0) {
                return null;
            }
            let len = points.length, i, lat = 0, lng = 0;
            if (vertical) {
                for (i = 0; i < len; i++) {
                    lat += points[i].height;
                    lng += points[i].distance;
                }
            } else {
                for (i = 0; i < len; i++) {
                    lat += points[i].latitude;
                    lng += points[i].longitude;
                }
            }
            lat /= len;
            lng /= len;

            return { latitude: lat, longitude: lng };
        },
        getMin: function (arr, field) {
            let val = arr[0][field], len = arr.length;
            for (var i = 1; i < len; i++) {
                val = Math.min(val, arr[i][field]);
            }
            return val;
        },
        getMax: function (arr, field) {
            let val = arr[0][field], len = arr.length;
            for (var i = 1; i < len; i++) {
                val = Math.max(val, arr[i][field]);
            }
            return val;
        },
        // 计算多边形最小包围盒，
        calcPolygonBox: function (map, points) {
            let that = this, opt = map.options,
                minX = 0, minY = 0, maxX = 0, maxY = 0, len = points.length,
                fieldLat = opt.vertical ? 'height' : 'latitude',
                fieldLng = opt.vertical ? 'distance': 'longitude';

            if (len <= 1) {
                return null;
            }

            if (len > 3) {
                minX = that.getMin(points, fieldLng);
                maxX = that.getMax(points, fieldLng);
                minY = that.getMin(points, fieldLat);
                maxY = that.getMax(points, fieldLat);
            } else {
                minX = Math.min(points[0].longitude, points[1][fieldLng]);
                maxX = Math.max(points[0].longitude, points[1][fieldLng]);

                minY = Math.min(points[0].latitude, points[1][fieldLat]);
                maxY = Math.max(points[0].latitude, points[1][fieldLat]);
            }

            return {
                minX, minY, maxX, maxY,
                width: maxX - minX,
                height: maxY - minY,
                centerX: (minX + maxX) / 2,
                centerY: (minY + maxY) / 2
            };
        },
        initScaleLevel: function (map) {
            let opt = map.options, view = map.view,
                rules = map.rules(), len = rules.length,
                distanceRatio = opt.vertical ? Config.HeightDistance : Config.DegreeDistance;

            for (var i = 0; i < len; i++) {
                let dr = rules[i];
                dr.level = i + 1;
                dr.scale = {
                    val: distanceRatio * Config.DistanceWidth / dr.val,
                    // 请注意，这里的大小是相反的
                    min: distanceRatio * Config.DistanceWidth / dr.val,
                    max: distanceRatio * Config.DistanceWidth / dr.min
                };
            }
            view.minScaleRatio = distanceRatio * Config.DistanceWidth / rules[0].val;
            view.maxScaleRatio = distanceRatio * Config.DistanceWidth / rules[len - 1].min;

            if (opt.showLog) {
                $.console.log('initScaleLevel:', view.minScaleRatio, view.maxScaleRatio, rules);
            }

            return this;
        },
        initPoints: function (map, points) {
            let opt = map.options;
            if (opt.vertical) {
                let len = points.length, i, p0 = points[0];
                for (i = 0; i < len; i++) {
                    let p = points[i];
                    if (i === 0) {
                        // 第1个点的水平位置定位到地图中心点的位置
                        p.distance = 0;
                    } else {
                        p.distance = $.calcLocationDistance(p0, p, opt.plane);
                        if (p.longitude < p0.longitude) {
                            p.distance *= -1;
                        }
                    }
                }
                if (opt.showLog) {
                    $.console.log('initPoints:', points);
                }
            }

            return this;
        },
        getScaleLevel: function (map, scaleLevel, scale, vertical) {
            let rules = map.rules(), 
                len = rules.length;

            if (scaleLevel < 1) {
                scaleLevel = 1;
            } else if(scaleLevel > len) {
                scaleLevel = len;
            }
            let rule = $.extend({ width: 50, }, rules[scaleLevel - 1]);
            if (scale && rule.scale) {
                rule.width = (rule.width * (scale / rule.scale.val)).round(3);
            }
            return rule;
        },
        setScaleLevel: function (map, scale, scaleLevel) {
            let that = this, view = map.view, opt = map.options,
                rules = map.rules(), len = rules.length,
                rule, lastScale = view.scale;

            if (opt.showLog) {
                $.console.log('setScaleLevel[0], scale:', view.scale, ', scaleLevel:', view.scaleLevel);
            }

            if (!scale && !scaleLevel) {
                return that;
            }

            if ($.isNumber(scaleLevel)) {
                if (scaleLevel < 1) {
                    // 若缩放等级为0，则保持原比例不缩放
                    scaleLevel = view.scaleLevel;
                } else if(scaleLevel > len) {
                    scaleLevel = len;
                }
                rule = that.getScaleLevel(map, scaleLevel);
                view.scale = rule.scale.val;
            } else if ($.isNumber(scale) && scale) {
                scaleLevel = 1;
                for (var i = 0; i < len; i++) {
                    let dr = rules[i];
                    if (scale > dr.scale.min && scale <= dr.scale.max) {
                        scaleLevel = i + 1;
                        break;
                    }
                }
                rule = that.getScaleLevel(map, scaleLevel, scale);
                view.scale = scale;
            }

            if (rule) {
                view.scaleLevel = rule.level;
                if (opt.showLog) {
                    $.console.log('setScaleLevel[1], scale:', view.scale, ', scaleLevel:', view.scaleLevel, 
                        ', center: ', map.center(), ', offsetX:', view.offsetX, ', offsetY:', view.offsetY);
                }
            }

            return that;
        },
        setScale: function (map, scale, overview, autoOverview) {
            let that = this, opt = map.options, view = map.view;

            if ($.isNumber(scale) && scale > 0) {
                view.scale = scale;
            } else {
                let opt = map.options,
                    canvas = map.canvas,
                    center = map.center(),
                    maxLat = 0, maxLng = 0, maxDegree = 0, maxHeight = 0,
                    points = view.points, len = points.length;

                if (overview) {
                    if(len > 1) {
                        // 计算多边形最小包围盒
                        let box = that.calcPolygonBox(map, points), 
                            ratio = opt.overviewRatio,
                            widthScale = canvas.width / box.width * ratio,
                            heightScale = canvas.height / box.height * ratio,
                            point = { latitude: box.centerY, longitude: box.centerX };

                        // 取多边形包围盒的中点作为中心点
                        that.setCenter(map, point);
                        // 计算新的缩放比率
                        scale = Math.min(widthScale, heightScale) * ratio;
                    }

                    // 当前比例大于新比例，或者新比例大于当前比例的两倍时，启用新的比例
                    if ($.isNumber(scale) && (autoOverview || opt.autoOverview || view.scale > scale || scale > view.scale * 2)) {
                        view.scale = scale;
                    }
                }
            }
            that.setScaleLevel(map, view.scale);

            return this;
        },
        setOverview: function (map, overview, autoOverview) {
            let that = this, 
                opt = map.options,
                view = map.view, 
                center = map.center(), 
                scale = view.scale,
                points = view.points;

            if (points.length > 0) {
                center = that.calcPolygonCenter(points, opt.vertical);
                that.setCenter(map, center);
            }

            // 设置全览模式
            view.overview = overview;

            that.setScale(map, null, overview, autoOverview);

            return that;
        },
        setCurrentPoint: function (map, point) {
            map.view.curPoint = $.extend({}, point);
            return this;
        },
        handleMouseDown: function (e, map) {
            $.cancelBubble(e);
            if (e.ctrlKey || e.metaKey) {
                return this;    
            }
            if (!e.button) {
                const rect = map.canvas.getBoundingClientRect();
                map.view.dragging = true;
                map.view.lastX = e.clientX - rect.left;
                map.view.lastY = e.clientY - rect.top;
            }
            return this;
        },
        handleMouseMove: function (e, map) {
            $.cancelBubble(e);
            let that = this, opt = map.options, 
                view = map.view, canvas = map.canvas,
                rect = canvas.getBoundingClientRect(),
                mouseX = e.clientX - rect.left,
                mouseY = e.clientY - rect.top;

            if (opt.showPosition && e.target === canvas) {
                const center = map.center();
                
                // 计算鼠标位置对应的经纬度
                const mouseLat = center.latitude - (mouseY - canvas.height / 2 - view.offsetY) / view.scale,
                    mouseLng = (mouseX - canvas.width / 2 - view.offsetX) / view.scale + center.longitude,
                    point = { latitude: mouseLat, longitude: mouseLng };

                that.setCurrentPoint(map, point);

                that.drawPosition(map, point);

                if ($.isFunction(opt.positionCallback)) {
                    opt.positionCallback(point, map);
                }
            }

            if (!view.dragging) {
                return that;
            }
            
            let deltaX = mouseX - view.lastX,
                deltaY = mouseY - view.lastY,
                overview = view.overview;

            // 鼠标缩放之后，退出全览模式
            view.overview = false;

            view.offsetX += deltaX;
            view.offsetY += deltaY;
            
            view.lastX = mouseX;
            view.lastY = mouseY;
            
            that.render(map);

            // 还原全览设置
            view.overview = overview;

            return that;
        },
        handleMouseUp: function (e, map) {
            $.cancelBubble(e);
            map.view.dragging = false;
            return this;
        },
        handleMouseOut: function (e, map) {
            $.cancelBubble(e);
            this.setCurrentPoint(map, null).drawPosition(map, null);
            return this;
        },
        handleWheel: function (e, map) {
            e.preventDefault();
            const that = this, view = map.view, canvas = map.canvas, opt = map.options;
            
            // 获取鼠标在Canvas上的位置
           let rect = canvas.getBoundingClientRect(),
                mouseX = e.clientX - rect.left,
                mouseY = e.clientY - rect.top,
                center = map.center(),
                lastScale = view.scale,
                overview = view.overview;

            // 计算鼠标位置对应的经纬度
            const mouseLat = center.latitude - (mouseY - canvas.height / 2 - view.offsetY) / view.scale,
                mouseLng = (mouseX - canvas.width / 2 - view.offsetX) / view.scale + center.longitude,
                point = { latitude: mouseLat, longitude: mouseLng },
                // 确定缩放方向
                zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            
            // 更新缩放比例
            view.scale *= zoomFactor;
            
            // 限制缩放范围
            view.scale = Math.max(view.minScaleRatio, Math.min(view.maxScaleRatio, view.scale));

            // 鼠标缩放之后，退出全览模式
            view.overview = false;

            that.setScale(map, view.scale);

            that.setCurrentPoint(map, point);

            if ($.isFunction(opt.positionCallback)) {
                opt.positionCallback(point, map);
            }
            
            // 调整中心点，使鼠标位置保持固定
            const newMouseX = (mouseLng - center.longitude) * view.scale + canvas.width / 2 + view.offsetX;
            const newMouseY = (center.latitude - mouseLat) * view.scale + canvas.height / 2 + view.offsetY;
            
            view.offsetX += mouseX - newMouseX;
            view.offsetY += mouseY - newMouseY;

            $.console.log('lastScale:', lastScale, view.scale);
            
            if (lastScale !== view.scale) {
                Factory.render(map);
            }

            // 还原全览设置
            view.overview = overview;

            return that;
        }
    };

    function Map(options) {
        var opt = $.extend({
            canvas: null,
            // 是否平面地图
            plane: false,
            // 是否垂直高度地图
            vertical: false,
            // 地图标题
            title: '',
            // 缩放比例
            scale: 1,
            // 缩放等级
            scaleLevel: 5,
            // 网格样式
            gridStyle: {
                // 网格宽度
                width: 50,
                // 网格高度
                height: 50,
                // 是否固定网格的大小
                fixed: true,
                color: '#000',
                lineWidth: 0.1,
                dash: [1, 1]
            },
            // 是否显示网格线
            showGridSize: true,
            // 是否启用全览
            showOverview: false,
            // 是否自动全览，始终保持在合适的全览比例
            autoOverview: false,
            // 全览比率，0.85表示缩放至85%
            overviewRatio: 0.85,
            // 是否显示中心点
            showCenter: false,
            // 是否显示点的名称标签
            showText: true,
            // 是否显示比例尺
            showRule: true,
            // 是否显示缩放按钮
            showScale: false,
            // 是否显示地图标题
            showTitle: true,
            // 是否显示当前鼠标位置的经纬度
            showPosition: false,
            // 是否打印日志信息
            showLog: true,
            // 经纬度小数位数，0 表示不限制
            decimalLength: 0,
            // 是否显示两点间的连线
            showLine: true,
            // 是否计算并显示两点之间的距离
            showDistance: true,
            // 是否显示高差
            showHeight: false,
            // 连线距离文字样式
            distanceStyle: {
                // 不限制距离，距离单位：米
                maxDistance: 0,
                // 距离文字的位置：0 - 起点， 1 - 终点， 2 - 中心点
                position: 0,
                // 默认单位是米，所以倍率是1
                ratio: 1,
                // 单位和倍率是成对的，别搞错了
                unit: 'm',
                // 保留小数位数
                decimal: 3,
                // 距离文字前缀
                prefix: '',
                font:'20px Arial',color:'#f00'
            },
            textStyle: { 
                font:'14px Arial', color:'#f00', position: 3 
            },
            lineStyle: {
                width: 1, color: '#f00'
            },
            positionCallback: function(pos, map) {
                /*
                $.console.log(
                    'latitude:', pos.latitude, ', longitude:', pos.longitude, 
                    ', scale:', map.view.scale, ', center: ', map.center()
                );
                */
            },
            scaleRules: $.extend([], Config.ScaleLevels),
            heightRules: $.extend([], Config.HeightLevels),
            points: []
        }, options);

        this.options = opt;
        this.canvas = opt.canvas;
        this.panels = {};
        this.ctx = this.canvas.getContext('2d');
        this.id = this.canvas.id;
        this.view = {
            //最小比例，50个像素所能代表的最大距离
            minScaleRatio: 1,
            //最大比例，50个像素所能代表的最小距离
            maxScaleRatio: 1,
            defCenter: {
                latitude: 0,
                longitude: 0,
                height: 0
            },
            curCenter: null,
            // 鼠标当前所在的位置的经纬度坐标
            //curPoint: { latitude: 0, longitude: 0 },
            curPoint: null,
            overview: false,    // 是否全览模式
            dragging: false,    // 是否正在移动

            scale: opt.scale,   // 缩放比例
            scaleLevel: opt.scaleLevel,      // 缩放等级

            offsetX: 0,         // X轴偏移
            offsetY: 0,         // Y轴偏移

            //光标最后的位置
            lastX: 0,           
            lastY: 0,

            points: [],
            caches: {}
        };

        if ($.isArray(opt.points)) {
            this.view.points = opt.points;
        }

        this.initial();
    }

    Map.prototype = {
        initial: function() {
            var that = this, opt = that.options, canvas = that.canvas, view = that.view;

            var box = canvas.parentNode;
            if (box.tagName === 'DIV') {
                box.style.position = 'relative';
                box.style.overflow = 'hidden';
                this.box = box;
            }

            Factory.buildPanel(that)
                .showTitle(that, opt.title)
                .setPointCache(that)
                .initScaleLevel(that)
                .initPoints(that, view.points)
                .setScaleLevel(that, null, view.scaleLevel);

            $.addListener(window, 'resize', function(e) {
                that.size();
            });
            
            $.addListener(canvas, 'mousedown', function(e) {
                Factory.handleMouseDown(e, that);
            });
            $.addListener([canvas, document], 'mousemove', function(e) {
                Factory.handleMouseMove(e, that);
            });
            $.addListener([canvas, document], 'mouseup', function(e) {
                Factory.handleMouseUp(e, that);
            });
            $.addListener(canvas, 'mouseout', function(e) {
                Factory.handleMouseOut(e, that);
            });
            $.addListener(canvas, 'wheel', function(e) {
                Factory.handleWheel(e, that);
            });

            if (opt.showOverview) {
                Factory.setOverview(that, true);
            }
            return Factory.render(that), that;
        },
        size: function (size) {
            let that = this;
            if (size && size.width && size.height) {
                that.canvas.width = size.width;
                that.canvas.height = size.height;
            } else if (that.box) {
                that.canvas.width = that.box.clientWidth;
                that.canvas.height = that.box.clientHeight;
            }
            if (that.options.showOverview) {
                Factory.setOverview(that, true);
            }
            Factory.showTitle(that, null);

            return Factory.render(that), that;
        },
        center: function (point, scale) {
            let that = this, view = that.view,
                centerPoint = view.curCenter ? view.curCenter : view.defCenter;

            if ($.isBoolean(point, false)) {
                that.overview(false);
                point = centerPoint;
            }
            if (Factory.isPoint(point)) {
                Factory.setCenter(that, point);
                if (scale) {
                    Factory.setScale(that, scale);
                }
                return Factory.render(that), that;
            }
            return centerPoint;
        },
        offset: function (map, x, y) {
            return Factory.setOffset(map, x, y), this;
        },
        rules: function (rules) {
            let opt = this.options;
            if ($.isArray(rules)) {
                if (opt.vertical) {
                    opt.heightRules = $.extend([], rules);
                } else {
                    opt.scaleRules = $.extend([], rules);
                }
                return this;
            }
            return opt.vertical ? opt.heightRules : opt.scaleRules;
        },
        scale: function (scale) {
            let that = this;
            if (!$.isNumber(scale) || !scale) {
                return that.view.scale;
            }
            Factory.setScale(that, scale);

            return Factory.render(that), that;
        },
        scaleLevel: function (level, action) {
            var that = this;
            if (!$.isNumber(level) && !$.isNumber(action)) {
                return that;
            }
            switch(action) {
            case 1:
                level = that.view.scaleLevel + 1;
                break;
            case -1:
                level = that.view.scaleLevel - 1;
                break;
            }
            Factory.setScaleLevel(that, null, level);

            return Factory.render(that), that;
        },
        overview: function (overview) {
            overview = $.isBoolean(overview, true);
            Factory.setOverview(this, overview, true).render(this);
            return this;
        },
        update: function (points, append) {
            var that = this, opt = that.options;
            if ($.isArray(points)) {
                if (append) {
                    that.view.points.concat(points);
                } else {
                    that.view.points = points;
                }
                Factory.initPoints(that, that.view.points);
                Factory.setPointCache(that);

                points = that.view.points;

                if (opt.showOverview) {
                    Factory.setOverview(that, true);
                }/* else if (opt.vertical) {
                    let center = Factory.calcPolygonCenter(points, opt.vertical);
                    Factory.setCenter(that, center);
                }*/
                Factory.render(that);
            }
            return that;
        },
        append: function (points) {
            return this.update(points, true);
        },
        clear: function () {
            this.view.points = [];
            return Factory.render(this), this;
        }
    };

    $.extend({
        gmap: function (id, options) {
            return Factory.buildMap(id, options);
        }
    })

} (OUI);