
!function ($) {
    'use strict';

    var texts = {
        symbol: { first: '<<', previous: '<', next: '>', last: '>>' },
        chinese: {
            first: '\u9996\u9875', previous: '\u4e0a\u4e00\u9875', next: '\u4e0b\u4e00\u9875', last: '\u5c3e\u9875'
        },
        english: { first: 'First', previous: 'Previous', next: 'Next', last: 'Last' }
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
                    op.element = document.getElementById(op.element);
                } else {
                    op.element = document.createElement('DIV');
                    op.element.id = new Date().getTime();
                    document.body.appendChild(op.element);
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
        }
        return op;
    }, getMinMax = function(pageCount, pageStart, pageIndex, markCount){
        var min = pageStart, max = 0;
        if (pageCount <= markCount)
        {
            max = markCount;
        }
        else
        {
            var mf = parseInt(markCount/2, 10), mc = Math.ceil(markCount/2);
            if (pageIndex > mf)
            {
                min = pageIndex - mf;
            }
            max = (pageIndex + mc) > pageCount ? pageCount : (pageIndex + mc);
            if (pageStart > 0) max += pageStart;
            var c = max - min;

            if (c < markCount)
            {
                if (min < markCount)
                {
                    max += markCount - c;
                }
                else if (min >= markCount)
                {
                    min -= markCount - c;
                }
            }
        }
        return [min, max];
    }, /* buildLinkNum = function(arr, min, max){
            for(var i=min; i<max; i++){
                arr.push('<li><a href="javascript:void(0);">' + (i + 1) + '</a></li>');
            }
        },*/ buildLinkText = function (pageIndex, key, options) {
            return [
                '<li>', '<a href="javascript:void(0);" value="' + pageIndex + '">', options.markText[key], '</a>', '</li>'
            ].join('');
        }, buildPageInput = function (arr) {

        }, getValue = function(obj){
            return parseInt(obj.getAttribute('value'), 10);
        };

    function Pagination(options) {
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
            callback: function(pageIndex){
                console.log('pageIndex: ', pageIndex);
            }
        }, options);

        console.log(this.options.callback);
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
                s = ['<div class="oui-pagination">', '<ul>'];

                console.log('minMax: ', minMax);

            if (op.pageIndex != min && pageCount > 0) {
                s.push(buildLinkText(op.pageStart, 'first', op));
                s.push(buildLinkText(op.pageIndex + minuend - 1, 'previous', op));
            }
            /*
            else if(_cg.showInvalid){
                strPage = _this.ShowNoLinkString(_cg.markText.Previous, symbol) + strPage;
                strPage = _this.ShowNoLinkString(_cg.markText.First, symbol) + strPage;    
            }*/

            if(op.showType === 'list'){
                var c = 0;
                for(var i=min; i<max; i++){
                    var num = i + minuend;
                    if( i> pageCount || c >op.markCount){
                        break;
                    }
                    if(i === op.pageIndex){
                        s.push('<li><a href="javascript:void(0);" value="' + i + '">' + num + '</a></li>');
                    } else {
                        s.push('<li><a href="javascript:void(0);" value="' + i + '">' + num + '</a></li>');
                    }
                    c++;
                }
            } else {
                buildPageInput(s);
            }

            //上一页<、下一页>、第一页<<、最后一页标记>>
            if (op.pageIndex != pageCount - minuend && pageCount > 0) {
                s.push(buildLinkText(op.pageIndex + 1, 'next', op));
                s.push(buildLinkText(pageCount - minuend, 'last', op));
            }/*
            else if(_cg.showInvalid){
                strPage += _this.ShowNoLinkString(_cg.markText.Next, symbol);
                strPage += _this.ShowNoLinkString(_cg.markText.Last, symbol);    
            }*/

            s.push('</ul></div>');

            op.element.innerHTML = s.join('');

            var links = op.element.getElementsByTagName('A'), c = links.length;
            for(var i=0; i<c; i++){
                links[i].onclick = function(){
                    op.callback(getValue(this));
                };
            }
        }
    };

    $.Pagination = Pagination;
}(OUI);