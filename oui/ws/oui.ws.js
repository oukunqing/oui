
/*
	@Title: OUI
	@Description：JS通用代码库
	@Author: oukunqing
	@License：MIT

	$.ws WebSocket Client
*/

!function ($) {
    'use strict';

    const Cache = {
    	caches: {},
    	timers: {}
    };

    const Factory = {
    	setCache: function (id, ws) {
            Cache.caches['ws_' + id] = {
                id: id,
                ws: ws,
            };
            return this;
    	},
    	getCache: function (id) {
            return Cache.caches['ws_' + id];
    	},
    	build: function (id, options) {
    		if ($.isObject(id)) {
    			options = $.extend({}, id);
    			id = null;
    		}

    		let opt = $.extend({ id: id, url: '' }, options),
    			that = this;

    		if (!$.isString(opt.id)) {
    			opt.id = 1;
    		}
    		let cache = that.getCache(opt.id), ws;

    		if (cache) {
    			ws = cache.ws;
    			if ($.isString(opt.subscribe, true)) {
    				$.extend(ws.options, opt);
    			}
    		} else {
    			ws = new WS(opt);
                that.setCache(opt.id, ws);
    		}
    		return ws;
    	},
    	connect: function (ws) {
    		let that = this,
    			opt = ws.options,
    			url = opt.url, 
            	msgfunc = $.isFunction(opt.onmessage) ? opt.onmessage : function (data) { };

            if (ws.client && ws.client.readyState === WebSocket.OPEN) {
            	if (ws.paused || ws.closed) {
            		ws.paused = false;
            		ws.closed = false;
            		that.send(ws.client, opt.subscribe);
            	}
            	return that;
            }
            if (!url) {
            	return that;
            }

            let o = new WebSocket(url);

            $.console.log('[ws connect]', o.url, '[subscribe]', opt.subscribe);

		 	o.onclose = function () {
	            $.console.log("[ws closed]", o.url);
	            that.disconnect(ws).reconnect(ws);
	        };

	        o.onerror = function () {
	            $.console.log("[ws error]", o.url);
	            that.disconnect(ws).reconnect(ws);
	        };

	        o.onmessage = function ({ data }) {
	        	if (ws.paused) {
	        		return false;
	        	}
	            if (opt.printlog) {
	                $.console.log("[ws recv][" + o.url + ']', data);
	            }
	            if (data.indexOf('heartbeat') > -1 && opt.heartbeat) {
	            	that.send(o, opt.heartbeat);
	            }
	            msgfunc(data, ws);
	        };

	        if (opt.subscribe) {
	        	ws.paused = false;
	        	ws.closed = false;
	        	if (o.readyState === WebSocket.OPEN) {
		        	that.send(o, opt.subscribe);
	        	} else {
	        		that.openAndSend(o, opt.subscribe);
		        }
	        }

    		ws.client = o;

    		return that;
    	},
    	openAndSend: function (client, data) {
    		let that = this;
    		client.onopen = function() {
                $.console.log('[ws connected]', client.url);
                that.send(client, data);
    		};
    		return that;
    	},
    	reconnect: function (ws) {
    		let that = this, opt = ws.options;
    		if (ws.paused || ws.closed) {
    			return that;
    		}
    		if (Cache.timers['ws_' + opt.id]) {
    			window.clearTimeout(Cache.timers['ws_' + opt.id]);
    		}
    		Cache.timers['ws_' + opt.id] = window.setTimeout(function() {
    			that.connect(ws);
    		}, opt.reconnectInterval);
    		return that;
    	},
    	disconnect: function (ws) {
			if (ws.client.readyState === WebSocket.OPEN) {
                ws.client.close();
            }
            return this;
    	},
    	send: function (client, data) {
    		if (!$.isString(data, true)) {
    			return this;
    		}
    		client.send(data);
            $.console.log("[ws send][" + client.url + ']', data);
    		return this;
    	},
    	sendData: function (ws, data) {
    		let that = this;
    		if (!ws.client) {
    			that.connect(ws);
    			return that;
    		}
    		switch(ws.client.readyState) {
    		case WebSocket.OPEN:
    			that.send(ws.client, data);
    			break;
    		case WebSocket.CONNECTING:
	        	that.openAndSend(ws.client, data);
    			break;
    		default:
    			if (!ws.paused && !ws.closed) {
    				that.connect(ws);
    			}
    			break;
    		}
    		return that;
    	}
    };

    function WS(options) {
    	var opt = $.extend({
    		id: '',
    		printlog: true,
    		// 心跳数据
    		heartbeat: '',
    		// 订阅数据
    		subscribe: '',
    		// 断开后重连的间隔
    		reconnectInterval: 5000,
    		onmessage: null,
    		onerror: null
    	}, options);

    	this.options = opt;
    	this.client = null;
    	this.paused = false;
    	this.closed = false;
    	this.initial(opt);
    }

    WS.prototype = {
    	initial: function (options) {
    		Factory.connect(this);
    		return this;
    	},
    	send: function (data) {
    		let that = this, opt = that.options;
    		if ($.isString(data, true) && !$.isString(opt.subscribe, true)) {
    			opt.subscribe = data;
    		}
    		Factory.sendData(that, data);
    		return that;
    	},
    	subscribe: function (data) {
    		let that = this, opt = that.options;
    		if ($.isString(data, true)) {
    			opt.subscribe = data;
    		}
    		this.paused = false;
    		this.closed = false;
    		Factory.sendData(that, data);
    		return that;
    	},
    	register: function (data) {
    		return this.subscribe(data);
    	},
    	open: function () {
    		Factory.connect(this);
    		return this;
    	},
    	close: function () {
    		this.closed = true;
    		Factory.disconnect(this);
    		return this;
    	},
    	pause: function (pause) {
    		this.paused = $.isBoolean(pause) ? pause : !this.paused;
    		$.console.log('[ws pause]', this.paused);
    		return this;
    	}
    };

    $.extend({
    	ws: function (id, options) {
    		return Factory.build(id, options);
    	}
    });

} (OUI);