
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
    	buildScaleBar: function (map) {
    		var div = document.createElement('div');
    		div.className = 'oui-gridmap-scale';
    		div.innerHTML = [
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
    			case 'add':
    				map.scale(1, 1);
    				break;
    			case 'sub':
    				map.scale(1, -1);
    				break;
    			}
    		});

    		return this;
    	},
    	setScaleLevel: function (map, level, action) {    		
    		var that = map,
    			maxScale = that.options.scaleRules.length,
    			maxHeightScale = that.options.heightRules.length,
    			curLevel = that.state.scaleLevel,
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
    			that.state.scaleLevel = curLevel;
    		} else {
    			that.state.scaleLevel = level > max ? max : level;
    		}

    		return this;
    	},
    	getRatioRule: function (map, vertical) {
    		var opt = map.options,
    			rules = vertical ? opt.heightRules : opt.scaleRules,
    			max = rules.length,
    			level = map.state.scaleLevel - 1;

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

    		$.console.log('nodes:', nodes, ratio);

    		nodes[0].style[attr] = ratio.grid + 'px';
    		nodes[0].innerHTML = ratio.text;

    		nodes[1].style[attr] = ratio.grid + 'px';
    		nodes[2].style[attr] = ratio.grid + 'px';

    		if (!vertical && opt.vertical && opt.heightRules && opt.heightRules.length > 0) {
    			this.setRatioRule(map, true);
    		}

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
    	gotoCenter: function (map) {
			map.state.offsetX = 0;
	        map.state.offsetY = 0;
	        return this.drawGridMap(map, false);
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
		    const φ1 = lat1 * Math.PI / 180;
		    const φ2 = lat2 * Math.PI / 180;
		    const Δφ = (lat2 - lat1) * Math.PI / 180;
		    const Δλ = (lon2 - lon1) * Math.PI / 180;
		    
		    // Haversine公式
		    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		              Math.cos(φ1) * Math.cos(φ2) *
		              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		    
		    // 计算距离并四舍五入到毫秒（小数点后三位）
		    const distance = R * c;
		    return parseFloat(distance.toFixed(3));
		},
    	getPointPosition: function (map, pointFirst, point, vertical) {
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

    		distanceHorizontal *= 1000 / ruleHorizontal.ratio * ruleSize;
    		distanceVertical *= 1000 / ruleVertical.ratio * ruleSize;
    		console.log('getPointPosition:', ruleHorizontal, ruleVertical);

    		//3.根据中心点计算相对位置
    		x = pointFirst.x + (symbolX * distanceHorizontal);
    		y = pointFirst.y + (symbolY * distanceVertical);

    		return $.extend(point, { x: x, y: y });
    	},
    	drawPoint: function (canvas, ctx, point, pointSize, state) {
    		// 将世界坐标转换为屏幕坐标
            var screenX = point.x * state.scale + state.offsetX;
            var screenY = point.y * state.scale + state.offsetY;
            
            if (screenX >= -pointSize && screenX <= canvas.width + pointSize && 
                screenY >= -pointSize && screenY <= canvas.height + pointSize) {
                ctx.beginPath();
                ctx.arc(screenX, screenY, pointSize / 2, 0, Math.PI * 2);
                ctx.fill();
            }
    		return this;
    	},
    	drawPoints: function (map) {
    		var that = this,
    			canvas = map.canvas,
    			opt = map.options,
    			ctx = map.ctx,
    			points = map.state.points,
    			len = points.length,
    			pc = that.getCanvasCenter(map);

    		console.log('drawPoints:', points, pc);

    		if (len <= 0) {
    			return this;
    		}

			// 绘制点
            ctx.fillStyle = 'red';
            var pointSize = 6; // 点直径固定为3px

    		//绘制第1个点
    		var p0 = $.extend(points[0], pc);
    		console.log('p0:', p0);
    		that.drawPoint(canvas, ctx, p0, pointSize, map.state);

    		for (var i = 1; i < len; i++) {
    			var p = that.getPointPosition(map, p0, points[i], opt.vertical);
    			console.log('i:', i, ',p:', p, p0, points[i]);
    			that.drawPoint(canvas, ctx, p, pointSize, map.state);
    		}
    		return this;
    	},
    	drawGridMap: function (map, resize) {
    		if (resize) {
    			if (Factory.setCanvasSize(map)) {
    				Factory.setRatioRule(map).drawGrid(map).drawPoints(map);
    			}
    		} else {
    			Factory.setCanvasSize(map);
    			Factory.setRatioRule(map).drawGrid(map).drawPoints(map);
    		}
    		return this;
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
    		scaleLevel: 13,
    		gridFixed: true,
    		showLine: true,
    		dashLine: true,
    		points: []
    	}, options);

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
            points: [] // 存储所有点的位置
    	};

    	if ($.isArray(opt.points)) {
    		this.state.points.concat(opt.points);
    	}
    	this.options = opt;
    	this.canvas = $.toElement(opt.canvas);
    	this.id = this.canvas.id;
    	if (this.canvas) {
	    	this.ctx = this.canvas.getContext('2d');
	    	this.canvas.parentNode.style.position = 'relative';
	    	//$.addClass(this.canvas.parentNode, '');
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
				$.cancelBubble(e);
	            if (state.isDragging) {
	                const dx = e.clientX - state.lastX;
	                const dy = e.clientY - state.lastY;
	                state.offsetX += dx;
	                state.offsetY += dy;
	                state.lastX = e.clientX;
	                state.lastY = e.clientY;

	                Factory.drawGridMap(that);
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
	            
	            // 获取鼠标位置相对于画布的坐标
	            const mouseX = e.clientX;
	            const mouseY = e.clientY;
	            
	            // 计算鼠标位置在世界坐标中的位置
	            const worldX = (mouseX - state.offsetX) / state.scale;
	            const worldY = (mouseY - state.offsetY) / state.scale;
	            
	            // 计算缩放因子
	            const delta = -e.deltaY;
	            let scaleFactor = 1.1;
	            if (delta < 0) {
	                scaleFactor = 1 / 1.1;
	            }
	            
	            // 应用缩放
	            state.scale *= scaleFactor;
	            
	            // 确保缩放有上限和下限
	            state.scale = Math.max(1, Math.min(state.scale, 32));
	            
	            // 调整偏移量，使缩放中心保持在鼠标位置
	            state.offsetX = mouseX - worldX * state.scale;
	            state.offsetY = mouseY - worldY * state.scale;
	            
	            Factory.drawGridMap(that);

	            */
	            var delta = -e.deltaY;
	            Factory.setScaleLevel(that, 1, delta < 0 ? -1 : 1).drawGridMap(that);
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
    		return Factory.setScaleLevel(this, level, action).drawGridMap(this), this;
    	},
    	center: function () {
    		return Factory.gotoCenter(this);
    	}
    };

    $.extend({
    	gridmap: function(id, opt) {
    		return Factory.buildGridMap(id, opt);
    	}
    });

}(OUI);