
/*
 @Title: OUI.Pagination.js
 @Description：分页插件
 @Author: oukunqing
 @License：MIT
*/

!function($) {
    'use strict';

    function Pagination(options, dataCount) {
        var that = this;
        that.options = setOptions({
            element: null,              //分页显示HTML控件（或ID）
            pageStart: 0,               //起始页，0 或 1，与 pageIndex 起始值对应
            pageIndex: 0,               //起始页码，默认与 pageStart 相同
            pageSize: 10,               //每页显示条数，默认为10
            dataCount: 0,               //总数据条数
            markCount: 10,              //分页数字按钮显示个数，默认为10个
            markType: defaultType,      //标记类型：图标|中文|英文（symbol|chinese|english）
            markText: null,             //标记文字（上一页 下一页）
            showList: true,             //是否显示数字列表，若不显示数字列表，则默认显示输入框
            showInvalid: true,          //是否显示无效的按钮
            showEllipsis: true,         //是否显示省略号(快进)按钮
            alwaysEllipsis: false,      //是否始终显示省略号按钮
            showFirstLast: true,        //是否显示首页/尾页按钮
            showPageInput: false,       //是否显示页码输入框
            showPageJump: true,         //是否显示页码跳转输入框
            showDataCount: false,       //是否显示数据条数
            showPageCount: true,        //是否显示总页数
            showDataStat: false,        //是否显示数据统计
            showSizeSelect: true,       //是否显示PageSize下拉框
            pageSizeItems: defaultPageSizeItems,      //PageSize下拉框默认选项
            callback: function(pageIndex, param) {      //回调函数模式
                console.log('pageIndex: ', pageIndex, ', param: ', param);
            },
            callbackParam: null,                    //回调参数
            url: '',                                //URL模式，必须包含关键字 {0} 或 {pageIndex}，若url可用，则url优先于callback
            useKeyEvent: true,                      //是否启用快捷键（回车键，方向键 [上下左右或HJKL] ）
            useLongPress: true,                     //是否启用长按功能（长按 上一页 下一页）
            longPressTime: defaultLongPressTime,    //长按生效时长（长按多少毫秒启动长按功能），单位：毫秒
            longPressInterval: defaultLongPressInterval,    //长按分页切换频率，单位：毫秒
            showReload: false,                      //是否显示刷新按钮
            position: defaultPositon,               //left|right
            className: defaultClassName,            //默认样式名称，可以修改为外置样式
            skin: defaultSkin,                      //样式，若skin=null则不启用内置样式
            inputWidth: defaultInputWidth,          //输入框宽度，默认为50px
            debounce: true,                         //是否启用防抖功能（或者值为number，且大于50即为启用）
            debounceTime: defaultDebounceTime       //抖动时长，单位：毫秒
        }, options, dataCount);

        that.paging();
    }

    Pagination.prototype = {
        paging: function(options, dataCount) {
            if ($.isObject(options) || $.isNumber(options)) {
                this.options = setOptions(this.options, options, dataCount);
            }
            var that = this, op = $.extend(that.options, {
                pageCount: Math.ceil(that.options.dataCount / that.options.pageSize),
                minuend: Math.abs(that.options.pageStart - 1)
            });

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

            buildDataCount(op.showDataCount, that, html, op.markText['dataCount'], op.dataCount);

            buildPageSize(op.showSizeSelect, that, html, op.minuend);

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
                var c = 0;
                for (var i = min; i < max; i++) {
                    var num = i + op.minuend;
                    if (i > op.pageCount || c > op.markCount) {
                        break;
                    }
                    if (c === mi) {
                        buildPageInput(op.showPageInput, that, html, false, 'i');
                    }
                    if (i === op.pageIndex) {
                        html.push('<li><a class="link cur">' + num + '</a></li>');
                    } else {
                        html.push('<li><a class="link num" value="' + i + '">' + num + '</a></li>');
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
                buildLinkText(op.showFirstLast, that, html, 0, 'last', true, false, className);
            }

            buildPageInput(op.showPageJump, that, html, true, 'j');

            buildLinkText(op.showReload, that, html, op.pageIndex, 'reload', false, 'text');

            buildDataCount(op.showPageCount, that, html, op.markText['pageCount'], op.pageCount);

            html.push('</ul></div>');

            buildDataStat(op.showDataStat, that, html, op.markText['dataStat']);

            html.push('</div>');

            op.element.innerHTML = html.join('');

            createEvent(that, op.minuend);
        }
    };

    var thisFilePath = $.getScriptSelfPath();

    //先加载样式文件
    $.loadLinkStyle($.getFilePath(thisFilePath, thisFilePath) + $.getFileName(thisFilePath, true) + '.css');

    var defaultClassName = 'oui-pagination',
        defaultPositon = 'left',
        defaultType = 'symbol',
        defaultSkin = 'default',
        positions = {
            left: 1, right: 0
        },
        minPageSize = 1,                //pageSize最小值
        //默认的每页显示条数选项
        defaultPageSizeItems = [5, 10, 20, 30, 50, 100],
        defaultInputWidth = 50,         //输入框默认宽度，单位px
        defaultDebounceTime = 50,       //防抖最小时长，单位：毫秒
        defaultLongPressTime = 1024,    //长按最小时长，单位：毫秒
        defaultLongPressInterval = 50,          //长按分页间隔，单位：毫秒
        minLongPressInterval = 20,              //长按分页最小间隔，单位：毫秒
        setNumber = function(op, keys) {
            for (var i in keys) {
                var key = keys[i], num = parseInt(op[key], 10);
                op[key] = isNaN(num) || num < 0 ? 0 : num;
            }
        },
        setOptions = function(op, options, dataCount) {
            var texts = {
                symbol: {
                    first: '&laquo;', previous: '&lsaquo;', next: '&rsaquo;', last: '&raquo;',
                    ellipsis: '&middot;&middot;&middot;', jump: 'Go', reload: 'Re',
                    pageCount: '\u5171 {0} \u9875', dataCount: '\u5171 {0} \u6761',
                    dataStat: '\u663e\u793a\u7b2c{0}\u6761\u5230\u7b2c{1}\u6761\u8bb0\u5f55\uff0c\u5171{2}\u6761'
                },
                chinese: {
                    first: '\u9996\u9875', previous: '\u4e0a\u4e00\u9875', next: '\u4e0b\u4e00\u9875', last: '\u5c3e\u9875',
                    ellipsis: '&middot;&middot;&middot;', jump: '\u8df3\u8f6c', reload: '\u5237\u65b0',
                    pageCount: '\u5171 {0} \u9875', dataCount: '\u5171 {0} \u6761',
                    dataStat: '\u663e\u793a\u7b2c {0} \u6761\u5230\u7b2c {1} \u6761\u8bb0\u5f55\uff0c\u5171 {2} \u6761'
                },
                english: {
                    first: 'First', previous: 'Prev', next: 'Next', last: 'Last',
                    ellipsis: '&middot;&middot;&middot;', jump: 'Go', reload: 'Re',
                    pageCount: '\u5171 {0} \u9875', dataCount: '\u5171 {0} \u6761',
                    dataStat: '\u663e\u793a\u7b2c {0} \u6761\u5230\u7b2c {1} \u6761\u8bb0\u5f55\uff0c\u5171 {2} \u6761'
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
                //父容器参数字段名称
                op.element = op.element || op.parent || op.container || op.obj;
                if (!$.isElement(op.element)) {
                    if ($.isString(op.element)) {
                        op.element = document.getElementById(op.element);
                    } else {
                        op.element = $.createElement('DIV', function(ele) {
                            ele.id = new Date().getTime();
                        });
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

                if(!$.isNumber(op.longPressInterval) || op.longPressInterval < minLongPressInterval){
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

                if (!$.isString(op.className, true)) {
                    op.className = defaultClassName;
                }
            }

            return op;
        },
        checkPageIndex = function(that, value) {
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
        getMinMax = function(that) {
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
        buildLinkText = function(enabled, that, arr, pageIndex, textKey, noLink, className) {
            if (enabled) {
                var text = that.options.markText[textKey], css = className + (className === textKey ? '' : ' ' + textKey);
                if (noLink) {
                    arr.push(['<li>', '<a class="none ' + (css || '') + '">', text, '</a>', '</li>'].join(''));
                } else {
                    arr.push(['<li>', '<a class="link ' + (css || '') + '" value="' + pageIndex + '">', text, '</a>', '</li>'].join(''));
                }
            }
            return that;
        },
        // 参数 t 用来指示当前获取焦点是哪个输入框
        buildPageInput = function(enabled, that, arr, showButton, t) {
            if (enabled) {
                var op = that.options, maxlength = op.pageCount.toString().length, className = showButton ? ' group' : '',
                    input = '<input type="text" class="text ' + className + '" value="' + (op.pageIndex + op.minuend)
                        + '" maxlength="' + maxlength + '" t="' + t + '"' + ' style="width:' + op.inputWidth + 'px;" />';
                arr.push(input);
                if (showButton) {
                    arr.push('<button class="btn group">' + op.markText['jump'] + '</button>');
                }
            }
            return that;
        },
        buildDataCount = function(enabled, that, arr, text, datas) {
            if (enabled) {
                arr.push('<span class="label">' + (text || '{0}').format(datas) + '</span>');
            }
            return that;
        },
        buildDataStat = function(enabled, that, arr, text) {
            if (enabled) {
                var op = that.options, str = text || '{0}', datas = [0, 0, 0];
                if (op.dataCount > 0) {
                    var min = (op.pageIndex - op.pageStart) * op.pageSize, max = min + op.pageSize;
                    datas = [min + 1, max < op.dataCount ? max : op.dataCount, op.dataCount];
                }
                arr.push('<div class="stat ' + getPosition(that, false) + '">' + str.format(datas) + '</div>');
            }
            return that;
        },
        keyPaging = function(ev, that, obj) {
            var op = that.options, pageIndex = 0, ec = ev.keyCode;
            if (ec === 13) {
                pageIndex = getValue(obj);
            } else if ((ec === 38 || ec === 72) && op.pageIndex > op.pageStart) {
                pageIndex = op.pageStart + op.minuend;
            } else if ((ec === 40 || ec === 76) && (op.pageIndex + op.minuend) < op.pageCount) {
                pageIndex = op.pageCount;
            } else if ((ec === 37 || ec === 75) && (op.pageIndex - op.minuend - op.pageStart) >= op.pageStart) {
                pageIndex = op.pageIndex - 1 + op.minuend;
            } else if ((ec === 39 || ec === 74) && (op.pageIndex + op.minuend) < op.pageCount) {
                pageIndex = op.pageIndex + 1 + op.minuend;
            } else {
                obj.value = obj.value.replace(/[^\d]/, '');
                return false;
            }
            setInputer(that, obj);

            return { value: pageIndex };
        },
        setInputer = function(that, obj) {
            if ($.isElement(obj, 'INPUT')) {
                that.options.inputer = obj.getAttribute('t');
            }
        },
        isInputer = function(that, obj) {
            if ($.isElement(obj, 'INPUT')) {
                return that.options.inputer === obj.getAttribute('t');
            }
            return false;
        },
        checkInputValue = function(op, val) {
            if (val > op.pageCount) {
                val = op.pageCount - op.minuend;
            } else if (val < op.pageStart) {
                val = op.pageStart;
            }
            return val;
        },
        pageCallback = function(that, val) {
            var op = that.options;
            if ($.isString(op.url, true)) {
                location.href = op.url.format(op.url.indexOf('{0}') >= 0 ? val : op);
            } else if ($.isFunction(op.callback)) {
                op.callback(val, op.callbackParam);
            }
        },
        realCallback = function(that, val) {
            var op = that.options;
            //是否启用防抖功能，抖动频率需大于50毫秒
            if (op.debounce && op.debounceTime >= defaultDebounceTime) {
                //内部分页，显示分页效果
                that.paging(val);
                //防抖
                if (op.timerDebounce != null) { window.clearTimeout(op.timerDebounce); }
                //外部回调
                op.timerDebounce = window.setTimeout(function() { pageCallback(that, val); }, op.debounceTime);
            } else {
                pageCallback(that, val);
            }
        },
        setCallback = function(that, objs, eventName, minuend, func, isPageSize) {
            var op = that.options, obj = objs, objVal = null, val = 0;
            if ($.isArray(objs)) {
                obj = objs[0], objVal = objs[1];
            }
            if ($.isUndefined(obj)) { return false; }
            $.addEventListener(obj, eventName, function(ev) {
                //判断是否是键盘按钮事件 keyup keydown keypress 等
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
            });
        },
        getClassName = function(that) {
            return that.options.className || defaultClassName;
        },
        getPosition = function(that, isMain) {
            return isMain ? that.options.position : positions[that.options.position] ? 'right' : 'left';
        },
        longPressPaging = function(that, obj, isStop) {
            var op = that.options;
            if (isStop) {
                if (op.timerLongPress) { window.clearTimeout(op.timerLongPress); }
                if (op.timerLongPress2) { window.clearInterval(op.timerLongPress2); }
                return false;
            }
            op.timerLongPress2 = window.setInterval(function() {
                var val = op.pageIndex, add = obj.className.indexOf('next') >= 0;
                val += add ? 1 : -1;

                if (!checkPageIndex(that, val)) {
                    if (op.timerLongPress2) { window.clearInterval(op.timerLongPress2); }
                    return false;
                }
                setValue(obj, val);
                realCallback(that, val);
            }, op.longPressInterval);
        },
        createEvent = function(that, minuend) {
            var op = that.options, links = op.element.getElementsByTagName('A'), c = links.length;
            for (var i = 0; i < c; i++) {
                var a = links[i];
                if (op.useLongPress && (a.className.indexOf('prev') >= 0 || a.className.indexOf('next') >= 0)) {
                    $.addEventListener(a, 'mousedown', function() {
                        var obj = this;
                        op.timerLongPress = window.setTimeout(function() {
                            longPressPaging(that, obj, false);
                        }, op.longPressTime);
                    });
                    $.addEventListener(op.element, 'mouseup', function() {
                        longPressPaging(that, null, true);
                    });
                    $.addEventListener(op.element, 'mouseout', function() {
                        longPressPaging(that, null, true);
                    });
                }
                setCallback(that, a, 'click', 0);
            }

            var select = op.element.getElementsByTagName('Select')[0];
            if (select !== null) { select.value = op.pageSize; }
            setCallback(that, select, 'change', 0, function(val) { op.pageSize = val; }, true);

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
                $.addEventListener(inputs[i], 'keyup', function(ev) {
                    this.value = this.value.replace(/[^\d]/, '');
                });
                if (isInputer(that, inputs[i])) {
                    focusInput = inputs[i];
                }
            }
            //设置输入框获取焦点
            $.setFocus(focusInput);
        },
        getValue = function(obj) {
            return parseInt(obj.value || obj.getAttribute('value'), 10);
        },
        setValue = function(obj, value) {
            if (obj.tagName === 'INPUT') {
                obj.value = value;
            } else {
                obj.setAttribute('value', value);
            }
        },
        buildPageSize = function(enabled, that, arr, minuend) {
            if (enabled) {
                var op = that.options, html = ['<select class="select">'], selected = false;
                if ($.isArray(op.pageSizeItems)) {
                    for (var i in op.pageSizeItems) {
                        var dr = op.pageSizeItems[i];
                        if ($.isInteger(dr)) {
                            html.push('<option value="' + dr + '">' + dr + '</option>');
                        } else if ($.isArray(dr)) {
                            if (!selected) {
                                selected = parseInt(dr[0], 10) === op.pageSize;
                            }
                            html.push('<option value="' + dr[0] + '">' + (dr[1] || dr[0]) + '</option>');
                        }
                    }
                }
                if (!selected && op.pageSizeItems.indexOf(op.pageSize) < 0) {
                    html.push('<option value="' + op.pageSize + '">' + op.pageSize + '</option>');
                    //将自定义pageSize追加到默认的选项中
                    if(defaultPageSizeItems.indexOf(op.pageSize) < 0){
                        defaultPageSizeItems.push(op.pageSize);
                    }
                }
                html.push('</select>');

                arr.push(html.join(''));
            }
            return that;
        };

    $.Pagination = Pagination;
}(OUI);