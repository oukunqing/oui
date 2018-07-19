
/*
 @Title: OUI.Pagination.js
 @Description：分页插件
 @Author: oukunqing
 @License：MIT
*/

!function($) {
    'use strict';

    var doc = document,
        head = document.getElementsByTagName('head')[0],
        thisFilePath = $.getScriptSelfPath(),
        defaultClassName = 'oui-pagination',
        defaultPositon = 'left',
        defaultType = 'symbol',
        defaultSkin = 'default',
        positions = {
            left: 1, right: 0
        },
        setNumber = function(op, keys) {
            for (var i in keys) {
                var key = parseInt(keys[i], 10);
                if (isNaN(key) || op[key] < 0) {
                    op[key] = 0;
                }
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
            if ($.isNumber(options)) {
                op.pageIndex = options;
                if ($.isNumber(dataCount)) {
                    op.dataCount = dataCount;
                }
                setNumber(op, ['dataCount', 'pageIndex']);
            } else {
                $.extend(op, options);
                if (!$.isElement(op.element)) {
                    if ($.isString(op.element)) {
                        op.element = doc.getElementById(op.element);
                    } else {
                        op.element = doc.createElement('DIV');
                        op.element.id = new Date().getTime();
                        doc.body.appendChild(op.element);
                    }
                }
                if (!texts[op.markType]) {
                    op.markType = defaultType;
                }
                op.markText = $.extend(texts[op.markType], options.markText);

                setNumber(op, ['dataCount', 'pageStart', 'pageSize', 'pageIndex', 'markCount']);

                if (op.pageSize < 1) {
                    op.pageSize = 1;
                }

                if ($.isNumber(op.debounce) && op.debounce >= 50) {
                    op.debounceTimeout = op.debounce;
                    op.debounce = true;
                }

                //判断是否显示输入框，若外部参数未指定，则设置为显示
                if (!op.showList && !$.isBoolean(options.showPageInput)) {
                    op.showPageInput = true;
                }
            }

            return op;
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
        buildLinkText = function(enabled, that, arr, pageIndex, key, noLink, className) {
            if (!enabled) {
                return false;
            }
            var text = that.options.markText[key];
            if (noLink) {
                arr.push(['<li>', '<a class="none ' + (className || '') + '">', text, '</a>', '</li>'].join(''));
            } else {
                arr.push(['<li>', '<a class="link ' + (className || '') + '" value="' + pageIndex + '">', text, '</a>', '</li>'].join(''));
            }
        },
        // 参数 t 用来指示当前获取焦点是哪个输入框
        buildPageInput = function(enabled, that, arr, showButton, t) {
            if (!enabled) {
                return false;
            }
            var op = that.options, maxlength = op.pageCount.toString().length, className = showButton ? ' group' : '',
                input = '<input type="text" class="text ' + className + '" value="' + (op.pageIndex + op.minuend)
                    + '" maxlength="' + maxlength + '" t="' + t + '"' + '/>';
            arr.push(input);
            if (showButton) {
                arr.push('<button class="btn group">' + op.markText['jump'] + '</button>');
            }
        },
        buildDataCount = function(enabled, that, arr, text, datas) {
            if (!enabled) {
                return false;
            }
            arr.push('<span class="label">' + (text || '{0}').format(datas) + '</span>');
        },
        buildDataStat = function(enabled, that, arr, text) {
            if (!enabled) {
                return false;
            }
            var op = that.options, str = text || '{0}', datas = [0, 0, 0];
            if (op.dataCount > 0) {
                var min = (op.pageIndex - op.pageStart) * op.pageSize, max = min + op.pageSize;
                datas = [min + 1, max < op.dataCount ? max : op.dataCount, op.dataCount];
            }
            arr.push('<div class="stat ' + getPosition(that, false) + '">' + str.format(datas) + '</div>');
        },
        keyPaging = function(ev, that, obj) {
            var op = that.options, pageIndex = 0;
            if (ev.keyCode === 13) {
                pageIndex = getValue(obj);
            } else if (ev.keyCode === 38 && op.pageIndex > op.pageStart) {
                pageIndex = op.pageStart + op.minuend;
            } else if (ev.keyCode === 40 && (op.pageIndex + op.minuend) < op.pageCount) {
                pageIndex = op.pageCount;
            } else if (ev.keyCode === 37 && (op.pageIndex - op.minuend - op.pageStart) >= op.pageStart) {
                pageIndex = op.pageIndex - 1 + op.minuend;
            } else if (ev.keyCode === 39 && (op.pageIndex + op.minuend) < op.pageCount) {
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
                    op.callback(op.pageStart, op.callbackParam);
                } else {
                    val = checkInputValue(op, val - minuend);
                    //是否启用防抖功能，抖动频率需大于50毫秒
                    if (op.debounce && op.debounceTimeout > 50) {
                        //内部分页，显示分页效果
                        that.paging(val);
                        //防抖
                        if (op.timerDebounce != null) { window.clearTimeout(op.timerDebounce); }
                        //外部回调
                        op.timerDebounce = window.setTimeout(function() { op.callback(val, op.callbackParam); }, op.debounceTimeout);
                    } else {
                        op.callback(val, op.callbackParam);
                    }
                }
            });
        },
        getClassName = function(that) {
            return that.options.className || defaultClassName;
        },
        getPosition = function(that, isMain) {
            return isMain ? that.options.position : positions[that.options.position] ? 'right' : 'left';
        },
        createEvent = function(that, minuend) {
            var op = that.options, links = op.element.getElementsByTagName('A'), c = links.length;
            for (var i = 0; i < c; i++) {
                setCallback(that, links[i], 'click', 0);
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
        buildPageSize = function(enabled, that, arr, minuend) {
            if (!enabled) {
                return false;
            }
            var op = that.options, html = ['<select class="select">'], selected = false;
            if ($.isArray(op.sizeOptions)) {
                for (var i in op.sizeOptions) {
                    var dr = op.sizeOptions[i];
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
            if (!selected && op.sizeOptions.indexOf(op.pageSize) < 0) {
                html.push('<option value="' + op.pageSize + '">' + op.pageSize + '</option>');
            }
            html.push('</select>');

            arr.push(html.join(''));
        };

    function Pagination(options, dataCount) {
        this.options = setOptions({
            element: null,              //分页显示HTML控件（或ID）
            pageStart: 0,               //起始页，0 或 1，与 pageIndex 起始值对应
            pageIndex: 0,               //起始页码，默认与 pageStart 相同
            pageSize: 10,               //每页显示条数，默认为10
            dataCount: 0,               //总数据条数
            markCount: 10,              //分页数字按钮显示个数，默认为10个
            markType: defaultType,      //标记类型：图标|中文|英文（symbol|chinese|english）
            markText: null,   //标记文字（上一页 下一页）
            showList: true,             //是否显示数字列表，若不显示数字列表，则默认显示输入框
            showInvalid: true,          //是否显示无效的按钮
            showEllipsis: true,         //是否显示省略号(快进)按钮
            showFirstLast: true,        //是否显示首页/尾页按钮
            showPageInput: false,       //是否显示页码输入框
            showPageJump: true,         //是否显示页码跳转输入框
            showDataCount: false,       //是否显示数据条数
            showPageCount: true,        //是否显示总页数
            showDataStat: false,        //是否显示数据统计
            showSizeSelect: true,       //是否显示PageSize下拉框
            sizeOptions: [5, 10, 20, 30, 50, 100],      //PageSize下拉框默认选项
            callback: function(pageIndex, param) {      //回调函数
                console.log('pageIndex: ', pageIndex, ', param: ', param);
            },
            callbackParam: null,            //回调参数
            useKeyEvent: true,              //是否启用快捷键（回车键/方向键）
            showReload: false,              //是否显示刷新按钮
            position: defaultPositon,       //left|right
            className: defaultClassName,    //默认样式名称，可以修改为外置样式
            skin: defaultSkin,              //样式，若skin=null则不启用内置样式
            debounce: true,                 //是否启用防抖功能（或者值为number，且大于50即为启用）
            debounceTimeout: 256            //抖动时长，单位：毫秒
        }, options, dataCount);

        if (this.options.className === defaultClassName) {
            $.loadLinkStyle($.getFilePath(thisFilePath) + $.getFileName(thisFilePath, true) + '.css', 'oui-pagination');
        }

        this.paging();
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
            var mi = parseInt(op.markCount / 2, 10),
                mc = Math.ceil(op.markCount / 2),
                minMax = getMinMax(that),
                min = minMax[0],
                max = minMax[1] + op.pageStart,
                quickNum = 0,
                pmSub = op.pageIndex - op.markCount,
                pcSub = op.pageCount - op.minuend,
                pmSum = op.pageIndex + op.markCount,
                className = op.markType === defaultType ? 'symbol' : 'text',
                html = [
                    '<div class="' + getClassName(that) + '">',
                    '<div class="' + op.skin + ' ' + getPosition(that, true) + '">',
                    '<ul class="list">'
                ];

            buildDataCount(op.showDataCount, that, html, op.markText['dataCount'], op.dataCount);

            buildPageSize(op.showSizeSelect, that, html, op.minuend);

            if (op.pageIndex != min && op.pageCount > 0) {
                buildLinkText(op.showFirstLast, that, html, op.pageStart, 'first', false, className);
                //显示省略号快退按钮
                if (op.showEllipsis && pmSub >= op.pageStart) {
                    quickNum = pmSub > op.pageStart ? pmSub : op.pageStart;
                    buildLinkText(true, that, html, quickNum, 'ellipsis', false, 'ellipsis');
                }
                buildLinkText(true, that, html, op.pageIndex - 1, 'previous', false, className);
            } else if (op.showInvalid) {
                buildLinkText(op.showFirstLast, that, html, 0, 'first', true, className);
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
                }
                buildLinkText(op.showFirstLast, that, html, pcSub, 'last', false, className);
            } else if (op.showInvalid) {
                buildLinkText(true, that, html, 0, 'next', true, className);
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

    $.Pagination = Pagination;
}(OUI);