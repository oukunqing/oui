require('./oui');
require('./form/oui.form');

//  118.25.125.18   debian 9

/*
console.log((1547429280).toDate().format())

var dt1 = '2018-11-15 00:00:00'.toDate();

console.log(dt1.format('ts', 10));

var dt2 = '2019-01-21 13:00:00'.toDate();G

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

var name = 'pic/1.jpg';

console.log(name.addNamePostfix('_thumb'));

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
    //console.log(String.formatError(false).format({ val2: 123 }));

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


    console.log((1 + 100) * 50)


    var x = 2, y = 100;
    var z = (x + y) * (y - x + 1) / 2;

    console.log(z);


    console.log('重新加载'.chineseToUnicode());
    console.log('重新加载'.toUnicode());
    console.log('\\u91cd\\u65b0\\u52a0\\u8f7d'.unUnicode());

    console.log($.unUnicode('\\u91cd\\u65b0\\u52a0\\u8f7d'));


    console.log((1642439910).toDate().format());
    console.log('e1a4e561'.hexToInt(true).toDate().format('ts'));
    console.log('8d2aab61'.hexToInt(true));
//a55a0e00485a534830303130453637353530303935 05ce21 01 ff 61e5a4e6 0000000000000000 1a1996

    console.log('e1a4e561'.hexToInt(true).toDate().format());
    console.log('5e15e661'.hexToInt(true).toDate().format());
    console.log('e2a4e561'.hexToInt(true).toDate().format());
    console.log('0527e661'.hexToInt(true).toDate().format());

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

    var path = 'HTTP://112.54.97.178:81/upfiles/datum/update-20230419.1000-76c638ade0081c2c9cb499675e32be20-33181822-V1.tar.gz?ts=1234';

    console.log('path:', path);
    console.log('getFilePath:', path.getFilePath(true));
    console.log('getUrlHost:', path.getUrlHost(true));

    console.log($.getUrlHost(path, true));
    console.log($.getFilePath(path, 'http://112.54.97.178:81/upfiles/datum/'));
    console.log('getFileName:', $.getFileName(path, false));
    console.log('getFileName:', $.getFileName(path, true));
    console.log('getFileName:', path.getFileName(true));
    console.log($.getFullPath(path, true));
    console.log(path.getFullPath( true));
    console.log(path.getExtension( true));
    console.log(path.getFileDir( true));
    console.log('/upfiles/datum/update-20230419.rar'.getFileDir());
    console.log('/upfiles/datum/update-20230419.rar'.getFileDirName());

    console.log((4780638).toFileSize());


    var title='', userId = 0;

    console.log(title || (userId ? '编辑用户信息' : '新增用户信息'));


    var config = {
        language:{
            name   : "cn",
            month  : ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            weeks  : [ "日", "一", "二", "三", "四", "五", "六" ],
            times  : ["小时","分钟","秒数"],
            timetxt: ["时间选择","开始时间","结束时间"],
            backtxt:"返回日期",
            clear  : "清空",
            today  : "现在",
            yes    : "确定"
        },
            format:"YYYY-MM-DD hh:mm:ss",               //日期格式
            minDate:"1900-01-01 00:00:00",              //最小日期
            maxDate:"2099-12-31 23:59:59",              //最大日期
            isShow:true,                                //是否显示为固定日历，为false的时候固定显示
            multiPane:true,                             //是否为双面板，为false是展示双面板
            onClose:true,                               //是否为选中日期后关闭弹层，为false时选中日期后关闭弹层
            range:false,                                //如果不为空且不为false，则会进行区域选择，例如 " 至 "，" ~ "，" To "
            trigger:"click",                            //是否为内部触发事件，默认为内部触发事件
            position:[],                                //自定义日期弹层的偏移位置，长度为0，弹层自动查找位置
            valiDate:[],                                //有效日期与非有效日期，例如 ["0[4-7]$,1[1-5]$,2[58]$",true]
            isinitVal:false,                            //是否初始化时间，默认不初始化时间
            initDate:{},                                //初始化时间，加减 天 时 分
            isTime:true,                                //是否开启时间选择
            isClear:true,                               //是否显示清空按钮
            isToday:true,                               //是否显示今天或本月按钮
            isYes:true,                                 //是否显示确定按钮
            festival:false,                             //是否显示农历节日
            fixed:true,                                 //是否静止定位，为true时定位在输入框，为false时居中定位
            zIndex:9999,                                //弹出层的层级高度
            method:{},                                 //自定义方法                
            theme:{},                                   //自定义主题色
            shortcut:[],                                //日期选择的快捷方式
            donefun:null,                                //选中日期完成的回调
            before:null,                                //在界面加载之前执行
            succeed:null,                                //在界面加载之后执行  
            clickCallback: false,                        //是否点击后立即回调
            callback: null,                               //自定义的回调函数
            parent: null                                  //容器
        };

        var options = {
            language: {yes:'OKOK'},
        };
        $.extend(config.language, options.language || {});
        delete options.language;

        var cfg = $.extend(config, options||{});


        console.log(cfg);

        var dir = 'top';
        console.log(dir === 'left' || dir === 'right' ? 100 : 50);

        function loadtest() {
            if(!$.firstLoad([12,13])) {
                return false;
            }
            console.log('loadtest');
        }
        console.log($.firstLoad(''));
        console.log($.firstLoad('a'));
        console.log($.firstLoad(''));
        console.log($.firstLoad({id:3}));

        loadtest();
        loadtest();
        loadtest();
        loadtest();

        console.log(new Date('Wed Feb 14 2001 08:00:00 GMT+0800 (中国标准时间) '))

        console.log(new Date())



        function toDateFormat(dt) {
            var year = dt.getFullYear(),
            month = dt.getMonth() + 1,
            date = dt.getDate();

            var val = year + '-' + month + '-' + date;

            return val;
        }

        console.log(toDateFormat(new Date()))

        console.log(new Date().format());
        console.log(new Date().format('yyyy-MM-dd'));
        var ts = parseInt(new Date().getTime()/1000, 10);
        console.log(ts);
        console.log(new Date((ts + 30)*1000).format());

        var title = 'abc<br/>123';
        console.log(title.encodeHtml())
        console.log(title)

        var fd = { title: 'abc<br />1&2"3', id: 123, content: '你好abc', desc: '<a>aa</a>' };
        console.log($.encodeHtml(fd, ['title', 'desc']));
        console.log(fd);
        console.log($.decodeHtml(fd, 'title,desc'));

        console.log('ab|ac,123||4t,aa'.splitStr(/[,|]/g))

        console.log('{0}'.format(123));

        var val = '0', val2 = '';

        console.log(val||val2);

        console.log('AAAAAA');
        console.log('abc\n\n\nasd\n\n123'.removeEmptyLine())
        console.log('BBBBBB');
        console.log('abc\r\n\r\n\nasd\r\n    \r\n  \r\n12\r5\r4\n3'.removeEmptyLine())
        console.log('CCCCCC');
        console.log('abc\r\rasd\r\r123'.removeEmptyLine())

        console.log('test<<<<<script 123 >>>>《你好》 2<3 b>a c<d <script>alert(123);</script><a>'.filterHtml());

        console.log('a‘b"\id=1'.toDate());

        var obj = 'abc';

        console.log(new Date() instanceof Date);

        console.log(Date.parse('2023-06-07'));
        console.log(new Date(Date.parse('2299-06-07 09:20:10')).getTime());
        console.log(new Date(Date.parse('1970-01-01 00:00:00')).getTime() + 8*3600*1000);

        console.log(new Date(0));
        console.log(new Date('2023-06-07'));
        console.log(new Date('a‘b"\id=1'));
        console.log(new Date(Date.parse('a‘b"\id=1')));
        console.log(new Date(0000000000000));

        var isDateString2 = function (str) {
            var pattern = /^(19|20|21)[\d]{2}[-\/](1[012]|0?[\d])$/;

    //只考虑当前有效的时间戳格式
            return /^[0-9]{10,13}$/.test(str);
        };

        console.log(isDateString2('1686096000000'));

        console.log($.PATTERN.Date.test('2023-6-7'));
        console.log($.PATTERN.DateTime.test('2023-6-7 9:22:25'));
        console.log($.PATTERN.DateTime.test('2023-06-07'));

        console.log($.PATTERN.IOTMobile.test('14112345678'));

        console.log('/module.aspx'.setQueryString({module:'10001', menuCode:'10001'}, false));

        function getQKey(obj, name) {

            if (!$.isNullOrUndefined(name)) {
                if ($.isString(name, true) && /[,|]/g.test(name)) {
                    name = name.split(/[,|]/g);
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
            return '';
        }

        console.log(getQKey({id:123,code:'abc',name:'asd',debug3:1}, 'debug,debug2'));

        console.log(Math.pow(5, 2));
        console.log(Math.pow(5, 3));
        console.log(Math.pow(5, 1));
        console.log(Math.pow(5, 0));
        console.log(Math.pow(5, -1));
        console.log(Math.pow(-5, 3));
        console.log(Math.pow(-5, -1));

        console.log('2099-12-31 23:59:59'.toDate().format('ts'));

        console.log((1687305181).toDate().format());
        console.log((1687333981).toDate().format());

        console.log('b1b29264'.hexToTime());
        console.log('21ac9264'.hexToTime());

        console.log($.jsonToIni({id:123}));

        console.log('{"id":123}'.jsonToIni());

        var obj = {id: 1234, name: 'abc'};

        console.log(obj);
        console.log($.toJsonStr(obj).jsonToIni());

        var body = {server__http_port:123, "server__version": 'abc'};
        console.log(body);
        console.log($.toIniJson(body, '__'));
        console.log($.jsonToIni($.toIniJson(body)));

        console.log(new Date().format('ts', 10));

        var cache = {};
        console.log($.toJsonString(cache).length);

        var a1 = 0, b1 = 0;

        console.log(a1 || b1 ? '123' : 'abs');

        var url = '/modules/picturePlay/show/test.ashx?&device={0}&path={1}&idx={2}&name=abc#你好{3}&history={4}';

        var device = 'dx01',
        path = '/pic/20230710/305283/20230710080143_01_305283_001_01.jpg',
        idx = 1,
        deviceName = '35 JiDian 11X 72#/JiDian 12X 61#(SP001)', 
        history = 0;

        console.log(url.format(device, path, idx, deviceName, history));

        var pattern = /^(\/|http:\/\/|https:\/\/)(.*)(.(as[hp][x]?|jsp|[s]?htm[l]?|php|do)|\/)\?[&]?(.*)=(.*)([&]{1,}(.*)=(.*)){0,}/gi;
        console.log('a', pattern.test('/modules/show/?device={0}&path={1}&idx={2}&name={3}&history={4}'));
        console.log('b', $.PATTERN.UrlParam.test('/modules/show/?device={0}&path={1}&idx={2}&name={3}&history={4}'));
//cq15871462362
/*
1.自动推送
2.审核推送->未审核->延时推送
3.审核推送->未审核->取消推送（不推送）
4.审核推送->已审核->立即推送
5.审核推送->已审核->延时推送
6.审核推送->已审核->取消推送（不推送）
*/

        console.log($.getUrlHost('/abc/1.aspx'));
        console.log('c', $.PATTERN.UrlParam.test('/modules/show/?device=123'));

        var pattern22 = /^(\/|http:\/\/|https:\/\/)(.*)(.(as[hp][x]?|jsp|[s]?htm[l]?|php|do)|\/)(\?[&]?(.*)=(.*)([&]{1,}(.*)=(.*)){0,})?/gi;
        console.log('c', pattern.test('http://112.54.97.178:81/?a=b&id=1'));

        console.log((0).toTimeStr());

        console.log((150)|15<<8);

        var str = '#comment\n';

        console.log(/^\s*#[\s\S]*?\n/.test(str));

        console.log(str.replace(/^\s*#[\s\S]*?\n/, ""));

        console.log('data:image/jpg;base64,'.isImageFile());


        var arr = '1,2,3,4,5,6,7,8,9,10,12,15,16,17,18,24,31,34'.split(',');
        console.log(arr);

        var ids = [
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "9",
            "10",
            "8",
            "12",
            "24",
            "31",
            "1",
            "15",
            "16",
            "34",
            "17",
            "18"
            ];

        console.log(ids.sort((a,b) => a-b).join(','));

        console.log(new Date().format(''));
        console.log(new Date().addSeconds(10).format(''));

        console.log((86400).toTimeStr());

        console.log((86400).toDurationStr());

        console.log(parseInt(250/100).padLeft(2) + ':' + 1250%60);

        function filter(dr){

            delete dr.id;
        }

        var dr = {id:123,name:'abc',code:'acc'};
        filter(dr);
        console.log(dr);

        var units = ['时','分','秒'];
        var ts = ['08','23','15'];

        console.log(ts.join(units));

        121.123456

        console.log(1/111000);
        console.log(360/(6378137*2*3.1415926));

        console.log(3.1415926*6378137/180);
        console.log(3.1415926*6378137/180*360/3.1415926/2);

        var EARTH_CIRCUMFERENCE = 3.1415926*6378137*2;

        console.log('EARTH_CIRCUMFERENCE:', EARTH_CIRCUMFERENCE);
        var lat_len = 3.1415926*6378137/180;
        var lng_len = lat_len * Math.cos(38);
        console.log(EARTH_CIRCUMFERENCE, lat_len, lng_len);

        console.log(EARTH_CIRCUMFERENCE/lat_len);

        function GetEarthCircumference(latitude) {
            return EARTH_CIRCUMFERENCE * Math.cos(latitude);
        }

        console.log(GetEarthCircumference(29.12345));

        console.log(Math.abs(EARTH_CIRCUMFERENCE * Math.cos(29)/360), Math.cos(0));

        console.log(360/Math.abs(EARTH_CIRCUMFERENCE * Math.cos(29)), Math.cos(0));

        var measurePoint = function ( x, y, d) {
            this.x = x;
            this.y = y;
            this.d = d;
        };
        Math.atan(10);
        console.log(measurePoint(1,2,3));
        console.log(new measurePoint(1,2,3));

        console.log(Math.PI);

        console.log(Math.pow(2.12345, 2));
        console.log(2.12345*2.12345);

        $.console.debug('1234');
        console.debug('1234');

        var py2 = 35.28577076250284;
        var py1 = 29.001458388511015;
        var px3 = 316.5047887447397;
        var py3 = 35.28577076250284;
        var px2 = 316.5047887447397;
        var b = ((py2 - py1) * px3 * px3 - (py3 - py1) * px2 * px2) / (px2 * px3 * px3 - px3 * px2 * px2);
        $.console.debug('b:', b);

        var obj = {};

        console.log(obj.length);

        var names =  [
            '请选择',
            '选择或输入',
            '格式输入错误', 
            '重置大小',
            '可选项：',
            '内容格式错误',
            '端口数值应介于',
            '之间'
            ];;
        for(var i =0; i<names.length;i++){
            console.log('//', names[i], names[i].toUnicode());
        }

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

//https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=100270989&response_type=code&redirect_uri=https://passport.csdn.net/account/login?pcAuthType=qq&newAuth=true&state=test

        console.log(55/(1.58*1.58));

//var o = {"type":"request","command":"setworkmode","sequence":12345,"device":"12345678901234009","body":{"mode":1,"time":1639996782,"duration":0,"expire":1639996782,"action":0,"update_time":1639996782}};

        console.log('2099-12-31 23:59:59'.toDate().format('ts'));

        console.log((1700803715).toDateFormat());

        console.log($.buildAjaxData({"name":"abc",status:1,id:123}, {id:3,type:'unit'}));
        console.log($.buildUrlData({"name":"abc",status:1,id:123}, {id:3,type:'unit'}));

        console.log($.setQueryString('1.html', 'name', 'abc'));

        console.log($.buildUrlParam({"name":"acc", id: 123}));
        console.log($.setUrlParam({"name":"acc", id: 123}, 'abc', '1.html'));

        console.log($.isBoolean(false, true));

        var num2 = 28;

        console.log('hex', num2.toHex(4, true));

        console.log('{0:S2}'.format('19810309'));

        console.log(/^([01]?|true|false)$/.test('1'));

        console.log(/^[\w-]{0,}$/i.test('ABCabc123_-'));

        function _getVal(keyCode) {
            if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105) || (keyCode >= 65 && keyCode <= 90)) {
                return String.fromCharCode(keyCode);
            } else if (keyCode === 109 || keyCode === 189) {
                return '-';
            } else if (keyCode === 110 || keyCode === 190) {
                return '.';
            }
            return '';
        }

        console.log(parseInt('0123abc'));

        console.log(['abc','acc','asd'].indexOf('acc'));

        console.log(/^([1-6][0-5]([0-5][0-3][0-5]|[0-4][0-9]{2})|[1-5]([\d]{1,4})?|[1-9]([\d]{1,3})?|[0])$/.test('55555'));

        var hostpattern = /^((?!-)([A-Z0-9\-]{1,63}.){1,3}[A-Z]{1,8})$/i;
        console.log(hostpattern.test('yd.3gvs-web3gvs-web.comaaaabcaa'));

//var ippattern = /^((::)|[0-9A-F]{1,4}(:[0-9A-F]{1,4}){7}| (([0-9A-F]{1,4}:){0,3})?((:[0-9A-F]{1,4}){0,3})?)$/i;
        var ippattern = /^((::)|[0-9A-F]{1,4}(:[0-9A-F]{1,4}){7})$/i;
//var ippattern2 = /^((([0-9A-F]{1,4})?:){1,4}(([0-9A-F]{1,4})?:){1,4})$/i;
        var ippattern2 = /^(([0-9A-F]{1,4})?(:([0-9A-F]{1,4})?){0,7})$/i;

        var ipv6 = [
            'FC00:0000:130F:0000:0000:09C0:876A:130B',
            'FC00:0:130F:0:0:9C0:876A:130B',
            'FC00:0:130F::9C0:130B:0:0',
            'FC00:0:130F::9C0::130B',
            '::0:130F:9C0:130B',
            ':0:0:0:0:0::',
            '0::',
            '::0',
            'ASD:0::',
            '::',
            ':',
            ''
            ];
        for(var i=0; i<ipv6.length;i++) {
    //console.log(ipv6[i], ippattern.test(ipv6[i]), ippattern2.test(ipv6[i]));

            console.log('isIPv6(ipv6[i]):', ipv6[i], isIPv6(ipv6[i]));
        }


        function isIPv6(ip) {
            if(/^((::)|(::[0-9A-F]{1,4})|([0-9A-F]{1,4}::)|[0-9A-F]{1,4}(:[0-9A-F]{1,4}){7})$/i.test(ip)) {
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
        }


        var p22 = /360|^([1-3][0-5][0-9]|[1-2][0-9]+|[0-9]{1,2})(.[\d]{1,8})?$/;
        console.log(p22.test('124.123413242'));

        console.log(/^[\s]{0}$/.test(' '));
        var pss  = [/^360$/, /^([1-3][0-5][0-9]|[1-2][0-9]+|[0-9]{1,2})(.[\d]{1,8})?$/, /^[0]?$/];
        for(var i=0; i<pss.length;i++) {
            console.log(pss[i].test('123.12345'));
        }

        console.log(/^[A-Z0-9]{0,}$/i.test('a'));


        function isBoolean2 (b, dv) {
            var bool = typeof b === 'boolean';
            return typeof dv === 'boolean' ? (bool ? b : dv) : bool;
        }

        console.log(isBoolean2(undefined, false));

        console.log('---------------------------------');
        console.log(/(\.\.)+|[\.]{4,}/.test('..'));
        console.log(/(\.\.)+|[\d\.]{4,}/.test('12.1.1.1.'));
        console.log(/[:]{3,}|([\dA-F]{5,})|([\dA-F]{0,4}::|::[\dA-F]{0,4}){2,}|^([\dA-F]{0,4}:[\dA-F]{0,4}){8,}$|[;]+/i.test('FC00:0000:130F:0000:0000:09C0:876A:130B'));
        console.log(/[:]{3,}|([\dA-F]{5,})|([\dA-F]{0,4}::|::[\dA-F]{0,4}){2,}|^([\dA-F]{0,4}:[\dA-F]{0,4}){8,}$|[;]+/i.test('FC00:::0000:0000:09C0:876A:130B'));
        console.log(/[:]{3,}|([\dA-F]{5,})|([\dA-F]{0,4}::|::[\dA-F]{0,4}){2,}|^([\dA-F]{0,4}:[\dA-F]{0,4}){8,}$|[;]+/i.test('FC00:::0000:0000:09C0:876A:130B'));
        console.log(/[^A-F0-9:]+|[:]{3,}|([\dA-F]{5,})|([\dA-F]{0,4}::|::[\dA-F]{0,4}){2,}|([\dA-F:]{0,4}:[\dA-F]{0,4}){8,}/i.test('FC00:::0000;09C0:876A:130B'));
        console.log(/[^A-F0-9:]+|[:]{3,}|([\dA-F]{5,})|([\dA-F]{0,4}::|::[\dA-F]{0,4}){2,}|([\dA-F:]{0,4}:[\dA-F]{0,4}){8,}/i.test('1234:1234:1234:1234:1234:1234:1324:1324'));

        console.log(/[^A-F0-9:]/.test('123:13:00)213:00'));


        var ks = [['append'], ['editable'],['relative'],['number']];
        console.log('ks:', ks.length);


        var len = 12;
        console.log(len % 2);
        console.log(len % 2 ? 0 : 1);

        var list = [4800, 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600];
        var sb = [];

        for(var i=0;i<list.length;i++){
            sb.push('[' + list[i] + ',' + list[i] + ']');
        }

        console.log(sb.join(','));

        String.formatException(false);

        console.log('copyright {2025}'.format('2024', 2023, 123, true));
        var con22 = 'undefined';
        console.log('copyright {0}'.format(con22, true));

        function test22(arg) {
            console.log(arg, typeof arg);
        }

        test22(con22);

        var PersonConfig = {
            value: null
        };

        function Person () {
            
        }

        Person.prototype = {
            set: function (val) {
                PersonConfig.value = val;
            },
            get: function () {
                return PersonConfig.value;
            }

        };

    var p = new Person();

        Object.defineProperty(p, 'value', {
            /*value: 'hello',
            writable: true,
            configurable: true,
            */
            get: function () {
               return p.get();// PersonConfig.value;
            },
            set: function (val) {
                p.set(val);
            }
        });

        Person.value = 'abc';
        console.log('Person defineProperty:', Person.value);

        console.log(Person);


var list = [], baseLen = 10, flagLen = 1, itemLen = 9;
for (var i = 0; i < 51; i++) {
    list.push((i) + '\t' + (baseLen + flagLen + itemLen * i));
}

console.log('41542b43434c4b3f0d0d0a2b43434c4b3a202232342f30312f33302c31303a30343a3533220d0a0d0a4f4b0d0a'.hexToStr())


console.log('000a'.hexToInt());
console.log('40E400'.hexToFloat());
console.log((123456789).toHex(6, null, true));


console.log('{0:s4422226}'.formatTest('a55a0169cd011b01049c5001a197003a98049c5601a197003a98049c5d01a197003a98049c6401a197003a98049c6c01a197003a98049c7101a197003a98049c7901a197003a98049c8001a197003a98049c8701a197003a98049c8d01a197003a98049c9601a197003a98049c9b01a197003a98049ca101a197003a98049caa01a197003a98049cb001a197003a98049cb701a197003a98049cbe01a197003a98049cc401a197003a98049ccb01a197003a98049cd201a197003a98049cd801a197003a98049cdf01a197003a98049ce701a197003a98049cee01a197003a98049cf501a197003a98049cfb01a197003a98049d0401a197003a98049d0901a197003a98049d1101a197003a98049d1601a197003a98049d1e01a197003a98049d2301a197003a98049d2c01a197003a98049d3201a197003a98049d3701a197003a98049d4001a197003a98049d4601a197003a98049d4d01a197003a98049d5401a197003a98049d5a01a197003a98455d96'));
console.log('{0:s[46]} '.formatTest('a55a0169cd011b01049c5001a197003a98049c5601a197003a98049c5d01a197003a98049c6401a197003a98049c6c01a197003a98049c7101a197003a98049c7901a197003a98049c8001a197003a98049c8701a197003a98049c8d01a197003a98049c9601a197003a98049c9b01a197003a98049ca101a197003a98049caa01a197003a98049cb001a197003a98049cb701a197003a98049cbe01a197003a98049cc401a197003a98049ccb01a197003a98049cd201a197003a98049cd801a197003a98049cdf01a197003a98049ce701a197003a98049cee01a197003a98049cf501a197003a98049cfb01a197003a98049d0401a197003a98049d0901a197003a98049d1101a197003a98049d1601a197003a98049d1e01a197003a98049d2301a197003a98049d2c01a197003a98049d3201a197003a98049d3701a197003a98049d4001a197003a98049d4601a197003a98049d4d01a197003a98049d5401a197003a98049d5a01a197003a98455d96'));
console.log('{0:s44[2]<4>[6]4[A]<2>}'.formatTest('a55a0169cd011b01049c5001a197003a98049c5601a197003a98049c5d01a197003a98049c6401a197003a98049c6c01a197003a98049c7101a197003a98049c7901a197003a98049c8001a197003a98049c8701a197003a98049c8d01a197003a98049c9601a197003a98049c9b01a197003a98049ca101a197003a98049caa01a197003a98049cb001a197003a98049cb701a197003a98049cbe01a197003a98049cc401a197003a98049ccb01a197003a98049cd201a197003a98049cd801a197003a98049cdf01a197003a98049ce701a197003a98049cee01a197003a98049cf501a197003a98049cfb01a197003a98049d0401a197003a98049d0901a197003a98049d1101a197003a98049d1601a197003a98049d1e01a197003a98049d2301a197003a98049d2c01a197003a98049d3201a197003a98049d3701a197003a98049d4001a197003a98049d4601a197003a98049d4d01a197003a98049d5401a197003a98049d5a01a197003a98455d96'));

console.log('{0:s4422226.42}'.formatTest('a55a0169cd011b01049c5001a197003a98049c5601a197003a98049c5d01a197003a98049c6401a197003a98049c6c01a197003a98049c7101a197003a98049c7901a197003a98049c8001a197003a98049c8701a197003a98049c8d01a197003a98049c9601a197003a98049c9b01a197003a98049ca101a197003a98049caa01a197003a98049cb001a197003a98049cb701a197003a98049cbe01a197003a98049cc401a197003a98049ccb01a197003a98049cd201a197003a98049cd801a197003a98049cdf01a197003a98049ce701a197003a98049cee01a197003a98049cf501a197003a98049cfb01a197003a98049d0401a197003a98049d0901a197003a98049d1101a197003a98049d1601a197003a98049d1e01a197003a98049d2301a197003a98049d2c01a197003a98049d3201a197003a98049d3701a197003a98049d4001a197003a98049d4601a197003a98049d4d01a197003a98049d5401a197003a98049d5a01a197003a98455d96'));
console.log('{0:s442222[6]42}'.formatTest('a55a0169cd011b01049c5001a197003a98049c5601a197003a98049c5d01a197003a98049c6401a197003a98049c6c01a197003a98049c7101a197003a98049c7901a197003a98049c8001a197003a98049c8701a197003a98049c8d01a197003a98049c9601a197003a98049c9b01a197003a98049ca101a197003a98049caa01a197003a98049cb001a197003a98049cb701a197003a98049cbe01a197003a98049cc401a197003a98049ccb01a197003a98049cd201a197003a98049cd801a197003a98049cdf01a197003a98049ce701a197003a98049cee01a197003a98049cf501a197003a98049cfb01a197003a98049d0401a197003a98049d0901a197003a98049d1101a197003a98049d1601a197003a98049d1e01a197003a98049d2301a197003a98049d2c01a197003a98049d3201a197003a98049d3701a197003a98049d4001a197003a98049d4601a197003a98049d4d01a197003a98049d5401a197003a98049d5a01a197003a98455d96'));
console.log('{0:S[12321]}'.formatTest('a55a0169cd011b01049c5001a197003a98049c5601a197003a98049c5d01a197003a98049c6401a197003a98049c6c01a197003a98049c7101a197003a98049c7901a197003a98049c8001a197003a98049c8701a197003a98049c8d01a197003a98049c9601a197003a98049c9b01a197003a98049ca101a197003a98049caa01a197003a98049cb001a197003a98049cb701a197003a98049cbe01a197003a98049cc401a197003a98049ccb01a197003a98049cd201a197003a98049cd801a197003a98049cdf01a197003a98049ce701a197003a98049cee01a197003a98049cf501a197003a98049cfb01a197003a98049d0401a197003a98049d0901a197003a98049d1101a197003a98049d1601a197003a98049d1e01a197003a98049d2301a197003a98049d2c01a197003a98049d3201a197003a98049d3701a197003a98049d4001a197003a98049d4601a197003a98049d4d01a197003a98049d5401a197003a98049d5a01a197003a98455d96'));
console.log('{0:S[1232]}'.formatTest('a55a0169cd011b01049c5001a197003a98049c5601a197003a98049c5d01a197003a98049c6401a197003a98049c6c01a197003a98049c7101a197003a98049c7901a197003a98049c8001a197003a98049c8701a197003a98049c8d01a197003a98049c9601a197003a98049c9b01a197003a98049ca101a197003a98049caa01a197003a98049cb001a197003a98049cb701a197003a98049cbe01a197003a98049cc401a197003a98049ccb01a197003a98049cd201a197003a98049cd801a197003a98049cdf01a197003a98049ce701a197003a98049cee01a197003a98049cf501a197003a98049cfb01a197003a98049d0401a197003a98049d0901a197003a98049d1101a197003a98049d1601a197003a98049d1e01a197003a98049d2301a197003a98049d2c01a197003a98049d3201a197003a98049d3701a197003a98049d4001a197003a98049d4601a197003a98049d4d01a197003a98049d5401a197003a98049d5a01a197003a98455d96'));
console.log('{0:..46}'.formatTest('a55a0001f100010105573005573005'));
console.log('{0:s[42]}'.formatTest('a55a0001f100010105573005573005'));
console.log('{0:S44[]64}'.formatTest('a55a0001f100010105573005573005'));


console.log('{0:s[42]}'.formatTest('a55a0001f100010105573005573005'));
console.log('{0::44.}'.formatTest('a55a0001f100010105573005573005678'));
console.log('{0:s426.2}'.formatTest('a55a0001f100010105573005573005'));
console.log('{0:-42}'.formatTest('a55a0001f100010105573005573005'));
console.log('{0:_10030}'.formatTest('a55a0001f100010105573005573005'));

// {0:-8444C|}, 其中 0:-8444C| 表示格式符
// \\表示\n(用于控制台或文本框显示), /表示<br />(用于html显示), |表示截断内容，一般情况下|符号加在格式符的最后
console.log('{0:-44[2]<4>\\[666\\]\\42}'.formatTest('a55a0169cd011b030557300186a00186a00493e00186a00186a044d496'));
console.log('{0:-44[2]<4>[6]42}'.formatTest('a55a0169cd011b030557300186a00186a00493e00186a00186a044d496'));
console.log('{0:-8[4]<3>}'.formatTest('25f9e794323b453885f5181f1b624d0b'));
console.log('{0:-8[4]C}'.formatTest('25f9e794323b453885f5181f1b624d0b'));
console.log('{0:-8444C}'.formatTest('25f9e794323b453885f5181f1b624d0b'));
console.log('{0:-84/44}'.formatTest('25f9e794323b453885f5181f1b624d0b'));
console.log('{0:-8444C}'.formatTest('25f9e794323b453885f5181f1b624d0b'));
console.log('{0:-8444C|}'.formatTest('a55a0169cd011b030557300186a00186a00493e00186a00186a044d496'));

console.log('{0:C3}'.formatTest(1234567));
console.log('小数格式化{0:F3}'.formatTest(1234.12567));
console.log('{0:N3}'.formatTest(1234567));
console.log('{0:D}'.formatTest(1234567));
console.log('{0:D8}'.formatTest(1234567));
console.log('{0:DA}'.formatTest(1234567));
console.log('{0:C}'.formatTest(1));
console.log('{0:CC}'.formatTest(1));
/*
console.log('FFFF'.num16ToInt());
console.log('ZZZZ'.num36ToInt());

var numA = 'A';
console.log(numA.hexToInt());
var numB = '0';
console.log(numB.hexToInt());

console.log(numA.charCodeAt());
console.log(numB.charCodeAt());
console.log('F'.charToInt());

console.log((65535).toNum16(null, false));
console.log((1679615).toNum36(6));
*/

var code = '';

console.log(code?'a':'b');
code = '0';

console.log(code?'a':'b');
code = 0;

console.log(code?'a':'b');

console.log('123456'.md5());

var angle = 80;
for(var i=0; i<20;i++) {
    angle -= 0.15;
    console.log(i, angle);
}



        String.prototype.toFloat2 = function (decimalLen, val) {
            var s = this,
                num = parseFloat(s, 10);
            if (isNaN(num)) {
                return val || 0;
            }
            if (typeof decimalLen === 'number' && decimalLen >= 0) {
                var rate = Math.pow(10, decimalLen);
                num = Math.round(num * rate) / rate;
            }
            return num;
        };

    console.log('123.12345'.toFloat2(0));

console.log((1765).toTimeStr(0, false));
console.log((1765).toTimeStr(0, true));

console.log((7205).toDurationStr(true, true));
console.log((1205).toDurationStr(true, false));


console.log('a.aspx?a=1&b=2&c=3'.getQueryString('d|b'));

console.log('d|b'.split(/[,\|]/g));




console.log(null ?? 'printA')
console.log(undefined ?? 'printB')
console.log(false ?? 'printB')
console.log(true ?? 'printB')


console.log('1:CIF(352×288),2:CIF(352×288),3:4CIF(704×576),5:4CIF(704×576),7:WD1(960×576),36:WD1(960×576),16:VGA(640×480),18:SVGA(800×600),14:XVGA(1024×768),35:SXGA(1280×1024),17:UXGA(1600×1200),57:WXGA(1280×800),19:HD720P(1280×720),41:HD720P(1280×720),21:HD900P(1280×960),23:HD900P(1280×960),27:1080P(1920×1080),43:1080P(1920×1080),30:3MP(2048×1536),70:4MP(2560×1440),44:5MP(2592×2048),66:5MP(3072×1728),64:8MP(3840×2160),63:8MP(4096×2160)'.split(/[,]/));
console.log('1:CIF(352×288)'.split(/[:\|]/));


var types = [
    { id: 1, name: '视频设备', desc: '400万像素高清摄像机' },
    { id: 2, name: 'DTU设备', desc: '' },
    { id: 3, name: 'LED设备', desc: 'LED显示屏' },
    { id: 4, name: '雷达测距设备', desc: '' },
    { id: 5 },
    { id: 6, name: '激光测距设备', desc: '' },

    { id: 7, pid: 6 },
    { id: 8, pid: 4 },
    { id: 9, pid: 5 },
    { id: 10, pid: 6 },
    { id: 11, level: 2, pid: 8 },
    { id: 12, pid: 5 },
    { id: 13, pid: 5 },
    { id: 14, pid: 5 },
    { id: 15, pid: 5 },
];

for (var i=0; i<5;i++) {
    types.push({id:15+i+1, pid:5});
}

console.log(types);
console.log('toTreeList:', $.toTreeList(types));

var tdata = [
  { id: 1, name: '视频设备', desc: '400万像素高清摄像机' },
  { id: 2, name: 'DTU设备', desc: '' },
  { id: 3, name: 'LED设备', desc: 'LED显示屏' },
  { id: 4, name: '雷达测距设备', desc: '' },
  { id: 8, pid: 4 },
  { id: 11, pid: 8 },
  { id: 5 },
  { id: 9, pid: 5 },
  { id: 12, pid: 5 },
  { id: 13, pid: 5 },
  { id: 14, pid: 5 },
  { id: 15, pid: 5 },
  { id: 16, pid: 5 },
  { id: 17, pid: 5 },
  { id: 18, pid: 5 },
  { id: 19, pid: 5 },
  { id: 20, pid: 5 },
  { id: 6, name: '激光测距设备', desc: '' },
  { id: 7, pid: 6 },
  { id: 10, pid: 6 }
];
tdata = $.toTreeList(tdata);
console.log(tdata);


function buildTreeData(list) {
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
}

function buildTreeData2(list) {
    var data = {}, len = list.length, i, dic = {};

    for (i = 0; i < len; i++) {
        dic[list[i].id] = list[i];
    }
    for (i = 0; i < len; i++) {
        var dr = list[i], pn = dic[dr.pid];
        data[dr.id] = dr;

        if (pn) {
            pn.childs = pn.childs || [];
            pn.childs.push(dr);
        }
    }
    return data;
}

function buildTreeHtml(data, isList) {
    var html = [], i,
        ul = [], li = [];

    if (isList) {
        var len = data.length;
        for (i = 0; i < len; i++) {
            if (i === 0) {
                html.push('<ul>');
            }

            html.push('<ul>');
        }
    } else {

    }


    return html.join('');
}

$.console.log($.toJsonString(buildTreeData2(tdata)));
$.console.log(buildTreeData2(tdata));


var td = buildTreeData2(tdata);
for(var k in td) {
    console.log(k, td[k]);
}

new Promise(function (resolve, reject) {
    var a = 0;
    var b = 0;
    if (b == 0) reject("Divide zero");
    else resolve(a / b);
}).then(function (value) {
    console.log("a / b = " + value);
}).catch(function (err) {
    console.log(err);
}).finally(function () {
    console.log("End");
});

var func = function(){}
console.log(typeof func === 'object');

var d = {showType:undefined},
    opt = {showType:true};

var b  = $.isBooleans([d.showType, opt.showType], false);
$.console.log('b:',b);

$.console.log(escape2Html('abc"'));

function escapeHtml(str) {
    var keys = { '<': 'lt', '>': 'gt', ' ': 'nbsp', '&': 'amp', '"': 'quot', '\'': '#39' };
    return str.replace(/([<>\s&"'])/ig, function (all, t) { return '&' + keys[t] + ';'; });
}

function unescapeHtml (str) {
    var keys = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"', '#39': '\'' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return keys[t]; });
}

function escape2Html(str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
}

function escape2Html(str) {
    str.replace(/&(amp);/ig, '&');
    return;
}

console.log('eacape:', escape2Html('abc"123\''))

var arr = [3,5,1,2,4];

console.log(arr.sort());


var names =  [
            '用户信息',
            '修改密码',
            '确定要退出系统吗？',
            '退出系统',
            '版本信息',
            '登录',
            '您还没有登录或登录已超时，点击“确定”返回登录页。',
            '显示',
            '隐藏',
            '顶部'
            ];;
        for(var i =0; i<names.length;i++){
            console.log('//', names[i], names[i].toUnicode());
        }


        function isempty(o) {
            if (typeof o === 'object') { 
                for (var name in o) { return false; } 
            }
            return true;
        }

        $.console.log(isempty({}));


var str = '宁中波是中国浙江省的一个城市';


$.console.log($.replaceKeys(str, ['宁中波', '中'], true));
$.console.log($.replaceKeys(str, ['宁中波', '中'], '<b>', '</b>', '大'));
$.console.log(str.replaceKeys(['宁中波', '中'], '<b>', '</b>', '小'));
$.console.log($.replaceKeys(str, ['宁中波', '中'], true));

var s = 'oui.tree.css';

console.log($.setQueryString(s, 123, 1));

console.log($.setUrlParam(123, false, s));

console.log($.getFileSalt('/libs/oui/tree/oui.tree.js?515'));