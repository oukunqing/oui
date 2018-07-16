
!function ($) {
    'use strict';

    var doc = document,
        head = document.getElementsByTagName('head')[0],
        thisFilePath = $.getScriptFilePath(),
        texts = {
        symbol: { 
            first: '&lt;&lt;', previous: '&lt;', next: '&gt;', last: '&gt;&gt;', ellipsis: '...',
            refurbish: 'Re',
            totalPage: '\u5171{0}\u9875' 
        },
        chinese: {
            first: '\u9996\u9875', previous: '\u4e0a\u4e00\u9875', next: '\u4e0b\u4e00\u9875', last: '\u5c3e\u9875', ellipsis: '...',
            refurbish: '\u5237\u65b0',
            totalPage: '\u5171{0}\u9875'
        },
        english: { 
            first: 'First', previous: 'Previous', next: 'Next', last: 'Last', ellipsis: '...', refurbish: 'Re', totalPage: 'Total Page: {0}'
        }
    }, setNumber = function (op, keys) {
        for (var i in keys) {
            var key = keys[i];
            if (isNaN(Number(op[key])) || op[key] < 0) {
                op[key] = 0;
            }
        }
    }, setOptions = function (op, options) {
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
            if(op.showType !== 'list'){
                op.showPageJump = true;
            }
        }
        return op;
    }, getMinMax = function(pageCount, pageStart, pageIndex, markCount){
        var min = pageStart, max = 0;
        if (pageCount <= markCount)
        {
            max = pageCount;
        }
        else
        {
            var mc = Math.ceil(markCount/2), num = pageIndex - pageStart + mc;
            max = num > pageCount ? pageCount : num < markCount ? markCount : num;
            min = max - markCount + pageStart;
            if (min < pageStart)
            {
                min = pageStart;
            }
        }
        return [min, max];
    }, buildLinkText = function (pageIndex, key, options, noLink) {
        if(noLink){                
            return ['<li>', '<a class="text">', options.markText[key], '</a>', '</li>'].join('');
        } else {
            return [
                '<li>', '<a class="link" href="javascript:void(0);" value="' + pageIndex + '">', options.markText[key], '</a>', '</li>'
            ].join('');
        }
    }, buildPageInput = function (arr, pageCount, pageIndex, minuend, showButton) {
        var maxlength = pageCount.toString().length;
        arr.push('<input type="text" class="jump" value="' + (pageIndex + minuend) + '" maxlength="' + maxlength + '"/>');
        if(showButton){
            arr.push('<button class="btn">GO</button>');
        }
    }, createEvent = function(op, minuend){
        var links = op.element.getElementsByTagName('A'), c = links.length;
        for(var i=0; i<c; i++){
            $.addListener(links[i], 'click', function(){
                var val = getValue(this);
                if(!isNaN(val)){
                    op.callback(val);
                }
            });
        }

        var selects = op.element.getElementsByTagName('Select');
        if(selects.length > 0){
            console.log('op.pageSize: ', op.pageSize);
            selects[0].value = op.pageSize;

            $.addListener(selects[0], 'change', function(){
                var val = parseInt(this.value, 10);
                if(!isNaN(val)){
                    op.pageSize = val;
                    op.callback(op.pageIndex);
                }
            });
        }

        var input = op.element.getElementsByTagName('Input');
        var btn = op.element.getElementsByTagName('Button');
        if( btn.length > 0){
            $.addListener(btn[0], 'click', function(){
                if(input.length > 0){
                    var val = parseInt(input[0].value, 10);
                    if(!isNaN(val)){
                        op.callback(val - minuend);
                    }
                }
            });
        }
        if(input.length > 0){
            $.addListener(input[0], 'keyup', function(ev){
                if(ev.keyCode === 13){
                    var val = parseInt(this.value, 10);
                    if(!isNaN(val)){
                        op.callback(val - minuend);
                    }
                }
            });
        }
    }, getValue = function(obj){
        return parseInt(obj.getAttribute('value'), 10);
    }, buildPageSize = function(op, minuend){
        var html = ['<select class="select">'];
        console.log(typeof op.sizeOptions);
        if($.isArray(op.sizeOptions)){
            for(var i in op.sizeOptions){
                html.push('<option value="' + op.sizeOptions[i] + '">' + op.sizeOptions[i] + '</option>');
            }
        } else if($.isObject(op.sizeOptions)){
            for(var k in op.sizeOptions){
                var dr = op.sizeOptions[k];
                html.push('<option value="' + (dr.value || dr.val) + '">' + (dr.text || dr.key) + '</option>');
            }
        }
        html.push('</select>');

        return html.join('');
    };

    function Pagination(options) {
        $.loadLinkStyle($.getFilePath(thisFilePath) + $.getFileName(thisFilePath, true) + '.css');

        this.options = setOptions({
            element: null,
            pageStart: 0,
            pageIndex: 0,
            pageSize: 10,
            dataCount: 0,
            markCount: 10,
            markType: 'symbol', // Symbol|Chinese|Englist
            markText: texts['symbol'],
            showType: 'list',
            showInvalid: true,
            showEllipsis: true,
            showFirstLast: true,
            showDataCount: true,
            showPageJump: true,
            showRefurbish: true,
            showDataStat: true,
            showPageCount: true,
            showSizeSelect: true,
            sizeOptions: [5, 10, 20, 30, 50, 100],            
            callback: function(pageIndex){
                console.log('pageIndex: ', pageIndex);
            }
        }, options);

        this.paging();
    }

    Pagination.prototype = {
        paging: function(options){
            if($.isObject(options) || $.isNumber(options)){
                this.options = setOptions(this.options, options);
            }
            var op = this.options, mi =parseInt(op.markCount / 2, 10), 
                mc = Math.ceil(op.markCount / 2), 
                minuend = Math.abs(op.pageStart - 1),
                pageCount = Math.ceil(op.dataCount / op.pageSize),
                minMax = getMinMax(pageCount, op.pageStart, op.pageIndex, op.markCount),
                min = minMax[0],
                max = minMax[1] + op.pageStart,
                quickNum = 0,
                s = ['<div class="oui-pagination">', '<ul>'];

                console.log('minMax: ', minMax);

            if (op.pageIndex != min && pageCount > 0) {
                if(op.showFirstLast){
                    s.push(buildLinkText(op.pageStart, 'first', op));
                }
                //显示省略号快退按钮
                if ((op.pageIndex - op.pageStart >= op.markCount) && op.showEllipsis){
                    quickNum = op.pageIndex - op.markCount > op.pageStart ? op.pageIndex - op.markCount : op.pageStart;
                    s.push(buildLinkText(quickNum, 'ellipsis', op));
                }
                s.push(buildLinkText(op.pageIndex - 1, 'previous', op));
            }            
            else if(op.showInvalid){
                if(op.showFirstLast){
                    s.push(buildLinkText(0, 'first', op, true));
                }
                s.push(buildLinkText(0, 'previous', op, true));
            }

            if(op.showType === 'list'){
                var c = 0;
                for(var i=min; i<max; i++){
                    var num = i + minuend;
                    if( i> pageCount || c >op.markCount){
                        break;
                    }
                    if(i === op.pageIndex){
                        s.push('<li><a class="cur">' + num + '</a></li>');
                    } else {
                        s.push('<li><a class="link" href="javascript:void(0);" value="' + i + '">' + num + '</a></li>');
                    }
                    c++;
                }
            } else {
                //buildPageInput(s, pageCount, op.pageIndex, minuend);
            }

            //上一页<、下一页>、第一页<<、最后一页标记>>
            if (op.pageIndex != pageCount - minuend && pageCount > 0) {
                s.push(buildLinkText(op.pageIndex + 1, 'next', op));

                //显示省略号快进按钮
                if ((pageCount - op.pageIndex >= op.markCount) && op.showEllipsis){
                    quickNum = op.pageIndex + op.markCount < pageCount - minuend ? op.pageIndex + op.markCount : pageCount - minuend;
                    s.push(buildLinkText(quickNum, 'ellipsis', op));
                }
                if(op.showFirstLast){
                    s.push(buildLinkText(pageCount - minuend, 'last', op));
                }
            }
            else if(op.showInvalid){  
                s.push(buildLinkText(0, 'next', op, true));
                if(op.showFirstLast){
                    s.push(buildLinkText(0, 'last', op, true));
                }
            }

            if(op.showPageJump){
                buildPageInput(s, pageCount, op.pageIndex, minuend, true);
            }

            if(op.showRefurbish){
                s.push(buildLinkText(op.pageIndex, 'refurbish', op));
            }

            if(op.showPageCount){
                s.push(op.markText.totalPage.format(pageCount));
            }

            if(op.showSizeSelect){
                s.push(buildPageSize(op, minuend));
            }

            s.push('</ul>');

            s.push('</div>');

            op.element.innerHTML = s.join('');

            createEvent(op, minuend);
        }
    };

    $.Pagination = Pagination;
}(OUI);