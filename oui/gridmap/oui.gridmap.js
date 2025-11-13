
/*
	@Title: OUI
	@Description：JS通用代码库
	@Author: oukunqing
	@License：MIT

	$.gridmap 网格地图
*/

!function ($) {
    'use strict';

    var Config = {
        FilePath: $.getScriptSelfPath(true),
        FileName: 'oui.gridmap.'
    };

    //先加载样式文件
    $.loadJsScriptCss(Config.FilePath, '', function() {}, Config.FileName);

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
    	buildGridMap: function(id, options) {
    		var opt = {};
    		if ($.isElement(id)) {
    			$.extend(opt, options, { canvas: id, id: id.id });
    		} else if ($.isString(id, true)) {
    			var canvas = $.toElement(id);
    			$.extend(opt, options, { canvas: canvas, id: id });
    		} else {
    			$.extend(opt, id, options);
    		}
    		if (!opt.canvas) {
    			return null;
    		}
    		var cache = Cache.getCache(opt.id), map;
    		if (cache) {
    			map = cache.map;
    		} else {
    			map = new GridMap(opt);
    			Cache.setCache(opt.id, map);
    		}
    		return map;
    	},
    	setCanvasSize: function (map) {
    		var parent = map.canvas.parentNode;
    		if (parent) {
    			var curWidth = parent.offsetWidth,
    				curHeight = parent.offsetHeight,
    				lastWidth = map.state.canvasWidth,
					lastHeight = map.state.canvasHeight;

				if (curWidth !== lastWidth || curHeight !== lastHeight) {					
					map.canvas.width = curWidth;
					map.canvas.height = curHeight;
					map.state.canvasWidth = curWidth;
					map.state.canvasHeight = curHeight;

					return true;
				}
			}
			return false;
    	},
	    getPolygonCenter: function (polygon) {
	        let sumLat = 0;
	        let sumLon = 0;
	        var numPoints = polygon.length;
	        for (var i = 0; i < numPoints; i++) {
	            sumLat += polygon[i].latitude;
	            sumLon += polygon[i].longitude;
	        }
	        const centerLat = sumLat / numPoints;
	        const centerLon = sumLon / numPoints;

	        return {
	            latitude: centerLat, longitude: centerLon
	        };
	    },
    	buildScaleBar: function (map) {
    		var div = document.createElement('div');
    		div.id = 'oui-gridmap-tools-' + map.id;
    		div.className = 'oui-gridmap-scale';
    		div.innerHTML = [
    			'<span class="ratio">1.12</span>',
    			'<a class="reset" title="重置">R</a>',
    			'<a class="center" title="回到中心点">C</a>',
    			'<a class="add" title="放大一级">+</a>',
    			'<a class="sub" title="缩小一级">-</a>'
    		].join('');

    		map.canvas.parentNode.appendChild(div);

    		$.addListener(div, 'click', function (e) {
    			var target = e.target,
    				tag = target.tagName.toLowerCase(),
    				css = target.className.trim().split(' ')[0];

    			switch(css) {
    			case 'center':
    				map.center();
    				break;
    			case 'reset':
    				Factory.resetView(map);
    				break;
    			case 'add':
    				//map.scale(1, 1);
    				//Factory.zoomAtCenter(map, 1.1);
    				Factory.zoomAtCenter(map, 1, true);
    				break;
    			case 'sub':
    				//map.scale(1, -1);
    				//Factory.zoomAtCenter(map, 1 / 1.1);
    				Factory.zoomAtCenter(map, -1, true);
    				break;
    			}
    		});

    		return this;
    	},
    	setScaleLevel: function (map, level, action, offset, point) {    		
    		var that = map,
    			canvas = that.canvas,
    			state = that.state,
    			maxScale = that.options.scaleRules.length,
    			maxHeightScale = that.options.heightRules.length,
    			oldLevel = state.scaleLevel,
    			curLevel = oldLevel,
    			max = maxScale >= maxHeightScale ? maxScale : maxHeightScale;

    		if (!$.isNumber(level) || level <= 0) {
    			return this;
    		}
    		if (action) {
    			curLevel += action * level;
    			if (curLevel <= 0) {
    				curLevel = 1;
    			} else if (curLevel > max) {
    				curLevel = max;
    			}
    			state.scaleLevel = curLevel;
    		} else {
    			curLevel = level > max ? max : level;
    			state.scaleLevel = curLevel;
    		}
    		if (offset) {
    			//2.根据比例尺换算距离
	    		var ruleHorizontal = this.getRatioRule(map, false),
	    			ruleVertical = this.getRatioRule(map, false),
	    			ruleHorizontalOld = this.getRatioRule(map, false, oldLevel),
	    			ruleVerticalOld = this.getRatioRule(map, false, oldLevel);

	    		var offsetX = state.offsetX,
	    			offsetY = state.offsetY;

	    		if (point) {
	    			console.log('(point.x - canvas.width / 2):', (point.x - state.centerX));
	    			//offsetX += (point.x - state.centerX);
	    			//offsetY += (point.y - state.centerY);

	    			console.log('setScaleLevel:', point, state);
	    		}

	    		offsetX -= (curLevel - oldLevel) * 50 * 1000 / Math.abs(ruleHorizontal.ratio - ruleHorizontalOld.ratio);
	    		offsetY -= (curLevel - oldLevel) * 50 * 1000 / Math.abs(ruleVertical.ratio - ruleVerticalOld.ratio);

    			state.offsetX = offsetX;
    			state.offsetY = offsetY;

    			console.log('setScaleLevel:', state.scaleLevel, state.offsetX, state.offsetY, state.centerX);
    		}

    		return this.setCenterPoint(map);
    	},
    	getRatioRule: function (map, vertical, appointLevel) {
    		var opt = map.options,
    			rules = vertical ? opt.heightRules : opt.scaleRules,
    			max = rules.length,
    			//level = (appointLevel || map.state.scaleLevel) - 1;
    			level = (appointLevel || map.state.scaleLevel) - 1;

    		if (level >= max) {
    			level = max - 1;
    		}
    		var cfg = rules[level] || [];

    		return { grid: 50, ratio: cfg[0], text: cfg[1], vertical: vertical || false };
    	},
    	setRatioRule: function (map, vertical) {
    		var opt = map.options,
    			id = 'oui_gridmap_rule_' + map.id + (vertical ? '_v' : ''),
    			elem = $I(id);

    		if (!elem) {
    			elem = document.createElement('div');
    			elem.id = id;
    			elem.className = 'oui-gridmap-rule' + (vertical ? '-v' : '');
    			elem.style.cssText = '';
    			elem.innerHTML = [
    				'<div class="text"></div>',
    				'<div class="line2"></div>',
	    			'<div class="line"></div>'
	    		].join('');

    			map.canvas.parentNode.appendChild(elem);
    		}
    		var nodes = elem.childNodes,
    			attr = vertical ? 'height' : 'width',
    			ratio = this.getRatioRule(map, vertical);

    		nodes[0].style[attr] = ratio.grid + 'px';
    		nodes[0].innerHTML = ratio.text;

    		nodes[1].style[attr] = ratio.grid + 'px';
    		nodes[2].style[attr] = ratio.grid + 'px';

    		if (!vertical && opt.vertical && opt.heightRules && opt.heightRules.length > 0) {
    			this.setRatioRule(map, true);
    		}

    		return this;
    	},
    	gotoCenter: function (map) {
			map.state.offsetX = 0;
	        map.state.offsetY = 0;
	        return this.drawGridMap(map, false);
    	},
    	PolygonCenter: function(mai) {
    		return this;
    	},
    	getCanvasCenter: function (map) {
    		var canvas = map.canvas,
    			state = map.state,
    			parent = canvas.parentNode,
    			size = $.getOffset(parent),
    			xc = size.width / 2,
    			yc = size.height / 2,
    			x = xc * state.scale + state.offsetX,
    			y = yc * state.scale + state.offsetY;

    		return { x: x, y: y, xc: xc, yc: yc };
    	},
    	calculateDistance: function (lat1, lon1, lat2, lon2) {
		    // 地球半径（米）
		    const R = 6378137;
		    
		    // 将经纬度从度转换为弧度
		    const d1 = lat1 * Math.PI / 180;
		    const d2 = lat2 * Math.PI / 180;
		    const a1 = (lat2 - lat1) * Math.PI / 180;
		    const a2 = (lon2 - lon1) * Math.PI / 180;
		    
		    // Haversine公式
		    const a = Math.sin(a1 / 2) * Math.sin(a1 / 2) +
		              Math.cos(d1) * Math.cos(d2) *
		              Math.sin(a2 / 2) * Math.sin(a2 / 2);
		    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		    
		    // 计算距离并四舍五入到毫秒（小数点后三位）
		    const distance = R * c;
		    return parseFloat(distance.toFixed(3));
		},
    	getPointPosition: function (map, pointFirst, point, vertical) {
    		if (!point.latitude || !point.longitude) {
    			return point;
    		}
    		var that = this,
    			distanceHorizontal = that.calculateDistance(0, pointFirst.longitude, 0, point.longitude),
    			distanceVertical,
    			x, y, ruleSize = 50,
    			symbolX = point.longitude >= pointFirst.longitude ? 1 : -1,
    			symbolY = 1;

    		//1.根据经纬度计算距离
    		if (vertical) {
    			//高度的位置是相反的
    			symbolY = point.height >= pointFirst.height ? -1 : 1,
    			distanceVertical = pointFirst.height - point.height;
    		} else {
    			//高度的位置是相反的
    			symbolY = point.latitude >= pointFirst.latitude ? -1 : 1,
    			distanceVertical = that.calculateDistance(pointFirst.latitude, 0, point.latitude, 0);    			
    		}

    		//2.根据比例尺换算距离
    		var ruleHorizontal = that.getRatioRule(map, false),
    			ruleVertical = that.getRatioRule(map, vertical);

    		$.console.log('distanceHorizontal:', distanceHorizontal, distanceVertical, ruleHorizontal, 1000 / ruleHorizontal.ratio, ruleSize, 1000 / ruleHorizontal.ratio * ruleSize);

    		distanceHorizontal *= 1000 / ruleHorizontal.ratio * ruleSize / map.state.scaleLevel;
    		distanceVertical *= 1000 / ruleVertical.ratio * ruleSize / map.state.scaleLevel;

    		//3.根据中心点计算相对位置
    		x = pointFirst.x + (symbolX * distanceHorizontal);
    		y = pointFirst.y + (symbolY * distanceVertical);

			$.console.log('distanceHorizontal:', distanceHorizontal, distanceVertical);

    		return $.extend(point, { x: x, y: y });
    	},
    	setCenterPoint: function (map) {
    		var state = map.state;
    		state.centerX += state.offsetX;
    		state.centerY += state.offsetY;
    		return this;
    	},

    	drawGrid: function (map) {
    		var opt = map.options,
    			canvas = map.canvas,
    			state = map.state,
    			ctx = map.ctx;

    		if (!opt.showLine) {
    			return this;
    		}
    		var lineWidth = 0.1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = lineWidth;

            if (opt.dashLine) {
	            ctx.setLineDash([1, 1]);
	        }

            var gridWidth = opt.gridWidth * (opt.gridFixed ? 1 : state.scale);
            var gridHeight = opt.gridHeight * (opt.gridFixed ? 1 : state.scale);
            var startX = Math.floor(-state.offsetX / gridWidth) * gridWidth + state.offsetX;
            var startY = Math.floor(-state.offsetY / gridHeight) * gridHeight + state.offsetY;

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
    	calcPointPosition: function (map, point) {
    		if (!point.latitude && point.x) {
    			return point;
    		}
    		var canvas = map.canvas,
    			state = map.state,
    			widthRange = 180,
    			heightRange = 90,
    			canvasWidth = canvas.width,
    			canvasHeight = canvas.height,
    			ratioWidth = canvasWidth / widthRange,
    			ratioHeight = canvasHeight / heightRange;

    		var x = point.longitude * ratioWidth,
    			y = canvasHeight - (point.latitude * ratioHeight);

    		return $.extend(point, { x: x, y: y });
    	},
    	drawLine: function (canvas, ctx, state, point1, point2, lineColor, lineWidth) {
    		ctx.beginPath();

    		// 将世界坐标转换为屏幕坐标
            var px1 = point1.x * state.scale + state.offsetX;
            var py1 = point1.y * state.scale + state.offsetY;
            var px2 = point2.x * state.scale + state.offsetX;
            var py2 = point2.y * state.scale + state.offsetY;

    		ctx.moveTo(px1, py1);
    		ctx.lineTo(px2, py2);
    		ctx.strokeStyle = lineColor;
    		ctx.lineWidth = lineWidth;
    		ctx.lineCap = 'round';
    		ctx.stroke();
            ctx.fill();

    		return this;
    	},
    	drawDashedLine: function (canvas, ctx, state, point1, point2, dashLength, gapLength, lineColor, lineWidth) {
    		ctx.beginPath();
    		ctx.strokeStyle = lineColor;
    		ctx.lineWidth = lineWidth;

            var px1 = point1.x * state.scale + state.offsetX;
            var py1 = point1.y * state.scale + state.offsetY;
            var px2 = point2.x * state.scale + state.offsetX;
            var py2 = point2.y * state.scale + state.offsetY;

    		var dx = px2 - px1,
    			dy = py2 - py1,
    			distance = Math.sqrt(dx * dx + dy * dy),
    			angle = Math.atan2(dy, dx),
    			//虚线总长度（段长+间距）
    			dashTotal = dashLength + gapLength,
    			//虚线段数
    			segments = Math.ceil(distance / dashTotal);

    		for (var i = 0; i < segments; i++) {
    			//计算当前段的起点和终点
    			var segmentStart = i * dashTotal,
    				segmentEnd = segmentStart + dashLength,
    				//如果超出总距离，调整终点
    				actualEnd = Math.min(segmentEnd, distance);

    			var x1 = px1 + segmentStart * Math.cos(angle),
    				y1 = py1 + segmentStart * Math.sin(angle),
    				x2 = px2 + actualEnd * Math.cos(angle),
    				y2 = py2 + actualEnd * Math.sin(angle);

    			ctx.moveTo(x1, y1);
    			ctx.lineTo(x2, y2);
    		}
    		ctx.stroke();
            ctx.fill();

            $.console.log('drawDashedLine:', point1, point2);

    		return this;
    	},
    	drawPoint: function (canvas, ctx, point, state, origin) {
    		var that = this;
    		// 将世界坐标转换为屏幕坐标
            var screenX = point.x * state.scale + state.offsetX;
            var screenY = point.y * state.scale + state.offsetY;
            var radius = point.radius,
            	diameter = radius * 2;
            
            if (screenX >= -diameter && screenX <= canvas.width + diameter && 
                screenY >= -diameter && screenY <= canvas.height + diameter) {
                ctx.beginPath();
                ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
                ctx.fill();
            }

            if (point.dashTo) {
            	that.drawDashedLine(canvas, ctx, state, point, point.dashTo, 1, 5, '#f00', 1);
            } else if (point.lineTo) {
            	that.drawLine(canvas, ctx, state, point, point.lineTo, '#f00', 1);
            }
    		return that;
    	},
    	drawPoints: function (map) {
    		var that = this,
    			canvas = map.canvas,
    			opt = map.options,
    			ctx = map.ctx,
    			points = map.state.points,
    			len = points.length,
    			pc = that.getCanvasCenter(map);

    		//console.log('drawPoints:', points, pc);

    		if (len <= 0) {
    			return this;
    		}

    		var colors = ['#f00', '#00f', '#000', '#008000', '#f50'],
    			colorCount = colors.length;

			// 绘制点
            ctx.fillStyle = colors[0];
            var pointRadius = 3; // 点直径固定为3px

    		var p, p0;
    		for (var i = 0; i < len; i++) {
    			p = points[i];
    			p.radius = p.radius || pointRadius;

    			ctx.fillStyle = p.color || colors[i % colorCount];

    			if (0 === i) {
    				p0 = p = p.latitude ? Factory.calcPointPosition(map, p) : p;
    				that.drawPoint(canvas, ctx, p, map.state, true);
    			} else {
	    			p = that.getPointPosition(map, p0, p, opt.vertical);
    				that.drawPoint(canvas, ctx, p, map.state, true);
	    		}
    		}

    		if($.isDebug()) {
	    		$.console.log('points:', points);
	    	}

    		return this;
    	},
    	drawGridMap: function (map, resize) {
    		var that = this,
    			canvas = map.canvas,
    			ctx = map.ctx;

            // 清除Canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

    		if (resize) {
    			if (Factory.setCanvasSize(map)) {
    				Factory.setRatioRule(map).drawGrid(map).drawPoints(map);
    			}
    		} else {
    			Factory.setCanvasSize(map);
    			Factory.setRatioRule(map).drawGrid(map).drawPoints(map);
    		}
    		if ($.isDebug()) {
	    		$.console.log('state:', map.state);
	    	}
    		return this;
    	},
    	showScaleRatio: function (map) {
    		document.querySelector('#oui-gridmap-tools-' + map.id + ' .ratio').innerHTML = map.state.scale;
    		return this;
    	},
    	zoomAtCenter: function (map, delta, level) {
    		var state = map.state,
    			canvas = map.canvas;

    		const oldScale = state.scale;
    		if (level) {
    			state.scale += delta;
    		} else {
            	state.scale *= delta;
    		}
            state.scale = Math.max(1, Math.min(state.scale, 32)); // 限制缩放范围
            
            Factory.showScaleRatio(map);

            state.scaleLevel = state.scale;

            // 调整偏移量以保持中心点不变
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            state.offsetX = centerX - (centerX - state.offsetX) * (state.scale / oldScale);
            state.offsetY = centerY - (centerY - state.offsetY) * (state.scale / oldScale);
            
            return Factory.drawGridMap(map);
    	},
    	zoomAtPoint: function (map, delta, x, y, level) {
    		var state = map.state,
    			oldScale = state.scale;

    		if (level) {
    			state.scale += delta;
    		} else {
            	state.scale *= delta;
    		}

            state.scale = Math.max(1, Math.min(state.scale, 32)); // 限制缩放范围

            Factory.showScaleRatio(map);

            state.scaleLevel = state.scale;
            
            // 调整偏移量以保持指定点不变
            state.offsetX = x - (x - state.offsetX) * (state.scale / oldScale);
            state.offsetY = y - (y - state.offsetY) * (state.scale / oldScale);
            
            return Factory.drawGridMap(map);
    	},
    	resetView: function (map) {
    		var state = map.state;

            state.scale = 1;
            state.offsetX = 0;
            state.offsetY = 0;

            return Factory.drawGridMap(map);
    	}
    };

    function GridMap(options) {
    	var opt = $.extend({
    		gridWidth: 50,
    		gridHeight: 50,
    		scaleRules: [
    			[100*1000*1000,'100公里'],[50*1000*1000,'50公里'],[20*1000*1000,'20公里'],[10*1000*1000,'10公里'],
    			[5*1000*1000,'5公里'],[3*1000*1000,'3公里'],[2*1000*1000,'2公里'],[1000*1000,'1公里'],
    			[500*1000,'500米'],[400*1000,'400米'],[300*1000,'300米'],[200*1000,'200米'],
    			[100*1000,'100米'],[50*1000,'50米'],[40*1000,'40米'],[30*1000,'30米'],
    			[20*1000,'20米'],[10*1000,'10米'], [5000,'5米'],[2000,'2米'],
                [1000,'1米'],[500,'50厘米'],[400,'40厘米'],[300,'30厘米'],
                [200,'20厘米'],[100,'10厘米'],[50,'5厘米'],[20,'2厘米'],
                [10,'1厘米'],[5,'5毫米'],[2,'2毫米'],[1,'1毫米']
            ],
            heightRules: [
    			[1000*1000,'1公里'],
    			[500*1000,'500米'],[400*1000,'400米'],[300*1000,'300米'],[200*1000,'200米'],
    			[100*1000,'100米'],[50*1000,'50米'],[40*1000,'40米'],[30*1000,'30米'],
    			[20*1000,'20米'],[10*1000,'10米'], [5000,'5米'],[2000,'2米'],
                [1000,'1米'],[500,'50厘米'],[400,'40厘米'],[300,'30厘米'],
                [200,'20厘米'],[100,'10厘米'],[50,'5厘米'],[20,'2厘米'],
                [10,'1厘米'],[5,'5毫米'],[2,'2毫米'],[1,'1毫米']
            ],
            vertical: false,
    		scaleLevel: 1,
    		gridFixed: true,
    		showLine: true,
    		dashLine: true,
    		points: [],
    		clickCallback: null
    	}, options);

    	this.options = opt;
    	this.canvas = $.toElement(opt.canvas);
    	this.id = this.canvas.id;
    	if (this.canvas) {
	    	this.ctx = this.canvas.getContext('2d');
	    	this.canvas.parentNode.style.position = 'relative';
	    	//$.addClass(this.canvas.parentNode, '');
	    }

    	this.state = {
    		canvasWidth: 0,
    		canvasHeight: 0,
            scale: opt.scale || 1.0,
            scaleLevel: opt.scaleLevel,
            offsetX: 0,
            offsetY: 0,
            isDragging: false,
            lastX: 0,
            lastY: 0,
            centerX: this.canvas.width / 2,
            centerY: this.canvas.height / 2,
            points: [] // 存储所有点的位置
    	};

    	if ($.isArray(opt.points)) {
    		this.state.points.concat(opt.points);
    	}
	    this.initial();
	}

    GridMap.prototype = {
    	initial: function() {
    		var that = this,
    			opt = that.options,
    			state = that.state,
    			canvas = that.canvas;

    		Factory.buildScaleBar(that).drawGridMap(that);

    		Factory.zoomAtCenter(that, 0, opt.scaleLevel);

    		$.addListener(window, 'resize', function() {
    			$.debounce({delay: 50, timeout: 3000}, function() {
    				Factory.drawGridMap(that);
    			});
    		});

    		$.addListener(canvas, 'mousedown', function(e) {
				// 检查是否按下了Ctrl键或Meta键(用于添加点)
	            if (e.ctrlKey || e.metaKey) {
	                // 添加点
	                const worldX = (e.clientX - state.offsetX) / state.scale;
	                const worldY = (e.clientY - state.offsetY) / state.scale;
	                state.points.push({ x: worldX, y: worldY });

	                Factory.drawGridMap(that);
	            } else {
	                // 开始拖动
	                state.isDragging = true;
	                state.lastX = e.clientX;
	                state.lastY = e.clientY;
	                canvas.style.cursor = 'grabbing';
	            }
    		});

			$.addListener([canvas, document], 'mousemove', function(e) {
	            if (state.isDragging) {
	                const dx = e.clientX - state.lastX;
	                const dy = e.clientY - state.lastY;
	                state.offsetX += dx;
	                state.offsetY += dy;
	                state.lastX = e.clientX;
	                state.lastY = e.clientY;

	                Factory.setCenterPoint(that).drawGridMap(that);
	            }
	        });
	        
			$.addListener([canvas, document], 'mouseup', function(e) {
	            if (state.isDragging) {
	                state.isDragging = false;
	                canvas.style.cursor = 'default';
	            }
	        });

			$.addListener([canvas], 'wheel', function(e) {
	            e.preventDefault();
	            /*
	            var left = canvas.parentNode.offsetLeft,
	                top = canvas.parentNode.offsetTop;

	            // 获取鼠标位置相对于画布的坐标
	            const mouseX = e.clientX - left;
	            const mouseY = e.clientY - top;
	            */
	            var left = e.clientX - canvas.getBoundingClientRect().left,
	            	top = e.clientY - canvas.getBoundingClientRect().top;

 				const mouseX = e.clientX - canvas.getBoundingClientRect().left;
            	const mouseY = e.clientY - canvas.getBoundingClientRect().top;

	            //const delta = e.deltaY > 0 ? 1 / 1.1 : 1.1;
	            const delta = e.deltaY > 0 ? -1 : 1;
	            //Factory.zoomAtPoint(that, delta, mouseX, mouseY, true);
	            Factory.zoomAtCenter(that, delta, true);
	        });

	        $.addListener([canvas], 'click', function(e) {
	        	var rect = canvas.getBoundingClientRect(),
	        		clickX = e.clientX - rect.left,
	        		clickY = e.clientY - rect.top,
	        		points = that.state.points;

	        	for (var i = 0; i < points.length; i++) {
					var p = points[i],
						px = p.x * state.scale + state.offsetX,
						py = p.y * state.scale + state.offsetY,
						distance = Math.sqrt((clickX - px) ** 2 + (clickY - py) ** 2);

	        		if (distance <= p.radius) {
	        			$.console.log('ppp:', i, p);
	        			if ($.isFunction(opt.clickCallback)) {
	        				opt.clickCallback(e, p, that);
	        			}
	        			break;
	        		}
	        	}
	        });

    		return this;
    	},
    	add: function (points) {

    		return this;
    	},
    	remove: function (points) {

    		return this;
    	},
    	clear: function () {

    		return this;
    	},
    	update: function (points) {
    		var that = this;
    		that.state.points = $.isArray(points) ? points : [];
    		return Factory.drawGridMap(that), that;
    	},
    	scale: function (level, action) {
    		return Factory.setScaleLevel(this, level, action, true).drawGridMap(this), this;
    	},
    	center: function () {
    		return Factory.gotoCenter(this);
    	}
    };

    $.extend({
    	gridmap: function(id, options) {
    		return Factory.buildGridMap(id, options);
    	}
    });

}(OUI);