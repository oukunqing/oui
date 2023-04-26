require('./oui');
require('./protocol/i1')

//  118.25.125.18   debian 9

/*
console.log((1547429280).toDate().format())

var dt1 = '2018-11-15 00:00:00'.toDate();

console.log(dt1.format('ts', 10));

var dt2 = '2019-01-21 13:00:00'.toDate();

var dt2 =  new Date();

console.log(dt2.format('ts', 13));

console.log(dt2.format('ts', 10) - dt1.format('ts', 10));

console.log('123456789'.toThousand(',', 3));

function showNumberFormat(num) {
    
}

var pattern = /^[a-zA-Z0-9\-\_]+[\.][a-zA-Z]{2,}$/;
console.log(pattern.test('.com'));
console.log(pattern.test('baidu.com'));
console.log(pattern.test('baidu123.com'));
console.log(pattern.test('baidu-pic.com'));
console.log(pattern.test('baidu-abc-12.com'));

var num = 204000100;
console.log(num/1024/1024, num % (1024 *1024));

console.log(num.toFileSize(2));
console.log(num.toNumberUnit(201112345, 10000, '万', 3, true));

console.log(num.toChineseNumber());
*/
function buildAssemble(i, j, len, arr) {
    var c = arr.length;
    if ((len < 2 && i >= c) || (len >= 2 && i >= c)) {
        return;
    }
    if (len >= 2) {
        /*
        for(var m = 0; m < c; m++) {
            
            var s = arr[i];
            var k = 0;

            do {
                s += arr[m];
                for(var a = 0; a < k; a++) {
                    s += arr[k];
                }
            } while(++k < len - 1);

            for(var n = 0; n < c; n++) {
                console.log(s + arr[n]);
            }
        }
        */

        for (var k = 0; k < len; k++) {
            var s = arr[i];

            for (var m = 0; m < c; m++) {

                for (var n = 0; n < c; n++) {
                    ``
                    console.log(s + arr[n]);
                }
            }

        }

        for (var m = 0; m < c; m++) {
            var s = arr[i] + arr[m];

            for (var n = 0; n < c; n++) {
                console.log(s + arr[n]);
            }
        }

        buildAssemble(++i, j, len, arr);
    } else {
        for (n = 0; n < c; n++) {
            console.log(arr[i] + arr[n]);
        }
        buildAssemble(++i, j, len, arr);
    }
}


var con = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var con = '012345';

var arr = con.split('');

buildAssemble(0, 0, 3, arr);



var w = [10, 10, 10];

console.log(w.join('+'));
console.log(eval(w.join('+')));
console.log(Math.floor(Math.random() * eval(w.join('+'))));


var randoms = {
    ads_codes: ['a', 'b', 'c'],
    ads_weight: [10, 10, 10],

    get_random: function (weight) {
        var s = eval(weight.join('+'));
        var r = Math.floor(Math.random() * s);
        console.log('s: ', s, ', r:', r, ', Math.random: ', Math.random());
        var w = 0;
        var n = weight.length - 1;
        for (var k in weight) {
            w += weight[k];
            if (w >= r) { n = k; break; }
        };
        return n;
    },
    init: function () {

        var rand = randoms.get_random(randoms.ads_weight);
        console.log(randoms.ads_codes[rand]);

    }
}
randoms.init();
randoms.init();
randoms.init();
randoms.init();
randoms.init();

var num = 349321235000;

console.log(num.toChineseNumber());


var str = { id: 1, name: 'abc' }

for (var k in str) {
    console.log(k, ', ', str[k]);
}
console.log(str);
console.log($.contains(str, 'name'));


var d = '1970-01-01 8:0:12.123'.toDate().format('ts');
console.log(d);
var d = '1970-01-01 9:0:12.123'.toDate().format('ts');
console.log(d);
var d = '2010-01-01 10:0:12.123'.toDate().format('ts');
console.log(d);
var d = '2010-01-02 10:0:12.123'.toDate().format('ts');
console.log(d);


var str = '关闭';
console.log(str.toUnicode());

console.log(new Date().format('ts'));

//select  Auto_increment from information_schema.tables where Table_Schema = 'helmet'  and table_name = 'device_data';


var mc = { con: '0' };

var con = mc && mc['con'] ? mc['con'] : '';



console.log(con);

var name = '无人知晓';
console.log(encodeURI(name));

console.log('abcdd'.startsWith('abc'));
//https://baike.baidu.com/item/%E8%8B%B1%E5%9B%BD%E7%97%85%E4%BA%BA/5410223


var pattern = /<title>(.*)<\/title>/;

var str = '<html><head> <title>这是 标题</title></head></html>';

var mc = str.match(pattern);

console.log(mc);


var str = 'http://122.227.179.90:81/pic/20190507/751064/20190507171742_01_751064_01_0001_thumb.jpg';
var pattern = /(_thumb[\.jpg|.gif])/g;
console.log(pattern.test(str));

console.log((1559905255).toDate().format());

console.log(new Date());
console.log(new Date().format());
/*
var name = {name:'tom'};
console.log('name: {name}, age: {1}'.format(~name, 12));

console.log($.buildParam({action:'getDevice',data: {id:1}}));
console.log($.buildData('getDevice', {id:1}, 'type=2'));
console.log($.buildData('getDevice', {id:1}, {type:3}));
console.log($.buildData('', null, {type:3}));
console.log($.buildData(null, null, 'type=1&id=4'));
*/

console.log((1569683545).toDate().format());

var str = 'http://123';

console.log(str.replace('http:', 'https:'));


function buildResult(arrActor, arrDub) {
    var len1 = arrActor.length,
        len2 = arrDub.length,
        reverse = len2 > len1,
        len = reverse ? len2 : len1,
        x = 0,
        y = 0,
        res = [];

    for (var i = 0; i < len; i++) {
        res.push({ 'actor': arrActor[x], 'dub': arrDub[y] });
        if (++x >= len1 && reverse) {
            x = 0;
        }
        if (++y >= len2) {
            y = 0;
        }
    }
    return res;
}


var num = -111.;
console.log(/^[-+]?(\d+)([.][\d]{0,})?$/.test(num));


var str = '共';
console.log(str.toUnicode());

var fd = { id: 3, name: 'tom' };

console.log(fd, $.toJsonString(fd));

console.log(fd.constructor, typeof fd.constructor);

console.log(Math.round(2 / 135, 2))

console.log((2 / 135).round(2))

console.log(2.5 * 0.50);

function distillPlayIndex(con) {
    var pos = con.indexOf('$http'),
        txt = con.substr(0, pos),
        pattern = /(第|集|期|[-]{2,})/gi,
        idx = txt.replace(pattern, '');
    return idx.replace(/(^[\s]*)|([\s]*$)/g, '');;
}


var str = '\u0027';

console.log($.unicodeToAscii(str))


var nn = 1, sn = '1';
console.log(nn === sn);


console.log('##id'.replace(/^[#]+/, ''));



var pattern = /^[\d\.]+$/g;

console.log(pattern.test('122.227.179.90'))


console.log((1569683545).toDate().format());

var rows = 0, headRows = 2;
rows = headRows || 1;
console.log('rows:', rows)

console.log('2019-11-06 16:23:00'.toDate().format('ts'));

console.log(480 * 3 + 240);

var x = 1, y = 2;
x = x ^ y;
y = x ^ y;
x = x ^ y;

console.log(x, y);


var num = 'a';

console.log(parseInt(num) || parseInt('0x' + num));


var str = ' ';
console.log(str.toUnicode());
var str = '\u0020';

console.log($.unicodeToAscii(str))

//[\s\S\u4e00-\u9fa5]

var ps = '^[\\w\\u4e00-\\u9fa5\\!\\-，。！]*?$';

var reg = new RegExp(ps);

console.log(reg.test('abc你好!a-b123'));

console.log(/^[\w]+$/g.test('a'));

console.log(/(^[a-z0-9]+_)[A-Za-z\d]/.test('device_01'))
console.log(/^[a-z0-9_]+[A-Z]/.test('txt_Name'))

console.log('nameabc'.replace(/(^[a-z\d]+_)|(^txt|ddl|lbl|chb)[_]?/g, ''));


var n22 = 1577261779165;

console.log(n22.toDate().format('tms'));
var n22 = 1577261779271;

console.log(n22.toDate().format('tms'));


var pp = /\<(img[\w\d\s\=\"\-\:\/\.]+)/i;

var str = '<div id="main" class="main" v-data="accd" lang="2" custom-attr="hello" a-b-c="123"> <div class="left tree t1">左边栏</div>'
    + '<img src="http://www.baidu.com/logo.png" /> </div>';
console.log(pp.test(str));
console.log(str.match(pp));

var mc = str.match(pp);
for (var i = 0; i < mc.length; i++) {
    console.log(mc[i]);
}


console.log(new Date());
console.log(new Date().format('ts'));


function buildDeviceCodeList(devCode) {
    //var devCodeList = cms.util.getCheckBoxCheckedValue('chbDevCode', ',');
    var devCodeList = 'add,asd,acc'
    if (devCodeList) {
        devCodeList = (',' + devCodeList + ',').replace(',' + devCode + ',', ',');
        devCodeList = devCode + devCodeList;
    } else {
        devCodeList = devCode;
    }
    if (devCodeList.endsWith(',')) {
        devCodeList = devCodeList.substr(0, devCodeList.length - 1);
    }
    return devCodeList;
};

console.log(buildDeviceCodeList('abc'));

var url = "http://122.227.179.90:40000/device?action=getdeviceinfo&html=1&log=1" +
    "&status=-1&version=1&data=1&page=a&size=20";
var pattern = /(&page=[\d\w]{0,}|&pageIndex=[\d\w]{0,})/i;
var url2 = url.replace(pattern, '');
console.log(url2);


function del(s) {
    return s.endsWith('/') ? s.substr(0, s.length - 1) : s;
}

var s = 'http://122.227.7.1/dev/';

console.log(del(s));


function escape2Html(str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
}

function escape2Html(str) {
    return str.replace(/&(amp);/ig, '&');
}

console.log(escape2Html('http://&amp;'))

function getDomain(s) {
    var pattern = /[a-z\d\.\-\_](^[a-z\d\-\_]+\.[a-z]{2,4}$)/i;

    var m = s.match(pattern);

    console.log(m);
}


function getDomain(s) {
    //var arr = s.split('.'), len = arr.length;
    //return len > 2 ? arr[len - 2] + '.' + arr[len - 1] : s;

    return s.split('.').slice(-2).join('.');
}


console.log(getDomain('iqiyi.com'));

var ids = [1, 2, 3];

console.log(ids.indexOf(2))

if (ids.indexOf(2) > 0) {
    ids.splice(ids.indexOf(2), 1);
}




var f = '{ww60}*1+{AC_}-[51]+[51]';

var r = /\{([\w\d]+)\}/g;

console.log(f.match(r))

console.log($.isArray(f.match(r)))

var mc = f.match(r);
for (var m in mc) {
    console.log('m:', mc[m]);
}

console.log(eval('(' + '1<2?3:4' + ')'));

console.log(f.replaceAll('\\[51\\]', '<ac>'))

console.log('19810309'.separate('-'))

console.log('{0:-422}'.format('19810309'))

console.log('abc'.toDate().isDate())

console.log(new Date().isDate())


console.log(new Date().timeSpan('1981-03-09'.toDate()));

console.log('1981-03-09'.toDate().getAge('2008-06-01'.toDate()))


var code = '330681198103193291';

console.log(code.isIdentity())

console.log($.PATTERN.Date.test('2008-16-01'))


console.log($.PATTERN.Telephone.test('0574-88011324'))



console.log(/[\d]/.test('abcasdfas'))


var n = 1, v = parseFloat('1.0', 10);

console.log(n === v);

function build(url, key, val, append) {
    if ($.isString(key, true) && key.indexOf(',') > -1) {
        key = key.split(',');
    }
    var add = $.isBoolean(append, true), keys = $.isArray(key) ? key : [key], pattern = [];
    for (var i in keys) {
        pattern.push('&' + keys[i] + '=[\\d\\w\\-]{0,}');
    }
    console.log('keys[0]:', keys[0])
    var reg = new RegExp('(' + pattern.join('|') + ')', 'i'), con = '&' + keys[0] + '=' + val;
    return reg.test(url) ? url.replace(reg, add ? con : '') : (!add ? url : url + con);
}

var url = 'http://122.227.179.90:40000/device?action=getdeviceinfo&html=1&page=1';
console.log('url: ', url);
url = build(url, 'page,pageIndex', 2);
console.log('url: ', url);


var obj = { txt: 'hello' };
global.txt = 'world';
console.log('{txt}'.format(global));



console.log('重新加载'.toUnicode());
console.log('重新加载'.chineseToUnicode());



console.log('\\u91cd\\u65b0\\u52a0\\u8f7d'.parseUnicode())




var pattern = /^[1-8][1-9][\d]{4}(19|20)[\d]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[0-1])[\d]{3}[\dX]$/i;

console.log(pattern.test('452402198906571258'))

console.log($.base64)
var code = $.base64.encode('12345');
console.log(code)
console.log($.base64.decode(code + 'ab'))
console.log(code.base64decode())

console.log('ab cd+ah '.trim().replace(/[\-\s]/g, '+'));

console.log(/[\-\s]/g.test('ab'))



//TODO: 测试


console.log('a,bc,d'.replace(/[,]/g, ''))

console.log('{0:E}'.format(1234567890123));


var obj = {
    "deviceid": "002104", "curtime": "2020-01-16 08:31:03",
    "gpsinfo": { "latitude": "", "longitude": "", "gpsdir": "", "speed": "", "ns": "", "height": "" },
    "netinfo": { "signal": "25", "netstatus": "FDD LTE" },
    "other": { "voltage": "116", "electricity": "540" }
};

console.log(typeof obj)

var val = $.getValue(obj, 'other.voltage.voltage', 5);

console.log(val);

var numbers = '1,3,6-9,,12-16,99';

console.log($.expandNumbers(numbers));

var numbers = [1, 2, 3, 5, 6, 9, 21, 22, 23, 99];

console.log($.collapseNumbers(numbers));




var numbers = '1,2,3,5,6,9,21,22,23,99';

console.log($.collapseNumbers(numbers));


var numbers = ',1,,2,4,5,6,,7,8,9';

console.log($.collapseNumbers(numbers));


var str = ',342,260,342,343,344,345,346,347';

console.log(str.insertItem('342'))
console.log(str.insertItem('342').collapseNumbers())


//https://kdocs.cn/l/spobuy32j


console.log('1534406015'.toDate().format())

console.log('{0:X}'.format(123));
console.log('{0:O}'.format(123));
console.log('{0:B}'.format(123).padLeft(8));




var channelid = 4;

console.log({ "length": 20, "start": 0, "ClientType": 5, "searchtext": "", "TypeID": "\"" + channelid + "\"" })


console.log((3750).toTimeStr());
console.log(('01:02:30').toSeconds());


//var abc = eval('\x27' + encodeURI(_0x170a80)['replace'](/%/gm, '\x5cx') + '\x27');
var abc = eval('\x27' + 'abc%123acc'['replace'](/%/gm, '\x5cx') + '\x27');
console.log('\x27' + 'abc%123acc'['replace'](/%/gm, '\x5cx') + '\x27');

console.log(abc);
var abc = eval('\x27' + 'abc%aaabc'['replace'](/%/gm, '\x5cx') + '\x27');

console.log(abc);

//F200909174242248175

console.log('2020-09-25 14:23:00'.toDate())

console.log('2020-09-25 14:23:00'.toDate().format('ts'))



330225195607238611
var id = '500235198508123112';

console.log($.isIdentity(id))


var s = 'QN=?201013091118184;ST=91;PW=123456;MN=7201007;CN=9021;CmdFlag=1;CP=&&VER=ZY720Ver20170308;Mode=0&&';
console.log(s.length)


console.log('2010-11-15 10:39:30'.toDate().format('ts'))
console.log('1594802336000'.toDate().format())
console.log('1594802336000'.toDate().format('yyyy-MM-dd HH:mm:ss'))
console.log('1594802336000'.toDate().format('yyyy-MM-dd HH:mm'))
console.log('1594802336000'.toDate().format('yyyy年MM月dd日 HH时mm分'))

/*
console.log(/(Y-m-d H:i:s)/gi.test('AY-m-d H:i:sZ'))


            if(/(Y-m-d H:i:s)/gi.test(formatString)) {
                d = {
                    Y: y, m: M, d: d, H: H, h: h, i: m, s: s, MM: M.padLeft(2), dd: d.padLeft(2),
                    HH: H.padLeft(2), mm: m.padLeft(2), ss: s.padLeft(2), hh: h.padLeft(2), fff: f.padLeft(3),
                }
            }
*/


//正则替换示例
var str = 'http://xxxx.xx/xxx.jpg';
var str2 = str.replace(/[.](jpg|png|gif)$/gi, function (val) {
    return '_260_360' + val;
});

console.log(str2);

function test2({ id, name }) {

    console.log(arguments);
}

test2(1, 'a')


var pattern = /^[\w.!@#$%^&\*\(\)\[\]{}\?,\|~;:'"<>\-+_=\\/]{3,25}$/;

var pwd = 'abc!(;:\'<]?,.|~{}_=+-\\/';

console.log(pattern.test(pwd))


var pattern = /^a(.*)$/;

console.log(pattern.test('a/abc/as'))

console.log($.numberToChinese(25))

//D:\Android\Android Studio\bin\studio64.exe

console.log($.chineseToUnicode('\''))
console.log($.chineseToUnicode('"'))
console.log($.asciiToUnicode('\''))
console.log($.asciiToUnicode('"'))


var win = {};
console.log(win && win.id)

var num = 11111111111111;
console.log(num + 2);



console.log(128 & 128)


console.log($.buildAjaxData('setMode', { id: 1, name: 'acc' }, { id: 1, name: 'acc' },))

console.log(new Date().getTime())


var obj33 = {
    'A123': 'a123',
    'C123': 'c123',
    'B123': 'b123'
};

for (var k in obj33) {
    console.log(obj33[k]);
}


var items = [
    { host: 'abc', len: 3 },
    { host: 'acc', len: 2 },
    { host: 'asd', len: 5 }
];

items.sort(function (a, b) {
    return a.len - b.len;
});

console.log(items);

let a = 5;      // 00000000000000000000000000000101
a |= 3;         // 00000000000000000000000000000011

console.log(a); // 00000000000000000000000000000111


var dt = new Date('2010/08/05');
console.log(dt.format());

console.log(dt.getAge());


var str = '&type={type|1}&id={id|0}';

console.log(str.format({ type: 0 }))
console.log(str.format({ id: 5 }))


console.log(505 - 505 % 20);

console.log('2010-11-15 10:39:30'.toDate().format('ts'))

console.log('2021-05-20 14:28:31'.toDate().format('ts'));


//ac32fc60


function parseCapturePlan(plan) {
    //010103000aff0000ff1600ff
    if (plan.length < 24) {
        return plan;
    }
    var c = parseInt(plan.substr(4, 2), 10);
    var times = [];
    for (var n = 0; n < parseInt(c / 3, 10); n++) {
        var len = 3 * 2 * 3;
        var con = plan.substr(6 + len * n, len);
        var t = '';
        var j = 0;
        for (var i = 0; i < con.length; i += 6) {
            var h = hexToInt(con.substr(i, 2)),
                m = hexToInt(con.substr(i + 2, 2)),
                p = hexToInt(con.substr(i + 4, 2));

            j++;
            switch (j % 3) {
                case 0:
                    t += ' - ' + h + ':' + m + ' ]';
                    times.push(t);
                    t = '';
                    break;
                case 1:
                    t += parseInt(h, 10) * 60 + parseInt(m, 10) + ' ';
                    break;
                case 2:
                    t += '[ ' + h + ':' + m;
                    break;
            }
        }
    }
    return times.join(', ');
}


function reverseHex(hex) {
    var arr = [], len = parseInt(hex.length, 10);
    for (var i = 0; i < len / 2; i++) {
        arr[len - i * 2 - 1] = hex[i * 2 + 1];
        arr[len - i * 2 - 2] = hex[i * 2];
    }
    return arr.join('');
}

function hexToInt(hex, reverse) {
    if (reverse) {
        hex = reverseHex(hex);
    }
    var n = eval('0x' + hex).toString(10);
    return parseInt(n, 10);
}

function hexToTime(hex, reverse) {
    var num = hexToInt(hex, reverse);
    return num.toDate().format();
}

console.log(parseCapturePlan('010103000aff0000ff1600ff'));

console.log((1629272718).toDate().format());

console.log((parseInt(new Date().format('ts') / 1000) - 300482).toDate().format())

console.log('bcf42961'.hexToTime(true));
console.log('bdf42961'.hexToTime(true));

console.log('bcf42961'.hexToInt(true));
console.log('8f594b61'.hexToInt(true).toDate().format());

console.log('3132333435363738393031323334303130'.hexToStr());
console.log('3132333435363738393031323334303130'.hexToNum());

//console.log('a55a0e00313233343536373839303132333430313005ce0201ffe44c26610000000000000000e30d96'.hexToStr());
//console.log('a55a0e00313233343536373839303132333430313005ce0201ffe44c26610000000000000000e30d96'.hexToNum());
//console.log('a55a0e00313233343536373839303132333430313005ce0201ffe44c26610000000000000000e30d96'.hexToAscii());

console.log('12345678901234010'.toAscii());
console.log('12345678901234010'.toAsciiHex(true));
console.log(''.toAsciiHex([0x5a, 165, 90, '12345678901234010', 96, 90], true));
console.log($.toAsciiHex([0x5a, 165, 90, '12345678901234010', 96, 90], true).toLowerCase());

console.log((1629272106).toAsciiHex().reverseHex().reverseHex());
console.log((165).toAscii());
console.log(('165').toAsciiHex());
console.log(('165').toAscii());
console.log($.toAsciiHex(165, true));

console.log(parseInt(new Date().getTime() / 1000, 10))


function toTime(ts) {
    var len = ('' + ts).length;
    if (len < 13) {
        ts *= Math.pow(10, 13 - len);
    }
    var date = new Date(ts + 8 * 3600 * 1000);
    return date.toISOString().substr(0, 19).replace('T', ' ');
}
console.log(toTime(1636514639)); // "2018.08.09 18:25:54"

var arr = ['abc', 'acc'];
arr = arr.concat(['123', '456']);

console.log(arr);



console.log($.chineseToUnicode('\''))
console.log($.chineseToUnicode('"'))
console.log($.asciiToUnicode('\''))
console.log($.asciiToUnicode('"'))

console.log('abc'.toAscii())

console.log(String.fromCharCode('97'))
console.log(String.fromCharCode(13))
console.log(String.fromCharCode(10))

console.log($.asciiToChar([97, 98, 99]));
console.log($.asciiToChar('97, 98, 99'));
console.log($.asciiToChar('97, 98, 99'));

console.log($.toAscii('123'));
console.log($.toAsciiHex('123'));

var dt = new Date('2051/01/01');
console.log(dt.format('ts'));

console.log('97, 98, 99'.asciiToStr())
console.log($.asciiToStr('32303231'.hexToAscii()))
console.log('32303231'.hexToAscii().join(',').asciiToStr())

console.log('2021'.toAscii())
console.log('2021'.toAsciiHex())


console.log((1638518099).toDate().format());
console.log('7B5C4B61'.hexToInt(true).toDate().format());

console.log('isWap: ', $.isWap);

var $$ = {};
$$.isChrome = true;
$$.isChrome = function () {
    return false;
};

console.log('$$.isChrome:', $$.isChrome);

var css = '1  2    3 4';
var arr = css.split(/[A]+/);
console.log(arr);

console.log(-1000 >>> 2)
console.log(-1000 >> 2);

var ts = parseInt('4102415999000', 10) + 1;
console.log('ts:', ts)


var opt = [
    [5, '5'], [10, '10']
];

console.log(1.5 * 60 * 60);


var getTimeNumber = function () {
    var dt = new Date(),
        h = dt.getHours(),
        m = dt.getMinutes(),
        s = dt.getSeconds(),
        val = h + '' + (m < 10 ? '0' + m : m) + '' + (m < 10 ? '0' + s : s),
        num = parseInt(val, 10);
    return num;
};

console.log(getTimeNumber());


var points = [{ "start": 800, "end": 1000 }, { "start": 600, "end": 750 }];
points.sort(function (a, b) { return a.start - b.start });

console.log(points);
console.log('5469a061'.hexToInt(true).toDate().format('ts'));
console.log('3956aa61'.hexToInt(true).toDate().format());


var p2 = /(up|down|left|right)/gi;

console.log(p2.test('topleft'));
console.log('\n');



var n = 35,         //总数量
    x = 2,          //买的数量
    y = 1,          //送的数量
    p = 8;          //单价

var num = (n - n % (x + y)) * x / (x + y) * p + (n % (x + y) * p);
console.log('总价：', num)

var num2 = n * x / (x + y) * p;
console.log('总价：', num2);

console.log('\n\n\n')
console.log((1638518099).toDate().format());
console.log('8d2aab61'.hexToInt(true).toDate().format('ts'));

var con = 'abc<svg xmls="http:///"></svg>acc';
var pattern = /[<](svg)(.|\n)*?[><\/](svg)[>]/;

console.log(con.match(pattern));

console.log(con.replace(pattern, "$1 $3", "img"))

var con = 'abc<svg xmls="http://www.baidu.com/"></svg><svg xmls="http://www.baidu.com/"></svg>acc';
console.log(con.replace(/[<](svg)/gi, "<img").replace(/><\/svg>/gi, " />"));

var pattern = /^[0-9A-Z][0-9A-Z_#&$\-]{1,16}$/i;
var id = '869383054030390@';

console.log(pattern.test(id));

var filesize = 1069238;
var mb = 1024 * 1024;

var tn = parseInt(filesize / mb, 10);
console.log(tn);
var fs = tn + (Math.round((filesize % mb) / mb * 1000) / 1000) + 'MB';

console.log(fs);
console.log((Math.round((filesize % mb) * 1000) / 1000));

console.log(filesize % mb / mb);

console.log(mb);


var url = 'http://112.54.97.178:81/api/?id=123&type=udp&line=-1';
url = url.setUrlParam({ line: 0, transmode: "udp" }, false);
console.log(url);

var val = false;
console.log($.isBoolean(val, true))

console.log($.setUrlParam('key', 'val', true));

var str = 'line={line|-1_1}&type={type;type2|udp}';
console.log(str.format({ line: 2, type3: 123 }));

var str = 'line={data.key2,key|a}';
console.log(str.format({ data: { key3: 'abc' } }));

var str = "val2={val}";
console.log(str.formatError(false).format({ val2: 123 }));

var str = "val3={data.val}";
console.log(str.format({ data: { val: 12345 } }));

var str = "id={data>id,code|-1}";
console.log(str.format({ data: { ids: "abc" } }));

var str = "id={0:d3}";
console.log(str.format(1));

console.log('{0:X4}'.format(121))
console.log('{0:X4}'.format(0x79))



console.log('dt:', '2021-01-06 13:25:12'.toDate('HH:mm'))
console.log('{0:F3}'.format(12.5))

console.log('{0:s644}'.format('330226195905265112'))
console.log('{0:-344}'.format('13626836885'))
console.log('13626836885'.formatTo('{0:-}'))
console.log('{0::}'.format('330226195905265112'))
var num = 12.5;
console.log(num.formatTo('{0:C3}'))
console.log(num.formatTo('{0:F3}'))
console.log((12).formatTo('{0:D3}'))

var k = 's';
console.log('a b c'.replace(new RegExp('\\' + k, 'gi'), '2'))

console.log('{0:S34}'.substr(2 + 1, 1));
console.log('{0:s445}'.format('12345678901234001'))




console.log('重新加载'.chineseToUnicode());
console.log('\\u91cd\\u65b0\\u52a0\\u8f7d'.unUnicode());

console.log($.unUnicode('\\u91cd\\u65b0\\u52a0\\u8f7d'));


console.log((1648606421).toDate().format());
console.log('e1a4e561'.hexToInt(true).toDate().format('ts'));
console.log('8d2aab61'.hexToInt(true));
//a55a0e00485a534830303130453637353530303935 05ce21 01 ff 61e5a4e6 0000000000000000 1a1996

console.log('e1a4e561'.hexToInt(true).toDate().format());
console.log('5e15e661'.hexToInt(true).toDate().format());
console.log('499602d2'.hexToInt(true).toDate().format());

//a55a0400485a53483030313045363735353030393507e6010527e661100096


var str22 = 'abc123';
console.log(str22.insert('Hello', 1, 2));


console.log('{0:s44-}'.format('1234567890123400123456'))
console.log('{0:s64-}'.format('330681198103093291'))

var num = 450*2+1080+1500*6+2100+3000*2;
console.log(num);
var num = 360*3+1200*9;
console.log(num);


var num = 330*3+890+1100*8;
console.log(num);
var num = 240*4+520+800*7;

var x = 50, y = 80, c = 800;

var a2 = 50 * c / y;

console.log('a: ', a2);

var z = (x + y) * ( c / y) / 2;

console.log(z)

console.log('7b22636f6d6d616e64223a226865617274626561745f696e74657276616c222c2274797065223a2272657175657374222c2273657175656e6365223a302c22626f6479223a7b7d7d'.hexToStr());
console.log('7b22636f6d6d616e64223a226865617274626561745f696e74657276616c222c2274797065223a2272657175657374222c2273657175656e6365223a302c22626f6479223a7b7d7d'.hexToStr().toAscii());
console.log('7b22636f6d6d616e64223a226865617274626561745f696e74657276616c222c2274797065223a22726573706f6e7365222c2273657175656e6365223a302c22737461747573223a312c22626f6479223a7b22696e74657276616c223a39307d7d'.hexToStr());
console.log('{"command":"heartbeat_interval","type":"request","sequence":0,"body":{}}'.toAsciiHex(true));

console.log('{"command":"heartbeat_interval","type":"request","sequence":0,"body":{}}'.toHex().toLowerCase());
console.log('10'.toHex().toLowerCase());
console.log((10).toHex().toLowerCase());

console.log($.protocol.i1)


console.log(new Date().format())
console.log(new Date().addSeconds(-1).format())




console.log((1648631412).toDate().format());

var path = "/pic/20220330/12345678901234010/20220330133034_01_12345678901234010_000_01_21.txt";

console.log(path.getFileName());
console.log(path.getFileName(true));
console.log(path.getExtension());
var path = "/pic/20220330/12345678901234010/20220330133034_01_12345678901234010_000_01_21.tar.gz";

console.log(path.getFileName());
console.log(path.getFileName(true));
console.log(path.getExtension());


console.log($.i1('[2022-05-08 09:36:13.553] [i] recv 219 hex bytes: a55ac000313233343536373839313234000000000003f60001017b22636f6d6d616e64223a227365745f6169222c2274797065223a2272657175657374222c2273657175656e6365223a313635313937333737342c22626f6479223a7b22656e61626c65223a312c226970223a223139322e3136382e312e3630222c22706f7274223a333030302c2274696d656f7574223a33302c2273746172745f6475726174696f6e223a34352c22636865636b5f616c61726d5f64617461223a302c227570646174655f74696d65223a313635313937333737347d7dc6bf96'));
/*
console.log('0305'.hexToInt(true));
console.log('0305'.charToInt(true));
console.log('6242b5d5'.hexToInt(false));
console.log('6242b5d5'.charToInt(false));

console.log('6242b5d5'.hexToNum(false));

console.log('0029b062'.hexToNum(false));
*/

console.log($.getMonthStart(3));
console.log(new Date().getMonthEnd(3));

console.log(new Date().getDate());


console.log('重载'.toUnicode());

var name = 'pic/1.jpg';

console.log(name.addNamePostfix('_thumb'));


console.log('//pic/1.jpg'.checkFilePath());
console.log('http://baidu.com//pic/1.jpg'.checkFilePath());
console.log('https://baidu.com//pic/1.jpg'.checkFilePath());

var num = '0';

console.log(num ? 'a' : 'b');

console.log(new Date().getDate());

console.log(''.hexToStr())
console.log((1652879090).toDate());
console.log((1661756390).toDate().format());

var val = 1655683800 + 28800;
console.log('val:', val);

var dt = new Date().addDays(-1).getDayStart();
console.log(dt.format());

console.log('0029b062'.hexToNum(true));
console.log('582bb062'.hexToNum(true));


var data = {channel_no:0,id:123};

console.log(data);

delete data.channel_no;

console.log(data);

var enable = '0';

console.log(parseInt(enable, 10) ? 'a':'b');

console.log(Math.pow(2, -2));


console.log(1/Math.pow(2, 2));

console.log(new Date().format('ts'));

var ts = new Date().format('ts');
console.log(ts);
console.log(ts.toDate().format());





 var toTimeFormat = function (ts) {
            if (!ts || ts <= 0) {
                return '';
            }
            var len = ('' + ts).length;
            if (len < 13) {
                ts *= Math.pow(10, 13 - len);
            }
            var date = new Date(ts + 8 * 3600 * 1000);
            console.log(date.toISOString());
            return date.toISOString().substr(0, 19).replace('T', ' ');
        };



console.log(toTimeFormat(new Date().getTime()));


console.log($.crc.toCRC16('a55a0002f20100ff01', true));
console.log($.crc.toModbusCRC16('a55a0002f20100ff01', true));


console.log(JSON.parse('{"id":1}'));
console.log((1664171400).toDate().format());

console.log('18f30c63'.hexToInt(true).toDate().format());
console.log('e9f20c63'.hexToInt(true).toDate().format('ts'));

console.log('2022-09-01 16:00:00'.toDate().format());
console.log('2022-09-07 10:10:25'.toDate().format('ts', 10));
console.log((1662426572-8*60*60*2).toDate().format());

console.log('905d1863'.hexToInt(true).toDate().format());
console.log('12345678'.hexToInt(true).toDate().format('ts'));
console.log('2022-09-18 00:00:00'.toDate().format('ts', 10));
console.log((0).toDate().format());




//关闭摄像机电源之前，先发送 摄像机重启命令
//以保护TF卡
/*

    char cmd[128] = { 0 };
    char out[128] = { 0 };

    char* app_tmp_path = "/tmp/down/zyrh";
    sprintf(&cmd[0], "mkdir /tmp/down & curl -o %s \"%s\" && echo ok", app_tmp_path, "http://112.54.97.178:81/download/dtu/zyrh2.zip");
    get_system_output(cmd, out, 128);
    app_log_info("down out: %s", out);

    sprintf(&cmd[0], "%s check", "chmod 755 /tmp/down/zyrh && /tmp/down/zyrh");
    get_system_output(cmd, out, 128);
    app_log_info("check out: %s", out);

    do_system_call("kill -9 $(pidof zyrh) & cp /tmp/down/zyrh /tmp/zyrh_copy");

    */

console.log($.getFileName);
var name = $.getFileName('http://112.54.97.178:81/download/dtu/zyrh-20220927.0930-420284.zip', true);
console.log(name);

var txt = '[\
    {\
        "deviceid" : "34020000001110000993",\
        "index" : 0,\
        "ip" : "112.54.97.178",\
        "keepalivetime" : 1665365702,\
        "online" : 1\
    }\
]';

console.log(txt);

var json = JSON.parse(txt);

console.log(json, json[0]);

var path = 'C:\\\\fakepath\\\\mcu.hex-20221012.1100-4a982e356201bdda433069987b05a224-33114.zip';

path = path.replace(/(\\)/g, '/');

console.log(!/^[0-9A-F]{32}$/i.test('968a5a541382740c9ea2806db2611a79'));



console.log((1666056293000).toDate().format());
console.log((1666944001).toDate().format());

console.log(''.toUnicode());

console.log(new Date() - new Date().addDays(-1));


//2890

; !function () {
    var dtu = {};

    return dtu;
}();


var measure = {};


function makeFunc() {
    var name = "Mozilla";
    function displayName() {
        console.log(name);
    }
    return displayName;
}

var myFunc = makeFunc();
myFunc();



var con = '##000169QN=1669537704000;CN=9021;PW=01=ZY-920-;MN=868957048162806;Flag=1;CP=&&Model=ZY-920-GS;CCID=89860473102270000663;HardwareVersion=20190430;SoftwareVersion=20191128custom&&D57A';

var msgs = [
    '##000169QN=1669537704000;CN=9021;PW=01=ZY-920-;MN=868957048162806;Flag=1;CP=&&Model=ZY-920-GS;CCID=89860473102270000663;HardwareVersion=20190430;SoftwareVersion=20191128custom&&D57A',
    '##000031CN=9051;MN=868957048175048;MD=033CC'
];

var m = con.match(/PW=[=\-\d\w_]+;/);


console.log(m[0], m);

if(m[0].substr(3).indexOf('=') >= 0){
    con = con.replace(m[0], "PW=123456;");
    console.log(con);
}

console.log('c' && '' || 'a' + 'b');

console.log(2000 - 800 > 1000);

console.log('' || 'b' && 'c' ? 1 : 0);

console.log(9**3, 9*9*9, Math.pow(9, 3), Math.pow(9, 1), Math.pow(9, 0), 9**1, 9**0);

console.log(''.toUnicode());

var str ="val={val}"; console.log(str.format({val:123}));
var str ="val={data.val}"; console.log(str.format({data:{val:123}}));
var str ="id={data>id,code}"; console.log(str.format({data:{code:"abc"}}));

console.log('1345'.toHex().padLeft(4));
console.log((1345).toHex().padLeft(4));
console.log((10).toHex(4, true).padLeft(4));

console.log('3039'.hexToInt());

console.log(parseInt('833:1234', 10));

var aa = 1, bb = 2, cc = 3, dd = 4;

console.log(aa,bb,cc,dd);

console.log(aa >= 1 && bb >= 2 || cc <=3 && dd >= 4);

var url = '/libs/oui/dialog/oui.dialog.min.js?skin=zyrh&logo=0&reloadPos=left&140733';
console.log('pos: ', url.getQueryString(['reloadPosition','reloadPos']));

console.log('关于'.toUnicode());

console.log(new Date().getDay());
console.log('000160'.hexToInt());


var data = {
    "result": 1,
    "list": [
        {
            "Device": "869383054027644",
            "Sequence": "1676010492",
            "Status": 1,
            "Body": {
                "count": 13,
                "list": [],
                "msg": "a55a0078c60101ff00010000000001600001200013dc00014f000120001d7800016000012000238a0001600001200027d0000160000120002b2c000160000120002de200016000012000303a0001600001200034170001600001200035cb00016000012000375b000160000120003fad000160000120004000000160000120515396"
            },
            "Message": "a55a0078c60101ff00010000000001600001200013dc00014f000120001d7800016000012000238a0001600001200027d0000160000120002b2c000160000120002de200016000012000303a0001600001200034170001600001200035cb00016000012000375b000160000120003fad000160000120004000000160000120515396",
            "CreateTime": "/Date(1676010492432)/",
            "FinishTime": "/Date(1676010493060)/"
        }
    ]
};

var msg = $.getValue(data.list[0], 'Body.msg');
console.log('showCursorConfig:', msg);

console.log(data.list[0].Body.msg);

$.console.info('123', '456', 'abc').timeformat('tms').log('123', '456', 'abc');
$.console.debug('123', '456', 'abc');
$.console.warn('123', '456', 'abc');
$.console.error('123', '456', 'abc');
$.console.trace('123', '456', 'abc');


var dt =new Date();

console.log(dt.toISOString());

console.log(new Date().format('utc'))

console.log(new Date('20230221T154314418'));


console.log((100/1000))
console.log((1678118400).toDate().format());
console.log((1679387828).toDate().format());


var obj = { id: 123, name: 'abc', data: undefined, str: 'undefined' };

console.log(obj);


var measure = {
    getAngleRange: function (a, b, loopback) {
        var c = b - a;
        return c >= 0 ? c : loopback ? c + 360 : a - b;
    },
    isSameAngleArea: function (a, b, angle_range) {
        angle_range = !angle_range ? 180 : parseInt(angle_range, 10);

        if (!angle_range) {
            return false;
        }
        return parseInt(a, 10) / angle_range === parseInt(b, 10) / angle_range;
    },
    getRowCol: function (angle, step) {
        var c = step === 0 ? 0 : angle === 0 ? 1 : angle / step,
            n = parseInt(c, 10);
        return c - n > 0 ? n + 1 : n;
    }
};

console.log(measure.getAngleRange(355, 6, 1));
console.log(measure.getRowCol(11, 0.15));


console.log('905d1863'.hexToInt(true).toDate().format());
console.log('905d1863'.hexToInt(true));

console.log((12345.56).toString(16));
console.log((12345).toHex());
console.log(('3039').hexToInt());


function HexToDouble(ca2){
    var t = parseInt(ca2,16).toString(2);
    if (t.length < 64) {
        t = FillString(t, "0", 64, true);
    };
    var s = t.substring(0, 1);
    var e = t.substring(1, 12);
    var m = t.substring(12);
    e = parseInt(e, 2) - 1023;
    m = "1" + m;
    if (e >= 0) {
        m = m.substring(0, e + 1) + "." + m.substring(e + 1)
    }
    else {
        m = "0." + FillString(m, "0", m.length - e - 1, true)
    }
    if (m.indexOf(".") == -1) {
        m = m + ".0";
    }
    var a = m.split(".");
    var mi = parseInt(a[0], 2);
    var mf = 0;
    for (var i = 0; i < a[1].length; i++) {
        mf += parseFloat(a[1].charAt(i)) * Math.pow(2, -(i + 1));
    }
    m = parseInt(mi) + parseFloat(mf);
    if (s == 1) {
        m = 0 - m;
    }
    return m;
}
function FillString(t, c, n, b) {
    if ((t == "") || (c.length != 1) || (n <= t.length)) {
        return t;
    }
    var l = t.length;
    for (var i = 0; i < n - l; i++) {
        if (b == true) {
            t = c + t;
        }
         else {
            t += c;
        }
    }
    return t;
}

console.log('123.456:', '123.456'.floatToHex(true));
console.log('78e9f642:', '78e9f642'.hexToFloat(true, 3));

console.log('0029b062:', '0029b062'.hexToNum(true));
console.log('582bb062:', '582bb062'.hexToNum(true));


console.log(HexToDouble('40dd7ac4b41562f9'));
console.log('c640e600'.hexToFloat(false));


console.log('905d1863'.hexToInt(true));

console.log($.padLeft('123', 8));

console.log(43 + 50 + 10 + 4 + 50 + 4 + 20 + 30);



var name22 = '12342-V2';
var len22 = name22.length;

console.log(name22.substr(len22-3, 3));

var isNumber = function (n) { return typeof n === 'number'; };
var setNumber = function(n, min, max) {
    var isNum = isNumber(n), isMin = isNumber(min), isMax = isNumber(max);
    return isNum ? (isMin && isMax ? (n < min ? min : (n > max ? max : n)) : (isMin ? (n < min ? min : n) : isMax ? (n > max ? max : n) : n)) : n;
};

console.log(setNumber(3, 1, 5));

console.log((32).check(1, 5));
console.log((32).set(1, 5));


var str = '/vod/1/f3aa6d9b-a09f-453e-aa8d-202c9858fb03/c89cacaaf48e46f9';
var reg = /([\da-f]{8}(\-[\da-f]{4}){3}\-[\da-f]{12})/ig;
console.log(str.match(reg))



//用于获取参数名重载
var getParVal = function(par0, par1, par2) {
    for(var i = 0; i < arguments.length; i++) {
        if(typeof arguments[i] !== 'undefined') {
            return arguments[i];
        }
    }
    return undefined;
};

var obj = {Id:45};

console.log(getParVal(obj.id, obj.ID, 34));