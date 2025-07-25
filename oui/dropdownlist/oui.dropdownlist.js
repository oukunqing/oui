
/*
	@Title: OUI
	@Description：JS通用代码库
	@Author: oukunqing
	@License：MIT

	$.dropdownlist 下拉列表插件
*/

!function ($) {
    'use strict';

	var SelfPath = $.getScriptSelfPath(true),
		Config = {
			FilePath: SelfPath,
        	FileName: 'oui.dropdownlist.',
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
			IdPrefix: 'oui_ddl_panel_id_',
			ItemPrefix: 'oui_ddl_chb_item_',
			Layout: {
				List: 'list',
				Flow: 'flow',
				Grid: 'grid'
			},
			Position: {
				Left: 'left',
				Right: 'right'
			},
			CallbackLevel: {
				//选项
				Normal: 0,
				//全选按钮
				Select: 1,
				//确定按钮
				Return: 2,
				//初始化
				Initial: 999,
			},
			DebounceDelay: 256,
			DebounceTimeout: 4000,
			// 当高度超过浏览器窗口大小时，保留边距
			BodyPadding: 10,
			// 选项高度
			BoxItemHeight: 30,
			// 选项底部高度
			BoxBarHeight: 42,
			// 选项默认显示行数
			ItemDisplayLines: 12,
			// 选项序号(单个数字)宽度
			ItemNumberWidth: 12,
			// 选项序号(多个数字的单个数字)宽度
			ItemNumberWidth2: 10,
			// 树形结构层级缩进宽度
			TreeIndentWidth: 20,
			// 选项框默认最小高度
			BoxMinHeight: 30,
			// 选项框默认最大高度
			BoxMaxHeight: 363,
			// 选项框按钮面板高度
			BoxFormHeight: 42,
			// 选项框默认最大宽度
			BoxMaxWidth: 500,
			// 选项框(网格)默认最大高度
			BoxGridMaxHeight: 400,
			// 选项框(网格)最小宽度
			BoxGridMinWidth: 456,
			// 选项框最小宽度设置
			BoxMinWidths: [40, 245, 345],
			BoxMinHeights: [64, 90, 140],
			SearchResultBoxHeight: 390, 	//12 * 30 + 30
			SearchResultItemHeight: 30,
			SearchResultTitleHeight: 30,
			//搜索触发条件，超过10个选项才搜索
			SearchConditionCount: 10,
			//搜索框字符长度限制
			SearchKeywordsLength: 128,
			// 隐藏但是需要占位
			CssHidden: ';visibility:hidden;width:0px;height:0px;border:none;margin:0;padding:0;font-size:1px;line-height:0px;float:left;'
		},
		KC = $.KEY_CODE, KCA = KC.Arrow, KCC = KC.Char, KCM = KC.Min,
		Cache = {
			ids: [],
			lists: {},
			events: {},
			caches: {},
			search: {}
		},
		Factory = {
			loadCss: function (skin, func) {
				$.loadJsScriptCss(Config.FilePath, skin, func, Config.FileName);
				return this;
			},
			buildId: function (id) {
				if ($.isElement(id)) {
					return id.id || $.crc.toCRC16(id.toString()).toLowerCase();
				}
				return id.toString();
			},
			buildKey: function (id) {
				return 'oui_ddl_' + Factory.buildId(id);
			},
			getCache: function (id) {
				var key = this.buildKey(id),
					obj = Cache.lists[key];
				return obj || null;
			},
			setCache: function (opt, ddl) {
				var key = this.buildKey(opt.id);
				Cache.lists[key] = {
					elem: opt.element,
					opt: opt,
					ddl: ddl
				};
				Cache.ids.push({ key: key, id: opt.id });

				return Cache.lists[key];
			},
			getList: function (key) {
				if (typeof Cache.lists[key] !== 'undefined') {
					return Cache.lists[key]['ddl'];
				}
				return null;
			},
			closeOther: function (ddl) {
				for (var k in Cache.lists) {
					if (k !== Factory.buildKey(ddl.id)) {
						var obj = Cache.lists[k];
						if (obj && obj.ddl && obj.ddl.box && obj.ddl.box.show) {
							obj.ddl.hide();
						}
					}
				}
				return this;
			},
			checkOptions: function (options) {
				var opt = $.extend({}, options);

				opt.itemBorder = $.getParam(opt, 'itemBorder,border');
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
                    //opt.skin = Config.DefaultSkin;
                    //指定默认样式
                    opt.skin = Config.GetSkin();
                }

				if ($.isBoolean(opt.single)) {
					opt.multi = !opt.single;
				} else {
					opt.multi = $.isBoolean(opt.multi, false);
				}
				opt.initial = $.isBoolean(opt.initial, false);

				opt.callbackLevel = $.getParam(opt, 'submit,callbackLevel');
				if (!$.isNumber(opt.callbackLevel)) {
					opt.callbackLevel = Config.CallbackLevel.Return;
				}

				opt.columns = $.getParam(opt, 'columns,cells,column,cell');
				opt.textAlign = $.getParam(opt, 'itemAlign,textAlign,align');

				//默认需要防抖回调
				opt.callbackDebounce = $.isBoolean($.getParam(opt, 'callbackDebounce,debounce'), true);
				opt.debounceDelay = parseInt('0' + $.getParamCon(opt, 'debounceDelay,debouncedelay,delay')) || Config.DebounceDelay;
				opt.debounceTimeout = parseInt('0' + $.getParamCon(opt, 'debounceTimeout,debouncetimeout,timeout')) || Config.DebounceTimeout;

				//是否显示选框,默认情况下：单选框不显示，复选框显示
				//若指定display为true或false，则按指定规则显示
				if (!$.isBoolean(opt.choose)) {
					opt.choose = opt.multi;
				}

				opt.allowEmpty = $.getParamValue(opt.allowEmpty, opt.empty);
				opt.boxWidth = $.getParamValue(opt.boxWidth, opt.panelWidth);
				opt.textWidth = $.getParamValue(opt.textWidth, opt.elemWidth, opt.width);
				opt.textHeight = $.getParamValue(opt.textHeight, opt.elemHeight, opt.height);
				opt.textMinHeight = $.getParamValue(opt.textMinHeight, opt.elemMinHeight);
				opt.style = $.getParamValue(opt.style, opt.css);

				opt.maxHeight = options.maxHeight || (opt.layout === 'grid' ? Config.BoxGridMaxHeight : Config.BoxMaxHeight);

				opt.dataType = $.getParam(opt, 'dataType,datatype,valueType,valuetype');
				opt.buttonPosition = $.getParam(opt, 'buttonPosition,buttonPos,btnPos', opt.tree ? 'right' : 'center');
				opt.buttonLimit = $.getParam(opt, 'buttonLimit,buttonLength,buttonLen,btnLimit,btnLength,btnLen');
				opt.button = $.getParam(opt, 'showButton,button');
				opt.number = $.getParam(opt, 'showNumber,number');
				opt.display = $.getParam(opt, 'showValue,display');
				opt.lines = parseInt('0' + $.getParam(opt, 'lines,line'), 10);
				opt.choose = $.getParam(opt, 'chooseBox,choosebox,choose');
				opt.border = $.getParam(opt, 'itemBorder,border,');
				opt.value = $.getParam(opt, 'selectedValue,selectedvalue,value');
				opt.index = $.getParam(opt, 'selectedIndex,selectedindex,index', 0);
				opt.origin = $.isBoolean($.getParam(opt, 'origin,original'), false);
				opt.items = $.extend([], opt.items, opt.options);
				opt.x = ('' + $.getParam(opt, 'left,x')).toInt();
				opt.y = ('' + $.getParam(opt, 'margin,top,y')).toInt();
				opt.w = ('' + $.getParam(opt, 'w')).toInt();
				opt.change = $.isBoolean($.getParam(opt, 'onchange,change'), true);

				opt.showSearch = $.isBoolean($.getParam(opt, 'showSearch,showForm,showsearch,search'), false);

				opt.searchFields = $.getParam(opt, 'searchFields');
				if (!$.isArray(opt.searchFields)) {
					opt.searchFields = $.isString(opt.searchFields, true) ? opt.searchFields.split(/[,;|]/g) : [];
				}
				var searchCode = $.isBoolean($.getParam(opt, 'searchCodeField,searchCode'), false);
				if (searchCode) {
					opt.searchFields.push('code');
				}

				opt.realSearch = $.isBoolean($.getParam(opt, 'realSearch'), false);
				opt.clearSearch = $.isBoolean($.getParam(opt, 'clearSearch'), true);

				if (opt.index < 0) {
					opt.index = 0;
				}

				if (!$.isNumber(opt.maxLimit)) {
					opt.maxLimit = 0;
				}
				if (!$.isString(opt.maxLimitMsg)) {
					opt.maxLimitMsg = '';
				}

				return opt;
			},
			buildList: function (id, par, single) {
				var elem;
				if ($.isElement(id)) {
					elem = id;
					id = Factory.buildId(id);
				} else if ($.isArrayLike(id)) {

				} else if ($.isObject(id) && $.isUndefined(par)) {
					par = id;
					id = null;
				} else if ($.isString(id, true)) {
					par = $.extend({}, par, {id: id});
				}
				var opt = $.extend({
					id: id,
					element: elem
				}, par), cache, ddl;

				if (single) {
					opt.single = true;
				}

				opt.id = opt.id || (opt.element ? opt.element.id : '');

				var arr = $.isArrayLike(opt.id) ? opt.id : $.isString(opt.id) ? opt.id.split(/[,;\|，]/) : opt.id.toString().split(/[,;\|，]/);
				if (arr.length > 1) {
					var list = [];
					for (var i = 0; i < arr.length; i++) {
						var id = arr[i], elem;
						if ($.isElement(id)) {
							elem = id;
							id = elem.id || id;
						}
						var p = $.extend(opt, {id: id, element: elem});
						if ((cache = Factory.getCache(id))) {
							list.push(cache.ddl);
						} else {
							Factory.setCache(p, (ddl = new DropDownList(p)));
							list.push(ddl);
						}
					}
					return list;
				}
				if ((cache = Factory.getCache(opt.id))) {
					return cache.ddl;
				}
				return Factory.setCache(opt, (ddl = new DropDownList(opt))), ddl;
			},
			getStyleSize: function (size, offsetSize) {
				if (size === 'auto' || $.isUndefinedOrNull(size)) {
					return offsetSize + 'px';
				} else {
					if ($.isNumber(size)) {
						return (size < 0 ? 0 : size) + 'px';
					} else if ($.isString(size)) {
						return size.endWith('%') ? size : parseFloat('0' + size, 10).round(2) + 'px';
					}
				}
				return '0';
			},
			getItemConWidth: function (items, itemWidth, columns, display) {
				var width = 0;
				if ($.isNumber(columns) && columns > 0) {
					width = parseFloat(100 / columns, 10).round(2) + '%';
				} else if (itemWidth === 'cell') {
					for (var i = 0; i < items.length; i++) {
						var dr = items[i],
							con = dr.name + (dr.desc ? ' - ' + dr.desc : ''),
							w = $.getContentSize(con).width;
						if (w > width) {
							width = w;
						}
					}
					//加上padding和checkbox宽度
					width += 7 * 2 + (display ? 20 : 0);
				} else {
					width = itemWidth === 'auto' ? 0 : itemWidth;
				}
				return width;
			},
			isRepeat: function (name) {
				return Cache.events[name] ? true : (Cache.events[name] = true, false);
			},
			setWindowResize: function () {
				if (this.isRepeat('resize')) {
					return this;
				}
				$.addListener(window, 'resize', function (e) {
					for (var i = 0; i < Cache.ids.length; i++) {
						var d = Factory.getList(Cache.ids[i].key);
						if (d && !d.isClosed()) {
							//改变选项框尺寸和位置
							//d.size().position();
							//改为隐藏选项框（参考原生select显示规则）
							d.hide();
						}
					}
				});
				return this;
			},
			getSize: function(opt, bs) {
				var min1 = opt.layout === 'grid' ? Config.BoxGridMinWidth : Config.BoxMinWidths[1],
					min2 = opt.layout === 'grid' ? Config.BoxGridMinWidth : Config.BoxMinWidths[2],
					min = 0,
					num = opt.shortcutNum;

				if (num && (bs.min < min2 || bs.max < min2 || bs.width < min2)) {
					min = min2;
				} else if (bs.min < min1 || bs.max < min1 || bs.width < min1) {
					min = min1;
				}

				if (bs.min < min) {
					bs.min = min;
				}
				if (bs.max < min) {
					bs.max = min;
				}
				if (bs.width < min) {
					bs.width = min;
				}
				return bs;
			},
			getElementOptionConfig: function (elem) {
				var options = [], arr = [], i;
				if (!$.isElement(elem = $.toElement(elem))) {
					return options;
				}
				if (elem.tagName === 'SELECT') {
					arr = elem.options;
					for (i = 0; i < arr.length; i++) {
						options.push({val: arr[i].value, txt: arr[i].text});
					}
				} else {
					arr = ($.getAttribute(elem, 'options') || '').split(/[,;\|]/);
					for (i = 0; i < arr.length; i++) {
						if (arr[i] !== '') {
							if (arr[i].indexOf(':') > 0) {
								var tmp = arr[i].split(':');
								options.push({val: tmp[0], txt: tmp[1] || tmp[0]});
							} else {
								options.push({val: arr[i], txt: arr[i]});
							}
						}
					}
				}
				return options;
			},
			setRadius: function (elem, pos) {
				$.removeClass(elem, 'oui-ddl-bottom,oui-ddl-top');
				$.addClass(elem, 'oui-ddl-' + pos);
				return this;
			},
			isInList: function (nodes, val) {
				for (var i = 0; i < nodes.length; i++) {
					if (nodes[i].value === val || nodes[i].value.toString() === val.toString()) {
						return true;
					}
				}
				return false;
			},
			clearItems: function (ddl, panel) {
				var that = ddl;
				that.nodes = [];
				that.items = [];
				panel = $.toElement(panel);
				if ($.isElement(panel)) {
					panel.innerHTML = '';
					panel.style.height = 0 + 'px';
				}
				return this;
			},
			buildItems: function (ddl, items, listbox) {
				var that = ddl,
					opt = that.options,
					columns = opt.columns || 0;

				if (!opt.multi && opt.allowEmpty) {
					items.unshift({val: '', txt: opt.allowEmpty });
					//items.splice(0, 0, {val: '', txt: opt.allowEmpty });
				}

				var	conWidth = Factory.getItemConWidth(items, opt.itemWidth, columns, opt.choose),
					minWidth = opt.layout === Config.Layout.Grid ? conWidth : 0,
					key = Config.ItemPrefix + that.id,
					len = items.length,
					n = len.toString().length,
					num = 0,
					html = [],
					listbox = $.toElement(listbox),
					align = opt.textAlign ? 'text-align:' + opt.textAlign + ';' : '';

				for (var i = 0; i < len; i++) {
					var dr = items[i], p;
					if (dr === 'sep' || dr.sep || dr.type === 'sep') {
						html.push(['<li class="oui-ddl-item oui-ddl-sep"></li>'].join(''));
					} else if (dr.head) {
						html.push(['<li class="oui-ddl-item oui-ddl-head">', dr.head, '</li>'].join(''));
					} else {
						if ($.isString(dr, true)) {
							if (dr.indexOf(':') > 0) {
								p = dr.indexOf(':');
								dr = {val: dr.substr(0, p), txt: dr.substr(p + 1)};
							} else {
								dr = {val: dr, txt: dr};
							}
						} else if ($.isNumber(dr)) {
							dr = {val: dr, txt: dr};
						} else if ($.isArray(dr)) {
							dr = {val: dr[0], txt: dr[1] || dr[0]}
						} else if (!$.isObject(dr)) {
							continue;
						}
						var val = $.getParam(dr, (opt.field || '') + ',value,val,id', ''),
							txt = $.getParam(dr, 'name,text,txt', '') + '',
							con = $.getParam(dr, 'code');

						if (val === '' && con && con !== '') {
							val = con;
						}

						if (val === '' && txt === '') {
							continue;
						}

						var chbId = key + val,
							checked = dr.checked || dr.dc ? ' checked="checked" dc="1"' : '',
							use = dr.enabled || dr.use,
							disabled = dr.disabled ? ' disabled="disabled"' : '',
							desc = dr.desc || (opt.desc ? val.toString() : ''),
							title = '<span class="oui-ddl-li-txt">' + 
								(opt.display && val !== '' && val !== txt ? val + '<u>-</u>' + txt : txt === '' ? val : txt) + 
								//(opt.display && val !== '' && val !== txt ? val + ' - ' + txt : txt === '' ? val : txt) + 
								'</span>' +
								(desc && txt !== desc ? '<span class="oui-ddl-li-txt i-t">' + desc + '</span>' : '');

						html.push([
							'<li class="oui-ddl-item', opt.tree ? ' oui-ddl-tree-item' : '', dr.disabled ? ' oui-ddl-item-disabled' : '', '"',
							' style="',
							opt.layout !== Config.Layout.List ? 'float:left;' : '',
							opt.layout === Config.Layout.Grid ? 'min-width:' + Factory.getStyleSize(minWidth || opt.itemWidth) + ';' : '',
							'" opt-idx="', (num + i + 1), '" data-value="', val.toString().replace(/["]/g, '&quot;'), '"',
							'>',
							'<label class="oui-ddl-label', 
								opt.layout !== Config.Layout.List && opt.border ? ' oui-ddl-label-border' : '', 
								(use || typeof use === 'undefined') ? '' : ' del',
							'"',
							' style="',	opt.number ? 'padding-left:4px;' : '', align, '"',
							' opt-idx="', (num + i + 1), '"',
							'>',
							opt.number ? [
								'<i style="width:', (n * (n > 1 ? Config.ItemNumberWidth2 : Config.ItemNumberWidth)), 'px;">',
								(num + i + 1), '</i>'
							].join('') : '',
							opt.tree ? [
								'<span class="oui-ddl-item-space" style="',
								dr.level ? 'width:' + dr.level * Config.TreeIndentWidth + 'px;' : 'display:none;', 
								'"></span>'
							].join('') : '',
							'<input class="oui-ddl-chb"', checked, disabled,
							' type="', opt.multi ? 'checkbox' : 'radio', '"',
							' id="', chbId, '"',
							' name="', key, '"',
							' value="', val, '"',
							' code="', con, '"',
							' text="', (txt).filterHtml(true).replace(/["]/g, '&quot;'), '"',
							' desc="', (desc).filterHtml(true).replace(/["]/g, '&quot;'), '"',
							' style="display:' + (opt.choose ? '' : 'none') + ';"',
							' />',
							title,
							'</label>',
							'</li>'
						].join(''));
					}
				}
				if ($.isElement(listbox)) {
					listbox.innerHTML = html.join('');
					return this;
				}
				return html.join('');
			},
			buildButtons: function (ddl) {
				var that = ddl,
					opt = that.options,
					html = [],
					btnLen = 0,
					btnLimit = $.isNumber(opt.buttonLimit) ? opt.buttonLimit : -1,
					len = opt.items.length,
					selects = [],
					oneBtn = true,
					ac = opt.callbackLevel ? 'ok' : 'no',
					texts = [
						//'取消', '全选', '反选', opt.restore ? '还原' : '默认', '确定'
						'\u53d6\u6d88', '\u5168\u9009', '\u53cd\u9009', opt.restore ? '\u8fd8\u539f' : '\u9ed8\u8ba4', '\u786e\u5b9a'
					],
					key = Config.ItemPrefix + that.id;

				if (opt.callbackLevel > 0 && btnLimit === 0) {
					btnLimit = 1;
				}

				if (!opt.multi && opt.editable) {
					html.push([
						'<div class="oui-ddl-edit" id="', key + '_form"', opt.config.show ? '' : ' style="display:none;"', '>',
						'<div class="oui-ddl-form">',
						'<input type="text" class="oui-ddl-val oui-ddl-new"',
						' placeholder="', opt.config.placeholder, '" id="', key + '_val"',
						' maxlength="', opt.config.maxLength, '" data-type="', opt.config.dataType, '"',
						' tabindex="-1" />',
						'<button class="btn btn-default btn-sm oui-ddl-btn oui-ddl-new" tabindex="-1">', opt.config.button, '</button>',
						'</div>',
						'</div>'
					].join(''));
				}

				if (opt.multi) {
					if ((len > 5 || (opt.layout !== Config.Layout.List && len > 3)) && (opt.button || opt.callbackLevel > 0)) {
						selects = [
							'<button class="oui-ddl-btn btn btn-default btn-first" ac="1">' + texts[1] + '</button>',
							'<button class="oui-ddl-btn btn btn-default" ac="2">' + texts[2] + '</button>',
							'<button class="oui-ddl-btn btn btn-default" ac="0">' + texts[0] + '</button>',
							'<button class="oui-ddl-btn btn btn-default" ac="3">' + texts[3] + '</button>',
						];
						if (btnLimit >= 0 && selects.length >= btnLimit - 1) {
							selects.length = btnLimit - 1;
						}
						oneBtn = selects.length <= 0;
						btnLen += selects.length;
					}
					if (!oneBtn || opt.callbackLevel > 0 || opt.button || btnLimit > 0) {
						html.push('<div class="oui-ddl-oper oui-ddl-oper-' + opt.layout + '" style="text-align:' + opt.buttonPosition + ';">');
						html.push('<div class="btn-group btn-group-xs' + (oneBtn ? ' btn-group-block' : '') + '">');
						html.push(selects.join(''));
						html.push('<button class="oui-ddl-btn btn btn-primary btn-' + ac + (oneBtn ? ' btn-block' : '') + '" ac="' + ac + '">', texts[4], '</button>');
						html.push('</div>');
						html.push('</div>');
						btnLen += 1;
					}
				}
				return {html: html.join(''), len: btnLen, form: opt.editable};
			},
			setNodes: function (ddl, append) {
				var that = ddl,
					opt = that.options,
					elem = that.elem,
					key = Config.ItemPrefix + that.id,
					n = 0, i;

				if (!append) {
					that.nodes = [];
				}

				var arr = $N(key);
				for (i = n; i < arr.length; i++) {
					var chb = arr[i], dr = opt.items[i] || {};
					that.nodes.push(new Node({
						data: dr,
						type: dr.type || '',
						elem: elem,
						id: chb.value,
						idx: i + 1,
						item: chb.parentNode.parentNode,
						label: chb.parentNode,
						input: chb,
						disabled: chb.disabled ? true : false,
						multi: opt.multi
					}));
					that.indexs[chb.id] = i;
				}
				that.items = document.querySelectorAll('#' + Config.IdPrefix + opt.id + ' li');

				return this;
			},
			setEditEvent: function (ddl) {
				var that = ddl,
					opt = that.options,
					cfg = $.extend({}, opt.config),
					elem = opt.select ? that.elem : that.text;

				that.texts = document.querySelectorAll('#' + Config.IdPrefix + opt.id + ' .oui-ddl-edit .oui-ddl-new');

				if (opt.editable && that.texts.length > 0) {
					var text = that.texts[0];
					if (!$.isElement(text)) {
						return this;
					}
					var type = $.getAttribute(text, 'data-type'),
						num = false, intVal = false, floatVal = false,
						min = $.getParam(cfg, 'minValue,minVal,min'), 
						max = $.getParam(cfg, 'maxValue,maxVal,max');

					switch(type) {
					case 'int': case 'long': num = intVal = true; break;
					case 'float': case 'double': num = floatVal = true; break;
					case 'port': num = true; min = min || 0; max = max || 65535; break;
					}

					function _inputNewVal() {
						$.removeClass(text, 'oui-ddl-val-err');
						
						var val = text.value.trim();
						if (val === '') {
							that.elem.focus();
							return false;
						}
						val = intVal ? parseInt(val, 10) : floatVal ? parseFloat(val, 10) : val;

						if (num) {

						}  else if (['ip','ipv4'].indexOf(type) > -1) {
	                        if (/^(local|route|127.|192.|255.|::1)$/i.test(val)) {
	                            text.value = (val = val.replace(/^(local|127.|::1)$/i, '127.0.0.1')
	                                .replace(/^(route|192.)$/i, '192.168.1.1')
	                                .replace(/^255.$/, '255.255.255.0'));
	                        } else if (!$.PATTERN.Ip.test(val) && $.isString(val, true)) {
	                        	$.addClass(text, 'oui-ddl-val-err');
	                            return false
	                        }
	                    }
						/*
						$.console.log('_inputNewVal:', val);

						if (num) {
							if (isNaN(val)) {
								$.console.log('oui-ddl-edit:', that.id, type, ', input value format error');
								$.addClass(text, 'oui-ddl-val-err');
								return false;
							} else {
								if ($.isNumber(min) && val < min) {
									$.console.log('oui-ddl-edit:', that.id, ', input number entered must be greater than or equal to ' + min);
									$.addClass(text, 'oui-ddl-val-err');
									return false;
								}
								if ($.isNumber(max) && val > max) {
									$.console.log('oui-ddl-edit:', that.id, ', input number should be less than or equal to ' + max);
									$.addClass(text, 'oui-ddl-val-err');
									return false;
								}
							}
						}
						*/
						if (!opt.config.keep) {
							text.value = '';
						}						
						that.set(val, {edit: true});
						that.callback(opt.callbackLevel);
					}
					
					text.onkeyup = function(ev) {
						var kc = $.getKeyCode(ev);
						if (kc.inArray([KC.Enter, KC.Min.Enter])) {	//Enter 回车键确认输入
							_inputNewVal();
							//按Tab或Esc键，退出编辑框，焦点返回选项框
							that.focus(false);
						} else if (kc.inArray([KC.Tab, KC.Esc])) {
							elem.esc = '';
						} else if (ev.shiftKey && (kc >= KC.Char.A && kc <= KC.Char.Z)) {
							$.cancelBubble(ev);
						}
						return false;
					};
					
					text.onkeydown = function(ev) {
						var kc = $.getKeyCode(ev), val, pos = $.getTextCursorPosition(text);
						if (kc.inArray(KC.CtrlList) || kc.inArray(KC.FuncList)) {
							if (kc.inArray([KC.Tab, KC.Esc])) {
								$.cancelBubble(ev);
								//按Tab或Esc键，退出编辑框，焦点返回选项框
								that.focus(false);
								//设置esc按键事件，防止document esc冒泡
								elem.esc = 1;
							}
						} else if (num) {
							val = text.value.trim();
							text.tempValue = val;

							var pass = kc.inArray(KC.NumList) || kc.inArray(KC.Min.NumList)
								|| (cfg.minus && kc.inArray([KC.Symbol.Minus, KC.Min.Symbol.Minus]))
								|| (floatVal && kc.inArray([KC.Symbol.Dot, KC.Min.Symbol.Dot]));

							if (pass) {
								if (kc.inArray([KC.Symbol.Minus, KC.Min.Symbol.Minus]) && pos > 0) {
									return false;
								}
								if (kc.inArray([KC.Symbol.Dot, KC.Min.Symbol.Dot]) && val.indexOf('.') > -1) {
									return false;
								}
								var arr = val.split('');
								arr.splice(pos, 0, $.getKeyChar(ev));
								val = arr.join('');

								//验证最大值
								if (max && parseFloat(val, 10) > max) {
									return false;
								}

								//验证小数位长度
								if (floatVal && $.isNumber(cfg.decimalLen)) {
									var dlen = (val.split('.')[1] || '').trim().length;
									if (dlen > cfg.decimalLen) {
										return false;
									}
								}
							}
							return pass;
						}
						return true;
					};
					$.addListener(that.texts[1], 'click', function(ev) {
						_inputNewVal();
						return false;
					});

					// 65 - A (Append) 追加选项输入， 73 - I (Insert) 追加选项并获取焦点
					// shift
					$.addHitListener(elem, 'keyup', [KC.Char.A, KC.Char.I], function(ev) {
						$.getKeyCode(ev) === KC.Char.A ? that.form() : that.form(true, true);
					}, 2000, 3, true);

					// 69 - E (Edit), 70 - F (Focus)
					$.addKeyListener(elem, 'keyup', [KC.Char.E, KC.Char.F], function(ev) {
						$.getKeyCode(ev) === KC.Char.E ? that.form(null, true) : that.focus(true);
					}, true);
				}
				return this;
			},
			setButtonEvent: function (ddl) {
				var that = ddl,
					opt = that.options,
					elem = opt.select ? that.elem : that.text;
				
				that.buttons = document.querySelectorAll('#' + Config.IdPrefix + opt.id + ' .oui-ddl-oper .oui-ddl-btn');

				if (that.buttons.length <= 0) {
					return this;
				}
				for (var i = 0; i < that.buttons.length; i++) {
					if (opt.shortcutKey) {
						if (opt.shortcutNum) {
							that.buttons[i].innerHTML += '<em>(<u>' + (i + 1) + '</u>)</em>';
						}
						that.buttons[i].title += '快捷键: shift + ' + (i + 1);
					}
				}
				$.addListener(that.buttons[0].parentNode, 'click', function(ev) {
					$.cancelBubble(ev);
					elem.focus();
					var btn = ev.target, tag = btn.tagName, ac;
					if (tag !== 'BUTTON') {
						return false;
					}
					if ((ac = $.getAttribute(btn, 'ac')) === 'no') {
						that.hide();
					} else if (ac === 'ok') {
						that.callback(Config.CallbackLevel.Return);
						that.hide();
					} else {
						that.set('', {action: parseInt(ac, 10)});
						that.callback(Config.CallbackLevel.Select);
					}
				});
				return this;
			},
			setElemEvent: function (ddl) {
				var that = ddl,
					opt = that.options,
					elem = opt.select ? that.elem : that.text;

				$.addListener(document, 'mousedown', function (ev) {
					if (!$.isInElement(that.box, ev) && !$.isInElement(opt.select ? that.elem : that.text, ev)) {
						that.hide();
					}
					return false;
				});

				$.addListener(document, 'keyup', function (ev) {
					var kc = $.getKeyCode(ev);
					if (KC.Esc === kc) {   // Esc键值为27
						//若esc按键是从编辑框触发的，则不执行，防止冒泡
						if (!elem.esc) {
							that.hide();
						}
					} else if (ev.shiftKey && kc === KCC.F) {
						$.cancelBubble(ev);
						return false;
					}
					return false;
				});
				
				$.addListener(document, 'wheel', function (ev) {
					if (that.box.style.display !== 'none' && !$.isOnElement(that.box, ev)) {
						that.hide();
					}
					return false;
				});

				$.addListener(elem, 'wheel', function (ev) {
					if (that.box.style.display !== 'none') {
						that.hide();
					}
					return false;
				});

				$.addListener(elem, 'mousedown', function (ev) {
					$.cancelBubble(ev);
					that.show(this);
					this.focus();
					Factory.closeOther(that);
					$.hidePopupPanel(that.box);
					return true;
				});
				$.addListener(elem, 'keydown', function (ev) {
					if (elem.tagName !== 'SELECT' && opt.dataType === 'string') {
						return false;
					}
					var kc = $.getKeyCode(ev),
						idx = Factory.getItemIdx(elem),
						div = $I($.getAttribute(elem, 'opt-id')),
						ArrList	= [KCA.Left, KCA.Top, KCA.Bottom, KCA.Right], //左 上 下 右
						VimList = [KCA.H, KCA.K, KCA.J, KCA.L],	//vim方向键 H  K  J  L
						// 77 - M(中间); 85 - U(向上半屏); 68 - D(向下半屏）; 66 - B(向上一屏); 70 - F(向下一屏)
						// 67 - C 依次找到选中项的位置
						VimKey = [KCC.M, KCC.U, KCC.D, KCC.B, KCC.F, KCC.C],
						numList = [KCA[1], KCA[2], KCA[3], KCA[4], KCA[5]], 	// 数字键 1 2 3 4 5 (5个按钮位置，从1开始)
						minList = [KCM[1], KCM[2], KCM[3], KCM[4], KCM[5]]; 	// 数字键(小键盘) 1 2 3 4 5 (5个按钮位置，从1开始)

					// 13 - Enter, 32 - Space, 108 - Enter(小键盘)
					if (kc.inArray([KC.Enter, KC.Space, KC.Min.Enter])) {
						this.focus();
						$.cancelBubble(ev);
						var hover = $.getAttribute(elem, 'opt-hover', '0').toInt();
						if (hover) {
							that.action(idx);
							$.setAttribute(elem, 'opt-hover', 0);
						} else {
							that.show(this);
						}
					} else if (kc.inArray([KC.Tab, KC.Esc])) {
						if(div !== null && div.style.display !== 'none') {
							$.cancelBubble(ev);
						}
						that.hide();
					} else if (kc.inArray(ArrList) || kc.inArray(VimList) || kc.inArray(VimKey)) {
						$.cancelBubble(ev);
						if (kc.inArray(VimList)) {
							kc = ArrList[VimList.indexOf(kc)] || kc;
						}
						idx = kc.inArray([KCA.Left, KCA.Top]) ? idx - 1 : idx + 1;
						//Shift + F 表示光标焦点定位到编辑框中
						if (ev.shiftKey && kc === KCC.F) {
							return false;
						}
						that.select(idx, {keyCode: kc, shortcut: false, panel: that.con});
						return false;
					} else if (opt.shortcutKey && ev.shiftKey && (kc.inArray(numList) || kc.inArray(minList))) {
						var i = numList.indexOf(kc);
						if (i < 0) {
							i = minList.indexOf(kc);
						}
						$.trigger(that.buttons[i], 'click');
					} else if (kc >= KCC[0] && kc % KCC[0] < 10) {
						//数字序号定位 0 - 9 以及 10 11 123多位数组合
						that.select(kc % KCC[0], {keyCode: kc, shortcut: true, panel: that.con});
					} else if (kc.inArray([KC.Backspace, KC.Delete])) {
						that.select(null, {panel: that.con, delete: true});
					}
					return false;
				});
				return this;
			},
			setItemEvent: function (ddl) {
				var that = ddl,
					opt = that.options;

				if (!this.isRepeat(that.id + '-mousedown')) {
					$.addListener(that.box, 'mousedown', function(ev) {
						var elem = ev.target,
							tag = elem.tagName.toLowerCase(),
							css = elem.className,
							lbl = elem;

						if (opt.focusable && (!opt.showSearch && !opt.editable)) {
							//防止mousedown事件冒泡，保持控件不失去焦点
							$.cancelBubble(ev);
						}
						if (tag === 'u') {
							lbl = elem.parentNode.parentNode;
						} else if (tag !== 'label' || css.indexOf('oui-ddl-label') < 0) {
							lbl = elem.parentNode;
						}
						if (lbl.className.indexOf('oui-ddl-label') < 0) {
							return false;
						}
						var idx = ($.getAttribute(lbl, 'opt-idx') || '').toInt(),
							node = that.nodes[idx - 1];

						if(node) {
							Factory.setItemIdx(that, idx);

							var val = node.value,
								txt = node.text + (node.desc ? ' - ' + node.desc : '');
							if ($.isFunction(opt.beforeChange)) {
								opt.beforeChange(val, txt, function() {
									$.setAttribute(that.elem, 'opt-hover', 0);
									that.action(node, {click: true});
								});
							} else {
								$.setAttribute(that.elem, 'opt-hover', 0);
								that.action(node, {click: true});
							}
						}

					});
				}
				return this;
			},
			setElemProperty: function (ddl) {
				var that = ddl,
					elem = that.elem;

				Object.defineProperty(elem, 'val', {
					/*
					value: 'hello',
					writable: true,
					configurable: true,
					*/
					get: function () {
						return elem.value;
					},
					set: function (val) {
						$.console.log('set [property]', elem.id, val, typeof val);
						if (val !== undefined) {
							elem.inputValue = val;
							that.set(val, {edit: that.options.editable});
							elem.inputValue = null;
						}
					}
				});
				return this;
			},
			initValue: function (ddl) {
				var that = ddl,
					opt = that.options,
					elem = opt.select ? that.elem : that.text,
					len = opt.items.length;

				Factory.setItemIdx(that, 0, len);

				that.elem.options.length = 0;
				if (that.text) {
					that.text.value = '';
				}

				return this;
			},
			toValue: function (val, type, dv) {
				if (type && type !== 'string') {
					switch(type) {
					case 'int': case 'long':
						val = parseInt(val, 10);
						break;
					case 'float': case 'double':
						val = parseFloat(val, 10);
						break;
					}
					if (isNaN(val)) {
						return dv || 0;
					}
				}
				return val;
			},			
			findNode: function (elem) {
				var arr = Factory.getItemIdxArr(elem),
					cur = Factory.getItemIdx(elem),
					idx = cur;

				if (arr.length <= 0) {
					return idx;
				}

				if (arr.indexOf(idx) < 0) {
					idx = arr[0];
				} else {
					for (var i = 0; i < arr.length; i++) {
						if (idx === arr[i]) {
							idx = arr[i + 1];
							break;
						}
					}
					if (!idx) {
						idx = arr[0];
					}
				}
				return idx;
			},
			hideElem: function(elem, display) {
				if (display) {
					elem.style.display = 'none';
				} else {
					elem.style.visibility = 'hidden';
					elem.style.position = 'absolute';
					elem.style.top = -10000 + 'px';
					elem.style.left = -10000 + 'px';
				}
				return this;
			},
			setItemIdx: function (ddl, idx, len) {
				var that = ddl,
					elem = that.elem,
					text = that.text;

				if (elem) {
					$.setAttribute(elem, 'opt-idx', idx);
					if ($.isNumber(len)) {
						$.setAttribute(elem, 'opt-len', len);
					}
				}
				if (text) {
					$.setAttribute(text, 'opt-idx', idx);
					if ($.isNumber(len)) {
						$.setAttribute(text, 'opt-len', len);
					}
				}
				return this;
			},
			getItemIdx: function (elem) {
				return $.getAttribute(elem, 'opt-idx').toInt();
			},
			setItemIdxArr: function (ddl, indexs) {
				var that = ddl,
					elem = that.elem,
					text = that.text;

				if (elem) {
					$.setAttribute(elem, 'opt-idx-arr', indexs);
				}
				if (text) {
					$.setAttribute(text, 'opt-idx-arr', indexs);
				}
				return this;
			},
			getItemIdxArr: function (elem) {
				return $.getAttribute(elem, 'opt-idx-arr', '').toNumberList();
			},
			buildSkinClass: function (skin, prefix) {
				if (Config.IsDefaultSkin(skin)) {
					return '';
				}
				return prefix + '-' + skin;
			},
			setSearchCache: function (ddl, par) {
				var key = 'oui-search-' + ddl.id,
					cache = Cache.search[key];

				if (!$.isBoolean(par.search, true)) {
					par.nodes = [];
				}
				Cache.search[key] = $.extend({}, cache, par);
				return this;
			},
			getSearchCache: function (ddl) {
				return Cache.search['oui-search-' + ddl.id] || {};
			},
			getNodeCache: function (ddl, nodeId) {
				var idx = parseInt(nodeId, 10);
				var c = ddl.nodes.length;
				for (var i = 0; i < c; i++) {
					if (ddl.nodes[i].id === nodeId) {
						return ddl.nodes[i];
					}
				}
				return null;
			},
			buildSearch: function (ddl, box) {
				var opt = ddl.options;

				if (!opt.showSearch || ddl.nodes.length <= Config.SearchConditionCount) {
					return this;
				}
				var div = document.createElement('div'), first = box.childNodes[0];
				div.className = 'search oui-ddl-search';
				div.innerHTML = [
					'<input type="text" class="keywords oui-ddl-keywords" placeholder="', 
					//opt.searchPrompt || '请输入关键字',
					opt.searchPrompt || '\u8bf7\u8f93\u5165\u5173\u952e\u5b57',
					'" maxlength="', opt.keywordsLength, '" />',
					//搜索
					//'<a class="search oui-ddl-search" title="', opt.searchText || '\u641c\u7d22', '"></a>',
					//查找
					'<a class="btn btn-search oui-ddl-search" title="', opt.searchText || '\u67e5\u627e', '"></a>',
					//取消
					'<a class="btn btn-cancel oui-ddl-cancel hide" title="', '\u53d6\u6d88', '"></a>'
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
					Factory.searchNodes(ddl, txt, this);
				});
				$.addListener(no, 'mousedown', function(ev) {
					Factory.showSearchPanel(ddl, false, true);
					txt.value = '';
					$.setElemClass(no, 'hide', true);
				});
				
				$.addListener(txt, 'mousedown', function(ev) {
					Factory.showSearchPanel(ddl, true);
				});
				$.addListener(txt, 'keyup', function(ev) {
					var kc = $.getKeyCode(ev);
					if (kc === KC.Enter || opt.realSearch || txt.value.trim() === '') {
						Factory.searchNodes(ddl, txt, this);
					}
				});
				$.addListener(txt, 'blur', function(ev) {
					if (txt.value.trim()) {
						$.setElemClass(no, 'hide', false);
					} else {
						$.setElemClass(no, 'hide', true);
					}
				});

				ddl.frm = div;

				Factory.setSearchCache(ddl, { form: div, elem: txt, btn: btn, no: no });

				return this;
			},
			clearSearch: function(ddl) {
				var txt = ddl.box.querySelector('input.keywords'),
					no = ddl.box.querySelector('a.btn-cancel');

				txt.value = '';

				$.setElemClass(no, 'hide', true);

				Factory.setSearchCache(ddl, { search: false, key: '' }).showSearchPanel(ddl, false);

				return this;
			},
			showSearchForm: function (ddl) {
				var opt = ddl.options,
					cfg = Factory.getSearchCache(ddl);

				if (opt.showSearch) {
					if (!cfg.form) {
						Factory.buildSearch(ddl, ddl.box);
					} else if (cfg.form.style.display === 'none') {
						cfg.form.style.display = 'block';
					}
				} else if (cfg.form) {
					cfg.form.style.display = 'none';
					Factory.showSearchPanel(ddl, false ,true);
				}
				return Factory.setPanelSize(ddl, null, true);
			},
			setPanelSize: function (ddl) {
				if (!ddl.options.showSearch || !ddl.frm) {
					return this;
				}
				var txt = ddl.frm.querySelector('.keywords'), w = 0;
				if (txt) {
					w = $.getOffset(ddl.frm).width - 10;
					txt.style.width = w + 'px';
					txt.style.minWidth = w + 'px';
					txt.style.maxWidth = w + 'px';
				}

				return this;
			},
			showSearchPanel: function(ddl, show, force) {
				if (!ddl.box || (!force && !ddl.options.showSearch)) {
					return this;
				}
				var cfg = Factory.getSearchCache(ddl),
					div = ddl.box.querySelector('div.search-result-panel');

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
					Factory.setSearchCache(ddl, { search: false, key: '' });
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
			showSearchResult: function (ddl, nodes, keys) {
				//console.log('showSearchResult:', nodes, keys);

				var div = ddl.box.querySelector('div.search-result-panel'),
					show = nodes ? true : undefined, elems,
					i, c = nodes.length, node, dr, name, text, title, html = [];

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
					Factory.setSearchCache(ddl, { title: elems[0], panel: elems[1] });

					$.addListener(elems[0].childNodes[1], 'click', function(ev) {
						Factory.showSearchPanel(ddl, false);
					});

					ddl.box.appendChild(div);

					$.addListener(div, 'mouseup,dblclick', function (ev) {
						var elem = ev.target, tag = elem.tagName.toLowerCase(), nid, node;
						if (tag != 'li' && elem.parentNode) {
							elem = elem.parentNode;
						}
						if (nid = $.getAttribute(elem, 'nid')) {
							if (node = Factory.getNodeCache(ddl, nid)) {
								if (ddl.options.multi) {
									node.set(true);
									ddl.callback(ddl.options.callbackLevel);
								} else {
									Factory.setItemIdx(ddl, node.idx);
									ddl.action(node, {click: true});
								}
								if (ddl.options.clearSearch) {
									Factory.clearSearch(ddl);
								}
							}
						}
					});
				}
				var cache = Factory.getSearchCache(ddl),
					isSearchCode = false;

				if (cache.elem) {
					div.style.width = cache.elem.offsetWidth + 'px';
				}
				html.push('<ul>');

				for (var i = 0; i < c; i++) {
					node = nodes[i];
					dr = node.data || {};
					name = dr.name || dr.text || node.text;
					text = name.toString().escapeHtml();
					title = text + (isSearchCode && dr.code && name !== dr.code ? ' [' + dr.code + ']' : '');
		
					html.push([
						'<li nid="', node.id, '" title="', title, '">',
						text.replaceKeys(keys, '<b>', '</b>'),
						'</li>'
					].join(''));
				}
				html.push('</ul>');

				Factory.setSearchCache(ddl, { search: true });

				var height = c * Config.SearchResultItemHeight + Config.SearchResultTitleHeight + 2,
					//title = c > 0 ? '找到<b>' + c + '</b>个结果' : '没有找到结果',
					title = c > 0 ? 
						'\u627e\u5230<b>' + c + '</b>\u4e2a\u7ed3\u679c' 
						: '\u6ca1\u6709\u627e\u5230\u7ed3\u679c',
					max = Config.SearchResultBoxHeight,
					boxHeight = ddl.box.offsetHeight,
					display = $.isBoolean(show, div.style.display === 'none');

				if (height > max) {
					height = max;
				}
				//搜索框输入框高度30px，上边距5px
				if (height >= boxHeight - 30 - 5) {
					height = boxHeight - 30 - 5 - 30;
				}

				div.style.height = height + 'px';
				elems = div.childNodes;
				elems[1].style.height = (height - Config.SearchResultTitleHeight) + 'px';

				cache.title.childNodes[0].innerHTML = title;
				cache.panel.innerHTML = c > 0 ? html.join('') : '';

				return Factory.showSearchPanel(ddl, display);
			},
			gotoCurrent: function (ddl) {
				var opt = ddl.options,
					con = ddl.con,
					elem = opt.select ? ddl.elem : ddl.text;

				if (opt.multi) {
					var nodes = [], c = ddl.nodes.length, idx = ddl.gotoIdx || 0;
					for (var i = 0; i < c; i++) {
						if (ddl.nodes[i].checked) {
							nodes.push(ddl.nodes[i]);
						}
					}
					if (idx >= nodes.length) {
						idx = 0;
					}

					if (nodes[idx]) {
						$.scrollTo(nodes[idx].label, con);
					}
					ddl.gotoIdx = idx + 1;
				} else {
					var idx = Factory.getItemIdx(elem),
						node = ddl.nodes[idx - 1];

					if (node) {
						$.scrollTo(node.label, con);
					}
				}
				
				return this;
			},
			distinct: function (arr) {
				var newArr = [], tmp = {}, v = '';
				for (var i = 0; i < arr.length; i++) {
					v = arr[i];
					if (v && !tmp['' + v]) {
						tmp['' + v] = v;
					}
				}

				for (var k in tmp) {
					//newArr.push(k);
					newArr.push(tmp[k]);
				}

				return newArr;
			},
			searchNodes: function (ddl, txt, btn) {
				//console.log('ddl:', txt, txt.value, ddl.nodes);
				var nodes = [],
					opt = ddl.options,
					cfg = Factory.getSearchCache(ddl),
					val = txt.value.trim(),
					key = val,
					//匹配模式：0-字符匹配，1-通配符匹配，2-正则匹配
					type = (val.length > 2 && val.startsWith('/') && val.endsWith('/')) ? 2 : 
						(val.indexOf('*') > -1 || val.indexOf('?') > -1) ? 1 : 0,
					node, pattern,
					keys = Factory.distinct(val.split(/[\s,;|]/)),
					c = keys.length, i;

				if (!$.isString(key, true)) {
					Factory.setSearchCache(ddl, { key: '', search: false })
						.showSearchPanel(ddl, false)
						.gotoCurrent(ddl);

					$.setElemClass(cfg.no, 'hide', true);

					return this;
				}
				
				$.setElemClass(cfg.no, 'hide', false);

				if (cfg.key === key) {
					return Factory.showSearchPanel(ddl, true);
				}

				function _match(pattern, content) {
				    var pn = pattern.length, cn = content.length;
				    if (!pn && !cn) {
				        return true;
				    } else if (pn > 1 && pattern[0] === '*' && !cn) {
				        return false;
				    } else if ((pn > 1 && pattern[0] === '?') || (pn && cn && pattern[0] === content[0])) {
				        return _match(pattern.substring(1), content.substring(1));
				    } else if (pn && pattern[0] === '*') {
				        return _match(pattern.substring(1), content) || _match(pattern, content.substring(1));
				    }
				    return false;
				}

				if (type === 2) {
					pattern = new RegExp(key.substring(1, key.length - 1));
				}

				if ($.isFunction(opt.searchCallback)) {
					opt.searchCallback(ddl, keys, function (tree, results) {
						nodes = $.extend([], results);
					});
				} else {
					//var isSearchCode = (opt.searchFields || '').indexOf('code') > -1, dic = {};
					var isSearchCode = opt.searchFields.indexOf('code') > -1, dic = {};
					//var isSearchCode = false, dic = {};
					for (var k in ddl.nodes) {
						var n = ddl.nodes[k], k = n.id, code = n.data.code || '',
							text = n.text || '';
						switch (type){ 
						case 0:
							for (i = 0; i < c; i++) {
								if (!dic[k] && (text.indexOf(keys[i]) > -1 || (isSearchCode && code && code.indexOf(keys[i]) > -1))) {
									nodes.push(n);
									dic[k] = 1;
								}
							}
							break;
						case 1:
							if (!dic[k] && (_match(key, text) || (isSearchCode && code && _match(key, code)))) {
								nodes.push(n);
								dic[k] = 1;
							}
							break;
						case 2:
							if (!dic[k] && (pattern.test(text) || (isSearchCode && code && pattern.test(code)))) {
								nodes.push(n);
								dic[k] = 1;
							}
							break;
						}
					}
				}
				Factory.setSearchCache(ddl, { key: key, elem: txt, search: true, nodes: nodes });

				return Factory.showSearchResult(ddl, nodes, keys);
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
		initial: function (par) {
			var that = this;
			that.id = par.id;
			that.idx = par.idx;
			that.use = $.isBoolean(par.use, true);
			that.elem = par.elem;
			that.data = par.data;
			that.type = par.type;
			that.multi = par.multi;
			that.item = par.item;
			that.label = par.label;
			that.input = par.input;
			that.value = par.value || par.input.value;
			that.code = par.code || $.getAttribute(par.input, 'code') || '';
			that.text = par.text || $.getAttribute(par.input, 'text');
			that.desc = par.desc || $.getAttribute(par.input, 'desc');
			that.checked = par.checked || par.input.checked;
			that.disabled = $.isBoolean(par.disabled, false);
			that.dc = $.getAttribute(par.input, 'dc') === '1';
			that.childs = [];

			if (that.checked) {
				that.set(true);
			}
			that.input.onchange = function() {
				that.elem.focus();
			};
			return that;
		},
		set: function (checked, clickEvent) {
			var that = this;
			if (that.disabled) {
				return that;
			}
			$.setClass(that.item, 'cur', checked);
			that.checked = checked;
			if (that.input.type === 'checkbox') {
				//复选框 点击事件 负负得正
				that.input.checked = clickEvent ? !that.checked : that.checked;
			} else {
				that.input.checked = that.checked;
			}
			return that;
		},
		//dc: defaultChecked - 是否默认选中 
		setVal: function (ac, dc) {
			var node = this;
			node.set(ac);
			if (dc) {
				node.dc = true;
				$.setAttribute(node.input, 'dc', 1);
			}
			return node;
		}
	};

	function DropDownList(options) {
		var opt = Factory.checkOptions($.extend({
			id: '',
            skin: Config.DefaultSkin,       //样式: default, blue等
			element: undefined,
			//指定Id/Value字段，有时需要用别的字段当id字段来用，比如用 code 表示 id
			field: '',
			//指定复选框checkbox或单选框radio的name属性
			name: '',
			//选项未选中时的默认显示文字
			title: '',
			//默认值（优先于index）
			value: undefined,
			//是否复制ID值为desc值
			desc: undefined,
			//数据类型：int,float,string 默认为string
			dataType: undefined,
			//默认选中项（单选有效）
			index: 0,
			//选项，JSON数组格式，示例： [{value|val|id:1, name|text|txt:'第1项',code:'',desc:'',use:1|0}]
			items: [],
			//是否树形结构
			tree: false,
			//是否获取下拉列表元素原有的options，true-表示元素原有的选项+items
			origin: undefined,
			//是否下拉框： true - 下拉框， false - 文本框
			select: true,
			//自定义样式名
			className: '',
			//输入框自定义样式
			style: '',
			//列表框自定义样式
			boxStyle: '',
			//列表框宽度，默认不指定
			//follow - 表示固定跟随源控件宽度
			boxWidth: undefined,
			//box最小宽度
			minWidth: Config.BoxMinWidths[0],
			//box最大宽度
			maxWidth: Config.BoxMaxWidth,
			//box最小高度
			minHeight: Config.BoxMinHeight,
			//box最大高度，默认400像素
			maxHeight: Config.BoxMaxHeight,
			//布局： list-下拉列表，flow-流布局，grid-网格
			layout: 'list', //list, flow, grid
			//输入框宽度，默认跟随下拉框宽度
			textWidth: undefined,
			//输入框高度，默认不指定
			textHeight: undefined,
			//输入框最小高度，默认与bootstrap form-control 高度相同
			textMinHeight: 34,
			//网格布局时选项宽度: auto, cell, 百分比,如：50% 33%
			itemWidth: undefined,
			//列数（当列数设置不正确时，自动调整显示的列数）
			columns: undefined,
			//停靠位置：left-左下，right-右下
			position: 'left',
			//水平偏移量
			x: undefined,
			//垂直偏移量
			y: undefined,
			//宽度补偿
			w: undefined,
			//按钮位置：left-左，center-中，right-右
			buttonPosition: undefined,
			//当没有“全选/反选”按钮时是否显示“确定”按钮
			button: true,
			//显示的按钮数量：“确定” + “全选/反选/取消/默认”，最多5个按钮
			buttonLimit: undefined,
			//选项文字对齐方式：left,center,right
			textAlign: '',
			//是否显示序号(行号)
			number: false,
			//是否显示值内容
			display: false,
			//是否显示搜索
			showSearch: undefined,
			//搜索字段，默认只搜索显示的名称，也可以指定code（搜索code字段）
			searchFields: '',
			//实时搜索
			realSearch: undefined,
			//选中搜索项后清除搜索
			clearSearch: undefined,
			//是否支持按钮快捷键功能
			shortcutKey: true,
			//是否显示按钮快捷键数字
			shortcutNum: false,
			//非列表布局时，是否显示选项边框
			border: false,
			//是否多选，默认多选
			multi: true,
			//默认显示行数（列表模式下有效）
			lines: undefined,
			//多选项分隔符号
			symbol: ',',
			//是否允许空值（单选模式）
			allowEmpty: '',
			//多选最大数量限制
			maxLimit: 0,
			//多选数量限制提示
			maxLimitMsg: '',
			//是否显示选框,默认情况下：单选框不显示，复选框显示
			//若指定choose为true或false，则按指定规则显示
			choose: undefined,
			//回调等级：0-选项实时回调，1-全选/反选等按钮事件回调，2-确定按钮事件回调
			callbackLevel: 1,
			//是否防抖，多选模式下，点击选项时有效
			callbackDebounce: null,
			//防抖延迟，单位：毫秒
			debounceDelay: Config.DebounceDelay,
			//防抖间隔，单位：毫秒
			debounceTimeout: Config.DebounceTimeout,
			//回调函数
			callback: undefined,
			//初始化时是否回调，默认不回调
			initial: undefined,
			//完成后回调
			complete: undefined,
			//是否触发onchange事件
			change: true,
			//Function:选项切换时触发
			beforeChange: undefined,
			//是否允许扩展选项（可以自行输入不存在的选项值）
			editable: false,
			//选中选项后选框是否获取焦点
			focusable: true,
			config: {}
		}, options));

		if (opt.editable) {
			var cfg = $.extend({
				maxLength: null,
				dataType: null,
				minValue: null,
				maxValue: null,
				//找不到选项？请输入：
				placeholder: '\u627e\u4e0d\u5230\u9009\u9879\uff1f\u8bf7\u8f93\u5165\uff1a',
				//确定
				button: '\u786e\u5b9a',
				//是否保留输入框内容
				keep: true,
				//是否默认显示编辑框
				show: true
			}, options.config);

			cfg.maxLength = $.getParam(cfg, 'maxLength,maxlength', 64);
			cfg.dataType = $.getParam(cfg, 'dataType,datatype,valueType,valuetype', opt.dataType);
			cfg.minValue = $.getParam(cfg, 'minValue,minVal,min');
			cfg.maxValue = $.getParam(cfg, 'maxValue,maxVal,max');

			if (['ip', 'ipv4'].indexOf(cfg.dataType) > -1) {
				if (cfg.maxLength < 15) {
					cfg.maxLength = 15;
				}
			}

			opt.config = cfg;
		}

		this.id = opt.id;
		this.options = opt;
		this.nodes = [];
		this.indexs = {};
		this.activity = false;
		this.cache = {};

		this.initial();
	}

	DropDownList.prototype = {
		initial: function () {
			var that = this,
				opt = that.options,
				elem = opt.element,
				offset = $.getOffset(opt.element),
				//texts = ['请选择'],
				texts = ['\u8bf7\u9009\u62e9'];

			if (!$.isElement(elem)) {
				return that;
			}

			var tag = elem.tagName.toLowerCase(), type = elem.type;
			//下拉列表或文本框有效
			if (!tag.inArray('select,input') || (tag === 'input' && !type.inArray('text'))) {
				return that;
			}

			if (!opt.dataType) {
				opt.dataType = $.getAttribute(elem, 'data-type,dataType,datatype');
			}

			if (!$.isArray(opt.items)) {
				opt.items = [];
			}
			//保存原始的选项
			that.cache['originOptions'] = Factory.getElementOptionConfig(elem);

			//如果没有配置选项，则尝试从元素属性中获取
			if (opt.origin || opt.items.length <= 0) {
				opt.items = that.cache['originOptions'].concat(opt.items);
				if (elem.tagName === 'SELECT') {
					opt.index = opt.index || elem.selectedIndex || opt.index;
				}
			}

			if (opt.tree) {
				opt.items = $.toTreeList(opt.items);
				//树形结构必须是列表模式
				opt.layout = 'list';
			}

			var evchange = elem.onchange || null,
				evblur = elem.onblur || null;

			if (!opt.textWidth && (!opt.multi || opt.layout === 'list') 
				&& (isEditPage && elem.className.indexOf('form-control') > -1)) {
				opt.textWidth = 'auto';
			}
			var txtWidth = Factory.getStyleSize(opt.textWidth, offset.width),
				realWidth = parseInt(txtWidth, 10);

			if (tag === 'select') {
				that.elem = elem;
				var pageUrl = location.href.split('?')[0].toLowerCase(),
					isEditPage = pageUrl.indexOf('edit') > -1 || pageUrl.indexOf('form') > -1;

				if (!opt.select) {
					var txt = document.createElement('INPUT');
					txt.className = 'form-control oui-ddl-txt' + (opt.className ? ' ' + opt.className : '');
					$.setAttribute(txt, 'readonly', 'readonly');
					if (evchange) {
						txt.onchange = evchange;
					}
					if (evblur) {
						txt.onblur = evblur;
					}
					txt.style.cssText = [
						'background-color:#fff;padding: 0 20px 0 9px;',
						opt.textWidth === 'auto' || !realWidth ? '' : 'width:' + txtWidth + ';',
						opt.style ? opt.style + ';' : ''
					].join('');
					opt.element.parentNode.insertBefore(txt, elem);
					that.text = elem = txt;
					Factory.hideElem(that.elem, false);
				} else {
					that.text = null;
					elem = that.elem;
					if (opt.textWidth !== 'auto' && realWidth) {
						elem.style.width =  txtWidth;
					}
					//设置select默认显示的行数为1，即显示1行
					elem.size = 1;
				}
				elem.className = elem.className.addClass('oui-ddl oui-ddl-elem')
					.addClass(Factory.buildSkinClass(opt.skin, 'oui-ddl-elem'));

				opt.title = opt.title || (that.elem.options.length > 0 ? that.elem.options[0].text : '') || texts[0];
				//宽度补偿，用于input-group样式中的下拉列表框
				if (opt.w === 0 && (opt.boxWidth === 'follow' || !opt.boxWidth) && 
					parseInt($.getElementStyle(elem, 'borderRightWidth'), 10) <= 0) {
					opt.w = 1;
				}
			} else {
				var rid = opt.element.id || '';

				that.text = opt.element;
				$.setAttribute(that.text, 'readonly', 'readonly');
				that.text.style.cssText = (that.text.style.cssText || '') + [
					'background-color:#fff;padding: 0 20px 0 9px;',
					opt.style ? opt.style + ';' : '',
					opt.textWidth === 'auto' ? '' : 'width:' + Factory.getStyleSize(opt.textWidth, offset.width) + ';',
				].join('');
				var ddl = document.createElement('SELECT');
				ddl.className = that.text.className.addClass('oui-ddl oui-ddl-elem')
					.addClass(Factory.buildSkinClass(opt.skin, 'oui-ddl-elem'));

				opt.element.parentNode.insertBefore(ddl, opt.element);
				that.elem = ddl;
				//标记select创建
				that.ddl = true;
				ddl.style.width = Factory.getStyleSize(opt.textWidth || offset.width);

				if (evchange) {
					ddl.onchange = evchange;
				}
				if (evblur) {
					ddl.onblur = evblur;
				}
				opt.element.id = rid + '_oui_ddl_copy';
				that.elem.id = rid;

				if (opt.select) {
					Factory.hideElem(that.text, false);
					elem = that.elem;
				} else {
					Factory.hideElem(that.elem, false);
					elem = that.text;
				}                
				opt.title = opt.title || that.text.value || texts[0];
				
				that.text.className = that.text.className.addClass('oui-ddl oui-ddl-txt')
					.addClass(Factory.buildSkinClass(opt.skin, 'oui-ddl-txt'))
					.addClass(opt.className);
			}

			if (opt.textHeight) {
				elem.style.height = Factory.getStyleSize(opt.textHeight);
			}

			if (parseInt('0' + $.getElementStyle(elem, 'height'), 10) <= 20) {
				elem.style.minHeight = Factory.getStyleSize(opt.textMinHeight);
			}

			if (opt.select) {
				that.elem.options.length = 0;
				that.elem.options.add(new Option(opt.title || 'abcde', 'abc'));
			} else {
				that.text.value = opt.title || '';
				if (opt.form || opt.anchor) {
					that.elem.style.cssText = (that.elem.style.cssText || '') + Config.CssHidden;
				}
			}

			if (!opt.name) {
				opt.name = opt.title.replace(texts[0], '');
			}

			if (opt.layout === Config.Layout.Grid && opt.itemWidth === '') {
				opt.itemWidth = 'auto';
			}

			if (!Config.IsDefaultSkin(opt.skin)) {
                Factory.loadCss(opt.skin);
                return that.build(elem);
            }
			return that.build(elem);
		},
		build: function (element) {
			var that = this,
				opt = that.options,
				elem = element || (opt.select ? that.elem : that.text);

			$.createElement('DIV', function (box) {
				var offset = $.getOffset(opt.select ? that.elem : that.text),
					ua = navigator.userAgent,
					bs = {
						width: parseFloat(opt.boxWidth === 'follow' ? offset.width : opt.boxWidth, 10).round(2),
						min: opt.minWidth || (offset.width + 1),
						max: opt.maxWidth
					},
					maxHeight = opt.maxHeight,
					className = 'oui-ddl oui-ddl-panel'.addClass(Factory.buildSkinClass(opt.skin, 'oui-ddl-panel'));

				if (!isNaN(bs.width) && bs.width > opt.maxWidth) {
					opt.maxWidth = bs.width;
					bs.max = bs.width;
				}
				if (bs.min < offset.width) {
					bs.min = offset.width;
				}
				box.className = className;
				box.id = Config.IdPrefix + that.id;
				$.setAttribute(elem, 'opt-id', box.id);

				//设置关联关闭样式
				box.className = box.className.addClass(Config.CloseLinkageClassName);
				//设置关联关闭函数 
				box.hide = function () {
					that.hide();
				};

				var btn = Factory.buildButtons(that),
					key = Config.ItemPrefix + that.id,
					len = opt.items.length;

				if (btn.len >= 5 && opt.shortcutKey) {
					Factory.getSize(opt, bs);
				}

				if ($.isNumber(opt.minHeight)) {
					var minH = btn.len > 0 ? Config.BoxBarHeight: 0;
					minH += (len >= 3 ? Config.BoxMinHeights[1] : len * Config.BoxItemHeight);
					if (opt.minHeight < minH) {
						opt.minHeight = minH;
					}
					if (opt.maxHeight < minH) {
						opt.maxHeight = minH;
					}
				}
				maxHeight = opt.lines > 0 ? Config.BoxItemHeight * opt.lines + 2 : opt.maxHeight;

				box.style.cssText = [
					'display:none;top:', offset.top + offset.height - 1, 'px;left:', offset.left, 'px;',
					'min-width:', bs.min, 'px;',
					'max-width:', bs.max, 'px;',
					bs.width ? 'width:' + Factory.getStyleSize(bs.width) + ';' : '',
					'min-height:', Factory.getStyleSize(opt.minHeight), ';',
					opt.maxHeight ? 'max-height:' + Factory.getStyleSize(maxHeight+ (btn.len || btn.form ? Config.BoxFormHeight : 0)) + ';' : '',
					opt.boxStyle || ''
				].join('');


				var html = [
					'<ul class="oui-ddl-box oui-ddl-', opt.layout, '" id="', key, '_list">',
					Factory.buildItems(that, opt.items),
					'</ul>',
					btn.html
				];
				box.innerHTML = html.join('');
				box.show = false;
				that.box = box;
				that.className = box.className;
				that.con = box.childNodes[0];
				that.bar = box.childNodes[1];

				Factory.setNodes(that, false)
					.initValue(that)
					.setButtonEvent(that)
					.setElemEvent(that)
					.setItemEvent(that)
					.setElemProperty(that)
					.setEditEvent(that)
					.showSearchForm(that);

				if (!$.isUndefinedOrNull(opt.value) && (opt.value !== '' || !opt.multi)) {
					that.set(opt.value, {initial: true});
				} else if (!opt.multi) {
					if ($.isNumber(opt.index) && opt.index >= 0) {
						that.select(opt.index + 1, {panel: box, level: Config.CallbackLevel.Initial});
					}
				}

				that.complete(true).callback(Config.CallbackLevel.Initial);
			}, document.body);

			Factory.setWindowResize();

			return that;
		},
		update: function (arg) {
			var that = this,
				opt = that.options,
				key = Config.ItemPrefix + that.id,
				len = opt.items.length,
				items = $.extend([], arg.items, arg.options),
				par = $.extend({
					append: false,
					value: null
				}, arg);

			if (par.append) {
				opt.items = opt.items.concat(items);
			} else {
				opt.items = items;
			}

			if (opt.tree) {
				opt.items = $.toTreeList(opt.items);
			}

			Factory.clearItems(that, key + '_list')
				.buildItems(that, opt.items, key + '_list')
				.setNodes(that)
				.initValue(that);

			return that.size().position().set(par.value).complete();
		},
		select: function (num, arg) {
			var that = this,
				opt = that.options,
				nodes = that.nodes,
				len = nodes.length,
				lines = opt.lines > 1 ? opt.lines : Config.ItemDisplayLines,
				half = Math.ceil(lines / 2),
				elem = opt.select ? that.elem : that.text,
				idx = !$.isNumber(num) || num < 0 ? 0 : num > len ? len : num,
				cur = Factory.getItemIdx(elem),
				par = $.extend({
					keyCode: null,
					shortcut: null,
					panel: null,
					level: 0,
					delete: null
				}, arg),
				isNum = opt.dataType === 'int',
				isZero = nodes[0].value.toString() === '0',
				First = isNum && isZero ? 0 : 1;

			//backspace 或 delete，单选模式时，若首选项为空或0，则选中首选项
			if (!opt.multi && par.delete && nodes.length > 0 && idx <= 0) {
				var v = idx === 0 ? nodes[idx].value.toString() : null;
				if (v !== null && v.inArray(['','0', isNum ? '-1' : ''])) {
					idx = First;
				}
			}

			if (par.shortcut) {
				if (len >= 10) {
					//若是数字型选项，则优先选择内容，而不是序号
					var ni = cur * 10 + idx;
					if (ni > len) {
						ni = idx;
					}
					idx = ni;
				}
			} else {
				if ($.isNumber(par.keyCode)) {
					switch(par.keyCode) {
						// 37 - < 左箭头
						case KC.Arrow.Left: idx = First; break;
						// 39 - > 右箭头
						case KC.Arrow.Right: idx = len; break;
						// 77 - M键 (middle)，跳到中间位置
						case KC.Char.M: idx = Math.ceil(len / 2); break;
						// 68 - D (向下半屏)
						case KC.Char.D: idx = cur + half; break;
						// 85 - U (向上半屏)
						case KC.Char.U: idx = cur - half; break;
						// 70 - F (向下一屏)
						case KC.Char.F: idx = cur + lines; break;
						// 66 - B (向上一屏)
						case KC.Char.B: idx = cur - lines; break;
						// 67 - C 找到选中项的位置
						case KC.Char.C: idx = Factory.findNode(elem); break;
					}
					idx = idx <= 0 ? First : idx > len ? len : idx;
				}
				if ((idx > 0 && idx === cur) || (idx > 0 && !nodes[idx - 1])) {
					return that;
				}
			}
			Factory.setItemIdx(that, idx);
			var nidx = idx - (isNum && isZero && idx < len ? 0 : 1);
			$.scrollTo(nodes[nidx < 0 ? 0 : nidx].label, par.panel);

			if (opt.multi) {
				for (var i = 0; i < nodes.length; i++) {
					$.setClass(nodes[i].label, 'oui-ddl-hover', i === nidx);
				}
				$.setAttribute(elem, 'opt-hover', idx);
			} else {
				that.action(nodes[nidx], {level: par.level});
				if (nidx < 0 && cur > 0) {
					nodes[cur - 1].set(false, false);
					that.get();
				}
			}
			return that;
		},
		action: function (node, arg) {
			var that = this,
				opt = that.options,
				nodes = that.nodes,
				multi = opt.multi,
				par = $.extend({
					show: false,
					click: false,
					level: 0
				}, arg);

			if ($.isNumber(node)) {
				node = nodes[node - 1];
			}
			if (!node) {
				return that.callback(par.level);
			}

			if (node.disabled) {
				return that;
			}

			if (multi) {
				//检测多选项的数量限制
				if (!node.checked && opt.maxLimit && that.list(true).length >= opt.maxLimit) {
					return that.msg();
				}
				node.set(!node.checked, par.click);
				$.setClass(node.label, 'oui-ddl-hover', false);
			} else {
				for (var i = 0; i < nodes.length; i++) {
					nodes[i].set(nodes[i].idx === node.idx, true);
				}
				if (!par.show && par.click) {
					that.hide();
				}
			}
			return that.callback(par.level);
		},
		msg: function() {
			var that = this, opt = that.options;
			//$.alert(opt.maxLimitMsg || ((opt.name || '') + '最多只能选择' + opt.maxLimit + '个'));
			$.alert(opt.maxLimitMsg || ((opt.name || '') + '\u6700\u591a\u53ea\u80fd\u9009\u62e9' + opt.maxLimit + '\u4e2a'));
			return that;
		},
		set: function (val, arg) {
			var that = this,
				opt = that.options,
				nodes = that.nodes,
				elem = that.elem,
				par = $.extend({
					action: true,
					checked: false,
					initial: false,
					edit: false
				}, arg),
				idx = 0;

			if ($.isUndefinedOrNull(val)) {
				val = '';
			}

			if (par.action && opt.maxLimit && that.list(true).length >= opt.maxLimit) {
				$.console.log('set [limit]:', that.id, opt.maxLimit);
				return that.msg();
			}

			if ($.isNumber(par.action)) {
				switch (par.action) {
					case 0:
					case 1:
						for (var i = 0; i < nodes.length; i++) { nodes[i].set(par.action); }
						break;
					case 2:
						for (var i = 0; i < nodes.length; i++) { nodes[i].set(!nodes[i].checked); }
						break;
					case 3:
						for (var i = 0; i < nodes.length; i++) { nodes[i].set(nodes[i].dc); }
						break;
				}
			} else {
				par.action = $.isBoolean(par.action, true);
				par.checked = $.isBoolean(par.checked, false);
				
				if (par.edit && !Factory.isInList(nodes, val)) {
					for (var i = 0; i < nodes.length; i++) {
						if (nodes[i].checked) {
							nodes[i].set(false, false);
						}
					}
					idx = par.initial ? 1 : 0;
					Factory.setItemIdx(that, idx);
					if (idx > 0) {
						nodes[idx - 1].set(true, true);
					}
					if (!par.initial && opt.editable) {
						elem.inputValue = val;
						elem.focus();
						return that.callback(opt.callbackLevel).hide();
					}
					return that.get();
				}
				
				var vals = !$.isArray(val) ? val.toString().split(/[,\|]/) : val.join(',').split(',');
				if (opt.multi) {
					for (var i = 0; i < nodes.length; i++) {
						if (vals.indexOf(nodes[i].value) > - 1) {
							nodes[i].setVal(par.action, par.checked);
							idx = nodes[i].idx;
						}
					}
				} else {
					var c = 0;
					for (var i = 0; i < nodes.length; i++) {
						if (nodes[i].value === vals[0]) {
							nodes[i].setVal(c <= 0 ? par.action : false, par.checked);
							if (c <= 0 && par.action) {
								idx = nodes[i].idx;
							}
							c++;
						} else {
							nodes[i].setVal(false, par.checked);
						}
					}
				}
			}
			if (opt.maxLimit) {
				var list = that.list(true), len = list.length, vals = [];
				if (len > opt.maxLimit) {
					that.msg();
					for (var i = opt.maxLimit; i < len; i++) {
						vals.push(list[i]);
					}
					that.set(vals, {action: false});
				}
			}
			if (!opt.multi) {
				//单选模式，如果没有指定选中项，则设置选中第1项
				if (nodes.length > 0 && idx >= 0 && idx <= nodes.length) {
					nodes[idx - (idx > 0 ? 1 : 0)].set(true, false);
					Factory.setItemIdx(that, idx);
					that.get();
					if (par.edit) {
						return that.callback(opt.callbackLevel).hide();
					}
				}
			} else {
				that.get();
			}
			return that;
		},
		list: function (selected) {
			var that = this, nodes = that.nodes, list = [];
			for (var i = 0; i < nodes.length; i++) {
				if (selected) {
					if (nodes[i].checked) {
						list.push(nodes[i].id);
					}
				} else {
					list.push(nodes[i].id);
				}
			}
			return list;
		},
		get: function () {
			var that = this,
				opt = that.options,
				elem = opt.select ? that.elem : that.text,
				nodes = [],
				datas = [],
				vals = [],
				txts = [],
				cons = [],
				idxs = [],
				single = !opt.multi,
				c = 0,
				txt = '',
				val = '',
				con = '',
				cur = Factory.getItemIdx(elem);

			for (var i = 0; i < that.nodes.length; i++) {
				var n = that.nodes[i], desc;
				if (!n.disabled && n.checked) 	{
					val = n.value.toString().trim();
					txt = n.text.toString().trim();
					desc = single && n.desc && n.text !== n.desc ? ' - ' + n.desc : '';
					if (val !== '') {
						vals.push(Factory.toValue(val, opt.dataType));
					}
					if (single && opt.display && val !== txt) {
						txt = (val !== '' ? val + ' - ' : '') + txt;
					}
					txts.push(txt + desc);
					nodes.push(n);
					datas.push(n.data);
					con = n.code.toString().trim();
					if (con) {
						cons.push(con);
					}
					idxs.push(n.idx);
					c++;
				}
			}
			if (vals.length <= 0 && !$.isUndefinedOrNull(that.elem.inputValue)) {
				vals.push(Factory.toValue(that.elem.inputValue, opt.dataType));
				txts.push(that.elem.inputValue);
			}
			txt = $.clearEmptyItem(txts).join(opt.symbol || ',') || opt.title || '';
			val = vals.join(',');
			con = cons.join(',');

			if (!opt.multi) {
				val = Factory.toValue(val, opt.dataType);
			} else {
				if (idxs.indexOf(cur) < 0) {
					Factory.setItemIdx(that, idxs[0]);
				}
				Factory.setItemIdxArr(that, idxs.join(','));
			}

			//设置值
			that.elem.options.length = 0;
			that.elem.options.add(new Option(txt, val));
			$.setAttribute(that.elem, 'code', con);

			if (that.text) {
				that.text.title = vals.length > 0 ? (opt.name ? opt.name + ': ' : '') + txt : '';
				//显示文字
				that.text.value = opt.select ? val : txt;
				$.setAttribute(that.text, 'value', opt.select ? val : txt);
				$.setAttribute(that.text, 'code', con);
			}
			//return val;
			return {value: val, text: txt, values: vals, texts: txts, datas: datas};
		},
		callback: function (callbackLevel) {
			var that = this,
				opt = that.options,
				data = that.get(),
				elem = opt.select ? that.elem : that.text,
				level = !$.isNumber(callbackLevel) ? 0 : (callbackLevel || 0);

			if (level === Config.CallbackLevel.Initial) {
				if (data.value === '') {
					return that;
				}
			} else if (opt.multi) {
				if (level < opt.callbackLevel) {
					return that;
				}
			}

			function __callback () {
				if ($.isFunction(opt.callback)) {
					opt.callback(data.value, level === Config.CallbackLevel.Initial, data, that);
				} else if ($.isDebug()) {
					$.console.log(that.id, '[callback]', ', value:', data.value, ', data:', data, that);
				}
				if (opt.change) {
					$.trigger(elem, 'change');
				}
			}

			if ((opt.initial || level !== Config.CallbackLevel.Initial)) {
				if (opt.callbackDebounce) {
					$.debounce({
						delay: opt.debounceDelay, timeout: opt.debounceTimeout
					}, function() {
						__callback();
					});
				} else {
					__callback();
				}
			}
			return that;
		},
		complete: function (initial) {
			var that = this,
				opt = that.options,
				data = that.get();

			if ($.isFunction(opt.complete)) {
				opt.complete(data.value, $.isBoolean(initial, false), data, that);
			} else if ($.isDebug()) {
				$.console.log(that.id, '[complete]', ', value:', data.value, ', initial:', initial, ', data:', data, that);
			}
			return that;
		},
		show: function (elem) {
			var that = this,
				opt = that.options,
				show = true,
				box = that.box,
				i;

			if (elem) {
				show = !box.show;
			}
			if (!show) {
				return that.hide();
			}
			if ($.isElement(box)) {
				//先取消高度设置
				box.style.height = 'auto';
				//再显示下拉列表
				box.style.display = show ? 'block' : 'none';
				box.show = show;
				$.setClass(opt.select ? that.elem : that.text, 'oui-ddl-cur', show);
				if (!Config.IsDefaultSkin(opt.skin)) {
					$.setClass(opt.select ? that.elem : that.text, 'oui-ddl-cur-' + opt.skin, show);
				}

				that.get();
				//下拉列表位置停靠
				that.size().position();

				if (show) {
					var spans = document.querySelectorAll('#' + Config.IdPrefix + opt.id + ' .oui-ddl-li-txt');
					for (i = 0; i < spans.length; i++) {
						spans[i].title = $.getOffset(spans[i]).height > Config.BoxItemHeight ? spans[i].innerHTML.filterHtml() : '';
					}
					Factory.setPanelSize(that);
				}
			}
			return that.activity = true, that;
		},
		hide: function () {
			var that = this,
				opt = that.options;

			if ($.isElement(that.box) && that.box.style.display !== 'none') {
				that.box.style.display = 'none';
				that.box.show = false;
				that.activity = false;
				$.removeClass(opt.select ? that.elem : that.text, 'oui-ddl-cur,oui-ddl-cur-top,oui-ddl-cur-bottom');
				$.removeClass(opt.select ? that.elem : that.text, 'oui-ddl-bottom,oui-ddl-top');
			}
			return that;
		},
		size: function (size) {
			var that = this,
				opt = that.options,
				box = that.box,
				offset = $.getOffset(opt.select ? that.elem : that.text),
				bs = {
					width: opt.boxWidth,
					min: opt.minWidth,
					max: opt.maxWidth
				}, i;

			if (that.items.length <= 0 || that.box.style.display === 'none') {
				return that;
			}

			offset.width += opt.w;

			//先清除选项内容框高度
			that.con.style.height = 'auto';

			//宽度不能小于宿主框宽度
			if (bs.min < offset.width) {
				bs.min = offset.width;
			}
			if ($.isObject(size) || $.isNumber(size)) {
				bs.width = size.width || size;
				if (bs.width > bs.max) {
					bs.max = bs.width;
				}
			} else if (opt.boxWidth === 'follow' || (!opt.boxWidth && !opt.multi)) {
				bs.width = offset.width;
				if (bs.width > bs.max) {
					bs.max = bs.width;
				}
				if (bs.width < bs.min) {
					bs.min = bs.width;
				}
			}

			if (that.buttons.length >= 5 && opt.shortcutKey) {
				Factory.getSize(opt, bs);
			}

			box.style.width = bs.width + 'px';
			box.style.minWidth = bs.min + 'px';
			box.style.maxWidth = bs.max + 'px';

			that.formSize(bs.width || bs.max);

			var barH = $.getOffset(that.bar).height,
				frmH = $.getOffset(that.frm).height;

			//行列布局时，当选项内容宽度超过预设的宽度时，动态调用列数，以使行列对齐
			if (opt.layout !== 'list' && $.isNumber(opt.columns) && opt.columns > 0) {
				var i, w = 0, 
					cs = opt.columns, 
					bw = that.items[0].parentNode.offsetWidth, rw, 
					cw = parseFloat(100 / cs, 10).round(2),
					nw = cw;

				//先以预设的列数显示
				for (i = 0; i < that.items.length; i++) {
					that.items[i].style.minWidth = cw + '%';
				}
				//获取实际的选项内容最大宽度
				for (i = 0; i < that.items.length; i++) {
					rw = that.items[i].offsetWidth;
					if (rw > w) {
						w = rw;
					}
				}
				//重新动态设置列数
				if (w > parseFloat(bw / opt.columns, 10).round(2)) {
					cs = parseInt(bw / w, 10) || 1;
					cw = parseFloat(100 / cs, 10).round(2);
					if (cw !== nw) {
						for (i = 0; i < that.items.length; i++) {
							that.items[i].style.minWidth = cw + '%';
						}
					}
				}
			}
			//先清除选项内容框高度
			that.con.style.height = 'auto';
			//再设置选项内容框高度
			that.con.style.height = ($.getOffset(box).height - barH - frmH - 2) + 'px';
			
			return that;
		},
		position: function () {
			var that = this,
				cfg = {
					topPriority: false,
					relativePosition: null,
				},
				opt = that.options,
				bs = $.getBodySize(),
				box = that.box,
				con = that.con,
				ds = $.getOffset(box),
				elem = opt.select ? that.elem : that.text,
				idx = Factory.getItemIdx(elem),
				node = that.nodes[idx - 1],
				es = $.getOffset(elem),
				left = es.left,
				top = es.top + es.height + (opt.y || 0),
				pos = 'bottom',
				dir = '';

			//清除选项框高度
			box.style.height = 'auto';
			//先显示在目标控件的下方
			box.style.top = top + 'px';

			//再获取选项框尺寸位置
			ds = $.getOffset(box), top = ds.top;
			//如果选项框高度大于窗口高度，则限制选项框高度
			if (ds.height > bs.height) {
				ds.height = bs.height - 6;
				box.style.height = ds.height + 'px';
			}

			var offset = ds.top + ds.height - (bs.height + bs.scrollTop);
			//如果选项框位置高度超过窗口高度，则显示在目标控件的上方
			if (offset > 0) {
				top = es.top - ds.height;
				box.style.top = top + 'px';
				pos = 'top';

				//如果选项框位置窗口小于滚动高度，需要设置选项框位置和位置偏移
				if (top < bs.scrollTop) {
					//保留4个像素的留白位置
					var whiteSpace = 4;

					if (cfg.topPriority) {
						//设置了顶部优先，则显示在目标控件的上方
						top = bs.scrollTop + whiteSpace;
					} else {
						//默认显示在目标控件下方，并向上偏移，偏移量即之前超出窗口高度的值
						top = es.top + es.height - offset - whiteSpace;
						pos = 'middle';

						if (top + ds.height >= bs.height) {
							var h = bs.height - 2 - Config.BodyPadding;
							if (opt.maxHeight && h > opt.maxHeight) {
								h = opt.maxHeight;
							}
							box.style.height = h + 'px';
							con.style.height = (h - (that.bar ? that.bar.offsetHeight : 0)) + 'px';
						}
					}
					box.style.top = top + 'px';
				}
			}

			if (opt.position === Config.Position.Right) {
				left = es.left + es.width - ds.width;
				if (left <= 0) {
					left = 0;
				}
				dir = box.offsetWidth > elem.offsetWidth + 4 ? 'right' : '';
			} else {
				if (left + ds.width > bs.width) {
					left -= (left + ds.width - bs.width);
				}                
				dir = box.offsetWidth > elem.offsetWidth + 4 ? 'left' : '';
			}
			box.style.left = (left + opt.x) + 'px';
			
			Factory.setRadius(elem, pos);

			if (box.style.display !== 'none') {
				$.addClass(elem, 'oui-ddl-cur-' + pos);

				var className = that.className + ' oui-ddl-panel-' + pos;
				if (dir) {
					className += ' oui-ddl-panel-' + pos + '-' + dir;
				}
				box.className = className;
			} else {
				$.removeClass(elem, 'oui-ddl-' + pos);
			}
			
			if (node) {
				$.scrollTo(node.label, con);
			}
			return that;
		},
		form: function (show, focus) {
			var that = this,
				opt = that.options,
				key = Config.ItemPrefix + that.id,
				elem = opt.select ? that.elem : that.text,
				offset = $.getOffset(elem),
				form = $I(key + '_form');

			if (form === null) {
				return that;
			}
			var display = opt.editable && ($.isBoolean(show) ? show : form.style.display === 'none');
			form.style.display = display ? 'block' : 'none';

			if (that.box.style.display === 'none') {
				return that;
			}
			if ($.isBoolean(focus, false)) {
				that.texts[0].focus();
			}
			if (parseInt(that.box.style.top, 10) > offset.top) {
				return that.formSize();
			}
			return that.size().position();
		},
		formSize: function (boxWidth) {
			var that = this,
				opt = that.options,
				box = that.box,
				bw = boxWidth || box.offsetWidth;

			//设置输入框宽度
			if (opt.editable && that.texts.length > 0) {
				var c = that.texts.length,
					fw = bw - 10 - that.texts[c - 1].offsetWidth,
					tw = parseFloat(fw / (c - 1), 10).round(2) - 4;

				for (var i = 0; i < c - 1; i++) {
					that.texts[i].style.width = tw + 'px';
					that.texts[i].style.display = 'block';
				}
			}
			return that;
		},
		focus: function (edit) {
			var that = this,
				opt = that.options,
				elem = opt.select ? that.elem : that.text;

			if (edit) {
				if (opt.editable && that.texts.length > 0 && that.texts[0].style.display !== 'none') {
					that.texts[0].focus();
				}
			} else {
				elem.focus();
			}
			return that;
		},
		value: function (value, append) {
			var that = this,
				opt = that.options,
				elem = opt.select ? that.elem : that.text;

			that.set(value, {edit: opt.editable});

			if (opt.editable && that.texts.length > 0) {
				if (!Factory.isInList(that.nodes, value)) {
					that.texts[0].value = value;
				}
			}

			return that;
		},
		isClosed: function () {
			var that = this;
			return !that.activity;
		}
	};

	$.extend({
		dropdownlist: function (id, par) {
			return Factory.buildList(id, par);
		},
		ddlist: function (id, par) {
			return Factory.buildList(id, par);
		},
		singlelist: function (id, par) {
			return Factory.buildList(id, par, true);
		}
	});

	$.extend($.dropdownlist, {
		get: function(id) {
			var cache = Factory.getCache(id);
			if (cache) {
				return cache.ddl.get();
			}
			return '';
		},
		set: function(id, values, action, defaultChecked) {
			var cache = Factory.getCache(id);
			if (cache) {
				return cache.ddl.set(values, {action: action, checked: defaultChecked});
			}
			return this;
		},
		update: function (id, par, single) {
			if ($.isObject(id) && $.isUndefined(par)) {
				par = id;
				id = null;
			}
			if ($.isArray(par)) {
				par = {items: par};
			}
			var cache = Factory.getCache(id);
			if (cache) {
				return cache.ddl.update(par);
			}
			return Factory.buildList(id, par, single);
		},
		value: function(id, value, append) {
			var cache = Factory.getCache(id);
			if (cache) {
				cache.ddl.value(value, append);
				return this;
			}
			elem = $.toElement(elem);
			if (!$.isElement(elem)) {
				return this;
			}
			elem.value = value;
			elem.val = value;
			return this;
		}
	});

	$.extend($.singlelist, {
		get: function(id) {
			return $.dropdownlist.get(id);
		},
		set: function(id, values, action, defaultChecked) {
			return $.dropdownlist.set(id, values, action, defaultChecked);
		},
		update: function (id, par) {
			return $.dropdownlist.update(id, par, true);
		},
		value: function(elem, value, append) {
			return $.dropdownlist.value(elem, value, append);
		}
	});

	$.extend($.ddlist, {
		get: function(id) {
			return $.dropdownlist.get(id);
		},
		set: function(id, values, action, defaultChecked) {
			return $.dropdownlist.set(id, values, action, defaultChecked);
		},
		update: function (id, par) {
			return $.dropdownlist.update(id, par);
		},
		value: function(elem, value, append) {
			return $.dropdownlist.value(elem, value, append);
		}
	});
}(OUI);