
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
			getElem: function (tree, nodeId, postfix) {
				//var id = Factory.buildElemId(id, nodeId, postfix);
				//return document.getElementById(id);

				var nodes = tree.cache.nodes,
					node = nodes[nodeId];
				if (node) {
					return node.element.querySelector('.' + postfix);
				}
				return null;
			},
			initCache: function (tree, par, force) {
				var tid = tree.tid || Factory.buildTreeId(tree.id);
				if ($.isBoolean(par)) {
					force = par;
					par = {};
				}
				if (!Cache.caches[tid] || force) {
					Cache.caches[tid] = $.extend({
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
						nodes: {},
					}, par);
				}
				return tree.cache = Cache.caches[tid], this;
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
                        k = $.getParam(p, 'key');
                        v = $.getParam(p, 'value,val');
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

				opt.leaf = $.getParam(opt, 'leaf');
				if (!$.isString(opt.leaf)) {
					opt.leaf = '';
				}

				opt.dynamic = $.getParam(opt, 'dynamic');
				if ($.isNumber(opt.dynamic) && opt.dynamic > 0) {
					opt.loadCount = opt.dynamic;
					opt.dynamic = true;
				} else {
					opt.dynamic = $.isBoolean(opt.dynamic, false);
				}
				opt.loadCount = parseInt($.getParam(opt, 'loadCount,loadcount'), 10);
				if (isNaN(opt.loadCount)) {
					opt.loadCount = 1;
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
			buildNode: function (tree, par) {
				var cache = tree.cache,
					root = new Node({
						tree: tree,
						root: true,
						element: tree.panel,
						fragment: $.createFragment()
					}),
					//数据目录结构，用于多种类型节点
					dts = tree.options.trees, p = {};

				cache.begin = new Date().getTime();
				cache.count = 0;

				if (dts.length > 0 && dts[0]) {
					var list = [], t, pt;
					for (var k = 0; k < dts.length; k++) {
						t = dts[k];
						pt = dts[k - 1] || dts[k];

						list = par.data[t.val || t.key];
						p = {type: t.key, ptype: pt.key, iconType: t.key};
						Factory.buildItem(tree, root, list, p);
					}
				} else {
					if ($.isArray(par.data)) {
						Factory.buildItem(tree, root, par.data);
					} else if ($.isObject(par.data)) {
						for (var k in par.data) {
							Factory.buildItem(tree, root, par.data[k]);
							break;
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

				if (displayNone) {
					ul.style.cssText = 'display:none;';
				}

				return p.pnode.setBox(ul), ul;
			},
			buildLi: function (tree, p, node) {
				var opt = tree.options;

				var li = document.createElement('LI');	
				li.id = p.id + '_item';
				li.setAttribute('nid', p.nid);
				li.className = 'node level' + p.level;

				var hide = ' style="display:none;"',
					open = node.expanded ? ' switch-open' : '',
					check = opt.showCheck ? [
						'<span class="check" id="', p.id, '_check', '" nid="', p.nid, '"></span>',
					] : [],
					icon = opt.showIcon ? [
						'<span class="', node.getIconCss(), '" id="', p.id, '_icon', '" nid="', p.nid, '"', '></span>'
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
					'<span class="switch', open, '" id="', p.id, '_switch', '" nid="', p.nid, '"></span>'
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
					par = $.extend({type: '', ptype: '', iconType: ''}, arg);

				if (!$.isArray(list) || list.length <= 0) {
					return this;
				}

				for (var i = 0; i < list.length; i++) {
					var d = list[i];
					if (!d.id) {
						continue;
					}
					var nid = Factory.buildNodeId(par.type, d.id),
						pnid = Factory.buildNodeId(par.ptype, d.pid),
						ts = d.id === 1 ? new Date().getTime() : '',
						p = {
							data: d,
							nid: nid,
							pnid: pnid,
							id: Factory.buildElemId(tid, nid),
							pid: Factory.buildElemId(tid, pnid),
							type: par.type,
							ptype: par.ptype,
							text: d.name,
							desc: par.type + ' ' + d.id + ' ' + ts,
							pnode: cache.nodes[pnid]
						};

					if (!p.pnode) {
						p.root = true;
						p.pnode = root;
						p.level = 0;
					} else {
						p.level = p.pnode.level + 1;
					}
					Factory.buildUl(tree, p, p.root);

					var node = new Node({
						tree: tree,
						data: p.data,
						id: p.nid,
						type: par.type,
						level: p.level,
						//TODO:
						expanded: true,
						checked: d.checked || false,
						disabled: d.disabled || false,
						icon: $.extend({ type: par.iconType }, d.icon)
					});

					node.setParam('element', Factory.buildLi(tree, p, node))
						.setParent(p.pnode)
						.setParam('dynamic', opt.dynamic, true);

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
					opt = that.options,
					cache = that.cache,
					nodes = cache.nodes,
					node, i = 0,
					leafType = $.isString(opt.leaf, true);

				for (var k in nodes) {
					var node = nodes[k], child = node.hasChild();
					
					var leaf = leafType && node.type === opt.leaf;
					//动态加载节点，先创建子节点容器
					if (opt.dynamic && !leaf && !child) {
						node.setParam('expanded', false);

						Factory.buildUl(tree, {
							pnode: node,
							pid: Factory.buildElemId(that.id, node.id),
							pnid: node.id,
							ptype: node.type
						}, false, true);
					}

					if ((node.dynamic || node.isExpanded()) && !child) {
						node.setExpandClass();
					}
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
				that.data = par.data;
				that.id = par.id;
				that.type = par.type;
				that.items = {};
				that.icon = $.extend({
					type: '', status: '', path: ''
				}, par.icon);

				that.initParam('dynamic', par)
					.initParam('expanded', par)
					.initParam('checked', par)
					.initParam('selected', par)
					.initParam('disabled', par)
					.initParam('parent', par)
					.initParam('childbox', par)
					.initParam('childs', par);

				//子节点动态加载的次数
				//that.loaded = 0;
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
		getElem: function (nid, postfix) {
			return this.element.querySelector('.' + postfix);
		},
		setItem: function (key, elem) {
			return this.items[key] = elem, elem;
		},
		getItem: function (key) {
			var that = this;
			return that.items[key] || that.setItem(key, that.getElem(that.id, key));
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
				that.setParentChecked(that.checked)
					.setChildChecked(that.checked, true);
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
			return this.setParam('disabled', disabled);
		},
		setIcon: function (par) {
			$.extend(this.icon, par);
			return this;
		},
		setParent: function (parentNode) {
			return this.setParam('parent', parentNode);
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
		hasChild: function () {
			return this.childs && this.childs.length > 0;
		},
		isLeaf: function () {
			if (this.tree.options.leaf) {
				return this.type === this.tree.options.leaf;
			}
			return !this.hasChild();
		},
		getBox: function () {
			return this.childbox;
		},
		position: function () {
			return $.scrollTo(this.element, this.tree.panel), this;
		},
		expand: function () {
			return this.setExpand(true);
		},
		collapse: function () {
			return this.setExpand(false);
		},
		setExpand: function (expanded) {
			var that = this;
			if (!that.dynamic && !that.hasChild()) {
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
		getIconCss: function () {
			var that = this, css = ['icon'];

			if (that.icon.type) {
				if (that.icon.status) {
					css.push(that.icon.type + '-' + that.icon.status);
				} else if (that.expanded) {
					css.push(that.icon.type + '-open');
				} else {
					css.push(that.icon.type);
				}
			} else if (that.icon.path) {

			}  else if (that.expanded && !that.isLeaf()) {
				css.push('icon-open');
			}

			return css.join(' ');
		},
		updateIcon: function (par) {
			return this.setIcon(par).setIconClass();
		},
		updateText: function (str) {
			if (!$.isString(str, true)) {
				return this;
			}
			var text = this.getItem('text');
			if (text) {
				text.innerHTML = str;
			}
			return this;
		},
		updateDesc: function (str) {
			var desc = this.getItem('desc');
			if (desc) {
				desc.innerHTML = str || '';
			}
			return this;
		},
		setExpandClass: function () {
			var that = this, tree = that.tree,
				leaf = that.isLeaf(),
				child = that.hasChild(),
				handle = that.getItem('switch');	

			//叶子节点 或者 展开状态+非动态加载+无子节点
			if (leaf || (!child && (!that.dynamic || (that.expanded && !that.loaded)))) {
				that.setParam('expanded', false);
			}

			//叶子节点，或者非动态加载并且没有子节点
			if (leaf || (!that.dynamic && !child)) {
				$.setClass(handle, 'switch-none', !child);
			}
			$.setClass(handle, 'switch-open', that.expanded);

			return that.setIconClass();
		},
		setIconClass: function () {
			var that = this, tree = that.tree;
			if (tree.isShowIcon()) {
				var icon = that.getItem('icon');
				icon.className = that.getIconCss();
			}
			return that;
		},
		setCheckedClass: function () {
			var that = this, tree = that.tree,
				check = that.getItem('check');

			if (check) {
				$.setClass(check, 'check-true', that.checked);
				$.setClass(check, 'check-true-part', that.part && that.checked);
			}
			return that;
		},
		setSelectedClass: function () {
			var that = this, tree = that.tree,
				item = that.getItem('item');

			$.setClass(item, 'cur', that.selected);

			return that;
		},
		setStatus: function (type, initial) {
			var that = this, tree = that.tree;

			switch(type) {
			case 'check':
				that.setCheckedClass();
				break;
			case 'select':
				that.setSelectedClass();
				break;
			case 'switch':
			case 'expand':
			default:
				that.setExpandClass();
				break;
			}

			return that;
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
					id: '',
					element: undefined,
					//是否异步加载节点
					async: undefined,
					//data如果不是数组，是对象结构，则需要指定trees
					data: [],
					//data数据结构，示例："unit:units,device:devices,camera:cameras"
					trees: undefined,
					//指定叶子节点类型，示例："camera"
					leaf: undefined,
					//动态加载子节点(非叶子节点)
					dynamic: undefined,
					//动态加载次数，默认为1次
					loadCount: undefined,
					//是否显示图标
					showIcon: undefined,
					//自定义图标文件URL
					icon: undefined,
					//是否显示复选框
					showCheck: undefined,
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

			Factory.initCache(that, true).buildPanel(that, opt);

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
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'setSelected', selected), this;
		},
		checked: function (nodeIds, nodeType, checked) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'setChecked', checked), this;
		},
		disabled: function (nodeIds, nodeType, disabled) {
			return Factory.eachNodeIds(this.cache.nodes, nodeIds, nodeType, 'setDisabled', disabled), this;
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