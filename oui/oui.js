
/*
 @Title: OUI
 @Description：JS Common Code Library
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
            //IPv4
            Ip: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
            IPv4: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
            //IPv6
            IPv6: /^((::)|(::[0-9A-F]{1,4})|([0-9A-F]{1,4}::)|[0-9A-F]{1,4}(:[0-9A-F]{1,4}){7})$/i,
            //Port  0 - 65535
            Port: /^([1-6][0-5]([0-5][0-3][0-5]|[0-4][0-9]{2})|[1-5]([\d]{1,4})?|[1-9]([\d]{1,3})?|[0])$/,
            //带参数的URL格式字符串
            UrlParam: /^(\/|http:\/\/|https:\/\/)(.*)(.(as[hp][x]?|jsp|[s]?htm[l]?|php|do)|\/)\?[&]?(.*)=(.*)([&]{1,}(.*)=(.*)){0,}/gi,
            //整数
            Int: /^(-?[1-9][\d]{0,10})$/,
            //长整数
            Long: /^(-?[1-9][\d]{0,19})$/,
            //浮点数
            Float: /^(-?[1-9][\d]{0,15}[.]?[\d]{0,10}|-?[0]([.][\d]{0,})?)$/,
            //双精度浮点数
            Double: /^(-?[1-9][\d]{0,23}[.]?[\d]{0,10}|-?[0]([.][\d]{0,})?)$/
        },
        CASE_TYPE: {
            Camel: 0,
            Pascal: 1,
            Underline: 2
        },
        KEY_CODE: {
            Backspace: 8,
            Tab: 9,
            Enter: 13,
            Esc: 27,
            Space: 32,
            Delete: 46,
            Arrow: {
                Left: 37, Right: 39,
                Up: 38, Down: 40, Top: 38, Bottom: 40,
                H: 72, K: 75, J: 74, L: 76
            },
            CtrlList: [8, 9, 13, 27, 32, 37, 38, 39, 40, 46],
            Char: {
                A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71,
                H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78,
                O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85,
                V: 86, W: 87, X: 88, Y: 89, Z: 90,
                0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57
            },
            Num: { 0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57 },
            NumList: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
            Symbol: { 
                "*": 56, "+": 187, "-": 189, ".": 190, "/": 191, 
                ":": 186, Minus: 189, Dot: 190
            },
            Min: {
                Enter: 108,
                0: 96, 1: 97, 2: 98, 3: 99, 4: 100, 
                5: 101, 6: 102, 7: 103, 8: 104, 9: 105,
                Symbol: { 
                    "*": 106, "+": 107, "-": 109, ".": 110, "/": 111, Minus: 109, Dot: 110
                },
                Num: { 0: 96, 1: 97, 2: 98, 3: 99, 4: 100, 5: 101, 6: 102, 7: 103, 8: 104, 9: 105 },
                NumList: [96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
            },
            //F1 F2 ... F12
            Func: {
                1: 112, 2: 113, 3: 114, 4: 115, 5: 116, 6: 117, 
                7: 118, 8: 119, 9: 120, 10: 121, 11: 122, 12: 123
            },
            FuncList: [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]
        },
        POSITION: {
            Cursor: 0, Custom: 0,
            TopLeft: 1, TopCenter: 2, TopRight: 3,
            MiddleLeft: 4, Center: 5, MiddleRight: 6,
            BottomLeft: 7, BottomCenter: 8, BottomRight: 9,
            TL: 1, TC: 2, TR: 3, ML: 4, MC: 5, MR: 6, BL: 7, BC: 8, BR: 9
        }
    });

    for (var k in $.KEY_CODE) {
        $.KEY_CODE[k.toUpperCase()] = $.KEY_CODE[k];
    }

    var version = '1.0.0',
        trim = function (s) { return s.replace(/(^[\s]*)|([\s]*$)/g, ''); },
        isUndefined = function (o) { return typeof o === 'undefined'; },
        isString = function (s, nonempty) { return typeof s === 'string' && (nonempty ? trim(s) !== '' : true); },
        isNumber = function (n, min, max) { 
            if (typeof n !== 'number') { return false; }
            var isMin = typeof min === 'number', isMax = typeof max === 'number';
            return isMin && isMax ? n >= min && n <= max : (isMin ? n >= min : isMax ? n <= max : true);
        },
        checkNumber = function (n, min, max) {
            return isNumber(n, min, max);
        },
        setNumber = function(n, min, max) {
            if (typeof n !== 'number') { return n; }
            var isMin = isNumber(min), isMax = isNumber(max);
            if (isMin && isMax) { return n < min ? min : (n > max ? max : n); }
            return isMin ? (n < min ? min : n) : isMax ? (n > max ? max : n) : n;
        },
        isObject = function (o) { return o !== null && typeof o === 'object'; },
        isArray = Array.isArray || function (a) { return Object.prototype.toString.call(a) === '[object Array]'; },
        value = function (values) {
            var arr = isArray(values) ? values : arguments, i = 0, c = arr.length;
            for (i = 0; i < c; i++) {
                if (arr[i] !== undefined && arr[i] !== null) {
                    return arr[i];
                }
            }
            return;
        },
        /*
            判断变量是否为boolean
            b: 变量
            dv: 默认值，若dv为boolean，且b不为boolean，则返回dv；若dv不为boolean,则返回b === boolean
        */        
        isBoolean = function (b, dv) {
            var bool = typeof b === 'boolean';
            return typeof dv === 'boolean' ? (bool ? b : dv) : bool;
        },
        isBooleans = function (bs, dv) {
            var bool = false, b, dvb = typeof dv === 'boolean';
            for (var i = 0; i < bs.length; i++) {
                bool = typeof bs[i] === 'boolean';
                if (bool) {
                    b = bs[i];
                    break;
                }
            }
            return dvb ? (bool ? b : dv) : bool;
        },
        isDate = function (obj) {
            return (obj instanceof Date || Object.prototype.toString.call(obj) === '[object Date]') && !isNaN(obj.getFullYear());
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
            else if (isObject(o)) { for (var k in o) { return false; } return true; }
            return false;
        },
        isProperty = function (o, property) { return o.hasOwnProperty(property) && (property in o); },
        isPercent = function (val) {
            return (!isNaN(parseFloat(val, 10)) && ('' + val).endsWith('%'));
        },
        isIPv4 = function (ip) {
            return $.PATTERN.Ip.test(ip);
        },
        isIPv6 = function (ip) {
            if($.PATTERN.IPv6.test(ip)) {
                return true;
            }
            var mc;
            if (!/^[0-9A-F:]{2,39}$/i.test(ip) || !(mc = ip.match(/(::)/g)) || mc.length > 1) {
                return false;
            }
            var arr = ip.split(':'), len = arr.length, c = 0;
            if (len < 3 || len > 8) {
                return false;
            }
            for (var i = 0; i < len; i++) {
                if ((c += arr[i] === '' ? 1 : 0) > 2) {
                    return false;
                }
            }
            return true;
        },
        isIP = function (ip) {
            return isIPv4(ip) || isIPv6(ip);
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
        toIntList = function (numbers, separator) {
            if (isString(numbers)) {
                numbers = numbers.split(separator || /[,;|]/);
            }
            if (!isArray(numbers)) {
                return [];
            }            
            var list = [], num;
            for (var i = 0; i < numbers.length; i++) {
                if (!isNaN(num = parseInt(numbers[i], 10))) {
                    list.push(num);
                }
            }
            return list;
        },
        toIdList = function (numbers, separator, minVal) {
            if ($.isNumber(separator)) {
                minVal = separator;
                separator = undefined;
            }
            if (!$.isNumber(minVal)) {
                minVal = 1;
            }
            if (isString(numbers)) {
                numbers = numbers.split(separator || /[,;|]/);
            }
            if (!isArray(numbers)) {
                return [];
            }            
            var list = [], num;
            for (var i = 0; i < numbers.length; i++) {
                if (!isNaN(num = parseInt(numbers[i], 10)) && num >= minVal) {
                    list.push(num);
                }
            }
            return list;
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
                numbers = numbers.split(separator || /[,;|]/);
            }
            if (!isArray(numbers)) {
                return [];
            }

            var list = [], num;
            for (var i = 0; i < numbers.length; i++) {
                if (!isNaN(num = parseFloat(numbers[i], 10))) {
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
        toJsonString = function (o, space) { return JSON.stringify(o, null, space || 0); },
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
                val = isObject(val) ? toJsonString(val) : val;
                var ps = key + '=' + (typeof window !== 'undefined' ? toEncode(val) : val);
                if (oldVal !== '') {
                    url = url.replace(key + '=' + oldVal, ps);
                } else {
                    s.push(ps);
                }
            }
            return url;
        },
        buildParam = function (a, v, strict, url) {
            if ($.isString(strict) && !$.isString(url, true)) {
                url = strict;
                strict = true;
            }
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
                    //var key = a[i].key || a[i].name, val = a[i].value || a[i].data || a[i].val;
                    var key = a[i].key || a[i].name, val = $.value(a[i].value, a[i].data, a[i].val);
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
        //转换字段命名格式
        setFieldCase = function (formData, caseType) {
            var data = {};
            for (var k in formData) {
                var dr = formData[k],
                    key = caseType === $.CASE_TYPE.Pascal ? k.toPascalCase(true) : 
                        caseType === $.CASE_TYPE.Underline ? k.toUnderlineCase(true) : 
                        k.toCamelCase(true);
                if (dr === null) {
                    data[key] = dr;
                } else if ($.isArray(dr)) {
                    data[key] = [];
                    for (var i = 0; i < dr.length; i++) {
                        if ($.isObject(dr[i])) {
                            data[key].push(setFieldCase(dr[i], caseType));
                        } else {
                            data[key].push(dr[i]);
                        }
                    }
                } else if ($.isObject(dr)) {
                    data[key] = setFieldCase(dr, caseType);
                } else {
                    data[key] = dr;
                }
            }
            return data;
        },
        buildAjaxData = function (action, formData, param, caseType) {
            if ($.isObject(action)) {
                caseType = param;
                param = formData;
                formData = action;
                action = null;
            }
            if ($.isNumber(param) && !$.isNumber(caseType)) {
                caseType = param;
                param = null;
            }
            if ($.isNumber(caseType, 0)) {
                formData = $.setFieldCase(formData, caseType);
            }
            var a = buildParam({ action: action, data: formData }),
                b = buildParam($.extend({}, param), null, false);
            return ($.isString(a, true) ? a + '&' : '') + b;
        },
        buildApiData = function(formData, param, caseType) {
            return buildAjaxData('', formData, param, caseType);
        },
        buildUrlParam = function (param, strict, url) {
            return buildParam($.extend({}, param), null, strict, url);
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
            var css = url.split('?')[0].endsWith('.css');
            if ($.isBoolean(nocache, !css)) {
                var pkey = 'hupts001', time = getTime();
                url = buildParam(pkey, time, false, url);
            }
            return url;
        },
        addQueryString = function(url, key, val) {
            return setQueryString(url, key, val, false);
        },
        removeQueryString = function(url, key) {
            var datas = getQueryString(url);
            for (var k in datas) {
                if (k === key) {
                    delete datas[k];
                    break;
                }
            }
            return buildParam(datas, undefined, url.split('?')[0]);
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
        //notAllowEmpty - 不允许空值，默认为允许
        getParam = function (opt, key, dval, notAllowEmpty) {
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
                    if ($.isString(val)) {
                        if (!notAllowEmpty || val.trim() !== '') {
                            return val.trim();
                        }
                    } else {
                        return val;
                    }
                }
            }
            return dval;
        },
        //用于获取参数名重载（参数内容允许为null值）
        getParamValue = function() {
            for(var i = 0; i < arguments.length; i++) {
                if(typeof arguments[i] !== 'undefined') {
                    return arguments[i];
                }
            }
            return undefined;
        },
        //用于获取参数内容（仅获取有效的内容，不包含null和空字符串）
        getParamCon = function() {
            var arg;
            for(var i = 0; i < arguments.length; i++) {
                arg = arguments[i];
                if(!$.isNullOrUndefined(arg)) {
                    if ($.isString(arg)) {
                        if (arg.trim() !== '') {
                            return arg.trim();
                        }
                    } else {
                        return arg;
                    }
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
        toIniJson = function (json, separator, hideSection) {
            if ($.isBoolean(separator)) {
                hideSection = separator;
                separator = null;
            }
            hideSection = $.isBoolean(hideSection, false);

            var obj = {}, c = 0;
            for (var k in json) {
                var item = json[k],
                    tmp = k.split(separator || '__'),
                    pid = tmp[0],
                    id = tmp[1];

                if(pid && id) {
                    if (hideSection) {
                        obj[id] = item;
                    } else {
                        if (typeof obj[pid] === 'undefined') {
                            obj[pid] = {};
                        }
                        obj[pid][id] = item;
                    }
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
        },
        replaceKeys = function (str, keys, prefix, postfix, clear) {
            if (!$.isArray(keys)) {
                keys = [keys.toString()];
            }
            if (keys.length <= 0 || /[*?]/.test(keys[0]) || (keys[0].startsWith('/') && keys[0].endsWith('/'))) {
                return str;
            }
            var dic = {}, c = keys.length, i, pattern = [], fixed = '';
            if ($.isBoolean(prefix, false)) {
                clear = prefix;
            } else if (!$.isBoolean(clear)) {
                if ($.isString(clear) || $.isNumber(clear)) {
                    fixed = clear.toString();
                }
                if (!$.isString(prefix) && !$.isNumber(prefix)) {
                    prefix = '';
                }
                if (!$.isString(postfix) && !$.isNumber(postfix)) {
                    postfix = '';
                }
                clear = false;
            }
            for (i = 0; i < c; i++) {
                var k = keys[i] || '';
                dic[k.toString()] = k;
                pattern.push(k);
            }
            pattern = new RegExp('(' + pattern.join('|') + ')', 'ig');
            
            return str.replace(pattern, function (all, t) { 
                return clear ? '' : prefix + (fixed || dic[t]) + postfix; 
            });
        },
        buildTreeList = function (options) {
            var list = [], node = {}, 
                items = $.isArray(options) ? options : [options];

            for (var i = 0; i < items.length; i++) {
                var dr = $.extend({}, items[i], {level: 0});
                if ($.isUndefinedOrNull(dr.pid) || !($.isString(dr.pid) || $.isNumber(dr.pid))) {
                    node = dr;
                    node.index = list.length;
                    list.push(node);
                } else {
                    node = _insert(list, dr, node);
                }
            }
            //parent: true - 找父节点，false - 找兄弟节点
            function _find(o, type, parent, each, i) {
                /*
                if (parent) {
                    if ((!type || o.d.ptype === o.p.type) && o.d.pid === o.p.id) {
                        o.pi = (each ? i : o.p.index) + 1;
                        return o.pd = o.p, true;
                    }
                } else {
                    if ((!type || o.d.ptype === o.p.ptype) && o.d.pid === o.p.pid) {
                        o.bi = (each ? i : o.p.index) + 1;
                        return o.bd = o.p, true;
                    }
                }
                */
                if (o.d.pid === o.p[parent ? 'id' : 'pid'] && (!type || o.d.ptype === o.p[parent ? 'type' : 'ptype'])) {
                    o[parent ? 'pi' : 'bi'] = (each ? i : o.p.index) + 1;
                    return o[parent ? 'pd' : 'bd'] = o.p, true;
                }
                return false;
            }

            function _each(list, o, type) {
                var len = list.length;
                 for (var i = 0; i < len; i++) {
                    o.p = list[i];
                    //找父节点 或 兄弟节点
                    //父节点已找到，当前非兄弟节点，循环结束（因为已经不是同一个父节点了）
                    if(!(_find(o, type, true, true, i) || _find(o, type, false, true, i))) {
                        if (o.pi > 0) {
                            break;
                        }
                    }
                }
            }

            function _insert(list, node, lastNode) {
                var o = {
                    d: node || {}, p: lastNode || {},
                    pd: null, bd: null,
                    len: list.length,
                    pi: 0, bi: 0
                }, idx = list.length, i;

                o.p.index = o.p.index || 0;

                if (o.d.ptype) {
                    _find(o, true, false, false) || _find(o, true, true, false) || _each(list, o, true);
                } else {
                    _find(o, false, false, false) || _find(o, false, true, false) || _each(list, o, false);
                }

                if (o.bi || o.pi) {
                    o.d.level = o.bi ? o.bd.level : o.pd.level + 1;
                    list.splice((idx = o.bi || o.pi), 0, o.d);
                } else {
                    o.d.level = 0;
                    list.push(o.d);
                }
                return { id: o.d.id, pid: o.d.pid, type: o.d.type, ptype: o.d.ptype, level: o.d.level, index: idx };
            }
            return list;
        },
        buildTreeData = function (list) {
            //TODO:
            var data = [], len = list.length, i, dic = {};

            for (i = 0; i < len; i++) {
                dic[list[i].id] = list[i];
            }
            for (i = 0; i < len; i++) {
                var dr = list[i], pn = dic[dr.pid];
                if (pn) {
                    pn.childs = pn.childs || [];
                    pn.childs.push(dr);
                } else {
                    data.push(dr);
                }
            }
            return data;
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
        trim: trim, value: value,
        isUndefined: isUndefined, isUndef: isUndefined, isString: isString, isNumber: isNumber,
        isFunction: isFunction, isFunc: isFunction, isObject: isObject, isArray: isArray, isDate: isDate, 
        isDateString: isDateString, isDateStr: isDateString,
        isBoolean: isBoolean, isBool: isBoolean, isBooleans: isBooleans, isBools: isBooleans,
        isTrue: isTrue, isFalse: isFalse, isNull: isNull, isEmpty: isEmpty,
        isProperty: isProperty, isPercent: isPercent, isPercentSize: isPercent, version: version,
        isNumeric: isNumeric, isDecimal: isDecimal, isInteger: isInteger, isFloat: isDecimal, isInt: isInteger,
        isHexNumeric: isHexNumeric, isHexNumber: isHexNumber,
        isMobile: isMobile, isTelephone: isTelephone, isIdentity: isIdentity, isEmail: isEmail,
        isRegexp: isRegexp, isNullOrUndefined: isNullOrUndefined, isNullOrUndef: isNullOrUndefined,
        isUndefinedOrNull: isNullOrUndefined, isUndefOrNull: isNullOrUndefined,
        isIPv4: isIPv4, isIPv6: isIPv6, isIP: isIP, isIp: isIP,
        padLeft: function (s, totalWidth, paddingChar) {
            return padLeft(s, totalWidth, paddingChar, false);
        },
        padRight: function (s, totalWidth, paddingChar) {
            return padLeft(s, totalWidth, paddingChar, true);
        },
        toDecimal: toDecimal, toFloat: toDecimal, checkNumber: checkNumber, setNumber: setNumber,
        toInteger: toInteger, toInt: toInteger, toNumber: toNumber, 
        toNumberList: toNumberList, toIdList: toIdList, toIntList: toIntList,
        toBoolean: toBoolean, toBool: toBoolean, iniToJson: iniToJson, jsonToIni: jsonToIni, toIniJson: toIniJson,
        replaceKeys: replaceKeys,
        containsKey: containsKey, containsValue: containsValue, contains: contains, distinctList: distinctList,
        collapseNumberList: collapseNumberList, expandNumberList: expandNumberList,
        collapseNumbers: collapseNumberList, expandNumbers: expandNumberList,
        toJsonString: toJsonString, toJsonStr: toJsonString, toJson: toJson, tryToJson: tryToJson, toEncode: toEncode,
        toAscii: toAscii, toAsciiHex: toAsciiHex, asciiToChar: asciiToChar, asciiToStr: asciiToChar,
        getArguments: getArguments, getArgs: getArguments, setFieldCase: setFieldCase,
        toFunction: toFunction, toFunc: toFunction, callFunction: callFunction, callFunc: callFunction,
        param: buildParam, buildParam: buildParam, setUrlParam: setUrlParam, 
        buildAjaxData: buildAjaxData, buildUrlData: buildAjaxData, buildUrlParam: buildUrlParam,
        buildApiData: buildApiData,
        setQueryString: setQueryString, getQueryString: getQueryString, getUrlHost: getUrlHost, getUrlPage: getUrlPage,
        addQueryString: addQueryString, removeQueryString: removeQueryString, delQueryString: removeQueryString,
        setDebug: setDebug, isDebugAction: isDebugAction, isDebug: isDebug, isLocalhost: isLocalhost,
        filterValue: filterValue, keywordOverload: keywordOverload, keyOverload: keywordOverload,
        setValue: setValue, getValue: getValue, isValue: isValue, getParam: getParam,
        getParamValue: getParamValue, getParVal: getParamValue, cleanSlash: cleanSlash,
        getParamCon: getParamCon, getParamContent: getParamCon, getParCon: getParamCon,
        buildTreeList: buildTreeList, toTreeList: buildTreeList,
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
            if (key) {
                for (var i = 1; i < c; i++) {
                    arr[i][key] < pivot[key] ? left.push(arr[i]) : right.push(arr[i]);
                }
            } else {
                for (var i = 1; i < c; i++) {
                    arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i]);
                }
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
        },
        setPrefix: function(data, prefix) {
            if ($.isArray(data)) {
                var arr = [];
                for (var i = 0, c = data.length; i < c; i++) {
                    arr.push((prefix || '') + data[i]);
                }
                return arr;
            } else if ($.isString(data) || $.isNumber(data)) {
                return (prefix || '') + data;
            }
            return data;
        },
        calcLocationDistance: function (p1, p2, earthRadius, plane) {
            if (!p1 || !p2) {
                return -1;
            }
            var lat1 = $.getParam(p1, 'latitude,lat,x', 0), lat2 = $.getParam(p2, 'latitude,lat,x', 0),
                lon1 = $.getParam(p1, 'longitude,lon,y', 0), lon2 = $.getParam(p2, 'longitude,lon,y', 0);

            if (!$.isNumber(lat1) || !$.isNumber(lat2) || !$.isNumber(lon1) || !$.isNumber(lon2)) {
                return -1;
            }
            if ($.isBoolean(earthRadius)) {
                plane = earthRadius;
                earthRadius = 0;
            } else {
                plane = $.isBoolean(plane, false);
            }

            if (plane) {
                // 按平面算，1度所代表的距离，单位：米
                var Ratio = earthRadius || 111320;
                var w = lat2 > lat1 ? lat2 - lat1 : lat1 - lat2, 
                    h = lon2 > lon1 ? lon2 - lon1 : lon1 - lon2,
                    //d = Math.sqrt(w * w + h * h) * Ratio;
                    //d = Math.sqrt(w ** 2 + h ** 2) * Ratio;
                    d = Math.hypot(w, h) * Ratio;

                return d;
            }

            var EarthRadius = earthRadius || 6378137,
                dLat = (lat2 - lat1) * Math.PI / 180,
                dLng = (lon2 - lon1) * Math.PI / 180,
                a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2),
                c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
                d = EarthRadius * c;

            return d;
        },
        calcRectangleDistance: function (p1, p2, ratio) {
            return $.calcLocationDistance(p1, p2, ratio, true);
        },
        /*
         * 已知对角线两点，计算矩形另外两个顶点
         * @param {Object} p1 - 对角线起点 {x, y}
         * @param {Object} p3 - 对角线终点 {x, y}
         * @returns {Array} 另外两个顶点 [p2, p4]
         */
        calcRectangleVertices: function (p1, p3) {
            // 1. 计算对角线中点（矩形中心）
            const center = {
                x: (p1.x + p3.x) / 2,
                y: (p1.y + p3.y) / 2
            };

            // 2. 计算从中心到p1的向量（半对角线向量）
            const dx = p1.x - center.x;
            const dy = p1.y - center.y;

            // 3. 向量旋转90度得到相邻边向量（顺时针旋转）
            const vec2 = { x: -dy, y: dx };
            const vec4 = { x: dy, y: -dx };

            // 4. 计算另外两个顶点
            const p2 = { x: center.x + vec2.x, y: center.y + vec2.y };
            const p4 = { x: center.x + vec4.x, y: center.y + vec4.y };

            return [p2, p4];
        },
        /*
         * 延长对角线（双向等距延长）
         * @param {Object} p1 - 原对角线起点 {x, y}
         * @param {Object} p3 - 原对角线终点 {x, y}
         * @param {number} dist - 延长距离（两端各延长dist长度）
         * @returns {Array} 新的对角线顶点 [q1, q3]（q1是p1延长后，q3是p3延长后）
         */
        extendDiagonal: function(p1, p3, dist) {
            // 1. 计算原对角线的长度和单位向量（方向：p1→p3）
            const diagLen = Math.hypot(p3.x - p1.x, p3.y - p1.y);
            if (diagLen === 0) {
                return [p1, p3]; // 避免除以0
            }

            const unitX = (p3.x - p1.x) / diagLen; // x方向单位向量
            const unitY = (p3.y - p1.y) / diagLen; // y方向单位向量

            // 2. 计算延长后的两个顶点
            // q1：从p1向远离p3的方向延长dist
            const q1 = {
                x: p1.x - unitX * dist,
                y: p1.y - unitY * dist
            };
            // q3：从p3向远离p1的方向延长dist
            const q3 = {
                x: p3.x + unitX * dist,
                y: p3.y + unitY * dist
            };

            return [q1, q3];
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
        getYearStart: function(year) {
            var ds = $.getDateOptions(year);
            if (ds !== null) {
                return '{0}-01-01 00:00:00'.format(ds.year);
            } else {
                var dt = new Date();
                year = year || dt.getFullYear();
                return '{0}-01-01 00:00:00'.format(year);
            }
        },
        getYearEnd: function(year) {
            var ds = $.getDateOptions(year);
            if (ds !== null) {
                return '{0}-12-31 23:59:59'.format(ds.year);
            } else {
                var dt = new Date();
                year = year || dt.getFullYear();
                return '{0}-12-31 23:59:59'.format(year);
            }
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
        },
        getDateRange: function (num, type, days) {
            num = Math.abs(num);
            days = days || 0;
            var dt, start = 0;
            if ('month' === type) {
                dt = new Date().addMonths(-num);
                return { start: dt.getMonthStart(), end: dt.addMonths(days).getMonthEnd() };
            } else if ('year' === type) {
                dt = new Date().addYears(-num);
                return { start: dt.getYearStart(), end: dt.addYears(days).getYearEnd() };
            }
            switch (type) {
                case 'day':
                case 'days':
                    start = num;
                    break;
                case 'week':
                    start = (new Date().getDay() || 7) + num * 7 - 1;
                    days = 7 - 1 + days * 7;
                    break;
            }
            dt = new Date().addDays(-start);

            return { start: dt.getDayStart(), end: dt.addDays(days).getDayEnd() };
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
        },
        reverse: function () {
            var arr = [], a = this;
            for (var i = a.length - 1; i >= 0; i--) {
                arr.push(a[i]);
            } 
            return arr;
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
        inArray: function (strArray) {
            var arr = $.isArray(strArray) ? strArray : $.isString(strArray) ? strArray.split(/[,;|]/) : [strArray];
            return arr.length > 0 ? arr.indexOf(this) > -1 : false;
        },
        replaceAll: function (pattern, v) {
            return this.replace($.isRegexp(pattern) ? pattern : new RegExp(pattern, 'gm'), v);
        },
        /*
            v: 要追加的内容
            c: 要插入的数量或间隔符号
        */
        append: function (v, c) {
            var s = this;
            if (v === undefined || v === null) {
                return s;
            }
            if ($.isNumber(c)) {
                for (var i = 0; i < c; i++) { s += v; }
                return s;
            } else if ($.isString(c, true)) {
                return s + c + v;
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
        splitFieldKey: function () {
            var s = this, list = [], c, n, t = [];
            if (s.indexOf('_') >= 0) {
                var arr = s.split('_');
                for (var i = 0; i < arr.length; i++) {
                    var t = arr[i];
                    if (t !== '') {
                        list.push(t);
                    }
                }
                return list;
            }
            for (var j = 0; j < s.length; j++) {
                n = s[j].charCodeAt(0);
                if (j > 0 && n >= 65 && n <= 90) {
                    list.push(t.join(''));
                    t = [s[j]];
                } else {
                    t.push(s[j]);
                }            
            }
            if (t.length > 0) {
                list.push(t.join(''));
            }
            return list;
        },
        toCamelCase: function (strict, isPascal) {
            var s = this, arr = [], list = [], a, b, c = 0;
            if (s.indexOf('_') >= 0 || strict) {
                arr = s.splitFieldKey();
                for (var i = 0; i < arr.length; i++) {
                    a = arr[i].substr(0, 1);
                    b = (arr[i].substr(1) || '').toLowerCase();
                    list.push((c++ > 0 || isPascal ? a.toUpperCase() : a.toLowerCase()) + b);
                }
                return list.join('');
            }
            return (isPascal ? s.substr(0, 1).toUpperCase() : s.substr(0, 1).toLowerCase()) + (s.substr(1) || '');
        },
        toPascalCase: function(strict) {
            return this.toCamelCase(strict, true);
        },
        toUnderlineCase: function () {
            var s = this, arr = s.splitFieldKey(), list = [];
            for (var i = 0; i < arr.length; i++) {
                list.push(arr[i].toLowerCase());
            }
            return list.join('_');
        },
        distinct: function (separator) {
            var s = this;
            return $.distinctList(s, separator);
        },
        distinctList: function (separator) {
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
        ellipsis: function (show) {
            if (!$.isBoolean(show, false)) {
                return this;
            }
            return this + '...';
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
        toIntList: function (separator) { return $.toIntList(this, separator); },
        toIdList: function (separator, minVal) { return $.toIdList(this, separator, minVal); },
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
        //lower: 是否小写
        //cutoff: 是否截断长度
        toNumHex: function(len, lower, cutoff) {
            var num = parseInt(this, 10);
            if (!isNaN(num)) {
                return num.toHex(len, lower, cutoff);
            }
            return '';
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
        replaceKeys: function (keys, prefix, postfix, clear) {
            return $.replaceKeys(this, keys, prefix, postfix, clear);
        },
        setQueryString: function (data, value, nocache) {
            return $.setQueryString(this, data, value, nocache);
        },
        getQueryString: function (name) {
            return $.getQueryString(this, name);
        },
        addQueryString: function(key, value) {
            return $.addQueryString(this, key, value);
        },
        delQueryString: function(key) {
            return $.delQueryString(this, key);
        },
        removeQueryString: function(key) {
            return $.removeQueryString(this, key);
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
        getFileSalt: function () {
            return $.getFileSalt(this);
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
        toEvenLen: function () {
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
            var hex = this.toEvenLen(), arr = [], len = hex.length;
            for (var i = 0; i < len / 2; i++) {
                arr[len - i * 2 - 1] = hex[i * 2 + 1];
                arr[len - i * 2 - 2] = hex[i * 2];
            }
            return arr.join('');
        },
        hexToInt: function (reverse, radix) {
            if ($.isNumber(reverse)) {
                radix = reverse;
                reverse = false;
            }
            if ($.isNumber(radix)) {
                return this.radixToInt(reverse, radix);
            }
            var s = this.toEvenLen().toUpperCase();
            if (!/^[0-9A-F]{0,}$/ig.test(s)) {
                $.console.trace('hexToInt: [', s, '] hex内容格式错误');
                return 0;
            }
            var hex = reverse ? s.reverseHex(reverse) : s,
                num = eval('0x' + hex).toString(10);
            return parseInt(num, 10);
        },
        radixToInt: function (reverse, radix) {
            if ($.isNumber(reverse)) {
                radix = reverse;
                reverse = false;
            }
            var s = this.toEvenLen().toUpperCase(), r = radix || 16;
            if (!(r === 36 ? /^[0-9A-Z]{0,}$/ig : /^[0-9A-F]{0,}$/ig).test(s)) {
                $.console.trace('radixToInt: [', s, '] ' + r + '进制内容格式错误');
                return 0;
            }
            var arr = (reverse ? s.reverseHex(reverse) : s).split(''),
                len = arr.length,
                num = 0, n = 0;
            for (var i = 0; i < len; i++) {
                n = arr[i].charCodeAt();
                n = (n <= 57 ? n - 48 : n - 55);
                num += n * Math.pow(r, len - i - 1);
            }
            return num;
        },
        num16ToInt: function (reverse) {
            return this.radixToInt(reverse, 16);
        },
        num36ToInt: function (reverse) {
            return this.radixToInt(reverse, 36);
        },
        hexToFloat: function (reverse, decimalLen) {
            if ($.isNumber(reverse)) {
                decimalLen = reverse;
                reverse = false;
            }
            var str = this.toEvenLen();
            if (!/^[0-9A-F]{8}$/ig.test(str)) {
                $.console.trace('hexToFloat: [', str, '] hex内容格式错误');
                return 0;
            }
            var a = reverse ? str.reverseHex(reverse) : str;
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
            var s = this.toEvenLen(),
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
            var s = this.toEvenLen(),
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
        escapeHtml: function () {
            return $.escapeHtml(this);
        },
        unescapeHtml: function () {
            return $.unescapeHtml(this);
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
        },
        addClass: function(className, append) {
            var s = this;
            if ($.isBoolean(append, true)) {
                return s + (s ? ' ' : '') + className;
            }
            return s;
        }
    }, 'String.prototype');

    $.extendNative(String, {
        compare: function (s1, s2) { return s1.compareTo(s2); }
    }, 'String');

    //Boolean.prototype extend
    $.extendNative(Boolean.prototype, {
        toNumber: function () { return Number(this); }
    }, 'Boolean.prototype');

    function curHexStr(num, hex, len, cutoff) {
        if ($.isNumber(len)) {
            var tmp = hex.padLeft(len, '0'),
                c = tmp.length;
            if ($.isBoolean(cutoff, false)) {
                hex = tmp.substr(c - len);
                if (c > len) {
                    $.console.log('toHex:', num, '=>', tmp, ', cutoff[' + len + '] =>', hex);
                }
            } else {
                hex = tmp;
            }
            return hex;
        }
        return hex;
    }

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
        round: function (len, force) {
            var m = Math.pow(10, len || 0);
            return Math.round(this * m) / m;
        },
        max: function (num) {
            return Math.max(this, num);
        },
        padLeft: function (totalWidth, paddingChar) {
            var num = this;
            if (num % 1 !== 0 || num.toString().indexOf('.') > 0) {
                var arr = num.toString().split('.');
                return arr[0].padLeft(totalWidth, paddingChar) + '.' + (arr[1] || '');
            }
            return this.toString().padLeft(totalWidth, paddingChar); 
        },
        padRight: function (totalWidth, paddingChar) { 
            return this.toString().padRight(totalWidth, paddingChar); 
        },
        isDecimal: function () { return $.isDecimal(this); },
        isInteger: function () { return $.isInteger(this); },
        isFloat: function () { return $.isDecimal(this); },
        isInt: function () { return $.isInteger(this); },
        isHexNumber: function () { return $.isHexNumeric(this); },
        isNaN: function () { return isNaN(parseFloat(this, 10)); },
        toInt: function (defaultValue) { return $.toInteger(this.toString(), defaultValue); },
        toAscii: function () { return this.toString().charCodeAt(); },
        //cutoff: 是否截断长度（截断长度会带来一些问题，应在特定情况下谨慎使用）
        toHex: function (len, lower, cutoff) {
            var num = this, c, tmp,
                hex = curHexStr(num, num.toString(16), len, cutoff);
            return $.isBoolean(lower) ? (lower ? hex.toLowerCase() : hex.toUpperCase()) : hex;
        },
        toNum16: function (len, lower, cutoff) {
            return this.toHex(len, lower, cutoff);
        },
        //转换进制数
        toRadixNumber: function (len, lower, cutoff, radix) {
            if ($.isNumber(lower)) {
                radix = lower;
                lower = false;
            }
            var num = this, r = radix || 16,
                ns = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
                arr = [ns[num % radix]], hex = '';
            while (1) {
                if ((num = parseInt(num / r, 10)) / r < 1) {
                    arr.push(ns[num]);
                    break;
                }
                arr.push(ns[num % r]);
            }
            hex = arr.reverse().join('');
            hex = curHexStr(num, hex, len, cutoff);

            return $.isBoolean(lower) ? (lower ? hex.toLowerCase() : hex.toUpperCase()) : hex;
        },
        toRadixNum: function (len, lower, cutoff, radix) {
            return this.toRadixNumber(len, lower, cutoff, radix);
        },
        toNum36: function (len, lower, cutoff) {
            return this.toRadixNumber(len, lower, cutoff, 36);
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
        /*toNumberUnit: function (num, kn, unit, decimalLen, force, space) {
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
            return (force ? (m + n) : m) > 0 ? (m + n).round(decimalLen) + unit : num + (unit === 'KB' ? '字节' : '');
        },*/
        toFileSize: function (decimalLen, space, force) {
            if (typeof decimalLen === 'boolean') {
                force = space;
                space = decimalLen;
                decimalLen = 2;
            }

            var kb = 1024, num = this,
                units = ['字节', 'KB', 'MB', 'GB'],
                c = units.length, i = 0;

            while (num > kb && i < c) {
                num /= kb;
                i++;
            }
            return num.round(decimalLen) + (space ? ' ' : '') + units[i];
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
        toTimeStr: function (secondDecimalLen, daysUnit, timeUnits) {
            var seconds = this, us = timeUnits;
            if ($.isBoolean(daysUnit, false)) {
                us = daysUnit;
                daysUnit = '';
            }
            //当daysUnit===100时，显示完整的时间格式
            var complete = daysUnit === 100,
                dt = seconds.toTimeData(secondDecimalLen),
                units = $.isArray(us) ? [us[0] || '时', us[1] || '分', us[2] || '秒'] : $.isBoolean(us, false) ? ['时', '分', '秒'] : [],
                len = units.length;
                
            //当daysUnit===200时，以小时代替天数
            if (daysUnit === 200) {
                daysUnit = '';
                dt.h += dt.d * 24;
                dt.d = 0;
            }
            var time = [
                len ? (complete ? dt.h.padLeft(2) + units[0] : dt.h ? dt.h + units[0] : '') : dt.h.padLeft(2),
                len ? (complete ? dt.m.padLeft(2) + units[1] : dt.m ? dt.m + units[1] : '') : dt.m.padLeft(2),
                len ? (complete ? dt.s.padLeft(2) + units[2] : dt.s ? dt.s + units[2] : '') : dt.s.padLeft(2),
            ];
            if (complete) {
                daysUnit = '';
            }
            return (dt.d ? dt.d + (daysUnit || '天') : '') + time.join(len > 0 ? '' : ':');
        },
        toTimeArr: function (secondDecimalLen, daysUnit) {
            var seconds = this,
                data = seconds.toTimeData(secondDecimalLen),
                time = [
                    data.h.padLeft(2),
                    data.m.padLeft(2),
                    data.s.padLeft(2)
                ];

            return (data.d ? data.d + (daysUnit || '天') : '') + time.join(':');
        },
        toDurationStr: function(hideDays, timeUnits) {
            var seconds = this,
                data = seconds.toTimeData(0, hideDays),
                time = [
                    data.d,
                    data.h,
                    data.m,
                    data.s
                ],
                len = time.length,
                html = [],
                us = timeUnits,
                units = $.isArray(us) ? [us[0] || '天', us[1] || '小时', us[2] || '分钟', us[2] || '秒'] 
                    : $.isBoolean(us, false) ? ['天', '小时', '分钟', '秒'] : [' ', ':', ':'],
                complete = units.join('').replace(/[\s:]/g, '') === '',
                none = true, u = ':';

            for(var i = 0; i < len; i++) {
                if (time[i] || complete) {
                    if (i === 0 && hideDays) {
                        continue;
                    }
                    if (time[i]) {
                        none = false;
                    } else if (none) {
                        continue;
                    }
                    u = units[i] || (i < len - 1 ? ':' : '');
                    html.push((complete || u === ':' ? time[i].padLeft(2) : time[i]) + '' + u);
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
        },
        inArray: function (numArray) {
            var arr = $.isArray(numArray) ? numArray : $.isNumber(numArray) ? [numArray] : [];
            return arr.length > 0 ? arr.indexOf(this) > -1 : false;
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
            } else if (['date'].indexOf(formatString) >= 0) {
                formatString = 'yyyy-MM-dd';
            } else if (['dt'].indexOf(formatString) >= 0) {
                formatString = 'yyyyMMdd';
            } else if (['ds'].indexOf(formatString) >= 0) {
                formatString = 'yyyyMMddHHmmss';
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
        getYearStart: function () { return $.getYearStart(this); },
        getYearEnd: function () { return $.getYearEnd(this); },
        getMonthStart: function () { return $.getMonthStart(this); },
        getMonthEnd: function () { return $.getMonthEnd(this); },
        getDayStart: function () { return $.getDayStart(this); },
        getDayEnd: function () { return $.getDayEnd(this); },
        totalSeconds: function (milliseconds) {
            milliseconds = $.isBoolean(milliseconds, true);
            var dt = this,
                ts = dt.getHours() * 3600 + dt.getMinutes() * 60 + dt.getSeconds() + 
                    (milliseconds ? dt.getMilliseconds() / 1000 : 0);

            return ts;
        },
        dayStart: function(fmt) {
            var dt = this,
                ts = dt.getTime() / 1000 - dt.totalSeconds();

            if ($.isString(fmt)) {
                return ts.toDate().format(fmt);
            }
            return ts;
        },
        dayEnd: function(fmt) {
            var ts = this.dayStart() + 86400 - 1;

            if ($.isString(fmt)) {

            }
            return ts;
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

    var throwError = function (msg, str, args, matchFmtStr) {
        if ($.formatThrowError) {
            $.console.trace('[stirng format error]', msg, '\r\n', 'str:', str, ', arg:', args);
            throw new Error(msg);
        } else {
            $.console.trace('[stirng format error]', msg, '\r\n', 'str:', str, '\r\narg:', args);
        }
        return matchFmtStr;
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
    }, pushSeparateItem = function (arr, pr) {
        if (pr.list.length > 0) {
            arr.push(pr);
        }
        return arr;
    }, getItemTotalLen = function (arr, idx) {
        var c = 0;
        for (var i = idx; i < arr.length; i++) {
            var d = arr[i], ns = arr[i].list, t = '', n = 0;
            for (var j = 0; j < ns.length; j++) {
                t = ns[j];
                if (/[0-9A-Z]/gi.test(t)) {
                    n += ns[j].num36ToInt();
                }
            }
            if (d.loop > 0) {
                n *= d.loop;
            }
            c += n;
        }
        return c;
    }, isCutOff = function (t) {
        return ['|'].indexOf(t) > -1;
    }, isLineSeparate = function (vs, t) {
        if (['/','\\'].indexOf(t) > -1) {
            vs.push(t === '\\' ? '\n' : '<br />');
            return true;
        }
        return false;
    }, formatMultiSeparate = function (vc, ns, fu, str) {
        var vs = [], t = '', ve = '', arr = [], idx = 0, len = vc.length, elen = 0, i,
            symbol = fu === 'S' ? ' ' : fu,
            loop = 0, loopIdx = -1;

        if (ns.indexOf('[') < 0) {
            arr = [{ type: 0, list: ns.split(''), loop: 0 }];
        } else {
            var nc = ns.length, k = 0, n = 0, pos0, pos1, pr = {};
            while (k < nc) {
                pos0 = ns.indexOf('[');
                if (pos0 < 0) {
                    pushSeparateItem(arr, {type: 0, list: ns.split(''), loop: 0 });
                    break;
                }
                pr = {type: 0, list: ns.substr(0, pos0).split(''), loop: 0 };
                ns = ns.substr(pos0);
                k += pos0;
                pushSeparateItem(arr, pr);

                pos1 = ns.indexOf(']');
                if (pos1 < 0) {
                    pushSeparateItem(arr, {type: 0, list: ns.split(''), loop: 0 });
                    break;
                }
                pr = {type: 1, list: ns.substr(1, pos1 - 1).split(''), loop: 0 };
                ns = ns.substr(pos1 + 1);
                k += pos1;

                if (ns[0] === '<') {
                    pos1 = ns.indexOf('>');
                    if (pos1 < 0) {
                        ns = ns.substr(1);
                        k += 1;
                    } else {
                        //n = ns.substr(1, pos1 - 1).num36ToInt();
                        n = ns.substr(1, pos1 - 1).toInt();
                        pr.loop = n;
                        ns = ns.substr(pos1 + 1);
                        k += pos1;
                    }
                } else if(/([\d\/\|\[\\])/.test(ns[0]) || !ns) {
                    pr.loop = -1;
                    loop += 1;
                    loopIdx = arr.length;
                }
                pushSeparateItem(arr, pr);
            }
        }
        if (1 === loop) {
            elen = getItemTotalLen(arr, loopIdx + 1);
            ve = vc.substr(len - elen);
            vc = vc.substr(0, len - elen);
            len -= elen;
        }
        if ($.isDebug()) {
            $.console.log('formatMultiSeparate:', arr);
        }

        var rc = arr.length;
        for (i = 0; i < rc; i++) {
            if (idx >= len) {
                break;
            }
            var d = arr[i], dr = d.list, c = dr.length, j = 0, p = 0, pn = 0;
            if (c <= 0) {
                continue;
            }
            while (idx < len) {
                if (p >= c) {
                    if (j >= d.loop) {
                        if (d.loop >= 0) {
                            //如果没有无限循环，并且是最后一个规则，并且没有设置循环次数
                            if (!loop && i === rc - 1 && d.loop === 0) {
                                p = c - 1;
                            } else {
                                break;
                            }
                        } else {
                            p = 0;
                            //如果剩余内容长度小于无限循环长度规则，则中断
                            if (len - idx < dr[p].num36ToInt()) {
                                break;
                            }
                        }
                        j = 0;
                    } else {
                        p = 0;
                    }
                }
                t = dr[p++].toUpperCase();
                if (isCutOff(t)) {
                    return vs.join('').ellipsis(idx < len);
                } else if (!isLineSeparate(vs, t)) {
                    vs.push((idx > 0 ? symbol : '') + vc.substr(idx, (pn = t.num36ToInt())));
                    idx += pn;
                }
                j += p >= c ? 1 : 0;
            }
        }
        if (idx < len) {
            vs.push((idx > 0 ? symbol : '') + vc.substr(idx));
        }
        if (1 !== loop) {
            return vs.join('');
        }

        idx = 0;
        for (i = loopIdx + 1; i < rc; i++) {
            if (idx >= elen) {
                break;
            }
            var d = arr[i], dr = d.list, c = dr.length, j = 0, p = 0, pn = 0;
            if (c <= 0) {
                continue;
            }
            while (idx < elen) {
                if (p >= c) {
                    if (j >= d.loop) {
                        break;
                    } else {
                        p = 0;
                    }
                }
                t = dr[p++].toUpperCase();
                if (isCutOff(t)) {
                    return vs.join('').ellipsis(idx < elen);
                } else if (!isLineSeparate(vs, t)) {
                    vs.push((!vs.length ? '' : symbol) + ve.substr(idx, (pn = t.num36ToInt())));
                    idx += pn;
                }
                j += p >= c ? 1 : 0;
            }
        }
        return vs.join('');
    }, formatSeparate = function (vc, nv, fu, str, loop, freedom) {
        var arrS = nv.toString().split(''), arrL = [], arrE = [],
            ve = '', elen = 0, alen = 0, idx = 0, len = vc.length,
            symbol = fu === 'S' ? ' ' : fu,
            vs = [], t = '', i = 0, p = 0, pn = 0;

        if (loop) {
            var multi = nv.match(/(\[)/g);
            if (multi && (multi.length > 1) || (/(<)/g.test(nv))) {
                return formatMultiSeparate(vc, nv, fu, str);
            }
            var pos0 = nv.indexOf('['), pos1 = nv.indexOf('.'), elen = 0;
            if (pos0 >= 0) {
                arrS = nv.substr(0, pos0).split('');
                pos1 = nv.indexOf(']');
                arrL = nv.substr(pos0 + 1, pos1 - pos0 - 1).split('');
                arrL = arrL.length <= 0 ? [2] : arrL;
                arrE = nv.substr(pos1 + 1).split('');
            } else if (pos1 >= 0) {
                arrS = pos1 > 1 ? nv.substr(0, pos1 - 1).split('') : [];
                //若没有指定循环体大小，默认为2
                arrL = pos1 > 0 ? nv.substr(pos1 - 1, 1).split('') : [2];
                arrE = nv.substr(pos1 + 1).split('');
            }                    
            for (i = 0; i < arrE.length; i++) {
                elen += arrE[i].num36ToInt();
            }
            if (elen > 0) {
                ve = vc.substr(len - elen);
                vc = vc.substr(0, len - elen);
                len = vc.length;
            }
            alen = arrL.length;
        }
        if (arrS.length === 1 && alen <= 0) {
            return vc.separate(symbol, arrS[0].num36ToInt());
        }

        i = 0;
        while (idx < len) {
            if (i >= arrS.length) {
                break;
            }
            t = arrS[i++].toUpperCase();
            if (isCutOff(t)) {
                return vs.join('').ellipsis(idx < len)
            } else if (!isLineSeparate(vs, t)) {
                vs.push((idx > 0 ? symbol : '') + vc.substr(idx, (pn = t.num36ToInt())));
                idx += pn;
            }
        }
        if (idx >= len) {
            return vs.join('');
        }
        var spare = vc.substr(idx),
            slen = spare.length,
            cv = parseInt(slen / pn, 10);

        if (alen <= 0) {
            if (freedom && (slen % pn) < parseInt(pn / 2, 10)) {
                cv -= 1;
            }
            for (i = 0; i < cv; i++) {
                vs.push(symbol + spare.substr(p, pn));
                p += pn;
            }
            vs.push(p < slen ? symbol + spare.substr(p) : '');
            return vs.join('');
        }

        i = 0;
        while (idx < len) {
            if (i >= alen) {
                if (!loop) {
                    break;
                }
                i = 0;
            }
            t = ('' + arrL[i++]).toUpperCase();

            if (isCutOff(t)) {
                return vs.join('').ellipsis(idx < len);
            } else if (!isLineSeparate(vs, t)) {
                vs.push((idx > 0 ? symbol : '') + vc.substr(idx, (pn = t.num36ToInt())));
                idx += pn;
            }
            if (freedom && alen === 1 && len - idx < parseInt(pn / 2, 10)) {
                vs.push(vc.substr(idx));
                idx = len;
            }
        }
        if (ve.length > 0 && arrE.length > 0) {
            p = 0;
            for (i = 0; i < arrE.length; i++) {
                vs.push(symbol + ve.substr(p, (pn = arrE[i].num36ToInt())));
                p += pn;
            }
        }
        return vs.join('');
    }, formatNumberSwitch = function (v, f, nv, dn, err, str, args, freedom, loop) {
        var fu = f.toUpperCase(),
            numLen = dn[0].length, 
            decimalLen = (dn[1] || '').length,
            n = $.isNumber(nv) || /[\d]+/g.test(nv) ? parseInt(nv, 10) : (/[A-Z]/gi.test(nv) ? nv.num36ToInt() : 
                (fu === 'D' ? 0 : ['C', 'F', 'N'].indexOf(fu) > -1 && v === parseInt(v, 10) ? 0 : 2));

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
            case 'S':   //空格分隔符
            case '-':   //连接符分隔
            case ':':   //冒号分隔
            case '.':   //点号分隔
            case '_':   //下划线分隔
                v = formatSeparate(vc, nv, fu, str, loop, freedom);
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
            //C-货币，D-数字，E-科学计数，F-小数，G-标准数字，N-千位分隔，X-十六进制
            var p1 = /([BCDEFGNOPRSX%_\-\.\:])/gi,
                p2 = /([A-Z])/gi,
                //最后以(.或-)结尾的表示可以优化截取
                p3 = /^([BCDEFGNOPRSX%_\-\.\:][\dA-Z\/\|\\]+[\.\-]?)$/gi,
                p4 = /^([A-Z]{1}[\dA-Z]+)$/gi,
                //循环分隔, 分隔长度0-35(9+26), \\ 表示换行符\r\n, / 表示 <br />, | 表示截断(不显示之后的内容)
                p5 = /^([S_\-\.\:])([\dA-Z\/\|\\]{0,}?((\[[\dA-Z\/\|\\]{0,}\])(<[\d]+>)?|[.])[\dA-Z\/\|\\]{0,}?)+$/gi,
                //结尾是否自由组合，与p3规则配套使用
                freedom = ss.endsWith('.') || ss.endWith('-'),
                //是否循环分隔，与p5规则配套使用
                loop = p5.test(ss),
                nv, dn, n;

            if (loop) {
                nv = ss.substr(1);
                dn = v.toString().split('.');
                v = formatNumberSwitch(v, f, nv, dn, err, str, args, freedom, loop);
            } else if ((ss.length === 1 && p1.test(ss)) || (ss.length >= 2 && p3.test(ss))) {
                /*nv = parseInt(ss.substr(1), 10);
                dn = v.toString().split('.');
                n = isNaN(nv) ? (f.toUpperCase() === 'D' ? 0 : 2) : nv;
                */
                nv = ss.substr(1);
                dn = v.toString().split('.');

                //如果分隔规则以.结尾，表示可以优化分隔最后一组内容，不至于出现单吊的内容
                //比如 1234 1234 5 这样的，可以优化为 1234 12345
                v = formatNumberSwitch(v, f, nv, dn, err, str, args, freedom, loop);
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

    //字符串格式化错误时是否直接抛出异常
    //代码级异常，JS程序代码将中断执行
    $.formatThrowError = true;

    String.formatError = String.formatException = function (isThrowError) {
        if ($.isBoolean(isThrowError)) {
            $.formatThrowError = isThrowError;
            $.console.trace('[set] string format throw error: ', $.formatThrowError);
        } else if ($.isDebug()) {
            $.console.trace('[get] string format throw error: ', $.formatThrowError);
        }
        return $.formatThrowError;
    };

    String.isFormatError = String.isFormatException = function () {
        return String.formatError();
    };

    String.prototype.formatError = String.prototype.formatException = function (isThrowError) {
        String.formatError(isThrowError);
        return this;
    };

    /*
        字符串格式化
        默认没有容错，当字符串格式错误或参数异常时，抛出异常，以防止代码错误被隐藏。
        2024-01-25 增加了容错设计：
        当参数数量大于格式数量且最后一个参数为boolean值(且只能是true)时，允许容错，
        但是会在控制台输出一个异常信息以提醒开发人员，以便及时发现并更正错误
    */
    String.prototype.formats = function (args) {
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
        ],
        //是否抛出异常
        formatException = String.isFormatError();

        if (arguments.length > 1) {
            for (var i = 0, c = arguments.length; i < c; i++) {
                if (!$.isNullOrUndefined(arguments[i]) || !formatException) {
                    vals.push(arguments[i]);
                } else {
                    //\u7b2c 第
                    //\u4e2a\u53c2\u6570\u503c\u4e3a\uff1a 个参数值为：
                    var er = err[2] + '\u7b2c' + (i + 1) + '\u4e2a\u53c2\u6570\u503c\u4e3a\uff1a' + arguments[i];
                    vals.push(throwError(err, s, args, arguments[i]));
                }
            }
        } else if ($.isArray(args)) {
            vals = args;
        } else if (!$.isNullOrUndefined(args) || !formatException) {
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
        var vc = vals.length,
            mc = matchs.length,
            //若没有传递参数，则取window对象作为参数(对象)
            //obj = vc === 0 ? window : $.isObject(vals[0]) ? vals[0] : {},
            obj = vc === 0 ? (typeof window !== 'undefined' ? window : {}) : $.isObject(vals[0]) ? vals[0] : {},
            isObject = $.isObject(obj),
            isUrl = $.PATTERN.UrlParam.test(s),
            urlParamSymbolPattern = /[&#]/g,
            //是否允许容错
            //当参数数量大于格式符数量且最后一个参数为boolean值(且只能是true)时，允许容错
            faultTolerance = vc > mc && $.isBoolean(vals[vc - 1], false);

        for (var i = 0; i < mc; i++) {
            var m = matchs[i], 
                mv = m.replace(pattern, ''), 
                p = s.indexOf(m), 
                idx = parseInt(mv, 10),
                c = /{/g.test(m) ? m.match(/{/g).length : 0, 
                d = /}/g.test(m) ? m.match(/}/g).length : 0;

            if ((c + d) % 2 != 0) {
                throwError(err[0], s, vals);
            }
            var m2 = m.replace(/{{/g, '{').replace(/}}/g, '}'),
                odd = c % 2 != 0 || d % 2 != 0, single = c <= 2 && d <= 2;

            if (!isNaN(idx)) {
                var v = formatNumber(mv, vals[idx], err, s, vals);
                if ($.isBoolean(v) && !v) {
                    return false;
                }
                if (isUrl && urlParamSymbolPattern.test(v)) {
                    $.console.log('value: ', v);
                    v = encodeURIComponent(v);
                    $.console.log('value encode: ', v);
                }
                if (/^-\d$/g.test(mv) && odd) { 
                    v = throwError(err[0], s, vals, m); 
                } else if (idx >= vc && vc > 0) {
                    if (faultTolerance || !formatException) {
                        //容错机制：当只有1个字符格式时，匹配第1个参数
                        //否则原样显示格式字符
                        v = 1 === mc && vc <= (faultTolerance ? 2 : 1) ? vals[0] : m;
                        $.console.trace(err[1]);
                    } else {
                        throwError(err[1], s, vals); 
                    }
                }
                else if ($.isNullOrUndefined(v)) {
                    $.console.log('v:', v);
                    throwError(err[2], s, vals);
                }
                rst.push(s.substr(0, p) + (c > 1 || d > 1 ? (c % 2 != 0 || d % 2 != 0 ? m2.replace('{' + idx + '}', v) : m2) : v));
            } else if (odd) {
                if (c === 1 && d === 1) {
                    if (!isObject || !single) {
                        throwError(err[0], s, vals);
                    }
                    v = distillObjVal(mv, obj, err[0], s, vals);
                    if (isUrl && urlParamSymbolPattern.test(v)) {
                        $.console.log('value: ', v);
                        v = encodeURIComponent(v);
                        $.console.log('value encode: ', v);
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

    if ($.isUndefined(String.prototype.format)) {
        String.prototype.format = String.prototype.formats;
    }

    String.prototype.formatTo = function (fmt) {
        var con = this;
        fmt = (!$.isString(fmt, true) ? '{0}' : fmt).trim();
        $.console.log('[content]', con, '[format]', fmt);
        return (!fmt.startsWith('{') || !fmt.endWith('}')) ? con : fmt.format(con);
    };

    String.prototype.formatTest = function (con) {
        var fmt = this;
        $.console.log('[format]', fmt, '[content]', con);
        return fmt.format(con);
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

    //空白字符，用于分割样式，增加 ,;| 分割符
    var rnothtmlwhite = (/[^\x20\t\r\n\f,;\|]+/g),
        isAttributeValue = function (value) {
            return $.isString(value) || $.isNumber(value);
        },
        win = function () { try { return window } catch (e) { return null } }(),
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
        getFileSalt = function (filePath) {
            if (!filePath || typeof filePath !== 'string') {
                return '';
            }
            var pos = filePath.indexOf('?'),
                con = pos >= 0 ? filePath.substr(pos + 1) : '',
                arr = con.split('&'),
                len = arr.length;
            if (len > 0) {
                var tmp = arr[len - 1].split('=');
                return tmp[1] || tmp[0] || '';
            }
            return '';
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
        createFragment = function () {
            return doc.createDocumentFragment();
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
            if (!doc) {
                return '';
            }
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
                left = par.left,
                top = par.top;

            while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
                if (prevComputedStyle.position === 'fixed') {
                    break;
                }
                computedStyle = getElementStyle(elem);
                if (!computedStyle) {
                    break;
                }
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
            return isElement(elem = $.toElement(elem)) ? { 
                width: elem.clientWidth, height: elem.clientHeight 
            } : { width: 0, height: 0 };
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
                    top: elem.scrollTop, 
                    left: elem.scrollLeft, 
                    width: elem.scrollWidth, 
                    height: elem.scrollHeight,
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
                os = getOffsetSize(elem, basic),
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
            var scrollLeft = window.scrollX || window.pageXOffset || doc.scrollLeft,
                scrollTop = window.scrollY || window.pageYOffset || doc.scrollTop;

            var size = { 
                width: doc.clientWidth, height: doc.clientHeight, 
                scrollTop: scrollTop, scrollLeft: scrollLeft, 
                scrollWidth: doc.scrollWidth, scrollHeight: doc.scrollHeight 
            }, zoom = getZoomRatio();

            if (zoom < 50) {
                size.width -= 3;
            } else if (zoom < 75) {
                size.width -= 2;
            } else if (zoom > 100) {
                size.width -= 1;
            }

            return size;
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
        //topPriority:
        //relativePosition: 相对位置(弹出层中的表单)
        setPanelPosition = function (elem, panel, config) {
            var cfg = $.extend({
                    topPriority: false,
                    relativePosition: null,
                }, config),
                bs = $.getBodySize(),
                es = $.getOffset(elem, $.getParam(cfg, 'relativePosition,relative', false)),
                //选项框显示位置：0-下方，1-上方，2-中间（横跨，窗口高度不够导致）
                pos = 'bottom';

            panel.style.left = (es.left) + 'px';
            panel.style.width = (es.width) + 'px';
            
            //清除选项框高度
            panel.style.height = 'auto';
            //先显示在目标控件的下方
            panel.style.top = (es.top + es.height) + 'px';

            //再获取选项框尺寸位置
            var ds = $.getOffset(panel), top = ds.top;
            //如果选项框高度大于窗口高度，则限制选项框高度
            if (ds.height > bs.height) {
                ds.height = bs.height - 6;
                panel.style.height = ds.height + 'px';
            }

            var offset = ds.top + ds.height - (bs.height + bs.scrollTop);
            //如果选项框位置高度超过窗口高度，则显示在目标控件的上方
            if (offset > 0) {
                top = es.top - ds.height;
                panel.style.top = top + 'px';
                pos = 'top';

                //如果选项框位置窗口小于滚动高度，需要设置选项框位置和位置偏移
                if (top < bs.scrollTop) {
                    //保留4个像素的留白位置
                    var whiteSpace = 4;

                    if (cfg.topPriority) {
                        //设置了顶部优先，则显示在目标控件的上方
                        panel.style.top = (bs.scrollTop + whiteSpace) + 'px';
                    } else {
                        //默认显示在目标控件下方，并向上偏移，偏移量即之前超出窗口高度的值
                        panel.style.top = (es.top + es.height - offset - whiteSpace) + 'px';
                        pos = 'middle';
                    }
                }
            }
            return { 
                top: parseFloat(panel.style.top, 10).round(2), 
                left: parseFloat(panel.style.left, 10).round(2), 
                width: (parseFloat('0' + panel.style.width, 10) || panel.offsetWidth).round(2),
                height: (parseFloat('0' + panel.style.height, 10) || panel.offsetHeight).round(2),
                position: pos
            }
            //return this;
        },
        isArrayLike = function (obj) {
            if ($.isUndefinedOrNull(obj) || $.isString(obj) || $.isElement(obj)) {
                return false;
            } else if ($.isFunction(obj) || isWindow(obj)) {
                return false;
            }
            if ($.isArray(obj)) {
                return true;
            }
            var length = !!obj && 'length' in obj && obj.length;
            if (length > 0 && !$.isElement(obj[0])) {
                return false;
            }
            return length === 0 || $.isNumber(length) && length > 0 && (length - 1) in obj;
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
        getCssText = function (elem) {
            var arr = (elem.style.cssText || '').split(';'),
                obj = {};
            for (var i = 0; i < arr.length; i++) {
                var tmp = arr[i].split(':'), k = tmp[0].trim();
                if (k) {
                    obj[k] = (tmp[1] || '').trim();
                }
            }
            return obj;
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
                    cssText.push(i + ':' + ('' + val).trim());
                }
            }
            return cssText.join(';');
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
            if (elem.tagName === 'OPTION') {
                elem = elem.parentNode;
            }
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
            var arr = cur.trim().split(' '), p;
            if (action === true || action === 1 || 'add' === action) {
                if (arr.indexOf(css) < 0) {
                    arr.push(css);
                }
            } else if ((p = arr.indexOf(css)) > -1) {
                arr.splice(p, 1);
            }
            return arr.join(' ');
        },
        setElemClass = function (elem, css, action) {
            if (!$.isElement(elem) || '' === css) {
                return this;
            }
            var arr = elem.className.trim().split(' '), p;
            if (action) {
                if (arr.indexOf(css) < 0) {
                    arr.push(css);
                }
            } else if ((p = arr.indexOf(css)) > -1) {
                arr.splice(p, 1);
            }
            return elem.className = arr.join(' '), this;
        },
        setClass = function (elem, value, action) {
            if ($.isNullOrUndefined(elem)) {
                return this;
            }
            var elems = [];
            if (isArrayLike(elem)) {
                elems = makeArray(elem);
            } else if (!$.isArray(elem)) {
                elems = [elem];
            }
            for (var i = 0, c = elems.length; i < c; i++) {
                var classes = classesToArray(value), j = 0, curValue, cur, finalValue, css,
                    obj = $.toElement(elems[i]);
                if ($.isElement(obj) && classes.length > 0) {
                    if (obj.tagName === 'OPTION') {
                        obj = obj.parentNode;
                    }
                    curValue = getClass(elems[i]);
                    cur = obj.nodeType === 1 && stripAndCollapse(curValue).space();
                    if (cur) {
                        while ((css = classes[j++])) {
                            if ('toggle' === action) {
                                cur = setClassValue(cur, css, hasClass(obj, css) ? 'remove' : 'add');
                            } else {
                                cur = setClassValue(cur, css, action);
                            }
                        }
                        finalValue = stripAndCollapse(cur);
                        if (curValue != finalValue) {
                            obj.setAttribute('class', finalValue);
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
        replaceClass = function (elem, oldCss, newCss) {
            var arr = elem.className.split(' '), len = arr.length, list = [];
            for (var i = 0; i < len; i++) {
                list.push(arr[i] === oldCss ? newCss : arr[i]);
            }
            return elem.className = list.join(' '), this;
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
        loadLinkStyle = function (path, id, callback, postfix) {
            if ($.isFunction(id) && !$.isFunction(callback)) {
                postfix = callback;
                callback = id,
                id = null;
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
        loadJsScriptCss = function (jsPath, skin, func, jsName) {
            var path = jsPath,
                name = $.getFileName(path, true),
                salt = $.getFileSalt(path),
                arr = $.isString(skin, true) ? skin.split(',') : [''],
                dirRoot = $.getFilePath(path),
                dir = '';

            if (location.href.toLowerCase().startsWith('http')) {
                if ($.isString(jsName, true) && name.indexOf(jsName) < 0) {
                    return this;
                }
            }
            for (var i = 0; i < arr.length; i++) {
                dir = dirRoot + (arr[i] !== '' ? 'skin/' + arr[i] + '/' : '');
                $.loadLinkStyle(dir + name.replace('.min', '') + (salt ? '.css?' + salt : '.css'), function () {
                    if ($.isFunction(func)) {
                        func();
                    }
                });
            }
            return this;
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
            var elems = $.isArray(elem) ? elem : [$.toElement(elem)],
                events = $.isArray(evName) ? evName : evName.toString().split(','),
                name = isRemove ? 'removeEventListener' : 'addEventListener',
                other = isRemove ? 'detachEvent' : 'attachEvent',
                normal = typeof doc.addEventListener !== 'undefined';
            for (var i in events) {
                var evn = events[i];
                if (!$.isString(evn, true)) {
                    continue;
                }
                for (var j in elems) {
                    var o = $.toElement(elems[j]);
                    if (($.isElement(o) || $.isDocument(o) || $.isWindow(o)) && $.isFunction(func)) {
                        normal ? o[name](evn, func, useCapture || false) : o[other]('on' + evn, func);
                    }
                }
            }
            return this;
        },
        //键盘按键事件监听  keyCode 可以设置为 keyCode (数字) 如：70, 也可以设置 key（字符）, 如 F
        //可以作为快捷键
        addKeyListener2 = function (elem, evName, keyCode, func, isShiftKey) {
            if (!$.isDocument(elem) && !$.isElement(elem = $.toElement(elem))) {
                return false;
            }
            var evKey = 'keyEvTimes' + keyCode;
            //设置一个变量以记录按键次数
            elem[evKey] = 0;

            isShiftKey = $.isBoolean(isShiftKey, true);

            var callback = function (ev) {
                var e = ev || event, elem = this;
                if ((isShiftKey && !e.shiftKey) || !$.isFunction(func)) {
                    return false;
                }
                $.cancelBubble(ev);

                if (typeof keyCode === 'undefined') {
                    func(e, ++elem[evKey]);
                } else if (typeof keyCode === 'number' && e.keyCode === keyCode) {
                    $.console.log('KeyListener: ', e.keyCode);
                    func(e, ++elem[evKey], keyCode, e.key.toUpperCase());
                } else if (typeof keyCode === 'string' && keyCode.toUpperCase().indexOf(e.key.toUpperCase()) > -1) {
                    $.console.log('KeyListener: ', e.keyCode, e.key, keyCode);
                    func(e, ++elem[evKey], keyCode, e.key.toUpperCase());
                }
            };
            return $.addEventListener(elem, evName, callback), this;
        },
        addKeyListener = function (elem, evName, keyCode, func, isShiftKey) {
            if (!$.isDocument(elem) && !$.isElement(elem = $.toElement(elem))) {
                return false;
            }
            var codes = [];
            if (typeof keyCode === 'function') {
                isShiftKey = func;
                func = keyCode;
                codes = [undefined];
            } else {
                codes = $.isArray(keyCode) ? keyCode : [keyCode];
            }
            for (var i = 0; i < codes.length; i++) {
                addKeyListener2(elem, evName, codes[i], func, isShiftKey);
            }
            return this;
        },
        addHitListener2 = function (elem, evName, keyCode, func, timeout, times, isShiftKey) {
            if (!$.isDocument(elem) && !$.isElement(elem = $.toElement(elem))) {
                return false;
            }
            //设置一个变量以记录按键次数
            var keyCount = evName + (keyCode || '') + 'HitCount',
                keyTimes = evName + (keyCode || '') + 'HitTimes';
            elem[keyCount] = 1;
            elem[keyTimes] = 0;

            isShiftKey = $.isBoolean(isShiftKey, false);
            timeout = timeout || 3000;
            times = times || 5;

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
                if (elem[keyCount] == 1 || (elem[keyCount] > 1 && tc > timeout)) {
                    elem[keyCount] = 1;
                    elem[keyTimes] = ts;
                    tc = ts - elem[keyTimes];
                }
                $.console.log('HitListener: ', evName.append(e.keyCode, ':'), e.keyCode || '', elem[keyCount], tc);
                if (elem[keyCount] >= times) {
                    try { func(e, elem[keyCount], e.keyCode || '', (e.key || '').toUpperCase()); } catch (ex) { }
                    elem[keyCount] = 1;
                    elem[keyTimes] = 0;
                    //elem['keyCode'] = null;
                    return false;
                }
                elem[keyCount] = tc < timeout ? elem[keyCount] + 1 : 1;
            };

            return $.addEventListener(elem, evName, callback), this;
        },
        //键盘或鼠标连击事件监听
        //连续快速点击某个控件元素或连续快速输入某个键位值
        //默认连续次数为5次
        addHitListener = function (elem, evName, keyCode, func, timeout, times, isShiftKey) {
            if (!$.isDocument(elem) && !$.isElement(elem = $.toElement(elem))) {
                return false;
            }
            var codes = [];
            if (typeof keyCode === 'function') {
                isShiftKey = times;
                times = timeout;
                timeout = func;
                func = keyCode;
                codes = [undefined];
            } else {
                codes = $.isArray(keyCode) ? keyCode : [keyCode];
            }
            if ($.isObject(timeout)) {
                var par = $.extend({
                    timeout: 3000,
                    times: times || 5,
                    shiftKey: $.isBoolean(isShiftKey, false)
                }, timeout);
                timeout = par.timeout;
                times = par.times;
                isShiftKey = $.getParam(par, 'shiftKey,shift');
            } else if ($.isBoolean(timeout)) {
                isShiftKey = timeout;
                timeout = 0;
                times = 0;
            } else if ($.isBoolean(times)) {
                isShiftKey = times;
                times = 0;
            }
            for (var i = 0; i < codes.length; i++) {
                addHitListener2(elem, evName, codes[i], func, timeout, times, isShiftKey);
            }
            return this;
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
            return addEventListener(elem, evName, func, useCapture, isRemove), this;
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
        getEventPosition = function (ev, elem) {
            var e = ev || getEvent();
            if (e.pageX || e.pageY) {
                return { 
                    x: e.pageX, 
                    y: e.pageY
                };
            }
            var scroll = getScrollPosition();
            return {
                x: e.clientX + scroll.left - document.body.clientLeft,
                y: e.clientY + scroll.top - document.body.clientTop
            };
        },
        isInViewport = function (elem, box, strict) {
            if (!strict) {
                if (!$.isElement(elem = $.toElement(elem))) {
                    return null
                }
                box = $.isElement(box = $.toElement(box)) ? box : elem.parentNode;
            }
            var es = elem.getBoundingClientRect(),
                bs = box.getBoundingClientRect();

            //$.console.log('es:', es, ', bs:', bs);
            return es.top >= bs.top && es.top + es.height <= bs.top + bs.height;
        },
        scrollTo = function (elem, pnode, offsetY, force) {
            if ($.isString(elem, true)) {
                elem = $.toElement(elem);
            }
            if (!$.isElement(elem)) {
                if ($.isElement(pnode = $.toElement(pnode))) {
                    pnode.scrollTop = 0;
                }
                return $;
            }
            if ($.isBoolean(offsetY) && !$.isBoolean(force)) {
                force = offsetY;
                offsetY = 0;
            }
            force = $.isBoolean(force, false);

            var parent = $.isElement(pnode = $.toElement(pnode)) ? pnode : elem.parentNode;
            if (!force && isInViewport(elem, parent, true)) {
                return $;
            }
            var offset = $.getOffset(elem),
                offsetP = $.getOffset(parent),
                posH = offset.top - offsetP.top;

            //$.console.log('scrollTo:', elem, parent, offset, offsetP, 'posH', posH);

            parent.scrollTop += posH + (offsetY || 0);

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
        isCtrlKey = function (ev, keys) {
            //若keys==true，则表示只验证是否是ctrlKey
            if ($.isBoolean(keys, false)) {
                return ev.ctrlKey;
            }
            var ks = $.isArray(keys) ? keys : $.isString(keys, true) ? keys.split(/[,;\|]/g) : null;
            if ($.isArray(keys) && keys.length > 0) {
                for (var i = 0; i < ks.length; i++) {
                    if (ev[ks[i]]) {
                        return true;
                    }
                }
            }
            return ev.ctrlKey || ev.shiftKey || ev.altKey;
        },
        getContentSize = function (txt, options) {
            if (!$.isObject(options)) {
                options = {};
            }
            var id = options.id || 'div-get-content-size-001',
                css = [
                    ';margin:0;padding:0;line-height:1em;position:absolute;top:-3000px;left:-5000px;',
                    'font-size:14px;font-family:Arial,宋体,微软雅黑;'
                ],
                div = document.getElementById(id);

            if (!div) {
                div = document.createElement('div');
                div.id = id;
                document.body.appendChild(div);
            }
            if ($.isString(options.className, true)) {
                div.className = options.className;
            }
            if ($.isString(options.cssText, true)) {
                css.push(options.cssText);
            }
            div.style.cssText = css.join('');
            div.innerHTML = txt;
            var size = { width: div.offsetWidth, height: div.offsetHeight };
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
            function _onElement(elem, ev) {
                if (!isElement(elem = toElement(elem)) || !ev) {
                    return false;
                }
                var pos, scroll;
                if (ev.fromElement || typeof ev.x === 'undefined') {
                    pos = getEventPosition(ev);
                } else {
                    scroll = getScrollPosition();
                    pos = { x: ev.x + scroll.left, y: ev.y + scroll.top };
                }
                if (isOnElem(elem, pos)) {
                    return true;
                }
                /*
                var childs = elem.childNodes;
                for (var i = 0; i < childs.length; i++) {
                    var sub = childs[i];
                    if (sub.childNodes.length > 0) {
                        return isOnElement(sub, pos);
                    } else if (isOnElem(sub, pos)) {
                        return true;
                    }
                }
                */
                //不再采用递归
                var childs = elem.querySelectorAll('*'),
                    c = childs.length, k, i, j, m, n;

                //若子元素数量超过8个，则每次同时比较4个元素
                //比较方向：开始向右，结束向左，中间向左，中间向右
                if (c >= 8) {
                    k = Math.ceil(c / 4);
                    for (i = 0; i < k; i++) {
                        j = k * 4 - 1 - i;
                        j = j >= c ? c - 1 : j;
                        m = k * 2 + i,
                        n = k * 2 - 1 - i;
                        if (isOnElem(childs[i], pos) || isOnElem(childs[j], pos) || isOnElem(childs[m], pos) || isOnElem(childs[n], pos)) {
                            return true;
                        }
                    }
                } else {
                    //每次同时比较2个元素
                    k = Math.ceil(c / 2);
                    for (i = 0; i < k; i++) {
                        j = k * 2 - 1 - i;
                        j = j >= c ? c - 1 : j;
                        if (isOnElem(childs[i], pos) || isOnElem(childs[j], pos)) {
                            return true;
                        }
                    }
                }
                return false;
            }

            var elems = $.isArray(elem) ? elem : [elem];
            for(var i = 0; i < elems.length; i++) {
                if (_onElement(elems[i], ev)) {
                    return true;
                }
            }
            return false;
        },
        isInElement = function (elem, ev) {
            function _inElement(elem, ev) {
                if (!isElement(elem = toElement(elem)) || !ev) {
                    return false;
                }
                var t = ev.target;
                if (!$.isElement(t)) {
                    return false;
                } else if (elem === t) {
                    return true;
                }
                var childs = elem.querySelectorAll('*'),
                    c = childs.length, k, i, j, m, n;

                if (c >= 8) {
                    k = Math.ceil(c / 4);
                    for (i = 0; i < k; i++) {
                        j = k * 4 - 1 - i;
                        j = j >= c ? c - 1 : j;
                        m = k * 2 + i,
                        n = k * 2 - 1 - i;
                        if (childs[i] === t || childs[j] === t || childs[m] === t || childs[n] === t) {
                            return true;
                        }
                    }
                } else {
                    k = Math.ceil(c / 2);
                    for (i = 0; i < k; i++) {
                        j = k * 2 - 1 - i;
                        j = j >= c ? c - 1 : j;
                        if (childs[i] === t || childs[j] === t) {
                            return true;
                        }
                    }
                }
                return false;
            }
            var elems = $.isArray(elem) ? elem : [elem];
            for(var i = 0; i < elems.length; i++) {
                if (_inElement(elems[i], ev)) {
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
            } else if ($.isArrayLike(elem)) {
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
                //dt.setTime(dt.getTime() + (8 * 60 * 60 * 1000) + expireMinutes * 60 * 1000);
                dt.setTime(dt.getTime() + expireMinutes * 60 * 1000);
                //$.console.log('setCookie:', name, dt, dt.toGMTString());
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
                    //console.log('getImgRealSize: ', par);
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
                    //console.log('getImgSize: ', par);
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
            } else {
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
            }
            if (!$.isNullOrUndefined(curVal)) {
                elem.value = curVal;
            }
            return this;
        },
        buildOption = function (value, text) {
            return '<option value="' + value + '">' + text + '</option>';
        },
        buildOptions = function (list, minVal, maxVal, stepVal, curVal, valUnit, valText) {
            var html = [];
            if ($.isNumber(list)) {
                valText = valUnit;
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
                    html.push([
                        '<option value="', i, '"', selected, '>', valText || '', i, valUnit || '', '</option>'
                    ].join(''));
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
                html.push([
                    '<option value="', val, '"', selected, '>', valText || '', txt, valUnit || '', '</option>'
                ].join(''));
            }
            return html.join('');
        },
        buildNumbers = function (list, minVal, maxVal, stepVal) {
            var arr = [];
            if ($.isNumber(list)) {
                stepVal = maxVal;
                maxVal = minVal;
                minVal = list;
                list = null;
            } else if ($.isArray(list)) {
                arr = $.extend([], list);
            }
            if ($.isNumber(minVal) && $.isNumber(maxVal)) {
                stepVal = stepVal || 1;
                for (var i = minVal; i <= maxVal; i += stepVal) {
                    arr.push(i);
                }
            }
            return arr;
        },
        clearEmptyItem = function (list) {
            var arr = $.isArray(list) ? list : [list],
                len = arr.length;
            if (len <= 1) {
                return arr;
            }
            var rst = [];

            for (var i = 0; i < len; i++) {
                if (arr[i] !== '') {
                    rst.push(arr[i]);
                }
            }
            return rst;
        },
        execFullScreen = function(evt, elem, full) {
            if (typeof evt !== 'undefined' && evt) {
                evt.call(elem);
                if ($.isFunction(window.fullScreenCallback)) {
                    window.fullScreenCallback(full);
                }
                return this;
            }
            if (typeof window.ActiveXObject !== 'undefined') {
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript) {
                    wscript.SendKeys("{F11}");
                }
            }
            if ($.isFunction(window.fullScreenCallback)) {
                window.fullScreenCallback(full);
            }
            return this;
        },
        fullScreen = function (elem) {
            if (!$.isDocument(elem) && !$.isElement(elem = $.toElement(elem))) {
                return this;
            }
            var rfs = elem.requestFullScreen || 
                elem.webkitRequestFullScreen || 
                elem.mozRequestFullScreen || 
                elem.msRequestFullScreen;
            
            return execFullScreen(rfs, elem, true), this;
        },
        exitFullScreen = function () {
            var elem = document,
                cfs = elem.cancelFullScreen || 
                elem.webkitCancelFullScreen || 
                elem.mozCancelFullScreen || 
                elem.exitFullScreen;
            
            return execFullScreen(cfs, elem, false), this;
        },
        getFullScreenElement = function () {
            return document.fullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullScreenElement ||
                document.msFullScreenElement;
        },
        isFullScreen = function () {
            return getFullScreenElement() !== undefined;
        },
        addFullScreenListener = function (callback) {
            if (!$.isFunction(callback)) {
                return this;
            }
            document.addEventListener('fullscreenchange', callback);
            document.addEventListener('mozfullscreenchange', callback); 
            document.addEventListener('webkitfullscreenchange', callback);
            document.addEventListener('MSFullscreenChange', callback);

            return this;
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
        escapeHtml = function (str, singleQuote) {
            if (!str) { return str; }
            var keys = { '<': 'lt', '>': 'gt', ' ': 'nbsp', '&': 'amp', '"': 'quot', '\'': '#39' };
            return str.replace(/([<>\s&"'])/ig, function (all, t) { return '&' + keys[t] + ';'; });
        },
        unescapeHtml = function (str) {
            if (!str || !/[&;]/g.test(str)) { return str; }
            var keys = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"', '#39': '\'' };
            return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return keys[t]; });
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
            /*
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
            */
            if ($.isString(str)) {
                return _decode(str);
            } else if ($.isObject(str)) {
                if (!$.isArray(keys)) {
                    keys = (keys ? '' + keys : '').splitStr(/[,|]/g);
                }
                var hasKey = keys.length > 0 && keys[0];
                for (var k in str) {
                    if ((!hasKey || keys.indexOf(k) > -1) && $.isString(str[k], true)) {
                        str[k] = unescapeHtml(str[k]);
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
        };

    var browser = {
        ua: function () { try { return navigator.userAgent; } catch (e) { return ''; } },
        getua: function (ua) { return (ua || browser.ua()).toLowerCase(); },
        isFirefox: function (ua) { ua = browser.getua(ua); return ua.indexOf('firefox/') > -1; },
        isEdge: function (ua) { ua = browser.getua(ua); return ua.indexOf('edge/') > -1 || ua.indexOf('edg/') > -1; },
        isOpera: function (ua) { ua = browser.getua(ua); return ua.indexOf('opera/') > -1 || ua.indexOf('opr/') > -1; },
        isSafari: function (ua) { ua = browser.getua(ua); return ua.indexOf('safari/') > -1 && ua.indexOf('chrome/') < 0; },
        isIE: function (ua) { ua = browser.getua(ua); return ua.indexOf('trident/') > -1 || (ua.indexOf('msie') > -1 && ua.indexOf('compatible') > -1); },
        isChrome: function (ua) { ua = browser.getua(ua); return ua.indexOf('chrome/') > -1 && !browser.isOpera(ua) && !browser.isEdge(ua) && !browser.isSafari(ua); },
        isWap: function (ua) { ua = browser.getua(ua); return /android|webos|iphone|ipod|ipad|blackberry/i.test(ua); },
        isWechar: function (ua) { ua = browser.getua(ua); return /micromessenger/i.test(ua); },
        isMobile: function (ua) { return browser.isWap(ua); }
    };
    var ua = function () { try { return navigator.userAgent.toLowerCase(); } catch (e) { return ''; } }(),
        //mc = ua.match(/([A-Z]+)\/([\d\.]+)/ig) || [], ut = mc.join('_').replace(/\//g,''),
        isFirefox = ua.indexOf('firefox/') > -1,
        isEdge = ua.indexOf('edge/') > -1 || ua.indexOf('edg/') > -1,
        isOpera = ua.indexOf('opera/') > -1 || ua.indexOf('opr/') > -1,
        isSafari = ua.indexOf('safari/') > -1 && ua.indexOf('chrome/') < 0,
        isChrome = !isOpera && !isEdge && !isSafari && ua.indexOf('chrome/') > -1,
        isIE = ua.indexOf('trident/') > -1 || (ua.indexOf('msie') > -1 && ua.indexOf('compatible') > -1),
        isWap = /android|webos|iphone|ipod|ipad|blackberry/i.test(ua),
        isWechar = /micromessenger/i.test(ua),
        ieVersion = isIE ? parseFloat('0' + (ua.match(/(msi\s|rv:)([\d\.]+)[;]?/) || [])[2], 10) : 0;
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
        getFileSalt: getFileSalt,
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
        createFragment: createFragment,
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
        setPanelPosition: setPanelPosition,
        isArrayLike: isArrayLike,
        merge: merge,
        makeArray: makeArray,
        getAttribute: getAttribute,
        setAttribute: setAttribute,
        removeAttribute: removeAttribute,
        delAttribute: removeAttribute,
        getCssText: getCssText,
        toCssText: toCssText,
        setStyle: setStyle,
        setElemClass: setElemClass,
        setClass: setClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        replaceClass: replaceClass,
        getClass: getClass,
        hasClass: hasClass,
        appendChild: appendChild,
        removeChild: removeChild,
        removeElement: removeElement,
        loadLinkStyle: loadLinkStyle,
        loadJsScript: loadJsScript,
        loadJsScriptCss: loadJsScriptCss,
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
        isInViewport: isInViewport,
        isInViewPort: isInViewport,
        scrollTo: scrollTo,
        getKeyCode: getKeyCode,
        getKeyChar: getKeyChar,
        isCtrlKey: isCtrlKey,
        getContentSize: getContentSize,
        getInnerText: getInnerText,
        isOnElement: isOnElement,
        isInElement: isInElement,
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
        buildNumbers: buildNumbers,
        clearEmptyItem: clearEmptyItem,
        fullScreen: fullScreen,
        exitFullScreen: exitFullScreen,
        isFullScreen: isFullScreen,
        getFullScreenElement: getFullScreenElement,
        getFullScreenElem: getFullScreenElement,
        addFullScreenListener: addFullScreenListener,
        isSubWindow: isSubWindow,
        isTopWindow: isTopWindow,
        setSelectValue: setSelectValue,
        splitStr: splitStr,
        removeEmptyLine: removeEmptyLine,
        filterHtmlCode: filterHtmlCode,
        filterHtml: filterHtmlCode,
        encodeHtml: encodeHtml,
        decodeHtml: decodeHtml,
        escapeHtml: escapeHtml,
        unescapeHtml: unescapeHtml
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
        },
        timers = {};

    $.extendNative($, {
        setTimeout: function (func, delay, key) {
            if ($.isString(key, true)) {
                if (timers[key]) {
                    window.clearTimeout(timers[key]);
                    timers[key] = null;
                }
                timers[key] = window.setTimeout(func, delay);
            } else {
                window.setTimeout(func, delay);
            }
            return this;
        },
        delTimeout: function (key) {
            if ($.isString(key, true)) {
                if (timers[key]) {
                    window.clearTimeout(timers[key]);
                    timers[key] = null;
                }
            }
            return this;
        },
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
            } else if (elem.createTextRange) {
                var range = elem.createTextRange();
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
            $.setTextCursorPosition2(elem, pos, len);
            return this;
        },
        getSelectedText: function (elem) {
            if (!$.isElement(elem = $.toElement(elem))) {
                return '';
            }
            if (elem.selectionStart || elem.selectionStart === 0) {
                return elem.value.substring(elem.selectionStart, elem.selectionEnd);
            } else if (document.selection) {
                obj.focus();
                return document.selection.createRange().text;
            }
            return '';
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
            var s = attributeName.split(/[,|;]/), n = s.length;
            for (var i = 0; i < n; i++) {
                if (s[i] === 'value') {
                    elem.value = value;
                } if (s[i] === 'val') {
                    elem.val = value;
                } else if (s[i]) {
                    elem.setAttribute(s[i], value);
                }
            }
            return this;
        },
        setElementValue: function (elements, values, attributeName, sameValue) {
            var isAttribute = $.isString(attributeName);
            if (!$.isString(attributeName)) {
                attributeName = 'value,val';
            }
            var elems = ($.isArray(elements) || $.isArrayLike(elements)) ? elements : [elements],
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
            if (!elem) {
                return 0;
            }
            var size = $.getElementSize(elem)[key];
            if (window.getZoomRatio() < 100 && key.toString().toLowerCase() === 'width') {
                var w = parseFloat(elem.style.width || 0, 10);
                if (w && w !== parseInt(w, 10)) {
                    size += 1;
                }
            }
            return size;
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
        checked: function (checked) {
            var elem = this[0] || {},
                chb = elem.tagName === 'INPUT' && ['checkbox', 'radio'].indexOf(elem.type) > -1;
            if ($.isBoolean(checked)) {
                if (chb) {
                    elem.checked = checked;
                }
                return this;
            }
            return chb ? elem.checked : false;
        },
        show: function () {
            return this[0] ? this[0].style.display = '' : null, this;
        },
        hide: function () {
            return this[0] ? this[0].style.display = 'none' : null, this;
        },
        display: function (show, recursion) {
            if ($.isBoolean(show)) {
                if (show) {
                    $.fn.show();
                } else {
                    $.fn.hide();
                }
            } else {
                //return this[0] ? this[0].style.display !== 'none' : false;
                return $.isDisplay(this[0], recursion);
            }
            return this;
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
        return '[' + new Date().format(formatstring || _tf) + ']' + (type ? '[' + type + ']' : '');
    }, _tf = 'log', isie = $.browser.isIE();

    $.extendNative($, {
        console: {
            timeformat: function (formatstring) {
                return _tf = formatstring, this;
            },
            tf: function (formatstring) {
                return this.timeformat(formatstring);
            },
            log: function () {
                return !isie ? console.log.apply(this, getArguments(arguments, log(null))) : console.log(log(null), arguments), this;
            },
            info: function () {
                return !isie ? console.info.apply(this, getArguments(arguments, log('i'))) : console.info(log('i'), arguments), this;
            },
            warn: function () {
                return !isie ? console.warn.apply(this, getArguments(arguments, log('w'))) : console.warn(log('w'), arguments), this;
            },
            debug: function () {
                return !isie ? console.log.apply(this, getArguments(arguments, log('d'))) : console.log(log('d'), arguments), this;
            },
            error: function () {
                return !isie ? console.error.apply(this, getArguments(arguments, log('e'))) : console.error(log('e'), arguments), this;
            },
            err: function () {
                return !isie ? console.error.apply(this, getArguments(arguments, log('e'))) : console.error(log('e'), arguments), this;
            },
            trace: function () {
                return !isie ? console.trace.apply(this, getArguments(arguments, log('t'))) : console.trace(log('t'), arguments), this;
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
        },
        hidePopupPanel: function (exceptElement) {
            var panels = document.querySelectorAll('div.oui-popup-panel');
            for (var i = 0; i < panels.length; i++) {
                if (panels[i] !== exceptElement) {
                    if ($.isFunction(panels[i].hide)) {
                        panels[i].hide();
                    } else {
                        panels[i].style.display = 'none';
                    }
                }
            }
            return this;
        }
    });
}(OUI);

/*
$.debounce
*/
!function ($) {
    'use strict';

    var Cache = {
        debounces: {}
    };

    var Factory = {
        buildDebounce: function (options, callback) {
            if ($.isFunction(options)) {
                callback = options;
                options = {};
            }
            var opt = $.extend({ id: 'debounce' }, options);
            if ($.isFunction(callback)) {
                opt.callback = callback;
            }
            var cache = Factory.getCache(opt.id);
            if (cache !== null) {
                return cache.debounce.initial($.extend(cache.options, opt));
            } else {
                return new Debounce(opt);
            }
        },
        initCache: function (debounce, options) {
            var key = 'debounce-' + debounce.id;
            Cache.debounces[key] = {
                id: debounce.id,
                debounce: debounce,
                options: options
            };
            return this;
        },
        updateCache: function (debounce, options) {
            var key = 'debounce-' + debounce.id;
            $.extend(Cache.debounces[key], options);
            return this;
        },
        getCache: function (id) {
            var key = 'debounce-' + id;
            return Cache.debounces[key] || null;
        },
        isFirst: function (debounce, timeout) {
            var ts = new Date().getTime();
            //上次点击若超过5秒钟，则不启用延时
            if (!debounce.lastTime || (ts - debounce.lastTime > timeout)) {
                return debounce.lastTime = ts, true;
            }
            return false;
        },
        isChange: function(debounce, key) {
            if (key !== debounce.lastKey) {
                debounce.lastKey = key;
                return true;
            }
            return false;
        }
    };

    function Debounce(options) {
        var opt = $.extend({
            id: 'debounce',
            enable: true,
            //延时时长，默认300毫秒
            delay: 300,
            //防抖时限，默认5000毫秒
            timeout: 5000,
            //用于判断接口参数是否有更改
            key: '',
            callback: function () {
                console.log('debounce: ');
            }
        }, options);

        this.id = opt.id;
        this.timer = null;
        this.lastTime = 0;
        this.lastKey = '';

        this.initial(opt);
    }

    Debounce.prototype = {
        initial: function (opt) {
            Factory.initCache(this, opt);

            return this.callback(opt);
        },
        callback: function (opt) {
            if (!opt.enable || !opt.delay) {
                if ($.isFunction(opt.callback)) {
                    opt.callback();
                }
            } else {
                this.delayCallback(opt);
            }
            return this;
        },
        delayCallback: function (opt) {
            var _ = this;
            var func = opt.callback;
            if (!$.isFunction(func)) {
                return _;
            }
            if (!opt.delay || !opt.timeout 
                || Factory.isChange(_, opt.key) 
                || Factory.isFirst(_, opt.timeout)) {
                return func(), _;
            }
            if (_.timer) {
                window.clearTimeout(_.timer);
            }
            _.timer = window.setTimeout(function () {
                func();
            }, opt.delay);

            return _;
        }
    };

    $.extend($, {
        debounce: function (options, callback) {
            return Factory.buildDebounce(options, callback);
        }
    });
}(OUI);

/*
    判断HTML元素是否被（上级元素）遮挡
*/
!function ($) {
    'use strict';
    /**
    * 获取目标元素的视口矩形
    * @param {HTMLElement} elem 目标DOM元素
    * @returns {DOMRect|null} 元素矩形信息
    */
    function getTargetElementRect(elem) {
        if (!(elem instanceof HTMLElement)) {
            //console.error("参数必须是有效的HTMLElement");
            return null;
        }
        // 若元素本身display: none或visibility: hidden，直接返回不可见
        const style = window.getComputedStyle(elem);
        if (style.display === "none" || style.visibility === "hidden") {
            //console.warn("目标元素本身不可见");
            return null;
        }
        return elem.getBoundingClientRect();
    }

    /**
    * 判断HTML元素是否存在滚动条
    * @param {HTMLElement} element 目标DOM元素
    * @param {string} direction 可选，滚动条方向：'vertical'（垂直，默认）/'horizontal'（水平）
    * @returns {boolean} 是否存在对应方向的滚动条
    */
    function hasScrollbar(elem, direction) {
        if (!(elem instanceof HTMLElement)) {
            //console.error("参数必须是有效的HTMLElement");
            return false;
        }
        const style = window.getComputedStyle(elem);
        let hasScroll = false;

        if (direction === 'horizontal') {
            // 水平滚动条判断：内容宽度 > 可视宽度，且overflow允许水平滚动
            const overflowX = style.overflowX || style.overflow;
            const isScrollAllowed = ['auto', 'scroll'].includes(overflowX);
            hasScroll = elem.scrollWidth > elem.clientWidth && isScrollAllowed;
        } else {
            // 垂直滚动条判断：内容高度 > 可视高度，且overflow允许垂直滚动
            const overflowY = style.overflowY || style.overflow;
            const isScrollAllowed = ['auto', 'scroll'].includes(overflowY);
            hasScroll = elem.scrollHeight > elem.clientHeight && isScrollAllowed;
        }
        return hasScroll;
    }

    /**
    * 获取HTML元素滚动条的尺寸（宽度/高度）
    * @param {HTMLElement} element 目标DOM元素
    * @param {string} direction 可选，滚动条方向：'vertical'（垂直，默认）/'horizontal'（水平）
    * @returns {number} 滚动条尺寸（像素值，无对应滚动条返回0）
    */
    function getScrollbarSize(elem, direction) {
        // 先判断是否存在对应方向的滚动条，不存在直接返回0
        if (!hasScrollbar(elem, direction)) {
            return 0;
        }

        let scrollbarSize = 0;
        if (direction === 'horizontal') {
            // 水平滚动条高度 = 元素整体高度 - 可视区域高度（offsetHeight - clientHeight）
            scrollbarSize = elem.offsetHeight - elem.clientHeight;
        } else {
            // 垂直滚动条宽度 = 元素整体宽度 - 可视区域宽度（offsetWidth - clientWidth）
            scrollbarSize = elem.offsetWidth - elem.clientWidth;
        }

        // 兼容极端场景（差值为负数或0），返回合理值
        return Math.max(0, Math.round(scrollbarSize));
    }

    /**
    * 计算单个父元素的可见区域矩形（相对于视口）
    * @param {HTMLElement} elem 父级DOM元素
    * @returns {DOMRect} 父元素的可见区域矩形
    */
    function getParentVisibleRect(elem) {
        let rect = elem.getBoundingClientRect(), style = {};
        if (elem.tagName !== "BODY" && elem.tagName !== 'HTML') {
            style = window.getComputedStyle(elem);
        }

        // 父元素的内边距（影响可见区域）
        const p = {
            left: parseFloat(style.paddingLeft) || 0,
            top: parseFloat(style.paddingTop) || 0,
            right: parseFloat(style.paddingRight) || 0,
            bottom: parseFloat(style.paddingBottom) || 0
        };
        // 计算父元素内容区域的可见矩形（排除内边距、滚动条）
        const v = {
            left: rect.left + p.left,
            top: rect.top + p.top,
            //right: rect.right - p.right - elem.scrollLeft,
            right: rect.right - p.right - getScrollbarSize(elem),
            //bottom: rect.bottom - p.bottom - elem.scrollTop
            bottom: rect.bottom - p.bottom - getScrollbarSize(elem, 'horizontal')
        };

        // 返回标准化的DOMRect（兼容getBoundingClientRect返回格式）
        return new DOMRect(
            v.left,
            v.top,
            v.right - v.left,
            v.bottom - v.top
        );
    }

    /**
     * 检查父元素是否存在裁剪能力（overflow属性）
     * @param {HTMLElement} elem 父级DOM元素
     * @returns {boolean} 是否可能裁剪子元素
     */
    function hasClipCapability(elem) {
        if (!elem.tagName) {
            return false;
        }
        if (elem.tagName === 'BODY' || elem.tagName === 'HTML') {
            return true;
        }
        let style = window.getComputedStyle(elem),
            p = { 
                overflow: style.overflow, x: style.overflowX, y: style.overflowY 
            };

        // 以下取值均可能导致子元素被裁剪
        const clipValues = ["hidden", "scroll", "auto"];
        return clipValues.includes(p.overflow) || clipValues.includes(p.x) || clipValues.includes(p.y);
    }

    /**
     * 递归遍历所有上级元素，判断是否存在遮挡
     * @param {HTMLElement} elem 目标DOM元素
     * @param {DOMRect} rect 目标元素的视口矩形
     * @returns {boolean} 是否被上级元素遮挡/显示不全
     */
    function checkParentClip(elem, rect) {
        let parent = elem.parentNode;
        // 递归终止条件：遍历至<body>或null
        //while (parent && parent.tagName !== 'BODY') {
        while (parent && parent.tagName) {
            // 仅当父元素具备裁剪能力时，才需要判断区域重叠
            if (hasClipCapability(parent)) {
                const parentVisibleRect = getParentVisibleRect(parent);

                // 判断目标元素是否完全在父元素可见区域内
                const isFullyContained = (
                    rect.left >= parentVisibleRect.left &&
                    rect.top >= parentVisibleRect.top &&
                    rect.right <= parentVisibleRect.right &&
                    rect.bottom <= parentVisibleRect.bottom
                );

                // 若不完全包含，说明被该父元素遮挡/显示不全
                if (!isFullyContained) {
                    //console.log(`被父元素 <${parent.tagName.toLowerCase()}> 遮挡`);
                    return true;
                }
            }
            // 向上遍历下一个父元素
            parent = parent.parentNode;
        }

        // 遍历完所有父元素，均未遮挡
        return false;
    }

    /**
     * 判断HTML元素是否被上级元素遮挡或显示不全（多级嵌套兼容）
     * @param {HTMLElement} elem 目标DOM元素
     * @returns {boolean} true=被遮挡/显示不全，false=完全可见
     */
    function isElementObscuredByParent(elem) {
        // 步骤1：获取目标元素矩形
        const rect = getTargetElementRect(elem);
        if (!rect) {
            return true; // 元素本身不可见，视为"显示不全"
        }
        // 步骤2：检查所有上级父元素是否遮挡
        return checkParentClip(elem, rect);
    }

    /**
    * 判断HTML元素是否因宽度限制导致显示不完整（内容宽度超过元素可视宽度）
    * @param {HTMLElement} element 目标DOM元素
    * @returns {boolean} true=宽度不足、显示不完整；false=宽度充足、内容完整显示
    */
    function isElementWidthIncomplete(elem, content) {
        // 1. 参数合法性校验
        if (!(elem instanceof HTMLElement)) {
            //console.error("参数必须是有效的HTMLElement");
            return false;
        }

        // 2. 获取元素的计算样式（避免内联样式遗漏，确保判断准确）
        const style = window.getComputedStyle(elem);

        // 3. 特殊情况排除：元素本身不可见（无需判断显示是否完整）
        if (style.display === "none" || style.visibility === "hidden") {
            //console.warn("目标元素本身不可见，无需判断宽度显示完整性");
            return false;
        }

        if (elem.tagName === 'SELECT') {
            let clientWidth = elem.clientWidth,
                paddingWidth = $.getPaddingSize(elem).paddingWidth;
            // 这里要减去SELECT元素的右边箭头的宽度大约是15像素
            // 再减去留白的像素
            return $.getContentSize(content).width > clientWidth - 15 - paddingWidth;
        }

        // 4. 核心判断：内容完整宽度 > 元素可视宽度 或者 内容完整高度 > 元素可视高度
        const hasContentOverflow = elem.scrollWidth > elem.clientWidth || elem.scrollHeight > elem.clientHeight;

        // 5. 结合横向溢出属性，判断是否真的"显示不完整"（裁剪/滚动）
        // 仅当溢出内容被处理（裁剪/滚动）时，才视为"显示不完整"；visible时内容溢出但完整显示在外部
        const p = { overflow: style.overflow, x: style.overflowX, y: style.overflowY };

        // 以下取值均可能导致子元素被裁剪
        const clipValues = ["hidden", "scroll", "auto"];
        const isContentClipped = clipValues.includes(p.overflow) || clipValues.includes(p.x) || clipValues.includes(p.y);

        // 6. 补充：文本不换行场景（nowrap），即使overflow为visible，视觉上也可能被父元素遮挡（可选增强）
        const isTextNoWrap = style.whiteSpace === "nowrap";

        // 7. 综合判定：内容溢出 + （裁剪/滚动 或 文本不换行）= 显示不完整
        return hasContentOverflow && (isContentClipped || isTextNoWrap);
    }

    $.extend($, {
        isElementObscured: function (elem) {
            return isElementObscuredByParent(elem);
        },
        isElemObscured: function (elem) {
            return isElementObscuredByParent(elem);
        },
        isElementCovered: function (elem) {
            return isElementObscuredByParent(elem);
        },
        isElemCovered: function (elem) {
            return isElementObscuredByParent(elem);
        },
        isContentObscured: function (elem, content) {
            return isElementWidthIncomplete(elem, content);
        },
        isContentCovered: function (elem, content) {
            return isElementWidthIncomplete(elem, content);
        }
    });
}(OUI);

/*
$.title
*/
!function ($) {
    'use strict';

    const Cache = {
        caches: {},
        timers: {},
        titles: {},
        getCache: function (id) {
            return Cache.caches['title_' + id];
        },
        setCache: function (id, elem) {
            return Cache.caches['title_' + id] = { id: id, elem: elem }, this;
        }
    };

    var Factory = {
        buildTitle: function (options) {
            var opt = $.extend({
                id: '',
                enabled: true,
                // 目标元素
                element: document.body,
                attribute: 'data-title',
                // 是否跟随光标移动
                move: true,
                // 自动关闭的时间，单位：毫秒
                timeout: 15 * 1000,
                //自定义样式
                style: ''
            }, options);

            if (!$.isElement($.toElement(opt.element))) {
                return null;
            }

            var cache = Cache.getCache(opt.id), elem;
            if (cache) {
                elem = cache.elem;
                elem.options = opt;
            } else {
                elem = new Title(opt);
                Cache.setCache(opt.id, elem);
            }
            return elem;
        },
        buildElement: function(that) {
            var elem = document.createElement('DIV'),
                opt = that.options;

            elem.className = 'oui-title-panel-element';

            document.body.appendChild(elem);
            that.element = elem;

            return elem;
        },
        showTitle: function(ev, title, that) {
            var elem = that.element, bs = $.getBodySize(),
                opt = that.options;

            if (!opt.enabled) {
                return this;
            }

            if (!elem) {
                elem = Factory.buildElement(that);
            }
            var scroll = $.getScrollPosition();
            var left = scroll.left + ev.clientX + 10,
                top = scroll.top + ev.clientY + 10;

            if (!title) {
                elem.style.left = left + 'px';
                elem.style.top = top + 'px';
            } else {
                elem.style.cssText = [
                    'border:solid 1px #ddd;border-radius:5px;',
                    'box-sizing:border-box;',
                    'margin:0;padding:3px 5px;',
                    'background:#fff;color:#333;',
                    'opacity:0.98;z-index:99999999;',
                    'font-size:14px;font-family:Arial,宋体;',
                    'min-height:30px;line-height:1.5em;',
                    //边框灰色阴影
                    'box-shadow:0 0 6px 1px rgba(204, 204, 204, 0.5);'
                ].join('') + (opt.style || '') + [
                    'position:absolute;white-space:pre;',
                    'display:inline-block;overflow:hidden;',
                    'text-overflow:ellipsis;',
                    'max-width:', bs.width - 10, 'px;',
                    'max-height:', bs.height - 10, 'px;',
                    'top:', top, 'px;',
                    'left:', left, 'px;',
                ].join('');

                elem.innerHTML = title;
            }

            if (elem.offsetWidth + elem.offsetLeft > bs.width + scroll.left) {
                elem.style.left = (bs.width + scroll.left - elem.offsetWidth - 5) + 'px';
            }
            if (elem.offsetHeight + elem.offsetTop > bs.height + scroll.top) {
                //elem.style.top = (bs.height + scroll.top - elem.offsetHeight - 5) + 'px';
                elem.style.top = scroll.top + ev.clientY - elem.offsetHeight - 5 + 'px';
            }

            if (opt.timeout) {
                if (that.timer) {
                    window.clearTimeout(that.timer);
                }
                that.timer = window.setTimeout(function() {
                    Factory.hideTitle(that);
                }, opt.timeout);
            }

            return this;
        },
        hideTitle: function (that) {
            if (that.element) {
                that.element.style.display = 'none';
            }
            return this;
        },
        isCovered: function (elem, content) {
            return $.isContentCovered(elem, content) || $.isElemObscured(elem);
        },
        getSelectedText: function (elem) {
            const selectedIndex = elem.selectedIndex; // 获取选中项索引
            const selectedText = elem.options[selectedIndex].text; // 获取选中文本
            return selectedText || '';
        }
    };

    function Title(options) {
        var opt = $.extend({}, options);

        this.id = opt.id;
        this.options = opt;
        this.timer = null;
        this.element = null;
        this.target = null;
        this.current = null;

        this.initial(opt);
    }

    Title.prototype = {
        initial: function (opt) {
            var that = this;
            if (!opt.enabled) {
                return that;
            }
            $.addListener(opt.element, 'mousemove', function(ev) {
                //$.cancelBubble(ev);
                var elem = ev.target, tarAttr = opt.attribute, 
                    tmpAttr = 'oui-data-title-tmp', delAttr = 'oui-data-title-del',
                    coverAttr = 'data-cover', timeAttr = 'data-cover-ts';

                if (that.current === elem) {
                    if (!opt.move) {
                        return false;
                    }
                } else if (that.current) {
                    //鼠标移出时，判断是否有相应的临时属性，若有，则消除之
                    var con = that.current.getAttribute(tmpAttr) || that.current.getAttribute(delAttr);
                    if (con) {
                        that.current.setAttribute(tarAttr, con);
                        that.current.removeAttribute(tmpAttr);
                        that.current.removeAttribute(delAttr);
                        that.current.removeAttribute(coverAttr);
                        that.current.removeAttribute(timeAttr);
                    }
                }
                that.current = elem;
                if (elem.title) {
                    if (!elem.getAttribute(tarAttr)) {
                        elem.setAttribute(tarAttr, elem.title);
                        //elem.setAttribute('oui-title', 1);
                    }
                    elem.removeAttribute('title');
                }

                function _title() {
                    var tag = elem.tagName.toLowerCase(), con,
                        title = $.getAttribute(elem, tmpAttr) || $.getAttribute(elem, delAttr) || $.getAttribute(elem, tarAttr);
                    if (title) {
                        if (tag !== 'select') {
                            con = elem.value || elem.innerText || elem.innerHTML;
                        } else {
                            con = Factory.getSelectedText(elem);
                        }
                        const p = {
                            con: con.trim(),
                            str: title.replace(/(\r|\n)/, '').trim()
                        };
                        // 若文字内容与Title内容相同（忽略Title内容的换行符），
                        // 判断文字内容是否被遮挡，若无遮挡则不显示Title
                        if (p.con === p.str || p.con.indexOf(p.str) > -1) {
                            // 优化处理，减少重复检测
                            // 是否被遮挡：0-未设置，1-遮挡，2-未遮挡
                            var covered = parseInt('0' + elem.getAttribute(coverAttr), 10),
                                time = parseInt('0' + elem.getAttribute(timeAttr), 10);
                            // 2秒钟之内已经检测过，不再重复检测
                            if (covered && new Date().getTime() - time <= 2000) {
                                if (covered === 2) {
                                    elem.removeAttribute(tarAttr);
                                    elem.setAttribute(delAttr, title);
                                    return false;
                                }
                            } else if (!Factory.isCovered(elem, con)) {
                                elem.setAttribute(coverAttr, 2);
                                elem.setAttribute(timeAttr, new Date().getTime());
                                elem.removeAttribute(tarAttr);
                                elem.setAttribute(delAttr, title);
                                return false;
                            } else {
                                elem.setAttribute(coverAttr, 1);
                                elem.setAttribute(timeAttr, new Date().getTime());
                            }
                        }
                        
                        if (that.target === elem) {
                            Factory.showTitle(ev, null, that);
                            return false;
                        }
                        that.target = elem;
                        that.attribute = tarAttr;
                        elem.removeAttribute(tarAttr);
                        elem.setAttribute(tmpAttr, title);

                        Factory.showTitle(ev, title, that);

                        if (!elem.mouseout) {
                            $.addListener(elem, 'mouseout', function() {
                                Factory.hideTitle(that);
                            });
                            elem.mouseout = 1;
                        }
                    }
                    if (that.target && that.target !== elem) {
                        //鼠标移出
                        con = that.target.getAttribute(tmpAttr) || that.target.getAttribute(delAttr);
                        if (con) {
                            that.target.setAttribute(that.attribute, con);
                            that.target.removeAttribute(tmpAttr);
                            that.target.removeAttribute(delAttr);
                            that.target.removeAttribute(coverAttr);
                            that.target.removeAttribute(timeAttr);
                        }
                        that.target = null;

                        Factory.hideTitle(that);
                    }
                    return true;
                }
                $.debounce({
                    id: 'oui-title-debounce',
                    delay: 5,
                    timeout: 3000,
                }, function () {
                    return _title();
                });
                
                return true;
            });
            return this;
        }
    };

    $.extend($, {
        title: function (options) {
            return Factory.buildTitle(options);
        }
    });

    if (parseInt('0' + $.getQueryString(location.href, 'origin-title'), 10) !== 1) {
        $.title({ id:'oui-title' });
    }
}(OUI);