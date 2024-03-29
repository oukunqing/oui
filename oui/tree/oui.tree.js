
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
				return (!$.isUndefined(skin) ? skin : Config.GetSkin()) === Config.DefaultSkin;
			},
			Skin: '',
			GetSkin: function () {
				if (!Config.Skin) {
					Config.Skin = $.getQueryString(Config.FilePath, 'skin') || Config.DefaultSkin;
				}
				return Config.Skin;
			},
			CloseLinkageClassName: 'oui-popup-panel',
			IdPrefix: 'oui_tree_id_',
			NodePrefix: 'oui_tree_node_',
			RootNodeId: 'OUI_TREE_ROOT_NODE',
		},
		Cache = {
			trees: {},
			caches: {},
			events: {}
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
				return 'ot_' + id;
			},
			buildElemId: function (id, nodeId, postfix) {
				return 'ot_' + id + '_' + nodeId + (postfix || '');
			},
			buildItemId: function (id, type, dataId, postfix) {
				return 'ot_' + id + (type ? '_' + type : '') + '_' + dataId + (postfix || '');
			},
			buildNodeId: function (type, dataId) {
				return 'otn_' + (type ? type + '_' : '') + (dataId || 'root');
			},
			getTreeCache: function (id) {
				return Cache.trees['ot_' + id] || null;
			},
			setTreeCache: function(id, tree) {
				Cache.trees['ot_' + id] = {
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
						//开始时间
						begin: 0,
						//完成时间
						finish: 0,
						//层级深度
						level: 0,
						//总的节点数量
						total: 0,
						//是否指定叶子节点类型
						leaf: false,
						//指定叶子节点类型
						leafTypes: [],
						//是否动态加载
						dynamic: false,
						//指定动态加载类型
						dynamicTypes: [],
						//节点数据结构
						nodes: {},
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
			parseTrees: function (trees) {
				var ot = [], p, k, v;
				for (var i = 0; i < trees.length; i++) {
                    p = trees[i];
                    if ($.isArray(p)) {
                        k = p[0];
                        v = p[1] || p[0];
                    } else if ($.isObject(p)) {
                        k = $.getParam(p, 'key,k');
                        v = $.getParam(p, 'list,value,val,v');
                    } else if ($.isString(p, true)) {
                        var ps = p.split(/[:\|]/);
                        k = ps[0];
                        v = ps[1] || ps[0];
                    } else {
                        k = v = p;
                    }
                    ot.push({ key: k, val: v });
                }
				return ot;
			},
			parseArrayParam: function (arr) {
				if (!$.isArray(arr)) {					
					if ($.isString(arr, true)) {
						arr = arr.split(/[,;|]/);
					} else {
						arr = arr ? [arr] : [];
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

				return opt;
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
				$.addListener(tree.panel, 'mouseup', function(ev) {
					$.cancelBubble(ev);
					var elem = ev.target,
						tag = elem.tagName.toLowerCase(),
						css = elem.className,
						nid = $.getAttribute(elem, 'nid'),
						node = tree.cache.nodes[nid];

					if (!node) {
						return false;
					}

					$.console.log('event:', tree.id, elem, 'nid:', nid, node, tree.cache);

					if (tag.inArray(['label','span','a'])) {
						if (css.indexOf('switch') > -1) {
							node.setExpand();	
						} else if (css.indexOf('check') > -1) {
							node.setChecked();
						} else {

						}
					}
				});

				$.addListener(tree.panel,'dblclick', function(ev) {
					$.cancelBubble(ev);
					$.console.log('dblclick:', ev.target, ev);
				});

				$.addListener(tree.panel, 'contextmenu', function(ev) {
					$.cancelBubble(ev);
					$.console.log('contextmenu:', ev.target, ev);
				});

				return this;
			},
			buildPanel: function (tree, par) {
				var that = tree,
					opt = that.options,
					cache = that.cache,
					elem = opt.element,
					tag = elem.tagName.toLowerCase(),
					div = document.getElementById(that.tid);

				if (!div) {
					div = document.createElement('div');
					div.id = that.tid;
					div.className = 'oui-tree'.addClass('oui-tree-' + opt.skin, !Config.IsDefaultSkin(opt.skin));
					tree.panel = div;

					Factory.buildEvent(tree);
				} else {
					div.innerHTML = '';
				}

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
							Factory.buildNode(tree, opt);
							tree.complete();
						}, 1);
					} else {
						Factory.buildNode(tree, opt);
						tree.complete();
					}
				}
				return this;
			},
			buildNode: function (tree, opt) {
				var cache = tree.cache,
					root = new Node({
						tree: tree,
						root: true,
						element: tree.panel,
						fragment: $.createFragment()
					});

				cache.begin = new Date().getTime();
				cache.count = 0;

				if ($.isArray(opt.data)) {
					Factory.buildItem(tree, root, opt.data);
				} else if ($.isObject(opt.data)) {
					//数据结构注解，用于多种类型节点
					var dts = opt.trees, p = {};

					if (dts.length > 0 && dts[0]) {
						var list = [], t, pt;
						//遍历数据结构注解，并按顺序指定上下级关系
						for (var k = 0; k < dts.length; k++) {
							t = dts[k];
							pt = dts[k - 1] || dts[k];

							list = opt.data[t.val || t.key];
							p = {type: t.key, ptype: pt.key, iconType: t.key};
							Factory.buildItem(tree, root, list, p);
						}
					} else {
						//遍历参数字段，并获取第1个数组字段
						for (var k in opt.data) {
							if ($.isArray(opt.data[k])) {
								Factory.buildItem(tree, root, opt.data[k]);
								break;
							}
						}
					}
				}

				Factory.initStatus(tree);

				tree.panel.appendChild(root.fragment);
				delete root.fragment;

				cache.finish = new Date().getTime();
				cache.timeout = cache.finish - cache.begin;
				cache.total += cache.count;

				return this;
			},
			buildUl: function (tree, p, isRoot, displayNone) {
				var ul = p.pnode.getBox();
				if (ul) {
					return ul;
				}
				ul = document.createElement('UL');
				ul.className = 'level' + (isRoot ? 'root' : p.pnode.level) + ' box' + (p.ptype ? ' box-' + p.ptype : '');
				ul.id = p.pid + '_box';
				ul.setAttribute('nid', p.pnid);

				if ((!isRoot && !p.pnode.expanded) || displayNone) {
					ul.style.cssText = 'display:none;';
				}
				return ul;
			},
			buildLi: function (tree, p, node) {
				var opt = tree.options;

				var li = document.createElement('LI');	
				li.id = p.id + '_item';
				li.setAttribute('nid', p.nid);
				li.className = 'node level' + p.level;

				var hide = ' style="display:none;"',
					check = opt.showCheck ? [
						'<span class="check" id="', p.id, '_check', '" nid="', p.nid, '"></span>',
					] : [],
					icon = opt.showIcon ? [
						'<span class="', node.getIconClass(), '" id="', p.id, '_icon', '" nid="', p.nid, '"', '></span>'
					] : [],
					desc = p.desc ? [
						'<span class="desc" id="', p.id, '_desc', '" nid="', p.nid, '">', p.desc, '</span>'
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
				]).concat(desc).concat([
					'<span class="len" id="', p.id, '_len', '" nid="', p.nid, '"', hide, '>', '</span>',
					'</a>']).concat(info).concat([
					'</div>'
				]).join('');

				return li;
			},
			buildItem: function (tree, root, list, arg) {
				var cache = tree.cache,
					opt = tree.options,
					tid = tree.id,
					par = $.extend({type: '', ptype: '', iconType: ''}, arg),
					ts = new Date().getTime();

				if (!$.isArray(list) || list.length <= 0) {
					return this;
				}

				for (var i = 0; i < list.length; i++) {
					var d = list[i];
					if (typeof d.id === 'undefined') {
						continue;
					}
					var type = d.type || par.type,
						ptype = d.ptype || par.ptype,
						iconType = d.iconType || par.iconType,
						nid = Factory.buildNodeId(type, d.id),
						pnid = Factory.buildNodeId(ptype, d.pid),
						p = {
							data: d, text: d.name,
							nid: nid, pnid: pnid, type: type, ptype: ptype,
							id: Factory.buildElemId(tid, nid),
							pid: Factory.buildElemId(tid, pnid),
							desc: d.desc || (opt.debug ? type + '-' + d.id + ' ' + ts : ''),
							pnode: cache.nodes[pnid],
							expanded: false
						};

					if (!p.pnode) {
						p.root = true;
						p.pnode = root;
						p.level = 0;
					} else {
						p.level = p.pnode.level + 1;
					}

					if (tree.isDefaultOpen(p.type, p.level)) {
						p.expanded = true;
					}

					var node = new Node({
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

					cache.nodes[p.nid] = node;
					cache.count++;

					//记录最大层级
					if (p.level > cache.level) {
						cache.level = p.level;
					}
				}
				return this;
			},
			initStatus: function (tree) {
				var that = tree,
					nodes = that.cache.nodes,
					node, i = 0;

				for (var k in nodes) {
					var node = nodes[k], child = node.hasChild();
					if (!child) {
						//node.setParam('expanded', false);

						//动态加载子节点，先创建子节点容器
						if (node.dynamic) {
							node.setBox(Factory.buildUl(tree, {
								pnode: node,
								pid: Factory.buildElemId(that.id, node.id),
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
				}

				return this;
			},
			eachNodeIds: function (nodes, nodeIds, nodeType, funcName, funcParam) {
				if (!$.isArray(nodeIds)) {
					nodeIds = $.isString(nodeIds) ? nodeIds.split(/[,;|]/) : [nodeIds];
				}
				var c = nodeIds.length;
				for (var i = 0; i < c; i++) {
					var nid = Factory.buildNodeId(nodeType, nodeIds[i]),
						node = nodes[nid];
					if (node) {
						if ($.isFunction(funcName)) {
							funcName(node, i, c);
						} else if ($.isFunction(node[funcName])) {
							node[funcName](funcParam);
						}
					}
				}
				return this;
			},
			expandLevel: function (tree, levels) {

			},
			expandType: function (tree, types) {

			},
			expandNode: function (tree, ids) {

			},
			collapseLevel: function (tree, level) {

			},
			collapseType: function (tree, types) {

			},
			collapseNode: function (tree, ids) {

			}
		};

	//先加载(默认)样式文件
	Factory.loadCss(Config.DefaultSkin);

	//加载指定的(默认)样式文件
	if (!Config.IsDefaultSkin()) {
		Factory.loadCss(Config.GetSkin());
	}

	function Node(par) {
		this.initial(par);
	}

	Node.prototype = {
		initial: function(par) {
			var that = this;
			that.tree = par.tree;
			that.element = par.element;

			if (par.root) {
				that.root = true;
				that.fragment = par.fragment;
			} else {
				that.level = par.level;
				//节点ID
				that.id = par.id;
				//节点类型（可以为空）
				that.type = par.type;
				//节点Dom元素
				that.items = {};
				//节点数据
				that.data = $.extend({
					id: 0,			//ID
					name: '',		//名称
					code: ''		//编码
				}, par.data);
				//节点图标样式
				that.icon = $.extend({
					type: '',		//类型，示例: unit,device,camera 等
					status: '',		//状态，示例: on,off,play 等
					path: ''		//自定义图标URL
				}, par.icon);

				that.initParam('dynamic', par)		//是否动态加载
					.initParam('loaded', par)		//动态加载次数，0:表示未加载
					.initParam('expanded', par)		//是否展开
					.initParam('checked', par)		//是否选中复选框
					.initParam('selected', par)		//是否选中节点
					.initParam('disabled', par)		//是否禁用节点
					.initParam('parent', par)		//父节点
					.initParam('childs', par)		//子节点数组
					.initParam('childbox', par);	//子节点容器DOM元素
			}
			return that;
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
		setItem: function (key, elem) {
			return this.items[key] = elem, elem;
		},
		getItem: function (key) {
			var that = this, item = that.items[key];
			return item ? item : that.setItem(key, that.element.querySelector('.' + key));
		},
		setChecked: function (checked) {
			var that = this,
				tree = that.tree,
				opt = tree.options;

			if (!tree.isShowCheck()) {
				return that;
			}

			that.setParam('checked', $.isBoolean(checked, !that.checked))
				.setParam('part', false)
				.setCheckedClass();

			if (opt.linkage) {
				that.setParentChecked(that.checked).setChildChecked(that.checked, true);
			}

			return that;
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
			var that = this;
			if (!that.tree.isShowCheck()) {
				return that;
			}
			if (!self) {
				that.setParam('part', false)
					.setParam('checked', checked)
					.setCheckedClass();
			}
			if (that.hasChild()) {
				for (var i = 0, c = that.childs.length; i < c; i++) {
					that.childs[i].setChildChecked(checked);
				}
			}
			return that;
		},
		setSelected: function (selected) {
			return this.setParam('selected', selected).setSelectedClass();
		},
		setDisabled: function (disabled) {
			return this.setParam('disabled', disabled).setDisabledClass();
		},
		setParent: function (parentNode) {
			return this.setParam('parent', parentNode);
		},
		getBox: function () {
			return this.childbox;
		},
		setBox: function (childbox) {
			var that = this;
			that[that.root ? 'fragment' : 'element'].appendChild(childbox);
			return that.setParam('childbox', childbox);
		},
		addChild: function (node, clear) {
			var that = this;
			if (!that.childs || clear) {
				that.childs = [];
			}
			that.childs.push(node);
			if (that.childbox) {
				that.childbox.appendChild(node.element);
			}
			return that;
		},
		position: function () {
			return $.scrollTo(this.element, this.tree.panel), this;
		},
		setExpand: function (expanded) {
			var that = this;
			if (!that.isDynamic() && !that.hasChild()) {
				return that;
			}
			var box = that.childbox, tree = that.tree, opt = tree.options;
			if (box) {				
				expanded = $.isBoolean(expanded, box.style.display === 'none');
				box.style.display = expanded ? 'block' : 'none';
				//动态加载，默认只加载1次
				if (expanded && !that.hasChild()) {
					if (!that.loaded) {
						that.loaded = 0;
					}
					if (that.loaded < opt.loadCount) {
						tree.expandCallback(that);
					}
					that.loaded++;
				}
			}
			return that.setParam('expanded', expanded).setExpandClass();
		},
		expand: function () {
			return this.setExpand(true);
		},
		collapse: function () {
			return this.setExpand(false);
		},
		getSwitchClass: function () {
			var that = this, css = ['switch'];
			if (!that.isLeaf() && that.isExpand()) {
			//if (that.isExpand()) {
				css.push('switch-open');
			}
			return css.join(' ');
		},
		getIconClass: function () {
			var that = this, icon = that.icon, css = ['icon'],
				open = that.expanded && !that.isLeaf(),
				openCss = open ? '-open' : '';

			if (icon.type) {
				if (icon.status) {
					css.push(icon.type + '-' + icon.status + openCss);
				} else if (open) {
					css.push(icon.type + openCss);
				} else {
					css.push(icon.type);
				}
			} else if (icon.path) {

			}  else if (open) {
				css.push('icon' + openCss);
			}

			return css.join(' ');
		},
		setIconClass: function () {
			var that = this, tree = that.tree, icon;
			if (tree.isShowIcon() && (icon = that.getItem('icon'))) {
				icon.className = that.getIconClass();
			}
			return that;
		},
		setIcon: function (par) {
			return $.extend(this.icon, par), this;
		},
		updateIcon: function (par) {
			return this.setIcon(par).setIconClass();
		},
		updateData: function (data) {
			var that = this;
			$.extend({}, that.data, data);
			return that;
		},
		updateText: function (str) {
			var that = this, item;
			if ($.isString(str, true) && (item = that.getItem('text'))) {
				item.innerHTML = str;
			}
			return that;
		},
		updateDesc: function (str) {
			var that = this, item;
			if ((item = that.getItem('desc'))) {
				item.innerHTML = str || '';
			}
			return that;
		},
		setExpandClass: function (initial) {
			var that = this, handle = that.getItem('switch');

			//if (that.isLeaf()) {
			//虽然被指定为叶子节点类型，但当前已经有子节点加入，那就不能再算是叶子节点了
			if (that.isLeaf() && !that.hasChild()) {
				that.setParam('expanded', false);
				$.setClass(handle, 'switch-none', true);
			} else {
				if (!that.hasChild()) {
					if (!that.isDynamic()) {
						that.setParam('expanded', false);
						$.setClass(handle, 'switch-none', true);
					} else if (that.isExpanded() && !that.loaded) {
						that.setParam('expanded', false);
					}
				}
				$.setClass(handle, 'switch-open', that.isExpanded());
			}
			return that.setIconClass();
		},
		setCheckedClass: function () {
			var that = this, tree = that.tree, check = that.getItem('check');
			if (tree.options.showCheck && check) {
				$.setClass(check, 'check-true', that.checked);
				$.setClass(check, 'check-true-part', that.part && that.checked);
			}
			return that;
		},
		setItemClass: function (type, initial) {
			switch(type) {
				case 'check': this.setCheckedClass(); break;
				case 'switch': this.setExpandClass(); break;
			}
			return this;
		},
		setSelectedClass: function () {
			var that = this, elem = that.element;
			$.setClass(elem, 'cur', that.selected);
			return that;
		},
		setDisabledClass: function() {
			var that = this, elem = that.element;
			$.setClass(elem, 'disabled', that.disabled);
			return that;
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
			var that = this, leaf = that.tree.isLeafType(that.type);
			//判断是否指定叶子节点类型
			//0: 未指定，1: 指定，是叶子，-1: 指定，非叶子
			if (leaf !== 0) {
				return leaf === 1;
			}
			return !that.dynamic && !that.hasChild();
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
			var that = this,
				opt = Factory.checkOptions($.extend({
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
					//是否级联选中复选框
					linkage: undefined,
					//非级联模式下最大选中数量，0-表示不限数量，默认为0
					maxCount: undefined,
					//是否单选模式
					single: undefined,
					callback: undefined,
					complete: undefined,
					expandCallback: undefined
				}, options));

			that.id = opt.id;
			that.tid = Factory.buildTreeId(opt.id);
			that.options = opt;

			if (!Config.IsDefaultSkin(opt.skin)) {
				Factory.loadCss(opt.skin);
			}

			if (!$.isElement(opt.element)) {
				return that;
			}

			Factory.initCache(that, {
				dynamic: opt.dynamic,
				dynamicTypes: opt.dynamicTypes,
				leaf: opt.leaf,
				leafTypes: opt.leafTypes
			}, true).buildPanel(that, opt);

			return that;
		},
		complete: function () {
			var that = this,
				opt = that.options,
				cache = that.cache;

			if ($.isFunction(opt.complete)) {
				opt.complete(that);
			}
			return that;
		},
		callback: function (par) {
			var that = this,
				opt = that.options,
				data = {};
			//TODO:

			if ($.isFunction(opt.callback)) {
				opt.callback(data, par, that);
			}
			return that;
		},
		expandCallback: function (node) {
			var that = this,
				opt = that.options;

			if ($.isFunction(opt.expandCallback)) {
				opt.expandCallback(node, that);
			}
			return that;
		},
		insert: function (items, pid, nid) {

		},
		add: function (items, pid, nid) {

		},
		//更新节点图标、文字
		update: function (items) {
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
		selected: function (nodeIds, nodeType, selected) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'setSelected', $.isBoolean(selected, true)), this;
		},
		checked: function (nodeIds, nodeType, checked) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'setChecked', $.isBoolean(checked, true)), this;
		},
		disabled: function (nodeIds, nodeType, disabled) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'setDisabled', $.isBoolean(disabled, true)), this;
		},
		select: function (nodeIds, nodeType, selected) {
			return this.selected(nodeIds, nodeType, selected);
		},
		delete: function (nodeIds, nodeType) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'delete'), this;
		},
		position: function (nodeIds, nodeType) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'position'), this;
		},
		expand: function (nodeIds, nodeType) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'expand'), this;
		},
		collapse: function (nodeIds, nodeType) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'collapse'), this;
		},
		expandLevel: function (arg, action) {

			return that;
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
		//判断节点类型是否是叶子节点
		//0: 未指定，1: 指定，是叶子，-1: 指定，非叶子
		isLeafType: function (nodeType) {
			var opt = this.options;
			if (!this.isAppointLeaf()) {
				return 0;
			}
			return opt.leafTypes.indexOf(nodeType) > -1 ? 1 : -1;
		},
		isDynamicLoad: function () {
			return this.options.dynamic;
		},
		//是否需要动态加载子节点
		isDynamicType: function (nodeType) {
			var opt = this.options;
			if (!this.isDynamicLoad() || this.isLeafType(nodeType) > 0) {
				return false;
			}
			return !opt.dynamicTypes[0] || opt.dynamicTypes.indexOf(nodeType) > -1;
		},
		isOpenType: function (nodeType) {
			var opt = this.options;
			return opt.openTypes.indexOf(nodeType) > -1;
		},
		isOpenLevel: function (nodeLevel) {
			var opt = this.options;
			return opt.openLevel < 0 || opt.openLevel >= nodeLevel;
		},
		isDefaultOpen: function (nodeType, nodeLevel) {
			var opt = this.options, type = $.isString(nodeType, true);
			if (opt.openLevel >= 0) {
				return opt.openLevel > nodeLevel;
			} else if (type && opt.openTypes[0]) {
				return opt.openTypes.indexOf(nodeType) > -1;
			}
			return true;
		},
		getChecked: function () {
			var that = this,
				list = [];

			return list;
		},
		getCheckedValue: function () {

		}
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
		add: function (treeId, items, type, ptype) {
			var tree = $.tree.get(treeId);
			if (tree) {
				tree.add(items, type, ptype);
			}
			return this;
		},
		update: function (treeId, items, type, ptype) {
			var tree = $.tree.get(treeId);
			if (tree) {
				tree.update(items, type, ptype);
			}
			return this;
		},
		action: function (treeId, ids, type, funcName, funcParam) {
			var tree = $.tree.get(treeId);
			if (tree && $.isFunction(tree[funcName])) {
				tree[funcName](ids, type, funcParam);
			}
			return this;
		},
		icon: function (treeId, ids, type, par) {
			return $.tree.action(treeId, ids, type, 'updateIcon', par);
		},
		updateIcon: function (treeId, ids, type, par) {
			return $.tree.action(treeId, ids, type, 'updateIcon', par);
		},
		text: function (treeId, ids, type, texts) {
			return $.tree.action(treeId, ids, type, 'updateText', texts);
		},
		updateText: function (treeId, ids, type, texts) {
			return $.tree.action(treeId, ids, type, 'updateText', texts);
		},
		desc: function (treeId, ids, type, texts) {
			return $.tree.action(treeId, ids, type, 'updateDesc', texts);
		},
		updateDesc: function (treeId, ids, type, texts) {
			return $.tree.action(treeId, ids, type, 'updateDesc', texts);
		},
		select: function (treeId, ids, type, selected) {
			return $.tree.action(treeId, ids, type, 'select', selected);
		},
		delete: function (treeId, ids, type) {
			return $.tree.action(treeId, ids, type, 'delete');
		},
		selected: function (treeId, ids, type, selected) {
			return $.tree.action(treeId, ids, type, 'select', selected);
		},
		checked: function (treeId, ids, type, checked) {
			return $.tree.action(treeId, ids, type, 'checked', checked);
		},
		disabled: function (treeId, ids, type, disabled) {
			return $.tree.action(treeId, ids, type, 'disabled', disabled);
		},
		position: function (treeId, id, type) {
			return $.tree.action(treeId, id, type, 'position');
		}
	})

}(OUI);