
/*
 @Title: OUI
 @Description：JS通用代码库
 @Author: oukunqing
 @License：MIT
*/

// OUI
; !function () {
    'use strict';

    var isWindow = function () {
        return typeof window !== 'undefined';
    }, $ = isWindow() ? window.$ : undefined;

    if (typeof $ !== 'undefined' && $.constructor === Function) {
        window.OUI = $;
    } else {
        var slice = Array.prototype.slice,
            doc = function () { try { return document } catch (e) { return null } }(),
            isUndefined = function (o) { return typeof o === 'undefined'; },
            isObject = function (o) { return o !== null && typeof o === 'object'; },
            isString = function (s) { return typeof s === 'string'; },
            isFunction = function (f) { return typeof f === 'function'; },
            isArray = Array.isArray || function (a) { return Object.prototype.toString.call(a) === '[object Array]'; },
            isElement = function (o) {
                return (
                    typeof HTMLElement === 'object' ? o instanceof HTMLElement : //DOM2
                        o && isObject(o) && o.nodeType === 1 && isString(o.nodeName)
                );
            },
            isOUI = function (d) {
                return d instanceof OUI;
            }, rootOUI;

        var OUI = function (selector, context) {
            if (!isOUI(this) && typeof selector !== 'undefined') {
                return new OUI(selector, context);
            }
            var self = this, nodes = [];

            if (selector === undefined) {
                return self.length = 0, self;
            }

            if (isElement(selector)) {
                nodes = [selector];
            } else {
                if (selector === doc) {
                    nodes = [doc];
                } else {
                    if (isString(context)) {
                        context = doc.querySelector(context);
                    }
                    if (isString(selector)) {
                        nodes = slice.call((context || doc).querySelectorAll(selector));
                    }
                }
            }

            for (var i = 0; i < nodes.length; i++) {
                self[i] = nodes[i];
            }
            self.length = nodes.length;

            if (self.length > 1) {
                self.prevObject = rootOUI;
            }
        }, rootOUI = new OUI(doc);

        OUI.fn = OUI.prototype = {
            constructor: OUI
        };

        OUI.extend = OUI.fn.extend = function () {
            var source, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            if (typeof target === 'boolean') {
                deep = target;
                target = arguments[1] || {};
                i++;
            }
            if (typeof target !== 'object' && !isFunction(target)) {
                target = {};
            }
            if (i === length) {
                target = this;
                i--;
            }
            for (; i < length; i++) {
                if ((source = arguments[i]) === null) {
                    continue;
                }
                for (name in source) {
                    if ((copy = source[name]) === target) {
                        continue;
                    }

                    src = target[name];

                    if (deep && ((copyIsArray = isArray(copy)) || isObject(copy))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isObject(src) ? src : {};
                        }
                        target[name] = OUI.extend(deep, clone, copy);
                    } else if (typeof copy !== 'undefined') {
                        target[name] = copy;
                    }
                }
            }
            return target;
        };

        if (isWindow()) {
            window.OUI = window.$ = OUI;
            window.$.extend(window.$, { OUI: true });
        } else {
            global.OUI = global.$ = OUI;
        }
    }
}();

!function ($) {
    'use strict';

    $.extend($, {
        PATTERN: {
            Email: /^[A-Z0-9\u4e00-\u9fa5]+@[A-Z0-9_-]+(\.[A-Z0-9_-]+)+$/i,
            //手机号码
            //Mobile: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[013,5-8]|9[89])\d{8}$/,
            Mobile: /^1([38][0-9]|4[57]|[59][0-3,5-9]|6[6]|7[0-3,5-8])\d{8}$/,
            //物联网卡号码，11位或13位
            IOTMobile: /^(1([4][014689])\d{8}|1([4][014689])\d{10})$/,
            //身份证规则
            //前2位为省份区划编码 11 - 82, 50为重庆市编码
            //7-8位为出生年份开头2个数字  19或20
            Identity: /^([1-8][1-9]|50)[\d]{4}(19|20)[\d]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[0-1])[\d]{3}[\dX]$/i,
            //固定电话号码
            Telephone: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,8}$/,
            //日期格式
            Date: /^(19|20|21)[\d]{2}[\-\/](0?[1-9]|1[0-2])[\-\/](0?[1-9]|[12][0-9]|3[0-1])$/,
            //时间格式，可以省略“:秒”
            Time: /^(20|21|22|23|[0-1]?\d):[0-5]?\d(:[0-5]?\d)?$/,
            //日期时间格式（可以不包含时间，时间可以省略“:秒”）
            DateTime: /^(19|20|21)[\d]{2}[\-\/](0?[1-9]|1[0-2])[\-\/](0?[1-9]|[12][0-9]|3[0-1])(\s+(20|21|22|23|[0-1]?\d):[0-5]?\d(:[0-5]?\d)?)?$/,
            //IPV4
            Ip: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
            //带参数的URL格式字符串
            UrlParam: /^(\/|http:\/\/|https:\/\/)(.*)(.(as[hp][x]?|jsp|[s]?htm[l]?|php|do)|\/)\?[&]?(.*)=(.*)([&]{1,}(.*)=(.*)){0,}/gi
        }
    });

    var version = '1.0.0',
        trim = function (s) { return s.replace(/(^[\s]*)|([\s]*$)/g, ''); },
        isUndefined = function (o) { return typeof o === 'undefined'; },
        isString = function (s, nonempty) { return typeof s === 'string' && (nonempty ? trim(s) !== '' : true); },
        isNumber = function (n) { return typeof n === 'number'; },
        checkNumber = function (n, min, max) {
            var isNum = isNumber(n), isMin = isNumber(min), isMax = isNumber(max);
            return isNum ? (isMin && isMax ? n >= min && n <= max : (isMin ? n >= min : isMax ? n <= max : true)) : false;
        },
        setNumber = function(n, min, max) {
            var isNum = isNumber(n), isMin = isNumber(min), isMax = isNumber(max);
            return isNum ? (isMin && isMax ? (n < min ? min : (n > max ? max : n)) : (isMin ? (n < min ? min : n) : isMax ? (n > max ? max : n) : n)) : n;
        },
        isObject = function (o) { return o !== null && typeof o === 'object'; },
        isArray = Array.isArray || function (a) { return Object.prototype.toString.call(a) === '[object Array]'; },
        /*
            判断变量是否为boolean
            b: 变量
            dv: 默认值，若dv为boolean，且b不为boolean，则返回dv；若dv不为boolean,则返回b === boolean
        */
        isBoolean = function (b, dv) {
            var bool = typeof b === 'boolean';
            return typeof dv === 'boolean' ? (bool ? b : dv) : bool;
        },
        isDate = function (obj) {
            return obj instanceof Date && !isNaN(obj.getFullYear());
        },
        isDateString = function (str) {
            var pattern = /[\d]/;

            pattern = /^[0-9]{10, 13}$/;

            return false;
        },
        isTrue = function (b) {
            return typeof b === 'boolean' && b || b === 'true' || b === 1 || b === '1';
        },
        isFalse = function (b) {
            return typeof b === 'boolean' && !b || b === 'false' || b === 0 || b === '0';
        },
        isFunction = function (f) { return typeof f === 'function' && typeof f.nodeType !== 'number'; },
        isNumeric = function (o) { return /^[-+]?(\d+)([.][\d]{0,})?$/.test(o); },
        isDecimal = function (o) { return /^[-+]?(\d+)([.][\d]{0,})$/.test(o); },
        isInteger = function (o) { return /^[-+]?(\d+)$/.test(o); },
        isHexNumeric = function (o) { return /^(0x)?[\dA-F]+$/gi.test(o); },
        isHexNumber = function (o) { return isNumber(o) && isHexNumeric(o); },
        isRegexp = function (o) { return isObject(o) || isFunction(o) ? ('' + o).indexOf('/') == 0 : false; },
        isNull = function (o) { return o === null; },
        isNullOrUndefined = function (o) { return isUndefined(o) || isNull(o); },
        isEmpty = function (o, strict) {
            if (strict) {
                return isString(o) && '' === trim(o);
            }
            if (isUndefined(o) || null === o) { return true; }
            else if (isString(o)) { return '' === trim(o); }
            else if (isArray(o)) { return 0 === o.length  || 1 === o.length && '' === o[0]; }
            else if (isObject(o)) { for (var name in o) { return false; } return true; }
            return false;
        },
        isProperty = function (o, property) { return o.hasOwnProperty(property) && (property in o); },
        isPercent = function (val) {
            return (!isNaN(parseFloat(val, 10)) && ('' + val).endsWith('%'));
        },
        toBoolean = function (key, val) {
            if (isBoolean(val)) {
                return val;
            }
            if (isNumber(val)) {
                return val === 1;
            }
            if (isString(val, true)) {
                return val.toLowerCase() === 'true';
            }
            if (isString(key, true)) {
                return key.toLowerCase() === 'true';
            }
            return false;
        },
        toDecimal = function (s, defaultValue, decimalLen) {
            var v = parseFloat(s, 10);
            v = !isNaN(v) && $.isInteger(decimalLen) ? v.round(Math.abs(decimalLen)) : v;
            return !isNaN(v) ? v : Number(defaultValue) || 0;
        },
        toInteger = function (s, defaultValue) {
            var v = parseInt(s, 10);
            return !isNaN(v) ? v : Number(defaultValue) || 0;
        },
        toNumber = function (s, defaultValue, isFloat, decimalLen) {
            //这里判断是否是数字的正则规则是 判断从数字开始到非数字结束，根据 parseFloat 的规则
            var v = 0, dv = defaultValue, pattern = /^[-+]?(\d+)(.[\d]{0,})/;
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
        toNumberList = function (numbers, separator, decimalLen) {
            if (isNumber(separator)) {
                decimalLen = separator;
                separator = ',';
            }
            if (isUndefined(decimalLen)) {
                decimalLen = -1;
            }
            if (isString(numbers)) {
                numbers = numbers.split(separator || ',');
            }
            if (!isArray(numbers)) {
                return [];
            }

            var list = [];
            for (var i = 0; i < numbers.length; i++) {
                var num = parseFloat(numbers[i], 10);
                if (!isNaN(num)) {
                    if (decimalLen >= 0) {
                        num = num.round(decimalLen);
                    }
                    list.push(num);
                }
            }
            return list;
        },
        containsKey = function (obj, key) {
            if (isNullOrUndefined(key)) {
                return false;
            }
            if (isObject(obj)) {
                return !isUndefined(obj[key]);
            } else if (isArray(obj)) {
                return obj.indexOf(key) >= 0;
            }
            return false;
        },
        containsValue = function (obj, value) {
            if (isNullOrUndefined(value)) {
                return false;
            }
            if (isObject(obj)) {
                for (var k in obj) {
                    if (obj[k] === value) {
                        return true;
                    }
                }
            } else if (isArray(obj)) {
                return obj.indexOf(value) >= 0;
            }
            return false;
        },
        contains = function (obj, key, value) {
            if (isObject(obj)) {
                return containsKey(obj, key) && (isNullOrUndefined(value) || containsValue(obj, value));
            } else if (isArray(obj)) {
                return obj.indexOf(value) >= 0;
            }
            return false;
        },
        distinctList = function (arr, separator) {
            var join = false;
            if ($.isString(arr, true)) {
                arr = arr.split(/[,\|;]/g);
                join = true;
            }
            var list = [], dic = {};
            for (var i = 0, c = arr.length; i < c; i++) {
                var val = arr[i], key = 'K' + val;

                if (typeof dic[key] === 'undefined') {
                    dic[key] = val;
                    list.push(val);
                }
            }
            return dic = null, join ? list.join(separator || ',') : list;
        },
        collapseNumberList = function (numbers, distinct, separator, connector) {
            if (isString(distinct)) {
                connector = separator;
                separator = distinct;
                distinct = false;
            }
            if (!isBoolean(distinct)) {
                distinct = false;
            }
            if (!$.isArray(numbers)) {
                numbers = ('' + numbers).split(/[,\|;]/g);
            }
            numbers.sort(function (a, b) {
                return a - b;
            });

            var con = '', start = 0, last = 0, n = 0;

            for (var i = 0, c = numbers.length; i < c; i++) {
                var num = numbers[i];
                if (!$.isNumeric(num)) {
                    continue;
                }

                if (0 === n++) {
                    con += num;
                    start = num;
                } else {
                    if (num - last > 1 || (!distinct && num === last)) {
                        if (last !== start) {
                            con += (connector || '-') + last;
                        }
                        con += (separator || ',') + num;
                        start = num;
                    } else if (i === c - 1) {
                        if (num !== start) {
                            con += (connector || '-') + num;
                        }
                    }
                }
                last = num;
            }

            return con;
        },
        expandNumberList = function (collapsedNumbers, distinct, separator, connector) {
            if (!isString(collapsedNumbers)) {
                return [];
            }

            if (isString(distinct)) {
                connector = separator;
                separator = distinct;
                distinct = false;
            }
            if (!isBoolean(distinct)) {
                distinct = false;
            }

            var list = [], arr = collapsedNumbers.split(separator || ',');

            for (var i in arr) {
                var tmp = arr[i].split(connector || '-');
                var num = 0;

                if (tmp.length >= 2) {
                    var start = parseInt(tmp[0], 10), end = parseInt(tmp[1], 10);
                    if (!isNaN(start) && !isNaN(end)) {
                        for (var j = start; j <= end; j++) {
                            list.push(j);
                        }
                    }
                } else {
                    num = parseFloat(tmp[0], 10);
                    if (!isNaN(num)) {
                        list.push(num);
                    }
                }
            }

            if (distinct) {
                list = distinctList(list);
            }

            list.sort(function (a, b) {
                return a - b;
            });

            return list;
        },
        toJsonString = function (o) { return JSON.stringify(o); },
        toJson = function (s) { return JSON.parse(s); },
        tryToJson = function(s) {
            var result = {};
            try {
                result = { result: 1, status: 1, json: JSON.parse(s) };
            } catch(e) {
                result = { result: 0, status: 0, json: null };
            }
            return result;
        },
        toEncode = function (s) { return encodeURIComponent(s); },
        toFunction = function (funcName) {
            if ($.isFunction(funcName)) {
                return funcName;
            }
            if ($.isString(funcName, true)) {
                var func = null, arr = funcName.split('.'), first = true;
                for (var i = 0; i < arr.length; i++) {
                    var str = arr[i].trim();
                    if ($.isString(str, true)) {
                        if (first) {
                            func = eval('(' + str + ')');
                            first = false;
                        } else if (!first && func) {
                            func = func[str];
                        }
                    }
                }
                return func;
            }
            return null;
        },
        toAscii = function (argv) {
            var arr = [], s = argv.toString().trim(), len = s.length;
            for (var i = 0; i < len; i++) {
                arr.push(s[i].charCodeAt());
            }
            return arr;
        },
        asciiToChar = function (argv) {
            var arr = isArray(argv) ? argv : argv.split(/[\s|,]/g);
            var list = [];
            for (var i = 0; i < arr.length; i++) {
                var num = parseInt(arr[i], 10);
                if (!isNaN(num)) {
                    list.push(String.fromCharCode(num));
                }
            }
            return list.join('');
        },
        toAsciiHex = function (argv, isJoin) {
            if ($.isNumber(argv)) {
                var arr = [argv.toString(16).toUpperCase()];
                return isJoin ? arr.join('') : arr;
            }
            var hex = [], arr = $.isArray(argv) ? argv : toAscii(argv), len = arr.length, idx = 0;
            for (var i = 0; i < len; i++) {
                var v = arr[i];
                if ($.isNumber(v)) {
                    hex[idx++] = v.toString(16).toUpperCase();
                } else {
                    var tmp = v.toAscii(), c = tmp.length;
                    for (var j = 0; j < c; j++) {
                        hex[idx++] = tmp[j].toString(16).toUpperCase();
                    }
                }
            }
            return isJoin ? hex.join('') : hex;
        },
        getArguments = function (args, start, end) {
            var par = {}, len = 0, s = start || 0, e = end || args.length;
            for (var i = s; i < e; i++) {
                par[len++] = args[i];
            }
            return par.length = len, par;
        },
        callFunction = function (funcName) {
            var func = toFunction(funcName);
            if (isFunction(func)) {
                var args = getArguments(arguments, 1);
                func.apply(this, args);
            } else if ($.isDebug()) {
                console.log('callFunction: ', ('' + funcName) + ' is not a function.');
            }
            return this;
        },
        getUrlVal = function (url, key) {
            return !url ? '' : getQueryString(url, key);
        },
        getUrlSymbol = function (url) {
            if (!url) {
                return '';
            }
            var end = url.endsWith('?') || url.endsWith('&'),
                symbol = end ? '' : url.indexOf('?') > -1 ? '&' : '?';
            return symbol;
        },
        _buildParam = function (url, s, key, val, oldVal) {
            if (!isNullOrUndefined(val)) {
                var ps = key + '=' + toEncode(isObject(val) ? toJsonString(val) : val);
                if (oldVal !== '') {
                    url = url.replace(key + '=' + oldVal, ps);
                } else {
                    s.push(ps);
                }
            }
            return url;
        },
        buildParam = function (a, v, strict, url) {
            var isUrl = $.isString(url, true),
                isObj = isObject(a),
                isStrict = isBoolean(strict, true);

            if (isNullOrUndefined(a) || (!isObj && isStrict && isNullOrUndefined(v))) {
                return isUrl ? url : '';
            }
            if (isString(a)) {
                if (!isNullOrUndefined(v)) {
                    a = [{ key: a, value: v }];
                } else {
                    return isUrl ? url + getUrlSymbol(url) + a : a;
                }
            }
            var s = [];
            if (isArray(a)) {
                for (var i = 0, c = a.length; i < c; i++) {
                    var key = a[i].key || a[i].name, val = a[i].value || a[i].data || a[i].val;
                    url = _buildParam(url, s, key, val, getUrlVal(url, key));
                }
            } else if (isObj) {
                for (var key in a) {
                    url = _buildParam(url, s, key, a[key], getUrlVal(url, key));
                }
            } else {
                s.push(a);
            }
            var ps = s.join('&');
            return isUrl ? url + (ps ? getUrlSymbol(url) : '') + ps : ps;
        },
        buildAjaxData = function (action, formData, param) {
            var data = { action: action, data: formData };
            var str = buildParam(data);
            if ($.isString(str, true)) {
                return str + '&' + buildParam(param, null, false);
            }
            return buildParam(param, null, false);
        },
        setUrlParam = function (a, v, strict, url) {
            return buildParam(a, v, strict, url);
        },
        getTime = function () {
            return ('' + new Date().getTime());//.substr(0, 10);
        },
        getQueryString = function (url, name) {
            var str = isString(url) ? url : location.href, params = str.substr(str.indexOf('?')), obj = {};
            if (params.indexOf('?') >= 0) {
                var arr = params.substr(1).split('&'), c = arr.length;
                for (var i = 0; i < c; i++) {
                    var s = arr[i], pos = s.indexOf('='), key = s.split('=')[0];
                    if (trim(key)) {
                        obj[key] = pos > 0 ? unescape(s.substr(pos + 1)) : '';
                    }
                }
            }
            if (!isNullOrUndefined(name)) {
                if ($.isString(name, true) && /[,|]/g.test(name)) {
                    name = name.splitStr(/[,|]/g);
                    if (name.length <= 1) {
                        name = name[0];
                    }
                }
                if ($.isArray(name)) {
                    for (var j = 0; j < name.length; j++) {
                        var v = obj[name[j]];
                        if (!$.isUndefined(v)) {
                            return v;
                        }
                    }
                }
                return obj[name] || '';
            }
            return obj;
        },
        setQueryString = function (url, data, value, nocache) {
            if (!isString(url)) {
                return url;
            }
            if ($.isBoolean(value) && $.isUndefined(nocache)) {
                nocache = value;
                value = null;
            }
            url = buildParam(data, value, true, url);
            if ($.isBoolean(nocache, true)) {
                var pkey = 'hupts001', time = getTime();
                url = buildParam(pkey, time, false, url);
            }
            return url;
        },
        getUrlHost = function (url, prefix) {
            var pos = url.indexOf('//'),
                http = pos > 0 ? url.substr(0, pos + 2) : '',
                str = pos > -1 ? url.substr(pos + 2) : url,
                pos1 = str.indexOf('/');
            return (prefix ? http : '') + (pos1 > -1 ? str.substr(0, pos1) : str);
        },
        getUrlPage = function(url) {
            var pos = url.indexOf('?'),
                str = pos > -1 ? url.substr(0, pos) : url,
                pos1 = str.lastIndexOf('/');
            return pos1 > -1 ? str.substr(pos1 + 1) : str;
        },
        OUIDebugActionFlag = false,
        setDebug = function (debug) {
            return OUIDebugActionFlag = $.isBoolean(debug, !OUIDebugActionFlag), this;
        },
        isDebugAction = function () {
            return OUIDebugActionFlag;
        },
        isDebug = function (key) {
            if (isBoolean(key, false)) {
                return isDebugAction();
            }
            try {
                var debug = getQueryString(location.href)[key || 'debug'],
                    result = !isNullOrUndefined(debug) && debug === '1';
                if (!result && $.isSubWindow()) {
                    try {
                        debug = getQueryString(parent.location.href)[key || 'debug'];
                        result = !isNullOrUndefined(debug) && debug === '1'
                    } catch (e) {}
                }
                return result || isDebugAction();
            } catch (e) {
                return false;
            }
        },
        isLocalhost = function () {
            var host = getUrlHost(location.href, false).toLowerCase();
            return host.indexOf('localhost') === 0 || host.indexOf('127.0.0.1') === 0;
        },
        isTelephone = function (num) {
            return $.PATTERN.Telephone.test(num);
        },
        isMobile = function (num) {
            //return /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(num);
            return $.PATTERN.Mobile.test(num);
        },
        isIdentity = function (num) {
            //return /^[1-8][1-9][\d]{4}(19|20)[\d]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[0-1])[\d]{3}[\dX]$/i.test(num);
            return $.PATTERN.Identity.test(num);
        },
        isEmail = function (email) {
            //return /^[A-Z0-9\u4e00-\u9fa5]+@[A-Z0-9_-]+(\.[A-Z0-9_-]+)+$/gi.test(email);
            return $.PATTERN.Email.test(num);
        },
        padLeft = function (s, totalWidth, paddingChar, isRight) {
            var char = paddingChar || '0', c = totalWidth - s.length;
            for (var i = 0; i < c; i++) {
                s = isRight ? s + char : char + s;
            }
            return s;
        },
        filterValue = function (vals, dval, valType) {
            if (!$.isArray(vals)) {
                vals = [vals];
            }
            var noval = $.isNullOrUndefined(dval),
                numval = $.isNumber(dval),
                isInt = $.isBoolean(valType, false) || valType === 'int';

            for (var i = 0; i < vals.length; i++) {
                var v = vals[i], undef = $.isUndefined(v);
                if (!undef && noval) {
                    return v;
                }
                if (!undef && !noval) {
                    if (numval) {
                        v = isInt ? parseInt(v, 10) : parseFloat(v, 10);
                        if (!isNaN(v) && v >= dval) {
                            return v;
                        }
                    } else if (v !== '') {
                        return v;
                    }
                }
            }
            return !noval ? dval : undefined;
        },
        keywordOverload = function (opt, keys, val, valType) {
            if (!opt) {
                return undefined;
            }
            var vals = [];
            for (var i in keys) {
                var k = keys[i];
                vals.push(opt[k]);
            }
            return filterValue(vals, val, valType);
        },
        setValue = function (obj, key, val, par) {
            par = $.extend({
                cover: false,
                add: true,
                set: true
            }, par);

            if (!$.isObject(obj)) {
                obj = {};
            }
            if (!par.set) {
                return obj;
            }
            if (!$.isUndefined(obj[key])) {
                if (par.cover) {
                    obj[key] = val;
                }
            } else if (par.add) {
                obj[key] = val;
            }
            return obj;
        },
        toList = function (key, delimiter) {
            var keys = [];
            if ($.isArray(key)) {
                keys = key;
            } else if ($.isString(key, true)) {
                keys = key.split(delimiter);
            }
            return keys;
        },
        //获取Object对象（嵌套）的值
        getValue = function (obj, key, dval) {
            if (!$.isObject(obj)) {
                return dval;
            }
            var keys = toList(key, '.'), len = keys.length;
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                if (k) {
                    obj = obj[k];
                }
                //若键值为null，则返回默认值
                if (obj === null || typeof obj === 'undefined') {
                    return typeof dval !== 'undefined' ? dval : '';
                }
                //若键值不为对象，则直接返回键值
                if (i < len - 1 && !$.isObject(obj)) {
                    return obj;
                }
            }
            return obj;
        },
        //判断是否为空值，如果设置了默认值，则返回值或默认值；如果没有设置默认值，则返回布尔值
        isValue = function (val, dval) {
            var isBoolean = typeof dval === 'undefined';
            if (null === val || typeof val === 'undefined') {
                return isBoolean ? false : dval;
            }
            return isBoolean ? true : val;
        },
        //获取参数值（参数名重载）
        getParam = function (opt, key, dval) {
            if (!$.isObject(opt)) {
                return dval;
            }
            var keys = toList(key, /[\|\,]/g), len = keys.length;
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i], val;
                if (k) {
                    val = opt[k];
                }
                if (!$.isNullOrUndefined(val)) {
                    return val;
                }
            }
            return dval;
        },
        //用于获取参数名重载
        getParamValue = function() {
            for(var i = 0; i < arguments.length; i++) {
                if(typeof arguments[i] !== 'undefined') {
                    return arguments[i];
                }
            }
            return undefined;
        },
        cleanSlash = function(urlpath) {
            if(!urlpath || urlpath.indexOf('/') < 0) {
                return urlpath;
            }
            return urlpath.replace(/[\/]{2,}/g, '/').replace(/(http:\/|https:\/)/ig, '$1/');
        },
        iniToJson = function (cfg) {
            var arr = cfg.split(/\r\n|\n/), len = arr.length;
            var json = {}, obj = json, dir, key, val;

            for (var i = 0; i < len; i++) {
                var s = arr[i].trim();
                //过滤空行和注释
                if ('' === s || s.startsWith(';') || s.startsWith('#')) {
                    continue;
                }
                //目录节点
                if (s.startsWith('[') && s.endsWith(']')) {
                    dir = s.substr(1, s.length - 2);
                    obj = json[dir] = {};
                } else {
                    var pos = s.indexOf('=');
                    if (pos > 0) {
                        key = s.substr(0, pos);
                        val = s.substr(pos + 1);

                        obj[key] = val;
                    }
                }
            }
            return json;
        },
        toIniJson = function (json, separator) {
            var obj = {}, c = 0;
            for (var k in json) {
                var item = json[k],
                    tmp = k.split(separator || '__'),
                    pid = tmp[0],
                    id = tmp[1];

                if(pid && id) {
                    if (typeof obj[pid] === 'undefined') {
                        obj[pid] = {};
                    }
                    obj[pid][id] = item;
                    c++;
                }
            }
            return c > 0 ? obj : json;
        },
        jsonToIni = function (json, ini, i) {
            if (typeof ini === 'undefined') {
                ini = [];
                i = 0;
            }
            for (var k in json) {
                var d = json[k];
                if (typeof d === 'object') {
                    if (i > 0) {
                        ini.push('');
                    }
                    ini.push('[' + k + ']');
                    jsonToIni(d, ini, ++i);
                } else {
                    ini.push(k + '=' + json[k]);
                    i++;
                }
            }
            return ini.join('\r\n');
        };

    var counter = 1, debug = isBoolean(isDebug(), true);
    $.extendNative = $.fn.extendNative = function (destination, source, constructor) {
        if (arguments.length < 2) {
            source = destination;
            destination = this;
        }
        if (typeof source !== 'object') {
            return destination;
        }
        //若 constructor 参数值为 boolean，表示是否强制extend
        var log = debug, con = constructor, native = isString(con), force = isBoolean(constructor, false);
        for (var property in source) {
            var extend = force || isUndefined(destination[property]), obj = source[property];
            if (extend) {
                destination[property] = obj;
            }
            //以下仅为调试时用，以便知悉扩展了哪些原生方法或哪些方法已有原生支持
            if (log && isFunction(obj) && (native || !extend)) {
                var s = obj.toString(),
                    declare = s.substr(0, s.indexOf('{')),
                    code = !extend ? native ? '[native code]' : '[native]' : '';
                console.log('extend[' + (counter++) + ']:', (con ? con + '.' : '') + property, '=', declare, code);
            }
        }
        return destination;
    };

    $.extendNative($, {
        trim: trim, isUndefined: isUndefined, isUndef: isUndefined, isString: isString, isNumber: isNumber,
        isFunction: isFunction, isFunc: isFunction, isObject: isObject, isArray: isArray, isDate: isDate, 
        isDateString: isDateString, isDateStr: isDateString,
        isBoolean: isBoolean, isBool: isBoolean, isTrue: isTrue, isFalse: isFalse, isNull: isNull, isEmpty: isEmpty,
        isProperty: isProperty, isPercent: isPercent, isPercentSize: isPercent, version: version,
        isNumeric: isNumeric, isDecimal: isDecimal, isInteger: isInteger, isFloat: isDecimal, isInt: isInteger,
        isHexNumeric: isHexNumeric, isHexNumber: isHexNumber,
        isMobile: isMobile, isTelephone: isTelephone, isIdentity: isIdentity, isEmail: isEmail,
        isRegexp: isRegexp, isNullOrUndefined: isNullOrUndefined, isNullOrUndef: isNullOrUndefined,
        isUndefinedOrNull: isNullOrUndefined, isUndefOrNull: isNullOrUndefined,        
        padLeft: function (s, totalWidth, paddingChar) {
            return padLeft(s, totalWidth, paddingChar, false);
        },
        padRight: function (s, totalWidth, paddingChar) {
            return padLeft(s, totalWidth, paddingChar, true);
        },
        toDecimal: toDecimal, toFloat: toDecimal, checkNumber: checkNumber, setNumber: setNumber,
        toInteger: toInteger, toInt: toInteger, toNumber: toNumber, toNumberList: toNumberList,
        toBoolean: toBoolean, toBool: toBoolean, iniToJson: iniToJson, jsonToIni: jsonToIni, toIniJson: toIniJson,
        containsKey: containsKey, containsValue: containsValue, contains: contains, distinctList: distinctList,
        collapseNumberList: collapseNumberList, expandNumberList: expandNumberList,
        collapseNumbers: collapseNumberList, expandNumbers: expandNumberList,
        toJsonString: toJsonString, toJsonStr: toJsonString, toJson: toJson, tryToJson: tryToJson, toEncode: toEncode,
        toAscii: toAscii, toAsciiHex: toAsciiHex, asciiToChar: asciiToChar, asciiToStr: asciiToChar,
        getArguments: getArguments, getArgs: getArguments,
        toFunction: toFunction, toFunc: toFunction, callFunction: callFunction, callFunc: callFunction,
        param: buildParam, buildParam: buildParam, setUrlParam: setUrlParam, buildAjaxData: buildAjaxData,
        setQueryString: setQueryString, getQueryString: getQueryString, getUrlHost: getUrlHost, getUrlPage: getUrlPage,
        setDebug: setDebug, isDebugAction: isDebugAction, isDebug: isDebug, isLocalhost: isLocalhost,
        filterValue: filterValue, keywordOverload: keywordOverload, keyOverload: keywordOverload,
        setValue: setValue, getValue: getValue, isValue: isValue, getParam: getParam,
        getParamValue: getParamValue, getParVal: getParamValue, cleanSlash: cleanSlash,
        toGpsString: function (gps, decimalLen) {
            var con = [],
                len = $.checkNumber(decimalLen, 3, 14) ? decimalLen : 8;
            if ($.isString(gps)) {
                var arr = gps.split(',');
                for (var i = 0; i < arr.length; i++) {
                    con.push(arr[i].round(len));
                }
            } else if ($.isObject(gps)) {
                con.push(gps.lat.round(len));
                con.push(gps.lng.round(len));
            }
            return con.join(',');
        },
        quickSort: function (arr, key) {
            if (0 === arr.length) { return []; }
            var left = [], right = [], pivot = arr[0], c = arr.length;
            for (var i = 1; i < c; i++) {
                arr[i][key] < pivot[key] ? left.push(arr[i]) : right.push(arr[i]);
            }
            return this.quickSort(left, key).concat(pivot, this.quickSort(right, key));
        },
        throwError: function (err) {
            try { console.trace(); console.log(err); } catch (e) { }
            throw new Error(err);
        },
        checkValue: function () {
            var args = arguments;
            for (var i = 0; i < args.length; i++) {
                if (typeof args[i] !== 'undefined') {
                    return args[i];
                }
            }
            return undefined;
        }
    }, '$');
}(OUI);

// CRC
!function ($) {
    'use strict';

    function CRC() {
        var CRC16 = function (bytes, isReverse) {
            var len = bytes.length, crc = 0xFFFF;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    crc = (crc ^ (bytes[i]));
                    for (var j = 0; j < 8; j++) {
                        crc = (crc & 1) !== 0 ? ((crc >> 1) ^ 0xA001) : (crc >> 1);
                    }
                }
                var high = (crc & 0xFF00) >> 8, low = crc & 0x00FF;
                return isReverse ? (high + low * 0x100) : (high * 0x100 + low);
            }
            return 0;
        }, strToByte = function (s) {
            if (Object.prototype.toString.call(s) === '[object Array]' && typeof s[0] === 'number') { return s; }
            var chars = s.split(''), len = chars.length, arr = [];
            for (var i = 0; i < len; i++) {
                var char = encodeURI(chars[i]);
                if (char.length === 1) {
                    arr.push(char.charCodeAt());
                } else {
                    var byte = char.split('%'), c = byte.length;
                    for (var j = 1; j < c; j++) {
                        arr.push(parseInt('0x' + byte[j]));
                    }
                }
            }
            return arr;
        }, strToHexByte = function (s, isFilter) {
            var hex = strToHexChar(s, isFilter).join('').replace(/\s/g, "");
            //若字符个数为奇数，补一个0
            if (hex.length % 2 !== 0) {
                hex = '0' + hex;
            }

            var c = hex.length / 2, arr = [];
            for (var i = 0; i < c; i++) {
                arr.push(parseInt(hex.substr(i * 2, 2), 16));
            }
            return arr;
        }, strToHexChar = function (s, isFilter) {
            var chars = s.split(''), len = chars.length, arr = [];
            for (var i = 0; i < len; i++) {
                var char = chars[i].charCodeAt();
                if (char > 0 && char < 127) {
                    arr.push(chars[i]);
                } else if (!isFilter) {
                    arr.push(char.toString(16));
                }
            }
            return arr;
        }, toHex = function (n, w) {
            return n.toString(16).toUpperCase().padStart(w, '0');
        };

        return {
            toCRC16: function (s, isReverse, isHex) {
                s = ('' + s).toString();
                return toHex(CRC16(isHex ? strToHexByte(s) : strToByte(s), isReverse), 4);
            },
            toModbusCRC16: function (s, isReverse) {
                s = ('' + s).toString();
                return toHex(CRC16(strToHexByte(s), isReverse), 4);
            },
            toHexCRC16: function (s, isReverse) {
                s = ('' + s).toString();
                return toHex(CRC16(strToHexByte(s), isReverse), 4);
            }
        };
    }

    if (typeof window === 'object') {
        window.CRC = CRC;
    }

    $.extendNative($, { CRC: CRC, crc: new CRC() }, '$');
}(OUI);

// Dictionary
!function ($) {
    'use strict';

    var dicCache = {};

    function Dictionary(id) {
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
    }

    $.extendNative($, {
        Dictionary: Dictionary,
        dict: function (id) {
            if (dicCache[id]) {
                return dicCache[id];
            }
            var dic = new Dictionary(id);
            dicCache[id] = dic;
            return dic;
        }
    }, '$');
}(OUI);

//Base64
!function ($) {
    var encodeChars64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        decodeChars64 = new Array(
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
            58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
            7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
            -1, -1
        );

    $.extend($, {
        base64: {
            encode: function (s) {
                var out = '', i = 0, len = s.length;
                var c1, c2, c3;
                while (i < len) {
                    c1 = s.charCodeAt(i++) & 0xff;
                    if (i == len) {
                        out += encodeChars64.charAt(c1 >> 2);
                        out += encodeChars64.charAt((c1 & 0x3) << 4);
                        out += "==";
                        break;
                    }
                    c2 = s.charCodeAt(i++);
                    if (i == len) {
                        out += encodeChars64.charAt(c1 >> 2);
                        out += encodeChars64.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        out += encodeChars64.charAt((c2 & 0xF) << 2);
                        out += "=";
                        break;
                    }
                    c3 = s.charCodeAt(i++);
                    out += encodeChars64.charAt(c1 >> 2);
                    out += encodeChars64.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += encodeChars64.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                    out += encodeChars64.charAt(c3 & 0x3F);
                }
                return out;
            },
            decode: function (s) {
                if (/[\-\s]/.test(s)) {
                    s = s.trim().replace(/[\-\s]/g, '+');
                }
                var c1, c2, c3, c4;
                var i = 0, len = s.length, out = '';
                while (i < len) {
                    do {
                        c1 = decodeChars64[s.charCodeAt(i++) & 0xff];
                    } while (i < len && c1 === - 1);
                    if (c1 === -1) {
                        break;
                    }
                    do {
                        c2 = decodeChars64[s.charCodeAt(i++) & 0xff];
                    } while (i < len && c2 === - 1);
                    if (c2 === -1) {
                        break;
                    }
                    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
                    do {
                        c3 = s.charCodeAt(i++) & 0xff;
                        if (c3 === 61) {
                            return out;
                        }
                        c3 = decodeChars64[c3];
                    } while (i < len && c3 === - 1);
                    if (c3 === -1) {
                        break;
                    }
                    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
                    do {
                        c4 = s.charCodeAt(i++) & 0xff;
                        if (c4 === 61) {
                            return out;
                        }
                        c4 = decodeChars64[c4];
                    } while (i < len && c4 === - 1);
                    if (c4 === -1) {
                        break;
                    }
                    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
                }
                return out;
            }
        },
        base62: {
            encode: function (s) {

            },
            decode: function (s) {

            }
        }
    });
}(OUI);

// 字符编码转换
!function ($) {
    'use strict';

    $.extendNative($, {
        numberToChinese: function (num, isMoney) {
            if (isNaN(parseFloat(num, 10))) {
                return num;
            }
            var chars = isMoney ?
                //零壹贰叁肆伍陆柒捌玖
                ['\u96f6', '\u58f9', '\u8d30', '\u53c1', '\u8086', '\u4f0d', '\u9646', '\u67d2', '\u634c', '\u7396'] :
                //零一二三四五六七八九
                ['\u96f6', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d', '\u4e03', '\u516b', '\u4e5d'],
                //空，拾，佰，仟 或 十，百，千
                units = isMoney ? ['', '\u62fe', '\u4f70', '\u4edf'] : ['', '\u5341', '\u767e', '\u5343'],
                //空值，万，亿，兆，京
                teams = ['', '\u4e07', '\u4ebf', '\u5146', '\u4eac'],
                //角，分，厘，毫
                decimals = ['\u89d2', '\u5206', '\u5398', '\u6beb'],
                //元，整，负
                others = { unit: '\u5143', int: '\u6574', minus: '\u8d1f' },
                //点
                dot = '\u70b9',
                toChinese = function (txt, isMoney, isDecimal) {
                    if (typeof txt !== 'string') {
                        return '';
                    }
                    if (isMoney && isDecimal && txt.length > 4) {
                        txt = txt.substr(0, 4);
                    }
                    var str = [], len = txt.length - 1;
                    for (var i = 0; i <= len; i++) {
                        var num = parseInt(txt[i], 10), pos = len - i, unit = isDecimal ? decimals[i] : units[pos];
                        if (num === 0 && (i === len || txt[i + 1] === '0')) {
                            continue;
                        }
                        //当值为0时,舍弃单位，当值为0并且为金额小数时，舍弃值和单位
                        //当整数部分 值为1，并且单位为“十”时，舍弃值
                        //纯数字（非金额）模式，则小数部分没有单位
                        //str.push(num === 0 ? (!isDecimal ? chars[num] : '') : (num === 1 && pos === 1 && !isDecimal) ? unit : (chars[num] + unit));                        
                        if (num === 0) {
                            str.push(isMoney && isDecimal ? '' : chars[num]);
                        } else if (num === 1 && pos === 1 && !isDecimal) {
                            str.push(unit);
                        } else {
                            str.push(chars[num] + (isMoney || !isDecimal ? unit : ''));
                        }

                    }
                    return str.join('');
                },
                splitNumber = function (txt) {
                    return txt.replace(/\B(?=(?:[\d]{4})+$)/g, ',').split(',');
                },
                arr = ('' + num).replace(/[,]/g, '').split('.'), str = arr[0],
                res = [];

            if (str.indexOf('-') === 0) {
                res.push(others.minus);
                str = str.substr(1);
            }

            var nums = splitNumber(str), len = nums.length - 1;

            for (var i = 0; i <= len; i++) {
                res.push(toChinese(nums[i], isMoney));
                res.push(teams[len - i]);
            }
            if (isMoney) {
                res.push(others.unit);
                res.push(arr[1] ? toChinese(arr[1], isMoney, true) : others.int);
            } else {
                res.push(arr[1] ? dot + toChinese(arr[1], isMoney, true) : '');
            }
            return res.join('');
        },
        chineseToNumber: function (str, isMoney) {
            var minus = str.indexOf('\u8d1f') === 0,
                //是否出现“点”，若出现点字，表示不是金额，而是普通的小数（中文格式）
                point = false,
                i = 0, j = 0, k = 0, total = 0, decimal = 0, num = 0,
                chars = {
                    //一，二，三，四，五，六，七，八，九，零
                    '\u4e00': 1, '\u4e8c': 2, '\u4e09': 3, '\u56db': 4, '\u4e94': 5, '\u516d': 6, '\u4e03': 7, '\u516b': 8, '\u4e5d': 9, '\u96f6': 0,
                    //壹，贰，叁，肆，伍，陆，柒，捌，玖
                    '\u58f9': 1, '\u8d30': 2, '\u53c1': 3, '\u8086': 4, '\u4f0d': 5, '\u9646': 6, '\u67d2': 7, '\u634c': 8, '\u7396': 9
                },
                units = {
                    //十，拾，百，佰，千，仟，万
                    '\u5341': 10, '\u62fe': 10, '\u767e': 100, '\u4f70': 100, '\u5343': 1000, '\u4edf': 1000, '\u4e07': 10000,
                    //元，整，负
                    '\u5143': 1, '\u6574': 1, '\u70b9': 1
                },
                //角，分，厘，毫
                decimals = { '\u89d2': 0.1, '\u5206': 0.01, '\u5398': 0.001, '\u6beb': 0.0001 },
                //点
                dot = '\u70b9';

            if (minus) {
                str = str.substr(1);
            }
            // 如果出现“点”字，表示包含小数，按字面量“角分厘毫”的顺序 增加 decimals 数组下标元素，元素值同字面量值
            // \u70b9 点
            if (str.indexOf('\u70b9') > -1) {
                for (var m in decimals) {
                    decimals[k++] = decimals[m];
                }
            }

            var len = str.length, dlen = 4;
            while (i < len) {
                var s = str[i], n = chars[s];
                if (typeof n !== 'undefined') {
                    if (!point) {
                        num = n;
                    } else {
                        ////小数（非角分厘毫）直接追加
                        //var n1 = n * decimals[j++];
                        //total += n1;
                        if (j < dlen) {
                            total = total.add(n.mul(decimals[j]));
                        } else {
                            total = total.add(n.div(Math.pow(10, j + 1)));
                        }
                        j++;
                    }
                } else {
                    //将十转换为数字1，因为十是单位，后面会进行数字与单位相乘，即 1 * 10 运算
                    //十，拾
                    if (['\u5341', '\u62fe'].indexOf(s) > -1 && (i === 0 || num === 0)) {
                        num = 1;
                    }
                    //万，亿，兆，京
                    if (['\u4e07', '\u4ebf', '\u5146', '\u4eac'].indexOf(s) > -1) {
                        // \u4e07 万
                        total = (total + num) * units['\u4e07'];
                    }
                    //角，分，厘，毫
                    else if (['\u89d2', '\u5206', '\u5398', '\u6beb'].indexOf(s) > -1) {
                        ////小数部分先全部运算完，最后再与整数相加
                        //decimal += num * decimals[s];
                        decimal = decimal.add(num.mul(decimals[s]));
                    } else {
                        total += num * (units[s] || 0);
                        // \u70b9 点
                        if (s === '\u70b9') {
                            point = true;
                        }
                    }
                    num = 0;
                }
                i++;
            }
            total += num + decimal;

            if (minus) {
                total = 0 - total;
            }

            return total;
        },
        chineseToUnicode: function (str, returnArray, noPrefix) {
            var arr = $.isArray(str) ? str : str.split(''), len = arr.length, res = [];
            for (var i = 0; i < len; i++) {
                var code = arr[i].charCodeAt();
                var hex = code.toString(16).padStart(4, '0');
                res.push((noPrefix ? '' : '\\u') + hex);
            }
            return returnArray ? res : res.join('');
        },
        unicodeToChinese: function (code, returnArray) {
            if ($.isArray(code)) {
                code = code.join('');
            }
            var teamLen = code.indexOf('\\u') > -1 ? 6 : 4;
            var len = code.length, i = 0, arr = [], prefix = teamLen === 6;
            while (i < len - 1) {
                arr.push((!prefix ? '\\u' : '') + code.substr(i, teamLen));
                i += teamLen;
            }
            var words = JSON.parse('["' + arr.join('","') + '"]');
            return returnArray ? words : words.join('');
        },
        asciiToUnicode: function (str, returnArray) {
            var arr = str.split(''), len = arr.length, res = [];
            for (var i = 0; i < len; i++) {
                res.push('&#' + arr[i].charCodeAt() + ';');
            }
            return returnArray ? res : res.join('');
        },
        unicodeToAscii: function (code, returnArray) {
            if ($.isArray(code)) {
                code = code.join('');
            }
            var arr = code.split(';'), len = arr.length, chars = [];
            for (var i = 0; i < len; i++) {
                if (arr[i]) {
                    chars.push(String.fromCharCode(arr[i].substr(2)));
                }
            }
            return returnArray ? chars : chars.join('');
        }
    }, '$');

    $.extendNative($, {
        toUnicode: function (str, returnArray, noPrefix) {
            return $.chineseToUnicode(str, returnArray, noPrefix);
        },
        unUnicode: function (code, returnArray) {
            return $.unicodeToChinese(code, returnArray);
        }
    }, '$');
}(OUI);

!function ($) {
    'use strict';

    $.extendNative($, {
        isLeapYear: function (year) {
            if (!$.isNumber(year)) {
                year = parseInt('0' + year, 10);
            }
            return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
        },
        getDays: function (year, month) {
            var leap = Date.isLeapYear(year),
                days = 31;
            switch (month) {
                case 4:
                case 6:
                case 9:
                case 11:
                    days = 30;
                    break;
                case 2:
                    days = leap ? 29 : 28;
                    break;
            }
            return days;
        },
        isDateObject: function (dt) {
            if (typeof dt === 'object' && typeof dt.getFullYear === 'function') {
                return true;
            }
            return false;
        },
        getDateOptions: function (dt) {
            if ($.isDateObject(dt)) {
                return { year: dt.getFullYear(), month: dt.getMonth() + 1, date: dt.getDate() };
            }
            return null;
        },
        getMonthStart: function (month, year) {
            var ds = $.getDateOptions(month);
            if (ds !== null) {
                return '{0}-{1:D2}-01 00:00:00'.format(ds.year, ds.month);
            } else {
                var dt = new Date();
                year = year || dt.getFullYear();
                month = month || (dt.getMonth() + 1);
                return '{0}-{1:D2}-01 00:00:00'.format(year, month);
            }
        },
        getMonthEnd: function (month, year) {
            var ds = $.getDateOptions(month);
            if (ds !== null) {
                var days = Date.getDays(ds.year, ds.month);
                return '{0}-{1:D2}-{2:D2} 23:59:59'.format(ds.year, ds.month, days);
            } else {
                var dt = new Date();
                year = year || dt.getFullYear();
                month = month || (dt.getMonth() + 1);
                var days = Date.getDays(year, month);
                return '{0}-{1:D2}-{2:D2} 23:59:59'.format(year, month, days);
            }
        },
        getDayStart: function (date, month, year) {
            var ds = $.getDateOptions(date);
            if (ds !== null) {
                return '{0}-{1:D2}-{2:D2} 00:00:00'.format(ds.year, ds.month, ds.date);
            } else {
                var dt = new Date();
                year = year || dt.getFullYear();
                month = month || (dt.getMonth() + 1);
                date = date || dt.getDate();
                return '{0}-{1:D2}-{2:D2} 00:00:00'.format(year, month, date);
            }
        },
        getDayEnd: function (date, month, year) {
            var ds = $.getDateOptions(date);
            if (ds !== null) {
                return '{0}-{1:D2}-{2:D2} 23:59:59'.format(ds.year, ds.month, ds.date);
            } else {
                var dt = new Date();
                year = year || dt.getFullYear();
                month = month || (dt.getMonth() + 1);
                date = date || dt.getDate();
                return '{0}-{1:D2}-{2:D2} 23:59:59'.format(year, month, date);
            }
        }
    });

}(OUI);

// Javascript 原生对象方法扩展
!function ($) {
    'use strict';

    $.extendNative(Array.prototype, {
        indexOf: function (elem) {
            for (var i = 0, n = this.length; i < n; i++) {
                if (this[i] === elem) {
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
        padStart: function (totalWidth, paddingChar) { return $.padLeft(this, totalWidth, paddingChar || ' '); },
        padEnd: function (totalWidth, paddingChar) { return $.padRight(this, totalWidth, paddingChar || ' '); },
        padLeft: function (totalWidth, paddingChar) { return $.padLeft(this, totalWidth, paddingChar || '0'); },
        padRight: function (totalWidth, paddingChar) { return $.padRight(this, totalWidth, paddingChar || '0'); },
        startsWith: function (s) { return this.slice(0, s.length) === s; },
        endsWith: function (s) { return this.slice(-s.length) === s; },
        startWith: function (s) { return this.startsWith(s); },
        endWith: function (s) { return this.endsWith(s); },
        len: function () { return this.replace(/([^\x00-\xff])/g, 'aa').length; },
        uppercaseLen: function() { return (this.match(/[A-Z]/g) || '').length; },
        contains: function (obj) {
            if ($.isArray(obj)) {
                return obj.indexOf(this) >= 0;
            } else if ($.isObject(obj)) {
                return $.containsKey(obj, this);
            } else if ($.isString(obj)) {
                return obj.indexOf(this) >= 0;
            }
            return false;
        },
        in: function (obj) {
            return this.contains(obj);
        },
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
        /*
            v: 要插入的内容
            c: 要插入的数量，如 v="abc", c=2, 则插入 "abcabc"
            startIndex: 要插入的起始位置
        */
        insert: function (v, c, startIndex) {
            var s0 = '',
                s1 = this,
                len = s1.length;
            if (startIndex < 0) {
                startIndex = len + startIndex;
            }
            if ($.isNumber(startIndex)) {
                if (len < startIndex) {
                    return s1.append(v, c);
                } else {
                    s0 = s1.substr(0, startIndex);
                    s1 = s1.substr(startIndex);
                }
            }
            if ($.isNumber(c)) {
                for (var i = 0; i < c; i++) { s1 = v + s1; }
                return s0 + s1;
            }
            return s0 + v + s1;
        },
        remove: function (startIndex, count) {
            var s = this, len = s.length;
            if (startIndex < 0) {
                startIndex = len + startIndex;
            }
            if (!$.isNumber(count) || count + startIndex > len) {
                return s.substr(0, startIndex);
            }
            return s.substr(0, startIndex) + s.substr(startIndex + count);
        },
        //插入字符串组元素
        /*
            s: 要插入的字符串
            index: 插入的(字符串组)起始位置
            separator: 返回的字符串组的分隔符
        */
        insertItem: function (s, index, separator) {
            var _s = this.trim();
            var arr = _s.split(/[,\|;]/g), c = arr.length, list = [], n = 0;
            if (_s === '' || c <= 0) {
                return s;
            }
            if (!$.isNumber(index)) {
                index = 0;
            }
            if (index < 0) {
                index = c + index;
            }
            if (index === 0) {
                list.push(s);
            }
            for (var i = 0; i < c; i++) {
                var v = arr[i];
                if (v !== '' && v !== s) {
                    list.push(v);
                    n++;
                }
                if (index === n && n > 0) {
                    list.push(s);
                }
            }
            return list.join(separator || ',');
        },
        distinct: function(separator) {
            var s = this;
            return $.distinctList(s, separator);
        },
        distinctList: function(separator) {
            var s = this;
            return $.distinctList(s, separator);
        },
        space: function (prefix, postfix) {
            var s = this,
                s1 = $.isNumber(prefix) ? ''.append(' ', prefix) : (prefix || ' '),
                s2 = $.isNumber(postfix) ? ''.append(' ', postfix) : (postfix || ' ');
            return s1 + s + s2;
        },
        //清理字符串的指定字符或所有空格
        clean: function (s) {
            var reg = new RegExp('(' + (s || ' ') + ')', 'g');
            return this.replace(reg, '');
        },
        //清除字符串的指定字符或所有空格和-
        clear: function (s) {
            //清除字符串的多余字符，默认清除 - 和 空格
            var reg = new RegExp('[' + (s || '- ') + ']', 'g');
            return this.replace(reg, '');
        },
        separate: function (delimiter, itemLen) {
            var reg = new RegExp('(.{' + itemLen + '}(?!$))', 'g');
            return this.replace(reg, '$1' + delimiter);
        },
        join: function () {
            return this.toString();
        },
        isEmpty: function () { return this.trim() === ''; },
        isNumeric: function () { return $.isNumeric(this); },
        isDecimal: function () { return $.isDecimal(this); },
        isInteger: function () { return $.isInteger(this); },
        isFloat: function () { return $.isDecimal(this); },
        isInt: function () { return $.isInteger(this); },
        isHexNumeric: function () { return $.isHexNumeric(this); },
        isPercent: function () { return $.isPercent(this); },
        isTelephone: function () { return $.isTelephone(this); },
        isMobile: function () { return $.isMobile(this); },
        isIdentity: function () { return $.isIdentity(this); },
        isEmail: function () { return $.isEmail(this); },
        isNaN: function () { return isNaN(parseFloat(this, 10)); },
        toBoolean: function (val) { return $.toBoolean(this, typeof val === 'undefined' ? this : val); },
        toBool: function (val) { return $.toBoolean(this, typeof val === 'undefined' ? this : val); },
        toNumber: function (defaultValue, isFloat, decimalLen) { return $.toNumber(this, defaultValue, isFloat, decimalLen); },
        toNumberList: function (separator, decimalLen) { return $.toNumberList(this, separator, decimalLen); },
        toInt: function (defaultValue) { return $.toInteger(this, defaultValue); },
        toInteger: function (defaultValue) { return $.toInteger(this, defaultValue); },
        toFloat: function (defaultValue, decimalLen) { return $.toDecimal(this, defaultValue, decimalLen); },
        toDecimal: function (defaultValue, decimalLen) { return $.toDecimal(this, defaultValue, decimalLen); },
        round: function (decimalLen) { return $.toNumber(this).round(decimalLen); },
        expandNumberList: function () { return $.expandNumberList(this); },
        toChineseNumber: function (isMoney) { return $.numberToChinese(this, isMoney); },
        chineseToNumber: function (isMoney) { return $.chineseToNumber(this, isMoney); },
        convertChineseToNumber: function () { return $.chineseToNumber(this); },
        chineseToUnicode: function (returnArray, noPrefix) { return $.chineseToUnicode(this, returnArray, noPrefix); },
        unicodeToChinese: function (returnArray) { return $.unicodeToChinese(this, returnArray); },
        asciiToUnicode: function (returnArray) { return $.asciiToUnicode(this, returnArray); },
        unicodeToAscii: function (returnArray) { return $.unicodeToAscii(this, returnArray); },
        firstLetterCapital: function () {
            var s = this.toLowerCase(), f = s.substr(0, 1).toUpperCase();
            return f + s.substr(1);
        },
        toThousand: function (delimiter, len) {
            if ($.isNumber(delimiter)) {
                len = delimiter;
                delimiter = ',';
            }
            var s = this;
            if (s.indexOf(',') > -1) {
                s = s.replace(/[,]/g, '');
            }
            var a = s.split('.'), hasPoint = s.indexOf('.') >= 0;
            var reg = new RegExp('\\B(?=(?:[\\dA-Fa-f]{' + (len || 3) + '})+$)', 'gi');
            return a[0].replace(reg, delimiter || ',') + (hasPoint ? '.' + (a[1] || '') : '');
        },
        toFileSize: function () {
            var num = parseFloat(this, 10);
            return num.toFileSize();
        },
        toDate: function (format) {
            var v = this;
            if ($.isString(format) && (!v || '0' === v)) {
                return '';
            }
            var ts = !v || '0' === v ? 0 : Date.parse(v.replace(/-/g, '/'));
            if (isNaN(ts) && /^[\d]{10,13}$/.test(v)) {
                ts = Number(v.padRight(13));
            }
            var dt = new Date(ts);
            if (isNaN(dt.getFullYear())) {
                if ($.isUndefined(format)) {
                    console.error('Date time format error: ', v);
                    console.trace();
                }
            }
            return $.isString(format) ? dt.format(format) : dt;
        },
        toDateString: function (format) {
            if (this.trim() === '' || this === '-') {
                return this;
            }
            if (this === '0') {
                return '';
            }
            var dt = this.toDate(true);
            return isNaN(dt.getFullYear()) ? '' : dt.format(format || '');
        },
        toDateFormat: function (format) {
            return this.toDateString(format);
        },
        toDateStr: function (format) {
            return this.toDateString(format);
        },
        toTimeStr: function () {
            return parseInt('0' + this, 10).toTimeStr();
        },
        toSeconds: function () {
            var arr = this.split(':');
            var s = parseInt('0' + arr[0], 10) * 3600;
            if (arr.length > 2) {
                s += parseInt('0' + arr[1], 10) * 60;
                s += parseInt('0' + arr[2], 10);
            }
            return s;
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
        toUnicode: function (returnArray, noPrefix) {
            /*
            var s = this, c = s.length, u = '';
            for (var i = 0; i < c; i++) {
                var hex = s.charCodeAt(i).toString(16);
                u += '\\u' + hex.padStart(4);
            }
            return u;
            */
            return $.chineseToUnicode(this, returnArray, noPrefix);
        },
        unUnicode: function (returnArray) {
            return $.unicodeToChinese(this, returnArray);
        },
        asciiToChar: function () {
            return $.asciiToChar(this);
        },
        asciiToStr: function () {
            return $.asciiToChar(this);
        },
        toAscii: function () {
            return $.toAscii(this);
        },
        toAsciiHex: function (arrAscii, isJoin) {
            if ($.isBoolean(arrAscii)) {
                isJoin = arrAscii;
                arrAscii = null;
            }
            var arr = $.isArray(arrAscii) ? arrAscii : this.toAscii();
            return $.toAsciiHex(arr, isJoin);
        },
        toHex: function () {
            return $.toAsciiHex(this.toAscii(), true);
        },
        parseUnicode: function (returnArray) {
            return $.unicodeToChinese(this, returnArray);
        },
        toJson: function () {
            return $.toJson(this);
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
        },
        cleanSlash: function() {
            return $.cleanSlash(this);
        },
        setQueryString: function (data, value, nocache) {
            return $.setQueryString(this, data, value, nocache);
        },
        getQueryString: function (name) {
            return $.getQueryString(this, name);
        },
        setUrlParam: function (data, value, nocache) {
            return $.setQueryString(this, data, value, nocache);
        },
        getUrlHost: function (prefix) {
            return $.getUrlHost(this, prefix);
        },
        getUrlPage: function() {
            return $.getUrlPage(this);
        },
        getFilePath: function(currentPath) {
            return $.getFilePath(this, currentPath);
        },
        getFileName: function (withoutExtension) {
            return $.getFileName(this, withoutExtension);
        },
        getExtension: function () {
            return $.getExtension(this);
        },        
        isImageFile: function () {
            var s = this,
                regExt = /^[.](jpg|jpeg|png|gif|bmp)$/i,
                //base64字节长度规则应该是4的倍数，从FileReader获取的readAsDataURL数据没有填充=，
                //所以这里不具体判断数据长度
                regCon = /^data:image\/(jpg|jpeg|png|gif|bmp)+;base64,([0-9A-Z\+\-=\/]{32,})/i;
            return !s.trim() ? false : regCon.test(s) || regExt.test($.getExtension(s));
        },
        getFullPath: function(hideHost) {
        	return $.getFullPath(this, hideHost);
        },
        getFileDir: function(showName) {
        	return $.getFileDir(this, showName);
        },
        getFileDirName: function() {
			return $.getFileDirName(this);
        },
        getFileSize: function (callback) {
            return $.getFileSize(this, callback);
        },
        formatSimple: function (args) {
            var s = this, sep = '%s', vals = [], rst = [];
            if (arguments.length > 1) {
                for (var i = 0, c = arguments.length; i < c; i++) {
                    if (arguments[i] != undefined) {
                        vals.push(arguments[i]);
                    }
                }
            } else if (Object.prototype.toString.call(args) === '[object Array]') {
                vals = args;
            } else if (args != undefined && args != null) {
                vals.push(args);
            }
            var arr = s.split(sep);
            for (var i = 0, c = arr.length; i < c; i++) {
                rst.push(arr[i]);
                if (i < c - 1) {
                    rst.push(vals[i]);
                }
            }
            return rst.join('');
        },
        filterRareWord: function () {
            return this.replace(/[^\uff01-\uff0e|\u0000-\u9fa5]*/g, '');
        },
        getAge: function () {
            var dt = this.toDate();
            if (dt.isDate()) {
                return dt.getAge();
            }
            return 0;
        },
        base64Decode: function () {
            return $.base64.decode(this);
        },
        base64Encode: function () {
            return $.base64.encode(this);
        },
        base64decode: function () {
            return $.base64.decode(this);
        },
        base64encode: function () {
            return $.base64.encode(this);
        },
        collapseNumbers: function (distinct) {
            var arr = this.split(/[\,\|]/g);
            return $.collapseNumberList(arr, distinct);
        },
        expandNumbers: function (distinct) {
            return $.expandNumberList(this, distinct);
        },
        addNamePostfix: function (postfix) {
            return $.addNamePostfix(this, postfix);
        },
        checkFilePath: function () {
            return $.checkFilePath(this);
        },
        checkPicPath: function() {
            return $.checkFilePath(this);
        },
        isEvenLen: function () {
            var s = this.trim(), len = s.length;
            if (len % 2 !== 0) {
                s = '0' + s;
            }
            return s;
        },
        reverseHex: function (reverse) {
            if(!$.isBoolean(reverse, true)) {
                return this;
            }
            var hex = this.isEvenLen(), arr = [], len = hex.length;
            for (var i = 0; i < len / 2; i++) {
                arr[len - i * 2 - 1] = hex[i * 2 + 1];
                arr[len - i * 2 - 2] = hex[i * 2];
            }
            return arr.join('');
        },
        hexToInt: function (reverse) {
            var s = this.isEvenLen(),
                hex = reverse ? s.reverseHex(reverse) : s,
                num = eval('0x' + hex).toString(10);
            return parseInt(num, 10);
        },
        hexToFloat: function (reverse, decimalLen) {
            var a = reverse ? this.reverseHex(reverse) : this;
            var b = parseInt(a, 16);
            var s = (b & 0x80000000) ? -1 : 1;
            var e = (b & 0x7f800000) / 0x800000 - 127;
            var c = (b & 0x7fffff) / 0x800000;
            var f = s * (1 + c) * Math.pow(2, e);
            return decimalLen > 0 ? f.round(decimalLen) : f;
        },
        floatToHex: function(reverse) {
            var num = (this || '').trim(),
                decVal = parseFloat(Math.abs(num), 10),
                fraction, exponent;

            if(decVal === 0) {
                fraction = 0;
                exponent = 0;
            } else {
                //偏置常数
                exponent = 127;
                if(decVal >= 2) {
                    while(decVal >= 2) {
                        exponent++;
                        decVal /= 2;
                    }
                } else if(decVal < 1) {
                    while(decVal < 1) {
                        exponent--;
                        decVal *= 2;
                        if(exponent === 0) {
                            break;
                        }
                    }
                }
                if(exponent !== 0) {
                    decVal -= 1;
                } else {
                    decVal /= 2;
                }
            }

            function decToBinTail(dec, pad) {
                var bin = '', i;
                for (i = 0; i < pad; i++) {
                    dec *= 2;
                    if (dec >= 1) {
                        dec -= 1;
                        bin += '1';
                    } else {
                        bin += '0';
                    }
                }
                return bin;
            }

            function decToBinHead(dec, pad) {
                var bin = '', i;
                for (i = 0; i < pad; i++) {
                    bin = (parseInt(dec % 2).toString()) + bin;
                    dec /= 2;
                }
                return bin;
            }
            //1位符号
            var signStr = num.toString().charAt(0) === '-' ? '1' : '0';
            //8位阶码
            var exponentStr = decToBinHead(exponent, 8);
            //23位尾数
            var fractionStr = decToBinTail(decVal, 23);

            return $.padLeft(parseInt(signStr + exponentStr + fractionStr, 2).toString(16), 8).reverseHex(reverse);
        },
        hexToStr: function (reverse) {
            var s = this.isEvenLen(),
                hex = reverse ? s.reverseHex(reverse) : s,
                len = hex.length,
                arr = [];

            for (var i = 0; i < len / 2; i++) {
                var str = hex[i * 2] + hex[i * 2 + 1],
                    num = eval('0x' + str).toString(10);
                arr.push(String.fromCharCode(num));
            }
            return arr.join('');
        },
        //十六进制字符串转换成字节数组
        hexToNum: function (reverse) {
            var s = this.isEvenLen(),
                hex = reverse ? s.reverseHex(reverse) : s,
                len = hex.length,
                arr = [];
            for (var i = 0; i < len / 2; i++) {
                var str = hex[i * 2] + hex[i * 2 + 1],
                    num = eval('0x' + str).toString(10);
                arr.push(parseInt(num, 10));
            }
            return arr;
        },
        hexToAscii: function (reverse) {
            return this.hexToNum(reverse);
        },
        hexToTime: function (reverse) {
            var num = this.hexToInt(true);
            return num.toDate().format();
        },
        //这个函数是从C语言中仿制过来的，利用左移2位实现
        charToInt: function (reverse) {
            var arr = this.hexToNum(false);
            var len = arr.length, num = 0, i = 0, j = 0;
            for (i = 0; i < len; i++) {
                j = len - i - 1;
                num |= arr[reverse ? j : i] << (j * 8);
            }
            return num;
        },
        getHexStr: function () {
            var hex = this,
                len = hex.length;
            if (len % 2 !== 0) {
                hex += '0';
                len += 1;
            }
            var pos = 0;
            for (var i = 0; i < len / 2; i++) {
                var s = hex.substr(i * 2, 2);
                if (s === '00') {
                    break;
                }
                pos += 2;
            }
            return hex.substr(0, pos);
        },
        removeEmptyLine: function () {
            return $.removeEmptyLine(this);
        },
        filterHtml: function (_removeEmptyLine) {
            return $.filterHtml(this, _removeEmptyLine);
        },
        splitStr: function (pattern, removeEmpty) {
            return $.splitStr(this, pattern, removeEmpty);
        },
        encodeHtml: function () {
            return $.encodeHtml(this);
        },
        decodeHtml: function () {
            return $.decodeHtml(this);
        },
        isTrue: function (strict) {
            var s = this;
            return s === 'true' || !strict && s === '1';
        },
        isFalse: function (strict) {
            var s = this;
            return s === 'false' || !strict && s === '0';
        },
        iniToJson: function() {
            return $.iniToJson(this);
        },
        jsonToIni: function() {
            var rst = $.tryToJson(this);
            if (rst.status) {
                return $.jsonToIni(rst.json || rst.data);
            }
            return '';
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
        isHexNumber: function () { return $.isHexNumeric(this); },
        isNaN: function () { return isNaN(parseFloat(this, 10)); },
        toAscii: function () { return this.toString().charCodeAt(); },
        toHex: function (len, lower) {
            var hex = this.toString(16);
            if (len) {
                hex = hex.padLeft(len, '0');
            }
            return lower ? hex.toLowerCase() : hex.toUpperCase();
        },
        floatToHex: function(reverse) {
            return this.toString().floatToHex(reverse);
        },
        toAsciiHex: function () { return $.toAsciiHex(this, true); },
        toThousand: function (delimiter, len) { return this.toString().toThousand(delimiter, len); },
        toChineseNumber: function (isMoney) { return $.numberToChinese(this, isMoney); },
        toDate: function (format) { return this.toString().toDate(format); },
        toDateString: function (format) { return this.toString().toDateString(format); },
        toDateFormat: function (format) { return this.toString().toDateFormat(format); },
        toNumberUnit: function (num, kn, unit, decimalLen, force, space) {
            if (typeof decimalLen === 'boolean') {
                space = force;
                force = decimalLen;
                decimalLen = 2;
            }
            if (typeof decimalLen !== 'number') {
                decimalLen = 2;
            }
            force = $.isBoolean(force, false);
            space = $.isBoolean(space, true);

            unit = (space ? ' ' : '') + ('' + (unit || '')).trim();
            var m = parseInt(num / kn, 10);
            var n = (num % kn / kn).round(decimalLen);
            return (force ? (m + n) : m) > 0 ? (m + n).round(decimalLen) + unit : num + (unit === 'KB' ? 'bytes' : '');
        },
        toFileSize: function (decimalLen, space, force) {
            if (typeof decimalLen === 'boolean') {
                force = space;
                space = decimalLen;
                decimalLen = 2;
            }
            var kb = 1024, mb = 1024 * 1024, gb = 1024 * 1024 * 1024, num = this;
            if (num >= gb) {
                return num.toNumberUnit(num, gb, 'GB', decimalLen, false, space);
            } else if (num >= mb) {
                return num.toNumberUnit(num, mb, 'MB', decimalLen, false, space);
            } else if (num >= kb) {
                return num.toNumberUnit(num, kb, 'KB', decimalLen, false, space);
            } else if (num < kb) {
                return num.toNumberUnit(num, kb, 'KB', decimalLen, $.isBoolean(force, true), space);
            }
            return '';
        },
        join: function () {
            return this.toString();
        },
        toTimeData: function (secondDecimalLen, hideDays) {
            if (!$.isNumber(secondDecimalLen) || secondDecimalLen <= 0) {
                secondDecimalLen = 0;
            }
            var seconds = this,
                d = parseInt(seconds / 86400, 10),
                h = parseInt((seconds - d * 86400) / 3600, 10),
                m = parseInt((seconds - d * 86400 - h * 3600) / 60, 10),
                s = (seconds % 60).round(secondDecimalLen);
            if (hideDays) {
                h += d * 24;
                d = 0;
            }
            return { days: d, hours: h, minutes: m, seconds: s, d: d, h: h, m: m, s: s };
        },
        toTimeStr: function (secondDecimalLen, daysUnit) {
            var seconds = this,
                data = seconds.toTimeData(secondDecimalLen),
                time = [
                    data.h.padLeft(2),
                    data.m.padLeft(2),
                    data.s.padLeft(2)
                ];
            return (data.d ? data.d + (daysUnit || '天') + ' ' : '') + time.join(':');
        },
        toDurationStr: function(hideDays, units) {
            var seconds = this,
                data = seconds.toTimeData(0, hideDays),
                time = [
                    data.d,
                    data.h,
                    data.m,
                    data.s
                ],
                html = [],
                unit = units || ['天', '小时', '分钟', '秒'];

            for(var i = 0; i < time.length; i++) {
                if (time[i]) {
                    html.push(time[i] + unit[i]);
                }
            }
            return html.join('');
        },
        formatTo: function (fmt) {
            fmt = (!$.isString(fmt, true) ? '{0}' : fmt).trim();
            if (!fmt.startsWith('{') || !fmt.endWith('}')) {
                return this.toString();
            }
            //这里转换成浮点数的原因是this的数据类型是object, 而不是number
            return fmt.format(parseFloat(this, 10));
        },
        checkNumber: function (min, max) {
            return $.checkNumber(this, min, max);
        },
        check: function (min, max) {
            return this.checkNumber(min, max);
        },
        setNumber: function (min, max) {
            var n = this;
            return n = $.setNumber(n, min, max);
        },
        set: function (min, max) {
            return this.setNumber(min, max);
        }
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
            } else if (['tl', 'tms'].indexOf(formatString) >= 0) {
                formatString = 'yyyy-MM-dd HH:mm:ss.fff';
            } else if (['log'].indexOf(formatString) >= 0) {
                formatString = 'yyyyMMddHHmmss.fff';
            } else if (['utc', 'UTC'].indexOf(formatString) >= 0) {
                formatString = 'yyyy-MM-ddTHH:mm:ss.fffZ';
            }
            var p = /([y]+|[M]+|[d]+|[H]+|[s]+|[f]+)/gi,
                y = year + (year < 1900 ? 1900 : 0), M = t.getMonth() + 1, d = t.getDate(),
                H = t.getHours(), h = H > 12 ? H - 12 : H === 0 ? 12 : H,
                m = t.getMinutes(), s = t.getSeconds(), f = t.getMilliseconds(),
                d = {
                    yyyy: y, yy: y % 100, M: M, d: d, H: H, h: h, m: m, s: s, MM: M.padLeft(2), dd: d.padLeft(2),
                    HH: H.padLeft(2), mm: m.padLeft(2), ss: s.padLeft(2), hh: h.padLeft(2), fff: f.padLeft(3),
                };
            //return (formatString || 'yyyy-MM-dd HH:mm:ss').replace(p, '{$1}').format(d);
            //不采用string.prototype.format，直接获取固定的格式
            return (formatString || 'yyyy-MM-dd HH:mm:ss').replace(p, function (matches) {
                return d[matches];
            });
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
        },
        isDate: function () {            
            if (isNaN(this.getFullYear())) {
                return false;
            }
            return true;
        },
        getAge: function (dtNow) {
            if (!dtNow || typeof dtNow.isDate === 'undefined' || !dtNow.isDate()) {
                dtNow = new Date();
            }
            var age = dtNow.getFullYear() - this.getFullYear();
            var m1 = dtNow.getMonth(), m2 = this.getMonth(),
                d1 = dtNow.getDate(), d2 = this.getDate();

            //周岁算法：每过一个生日就长一岁
            if (m1 <= m2 && d1 <= d2) {
                age -= 1;
            }
            return age;
        },
        getMonthStart: function () { return $.getMonthStart(this); },
        getMonthEnd: function () { return $.getMonthEnd(this); },
        getDayStart: function () { return $.getDayStart(this); },
        getDayEnd: function () { return $.getDayEnd(this); },
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
            var add = function (v, type) {
                //先除以10000，将ticks换算回毫秒
                return Date.timeTick(Date.addTick(this.ticks / 10000, v, type));
            },
                show = function (formatString, hideMilliseconds) {
                    var s = this, fs = formatString, hide = hideMilliseconds;
                    if (typeof hide === 'undefined' && typeof fs === 'boolean') {
                        hide = fs, fs = '';
                    }
                    if (typeof fs !== 'string' || ['en', 'cn', 'time'].indexOf(fs) >= 0) {
                        //\u5929 天, \u5c0f\u65f6 小时, \u5206\u949f 分钟, \u79d2 秒, \u6beb\u79d2 毫秒
                        var a = ['{days}\u5929', '{hours}\u5c0f\u65f6', '{minutes}\u5206\u949f', '{seconds}\u79d2', '{milliseconds}\u6beb\u79d2'],
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

            if (tick === 0) {
                return {
                    totalDays: 0, totalHours: 0, totalMinutes: 0, totalSeconds: 0, totalMilliseconds: 0,
                    ticks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0,
                    add: add, show: show
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
                ticks: tick * 10000,     //时间最小刻度单位为秒的一千万分之一(即毫秒的万分之一),
                add: add,
                show: show
            };
            ts.days = parseInt(ts.totalDays, 10);
            ts.hours = parseInt((ms -= ts.days * ds.d) / ds.h, 10);
            ts.minutes = parseInt((ms -= ts.hours * ds.h) / ds.m, 10);
            ts.seconds = parseInt((ms -= ts.minutes * ds.m), 10);
            ts.milliseconds = ((ms -= ts.seconds) * ds.s).round();

            return ts;
        },
        timeSpan: function (dt1, dt2) {
            return dt1.timeSpan(dt2);
        },
        isLeapYear: $.isLeapYear,
        getDays: $.getDays
    }, 'Date');
}(OUI);

// String.prototype.format
!function ($) {
    'use strict';

    var throwError = function (msg, str, args) {
        console.log('[FormatError]\r\nerr:', msg);
        try {
            if (!$.isUndefined(str)) { console.log('str:', str, '\r\narg:', args); } console.trace();
        } catch (e) { }
        if ($.formatThrowError) {
            throw new Error(msg);
        }
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
    }, formatNumberSwitch = function (v, f, n, dn, err, str, args, freedom) {
        //console.log('v: ', v, ', f: ', f, ',is: ', (isHexNumber(v) && fu !== 'X'), ', n: ', n);
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
                    throwError(err[3], str, args);
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
            case 'R':   //TODO:            
                break;
            case 'B':   //二进制
            case 'O':   //八进制
            case 'X':   //十六进制显示
                //无符号右移运算，移动位数为0，可以将32位有符号整数转换为32位无符号整数。
                var radix = fu === 'O' ? 8 : fu === 'B' ? 2 : 16;
                v = (parseInt(v, 10) >>> 0).toString(radix).toUpperCase().padLeft(n);
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
                    //v = nv + (pos < len ? symbol + vc.substr(pos) : '');
                    v = nv;
                    if (pos < len) {
                        var spare = vc.substr(pos),
                            slen = spare.length,
                            cv = parseInt(slen / pn, 10),
                            p = 0;
                        if (freedom && (slen % pn) < parseInt(pn / 2, 10)) {
                            cv -= 1;
                        }
                        for (var i = 0; i < cv; i++) {
                            v += symbol + spare.substr(p, pn);
                            p += pn;
                        }
                        v += (p < slen ? symbol + spare.substr(p) : '')
                    }
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
            var p1 = /([BCDEFGNOPRSX%\-\.\:])/gi,
                p2 = /([A-Z])/gi,
                //最后以(.或-)结尾的表示可以优化截取
                p3 = /^([BCDEFGNOPRSX%\-\.\:][\d]+[\.\-]?)$/gi,
                p4 = /^([A-Z]{1}[\d]+)$/gi;
            if ((ss.length === 1 && p1.test(ss)) || (ss.length >= 2 && p3.test(ss))) {
                var nv = parseInt(ss.substr(1), 10), dn = v.toString().split('.'), n = isNaN(nv) ? (f.toUpperCase() === 'D' ? 0 : 2) : nv;
                //如果分隔规则以.结果，表示可以优化分隔最后一组内容，不至于出现单吊的内容
                //比如 1234 1234 5 这样的，可以优化为 1234 12345
                v = formatNumberSwitch(v, f, n, dn, err, str, args, ss.endsWith('.') || ss.endWith('-'));
            } else if ((ss.length === 1 && p2.test(ss)) || (ss.length >= 2 && p4.test(ss))) {
                throwError(err[3], str, args);
            } else if (/([0]+)/g.test(ss)) {
                var nv = Math.round(v, 10), arv = ss.split(''), arn = nv.toString().split('');
                v = formatNumberZero(arv, arn);
            } else {
                v = ss;
            }
        }
        return v;
    }, distillObjVal = function (key, obj, err, str, vals) {
        //对象关键字允许嵌套和多字段容错
        //示例：
        //var str ="val={val}"; console.log(str.format({val:123}));
        //var str ="val={data.val}"; console.log(str.format({data:{val:123}}));
        //var str ="id={data>id,code}"; console.log(str.format({data:{code:"abc"}}));

        var v;
        if (!$.isUndefined(obj[key])) {
            v = obj[key];
        }/* else if (key.indexOf('.') > 0 || key.indexOf('|') > 0) {
            //嵌套对象，格式: obj.key.key|dv(默认值，因某些key可能不存在或允许为空)
            var arr = key.split('|'), dv = arr[1], ks = arr[0].split('.'), o = obj;
            //console.log('o: ', o, ', ks: ', ks, ', dv: ', dv);
            for (var i in ks) {
                if ($.isObject(o)) {
                    o = o[ks[i]], v = o;
                }
                if ($.isUndefined(o)) {
                    v = !$.isUndefined(dv) ? dv : throwError(err, str, vals);
                }
            }
        }*/ else if (key.split(/[\.,\|]/).length > 1) {
            //嵌套对象，格式: obj.key.key|dv(默认值，因某些key可能不存在或允许为空)
            var arr = key.split(/[\|]/), dv = arr[1], ks = arr[0].split(/[\.>]/), o = obj;
            for (var i in ks) {
                var s = ks[i].trim();
                if ('' === s) {
                    continue;
                }
                //分割多字段容错
                var ts = s.split(/[,;]/);
                if (ts.length <= 1) {
                    if ($.isObject(o)) {
                        o = o[ks[i].trim()], v = o;
                    }
                } else {
                    //多字段模式
                    for (var j in ts) {
                        var k = ts[j].trim();
                        //依次匹配各个字段
                        if ($.isObject(o) && !$.isUndefined(o[k])) {
                            v = o[k];
                            o = $.isObject(v) ? v : null;
                        }
                    }
                }
                if ($.isUndefined(v)) {
                    //如果没有匹配到目标值，则采用默认值，若无默认值则抛出异常
                    v = !$.isUndefined(dv) ? dv : throwError(err, str, vals);
                }
            }
        } else {
            throwError(err, str, vals);
        }
        //如果最终获取到的是对象，则采用默认值，若无默认值则抛出异常
        return $.isObject(v) ? !$.isUndefined(dv) ? dv : throwError(err, str, vals) : v;
    };

    if ($.isUndefined(String.prototype.format)) {
        $.formatThrowError = true;

        String.prototype.formatError = function (isThrow) {
            var err = $.isBoolean(isThrow, true);
            $.formatThrowError = err;
            return this;
        };

        String.prototype.format = function (args) {
            var s = this, vals = [], rst = [], pattern = /({|})/g, ms = s.match(pattern);
            if ($.isNull(ms)) {
                return s.toString() || s;
            }
            var err = [
                //输入字符串的格式不正确。
                '\u8f93\u5165\u5b57\u7b26\u4e32\u7684\u683c\u5f0f\u4e0d\u6b63\u786e\u3002',
                //索引(从零开始)必须大于或等于零，且小于参数列表的大小。
                '\u7d22\u5f15\u0028\u4ece\u96f6\u5f00\u59cb\u0029\u5fc5\u987b\u5927\u4e8e\u6216\u7b49\u4e8e\u96f6\uff0c\u4e14\u5c0f\u4e8e\u53c2\u6570\u5217\u8868\u7684\u5927\u5c0f\u3002',
                //值不能为null（或undefined）。
                '\u503c\u4e0d\u80fd\u4e3a\u006e\u0075\u006c\u006c\uff08\u6216\u0075\u006e\u0064\u0065\u0066\u0069\u006e\u0065\u0064\uff09\u3002',
                //格式说明符无效。
                '\u683c\u5f0f\u8bf4\u660e\u7b26\u65e0\u6548\u3002'
            ];

            if (arguments.length > 1) {
                for (var i = 0, c = arguments.length; i < c; i++) {
                    if (!$.isNullOrUndefined(arguments[i])) {
                        vals.push(arguments[i]);
                    } else {
                        //\u7b2c 第
                        //\u4e2a\u53c2\u6570\u503c\u4e3a\uff1a 个参数值为：
                        var er = err[2] + '\u7b2c' + (i + 1) + '\u4e2a\u53c2\u6570\u503c\u4e3a\uff1a' + arguments[i];
                        throwError(err, s, args);
                    }
                }
            } else if ($.isArray(args)) {
                vals = args;
            } else if (!$.isNullOrUndefined(args)) {
                vals.push(args);
            }
            if (ms.length % 2 !== 0) {
                throwError(err[0], s, vals);
            }
            //匹配提取{}的正则
            //var matchs = s.match(/({+[-\d]+(:[\D\d]*?)*?}+)|({+([\D]*?|[:\d]*?)}+)|([{]{1,2}[\w]*?)|([\w]*?[}]{1,2})/g);
            var matchs = s.match(/({+[-\d]+(:[\D\d]*?)*?}+)|({+([\D]*?|[:\d]*?)}+)|({+([\w\.>\-,;\|\d]*?)}+)|([{]{1,2}[\w]*?)|([\w]*?[}]{1,2})/g);
            if (null === matchs) {
                return s.toString() || s;
            }
            //var len = vals.length, mc = matchs.length, isObject = $.isObject(vals[0]), obj = isObject ? vals[0] : {};
            var len = vals.length,
                mc = matchs.length,
                //若没有传递参数，则取window对象作为参数(对象)
                obj = len === 0 ? window : $.isObject(vals[0]) ? vals[0] : {},
                isObject = $.isObject(obj),
                isUrl = $.PATTERN.UrlParam.test(s),
                urlParamSymbolPattern = /[&#]/g;

            for (var i = 0; i < mc; i++) {
                var m = matchs[i], mv = m.replace(pattern, ''), p = s.indexOf(m), idx = parseInt(mv, 10);
                var c = /{/g.test(m) ? m.match(/{/g).length : 0, d = /}/g.test(m) ? m.match(/}/g).length : 0;
                if ((c + d) % 2 != 0) {
                    throwError(err[0], s, vals);
                }
                var m2 = m.replace(/{{/g, '{').replace(/}}/g, '}');
                var odd = c % 2 != 0 || d % 2 != 0, single = c <= 2 && d <= 2;

                if (!isNaN(idx)) {
                    var v = formatNumber(mv, vals[idx], err, s, vals);
                    if ($.isBoolean(v) && !v) {
                        return false;
                    }
                    if (isUrl && urlParamSymbolPattern.test(v)) {
                        console.log('value: ', v);
                        v = encodeURIComponent(v);
                        console.log('value encode: ', v);
                    }
                    if (/^-\d$/g.test(mv) && odd) { throwError(err[0], s, vals); }
                    else if (idx >= len) { throwError(err[1], s, vals); }
                    else if ($.isNullOrUndefined(v)) { throwError(err[2], s, vals); }

                    rst.push(s.substr(0, p) + (c > 1 || d > 1 ? (c % 2 != 0 || d % 2 != 0 ? m2.replace('{' + idx + '}', v) : m2) : v));
                } else if (odd) {
                    if (c === 1 && d === 1) {
                        if (!isObject || !single) {
                            throwError(err[0], s, vals);
                        }
                        v = distillObjVal(mv, obj, err[0], s, vals);
                        if (isUrl && urlParamSymbolPattern.test(v)) {
                            console.log('value: ', v);
                            v = encodeURIComponent(v);
                            console.log('value encode: ', v);
                        }
                        rst.push(s.substr(0, p) + (c > 1 || d > 1 ? (c % 2 !== 0 || d % 2 !== 0 ? m2.replace('{' + idx + '}', v) : m2) : v));
                    } else {
                        var mcs = m2.match(/({[\w\.>\-,;\|\d]+})/g);
                        if (mcs != null && mcs.length > 0) {
                            rst.push(s.substr(0, p) + m2.replace(mcs[0], distillObjVal(mcs[0].replace(/({|})/g, ''), obj, err[0], s)));
                        } else {
                            throwError(err[0], s, vals);
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

    String.prototype.formatTo = function (fmt) {
        fmt = (!$.isString(fmt, true) ? '{0}' : fmt).trim();
        if (!fmt.startsWith('{') || !fmt.endWith('}')) {
            return this;
        }
        return fmt.format(this);
    };

    //String.format
    String.format = String.format || function (s) {
        if ($.isString(s)) {
            var a = [], c = arguments.length;
            for (var i = 1; i < c; i++) {
                a.push(arguments[i]);
            }
            return s.format(a);
        }
        throwError((typeof o) + '.format is not a function');
    };
}(OUI);

// WEB
!function ($) {
    'use strict';

    var rnothtmlwhite = (/[^\x20\t\r\n\f]+/g);
    var isAttributeValue = function (value) {
        return $.isString(value) || $.isNumber(value);
    };

    var win = function () { try { return window } catch (e) { return null } }(),
        doc = function () { try { return document } catch (e) { return null } }(),
        docElem = function () { try { return document.documentElement } catch (e) { return null } }(),
        head = doc ? doc.getElementsByTagName('head')[0] : null,
        redirect = function (url) {
            $.isString(url, true) ? location.href = url : null;
        },
        isBody = function (body) {
            return body &&
                body.nodeType === 1 &&
                body.nodeName === 'BODY' &&
                body.tagName === 'BODY';
        },
        isDocument = function (doc) {
            return doc &&
                //typeof doc === 'object' &&
                doc.nodeType === 9 &&
                doc.nodeName === '#document' &&
                typeof doc.body === 'object' &&
                typeof doc.tagName === 'undefined' &&
                doc.nodeValue === null &&
                doc.rootElement === null &&
                doc.ownerDocument === null;
        },
        isWindow = function (win) {
            return win &&
                //typeof win === 'object' &&
                win === win.window &&
                isDocument(win.document);
        },
        isElement = function (elem, tagName) {
            var isElem = elem &&
                //typeof elem === 'object' &&
                elem.nodeType === 1 &&
                typeof elem.nodeName === 'string' &&
                typeof elem.tagName === 'string';
            return isElem && ($.isString(tagName, true) ? elem.tagName === tagName : isElem);
        },
        toElement = function (elem) {
            if ($.isString(elem, true)) {
                return document.getElementById(elem.replace(/^[#]+/, ''));
            }
            return elem;
        },
        isChildNode = function (parent, elem, recursion) {
            if (!$.isElement(parent) || !$.isElement(elem)) {
                return false;
            }
            if (!recursion) {
                return elem.parentNode === parent;
            }
            var pNode = elem.parentNode;
            while (pNode) {
                if (pNode === parent) {
                    return true;
                }
                pNode = pNode.parentNode;
            }
            return false;
        },
        isForm = function (form) {
            return isElement(form) &&
                form.nodeName === 'FORM' &&
                form.tagName === 'FORM';
        },
        isDisplay = function (elem, recursion) {
            if (!isElement(elem = toElement(elem))) {
                return false;
            }
            if (!$.isBoolean(recursion, true)) {
                return elem.style.display !== 'none';
            }
            var show = true;
            while (isElement(elem)) {
                if (elem.style.display === 'none') {
                    return false;
                }
                elem = elem.parentNode;
            }
            return show;
        },
        isStyleUnit = function (val, units) {
            if ($.isNumber(val) || isNaN(parseFloat(val, 10))) {
                return false;
            }
            var s = ('' + val).toLowerCase();
            var arr = units || ['px', '%', 'em', 'rem', 'pt'];
            for (var i in arr) {
                if (s.endsWith(arr[i])) {
                    return true;
                }
            }
            return false;
        },
        isNumberSize = function (val) {
            if (isNaN(parseFloat(val, 10))) {
                return false;
            }
            return !('' + val).endsWith('%');
        },
        getLocationPath = function () {
            if (typeof location === 'undefined') {
                return '';
            }
            return location.href.substring(0, location.href.lastIndexOf('/') + 1);
        },
        getFilePath = function (fullPath, currentPath) {
            var pos = fullPath.lastIndexOf('/'),
            	prefix = currentPath || getLocationPath();
            if (pos >= 0) {
                var path = fullPath.substr(0, pos + 1);
                //如果文件路径和当前页面处于同一目录层级，则不需要目录
                if (prefix && path.indexOf(prefix) === 0) {
                    path = path.substr(prefix.length);
                }
                return path;
            }
            return '';
        },
        getFileName = function (filePath, withoutExtension) {
            if (!filePath || typeof filePath !== 'string') {
                return '';
            }
            var path = filePath.replace(/(\\)/g, '/').split('?')[0],
                p = path.lastIndexOf('/'),
                name = p >= 0 ? path.substr(p + 1) : path;
            
            if (withoutExtension) {
                var pattern = /(\.tar)\.[a-z0-9]{0,}$/i;
                if (pattern.test(name)) {
                    return name.replace(pattern, '');
                }
                var pos = name.lastIndexOf('.');
                return pos >= 0 ? name.substr(0, pos) : name;
            }
            return name;
        },
        getFullPath = function(filePath, hideHost) {
        	var path = filePath.split('?')[0];
        	if (hideHost) {
        		path = path.replace(/^(http|https)(:\/\/)/i, '');
        		path = path.substr(path.indexOf('/'));
        	}
        	return path;
        },
        getFileDir = function (filePath, showName) {
        	var path = filePath.split('?')[0];
        	path = path.replace(/^(http|https)(:\/\/)/i, '');
        	var pos0 = path.indexOf('/'),
        		pos1 = path.lastIndexOf('/');
        	if (pos0 >= 0 && pos1 >= 0) {
        		return showName ? path.substr(pos0) : path.substr(pos0, pos1 - pos0 + 1);
        	}
        	return showName ? path : '';
        },
        getFileDirName = function (filePath) {
        	return getFileDir(filePath, true);
        },
        getExtension = function (filePath) {
            var name = getFileName(filePath, false);
            if (!name) {
                return '';
            }
            var pos = name.lastIndexOf('.'), pattern = /((\.tar)\.[a-z0-9]{0,})$/i;
            if (pos < 0) {
                return '';
            }
            if (pattern.test(name)) {
                return name.match(pattern)[0];
            }
            return name.substr(pos);            
        },
        //获取远程文件大小(不能跨域)
        getFileSize = function (fileUrl, callback) {
            try {
                if (!fileUrl) {
                    if ($.isFunction(callback)) {
                        callback(-1);
                    }
                    return this;
                }
                var host = $.getUrlHost(location.href, true),
                    url = fileUrl.trim();
                //目前只能获取相同域的文件大小
                if (url.toLowerCase().startWith('http') && !url.startWith(host)) {
                    return -1;
                }
                var xhr = new XMLHttpRequest();
                //异步方式
                xhr.open('HEAD', url, true);
                xhr.onreadystatechange = function () {
                    var size = -1;
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            size = xhr.getResponseHeader('Content-Length');
                            size = parseInt(size, 10);
                        } else {
                            //获取文件信息失败
                            console.log('getFileSize: ', 'ERROR');
                        }
                    }
                    console.log('getFileSize: ', url, size);
                    if ($.isFunction(callback)) {
                        callback(size);
                    }
                };
                xhr.send(null);
            } catch (e) {
                if ($.isFunction(callback)) {
                    callback(-1);
                }
            }
            return this;
        },
        addNamePostfix = function (filePath, postfix) {
            if (!$.isString(filePath)) {
                return filePath;
            }
            if (filePath.lastIndexOf('.') < 0) {
                return filePath + postfix;
            } else {
                var ext = getExtension(filePath), len = ext.length;
                return filePath.substr(0, filePath.length - len) + postfix + ext;
            }
        },
        checkFilePath = function (filePath) {
            if (!$.isString(filePath) || '' === filePath.trim()) {
                return filePath;
            }
            var tmp = filePath.toLowerCase();
            if (tmp.startWith('http://')) {
                return filePath.substr(0, 7) + filePath.substr(7).replace(/[\/]{2,}/g, '/');
            } else if (tmp.startWith('https://')) {
                return filePath.substr(0, 8) + filePath.substr(8).replace(/[\/]{2,}/g, '/');
            } else {
                return filePath.replace(/[\/]{2,}/g, '/');
            }
        },
        createElement = function (nodeName, id, func, parent, options) {
            if ($.isFunction(id)) {
                options = parent, parent = func, func = id, id = null;
            }
            if ($.isUndefined(options) && (($.isObject(parent) && !$.isElement(parent)) || $.isArray(parent))) {
                options = parent;
                parent = undefined;
            }
            if ($.isUndefined(parent) && options) {
                parent = options.parent || undefined;
            }
            var elem = null, hasId = false,
                op = options || {},
                opt = {
                    exempt: op.exempt || false,
                    param: op.param || op,
                    cssText: op.cssText || ''
                };

            id = id || opt.id;

            if ($.isString(id, true)) {
                hasId = true;
                elem = doc.getElementById(id);
                if (elem !== null) {
                    return $.isFunction(func) && func(elem, opt.param), elem;
                }
            }
            elem = doc.createElement(nodeName);

            if (hasId) { elem.id = id; }

            if (!opt.exempt) {
                if ($.isString(parent, true)) {
                    parent = toElement(parent);
                }
                if (!isElement(parent) && !isDocument(parent)) {
                    parent = undefined;
                }
            }

            if (opt.cssText && opt.cssText.indexOf(':') > 0) {
                elem.style.cssText = opt.cssText;
            }
            return parent && parent.appendChild(elem), $.isFunction(func) && func(elem, opt.param), elem;
        },
        createIframe = function (id, func, parent, options) {
            var opt = $.extend({}, options);
            var elem = createElement('IFRAME', id, func, parent, opt);
            elem.width = '100%';
            elem.height = '100%';
            elem.frameBorder = '0';
            elem.scrolling = 'auto';
            return elem;
        },
        loadIframe = function (iframe, url, complete, forceLoad) {
            if ($.isBoolean(complete)) {
                forceLoad = complete;
                complete = null;
            }
            if (!iframe || !url || (iframe.loaded && !forceLoad)) {
                return this;
            }
            iframe.src = $.setQueryString(url);
            iframe.onload = iframe.onreadystatechange = function () {
                if (!this.readyState || this.readyState === 'complete') {
                    if ($.isFunction(complete)) {
                        complete();
                    }
                }
            };
            //设置加载标记，表示iframe已经加载过
            iframe.loaded = true;
            return this;
        },
        getScriptSelfPath = function (relativePath) {
            var elements = doc.getElementsByTagName('script'), len = elements.length, elem = elements[len - 1];
            return (relativePath ? elem.getAttribute('src') : elem.src) || '';
        },
        createJsScript = function (data, id, func, parent) {
            if ($.isFunction(id)) {
                parent = func, func = id, id = null;
            }
            //parent = parent || head;
            //创建到body中而不是head中，是为了便于获取js自身所在的文件路径
            parent = parent || doc.body;
            var elem = createElement('script', id, function (elem) {
                elem.innerHTML = data, setAttribute(elem, { type: 'text/javascript', charset: 'utf-8' }, true);
            }, parent);
            return $.isFunction(func) && func(elem), elem;
        },
        createCssStyle = function (data, id, func, parent) {
            if ($.isFunction(id)) {
                parent = func, func = id, id = null;
            }
            parent = parent || head;
            var elem = createElement('style', id, function (elem) {
                elem.innerHTML = data, setAttribute(elem, { type: 'text/css' }, true);
            }, parent);
            return $.isFunction(func) && func(elem), elem;
        },
        getElementStyle = function (elem, styleName, defaultValue) {
            if (!isElement(elem)) {
                return null;
            }
            var style = elem.currentStyle || document.defaultView.getComputedStyle(elem, null);
            return $.isString(styleName, true) ? $.checkValue(style[styleName], defaultValue) : style;
        },
        getCssSizeVal = function (val) {
            var val = Math.ceil(('' + val).replace(/[^\d\.\-]+/, ''));
            return isNaN(val) ? 0 : val;
        },
        getElementStyleSize = function (elem, styleName) {
            var attr = ('' + styleName).toLowerCase(),
                style = getElementStyle(elem),
                postfix = attr === 'border' ? 'Width' : attr === 'radius' ? 'Radius' : '',
                data = {
                    top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0
                };

            if (!$.isElement(elem)) {
                return data;
            }

            if (!$.isString(attr, true) || !style) {
                return 0;
            }

            if (['padding', 'margin', 'border', 'radius'].indexOf(attr) < 0) {
                return getCssSizeVal(style[attr]);
            }

            data = attr === 'radius' ? {
                topLeft: getCssSizeVal(style['borderTopLeft' + postfix]),
                topRight: getCssSizeVal(style['borderTopRight' + postfix]),
                bottomLeft: getCssSizeVal(style['borderBottomLeft' + postfix]),
                bottomRight: getCssSizeVal(style['borderBottomRight' + postfix]),
            } : {
                top: getCssSizeVal(style[attr + 'Top' + postfix]),
                right: getCssSizeVal(style[attr + 'Right' + postfix]),
                bottom: getCssSizeVal(style[attr + 'Bottom' + postfix]),
                left: getCssSizeVal(style[attr + 'Left' + postfix])
            };
            if (attr !== 'radius') {
                data.height = data.top + data.bottom;
                data.width = data.left + data.right;
            }
            return data;
        },
        checkMinMax = function (p) {
            p.min = parseInt('0' + p.min, 10);
            p.max = parseInt('0' + p.max, 10);
            p.val = parseInt('0' + p.val, 10);

            if (p.min > p.max) {
                var tmp = p.min;
                p.min = p.max;
                p.max = tmp;
            }
            if (p.val < p.min || p.val > p.max) {
                p.val = parseInt((p.min + p.max) / 2, 10);
            }
            return p;
        },
        setCssAttrDefVal = function(attr) {
            var val = { width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 };
            switch(attr) {
            case 'margin':
            case 'padding':
            case 'border':
            case 'radius':
                val[attr + 'Width'] = 0;
                val[attr + 'Height'] = 0;
                break;
            default:
                val = { width: 0, height: 0 };
                break;
            }
            return val;
        },
        getCssAttrSize = function (val, options) {
            if ($.isString(val, true) && val.indexOf(':') < 0 && val.trim().indexOf(' ') < 0) {
                val = $.toElement(val);
            }
            if ($.isString(options, true)) {
                options = { attr: options };
            }
            if ($.isNullOrUndefined(val)) {
                return setCssAttrDefVal($.isObject(options) ? options.attr : '');
            }
            var p = checkMinMax($.extend({
                attr: '',      //margin, padding, border, radius
                unit: '',
                isArray: false,
                isLimit: false,
                min: 0,
                max: 10,
                val: 4
            }, options)),
                isElem = $.isElement(val),
                data = {}, list = [];

            if (['px', 'pt', 'em'].indexOf(('' + p.unit).toLowerCase()) < 0) {
                p.unit = '';
            }
            p.attr = ('' + (p.attr || p.styleName)).toLowerCase();

            if (!p.attr) {
                return null;
            }
            if (p.attr === 'style') {
                return {
                    width: getCssSizeVal(getElementStyle(val, 'width')),
                    height: getCssSizeVal(getElementStyle(val, 'height')),
                    left: getCssSizeVal(getElementStyle(val, 'left')),
                    top: getCssSizeVal(getElementStyle(val, 'top'))
                };
            } else if (['padding', 'margin', 'border', 'radius'].indexOf(p.attr) < 0) {
                var v = isElem ? getElementStyleSize(val, p.attr) : getCssSizeVal(val);
                if (p.unit) {
                    v += p.unit;
                }
                return v;
            }

            if (isElem) {
                data = getElementStyleSize(val, p.attr);
            } else if (typeof val === 'number') {
                data = {
                    top: val, right: val, bottom: val, left: val
                };
            } else if (typeof val === 'string') {
                val = val.trim();
                if (val.indexOf(':') >= 0) {
                    val = val.split(':')[1];
                }
                if (val.indexOf(';') >= 0) {
                    val = val.replace(/[;]/, '');
                }
                val = val.split(/[\s]+/);
            } else if ($.isObject(val)) {
                data = {
                    top: val.top || 0, right: val.right || 0, bottom: val.bottom || 0, left: val.left || 0
                };
            }
            if ($.isArray(val)) {
                data.top = val[0] || 0;
                data.right = val.length >= 2 ? val[1] : data.top;
                data.bottom = val.length >= 3 ? val[2] : data.top;
                data.left = val.length >= 4 ? val[3] : data.right;
            }
            for (var i in data) {
                data[i] = Math.abs(getCssSizeVal(data[i]));
                if (p.isLimit) {
                    data[i] = data[i] > p.max || data[i] < p.min ? p.val : data[i];
                }
                if (p.unit) {
                    data[i] += p.unit;
                }
                if (p.isArray) {
                    list.push(data[i]);
                }
            }
            if (p.isArray) {
                return list;
            }
            if (p.attr !== 'radius') {
                data[p.attr + 'Width'] = getCssSizeVal(data.left) + getCssSizeVal(data.right);
                data[p.attr + 'Height'] = getCssSizeVal(data.top) + getCssSizeVal(data.bottom);
            }

            return p.isArray ? list : data;
        },
        getStyleSize = function (elem, options) {
            return getCssAttrSize(elem, $.extend({}, options, { attr: 'style' }));
        },
        getPaddingSize = function (elem, options) {
            return getCssAttrSize(elem, $.extend({}, options, { attr: 'padding' }));
        },
        getMarginSize = function (elem, options) {
            return getCssAttrSize(elem, $.extend({}, options, { attr: 'margin' }));
        },
        getBorderSize = function (elem, options) {
            return getCssAttrSize(elem, $.extend({}, options, { attr: 'border' }));
        },
        getOffsetSize = function (elem, basic) {
            if (!isElement(elem = $.toElement(elem))) {
                return { width: 0, height: 0, top: 0, left: 0 };
            }
            var par = {
                width: elem.offsetWidth,
                height: elem.offsetHeight,
                left: elem.offsetLeft,
                top: elem.offsetTop
            };

            if ($.isBoolean(basic, false)) {
                return par;
            }

            var computedStyle,
                offsetParent = elem.offsetParent,
                prevOffsetParent = elem,
                doc = elem.ownerDocument,
                docElem = doc.documentElement,
                body = doc.body,
                defaultView = doc.defaultView,
                prevComputedStyle = getElementStyle(elem),
                left = elem.offsetLeft,
                top = elem.offsetTop;

            while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
                if (prevComputedStyle.position === 'fixed') {
                    break;
                }
                computedStyle = getElementStyle(elem);
                top -= elem.scrollTop;
                left -= elem.scrollLeft;

                if (elem === offsetParent) {
                    top += elem.offsetTop;
                    left += elem.offsetLeft;

                    prevOffsetParent = offsetParent;
                    offsetParent = elem.offsetParent;
                }

                if (computedStyle.overflow !== 'visible') {
                    top += parseFloat(computedStyle.borderTopWidth) || 0;
                    left += parseFloat(computedStyle.borderLeftWidth) || 0;
                }
                prevComputedStyle = computedStyle;
            }

            if (prevComputedStyle.position === 'relative' || prevComputedStyle.position === 'static') {
                top += body.offsetTop;
                left += body.offsetLeft;
            }

            if (prevComputedStyle.position === 'fixed') {
                top += Math.max(docElem.scrollTop, body.scrollTop);
                left += Math.max(docElem.scrollLeft, body.scrollLeft);
            }

            return $.extend(par, { left: left, top: top });
        },
        getClientSize = function (elem) {
            return isElement(elem = $.toElement(elem)) ? { width: elem.clientWidth, height: elem.clientHeight } : { width: 0, height: 0 };
        },
        getOuterSize = function (elem) {
            var os = getOffsetSize(elem, true),
                ms = getMarginSize(elem);
            return { width: os.width + ms.width, height: os.height + ms.height };
        },
        getInnerSize = function (elem) {
            var cs = getClientSize(elem),
                ps = getPaddingSize(elem);
            return { width: cs.width - ps.width, height: cs.height - ps.height };
        },
        getScrollSize = function (elem) {
            if (isElement(elem = $.toElement(elem))) {
                return {
                    left: elem.scrollLeft, width: elem.scrollWidth, top: elem.scrollTop, height: elem.scrollHeight,
                };
            }
            return { left: 0, top: 0, width: 0, height: 0 };
        },
        getElementSize = function (elem, basic) {
            var ns = { left: 0, top: 0, width: 0, height: 0 };
            if (!$.isElement(elem = $.toElement(elem))) {
                return {
                    width: 0, height: 0, totalWidth: 0, totalHeight: 0,
                    offsetWidth: 0, offsetHeight: 0, clientWidth: 0, clientHeight: 0,
                    innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0,
                    inner: ns, outer: ns, client: ns, offset: ns,
                    border: ns, padding: ns, margin: ns, scroll: ns, style: ns
                };
            }
            var ps = getPaddingSize(elem),
                ms = getMarginSize(elem),
                bs = getBorderSize(elem),
                os = getOffsetSize(elem),
                cs = getClientSize(elem),
                is = getInnerSize(elem),
                us = getOuterSize(elem),
                ss = getStyleSize(elem),
                rs = getScrollSize(elem),
                par = {
                    offsetWidth: os.width, offsetHeight: os.height,
                    clientWidth: cs.width, clientHeight: cs.height,
                    innerWidth: is.width, innerHeight: is.height,
                    outerWidth: us.width, outerHeight: us.height,
                    totalWidth: us.width, totalHeight: us.height,
                    inner: is, outer: us, client: cs, offset: os,
                    border: bs, padding: ps, margin: ms, scroll: rs, style: ss
                };

            return $.extend(par, os);
        },
        getBodySize = function (isOffset) {
            var doc;
            if (typeof document.compatMode !== 'undefined' && document.compatMode === 'CSS1Compat') {
                doc = document.documentElement;
            } else if (typeof document.body !== 'undefined') {
                doc = document.body;
            }
            if (isOffset) {
                return { width: doc.offsetWidth, height: doc.offsetHeight };
            }
            return { width: doc.clientWidth, height: doc.clientHeight };
        },
        getDocumentSize = function (isOffset) {
            return getBodySize(isOffset);
        },
        getScreenSize = function (avail) {
            var size = avail ? {
                width: screen.availWidth,
                height: screen.availHeight
            } : {
                width: screen.width,
                height: screen.height
            };

            return size;
        },
        isArrayLike = function (obj) {
            if ($.isString(obj)) {
                return false;
            } else if ($.isFunction(obj) || isWindow(obj)) {
                return false;
            }
            var length = !!obj && 'length' in obj && obj.length,
                type = typeof obj;

            return $.isArray(obj) || length === 0 || $.isNumber(length) && length > 0 && (length - 1) in obj;
        },
        merge = function (first, second) {
            var len = second.length,
                j = 0,
                i = first.length;

            for (; j < len; j++) {
                first[i++] = second[j];
            }

            first.length = i;

            return first;
        },
        makeArray = function (likeArray, results) {
            var arr = [];
            try {
                arr = Array.prototype.slice.call(likeArray);
            } catch (e) {
                for (var i = 0; i < likeArray.length; i++) {
                    arr[arr.length] = likeArray[i];
                }
            }
            if ($.isArray(results)) {
                arr = merge(results, arr);
            }
            return arr;
        },
        getAttribute = function (elem, attributes, defaultValue) {
            if ($.isElement(elem = $.toElement(elem))) {
                var val = '', keys = [];
                if ($.isArray(attributes)) {
                    keys = attributes;
                } else {
                    keys = attributes.split(/[,|]/);
                }
                for (var i = 0; i < keys.length; i++) {
                    val = elem.getAttribute(keys[i]);
                    if (typeof val === 'string') {
                        return val;
                    }
                }
                return defaultValue;
            }
            return null;
        },
        setAttribute2 = function (elem, key, val) {
            if (key.toLowerCase() === 'class') {
                $.addClass(elem, val);
            } else {
                elem.setAttribute(key, val);
            }
        },
        setAttribute = function (elem, attributes, exempt, serialize) {
            if ($.isNullOrUndefined(elem)) {
                return this;
            }
            if ($.isString(elem)) {
                elem = $.toElement(elem);
            }
            if ($.isElement(elem)) {
                elem = [elem];
            } else if (isArrayLike(elem)) {
                elem = makeArray(elem);
            } else if (!$.isArray(elem)) {
                elem = [elem];
            }
            for (var i = 0, c = elem.length; i < c; i++) {
                if ($.isBoolean(exempt, false) || $.isElement(elem[i])) {
                    if ($.isObject(attributes)) {
                        for (var key in attributes) {
                            var val = attributes[key];
                            if (serialize && $.isObject(val)) {
                                if ($.isArray(val) || $.isElement(val)) {
                                    elem[i].setAttribute(key, val);
                                } else {
                                    elem[i].setAttribute(key, $.toJsonString(val));
                                }
                            } else {
                                setAttribute2(elem[i], key, val);
                            }
                        }
                    } else if ($.isString(attributes) && isAttributeValue(exempt)) {
                        setAttribute2(elem[i], attributes, exempt);
                    }
                }
            }
            return this;
        },
        removeAttribute = function (elem, attributes, exempt) {
            if ($.isNullOrUndefined(elem)) {
                return this;
            }
            if (isArrayLike(elem)) {
                elem = makeArray(elem);
            } else if (!$.isArray(elem)) {
                elem = [elem];
            }
            for (var i = 0, c = elem.length; i < c; i++) {
                if ($.isBoolean(exempt, false) || $.isElement(elem[i])) {
                    if ($.isObject(attributes)) {
                        for (var key in attributes) {
                            elem[i].removeAttribute(key);
                        }
                    } else if ($.isString(attributes)) {
                        elem[i].removeAttribute(attributes);
                    }
                }
            }
            return this;
        },
        toCssText = function (obj) {
            if ($.isString(obj)) {
                return obj;
            }
            if (!obj || !$.isObject(obj)) {
                return '';
            }
            var cssText = [];
            for (var i in obj) {
                var val = obj[i];
                if ($.isString(val) || $.isNumber(val)) {
                    cssText.push(i + ':' + ('' + val).trim() + ';');
                }
            }
            return cssText.join(' ');
        },
        setStyle = function (elem, styles, value, exempt) {
            if ($.isNullOrUndefined(elem)) {
                return this;
            }
            if (isArrayLike(elem)) {
                elem = makeArray(elem);
            } else if (!$.isArray(elem)) {
                elem = [elem];
            }
            if ($.isBoolean(value)) {
                exempt = value, value = null;
            }
            for (var i = 0, c = elem.length; i < c; i++) {
                if ($.isBoolean(exempt, false) || $.isElement(elem[i])) {
                    if ($.isObject(styles)) {
                        //当同时设置多个样式时，value 可以当成 单位值 来用
                        var unit = '';
                        if ($.isString(value, true)) {
                            value = value.toLowerCase().trim();
                            if (value.in(['px', '%'])) {
                                unit = value;
                            }
                        }
                        for (var key in styles) {
                            elem[i].style[key] = styles[key] + unit;
                        }
                    } else if ($.isString(styles) && isAttributeValue(value)) {
                        elem[i].style[styles] = value;
                    } else if ($.isString(styles)) {
                        elem[i].style.cssText += styles;
                    }
                }
            }
            return this;
        },
        stripAndCollapse = function (value) {
            var tokens = value.match(rnothtmlwhite) || [];
            return tokens.join(' ');
        },
        getClass = function (elem) {
            return elem.getAttribute && elem.getAttribute('class') || '';
        },
        classesToArray = function (value) {
            if ($.isArray(value)) {
                return value;
            }
            if (typeof value === "string") {
                return value.match(rnothtmlwhite) || [];
            }
            return [];
        },
        hasClass = function (elem, selector) {
            var className = ' ' + selector + ' ';
            if (elem.nodeType === 1 && (' ' + stripAndCollapse(getClass(elem)) + ' ').indexOf(className) > -1) {
                return true;
            }
            return false;
        },
        setClassValue = function (cur, css, action) {
            if ('add' === action) {
                if (cur.indexOf(css.space()) < 0) {
                    cur += css + ' ';
                }
            } else if ('remove' === action) {
                while (cur.indexOf(css.space()) > -1) {
                    cur = cur.replace(css.space(), ' ');
                }
            }
            return cur;
        },
        setClass = function (elem, value, action) {
            if ($.isNullOrUndefined(elem)) {
                return this;
            }
            if (isArrayLike(elem)) {
                elem = makeArray(elem);
            } else if (!$.isArray(elem)) {
                elem = [elem];
            }
            for (var i = 0, c = elem.length; i < c; i++) {
                var classes = classesToArray(value), j = 0, curValue, cur, finalValue, css;
                if (classes.length > 0) {
                    curValue = getClass(elem[i]);
                    cur = elem[i].nodeType === 1 && stripAndCollapse(curValue).space();
                    if (cur) {
                        while ((css = classes[j++])) {
                            if ('toggle' === action) {
                                cur = setClassValue(cur, css, hasClass(elem[i], css) ? 'remove' : 'add');
                            } else {
                                cur = setClassValue(cur, css, action);
                            }
                        }
                        finalValue = stripAndCollapse(cur);
                        if (curValue != finalValue) {
                            elem[i].setAttribute('class', finalValue);
                        }
                    }
                }
            }
            return this;
        },
        addClass = function (elem, value) {
            return setClass(elem, value, 'add'), this;
        },
        removeClass = function (elem, value) {
            return setClass(elem, value, 'remove'), this;
        },
        toggleClass = function (elem, value) {
            return setClass(elem, value, 'toggle'), this;
        },
        appendChild = function (parent, elem, isRemove) {
            if ($.isElement(parent) || $.isDocument(parent)) {
                var elems = $.isArray(elem) ? elem : [elem],
                    evName = isRemove ? 'removeChild' : 'appendChild',
                    obj, pObj;
                for (var i in elems) {
                    obj = elems[i], pObj = (obj || {}).parentNode;
                    if (!$.isElement(obj)
                        || (isRemove && pObj !== parent)
                        || (!isRemove && pObj === parent)) {
                        continue;
                    }
                    parent[evName](elems[i]);
                }
            }
            return this;
        },
        removeChild = function (parent, elem) {
            var isRemove = true;
            return appendChild(parent, elem, isRemove);
        },
        removeElement = function (elem) {
            if ($.isNullOrUndefined(elem)) {
                return this;
            }
            if ($.isString(elem, true)) {
                elem = $.toElement(elem);
            }
            if (!$.isElement(elem)) {
                return this;
            }
            var parent = elem.parentNode;
            return removeChild(parent, elem);
        },
        loadStaticFile = function (path, id, callback, parent, nodeName, attributes) {
            if (!$.isString(id, true)) {
                id = nodeName + '-' + getFileName(path, true).replace(/[.]/, '-') + '-' + $.crc.toCRC16(path).toLowerCase();
            }
            var node = doc.getElementById(id), ae = null;
            if (node) {
                return $.isFunction(callback) && callback(), node;
            }
            node = createElement(nodeName, id, function (elem) {
                setAttribute(elem, attributes, true);
            }, parent), ae = node.attachEvent;

            if ($.isFunction(ae) && ae.toString() && ae.toString().indexOf('[native code]') >= 0) {
                node.attachEvent('onreadystatechange', function (ev) { onFileLoad(ev, path); });
            } else {
                node.addEventListener('load', function (ev) { onFileLoad(ev, path); }, false);
            }

            function onFileLoad(ev, path) {
                if (!$.isDebug() && nodeName === 'script') {
                    parent.removeChild(node);
                }
                onCallback();
            }
            function onCallback() { $.isFunction(callback) && callback(); }

            return node;
        },
        loadLinkStyle = function (path, id, callback) {
            if ($.isFunction(id) && !$.isFunction(callback)) {
                callback = id, id = null;
            }
            return loadStaticFile(path, id, callback, head, 'link', {
                type: 'text/css', rel: 'stylesheet', href: $.setQueryString(path)
            });
        },
        loadJsScript = function (path, id, callback, parent) {
            if ($.isFunction(id) && !$.isFunction(callback)) {
                parent = callback, callback = id, id = null;
            }
            //parent = parent || head;
            //这里为什么默认选择body而不是head，是因为有些js会动态加载同名的css文件，而JS需要通过找到最后一个script文件来找到文件名称
            parent = parent || doc.body;
            return loadStaticFile(path, id, callback, parent, 'script', {
                type: 'text/javascript', async: true, src: $.setQueryString(path), charset: 'utf-8'
            });
        },
        removeJsScript = function (id, filePath) {
            if (id) {
                var script = doc.getElementById(id);
                if (script !== null && script.parentNode) {
                    return script.parentNode.removeChild(script), this;
                }
            } else if (filePath) {
                var arr = doc.getElementsByTagName('script'), len = arr.length;
                for (var i = 0; i < len; i++) {
                    var path = arr[i].src.split('?')[0];
                    if (path === filePath) {
                        return arr[i].parentNode.removeChild(arr[i]), this;
                    }
                }
            }
            return this;
        },
        globalEval = function (data) {
            if (data && $.trim(data)) {
                (window.execScript || function (data) {
                    window['eval'].call(window, data);
                })(data);
            }
        },
        parseJSON = function (data) {
            if (data === null) {
                return data;
            }
            if (window.JSON && window.JSON.parse) {
                return window.JSON.parse(data);
            } else if ($.isString(data, true)) {
                return (new Function('return ' + data))();
            }
            $.throwError('Invalid JSON: ' + data);
        },
        isJsonLike = function (data) {
            if (data.startWith('{') && data.endWith('}')) {
                return /[:]/.test(data);
            } else if (data.startWith('[') && data.endWith(']')) {
                return true;
            }
            return false;
        },
        tryParseJSON = function (data) {
            var res = { status: false, complete: false, data: data };
            if (data !== null) {
                try {
                    res.data = parseJSON(data);
                    res.status = true;
                    res.complete = true;
                } catch (e) {
                    try {
                        if ($.isString(data) && isJsonLike(data)) {
                            res.data = eval('(' + data + ')');
                            res.status = true;
                        }
                    } catch (e) { }
                }
            }
            return res;
        },
        parseXML = function (data) {
            if (!$.isString(data, true)) {
                return null;
            }
            try {
                if (window.DOMParser) {
                    xml = new DOMParser().parseFromString(data, 'text/xml');
                } else {
                    xml = new ActiveXObject('Microsoft.XMLDOM');
                    xml.async = 'false';
                    xml.loadXML(data);
                }
            } catch (e) {
                xml = undefined;
            }
            if (!xml || !xml.documentElement || xml.getElementsByTagName('parsererror').length) {
                $.throwError('Invalid XML: ' + data);
            }
            return xml;
        },
        cancelBubble = function (ev, func) {
            if ($.isFunction(ev)) {
                func = ev;
                ev = undefined;
            }
            var e = ev || window.event || arguments.callee.caller.arguments[0];
            if (e.stopPropagation) { e.stopPropagation(); } else { e.cancelBubble = true; }
            if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; }
            if ($.isFunction(func)) {
                func();
            }
            return this;
        },
        addEventListener = function (elem, evName, func, useCapture, isRemove) {
            var elems = $.isArray(elem) ? elem : [elem],
                events = $.isArray(evName) ? evName : [evName],
                name = isRemove ? 'removeEventListener' : 'addEventListener',
                other = isRemove ? 'detachEvent' : 'attachEvent',
                normal = typeof doc.addEventListener !== 'undefined';
            for (var i in events) {
                var evn = events[i];
                if (!$.isString(evn, true)) {
                    continue;
                }
                for (var j in elems) {
                    var o = elems[j];
                    if (($.isElement(o) || $.isDocument(o) || $.isWindow(o)) && $.isFunction(func)) {
                        normal ? o[name](evn, func, useCapture || false) : o[other]('on' + evn, func);
                    }
                }
            }
            return this;
        },
        //键盘按键事件监听  keyCode 可以设置为 keyCode (数字) 如：70, 也可以设置 key（字符）, 如 F
        //可以作为快捷键
        addKeyListener = function (elem, evName, keyCode, func, isShiftKey) {
            if (!$.isDocument(elem) && !$.isElement(elem = $.toElement(elem))) {
                return false;
            }
            if (typeof keyCode === 'function') {
                isShiftKey = func;
                func = keyCode;
                keyCode = undefined;
            }
            isShiftKey = $.isBoolean(isShiftKey, true);
            var evKey = 'keyEvTimes' + keyCode;
            //设置一个变量以记录按键次数
            elem[evKey] = 0;

            var callback = function (ev) {
                var e = ev || event, elem = this;
                if ((isShiftKey && !e.shiftKey) || !$.isFunction(func)) {
                    return false;
                }
                $.cancelBubble(ev);

                if (typeof keyCode === 'undefined') {
                    func(e, ++elem[evKey]);
                } else if (typeof keyCode === 'number' && e.keyCode === keyCode) {
                    console.log('KeyListener: ', e.keyCode);
                    func(e, ++elem[evKey], keyCode, e.key.toUpperCase());
                } else if (typeof keyCode === 'string' && keyCode.toUpperCase().indexOf(e.key.toUpperCase()) > -1) {
                    console.log('KeyListener: ', e.keyCode, e.key, keyCode);
                    func(e, ++elem[evKey], keyCode, e.key.toUpperCase());
                }
            };
            return $.addEventListener(elem, evName, callback), this;
        },
        //键盘或鼠标连击事件监听
        addHitListener = function (elem, evName, keyCode, func, timout, times, isShiftKey) {
            if (!$.isDocument(elem) && !$.isElement(elem = $.toElement(elem))) {
                return false;
            }
            if (typeof keyCode === 'function') {
                isShiftKey = times;
                times = timout;
                timout = func;
                func = keyCode;
                keyCode = undefined;
            }
            isShiftKey = $.isBoolean(isShiftKey, false);

            timout = timout || 3000;
            times = times || 5;

            //设置一个变量以记录按键次数
            var keyCount = evName + (keyCode || '') + 'HitCount',
                keyTimes = evName + (keyCode || '') + 'HitTimes';
            elem[keyCount] = 1;
            elem[keyTimes] = 0;

            var callback = function (ev) {
                var e = ev || event, type = e.type, pass = false;
                if ((isShiftKey && !e.shiftKey) || !$.isFunction(func)) {
                    return false;
                }
                $.cancelBubble(ev);
                if (type.startsWith('key')) {
                    //如果是监听document,则必须在body空白处输入才有效
                    if ($.isDocument(elem)) {
                        if (!$.isBody(e.target)) {
                            return false;
                        }
                    }
                    if (typeof keyCode === 'number' && e.keyCode === keyCode) {
                        pass = true;
                    } else if (typeof keyCode === 'string' && keyCode.toUpperCase().indexOf(e.key.toUpperCase()) > -1) {
                        pass = true;
                    }
                } else if (type.startsWith('mouse') && e.target === elem) {
                    //若是鼠标连击，则必须点击在指定的元素，冒泡的不算
                    //比如指定了某个DIV，则点击DIV中的元素（按钮或链接）无效，必须点击在DIV空白处
                    pass = true;
                }
                if (!pass) {
                    return false;
                }
                var ts = new Date().getTime(), tc = ts - elem[keyTimes];
                if (elem[keyCount] == 1 || (elem[keyCount] > 1 && tc > timout)) {
                    elem[keyCount] = 1;
                    elem[keyTimes] = ts;
                    tc = ts - elem[keyTimes];
                }
                console.log('HitListener: ', evName + (keyCode ? ':' + keyCode : ''), e.keyCode || '', elem[keyCount]);
                if (elem[keyCount] >= times) {
                    try { func(e, elem[keyCount], keyCode, e.key.toUpperCase()); } catch (e) { }
                    elem[keyCount] = 1;
                    elem[keyTimes] = 0;
                    return false;
                }
                elem[keyCount] = tc < timout ? elem[keyCount] + 1 : 1;
            };

            return $.addEventListener(elem, evName, callback), this;
        },
        disableEvent = function (elem, evName, func) {
            if ($.isElement(elem = $.toElement(elem)) && $.isString(evName, true)) {
                if (!evName.startsWith('on')) {
                    evName = 'on' + evName;
                }
                elem[evName] = function (ev) {
                    if ($.isFunction(func)) {
                        func();
                    }
                    return false;
                };
            }
            return this;
        },
        removeEventListener = function (elem, evName, func, useCapture) {
            var isRemove = true;
            return addEventListener(elem, evName, func, useCapture, isRemove);
        },
        bind = function (obj, func, args) {
            return function () {
                return func.apply(obj, args || []);
            };
        },
        bindEventListener = function (obj, func) {
            if (!$.isObject(obj) || !$.isFunction(func)) {
                return false;
            }
            var args = Array.prototype.slice.call(arguments).slice(2);
            return function (ev) {
                return func.apply(obj, [ev || window.event].concat(args));
            };
        },
        setFocus = function (elem) {
            try { return isElement(elem) ? elem.focus() || true : false; } catch (e) { return false; }
        },
        getEvent = function () {
            return window.event || arguments.callee.caller.arguments[0];
        },
        getEventPosition = function (ev, elem) {
            var e = ev || getEvent();
            if (e.pageX || e.pageY) {
                return { x: e.pageX, y: e.pageY };
            }
            return {
                x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
                y: e.clientY + document.body.scrollTop - document.body.clientTop
            };
        },
        getScrollPosition = function () {
            var scrollPos = {};
            if (typeof window.pageYOffset !== 'undefined') {
                scrollPos = { top: window.pageYOffset, left: window.pageXOffset };
            } else if (typeof doc.compatMode !== 'undefined' && doc.compatMode !== 'BackCompat') {
                scrollPos = { top: doc.documentElement.scrollTop, left: doc.documentElement.scrollLeft };
            } else if (typeof doc.body !== 'undefined') {
                scrollPos = { top: doc.body.scrollTop, left: doc.body.scrollLeft };
            }
            return scrollPos;
        },
        scrollTo = function (elem) {
            if ($.isString(elem, true)) {
                elem = $.toElement(elem);
            }
            if (!$.isElement(elem)) {
                return $;
            }
            var parent = elem.parentNode,
                offset = $.getOffset(elem),
                offsetP = $.getOffset(parent),
                posH = offset.top - offsetP.top;

            parent.scrollTop += posH;

            return $;
        },
        getKeyCode = function (ev) {
            var e = ev || window.event;
            return e.keyCode || e.which || e.charCode;
        },
        getKeyChar = function (ev) {
            var keyCode = $.isNumber(ev) ? ev : getKeyCode(ev);
            return String.fromCharCode(keyCode).toUpperCase();
        },
        getContentSize = function (txt, options) {
            if (!$.isObject(options)) {
                options = {};
            }
            var id = options.id || 'div-get-content-size-001',
                css = ';position:absolute;top:-3000px;left:-5000px;',
                div = document.getElementById(id);
            if (!div) {
                div = document.createElement('div');
                div.id = id;
                div.style.cssText = css + 'margin:0;padding:0;font-size:14px;';
                document.body.appendChild(div);
            }
            if ($.isString(options.className, true)) {
                div.className = options.className;
            }
            if ($.isString(options.cssText, true)) {
                div.style.cssText = options.cssText + css;
            }
            div.innerHTML = txt;
            var size = { width: div.offsetWidth, height: div.offsetHeight };
            //return size;
            return div.innerHTML = '', size;
        },
        getInnerText = function (elem) {
            if (typeof elem.innerText === 'string') {
                return elem.innerText;
            } else {
                return elem.textContent;
            }
        },
        isOnElem = function (elem, pos) {
            var offset = getOffsetSize(elem);
            if (pos.x >= offset.left && pos.y >= offset.top
                && pos.x <= (offset.left + offset.width)
                && pos.y <= (offset.top + offset.height)) {
                return true;
            }
            return false;
        },
        isOnElement = function (elem, ev) {
            if (!isElement(elem = toElement(elem))) {
                return false;
            }
            var pos = ev.fromElement ? getEventPosition(ev) : ev,
                isOn = isOnElem(elem, pos);

            if (isOn) {
                return true;
            }

            var childs = elem.childNodes;
            for (var i = 0; i < childs.length; i++) {
                var sub = childs[i];
                if (sub.childNodes.length > 0) {
                    return isOnElement(sub, pos);
                } else if (isOnElem(sub, pos)) {
                    return true;
                }
            }
            return false;
        },
        changeLink = function (aTag, url) {
            if ($.isElement(aTag = toElement(aTag)) && aTag.tagName === 'A' && $.isString(url)) {
                aTag.setAttribute('href', url);
            }
            return $;
        },
        gotoLink = function (url, isTop) {
            if (isTop) {
                window.top.location.href = url;
            } else {
                window.location.href = url;
            }
            return $;
        },
        size = function (elem, key, val) {
            if ($.isUndefined(elem)) {
                return $.isUndefined(val) ? 0 : $;
            }
            var elems = $.isArray(elem) ? elem : [elem];

            if ($.isObject(key)) {
                for (var i = 0; i < elems.length; i++) {
                    var el = toElement(elems[i]);
                    if ($.isElement(el)) {
                        for (var k in key) {
                            var unit = $.isNumeric(key[k]) ? 'px' : '';
                            el.style[k] = key[k] + unit;
                        }
                    }
                }
                return $;
            } else if ($.isUndefined(val)) {
                var el = toElement(elems[0]),
                    es = getElementSize(el);
                return es.outer[key];
            } else {
                var unit = $.isNumeric(val) ? 'px' : '';
                for (var i = 0; i < elems.length; i++) {
                    var el = toElement(elems[i]);
                    if ($.isElement(el)) {
                        el.style[key] = val + unit;
                    }
                }
                return $;
            }
        },
        width = function (elem, val) {
            return size(elem, 'width', val);
        },
        height = function (elem, val) {
            return size(elem, 'height', val);
        },
        toggleDisplay = function (elem, options, func) {
            if (!$.isElement(elem = $.toElement(elem))) {
                return false;
            }
            if ($.isBoolean(options)) {
                options = { show: options };
            } else if ($.isNumber(options)) {
                options = { width: options, size: true };
            } else if ($.isFunction(options)) {
                func = options;
                options = {};
            }
            var opt = $.extend({
                show: undefined,
                size: false,
                width: 0,
                height: 0,
                callback: func
            }, options);

            if (!$.isBoolean(opt.show)) {
                opt.show = elem.style.display === 'none';
            }
            var offset = $.getOffset(elem),
                //w = parseInt('0' + $.getElementStyle(elem, 'width')) || offset.width,
                //h = parseInt('0' + $.getElementStyle(elem, 'height')) || offset.height;
                w = parseInt('0' + $.getElementStyle(elem, 'width')),
                h = parseInt('0' + $.getElementStyle(elem, 'height'));

            if (opt.size) {
                if (w > 0) {
                    elem.widthCache = w;
                }
                if (h > 0) {
                    elem.heightCache = h;
                }
                w = opt.show ? (parseInt('0' + opt.width, 10) || elem.widthCache) : 0;
                h = opt.show ? (parseInt('0' + opt.height, 10) || elem.heightCache) : 0;

                elem.style.width = w + 'px';
                elem.style.height = h + 'px';
            }
            elem.style.display = opt.show ? '' : 'none';

            if (opt.show && w <= 0 && elem.widthCache) {
                elem.style.width = elem.widthCache + 'px';
                elem.style.height = elem.heightCache + 'px';
            }

            var result = { show: opt.show, width: w, height: h };

            if ($.isFunction(opt.callback)) {
                opt.callback(result);
            }

            return result;
        },
        //触发事件，比如触发 window.resize 事件
        trigger = function (elem, evName) {
            if (!$.isString(evName, true)) {
                return this;
            }
            if ($.isString(elem)) {
                elem = $.toElement(elem);
            }
            var isEvent = document.createEvent ? true : false, ev;
            if (document.createEvent) {
                if (evName.toLowerCase().startsWith('on')) {
                    evName = evName.substr(2);
                }
                ev = document.createEvent("HTMLEvents");
                ev.initEvent(evName, true, true);
            } else if (document.createEventObject) {
                if (!evName.toLowerCase().startsWith('on')) {
                    evName = 'on' + evName;
                }
            }
            if ($.isWindow(elem) || $.isDocument(elem) || $.isElement(elem)) {
                if (elem.tagName === 'A' && (evName === 'href' || evName.indexOf('click') > -1)) {
                    elem.click();
                } else {
                    isEvent ? elem['dispatchEvent'](ev) : elem['fireEvent'](evName);
                }
            } else if ($.isArray(elem)) {
                for (var i = 0; i < elem.length; i++) {
                    var e = $.toElement(elem[i]);
                    if ($.isElement(e)) {
                        if (e.tagName === 'A' && (evName === 'href' || evName.indexOf('click') > -1)) {
                            e.click();
                        } else {
                            isEvent ? e['dispatchEvent'](ev) : e['fireEvent'](evName);
                        }
                    }
                }
            }
            return this;
        },
        //禁用浏览器默认右键菜单
        //enable 是否启用默认右键菜单（默认禁用右键菜单）
        //imgDisable 是否禁用图片默认右键菜单（默认允许图片右键菜单，以方便图片下载）
        setContextmenu = function (enable, imgDisable) {
            if (!enable) {
                $(document).contextmenu(function (ev) {
                    if (imgDisable || ev.target.nodeName !== 'IMG') {
                        return false;
                    }
                    return true;
                });
            }
            return this;
        },
        myLoadCache = {},
        //是否首次加载，防止重复调用
        firstLoad = function (key, maxCount) {
            var k = 'loaded-' + key;
            if ($.isObject(key) || $.isArray(key)) {
                k = 'loaded-' + $.crc.toCRC16($.toJsonStr(key));
            }
            if (typeof myLoadCache[k] === 'undefined') {
                myLoadCache[k] = 1;
                return true;
            } else {
                if ($.isNumber(maxCount)) {
                    myLoadCache[k] += 1;
                    return myLoadCache[k] <= maxCount;
                }
                return false;
            }
        },
        findParentElement = function (obj, tagName) {
            var tag = tagName;
            if (!$.isString(tag, true)) {
                return null;
            }
            if ($.isElement(obj)) {
                if (obj.tagName === tag) {
                    return obj;
                }
                var parent = obj.parentNode;
                if (parent !== null) {
                    return parent.tagName === tagName ? parent : findParentElement(parent, tagName);
                }
            }
            return null;
        },
        findRow = function (obj, tagName) {
            return findParentElement(obj, 'TR');
        },
        findCell = function (obj, tagName) {
            return findParentElement(obj, 'TD');
        },
        setCookie = function (name, value, expireMinutes) {
            if (!$.isNumber(expireMinutes) || expireMinutes <= 0) {
                document.cookie = name + '=' + escape(value) + ';';
            } else {
                var dt = new Date();
                dt.setTime(dt.getTime() + (8 * 60 * 60 * 1000) + expireMinutes * 60 * 1000);
                document.cookie = name + "=" + escape(value) + ";expires=" + dt.toGMTString();
            }
            return this;
        },
        getCookie = function (name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$$)"));
            return arr != null ? unescape(arr[2]) : '';
        },
        delCookie = function (name) {
            var dt = new Date();
            dt.setTime(dt.getTime() - 1);
            var val = getCookie(name);
            if (val !== null) {
                document.cookie = name + "=" + val + ";expires=" + dt.toGMTString();
            }
            return this;
        },
        getImgRealSize = function (img, callback) {
            var w = 0, h = 0;
            if (!$.isElement(img = $.toElement(img))) {
                return { width: w, height: h };
            }
            if (!$.isFunction(callback)) {
                callback = function (par) {
                    console.log('getImgRealSize: ', par);
                };
            }
            //HTML5
            if (img.naturalWidth) {
                w = img.naturalWidth;
                h = img.naturalHeight;
                callback({ width: w, height: h });
            } else { // IE6/7/8
                var start_time = new Date().getTime(), load = false;
                img.onerror = function (er) {
                    clearInterval(set);
                    callback({ width: 0, height: 0 });
                };
                img.onload = function (e) {
                    if (!load) {
                        load = true;
                        var duration = new Date().getTime() - start_time;
                        callback({ action: 'onload', duration: duration, width: img.width, height: img.height });
                    }
                };
                var check = function () {
                    if (img.width > 0 || img.height > 0 || load) {
                        clearInterval(set);
                        if (!load) {
                            load = true;
                            var duration = new Date().getTime() - start_time;
                            callback({ action: 'check', duration: duration, width: img.width, height: img.height });
                        }
                    }
                };
                var set = setInterval(check, 5);
            }
            return { width: w, height: h };
        },
        getImgSize = function (img_url, callback) {
            if (!$.isFunction(callback)) {
                callback = function (par) {
                    console.log('getImgSize: ', par);
                };
            }
             var img = new Image();
            img.src = img_url;

            return getImgRealSize(img, callback);
        },
        fillOption = function (elem, value, text) {
            if (!$.isElement(elem = $.toElement(elem)) || !elem.tagName === 'SELECT') {
                return this;
            }
            elem.options.add(new Option($.isValue(text, value), value));
            return this;
        },
        fillOptions = function (elem, list, minVal, maxVal, stepVal, curVal, valUnit) {
            if (!$.isElement(elem = $.toElement(elem)) || !elem.tagName === 'SELECT') {
                return this;
            }
            if ($.isNumber(list)) {
                valUnit = curVal;
                curVal = stepVal;
                stepVal = maxVal;
                maxVal = minVal;
                minVal = list;
                list = null;
            }
            //如果是数组参数，则curVal和valUnit参数位置前移
            else if ($.isArray(list) && $.isUndefined(curVal)) {
                curVal = minVal;
                valUnit = maxVal;
            }
            if ($.isNumber(minVal) && $.isNumber(maxVal)) {
                stepVal = stepVal || 1;
                for (var i = minVal; i <= maxVal; i += stepVal) {
                    elem.options.add(new Option(i + (valUnit || ''), i));
                }
                return this;
            }
            for (var i = 0; i < list.length; i++) {
                var dr = list[i], val = '', txt = '';
                if ($.isArray(dr)) {
                    val = dr[0];
                    txt = $.isNullOrUndefined(dr[1]) ? dr[0] + valUnit : dr[1];
                } else if ($.isObject(dr)) {
                    val = dr.value || dr.val;
                    txt = dr.text || dr.txt;
                } else {
                    val = dr;
                    txt = dr + valUnit;
                }
                elem.options.add(new Option(txt, val));
            }
            if (!$.isNullOrUndefined(curVal)) {
                elem.value = curVal;
            }
            return this;
        },
        buildOption = function (value, text) {
            return '<option value="' + value + '">' + text + '</option>';
        },
        buildOptions = function (list, minVal, maxVal, stepVal, curVal, valUnit) {
            var html = [];
            if ($.isNumber(list)) {
                valUnit = curVal;
                curVal = stepVal;
                stepVal = maxVal;
                maxVal = minVal;
                minVal = list;
                list = null;
            }
            if ($.isNumber(minVal) && $.isNumber(maxVal)) {
                stepVal = stepVal || 1;
                for (var i = minVal; i <= maxVal; i += stepVal) {
                    var selected = curVal === i ? ' selected="selected"' : '';
                    html.push('<option value="' + i + '"' + selected + '>' + i + (valUnit || '') + '</option>');
                }
                return html.join('');
            }
            //如果是数组参数，则curVal和valUnit参数位置前移
            if ($.isArray(list) && $.isUndefined(curVal)) {
                curVal = minVal;
                valUnit = maxVal;
            }
            for (var i = 0; i < list.length; i++) {
                var dr = list[i], val = '', txt = '';
                if ($.isArray(dr)) {
                    val = dr[0];
                    txt = $.isValue(dr[1], dr[0]);
                } else if ($.isObject(dr)) {
                    val = dr.value || dr.val;
                    txt = dr.text || dr.txt;
                } else {
                    val = dr;
                    txt = dr;
                }
                var selected = curVal === val ? ' selected="selected"' : '';
                html.push('<option value="' + val + '"' + selected + '>' + txt + (valUnit || '') + '</option>');
            }
            return html.join('');
        },
        fullScreen = function (elem) {
            if (!$.isDocument(elem) && !$.isElement(elem = $.toElement(elem))) {
                return this;
            }
            var rfs = elem.requestFullScreen || elem.webkitRequestFullScreen || elem.mozRequestFullScreen || elem.msRequestFullScreen;
            if (typeof rfs !== 'undefined' && rfs) {
                return rfs.call(elem), this;
            }
            if (typeof window.ActiveXObject !== 'undefined') {
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript) {
                    wscript.SendKeys("{F11}");
                }
            }
            return this;
        },
        exitFullScreen = function () {
            var elem = document,
                cfs = elem.cancelFullScreen || elem.webkitCancelFullScreen || elem.mozCancelFullScreen || elem.exitFullScreen;

            if (typeof cfs !== 'undefined' && cfs) {
                return cfs.call(elem), this;
            }
            if (typeof window.ActiveXObject !== 'undefined') {
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript != null) {
                    wscript.SendKeys("{F11}");
                }
            }
            return this;
        },
        isFullScreen = function () {
            return (
                document.fullscreen ||
                document.mozFullScreen ||
                document.webkitIsFullScreen ||
                document.webkitFullScreen ||
                document.msFullScreen
            );
        },
        isSubWindow = function() {
            return window.location !== top.window.location;
        },
        isTopWindow = function() {
            return window.location === top.window.location;
        },
        setSelectValue = function(elem, value, append, text) {
            if (!$.isElement(elem = $.toElement(elem))) {
                return this;
            }
            elem.value = value;

            if (append) {
                if (elem.value === value.toString()) {
                    return this;
                }
                elem.options.add(new Option(text || value, value));
                elem.value = value;
            }
            return this;
        },
        removeEmptyLine = function (str) {
            //return str.replace(/[\r\n](\r|\n)*(\s)*(\r|\n)*[\r\n]/g, '\n');
            return str.replace(/[\r\n]+(\s)*[\r\n]+/g, '\n');
        },
        filterHtmlCode = function (str, _removeEmptyLine) {
            str = str.replace(/<\/?[a-z][^>]*>/g, ''); //去除HTML tag
            str = str.replace(/[\s]*\n/g, '\n'); //去除行尾空白
            //去除多余空行
            return _removeEmptyLine ? removeEmptyLine(str) : str;
        },
        // removeEmpty: 是否移除空项，false - 不移除空项，true| - 默认为移除
        splitStr = function (str, pattern, removeEmpty) {
            if (!$.isString(str, true)) {
                return str;
            }
            var arr = str.split(pattern);
            if ($.isBoolean(removeEmpty, true)) {
                var len = arr.length, list = [];
                for (var i = 0; i < len; i++) {
                    if (arr[i]) {
                        list.push(arr[i]);
                    }
                }
                return list;
            }
            return arr;
        },
        encodeHtml = function (str, keys) {
            if (!str || (!$.isString(str, true) && !$.isObject(str))) {
                return str;
            }
            function _encode (s) {
                //if (!s || !/[&<>\s'"]/g.test(s)) {
                if (!s || !/[&<>]/g.test(s)) {
                    return s;
                }
                s = s.replace(/&/g, '&amp;');
                s = s.replace(/</g, '&lt;');
                s = s.replace(/>/g, '&gt;');
                //&#39;会导致asp.net出现dangerous Request.Form异常
                //s = s.replace(/\'/g, '&#39;');
                //s = s.replace(/\"/g, '&quot;');
                //s = s.replace(/ /g, '&nbsp;');
                return s;
            }
            if ($.isString(str)) {
                return _encode(str);
            } else if ($.isObject(str)) {
                if (!$.isArray(keys)) {
                    keys = (keys ? '' + keys : '').splitStr(/[,|]/g);
                }
                var hasKey = keys.length > 0 && keys[0];
                for (var k in str) {
                    if ((!hasKey || keys.indexOf(k) > -1) && $.isString(str[k], true)) {
                        str[k] = _encode(str[k]);
                    }
                }
                return str;
            }
            return str;
        },
        decodeHtml = function (str, keys) {
            if (!str || (!$.isString(str, true) && !$.isObject(str))) {
                return str;
            }
            function _decode (s) {
                if (!s || !/[&;]/g.test(s)) {
                    return s;
                }
                s = s.replace(/&amp;/g, '&');
                s = s.replace(/&lt;/g, '<');
                s = s.replace(/&gt;/g, '>');
                s = s.replace(/&nbsp;/g, ' ');
                s = s.replace(/&#39;/g, '\'');
                s = s.replace(/&quot;/g, '\"');
                return s;
            }
            if ($.isString(str)) {
                return _decode(str);
            } else if ($.isObject(str)) {
                if (!$.isArray(keys)) {
                    keys = (keys ? '' + keys : '').splitStr(/[,|]/g);
                }
                var hasKey = keys.length > 0 && keys[0];
                for (var k in str) {
                    if ((!hasKey || keys.indexOf(k) > -1) && $.isString(str[k], true)) {
                        str[k] = _decode(str[k]);
                    }
                }
                return str;
            }
            return str;
        },
        setImgCenter = function (img) {
            if (!$.isElement(img = $.toElement(img))) {
                return false;
            }
            var parent = img.parentNode;
            var ps = $.getElementSize(parent);

            //TODO:
            //TODO:            

        };

    var browser = {
        ua: function () { try { return navigator.userAgent; } catch (e) { return ''; } },
        isFirefox: function (ua) { return (ua || browser.ua()).indexOf('Firefox') > -1; },
        isEdge: function (ua) { return (ua || browser.ua()).indexOf('Edge') > -1; },
        isOpera: function (ua) { ua = ua || browser.ua(); return ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1; },
        isSafari: function (ua) { ua = ua || browser.ua(); return ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') < 0; },
        isIE: function (ua) { ua = ua || browser.ua(); return ua.indexOf('Trident') > -1 || (ua.indexOf('MSIE') > -1 && ua.indexOf('compatible') > -1); },
        isChrome: function (ua) { ua = ua || browser.ua(); return ua.indexOf('Chrome') > -1 && !browser.isOpera(ua) && !browser.isEdge(ua) && !browser.isSafari(ua); },
        isWap: function (ua) { ua = ua || browser.ua(); return /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(ua); },
        isWechar: function (ua) { ua = ua || browser.ua(); return /MicroMessenger/i.test(ua); },
        isMobile: function (ua) { return browser.isWap(ua); }
    };
    var ua = function () { try { return navigator.userAgent; } catch (e) { return ''; } }(),
        //mc = ua.match(/([A-Z]+)\/([\d\.]+)/ig) || [], ut = mc.join('_').replace(/\//g,''),
        isFirefox = ua.indexOf('Firefox') > -1,
        isEdge = ua.indexOf('Edge') > -1,
        isOpera = ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1,
        isSafari = ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') < 0,
        isChrome = !isOpera && !isEdge && !isSafari && ua.indexOf('Chrome') > -1,
        isIE = ua.indexOf('Trident') > -1 || (ua.indexOf('MSIE') > -1 && ua.indexOf('compatible') > -1),
        isWap = /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(ua),
        isWechar = /MicroMessenger/i.test(ua),
        ieVersion = isIE ? parseFloat('0' + (ua.match(/(MSIE\s|rv:)([\d\.]+)[;]?/) || [])[2], 10) : 0;
    $.extendNative($, {
        isChrome: isChrome,
        isFirefox: isFirefox,
        isOpera: isOpera,
        isSafari: isSafari,
        isIE: isIE, isMSIE: isIE,
        isEdge: isEdge,
        isWap: isWap,
        ieVersion: ieVersion,
        browser: browser,
        keyCode: {
            Esc: 27,
            Tab: 9,
            Space: 32,
            Enter: 13,
            Left: 37,
            Up: 38,
            Right: 39,
            Down: 40
        },
        doc: doc, head: head, redirect: redirect,
        getLocationPath: getLocationPath,
        getScriptSelfPath: getScriptSelfPath,
        getFilePath: getFilePath,
        getFileName: getFileName,
        getFileSize: getFileSize,
        getExtension: getExtension,
        getFullPath: getFullPath,
        getFileDir: getFileDir,
        getFileDirName: getFileDirName,
        addNamePostfix: addNamePostfix,
        checkFilePath: checkFilePath,
        isBody: isBody,
        isDocument: isDocument,
        isWindow: isWindow,
        isElement: isElement,
        toElement: toElement,
        isChildNode: isChildNode,
        isForm: isForm,
        isDisplay: isDisplay,
        isStyleUnit: isStyleUnit,
        isNumberSize: isNumberSize,
        createElement: createElement,
        createIframe: createIframe,
        loadIframe: loadIframe,
        createJsScript: createJsScript,
        createCssStyle: createCssStyle,
        getElementStyle: getElementStyle,
        elemStyle: getElementStyle,
        getCssSizeVal: getCssSizeVal,
        getCssSizeValue: getCssSizeVal,
        toCssSizeVal: getCssSizeVal,
        getElementStyleSize: getElementStyleSize,
        elemStyleSize: getElementStyleSize,
        getCssAttrSize: getCssAttrSize,
        getStyleSize: getStyleSize,
        getPaddingSize: getPaddingSize,
        getMarginSize: getMarginSize,
        getBorderSize: getBorderSize,
        getBodySize: getBodySize,
        getDocumentSize: getDocumentSize,
        getScreenSize: getScreenSize,
        getOffset: getOffsetSize,
        getOffsetSize: getOffsetSize,
        getClientSize: getClientSize,
        getOuterSize: getOuterSize,
        getTotalSize: getOuterSize,
        getInnerSize: getInnerSize,
        getScrollSize: getScrollSize,
        getElementSize: getElementSize,
        elemSize: getElementSize,
        offset: getOffsetSize,
        isArrayLike: isArrayLike,
        merge: merge,
        makeArray: makeArray,
        getAttribute: getAttribute,
        setAttribute: setAttribute,
        removeAttribute: removeAttribute,
        delAttribute: removeAttribute,
        toCssText: toCssText,
        setStyle: setStyle,
        setClass: setClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        getClass: getClass,
        hasClass: hasClass,
        appendChild: appendChild,
        removeChild: removeChild,
        removeElement: removeElement,
        loadLinkStyle: loadLinkStyle,
        loadJsScript: loadJsScript,
        removeJsScript: removeJsScript,
        globalEval: globalEval,
        parseJSON: parseJSON, parseJson: parseJSON,
        isJsonLike: isJsonLike,
        tryParseJSON: tryParseJSON, tryParseJson: tryParseJSON,
        parseXML: parseXML,
        cancelBubble: cancelBubble,
        addEventListener: addEventListener,
        addListener: addEventListener,
        addKeyListener: addKeyListener,
        addHitListener: addHitListener,
        removeEventListener: removeEventListener,
        removeListener: removeEventListener,
        disableEvent: disableEvent,
        disabledEvent: disableEvent,
        bind: bind,
        bindEventListener: bindEventListener,
        setFocus: setFocus,
        getEvent: getEvent,
        getEventPosition: getEventPosition,
        getEventPos: getEventPosition,
        getScrollPosition: getScrollPosition,
        getScrollPos: getScrollPosition,
        scrollTo: scrollTo,
        getKeyCode: getKeyCode,
        getKeyChar: getKeyChar,
        getContentSize: getContentSize,
        getInnerText: getInnerText,
        isOnElement: isOnElement,
        changeLink: changeLink,
        gotoLink: gotoLink,
        gotoUrl: gotoLink,
        size: size,
        width: width,
        w: width,
        height: height,
        h: height,
        toggleDisplay: toggleDisplay,
        trigger: trigger,
        setContextmenu: setContextmenu,
        disableContextmenu: setContextmenu,
        setcmenu: setContextmenu,
        disablecmenu: setContextmenu,
        firstLoad: firstLoad,
        firstload: firstLoad,
        findParentElement: findParentElement,
        findRow: findRow,
        findCell: findCell,
        setCookie: setCookie,
        getCookie: getCookie,
        delCookie: delCookie,
        getImgRealSize: getImgRealSize,
        getImageSize: getImgSize,
        getImgSize: getImgSize,
        getPicSize: getImgSize,
        fillOption: fillOption,
        fillOptions: fillOptions,
        buildOption: buildOption,
        buildOptions: buildOptions,
        fullScreen: fullScreen,
        exitFullScreen: exitFullScreen,
        isFullScreen: isFullScreen,
        isSubWindow: isSubWindow,
        isTopWindow: isTopWindow,
        setSelectValue: setSelectValue,
        splitStr: splitStr,
        removeEmptyLine: removeEmptyLine,
        filterHtmlCode: filterHtmlCode,
        filterHtml: filterHtmlCode,
        encodeHtml: encodeHtml,
        decodeHtml: decodeHtml
    }, '$');
}(OUI);

// window extend
!function ($) {
    'use strict';

    if (typeof window === 'object') {
        var doc = $.doc;

        // matchCondition
        $.extend($, {
            matchCondition: function (elements, options) {
                var list = [], len = elements.length, op = options;
                var parent = op.parent,
                    tagNames = op.tagName,
                    checked = op.checked,
                    disabled = op.disabled,
                    types = op.type || op.types,
                    values = op.value || op.values,
                    attrs = op.attribute || op.attributes || op.attrs,
                    styles = op.style || op.styles;

                if (!$.isUndefined(values)) {
                    if (!$.isArray(values)) {
                        values = ['' + values];
                    } else {
                        //转换为字符串数组
                        values = values.join(',').split(',');
                    }
                }
                var checkParent = $.isElement(parent) || $.isDocument(parent),
                    checkTag = ($.isString(tagNames, true) && tagNames !== '*') || $.isArray(tagNames),
                    checkType = $.isString(types, true) || $.isArray(types),
                    checkValue = $.isArray(values) && !$.isEmpty(values),
                    checkAttr = $.isObject(attrs),
                    checkStyle = $.isObject(styles);

                if (checkTag && !$.isArray(tagNames)) {
                    tagNames = [tagNames];
                }

                if (checkType && !$.isArray(types)) {
                    types = [types];
                }

                for (var i = 0; i < len; i++) {
                    var obj = elements[i], pass = true;
                    if (!pass) { continue; } else if ($.isBoolean(checked)) { pass = obj.checked === checked; }
                    if (!pass) { continue; } else if (checkValue) { pass = values.indexOf(obj.value) >= 0; }
                    if (!pass) { continue; } else if (checkTag) { pass = tagNames.indexOf(obj.tagName) >= 0; }
                    if (!pass) { continue; } else if (checkType) { pass = types.indexOf(obj.type) >= 0; }
                    if (!pass) { continue; } else if ($.isBoolean(disabled)) { pass = obj.disabled === disabled; }
                    if (!pass) { continue; } else if (checkParent) { pass = obj.parentNode === parent; }
                    if (!pass) { continue; } else if (checkAttr) {
                        for (var name in attrs) {
                            if (!pass) { break; }
                            var val = obj.getAttribute(name), con = attrs[name], isBool = $.isBoolean(con);
                            if (name === 'disabled' || name === 'checked') {
                                if (val === null && isBool) {
                                    val = name === 'checked' ? obj.checked : obj.disabled;
                                    pass = val === con;
                                } else if (con === null || con === '' || (isBool && !con)) {
                                    pass = $.isBoolean(val) ? val === con : val === null;
                                } else if (!$.isUndefined(con)) {
                                    pass = val !== null;
                                }
                            } else {
                                pass = val === con;
                            }
                        }
                    }
                    if (!pass) { continue; } else if (checkStyle) {
                        for (var name in styles) {
                            if (!pass) { break; }
                            pass = obj.style[name] === styles[name];
                        }
                    }
                    if (pass) {
                        list.push(obj);
                    }
                }
                return list;
            }
        });

        $.extendNative(window, {
            /*
            $I: function (id, parent) {
                if (typeof id === 'string') {
                    if (id.startsWith('#')) {
                        id = id.substr(1);
                    }
                } else if ($.isElement(id)) {
                    return id;
                }
                return (parent || doc).getElementById(id);
            },
            */
            $I: function (id, parent) {
                if ($.isElement(id)) {
                    return id;
                } else if($.isString(id, true)) {
                    var elem;
                    id = (id.indexOf('#') > -1 ? id.replace(/[#]+/g, '') : id).trim();
                    if ((elem = doc.getElementById(id)) !== null) {
                        return elem;
                    }
                    var ids = id.split(/[,|]/), elems = [], elem;
                    for (var i = 0; i < ids.length; i++) {
                        if (ids[i]) {
                            elems.push(doc.getElementById(ids[i]));
                        }
                    }
                    return elems.length <= 1 ? elems[0] || null : elems;
                }
                return (parent || doc).getElementById(id);
            },
            $Q: function (selectors, parent) {
                return (parent || doc).querySelector(selectors);
            },
            $QA: function (selectors, options, parent) {
                if ($.isElement(options) || $.isDocument(options)) {
                    parent = options, options = null;
                }
                var arr = (parent || doc).querySelectorAll(selectors);
                if (!$.isObject(options) || $.isEmpty(options)) {
                    return arr;
                }
                return $.matchCondition(arr, options);
            },
            //options: { value:[], checked:true, attribute:{}, style:{} }
            //若 options 为 boolean ，则简化为 checked
            $N: function (name, options) {
                var arr = doc.getElementsByName(name), len = arr.length, list = [];
                if ($.isBoolean(options)) {
                    options = { attribute: { checked: options } };
                } else if (!$.isObject(options) || $.isEmpty(options)) {
                    return arr;
                }
                return $.matchCondition(arr, options);
            },
            $T: function (tagName, options, parent) {
                if ($.isElement(options) || $.isDocument(options)) {
                    parent = options, options = null;
                }
                if (tagName !== '*') {
                    var tag = tagName.split(':'), tagName = tag[0];
                }
                var arr = (parent || doc).getElementsByTagName(tagName || '*');
                if (!$.isObject(options) || $.isEmpty(options)) {
                    return arr;
                }
                return $.matchCondition(arr, options);
            },
            $C: function (className, options, parent) {
                if (className.indexOf('.') === 0) {
                    className = className.substr(1);
                }
                if ($.isElement(options) || $.isDocument(options)) {
                    parent = options, options = null;
                }
                var arr = (parent || doc).getElementsByClassName(className);
                if (!$.isObject(options) || $.isEmpty(options)) {
                    return arr;
                }
                return $.matchCondition(arr, options);
            }
        }, 'window');

        var wst = window.setTimeout, wsi = window.setInterval,
            cwst = window.clearTimeout, cwsi = window.clearInterval;
        window.setTimeout = function (func, delay) {
            if ($.isFunction(func)) {
                var args = Array.prototype.slice.call(arguments, 2);
                var f = (function () {
                    func.apply(null, args);
                });
                return wst(f, delay);
            }
            return wst(func, delay);
        };
        window.setInterval = function (func, delay) {
            if ($.isFunction(func)) {
                var args = Array.prototype.slice.call(arguments, 2);
                var f = (function () {
                    func.apply(null, args);
                });
                return wsi(f, delay);
            }
            return wsi(func, delay);
        };
        window.clearTimeout = function (id) {
            if (id) { cwst(id); }
        };
        window.clearInterval = function (id) {
            if (id) { cwsi(id); }
        };

        //获取窗口缩放比例
        window.getZoomRatio = function () {
            var ratio = 0,
                screen = window.screen,
                ua = navigator.userAgent.toLowerCase();

            if (window.devicePixelRatio !== undefined) {
                ratio = window.devicePixelRatio;
            } else if (ua.indexOf('msie')) {
                if (screen.deviceXDPI && screen.logicalXDPI) {
                    ratio = screen.deviceXDPI / screen.logicalXDPI;
                }
            } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
                ratio = window.outerWidth / window.innerWidth;
            }

            if (ratio) {
                ratio = Math.round(ratio * 100);
            }

            return ratio;
        };

        //判断窗口是否缩放
        window.isZoom = function () {
            return window.getZoomRatio() !== 100;
        };
    }
}(OUI);

// utils
!function ($) {
    'use strict';

    var isName = function (selector) {
        return !/[\.\#\[\=]/.test(selector);
    },
        _checked = function (action, obj) {
            if ($.isBoolean(action)) {
                return action;
            } else {
                var checked = false,
                    dic = { cancel: 0, checked: 1, all: 1, reverse: 2 },
                    oper = dic[('' + action).toLowerCase()];

                switch ($.isNumber(oper) ? oper : parseInt(action, 10)) {
                    //Cancel
                    case 0: checked = false; break;
                    //All
                    case 1: checked = true; break;
                    //Reverse
                    case 2: checked = !obj.checked; break;
                    //Restore
                    case 3: checked = $.getAttribute(obj, 'dc') === '1'; break;
                    //Default
                    default: checked = true; break;
                }
                return checked;
            }
        };

    $.extendNative($, {
        setChecked: function (selector, action, values, initial) {
            if ($.isArrayLike(selector)) {
                selector = $.makeArray(selector);
            }
            if ($.isArray(selector)) {
                for (var i = 0, c = selector.length; i < c; i++) {
                    selector[i].checked = _checked(action, selector[i]);
                    if (initial) {
                        selector[i].setAttribute('dc', selector[i].checked ? 1 : 0);
                    }
                }
                return this;
            } else if ($.isElement(selector)) {
                selector.checked = _checked(action, selector);
                if (initial) {
                    selector.setAttribute('dc', selector.checked ? 1 : 0);
                }
                return this;
            }
            var arr = isName(selector) ? $N(selector) : $QA(selector);
            if (arr) {
                if ($.isNumber(values)) {
                    values = values.toString();
                }
                if ($.isString(values)) {
                    values = values.split(/[|,]/);
                }
                if ($.isArray(values)) {
                    if (values.length <= 1) {
                        if (!values[0]) {
                            values = ['no-values-were-set-' + new Date().getTime() % 1000];
                        } else if (values[0] === 'ALL') {
                            values = [];
                        }
                    }
                    arr = $.matchCondition(arr, { values: values });
                }
                for (var i = 0, c = arr.length; i < c; i++) {
                    var obj = arr[i];
                    obj.checked = _checked(action, obj);
                    if (initial) {
                        obj.setAttribute('dc', obj.checked ? 1 : 0);
                    }
                }
            }
            return this;
        },
        setCheckedClass: function (selector, className) {
            var arr = isName(selector) ? $N(selector) : $QA(selector), c = arr.length;
            for (var i = 0; i < c; i++) {
                var obj = arr[i];
                if (obj.checked) {
                    $.addClass(obj.parentNode, className);
                } else {
                    $.removeClass(obj.parentNode, className);
                }
            }
            return this;
        },
        setCheckedCss: function (selector, className) {
            return this.setCheckedClass(selector, className);
        },
        getChecked: function (selector) {
            if (isName(selector)) {
                return $N(selector, { attribute: { checked: true } });
            } else {
                if (!/(\[checked)/gi.test(selector.replace(/[\s]/g, ''))) {
                    selector += '[checked]';
                }
                return $QA(selector);
            }
        },
        isAllChecked: function (selector) {
            var arr = [];
            if (isName(selector)) {
                arr = $N(selector);
            } else {
                arr = $QA(selector);
            }
            if (arr.length <= 0) {
                return false;
            }
            for (var i = 0; i < arr.length; i++) {
                if (!arr[i].checked) {
                    return false;
                }
            }
            return true;
        },
        getCheckedValues: function (selector, options) {
            if (!$.isObject(options)) {
                options = {};
            }
            if ($.isString(options.target, true)) {
                options.target = document.getElementById(options.target);
            }
            if ($.isString(options.parent, true)) {
                options.parent = document.getElementById(options.parent);
            }
            if ($.isString(options.root, true)) {
                options.root = document.getElementById(options.root);
            }
            var elements = $.getChecked(selector),
                len = elements.length,
                values = [],
                hasRoot = options.root && $.isElement(options.root),
                hasParent = options.parent && $.isElement(options.parent),
                hasTarget = options.target && $.isElement(options.target);

            for (var i = 0; i < len; i++) {
                var elem = elements[i];
                if (hasParent && elem.parentNode !== options.parent) {
                    continue;
                } else if (hasRoot && !$.isChildNode(options.root, elem, true)) {
                    continue;
                }
                var val = elem.value;
                values.push(val);
            }
            if (hasTarget) {
                options.target.value = values.join(',');
            }
            return values;
        },
        getCheckedValue: function (selector, options) {
            return this.getCheckedValues(selector, options);
        },
        getCheckedText: function (elem) {
            if (!$.isElement(elem = $.toElement(elem))) {
                return '';
            }
            return obj.options[obj.selectedIndex].text;
        },
        getTextCursorPosition: function (elem) {
            try {
                if (!$.isElement(elem = $.toElement(elem))) {
                    return -1;
                }
                if (elem.selectionStart) {
                    return elem.selectionStart;
                } else {
                    var range = $.doc.selection.createRange();
                    range.moveStart('character', -elem.value.length);
                    return range.text.length;
                }
            } catch (e) {
                if ($.isDebug()) {
                    console.log('getTextCursorPosition: ', e);
                }
            }
            return -1;
        },
        setTextCursorPosition2: function (elem, pos, len) {
            elem.focus();
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else {
                var range = obj.createTextRange();
                if (!$.isNumber(len)) {
                    len = elem.value.length;
                }
                range.moveStart('character', -len);
                range.moveEnd('character', -len);
                range.moveStart('character', pos);
                range.moveEnd('character', 0);
                range.select();
            }
            return this;
        },
        setTextCursorPosition: function (elem, pos) {
            if (!$.isElement(elem = $.toElement(elem))) {
                return false;
            }
            var val = elem.value, len = val.length;
            if (!$.isNumber(pos) || pos > len) {
                pos = len;
            }
            /*
            window.setTimeout(function () {
                $.setTextCursorPosition2(elem, pos, len);
            }, 10);
            */
            $.setTextCursorPosition2(elem, pos, len);
            return this;
        },
        getSelectedText: function (elem) {
            if (!$.isElement(elem = $.toElement(elem))) {
                return '';
            }
            if (elem.selectionStart || elem.selectionStart === '0') {
                return elem.value.substring(elem.selectionStart, elem.selectionEnd);
            } else if (document.selection) {
                obj.focus();
                return document.selection.createRange().text;
            }
            return '';
        },
        checkInputKey: function (ev, codes, excepts, shift) {
            var e = ev || window.event,
                keyCode = $.getKeyCode(e);

            //console.log('checkInputKey: ',keyCode, codes, shift);

            //不允许shift键的情况下，只允许 shift + tab 组合键
            if (!shift && e.shiftKey && keyCode !== 9) {
                return false;
            } else {
                return (codes || []).indexOf(keyCode) >= 0 && (excepts || []).indexOf(keyCode) < 0;
            }
        },
        // 设置输入框内容格式
        // 需要设置输入格式的文本框，默认情况下是不允许空格和特殊字符的
        setInputFormat: function (elements, options) {
            var elems = [], elem, keyTypes = ['char', 'number', 'control', 'symbol'];
            if ($.isArrayLike(elements) || $.isArray(elements)) {
                elems = elements;
            } else if ($.isElement(elements)) {
                elems = [elements];
            } else if ($.isString(elements, true)) {
                elems = [$.toElement(elements)];
            }
            if (!$.isArrayLike(elems) && !$.isArray(elems)) {
                return this;
            }

            var opt = $.extend({
                shift: true,    //是否允许shift键
                space: false,   //是否允许空格
                paste: false,   //是否允许粘贴
                minus: false,   //是否允许减号（负号）
                dot: false,     //是否允许小数点号
                types: keyTypes,
                codes: [],
                excepts: []
            }, options), i, j;

            var types = $.isArray(opt.types) && opt.types.length > 0 ? opt.types : keyTypes,
                excepts = $.isArray(opt.excepts) && opt.excepts.length > 0 ? opt.excepts : [],
                keys = [
                    8,      // backspace
                    9,      // tab
                    13,     // enter
                    108,    // enter
                    37,     // left arrow
                    38,     // up arrow
                    39,     // right arrow
                    40,     // down arrow
                    46,     // delete
                ].concat(opt.codes || []);

            keys = opt.space ? keys.concat([32]) : keys;
            keys = !opt.minus ? keys : keys.concat([109, 189]); //109是小键盘中的减号-
            keys = !opt.dot ? keys : keys.concat([110, 190]); //110是小键盘中的点号.

            // F1-F12功能键
            keys = keys.concat([112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]);

            //console.log('setInputFormat: ', opt, ', all: ', all, ', keys: ', keys);

            for (i = 0; i < types.length; i++) {
                var type = (types[i] || '').toLowerCase();
                if (type === 'char') {
                    // A-Z 键
                    for (j = 65; j <= 90; j++) {
                        keys.push(j);
                    }
                } else if (type === 'number') {
                    // 0-9键
                    keys = keys.concat([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
                    // 0-9键（小键盘）
                    keys = keys.concat([96, 97, 98, 99, 100, 101, 102, 103, 104, 105]);
                } else if (type === 'control') {
                    // ;: =+ ,< -_ .> /? `~
                    keys = keys.concat([opt.space ? 32 : 0, 186, 187, 188, 189, 190, 191, 192]);
                    // [{ \| ]} '"
                    keys = keys.concat([219, 220, 221, 222]);
                } else if (type === 'symbol') {
                    // * + - . / (小键盘)  * + - . /
                    keys = keys.concat([106, 107, 109, 110, 111, 56, 187, 189, 190, 191]);
                }
            }

            for (i = 0; i < elems.length; i++) {
                if (!$.isElement(elem = elems[i])) {
                    continue;
                }
                elem.onkeydown = function(ev) {
                    return $.checkInputKey(ev, keys, excepts, opt.shift);
                };
                if (!opt.paste) {
                    elem.onpaste = function() {
                        return false;
                    };
                }
            }
            console.log('setInputFormat: ');

            return this;
        },
        getElementValue: function (elements, defaultValue, attributeName, func) {
            if ($.isUndefined(defaultValue)) {
                defaultValue = '';
            }
            var elems = ($.isArray(elements) || $.isArrayLike(elements)) ? elements : [elements],
                isAttr = $.isString(attributeName),
                arr = [],
                len = elems.length,
                val = defaultValue,
                elem;
            for (var i = 0; i < len; i++) {
                if ($.isElement(elem = $.toElement(elems[i]))) {
                    val = (isAttr ? elem.getAttribute(attributeName) : elem.value) || defaultValue;
                    arr.push(val);
                }
            }
            if ($.isFunction(func)) {
                return func(len > 1 ? arr : val);
            }
            return len > 1 ? arr : val;
        },
        setElementAttribute: function (elem, value, attributeName) {
            elem = $.toElement(elem);
            if (attributeName === 'value') {
                elem.value = value;
            } else {
                elem.setAttribute(attributeName, value);
            }
            return this;
        },
        setElementValue: function (elements, values, attributeName, sameValue) {
            var isAttribute = $.isString(attributeName);
            if (!$.isString(attributeName)) {
                attributeName = 'value';
            }

            var elems = ($.isArray(elements) || $.isArrayLike(elements)) ? elements : [elements],
                isAttr = $.isString(attributeName),
                len = elems.length,
                vals = !$.isArray(values) ? [values] : values,
                elem;
            for (var i = 0; i < len; i++) {
                if ($.isElement(elem = $.toElement(elems[i]))) {
                    var val = $.isUndefined(vals[i]) ? (sameValue ? vals[0] : '') : vals[i];
                    $.setElementAttribute(elem, val, attributeName);
                }
            }

            return this;
        },
        insertElementValue: function (elements, values, pos, sameValue, append) {
            var noPos = !$.isNumber(pos),
                elems = ($.isArray(elements) || $.isArrayLike(elements)) ? elements : [elements],
                vals = !$.isArray(values) ? [values] : values,
                elem;
            for (var i = 0, c = elems.length; i < c; i++) {
                if ($.isElement(elem = $.toElement(elems[i]))) {
                    var val = $.isUndefined(vals[i]) ? (sameValue ? vals[0] : '') : vals[i],
                        curVal = elem.value,
                        c = 1;
                    if (noPos) {
                        pos = $.getTextCursorPosition(elem);
                        if (pos < 0) {
                            pos = append ? curVal.length : 0;
                        }
                    }
                    elem.value = curVal.insert(val, c, pos);
                    $.setTextCursorPosition(elem, pos + val.length * c);
                }
            }
            return this;
        },
        appendElementValue: function (elements, values) {
            return $.insertElementValue(elements, values, null, true, true);
        },
        appendOption: function (obj, val, txt) {
            return obj.options.add(new Option(txt, val)), this;
        },
        callbackParent: function (funcName) {
            if (top.location.href !== location.href) {
                if ($.isString(funcName, true) && funcName.indexOf('parent.') < 0) {
                    funcName = 'parent.' + funcName;
                }
                var func = $.toFunction(funcName);
                if (!$.isFunction(func)) {
                    return this;
                }
                var args = $.getArguments(arguments, 1);
                func.apply(this, args);
            }
            return this;
        },
        resetForm: function (formId) {
            var form = $I(formId || 'form1');
            if (null === form || form.tagName !== 'FORM') {
                return this;
            }
            return form.reset(), this;
        },
        reload: function (key, val) {
            var url = location.href;
            return location.href = url.setQueryString(key, val), this;
        },
        //还原输入框原始值，原始值保存在输入框 自定义属性 old-value 中
        restoreValue: function (elements) {
            var elems = $.isArray(elements) ? elements : [elements], elem;
            for (var i = 0; i < elems.length; i++) {
                if ($.isElement(elem = $.toElement(elems[i]))) {
                    elem.value = $.isValue(elem.getAttribute('old-value'), '');
                }
            }
            return this;
        },
        //把数组中的数据分别赋值给（ID)输入框和（Name）输入框
        //数组格式：[{"Id":1,"Name":"名称1"},{"Id":2,"Name":"名称2"}]
        setIdAndName: function (datas, idElem, nameElem) {
            idElem = $.toElement(idElem);
            nameElem = $.toElement(nameElem);
            var ids = [], names = [];
            for (var i = 0; i < datas.length; i++) {
                var dr = datas[i];
                ids.push($.getValue(dr, ['Id', 'id']));
                names.push($.getValue(dr, ['Name', 'name']));
            }
            idElem.value = ids.join(',');
            nameElem.value = names.join(',');
            $.setAttribute(idElem, 'old-value', idElem.value);
            $.setAttribute(nameElem, 'old-value', nameElem.value);
            return this;
        }
    }, '$');

    $.extendNative($, {
        getElemValue: $.getElementValue,
        getElemVal: $.getElementValue,
        setElemValue: $.setElementValue,
        setElemVal: $.setElementValue,
        insertElemValue: $.insertElementValue,
        insertElemVal: $.insertElementValue,
        appendElemValue: $.appendElementValue,
        appendElemVal: $.appendElementValue,
        setElemAttribute: $.setElementAttribute,
        setElemAttr: $.setElementAttribute,
        callParentFunc: $.callbackParent
    }, '$');
}(OUI);

// 仿jQuery 
!function ($) {
    'use strict';

    function ajax(url, options) {
        var o = $.extend({
            async: true,
            url: '',
            data: '',
            method: 'GET',      //GET,POST
            dataType: 'TEXT',   //TEXT, JSON, JSONP, HTML, XML, SCRIPT
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            jsonp: 'callback',
            jsonpCallback: '',
            callback: null,
            error: null,
            timeout: 4000,
            load: false,        //是否加载js文件到html
            checkException: true,
            result: ''
        }, checkOptions(url, options));

        if (o.dataType === 'JSONP' && o.jsonp !== false) {
            return ajaxJSONP(o.url, o.jsonp, o.jsonpCallback, o.callback) || false;
        } else if (o.async && !$.isFunction(o.callback)) {
            return false;
        } else if (o.method === 'GET' && o.data) {
            o.url = $.setQueryString(o.url, o.data);
        }

        var xhr = new XmlHttpRequest();

        if (o.async) {
            try { xhr.timeout = o.timeout || 4000; } catch (e) { }
        }

        xhr.open(o.method, o.url, o.async);

        if (o.data) {
            xhr.setRequestHeader('Content-Type', o.contentType);
        }

        xhr.onreadystatechange = function () {
            if (4 !== xhr.readyState) {
                return false;
            }
            o.result = xhr.responseText;
            if (200 === xhr.status) {
                switch (o.dataType) {
                    //这里调用的不是 $.parseJSON，而是 parseJSON，因为getJSON时需要屏蔽JSON解析错误
                    case 'JSON': o.result = parseJSON(o.result, o); break;
                    case 'XML': o.result = $.parseXML(xhr.responseXML); break;
                    case 'SCRIPT': o.load ? $.createJsScript(o.result) : $.globalEval(o.result); break;
                }
                if (o.dataType === 'HTML') {
                    //解析HTML文件中的JS代码并执行
                    parseHTML(o.result);
                }
                if ($.isFunction(o.callback)) {
                    o.callback(o.result, xhr.statusText, xhr);
                }
            } else {
                $.isFunction(o.error) ? o.error(o.result, xhr.statusText, xhr) : $.throwError(o.result);
            }
            xhr = null;
        };

        xhr.send(o.data);

        if (o.async === false || o.dataType === 'HTML') {
            return o.result;
        }
    }

    function XmlHttpRequest() {
        return function () {
            var len = arguments.length;
            for (var i = 0; i < len; i++) {
                try { return arguments[i](); } catch (e) { }
            }
        }(function () { return new XMLHttpRequest() },
            function () { return new ActiveXObject('Msxml2.XMLHTTP') },
            function () { return new ActiveXObject('Microsoft.XMLHTTP') });
    }

    var jsonp_idx = 1,
        checkOptions = function (url, o) {
            if ($.isObject(o)) {
                o.url = url || o.url;
            } else {
                o = $.isObject(url) ? url : { url: url };
            }
            //url参数格式检测，可以是 字符串 或 字符数组(第1个元素为url) 或 字面量对象(须包含“url”字段)
            if ($.isArray(o.url)) {
                o.url = (o.url[0] || '').toString().split('?')[0] + (o.url[1] ? '?' + o.url.slice(1).join('&') : '');
            } else if ($.isObject(o.url)) {
                o.url = o.url['url'] || o.url['Url'] || o.url['URL'];
            }

            o.async = $.isBoolean(o.async, true);
            o.method = (o.method || o.type || 'GET').toUpperCase();
            o.data = $.buildParam(o.data, undefined, false);
            o.dataType = (o.dataType || o.datatype || 'TEXT').toUpperCase();
            o.callback = o.callback || o.success;
            o.timeout = !$.isNumeric(o.timeout) ? 4000 : parseInt(o.timeout, 10);

            //由于大多数WEB服务器不允许静态文件响应POST请求（会返回 405 Method Not Allowed），所以改为GET请求
            if (isStaticFile(o)) {
                o.method = 'GET';
                o.url = $.setQueryString(o.url);
            }

            return o;
        },
        ajaxJSONP = function (url, jsonp, jsonpCallback, callback) {
            //if (!jsonpCallback) {
            //不管有没有指定JSONP回调函数，都自动生成回调函数，然后取出数据给ajax回调函数
            if (!jsonpCallback || true) {
                jsonpCallback = 'jsonpCallback_' + new Date().getTime() + '_' + jsonp_idx++;

                window[jsonpCallback] = function (result) {
                    $.removeJsScript(jsonpCallback);
                    $.isFunction(callback) && callback(result);
                };
            }
            url = $.setQueryString(url, jsonp, jsonpCallback);

            return $.loadJsScript(url, jsonpCallback);
        },
        isStaticFile = function (o) {
            if (o.dataType === 'HTML' || o.dataType === 'SCRIPT') {
                return true;
            } else {
                return /(html|htm|txt|json|js)/ig.test($.getExtension(o.url));
            }
        },
        parseHTML = function (html) {
            var ms = html.match(/<script(.|\n)*?>(.|\n|\r\n)*?<\/script>/ig);
            if (ms) {
                for (var i = 0, len = ms.length; i < len; i++) {
                    var m = ms[i].match(/<script(.|\n)*?>((.|\n|\r\n)*)?<\/script>/im);
                    $.globalEval(m[2]);
                }
            }
        },
        parseJSON = function (data, op) {
            try {
                return $.parseJSON(data);
            } catch (e) {
                if (!op.checkException) {
                    return op.callback = null, '';
                }
                $.throwError(e);
            }
        },
        build = function (url, data, callback, dataType, method) {
            if ($.isFunction(data)) {
                dataType = callback || dataType, callback = data, data = null;
            }
            return {
                url: url, method: method, dataType: dataType, data: data, callback: callback,
                set: function (data, value) {
                    if (typeof data === 'object') {
                        for (var k in data) {
                            this[k] = data[k];
                        }
                    } else {
                        this[data] = value;
                    }
                    return this;
                }
            };
        };

    $.extendNative($, {
        ajax: ajax,
        get: function (url, data, callback, dataType) {
            return ajax(build(url, data, callback, dataType, 'GET'));
        },
        post: function (url, data, callback, dataType) {
            return ajax(build(url, data, callback, dataType, 'POST'));
        },
        getJSON: function (url, data, callback, checkException) {
            var p = build(url, data, callback, checkException, 'GET');
            return ajax(p.set({ dataType: 'JSON', checkException: $.isBoolean(p.dataType, false) }));
        },
        postJSON: function (url, data, callback, checkException) {
            var p = build(url, data, callback, checkException, 'POST');
            return ajax(p.set({ dataType: 'JSON', checkException: $.isBoolean(p.dataType, false) }));
        },
        getScript: function (url, data, callback, load) {
            var p = build(url, data, callback, load, 'GET');
            return ajax(p.set({ dataType: 'SCRIPT', load: $.isBoolean(p.dataType, false) }));
        },
        load: function (url, data, callback, dataType) {
            var p = build(url, data, callback, dataType, 'GET');
            if ($.isObject(p.data)) {
                p.method = 'POST';
            }
            return ajax(p.set({ async: $.isFunction(p.callback), dataType: p.dataType || 'HTML' }));
        },
        each: function (obj, callback, args) {
            var length, i = 0;
            if ($.isArrayLike(obj)) {
                length = obj.length;
                for (; i < length; i++) {
                    if (callback.call(obj[i], i, obj[i], args) === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    if (callback.call(obj[i], i, obj[i], args) === false) {
                        break;
                    }
                }
            }
            return obj;
        },
        merge: function (first, second) {
            var len = +second.length, j = 0, i = first.length;
            for (; j < len; j++) {
                first[i++] = second[j];
            }
            return first.length = i, first;
        }
    }, '$');

    var $size = function ($fn, key, val) {
        if ($.isUndefined(val)) {
            var self = $fn, elem = self[0] || null;
            return $.getElementSize(elem)[key];
        } else {
            var _val = $.isNumeric(val) ? val + 'px' : val;
            return $fn.each(function (i, obj) {
                obj.style[key] = _val;
            });
        }
    };

    $.extendNative($.fn, {
        each: function (callback, args) {
            return $.each(this, callback, args), this;
        },
        pushStack: function (elems) {
            var ret = $.merge(new this.constructor(), elems);
            ret.prevObject = this;
            return ret;
        },
        eq: function (i) {
            var len = this.length,
                j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        prop: function (name, value) {
            var self = this, elem = self[0] || {};
            if ($.isUndefined(value)) {
                return elem ? elem[name] : '';
            } else {
                return self.each(function (i, obj) { obj[name] = value; }), self;
            }
        },
        html: function (value, attr) {
            return this.prop(attr || 'innerHTML', value);
        },
        val: function (value) {
            return this.prop('value', value);
        },
        show: function () {
            return this[0] ? this[0].style.display = '' : null, this;
        },
        hide: function () {
            return this[0] ? this[0].style.display = 'none' : null, this;
        },
        attr: function (name, value) {
            var self = this, elem = self[0] || {};
            if ($.isUndefined(value)) {
                return elem.getAttribute ? elem.getAttribute(name) || undefined : '';
            } else {
                return self.each(function (i, obj) { obj.setAttribute(name, value); }), self;
            }
        },
        clear: function (attrName) {
            if (!$.isString(attrName, true)) {
                attrName = 'value';
            }
            return this.each(function (i, obj) {
                obj[attrName] = '';
            });
        },
        offset: function () {
            var self = this, elem = self[0] || {};
            return $.offset(elem);
        },
        getOffset: function () {
            var self = this, elem = self[0] || {};
            return $.getOffset(elem);
        },
        removeAttr: function (name) {
            return this.each(function (i, obj) {
                obj.removeAttribute(name);
            });
        },
        addClass: function (value) {
            return this.each(function (i, obj) {
                $.addClass(obj, value);
            });
        },
        removeClass: function (value) {
            return this.each(function (i, obj) {
                $.removeClass(obj, value);
            });
        },
        size: function (key, val) {
            return $size(this, key, val);
        },
        width: function (w) {
            return $size(this, 'width', w);
        },
        w: function (w) {
            return $size(this, 'width', w);
        },
        height: function (h) {
            return $size(this, 'height', h);
        },
        h: function (h) {
            return $size(this, 'height', h);
        },
        trigger: function (evName) {
            return this.each(function (i, obj) {
                $.trigger(obj, evName);
            });
        },
        css: function (attrKey, attrVal) {
            var attrs = {};
            if ($.isNullOrUndefined(attrKey)) {
                return $.getElementStyle(this[0]) || {};
            } else if ($.isString(attrKey, true)) {
                if ($.isNullOrUndefined(attrVal)) {
                    return $.getElementStyle(this[0], attrKey) || '';
                } else if ($.isString(attrVal, true) || $.isNumber(attrVal)) {
                    attrs = { attrKey: attrVal };
                }
            } else if ($.isObject(attrKey)) {
                $.extend(attrs, attrKey);
            }
            this.each(function (i, obj) {
                for (var k in attrs) {
                    obj.style[k] = attrs[k];
                }
            });
            return this;
        }
    }, '$.fn');

    $.extendNative($.fn, {
        event: function (action, func) {
            return this.each(function (i, obj) {
                $.addEventListener(obj, action, function (e) {
                    if ($.isFunction(func)) {
                        func(e, i, this);
                    }
                });
            });
        },
        click: function (func) { return this.event('click', func); },
        dblclick: function (func) { return this.event('dblclick', func); },
        blur: function (func) { return this.event('blur', func); },
        change: function (func) { return this.event('change', func); },
        focus: function (func) { return this.event('focus', func); },
        keydown: function (func) { return this.event('keydown', func); },
        keyup: function (func) { return this.event('keyup', func); },
        keypress: function (func) { return this.event('keypress', func); },
        mousedown: function (func) { return this.event('mousedown', func); },
        mouseup: function (func) { return this.event('mouseup', func); },
        mousemove: function (func) { return this.event('mousemove', func); }
    }, '$.fn');

    $.extendNative($.fn, {
        load: function (url, data, callback, dataType) {
            var self = this;
            if (self.length > 0) {
                var p = build(url, data, callback, dataType, 'GET'), func = p.callback;
                $.ajax(p.set({
                    dataType: p.dataType || 'HTML', method: $.isObject(p.data) ? 'POST' : p.method,
                    callback: function (data, status, xhr) {
                        self.html(data);

                        if ($.isFunction(func)) {
                            self.each(function (data, status) { func(data, status); });
                        }
                    }
                }));
            }
            return self;
        }
    }, '$.fn');
}(OUI);

// oui.console
!function ($) {
    var getArguments = function (args, prefix) {
        var par = typeof prefix !== 'undefined' ? { 0: prefix, length: 1 } : { length: 0 },
            len = par.length;

        for (var i = 0; i < args.length; i++) {
            par[len++] = args[i];
        }

        return par.length += len - 1, par;
    }, log = function (type, formatstring) {
        var str = '[' + new Date().format(formatstring || _tf) + ']' + (type ? '[' + type + ']' : '');
        return str;
    }, _tf = 'log';

    $.extendNative($, {
        console: {
            timeformat: function (formatstring) {
                return _tf = formatstring, this;
            },
            tf: function (formatstring) {
                return this.timeformat(formatstring);
            },
            log: function () {
                return console.log.apply(this, getArguments(arguments, log(null))), this;
            },
            info: function () {
                return console.info.apply(this, getArguments(arguments, log('i'))), this;
            },
            warn: function () {
                return console.warn.apply(this, getArguments(arguments, log('w'))), this;
            },
            debug: function () {
                return console.debug.apply(this, getArguments(arguments, log('d'))), this;
            },
            error: function () {
                return console.error.apply(this, getArguments(arguments, log('e'))), this;
            },
            trace: function () {
                return console.trace.apply(this, getArguments(arguments, log('t'))), this;
            }
        }
    });
}(OUI);

// oui.dialog
!function ($) {
    var callParentFunc = function (funcName, param) {
        if ($.isSubWindow()) {
            try {
                var func = parent.$.dialog[funcName],
                    id = $.getQueryString(location.href, ['dialog_id', 'dialogid']);
                if ($.isFunction(func) && !$.isUndefined(id)) {
                    return func(id, param), this;
                }
            } catch (e) {}
        }
        return $;
    },
    closeParentMenu = function (moduleName, funcName) {
        if ($.isSubWindow()) {
            try {
                var func = typeof parent.$[moduleName] !== 'undefined' ? parent.$[moduleName][funcName] : null;
                if ($.isFunction(func)) {
                    func();
                }
                if(typeof parent.$ !== 'undefined' && $.isFunction(parent.$[funcName])) {
                    parent.$[funcName]();
                }
                return this;
            } catch (e) {}
        }        
        return $;
    };
    $.extend($, {
        //通过子窗口关闭父窗口对话框(oui.dialog)
        closeParentDialog: function (param) {
            return callParentFunc('closeParentDialog', param);
        },
        closeParent: function (param) {
            return callParentFunc('closeParent', param);
        },
        //根据子窗口内容重置父空口对话框(oui.dialog)大小
        resizeParentDialog: function (param) {
            return callParentFunc('resizeParentDialog', param);
        },
        //关闭父窗口可能出现的Tab(oui.tab)标签的右键菜单
        hideParentTabMenu: function () {
            return closeParentMenu('tab', 'hideParentTabMenu');
        },
        //关闭父窗口可能出现的右键菜单
        hideParentMenu: function () {
            return closeParentMenu('contextmenu', 'hideParentMenu');
        }
    });
}(OUI);