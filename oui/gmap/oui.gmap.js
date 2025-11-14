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
        TextFont: '12px Arial'
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
        setTextPosition: function (position, pointPos, radius, fontSize) {
            let textPos = {}, pos = pointPos;

            switch(position){
            case 1:
                textPos = { x: pos.x - radius, y: pos.y - radius };
                break;
            case 2:
                textPos = { x: pos.x, y: pos.y - radius };
                break;
            case 3:
                textPos = { x: pos.x + radius, y: pos.y - radius };
                break;
            case 5:
                textPos = { x: pos.x + radius, y: pos.y };
                break;
            case 7:
                textPos = { x: pos.x - radius, y: pos.y + radius + fontSize };
                break;
            case 8:
                textPos = { x: pos.x, y: pos.y + radius + fontSize };
                break;
            case 9:
                textPos = { x: pos.x + radius, y: pos.y + radius + fontSize };
                break;
            }
            return textPos;
        },
        setDistancePosition: function (position, pointPos, posTo, radius, fontSize) {
            let distancePos = {}, pos = pointPos;

            switch(position) {
            case 0:
                distancePos = { x: pos.x + radius * 2, y: pos.y + radius + fontSize };
                break;
            case 1:
                distancePos = { x: posTo.x + radius * 2, y: posTo.y + radius + fontSize };
                break;
            case 2:
                distancePos = { x: (pos.x + posTo.x) / 2, y: (pos.y + posTo.y) / 2 };
                break;
            }

            return distancePos;
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
    	render: function (map) {
    		const view = map.view, canvas = map.canvas, ctx = map.ctx;

    		ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        drawText: function (ctx, text, pos, textStyle) {
            let style = $.extend({color: '#333', font: Config.TextFont}, textStyle);
            // 绘制标签
            ctx.fillStyle = style.color;
            ctx.font = style.font;
            ctx.fillText(text, pos.x, pos.y);
            return this;
        },
    	drawPoint: function (point, map, ctx) {
            let that = this,
                opt = map.options,
                radius = point.radius || 4,
                pos = that.latLngToCanvas(map, point.latitude, point.longitude),
                posTo;

            // 绘制点
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = point.color || '#f00';
            ctx.fill();
            
            if (opt.showLine && point.lineTo) {
                posTo = that.latLngToCanvas(map, point.lineTo.latitude, point.lineTo.longitude);
                that.drawLine(map, ctx, pos, posTo, $.extend({color: point.color}, point.lineStyle));
            }

            if (opt.showDistance && point.distanceTo) {
                let distanceStyle = $.extend({ 
                    font: '16px Arial', position: 0, maxDistance: 0, ratio: 1, decimal: 3, unit: 'm'
                }, point.distanceStyle),
                    ratio = distanceStyle.ratio || 1,
                    fontSize = parseInt(distanceStyle.font, 10),
                    distancePos = {},
                    distance = 0;

                distance = $.calcLocationDistance(point, point.distanceTo, opt.plane);

                if (!distanceStyle.maxDistance || distance <= distanceStyle.maxDistance) {
                    if (!posTo) {
                        posTo = that.latLngToCanvas(map, point.lineTo.latitude, point.distanceTo.longitude);
                    }

                    distancePos = that.setDistancePosition(distanceStyle.position, pos, posTo, radius, fontSize);

                    if (ratio > 1) {
                        distance = (distance * ratio).round(distanceStyle.decimal);
                    } else if (distance > 1000) {
                        distance = (distance / 1000).round(distanceStyle.decimal);
                        distanceStyle.unit = 'km';
                    } else {
                        distance = distance.round(distanceStyle.decimal);
                    }

                    let distanceText = distance + distanceStyle.unit;

                    that.drawText(ctx, distanceText, distancePos, distanceStyle);
                }
            }

            if (opt.showText) {
                let text = point.text || point.name || '',
                    textStyle = $.extend({ font: Config.TextFont, position: 3 }, point.textStyle),
                    fontSize = parseInt(textStyle.font, 10),
                    textPos = that.setTextPosition(textStyle.position, pos, radius, fontSize);

                that.drawText(ctx, text, textPos, textStyle);
            }

    		return this;
    	},
    	drawPoints: function (map) {
            const that = this, points = map.view.points, ctx = map.ctx;
    		points.forEach(point => {
    			that.drawPoint(point, map, ctx);
    		});
    		return this;
    	},
    	drawRules: function (map) {

    		return this;
    	},
        setCenter: function (map, point) {
            map.view.curCenter = {
                latitude: point.latitude,
                longitude: point.longitude,
                height: point.height
            };
            return this;
        },
        setScale: function (map, scale) {
            if ($.isNumber(scale) && scale > 0) {
                map.view.scale = scale;
            } else {
                let view = map.view,
                    center = map.center(),
                    maxLat = 0, maxLng = 0,
                    points = view.points, len = points.length;

                for (var i = 0; i < len; i++) {

                }

            }
            return this;
        },
        setOverview: function (map) {
            let that = this, 
                view = map.view, 
                center = map.center(), 
                scale = view.scale,
                points = view.points;

            if (points.length > 0) {
                center = that.calcPolygonCenter(points);
                console.log('overview:', center);
                that.setCenter(map, center);
            }

            that.setScale(map, null);

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
    		const view = map.view, canvas = map.canvas;
    		e.preventDefault();
            
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
            view.scale = Math.max(1, Math.min(100*1000*1000, view.scale));
            
            // 调整中心点，使鼠标位置保持固定
            const newMouseX = (mouseLng - center.longitude) * view.scale + canvas.width / 2 + view.offsetX;
            const newMouseY = (center.latitude - mouseLat) * view.scale + canvas.height / 2 + view.offsetY;
            
            view.offsetX += mouseX - newMouseX;
            view.offsetY += mouseY - newMouseY;
            
            // 重绘
            Factory.render(map);

            return this;
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
            // 网格大小
            gridSize: 50,
            // 是否固定网格的大小
            gridFixed: true,
            // 是否自动全览
            showOverview: false,
            // 是否显示点的名称标签
            showText: true,
            // 是否显示两点间的连线
            showLine: true,
            // 是否计算并显示两点之间的距离
            showDistance: true,
            // 是否显示当前鼠标位置的经纬度
            showPosition: true,
            positionCallback: function(pos, map) {
                $.console.log('latitude:', pos.latitude, ', longitude:', pos.longitude, ', scale:', map.view.scale, ', center: ', );
            },
            points: [],
    	}, options);

    	this.canvas = opt.canvas;
    	this.ctx = this.canvas.getContext('2d');
    	this.id = this.canvas.id;
    	this.options = opt;
    	this.view = {
    		gridSize: opt.gridSize,
    		gridFixed: opt.gridFixed,
    		defCenter: {
    			latitude: 0,
    			longitude: 0,
                height: 0
    		},
    		curCenter: null,
            scale: opt.scale,   // 缩放比例
            offsetX: 0,         // X轴偏移
            offsetY: 0,         // Y轴偏移

            isDragging: false,
            lastX: 0,
            lastY: 0,

            points: []
    	};

    	if ($.isArray(opt.points)) {
    		this.view.points = opt.points;
    	}

    	this.initial(opt);
    }

    Map.prototype = {
    	initial: function(opt) {
    		var that = this, canvas = that.canvas, view = that.view;

    		var box = canvas.parentNode;
			if (box.tagName === 'DIV') {
				box.style.position = 'relative';
				box.style.overflow = 'hidden';
				this.box = box;
			}

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
                Factory.setOverview(that);
            }
    		return Factory.render(that), that;
    	},
        config: function (cfg) {
            var that = this;


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
                Factory.setOverview(that);
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
    		if (!scale) {
    			return that.view.scale;
    		}
            Factory.setScale(that, scale);

    		return Factory.render(that), that;
    	},
        overview: function () {
            Factory.setOverview(this).render(this);
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
                if (that.options.showOverview) {
                    Factory.setOverview(that);
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