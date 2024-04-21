
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
			Skin: '',
			GetSkin: function () {
				if (!Config.Skin) {
					Config.Skin = $.getQueryString(Config.FilePath, 'skin') || Config.DefaultSkin;
				}
				return Config.Skin;
			},
			Localhost: $.isLocalhost(),
			MouseWhichLeft: 1,
			MouseWhichRight: 3,
			CloseLinkageClassName: 'oui-popup-panel',
			IdPrefix: 'otree_',
			RootNodeId: 'otree_root_node',
			CallbackLevel: {
				//直接返回
				Normal: 0,
				//确定按钮
				Confirm: 1
			},
			DebounceDelay: 256,
			DebounceTimeout: 4000,
			//需要显示title的最小层级
			TitleTextLevel: 2,
			//需要显示title的最小文字长度
			TitleTextLength: 12,
			//缓存Cookie过期时间，单位：分钟
			CacheCookieExpire: 10,
			Lang: {
				Add: '\u65b0\u5efa', 		//新建
				Edit: '\u7f16\u8f91', 		//编辑
				Del: '\u5220\u9664',		//删除
				Up: '\u4e0a\u79fb',			//上移
				Down: '\u4e0b\u79fb',		//下移
				Update: '\u66f4\u65b0',		//更新
				Modify: '\u4fee\u6539'		//修改
			},
			EmptyTreeId: 'OuiTreeNone',
			SearchResultBoxHeight: 390, 	//12 * 30 + 30
			SearchResultItemHeight: 30,
			SearchResultTitleHeight: 30,
			//搜索框字符长度限制
			SearchKeywordsLength: 128,
			//“返回顶部”图标停留时长，单位：毫秒，0表示不限制时间
			GotoTopButtonKeepTimes: 10 * 1000,

		},
		KC = $.KEY_CODE, KCA = KC.Arrow, KCC = KC.Char, KCM = KC.Min,
		Cache = {
			ids: [],
			trees: {},
			caches: {},
			events: {},
			clicks: {},
			timers: {},
			checks: {},
			drags: {},
			search: {}
		},
		Event = {
			target: function (ev, tree) {
				var elem = ev.target,
					parent = elem.parentNode,
					tag = elem.tagName.toLowerCase();

				if(tag.inArray(['b']) && parent.tagName.toLowerCase() === 'span') {
					elem = elem.parentNode;
				}

				var nid = $.getAttribute(elem, 'nid') || $.getAttribute(elem.parentNode, 'nid'),
					node = tree.cache.nodes[nid];

				return node ? { 
					node: node, elem: elem, nid: nid,
					element: node.element,
					tag: elem.tagName.toLowerCase(), 
					css: elem.className.trim().split(' ')[0]
				} : {};
			},
			mousedown: function (ev, tree) {
				Factory.showSearchPanel(tree, false);

				var p = Event.target(ev, tree);
				if (p.node && Factory.isNodeSwitch(p)) {
					p.node.setExpand(null, ev);	
				}
				return this;
			},
			click: function (ev, tree, name) {
				var ep = Event.target(ev, tree),
					op = tree.options;

				if (!ep.node) {
					return false;
				}				
				if (ep.tag.inArray(['a', 'span'])) {
					if (ep.css.inArray(['switch'])) {
						//ep.node.setExpand();
						//switch事件迁移到mousedown
						return false;
					}
					if (ep.css.inArray(['check'])) {
						ep.node.setChecked(null, ev);
					} else if (ep.css.inArray(['button', 'btn'])) {
						Factory.buttonCallback(ep.node, tree, ev, $.getAttribute(ep.elem, 'key'));
					} else if (Factory.isNodeBody(ep)) {
						if (Factory.isDblclick(tree, ep.node)) {
							return false;
						}
						if (Factory.isReturnType(tree, ep.node.type)) {
							Factory.setTargetValue(ep.node, tree).clickCallback(ep.node, tree, ev);
							ep.node.setSelected(true, ev);
							if (op.clickChecked) {
								ep.node.setChecked(null, ev);
							}
						}
						if (op.clickExpand) {
							//clickExpanded 与 clickExpand 是两个不同的参数
							ep.node.setExpand(op.clickExpanded, ev);
						}
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
					if (Factory.isReturnType(tree, p.node.type)) {
						Factory.dblclickCallback(p.node, tree, ev);
					}
				}
			},
			contextmenu: function (ev, tree) {
				var p = Event.target(ev, tree), node;
				if (p.node && Factory.isNodeBody(p)) {
					node = p.node;
				}
				Factory.contextmenuCallback(node, tree, ev);
			},
			mouseover: function (ev, tree) {
				var key = 'tree_node_over_' + tree.id;
				if (Cache.timers[key]) {
					window.clearTimeout(Cache.timers[key]);
				}
				Cache.timers[key] = window.setTimeout(function() {
					var p = Event.target(ev, tree);
					if (p.node) {
						Factory.buildButton(tree, p.node);
					}
				}, 30);
				return this;
			},
			buttonClick: function (ev, tree) {
				var opt = tree.options,
					tag = ev.target.tagName.toLowerCase(),
					css = ev.target.className.split(' ');

				if (css[0] !== 'btn' || !opt.target) {
					return false;
				}

				switch(css[1]) {
				case 'btn-return':
					Factory.callback(null, tree, ev);
					break;
				case 'btn-cancel':
					//Factory.setBoxDisplay(tree, false);
					break;
				case 'btn-origin':
					Factory.setDefaultValue(tree, true);
					break;
				}
				return Factory.setBoxDisplay(tree, false), this;
			},
			scroll: function (ev, tree) {
				var key = 'tree_scroll_' + tree.id,
					key2 = 'tree_arrow_' + tree.id,
					div = ev.target, 
					top, height, rate, pos;

				if (!tree.options.showScrollIcon) {
					return this;
				}

				if (Cache.timers[key]) {
					window.clearTimeout(Cache.timers[key]);
				}
				Cache.timers[key] = window.setTimeout(function() {
					top = div.scrollTop;
					height = div.scrollHeight - div.clientHeight;
					//滚动位置到2/5时，显示按钮
					if (top >= height / 5 * 2) {
						rate = top / height;
						//计算火箭位置，跟随滚动位置（按比例）, 按钮的高度是25px
						pos = rate * (div.offsetHeight + 25 * (1 - rate));
						Factory.showReturnTop(tree, div, true, pos);

						if (Config.GotoTopButtonKeepTimes > 0) {
							if (Cache.timers[key2]) {
								window.clearTimeout(Cache.timers[key2]);
							}
							Cache.timers[key2] = window.setTimeout(function() {
								Factory.showReturnTop(tree, div, false, pos);
							}, Config.GotoTopButtonKeepTimes);
						}
					} else {
						Factory.showReturnTop(tree, div, false, pos);
					}
				}, 10);
				return this;
			},
			dragstart: function (ev, tree) {
				var ep = Event.target(ev, tree),
					op = tree.options;

				if (!ep.node) {
					return false;
				}
				Factory.setDragNode(tree, ep.node, ev);
				$.setElemClass(ep.element, 'node-drag', true);

				//firefox hack
				//ev.dataTransfer.setData('text','drag');

				//清除默认的预览图
				ev.dataTransfer.setDragImage(new Image(), 0, 0);
			},
			drop: function (ev, tree) {
				ev.preventDefault();
				var ep = Event.target(ev, tree),
					op = tree.options,
					par = Factory.getDragNode(tree),
					node = par.node,
					dest = ep.node;

				Factory.delDragNode(tree);

				if (!dest || !node) {
					return false;
				}
				if (node.parent === dest && dest.childs.length > 1) {
					dest = dest.childs[0];
				}
				node.sortNode(dest, null, true);

				$.setElemClass(node.element, 'node-drag', false);
				$.setClass(ep.element, 'node-drop,drop-up,drop-down', false);
			},
			dragover: function (ev, tree) {
				ev.preventDefault();
				var par = Factory.getDragNode(tree), x, y;
				if (par && par.clone) {
					x = ev.clientX - par.offset.left;
					y = ev.clientY - par.offset.top;
					par.clone.style.transform = 'translate3d( ' + x + 'px ,' + y + 'px,0)'; 
				}
			},
			dragenter: function (ev, tree) {
				var key = 'tree_drag_enter_' + tree.id, data;
				if (Cache.timers[key]) {
					window.clearTimeout(Cache.timers[key]);
				}
				Cache.timers[key] = window.setTimeout(function() {
					var ep = Event.target(ev, tree), obj = Factory.getDragNode(tree);
					if (!ep.node 
						//判断是否是同组节点（或父节点）
						//这里只实现同组上下拖动排序，不改变节点父级关系
						//若拖动改变父级关系，随意拖动之后，极易引起节点混乱
						|| !Factory.isSameTeam(obj.node, ep.node) 
						|| ep.element.className.indexOf('node') < 0) {
						return false;
					}
					if (obj.node !== ep.node) {
						var dir = obj.pos.top < ev.clientY || obj.node.parent === ep.node ? 'drop-down' : 'drop-up';
						$.setClass(ep.element, ['node-drop', dir].join(','), true);
					}
				}, 50);
			},
			dragleave: function (ev, tree) {
				var ep = Event.target(ev, tree), obj = Factory.getDragNode(tree);
				if (!ep.node 
					|| !Factory.isSameTeam(obj.node, ep.node)
					|| ep.element.className.indexOf('node-drop') < 0) {
					return false;
				}
				$.setClass(ep.element, 'node-drop,drop-up,drop-down', false);
			},
			dragend: function (ev, tree) {
				var obj = Factory.getDragNode(tree);
				if (obj && obj.node) {
					$.setElemClass(obj.node.element, 'node-drag', false);
				}
				Factory.delDragNode(tree);
			}
		},
		Factory = {
			loadCss: function (skin, func) {
				var path = Config.FilePath,
					name = $.getFileName(path, true),
					arr = skin.split(','),
					dirRoot = $.getFilePath(path),
					dir = '';

				for (var i = 0; i < arr.length; i++) {
					if (arr[i] !== '') {
						dir = dirRoot + 'skin/' + arr[i] + '/';
						$.loadLinkStyle(dir + name.replace('.min', '') + '.css', function () {
							if ($.isFunction(func)) {
								func();
							}
						});
					}
				}
				return this;
			},
			isLocalhost: function () {
				return Config.Localhost || location.href.startWith('file://');
			},
			isDefaultSkin: function (skin) {
				return !skin || skin === Config.DefaultSkin;
			},
			isDblclick: function (tree, node) {
				var last = Cache.clicks[tree.id],
					cur = {id: node.id, ts: new Date().getTime()};

				if (last && last.id === cur.id && cur.ts - last.ts <= 500) {
					return true;
				}
				return Cache.clicks[tree.id] = cur, false;
			},
			isEmpty: function (par) {
				if (typeof par === 'object') { 
					for (var k in par) { return false; } 
				}
				return true;
			},
			isTree: function (tree) {
				return tree && tree instanceof(Tree);
			},
			isNode: function (node) {
				return node && node instanceof(Node);
			},
			isSameTeam: function (node, dest) {
				return node.parent === dest.parent || node.parent === dest;
			},
			isPromise: function () {
				return typeof Promise !== 'undefined';
			},
			buildTreeId: function (id, key) {
				return Config.IdPrefix + (key || '') + id;
			},
			buildElemId: function (id, nodeId, postfix) {
				return Config.IdPrefix + id + '_' + nodeId + (postfix || '');
			},
			buildNodeId: function (nodeId, nodeType) {
				var type = nodeType || '';
				return (type ? type + '_' : '') + nodeId;
			},
			buildCacheId: function (treeId) {
				return Config.IdPrefix + treeId;
			},
			getTreeCache: function (tree, each) {
				var id = Factory.isTree(tree) ? tree.id : tree,
					none = $.isUndefinedOrNull(id),
					key = Factory.buildCacheId(id),
					cache, i = 0, k;

				if (!(cache = Cache.trees[key]) && each) {
					if (none) {
						for (k in Cache.trees) {
							if ((cache = Cache.trees[k]) && !cache.none) {
								break;
							}
						}
					} else if ($.isNumber(id)) {
						for (k in Cache.trees) {
							if ((cache = Cache.trees[k]) && !cache.none) {
								if (i === id) {
									break;
								}
								i++;
							}
						}
					}
				}
				return cache;
			},
			setTreeCache: function(tree, none) {
				var key = Factory.buildCacheId(tree.id);

				Cache.trees[key] = { id: tree.id, tree: tree, none: none };
				Cache.ids.push({ id: tree.id, key: key });

				return Cache.trees[key];
			},
			initCache: function (tree, force) {
				var tid = tree.tid || Factory.buildTreeId(tree.id),
					opt = tree.options,
					par = {
						dynamic: opt.dynamic,
						dynamicTypes: opt.dynamicTypes,
						dynamicDatas: opt.dynamicDatas,
						leaf: opt.leaf,
						leafTypes: opt.leafTypes,
						returnTypes: opt.returnTypes
					},
					pa = $.extend({}, par),
					pc = Cache.caches[tid],
					store = {
						expanded: {},
						selected: {},
						position: {}
					};

				if (opt.keepStatus) {
					if (pc) {
						pa.store = $.extend(store, pc.store);
					} else if (opt.keepCookie) {
						pa.store = $.extend(store, Factory.getCookieCache(tree));
					}
				}

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
						//是否指定叶子节点类型
						leaf: false,
						//指定叶子节点类型
						leafTypes: [],
						//指定可返回的节点类型
						returnTypes: [],
						//是否动态加载
						dynamic: false,
						//动态加载的数据类型
						dynamicTypes: [],
						//被动态加载的数据类型
						dynamicDatas: [],
						//动态加载的备用数据
						reserveDatas: {},
						//默认值（原始值）
						defaultValues: {
							value: null,
							nodes: []
						},
						//节点类型字典
						trees: {},
						//所有节点
						nodes: {},
						//按类型存储节点
						types: {},
						//按层级存储节点
						levels: [],
						//当前被选中或定位的节点
						current: {
							selected: null,
							position: null,
							checked: {},
						},
						//内部搜索结果
						searches: [],
						//离线存储
						store: store
					}, pa);

					Cache.caches[tid] = pc;
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
			setDragNode: function (tree, node, ev) {
				var obj = node.element.cloneNode(true),
					div = document.createElement('div'),
					pad = $.getPaddingSize(node.element);

				obj.className = 'node-clone';
				div.className= 'oui-tree oui-tree-clone';
				div.appendChild(obj);

				div.style.cssText = [
					'transform:translate3d(-1000px,-1000px,0);'
				].join('');

				document.body.appendChild(div);

				Cache.drags['drag' + tree.id] = {
					node: node,
					clone: div,
					offset: { top: ev.offsetY, left:ev.offsetX - pad.left },
					pos: { top: ev.clientY, left:ev.clientX }
				};

				return this;
			},
			getDragNode: function (tree, node) {
				if (Cache.drags['drag' + tree.id]) {
					return Cache.drags['drag' + tree.id];
				}
				return;
			},
			delDragNode: function (tree) {
				var obj = Cache.drags['drag' + tree.id];
				if (obj) {
					obj.clone.parentNode.removeChild(obj.clone);
					delete Cache.drags['drag' + tree.id];
				}
				return this;
			},
			toArray: function (nodes) {
				var arr = [];
				for (var k in nodes) {
					if (Factory.isNode(nodes[k])) {
						arr.push(nodes[k]);
					}
				}
				return arr;
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
                        key = $.getParam(p, 'key,data,type');
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

				opt.target = $.toElement(opt.target);
				if (!$.isElement(opt.target)) {
					opt.target = undefined;
				}

				if ($.isString(opt.skin, true)) {
					opt.skin = opt.skin.toLowerCase();
				} else {
					//指定默认样式
					opt.skin = Config.GetSkin().split(',')[0];
				}

				opt.switch = $.getParam(opt, 'switchType,switchIcon,switch');
				var sw = (opt.switch || '').toLowerCase();
				if (!$.isString(sw, true) && opt.skin === 'device') {
					sw = 'device';
				}
				opt.switch = $.isString(sw, true) && sw !== 'default' ? '-' + sw : '';

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

				//是否异步加载节点DOM
				opt.async = $.isBoolean(opt.async, true);

				//重新加载时，是否保持节点展开状态
				opt.keepStatus = $.isBoolean($.getParam(opt, 'keepStatus,keep'), false);
				//是否保持节点收缩状态
				opt.keepCollapse = $.isBoolean($.getParam(opt, 'keepCollapse'), false);
				//是否将状态保存到cookie中
				opt.keepCookie = $.isBoolean($.getParam(opt, 'keepCookie,saveCookie,cookie'), false);

				opt.cookieExpire = $.getParam(opt, 'cookieExpire');
				if (!$.isNumber(opt.cookieExpire) || opt.cookieExpire < 0) {
					opt.cookieExpire = Config.CacheCookieExpire;
				}

				opt.showType = $.isBoolean($.getParam(opt, 'showType,showtype'), true);
				opt.showStatus = $.isBoolean($.getParam(opt, 'showStatus,showstatus'), true);
				opt.showLine = $.isBoolean($.getParam(opt, 'showLine,showline'), false);
				opt.showIcon = $.isBoolean($.getParam(opt, 'showIcon,showicon'), true);

				var showCheck = $.getParam(opt, 'showCheck,showcheck,checkbox');
				opt.showCheck = $.isBoolean(showCheck, false) || showCheck === 'checkbox';

				opt.showCount = $.isBoolean($.getParam(opt, 'showCount,showcount'), false);
				opt.showDesc = $.isBoolean($.getParam(opt, 'showDesc,showdesc'), false);

				opt.showButton = $.isBoolean($.getParam(opt, 'showButton,showbutton'), false);
				opt.moveAble = $.isBoolean($.getParam(opt, 'moveAble,moveable'), true);
				opt.showMove = $.isBoolean($.getParam(opt, 'showMove,showmove'), opt.showButton);
				opt.dragAble = $.isBoolean($.getParam(opt, 'dragAble,draggable,dragable'), false);
				opt.dragTypes = Factory.parseArrayParam($.getParam(opt, 'dragTypes,dragType'));
				
				opt.buttonConfig = $.extend({types:[], buttons:[]}, opt.buttonConfig);
				var types = opt.buttonConfig.types, buttons = opt.buttonConfig.buttons;
				if (!$.isArray(types)) {
					types = $.isString(types, true) ? types.split(/[,;|]/) : [types];
					opt.buttonConfig.types = types;
				}

				opt.showInfo = $.isBoolean($.getParam(opt, 'showInfo,showinfo'), false);

				opt.showTitle = $.isBoolean($.getParam(opt, 'showTitle,showtitle'), false);

				opt.showSearch = $.isBoolean($.getParam(opt, 'showSearch,showForm,showsearch'), opt.target ? true : false);
				opt.searchText = $.getParam(opt, 'searchText,searchtext');
				opt.searchPrompt = $.getParam(opt, 'searchPrompt,searchPlaceholder');
				opt.keywordsLength = parseInt($.getParam(opt, 'keywordsLength,searchLength,maxlength'), 10);
				if (isNaN(opt.keywordsLength) && opt.keywordsLength <= 0) {
					opt.keywordsLength = Config.SearchKeywordsLength;
				}
				opt.searchCallback = $.getParam(opt, 'searchCallback');

				opt.statusField = $.getParam(opt, 'statusField', 'status');

				//默认样式时，默认不显示节点类型和状态图标
				//但可以由具体的节点来指定是否显示
				if (Factory.isDefaultSkin(opt.skin)) {
					opt.showType = false;
					opt.showStatus = false;
				}
				//是否级联选中节点
				opt.linkage = $.isBoolean(opt.linkage, true);
				//允许选中的节点最大数量
				opt.maxCount = parseInt('0' + $.getParam(opt, 'maxCount,maxcount'));
				//是否单选
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
				opt.dynamicDatas = Factory.parseArrayParam($.getParam(opt, 'dynamicDatas,dynamicData'));

				opt.loadCount = parseInt($.getParam(opt, 'loadCount,loadcount'), 10);
				if (isNaN(opt.loadCount)) {
					opt.loadCount = 1;
				}
				//是否指定叶子节点类型
				opt.leaf = $.isBoolean(opt.leaf, false);
				opt.leafTypes = Factory.parseArrayParam($.getParam(opt, 'leafTypes,leafType'));

				opt.returnTypes = Factory.parseArrayParam($.getParam(opt, 'returnTypes,returnType'));
				opt.valueFields = Factory.parseArrayParam($.getParam(opt, 'valueFields,valueField'));
				if (opt.valueFields.length <= 0) {
					opt.valueFields.push('id');
				}
				//默认值(原始值)，用于值的还原
				opt.defaultValue = $.getParam(opt, 'defaultValue,originalValue,originValue');

				opt.openTypes = Factory.parseArrayParam($.getParam(opt, 'openTypes,openType'));

				opt.openLevel = parseInt(opt.openLevel, 10);
				if (isNaN(opt.openLevel)) {
					opt.openLevel = -1;
				}

				opt.clickChecked = $.isBoolean($.getParam(opt, 'clickChecked'), false);
				//点击节点时切换节点false-只收缩, undefined-切换
				opt.clickExpand = $.isBoolean($.getParam(opt, 'clickExpand'), false);
				//点击节点时切换的方式，true-只展开，false-只收缩, undefined-切换
				var expanded = $.getParam(opt, 'clickExpanded');
				opt.clickExpanded = $.isBoolean(expanded) ? expanded : undefined;

				var level = $.getParam(opt, 'callbackLevel');
				if ($.isBoolean(level)) {
					level = level ? 1 : 0;
				} else {
					level = parseInt(level);
					if (isNaN(level) || level < 0) {
						level = 0;
					}
				}
				opt.callbackLevel = level;

				opt.showBottom = $.isBoolean($.getParam(opt, 'showBottom,showFoot'), false);
				if (opt.callbackLevel > 0 && opt.target) {
					opt.showBottom = true;
				}
				opt.bottomAlign = $.getParam(opt, 'bottomAlign');
				if (['center', 'left', 'right'].indexOf(opt.bottomAlign) < 0) {
					opt.bottomAlign = 'center';
				}

				//是否显示滚动时的小火箭图标（用于返回顶部）
				opt.showScrollIcon = $.isBoolean($.getParam(opt, 'showScrollIcon,showFireArrow,showReturnTop,fireArrow'), true);

				//默认需要防抖回调
				opt.callbackDebounce = $.isBoolean($.getParam(opt, 'callbackDebounce,debounce'), false);
				opt.debounceDelay = parseInt('0' + $.getParamCon(opt, 'debounceDelay,debouncedelay,delay')) || Config.DebounceDelay;
				opt.debounceTimeout = parseInt('0' + $.getParamCon(opt, 'debounceTimeout,debouncetimeout,timeout')) || Config.DebounceTimeout;

				opt.complete = $.getParam(opt, 'completeCallback,oncomplete,complete');
				opt.callback = $.getParam(opt, 'callback');
				opt.clickCallback = $.getParam(opt, 'clickCallback,onclick');
				opt.expandCallback = $.getParam(opt, 'expandCallback,onexpand');
				opt.checkedCallback = $.getParam(opt, 'checkedCallback,onchecked');
				opt.dblclickCallback = $.getParam(opt, 'dblclickCallback,ondblclick,dblclick');
				opt.contextmenuCallback = $.getParam(opt, 'contextmenuCallback,oncontextmenu,contextmenu');

				opt.buttonCallback = $.getParam(opt, 'buttonCallback,onbutton');

				return opt;
			},
			buildTree: function (id, par) {
				if (Factory.isTree(id)) {
					return id;
				}

				var empty = $.isEmpty(par),
					string = $.isString(id, true) || $.isNumber(id), 
					cache, opt;

				if ($.isObject(id)) {
					opt = $.extend(id, par);
				} else if (string) {
					opt = $.extend({}, par, {id: id});
				} else {
					opt = $.extend({}, par);
				}

				//若par为空，则表示只获取缓存;
				//若id也为空，则表示获取第一个非空的树（缓存）;
				//若id为数字，则按缓存索引获取非空（对应索引或最后一个索引）的树缓存，索引从0开始
				//若都获取不到则创建一个空的树
				//创建空树的目的是为了容错
				if (empty && !(cache = Factory.getTreeCache(opt.id, true))) {
					$.extend(opt, string ? {id: Config.EmptyTreeId} : null);
				} else {
					//判断是否指定ID
					if ($.isUndefinedOrNull(opt.id) || ($.isNumber(opt.id) && !$.isString(opt.id, true))) {
						var elem = opt.target || opt.element;
						//未指定ID，则获取控件元素ID
						if ($.isElement(elem)) {
							opt.id = elem.id;
						} else if ($.isString(elem, true)) {
							opt.id = elem;
						}
					}
				}
				if (cache) {
					//这里获取的树，可能是目标树，也可能是空树
					return cache.tree;
				} else if ((cache = Factory.getTreeCache(opt.id))) {
					return cache.tree.initial(opt);
				} else {
					return Factory.setTreeCache(new Tree(opt), empty).tree;
				}
			},
			buildEvent: function (tree) {
				//var div = tree.target ? tree.element : tree.panel;
				var div = tree.panel;

				$.addListener(div, 'mousedown', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});
				$.addListener(div, 'click', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});
				$.addListener(div,'dblclick', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});
				$.addListener(div, 'contextmenu', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});

				/*用于悬停显示“操作按钮”*/
				$.addListener(div, 'mouseover', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});

				/*用于拖动（同级）节点排序*/
				$.addListener(div, 'dragstart', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});
				$.addListener(div, 'dragover', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});
				$.addListener(div, 'drop', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});
				
				$.addListener(div, 'dragenter', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});
				$.addListener(div, 'dragend', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});
				$.addListener(div, 'dragleave', function(ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});

				$.addListener(div, 'scroll', function (ev) {
					Factory.dealEvent(ev, tree, ev.type);
				});

				return this;
			},
			dealEvent: function (ev, tree, evType, opt) {
				if (!evType && (ev && ev.type)) {
					evType = ev.type;
				}

				var which = ev.which, type = evType.toLowerCase();
				if ((which !== Config.MouseWhichLeft) 
					&& (which !== Config.MouseWhichRight && type === 'contextmenu')) {
					return this;
				}
				var events = [
					'mousedown', 'mouseup', 'click', 'dblclick', 'contextmenu', 
					'mouseover', 'scroll'
				];

				if (events.indexOf(type) > -1) {
					if ($.isFunction(Event[type])) {
						Event[type](ev, tree);
					}
					return this;
				} else if (!tree.options.moveAble || !tree.options.dragAble) {
					return this;
				}

				events = ['dragstart', 'dragover', 'drop', 'dragenter', 'dragleave', 'dragend'];
				if (events.indexOf(type) > -1) {
					if ($.isFunction(Event[type])) {
						Event[type](ev, tree);
					}
				}
				return this;
			},
			setNodeCache: function (tree, node) {
				tree.cache.nodes[node.id] = node;

				if (!tree.cache.types[node.type]) {
					tree.cache.types[node.type] = {};
				}
				tree.cache.types[node.type][node.id] = node;

				if(!tree.cache.levels[node.level]) {
					tree.cache.levels[node.level] = {};
				}
				tree.cache.levels[node.level][node.id] = node;

				tree.cache.level = Math.max(tree.cache.level, node.level);
				tree.cache.count += 1;
				tree.cache.total += 1;
					
				return this;
			},
			deleteNodeCache: function (tree, node) {
				var cache = tree.cache,
					nid = node.id,
					type = node.type, 
					level = node.level;

				//删除levels数据
				if (cache.levels[level] && cache.levels[level][nid]) {
					delete cache.levels[level][nid];
				}
				//删除types数据
				if (cache.types[type] && cache.types[type][nid]) {
					delete cache.types[type][nid];
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
			setStoreCache: function (tree, key, nodes, action) {
				var opt = tree.options;
				if (!opt.keepStatus) {
					return this;
				}
				if (!$.isArray(nodes)) {
					nodes = [nodes];
				}
				var data = tree.cache.store,
					able = $.isBoolean(action, true),
					node, nid, i, c = nodes.length;

				for (i = 0; i < c; i++) {
					nid = nodes[i].id.toString();

					//定位信息只记录最后一个
					if (!data[key] || !$.isObject(data[key]) || key === 'position') {
						data[key] = {};
					}

					if (key === 'expanded' && opt.keepCollapse) {
						data[key][nid] = able ? 1 : 0;
					} else if (able) {
						data[key][nid] = 1;
					} else if (data[key][nid]) {
						delete data[key][nid];
					}
				}
				return this.setCookieCache(tree);
			},
			setCookieCache: function (tree) {
				if (!tree.options.keepCookie) {
					return this;
				}
				//将展开/收缩状态写入cookie保存，只是一个辅助功能，
				//写入cookie相对比较耗时
				//为了防止指展开时循环写入cookie，增加防抖操作
				var key = 'tree_timer_' + tree.id, data;
				if (Cache.timers[key]) {
					window.clearTimeout(Cache.timers[key]);
				}
				Cache.timers[key] = window.setTimeout(function() {
					data = $.toJsonString(tree.cache.store);
					if (data.length > 2) {
						if (Factory.isLocalhost()) {
							$.console.log('setCookieCache:', tree.id, data);
						}
						$.setCookie('TREE_STATUS_' + tree.id, data, tree.options.cookieExpire);
					}
				}, 2000);

				return this;
			},
			getCookieCache: function (tree) {
				var store = {}, data;
				if (tree.options.keepCookie) {
					//从cookie获取的内容格式可能异常，所以需要捕获异常，防止程序异常中断
					//从外部客户端获取的内容，严谨原则来看，都需要经过验证
					try {
						if (data = $.getCookie('TREE_STATUS_' + tree.id)) {
							if (Factory.isLocalhost()) {
								$.console.log('getCookieCache:', tree.id, data);
							}
							store = data.toJson();
						}
					} catch (e) {
						store = {};
						if ($.isLocalhost()) {
							$.console.warn('getCookieCache:', data, e);
						}
					}
				}
				return store;
			},
			setCurrentCache: function (tree, key, nodes, action) {
				if (!$.isArray(nodes)) {
					nodes = [nodes];
				}
				action = $.isBoolean(action, true);

				var data = tree.cache.current,
					node, nid, last, i, c = nodes.length;

				//复选框，可以多选，所以存储的是节点字典
				if (key === 'checked') {
					for (i = 0; i < c; i++) {
						nid = nodes[i].id;
						if (action) {
							data[key][nid] = nodes[i];
						} else if (data[key][nid]) {
							delete data[key][nid];
						}
					}
				}
				//选中状态和位置定位，只能是最后一次点击（或设置），存储的是一个节点
				else if (key.inArray(['selected', 'position'])) {
					if (!(node = nodes[0])) {
						return this;
					}
					if ((last = data[key]) && last !== node && key === 'selected') {
						last.setSelected(false);
					}
					data[key] = action ? node : undefined;
				}
				return this;
			},
			delCurrentCache: function (tree, key) {
				var node, dval, cur = tree.cache.current, k;
				switch(key) {
				case 'position':
					node = cur[key];
					break;
				case 'selected':
					if (node = cur[key]) {
						node.setSelected(false);
					}
					break;
				case 'checked':
					for (k in cur[key]) {
						if (node = cur[key][k]) {
							node.setChecked(false);
						}
					}
					dval = {};
					break;
				}
				if (node) {
					cur[key] = dval;
				}
				return this;
			},
			getNodeValue: function (node, dataKey, nodeType, kv) {
				if (Factory.isNode(node) && (!nodeType || nodeType === node.getType())) {
					kv.key = dataKey;
					switch(dataKey) {
					case 'node':
						kv.val = node;
						break;
					case 'data':
						kv.val = node.getData();
						break;
					case 'value':
					default:
						kv.val = node.getValue();
						break;
					}
					return kv;
				}
				return false;
			},
			isRepeat: function (name) {
				return Cache.events[name] ? true : (Cache.events[name] = true, false);
			},
			setWindowResize: function () {
				if (this.isRepeat('resize')) {
					return this;
				}
				$.addListener(window, 'resize', function (ev) {
					var key = 'oui-win-resize';
					if (Cache.timers[key]) {
						window.clearTimeout(Cache.timers[key]);
					}
					Cache.timers[key] = window.setTimeout(function() {
						for (var i = 0; i < Cache.ids.length; i++) {
							var d = Factory.getTreeCache(Cache.ids[i].id);
							if (d && d.tree) {
								if (d.tree.target) {
									d.tree.hide();
								}
							 	Factory.setPanelSize(d.tree, ev);
							}
						}
					}, 10);
				});
				return this;
			},
			findNodes: function(tree, value) {
				var nodes = [], values = [],
					node, type, nid,
					opt = tree.options,
					cache = tree.cache;

				if ($.isArray(value)) {
					values = value;
				} else if ($.isString(value, true)) {
					values = value.split(/[,|;]/);
				} else {
					values = [value];
				}

				var types = opt.returnTypes;
				if (types.length <= 0) {
					for (var k in cache.types) {
						types.push(k);
					}
				}

				for (var i = 0; i < values.length; i++) {
					for (var j = 0; j < types.length; j++) {
						type = types[j];
						nid = (type ? type + '_' : '') + values[i];
						if (node = cache.nodes[nid]) {
							nodes.push(node);
						}
					}
				}
				return nodes;
			},
			setSearchCache: function (tree, par) {
				var key = 'oui-search-' + tree.id,
					cache = Cache.search[key];

				if (!$.isBoolean(par.search, true)) {
					par.nodes = [];
				}
				Cache.search[key] = $.extend({}, cache, par);
				return this;
			},
			getSearchCache: function (tree) {
				return Cache.search['oui-search-' + tree.id] || {};
			},
			gotoCurent: function (tree) {
				var cache = tree.cache.current,
					opt = tree.options,
					node = cache.selected;

				if (opt.showCheck) {
					var css = 'span.check-true:not(.check-part-true)',
						checks = tree.panel.querySelectorAll(css),
						c = checks.length, i, nid,
						idx = Cache.checks[tree.id] || 0;

					if (idx >= c) {
						idx = 0;
					}
					for (i = idx; i < c; i++) {
						nid = $.getAttribute(checks[i], 'nid');
						if (node = Factory.getNode(tree, nid)) {
							break;
						}
					}
					Cache.checks[tree.id] = idx + 1;
				}
				if (node) {
					node.position();
				}
				return this;
			},
			searchNodes: function (tree, txt, elem) {
				var nodes = [], 
					opt = tree.options,
					cfg = Factory.getSearchCache(tree),
					key = txt.value.trim(), node;

				if (!$.isString(key, true)) {
					Factory.setSearchCache(tree, { key: '', search: false })
						.showSearchPanel(tree, false)
						.gotoCurent(tree);

					$.setElemClass(cfg.no, 'hide', true);

					return this;
				}
				Cache.checks[tree.id] = 0;

				$.setElemClass(cfg.no, 'hide', false);

				if (cfg.key === key) {
					return Factory.showSearchPanel(tree, true);
				}

				var keys = key.split(/[\s,;|]/), c = keys.length, i;

				if ($.isFunction(opt.searchCallback)) {
					opt.searchCallback(tree, keys, function (tree, results) {
						nodes = $.extend([], results);
					});
				} else {
					for (var k in tree.cache.nodes) {
						var n = tree.cache.nodes[k];
						for (i = 0; i < c; i++) {
							if (n.data.name.indexOf(keys[i]) > -1) {
								nodes.push(n);
							}
						}
					}
				}
				Factory.setSearchCache(tree, { key: key, elem: txt, search: true, nodes: nodes });

				return Factory.showSearchResult(tree, nodes, keys);
			},
			buildTargetEvent: function (tree, opt) {
				if (!tree.target) {
					return this;
				}
				if (document.querySelector('#' + tree.bid)) {
					return this;
				}
				if (this.isRepeat('target-event-' + (tree.target.id || tree.id))) {
					return this;
				}
				var elem = tree.target,
					tag = elem.tagName.toLowerCase(),
					type = elem.type.toLowerCase(),
					evName = 'mousedown';

				if (tag !== 'select' && (tag !== 'input' || !type.inArray(['text']))) {
					return this;
				}
				$.addClass(elem, 'oui-tree-elem');

				$.addListener(document, 'mousedown', function (ev) {
					if (!$.isInElement(tree.element, ev) && !$.isInElement(elem, ev)) {
						tree.hide();
					}
					return false;
				});

				if (tag === 'select') {
					$.addListener(elem, 'keydown', function (ev) {
						var kc = $.getKeyCode(ev);
						if (kc.inArray([KC.Enter, KC.Space, KC.Min.Enter])) {
							this.focus();
							$.cancelBubble(ev);
							Factory.setBoxDisplay(tree, null, ev, this);
						} else if (kc.inArray([KC.Tab, KC.Esc])) {
							if(tree.element !== null && tree.element.style.display !== 'none') {
								$.cancelBubble(ev);
							}
							Factory.setBoxDisplay(tree, false, ev, this);
						}
					});
				} else {
					evName = 'focus';
				}
				$.addListener(elem, evName, function (ev) {
					$.cancelBubble(ev);
					Factory.setBoxDisplay(tree, null, ev, this);
					$.hidePopupPanel(tree.element);
				});

				return this;
			},
			setDefaultValue: function (tree, par) {
				if ($.isBoolean(par, false)) {
					var par = Factory.getDefaultValue(tree),
						nodes = $.extend([], par.nodes);

					Factory.showDefaultValue(tree).callback(nodes[0], tree, null, nodes);
				} else {
					$.extend(tree.cache.defaultValues, par);
				}
				return this;
			},
			getDefaultValue: function (tree) {
				return tree.cache.defaultValues;
			},
			showDefaultValue: function (tree) {
				var cache = tree.cache.current,
					nodes = $.extend([], Factory.getDefaultValue(tree).nodes),
					node = nodes[0];

				if (node) {
					node.position(true);
				}
				if (!tree.options.showCheck) {
					return this;
				}
				for (var k in cache.checked) {
					cache.checked[k].check(false);
				}
				for (var i = 0; i < nodes.length; i++) {
					nodes[i].check();
				}
				return this;
			},
			initTargetValue: function (tree) {
				var elem = tree.target;
				if (!$.isElement(elem)) {
					return this;
				}
				if (!elem.tagName.toLowerCase().inArray(['select', 'input'])) {
					return this;
				}
				var val = elem.value.trim(),
					nodes = Factory.findNodes(tree, val);

				if (nodes.length > 0) {
					for (var i = 0; i < nodes.length; i++) {
						nodes[i].setSelected(true).setChecked(true).position();
					}
					Factory.setDefaultValue(tree, {value: val, nodes: nodes});
				}
				return this;
			},
			setTargetValue: function (node, tree, checked, force, nodes) {
				if (!tree.target) {
					return this;
				}
				var opt = tree.options,
					cfg = opt.targetConfig,
					tag = tree.target.tagName.toLowerCase(),
					txt = '', val = '';

				if (!force && opt.callbackLevel && opt.showBottom) {
					return this;
				}

				if (checked) {
					var txts = [], vals = [], i, c;
					if (!$.isArray(nodes)) {
						nodes = Factory.toArray(tree.cache.current.checked);
					}
					for (i = 0, c = nodes.length; i < c; i++) {
						txts.push(nodes[i].getText());
						vals.push(nodes[i].getValue());
					}
					txt = txts.join(cfg.separator || ',');
					val = vals.join(',');
				} else if (node) {
					txt = node.getText();
					val = node.getValue();
				}

				switch(tag) {
				case 'select':
					tree.target.options.length = 0;
					tree.target.options.add(new Option(txt, val));
					break;
				case 'input':
					tree.target.value = val;
					break;
				}

				$.trigger(tree.target, 'change');

				tree.target.focus();

				return this;
			},
			setBoxDisplay: function (tree, show, ev, elem) {
				if (!tree.target) {
					return this;
				}
				var box = document.querySelector('#' + tree.bid),
					first = !box,
					display = first;

				if (!box) {
					if (!$.isBoolean(show, true)) {
						return this;
					}
					Factory.buildPanel(tree, tree.options, true);
				} else {
					display = $.isBoolean(show, box.style.display === 'none');
				}

				tree.element.style.display = display ? 'block' : 'none';

				if ($.isElement(elem)) {
					elem.focus();
				} else {
					elem = tree.target;
				}
				$.setClass(elem, 'oui-tree-elem-cur', display);

				if (!display) {
					$.removeClass(elem, 'oui-tree-elem-top,oui-tree-elem-bottom');
					$.removeClass(elem, 'oui-tree-box-top,oui-tree-box-bottom');
				}
				return display ? this.setBoxPosition(tree, first) : this;
			},
			setBoxPosition: function (tree, first) {
				var opt = tree.options,
					cfg = opt.targetConfig,
					obj = tree.target,
					box = tree.element,
					es = $.getOffset(tree.target),
					bs = $.getBodySize(),
					pos = 'bottom',
					p = {
						left: es.left,
						top: es.height + es.top,
						width: es.width,
						height: cfg.height || 400
					};

				if (p.height > bs.height) {
					p.height = bs.height - 6;
				}

				var offset = p.top + p.height - (bs.height + bs.scrollTop);
				//如果选项框位置高度超过窗口高度，则显示在目标控件的上方
				if (offset > 0) {
					p.top = es.top - p.height;
					pos = 'top';

					//如果选项框位置窗口小于滚动高度，需要设置选项框位置和位置偏移
					if (p.top < bs.scrollTop) {
						var whiteSpace = 4;
						//默认显示在目标控件下方，并向上偏移，偏移量即之前超出窗口高度的值
						p.top = es.top + es.height - offset - whiteSpace;
						pos = 'middle';
					}
				}

				switch(pos) {
				case 'bottom':
					$.addClass(obj, 'oui-tree-elem-bottom');
					$.addClass(box, 'oui-tree-box-bottom');
					break;
				case 'top':
					$.addClass(obj, 'oui-tree-elem-top');
					$.addClass(box, 'oui-tree-box-top');
					break;
				default:
					break;
				}

				box.style.cssText = [
					'left:{left}px;top:{top}px;width:{width}px;', 'height:{height}px;'
				].join('').format(p);

				return this.setBoxSize(tree).setPanelSize(tree);
			},
			setBoxSize: function (tree) {
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
			isReturnType: function (tree, type) {
				var types = tree.cache.returnTypes || [];
				return types.length <= 0 || types.indexOf(type) > -1;
			},
			isDynamicData: function (tree, type) {
				return tree.cache.dynamicDatas.indexOf(type) > -1;
			},
			setDynamicData: function (tree, items, par) {
				var i, c = items.length,
					p = $.extend({type: '', ptype: '', iconType: ''}, par),
					datas = tree.cache.reserveDatas,
					pnid, ptype, type, dr;

				for (i = 0; i < c; i++) {
					dr = items[i];
					type = dr.type || p.type;
					ptype = dr.ptype || p.ptype || type;
					pnid =  Factory.buildNodeId(dr.pid, ptype);

					if (!datas[pnid]) {
						datas[pnid] = {
							par: { type: p.type, ptype: p.ptype },
							items: []
						};
					}
					datas[pnid].items.push(dr);
				}

				return this;
			},
			getReserveData: function (tree, node) {
				var pnid = node.id,
					data = tree.cache.reserveDatas[pnid];
				return data || null;
			},
			addDynamicNode: function (tree, node) {
				var data = Factory.getReserveData(tree, node);
				if (!data || data.items.length <= 0) {
					return false;
				}
				return Factory.addNode(tree, data.items, data.par, node), this;
			},
			getPanelClass: function (opt) {
				var css = 'oui-tree';
				if (!Factory.isDefaultSkin(opt.skin)) {
					css += ' oui-tree-';
					css += opt.skin;
				}
				if (opt.showLine) {
					css += ' oui-tree-line';
				}
				return css;
			},
			setPanelClass: function (div, opt) {
				div.className = Factory.getPanelClass(opt);
				return this;
			},
			showReturnTop: function (tree, div, show, top) {
				var btn = div.querySelector('.goto-tree-top');
				if ($.isBoolean(show, true)) {
					if (!btn) {
						btn = document.createElement('span');
						btn.className = 'goto-tree-top';
						div.appendChild(btn);

						$.addListener(btn, 'mousedown', function (ev) {
							div.scrollTop = 0;
						});
						btn.style.display = 'block';
					} else if (btn.style.display === 'none') {
						btn.style.display = 'block';
					}
					if (top) {
						btn.style.top = top + 'px';
					}
				} else if (btn && btn.style.display !== 'none') {
					btn.style.display = 'none';
				}
				return this;
			},
			buildForm: function (tree, box) {
				var opt = tree.options;

				if (!opt.showSearch) {
					return this;
				}
				var div = document.createElement('div'), first = box.childNodes[0];
				div.className = 'form oui-tree-form';
				div.innerHTML = [
					'<input type="text" class="keywords oui-tree-keywords" placeholder="', 
					//opt.searchPrompt || '请输入关键字',
					opt.searchPrompt || '\u8bf7\u8f93\u5165\u5173\u952e\u5b57',
					'" maxlength="', opt.keywordsLength, '" />',
					//搜索
					//'<a class="search oui-tree-search" title="', opt.searchText || '\u641c\u7d22', '"></a>',
					//查找
					'<a class="btn btn-search oui-tree-search" title="', opt.searchText || '\u67e5\u627e', '"></a>',
					//取消
					'<a class="btn btn-cancel oui-tree-cancel hide" title="', '\u53d6\u6d88', '"></a>'
				].join('');

				if (first) {
					box.insertBefore(div, first);
				} else {
					box.appendChild(div);
				}

				var txt = box.querySelector('input.keywords'),
					btn = box.querySelector('a.btn-search'),
					no = box.querySelector('a.btn-cancel');

				$.addListener(btn, 'mousedown', function(ev) {
					Factory.searchNodes(tree, txt, this);
				});
				$.addListener(no, 'mousedown', function(ev) {
					Factory.showSearchPanel(tree, false, true);
					txt.value = '';
					$.setElemClass(no, 'hide', true);
				});
				
				$.addListener(txt, 'mousedown', function(ev) {
					Factory.showSearchPanel(tree, true);
				});
				$.addListener(txt, 'keyup', function(ev) {
					var kc = $.getKeyCode(ev);
					if (kc === KC.Enter) {
						Factory.searchNodes(tree, txt, this);
					}
				});
				$.addListener(txt, 'blur', function(ev) {
					if (txt.value.trim()) {
						$.setElemClass(no, 'hide', false);
					} else {
						$.setElemClass(no, 'hide', true);
					}
				});

				Factory.setSearchCache(tree, { form: div, elem: txt, btn: btn, no: no });

				return this;
			},
			showSearchForm: function (tree) {
				var opt = tree.options,
					cfg = Factory.getSearchCache(tree);

				if (opt.showSearch) {
					if (!cfg.form) {
						Factory.buildForm(tree, tree.box);
					} else if (cfg.form.style.display === 'none') {
						cfg.form.style.display = 'block';
					}
				} else if (cfg.form) {
					cfg.form.style.display = 'none';
					Factory.showSearchPanel(tree, false ,true);
				}

				Factory.setPanelSize(tree, null, true);

				return this;
			},
			buildBottomForm: function (tree, box) {
				var opt = tree.options;
				if (!opt.showBottom) {
					return this;
				}
				var div = document.createElement('div');
				div.className = 'bottom oui-tree-bottom';
				div.style.cssText = ['text-align:', opt.bottomAlign, ';'].join('');

				div.innerHTML = [
					'<a class="btn btn-return btn-primary">\u786e\u5b9a</a>',	//确定
					'<a class="btn btn-cancel">\u53d6\u6d88</a>',				//取消
					'<a class="btn btn-origin">\u8fd8\u539f</a>'				//还原
				].join('');

				box.appendChild(tree.bottom = div);

				$.addListener(div, 'click', function (ev) {
					Event.buttonClick(ev, tree);
				});

				return this;
			},
			showBottomForm: function (tree) {
				var opt = tree.options,
					show = opt.showBottom,
					bar = tree.bottom;

				if (show) {
					if (!bar) {
						Factory.buildBottomForm(tree, tree.box);
					} else {
						bar.style.cssText = [
							'display:block;', 'text-align:', opt.bottomAlign, ';'
						].join('');
					}
				} else if (bar && bar.style.display !== 'none') {
					bar.style.display = 'none';
				}

				return this;
			},
			showSearchPanel: function (tree, show, force) {
				if (!tree.box || (!force && !tree.options.showSearch)) {
					return this;
				}
				var cfg = Factory.getSearchCache(tree),
					div = tree.box.querySelector('div.search-result-panel');

				if (!div) {
					return this;
				} else if (!cfg.search) {
					show = false;
				}
				if (!$.isBoolean(show, true) && force) {
					if (cfg && cfg.elem) {
						cfg.elem.value = '';
						$.setElemClass(cfg.no, 'hide', true);
					}
					Factory.setSearchCache(tree, { search: false, key: '' });
				}
				var display = $.isBoolean(show, div.style.display === 'none');
				div.style.display = display ? 'block' : 'none';

				if (display && cfg.elem) {
					div.style.width = cfg.elem.offsetWidth + 'px';
					$.setElemClass(cfg.elem, 'keywords-popup', true);
				} else {
					$.setElemClass(cfg.elem, 'keywords-popup', false);
				}
				return this;
			},
			showSearchResult: function (tree, nodes, keys) {
				var div = tree.box.querySelector('div.search-result-panel'),
					show = nodes ? true : undefined, elems,
					i, c = nodes.length, node, text, html = [];

				if (!div) {
					div = document.createElement('div');
					div.className = 'search-result-panel';
					div.innerHTML = [
						'<div class="search-title">',
						'<span class="ots-title"></span>',
						'<span class="ots-close">\u5173\u95ed</span>',		//关闭
						'</div>',
						'<div class="search-list"></div>'
					].join('');

					elems = div.childNodes;
					Factory.setSearchCache(tree, { title: elems[0], panel: elems[1] });

					$.addListener(elems[0].childNodes[1], 'click', function(ev) {
						Factory.showSearchPanel(tree, false);
					});

					tree.box.appendChild(div);

					$.addListener(div, 'mouseup,dblclick', function (ev) {
						var elem = ev.target, tag = elem.tagName.toLowerCase(), nid, node;
						if (tag != 'li' && elem.parentNode) {
							elem = elem.parentNode;
						}
						if (nid = $.getAttribute(elem, 'nid')) {
							if (node = Factory.getNodeCache(tree, nid)) {
								node.position().select();
								if (ev.type === 'dblclick') {
									Factory.showSearchPanel(tree, false);
								}
							}
						}
					});
				}
				var cache = Factory.getSearchCache(tree), css = [],
					skin = !Factory.isDefaultSkin(tree.options.skin);
				if (cache.elem) {
					div.style.width = cache.elem.offsetWidth + 'px';
				}
				html.push('<ul>');
				for (var i = 0; i < c; i++) {
					node = nodes[i], css = ['icon'];
					text = (node.data.name || node.data.text).toString();
					if (skin && node.type) {
						css.push(node.type);
					} else if (node.isLeaf()) {
						css.push('icon-page');
					}
					html.push([
						'<li nid="', node.id, '" title="', text.escapeHtml(), '">',
						'<span class="', css.join(' '), '"></span>',
						text.replaceKeys(keys, '<b>', '</b>'),
						'</li>'
					].join(''));
				}
				html.push('</ul>');

				Factory.setSearchCache(tree, { search: true });

				var height = c * Config.SearchResultItemHeight + Config.SearchResultTitleHeight + 2,
					//title = c > 0 ? '找到<b>' + c + '</b>个结果' : '没有找到结果',
					title = c > 0 ? 
						'\u627e\u5230<b>' + c + '</b>\u4e2a\u7ed3\u679c' 
						: '\u6ca1\u6709\u627e\u5230\u7ed3\u679c',
					max = Config.SearchResultBoxHeight,
					panelHeight = tree.panel.offsetHeight,
					display = $.isBoolean(show, div.style.display === 'none');

				if (height > max) {
					height = max;
				} else if (height > panelHeight) {
					height = panelHeight;
				}

				div.style.height = height + 'px';
				elems = div.childNodes;
				elems[1].style.height = (height - Config.SearchResultTitleHeight) + 'px';

				cache.title.childNodes[0].innerHTML = title;
				cache.panel.innerHTML = c > 0 ? html.join('') : '';

				return Factory.showSearchPanel(tree, display);
			},
			setPanelSize: function (tree, ev, force) {
				if (!force && (!tree.panel || !tree.options.showSearch)) {
					return this;
				}
				if (!ev) {
					_resize();
				} else {
					$.debounce({
						id: 'oui-resize' + tree.id,
						delay: 100,
						timeout: 5000
					}, function() {
						_resize();
					});
				}
				function _resize() {
					var dh = $.getOffset(tree.box).height,
						opt = tree.options,
						form = tree.box.querySelector('div.form'),
						bottom = tree.box.querySelector('div.bottom'),
						fh = opt.showSearch && form ? form.offsetHeight : 0,
						bh = opt.showBottom && bottom ? bottom.offsetHeight : 0,
						ph = dh - fh - bh,
						cache = Factory.getSearchCache(tree);

					if (ph !== dh) {
						tree.panel.style.cssText = ['height:', ph, 'px;'].join('');
					}
					if (cache && cache.elem) {
						cache.elem.style.width = (form.offsetWidth - 8) + 'px';
					}
				}

				return this;
			},
			buildPanel: function (tree, par, initial) {
				var that = tree,
					opt = that.options,
					cache = that.cache,
					css = ['oui-tree-box'], tag,
					box = document.querySelector('#' + that.bid),
					div = document.querySelector('#' + that.tid);

				cache.start = new Date().getTime();

				if (!box) {
					that.box = box = document.createElement('div');
					box.id = that.bid;

					Factory.buildForm(that, box);

					if ($.isElement(opt.target)) {
						css.push('oui-tree-popup');
						css.push(Config.CloseLinkageClassName);

						that.element = box;
						document.body.appendChild(box);
					} else {						
						that.element.appendChild(box);
					}
					box.className = css.join(' ');
				}

				if (!div) {
					that.panel = div = document.createElement('div');
					div.id = that.tid;
					box.appendChild(div);
					Factory.buildEvent(tree);
				} else {
					div.innerHTML = '';
				}

				tag = that.element.tagName.toLowerCase();

				if (opt.trigger || tag.inArray(['input', 'select', 'button', 'a'])) {
					var events = $.isBoolean(opt.trigger) ? ['mousedown'] : opt.trigger.split(/[,;|]/);
					for (var i = 0; i < events.length; i++) {
						$.addListener(that.element, events[i], function(ev) {
							tree.display();
						});
					}
				} else {
					if (opt.async) {
						window.setTimeout(function() {
							Factory.buildNode(tree, opt);
						}, 1);
					} else {
						Factory.buildNode(tree, opt);
					}
				}

				Factory.showSearchForm(tree).showBottomForm(tree)
					.setPanelClass(div, opt).setPanelSize(that);

				return this;
			},
			buildRootNode: function (tree, root, elem, fragment) {
				var node = new Node({
					tree: tree,
					root: root || false,
					element: elem || tree.panel,
					fragment: fragment || $.createFragment()
				});
				return node;
			},
			buildNode: function (tree, opt) {
				var cache = tree.cache,
					root = Factory.buildRootNode(tree, true);

				cache.begin = new Date().getTime();
				cache.count = 0;

				if (!opt.data || (!$.isArray(opt.data) && !$.isObject(opt.data))) {
					if ($.isFunction(opt.data)) {
						var func = function (data) {
							if ($.isArray(data) || $.isObject(data)) {
								_build(opt, data);
							}
						};
						if (Factory.isPromise()) {
							new Promise(function (resolve, reject) { opt.data(func); });
						} else {
							window.setTimeout(function() { opt.data(func); }, 1);
						}
					}
					return this;
				} else {
					_build(opt, opt.data);
				}

				function _build (opt, data) {
					if ($.isArray(data)) {
						Factory.buildItem(tree, root, data);
					} else {
						//数据结构注解，用于多种类型节点
						var dts = opt.trees, p = {};

						if (dts.length > 0 && dts[0]) {
							var list = [], t, k;
							//遍历数据结构注解，并按顺序指定上下级关系
							for (k = 0; k < dts.length; k++) {
								t = dts[k];
								list = data[t.key];
								p = {type: t.type, ptype: t.ptype, iconType: t.icon || t.type};
								if ($.isArray(list)) {
									if (Factory.isDynamicData(tree, p.type)) {
										Factory.setDynamicData(tree, list, p);
									} else {
										Factory.buildItem(tree, root, list, p);
									}
								}
							}
						} else {
							//遍历参数字段，并获取第1个数组字段
							for (var k in data) {
								if ($.isArray(data[k])) {
									Factory.buildItem(tree, root, data[k]);
									break;
								}
							}
						}
					}
					Factory.initStatus(tree, true);

					tree.panel.appendChild(root.fragment);
					delete root.fragment;

					//DOM定位需要DOM渲染之后
					Factory.keepStatus(tree, true);

					cache.finish = new Date().getTime();
					cache.timeout = cache.finish - cache.start;

					if (Factory.isLocalhost()) {
						$.console.log('buildNode:', tree.id, [
							'nodes:', cache.count, ', level:', cache.level, ', timeout:', cache.timeout, 'ms'
						].join(''));
					}
					Factory.initTargetValue(tree).completeCallback(tree);
				}
				
				return this;
			},
			reloadNode: function (tree) {
				//仅用于data为function，即动态加载数据
				if ($.isFunction(tree.options.data)) {
					Factory.initCache(tree, true).buildPanel(tree, {}, true);
				}
				return this;
			},
			addNode: function (tree, items, par, dest, insert) {
				var p = $.extend({}, par),
					root = Factory.buildRootNode(tree),
					nodes = [],
					fragment;

				if (!items || !$.isArray(items)) {
					return this;
				}
				
				if (Factory.isNode(dest) && dest.tree === tree) {
					fragment = $.createFragment();
					Factory.buildItem(tree, root, items, p, nodes, fragment).initStatus(tree, false, nodes);
					if (insert) {
						var sibling = dest, parent = dest;
						parent.childbox.insertBefore(fragment, sibling);
					} else {
						dest.childbox.appendChild(fragment);
					}
				} else {
					var data = _filter(tree, items, p), dr;
					for (var k in data) {
						dr = data[k];
						nodes = [];
						fragment = dr.items.length > 3 ? $.createFragment() : null;
						
						Factory.buildItem(tree, root, dr.items, p, nodes, fragment).initStatus(tree, false, nodes);

						if (fragment) {
							dr.pnode.childbox.appendChild(fragment);
						}
					}
				}
				function _filter (tree, items, p) {
					var dic = {}, d, i, c = items.length, pnid, node;
					for (i = 0; i < c; i++) {
						d = items[i];
						pnid = Factory.buildNodeId(d.pid, (d.ptype || p.ptype));
						if (node = tree.cache.nodes[pnid]) {
							dic[pnid] = dic[pnid] || { pnid: pnid, pnode: node, items:[] };
							dic[pnid].items.push(d);
						} else {
							//没有找到上级节点
							//TODO:
						}
					}
					return dic;
				}
				return this;
			},
			getChildIndex: function (parent, nodes) {
				var m = parent.childs.length,
					n = nodes.length,
					indexs = [], i, j, c;

				for (i = 0; i < m; i++) {
					for (j = 0; j < n; j++) {
						if (parent.childs[i].id === nodes[j].id) {
							indexs[j] = i;
							c++;
						}
					}
					if (c >= n) {
						break;
					}
				}
				return indexs;
			},
			moveNode: function (tree, node, dest, sibling) {
				var src = node.parent;
				if (Factory.isNode(dest) && node !== dest) {
					if (src !== dest) {
						dest.addChild(node, sibling).setSwitchClass();
						node.setParent(dest).updateLevel(dest.getLevel() + 1);
						src.deleteChildData(node).setBoxDisplay().setSwitchClass().updateCount();
						src.setChildSwitchClass();
						dest.setChildSwitchClass();
					} else if (Factory.isNode(sibling) && !sibling.root) {
						dest.childbox.insertBefore(node.element, sibling.element);
						dest.setChild(node, sibling, 2);
						src.setChildSwitchClass();
					}
				}
				return this;
			},
			changeNodePos: function (tree, node, sibling, drag, callback) {
				var nodes = [node], num = $.isNumber(sibling), obj = Factory.isNode(sibling);
				if (!Factory.isNode(node)
					|| (obj && (node === obj || node.parent !== sibling.parent))
					|| (num && !sibling)) {
					return this;
				}
				if (obj) {
					nodes.push(sibling);
				} else if (num) {
					num = sibling;
					sibling = undefined;
				}
				var parent = node.parent, c = parent.childs.length,
					indexs = Factory.getChildIndex(parent, nodes),
					src = indexs[0], dest = num ? src + num : indexs[1],
					down = drag || num ? src < dest : false;

				if (src < 0 || dest < 0 || src === dest || dest >= c) {
					return this;
				}
				sibling = down ? parent.childs[dest + 1] : sibling || parent.childs[dest];

				if (sibling) {
					parent.childbox.insertBefore(node.element, sibling.element);
				} else {
					parent.childbox.appendChild(node.element);
				}
				parent.childs.splice(src, 1);
				parent.childs.splice(dest, 0, node);

				parent.setChildSwitchClass();

				function _callback(node, num, idx) {
					if ($.isFunction(callback)) {
						callback(node, num, idx);
					}
				}
				return _callback(node, num, dest), this;
			},
			updateLevelCache: function (tree, node, srcLevel) {
				var dest = node.getLevel(),
					src = srcLevel,
					nid = node.id,
					cache = tree.cache.levels;

				if (dest === src) {
					return this;
				}
				if (cache[src] && cache[src][nid]) {
					delete cache[src][nid];
				}
				if (!cache[dest]) {
					cache[dest] = {};
				}
				cache[dest][nid] = node;

				return this;
			},
			buildButton: function (tree, node) {
				var opt = tree.options;
				if (!opt.showButton) {
					return this;
				}
				var box = node.getItem('button');
				if (!box || box.childNodes[0]) {
					return this;
				}
				var cfg = opt.buttonConfig, p = {nid: node.id};
				if (cfg.types.length > 0 && cfg.types.indexOf(node.type) < 0) {
					return this;
				}
				var html = [
					'<a class="btn btn-add" key="add" nid="', p.nid, '" title="', Config.Lang.Add, '"></a>',
					'<a class="btn btn-edit" key="edit" nid="', p.nid, '" title="', Config.Lang.Edit, '"></a>',
					'<a class="btn btn-del" key="del" nid="', p.nid, '" title="', Config.Lang.Del, '"></a>',
					opt.showMove ? [
						'<a class="btn btn-up" key="up" nid="', p.nid, '" title="', Config.Lang.Up, '"></a>',
						'<a class="btn btn-down" key="down" nid="', p.nid, '" title="', Config.Lang.Down, '"></a>',
					].join('') : ''
				];
				box.innerHTML = html.join('');

				return this;
			},
			buildInfo: function (tree, p, opt) {
				var html = [];
				if (opt.showInfo) {
					html = [
						'<span class="info" id="', p.id, '_info', '" nid="', p.nid, '">',
						//'类型：', p.type, ' 编号：', dr.code, 
						'</span>'
					];
				}
				return html;
			},
			buildUl: function (tree, p, isRoot, displayNone) {
				var ul = p.pnode.getBox(), css = [];
				if (ul) {
					return ul;
				}
				ul = document.createElement('UL');
				var css = [
					'level' + (isRoot ? 'root' : p.pnode.level), 'box', p.ptype ? 'box-' + p.ptype : ''
				];
				if ((!isRoot && !p.pnode.expanded) || displayNone) {
					css.push('hide');
				}

				ul.className = css.join(' ');
				ul.setAttribute('nid', p.pnid);
				//ul.id = (p.pid + '_box');
				
				return ul;
			},
			buildLi: function (tree, p, node, opt) {
				var li = document.createElement('LI');
				li.className = ('node level' + p.level);
				li.setAttribute('nid', p.nid);

				if (opt.dragAble && Factory.isDragType(opt, p.type)) {
					li.draggable = true;
				}
				var hide = ' style="display:none;"',
					title = opt.showTitle && p.text.length > Config.TitleTextLength ? ' title="' + p.text + '"' : '',
					check = opt.showCheck ? [
						'<span class="check" nid="', p.nid, '"></span>',
					] : [],
					icon = opt.showIcon ? [
						'<span class="', node.getIconClass(), '" nid="', p.nid, '"', '></span>'
					] : [],
					count = opt.showCount ? [
						'<span class="count" nid="', p.nid, '"></span>'
					] : [],
					desc = opt.showDesc ? [
						'<span class="desc" nid="', p.nid, '">', 
						p.desc ? '<b>' + p.desc + '</b>' : '', 
						'</span>'
					] : [],
					button = opt.showButton ? [
						'<div class="button" nid="', p.nid, '"></div>'
					] : [],
					info = Factory.buildInfo(tree, p, opt),
					html = [
						'<div class="item" nid="', p.nid, '">',
						'<span class="', node.getSwitchClass(true), '" nid="', p.nid, '"></span>'
					].concat(icon).concat(check).concat([
						'<a class="name" nid="', p.nid, '"', title, '>',
						'<span class="text" nid="', p.nid, '">', p.text, '</span>'
					]).concat(count).concat(desc).concat([
						'</a>'
					]).concat(button).concat(info).concat([
						'</div>'
					]);

				li.innerHTML = html.join('');

				return li;
			},
			isDragType: function (opt, type) {
				if (opt.dragTypes.length <= 0) {
					return true;
				}
				return opt.dragTypes.indexOf(type) > -1;
			},
			isNodeBody: function (par) {
				return par.tag.inArray(['a', 'span']) && par.css.inArray(['icon', 'name', 'text', 'count', 'desc']);
			},
			isNodeText: function (par) {
				return par.tag.inArray(['a', 'span']) && par.css.inArray(['name', 'text', 'count', 'desc']);
			},
			isNodeSwitch: function (par) {
				return par.tag.inArray(['span']) && par.css.inArray(['switch']);
			},
			buildItem: function (tree, root, list, arg, nodes, fragment) {
				var tid = tree.id,
					opt = tree.options,
					par = $.extend({type: '', ptype: '', iconType: ''}, arg);

				if (!$.isArray(list) || list.length <= 0) {
					return this;
				}
				var i, d, type, ptype, iconType, nid, pnid, text, desc, p, node, 
					showStatus, showType;

				for (i = 0; i < list.length; i++) {
					if (typeof (d = list[i]).id === 'undefined') {
						continue;
					}
					type = d.type || par.type;
					ptype = d.ptype || par.ptype || type;
					iconType = d.iconType || par.iconType || type;
					nid = Factory.buildNodeId(d.id, type);
					pnid = Factory.buildNodeId(d.pid, ptype);
					text = d.name || '',
					desc = d.desc || '',
					p = {
						data: d, text: text.toString().escapeHtml(),
						nid: nid, pnid: pnid, type: type, ptype: ptype,
						id: Factory.buildElemId(tid, nid),
						pid: Factory.buildElemId(tid, pnid),
						//desc: desc.toString().escapeHtml(),
						desc: [desc.toString().escapeHtml(), opt.debug ? nid : ''].join(' '),
						pnode: tree.cache.nodes[pnid],
						expanded: false
					};
					showStatus = $.isBooleans([d.showStatus, opt.showStatus], false);
					showType = $.isBooleans([d.showType, opt.showType], false);

					if (showStatus && !$.isUndefined(d.status)) {
						d.icon = $.extend({}, {status: d[opt.statusField] ? 'on' : 'off'}, d.icon);
					}
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
						icon: $.extend({ type: iconType }, d.icon),
						showStatus: showStatus,
						showType: showType,
						expandCallback: d.expandCallback
					});

					node.setParent(p.pnode.setBox(Factory.buildUl(tree, p, p.root)))
						.setParam('element', Factory.buildLi(tree, p, node, opt));
					
					if (p.pnode) {
						p.pnode.addChild(node, null, fragment);
					}

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
					var expanded = false;

					if (!node.hasChild()) {
						//node.setParam('expanded', false);

						//动态加载子节点，先创建子节点容器
						if (node.dynamic) {
							node.setBox(node.buildBox());
						}

						//(动态加载 或者 已展开)，需要设置节点展开状态
						//目的是为了收缩或隐藏节点“展开/收缩”图标
						if (node.dynamic || node.isExpanded()) {
							node.setExpandStatus(expanded = true);
						}
					}
					if (!expanded) {
						node.setExpandStatus(true);
					}
					if (!initial) {
						if (node.parent && !dic[node.parent.id]) {
							node.parent.setExpandStatus(false);
							dic[node.parent.id] = 1;
						}
					}
				}

				return this.keepStatus(tree, false);
			},
			keepStatus: function (tree, isPosition) {
				if (!tree.options.keepStatus) {
					return this;
				}
				var nodes = tree.cache.nodes,
					store = tree.cache.store,
					keys = isPosition ? ['position'] : ['expanded', 'selected'],
					func = isPosition ? ['position'] : ['setExpand', 'setSelected'],
					dic, action, node;

				for (var i = 0; i < keys.length; i++) {
					dic = store[keys[i]];
					if (dic && $.isObject(dic)) {
						for (var nid in dic) {
							action = dic[nid] === 1 ? true : false;
							if (node = nodes[nid]) {
								//状态保持时模拟点击事件，以加载之前已经加载的动态节点
								node[func[i]](action, {target:'keep'});
							}
						}
					}
				}
				return this;
			},
			eachNodeIds: function (nodes, nodeIds, funcName, arg0, arg1, arg2, arg3) {
				if (!$.isArray(nodeIds)) {
					nodeIds = $.isString(nodeIds) ? nodeIds.split(/[,;|]/) : [nodeIds];
				}
				var i, c = nodeIds.length, nid, node;
				for (i = 0; i < c; i++) {
					nid = Factory.isNode(nodeIds[i]) ? nodeIds[i].id : Factory.buildNodeId(nodeIds[i]);
					if (node = nodes[nid]) {
						//如果直接回调，则返回节点以及当前索引和当前节点数量
						if ($.isFunction(funcName)) {
							funcName(node, i, c);
						} else if ($.isFunction(node[funcName])) {
							node[funcName](arg0, arg1, arg2, arg3);
						}
					}
				}
				return this;
			},
			callNodeFunc: function (nodes, nodeId, funcName, arg0, arg1, arg2, arg3) {
				if ($.isArray(nodeId)) {
					nodeId = nodeId[0];
				}
				var node, nid = Factory.isNode(nodeId) ? nodeId.id : Factory.buildNodeId(nodeId);
				if ((node = nodes[nid]) && $.isFunction(node[funcName])) {
					node[funcName](arg0, arg1, arg2, arg3);
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
				if (!Factory.isNode(node)) {
					return this;
				}
				return node.expand(linkage), this;
			},
			expandToNode: function (tree, node) {
				return Factory.expandNode(tree, node, true);
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
				var j, c = nodes.length, node, k;
				for (k in nodes) {
					if ((node = nodes[k]) && !node.isLeaf()) {
						node.setExpand(expand);
					}
				}
				return this;
			},
			//reverse: 是否反转操作
			//反转的意思是：如果展开到2级节点，则2级以下（大于2级）的节点全部收缩
			expandLevel: function (tree, levels, linkage, reverse, expand) {
				var i, j, c, cur, n, nc = tree.cache.levels.length;

				levels = $.toIdList(Factory.parseArrayParam(levels), 0);
				linkage = $.isBoolean(linkage, false);
				expand = $.isBoolean(expand, true);
				reverse = $.isBoolean(reverse, false);
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
					if (reverse) {
						j = expand ? cur + 1 : 0;
						c = expand ? nc : cur;
						for (j; j < c; j++) {
							Factory.expandEach(tree.cache.levels[j], !expand, true);
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
			expandToLevel: function (tree, levels, reverse) {
				return Factory.expandLevel(tree, levels, true, reverse, true);
			},
			collapseLevel: function (tree, levels, linkage, reverse) {
				return Factory.expandLevel(tree, levels, linkage, reverse, false);
			},
			collapseToLevel: function (tree, levels, reverse) {
				return Factory.expandLevel(tree, levels, true, reverse, false);
			},
			expandAll: function (tree, expand) {
				window.setTimeout(function() {
					if (Factory.isLocalhost()) {
						$.console.log('expandAll:', 0, tree.id, expand);
					}
					var	i, j, c = tree.cache.levels.length,
						expanded = $.isBoolean(expand, true);

					//收缩:从最顶层开始; 展开:从最低层开始
					for (i = 0; i < c; i++) {
						j = expanded ? c - i - 1 : i;
						Factory.expandEach(tree.cache.levels[j], expanded);
					}
					if (Factory.isLocalhost()) {
						$.console.log('expandAll:', 1, tree.id, expand);
					}
				}, 1);
				return this;
			},
			collapseAll: function (tree) {
				return Factory.expandAll(tree, false);
			},
			debounceCallback: function (callback, node, tree, ev, nodes) {
				if (tree.options.callbackDebounce) {
					$.debounce({
						id: 'otree-callback-' + tree.id,
						delay: tree.options.debounceDelay,
						timeout: tree.options.debounceTimeout
					}, function() {
						callback(node, tree, ev, nodes);
					});
				} else if (Factory.isPromise()) {
					new Promise(function (resolve, reject) {
						callback(node, tree, ev, nodes);
					});
				} else {
					window.setTimeout(function() {
						callback(node, tree, ev, nodes);
					}, 1);
				}
				return this;
			},
			callback: function (node, tree, ev, nodes) {
				var checked = tree.options.showCheck,
					force = true;

				if (!$.isArray(nodes) && checked) {
					nodes = Factory.toArray(tree.cache.current.checked);
				}

				if (node === null) {
					node = tree.cache.current.selected;
				}

				if (node && tree.target) {
					Factory.setTargetValue(node, tree, checked, force, nodes);
				}
				if ($.isFunction(tree.options.callback)) {
					Factory.debounceCallback(tree.options.callback, node, tree, ev, nodes);
				}
				return this;
			},
			completeCallback: function (tree) {
				if ($.isFunction(tree.options.complete)) {
					tree.options.complete(tree);
				}
				return this;
			},
			expandCallback: function (node, tree, func) {
				var callback = tree.options.expandCallback;
				if ($.isFunction(node.expandCallback)) {
					callback = node.expandCallback;
				}
				if ($.isFunction(callback)) {
					if ($.isFunction(func) && Factory.isPromise()) {
						new Promise(function (resolve, reject) {
							callback(node, tree, func);
						});
					} else {
						window.setTimeout(function() {
							callback(node, tree, func);
						}, 1);
					}
				}
				return this;
			},
			checkedCallback: function (node, tree, ev) {
				if (tree.options.callbackLevel) {
					return this;
				}
				var callback = tree.options.checkedCallback,
					nodes = Factory.toArray(tree.cache.current.checked);

				if ($.isFunction(node.checkedCallback)) {
					callback = node.checkedCallback;
				}
				if ($.isFunction(callback)) {
					return Factory.debounceCallback(callback, node, tree, ev, nodes);
				}
				return Factory.callback(node, tree, ev);
			},
			clickCallback: function (node, tree, ev) {
				if (tree.options.callbackLevel) {
					return this;
				}
				if ($.isFunction(tree.options.clickCallback)) {
					return Factory.debounceCallback(tree.options.clickCallback, node, tree, ev);
				}
				return Factory.callback(node, tree, ev);
			},
			dblclickCallback: function (node, tree, ev) {
				if (tree.options.callbackLevel) {
					return this;
				}
				if ($.isFunction(tree.options.dblclickCallback)) {
					tree.options.dblclickCallback(node, tree, ev);
				}
				return this;
			},
			contextmenuCallback: function (node, tree, ev) {
				var callback = tree.options.contextmenuCallback;
				if (Factory.isNode(node) && $.isFunction(node.contextmenuCallback)) {
					callback = node.contextmenuCallback;
				}
				if ($.isFunction(callback)) {
					$.cancelBubble(ev);
					callback(node, tree, ev);
				}
				return this;
			},
			buttonCallback: function (node, tree, ev, btnKey) {
				if ($.isFunction(tree.options.buttonCallback)) {
					tree.options.buttonCallback(node, tree, ev, btnKey);
				}
				return this;
			}
		};

	//先加载(默认)样式文件
	Factory.loadCss(Config.DefaultSkin);

	//加载指定的(默认)样式文件
	var appointSkin = Config.GetSkin();
	if (!Factory.isDefaultSkin(appointSkin)) {
		Factory.loadCss(appointSkin);
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
		initial: function(par) {
			par = $.extend({}, par);
			var that = this.self();

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
				//子节点数组
				that.childs = [];
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
					.initParam('expanded', par)		//是否展开
					.initParam('checked', par)		//是否选中复选框
					.initParam('selected', par)		//是否选中节点
					.initParam('disabled', par)		//是否禁用节点
					.initParam('parent', par)		//父节点
					.initParam('childbox', par)		//子节点容器DOM元素
					.initParam('showType', par)
					.initParam('showStatus', par);

				var func = par.expandCallback;
				if ($.isFunction(func)) {
					that.expandCallback = func;
				}
				func = par.contextmenuCallback || par.contextmenu;
				if ($.isFunction(func)) {
					that.contextmenuCallback = func;
				}

				if (that.dynamic) {
					//动态加载子节点的次数，0:表示未加载
					that.loaded = 0;
				}
			}
			return that;
		},
		getType: function () {
			return this.self().type;
		},
		getText: function () {
			return this.self().data.name;
		},
		getValue: function () {
			var that = this.self(),
				opt = that.tree.options,
				keys = opt.valueFields,
				i, c = keys.length,
				key, val, rst = {};

			for (i = 0; i < c; i++) {
				key = (keys[i] || '').toString().toLowerCase();
				val = that.data[key];

				if ($.isUndefinedOrNull(val) && key === 'type') {
					val = that[key];
				}

				if (!$.isUndefinedOrNull(val)) {
					rst[key] = val;
				}
			}
			return c <= 1 ? val : rst;
		},
		getData: function () {
			var that = this.self(),
				keys = that.tree.options.valueFields,
				val = that.data;

			if ($.isUndefinedOrNull(val.type) && keys.indexOf('type') > -1 && that.type) {
				val.type = that.type;
			}
			return val;
		},
		initParam: function (key, par) {
			return Factory.initParam.call(this.self(), key, par);
		},
		setParam: function (key, val, strict) {
			return Factory.setParam.call(this.self(), key, val, strict);
		},
		setItem: function (key, elem) {
			return this.self().items[key] = elem, elem;
		},
		getItem: function (key) {
			var that = this.self(), elem;
			if (!that.items) {
				return null;
			} else if (that.items[key]) {
				return that.items[key];
			} else if (that.element) {
				if (elem = that.element.querySelector('.' + key)) {
					that.setItem(key, elem);
					return elem;
				}
			}
			return null;
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
			var that = this.self(),
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
			var that = this.self();
			if (!that.tree.isShowCheck()) {
				return that;
			}
			if (!self) {
				that.setParam('part', false)
					.setParam('checked', checked)
					.setCheckedClass();
			}
			if (!that.hasChild()) {
				return that;
			}
			for (var i = 0, c = that.childs.length; i < c; i++) {
				that.childs[i].setChildChecked(checked);
			}
			return that;
		},
		setChecked: function (checked, ev) {
			var that = this.self();
			if (!that.tree.isShowCheck()) {
				return that;
			}
			//被禁用的节点，不能通过点击选框“选中/取消选中”节点
			//但是可以通过初始化选中节点
			if (that.disabled && ev) {
				return that;
			}
			that.setParam('checked', $.isBoolean(checked, !that.checked))
				.setParam('part', false)
				.setCheckedClass();

			if (that.tree.options.linkage) {
				that.setParentChecked(that.checked).setChildChecked(that.checked, true);
			}

			Factory.checkedCallback(that, that.tree, ev).setTargetValue(that, that.tree, true);

			return that;
		},
		deleteChildData: function (node) {
			var that = this.self(),
				childs = that.childs,
				i = childs.length - 1;

			while(i >= 0) {
				if (childs[i].id === node.id) {
					childs.splice(i, 1);
					break;
				}
				i--;
			}
			if (childs.length <= 0) {
				that.setParam('expanded', false);
			}
			return that;
		},
		eachDeleteChild: function (removeElem) {
			var that = this.self(), c = that.childs.length;
			for (var i = 0; i < c; i++) {
				that.childs[i].delete(removeElem);
			}
			return that;
		},
		deleteChild: function () {
			var that = this.self(), c = that.childs.length;
			for (var i = 0; i < c; i++) {
				that.childs[i].delete();
			}
			that.childs = [];
			return that.checkCollapse();
		},
		delete: function (removeElem) {
			var that = this.self(), parent = that.parent;

			Factory.deleteNodeCache(that.tree, that.eachDeleteChild(false));

			if ($.isBoolean(removeElem, true)) {
				//删除节点DOM元素
				$.removeElement(that.element);
				parent.deleteChildData(that);
				parent.checkCollapse().setChildSwitchClass();
			}
			return that;
		},
		getLevel: function () {
			return this.self().level;
		},
		setLevel: function (level) {
			var that = this.self();
			if ($.isNumber(level) && level >= 0) {
				that.level = level;
			}
			return that;
		},
		updateLevel: function (level) {
			var that = this.self(),
				srcLevel = that.getLevel();

			if (!$.isNumber(level) || level < 0 || srcLevel === level) {
				return that;
			}
			Factory.updateLevelCache(that.tree, that.setLevel(level), srcLevel);

			return that;
		},
		moveChild: function (destNode, insert) {
			var that = this.self(),
				childs = that.childs,
				c = childs.length;

			if (c <= 0) {
				return that;
			}
			while(c > 0) {
				childs[0].move(destNode, insert);
				c--;
			}
			return that.setChildSwitchClass();
		},
		move: function (destNode, insert) {
			var that = this.self(), dest, sibling;
			if (insert) {
				sibling = Factory.getNode(that.tree, destNode);
				if (Factory.isNode(sibling)) {
					dest = sibling.parent;
				}
			} else {
				dest = Factory.getNode(that.tree, destNode);
			}
			return Factory.moveNode(tree, that, dest, sibling), that;
		},
		sortIndex: function (num, callback, defNum) {
			var that = this.self();
			if (!that.tree.options.moveAble) {
				return that;
			}
			if (Factory.isNode(num) || $.isString(num, true)) {
				num = Factory.getNode(that.tree, num);
			} else if (!$.isNumber(num) || !num) {
				num = $.isNumber(defNum) && defNum ? defNum : -1;
			}
			Factory.changeNodePos(that.tree, that, num, false, callback);

			return that;
		},
		sortUp: function (num, callback, defNum) {
			var that = this.self();
			if ($.isFunction(num)) {
				callback = num;
				num = undefined;
			}
			if (!$.isNumber(defNum) || !defNum) {
				defNum = -1;
			}
			return that.sortIndex(num, callback, defNum);
		},
		sortDown: function (num, callback) {
			return this.self().sortUp(num, callback, 1);
		},
		sortNode: function (destNode, callback, drag) {
			var that = this.self();

			if (!that.tree.options.moveAble || !destNode) {
				return that;
			}
			if (Factory.isNode(destNode) || $.isString(destNode, true)) {
				destNode = Factory.getNode(that.tree, destNode);
			}
			Factory.changeNodePos(that.tree, that, destNode, drag, callback);

			return that;
		},
		insert: function (siblingNode) {
			return that.move(siblingNode, true);
		},
		setStoreCache: function (key, node, action) {
			return Factory.setStoreCache(this.tree, key, node, action), this;
		},
		setSelected: function (selected, ev) {
			var that = this.self();
			selected = $.isBoolean(selected, !that.selected);
			if (selected && (that.disabled || !Factory.isReturnType(that.tree, that.type))) {
				return that;
			}
			if (selected) {
				//设置当前选中的节点状态
				Factory.setCurrentCache(that.tree, 'selected', that, selected);

				if (ev && ev.target) {
					Factory.setCurrentCache(that.tree, 'position', that)
						.setStoreCache(that.tree, 'position', that, selected);
				}
			}
			return that.setParam('selected', selected).setSelectedClass()
				.setStoreCache('selected', that, selected);
		},
		setDisabled: function (disabled) {
			var that = this.self();
			return that.setParam('disabled', $.isBoolean(disabled, !that.disabled)).setDisabledClass();
		},
		setParent: function (parentNode) {
			return this.self().setParam('parent', parentNode);
		},
		getBox: function () {
			return this.self().childbox;
		},
		setBox: function (childbox) {
			var that = this.self();
			if (!childbox) {
				return that;
			}
			that[that.root ? 'fragment' : 'element'].appendChild(childbox);
			return that.setParam('childbox', childbox);
		},
		buildBox: function (displayNone) {
			var that = this.self();
			if ($.isElement(that.childbox)) {
				return null;
			}
			return Factory.buildUl(that.tree, {
				pnode: that,
				pid: Factory.buildElemId(that.tree.id, that.id),
				pnid: that.id,
				ptype: that.type
			}, false, displayNone);
		},
		setChild: function (node, sibling, action) {
			var that = this.self(), indexs = [];
			switch(action) {
			case 0: //append
				that.childs.push(node);
				break;
			case 1: //insert
				indexs = Factory.getChildIndex(that, [sibling]);
				that.childs.splice(indexs[0], 0, node);
				break;
			case 2: //move
				indexs = Factory.getChildIndex(that, [node, sibling]);
				that.childs.splice(indexs[0], 1);
				that.childs.splice(indexs[1], 0, node);
				break;
			}
			return that;
		},
		addChild: function (node, sibling, fragment) {
			var that = this.self(), action = 0;
			if (!that.childs) {
				that.childs = [];
			}
			if (!node.element) {
				return that;
			}
			//that.childs.push(node);

			if (fragment) {
				fragment.appendChild(node.element);
			} else {
				if (!that.childbox) {
					that.setBox(that.buildBox(!that.expanded)).setExpand(that.expanded);
				}
				if (Factory.isNode(sibling) && sibling.element) {
					that.childbox.insertBefore(node.element, sibling.element);
					action = 1;
				} else {
					that.childbox.appendChild(node.element);
				}
			}
			return that.setChild(node, sibling, action).updateCount();
		},
		setBoxDisplay: function (display) {
			var that = this.self();
			if (!that.childbox) {
				return that;
			}
			if (!$.isBoolean(display)) {
				display = that.expanded;
			}
			return $.setElemClass(that.childbox, 'hide', !display), that;
		},
		checkCollapse: function () {
			var that = this.self(),
				collapsed = that.childs.length <= 0;

			if (collapsed) {
				that.setParam('expanded', false).setSwitchClass();
			}
			return that;
		},
		setExpand: function (expanded, ev, linkage, callback) {
			var that = this.self(),
				node = that,
				tree = that.tree;

			if (!that.isDynamic() && !that.hasChild()) {
				return _callback(that);
			}
			if ($.isBoolean(expanded) && expanded === that.expanded) {
				return _callback(that);
			}
			if (that.childbox) {
				expanded = $.isBoolean(expanded, !that.expanded);
				//$.setElemClass(that.childbox, 'hide', !expanded);
				that.setBoxDisplay(expanded);

				//动态加载，默认可加载多次，若已加载子节点，则不再动态加载
				if (!linkage && expanded && !that.hasChild() && ev && ev.target) {
					//先添加缓存数据中的动态节点数据
					if (that.loaded < tree.options.loadCount && !Factory.addDynamicNode(tree, that)) {
						//缓存数据中没有节点数据，则回调展开事件，用于获取动态数据
						//并将获取到的数据通过回调函数返回并添加到节点中
						//动态加载的数据需要指定数据类型
						Factory.expandCallback(that, tree, function (items, par) {
							par = $.extend({}, {type:par}, par);
							Factory.addNode(tree, items, $.extend({ptype: node.type}, par), node);
						});
					}
					that.loaded++;
				}
			}
			that.setParam('expanded', expanded).setSwitchClass();

			//鼠标点击的展开/收缩才保存到cookie，如果是模拟的则不保存
			if (ev && ev.target && ev.target.tagName) {
				that.setStoreCache('expanded', that, that.expanded);
			}

			function _callback(that) {
				if ($.isFunction(callback) && that.expanded) {
					callback(that);
				}
				return that;
			}
			return _callback(that);
		},
		expand: function (linkage, callback) {
			var that = this.self(),
				expanded = true;

			that.setExpand(expanded, null, false, callback);

			if (linkage) {
				var n = that, pn;
				//找父节点类型
				while(n && (pn = n.parent) && !pn.root) {
					pn.setExpand(expanded, null, linkage);
					n = pn;
				}
			}
			return that;
		},
		collapse: function () {
			return this.self().setExpand(false);
		},
		position: function (selected) {
			var that = this.self(), offsetY = -50;
			Factory.setCurrentCache(that.tree, 'position', that).expandTo(that.tree, that);
			$.scrollTo(that.element, that.tree.panel, offsetY);
			return selected ? that.setSelected(true) : that;
		},
		select: function (selected) {
			return this.self().setSelected($.isBoolean(selected, true));
		},
		check: function (checked) {
			return this.self().setChecked($.isBoolean(checked, true));
		},
		getIconClass: function () {
			var that = this.self(),
				css = ['icon'],
				opt = that.tree.options,
				open = that.expanded && !that.isLeaf() ? '-open' : '';

			if (that.showType && that.icon.type) {
				if (that.icon.status) {
					css.push(that.icon.type + '-' + that.icon.status + open);
				} else if (open) {
					css.push(that.icon.type + open);
				} else {
					css.push(that.icon.type);
				}
			} else {
				if (that.isLeaf() || (!that.tree.isAppointLeaf() && !that.hasChild())) {
					css.push('icon-page');
				}
				if (open) {
					css.push('icon' + open);
				}
			}
			return css.join(' ');
		},
		getIconStyle: function () {
			var that = this.self(),
				style = [];

			if (that.icon.path) {
				style = ['background:url(\'', that.icon.path, '\') no-repeat center;'];
			}

			return style.join('');
		},
		setIconClass: function () {
			var that = this.self(), icon, style;
			if (that.tree.isShowIcon() && (icon = that.getItem('icon'))) {
				icon.className = that.getIconClass();
				if (style = that.getIconStyle()) {
					icon.style.cssText = style;
				}
			}
			return that;
		},
		setIcon: function (par) {
			var that = this.self();
			return $.extend(that.icon, par), that;
		},
		updateIcon: function (par, linkage) {
			var that = this.self(),
				i, c = that.childs.length;

			if (Factory.isEmpty(par = $.extend({}, par))) {
				return that;
			}

			that.setIcon(par).setIconClass();

			if (linkage && c > 0) {
				for (i = 0; i < c; i++) {
					that.childs[i].setIcon(par).setIconClass();
				}
			}
			return that;
		},
		updateStatus: function (status, linkage) {
			var that = this.self(),
				i, c = that.childs.length,
				par = {status: $.isString(status, true) ? status : status ? 'on' : 'off'};

			return that.updateIcon(par, linkage);
		},
		updateData: function (data) {
			var that = this.self();
			$.extend({}, that.data, data);
			return that;
		},
		updateText: function (str) {
			var that = this.self(), item;
			if ($.isString(str, true) && (item = that.getItem('text'))) {
				item.innerHTML = str;
			}
			return that;
		},
		updateDesc: function (str) {
			var that = this.self(), item;
			if (item = that.getItem('desc')) {
				item.innerHTML = str || '';
			}
			return that;
		},
		updateCount: function (count) {
			var that = this.self(),
				dr = that.data || {},
				item, c, str;
				
			if (!that.tree.options.showCount) {
				return that;
			}
			if ($.isNumber(c = count)) {
				str = '<b>(' + c + ')</b>';
				if (item = that.getItem('count')) {
					item.innerHTML = str;
				}
			} else {
				if ($.isNumber(dr.count)) {
					c = dr.count < 0 ? 0 : dr.count;
				} else {
					c = that.childs.length;
				}
				var key = 'node_count_' + that.tree.id + '-' + that.id;
				if (Cache.timers[key]) {
					window.clearTimeout(Cache.timers[key]);
				}
				Cache.timers[key] = window.setTimeout(function() {
					str = '<b>(' + c + ')</b>';
					if (item = that.getItem('count')) {
						item.innerHTML = str;
					}
				}, 5);
			}
			return that;
		},
		update: function (par, linkage) {
			var that = this.self(),
				opt = $.extend({}, par),
				icon = $.extend({}, par.icon);

			if (!$.isUndefinedOrNull(opt.status)) {
				icon.status = opt.status;
			}

			if (!Factory.isEmpty(icon)) {
				that.updateIcon(icon, linkage);
			}

			var name = $.getParam(opt, 'name,text');
			if ($.isString(name)) {
				that.updateText(name);
			}

			//TODO:
			return that;
		},
		getSwitchClass: function (initial) {
			var that = this.self(),
				opt = that.tree.options,
				css = ['switch'],
				key = 'switch';

			if (opt.switch) {
				css.push(key + opt.switch);
			}
			if (!that.isLeaf()) {
				css.push(key + opt.switch + (that.isExpand() ? '-open' : '-close'));
			}

			return css.join(' ');
		},
		setExpandStatus: function (initial) {
			var that = this.self(),
				opt = that.tree.options,
				leaf = that.isLeaf(),
				nochild = !that.hasChild();

			//虽然被指定为叶子节点类型，但当前已经有子节点加入，那就不能再算是叶子节点了
			if (leaf && nochild) {
				that.setParam('expanded', false);
			} else {
				if (nochild) {
					if (!that.isDynamic()) {
						that.setParam('expanded', false);
					} else if (that.isExpanded() && !that.loaded) {
						that.setParam('expanded', false);
					}
				}
			}
			return that.setSwitchClass();
		},
		setSwitchClass: function () {
			var that = this.self(),
				opt = that.tree.options,
				handle = that.getItem('switch'),
				css = ['switch'],
				open = that.expanded,
				leaf = that.isLeaf(),
				nochild = !that.hasChild(),
				none = false,
				close = '-close';

			if (!handle) {
				return that.setIconClass();
			}
			if (nochild && (leaf || !that.isDynamic())) {
				close = '-none';
				none = true;
			}

			if (that.tree.options.showLine) {
				var siblings = that.parent.childs,
					c = siblings.length,
					last = siblings[c - 1].id === that.id,
					first = siblings[0].id === that.id;

				if (first && last) {
					if (that.level === 0) {
						//only one
						css.push(open ? 'node-open' : 'node' + close);
					} else {
						css.push(open ? 'last-open' : 'last' + close);
					}
				} else if (last) {
					css.push(open ? 'last-open' : 'last' + close);
				} else {
					css.push(open ? 'switch-open' : 'switch' + close);
				}
				$.setElemClass(that.childbox, 'line', !last);
			} else {
				if (none) {
					css.push('switch-none');
				} else {
					css.push('switch' + (opt.switch) + (open ? '-open' : close));
				}
			}
			handle.className = css.join(' ');

			return that.setIconClass();
		},
		setChildSwitchClass: function () {
			var that = this.self(), node,
				c = that.childs.length, i;
			for (i = 0; i < c; i++) {
				node = that.childs[i].setSwitchClass();				
			}
			return that;
		},
		setCheckedClass: function () {
			var that = this.self(),
				check = that.getItem('check');
			if (that.tree.options.showCheck && check) {
				$.setElemClass(check, 'check-true', that.checked);
				$.setElemClass(check, 'check-part-true', that.part && that.checked);

				if (!that.part && Factory.isReturnType(that.tree, that.type)) {
					Factory.setCurrentCache(that.tree, 'checked', that, that.checked);
				}
			}
			return that;
		},
		setItemClass: function (type, initial) {
			var that = this.self();
			switch(type) {
				case 'check': that.setCheckedClass(); break;
				case 'switch': that.setSwitchClass(); break;
			}
			return that;
		},
		setSelectedClass: function () {
			var that = this.self();
			$.setElemClass(that.element, 'cur', that.selected);
			return that;
		},
		setDisabledClass: function() {
			var that = this.self();
			$.setElemClass(that.element, 'disabled', that.disabled);
			return that;
		},
		setNodeClass: function (type) {
			var that = this.self();
			switch(type) {
				case 'select': that.setSelectedClass(); break;
				case 'disabled': that.setDisabledClass(); break;
			}
			return that;
		},
		hasChild: function () {
			var that = this.self();
			return that.childs && that.childs.length > 0;
		},
		isLeaf: function () {
			var that = this.self();
			var leaf = that.tree.isLeafType(that.type);
			//判断是否指定叶子节点类型
			//0: 未指定，1: 指定，是叶子，-1: 指定，非叶子
			if (leaf !== 0) {
				return leaf === 1;
			}
			return !that.dynamic && !that.hasChild();
		},
		isDynamic: function () {
			return this.self().dynamic;
		},
		isExpand: function () {
			return this.self().expanded;
		},
		isExpanded: function () {
			return this.self().expanded;
		},
		isChecked: function () {
			return this.self().checked;
		},
		isSelected: function () {
			return this.self().selected;
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
			$.console.log('initial:', options);

			var opt = Factory.checkOptions($.extend({
				id: 'otree001',
				//样式
				skin: '',
				//树菜单容器
				element: undefined,
				//是否异步加载节点
				async: undefined,
				//是否保持节点展开、定位状态
				keepStatus: undefined,
				//是否保持收缩状态
				keepCollapse: undefined,
				//是否保存状态到cookie
				keepCookie: undefined,
				//cookie过期时间，单位：分钟
				cookieExpire: undefined,
				//是否调试模式
				debug: false,
				//data如果不是数组，是对象结构，则需要指定trees
				data: [],
				//值字段，默认为 ['id']
				valueFields: [],
				//默认值，用于值还原
				defaultValue: undefined,
				//switch图标类型（默认样式时有效）
				switch: undefined,
				//data数据结构注解，示例：[{key:'unit',val:'units'}]
				//用于获取data{}数据中的数组字段以及指定节点类型
				//若未指定结构注解，则取data[]或data{}中第一个字段数组
				trees: undefined,
				//指定叶子节点类型，字符串数组或字符串，示例：['camera'] 或 'camera'
				//指定为叶子节点的，不能动态加载子节点，但可以初始化加载子节点
				leafTypes: undefined,
				//动态加载子节点(非叶子节点)
				dynamic: undefined,
				//指定为动态加载子节点的数据类型，字符串数组或字符串，示例：['device'] 或 'device'
				//若未指定，则非叶子都可以动态加载
				dynamicTypes: undefined,
				//指定为需动态加载的数据类型，字符串数组或字符串，示例：['camera'] 或 'camera'
				dynamicDatas: undefined,
            	//指定可选中/返回的数据类型，若未指定，则所有都可返回
				returnTypes: undefined,
				//动态加载次数，默认为1次
				loadCount: undefined,
				//指定默认要展开的节点类型
				openTypes: undefined,
				//指定默认要展开的节点层级
				openLevel: undefined,
				//是否显示连线
				showLine: undefined,
				//是否显示图标
				showIcon: undefined,
				//是否显示复选框
				showCheck: undefined,
				//是否显示描述
				showDesc: undefined,
				//是否显示按钮
				showButton: undefined,
				//是否显示上移/下移按钮
				showMove: undefined,
				//是否允许移动节点
				moveAble: undefined,
				//是否允许拖动节点
				dragAble: undefined,
				//允许拖动的节点类型，字符串数组或字符串，示例：['unit','device'] 或 'unit'
				dragTypes: undefined,
				//按钮配置
				buttonConfig: undefined,
				//是否显示节点信息
				showInfo: undefined,
				//是否显示子节点数量
				showCount: undefined,
				//是否显示节点类型图标
				showType: undefined,
				//是否显示节点状态
				showStatus: undefined,
				//是否显示title
				showTitle: undefined,
				//是否显示搜索
				showSearch: undefined,
				//搜索按钮文字显示，默认显示“查找”
				searchText: undefined,
				//搜索输入框文字提示
				searchPrompt: undefined,
				//搜索框文字长度限制，默认长度限制128个字符（不区分中英文）
				keywordsLength: undefined,
				//搜索回调（用于复杂搜索，内部搜索只搜索名称关键字）
				searchCallback: undefined,
				//是否显示底部栏
				showBottom: undefined,
				//底部栏对齐方式 center, left, right
				bottomAlign: undefined,
				//是否显示滚动图标（小火箭）
				showScrollIcon: undefined,
				//节点状态字段
				statusField: 'status',
				//是否级联选中复选框
				linkage: undefined,
				//非级联模式下最大选中数量，0-表示不限数量，默认为0
				maxCount: undefined,
				//是否单选模式
				single: undefined,
				//是否单击选中
				clickChecked: undefined,
				//是否单击切换（展开/收缩）
				clickExpand: undefined,
				//关联元素
				target: undefined,
				//关联弹出层配置
				targetConfig: undefined,
				//是否触发式显示，例如点击<a>
				trigger: undefined,
				//回调等级：0-实时回调，1-点击“确定”按钮后回调
				callbackLevel: 0,
				//是否防抖，多选模式下，点击选项时有效
				callbackDebounce: undefined,
				//防抖延迟，单位：毫秒
				debounceDelay: Config.DebounceDelay,
				//防抖间隔，单位：毫秒
				debounceTimeout: Config.DebounceTimeout,
				//以下是回调事件
				callback: undefined,
				complete: undefined,
				//clickCallback,onclick
				clickCallback: undefined,
				//expandCallback,onexpand
				expandCallback: undefined,
				//dblclickCallback,ondblclick
				dblclickCallback: undefined,
				//contextmenuCallback,oncontextmenu
				contextmenuCallback: undefined,
				//buttonCallback,onbutton
				buttonCallback: undefined
			}, options));

			if (opt.target) {
				opt.targetConfig = $.extend({
					height: 500,
					separator: ','
				}, opt.targetConfig);
			}

			this.id = opt.id;
			this.bid = Factory.buildTreeId(opt.id, 'box_');
			this.tid = Factory.buildTreeId(opt.id, 'panel_');
			this.options = opt;

			if (!Factory.isDefaultSkin(opt.skin)) {
				Factory.loadCss(opt.skin);
			}
			if (!$.isElement(opt.element) && !opt.target) {
				return this;
			}

			Factory.initCache(this, true)
				.setWindowResize()
				.showSearchPanel(this, false, true)
				.setDefaultValue(this, {value: opt.defaultValue});

			if (opt.target) {
				this.target = opt.target;
				Factory.buildTargetEvent(this, opt);
				if (this.panel) {
					Factory.buildPanel(this, this.options, true);
				}
			} else {
				this.element = opt.element;
				Factory.buildPanel(this, opt);
			}
			//$.console.log('initial:', this.id, this);

			return this;
		},
		display: function (show) {
			return Factory.setBoxDisplay(this, show), this;
		},
		show: function (show) {
			return Factory.setBoxDisplay(this, $.isBoolean(show, true)), this;
		},
		hide: function () {
			var that = this;
			return Factory.setBoxDisplay(that, false), that;
		},
		resize: function () {
			var that = this;
			return Factory.setPanelSize(that), that;
		},
		//仅用于动态加载数据时有效
		reload: function () {
			var that = this;			
			return Factory.reloadNode(that), that;
		},
		nid: function (id, type) {
			return Factory.buildNodeId(id, type);
		},
		node: function (nodeId) {
			var nid = Factory.isNode(nodeId) ? nodeId.id : Factory.buildNodeId(nodeId);
			return this.cache.nodes[nid];
		},
		getChecked: function (dataKey, nodeType) {
			var cur = this.cache.current,
				key = 'checked',
				arr = [], k, kv = {};

			if (!cur[key]) {
				return [];
			}
			for (k in cur[key]) {
				if (Factory.getNodeValue(cur[key][k], dataKey, nodeType, kv)) {
					arr.push(kv.val);
				}
			}
			return arr;
		},
		getValue: function (dataKey, nodeType) {
			var cur = this.cache.current,
				key = 'selected', kv = {};

			if (Factory.getNodeValue(cur[key], dataKey, nodeType, kv)) {
				return kv.val;
			}
			return null;
		},
		append: function (items, par, pnode) {
			return Factory.addNode(this, items, par, pnode), this;
		},
		add: function (items, par, pnode) {
			return Factory.addNode(this, items, par, pnode), this;
		},
		insert: function (items, par, pnode) {
			return Factory.addNode(this, items, par, pnode, true), this;
		},
		update: function (items, par, linkage) {
			var that = this,
				arr = $.extend([], items),
				i, c = arr.length,
				list = [];

			for (i = 0; i < c; i++) {
				var dr = $.extend({}, arr[i], par),
					nid = Factory.buildNodeId(dr.id, dr.type),
					node = Factory.getNode(nid);

				if (node) {
					node.update(dr, linkage);
				} else {
					list.push(dr);
				}
			}
			if (list.length > 0) {
				Factory.addNode(that, list);
			}
			return that;
		},
		updateIcon: function (nodes, par, linkage) {
			par = $.extend({}, par);
			return Factory.eachNodeIds(this.cache.nodes, nodes, function(node, i, c) {
				node.updateIcon(par, linkage);
			}), this;
		},
		icon: function (nodes, par, linkage) {
			return this.updateIcon(nodes, par, linkage);
		},
		//status: on, off, play
		updateStatus: function (nodes, status, linkage) {
			if (!$.isString(status, true)) {
				status = status ? 'on' : 'off';
			}
			var par = {status: status };
			return Factory.eachNodeIds(this.cache.nodes, nodes, function(node, i, c) {
				node.updateIcon(par, linkage);
			}), this;
		},
		updateText: function (nodes, texts) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, function(node, i, c) {
				node.updateText(c === 1 ? texts : texts[i]);
			}), this;
		},
		text: function (nodes, texts) {
			return this.updateText(nodes, texts);
		},
		updateDesc: function (nodes, texts) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, function(node, i, c) {
				node.updateDesc(c === 1 ? texts : texts[i]);
			}), this;
		},
		desc: function (nodes, texts) {
			return this.updateDesc(nodeIds, texts);
		},
		delete: function (nodes) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, 'delete'), this;
		},
		del: function (nodes) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, 'delete'), this;
		},
		deleteChild: function (nodes) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, 'deleteChild'), this;
		},
		move: function (nodes, dest, insert) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, 'move', dest, insert), this;
		},
		moveChild: function (nodes, dest, insert) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, 'moveChild', dest, insert), this;
		},
		sortIndex: function (nodes, num, callback) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, 'sortIndex', num, callback), this;
		},
		sortNode: function (nodes, dest, callback, drag) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, 'sortNode', dest, callback, drag), this;
		},
		sortUp: function (nodes, num, callback) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, 'sortUp', num, callback), this;
		},
		sortDown: function (nodes, num, callback) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, 'sortDown', num, callback), this;
		},
		checked: function (nodes, checked) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, 'setChecked', $.isBoolean(checked, true)), this;
		},
		check: function (nodes, selected, position) {
			return this.checked(nodes, selected);
		},
		disabled: function (nodes, disabled) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, 'setDisabled', $.isBoolean(disabled, true)), this;
		},
		expand: function (nodes, linkage) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, 'expand', linkage), this;
		},
		collapse: function (nodes) {
			return Factory.eachNodeIds(this.cache.nodes, nodes, 'collapse'), this;
		},
		selected: function (nodes, selected, position) {
			return Factory.callNodeFunc(this.cache.nodes, nodes, 'setSelected', $.isBoolean(selected, true), position), this;
		},
		select: function (nodes, selected, position) {
			return this.selected(nodes, selected, position);
		},
		position: function (nodes, selected) {
			return Factory.callNodeFunc(this.cache.nodes, nodes, 'position', selected), this;
		},
		expandAll: function (expand) {
			return Factory.expandAll(this, expand), this;
		},
		collapseAll: function () {
			return Factory.expandAll(this, false), this;
		},
		expandLevel: function (levels, linkage, reverse, expand) {
			return Factory.expandLevel(this, levels, linkage, reverse, expand), this;
		},
		expandToLevel: function (levels, reverse, expand) {
			return Factory.expandLevel(this, levels, true, $.isBoolean(reverse, true), expand), this;
		},
		collapseLevel: function (levels, linkage, reverse) {
			return Factory.collapseLevel(this, levels, linkage, reverse), this;
		},
		collapseToLevel: function (levels, reverse) {
			return Factory.collapseLevel(this, levels, true, $.isBoolean(reverse, true)), this;
		},
		expandNode: function (nodes, linkage) {
			return Factory.expandNode(this, nodes, linkage);
		},
		expandToNode: function (nodes) {
			return Factory.expandToNode(this, nodes);
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
			return Factory.isDefaultSkin(this.options.skin);
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

	Factory.func = function (id, nodes, funcName, arg0, arg1, arg2, arg3) {
		var tree = $.tree.get(id);
		if (tree && $.isFunction(tree[funcName])) {
			tree[funcName](nodes, arg0, arg1, arg2, arg3);
		}
		return $.tree;
	};

	Factory.action = function (id, funcName, arg0, arg1, arg2, arg3) {
		var tree = $.tree.get(id);
		if (tree && $.isFunction(tree[funcName])) {
			tree[funcName](arg0, arg1, arg2, arg3);
		}
		return $.tree;
	};

	$.extend({
		tree: function (id, par) {
			return Factory.buildTree(id, par);
		}
	});

	$.extend($.tree, {
		get: function (id) {
			var cache = Factory.getTreeCache(id);
			return cache ? cache.tree : null;
		},
		show: function (id, show) {
			var cache = Factory.getTreeCache(id);
			return cache ? cache.tree.show(show) : null;
		},
		hide: function (id) {
			var cache = Factory.getTreeCache(id);
			return cache ? cache.tree.hide() : null;
		},
		add: function (id, items, par) {
			var tree = $.tree.get(id);
			if (tree) {
				tree.add(items, par);
			}
			return this;
		},
		update: function (id, items, par, linkage) {
			var tree = $.tree.get(id);
			if (tree) {
				tree.update(items, par, linkage);
			}
			return this;
		},
		icon: function (id, nodes, par, linkage) {
			return Factory.func(id, nodes, 'updateIcon', par, linkage);
		},
		updateIcon: function (id, nodes, par, linkage) {
			return Factory.func(id, nodes, 'updateIcon', par, linkage);
		},
		text: function (id, nodes, texts) {
			return Factory.func(id, nodes, 'updateText', texts);
		},
		updateText: function (treeId, nodes, texts) {
			return Factory.func(id, nodes, 'updateText', texts);
		},
		desc: function (id, nodes, texts) {
			return Factory.func(id, nodes, 'updateDesc', texts);
		},
		updateDesc: function (id, nodes, texts) {
			return Factory.func(id, nodes, 'updateDesc', texts);
		},
		select: function (id, nodes, selected) {
			return Factory.func(id, nodes, 'select', selected);
		},
		delete: function (id, nodes) {
			return Factory.func(id, nodes, 'delete');
		},
		selected: function (id, nodes, selected) {
			return Factory.func(id, nodes, 'select', selected);
		},
		checked: function (id, nodes, checked) {
			return Factory.func(id, nodes, 'checked', checked);
		},
		disabled: function (id, nodes, disabled) {
			return Factory.func(id, nodes, 'disabled', disabled);
		},
		position: function (id, node) {
			return Factory.func(id, node, 'position');
		},
		expand: function (id, nodes) {
			return Factory.func(id, nodes, 'expand');
		},
		collapse: function (id, nodes) {
			return Factory.func(id, nodes, 'collapse');
		},
		expandAll: function (id, collapse) {
			return Factory.action(id, 'expandAll', collapse);
		},
		collapseAll: function (id) {
			return Factory.action(id, 'collapseAll');
		},
		expandLevel: function (id, levels, linkage, reverse, expand) {
			return Factory.action(id, 'expandLevel', levels, linkage, reverse, expand);
		},
		expandToLevel: function (id, levels, reverse, expand) {
			return Factory.action(id, 'expandToLevel', levels, reverse, expand);
		},
		collapseLevel: function (id, levels, linkage, reverse) {
			return Factory.action(id, 'expandLevel', levels, linkage, reverse, false);
		},
		collapseToLevel: function (id, levels, reverse) {
			return Factory.action(id, 'collapseToLevel', levels, reverse, false);
		},
		expandType: function (id, types, linkage, expand) {
			return Factory.action(id, 'expandType', types, linkage, expand);
		},
		collapseType: function (id, types, linkage) {
			return Factory.action(id, 'expandType', types, linkage, false);
		}
	});

}(OUI);