
/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.dropdownlist 下拉列表插件
*/

!function ($) {

    var SelfPath = $.getScriptSelfPath(true);

    var Config = {
        FilePath: SelfPath,
        FileDir: $.getFilePath(SelfPath),
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
        // 当高度超过浏览器窗口大小时，保留边距
        bodyPadding: 10,
        // 隐藏但是需要占位
        CssHidden: ';visibility:hidden;width:0px;height:0px;border:none;margin:0;padding:0;font-size:1px;line-height:0px;float:left;'
    },
        Cache = {
            ids: [],
            lists: {},
            events: {},
            caches: {}
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
            buildKey: function (id) {
                return 'oui_ddl_' + id;
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

                if (opt.single) {
                    opt.multi = false;
                }
                opt.callbackLevel = $.getParam(opt, 'submit,callbackLevel');
                if (!$.isNumber(opt.callbackLevel)) {
                    opt.callbackLevel = Config.CallbackLevel.Return;
                }

                opt.callbackDebounce = $.getParam(opt, 'callbackDebounce,debounce');

                //是否显示选框,默认情况下：单选框不显示，复选框显示
                //若指定display为true或false，则按指定规则显示
                if (!$.isBoolean(opt.display)) {
                    opt.display = opt.multi;
                }

                opt.allowEmpty = $.getParamValue(opt.allowEmpty, opt.empty);
                opt.boxWidth = $.getParamValue(opt.boxWidth, opt.width);
                opt.style = $.getParamValue(opt.style, opt.css);

                if (!$.isNumber(opt.maxLimit)) {
                    opt.maxLimit = 0;
                }
                if (!$.isString(opt.maxLimitMsg)) {
                    opt.maxLimitMsg = '';
                }

                return opt;
            },
            buildList: function (options) {
                var opt = $.extend({
                    id: '',
                    element: ''
                }, options);

                opt.id = opt.id || opt.element.id;

                var cache = Factory.getCache(opt.id);
                if (cache) {
                    return cache.ddl;
                }
                var ddl = new DropDownList(opt);
                return Factory.setCache(opt, ddl), ddl;
            },
            getStyleSize: function (size) {
                if ($.isNumber(size)) {
                    return (size < 0 ? 0 : size) + 'px';
                } else if ($.isString(size)) {
                    return size.endWith('%') ? size : parseInt('0' + size, 10) + 'px';
                }
                return '0';
            },
            getItemConWidth: function (items, itemWidth, columns, display) {
                if (itemWidth === 'cell') {
                    var width = 0;
                    if (columns > 0) {
                        width = parseInt(100 / columns - 2, 10) + '%';
                    } else {
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
                    }
                    return width;
                }
                return itemWidth === 'auto' ? 0 : itemWidth;
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
                            d.size().position();
                        }
                    }
                });
                return this;
            }
        };

    //先加载样式文件
    Factory.loadCss();

    function Node(par) {
        this.initial(par);
    }

    Node.prototype = {
        initial: function (par) {
            var that = this;
            that.id = par.id;
            that.multi = par.multi;
            that.label = par.label;
            that.input = par.input;
            that.value = par.value || par.input.value;
            that.text = par.text || $.getAttribute(par.input, 'text');
            that.desc = par.desc || $.getAttribute(par.input, 'desc');
            that.checked = par.checked || par.input.checked;
            that.dc = $.getAttribute(par.input, 'dc') === '1';
            that.callback = par.callback;
            that.childs = [];

            that.label.onmousedown = function () {
                $.cancelBubble();
                if ($.isFunction(that.callback)) {
                    that.callback(that);
                }
            };
            if (that.checked) {
                that.set(true);
            }
            return that;
        },
        set: function (checked, clickEvent) {
            var that = this;
            $.setClass(that.label, 'oui-ddl-cur', checked);
            that.checked = checked;
            if (that.input.type === 'checkbox') {
                //复选框 点击事件 负负得正
                that.input.checked = clickEvent ? !that.checked : that.checked;
                //that.input.checked = !that.checked;
            } else {
                that.input.checked = that.checked;
            }

            return that;
        },
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
            name: '',
            title: '',
            element: '',
            //自定义样式名
            className: '',
            //输入框自定义样式
            style: '',
            //列表框自定义样式
            boxStyle: '',
            //列表框宽度，默认不指定
            //follow - 表示跟随源控件宽度
            boxWidth: '',
            //box最小宽度
            minWidth: 120,
            //box最大宽度
            maxWidth: 500,
            //box最小高度
            minHeight: 30,
            //box最大高度，默认不指定
            maxHeight: '',
            //布局： list-下拉列表，flow-流布局，grid-网格
            layout: 'list', //list, flow, grid
            //输入框宽度，默认跟随下拉框宽度
            textWidth: '',
            //网格布局时选项宽度
            itemWidth: '',
            //停靠位置：left-左下，right-右下
            position: 'left',
            //按钮位置：left-左，center-中，right-右
            buttonPosition: 'center',
            //当没有“全选/反选”按钮时是否显示“确定”按钮
            showButton: false,
            //非列表布局时，是否显示选项边框
            itemBorder: false,
            //是否允许扩展选项（可以自行输入不存在的选项值）
            editable: false,
            //是否单选，条件等级优先于multi
            single: false,
            //是否多选
            multi: true,
            //是否允许空值（单选模式）
            allowEmpty: '',
            //多选最大数量限制
            maxLimit: 0,
            //多选数量限制提示
            maxLimitMsg: '',
            //是否显示选框,默认情况下：单选框不显示，复选框显示
            //若指定display为true或false，则按指定规则显示
            display: null,
            //回调等级：0-选项实时回调，1-全选/反选等按钮事件回调，2-确定按钮事件回调
            callbackLevel: 1,
            //是否防抖，多选模式下，点击选项时有效
            callbackDebounce: false,
            //回调函数
            callback: null,
            //Function:选项切换时触发
            beforeChange: null
        }, options));

        this.id = opt.id;
        this.options = opt;
        this.nodes = [];
        this.indexs = {};
        this.activity = false;

        this.initial();
    }

    DropDownList.prototype = {
        initial: function () {
            var that = this,
                opt = that.options,
                elem = opt.element,
                //texts = ['-请选择-', '请选择'],
                texts = ['\u002d\u8bf7\u9009\u62e9\u002d', '\u8bf7\u9009\u62e9'];

            if (opt.element.tagName === 'SELECT') {
                var offset = $.getOffset(opt.element);
                elem = document.createElement('INPUT');
                elem.className = 'form-control oui-ddl-txt' + (opt.className ? ' ' + opt.className : '');
                $.setAttribute(elem, 'readonly', 'readonly');
                elem.style.cssText = [
                    'background-color:#fff;padding: 0 20px 0 9px;',
                    opt.textWidth === 'auto' ? '' : 'width:' + Factory.getStyleSize(opt.textWidth || offset.width) + ';',
                    opt.style ? opt.style + ';' : ''
                ].join('');
                opt.element.parentNode.insertBefore(elem, opt.element);
                that.text = elem;
                that.elem = opt.element;

                opt.title = opt.title || (that.elem.options.length > 0 ? that.elem.options[0].text : '') || texts[0];

            } else {
                that.text = opt.element;
                that.text.className += ' oui-ddl-txt' + (opt.className ? ' ' + opt.className : '');
                $.setAttribute(that.text, 'readonly', 'readonly');
                that.text.style.cssText = (that.text.style.cssText || '') + [
                    'background-color:#fff;padding: 0 20px 0 9px;',
                    opt.style ? opt.style + ';' : ''
                ].join('');
                elem = document.createElement('SELECT');
                opt.element.parentNode.insertBefore(elem, opt.element);
                that.elem = elem;

                opt.title = opt.title || that.text.value || texts[0];
            }
            that.text.value = opt.title || '';

            if (!opt.name) {
                opt.name = opt.title.replace(texts[0], '').replace(texts[1], '');
            }

            if (opt.form || opt.anchor) {
                that.elem.style.cssText = (that.elem.style.cssText || '') + Config.CssHidden;
            } else {
                that.elem.style.display = 'none';
            }
            $.addListener(that.text, 'mousedown', function () {
                that.show(this);
                Factory.closeOther(that);
            });

            if (opt.layout === Config.Layout.Grid && opt.itemWidth === '') {
                opt.itemWidth = 'auto';
            }

            return that.build();
        },
        build: function () {
            var that = this,
                opt = that.options;

            $.createElement('DIV', function (box) {
                var offset = $.getOffset(that.text),
                    ua = navigator.userAgent,
                    edge = ua.indexOf('Edg/') > 0 || ua.indexOf('Edge') > 0,
                    boxWidth = opt.boxWidth === 'follow' ? offset.width : opt.boxWidth,
                    width = parseInt(boxWidth, 10);

                if (!isNaN(width) && width > opt.maxWidth) {
                    opt.maxWidth = width;
                }

                box.className = 'oui-ddl oui-ddl-panel' + (edge ? ' oui-ddl-edge' : '');
                box.id = Config.IdPrefix + opt.id;
                box.style.cssText = [
                    'display:none;top:', offset.top + offset.height - 1, 'px;left:', offset.left, 'px;',
                    'min-width:', (opt.minWidth || (offset.width + 1)), 'px;',
                    'max-width:', (opt.maxWidth), 'px;',
                    boxWidth ? 'width:' + Factory.getStyleSize(boxWidth) + ';' : '',
                    'min-height:', Factory.getStyleSize(opt.minHeight), ';',
                    opt.maxHeight ? 'max-height:' + Factory.getStyleSize(opt.maxHeight) + ';' : '',
                    opt.boxStyle || ''
                ].join('');

                var btn = [],
                    len = opt.items.length,
                    selects = '',
                    oneBtn = true,
                    ac = opt.callbackLevel ? 'ok' : 'no',
                    //texts = ['取消', '全选', '反选', opt.restore ? '还原' : '默认', '确定'],
                    texts = ['\u53d6\u6d88', '\u5168\u9009', '\u53cd\u9009', opt.restore ? '\u8fd8\u539f' : '\u9ed8\u8ba4', '\u786e\u5b9a'];

                if (opt.multi) {
                    if (opt.layout !== Config.Layout.List && len > 3 || len > 5) {
                        selects = [
                            '<button class="btn btn-default btn-first" ac="1">', texts[1], '</button>',
                            '<button class="btn btn-default" ac="2">', texts[2], '</button>',
                            '<button class="btn btn-default" ac="0">', texts[0], '</button>',
                            '<button class="btn btn-default" ac="3">', texts[3], '</button>',
                        ].join('');
                        oneBtn = false;
                    }
                    if (!oneBtn || opt.callbackLevel > 0 || opt.showButton) {
                        btn.push('<div class="oui-ddl-oper oui-ddl-oper-' + opt.layout + '" style="text-align:' + (opt.buttonPosition || 'center') + ';">');
                        btn.push('<div class="btn-group btn-group-xs' + (oneBtn ? ' btn-group-block' : '') + '">');
                        btn.push(selects.join(''));
                        btn.push('<button class="btn btn-primary btn-' + ac + (oneBtn ? ' btn-block' : '') + '" ac="' + ac + '">', texts[4], '</button>');
                        btn.push('</div>');
                        btn.push('</div>');
                    }
                }

                var html = [
                    '<ul class="oui-ddl-box oui-ddl-', opt.layout, '">'
                ], i, key = Config.ItemPrefix + that.id;

                var columns = opt.columns || opt.cells || 0,
                    conWidth = Factory.getItemConWidth(opt.items, opt.itemWidth, columns, opt.display),
                    minWidth = opt.layout === Config.Layout.Grid ? conWidth : 0;

                if (!opt.multi && opt.allowEmpty) {
                    html.push([
                        '<li class="oui-ddl-item" style="',
                        opt.layout !== Config.Layout.List ? 'float:left;' : '',
                        opt.layout === Config.Layout.Grid ? 'min-width:' + Factory.getStyleSize(minWidth || opt.itemWidth) + ';' : '',
                        '">',
                        '<label  class="oui-ddl-label', opt.layout !== Config.Layout.List && opt.itemBorder ? ' oui-ddl-label-border' : '', '">',
                        '<input class="oui-ddl-chb"', checked,
                        ' type="', opt.multi ? 'checkbox' : 'radio', '"',
                        ' id="', '"',
                        ' name="', key, '"',
                        ' value="', '"',
                        ' text="', opt.allowEmpty, '"',
                        ' style="display:' + (opt.display ? '' : 'none') + ';"',
                        ' />',
                        '<span>', opt.allowEmpty, '</span>',
                        '</label>',
                        '</li>'
                    ].join(''));
                }
                for (i = 0; i < len; i++) {
                    var dr = opt.items[i];
                    if (dr === 'sep' || dr.sep || dr.type === 'sep') {
                        html.push(['<li class="oui-ddl-item oui-ddl-sep"></li>'].join(''));
                    } else if (dr.head) {
                        html.push(['<li class="oui-ddl-item oui-ddl-head">', dr.name || dr.head, '</li>'].join(''));
                    } else {
                        var id = typeof dr.code !== 'undefined' ? dr.code : dr.id,
                            name = dr.name + (dr.desc && dr.name !== dr.desc ? ' - ' + dr.desc : ''),
                            chbId = key + dr.id,
                            checked = dr.checked || dr.dc ? ' checked="checked" dc="1"' : '',
                            use = dr.enabled || dr.use,
                            disabled = dr.disabled ? ' disabled="disabled"' : '';
                        html.push([
                            '<li class="oui-ddl-item" style="',
                            opt.layout !== Config.Layout.List ? 'float:left;' : '',
                            opt.layout === Config.Layout.Grid ? 'min-width:' + Factory.getStyleSize(minWidth || opt.itemWidth) + ';' : '',
                            '">',
                            '<label  class="oui-ddl-label', opt.layout !== Config.Layout.List && opt.itemBorder ? ' oui-ddl-label-border' : '', '">',
                            '<input class="oui-ddl-chb"', checked,
                            ' type="', opt.multi ? 'checkbox' : 'radio', '"',
                            ' id="', chbId, '"',
                            ' name="', key, '"',
                            ' value="', id, '"',
                            ' text="', (dr.name || '').filterHtml(true).replace(/[\"]/, "\\\""), '"',
                            ' desc="', (dr.desc || '').filterHtml(true).replace(/[\"]/, "\\\""), '"',
                            ' style="display:' + (opt.display ? '' : 'none') + ';"',
                            ' />',
                            '<span', (use || typeof use === 'undefined') ? '' : ' class="del"', '>', name, '</span>',
                            '</label>',
                            '</li>'
                        ].join(''));
                    }
                }
                html.push('</ul>');
                html.push(btn.join(''));

                box.innerHTML = html.join('');
                box.show = false;
                that.box = box;
                that.con = box.childNodes[0];
                that.bar = box.childNodes[1];

                $.addListener(document, 'mousedown', function (ev) {
                    if (!$.isInElement(that.box, ev) && !$.isInElement(that.text, ev)) {
                        that.hide();
                    }
                });
                $.addListener(document, 'keyup', function (e) {
                    if (27 === $.getKeyCode(e)) {   // Esc键值为27
                        that.hide();
                    }
                });

                var arr = $N(Config.ItemPrefix + that.id);
                for (i = 0; i < arr.length; i++) {
                    var chb = arr[i];
                    that.nodes.push(new Node({
                        id: chb.value,
                        label: chb.parentNode,
                        input: chb,
                        multi: opt.multi,
                        callback: function (node) {
                            var txt = node.text + (node.desc ? ' - ' + node.desc : '');
                            if ($.isFunction(opt.beforeChange)) {
                                opt.beforeChange(txt, function() {
                                    that.action(node);
                                });
                            } else {
                                that.action(node);
                            }                       
                        }
                    }));
                    that.indexs[chb.id] = i;
                }

                var btns = document.querySelectorAll('#' + Config.IdPrefix + opt.id + ' .oui-ddl-oper button');
                for (i = 0; i < btns.length; i++) {
                    btns[i].onclick = function () {
                        var ac = $.getAttribute(this, 'ac');
                        if (ac === 'no') {
                            that.hide();
                        } else if (ac === 'ok') {
                            that.callback(Config.CallbackLevel.Return);
                            that.hide();
                        } else {
                            that.set('', parseInt(ac, 10));
                            that.callback(Config.CallbackLevel.Select);
                        }
                    };
                }
                that.callback(Config.CallbackLevel.Initial);
            }, document.body);

            Factory.setWindowResize();

            return that;
        },
        action: function (node) {
            var that = this,
                opt = that.options,
                nodes = that.nodes,
                multi = opt.multi;

            if (multi) {
                //检测多选项的数量限制
                if (!node.checked && opt.maxLimit && that.list(true).length >= opt.maxLimit) {
                    return that.msg();
                }
                node.set(!node.checked, true);
            } else {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].set(nodes[i].id === node.id, true);
                }
                that.hide();
            }
            if (multi && nodes.length > 1 && opt.callbackDebounce) {
                $.debounce({}, function() {
                    that.callback();
                });
            } else {
                return that.callback();
            }
        },
        msg: function() {
            var that = this, opt = that.options;
            //$.alert(opt.maxLimitMsg || ((opt.name || '') + '最多只能选择' + opt.maxLimit + '个'));
            $.alert(opt.maxLimitMsg || ((opt.name || '') + '\u6700\u591a\u53ea\u80fd\u9009\u62e9' + opt.maxLimit + '\u4e2a'));
            return that;
        },
        set: function (val, ac, dc) {
            var that = this,
                opt = that.options,
                nodes = that.nodes;

            if (ac && opt.maxLimit && that.list(true).length >= opt.maxLimit) {
                return that.msg();
            }

            if ($.isNumber(ac)) {
                switch (ac) {
                    case 0:
                    case 1:
                        for (var i = 0; i < nodes.length; i++) { nodes[i].set(ac); }
                        break;
                    case 2:
                        for (var i = 0; i < nodes.length; i++) { nodes[i].set(!nodes[i].checked); }
                        break;
                    case 3:
                        for (var i = 0; i < nodes.length; i++) { nodes[i].set(nodes[i].dc); }
                        break;
                }
            } else {
                ac = $.isBoolean(ac, true);
                dc = $.isBoolean(dc, false);

                var vals = !$.isArray(val) ? val.split(/[,\|]/) : val.join(',').split(',');
                if (opt.multi) {
                    for (var i = 0; i < nodes.length; i++) {
                        if (vals.indexOf(nodes[i].value) > - 1) {
                            nodes[i].setVal(ac, dc);
                        }
                    }
                } else {
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].value === vals[0]) {
                            nodes[i].setVal(ac, dc);
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
                    that.set(vals, false, false);
                }
            }

            that.get();

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
                nodes = that.nodes,
                vals = [],
                txts = [],
                single = !opt.multi,
                c = 0;

            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                if (n.checked) {
                    vals.push(n.value.trim());
                    txts.push(n.text.trim() + (single && n.desc && n.text !== n.desc ? ' - ' + n.desc : ''));
                    c++;
                }
            }
            //显示文字
            that.text.value = txts.join(',') || opt.title || '';
            that.text.title = vals.length > 0 ? (opt.name ? opt.name + ': ' : '') + that.text.value : '';
            //设置值
            that.elem.options.length = 0;
            that.elem.options.add(new Option(txts.join(','), vals.join(',')));

            return vals.join(',');
        },
        callback: function (callbackLevel) {
            var that = this,
                opt = that.options,
                vals = that.get(),
                level = callbackLevel || 0;

            if (level === Config.CallbackLevel.Initial) {
                if (vals === '') {
                    return that;
                }
            } else if (opt.multi) {
                if (level < opt.callbackLevel) {
                    return that;
                }
            }
            if ($.isFunction(opt.callback)) {
                opt.callback(vals, level === Config.CallbackLevel.Initial, that);
            }
            return that;
        },
        show: function (elem) {
            var that = this,
                opt = that.options,
                show = true,
                box = that.box;

            if (elem) {
                show = !box.show;
            }

            if ($.isElement(box)) {
                //先取消高度设置
                box.style.height = 'auto';
                //再显示下拉列表
                box.style.display = show ? '' : 'none';
                box.show = show;
                $.setClass(that.text, 'oui-ddl-txt-cur', show);
                //下拉列表位置停靠
                that.size().position();
            }
            return that.activity = true, that;
        },
        hide: function () {
            var that = this;

            if ($.isElement(that.box)) {
                that.box.style.display = 'none';
                that.box.show = false;
                that.activity = false;
                $.removeClass(that.text, 'oui-ddl-txt-cur');
            }
            return that;
        },
        size: function (size) {
            var that = this,
                opt = that.options,
                box = that.box,
                offset = $.getOffset(that.text),
                width = 0,
                minWidth = opt.minWidth,
                maxWidth = opt.maxWidth;

            if ($.isObject(size) || $.isNumber(size)) {
                width = size.width || size;
                if (width > maxWidth) {
                    maxWidth = width;
                }
                box.style.width = width + 'px';
                box.style.maxWidth = maxWidth + 'px';
            } else if (opt.boxWidth === 'follow') {
                var width = offset.width;
                if (width > maxWidth) {
                    maxWidth = width;
                }
                if (width < minWidth) {
                    minWidth = width;
                }
                box.style.width = width + 'px';
                box.style.minWidth = minWidth + 'px';
                box.style.maxWidth = maxWidth + 'px';
            }
            return that;
        },
        position: function () {
            var that = this, opt = that.options, elem = opt.element;
            var bs = $.getBodySize(),
                box = that.box,
                con = that.con,
                size = $.getOffset(box),
                offset = $.getOffset(that.text),
                //left = offset.left - 1,
                left = offset.left,
                top = offset.top + offset.height - 1;

            if (opt.position === Config.Position.Right) {
                left = offset.left + offset.width - size.width - 1;
                if (left <= 0) {
                    left = 0;
                }
            } else if (left + size.width > bs.width) {
                left -= (left + size.width - bs.width);
            }
            if (top + size.height > bs.height) {
                top -= (top + size.height) - bs.height;
                if (top < 0) {
                    top = 0;
                }
            }
            box.style.left = left + 'px';
            box.style.top = top + 'px';

            if (top + size.height > bs.height) {
                var h = bs.height - top - 2 - Config.bodyPadding;
                if (opt.maxHeight && h > opt.maxHeight) {
                    h = opt.maxHeight;
                }
                box.style.height = h + 'px';

                con.style.height = (h - that.bar.offsetHeight) + 'px';
            }
            return that;
        },
        isClosed: function () {
            var that = this;
            return !that.activity;
        }
    };

    $.extend({
        dropdownlist: function (options) {
            return Factory.buildList(options);
        },
        ddlist: function (options) {
            return Factory.buildList(options);
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
                cache.ddl.set(values, action, defaultChecked);
            }
            return this;
        }
    });

    $.extend($.ddlist, {
        get: function(id) {
            return $.dropdownlist.get(id);
        },
        set: function(id, values, action, defaultChecked) {
            return $.dropdownlist.set(id, values, action, defaultChecked);
        }
    });
}(OUI);