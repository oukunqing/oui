
/*
	@Title: OUI
	@Description：JS通用代码库
	@Author: oukunqing
	@License：MIT

	$.treemenu 树形导航菜单
*/

!function ($) {
    'use strict';

	var SelfPath = $.getScriptSelfPath(true),
		Config = {
			FilePath: SelfPath,
			FileName: 'oui.tree.',
			FileDir: $.getFilePath(SelfPath),
			DefaultSkin: 'default',
			IdPrefix: 'omenu_',
			Skin: '',
			GetSkin: function () {
				if (!Config.Skin) {
					Config.Skin = $.getQueryString(Config.FilePath, 'skin') || Config.DefaultSkin;
				}
				return Config.Skin;
			}
		},
		Cache = {
			ids: [],
			menus: {},
			caches: {}
		},
		Factory = {
			loadCss: function (skin, func) {
            	$.loadJsScriptCss(Config.FilePath, skin, func, Config.FileName);
				return this;
			},
			initCache: function (menu, force) {
				var opt = menu.options,
					par = {},
					mid = Factory.buildMenuId(menu.id),
					pa = $.extend({}, par),
					pc = Cache.caches[mid];

				if (!pc || force) {
					pc = $.extend({
						nodes: {},
						levels: {}
					}, pa);
					Cache.caches[mid] = pc;
				}

				menu.cache = pc;

				return this;
			},
			initParam: function (key, par) {
				if (!$.isUndefined(par[key])) {
					this[key] = par[key];
				}
				return this;
			},
			setParam: function (key, val, strict) {
				if (strict) {
					if (!$.isUndefinedOrNull(val)) {
						this[key] = val;
					}
					return this;
				}
				return this[key] = val, this;
			},
			setNodeCache: function (menu, node) {
				menu.cache.nodes[node.id] = node;

				if(!menu.cache.levels[node.level]) {
					menu.cache.levels[node.level] = {};
				}
				menu.cache.levels[node.level][node.id] = node;

				menu.cache.level = Math.max(menu.cache.level, node.level);
				menu.cache.count += 1;
				menu.cache.total += 1;
					
				return this;
			},
			deleteNodeCache: function (menu, node) {
				var cache = menu.cache,
					nid = node.id,
					level = node.level;

				//删除levels数据
				if (cache.levels[level] && cache.levels[level][nid]) {
					delete cache.levels[level][nid];
				}
				//删除nodes数据
				if (cache.nodes[nid]) {
					delete cache.nodes[nid];
				}

				return this;
			},
			getNodeCache: function (tree, nodeId) {
				return tree.cache.nodes[nodeId];
			},
			getNode: function (tree, node) {
				if (Factory.isNode(node)) {
					return node;
				}
				return tree.cache.nodes[node];
			},
			buildMenuId: function (id, key) {
				return Config.IdPrefix + (key || '') + id;
			},
			buildNodeId: function (nodeId) {
				var type = 'tm_';
				return type + (nodeId || '');
			},
			buildUl: function (menu, p) {
				var ul;

				ul = document.createElement('UL');

				return ul;
			},
			buildLi: function (menu, p, node, opt) {
				var li = document.createElement('LI');
				li.className = 'node level' + p.level;

				var text = p.name || p.text;
				var html = [
					'<div class="item" nid="">',
					'<a class="name">',
					'<span class="text">', text, '</span>',
					'</a>',
					'</div>'
				];

				li.innerHTML = html.join('');

				return li;
			},
			buildItem: function (menu, list) {
				var opt = menu.options;

				if (!$.isArray(list) || list.length <= 0) {
					return this;
				}
				var fragment = $.createFragment();

				var ul = document.createElement('UL');

				var fragment = $.createFragment();
				for (var i = 0; i < list.length; i++) {
					var d = list[i], node,
						nid = Factory.buildNodeId(d.id),
						pnid = Factory.buildNodeId(d.pid),
						p = {
							data: list[i],
							pnode: menu.cache.nodes[pnid]
						};

					if (p.pnode) {
						p.level = p.pnode.level + 1;
					} else {
						p.level = 0;
					}

					node = new Node({
						menu: menu,
					});

					node.setParam('element', this.buildLi(menu, p, node));

					Factory.setNodeCache(menu, node);
				}

				opt.element.appendChild(ul);

				return this;
			},
			buildMenu: function(id, par) {
				var elem = $.isElement(id) ? id : $.toElement(id);
				if (!$.isElement(elem)) {
					return null;
				}
				id = elem.id;

				var key = 'tm_' + id;
				if (Cache.menus[key]) {
					return Cache.menus[key].menu;
				} else {
					var opt = $.extend({}, par, { element: elem });
					var menu = new TreeMenu(id, opt);
					Cache.menus[key] = {
						menu: menu
					};
					return menu;
				}
			}
		};

	function Node (par) {
		this.initial(par);
	}

	Node.prototype = {
		self: function () {
			var that = this;
			if (!that.tree) {
				return that;
			}
			var node = that.tree.cache.nodes[that.id];
			if (node && node !== that) {
				that = node;
			}
			return that;
		},
		initial: function (par) {
			par = $.extend({}, par);
			var that = this.self();

			that.menu = par.menu;
			that.element = par.element;

			that.level = par.level || 0;
			that.id = par.id;
			that.childs = [];

			return this;
		},		
		initParam: function (key, par) {
			return Factory.initParam.call(this.self(), key, par);
		},
		setParam: function (key, val, strict) {
			return Factory.setParam.call(this.self(), key, val, strict);
		}
	};

	//先加载(默认)样式文件
	Factory.loadCss(Config.DefaultSkin);

	function TreeMenu (id, options) {
		$.console.log('TreeMenu:', id, options);

		if ($.isObject(id) && $.isUndefined(options)) {
			options = id;
			id = null;
		}
		var opt = $.extend({}, options, id ? {id: id} : null);

		this.element = options.element;
		this.cache = {};

		this.initial(opt);
	}

	TreeMenu.prototype = {
		initial: function (options) {
			this.options = options;
			$.addClass(this.element, 'oui-treemenu');

			Factory.initCache(this, true);

			Factory.buildItem(this, options.list || []);
			return this;
		},
		append: function (options) {

		},
		insert: function (options) {

		}
	};

	$.extend({
		treemenu: function (id, par) {
			return Factory.buildMenu(id, par);
		}
	})

}(OUI);