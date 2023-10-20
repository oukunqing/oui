
var iniToJson = function (cfg) {
    var arr = cfg.split(/\r\n|\n/), len = arr.length;
    console.log(arr.length);
    console.log(arr);
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
};

var jsonToIni = function (json, ini, i) {
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

var $ = {jsonToIni:jsonToIni,iniToJson:iniToJson};

var data = { cfg: {id: 123, name: 'abc'},sub: {id: 12, name: 'asd'} };

var ini = $.jsonToIni(data);

console.log(ini);

console.log($.iniToJson(ini));


var isArray = Array.isArray || function (a) { return Object.prototype.toString.call(a) === '[object Array]'; };
var isObject = function(data) {
    return typeof data === 'object';
};

    String.prototype.splitFieldKey = function () {
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
    };
    String.prototype.toCamelCase = function (strict, isPascal) {
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
    };
    String.prototype.toPascalCase =  function (strict) {
        return this.toCamelCase(strict, true);
    };
    String.prototype.toUnderlineCase =  function () {
        var s = this, arr = s.splitFieldKey(), list = [];
        for (var i = 0; i < arr.length; i++) {
            list.push(arr[i].toLowerCase());
        }
        return list.join('_');
    };

var setFieldCase = function (formData, caseType) {
    var data = {};
    for (var k in formData) {
        var dr = formData[k],
            key = caseType === 1 ? k.toPascalCase(true) : caseType === 2 ? k.toUnderlineCase(true) : k.toCamelCase(true);
        if (dr === null) {
            data[key] = dr;
        } else if (isArray(dr)) {
            data[key] = [];
            for (var i = 0; i < dr.length; i++) {
                if (isObject(dr[i])) {
                    data[key].push(setFieldCase(dr[i], caseType));
                } else {
                    data[key].push(dr[i]);
                }
            }
        } else if (isObject(dr)) {
            data[key] = setFieldCase(dr, caseType);
        } else {
            data[key] = dr;
        }
    }
    return data;
};

var data = {
    DeviceId: 617,
    Name: 'abc',
    TypeId: 12,
    Camera: {
        Id: 2,
        ChannelNo: 1,
        Name: null,
        Type: undefined
    },
    Types: [1,2,3],
    Channels: [
        {Id:1, Number:2, Name:'通道2'},
        {Id:2, Number:3, Name:'通道3'}
    ],
    Server_line: 3
};

console.log(setFieldCase(data, 2));

var ss2 = 65200;

console.log(ss2.toTimeStr());