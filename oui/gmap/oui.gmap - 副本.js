/*
	@Title: OUI
	@Description：JS通用代码库
	@Author: oukunqing
	@License：MIT

	$.gmap 网格地图
*/

!function ($) {
    'use strict';

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
    			center = view.curCenter ? view.curCenter : view.defCenter;

            // 简化的经纬度到平面坐标的转换
            // 实际应用中可能需要使用墨卡托投影等更精确的方法
            const x = (lng - center.latitude) * view.scale + canvas.width / 2 + view.offsetX;
            const y = (center.longitude - lat) * view.scale + canvas.height / 2 + view.offsetY;
            return { x, y };
    	},
    	render: function (map) {
    		const view = map.view, canvas = map.canvas, ctx = map.ctx;

    		ctx.clearRect(0, 0, canvas.width, canvas.height);

    		console.log('scale:', view.scale);

            // 保存当前状态
            //ctx.save();

            this.drawGrid(map);
            this.drawPoints(map);
            this.drawRules(map);

            //ctx.restore();

            return this;
    	},
    	drawGrid: function (map) {
    		const view = map.view, canvas = map.canvas, ctx = map.ctx;
            //const gridSize = 50 * view.scale;
            const gridSize = view.gridSize * (view.gridFixed ? 1 : view.scale);
            const startX = (view.offsetX % gridSize + gridSize) % gridSize;
            const startY = (view.offsetY % gridSize + gridSize) % gridSize;
            
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 0.1;
            ctx.setLineDash([1, 1]);
            
            // 绘制垂直线
            for (let x = startX; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            
            // 绘制水平线
            for (let y = startY; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            return this;
    	},
    	drawPoint: function (point) {
    		return this;
    	},
    	drawPoints: function (map) {
    		const points = map.view.points, ctx = map.ctx;
    		points.forEach(point => {
    			const pos = Factory.latLngToCanvas(map, point.latitude, point.longitude);

    			// 绘制点
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
                ctx.fillStyle = '#e74c3c';
                ctx.fill();
                
                // 绘制标签
                ctx.fillStyle = '#333';
                ctx.font = '12px Arial';
                ctx.fillText(point.name, pos.x + 8, pos.y - 8);
    		});
    		return this;
    	},
    	drawRules: function (map) {

    		return this;
    	},
    	setCenter: function (map, point) {
    		map.view.curCenter = {
    			latitude: point.latitude,
    			longitude: point.longitude
    		};
    		Factory.render(map);
    		return this;
    	},
    	handleMouseDown: function (e, map) {
    		if (e.ctrlKey || e.metaKey) {
    			return this;	
    		}
    		if (!e.button) {
	    		const rect = map.canvas.getBoundingClientRect();
	    		map.view.isDragging = true;
	    		map.view.lastX = e.clientX - rect.left;
	    		map.view.lastY = e.clientY - rect.top;
    		}
    	},
    	handleMouseMove: function (e, map) {
    		const view = map.view, canvas = map.canvas,
    		 	rect = canvas.getBoundingClientRect(),
			 	mouseX = e.clientX - rect.left,
             	mouseY = e.clientY - rect.top,
    			center = view.curCenter ? view.curCenter : view.defCenter;

    		console.log('center:', center);
			
            // 计算鼠标位置对应的经纬度
            const mouseLat = center.latitude - (mouseY - canvas.height / 2 - view.offsetY) / view.scale,
            	mouseLng = (mouseX - canvas.width / 2 - view.offsetX) / view.scale + center.longitude;

            $.console.log('mouseLat:', mouseLat, ', mouseLng:', mouseLng, ', scale:', view.scale);
            
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
    		map.view.isDragging = false;
    	},
    	handleWheel: function (e, map) {
    		const view = map.view, canvas = map.canvas;
    		e.preventDefault();
            
            // 获取鼠标在Canvas上的位置
    		var rect = canvas.getBoundingClientRect(),
    			mouseX = e.clientX - rect.left,
    			mouseY = e.clientY - rect.top,
    			center = view.curCenter ? view.curCenter : view.defCenter;
            
            // 计算鼠标位置对应的经纬度
            const mouseLat = center.latitude - (mouseY - canvas.height / 2 - view.offsetY) / view.scale;
            const mouseLng = (mouseX - canvas.width / 2 - view.offsetX) / view.scale + center.longitude;
            
            // 确定缩放方向
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            
            // 更新缩放比例
            view.scale *= zoomFactor;
            
            // 限制缩放范围
            view.scale = Math.max(1, Math.min(100*1000*1000, view.scale));
            
            // 调整中心点，使鼠标位置保持固定
            const newMouseX = (mouseLng - center.longitude) * view.scale + canvas.width / 2 + view.offsetX;
            const newMouseY = (center.latitude - mouseLat) * view.scale + canvas.height / 2 + view.offsetY;
            
            view.offsetX += mouseX - newMouseX;
            view.offsetY += mouseY - newMouseY;
            
            // 重绘
            Factory.render(map);
    	}
    };

    function Map(options) {
    	var opt = $.extend({

    	}, options);

    	this.canvas = opt.canvas;
    	this.ctx = this.canvas.getContext('2d');
    	this.id = this.canvas.id;
    	this.options = opt;
    	this.view = {
    		gridSize: 50,
    		gridFixed: true,
    		defCenter: {
    			latitude: 0,
    			longitude: 0
    		},
    		curCenter: null,
            scale: 5,        // 缩放比例
            offsetX: 0,      // X轴偏移
            offsetY: 0,       // Y轴偏移

            isDragging: false,
            lastX: 0,
            lastY: 0,

            points: [{
            	latitude: 29.8732976498,
            	longitude: 121.6011577513,
            	name: 'C2-9364'
            },{
            	latitude: 29.8732976498,
            	longitude: 122.6011577513,
            	name: 'C1-9123'
            }]
    	};

    	this.initial(opt);
    }

    Map.prototype = {
    	initial: function(opt) {
    		var that = this, canvas = that.canvas, view = that.view;

    		var box = canvas.parentNode;
			if (box.tagName === 'DIV') {
				box.style.position = 'relative';
				this.box = box;
			}

			$.addListener(window, 'resize', function() {
    			$.debounce({delay: 50, timeout: 3000}, function() {
    				that.size();
    			});
    		});
			
    		$.addListener(canvas, 'mousedown', function(e) {
    			Factory.handleMouseDown(e, that);
    		});
    		canvas.addEventListener('mousemove', function(e) {
    			Factory.handleMouseMove(e, that);
    		});
    		$.addListener([canvas, document], 'mouseup', function(e) {
    			Factory.handleMouseUp(e, that);
    		});
    		$.addListener(canvas, 'wheel', function(e) {
    			Factory.handleWheel(e, that);
    		});

    		return Factory.render(that), that;
    	},
    	size: function (size) {
    		var that = this;
    		console.log('size:', size);
    		if (size && size.width && size.height) {
    			that.canvas.width = size.width;
    			that.canvas.height = size.height;
    		} else if (that.box) {
    			that.canvas.width = that.box.clientWidth;
    			that.canvas.height = that.box.clientHeight;
    		}
    		return Factory.render(that), that;
    	},
    	center: function (point) {
    		var that = this;
    		if (Factory.isPoint(point)) {
    			Factory.setCenter(that, point);
    			return that;
    		}
    		return that.view.center;
    	},
    	scale: function (level) {
    		var that = this;
    		if (!level) {
    			return that.view.scale;
    		}
    		that.view.scale = level;
    		return Factory.render(that), that;
    	},
    	update: function (points) {
			return this;
    	}
    };

    $.extend({
    	gmap: function (id, options) {
    		return Factory.buildMap(id, options);
    	}
    })

} (OUI);