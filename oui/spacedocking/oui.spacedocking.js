

!function ($) {
	'use strict';

	var Cache = {
		caches: {},
		getCache: function(id) {
			return Cache.caches['sd_' + id];
		},
		setCache: function (id, obj) {
			Cache.caches['sd_' + id] = {
				id: id,
				obj: obj,
			};
			return this;
		}
	};

	var Factory = {
		buildSpaceDocking: function (id, options) {
			var opt = $.extend({id: id}, options);

			var cache = Cache.getCache(opt.id), obj;
			if (cache) {
				obj = cache.obj;
				obj.update(options);
			} else {
				obj = new SpaceDocking(opt);
				Cache.setCache(opt.id, obj);
			}
			return obj;
		},
		calcDistance: function (p1, p2) {
			var distance = $.calcLocationDistance(p1, p2);
			console.log('distance:', p1.latitude, p1.longitude, p2.latitude, p2.longitude, distance);
			return distance;
		},
		// {floors:[{points:[{},{}]},{points:[{},{}]}]}
		calcSpaceDistance: function (options) {
			var that = this;
			var d = {points:[]};
			var f1 = options.floors[0],
				f2 = options.floors[1];

			var c1 = f1.points.length,
				c2 = f2.points.length;

			for (var i = 0; i < c1; i++) {
				var distance = -1;
				d.points[i] = {distances:[], source: f1.points[i]};

				for (var j = 0; j < c2; j++) {
					var val = that.calcDistance(f1.points[i], f2.points[j]);

					d.points[i].distances[j] = val;

					if (distance < 0 || (val >= 0 && val < distance)) {
						distance = val;
						d.points[i].minDistance = distance;
						d.points[i].target = f2.points[j];
						d.points[i].minIndex = j;
					}
				}
			}
			console.log('d:', d);
			return d;
		}
	};

	function SpaceDocking (options) {
		this.initial(options);
	}

	SpaceDocking.prototype = {
		initial: function (options) {
			return this;
		},
		update: function (options) {
			return this;
		},
		distance: function (options) {
			var d = Factory.calcSpaceDistance(options);
			return d;
		}
	};



	$.extend({
		spacedocking: function(id, options) {
			return Factory.buildSpaceDocking(id, options);
		}
	});


}(OUI);