
!function ($) {
    'use strict';

    var doc = document,
        head = document.getElementsByTagName('head')[0],
        thisFilePath = $.getScriptFilePath(),
        texts = {
            symbol: {
                first: '&lt;&lt;', previous: '&lt;', next: '&gt;', last: '&gt;&gt;', ellipsis: '\u2026',
                refurbish: 'Reload',
                pageCount: '\u5171 {0} \u9875', dataCount: '\u5171 {0} \u6761',
                dataStat: '\u663e\u793a\u7b2c{0}\u6761\u5230\u7b2c{1}\u6761\u8bb0\u5f55\uff0c\u5171{2}\u6761'
            },
            chinese: {
                first: '\u9996\u9875', previous: '\u4e0a\u4e00\u9875', next: '\u4e0b\u4e00\u9875', last: '\u5c3e\u9875', ellipsis: '\u2026',
                refurbish: '\u5237\u65b0',
                pageCount: '\u5171 {0} \u9875', dataCount: '\u5171 {0} \u6761',
                dataStat: '\u663e\u793a\u7b2c {0} \u6761\u5230\u7b2c {1} \u6761\u8bb0\u5f55\uff0c\u5171 {2} \u6761'
            },
            english: {
                first: 'First', previous: 'Previous', next: 'Next', last: 'Last', ellipsis: '\u2026', 
                refurbish: 'Reload', 
                pageCount: '\u5171 {0} \u9875', dataCount: '\u5171 {0} \u6761',
                dataStat: '\u663e\u793a\u7b2c {0} \u6761\u5230\u7b2c {1} \u6761\u8bb0\u5f55\uff0c\u5171 {2} \u6761'
            }
        },
        positions = {
            left: 1, right: 0
        },
        setNumber = function (op, keys) {
            for (var i in keys) {
                var key = keys[i];
                if (isNaN(Number(op[key])) || op[key] < 0) {
                    op[key] = 0;
                }
            }
        },
        setOptions = function (op, options) {
            if ($.isNumber(options)) {
                op.pageIndex = options;
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
                    op.markType = 'symbol';
                }
                if (!$.isArray(options.markText)) {
                    op.markText = texts[op.markType];
                }
                setNumber(op, ['dataCount', 'pageStart', 'pageSize', 'pageIndex', 'markCount']);

                if (op.pageSize < 1) {
                    op.pageSize = 1;
                }

                if($.isNumber(op.debounce) && op.debounce >= 50){
                    op.debounceTimeout = op.debounce;
                    op.debounce = true;
                }

                if (op.showList && !$.isBoolean(op.showPageCount)) {
                    op.showPageCount = true;
                }
            }
            return op;
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
        buildLinkText = function (enabled, that, arr, pageIndex, key, noLink) {
            if(!enabled){return false;}
            if (noLink) {
                arr.push(['<li>', '<a class="text">', that.options.markText[key], '</a>', '</li>'].join(''));
            } else {
                arr.push([
                    '<li>', '<a class="link" href="javascript:void(0);" value="' + pageIndex + '">', that.options.markText[key], '</a>', '</li>'
                ].join(''));
            }
        },
        buildPageInput = function (enabled, that, arr, showButton) {
            if(!enabled){return false;}
            var op = that.options, maxlength = op.pageCount.toString().length, className = showButton ? ' group' : '';
            arr.push('<input type="text" class="text' + className + '" value="' + (op.pageIndex + op.minuend) + '" maxlength="' + maxlength + '"/>');
            if (showButton) {
                arr.push('<button class="btn group">GO</button>');
            }
        },
        buildDataCount = function(enabled, that, arr, text, datas){
            if(!enabled){return false;}
            arr.push('<span class="label">' + (text || '{0}').format(datas) + '</span>');
        },
        buildDataStat = function(enabled, that, arr, text){
            if(!enabled){return false;}
            var op = that.options, min = (op.pageIndex - op.pageStart) * op.pageSize, max = min + op.pageSize;
            var datas = [
                min + 1, max < op.dataCount ? max : op.dataCount, op.dataCount
            ];
            arr.push('<div class="stat ' + getPosition(that, false) + '">' + (text || '{0}').format(datas) + '</div>');
        },
        setCallback = function(that, objs, eventName, minuend, func, isPageSize){
            var op = that.options, obj = objs, objVal = null;
            if($.isArray(objs)){
                obj = objs[0], objVal = objs[1];
            }
            if($.isUndefined(obj)) { return false; }
            $.addListener(obj, eventName, function (ev) {
                if(eventName.indexOf('key') >= 0 && ev.keyCode !== 13){
                    return false;
                }
                var val = getValue(objVal || this);
                if (!isNaN(val) && $.isFunction(op.callback)) {
                    if($.isFunction(func)){ func(val); }
                    if(isPageSize){
                        //设置PageSize，页码重新设置为起始页码
                        op.callback(op.pageStart);
                    } else {
                        //是否启用防抖功能，抖动频率需大于50毫秒
                        if(op.debounce && op.debounceTimeout > 50){
                            //内部分页
                            that.paging(val - minuend);

                            if(op.timerDebounce != null){
                                window.clearTimeout(op.timerDebounce);
                            }
                            op.timerDebounce = window.setTimeout(function(){
                                //外部回调
                                op.callback(val - minuend);
                            }, op.debounceTimeout);
                        } else {
                            op.callback(val - minuend);
                        }
                    }
                }
            });
        },
        getClassName = function(that){
            return that.options.className || 'oui-pagination';
        },
        getPosition = function(that, isMain){
            return isMain ? that.options.position : positions[that.options.position] ? 'right' : 'left';
        },
        createEvent = function (that, minuend) {
            var op = that.options, links = op.element.getElementsByTagName('A'), c = links.length;
            for (var i = 0; i < c; i++) {
                setCallback(that, links[i], 'click', 0);
            }

            var selects = op.element.getElementsByTagName('Select');
            if(selects[0] !== null){ selects[0].value = op.pageSize; }
            setCallback(that, selects[0], 'change', 0, function(val){ op.pageSize = val; }, true);

            var inputs = op.element.getElementsByTagName('Input'), ic = inputs.length;
            var btn = op.element.getElementsByTagName('Button');
            setCallback(that, [btn[0], inputs[ic-1]], 'click', minuend);

            for (var i = 0; i < ic; i++) {
                setCallback(that, inputs[i], 'keyup', minuend);
            }
        },
        getValue = function (obj) {
            return parseInt(obj.value || obj.getAttribute('value'), 10);
        },
        buildPageSize = function (enabled, that, arr, minuend) {
            if(!enabled){return false;}
            var op = that.options, html = ['<select class="select">'], selected = false;
            if ($.isArray(op.sizeOptions)) {
                for (var i in op.sizeOptions) {
                    html.push('<option value="' + op.sizeOptions[i] + '">' + op.sizeOptions[i] + '</option>');
                }
                selected = op.sizeOptions.indexOf(op.pageSize) >= 0;
            } else if ($.isObject(op.sizeOptions)) {
                for (var k in op.sizeOptions) {
                    var dr = op.sizeOptions[k];
                    html.push('<option value="' + (dr.value || dr.val) + '">' + (dr.text || dr.key) + '</option>');
                }
            }
            if(!selected){
                html.push('<option value="' + op.pageSize + '">' + op.pageSize + '</option>');
            }
            html.push('</select>');

            arr.push(html.join(''));
        };

    function Pagination(options) {
        $.loadLinkStyle($.getFilePath(thisFilePath) + $.getFileName(thisFilePath, true) + '.css', 'oui-pagination');

        this.options = setOptions({
            element: null,
            pageStart: 0,
            pageIndex: 0,
            pageSize: 10,
            dataCount: 0,
            markCount: 10,
            markType: 'symbol',     // Symbol|Chinese|Englist
            markText: texts['symbol'],
            showList: true,
            className: 'oui-pagination',    //默认样式名称，可以修改为外置样式
            skin: 'default',        //样式，若skin=null则不启用内置样式
            position: 'left',       // left|right
            showInvalid: true,
            showEllipsis: true,
            showFirstLast: true,
            showPageInput: true,
            showPageJump: true,
            showRefurbish: true,
            showDataCount: true,
            showPageCount: true,
            showDataStat: true,
            showSizeSelect: true,
            sizeOptions: [5, 10, 20, 30, 50, 100],
            callback: function (pageIndex) {
                console.log('pageIndex: ', pageIndex);
            },
            debounce: true,                 //是否启用防抖功能（或者值为number，且大于50即为启用）
            debounceTimeout: 256            //抖动时长，单位：毫秒
        }, options);

        this.paging();
    }

    Pagination.prototype = {
        paging: function (options) {
            if ($.isObject(options) || $.isNumber(options)) {
                this.options = setOptions(this.options, options);
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
                html = [
                    '<div class="' + getClassName(that) + '">', 
                    '<div class="' + op.skin + ' ' + getPosition(that, true) + '">',
                    '<ul class="list">'
                ];

            console.log('minMax: ', minMax);

            //
            buildDataCount(op.showDataCount, that, html, op.markText['dataCount'], op.dataCount);

            buildPageSize(op.showSizeSelect, that, html, op.minuend);

            if (op.pageIndex != min && op.pageCount > 0) {
                buildLinkText(op.showFirstLast, that, html, op.pageStart, 'first');
                //显示省略号快退按钮
                if (op.showEllipsis && pmSub >= op.pageStart) {
                    quickNum = pmSub > op.pageStart ? pmSub : op.pageStart;
                    buildLinkText(true, that, html, quickNum, 'ellipsis');
                }
                buildLinkText(true, that, html, op.pageIndex - 1, 'previous');
            }
            else if (op.showInvalid) {
                buildLinkText(op.showFirstLast, that, html, 0, 'first', true);
                buildLinkText(true, that, html, 0, 'previous', true);
            }

            if (op.showList) {
                var c = 0;
                for (var i = min; i < max; i++) {
                    var num = i + op.minuend;
                    if (i > op.pageCount || c > op.markCount) {
                        break;
                    }
                    if (i === op.pageIndex) {
                        html.push('<li><a class="cur">' + num + '</a></li>');
                    } else {
                        html.push('<li><a class="link" href="javascript:void(0);" value="' + i + '">' + num + '</a></li>');
                    }
                    c++;
                }
            } else {
                buildPageInput(op.showPageInput, that, html, false);
            }

            //上一页<、下一页>、第一页<<、最后一页标记>>
            if (op.pageIndex != op.pageCount - op.minuend && op.pageCount > 0) {
                buildLinkText(true, that, html, op.pageIndex + 1, 'next');

                //显示省略号快进按钮
                if (op.showEllipsis && pmSum < op.pageCount) {
                    quickNum = pmSum < pcSub ? pmSum : pcSub;
                    buildLinkText(true, that, html, quickNum, 'ellipsis');
                }
                buildLinkText(op.showFirstLast, that, html, pcSub, 'last');
            }
            else if (op.showInvalid) {
                buildLinkText(true, that, html, 0, 'next', true);
                buildLinkText(op.showFirstLast, that, html, 0, 'last', true);
            }

            buildPageInput(op.showPageJump, that, html, true);

            buildLinkText(op.showRefurbish, that, html, op.pageIndex, 'refurbish');

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