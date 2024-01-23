
/*
 @Title: OUI.Pagination.js
 @Description：分页插件
 @Author: oukunqing
 @License：MIT
*/

!function ($) {
    'use strict';

    var thisFilePath = $.getScriptSelfPath(true);
    //先加载样式文件
    $.loadLinkStyle($.getFilePath(thisFilePath) + $.getFileName(thisFilePath, true).replace('.min', '') + '.css');

    var defaultClassName = 'oui-pagination',
        defaultPositon = 'left',
        defaultType = 'symbol',
        defaultSkin = 'default',
        positions = {
            left: 1, right: 0
        },
        minPageSize = 1,                //pageSize最小值
        //默认的每页显示条数选项
        defaultPageSizeItems = [1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 60, 100, 150, 200],
        defaultInputWidth = 35,         //输入框默认宽度，单位：px
        defaultInputHeight = 22,        //按钮、输入框默认高度，单位：px
        defaultDebounceTime = 50,       //防抖最小时长，单位：毫秒
        defaultLongPressTime = 1024,    //长按最小时长，单位：毫秒
        defaultLongPressInterval = 50,          //长按分页间隔，单位：毫秒
        minLongPressInterval = 20,              //长按分页最小间隔，单位：毫秒
        isKeyPressPaging = false,               //是否方向键分页中
        setNumber = function (op, keys) {
            for (var i in keys) {
                var key = keys[i], num = parseInt(op[key], 10);
                op[key] = isNaN(num) || num < 0 ? 0 : num;
            }
        },
        skin = '',
        getSkin = function() {
            if(!skin) {
                skin = thisFilePath.getQueryString('skin') || defaultSkin;
            }
            return skin;
        },
        checkOptions = function(opt) {
            if (!$.isObject(opt)) {
                opt = {};
            }
            if ($.isString(opt.skin, true)) {
                opt.skin = opt.skin.toLowerCase();
            } else {
                //指定默认样式
                opt.skin = getSkin();
            }

            opt.pageIndex = $.getParam(opt, 'pageIndex|page|index|pi', 0);
            opt.pageStart = $.getParam(opt, 'pageStart|start', 0);
            opt.pageSize = $.getParam(opt, 'pageSize|size|ps', 20);
            opt.dataCount = $.getParam(opt, 'dataCount|count', 0);

            opt.showPageSize = $.getParam(opt, 'showPageSize|showSizeSelect', true);
            opt.showPageGoto = $.getParam(opt, 'showPageGoto|showPageJump');
            opt.showStatText = $.getParam(opt, 'showStatText|showTextEnable');

            return opt;
        },
        setOptions = function (op, options, dataCount) {
            var texts = {
                symbol: {
                    first: '&laquo;', previous: '&lsaquo;', next: '&rsaquo;', last: '&raquo;',
                    ellipsis: '&middot;&middot;&middot;', goto: 'Goto', reload: 'Reload',
                    pageCount: '共{0}页', dataCount: '共{0}条',
                    pageStat: '{0}/{1}页', dataStat: '{0}-{1}条 / 共{2}条'
                },
                chinese: {
                    first: '首页', previous: '上一页', next: '下一页', last: '末页',
                    ellipsis: '&middot;&middot;&middot;', goto: '跳转', reload: '重载',
                    pageCount: '共{0}页', dataCount: '共{0}条',
                    pageStat: '{0}/{1}页', dataStat: '{0}-{1}条 / 共{2}条'
                },
                english: {
                    first: 'First', previous: 'Prev', next: 'Next', last: 'Last',
                    ellipsis: '&middot;&middot;&middot;', goto: 'Goto', reload: 'Reload',
                    pageCount: 'Page:{0}', dataCount: 'Total: {0}',
                    pageStat: 'Page:{0}/{1}', dataStat: 'Show:{0} - {1} / Total: {2}'
                }
            };
            texts['cn'] = texts.chinese;
            texts['en'] = texts.english;

            if ($.isNumber(options)) {
                op.pageIndex = options;
                if ($.isNumber(dataCount)) {
                    op.dataCount = dataCount;
                }
                setNumber(op, ['dataCount', 'pageIndex']);
            } else {
                $.extend(op, options || {});
                if (!$.isElement(op.element)) {
                    if ($.isString(op.element)) {
                        op.element = document.getElementById(op.element);
                    } else {
                        op.element = $.createElement('DIV', function (ele) {
                            ele.id = new Date().getTime();
                        }, document.body);
                    }
                }
                if (!texts[op.markType]) {
                    op.markType = defaultType;
                }
                op.markText = $.extend(texts[op.markType], options.markText || {});

                setNumber(op, ['dataCount', 'pageStart', 'pageSize', 'pageIndex', 'markCount']);

                if (op.pageSize < minPageSize) {
                    op.pageSize = minPageSize;
                }

                //pageUrl中必须包含{0}或{pageIndex}，用于替换pageIndex值
                if (!$.isString(op.url) || (op.url.indexOf('{0}') < 0 && op.url.indexOf('{pageIndex}') < 0)) {
                    op.url = '';
                }

                if ($.isNumber(op.debounce) && op.debounce >= defaultDebounceTime) {
                    op.debounceTime = op.debounce;
                    op.debounce = true;
                }

                if ($.isNumber(op.useLongPress) && op.useLongPress >= defaultLongPressTime) {
                    op.longPressTime = op.useLongPress;
                    op.useLongPress = true;
                } else if (op.longPressTime < defaultLongPressTime) {
                    op.longPressTime = defaultLongPressTime;
                }

                if (!$.isNumber(op.longPressInterval) || op.longPressInterval < minLongPressInterval) {
                    op.longPressInterval = defaultLongPressInterval;
                }

                op.inputWidth = parseInt(op.inputWidth, 10);
                if (isNaN(op.inputWidth)) {
                    op.inputWidth = defaultInputWidth;
                }

                //判断是否显示输入框，若外部参数未指定，则设置为显示
                if (!op.showList && !$.isBoolean(options.showPageInput)) {
                    op.showPageInput = true;
                }

                //列表显示，则默认显示跳转输入框
                if(op.showList && !$.isBoolean(options.showPageGoto)) {
                    op.showPageGoto = true;
                }

                if (!$.isString(op.className, true)) {
                    op.className = defaultClassName;
                }
            }

            return op;
        },
        checkPageIndex = function (that, value) {
            var op = that.options;
            if ($.isNumeric(value)) {
                return (value + op.minuend <= op.pageCount) && (value >= op.pageStart);
            } else {
                if (op.pageIndex + op.minuend > op.pageCount) {
                    op.pageIndex = op.pageCount - op.minuend;
                } else if (op.pageIndex < op.pageStart) {
                    op.pageIndex = op.pageStart;
                }
            }
        },
        getMinMax = function (that) {
            var op = that.options, min = op.pageStart, max = 0;
            if (op.pageCount <= op.markCount) {
                max = op.pageCount;
            }
            else {
                var mc = Math.ceil(op.markCount / 2), num = op.pageIndex - op.pageStart + mc;
                max = num > op.pageCount ? op.pageCount : num < op.markCount ? op.markCount : num;
                min = max - op.markCount + op.pageStart;
                if (min < op.pageStart) {
                    min = op.pageStart;
                }
            }
            return [min, max];
        },
        buildLinkText = function (enabled, that, arr, pageIndex, textKey, noLink, className) {
            if (enabled) {
                var op = that.options,
                    text = op.markText[textKey], css = className + (className === textKey ? '' : ' ' + textKey),
                    ellipsis = textKey === 'ellipsis',
                    symbol = className.indexOf('symbol') > -1 && 'first,previous,next,last'.indexOf(textKey) > -1 || ellipsis,
                    height = 'height:' + op.height + 'px;line-height:' + (op.height - (ellipsis ? 0 : 2)) + 'px;',
                    fs = symbol ? 'font-size:18px;' : '';
                if (noLink) {
                    arr.push(['<li>', '<a class="none ' + (css || '') + ' disabled" disabled="disabled" style="' + height + fs + '">', text, '</a>', '</li>'].join(''));
                } else {
                    arr.push(['<li>', '<a class="link ' + (css || '') + '" value="' + pageIndex + '" style="' + height + fs + '">', text, '</a>', '</li>'].join(''));
                }
            }
            return that;
        },
        // 参数 t 用来指示当前获取焦点是哪个输入框
        buildPageInput = function (enabled, that, arr, showButton, t) {
            if (enabled) {
                var op = that.options, 
                    maxlength = op.pageCount.toString().length, 
                    className = showButton ? ' group' : '',
                    w = op.inputWidth,
                    c = op.pageCount.toString().length - 3,
                    width = w > defaultInputWidth ? w : (w + (c > 0 ? c : 0) * 11),
                    height = 'height:' + op.height + 'px;line-height:' + (op.height - 2) + 'px;',
                    margin = t === 'j' ? 'margin-left:2px;padding-right:5px;' : '',
                    input = '<input type="text" class="text ' + className + '" value="' + (op.pageIndex + op.minuend)
                        + '" maxlength="' + maxlength + '" t="' + t + '"' + ' style="width:' + width + 'px;' + height + margin + '"'
                        + 'autocomplete="off" />';
                arr.push(input);
                if (showButton) {
                    arr.push('<button class="btn group" style="' + height + '">' + (op.markText['jump'] || op.markText['goto']) + '</button>');
                }
            }
            return that;
        },
        getTextColor = function (textColor) {
            //过滤提取颜色,如: #000000; 提取 000000
            var m = (textColor || '').match(/[#]{0,}([0-9A-F]{6}|[0-9A-F]{3})[;]{0,}/i);
            textColor = m && m[1] ? m[1] : '';
            return textColor ? 'color:#' + textColor + ';' : '';
        },
        buildPageStat = function(enabled, that, arr, text, count) {
            if (enabled) {
                var op = that.options, str = text || '{0}/{1}页', datas = [0, 0];
                if (op.dataCount > 0) {
                    datas = [op.pageIndex - op.pageStart + 1, op.pageCount];
                }
                arr.push([
                    '<div class="stat {0}" style="line-height:{1}px;{2}">'.format(
                        getPosition(that, false), op.height - 1, getTextColor(op.textColor)
                    ),
                    str.format(datas),
                    '</div>'
                ].join(''));
            }
            return that;
        },
        buildDataCount = function (enabled, that, arr, text, count) {
            if (enabled) {
                var str = text || '',
                    op = that.options;
                str = str.indexOf('{0}') < 0 ? '{0}' + str : str;
                arr.push([
                    '<span class="label" style="line-height:{0}px;{1}">'.format(
                        op.height - 1, getTextColor(op.textColor)
                    ),
                    str.format(count),
                    '</span>'
                ].join(''));
            }
            return that;
        },
        getDataStat = function(that) {
            var op = that.options,
                min = (op.pageIndex - op.pageStart) * op.pageSize, 
                max = min + op.pageSize,
                dc = op.dataCount,
                page = op.pageIndex - op.pageStart + 1;

            return { min:min + 1, max: max < dc ? max : dc, page: page, count: dc };
        },
        buildDataStat = function (enabled, that, arr, text) {
            if (enabled) {
                var str = text || '{0}', datas = [0, 0, 0], stat = getDataStat(that),
                    op = that.options;
                if (stat.count > 0) {
                    datas = [stat.min, stat.max, stat.count];
                }

                arr.push([
                    '<div class="stat {0}" style="line-height:{1}px;{2}">'.format(
                        getPosition(that, false), op.height - 1, getTextColor(op.textColor)
                    ),
                    str.format(datas),
                    '</div>'
                ].join(''));
            }
            return that;
        },
        keyPaging = function (ev, that, obj) {
            //H-72 J-74 K-75 L-76 M-77
            //D-68 F-70 B-66 U-85
            var op = that.options, pageIndex = 0, kc = ev.keyCode;
            if (kc === 13) {
                pageIndex = getValue(obj);
            } else if ((kc === 38 || kc === 72) && op.pageIndex > op.pageStart) {
                pageIndex = op.pageStart + op.minuend;
            } else if ((kc === 40 || kc === 76) && (op.pageIndex + op.minuend) < op.pageCount) {
                pageIndex = op.pageCount;
            } else if ((kc === 37 || kc === 75) && (op.pageIndex - op.minuend - op.pageStart) >= op.pageStart) {
                pageIndex = op.pageIndex - 1 + op.minuend;
            } else if ((kc === 39 || kc === 74) && (op.pageIndex + op.minuend) < op.pageCount) {
                pageIndex = op.pageIndex + 1 + op.minuend;
            } else if (kc === 77) {
                pageIndex = parseInt(op.pageCount / 2, 10);// + (op.pageCount % 2 !== 0 ? 0 : 0);
            } else if (kc === 68 || kc === 70) {    //D-68 F-70
                pageIndex = op.pageIndex + (kc === 68 ? 5 : 10) + op.minuend;
            } else if (kc === 66 || kc === 85) {    //B-66 U-85
                pageIndex = op.pageIndex - (kc === 85 ? 5 : 10) + op.minuend;
            } else {
                obj.value = obj.value.replace(/[^\d]/, '');
                return false;
            }
            setInputer(that, obj);

            return { value: pageIndex };
        },
        setInputer = function (that, obj) {
            if ($.isElement(obj, 'INPUT')) {
                that.options.inputer = obj.getAttribute('t');
            }
        },
        isInputer = function (that, obj) {
            if ($.isElement(obj, 'INPUT')) {
                return that.options.inputer === obj.getAttribute('t');
            }
            return false;
        },
        checkInputValue = function (op, val) {
            if (val > op.pageCount) {
                val = op.pageCount - op.minuend;
            } else if (val < op.pageStart) {
                val = op.pageStart;
            }
            return val;
        },
        pageCallback = function (that, val) {
            var op = that.options;
            if ($.isString(op.url, true)) {
                location.href = op.url.format(op.url.indexOf('{0}') >= 0 ? val : op);
            } else if ($.isFunction(op.callback)) {
                op.callback(val, op.pageSize, that, op.callbackParam);
            }
        },
        realCallback = function (that, val) {
            var op = that.options;
            //是否启用防抖功能，抖动频率需大于50毫秒
            if (op.debounce && op.debounceTime >= defaultDebounceTime) {
                //内部分页，显示分页效果
                that.paging(val);
                //防抖
                if (op.timerDebounce != null) { window.clearTimeout(op.timerDebounce); }
                //外部回调
                op.timerDebounce = window.setTimeout(function () { pageCallback(that, val); }, op.debounceTime);
            } else {
                pageCallback(that, val);
            }
        },
        setCallback = function (that, objs, eventName, minuend, func, isPageSize) {
            var op = that.options, obj = objs, objVal = null, val = 0;
            if ($.isArray(objs)) {
                obj = objs[0], objVal = objs[1];
            }
            if ($.isUndefined(obj)) { return false; }
            $.addEventListener(obj, eventName, function (ev) {
                //判断是否是键盘按钮事件 keyup keydown keypress 等
                if(ev.type === 'keydown') {
                    that.isKeyPressPaging = true;
                }
                if (eventName.indexOf('key') >= 0) {
                    var kp = keyPaging(ev, that, this);
                    val = kp ? kp.value : 'None';
                } else {
                    val = getValue(objVal || this);
                    setInputer(that, objVal);
                }
                if (isNaN(val) || !$.isFunction(op.callback)) {
                    return false;
                }
                if ($.isFunction(func)) {
                    func(val);
                }
                if (isPageSize) {
                    //设置PageSize，页码重新设置为起始页码
                    pageCallback(that, op.pageStart);
                } else {
                    realCallback(that, checkInputValue(op, val - minuend));
                }
                return false;
            });
        },
        getClassName = function (that) {
            return that.options.className || defaultClassName;
        },
        getPosition = function (that, isMain) {
            return isMain ? that.options.position : positions[that.options.position] ? 'left' : 'right';
        },
        longPressPaging = function (that, obj, isStop) {
            var op = that.options;
            if (isStop) {
                if (op.timerLongPress) { window.clearTimeout(op.timerLongPress); }
                if (op.timerLongPress2) { window.clearInterval(op.timerLongPress2); }
                return false;
            }
            op.timerLongPress2 = window.setInterval(function () {
                var val = op.pageIndex, add = obj.className.indexOf('next') >= 0;
                val += add ? 1 : -1;

                if (isStop || !checkPageIndex(that, val)) {
                    if (op.timerLongPress2) { window.clearInterval(op.timerLongPress2); }
                    return false;
                }
                setValue(obj, val);
                realCallback(that, val);
            }, op.longPressInterval);
        },
        createEvent = function (that, minuend) {
            var op = that.options, links = op.element.getElementsByTagName('A'), c = links.length;
            for (var i = 0; i < c; i++) {
                var a = links[i];
                if (op.useLongPress && (a.className.indexOf('prev') >= 0 || a.className.indexOf('next') >= 0)) {
                    $.addEventListener(a, 'mousedown', function () {
                        var obj = this;
                        op.timerLongPress = window.setTimeout(function () {
                            longPressPaging(that, obj, false);
                        }, op.longPressTime);
                    });
                    $.addEventListener(op.element, 'mouseup', function () {
                        longPressPaging(that, null, true);
                    });
                    $.addEventListener(op.element, 'mouseout', function () {
                        longPressPaging(that, null, true);
                    });
                }
                setCallback(that, a, 'click', 0);
            }

            var select = op.element.getElementsByTagName('Select')[0];
            if (select !== null) { select.value = op.pageSize; }
            setCallback(that, select, 'change', 0, function (val) { op.pageSize = val; }, true);

            var inputs = op.element.getElementsByTagName('Input'), ic = inputs.length;
            var btn = op.element.getElementsByTagName('Button')[0];
            if (btn) {
                var input = btn.previousSibling;
                input = input.tagName === 'INPUT' ? input : null;
                setCallback(that, [btn, input || inputs[ic - 1]], 'click', minuend);
            }

            var focusInput = inputs[0];
            for (var i = 0; i < ic; i++) {
                if (op.useKeyEvent) {
                    setCallback(that, inputs[i], 'keydown', minuend);
                }
                //清除输入的非数字字符，只能输入正整数
                $.addEventListener(inputs[i], 'keyup', function (ev) {
                    this.value = this.value.replace(/[^\d]/, '');
                });
                if (isInputer(that, inputs[i])) {
                    focusInput = inputs[i];
                }
            }

            $.addListener(document, 'keypress', function (e) {
                if (!e.shiftKey ) {
                    return false;
                }
                var keyCode = $.getKeyCode(e),
                    keyChar = String.fromCharCode(keyCode).toUpperCase();

                if(keyChar === 'P') {
                    //$.setFocus(focusInput);
                    //设置输入框光标位置到输入框内容的最后
                    $.setTextCursorPosition(focusInput);
                }
            });

            if(op.focus || that.isKeyPressPaging) {
                //设置输入框获取焦点
                //$.setFocus(focusInput);
                //设置输入框光标位置到输入框内容的最后
                $.setTextCursorPosition(focusInput);
            }
        },
        getValue = function (obj) {
            return parseInt(obj.value || obj.getAttribute('value'), 10);
        },
        setValue = function (obj, value) {
            if (obj.tagName === 'INPUT') {
                obj.value = value;
            } else {
                obj.setAttribute('value', value);
            }
        },
        isPageItem = function(items, pageSize) {
            if(!$.isArray(items)) {
                return false;
            }
            if(items.indexOf(pageSize) >= 0) {
                return true;
            }

            for(var i = 0; i < items.length; i++) {
                if($.isArray(items[i]) && items[i][0] === pageSize) {
                    return true;
                } else if(items[i] === pageSize) {
                    return true;
                }
            }

            return false;
        },
        buildPageSize = function (enabled, that, arr, minuend) {
            var op = that.options,
                html = [
                    '<select class="select" style="height:', op.height, 'px;',
                    enabled ? '' : 'display:none;',
                    '">'
                ];
            if (!$.isArray(op.pageSizeItems) || $.isEmpty(op.pageSizeItems)) {
                op.pageSizeItems = defaultPageSizeItems;
            }

            if ($.isArray(op.sizeOptions)) {
                for (var i = 0; i < op.sizeOptions.length; i++) {
                    var n = op.sizeOptions[i];
                    if (op.pageSizeItems.indexOf(n) < 0) {
                        op.pageSizeItems.push(n);
                    }
                }
            }
            //if (op.pageSizeItems.indexOf(op.pageSize) < 0) {
            if (!isPageItem(op.pageSizeItems, op.pageSize)) {
                if ($.isArray(op.pageSizeItems[0])) {
                    var text = (op.pageSizeItems[0][1] || '').replace(/[\d]+/, op.pageSize);
                    op.pageSizeItems.push([op.pageSize, text]);
                } else {
                    op.pageSizeItems.push(op.pageSize);
                }
                op.pageSizeItems.sort(function (a, b) { return (a[0] || a) - (b[0] || b); });

                //将自定义pageSize追加到默认的选项中
                if (defaultPageSizeItems.indexOf(op.pageSize) < 0) {
                    defaultPageSizeItems.push(op.pageSize);
                    defaultPageSizeItems.sort(function (a, b) { return a - b; });
                }
            }
            if ($.isArray(op.pageSizeItems)) {
                for (var i in op.pageSizeItems) {
                    var dr = op.pageSizeItems[i];
                    if ($.isInteger(dr)) {
                        html.push('<option value="' + dr + '">' + dr + '</option>');
                    } else if ($.isArray(dr)) {
                        html.push('<option value="' + dr[0] + '">' + (dr[1] || dr[0]) + '</option>');
                    }
                }
            }
            html.push('</select>');

            arr.push(html.join(''));

            return that;
        };

    var Factory = {
        caches: {},
        buildKey: function(elem) {
            if($.isElement(elem)) {
                return elem.id || elem.className || elem.tagName;
            }
            return elem;
        },
        setCache: function(elem, obj) {
            var key = this.buildKey(elem);
            this.caches[key] = obj;
            return this;
        },
        getCache: function(elem) {
            var key = this.buildKey(elem);
            return this.caches[key];
        },
        buildOptions: function(args, options) {
            if(args.length >= 4) {
                options = {
                    element: args[0],
                    dataCount: args[1],
                    pageIndex: args[2],
                    pageSize: args[3],
                    callback: args[4],
                    skin: args[5]
                };
                if($.isString(args[6], true)) {
                    options.markText = { dataCount: args[6] };
                }
            }
            //若指定pageSize为0，则表示不分页（仅显示数据条数）
            if (options.pageSize === 0) {
                options.paging = false;
            }
            return options;
        },
        show: function(options, dataCount) {
            var opt = $.extend({}, options);
            if(!opt.element) {
                opt.element = opt.parent || opt.container || opt.obj;
            }
            var p = this.getCache(opt.element);
            if(!p) {
                p = new Pagination(opt, dataCount);
                this.setCache(opt.element, p);
                return p;
            }
            return p.paging(opt, dataCount), p;
        }
    };

    function Pagination(options, dataCount) {
        var that = this;
        that.options = setOptions({
            element: null,              //分页显示HTML控件（或ID）
            paging: true,               //是否分页，默认分页；有时不需要分页，只是显示数据条数
            pageSize: 10,               //每页显示条数，默认为10
            pageStart: 0,               //起始页，0 或 1，与 pageIndex 起始值对应
            pageIndex: 0,               //起始页码，默认与 pageStart 相同
            dataCount: 0,               //总数据条数
            markCount: 10,              //分页数字按钮显示个数，默认为10个
            markType: defaultType,      //标记类型：图标|中文|英文（symbol|chinese|english）
            markText: null,             //标记文字（上一页 下一页）
            showList: false,            //是否显示数字列表，若不显示数字列表，则默认显示输入框
            showInvalid: true,          //是否显示无效的按钮
            showEllipsis: true,         //是否显示省略号(快进)按钮
            alwaysEllipsis: false,      //是否始终显示省略号按钮
            showFirstLast: true,        //是否显示首页/尾页按钮

            showPageInput: false,       //是否显示页码输入框
            showPageGoto: false,        //是否显示页码跳转输入框

            showStatText: true,         //是否显示数据/页数文字（包含下面6项内容）

            showDataCount: false,       //是否显示数据条数（位于左边）
            showPageCount: false,       //是否显示总页数（位于右边）
            showPageStat: true,         //是否显示页面统计(示例：1/2页)（位于右边）
            showDataStat: true,         //是否显示数据统计（位于右边）
            showPageStatLeft: false,    //是否显示页面统计（位于左边）
            showDataStatLeft: false,    //是否显示数据统计（位于左边）

            showPageSize: true,       //是否显示PageSize下拉框
            pageSizeItems: [],          //PageSize下拉框默认选项
            sizeOptions: [],            //要追加的PageSize下拉框选项
            callback: function (pageIndex, pageSize, that, param) {      //回调函数模式
                console.log('pagination callback: ', 'pageIndex: ', pageIndex, 'pageSize: ', pageSize, ', param: ', param);
            },
            callbackParam: null,                    //回调参数
            complete: function(par, that) {
                if ($.isDebug()) {
                    console.log('pagination complete: ', par, that);
                }
            },
            showReload: false,                      //是否显示刷新按钮
            url: '',                                //URL模式，必须包含关键字 {0} 或 {pageIndex}，若url可用，则url优先于callback
            useKeyEvent: true,                      //是否启用快捷键（回车键，方向键 [上下左右或HJKL] ）
            useLongPress: true,                     //是否启用长按功能（长按 上一页 下一页）
            longPressTime: defaultLongPressTime,    //长按生效时长（长按多少毫秒启动长按功能），单位：毫秒
            longPressInterval: defaultLongPressInterval,    //长按分页切换频率，单位：毫秒
            position: defaultPositon,               //left|right
            className: defaultClassName,            //默认样式名称，可以修改为外置样式
            skin: defaultSkin,                      //样式，若skin=null则不启用内置样式
            inputWidth: defaultInputWidth,          //输入框宽度，默认为50px
            height: defaultInputHeight,             //高度，默认为22px
            textColor: '',                          //指定（非链接或按钮）文字的颜色
            debounce: true,                         //是否启用防抖功能（或者值为number，且大于50即为启用）
            debounceTime: defaultDebounceTime,      //抖动时长，单位：毫秒
            focus: false                            //是否锁定焦点
        }, checkOptions(options), dataCount);

        that.paging();
    }

    Pagination.prototype = {
        paging: function (options, dataCount) {
            if ($.isObject(options) || $.isNumber(options)) {
                this.options = setOptions(this.options, options, dataCount);
            }
            var that = this, op = $.extend(that.options, {
                pageCount: Math.ceil(that.options.dataCount / that.options.pageSize),
                minuend: Math.abs(that.options.pageStart - 1)
            });

            if (!op.paging) {
                var c = op.dataCount >= 0 ? op.dataCount : 0;
                op.element.innerHTML = [
                    '<div class="oui-pagination">',
                    '<span class="label">',
                    op.markText['dataCount'].format(c),
                    '</span>',
                    '</div>'
                ].join('');
                return this;
            }

            //检测pageIndex是否在pageCount范围内
            checkPageIndex(that);

            var mi = parseInt(op.markCount / 2, 10),
                mc = Math.ceil(op.markCount / 2),
                minMax = getMinMax(that),
                min = minMax[0],
                max = minMax[1] + op.pageStart,
                quickNum = 0,
                pmSub = op.pageIndex - op.markCount,
                pcSub = op.pageCount - op.minuend,
                pmSum = op.pageIndex + op.markCount,
                className = op.markType === defaultType ? 'text symbol' : 'text',
                html = [
                    '<div class="' + getClassName(that) + '">',
                    '<div class="' + op.skin + ' ' + getPosition(that, true) + '">',
                    '<ul class="list">'
                ];

            var cssData = '.' + op.className + ' li{float: left;}', cssId = op.className + '-css-' + $.crc.toCRC16(op.className).toLowerCase();
            //创建CssStyle，防止闪烁
            $.createCssStyle(cssData, cssId);

            buildDataCount(op.showStatText && op.showDataCount, that, html, op.markText['dataCount'], op.dataCount);
            buildDataStat(op.showStatText && op.showDataStatLeft, that, html, op.markText['dataStat']);
            buildPageStat(op.showStatText && op.showPageStatLeft, that, html, op.markText['pageStat']);

            buildPageSize(op.showPageSize, that, html, op.minuend);

            if (op.pageIndex != min && op.pageCount > 0) {
                buildLinkText(op.showFirstLast, that, html, op.pageStart, 'first', false, className);
                //显示省略号快退按钮
                if (op.showEllipsis && pmSub >= op.pageStart) {
                    quickNum = pmSub > op.pageStart ? pmSub : op.pageStart;
                    buildLinkText(true, that, html, quickNum, 'ellipsis', false, 'ellipsis');
                } else if (op.alwaysEllipsis) {
                    buildLinkText(true, that, html, 'PQ', 'ellipsis', true, 'ellipsis');
                }
                buildLinkText(true, that, html, op.pageIndex - 1, 'previous', false, className);
            } else if (op.showInvalid) {
                buildLinkText(op.showFirstLast, that, html, 0, 'first', true, className);
                if (op.alwaysEllipsis) {
                    buildLinkText(true, that, html, 'PQ', 'ellipsis', true, 'ellipsis');
                }
                buildLinkText(true, that, html, 0, 'previous', true, className);
            }

            if (op.showList) {
                var c = 0,
                    h = ' style="height:' + op.height + 'px;line-height:' + (op.height - 2) + 'px;"';
                for (var i = min; i < max; i++) {
                    var num = i + op.minuend;
                    if (i > op.pageCount || c > op.markCount) {
                        break;
                    }
                    if (c === mi) {
                        buildPageInput(op.showPageInput, that, html, false, 'i');
                    }
                    if (i === op.pageIndex) {
                        html.push('<li><a class="link cur"' + h + '>' + num + '</a></li>');
                    } else {
                        html.push('<li><a class="link num" value="' + i + '"' + h + '>' + num + '</a></li>');
                    }
                    c++;
                }
            } else {
                buildPageInput(op.showPageInput, that, html, false, 'i');
            }

            //上一页<、下一页>、第一页<<、最后一页标记>>
            if (op.pageIndex != op.pageCount - op.minuend && op.pageCount > 0) {
                buildLinkText(true, that, html, op.pageIndex + 1, 'next', false, className);

                //显示省略号快进按钮
                if (op.showEllipsis && pmSum < op.pageCount) {
                    quickNum = pmSum < pcSub ? pmSum : pcSub;
                    buildLinkText(true, that, html, quickNum, 'ellipsis', false, 'ellipsis');
                } else if (op.alwaysEllipsis) {
                    buildLinkText(true, that, html, 'NQ', 'ellipsis', true, 'ellipsis');
                }
                buildLinkText(op.showFirstLast, that, html, pcSub, 'last', false, className);
            } else if (op.showInvalid) {
                buildLinkText(true, that, html, 0, 'next', true, className);
                if (op.alwaysEllipsis) {
                    buildLinkText(true, that, html, 'NQ', 'ellipsis', true, 'ellipsis');
                }
                buildLinkText(op.showFirstLast, that, html, 0, 'last', true, className);
            }

            buildPageInput(op.showPageGoto, that, html, true, 'j');

            buildLinkText(op.showReload, that, html, op.pageIndex, 'reload', false, 'text');

            buildDataCount(op.showStatText && op.showPageCount, that, html, op.markText['pageCount'], op.pageCount);
            buildPageStat(op.showStatText && op.showPageStat, that, html, op.markText['pageStat'], op.pageCount);

            html.push('</ul></div>');

            buildDataStat(op.showStatText && op.showDataStat, that, html, op.markText['dataStat']);

            html.push('</div>');

            op.element.innerHTML = html.join('');

            createEvent(that, op.minuend);

            if($.isFunction(op.complete)) {
                var stat = getDataStat(that);
                op.complete({
                    page: { count: op.pageCount, index: op.pageIndex, number: stat.page, size: op.pageSize, start: op.pageStart },
                    data: { count: op.dataCount, start: stat.min, end: stat.max }
                }, that);
            }

            return this;
        }
    };

    $.extend($, {
        pagination: function(options, dataCount) {
            options = Factory.buildOptions(arguments, options);
            return Factory.show(options, dataCount);
        },
        paging: function(options, dataCount) {
            options = Factory.buildOptions(arguments, options);
            return Factory.show(options, dataCount);
        }
    });

}(OUI);