
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
        Submit: {
            //选项
            Normal: 0,
            //全选按钮
            Select: 1,
            //确定按钮
            Return: 2,
            //初始化
            Initial: 999,
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
        caches: {},
        getCache: function (id) {
            var key = 'oui_ddl_' + id,
            obj = Factory.caches[key];
            return obj || null;
        },
        setCache: function (opt) {
            var ddl = new DropDownList(opt),
            key = 'oui_ddl_' + opt.id,
            cache = {
                elem: opt.element,
                opt: opt,
                ddl: ddl
            };
            return Factory.caches[key] = cache, cache;
        },
        closeOther: function(ddl) {
            for (var k in Factory.caches) {
                if (k !== 'oui_ddl_' + ddl.id) {
                    var obj = Factory.caches[k];
                    if (obj.ddl.box && obj.ddl.box.show) {
                        obj.ddl.hide();
                    }
                }
            }
            return this;
        },
        checkOptions: function(options) {
            var opt = $.extend({}, options);

            opt.itemBorder = opt.itemBorder || opt.border;
            opt.element = $.toElement(opt.element || opt.elem);

            if (opt.single) {
                opt.multi = false;
            }
            if (!$.isNumber(opt.submit)) {
                opt.submit = Config.Submit.Return;
            }

                //是否显示选框,默认情况下：单选框不显示，复选框显示
                //若指定display为true或false，则按指定规则显示
            if (!$.isBoolean(opt.display)) {
                opt.display = opt.multi;
            }

            opt.boxWidth = opt.boxWidth || opt.width;

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
            return Factory.setCache(opt).ddl;
        },
        getStyleSize: function(size) {
            if ($.isNumber(size)) {
                return (size < 0 ? 0 : size) + 'px';
            } else if ($.isString(size)) {
                return size.endWith('%') ? size : parseInt('0' + size, 10) + 'px';
            }
            return '0';
        }
    };

    //先加载样式文件
    Factory.loadCss();

    function Node (par) {
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
            that.checked = par.checked || par.input.checked;
            that.dc = $.getAttribute(par.input, 'dc') === '1';
            that.callback = par.callback;
            that.childs = [];

            that.label.onmousedown = function() {
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
        }
    };

    function DropDownList(options) {
        var opt = Factory.checkOptions($.extend({            
            id: '',
            name: '',
            title: '',
            element: '',
            //列表框宽度，默认不指定
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
            itemWidth: 120,
            //停靠位置：left-左下，right-右下
            position: 'left',
            //按钮位置：left-左，center-中，right-右
            buttonPosition: 'center',
            //非列表布局时，是否显示选项边框
            itemBorder: false,
            //是否单选，条件等级优先于multi
            single: false,
            //是否多选
            multi: true,
            //是否显示选框,默认情况下：单选框不显示，复选框显示
            //若指定display为true或false，则按指定规则显示
            display: null,
            //回调等级：0-选项实时回调，1-全选/反选等按钮事件回调，2-确定按钮事件回调
            submit: 1,
            callback: null
        }, options));

        this.id = opt.id;
        this.options = opt;
        this.indexs = {};
        this.nodes = [];
        this.initial();
    }

    DropDownList.prototype = {
        initial: function () {
            var that = this,
            opt = that.options,
            elem = opt.element;

            if (opt.element.tagName === 'SELECT') {
                var offset = $.getOffset(opt.element);
                elem = document.createElement('INPUT');
                elem.className = 'form-control oui-ddl-txt';
                $.setAttribute(elem, 'readonly', 'readonly');
                elem.style.cssText = 'background-color:#fff;padding: 0 20px 0 9px;width:' + (opt.textWidth || offset.width) + 'px;';
                opt.element.parentNode.insertBefore(elem, opt.element);
                that.text = elem;
                that.elem = opt.element;

                opt.title = opt.title || (that.elem.options.length > 0 ? that.elem.options[0].text : '') || '-请选择-';

            } else {
                that.text = opt.element;
                that.text.className += ' oui-ddl-txt';
                $.setAttribute(that.text, 'readonly', 'readonly');
                that.text.style.cssText = 'background-color:#fff;padding: 0 20px 0 9px;';
                elem = document.createElement('SELECT');
                opt.element.parentNode.insertBefore(elem, opt.element);
                that.elem = elem;

                opt.title = opt.title || that.text.value || '-请选择-';
            }
            that.text.value = opt.title || '';
            
            if (!opt.name) {
                opt.name = opt.title.replace('-请选择-', '').replace('请选择', '');
            }

            that.elem.style.display = 'none';
            $.addListener(that.text, 'mousedown', function () {
                $.cancelBubble();
                that.show(this);
                Factory.closeOther(that);
            });

            return that.build();
        },
        build: function () {
            var that = this,
            opt = that.options;

            $.createElement('DIV', function (box) {
                var offset = $.getOffset(that.text),
                edge = navigator.userAgent.indexOf('Edg/') > 0;

                box.className = 'oui-ddl oui-ddl-panel' + (edge ? ' oui-ddl-edge' : '');
                box.id = Config.IdPrefix + opt.id;
                box.style.cssText = [
                    'display:none;top:',offset.top + offset.height - 1, 'px;left:', offset.left, 'px;',
                    'min-width:', (opt.minWidth || (offset.width + 1)), 'px;',
                    'max-width:', (opt.maxWidth), 'px;',
                    opt.boxWidth ? 'width:' + Factory.getStyleSize(opt.boxWidth) + ';' : '',
                    'min-height:', Factory.getStyleSize(opt.minHeight), ';',
                    opt.maxHeight ? 'max-height:' + Factory.getStyleSize(opt.maxHeight) + ';' : '',
                    ].join('');

                var btn = [], len = opt.items.length, selects = '', oneBtn = true;
                if (opt.multi) {
                    if ((opt.layout !== Config.Layout.List && len > 3) || len > 5) {
                        selects = [
                            '<button class="btn btn-default" ac="1">全选</button>',
                            '<button class="btn btn-default" ac="2">反选</button>',
                            '<button class="btn btn-default" ac="0">取消</button>',
                            '<button class="btn btn-default" ac="3" title="默认选项">默认</button>',
                        ].join('');
                        oneBtn = false;
                    }
                    btn.push('<div class="oui-ddl-oper oui-ddl-oper-' + opt.layout + '" style="text-align:' + (opt.buttonPosition || 'center') + ';">');
                    btn.push('<div class="btn-group btn-group-xs' + (oneBtn ? ' btn-group-block' : '') + '">');
                    btn.push(selects.join(''));
                    if (!opt.submit) {
                        btn.push('<button class="btn btn-primary btn-no" ac="no">关闭</button>');
                    } else {
                        btn.push('<button class="btn btn-primary btn-ok' + (oneBtn ? ' btn-block' : '') + '" ac="ok">确定</button>');                                                                                                                                     
                    }
                    btn.push('</div>');
                    btn.push('</div>');
                }

                var html = [
                    '<ul class="oui-ddl-box oui-ddl-', opt.layout,'">'
                    ];
                for (var i = 0; i < len; i++) {
                    var dr = opt.items[i];
                    if (dr === 'sep' || dr.sep || dr.type === 'sep') {
                        html.push(['<li class="oui-ddl-item oui-ddl-sep"></li>'].join(''));
                    } else if (dr.head) {
                        html.push(['<li class="oui-ddl-item oui-ddl-head">', dr.name || dr.head, '</li>'].join(''));
                    } else {
                        var key = Config.ItemPrefix + that.id,
                        id = typeof dr.code !== 'undefined' ? dr.code : dr.id,
                        name = dr.name + (dr.desc ? ' - ' + dr.desc : ''),
                        chbId = key + dr.id,
                        checked = dr.checked || dr.dc ? ' checked="checked" dc="1"' : '',
                        use = dr.enabled || dr.use,
                        disabled = dr.disabled ? ' disabled="disabled"' : '';
                        html.push([
                            '<li class="oui-ddl-item" style="', 
                            opt.layout !== Config.Layout.List ? 'float:left;' : '',
                            opt.layout === Config.Layout.Grid ? 'min-width:' + Factory.getStyleSize(opt.itemWidth) + ';' : '',
                            '">',
                            '<label  class="oui-ddl-label', opt.layout !== Config.Layout.List && opt.itemBorder ? ' oui-ddl-label-border' : '', '">',
                            '<input class="oui-ddl-chb"', checked,
                            ' type="', opt.multi ? 'checkbox' : 'radio', '"',
                            ' id="', chbId, '"',
                            ' name="', key, '"',
                            ' value="', id, '"',
                            ' text="', dr.name.replace(/[\"]/, "\\\""), '"', 
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

                $.addListener(box, 'mousedown', function(){
                    $.cancelBubble();
                });

                $.addListener(document.body, 'mousedown', function () {
                    that.hide();
                });
                $.addListener(document, 'keyup', function (e) {
                    if (27 === $.getKeyCode(e)) {   // Esc键值为27
                        that.hide();
                    }
                });

                var arr = $N(Config.ItemPrefix + that.id);
                for (var i = 0; i < arr.length; i++) {
                    var chb = arr[i];
                    that.nodes.push(new Node({
                        id: chb.value,
                        label: chb.parentNode,
                        input: chb,
                        multi: opt.multi,
                        callback: function(node) {
                            that.action(node);
                        }
                    }));
                    that.indexs[chb.id] = i;
                }

                var btns = document.querySelectorAll('#' + Config.IdPrefix + opt.id + ' .oui-ddl-oper button');
                for (var i = 0; i < btns.length; i++) {
                    btns[i].onclick = function() {
                        var ac = $.getAttribute(this, 'ac');
                        if (ac === 'no') {
                            that.hide();
                        } else if (ac === 'ok') {
                            that.callback(Config.Submit.Return);
                            that.hide();
                        } else {
                            that.set('', parseInt(ac, 10));
                            that.callback(Config.Submit.Select);
                        }
                    };
                }
                that.callback(Config.Submit.Initial);
            }, document.body);
return that;
},
action: function(node) {
    var that = this,
    opt = that.options,
    nodes = that.nodes,
    multi = opt.multi;

    if (multi) {
        node.set(!node.checked, true);
    } else {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].set(nodes[i].id === node.id, true);
        }
        that.hide();
    }
    return that.callback();
},
set: function (val, ac) {
    var that = this, 
    opt = that.options,
    nodes = that.nodes;

    if ($.isNumber(ac)) {
        switch(ac) {
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
        var vals = !$.isArray(val) ? val.split(/[,\|]/) : val;
        if (opt.multi) {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].set(vals.indexOf(nodes[i].value) > - 1);
            }
        } else {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].set(nodes[i].value === vals[0]);
            }
        }
    }
    return that;
},
get: function () {
    var that = this,
    opt = this.options,
    nodes = that.nodes,
    vals = [],
    txts = [];

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
            vals.push(nodes[i].value.trim());
            txts.push(nodes[i].text.trim());
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
callback: function(submitLevel) {
    var that = this, 
    opt = that.options,
    vals = that.get(),
    submit = submitLevel || 0;

    if (submit === Config.Submit.Initial) {
        if (vals === '') {
            return that;
        }
    } else if (opt.multi) {
        if (submit < opt.submit) {
            return that;
        }
    }
    if ($.isFunction(opt.callback)) {
        opt.callback(vals, submit === Config.Submit.Initial, that);
    }
    return that;
},
show: function (elem) {
    var that = this, 
    opt = that.options,
    show = true,
    box = that.box,
    offset = $.getOffset(that.text);

    if(elem) {
        show = !box.show;
    }

    if ($.isElement(box)) {
        box.style.height = 'auto';

                //先显示
        box.style.display = show ? '' : 'none';
        box.show = show;
        $.setClass(that.text, 'oui-ddl-txt-cur', show);
                //再获取尺寸
        var bs = $.getBodySize(),
        size = $.getOffset(box),
        left = offset.left,
        top = offset.top + offset.height - 1;

        if (opt.position === Config.Position.Right) {
            left = offset.left + offset.width - size.width + 1;
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
            box.style.height = (bs.height - top - 2) + 'px';
        }
    }
    return that;
},
hide: function () {
    var that = this;
    if ($.isElement(that.box)) {
        that.box.style.display = 'none';
        that.box.show = false;
        $.removeClass(that.text, 'oui-ddl-txt-cur');
    }
    return that;
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
}(OUI);