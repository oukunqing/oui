
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