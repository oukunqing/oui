/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.gmap 网格地图
*/

!function ($) {
    'use strict';

    const Lang = {
        // 公里
        km: '\u516c\u91cc',
        // 米
        m: '\u7c73',
        // 厘米
        cm: '\u5398\u7c73',
        // 毫米
        mm: '\u6beb\u7c73',
        // 高差
        heightDistance: '\u9ad8\u5dee',
        // 中心点
        centerPoint: '\u4e2d\u5fc3\u70b9',
        // 退出全览
        exitOverview: '\u9000\u51fa\u5168\u89c8',
        // 固定全览
        fixOverview: '\u56fa\u5b9a\u5168\u89c8',
        // 缩放等级
        scaleLevel: '\u7f29\u653e\u7b49\u7ea7',
        // 放大一级
        zoomIn: '\u653e\u5927\u4e00\u7ea7',
        // 缩小一级
        zoomOut: '\u7f29\u5c0f\u4e00\u7ea7'
    };

    const Config = {
        FilePath: $.getScriptSelfPath(true),
        FileName: 'oui.gmap.',
        TextFont: '12px Arial',
        MinScaleLevel: 1,
        MaxScaleLevel: 32,
        ScaleLevels: [
            { val: 1000 * 1000, min: 500 * 1000, text: '1000' + Lang.km },
            { val: 500 * 1000, min: 200 * 1000, text: '500' + Lang.km },
            { val: 200 * 1000, min: 100 * 1000, text: '200' + Lang.km },
            { val: 100 * 1000, min: 75 * 1000, text: '100' + Lang.km },
            { val: 75 * 1000, min: 50 * 1000, text: '75' + Lang.km },
            { val: 50 * 1000, min: 25 * 1000, text: '50' + Lang.km },
            { val: 25 * 1000, min: 20 * 1000, text: '25' + Lang.km },
            { val: 20 * 1000, min: 10 * 1000, text: '20' + Lang.km },
            { val: 10 * 1000, min: 5 * 1000, text: '10' + Lang.km },
            { val: 5 * 1000, min: 2 * 1000, text: '5' + Lang.km },

            { val: 2 * 1000, min: 1 * 1000, text: '2' + Lang.km },
            { val: 1 * 1000, min: 500, text: '1' + Lang.km },
            { val: 500, min: 200, text: '500' + Lang.m },
            { val: 200, min: 100, text: '200' + Lang.m },
            { val: 100, min: 50, text: '100' + Lang.m },
            { val: 50, min: 25, text: '50' + Lang.m },
            { val: 25, min: 20, text: '25' + Lang.m },
            { val: 20, min: 10, text: '20' + Lang.m },
            { val: 10, min: 5, text: '10' + Lang.m },
            { val: 5, min: 2, text: '5' + Lang.m },

            { val: 2, min: 1, text: '2' + Lang.m },
            { val: 1, min: 0.5, text: '1' + Lang.m },
            { val: 0.5, min: 0.25, text: '50' + Lang.cm },
            { val: 0.25, min: 0.2, text: '25' + Lang.cm },
            { val: 0.2, min: 0.1, text: '20' + Lang.cm },
            { val: 0.1, min: 0.05, text: '10' + Lang.cm },
            { val: 0.05, min: 0.02, text: '5' + Lang.cm },
            { val: 0.02, min: 0.01, text: '2' + Lang.cm },
            { val: 0.01, min: 0.005, text: '1' + Lang.cm },
            { val: 0.005, min: 0.002, text: '5' + Lang.mm },

            { val: 0.002, min: 0.001, text: '2' + Lang.mm },
            { val: 0.001, min: 0.0008, text: '1' + Lang.mm }
        ],
        // 经纬度距离，1度所表示的距离，单位：米
        DegreeDistance: 111320,
        DistanceWidth: 50,
        // 点的默认半径大小，单位：像素
        PointRadius: 5,
        // 高度距离，高度数字1所表示的距离，单位：米
        HeightDistance: 1,
        HeightLevels: [
            { val: 5 * 1000, min: 4.5 * 1000, text: '5' + Lang.km },
            { val: 4.5 * 1000, min: 4 * 1000, text: '4.5' + Lang.km },
            { val: 4 * 1000, min: 3.5 * 1000, text: '4' + Lang.km },
            { val: 3.5 * 1000, min: 3 * 1000, text: '3.5' + Lang.km },
            { val: 3 * 1000, min: 2.5 * 1000, text: '3' + Lang.km },
            { val: 2.5 * 1000, min: 2 * 1000, text: '2.5' + Lang.km },
            { val: 2 * 1000, min: 1 * 1000, text: '2' + Lang.km },
            { val: 1 * 1000, min: 800, text: '1' + Lang.km },
            { val: 750, min: 500, text: '750' + Lang.m },
            { val: 500, min: 400, text: '500' + Lang.m },

            { val: 400, min: 300, text: '400' + Lang.m },
            { val: 300, min: 200, text: '300' + Lang.m },
            { val: 200, min: 100, text: '200' + Lang.m },
            { val: 100, min: 50, text: '100' + Lang.m },
            { val: 75, min: 50, text: '75' + Lang.m },
            { val: 50, min: 25, text: '50' + Lang.m },
            { val: 25, min: 20, text: '25' + Lang.m },
            { val: 20, min: 10, text: '20' + Lang.m },
            { val: 10, min: 5, text: '10' + Lang.m },
            { val: 5, min: 2, text: '5' + Lang.m },

            { val: 2, min: 1, text: '2' + Lang.m },
            { val: 1, min: 0.5, text: '1' + Lang.m },
            { val: 0.5, min: 0.25, text: '50' + Lang.cm },
            { val: 0.25, min: 0.2, text: '25' + Lang.cm },
            { val: 0.2, min: 0.1, text: '20' + Lang.cm },
            { val: 0.1, min: 0.05, text: '10' + Lang.cm },
            { val: 0.05, min: 0.02, text: '5' + Lang.cm },
            { val: 0.02, min: 0.01, text: '2' + Lang.cm },
            { val: 0.01, min: 0.005, text: '1' + Lang.cm },
            { val: 0.005, min: 0.002, text: '5' + Lang.mm },

            { val: 0.002, min: 0.001, text: '2' + Lang.mm },
            { val: 0.001, min: 0.0008, text: '1' + Lang.mm }
        ]
    };

    //先加载样式文件
    $.loadJsScriptCss(Config.FilePath, '', function() {}, Config.FileName);

    const Cache = {
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

    const Factory = {
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
                opt.id = 'gmap_canvas_null_001';
                $.console.warn('oui.gmap build:', 'canvas is null');
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
            if (!point || !$.isObject(point)) {
                return false;
            }
            if ($.isNumber(point.latitude) && $.isNumber(point.longitude)) {
                return true;
            } else if ($.isNumber(point.height) && $.isNumber(point.distance)) {
                return true;
            }
            return false;
        },
        // 经纬度转换为Canvas坐标
        latLngToCanvas: function (map, point) {
            if (!this.isPoint(point)) {
                return null;
            }
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
            let that = this, canvas = map.canvas,
                view = map.view, opt = map.options,
                distancePos = {}, pos = pointPos,
                textSize = that.getTextSize(text, fontSize),
                fontPadding = 3, floatPos = pos.x + radius + fontPadding;

            if (!opt.vertical && (position < 0 || position > 2)) {
                position = 2;
            }
            switch(position) {
            case 0:
            default:
                distancePos = { x: floatPos, y: pos.y + radius + textSize.height  };
                break;
            case 1:
                distancePos = { x: posTo.x, y: posTo.y + radius + textSize.height  };
                break;
            case 2:
                distancePos = { x: (pos.x + posTo.x) / 2, y: (pos.y + posTo.y) / 2 };
                break;
            case 3:     //直角线左边中间
            case 6:     //直角线右边中间
                break;
            }

            if ($.isNumber(distancePos.x) && view.overview && distancePos.x + textSize.width > canvas.width) {
                distancePos.x = canvas.width - textSize.width - fontPadding;
            }

            return distancePos;
        },
        render: function (map) {
            const that = this, view = map.view, canvas = map.canvas, ctx = map.ctx;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 清除虚拟出的点
            view.others = [];

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

            if (!pos1 || !pos2) {
                return that;
            }

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
            point = $.extend({radius: 5, color: '#000', name: Lang.centerPoint, textStyle: {
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
        drawVerticalLine: function (map, point, pointTo, style, distanceStyle) {
            let that = this, ctx = map.ctx, opt = map.options,
                pos = that.latLngToCanvas(map, point), 
                posTo, potTmp, pointTmp, textPos = {};

            if (point.distance === pointTo.distance || point.height === pointTo.height) {
                posTo = that.latLngToCanvas(map, pointTo);
                that.drawLine(map, ctx, pos, posTo, style);
                return this;
            }

            if (!distanceStyle.hideDiagonal) {
                posTo = that.latLngToCanvas(map, pointTo);
                that.drawLine(map, ctx, pos, posTo, style);
            }

            switch(distanceStyle.verticalMode) {
            //case 'A':
            //    break;
            case 'M':
                pointTmp = { distance: point.distance, height: pointTo.height };
                break;
            case 'W':
            default:
                pointTmp = { distance: pointTo.distance, height: point.height };
                break;
            }

            potTmp = that.latLngToCanvas(map, pointTmp);
            that.drawLine(map, ctx, pos, potTmp, style);

            textPos = { distance: pointTmp.distance, height: (point.height + pointTo.height) / 2 };
            textPos = that.latLngToCanvas(map, textPos);

            pointTmp = { distance: pointTo.distance, height: pointTo.height };
            posTo = that.latLngToCanvas(map, pointTmp);
            that.drawLine(map, ctx, potTmp, posTo, style);

            return textPos;
        },
        //根据矩形两个对角线顶点，计算另外两个顶点
        calcRectangle: function (rectangle) {
            let that = this, x = 'longitude', y = 'latitude', loc = x === 'longitude';

            if (!rectangle.p1 || !rectangle.p3) {
                return that;
            }
            let p1 = { x: rectangle.p1[x], y: rectangle.p1[y] },
                p3 = { x: rectangle.p3[x], y: rectangle.p3[y] },
                ps = $.calcRectangleVertices(p1, p3);

            rectangle.p2 = loc ? { latitude: ps[0].y, longitude: ps[0].x } : { x: ps[0].x, y: ps[0].y };
            rectangle.p4 = loc ? { latitude: ps[1].y, longitude: ps[1].x } : { x: ps[1].x, y: ps[1].y };

            return that;
        },
        checkPolygon: function (map, point, polygons) {
            let that = this, view = map.view, len = polygons.length, i;

            if (1 === len) {
                let rectangle = {
                    p1: point, p2:null, 
                    p3: that.getPointCache(map, polygons[0]), p4:null
                };
                that.calcRectangle(rectangle);
                polygons = [rectangle.p1, rectangle.p2, rectangle.p3, rectangle.p4];
                len = polygons.length;
            } else if (len > 1) {
                len = polygons.unshift(point);
                for (i = 0; i < len; i++) {
                    polygons[i] = that.getPointCache(map, polygons[i]);
                }
            }

            for (i = 0; i < len; i++) {
                if (polygons[i] === null) {
                    polygons = [];
                    break;
                }
                view.others.push(polygons[i]);
            }

            return polygons;
        },
        drawPolygon: function (map, point, polygons, style) {
            let that = this, ctx = map.ctx;
            polygons = that.checkPolygon(map, point, polygons);
            let len = polygons.length, i, pos, posTo;

            if (!len) {
                return that;
            }
            ctx.beginPath();
            ctx.setLineDash(!style.dash ? [] : style.dash);

            for (i = 0; i < len; i++) {
                pos = that.latLngToCanvas(map, polygons[i]);
                if (pos) {
                    ctx.moveTo(pos.x, pos.y);
                    if (i >= len - 1) {
                        posTo = that.latLngToCanvas(map, polygons[0]);
                    } else {
                        posTo = that.latLngToCanvas(map, polygons[i + 1]);
                    }
                    if (posTo) {
                        ctx.lineTo(posTo.x, posTo.y);
                    }
                }
            }

            ctx.strokeStyle = style.color;
            ctx.lineWidth = style.width;
            ctx.lineCap = 'round';

            ctx.stroke();
            ctx.fill();

            return that;
        },
        drawPoint: function (map, point) {
            let that = this,
                opt = map.options,
                ctx = map.ctx,
                radius = point.radius || Config.PointRadius,
                pos = that.latLngToCanvas(map, point),
                lines = that.getParamArray(point.lines || point.line),
                distances = that.getParamArray(point.distances || point.distance),
                texts = that.getParamArray(point.texts || point.text || point.name, true),
                polygons = that.getParamArray(point.polygons || point.polygon),
                i, pointTo, posTo, style = {},
                distanceStyle = $.extend({}, opt.distanceStyle, point.distanceStyle),
                text, textPos, fontSize,
                heightTextPos;

            // 绘制点
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = point.color || '#f00';
            ctx.fill();

            // 保存点的x,y位置
            point.pos = pos;
            point.radius = radius;

            if (opt.showLine) {
                for (i = 0; i < lines.length; i++) {
                    // 找线条的另一个点，必须是在地图中已经注册过的点
                    pointTo = that.getPointCache(map, lines[i]);
                    style = $.extend({}, opt.lineStyle, point.lineStyle, lines[i]);
                    if (pointTo) {
                        posTo = that.latLngToCanvas(map, pointTo);

                        if (opt.vertical && (style.vertical || distanceStyle.vertical)) {
                            heightTextPos = that.drawVerticalLine(map, point, pointTo, style, distanceStyle);
                        } else {
                            that.drawLine(map, ctx, pos, posTo, style);
                        }
                    }
                }
            }
            //绘制多边形或者矩形
            if (opt.showPolygon && !opt.vertical) {
                style = $.extend({}, opt.polygonStyle, point.polygonStyle);
                that.drawPolygon(map, point, polygons, style);
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
                let distance, heightDistance, realDistance;
                for (i = 0; i < distances.length; i++) {
                    // 找到要计算距离的点，必须是在地图中已经注册过的点
                    pointTo = that.getPointCache(map, distances[i]);
                    if (pointTo) {
                        style = $.extend({}, opt.distanceStyle, point.distanceStyle, distances[i]);
                        fontSize = parseInt(style.font, 10);

                        if (opt.vertical) {
                            distance = point.height - pointTo.height;
                            //偏差校准后的高度距离
                            realDistance= distance - Math.abs(point.adjustHeight || 0) - Math.abs(pointTo.adjustHeight || 0);
                            realDistance = that.dealDistance(realDistance, style);                  
                        } else {
                            distance = $.calcLocationDistance(point, pointTo, opt.plane);
                        }

                        if (style.maxDistance && distance > style.maxDistance) {
                            continue;
                        }
                        distance = that.dealDistance(distance, style);

                        text = (style.prefix || '') + distance + style.unit;

                        if (!opt.vertical && opt.showHeight) {
                            style = $.extend({}, opt.distanceStyle, point.distanceStyle, distances[i]);
                            heightDistance = point.height - pointTo.height;
                            if (!isNaN(heightDistance)) {
                                heightDistance = that.dealDistance(heightDistance, style);
                                text += ' (' + Lang.heightDistance + ':' + heightDistance + style.unit + ')';
                            }
                        }
                        // 是否显示校准后的高度值
                        if (opt.vertical && distance !== realDistance) {
                            text += ' (' + (distanceStyle.adjustPrefix || '') + realDistance + style.unit + ')';
                        }
                        posTo = that.latLngToCanvas(map, pointTo);
                        textPos = that.setDistancePosition(map, style.position, pos, posTo, radius, fontSize, text);
                        if (!$.isNumber(textPos.x)) {
                            textPos = $.extend({}, heightTextPos);
                            let textSize = that.getTextSize(text, fontSize);
                            switch(style.position) {
                            case 3:
                                textPos.x -= textSize.width + 5;
                                break;
                            case 6:
                                textPos.x += 5;
                                break;
                            }
                            // 这里除以3，不是除以2
                            textPos.y += textSize.height / 3;
                        }
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
                prefix = $.isString(opt.positionPrefix, true) ? opt.positionPrefix : '',
                view = map.view, 
                elem = map.panels.position,
                text;

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
                text = prefix + [point.latitude.round(3), point.longitude.round(3)].join(',');
            } else {
                text = prefix + [point.latitude, point.longitude].join(',');
            }

            if (opt.showMousePosition) {
                text += ' (' + point.x + ',' + point.y + ')';
            }
            elem.innerHTML = text;

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
        showRemark: function (map, remark) {
            let opt = map.options, elem = map.panels.remark;
            if (!opt.showRemark || !elem) {
                return this;
            }
            if (remark !== null) {
                remark = remark || opt.remark;
                elem.innerHTML = remark;
            }
            return this;
        },
        showScaleLevel: function (map) {
            let that = this;

            return that;
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
            let that = this,
                opt = map.options,
                panels = map.panels,
                zindex = parseInt('0' + $.getElementStyle(map.canvas, 'z-index'), 10) + 1,
                div = _build('oui-gmap-bottom', zindex, [
                    '<div class="oui-gmap-position" style="z-index:', zindex + 2, ';"></div>',
                    '<div class="oui-gmap-rule"></div>',
                    '<div class="oui-gmap-shade" style="z-index:', zindex + 1, ';"></div>'
                ].join(''));

            if (opt.showRule) {
                map.box.appendChild(div);
                panels.bottom = div;
                panels.position = div.childNodes[0];
                panels.scaleRule = div.childNodes[1];
            }

            if (opt.showScale) {
                //左上角缩放按钮
                div = _build('oui-gmap-scale', zindex, [
                    '<a class="center item" title="', Lang.centerPoint, '"></a>',
                    '<a class="overview item', opt.showOverview ? ' press' : '', '"',
                    ' title="', opt.showOverview ? Lang.exitOverview : Lang.fixOverview, '"></a>',
                    '<input class="set level item" title="', Lang.scaleLevel, '" maxlength="2" />',
                    '<a class="add level item item" title="', Lang.zoomIn, '">+</a>',
                    '<a class="sub level item" title="', Lang.zoomOut, '">-</a>',
                ].join(''));
                panels.scale = div;

                let nodes = div.querySelectorAll('.item');
                for(var i = 0; i < nodes.length; i++) {
                    if (nodes[i].className.indexOf('set level') >= 0) {
                        map.panels.level = nodes[i];
                    }
                    $.addListener(nodes[i], 'click', function(e) {
                        let node = this;
                        $.debounce({
                            id: 'oui-gmap-level-set', delay: 200, timeout: 2000
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
                if (panels.level) {
                    $.addListener(panels.level, 'keyup', function (e) {
                        $.cancelBubble(e);
                        let elem = this;
                        $.debounce({
                            id: 'oui-gmap-level-input', delay: 300, timeout: 2000
                        }, function(ev) {
                            let keyCode = e.keyCode,
                                v = parseInt(elem.value.trim(), 10);

                            switch(keyCode) {
                            case 37: v = map.view.minScaleLevel; break;
                            case 38: v = map.view.scaleLevel - 1; break;
                            case 39: v = map.view.maxScaleLevel; break;
                            case 40: v = map.view.scaleLevel + 1; break;
                            }

                            $.console.log('v:', v, e.keyCode);

                            if (isNaN(v)) {
                                return false;
                            }
                            if (v < map.view.minScaleLevel) {
                                v = map.view.minScaleLevel;
                            } else if (v > map.view.maxScaleLevel) {
                                v = map.view.maxScaleLevel;
                            }
                            map.scaleLevel(v);
                        });
                    });
                }
            }

            if (opt.showTitle) {
                div = _build('oui-gmap-title', zindex, [].join(''));
                panels.title = div;
            }

            if (opt.showRemark) {
                div = _build('oui-gmap-remark', zindex, [].join(''));
                panels.remark = div;
            }

            return this;
        },
        showPanel: function (map) {
            let panels = map.panels, canvas = map.canvas, view = map.view;
            if (panels.bottom) {
                panels.bottom.style.width = canvas.width + 'px';
            }
            if (panels.level) {
                switch(panels.level.tagName) {
                case 'INPUT':
                case 'TEXTAREA':
                    panels.level.value = view.scaleLevel;
                    break;
                case 'SELECT':
                    break;
                default:
                    panels.level.innerHTML = view.scaleLevel;
                    break;
                }
            }
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

            if (len >= 3) {
                minX = that.getMin(points, fieldLng);
                maxX = that.getMax(points, fieldLng);
                minY = that.getMin(points, fieldLat);
                maxY = that.getMax(points, fieldLat);
            } else {
                minX = Math.min(points[0][fieldLng], points[1][fieldLng]);
                maxX = Math.max(points[0][fieldLng], points[1][fieldLng]);

                minY = Math.min(points[0][fieldLat], points[1][fieldLat]);
                maxY = Math.max(points[0][fieldLat], points[1][fieldLat]);
            }

            return {
                minX, minY, maxX, maxY,
                width: maxX - minX,
                height: maxY - minY,
                centerX: (minX + maxX) / 2,
                centerY: (minY + maxY) / 2
            };
        },
        checkOptions: function (map, options) {
            let that = this, opt = $.extend({}, options);

            let min = Math.min(opt.minScaleLevel, opt.maxScaleLevel);
            let max = Math.max(opt.minScaleLevel, opt.maxScaleLevel);

            if (min < Config.MinScaleLevel) {
                min = Config.MinScaleLevel;
            }
            if (max > Config.MaxScaleLevel) {
                max = Config.MaxScaleLevel;
            }
            opt.minScaleLevel = min;
            opt.maxScaleLevel = max;

            if (opt.scaleLevel < opt.minScaleLevel) {
                opt.scaleLevel = opt.minScaleLevel;
            }
            if (opt.scaleLevel > opt.maxScaleLevel) {
                opt.scaleLevel = opt.maxScaleLevel;
            }

            return opt;
        },
        initScaleLevel: function (map) {
            let opt = map.options, view = map.view,
                rules = map.rules(), len = rules.length, copys = [],
                distanceRatio = opt.vertical ? Config.HeightDistance : Config.DegreeDistance,
                i, c;

            for (i = 0; i < len; i++) {
                let dr = rules[i];
                dr.level = i + 1;
                dr.scale = {
                    val: distanceRatio * Config.DistanceWidth / dr.val,
                    // 请注意，这里的大小是相反的
                    min: distanceRatio * Config.DistanceWidth / dr.val,
                    max: distanceRatio * Config.DistanceWidth / dr.min
                };
                if (dr.level >= opt.minScaleLevel && dr.level <= opt.maxScaleLevel) {
                    copys.push(dr);
                }
            }
            c = copys.length;
            
            // 根据实际的缩放比例限制和比例尺设置缩放比例等级

            view.minScaleRatio = distanceRatio * Config.DistanceWidth / copys[0].val;
            view.maxScaleRatio = distanceRatio * Config.DistanceWidth / copys[c - 1].min;
            view.minScaleLevel = copys[0].level;
            view.maxScaleLevel = copys[c - 1].level;

            opt.minScaleLevel = view.minScaleLevel;
            opt.maxScaleLevel = view.maxScaleLevel;

            if (opt.showLog) {
                $.console.log('initScaleLevel:', opt.minScaleLevel, opt.maxScaleLevel, view.minScaleRatio, view.maxScaleRatio, rules);
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
                opt = map.options,
                len = rules.length;

            if (scaleLevel < 1) {
                scaleLevel = 1;
            } else if(scaleLevel > len) {
                scaleLevel = len;
            }
            let rule = $.extend({ width: 50, }, rules[scaleLevel - 1]);
            if (scale && rule.scale) {
                rule.width = (rule.width * (scale / rule.scale.val)).round(3);
                if (opt.showLog) {
                    $.console.log('getScaleLevel:', scale, rule.scale.val, vertical, rule);
                }
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
                // 限制缩放范围
                scale = Math.max(view.minScaleRatio, Math.min(view.maxScaleRatio, scale));

                scaleLevel = 1;
                let found = false;
                for (var i = 0; i < len; i++) {
                    let dr = rules[i];
                    if (scale >= dr.scale.min && scale <= dr.scale.max) {
                        scaleLevel = i + 1;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    if (scale <= rules[0].scale.val) {
                        scale = rules[0].scale.val;
                        scaleLevel = 1;
                    } else  if (scale > rules[len - 1].scale.max) {
                        scale = rules[len - 1].scale.max;
                        scaleLevel = len;
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
                    points = view.points, len = points.length,
                    others = view.others, len2 = others.length;

                if (len2 > 0) {
                    points = points.concat(others);
                }

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
                        // 限制缩放范围
                        scale = Math.max(view.minScaleRatio, Math.min(view.maxScaleRatio, scale));
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
            //$.cancelBubble(e);
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
            //$.cancelBubble(e);
            let that = this, opt = map.options, 
                view = map.view, canvas = map.canvas,
                rect = canvas.getBoundingClientRect(),
                mouseX = e.clientX - rect.left,
                mouseY = e.clientY - rect.top;

            if (opt.showPosition && (e.target === canvas || $.isOnElement(canvas, e))) {
                const center = map.center();
                
                // 计算鼠标位置对应的经纬度
                const mouseLat = center.latitude - (mouseY - canvas.height / 2 - view.offsetY) / view.scale,
                    mouseLng = (mouseX - canvas.width / 2 - view.offsetX) / view.scale + center.longitude,
                    point = { latitude: mouseLat, longitude: mouseLng, x: mouseX, y: mouseY };

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
            //$.cancelBubble(e);
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
        },
        handleClick: function (e, map) {
            let that = this, 
                opt = map.options, view = map.view, 
                points = view.points,
                func = opt.clickCallback;

            if (!$.isFunction(func)) {
                return that;
            }

            let rect = map.canvas.getBoundingClientRect(),
                clickX = e.clientX - rect.left,
                clickY = e.clientY - rect.top,
                i;

            for (i = 0; i < points.length; i++) {
                var p = points[i],
                    px = p.pos.x,
                    py = p.pos.y,
                    //distance = Math.sqrt((clickX - px) ** 2 + (clickY - py) ** 2);
                    distance = Math.hypot(clickX - px, clickY - py);

                if (distance <= p.radius) {
                    func(e, p, that);
                    break;
                }
            }

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
            // 备注说明
            remark: '',
            // 默认缩放比例
            scale: 1,
            // 默认缩放等级
            scaleLevel: 5,
            // 最小缩放等级限制
            minScaleLevel: Config.MinScaleLevel,
            // 最大缩放等级限制
            maxScaleLevel: Config.MaxScaleLevel,
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
            // 是否显示备注说明
            showRemark: true,
            // 是否显示当前鼠标位置的经纬度
            showPosition: false,
            // 是否显示当前鼠标位置的x,y值
            showMousePosition: false,
            // 左下角位置信息前缀
            positionPrefix: '',
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
            // 是否显示多边形（水平模式下启用）
            // 如果只有两个点的多边形，则表示为矩形
            showPolygon: false,
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
                //是否画垂直线
                vertical: false,
                //是否隐藏斜线
                //若启用垂直线，则此参数无效
                hideDiagonal: false,
                //垂直线三角形模式: M - 上三角，W - 下三角, A - 自适应
                verticalMode: 'W',
                //高度调节，用于上下位置补偿，若已在外面数据中调整过了，这里不要设置
                adjustHeight: 0,
                adjustPrefix: '',
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
            clickCallback: function (e, point, map) {
                console.log('point:', point);
            },
            scaleRules: $.extend([], Config.ScaleLevels),
            heightRules: $.extend([], Config.HeightLevels),
            points: []
        }, options);

        this.options = Factory.checkOptions(this, opt);
        this.panels = {};
        this.canvas = opt.canvas;
        if (opt.canvas) {            
            this.ctx = this.canvas.getContext('2d');
            this.id = this.canvas.id;
        }
        this.view = {
            //最小比例，50个像素所能代表的最大距离
            minScaleRatio: 1,
            //最大比例，50个像素所能代表的最小距离
            maxScaleRatio: 1,
            // 最小缩放等级限制
            minScaleLevel: Config.MinScaleLevel,
            // 最大缩放等级限制
            maxScaleLevel: Config.MaxScaleLevel,
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
            // 当前所有点
            points: [],
            // 虚拟出的点
            others: [],
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

            if (!canvas) {
                return that;
            }
            var box = canvas.parentNode;
            if (box.tagName === 'DIV') {
                box.style.position = 'relative';
                box.style.overflow = 'hidden';
                this.box = box;
            }

            Factory.buildPanel(that)
                .showTitle(that, opt.title)
                .showRemark(that, opt.remark)
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
            $.addListener([canvas, box], 'mouseout', function(e) {
                Factory.handleMouseOut(e, that);
            });
            $.addListener(canvas, 'wheel', function(e) {
                Factory.handleWheel(e, that);
            });
            $.addListener(canvas, 'click', function(e) {
                Factory.handleClick(e, that);
            });
            $.addListener(canvas, 'contextmenu', function(e) {
                return false;
            });

            if (opt.showOverview) {
                Factory.setOverview(that, true);
            }
            return Factory.render(that), that;
        },
        size: function (size) {
            let that = this;
            if (!that.canvas) {
                return that;
            }
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

            if (!that.canvas) {
                return that;
            }

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
            if (!that.canvas) {
                return that;
            }
            Factory.setScale(that, scale);

            return Factory.render(that), that;
        },
        scaleLevel: function (level, action) {
            var that = this;
            if (!that.canvas || (!$.isNumber(level) && !$.isNumber(action))) {
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
            if (!this.canvas) {
                return this;
            }
            overview = $.isBoolean(overview, true);
            Factory.setOverview(this, overview, true).render(this);
            return this;
        },
        update: function (points, append) {
            var that = this, opt = that.options;
            if (!that.canvas) {
                return that;
            }
            if ($.isArray(points)) {
                if (append) {
                    points = that.view.points.concat(points);
                    that.view.points = points;
                } else {
                    that.view.points = points;
                }                
                Factory.initPoints(that, that.view.points);
                Factory.setPointCache(that);

                if (opt.showOverview) {
                    Factory.setOverview(that, true);
                }
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
        },
        title: function (title) {
            return Factory.showTitle(this, title), this;
        },
        remark: function (remark) {
            return Factory.showRemark(this, remark), this;
        }
    };

    $.extend({
        gmap: function (id, options) {
            return Factory.buildMap(id, options);
        }
    });

    $.gmap.buildRemark = function (options) {
        let opt = $.extend({title: '', colors:[]}, options);

        let html = [], len = opt.colors.length, i;
        if ($.isString(opt.title, true)) {
            html.push('<dt class="remark-title">', opt.title, '</dt>');
        }
        for (i = 0; i < len; i++) {
            let dr = opt.colors[i];
            html.push([
                '<dd class="remark-item">',
                '<span class="color-bar" style="background:', dr.color, ';"></span>',
                '<span class="color-txt">', dr.text, '</span>',
                '</dd>'
            ].join(''));
        }

        return html.join('');
    };

} (OUI);