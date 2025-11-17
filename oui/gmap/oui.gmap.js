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
        DegreeDistance: 111320,
        DistanceWidth: 50,
        //最小比例，50个像素所能代表的最大距离
        MinScaleRatio: 1,
        //最大比例，50个像素所能代表的最小距离
        MaxScaleRatio: 1,
        HeightLevels: [
            { val: 5 * 1000, min: 2 * 1000, text: '5公里' },
            { val: 2 * 1000, min: 1 * 1000, text: '2公里' },
            { val: 1 * 1000, min: 750, text: '1公里' },
            { val: 750, min: 500, text: '750米' },
            { val: 500, min: 250, text: '500米' },
            { val: 250, min: 200, text: '250米' },
            { val: 200, min: 100, text: '200米' },
            { val: 100, min: 75, text: '100米' },
            { val: 75, min: 50, text: '75米' },
            { val: 50, min: 25, text: '50米' },
            { val: 25, min: 20, text: '25米' },
            { val: 20, min: 15, text: '20米' },

            { val: 15, min: 10, text: '15米' },
            { val: 10, min: 7.5, text: '10米' },
            { val: 7.5, min: 5, text: '7.5米' },
            { val: 5, min: 2.5, text: '5米' },
            { val: 2.5, min: 2, text: '2.5米' },
            { val: 2, min: 1, text: '2米' },
            { val: 1, min: 0.75, text: '1米' },
            { val: 0.75, min: 0.5, text: '75厘米' },
            { val: 0.5, min: 0.25, text: '50厘米' },
            { val: 0.25, min: 0.2, text: '25厘米' },

            { val: 0.2, min: 0.15, text: '20厘米' },
            { val: 0.15, min: 0.1, text: '15厘米' },
            { val: 0.1, min: 0.75, text: '10厘米' },
            { val: 0.075, min: 0.05, text: '7.5厘米' },
            { val: 0.05, min: 0.02, text: '5厘米' },
            { val: 0.02, min: 0.01, text: '2厘米' },
            { val: 0.01, min: 0.005, text: '1厘米' },
            { val: 0.005, min: 0.004, text: '5毫米' }
        ]
    };

    var Cache = {
    	caches: {},
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
    		if ($.isObject(point) && point.latitude && point.longitude) {
    			return true;
    		}
    		return false;
    	},
    	// 经纬度转换为Canvas坐标
    	latLngToCanvas: function (map, lat, lng) {
    		const view = map.view, 
    			canvas = map.canvas,
    			center = map.center();

            // 简化的经纬度到平面坐标的转换
            // 实际应用中可能需要使用墨卡托投影等更精确的方法
            const x = (lng - center.longitude) * view.scale + canvas.width / 2 + view.offsetX;
            const y = (center.latitude - lat) * view.scale + canvas.height / 2 + view.offsetY;
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
            let that = this, canvas = map.canvas,
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

            if (distancePos.x + textSize.width > canvas.width) {
                distancePos.x = canvas.width - textSize.width - fontPadding;
            }

            return distancePos;
        },
    	render: function (map) {
    		const view = map.view, canvas = map.canvas, ctx = map.ctx;

    		ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 保存当前状态
            //ctx.save();

            this.drawGrid(map);
            this.drawPoints(map);
            this.drawRules(map);
            this.drawCenter(map);

            //ctx.restore();

            return this;
    	},
    	drawGrid: function (map) {
    		const opt = map.options;
            //const gridSize = 50 * view.scale;

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
        drawPoint: function (map, point) {
            let that = this,
                opt = map.options,
                ctx = map.ctx,
                radius = point.radius || 4,
                pos = that.latLngToCanvas(map, point.latitude, point.longitude),
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
                        posTo = that.latLngToCanvas(map, pointTo.latitude, pointTo.longitude);
                        that.drawLine(map, ctx, pos, posTo, style);
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
                let distance;
                for (i = 0; i < distances.length; i++) {
                    // 找到要计算距离的点，必须是在地图中已经注册过的点
                    pointTo = that.getPointCache(map, distances[i]);
                    if (pointTo) {
                        distance = $.calcLocationDistance(point, pointTo, opt.plane);
                        style = $.extend({}, opt.distanceStyle, point.distanceStyle, distances[i]);
                        fontSize = parseInt(style.font, 10);

                        if (style.maxDistance && distance > style.maxDistance) {
                            continue;
                        }
                        posTo = that.latLngToCanvas(map, pointTo.latitude, pointTo.longitude);
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

                        text = distance + style.unit;
                        textPos = that.setDistancePosition(map, style.position, pos, posTo, radius, fontSize, text);

                        that.drawText(ctx, text, textPos, style);
                    }
                }
            }

            return that;
        },
    	drawPoints: function (map) {
            const that = this, points = map.view.points, ctx = map.ctx;
    		points.forEach(point => {
    			that.drawPoint(map, point);
    		});
    		return this;
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
        setCenter: function (map, point) {
            if (!this.isPoint(point)) {
                return this;
            }
            //console.log('setCenter:', point);
            map.view.curCenter = {
                latitude: point.latitude,
                longitude: point.longitude,
                height: point.height
            };

            return this;
        },
        calcPolygonCenter: function (points) {
            let len = points.length, i, lat = 0, lng = 0;
            for (i = 0; i < len; i++) {
                lat += points[i].latitude;
                lng += points[i].longitude;
            }
            lat /= len;
            lng /= len;

            return { latitude: lat, longitude: lng };
        },
        // 计算多边形最小包围盒，
        calcPolygonBox: function (map, points) {
            let minX = 0, minY = 0, maxX = 0, maxY = 0, len = points.length;
            if (len <= 1) {
                return null;
            }
            if (len > 3) {
                minX = Math.min(...points.map(p => p.longitude));
                maxX = Math.max(...points.map(p => p.longitude));

                minY = Math.min(...points.map(p => p.latitude));
                maxY = Math.max(...points.map(p => p.latitude));
            } else {
                minX = Math.min(points[0].longitude, points[1].longitude);
                maxX = Math.max(points[0].longitude, points[1].longitude);

                minY = Math.min(points[0].latitude, points[1].latitude);
                maxY = Math.max(points[0].latitude, points[1].latitude);
            }

            return {
                minX, minY, maxX, maxY,
                width: maxX - minX,
                height: maxY - minY,
                centerX: (minX + maxX) / 2,
                centerY: (minY + maxY) / 2
            };
        },
        drawRules: function (map) {
            let that = this, opt = map.options, canvas = map.canvas, ctx = map.ctx, view = map.view, 
                rulePadding = 10, ruleWidth = 50, minWidth = 50, distance = 0, sideHeight = 3,
                ruleText = '', textStyle = { color: '#000', font: '12px Arial' };

            if (!opt.showRule) {
                return that;
            }
            let rule = that.getScaleLevel(map, view.scaleLevel, view.scale);

            ruleWidth = rule.width || 50;
            ruleText = rule.text;

            ctx.beginPath();
            ctx.setLineDash([]);

            // 画水平比例尺
            ctx.moveTo(canvas.width - rulePadding, canvas.height - rulePadding - sideHeight);
            ctx.lineTo(canvas.width - rulePadding, canvas.height - rulePadding);

            ctx.moveTo(canvas.width - rulePadding, canvas.height - rulePadding);
            ctx.lineTo(canvas.width - rulePadding - ruleWidth, canvas.height - rulePadding);

            ctx.moveTo(canvas.width - rulePadding - ruleWidth, canvas.height - rulePadding);
            ctx.lineTo(canvas.width - rulePadding - ruleWidth, canvas.height - rulePadding - sideHeight);

            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;

            if (ruleText) {
                that.drawText(ctx, ruleText, {
                    x: canvas.width - rulePadding - ruleWidth / 2 - that.getTextSize(ruleText, 12).width / 2, 
                    y: canvas.height - rulePadding - sideHeight - 3
                }, textStyle);
            }

            // 画垂直比例尺

            ctx.stroke();
            ctx.fill();

            return this;
        },
        initScaleLevel: function (map) {
            var levels = map.options.scaleRules, len = levels.length;
            for (var i = 0; i < len; i++) {
                var dr = levels[i];
                dr.level = i + 1;
                dr.scale = {
                    val: Config.DegreeDistance * Config.DistanceWidth / dr.val,
                    // 请注意，这里的大小是相反的
                    min: Config.DegreeDistance * Config.DistanceWidth / dr.val,
                    max: Config.DegreeDistance * Config.DistanceWidth / dr.min
                };
            }

            Config.MinScaleRatio = Config.DegreeDistance * Config.DistanceWidth / levels[0].val;
            Config.MaxScaleRatio = Config.DegreeDistance * Config.DistanceWidth / levels[len - 1].min;

            return this;
        },
        getScaleLevel: function (map, scaleLevel, scale) {
            var rules = map.options.scaleRules, len = rules.length;
            if (scaleLevel < 1) {
                scaleLevel = 1;
            } else if(scaleLevel > len) {
                scaleLevel = len;
            }
            var rule = $.extend({ width: 50, }, rules[scaleLevel - 1]);
            if (scale) {
                rule.width = (rule.width * (scale / rule.scale.val)).round(3);
            }

            return rule;
        },
        setScaleLevel: function (map, scale, scaleLevel) {
            var that = this, view = map.view,
                rules = map.options.scaleRules, len = rules.length,
                rule;

            $.console.log('calcScaleLevel:', scale, scaleLevel);

            if ($.isNumber(scaleLevel)) {
                if (scaleLevel < 1) {
                    scaleLevel = 1;
                } else if(scaleLevel > len) {
                    scaleLevel = len;
                }
                rule = that.getScaleLevel(map, scaleLevel);
                view.scale = rule.scale.val;
            } else if ($.isNumber(scale) && scale) {
                var rules = map.options.scaleRules, len = rules.length;
                scaleLevel = 1;
                for (var i = 0; i < len; i++) {
                    var dr = rules[i];
                    if (scale > dr.scale.min && scale <= dr.scale.max) {
                        scaleLevel = i + 1;
                        break;
                    }
                }
                rule = that.getScaleLevel(map, scaleLevel, scale);
            }
            view.scaleLevel = rule.level;

            that.drawRules(map);

            return that;
        },
        setScale: function (map, scale, forceOverview) {
            var that = this, view = map.view;

            if ($.isNumber(scale) && scale > 0) {
                view.scale = scale;
            } else {
                let opt = map.options,
                    canvas = map.canvas,
                    center = map.center(),
                    maxLat = 0, maxLng = 0, maxDegree = 0, maxHeight = 0,
                    points = view.points, len = points.length;

                if (forceOverview) {
                    map.view.offsetX = 0;
                    map.view.offsetY = 0;
                }

                if(len > 1) {
                    // 计算多边形最小包围盒
                    let box = that.calcPolygonBox(map, points), 
                        ratio = opt.overviewRatio,
                        widthScale = canvas.width / box.width * ratio,
                        heightScale = canvas.height / box.height * ratio;

                    // 取多边形包围盒的中点作为中心点
                    that.setCenter(map, { latitude: box.centerY,  longitude: box.centerX });
                    // 计算新的缩放比率
                    scale = Math.min(widthScale, heightScale) * ratio;
                }

                if (forceOverview || view.scale > scale) {
                    view.scale = scale;
                }
            }
            that.setScaleLevel(map, view.scale);

            console.log('setScale:', view.scale);

            return this;
        },
        setOverview: function (map, force) {
            let that = this, 
                view = map.view, 
                center = map.center(), 
                scale = view.scale,
                points = view.points;

            if (points.length > 0) {
                center = that.calcPolygonCenter(points);
                that.setCenter(map, center);
            }

            that.setScale(map, null, force);

            return that;
        },
    	handleMouseDown: function (e, map) {
            $.cancelBubble(e);
    		if (e.ctrlKey || e.metaKey) {
    			return this;	
    		}
    		if (!e.button) {
	    		const rect = map.canvas.getBoundingClientRect();
	    		map.view.isDragging = true;
	    		map.view.lastX = e.clientX - rect.left;
	    		map.view.lastY = e.clientY - rect.top;
    		}
            return this;
    	},
    	handleMouseMove: function (e, map) {
            $.cancelBubble(e);
    		const view = map.view, canvas = map.canvas,
                opt = map.options,
    		 	rect = canvas.getBoundingClientRect(),
			 	mouseX = e.clientX - rect.left,
             	mouseY = e.clientY - rect.top;

			if (opt.showPosition && e.target === canvas) {
                const center = map.center();
                // 计算鼠标位置对应的经纬度
                const mouseLat = center.latitude - (mouseY - canvas.height / 2 - view.offsetY) / view.scale,
                	mouseLng = (mouseX - canvas.width / 2 - view.offsetX) / view.scale + center.longitude;

                if ($.isFunction(opt.positionCallback)) {
                    opt.positionCallback({ latitude: mouseLat, longitude: mouseLng }, map);
                }
            }

			if (!view.isDragging) {
				return this;
			}
            
            const deltaX = mouseX - view.lastX,
            	deltaY = mouseY - view.lastY;
			            
            view.offsetX += deltaX;
            view.offsetY += deltaY;
            
            view.lastX = mouseX;
            view.lastY = mouseY;
			
            Factory.render(map);

            return this;
    	},
    	handleMouseUp: function (e, map) {
            $.cancelBubble(e);
    		map.view.isDragging = false;
            return this;
    	},
    	handleWheel: function (e, map) {
            e.preventDefault();
    		const that = this, view = map.view, canvas = map.canvas, opt = map.options;
            
            // 获取鼠标在Canvas上的位置
    		var rect = canvas.getBoundingClientRect(),
    			mouseX = e.clientX - rect.left,
    			mouseY = e.clientY - rect.top,
    			center = map.center();

            // 计算鼠标位置对应的经纬度
            const mouseLat = center.latitude - (mouseY - canvas.height / 2 - view.offsetY) / view.scale;
            const mouseLng = (mouseX - canvas.width / 2 - view.offsetX) / view.scale + center.longitude;
            
            // 确定缩放方向
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            
            // 更新缩放比例
            view.scale *= zoomFactor;
            
            // 限制缩放范围
            view.scale = Math.max(Config.MinScaleRatio, Math.min(Config.MaxScaleRatio, view.scale));

            that.setScale(map, view.scale);

            if ($.isFunction(opt.positionCallback)) {
                opt.positionCallback({ latitude: mouseLat, longitude: mouseLng }, map);
            }
            
            // 调整中心点，使鼠标位置保持固定
            const newMouseX = (mouseLng - center.longitude) * view.scale + canvas.width / 2 + view.offsetX;
            const newMouseY = (center.latitude - mouseLat) * view.scale + canvas.height / 2 + view.offsetY;
            
            view.offsetX += mouseX - newMouseX;
            view.offsetY += mouseY - newMouseY;
            
            // 重绘
            Factory.render(map);

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
            // 缩放比例
            scale: 1,
            // 缩放等级
            scaleLevel: 1,
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
            // 是否自动全览
            showOverview: false,
            // 全览比率，0.9表示缩放至90%
            overviewRatio: 0.9,
            // 是否显示中心点
            showCenter: false,
            // 是否显示点的名称标签
            showText: true,
            // 是否显示两点间的连线
            showLine: true,
            // 是否计算并显示两点之间的距离
            showDistance: true,
            // 是否显示当前鼠标位置的经纬度
            showPosition: true,
            // 是否显示比例尺
            showRule: true,
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
            heightLevels: $.extend([], Config.HeightLevels),
            points: []
    	}, options);

        this.options = opt;
    	this.canvas = opt.canvas;
    	this.ctx = this.canvas.getContext('2d');
    	this.id = this.canvas.id;
    	this.view = {
    		defCenter: {
    			latitude: 0,
    			longitude: 0,
                height: 0
    		},
    		curCenter: null,
            scale: opt.scale,   // 缩放比例
            scaleLevel: opt.scaleLevel,      // 缩放等级
            offsetX: 0,         // X轴偏移
            offsetY: 0,         // Y轴偏移

            isDragging: false,
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

            Factory.setPointCache(that).initScaleLevel(that);

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
    		$.addListener(canvas, 'wheel', function(e) {
    			Factory.handleWheel(e, that);
    		});

            if (opt.showOverview) {
                Factory.setOverview(that, true);
            }
    		return Factory.render(that), that;
    	},
    	size: function (size) {
    		var that = this;
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
    		return Factory.render(that), that;
    	},
    	center: function (point, scale) {
    		var that = this, view = that.view;
    		if (Factory.isPoint(point)) {
    			Factory.setCenter(that, point);
                if (scale) {
                    Factory.setScale(that, scale);
                }
                return Factory.render(that), that;
    		}
    		return view.curCenter ? view.curCenter : view.defCenter;
    	},
    	scale: function (scale) {
    		var that = this;
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
        overview: function (force) {
            Factory.setOverview(this, force || this.options.showOverview).render(this);
            return this;
        },
    	update: function (points, append) {
            var that = this;
            if ($.isArray(points)) {
                if (append) {
                    that.view.points.concat(points);
                } else {
                    that.view.points = points;
                }
                Factory.setPointCache(that);

                if (that.options.showOverview) {
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
        }
    };

    $.extend({
    	gmap: function (id, options) {
    		return Factory.buildMap(id, options);
    	}
    })

} (OUI);