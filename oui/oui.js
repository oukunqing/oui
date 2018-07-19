
/*
 @Title: OUI
 @Description：JS通用代码库
 @Author: oukunqing
 @License：MIT
*/

// OUI
var OUI = function () {
    'use strict';

    var version = '1.0.0',
        isUndefined = function (o) { return typeof o === 'undefined'; },
        isString = function (s, nonempty) { return typeof s === 'string' && (nonempty ? s.trim() !== '' : true); },
        isNumber = function (n) { return typeof n === 'number'; },
        checkNumber = function (n, min, max) {
            var isNum = isNumber(n), isMin = isNumber(min), isMax = isNumber(max);
            return isNum ? (isMin && isMax ? n >= min && n <= max : (isMin ? n >= min : isMax ? n <= max : true)) : false;
        },
        isFunction = function (f) { return typeof f === 'function' && typeof f.nodeType !== 'number'; },
        isObject = function (o) { return o !== null && typeof o === 'object'; },
        isArray = Array.isArray || function (a) { return Object.prototype.toString.call(a) === '[object Array]'; },
        isBoolean = function (b, dv) {
            var bool = typeof b === 'boolean';
            return typeof dv === 'boolean' ? (bool ? b : dv) : bool;
        },
        isNumeric = function (o) { return /^[-+]?(\d+)([.][\d]{0,})?$/.test(o); },
        isDecimal = function (o) { return /^[-+]?(\d+)([.][\d]{0,})$/.test(o); },
        isInteger = function (o) { return /^[-+]?(\d+)$/.test(o); },
        toDecimal = function (s, defaultValue, decimalLen) {
            var v = parseFloat(s, 10);
            v = !isNaN(v) && $.isInteger(decimalLen) ? v.round(Math.abs(decimalLen)) : v;
            return !isNaN(v) ? v : Number(defaultValue) || 0;
        },
        toInteger = function (s, defaultValue) {
            var v = parseInt(s, 10);
            return !isNaN(v) ? v : Number(defaultValue) || 0;
        },
        isNull = function (o) { return o === null; },
        isProperty = function (o, property) { return o.hasOwnProperty(property) && (property in o); },
        trim = function (s) { return s.replace(/(^[\s]*)|([\s]*$)/g, ''); },
        extend = function (destination, source, deepCopy) {
            if(isObject(destination) && isObject(source)){
                for (var property in source) {
                    destination[property] = source[property];
                }
            }
            return destination;
        },
        utils = {
            isUndefined: isUndefined, isString: isString, isNumber: isNumber, isFunction: isFunction,
            isObject: isObject, isArray: isArray, isBoolean: isBoolean, isNull: isNull,
            isProperty: isProperty, trim: trim, extend: extend, version: version,
            isNumeric: isNumeric, isDecimal: isDecimal, isInteger: isInteger, isFloat: isDecimal, isInt: isInteger,
            isRegexp: function (o) { return isObject(o) || isFunction(o) ? ('' + o).indexOf('/') == 0 : false; },
            isNullOrUndefined: function (o) { return isUndefined(o) || isNull(o); },
            isEmpty: function (o) {
                if (isUndefined(o) || null === o) { return true; }
                else if (isString(o)) { return '' === trim(o); }
                else if (isArray(o)) { return 0 === o.length; }
                else if (isObject(o)) { for (var name in o) { return false; } return true; }
                return false;
            },
            toJsonString: function (o) { return JSON.stringify(o); },
            toJson: function (s) { return JSON.parse(s); },
            toEncode: function (s) { return encodeURIComponent(s); },
            toDecimal: toDecimal, toFloat: toDecimal, checkNumber: checkNumber,
            toInteger: toInteger, toInt: toInteger,
            quickSort: function (arr, key) {
                if (0 === arr.length) { return []; }
                var left = [], right = [], pivot = arr[0], c = arr.length;
                for (var i = 1; i < c; i++) {
                    arr[i][key] < pivot[key] ? left.push(arr[i]) : right.push(arr[i]);
                }
                return this.quickSort(left, key).concat(pivot, this.quickSort(right, key));
            }
        };

    return utils;
}();

// Dictionary
!function ($) {
    'use strict';

    function Dictionary() {
        var get = function (data) {
            var obj = { keys: [], values: [] };
            for (var k in data) {
                obj.keys.push(k), obj.values.push(data[k]);
            }
            return obj;
        }, _ = this;

        _.data = {}, _.keys = [], _.values = [];
        _.add = function (key, value) {
            if (!$.isUndefined(key) && !_.contains(key)) {
                var val = !$.isUndefined(value) ? value : null;
                _.data[key] = val, _.keys.push(key), _.values.push(val);
            }
            return _;
        }, _.remove = function (keys) {
            var arr = $.isArray(keys) ? keys : [keys];
            for (var i in arr) {
                var key = arr[i];
                if (!$.isUndefined(_.data[key])) {
                    delete _.data[key];
                }
            }
            var obj = get(_.data);
            _.keys = obj.keys, _.values = obj.values;
            return _;
        }, _.clear = function () {
            return _.data = {}, _.keys = [], _.values = [], _;
        }, _.contains = function (key, isAdd, value) {
            //return !$.isUndefined(_.data[key]);
            if ($.isUndefined(_.data[key])) {
                if (isAdd) { _.add(key, value); }
                return false;
            }
            return true;
        }, _.count = function () {
            return _.keys.length;
        }, _.getValue = function (key, defaultValue) {
            return !$.isUndefined(_.data[key]) ? _.data[key] : defaultValue;
        };
    }

    if (typeof window === 'object') {
        window.Dictionary = Dictionary;
    } else if (typeof global === 'object') {
        global.Dictionary = Dictionary;
    }

    $.extend($, { Dictionary: Dictionary });
}(OUI);

// Web
!function ($) {
    'use strict';

    var doc = function () { try { return document } catch (e) { return null } }(),
        head = doc ? doc.getElementsByTagName('head')[0] : null,
        redirect = function (url) {
            $.isString(url, true) ? location.href = url : null;
        },
        getQueryString = function (url, name) {
            var str = $.isString(url) ? url : location.href, params = str.substr(str.indexOf('?')), obj = {};
            if (params.indexOf('?') >= 0) {
                var arr = params.substr(1).split('&'), c = arr.length;
                for (var i = 0; i < c; i++) {
                    var s = arr[i], pos = s.indexOf('='), key = s.split('=')[0];
                    if (trim(key) !== '') {
                        obj[key] = pos > 0 ? unescape(s.substr(pos + 1)) : '';
                    }
                }
            }
            return !$.isUndefined(name) ? obj[name] : obj;
        },
        isDebug = function (key) {
            try { return !$.isUndefined(getQueryString()[key || 'debug']) } catch (e) { return false; }
        },
        isElement = function (ele, tagName) {
            var b = $.isObject(ele) && $.isNumber(ele.nodeType) && $.isString(ele.tagName);
            return b && $.isString(tagName) ? ele.tagName === tagName : b;
        },
        getLocationPath = function () {
            return location.href.substring(0, location.href.lastIndexOf('/') + 1);
        },
        getScriptSelfPath = function () {
            var elements = doc.getElementsByTagName('script'), len = elements.length;
            return elements[len - 1].src;
        },
        getFilePath = function (fullPath, currentPath) {
            var pos = fullPath.lastIndexOf('/'), prefix = currentPath || getLocationPath();
            if (pos >= 0) {
                var path = fullPath.substr(0, pos + 1);
                if (prefix && path.indexOf(prefix) === 0) {
                    path = path.substr(prefix.length);
                }
                return path;
            }
            return '';
        },
        getFileName = function (filePath, withoutExtension) {
            var pos = filePath.lastIndexOf('/'), path = pos > 0 ? filePath.substr(pos + 1) : filePath;
            var name = path.split('?')[0], pos = name.lastIndexOf('.');
            return pos >= 0 && withoutExtension ? name.substr(0, pos) : name;
        },
        createElement = function (nodeName, parent, func) {
            var ele = doc.createElement(nodeName);
            $.isFunction(func) && func(ele);
            isElement(parent) && parent.appendChild(ele);
            return ele;
        },
        getElementStyle = function (ele, styleName) {
            var style = ele.currentStyle || document.defaultView.getComputedStyle(ele, null);
            return $.isString(styleName) ? style[styleName] : style;
        },
        setAttribute = function (ele, attributes, exempt) {
            if (!exempt && (!isElement(ele) || !$.isObject(attributes))) { return false; }
            for (var key in attributes) {
                var val = attributes[key];
                if (!$.isNull(val) && !$.isUndefined(val)) {
                    try { ele.setAttribute(key, val); } catch (er) { console.log('setAttribute: ', er); }
                }
            }
            return ele;
        },
        setNoCache = function (filePath) {
            var postfix = $.isString(filePath) && filePath ? filePath + (filePath.indexOf('?') >= 0 ? '&' : '?') : '';
            return postfix + new Date().getMilliseconds();
        },
        loadLinkStyle = function (path, id) {
            if (!$.isUndefined(id) && doc.getElementById(id)) { return false; }
            return createElement('link', head, function (ele) {
                setAttribute(ele, { id: id, type: 'text/css', rel: 'stylesheet', href: setNoCache(path) }, true);
            });
        },
        loadJsScript = function (path, id, callback, parent) {
            if ($.isFunction(id) && !$.isFunction(callback)) {
                callback = id, id = null;
            }
            var node = createElement('script', parent || head, function (ele) {
                setAttribute(ele, { id: id, type: 'text/javascript', async: true, src: setNoCache(path), charset: 'utf-8' }, true);
            }), ae = node.attachEvent;

            if ($.isFunction(ae) && ae.toString() && ae.toString().indexOf('[native code]') >= 0) {
                node.attachEvent('onreadystatechange', function (ev) { onScriptLoad(ev, path); });
            } else {
                node.addEventListener('load', function (ev) { onScriptLoad(ev, path); }, false);
            }

            function onScriptLoad(ev, path) { !isDebug() && head.removeChild(node), onCallback(); }
            function onCallback() { $.isFunction(callback) && callback(); }

            return node;
        },
        cancelBubble = function (ev) {
            ev = ev || window.event || arguments.callee.caller.arguments[0];
            if (ev.stopPropagation) { ev.stopPropagation(); } else { ev.cancelBubble = true; }
            if (ev.preventDefault) { ev.preventDefault(); } else { ev.returnValue = false; }
        },
        addEventListener = function (ele, ev, func, useCapture) {
            ele.addEventListener ? ele.addEventListener(ev, func, useCapture || false) : ele.attachEvent('on' + ev, func);
        },
        removeEventListener = function (ele, ev, func, useCapture) {
            ele.removeEventListener ? ele.removeEventListener(ev, func, useCapture || false) : ele.detachEvent('on' + ev, func);
        },
        bindEventListener = function(obj, func) {
            if(!$.isObject(obj) || !$.isFunction(func)){
                return false;
            }
            var args = Array.prototype.slice.call(arguments).slice(2);
            return function (ev) {
                return func.apply(obj, [ev || window.event].concat(args));
            };
        },
        bind = function(obj, func, args) {
            if(!$.isObject(obj) || !$.isFunction(func)){
                return false;
            }
            return function () {
                return func.apply(obj, args || []);
            };
        },
        setFocus = function (ele) {
            try { return isElement(ele) ? ele.focus() || true : false; } catch (e) { return false; }
        };

    $.extend($, {
        doc: doc, head: head, redirect: redirect,
        getLocationPath: getLocationPath,
        getScriptSelfPath: getScriptSelfPath,
        getFilePath: getFilePath,
        getFileName: getFileName,
        getQueryString: getQueryString,
        isDebug: isDebug,
        isElement: isElement,
        createElement: createElement,
        getElementStyle: getElementStyle,
        setAttribute: setAttribute,
        setNoCache: setNoCache,
        loadLinkStyle: loadLinkStyle,
        loadJsScript: loadJsScript,
        cancelBubble: cancelBubble,
        addEventListener: addEventListener,
        removeEventListener: removeEventListener,
        bindEventListener: bindEventListener,
        bind: bind, 
        setFocus: setFocus
    });
}(OUI);

// Javascript Native Object
!function ($) {
    'use strict';

    var extendCounter = 1, debug = $.isDebug ? $.isDebug() : true;
    $.extend($, {
        extendNative: function (destination, source, constructor) {
            var printLog = debug && $.isString(constructor);
            for (var property in source) {
                var isExtend = $.isUndefined(destination[property]), func = source[property];
                if (isExtend) {
                    destination[property] = func;
                }
                if (printLog && $.isFunction(func)) {
                    var s = func.toString(), declare = s.substr(0, s.indexOf('{')), native = !isExtend ? '[native code]' : '';
                    console.log('extend[' + (extendCounter++) + ']:', constructor + '.' + property, '=', declare, native);
                }
            }
            return destination;
        }
    });

    $.extendNative(Array.prototype, {
        indexOf: function (ele) {
            for (var i = 0, n = this.length; i < n; i++) {
                if (this[i] === ele) {
                    return i;
                }
            }
            return -1;
        },
        forEach: function (callback, thisValue) {
            if (typeof callback === 'function') {
                for (var i = 0, c = this.length; i < c; i++) {
                    callback.call(thisValue, this[i], i, this);
                }
            }
        }
    }, 'Array.prototype');

    $.extendNative(String.prototype, {
        trim: function () { return this.replace(/(^[\s]*)|([\s]*$)/g, ''); },
        trimStart: function () { return this.replace(/(^[\s]*)/g, ''); },
        trimEnd: function () { return this.replace(/([\s]*$)/g, ''); },
        trimLeft: function () { return this.trimStart(); },
        trimRight: function () { return this.trimEnd(); },
        padStart: function (totalWidth, paddingChar) {
            var s = this, char = paddingChar || '0', c = totalWidth - s.length;
            for (var i = 0; i < c; i++) {
                s = char + s;
            }
            return s;
        },
        padEnd: function (totalWidth, paddingChar) {
            var s = this, char = paddingChar || '0', c = totalWidth - s.length;
            for (var i = 0; i < c; i++) {
                s += char;
            }
            return s;
        },
        padLeft: function (totalWidth, paddingChar) { return this.padStart(totalWidth, paddingChar); },
        padRight: function (totalWidth, paddingChar) { return this.padEnd(totalWidth, paddingChar); },
        startsWith: function (s) { return this.slice(0, s.length) === s; },
        endsWith: function (s) { return this.slice(-s.length) === s; },
        startWith: function (s) { return this.startsWith(s); },
        endWith: function (s) { return this.endsWith(s); },
        len: function () { return this.replace(/([^\x00-\xff])/g, 'aa').length; },
        replaceAll: function (pattern, v) {
            return this.replace($.isRegexp(pattern) ? pattern : new RegExp(pattern, 'gm'), v);
        },
        append: function (v, c) {
            var s = this;
            if ($.isNumber(c)) {
                for (var i = 0; i < c; i++) { s += v; }
                return s;
            }
            return s + v;
        },
        insert: function (v, c) {
            var s = this;
            if ($.isNumber(c)) {
                for (var i = 0; i < c; i++) { s = v + s; }
                return s;
            }
            return v + s;
        },
        clean: function (s) {
            var reg = new RegExp('(' + (s || ' ') + ')', 'g');
            return this.replace(reg, '');
        },
        clear: function (s) {
            //清除字符串的多余字符，默认清除 - 和 空格
            var reg = new RegExp('[' + (s || '- ') + ']', 'g');
            return this.replace(reg, '');
        },
        separate: function (delimiter, itemLen) {
            var reg = new RegExp('(.{' + itemLen + '}(?!$))', 'g');
            return this.replace(reg, '$1' + delimiter);
        },
        isEmpty: function () { return this.trim() === ''; },
        isNumeric: function () { return $.isnumeric(this); },
        isDecimal: function () { return $.isDecimal(this); },
        isInteger: function () { return $.isInteger(this); },
        isFloat: function () { return $.isDecimal(this); },
        isInt: function () { return $.isInteger(this); },
        toNumber: function (defaultValue, isFloat, decimalLen) {
            //这里判断是否是数字的正则规则是 判断从数字开始到非数字结束，根据 parseFloat 的规则
            var s = this, v = 0, dv = defaultValue, pattern = /^[-+]?(\d+)(.[\d]{0,})/;
            if ($.isNumeric(dv)) {
                if ($.isInteger(isFloat)) {
                    decimalLen = isFloat, isFloat = true;
                } else {
                    if ($.isUndefined(isFloat)) {
                        isFloat = pattern.test(dv) || pattern.test(s);
                    }
                    decimalLen = $.isInteger(decimalLen) ? decimalLen : (dv.toString().split('.')[1] || '').length;
                }
            } else if ($.isBoolean(dv)) {
                decimalLen = $.isInteger(isFloat) ? isFloat : decimalLen, isFloat = dv, dv = 0;
            } else {
                isFloat = $.isBoolean(isFloat, pattern.test(dv) || pattern.test(s));
            }

            if (isFloat) {
                ////当decimalLen>0时，才进行四舍五入处理
                //v = parseFloat(s, 10), v = !isNaN(v) && $.isInteger(decimalLen) && decimalLen > 0 ? v.round(decimalLen) : v;
                //只要decimalLen为整数，就进行四舍五入处理
                v = parseFloat(s, 10), v = !isNaN(v) && $.isInteger(decimalLen) ? v.round(Math.abs(decimalLen)) : v;
            } else {
                v = parseInt(s, 10);
            }
            return !isNaN(v) ? v : Number(dv) || 0;
        },
        toInt: function (defaultValue) { return $.toInteger(this, defaultValue); },
        toFloat: function (defaultValue, decimalLen) { return $.toDecimal(this, defaultValue, decimalLen); },
        toThousand: function (delimiter) {
            var a = this.split('.'), hasPoint = this.indexOf('.') >= 0;
            return a[0].replace(/\B(?=(?:[\dA-Fa-f]{3})+$)/g, delimiter || ',') + (hasPoint ? '.' + (a[1] || '') : '');
        },
        toDate: function (format) {
            var ts = Date.parse(this.replace(/-/g, '/'));
            if (isNaN(ts) && /^[\d]{10,13}$/.test(this)) {
                ts = Number(this.padRight(13));
            }
            var dt = new Date(ts);
            if (isNaN(dt.getFullYear())) {
                console.error('Date time format error: ', this);
                console.trace();
            }
            return $.isString(format) ? dt.format(format) : dt;
        },
        toArray: function (delimiter, type, keepZero, distinct) {
            if ($.isBoolean(type)) {
                distinct = keepZero, keepZero = type, type = null;
            }
            var d = typeof delimiter === 'string' ? delimiter : ',|',
                keep = $.isBoolean(keepZero, true), distinct = $.isBoolean(distinct, false),
                reg = new RegExp('([' + d + ']){2,}', 'g'), p1 = '[\\s]{0,}', p2 = '[' + d + ']+',
                //清除空项和首尾分隔符
                s = this.replace(reg, '$1').replace(new RegExp('(^' + p1 + p2 + ')|(' + p2 + p1 + '$)', 'g'), ''),
                //判断是否要转换成数字
                isNumber = ['number', 'int', 'float'].indexOf(type) >= 0 || new RegExp('^([-\\d\\s.' + d + ']+)$').test(s), isInt = type === 'int',
                arr = s.split(new RegExp('[' + d + ']')), c = arr.length, list = [], dic = new Dictionary();
            for (var i = 0; i < c; i++) {
                var t = !isNumber ? arr[i] : isInt ? parseInt(arr[i], 10) : parseFloat(arr[i], 10), k = ('' + t), pass = true;
                if (!t || (isNumber && isNaN(t))) {
                    pass = false;
                } else if (distinct) {
                    pass = !dic.contains(k, true, t);
                }
                if (pass && (!isNumber || (keep || t))) {
                    list.push(t);
                }
            }
            return list;
        },
        toUnicode: function () {
            var s = this, c = s.length, u = '';
            for (var i = 0; i < c; i++) {
                var hex = s.charCodeAt(i).toString(16);
                u += '\\u' + hex.padStart(4);
            }
            return u;
        },
        timeSpan: function (dt2) {
            return this.toDate().timeSpan(dt2.toDate());
        },
        equals: function (obj) {
            if (null === obj) {
                return false;
            }
            var str = obj.toString();
            if (this.length != str.length) {
                return false;
            }
            return this === str;
        },
        compareTo: function (obj) {
            var p = /^[-+]?(\d+)(.[\d]{0,})?$/, s1 = p.test(this) ? Number(this) : this, s2 = p.test(obj) ? Number(obj) : obj;
            if (isNaN(s1) || isNaN(s2)) {
                s1 = s1.toString(), s2 = s2.toString();
            }
            return s1 > s2 ? 1 : s1 < s2 ? -1 : 0;
        }
    }, 'String.prototype');

    $.extendNative(String, {
        compare: function (s1, s2) { return s1.compareTo(s2); }
    }, 'String');

    //Boolean.prototype extend
    $.extendNative(Boolean.prototype, {
        toNumber: function () { return Number(this); }
    }, 'Boolean.prototype');

    //Number.prototype extend
    $.extendNative(Number.prototype, {
        getDecimalLen: function () { return (this.toString().split('.')[1] || '').length; },
        delDecimalPoint: function () { return Number(this.toString().replace('.', '')); },
        add: function (arg) {
            var a = this.getDecimalLen(), b = arg.getDecimalLen(), m = Math.pow(10, Math.max(a, b));
            return (this.mul(m) + arg.mul(m)) / m;
        },
        sub: function (arg) {
            return this.add(-arg);
        },
        mul: function (arg) {
            var a = this.getDecimalLen(), b = arg.getDecimalLen(), m = a + b;
            return this.delDecimalPoint() * arg.delDecimalPoint() / Math.pow(10, m);
        },
        div: function (arg) {
            var a = this.delDecimalPoint(), b = arg.delDecimalPoint(), n = this.getDecimalLen(), m = arg.getDecimalLen();
            return (a / b).mul(Math.pow(10, m - n));
        },
        round: function (len) {
            var m = Math.pow(10, len || 0);
            return Math.round(this * m) / m;
        },
        padLeft: function (totalWidth, paddingChar) { return this.toString().padLeft(totalWidth, paddingChar); },
        padRight: function (totalWidth, paddingChar) { return this.toString().padRight(totalWidth, paddingChar); },
        isDecimal: function () { return $.isDecimal(this); },
        isInteger: function () { return $.isInteger(this); },
        isFloat: function () { return $.isDecimal(this); },
        isInt: function () { return $.isInteger(this); },
        isHex: function () { return this.toString().toUpperCase().indexOf('0X') === 0; },
        toHex: function () { return this.toString(16).toUpperCase(); },
        toThousand: function (delimiter) { return this.toString().toThousand(delimiter); },
        toDate: function (format) { return this.toString().toDate(format); }
    }, 'Number.prototype');

    //Date.prototype extend
    $.extendNative(Date.prototype, {
        format: function (formatString, len) {
            var t = this, year = t.getFullYear();
            if (isNaN(year)) {
                return '';
            } else if (typeof formatString !== 'string') {
                formatString = 'yyyy-MM-dd HH:mm:ss';
            }
            if (['timestamp', 'time', 'tick', 'ts'].indexOf(formatString) >= 0) {
                return $.isNumber(len) ? t.getTime().toString().substr(0, len) : t.getTime().toString();
            }
            var p = /([y]+|[M]+|[d]+|[H]+|[s]+|[f]+)/gi,
                y = year + (year < 1900 ? 1900 : 0), M = t.getMonth() + 1, d = t.getDate(),
                H = t.getHours(), h = H > 12 ? H - 12 : H === 0 ? 12 : H,
                m = t.getMinutes(), s = t.getSeconds(), f = t.getMilliseconds(),
                d = {
                    yyyy: y, M: M, d: d, H: H, h: h, m: m, s: s, MM: M.padLeft(2), dd: d.padLeft(2),
                    HH: H.padLeft(2), mm: m.padLeft(2), ss: s.padLeft(2), hh: h.padLeft(2), fff: f.padLeft(3),
                };
            return (formatString || 'yyyy-MM-dd HH:mm:ss').replace(p, '{$1}').format(d);
        },
        compareTo: function (dt) {
            var t1 = this.getTime(), t2 = dt.getTime();
            return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
        },
        timeSpan: function (dt2) {
            //获取两个Date的毫秒数和差值
            var dt1 = this, t1 = dt1.getTime(), t2 = dt2.getTime(), tick = Number(t1 - t2) || 0;
            return Date.timeTick(tick);
        },
        add: function (v, type) { return this.setTime(Date.addTick(this, v, type)), this; },
        addYears: function (v) { return this.setYear(this.getFullYear() + (parseInt(v, 10) || 0)), this; },
        addMonths: function (v) { return this.setMonth(this.getMonth() + (parseInt(v, 10) || 0)), this; },
        addDays: function (v) { return this.add(v, 'days'); },
        addHours: function (v) { return this.add(v, 'hours'); },
        addMinutes: function (v) { return this.add(v, 'minutes'); },
        addSeconds: function (v) { return this.add(v, 'seconds'); },
        addMilliseconds: function (v) { return this.add(v, 'milliseconds'); },
        getDateList: function (days) {
            var list = [];
            for (var i = 0; i < days; i++) {
                list.push(this.addDays(i).format('yyyy-MM-dd'));
            }
            return list;
        }
    }, 'Date.prototype');

    $.extendNative(Date, {
        compare: function (dt1, dt2) { return dt1.compareTo(dt2); },
        addTick: function (tick, v, type) {
            if (typeof tick !== 'number') {
                tick = Number(tick);
            }
            v = parseInt(v, 10), type = type || 'milliseconds';
            if (!isNaN(tick) && !isNaN(v)) {
                switch (type) {
                    case 'days': tick += v * 24 * 60 * 60 * 1000; break;
                    case 'hours': tick += v * 60 * 60 * 1000; break;
                    case 'minutes': tick += v * 60 * 1000; break;
                    case 'seconds': tick += v * 1000; break;
                    case 'milliseconds': case 'time': tick += v; break;
                }
            }
            return tick;
        },
        timeTick: function (tick) {
            if (tick === 0) {
                return {
                    totalDays: 0, totalHours: 0, totalMinutes: 0, totalSeconds: 0, totalMilliseconds: 0,
                    ticks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0
                };
            }
            var ms = tick / 1000, ds = {
                d: 60 * 60 * 24, h: 60 * 60, m: 60, s: 1000
            }, ts = {
                totalDays: ms.div(ds.d).round(15),
                totalHours: (ms / ds.h).round(15),
                totalMinutes: (ms / ds.m).round(15),
                totalSeconds: ms.round(15),
                totalMilliseconds: tick,
                ticks: tick * 10000     //时间最小刻度单位为秒的一千万分之一(即毫秒的万分之一)
            };
            ts.days = parseInt(ts.totalDays, 10);
            ts.hours = parseInt((ms -= ts.days * ds.d) / ds.h, 10);
            ts.minutes = parseInt((ms -= ts.hours * ds.h) / ds.m, 10);
            ts.seconds = parseInt((ms -= ts.minutes * ds.m), 10);
            ts.milliseconds = ((ms -= ts.seconds) * ds.s).round();

            ts.add = function (v, type) {
                //先除以10000，将ticks换算回毫秒
                return Date.timeTick(Date.addTick(this.ticks / 10000, v, type));
            },
                ts.show = function (formatString, hideMilliseconds) {
                    var s = this, fs = formatString, hide = hideMilliseconds;
                    if (typeof hide === 'undefined' && typeof fs === 'boolean') {
                        hide = fs, fs = '';
                    }
                    if (typeof fs !== 'string' || ['en', 'cn', 'time'].indexOf(fs) >= 0) {
                        var a = ['{days}天', '{hours}小时', '{minutes}分钟', '{seconds}秒', '{milliseconds}毫秒'],
                            p = s.days ? 0 : (s.hours ? 1 : (s.minutes ? 2 : s.seconds ? 3 : 4)), len = a.length - (hide ? 1 : 0);
                        if (fs === 'en') {
                            a = ['{days}days ', '{hours}h ', '{minutes}m ', '{seconds}s ', '{milliseconds}ms'];
                        } else if (fs === 'time') {
                            a = ['{days}days ', '{hours}:', '{minutes}:', '{seconds}.', '{milliseconds}'];
                        }
                        fs = '';
                        for (var i = p; i < len; i++) {
                            fs += a[i];
                        }
                        return fs.format(s);
                    }
                    var p = /[{]?(days|hours|minutes|seconds|milliseconds)[}]?/gi;
                    return fs.replace(p, '{$1}').format(s);
                };
            return ts;
        },
        timeSpan: function (dt1, dt2) {
            return dt1.timeSpan(dt2);
        }
    }, 'Date');
}(OUI);

// String.prototype.format
!function ($) {
    'use strict';

    var throwFormatError = function (msg, str, args) {
        try {
            if (!$.isUndefined(str)) { console.log('str:\r\n\t', str, '\r\nargs:\r\n\t', args); } console.trace();
        } catch (e) { }
        throw new Error(msg);
    }, formatNumberZero = function (arv, arn) {
        var arr = [], idx = arn.length - 1;
        for (var i = arv.length - 1; i >= 0; i--) {
            arr.push(arv[i] === '0' ? (idx >= 0 ? arn[idx] : arv[i]) : (function () { ++idx; return arv[i]; })());
            idx--;
        }
        for (var i = idx; i >= 0; i--) {
            arr.push(arn[i]);
        }
        arr = arr.reverse();
        return arr.join('');
    }, scientificNotation = function (v, f, n, dn, numLen) {
        var num = parseInt('0' + dn[0], 10), fn = num < 1 ? 1 : dn[0].substr(0, 1), e = Math.pow(10, n),
            en = v.toString().substr(1).replace('.', ''), el = en.length,
            postfix = '001', postfixLen = (f === 'g' || f === 'G') ? 2 : 3, prefix = '', symbol = num >= 1 ? '+' : '-';
        if (el > n) {
            if (en.indexOf('0') === 0) {
                prefix = '0';
            }
            en = prefix + (Number(en.substr(0, n + 1)) / 10).round();
        } else {
            for (var i = el; i < n; i++) { en += '0'; }
        }
        if (num >= 1) {
            postfix = numLen - 1;
            for (var i = postfix.toString().length; i < postfixLen; i++) { postfix = '0' + postfix; }
        }
        var so = { g: 'e', 'G': 'E' };
        return fn + '.' + en + (so[f] || f) + symbol + postfix;
    }, regPattern = {
        numberSymbol: /([CDEFGNRX])/gi, number: /^(0x)?[\dA-Fa-f]+$/
    }, formatNumberSwitch = function (v, f, n, dn, err, str, args) {
        //console.log('v: ', v, ', f: ', f, ',is: ', (isHexNumber(v) && fu !== 'X'));
        var fu = f.toUpperCase(), pos = 0, numLen = dn[0].length, decimalLen = (dn[1] || '').length;
        //if(isHexNumber(v) && ['C', 'F', 'N'].indexOf(fu) >= 0){
        if (isHexNumber(v) && regPattern.numberSymbol.test(fu)) {
            v = parseInt(v, 10), dn = v.toString().split('.'), numLen = dn[0].length;
        }
        if (['C', 'F', 'N'].indexOf(fu) >= 0) {
            v = decimalLen > n && decimalLen > 0 ? v.round(n) : decimalLen === 0 && n > 0 ? v + '.' : v;
        }
        var vc = v.toString(), len = vc.length;
        switch (fu) {
            case 'C':   //货币
            case 'N':   //千位分隔
                v = (fu === 'C' ? '¥' : '') + vc.toThousand().append('0', n - decimalLen);
                break;
            case 'D':   //整数
                if (/([.])/g.test(v)) {
                    throwFormatError(err[3], str, args);
                }
                v = v.padLeft(n, '0');
                break;
            case 'E':   //科学计数法
                v = scientificNotation(v, f, n, dn, numLen);
                break;
            case 'F':   //小数
                v = vc.append('0', n - decimalLen);
                break;
            case 'G':   //标准数字
                v = numLen === n ? v.round() : numLen < n ? v.round(n - numLen) : scientificNotation(v, f, n - 1, dn, numLen);
                break;
            case 'P':
            case '%':   //百分比
                v = v.mul(100).round(n) + '%';
                break;
            case 'R':
                break;
            case 'X':   //十六进制显示
                //无符号右移运算，移动位数为0，可以将32位有符号整数转换为32位无符号整数。
                v = (parseInt(v, 10) >>> 0).toString(16).toUpperCase().padLeft(n);
                break;
            case 'S': //空格分隔符
            case '-':
            case ':':
            case '.':
                var arr = n.toString().split(''), isSingle = arr.length === 1, symbol = fu === 'S' ? ' ' : fu;
                if (isSingle) {
                    v = vc.separate(symbol, n);
                } else {
                    var nv = '', i = 0, pn = parseInt(arr[0], 10);
                    while (pos < len) {
                        if (i >= arr.length) { break; }
                        pn = parseInt(arr[i], 10);
                        nv += (pos > 0 ? symbol : '') + vc.substr(pos, pn), pos += pn, i += 1;
                    }
                    v = nv + (pos < len ? symbol + vc.substr(pos) : '');
                }
                break;
        }
        return v;
    }, isNumberString = function (obj, f) {
        return $.isNumber(obj) || (!regPattern.numberSymbol.test(f) && regPattern.number.test(obj));
    }, isHexNumber = function (obj, f) {
        return !regPattern.numberSymbol.test(f) && regPattern.number.test(obj);
    }, formatNumber = function (mv, v, err, str, args) {
        if (!/[:]/g.test(mv)) {
            return v;
        }
        var p = mv.indexOf(':'), ss = mv.substr(p + 1), f = ss.substr(0, 1);
        //var isNum = typeof v === 'number', sc = mv.match(/(:)/g).length, isColon = mv.toString().indexOf('::') > 0;
        var isNum = isNumberString(v, f), sc = mv.match(/(:)/g).length, isColon = mv.toString().indexOf('::') > 0;
        if (sc > 1 && !isColon) {
            if (isNum) {
                var nv = Math.round(v, 10), pos = mv.indexOf(':'), arv = mv.substr(pos + 1).split(''), arn = nv.toString().split('');
                v = formatNumberZero(arv, arn);
            } else {
                v = mv.substr(mv.indexOf(':') + 1);
            }
        } else if (isNum) {
            //C-货币，D-数字，E-科学计数，F-小数，G-标准数字，N-千位分隔，-十六进制
            var p1 = /([CDEFGNRXSP%\-\.\:])/gi, p2 = /([A-Z])/gi, p3 = /^([CDEFGNRXSP%\-\.\:][\d]+)$/gi, p4 = /^([A-Z]{1}[\d]+)$/gi;
            if ((ss.length === 1 && p1.test(ss)) || (ss.length >= 2 && p3.test(ss))) {
                var nv = parseInt(ss.substr(1), 10), dn = v.toString().split('.'), n = isNaN(nv) ? (f.toUpperCase() === 'D' ? 0 : 2) : nv;
                v = formatNumberSwitch(v, f, n, dn, err, str, args);
            } else if ((ss.length === 1 && p2.test(ss)) || (ss.length >= 2 && p4.test(ss))) {
                throwFormatError(err[3], str, args);
            } else if (/([0]+)/g.test(ss)) {
                var nv = Math.round(v, 10), arv = ss.split(''), arn = nv.toString().split('');
                v = formatNumberZero(arv, arn);
            } else {
                v = ss;
            }
        }
        return v;
    }, distillObjVal = function (key, obj, err, str, vals) {
        var v;
        if (!$.isUndefined(obj[key])) {
            v = obj[key];
        } else if (key.indexOf('.') > 0 || key.indexOf('|') > 0) {
            //嵌套对象，格式: obj.key.key|dv(默认值，因某些key可能不存在或允许为空)
            var arr = key.split('|'), dv = arr[1], ks = arr[0].split('.'), o = obj;
            //console.log('o: ', o, ', ks: ', ks, ', dv: ', dv);
            for (var i in ks) {
                if ($.isObject(o)) {
                    o = o[ks[i]], v = o;
                }
                if ($.isUndefined(o)) {
                    v = !$.isUndefined(dv) ? dv : throwFormatError(err, s, vals);
                }
            }
        } else {
            throwFormatError(err, str, vals);
        }
        return v;
    };

    if ($.isUndefined(String.prototype.format)) {
        String.prototype.format = function (args) {
            var s = this, vals = [], rst = [], pattern = /({|})/g, ms = s.match(pattern);
            if (null === ms) {
                return s.toString() || s;
            }
            var err = ['输入字符串的格式不正确。', '索引(从零开始)必须大于或等于零，且小于参数列表的大小。',
                '值不能为null（或undefined）。', '格式说明符无效。'];

            if (arguments.length > 1) {
                for (var i = 0, c = arguments.length; i < c; i++) {
                    if (arguments[i] !== undefined && arguments[i] !== null) {
                        vals.push(arguments[i]);
                    } else {
                        var er = err[2] + '第' + (i + 1) + '个参数值为：' + arguments[i];
                        throwFormatError(err, s, args);
                    }
                }
            } else if ($.isArray(args)) {
                vals = args;
            } else if (!$.isNullOrUndefined(args)) {
                vals.push(args);
            }
            if (ms.length % 2 !== 0) {
                throwFormatError(err[0], s, vals);
            }
            //var matchs = s.match(/({+[-\d]+(:[\D\d]*?)*?}+)|({+([\D]*?|[:\d]*?)}+)|([{]{1,2}[\w]*?)|([\w]*?[}]{1,2})/g);
            var matchs = s.match(/({+[-\d]+(:[\D\d]*?)*?}+)|({+([\D]*?|[:\d]*?)}+)|({+([\w\.\|]*?)}+)|([{]{1,2}[\w]*?)|([\w]*?[}]{1,2})/g);
            if (null === matchs) {
                return s.toString() || s;
            }
            var len = vals.length, mc = matchs.length, isObject = typeof vals[0] === 'object', obj = isObject ? vals[0] : {};

            for (var i = 0; i < mc; i++) {
                var m = matchs[i], mv = m.replace(pattern, ''), p = s.indexOf(m), idx = parseInt(mv, 10);
                var c = /{/g.test(m) ? m.match(/{/g).length : 0, d = /}/g.test(m) ? m.match(/}/g).length : 0;
                if ((c + d) % 2 != 0) {
                    throwFormatError(err[0], s, vals);
                }
                var m2 = m.replace(/{{/g, '{').replace(/}}/g, '}');
                var odd = c % 2 != 0 || d % 2 != 0, single = c <= 2 && d <= 2;

                if (!isNaN(idx)) {
                    var v = formatNumber(mv, vals[idx], err, s, vals);
                    if ($.isBoolean(v) && !v) {
                        return false;
                    }
                    if (/^-\d$/g.test(mv) && odd) { throwFormatError(err[0], s, vals); }
                    else if (idx >= len) { throwFormatError(err[1], s, vals); }
                    else if ($.isNullOrUndefined(v)) { throwFormatError(err[2], s, vals); }

                    rst.push(s.substr(0, p) + (c > 1 || d > 1 ? (c % 2 != 0 || d % 2 != 0 ? m2.replace('{' + idx + '}', v) : m2) : v));
                } else if (odd) {
                    if (c === 1 && d === 1) {
                        if (!isObject || !single) {
                            throwFormatError(err[0], s, vals);
                        }
                        v = distillObjVal(mv, obj, err[0], s, vals);
                        rst.push(s.substr(0, p) + (c > 1 || d > 1 ? (c % 2 !== 0 || d % 2 !== 0 ? m2.replace('{' + idx + '}', v) : m2) : v));
                    } else {
                        var mcs = m2.match(/({[\w\.\|]+})/g);
                        if (mcs != null && mcs.length > 0) {
                            rst.push(s.substr(0, p) + m2.replace(mcs[0], distillObjVal(mcs[0].replace(/({|})/g, ''), obj, err[0], s)));
                        } else {
                            throwFormatError(err[0], s, vals);
                        }
                    }
                } else {
                    rst.push(s.substr(0, p) + m2);
                }
                s = s.substr(p + m.length);
            }
            rst.push(s);

            return rst.join('');
        };
    }

    //String.format
    String.format = String.format || function (s) {
        if ($.isString(s)) {
            var a = [], c = arguments.length;
            for (var i = 1; i < c; i++) {
                a.push(arguments[i]);
            }
            return s.format(a);
        }
        throwFormatError((typeof o) + '.format is not a function');
    };
}(OUI);