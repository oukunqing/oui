
/*
	@Title: OUI
	@Description：JS通用代码库
	@Author: oukunqing
	@License：MIT

	$.tree 树形菜单
*/

!function ($) {
    'use strict';

	var SelfPath = $.getScriptSelfPath(true),
		Config = {
			FilePath: SelfPath,
			FileDir: $.getFilePath(SelfPath),
			DefaultSkin: 'default',
			IsDefaultSkin: function (skin) {
				//return (!$.isUndefined(skin) ? skin : Config.GetSkin()) === Config.DefaultSkin;
				skin = skin || Config.GetSkin();
				return !skin || skin === Config.DefaultSkin;
			},
			Skin: '',
			GetSkin: function () {
				if (!Config.Skin) {
					Config.Skin = $.getQueryString(Config.FilePath, 'skin') || Config.DefaultSkin;
				}
				return Config.Skin;
			},
			MouseWhichLeft: 1,
			MouseWhichRight: 3,
			CloseLinkageClassName: 'oui-popup-panel',
			IdPrefix: 'otree_',
			RootNodeId: 'otree_root_node',
		},
		Cache = {
			trees: {},
			caches: {},
			events: {}
		},
		Event = {
			target: function (ev, tree) {
				var elem = ev.target,
					nid = $.getAttribute(elem, 'nid'),
					node = tree.cache.nodes[nid];

				return node ? { 
					node: node, elem: elem, nid: nid,
					tag: elem.tagName.toLowerCase(), 
					css: elem.className.trim().split(' ')[0]
				} : {};
			},
			mousedown: function (ev, tree) {
				var p = Event.target(ev, tree);
				if (p.node && Factory.isNodeSwitch(p)) {
					p.node.setExpand(null, ev);	
				}
				return this;
			},
			click: function (ev, tree, name) {
				var p = Event.target(ev, tree);
				if (!p.node) {
					return false;
				}
				if (p.tag.inArray(['label','span','a'])) {
					if (p.css.inArray(['switch'])) {
						//p.node.setExpand();
						//switch事件迁移到mousedown
						return this;
					}

					$.console.log(name, tree.id, p.tag, p.css, 'nid:', p.nid, p.node, ev);

					if (p.css.inArray(['check'])) {
						p.node.setChecked(null, ev);
					} else if (p.css.inArray(['name', 'text'])) {
						p.node.setSelected(true, ev);
						Factory.clickCallback(ev, tree, p.node);
					}
				}
				return this;
			},
			mouseup: function (ev, tree) {
				return Event.click(ev, tree, 'mouseup');
			},
			dblclick: function (ev, tree) {
				var p = Event.target(ev, tree);
				if (p.node && Factory.isNodeBody(p)) {
					p.node.setExpand(null, ev);
					Factory.dblclickCallback(ev, tree, p.node);
				}
			},
			contextmenu: function (ev, tree) {
				var p = Event.target(ev, tree), node;
				if (p.node && Factory.isNodeBody(p)) {
					node = p.node;
				}
				Factory.contextmenuCallback(ev, tree, node);
			}
		},
		Factory = {
			loadCss: function (skin, func) {
				var path = Config.FilePath,
					name = $.getFileName(path, true),
					dir = $.getFilePath(path);

				if ($.isString(skin, true)) {
					dir += 'skin/' + skin + '/';
				}
				$.loadLinkStyle(dir + name.replace('.min', '') + '.css', function () {
					if ($.isFunction(func)) {
						func();
					}
				});
				return this;
			},
			buildTreeId: function (id) {
				return Config.IdPrefix + id;
			},
			buildElemId: function (id, nodeId, postfix) {
				return Config.IdPrefix + id + '_' + nodeId + (postfix || '');
			},
			buildNodeId: function (type, dataId) {
				return (type || '') + '_' + dataId;
			},
			getTreeCache: function (id) {
				return Cache.trees[Config.IdPrefix + id] || null;
			},
			setTreeCache: function(id, tree) {
				Cache.trees[Config.IdPrefix + id] = {
					id: id,
					tree: tree
				};
				return this;
			},
			initCache: function (tree, par, force) {
				var tid = tree.tid || Factory.buildTreeId(tree.id);
				if ($.isBoolean(par)) {
					force = par;
					par = {};
				}
				var p = $.extend({}, par), pc = Cache.caches[tid];
				if (!pc || force) {
					pc = $.extend({
						//本次节点数量
						count: 0,
						//层级深度
						level: 0,
						//总的节点数量
						total: 0,
						//开始时间
						begin: 0,
						//完成时间
						finish: 0,
						//节点类型（层级）
						nodeTypes: [],
						//是否指定叶子节点类型
						leaf: false,
						//指定叶子节点类型
						leafTypes: [],
						//是否动态加载
						dynamic: false,
						//指定动态加载类型
						dynamicTypes: [],
						//节点类型字典
						trees: {},
						//节点字典
						nodes: {},
						//按类型存储节点ID
						types: {},
						//按层级存储节点ID
						levels: [],
						//当前被选中或定位的节点
						current: {
							selected: null,
							position: null,
						},
						//离线存储
						store: {}
					}, p);
				}
				return tree.cache = pc, this;
			},
			getCache: function (tree) {
				var tid = tree.tid || Factory.buildTreeId(tree.id);
				return Cache.caches[tid] || null;
			},
			setCache: function (tree, par) {
				var tid = tree.tid || Factory.buildTreeId(tree.id),
					cache = Cache.caches[tid];
				if (!cache) {
					return this;
				}
				$.extend(cache, par);

				if ($.isNumber(par.count)) {
					cache.total += par.count;
				}
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
			parseTrees: function (trees) {
				var ot = [], p,
					type,		//节点类型
					key,		//节点数据字段
					ptype,		//父节点类型
					icon;		//图标类型

				for (var i = 0; i < trees.length; i++) {
                    p = trees[i];
                    if ($.isUndefinedOrNull(p)) {
                    	continue;
                    }
                    if ($.isArray(p)) {
                    	type = p[0];
                    	key = p[1] || p[0];
                        ptype = p[2] || p[0];
                        icon = p[3] || p[0];
                    } else if ($.isObject(p)) {
                        type = $.getParam(p, 'type');
                        key = $.getParam(p, 'key,type');
                        ptype = $.getParam(p, 'parent,ptype,type');
                        icon = $.getParam(p, 'iconType,icon,type');
                    } else if ($.isString(p, true)) {
                        var ps = p.split(/[:\|]/);
                    	type = p[0];
                    	key = p[1] || p[0];
                        ptype = p[2] || p[0];
                        icon = p[3] || p[0];
                    } else {
                        type = key = ptype = icon = p[0];
                    }
                    ot.push({ type: type, key: key, ptype: ptype });
                }
				return ot;
			},
			parseArrayParam: function (arr) {
				if (!$.isArray(arr)) {					
					if ($.isString(arr, true)) {
						arr = arr.split(/[,;|]/);
					} else {
						arr = !$.isUndefinedOrNull(arr) ? [arr] : [];
					}
				}
				return arr;
			},
			checkOptions: function (options) {
				var opt = $.extend({}, options);

				opt.element = $.toElement(opt.element || opt.elem);
				if (!$.isElement(opt.element) && opt.id) {
					opt.element = $.toElement(opt.id);
				}
				if ((!opt.id && !opt.id.toString()) && $.isElement(opt.element)) {
					opt.id = opt.element.id;
				}

				if ($.isString(opt.skin, true)) {
					opt.skin = opt.skin.toLowerCase();
				} else {
					//指定默认样式
					opt.skin = Config.GetSkin();
				}

				opt.data = opt.data || opt.items || opt.list;
				opt.trees = $.getParam(opt, 'trees,tree');
				if (!$.isArray(opt.trees)) {
					if ($.isString(opt.trees)) {
						opt.trees = opt.trees.split(/[,;|]/);
					} else {
						opt.trees = [opt.trees];
					}
				}
				opt.trees = Factory.parseTrees(opt.trees);
				opt.async = $.isBoolean(opt.async, false);
				opt.showIcon = $.isBoolean($.getParam(opt, 'showIcon,showicon'), true);

				var showCheck = $.getParam(opt, 'showCheck,showcheck,checkbox');
				opt.showCheck = $.isBoolean(showCheck, false) || showCheck === 'checkbox';

				opt.showCount = $.isBoolean($.getParam(opt, 'showCount,showcount'), false);

				opt.linkage = $.isBoolean(opt.linkage, true);
				opt.maxCount = parseInt('0' + $.getParam(opt, 'maxCount,maxcount'));

				opt.single = $.isBoolean(opt.single, false);
				if (opt.single) {
					opt.linkage = false;
				}

				opt.dynamic = $.getParam(opt, 'dynamic');
				if ($.isNumber(opt.dynamic) && opt.dynamic > 0) {
					opt.loadCount = opt.dynamic;
					opt.dynamic = true;
				} else {
					opt.dynamic = $.isBoolean(opt.dynamic, false);
				}
				opt.dynamicTypes = Factory.parseArrayParam($.getParam(opt, 'dynamicTypes,dynamicType'));

				opt.loadCount = parseInt($.getParam(opt, 'loadCount,loadcount'), 10);
				if (isNaN(opt.loadCount)) {
					opt.loadCount = 1;
				}

				opt.leaf = $.isBoolean(opt.leaf, false);
				opt.leafTypes = Factory.parseArrayParam($.getParam(opt, 'leafTypes,leafType'));

				opt.openTypes = Factory.parseArrayParam($.getParam(opt, 'openTypes,openType'));

				opt.openLevel = parseInt(opt.openLevel, 10);
				if (isNaN(opt.openLevel)) {
					opt.openLevel = -1;
				}

				opt.callback = $.getParam(opt, 'callback');
				opt.complete = $.getParam(opt, 'oncomplete,complete,completeCallback');
				opt.clickCallback = $.getParam(opt, 'onclick,clickCallback');
				opt.expandCallback = $.getParam(opt, 'onexpand,expandCallback');
				opt.checkedCallback = $.getParam(opt, 'onchecked,checkedCallback');
				opt.dblclickCallback = $.getParam(opt, 'ondblclick,dblclick,dblclickCallback');
				opt.contextmenuCallback = $.getParam(opt, 'oncontextmenu,contextmenu,contextmenuCallback');

				return opt;
			},
			setNodeCache: function (tree, node) {
				tree.cache.nodes[node.id] = node;

				if (!tree.cache.types[node.type]) {
					tree.cache.types[node.type] = [];
				}
				tree.cache.types[node.type].push(node);

				if(!tree.cache.levels[node.level]) {
					tree.cache.levels[node.level] = [];
				}
				tree.cache.levels[node.level].push(node);

				tree.cache.level = Math.max(tree.cache.level, node.level);
				tree.cache.count += 1;
				tree.cache.total += 1;
					
				return this;
			},
			getNodeCache: function (nodeId) {
				return tree.cache.nodes[nodeId];
			},
			buildTree: function (id, par) {
				var cache, tree;

				if ($.isString(id) && $.isUndefined(par)) {
					cache = Factory.getTreeCache(id);
					return cache ? cache.tree : new Tree();
				} else if ($.isObject(id) && $.isUndefined(par)) {
					par = id;
					id = null;
				} else if ($.isString(id, true)) {
					par = $.extend({}, par, {id: id});
				}
				var opt = $.extend({
					id: '',
					element: ''
				}, par);

				opt.id = opt.id || opt.element.id;

				if ((cache = Factory.getTreeCache(opt.id))) {
					return cache.tree.initial(opt);
				} 
				return Factory.setTreeCache(opt.id, (tree = new Tree(opt))), tree;		
			},
			buildEvent: function (tree) {
				$.addListener(tree.panel, 'mousedown', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});
				$.addListener(tree.panel, 'click', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});
				$.addListener(tree.panel,'dblclick', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});
				$.addListener(tree.panel, 'contextmenu', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});
				return this;
			},
			dealEvent: function (ev, tree, evType) {
				$.cancelBubble(ev);

				if (!evType && (ev && ev.type)) {
					evType = ev.type;
				}

				var which = ev.which, type = evType.toLowerCase();
				if ((which !== Config.MouseWhichLeft) 
					&& (which !== Config.MouseWhichRight && type === 'contextmenu')) {
					return this;
				}

				switch(type) {
				case 'mousedown':
				case 'mouseup':
				case 'click':
				case 'dblclick':
				case 'contextmenu':
					if ($.isFunction(Event[type])) {
						Event[type](ev, tree);
					}
					break;
				}
				return this;
			},
			setTypeCache: function (tree, type, ptype) {
				if (tree.cache.trees[type]) {
					return this;
				}
				var t = new Type({type: type, level: 0}),
					pt = tree.cache.trees[ptype];
				if (pt) {
					t.level = pt.level + 1;
					t.parent = pt;
					pt.addChild(t);
				}
				return tree.cache.trees[type] = t, this;
			},
			getTypeCache: function (type) {
				return tree.cache.trees[type] || null;
			},
			setCurrentCache: function (tree, key, node) {
				return tree.cache.current[key] = node, this;
			},
			delCurrentCache: function (tree, key, newNode) {
				var node;
				switch(key) {
				case 'selected':
					if (node = tree.cache.current[key]) {
						node.setSelected(false);
					}
					break;
				case 'position':
					node = tree.cache.current[key];
					break;
				}
				if (node) {
					tree.cache.current[key] = null;
				}
				if (newNode) {
					Factory.setCurrentCache(tree, key, newNode);
				}					
				return this;
			},
			getPanelClass: function (opt) {
				var css = 'oui-tree';
				if (!Config.IsDefaultSkin(opt.skin)) {
					css += ' oui-tree-';
					css += opt.skin;
				}
				return css;
			},
			setPanelClass: function (div, opt) {
				div.className = Factory.getPanelClass(opt);
				return this;
			},
			buildPanel: function (tree, par) {
				var that = tree,
					opt = that.options,
					cache = that.cache,
					elem = opt.element,
					tag = elem.tagName.toLowerCase(),
					//div = document.getElementById(that.tid),
					div = document.querySelector('#' + that.tid);

				cache.start = new Date().getTime();

				if (!div) {
					tree.panel = div = document.createElement('div');
					div.id = that.tid;
					Factory.buildEvent(tree);
				} else {
					div.innerHTML = '';
				}
				Factory.setPanelClass(div, opt);

				if (opt.trigger || tag.inArray(['input', 'select', 'button', 'a'])) {
					var events = $.isBoolean(opt.trigger) ? ['mousedown'] : opt.trigger.split(/[,;|]/);
					for (var i = 0; i < events.length; i++) {
						$.addListener(opt.element, events[i], function(ev) {
							tree.display();
						});
					}
				} else {
					elem.appendChild(div);
					if (opt.async) {
						window.setTimeout(function() {
							Factory.buildNode(tree, opt).completeCallback(tree);
						}, 1);
					} else {
						Factory.buildNode(tree, opt).completeCallback(tree);
					}
				}
				return this;
			},
			buildRootNode: function (tree, root, elem, fragment) {
				var node = new Node({
					tree: tree,
					root: root,
					element: elem,
					fragment: fragment || $.createFragment()
				});
				return node;
			},
			buildNode: function (tree, opt) {
				var cache = tree.cache,
					root = Factory.buildRootNode(tree, true, tree.panel);

				cache.begin = new Date().getTime();
				cache.count = 0;

				if ($.isArray(opt.data)) {
					Factory.buildItem(tree, root, opt.data);
				} else if ($.isObject(opt.data)) {
					//数据结构注解，用于多种类型节点
					var dts = opt.trees, p = {};

					if (dts.length > 0 && dts[0]) {
						var list = [], t, k;
						//遍历数据结构注解，并按顺序指定上下级关系
						for (k = 0; k < dts.length; k++) {
							t = dts[k];
							list = opt.data[t.key];
							p = {type: t.type, ptype: t.ptype, iconType: t.icon || t.type};
							if ($.isArray(list)) {
								Factory.buildItem(tree, root, list, p);
							}
						}
					} else {
						//遍历参数字段，并获取第1个数组字段
						for (var k in opt.data) {
							if ($.isArray(opt.data[k])) {
								cache.nodeTypes.push(k);
								Factory.buildItem(tree, root, opt.data[k]);
								break;
							}
						}
					}
				}
				Factory.initStatus(tree, true);

				tree.panel.appendChild(root.fragment);
				delete root.fragment;

				cache.finish = new Date().getTime();
				cache.timeout = cache.finish - cache.start;

				return this;
			},
			addNode: function (tree, items, par) {
				var p = $.extend({}, par),
					root = Factory.buildRootNode(tree, false, tree.panel),
					nodes = [];

				Factory.buildItem(tree, root, items, p, nodes)
					.initStatus(tree, false, nodes);

				return this;
			},
			buildUl: function (tree, p, isRoot, displayNone) {
				var ul = p.pnode.getBox(), css = [];
				if (ul) {
					return ul;
				}
				ul = document.createElement('UL');
				var css = [
					'level' + (isRoot ? 'root' : p.pnode.level), ' box', p.ptype ? ' box-' + p.ptype : ''
				];
				if ((!isRoot && !p.pnode.expanded) || displayNone) {
					css.push('hide');
				}

				ul.id = (p.pid + '_box');
				ul.className = css.join(' ');
				//ul.setAttribute('nid', p.pnid);

				return ul;
			},
			buildLi: function (tree, p, node) {
				var li = document.createElement('LI');
				li.id = p.id + '_item';
				li.className = ('node level' + p.level);
				//li.setAttribute('nid', p.nid);

				var hide = ' style="display:none;"',
					check = tree.options.showCheck ? [
						'<span class="check" id="', p.id, '_check', '" nid="', p.nid, '"></span>',
					] : [],
					icon = tree.options.showIcon ? [
						'<span class="', node.getIconClass(), '" id="', p.id, '_icon', '" nid="', p.nid, '"', '></span>'
					] : [],
					desc = p.desc ? [
						'<span class="desc" id="', p.id, '_desc', '" nid="', p.nid, '">', p.desc, '</span>'
					] : [],
					count = tree.options.showCount ? [
						'<span class="count" id="', p.id, '_count', '" nid="', p.nid, '"', hide, '>', '</span>'
					] : [],
					info = false ? [
						'<span class="info" id="', p.id, '_info', '" nid="', p.nid, '">',
						//'类型：', p.type, ' 编号：', dr.code, 
						'</span>'
					] : [];

				li.innerHTML = [
					'<div class="item" id="', p.id, '_item', '" nid="', p.nid, '">',
					'<span class="', node.getSwitchClass(), '" id="', p.id, '_switch', '" nid="', p.nid, '"></span>'
				].concat(check).concat(icon).concat([
					'<a class="name" id="', p.id, '_name', '" nid="', p.nid, '">',
					'<span class="text" id="', p.id, '_text', '" nid="', p.nid, '">', p.text, '</span>'
				]).concat(desc).concat(count).concat(['</a>']).concat(info).concat([
					'</div>'
				]).join('');

				return li;
			},
			isNodeBody: function (par) {
				return par.tag.inArray(['a', 'span']) 
					&& par.css.inArray(['icon', 'name', 'text', 'desc']);
			},
			isNodeText: function (par) {
				return par.tag.inArray(['a', 'span']) 
					&& par.css.inArray(['name', 'text', 'desc']);
			},
			isNodeSwitch: function (par) {
				return par.tag.inArray(['span']) && par.css.inArray(['switch']);
			},
			buildItem: function (tree, root, list, arg, nodes) {
				var tid = tree.id,
					opt = tree.options,
					par = $.extend({type: '', ptype: '', iconType: ''}, arg);

				if (!$.isArray(list) || list.length <= 0) {
					return this;
				}
				var i, d, type, ptype, iconType, nid, pnid, p, node;

				for (i = 0; i < list.length; i++) {
					if (typeof (d = list[i]).id === 'undefined') {
						continue;
					}
					type = d.type || par.type;
					ptype = d.ptype || par.ptype;
					iconType = d.iconType || par.iconType;
					nid = Factory.buildNodeId(type, d.id);
					pnid = Factory.buildNodeId(ptype, d.pid);
					p = {
						data: d, text: d.name,
						nid: nid, pnid: pnid, type: type, ptype: ptype,
						id: Factory.buildElemId(tid, nid),
						pid: Factory.buildElemId(tid, pnid),
						//desc: d.desc,
						desc: [d.desc, (opt.debug ? d.id : '')].join(''),
						pnode: tree.cache.nodes[pnid],
						expanded: false
					};

					if (p.pnode) {
						p.level = p.pnode.level + 1;
					} else {						
						p.root = true;
						p.pnode = root;
						p.level = 0;
					}
					p.expanded = tree.isDefaultOpen(p.type, p.level);

					node = new Node({
						tree: tree,
						data: p.data,
						id: p.nid,
						type: p.type,
						level: p.level,
						expanded: p.expanded,
						checked: d.checked || false,
						disabled: d.disabled || false,
						dynamic: tree.isDynamicType(p.type),
						icon: $.extend({ type: iconType }, d.icon)
					});

					node.setParent(p.pnode.setBox(Factory.buildUl(tree, p, p.root)))
						.setParam('element', Factory.buildLi(tree, p, node));

					p.pnode.addChild(node);

					Factory.setNodeCache(tree, node);
					Factory.setTypeCache(tree, p.type, p.ptype);
					
					if (nodes) {
						nodes.push(node);
					}
				}

				return this;
			},
			initStatus: function (tree, initial, nodes) {
				var node, pnode, i, c, k, dic = {};
				if ($.isUndefinedOrNull(nodes || (nodes = tree.cache.nodes))) {
					return this;
				}
				if ($.isArray(nodes)) {
					c = nodes.length;
					for (i = 0; i < c; i++) {
						_init(nodes[i], initial, dic);
					}
				} else if ($.isObject(nodes)) {
					for (k in nodes) {
						_init(nodes[k], initial, dic);
					}
				}

				function _init (node, initial, dic) {
					if (!node.hasChild()) {
						//node.setParam('expanded', false);

						//动态加载子节点，先创建子节点容器
						if (node.dynamic) {
							node.setBox(Factory.buildUl(tree, {
								pnode: node,
								pid: Factory.buildElemId(tree.id, node.id),
								pnid: node.id,
								ptype: node.type
							}, false, true));
						}

						//(动态加载 或者 已展开)，需要设置节点展开状态
						//目的是为了收缩或隐藏节点“展开/收缩”图标
						if (node.dynamic || node.isExpanded()) {
							node.setExpandClass(true);
						}
					}
					node.setExpandClass(true);

					if (!initial) {
						if (node.parent && !dic[node.parent.id]) {
							node.parent.setExpandClass(false);
							dic[node.parent.id] = 1;
						}
					}
				}

				return this;
			},
			eachNodeIds: function (nodes, nodeIds, nodeType, funcName, funcParam) {
				if (!$.isArray(nodeIds)) {
					nodeIds = $.isString(nodeIds) ? nodeIds.split(/[,;|]/) : [nodeIds];
				}
				var i, c = nodeIds.length, nid, node;
				for (i = 0; i < c; i++) {
					nid = Factory.buildNodeId(nodeType, nodeIds[i]);
					if ((node = nodes[nid])) {
						if ($.isFunction(funcName)) {
							funcName(node, i, c);
						} else if ($.isFunction(node[funcName])) {
							node[funcName](funcParam);
						}
					}
				}
				return this;
			},
			callNodeFunc: function (nodes, nodeId, nodeType, funcName, arg0, arg1) {
				if ($.isArray(nodeId)) {
					nodeId = nodeId[0];
				}
				var nid = Factory.buildNodeId(nodeType, nodeId),
					node = nodes[nid];

				if (node && $.isFunction(node[funcName])) {
					node[funcName](arg0, arg1);
				}
				return this;
			},
			findType: function (trees, type, linkage, expand, keys) {
				var t, pt, ct, k;

				if (!(t = trees[type])) {
					return this;
				}
				keys.push(t.type);

				if (!linkage) {
					return this;
				}

				if (expand) {
					//找父节点类型
					while(t && (pt = t.parent)) {
						keys.push(pt.type);
						t = pt;
					}
				} else {
					//找子节点类型
					function _findChildType (t, keys) {
						if (!t.childs) {
							return false;
						}
						for (k in t.childs) {
							keys.push((ct = t.childs[k]).type);
							if (ct.childs) {
								_findChildType(ct, keys);
							}
						}
					}
					_findChildType(t, keys);
				}
				return this;
			},
			expandNode: function (tree, node, linkage) {
				if (!node) {
					return this;
				}
				node.setExpand(true);

				if (linkage) {
					var n = node, pn;
					//找父节点类型
					while(n && (pn = n.parent) && !pn.root) {
						$.console.log('expandNode:', n, pn);
						pn.setExpand(true);
						n = pn;
					}
				}

				return this;
			},
			expandTo: function (tree, node) {
				return Factory.expandNode(tree, node, true);
			},
			expandType: function (tree, types, linkage, expand) {
				var cache = tree.cache, keys = [];

				types = Factory.parseArrayParam(types);
				linkage = $.isBoolean(linkage, false);
				expand = $.isBoolean(expand, true);

				//根据规则找出所有要展开或收缩的类型
				var i, j, k, c = types.length, nodes = [];
				for (i = 0; i < c; i++) {
					Factory.findType(cache.trees, types[i], linkage, expand, keys);
				}				
				c = keys.length;

				for (i = 0; i < c; i++) {
					k = keys[expand ? c - i - 1 : i];
					if (nodes = cache.types[k]) {
						Factory.expandEach(nodes, expand, false);
					}
				}
				return this;
			},
			expandToType: function (tree, types) {
				return Factory.expandType(tree, types, true);
			},
			collapseType: function (tree, types, linkage) {
				return Factory.expandType(tree, types, linkage, false);
			},
			collapseToType: function (tree, types) {
				return Factory.expandType(tree, types, true, false);
			},
			expandEach: function (nodes, expand, sameLevel) {
				var j, c = nodes.length, node;
				for (j = 0; j < c; j++) {
					//节点按照层级顺序添加到缓存中，展开和收缩的顺序是相反的
					//不同层级的节点，展开：从最低层开始; 收缩：从最顶层开始
					if (node = nodes[sameLevel || !expand ? j : c - j - 1]) {
						node.setExpand(expand);
					}
				}
				return this;
			},
			expandLevel: function (tree, levels, linkage, expand) {
				var i, j, c, nc = tree.cache.levels.length,
					cur, n;

				levels = $.toIdList(Factory.parseArrayParam(levels), 0);
				expand = $.isBoolean(expand, true);
				c = levels.sort().length;

				if (c > nc) {					
					levels = levels.slice(0, nc);
					c = nc;
				}

				if (linkage) {
					cur = expand ? levels[c - 1] : levels[0];
					for (i = 0; i < nc; i++) {
						n = expand ? i : nc - i - 1;
						Factory.expandEach(tree.cache.levels[n], expand, true);
						if (n === cur) {
							break;
						}
					}
				} else {
					for(i = 0; i < c; i++) {
						n = levels[expand ? c - i - 1 : i];
						Factory.expandEach(tree.cache.levels[n], expand, true);
					}
				}
				return this;
			},
			expandToLevel: function (tree, levels) {
				return Factory.expandLevel(tree, levels, true);
			},
			collapseLevel: function (tree, levels, linkage) {
				return Factory.expandLevel(tree, levels, linkage, false);
			},
			collapseToLevel: function (tree, levels) {
				return Factory.expandLevel(tree, levels, true, false);
			},
			expandAll: function (tree, expand) {
				expand = $.isBoolean(expand, true);
				var	i, j, c = tree.cache.levels.length;

				//收缩:从最顶层开始; 展开:从最低层开始
				for (i = 0; i < c; i++) {
					Factory.expandEach(tree.cache.levels[expand ? c - i - 1 : i], expand);
				}
				return this;
			},
			collapseAll: function (tree) {
				return Factory.expandAll(tree, false);
			},
			callback: function (tree, node) {
				if ($.isFunction(tree.options.callback)) {
					tree.options.callback(node, tree);
				}
				return this;
			},
			completeCallback: function (tree) {
				if ($.isFunction(tree.options.complete)) {
					tree.options.complete(tree);
				}
				return this;
			},
			expandCallback: function (tree, node) {
				if ($.isFunction(tree.options.expandCallback)) {
					tree.options.expandCallback(node, tree);
				}
				return this;
			},
			checkedCallback: function (tree, node, ev) {
				if ($.isFunction(tree.options.checkedCallback)) {
					return tree.options.checkedCallback(node, tree), this;
				}
				return Factory.callback(tree, node);
			},
			clickCallback: function (ev, tree, node) {
				if ($.isFunction(tree.options.clickCallback)) {
					return tree.options.clickCallback(ev, node, tree), this;
				}
				return Factory.callback(tree, node);
			},
			dblclickCallback: function (ev, tree, node) {
				if ($.isFunction(tree.options.dblclickCallback)) {
					tree.options.dblclickCallback(ev, node, tree);
				}				
				return this;
			},
			contextmenuCallback: function (ev, tree, node) {
				if ($.isFunction(tree.options.contextmenuCallback)) {
					tree.options.contextmenuCallback(ev, node, tree);
				}	
				return this;
			}
		};

	//先加载(默认)样式文件
	Factory.loadCss(Config.DefaultSkin);

	//加载指定的(默认)样式文件
	if (!Config.IsDefaultSkin()) {
		Factory.loadCss(Config.GetSkin());
	}

	function Type(par) {
		this.initial(par);
	}

	Type.prototype = {
		initial: function (par) {
			this.type = par.type;
			this.level = par.level;
			this.childs = {};
			this.initParam('parent', par);
		},
		addChild: function (obj) {
			if (!this.childs[obj.type]) {
				this.childs[obj.type] = obj;
			}
			return this;
		},
		initParam: function (key, par) {
			return Factory.initParam.call(this, key, par);
		}
	};

	function Node(par) {
		this.initial(par);
	}

	Node.prototype = {
		initial: function(par) {
			par = $.extend({}, par);

			this.tree = par.tree;
			this.element = par.element;

			if (par.root) {
				this.root = true;
				this.fragment = par.fragment;
			} else {
				this.level = par.level;
				//节点ID
				this.id = par.id;
				//节点类型（可以为空）
				this.type = par.type;
				//节点Dom元素
				this.items = {};
				//节点数据
				this.data = $.extend({
					id: 0,			//ID
					name: '',		//名称
					code: ''		//编码
				}, par.data);
				//节点图标样式
				this.icon = $.extend({
					type: '',		//类型，示例: unit,device,camera 等
					status: '',		//状态，示例: on,off,play 等
					path: ''		//自定义图标URL
				}, par.icon);

				this.initParam('dynamic', par)		//是否动态加载
					.initParam('loaded', par)		//动态加载次数，0:表示未加载
					.initParam('expanded', par)		//是否展开
					.initParam('checked', par)		//是否选中复选框
					.initParam('selected', par)		//是否选中节点
					.initParam('disabled', par)		//是否禁用节点
					.initParam('parent', par)		//父节点
					.initParam('childs', par)		//子节点数组
					.initParam('childbox', par);	//子节点容器DOM元素
			}
			return this;
		},
		initParam: function (key, par) {
			return Factory.initParam.call(this, key, par);
		},
		setParam: function (key, val, strict) {
			return Factory.setParam.call(this, key, val, strict);
		},
		setItem: function (key, elem) {
			return this.items[key] = elem, elem;
		},
		getItem: function (key) {
			return this.items[key] ? this.items[key] : this.setItem(key, this.element.querySelector('.' + key));
		},
		isPartChecked: function (childs, checked) {
			var len = childs.length, i;
			for (i = 0; i < len; i++) {
				if (checked) {
					if (!childs[i].checked || childs[i].part) {
						return true;
					}
				} else if (childs[i].checked) {
					return true;
				}
			}
			return false;
		},
		setParentChecked: function (checked) {
			var that = this,
				pnode = that.parent;

			if (!pnode || pnode.root || !that.tree.isShowCheck()) {
				return that;
			}

			pnode.setParam('part', that.isPartChecked(pnode.childs, checked))
				.setParam('checked', checked || pnode.part)
				.setCheckedClass();
				
			if (pnode.parent && !pnode.parent.root) {
				pnode.setParentChecked(pnode.checked);
			}

			return that;
		},
		setChildChecked: function (checked, self) {
			if (!this.tree.isShowCheck()) {
				return this;
			}
			if (!self) {
				this.setParam('part', false)
					.setParam('checked', checked)
					.setCheckedClass();
			}
			if (this.hasChild()) {
				for (var i = 0, c = this.childs.length; i < c; i++) {
					this.childs[i].setChildChecked(checked);
				}
			}
			return this;
		},
		setChecked: function (checked, ev) {
			if (!this.tree.isShowCheck()) {
				return this;
			}
			//被禁用的节点，不能通过点击选框“选中/取消选中”节点
			//但是可以通过初始化选中节点
			if (this.disabled && ev) {
				return this;
			}
			this.setParam('checked', $.isBoolean(checked, !this.checked))
				.setParam('part', false)
				.setCheckedClass();

			if (this.tree.options.linkage) {
				this.setParentChecked(this.checked).setChildChecked(this.checked, true);
			}

			Factory.checkedCallback(this.tree, this, ev);

			return this;
		},
		setSelected: function (selected, ev) {
			selected = $.isBoolean(selected, !this.selected);
			if (selected && this.disabled) {
				return this;
			}
			if (selected) {
				//清除之前的节点选中状态
				//Factory.delCurrentCache(this.tree, 'selected');
				//设置当前选中的节点状态
				//Factory.setCurrentCache(tree, 'selected', this);

				//清除之前的节点选中状态 并且设置当前节点为选中状态
				Factory.delCurrentCache(this.tree, 'selected', this);
				if (ev && ev.target) {
					Factory.setCurrentCache(this.tree, 'position', this);
				}
			}
			return this.setParam('selected', selected).setSelectedClass();
		},
		setDisabled: function (disabled) {
			return this.setParam('disabled', $.isBoolean(disabled, !this.disabled)).setDisabledClass();
		},
		setParent: function (parentNode) {
			return this.setParam('parent', parentNode);
		},
		getBox: function () {
			return this.childbox;
		},
		setBox: function (childbox) {
			this[this.root ? 'fragment' : 'element'].appendChild(childbox);
			return this.setParam('childbox', childbox);
		},
		addChild: function (node, clear) {
			if (!this.childs || clear) {
				this.childs = [];
			}
			this.childs.push(node);
			if (this.childbox) {
				this.childbox.appendChild(node.element);
			}
			return this;
		},
		position: function (selected) {
			Factory.setCurrentCache(this.tree, 'position', this).expandTo(this.tree, this);
			$.scrollTo(this.element, this.tree.panel);
			return selected ? this.setSelected(true) : this;
		},
		setExpand: function (expanded, ev) {
			if (!this.isDynamic() && !this.hasChild()) {
				return this;
			}
			if ($.isBoolean(expanded) && expanded === this.expanded) {
				return this;
			}
			if (this.childbox) {
				expanded = $.isBoolean(expanded, !this.expanded);
				this.childbox.style.display = expanded ? 'block' : 'none';
				//动态加载，默认只加载1次
				if (expanded && !this.hasChild()) {
					if (!this.loaded) {
						this.loaded = 0;
					}
					if (this.loaded < this.tree.options.loadCount && ev && ev.target) {
						Factory.expandCallback(this.tree, this);
					}
					this.loaded++;
				}
			}
			return this.setParam('expanded', expanded).setExpandClass();
		},
		expand: function () {
			return this.setExpand(true);
		},
		collapse: function () {
			return this.setExpand(false);
		},
		getSwitchClass: function () {
			var css = ['switch'];
			if (!this.isLeaf() && this.isExpand()) {
				css.push('switch-open');
			}
			return css.join(' ');
		},
		getIconClass: function () {
			var css = ['icon'],
				open = this.expanded && !this.isLeaf() ? '-open' : '';

			if (this.icon.type && !this.tree.isDefaultSkin()) {
				if (this.icon.status) {
					css.push(this.icon.type + '-' + this.icon.status + open);
				} else if (open) {
					css.push(this.icon.type + open);
				} else {
					css.push(this.icon.type);
				}
			} else if (open) {
				css.push('icon' + open);
			}
			if (this.icon.path) {

			}

			return css.join(' ');
		},
		setIconClass: function () {
			var icon;
			if (this.tree.isShowIcon() && (icon = this.getItem('icon'))) {
				icon.className = this.getIconClass();
			}
			return this;
		},
		setIcon: function (par) {
			return $.extend(this.icon, par), this;
		},
		updateIcon: function (par) {
			return this.setIcon(par).setIconClass();
		},
		updateData: function (data) {
			$.extend({}, this.data, data);
			return this;
		},
		updateText: function (str) {
			var item;
			if ($.isString(str, true) && (item = this.getItem('text'))) {
				item.innerHTML = str;
			}
			return this;
		},
		updateDesc: function (str) {
			var item;
			if ((item = this.getItem('desc'))) {
				item.innerHTML = str || '';
			}
			return this;
		},
		setExpandClass: function (initial) {
			var handle = this.getItem('switch');
			//if (that.isLeaf()) {
			//虽然被指定为叶子节点类型，但当前已经有子节点加入，那就不能再算是叶子节点了
			if (this.isLeaf() && !this.hasChild()) {
				this.setParam('expanded', false);
				$.setElemClass(handle, 'switch-none', true);
			} else {
				if (!this.hasChild()) {
					if (!this.isDynamic()) {
						this.setParam('expanded', false);
						$.setElemClass(handle, 'switch-none', true);
					} else if (this.isExpanded() && !this.loaded) {
						this.setParam('expanded', false);
					}
				} else {
					$.setElemClass(handle, 'switch-none', false);
				}
				$.setElemClass(handle, 'switch-open', this.isExpanded());
			}
			return this.setIconClass();
		},
		setCheckedClass: function () {
			var check = this.getItem('check');
			if (this.tree.options.showCheck && check) {
				$.setElemClass(check, 'check-true', this.checked);
				$.setElemClass(check, 'check-part-true', this.part && this.checked);
			}
			return this;
		},
		setItemClass: function (type, initial) {
			switch(type) {
				case 'check': this.setCheckedClass(); break;
				case 'switch': this.setExpandClass(); break;
			}
			return this;
		},
		setSelectedClass: function () {
			$.setElemClass(this.element, 'cur', this.selected);
			return this;
		},
		setDisabledClass: function() {
			$.setElemClass(this.element, 'disabled', this.disabled);
			return this;
		},
		setNodeClass: function (type) {
			switch(type) {				
				case 'select': this.setSelectedClass(); break;
				case 'disabled': this.setDisabledClass(); break;
			}
			return this;
		},
		hasChild: function () {
			return this.childs && this.childs.length > 0;
		},
		isLeaf: function () {
			var leaf = this.tree.isLeafType(this.type);
			//判断是否指定叶子节点类型
			//0: 未指定，1: 指定，是叶子，-1: 指定，非叶子
			if (leaf !== 0) {
				return leaf === 1;
			}
			return !this.dynamic && !this.hasChild();
		},
		isDynamic: function () {
			return this.dynamic;
		},
		isExpand: function () {
			return this.expanded;
		},
		isExpanded: function () {
			return this.expanded;
		},
		isChecked: function () {
			return this.checked;
		},
		isSelected: function () {
			return this.selected;
		}
	};

	function Tree(id, options) {
		if ($.isObject(id) && $.isUndefined(options)) {
			options = id;
			id = null;			
		}
		var opt = $.extend({}, options, id ? {id: id} : null);

		this.initial(opt);
	}

	Tree.prototype = {
		initial: function (options) {
			var opt = Factory.checkOptions($.extend({
				id: 'otree001',
				element: undefined,
				//是否异步加载节点
				async: undefined,
				//是否调试模式
				debug: false,
				//data如果不是数组，是对象结构，则需要指定trees
				data: [],
				//data数据结构注解，示例：[{key:'unit',val:'units'}]
				//用于获取data{}数据中的数组字段以及指定节点类型
				//若未指定结构注解，则取data[]或data{}中第一个字段数组
				trees: undefined,
				//指定叶子节点类型，字符串数组或字符串，示例：['camera'] 或 'camera'
				//指定为叶子节点的，不能动态加载子节点，但可以初始化加载子节点
				leafTypes: undefined,
				//动态加载子节点(非叶子节点)
				dynamic: undefined,
				//指定动态加载的节点类型，字符串数组或字符串，示例：['device'] 或 'device'
				//若未指定，则非叶子都可以动态加载
				dynamicTypes: undefined,
				//动态加载次数，默认为1次
				loadCount: undefined,
				//指定默认要展开的节点类型
				openTypes: undefined,
				//指定默认要展开的节点层级
				openLevel: undefined,
				//是否显示图标
				showIcon: undefined,
				//是否显示复选框
				showCheck: undefined,
				//是否显示描述
				showDesc: undefined,
				//是否显示节点信息
				showInfo: undefined,
				//是否显示子节点数量
				showCount: undefined,
				//是否级联选中复选框
				linkage: undefined,
				//非级联模式下最大选中数量，0-表示不限数量，默认为0
				maxCount: undefined,
				//是否单选模式
				single: undefined,
				callback: undefined,
				complete: undefined,
				dblclick: undefined,
				contextmenu: undefined,
				expandCallback: undefined
			}, options));

			this.id = opt.id;
			this.tid = Factory.buildTreeId(opt.id);
			this.options = opt;

			if (!Config.IsDefaultSkin(opt.skin)) {
				Factory.loadCss(opt.skin);
			}

			if (!$.isElement(opt.element)) {
				return this;
			}

			Factory.initCache(this, {
				dynamic: opt.dynamic,
				dynamicTypes: opt.dynamicTypes,
				leaf: opt.leaf,
				leafTypes: opt.leafTypes
			}, true).buildPanel(this, opt);

			return this;
		},
		node: function (id, type) {
			var nid = Factory.buildNodeId(type, id);
			return this.cache.nodes[nid] || new Node({tree: this});
		},
		get: function (id, type) {

		},
		insert: function (items, par) {

		},
		add: function (items, par) {
			$.console.log('add1:', this.id, par);
			Factory.addNode(this, items, par);
			$.console.log('add2:', this.id, par);
			return this;
		},
		//更新节点图标、文字
		update: function (items, par) {
			var that = this;

			return that;
		},
		clear: function () {
			var that = this;

			return that;
		},
		updateIcon: function (nodeIds, nodeType, par) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, function(node, i, c) {
				node.updateIcon(par);
			}), this;
		},
		icon: function (nodeIds, nodeType, par) {
			return this.updateIcon(nodeIds, nodeType, par);
		},
		updateText: function (nodeIds, nodeType, texts) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, function(node, i, c) {
				node.updateText(c === 1 ? texts : texts[i]);
			}), this;
		},
		text: function (nodeIds, nodeType, texts) {
			return this.updateText(nodeIds, nodeType, texts);
		},
		updateDesc: function (nodeIds, nodeType, texts) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, function(node, i, c) {
				node.updateDesc(c === 1 ? texts : texts[i]);
			}), this;
		},
		desc: function (nodeIds, nodeType, texts) {
			return this.updateDesc(nodeIds, nodeType, texts);
		},
		checked: function (nodeIds, nodeType, checked) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'setChecked', $.isBoolean(checked, true)), this;
		},
		disabled: function (nodeIds, nodeType, disabled) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'setDisabled', $.isBoolean(disabled, true)), this;
		},
		delete: function (nodeIds, nodeType) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'delete'), this;
		},
		expand: function (nodeIds, nodeType) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'expand'), this;
		},
		collapse: function (nodeIds, nodeType) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'collapse'), this;
		},
		selected: function (nodeIds, nodeType, selected, position) {
			return Factory.callNodeFunc(this.cache.nodes, nodeIds, nodeType, 'setSelected', $.isBoolean(selected, true), position), this;
		},
		select: function (nodeIds, nodeType, selected, position) {
			return this.selected(nodeIds, nodeType, selected, position);
		},
		position: function (nodeIds, nodeType, selected) {
			return Factory.callNodeFunc(this.cache.nodes, nodeIds, nodeType, 'position', selected), this;
		},
		expandAll: function (expand) {
			return Factory.expandAll(this, expand), this;
		},
		collapseAll: function () {
			return Factory.expandAll(this, false), this;
		},
		expandLevel: function (levels, linkage, expand) {
			return Factory.expandLevel(this, levels, linkage, expand), this;
		},
		expandToLevel: function (levels, expand) {
			return Factory.expandLevel(this, levels, true, expand), this;
		},
		collapseLevel: function (levels, linkage) {
			return Factory.collapseLevel(this, levels, linkage), this;
		},
		collapseToLevel: function (levels) {
			return Factory.collapseLevel(this, levels, true), this;
		},
		expandType: function (types, linkage, expand) {
			return Factory.expandType(this, types, linkage, expand), this;
		},
		expandToType: function (types, expand) {
			return Factory.expandType(this, types, true, expand), this;
		},
		collapseType: function (types, linkage) {
			return Factory.collapseType(this, types, linkage), this;
		},
		collapseToType: function (types) {
			return Factory.collapseType(this, types, true), this;
		},
		isDefaultSkin: function () {
			return Config.IsDefaultSkin(this.options.skin);
		},
		isShowCheck: function () {
			return this.options.showCheck;
		},
		isShowIcon: function () {
			return this.options.showIcon;
		},
		isAppointLeaf: function () {
			return this.options.leaf;
		},
		isDynamicLoad: function () {
			return this.options.dynamic;
		},
		//判断节点类型是否是叶子节点
		//0: 未指定，1: 指定，是叶子，-1: 指定，非叶子
		isLeafType: function (nodeType) {
			var opt = this.options;
			if (!this.isAppointLeaf()) {
				return 0;
			}
			return opt.leafTypes.indexOf(nodeType) > -1 ? 1 : -1;
		},
		//是否需要动态加载子节点
		isDynamicType: function (nodeType) {
			if (!this.isDynamicLoad() || this.isLeafType(nodeType) > 0) {
				return false;
			}
			return !this.options.dynamicTypes[0] || this.options.dynamicTypes.indexOf(nodeType) > -1;
		},
		isOpenType: function (nodeType) {
			return this.options.openTypes.indexOf(nodeType) > -1;
		},
		isOpenLevel: function (nodeLevel) {
			return this.options.openLevel < 0 || this.options.openLevel >= nodeLevel;
		},
		isDefaultOpen: function (nodeType, nodeLevel) {
			if (this.options.openLevel >= 0) {
				return this.options.openLevel > nodeLevel;
			}
			var type = $.isString(nodeType, true);
			if (type && this.options.openTypes[0]) {
				return this.options.openTypes.indexOf(nodeType) > -1;
			}
			return true;
		}
	};

	Factory.func = function (treeId, ids, type, funcName, funcParam) {
		var tree = $.tree.get(treeId);
		if (tree && $.isFunction(tree[funcName])) {
			tree[funcName](ids, type, funcParam);
		}
		return $.tree;
	};

	Factory.action = function (treeId, funcName, arg0, arg1, arg2, arg3) {
		var tree = $.tree.get(treeId);
		if (tree && $.isFunction(tree[funcName])) {
			tree[funcName](arg0, arg1, arg2, arg3);
		}
		return $.tree;
	};

	$.extend({
		tree: function (treeId, par) {
			return Factory.buildTree(treeId, par);
		}
	});

	$.extend($.tree, {
		id: function (dataId, dataType) {
			return Factory.buildNodeId(dataType, dataId);
		},
		get: function (treeId) {
			var cache = Factory.getTreeCache(treeId);
			return cache ? cache.tree : null;
		},
		add: function (treeId, items, par) {
			var tree = $.tree.get(treeId);
			if (tree) {
				tree.add(items, par);
			}
			return this;
		},
		update: function (treeId, items, par) {
			var tree = $.tree.get(treeId);
			if (tree) {
				tree.update(items, par);
			}
			return this;
		},
		icon: function (treeId, ids, type, par) {
			return Factory.func(treeId, ids, type, 'updateIcon', par);
		},
		updateIcon: function (treeId, ids, type, par) {
			return Factory.func(treeId, ids, type, 'updateIcon', par);
		},
		text: function (treeId, ids, type, texts) {
			return Factory.func(treeId, ids, type, 'updateText', texts);
		},
		updateText: function (treeId, ids, type, texts) {
			return Factory.func(treeId, ids, type, 'updateText', texts);
		},
		desc: function (treeId, ids, type, texts) {
			return Factory.func(treeId, ids, type, 'updateDesc', texts);
		},
		updateDesc: function (treeId, ids, type, texts) {
			return Factory.func(treeId, ids, type, 'updateDesc', texts);
		},
		select: function (treeId, ids, type, selected) {
			return Factory.func(treeId, ids, type, 'select', selected);
		},
		delete: function (treeId, ids, type) {
			return Factory.func(treeId, ids, type, 'delete');
		},
		selected: function (treeId, ids, type, selected) {
			return Factory.func(treeId, ids, type, 'select', selected);
		},
		checked: function (treeId, ids, type, checked) {
			return Factory.func(treeId, ids, type, 'checked', checked);
		},
		disabled: function (treeId, ids, type, disabled) {
			return Factory.func(treeId, ids, type, 'disabled', disabled);
		},
		position: function (treeId, id, type) {
			return Factory.func(treeId, id, type, 'position');
		},
		expand: function (treeId, ids, type) {
			return Factory.func(treeId, ids, type, 'expand');
		},
		collapse: function (treeId, ids, type) {
			return Factory.func(treeId, ids, type, 'collapse');
		},
		expandAll: function (treeId, collapse) {
			return Factory.action(treeId, 'expandAll', collapse);
		},
		collapseAll: function (treeId) {
			return Factory.action(treeId, 'collapseAll');
		},
		expandLevel: function (treeId, levels, linkage, expand) {
			return Factory.action(treeId, 'expandLevel', levels, linkage, expand);
		},
		collapseLevel: function (treeId, levels, linkage) {
			return Factory.action(treeId, 'expandLevel', levels, linkage, false);
		},
		expandType: function (treeId, types, linkage, expand) {
			return Factory.action(treeId, 'expandType', types, linkage, expand);
		},
		collapseType: function (treeId, types, linkage) {
			return Factory.action(treeId, 'expandType', types, linkage, false);
		}
	})

}(OUI);