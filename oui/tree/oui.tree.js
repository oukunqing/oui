
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
			IdPrefix: 'otree_',
			RootNodeId: 'otree_root_node',
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
				return Config.IdPrefix + id;
			},
			buildElemId: function (id, nodeId, postfix) {
				return Config.IdPrefix + id + '_' + nodeId + (postfix || '');
			},
			buildNodeId: function (type, dataId) {
				return (type || '') + '_' + (dataId || 'root');
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

					$.console.log('event:', tree.id, elem, 'nid:', nid, node, ev);

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
				var ul = p.pnode.getBox(), css = [];
				if (ul) {
					return ul;
				}
				ul = document.createElement('UL');
				var css = [
					'level', isRoot ? 'root' : p.pnode.level, ' box', p.ptype ? ' box-' + p.ptype : ''
				];
				if ((!isRoot && !p.pnode.expanded) || displayNone) {
					css.push('hide');
				}

				ul.id = (p.pid + '_box');
				ul.className = css.join(' ');
				//ul.setAttribute('nid', p.pnid);

				return ul;
			},
			buildLi: function (tree, p, node, targetLi) {
				//var li = document.createElement('LI');
				var li = targetLi.cloneNode(false);
				li.id = p.id + '_item';
				//li.setAttribute('nid', p.nid);
				li.className = 'node level' + p.level;

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
			buildItem: function (tree, root, list, arg) {
				var tid = tree.id,
					par = $.extend({type: '', ptype: '', iconType: ''}, arg),
					ts = new Date().getTime(),
					targetLi = document.createElement('LI');

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
							desc: d.desc,
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
						.setParam('element', Factory.buildLi(tree, p, node, targetLi));

					p.pnode.addChild(node);

					tree.cache.nodes[p.nid] = node;
					tree.cache.count++;

					//记录最大层级
					if (p.level > tree.cache.level) {
						tree.cache.level = p.level;
					}
				}
				return this;
			},
			initStatus: function (tree) {
				var node, i = 0;

				for (var k in tree.cache.nodes) {
					node = tree.cache.nodes[k];
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
				}

				return this;
			},
			eachNodeIds: function (nodes, nodeIds, nodeType, funcName, funcParam) {
				if (!$.isArray(nodeIds)) {
					nodeIds = $.isString(nodeIds) ? nodeIds.split(/[,;|]/) : [nodeIds];
				}
				var c = nodeIds.length, nid, node;
				for (var i = 0; i < c; i++) {
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
			return this.items[key] ? this.items[key] : this.setItem(key, this.element.querySelector('.' + key));
		},
		setChecked: function (checked) {
			var that = this;

			if (!that.tree.isShowCheck()) {
				return that;
			}

			that.setParam('checked', $.isBoolean(checked, !that.checked))
				.setParam('part', false)
				.setCheckedClass();

			if (that.tree.options.linkage) {
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
		position: function () {
			return $.scrollTo(this.element, this.tree.panel), this;
		},
		setExpand: function (expanded) {
			if (!this.isDynamic() && !this.hasChild()) {
				return this;
			}
			if (this.childbox) {				
				//expanded = $.isBoolean(expanded, this.childbox.style.display === 'none');
				expanded = $.isBoolean(expanded, !this.expanded);
				$.setClass(this.childbox, 'hide', !expanded);
				//this.childbox.style.display = expanded ? 'block' : 'none';
				//动态加载，默认只加载1次
				if (expanded && !this.hasChild()) {
					if (!this.loaded) {
						this.loaded = 0;
					}
					if (this.loaded < this.tree.options.loadCount) {
						this.tree.expandCallback(this);
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

			if (this.icon.type) {
				if (this.icon.status) {
					css.push(this.icon.type + '-' + this.icon.status + open);
				} else if (open) {
					css.push(this.icon.type + open);
				} else {
					css.push(this.icon.type);
				}
			} else if (this.icon.path) {

			}  else if (open) {
				css.push('icon' + open);
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
				$.setClass(handle, 'switch-none', true);
			} else {
				if (!this.hasChild()) {
					if (!this.isDynamic()) {
						this.setParam('expanded', false);
						$.setClass(handle, 'switch-none', true);
					} else if (this.isExpanded() && !this.loaded) {
						this.setParam('expanded', false);
					}
				}
				$.setClass(handle, 'switch-open', this.isExpanded());
			}
			return this.setIconClass();
		},
		setCheckedClass: function () {
			var check = this.getItem('check');
			if (this.tree.options.showCheck && check) {
				$.setClass(check, 'check-true', this.checked);
				$.setClass(check, 'check-true-part', this.part && this.checked);
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
			$.setClass(this.element, 'cur', this.selected);
			return this;
		},
		setDisabledClass: function() {
			$.setClass(this.element, 'disabled', this.disabled);
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