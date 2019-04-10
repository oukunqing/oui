
/*
 @Title: OUI
 @Description：JS通用代码库
 @Author: oukunqing
 @License：MIT
*/

// OUI
!function () {
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
        } else {
            global.OUI = global.$ = OUI;
        }
    }
}();

!function ($) {
    'use strict';

    var version = '1.0.0',
        trim = function (s) { return s.replace(/(^[\s]*)|([\s]*$)/g, ''); },
        isUndefined = function (o) { return typeof o === 'undefined'; },
        isString = function (s, nonempty) { return typeof s === 'string' && (nonempty ? trim(s) !== '' : true); },
        isNumber = function (n) { return typeof n === 'number'; },
        checkNumber = function (n, min, max) {
            var isNum = isNumber(n), isMin = isNumber(min), isMax = isNumber(max);
            return isNum ? (isMin && isMax ? n >= min && n <= max : (isMin ? n >= min : isMax ? n <= max : true)) : false;
        },
        isObject = function (o) { return o !== null && typeof o === 'object'; },
        isArray = Array.isArray || function (a) { return Object.prototype.toString.call(a) === '[object Array]'; },
        isBoolean = function (b, dv) {
            var bool = typeof b === 'boolean';
            return typeof dv === 'boolean' ? (bool ? b : dv) : bool;
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
        isProperty = function (o, property) { return o.hasOwnProperty(property) && (property in o); },
        isPercent = function(val) {
            return (!isNaN(parseFloat(val, 10)) && ('' + val).endsWith('%'));
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
        distinctList = function (arr) {
            var list = [], dic = {};
            for (var i = 0, c = arr.length; i < c; i++) {
                var val = arr[i], key = 'K' + val;

                if (typeof dic[key] === 'undefined') {
                    dic[key] = val;
                    list.push(val);
                }
            }
            return dic = null, list;
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

            numbers.sort(function (a, b) {
                return a - b;
            });

            var con = '', start = 0, last = 0;

            for (var i = 0, c = numbers.length; i < c; i++) {
                var num = numbers[i];

                if (0 === i) {
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
        toEncode = function (s) { return encodeURIComponent(s); },
        buildParam = function (a, v, strict) {
            strict = isBoolean(strict, true);
            if(isNullOrUndefined(a) || (strict && isNullOrUndefined(v))) {
                return '';
            }
            var s = [];
            if (isString(a)) {
                if (!isNullOrUndefined(v)) {
                    a = [{ key: a, value: v }];
                } else {
                    return a;
                }
            }
            if (isArray(a)) {
                for (var i = 0, c = a.length; i < c; i++) {
                    var key = a[i].key || a[i].name, val = a[i].value || a[i].data;
                    if (isObject(val)) {
                        val = toJsonString(val);
                    }
                    s.push(key + '=' + toEncode(val));
                }
            } else if (isObject(a)) {
                for (var key in a) {
                    var val = isObject(a[key]) ? toJsonString(a[key]) : a[key];
                    s.push(key + '=' + toEncode(val));
                }
            } else {
                s.push(a);
            }
            return s.join('&');
        },
        setUrlParam = function (a, v, strict) {
            return buildParam(a, v, strict);
        },
        getTime = function() {
            return ('' + new Date().getTime()).substr(-9);
        },
        setQueryString = function (url, data, value) {
            if (!isString(url)) {
                return url;
            }
            var param = buildParam(data, value, true) || buildParam('up_ts_0', getTime());
            return url + (url.indexOf('?') > -1 ? '&' : '?') + param;
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
            return !isNullOrUndefined(name) ? obj[name] : obj;
        },
        getUrlHost = function (url) {
            var pos = url.indexOf('//'),
                str = pos > -1 ? url.substr(pos + 2) : url,
                pos1 = str.indexOf('/');
            return pos1 > -1 ? str.substr(0, pos1) : str;
        },
        isDebug = function (key) {
            try {
                var debug = getQueryString()[key || 'debug'];
                return !isNullOrUndefined(debug) && debug === '1';
            } catch (e) {
                return false;
            }
        },
        isMobile = function (num) {
            return /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(num);
        },
        isEmail = function (email) {
            return /^[A-Z0-9\u4e00-\u9fa5]+@[A-Z0-9_-]+(\.[A-Z0-9_-]+)+$/gi.test(email);
        },
        padLeft = function(s, totalWidth, paddingChar, isRight) {
            var char = paddingChar || '0', c = totalWidth - s.length;
            for (var i = 0; i < c; i++) {
                s = isRight ? s + char : char + s;
            }
            return s;
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
        trim: trim, isUndefined: isUndefined, isString: isString, isNumber: isNumber, isFunction: isFunction,
        isObject: isObject, isArray: isArray, isBoolean: isBoolean, isNull: isNull,
        isProperty: isProperty, isPercent: isPercent, isPercentSize: isPercent, version: version,
        isNumeric: isNumeric, isDecimal: isDecimal, isInteger: isInteger, isFloat: isDecimal, isInt: isInteger,
        isHexNumeric: isHexNumeric, isHexNumber: isHexNumber, isMobile: isMobile, isEmail: isEmail,
        isRegexp: isRegexp, isNullOrUndefined: isNullOrUndefined,
        isEmpty: function (o) {
            if (isUndefined(o) || null === o) { return true; }
            else if (isString(o)) { return '' === trim(o); }
            else if (isArray(o)) { return 0 === o.length; }
            else if (isObject(o)) { for (var name in o) { return false; } return true; }
            return false;
        },
        padLeft: function (s, totalWidth, paddingChar) {
            return padLeft(s, totalWidth, paddingChar, false);
        },
        padRight: function (s, totalWidth, paddingChar) {
            return padLeft(s, totalWidth, paddingChar, true);
        },
        toDecimal: toDecimal, toFloat: toDecimal, checkNumber: checkNumber,
        toInteger: toInteger, toInt: toInteger, toNumber: toNumber, toNumberList: toNumberList,
        containsKey: containsKey, containsValue: containsValue, contains: contains, distinctList: distinctList,
        collapseNumberList: collapseNumberList, expandNumberList: expandNumberList,
        toJsonString: toJsonString, toJson: toJson, toEncode: toEncode,
        param: buildParam, setUrlParam: setUrlParam,
        setQueryString: setQueryString, getQueryString: getQueryString, getUrlHost: getUrlHost,
        isDebug: isDebug,
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
            //若字符个数为奇数，补一个空格
            hex += hex.length % 2 != 0 ? " " : "";

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
            toCRC16: function (s, isReverse) {
                return toHex(CRC16(strToByte(s), isReverse), 4);
            },
            toModbusCRC16: function (s, isReverse) {
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
    }

    $.extendNative($, { Dictionary: Dictionary, dict: new Dictionary() }, '$');
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
                var code16 = code.toString(16).padStart(4, '0');
                res.push((noPrefix ? '' : '\\u') + code16);
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
        insert: function (v, c) {
            var s = this;
            if ($.isNumber(c)) {
                for (var i = 0; i < c; i++) { s = v + s; }
                return s;
            }
            return v + s;
        },
        space: function (prefix, postfix) {
            var s = this,
                s1 = $.isNumber(prefix) ? ''.append(' ', prefix) : (prefix || ' '),
                s2 = $.isNumber(postfix) ? ''.append(' ', postfix) : (postfix || ' ');
            return s1 + s + s2;
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
        isHexNumeric: function () { return $.isHexNumeric(this); },
        isPercent: function() { return $.isPercent(this); },
        isMobile: function () { return $.isMobile(this); },
        isEmail: function () { return $.isEmail(this); },
        isNaN: function() { return isNaN(parseFloat(this, 10)); },
        /*
        toNumber: function(defaultValue, isFloat, decimalLen) {
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
        */
        toNumber: function (defaultValue, isFloat, decimalLen) { return $.toNumber(this, defaultValue, isFloat, decimalLen); },
        toNumberList: function (separator, decimalLen) { return $.toNumberList(this, separator, decimalLen); },
        toInt: function (defaultValue) { return $.toInteger(this, defaultValue); },
        toInteger: function (defaultValue) { return $.toInteger(this, defaultValue); },
        toFloat: function (defaultValue, decimalLen) { return $.toDecimal(this, defaultValue, decimalLen); },
        toDecimal: function (defaultValue, decimalLen) { return $.toDecimal(this, defaultValue, decimalLen); },
        expandNumberList: function () { return $.expandNumberList(this); },
        toChineseNumber: function (isMoney) { return $.numberToChinese(this, isMoney); },
        chineseToNumber: function (isMoney) { return $.chineseToNumber(this, isMoney); },
        convertChineseToNumber: function () { return $.chineseToNumber(this); },
        chineseToUnicode: function (returnArray, noPrefix) { return $.chineseToUnicode(this, returnArray, noPrefix); },
        unicodeToChinese: function (returnArray) { return $.unicodeToChinese(this, returnArray); },
        asciiToUnicode: function (returnArray) { return $.asciiToUnicode(this, returnArray); },
        unicodeToAscii: function (returnArray) { return $.unicodeToAscii(this, returnArray); },
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
        },
        setQueryString: function (data, value) {
            return $.setQueryString(this, data, value);
        },
        getQueryString: function (name) {
            return $.getQueryString(this, name);
        },
        setUrlParam: function(data, value) {
            return $.setQueryString(this, data, value);
        },
        getUrlHost: function () {
            return $.getUrlHost(this);
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
        isNaN: function() { return isNaN(parseFloat(this, 10)); },
        toHex: function () { return this.toString(16).toUpperCase(); },
        toThousand: function (delimiter, len) { return this.toString().toThousand(delimiter, len); },
        toChineseNumber: function (isMoney) { return $.numberToChinese(this, isMoney); },
        toDate: function (format) { return this.toString().toDate(format); },
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
            if (force) {
                return (m + n) > 0 ? (m + n) + unit : num;
            } else {
                return m > 0 ? (m + n) + unit : num;
            }
        },
        toFileSize: function (decimalLen, space) {
            var kb = 1024, mb = 1024 * 1024, gb = 1024 * 1024 * 1024, num = this;
            if (num >= gb) {
                return num.toNumberUnit(num, gb, 'GB', decimalLen, false, space);
            } else if (num >= mb) {
                return num.toNumberUnit(num, mb, 'MB', decimalLen, false, space);
            } else if (num >= kb) {
                return num.toNumberUnit(num, kb, 'KB', decimalLen, false, space);
            } else if (num < kb) {
                return num.toNumberUnit(num, kb, 'KB', decimalLen, true, space);
            }
            return '';
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

    var throwError = function (msg, str, args) {
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
                    v = !$.isUndefined(dv) ? dv : throwError(err, s, vals);
                }
            }
        } else {
            throwError(err, str, vals);
        }
        return v;
    };

    if ($.isUndefined(String.prototype.format)) {
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
            //var matchs = s.match(/({+[-\d]+(:[\D\d]*?)*?}+)|({+([\D]*?|[:\d]*?)}+)|([{]{1,2}[\w]*?)|([\w]*?[}]{1,2})/g);
            var matchs = s.match(/({+[-\d]+(:[\D\d]*?)*?}+)|({+([\D]*?|[:\d]*?)}+)|({+([\w\.\|]*?)}+)|([{]{1,2}[\w]*?)|([\w]*?[}]{1,2})/g);
            if (null === matchs) {
                return s.toString() || s;
            }
            var len = vals.length, mc = matchs.length, isObject = $.isObject(vals[0]), obj = isObject ? vals[0] : {};

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
                        rst.push(s.substr(0, p) + (c > 1 || d > 1 ? (c % 2 !== 0 || d % 2 !== 0 ? m2.replace('{' + idx + '}', v) : m2) : v));
                    } else {
                        var mcs = m2.match(/({[\w\.\|]+})/g);
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


// Web
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
        /*
        isElement = function (elem, tagName) {
            var b = elem === doc || elem === win || ($.isObject(elem) && $.isNumber(elem.nodeType) && $.isString(elem.tagName));
            return b && $.isString(tagName) ? elem.tagName === tagName : b;
        },
        */
        isDocument = function(doc) {
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
        isElement = function(elem, tagName) {
            var isElem = elem &&
                //typeof elem === 'object' &&
                elem.nodeType === 1 &&
                typeof elem.nodeName === 'string' &&
                typeof elem.tagName === 'string';
            return isElem && ($.isString(tagName, true) ? elem.tagName === tagName : isElem);
        },
        isForm = function(form) {
            return isElement(form) &&
                form.nodeName === 'FORM' &&
                form.tagName === 'FORM';
        },
        isStyleUnit = function(val, units) {
            if($.isNumber(val) || isNaN(parseFloat(val, 10))) {
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
            if(isNaN(parseFloat(val, 10))) {
                return false;
            }
            return !('' + val).endsWith('%');
        },
        getLocationPath = function () {
            return location.href.substring(0, location.href.lastIndexOf('/') + 1);
        },
        getScriptSelfPath = function (relativePath) {
            var elements = doc.getElementsByTagName('script'), len = elements.length, elem = elements[len - 1];
            return relativePath ? elem.getAttribute('src') : elem.src;
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
            var path = (filePath || '').split('?')[0], p = path.lastIndexOf('/');
            var name = p >= 0 ? path.substr(p + 1) : path, pos = name.lastIndexOf('.');
            return pos >= 0 && withoutExtension ? name.substr(0, pos) : name;
        },
        getExtension = function (filePath) {
            var name = (filePath || '').split('?')[0], pos = name.lastIndexOf('.');
            return pos >= 0 ? name.substr(pos + 1).toLowerCase() : '';
        },
        createElement = function (nodeName, id, func, parent, exempt) {
            if ($.isFunction(id)) {
                exempt = parent, parent = func, func = id, id = null;
            }
            var elem = null, hasId = false;
            if ($.isString(id, true)) {
                hasId = true;
                elem = doc.getElementById(id);
                if (elem !== null) {
                    return $.isFunction(func) && func(elem), elem;
                }
            }
            elem = doc.createElement(nodeName);

            if (hasId) { elem.id = id; }
            if (!exempt && !isElement(parent) && !isDocument(parent)) { parent = undefined; }

            return $.isFunction(func) && func(elem), parent &&  parent.appendChild(elem), elem;
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
            return $.isString(styleName) ? style[styleName] || defaultValue: style;
        },
        getElementStyleSize = function(elem, styleName) {
            var attr = ('' + styleName).toLowerCase(),
                style = getElementStyle(elem),
                postfix = attr === 'border' ? 'Width' : attr == 'radius' ? 'Radius' : '';

            if(!$.isString(attr, true) || !style) {
                return 0;
            }

            if(['padding', 'margin', 'border', 'radius'].indexOf(attr) < 0) {
                return parseInt('0' + style[attr], 10);
            }

            var data = attr == 'radius' ? {
                topLeft: parseInt('0' + style['borderTopLeft' + postfix], 10),
                topRight: parseInt('0' + style['borderTopRight' + postfix], 10),
                bottomLeft: parseInt('0' + style['borderBottomLeft' + postfix], 10),
                bottomRight: parseInt('0' + style['borderBottomRight' + postfix], 10),
            } : {
                top: parseInt('0' + style[attr + 'Top' + postfix], 10),
                right: parseInt('0' + style[attr + 'Right' + postfix], 10),
                bottom: parseInt('0' + style[attr + 'Bottom' + postfix], 10),
                left: parseInt('0' + style[attr + 'Left' + postfix], 10)
            };
            return data;
        },
        checkMinMax = function(p) {
            p.min = parseInt('0' + p.min, 10);
            p.max = parseInt('0' + p.max, 10);
            p.val = parseInt('0' + p.val, 10);

            if(p.min > p.max) {
                var tmp = p.min;
                p.min = p.max;
                p.max = tmp;
            }
            if(p.val < p.min || p.val > p.max) {
                p.val = parseInt((p.min + p.max) / 2, 10);
            }
            return p;
        },
        getCssAttrSize = function(val, options) {
            var p = checkMinMax($.extend({
                    attr: '',      //margin, padding, border
                    unit: '',
                    isArray: false,
                    isLimit: false,
                    min: 0,
                    max: 10,
                    val: 4
                }, options)),
                isElem = $.isElement(val),
                data = {}, list = [];

            if(['px', 'pt', 'em'].indexOf(('' + p.unit).toLowerCase()) < 0) {
                p.unit = '';
            }
            p.attr = ('' + (p.attr || p.styleName)).toLowerCase();

            if(!p.attr) {
                return null;
            }

            if(['padding', 'margin', 'border', 'radius'].indexOf(p.attr) < 0) {
                var v = isElem ? getElementStyleSize(val, p.attr) : parseInt('0' + val, 10);
                if(p.unit) {
                    v += p.unit;
                }
                return v;
            }

            if(isElem) {
                data = getElementStyleSize(val, p.attr);
            } else if(typeof val === 'number' || typeof val === 'string') {
                data = {
                    top: val, right: val, bottom: val, left: val
                };
            } else if($.isArray(val)) {
                data.top = val[0] || 0;
                data.right = val.length >= 2 ? val[1] : data.top;
                data.bottom = val.length >= 3 ? val[2] : data.top;
                data.left = val.length >= 4 ? val[3] : data.right;
            } else if($.isObject(val)) {
                data = {
                    top: val.top || 0, right: val.right || 0, bottom: val.bottom || 0, left: val.left || 0
                };
            }
            for(var i in data) {
                data[i] = Math.abs(parseInt('0' + data[i], 10));
                if(p.isLimit) {
                    data[i] = data[i] > p.max || data[i] < p.min ? p.val : data[i];
                }
                if(p.unit) {
                    data[i] += p.unit;
                }
                if(p.isArray) {
                    list.push(data[i]);
                }
            }
            if(p.isArray) {
                return list;
            }
            if(p.attr !== 'radius') {
                data[p.attr + 'Width'] = parseInt(data.left, 10) + parseInt(data.right, 10);
                data[p.attr + 'Height'] = parseInt(data.top, 10) + parseInt(data.bottom, 10);
            }

            return p.isArray ? list : data;
        },
        getPaddingSize = function(elem, options) {
            return getCssAttrSize(elem, $.extend({}, options, {attr:'padding'}));
        },
        getMarginSize = function(elem, options) {
            return getCssAttrSize(elem, $.extend({}, options, {attr:'margin'}));
        },
        getBorderSize = function(elem, options) {
            return getCssAttrSize(elem, $.extend({}, options, {attr:'border'}));
        },
        getOffsetSize = function(elem) {
            if (!isElement(elem)) {
                return null;
            }
            var par = {
                width: elem.offsetWidth, 
                height: elem.offsetHeight
            },  computedStyle,
                offsetParent = elem.offsetParent,
                prevOffsetParent = elem,
                doc = elem.ownerDocument,
                docElem = doc.documentElement,
                body = doc.body,
                defaultView = doc.defaultView,
                prevComputedStyle = getElementStyle(elem),
                left = elem.offsetLeft,
                top = elem.offsetTop;

            while((elem = elem.parentNode) && elem !== body && elem !== docElem) {
                if(prevComputedStyle.position === 'fixed') {
                    break;
                }
                computedStyle = getElementStyle(elem);
                top -= elem.scrollTop;
                left -= elem.scrollLeft;

                if(elem === offsetParent) {
                    top += elem.offsetTop;
                    left += elem.offsetLeft;

                    prevOffsetParent = offsetParent;
                    offsetParent = elem.offsetParent;
                }

                if(computedStyle.overflow !== 'visible') {
                    top += parseFloat(computedStyle.borderTopWidth) || 0;
                    left += parseFloat(computedStyle.borderLeftWidth) || 0;
                }
                prevComputedStyle = computedStyle;
            }

            if(prevComputedStyle.position === 'relative' || prevComputedStyle.position === 'static') {
                top += body.offsetTop;
                left += body.offsetLeft;
            }

            if (prevComputedStyle.position === 'fixed') {
                top += Math.max(docElem.scrollTop, body.scrollTop);
                left += Math.max(docElem.scrollLeft, body.scrollLeft);
            }
            return $.extend(par, {left: left, top: top});
        },
        getElementSize = function(elem) {
            if (!isElement(elem)) {
                return {};
            }
            return $.extend(getOffsetSize(elem), {
                clientWidth: elem.clientWidth, clientHeight: elem.clientHeight
            });
        },
        getBodySize = function (isOffset) {
            var doc;
            if (typeof document.compatMode !== 'undefined' && document.compatMode === 'CSS1Compat') {
                doc = document.documentElement;
            } else if (typeof document.body !== 'undefined') {
                doc = document.body;
            }
            if(isOffset) {
                return { width: doc.offsetWidth, height: doc.offsetHeight };
            }
            return { width: doc.clientWidth, height: doc.clientHeight };
        },
        getDocumentSize = function(isOffset) {
            return getBodySize(isOffset);
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
            var len = +second.length,
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
        setAttribute = function (elem, attributes, exempt, serialize) {
            if ($.isBoolean(exempt, false) || $.isElement(elem)) {
                if ($.isObject(attributes)) {
                    for (var key in attributes) {
                        var val = attributes[key];
                        if (serialize && $.isObject(val)) {
                            if ($.isArray(val) || $.isElement(val)) {
                                elem.setAttribute(key, val);
                            } else {
                                elem.setAttribute(key, $.toJsonString(val));
                            }
                        } else {
                            elem.setAttribute(key, val);
                        }
                    }
                } else if ($.isString(attributes) && isAttributeValue(exempt)) {
                    elem.setAttribute(attributes, exempt);
                }
            }
            return this;
        },
        toCssText = function(obj) {
            if($.isString(obj)) {
                return obj;
            }
            if(!obj || !$.isObject(obj)) {
                return '';
            }
            var cssText = [];
            for(var i in obj) {
                var val = obj[i];
                if($.isString(val) || $.isNumber(val)) {
                    cssText.push(i + ':' + (''+ val).trim() + ';');
                }
            }
            return cssText.join(' ');
        },
        setStyle = function (elem, styles, value, exempt) {
            if ($.isBoolean(value)) {
                exempt = value, value = null;
            }
            if ($.isBoolean(exempt, false) || $.isElement(elem)) {
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
                        elem.style[key] = styles[key] + unit;
                    }
                } else if ($.isString(styles) && isAttributeValue(value)) {
                    elem.style[styles] = value;
                } else if ($.isString(styles)) {
                    elem.style.cssText += styles;
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
            if($.isNullOrUndefined(elem)){
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
                for(var i in elems) {
                    obj = elems[i], pObj = (obj || {}).parentNode;
                    if(!$.isElement(obj) 
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
        cancelBubble = function (ev) {
            ev = ev || window.event || arguments.callee.caller.arguments[0];
            if (ev.stopPropagation) { ev.stopPropagation(); } else { ev.cancelBubble = true; }
            if (ev.preventDefault) { ev.preventDefault(); } else { ev.returnValue = false; }
            return this;
        },
        addEventListener = function (elem, evName, func, useCapture, isRemove) {
            var elems = $.isArray(elem) ? elem : [elem],
                events = $.isArray(evName) ? evName : [evName],
                name = isRemove ? 'removeEventListener' : 'addEventListener',
                other = isRemove ? 'detachEvent' : 'attachEvent',
                normal = typeof doc.addEventListener !== 'undefined';
            for(var i in events) {
                var evn = events[i];
                if(!$.isString(evn, true)) {
                    continue;
                }
                for(var j in elems) {
                    var o = elems[j];
                    if(($.isElement(o) || $.isDocument(o) || $.isWindow(o)) && $.isFunction(func)) {
                        normal ? o[name](evn, func, useCapture || false) : o[other]('on' + evn, func);
                    }
                }
            }
            return this;
        },
        removeEventListener = function (elem, evName, func, useCapture) {
            var isRemove = true;            
            return addEventListener(elem, evName, func, useCapture, isRemove);
        },
        bind = function(obj, func, args) {
            return function() {
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
        getKeyCode = function (e) {
            var e = e || window.event;
            return e.keyCode || e.which || e.charCode;
        },
        filterHtmlCode = function (str) {
            str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
            str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
            //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            return str;
        };

    $.extendNative($, {
        doc: doc, head: head, redirect: redirect,
        getLocationPath: getLocationPath,
        getScriptSelfPath: getScriptSelfPath,
        getFilePath: getFilePath,
        getFileName: getFileName,
        getExtension: getExtension,
        isDocument: isDocument,
        isWindow: isWindow,
        isElement: isElement,
        isForm: isForm,
        isStyleUnit: isStyleUnit,
        isNumberSize: isNumberSize,
        createElement: createElement,
        createJsScript: createJsScript,
        createCssStyle: createCssStyle,
        getElementStyle: getElementStyle,
        getElementStyleSize: getElementStyleSize,
        getCssAttrSize: getCssAttrSize,
        getPaddingSize: getPaddingSize,
        getMarginSize: getMarginSize,
        getBorderSize: getBorderSize,
        getBodySize: getBodySize,
        getDocumentSize: getDocumentSize,
        getOffset: getOffsetSize,
        getOffsetSize: getOffsetSize,
        getElementSize: getElementSize,
        offset: getOffsetSize,
        isWindow: isWindow,
        isDocument: isDocument,
        isArrayLike: isArrayLike,
        merge: merge,
        makeArray: makeArray,
        setAttribute: setAttribute,
        toCssText: toCssText,
        setStyle: setStyle,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        getClass: getClass,
        hasClass: hasClass,
        appendChild: appendChild,
        removeChild: removeChild,
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
        removeEventListener: removeEventListener,
        removeListener: removeEventListener,
        bind: bind,
        bindEventListener: bindEventListener,
        setFocus: setFocus,
        getEvent: getEvent,
        getScrollPosition: getScrollPosition,
        getScrollPos: getScrollPosition,
        getKeyCode: getKeyCode,
        filterHtmlCode: filterHtmlCode
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
            $I: function (id, parent) {
                if (id.indexOf('#') === 0) {
                    id = id.substr(1);
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

        var wst = window.setTimeout, wsi = window.setInterval;
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
                    dic = {cancel: 0, checked: 1, all: 1, reverse: 2};
                switch (parseInt(dic[('' + action).toLowerCase()] || action, 10)) {
                    case 0: checked = false; break;
                    case 1: checked = true; break;
                    case 2: checked = !obj.checked; break;
                }
                return checked;
            }
        };

    $.extendNative($, {
        setChecked: function (selector, action, values) {
            if ($.isArrayLike(selector)) {
                selector = $.makeArray(selector);
            }
            if ($.isArray(selector)) {
                for (var i = 0, c = selector.length; i < c; i++) {
                    selector[i].checked = _checked(action, selector[i]);
                }
                return this;
            } else if ($.isElement(selector)) {
                selector.checked = _checked(action, selector);
                return this;
            }
            var arr = isName(selector) ? $N(selector) : $QA(selector);
            if (arr) {
                if ($.isString(values)) {
                    values = values.split(/[|,]/);
                }
                if ($.isArray(values)) {
                    arr = $.matchCondition(arr, { values: values });
                }
                for (var i = 0, c = arr.length; i < c; i++) {
                    var obj = arr[i];
                    obj.checked = _checked(action, obj);
                }
            }
            return this;
        },
        setCheckedClass: function(selector, className) {
            var arr = isName(selector) ? $N(selector) : $QA(selector), c = arr.length;
            for(var i = 0; i < c; i++) {
                var obj = arr[i];
                if(obj.checked) {
                    $.addClass(obj.parentNode, className);
                } else {
                    $.removeClass(obj.parentNode, className);
                }
            }
            return this;
        },
        setCheckedCss: function(selector, className) {
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
        getCheckedValues: function(selector, targetElement) {
            var elements = $.getChecked(selector), len = elements.length;
            var values = [];
            for(var i = 0; i < len; i++) {
                var val = elements[i].value;
                values.push(val);
            }
            if($.isString(targetElement, true)) {
                targetElement = document.getElementById(targetElement);
            }
            if($.isElement(targetElement)) {
                targetElement.value = values.join(',');
            }
            return values;
        },
        getCheckedValue: function(selector, targetElement) {
            return this.getCheckedValues(selector);
        },
        getCheckedText: function(elem) {
            if(!$.isElement(elem)) {
                return '';
            }
            return obj.options[obj.selectedIndex].text;           
        },
        getTextCursorPosition: function (elem) {
            try {
                if (!$.isElement(elem)) {
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
        setTextCursorPosition: function (elem, pos) {
            if (!$.isElement(elem)) {
                return false;
            }
            var val = elem.value, len = val.length;
            if (!$.isNumber(pos) || pos > len) {
                pos = len;
            }
            window.setTimeout(function () {
                elem.focus();
                if (elem.setSelectionRange) {
                    elem.setSelectionRange(pos, pos);
                } else {
                    var range = obj.createTextRange();
                    range.moveStart('character', -len);
                    range.moveEnd('character', -len);
                    range.moveStart('character', index);
                    range.moveEnd('character', 0);
                    range.select();
                }
            }, 10);
            return this;
        },
        getSelectedText: function (elem) {
            if (elem.selectionStart || elem.selectionStart === '0') {
                return elem.value.substring(elem.selectionStart, elem.selectionEnd);
            } else if (document.selection) {
                obj.focus();
                return document.selection.createRange().text;
            }
            return '';
        },
        setInputFormat: function (elements, options) {
            //TODO:

            return this;
        },
        getElementValue: function (elements, defaultValue, attributeName, func) {
            var isAttribute = $.isString(attributeName);

            if ($.isArray(elements) || $.isArrayLike(elements) || elements.length > 1) {
                var arr = [], len = elements.length;
                for (var i = 0; i < len; i++) {
                    arr.push(elements[i].value);
                }
                return arr;
            } else if ($.isElement(elements)) {
                var val = (isAttribute ? elements.getAttribute(attributeName) : elements.value) || defaultValue;
                if ($.isFunction(func)) {
                    return func(val);
                }
                return val;
            }
        },
        setElementAttribute: function (elem, value, attributeName) {
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

            if ($.isArray(elements) || $.isArrayLike(elements) || elements.length > 1) {
                var len = elements.length;
                if (!$.isArray(values)) {
                    values = [values];
                }
                for (var i = 0; i < len; i++) {
                    var val = $.isUndefined(values[i]) ? (sameValue ? values[0] : '') : values[i];
                    $.setElementAttribute(elements[i], val, attributeName);
                }
            } else if ($.isElement(elements)) {
                var val = $.isArray(values) ? values[0] : $.isUndefined(values) ? '' : values;
                $.setElementAttribute(elements, val, attributeName);
            }

            return this;
        },
        appendOption: function(obj, val, txt) {
            return obj.options.add(new Option(txt, val)), this;
        }
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
            xhr.timeout = o.timeout;
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
            o.data = $.param(o.data);
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
        offset: function() {
            var self = this, elem = self[0] || {};
            return $.offset(elem);
        },
        getOffset: function() {
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
        }
    }, '$.fn');

    $.extendNative($.fn, {
        event: function (action, func) {
            return this.each(function (i, obj) {
                $.addEventListener(obj, action, function (e) {
                    func(e, i, this);
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

// oui.dialog
!function ($) {
    function callParentFunc(funcName, param) {
        if(window.location != top.window.location) {
            try{
                var func = parent.$.dialog[funcName],
                    id = $.getQueryString(location.href, 'dialog_id');
                if($.isFunction(func) && !$.isUndefined(id)) {
                    return func(id, param), this;
                }
            } catch(e) {
                console.log(funcName, e);
            }
        }
        return $;
    }
    $.extend($, {
        closeParentDialog: function(param) {
            return callParentFunc('closeParent', param);
        },
        resizeParentDialog: function(param) {
            return callParentFunc('resizeParent', param);
        }
    });
}(OUI);