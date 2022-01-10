require('./oui');

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
    if((len < 2 && i >= c) || (len >= 2 && i >= c)){
        return;
    }
    if(len >= 2) {
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

        for(var k = 0; k < len; k++) {
            var s = arr[i];
            
            for(var m = 0; m < c; m++) {

                for(var n = 0; n < c; n++) {``
                    console.log(s + arr[n]);
                }
            }

        }

        for(var m = 0; m < c; m++) {
            var s = arr[i] + arr[m];

            for(var n = 0; n < c; n++) {
                console.log(s + arr[n]);
            }
        }

        buildAssemble(++i, j, len, arr);
    } else {
        for(n = 0; n < c; n++) {
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
    ads_codes: ['a','b','c'],
    ads_weight: [10,10,10],

    get_random: function(weight) {
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
    init: function() {

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


var str = {id:1,name:'abc'}

for(var k in str){
    console.log(k, ', ', str[k]);
}
console.log(str);
console.log($.contains(str,'name'));


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


var mc = {con:'0'};

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

    for(var i = 0; i < len; i++) {
        res.push({'actor': arrActor[x], 'dub': arrDub[y]});
        if(++x >= len1 && reverse) {
            x = 0;
        }
        if(++y >= len2) {
            y = 0;
        }
    }
    return res;
}


var num = -111.;
console.log(/^[-+]?(\d+)([.][\d]{0,})?$/.test(num));


var str = '共';
console.log(str.toUnicode());

var fd = {id:3, name:'tom'};

console.log(fd, $.toJsonString(fd));

console.log(fd.constructor, typeof fd.constructor);

console.log(Math.round(2/135,2))

console.log((2/135).round(2))

console.log(2.5*0.50);

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

console.log(480*3+240);

var x = 1, y = 2;
x = x ^ y;
y = x ^ y;
x = x ^ y;

console.log(x,y);


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
for(var i=0; i<mc.length; i++) {
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
    if(devCodeList.endsWith(',')) {
        devCodeList = devCodeList.substr(0, devCodeList.length - 1);
    }
    return devCodeList;
};

console.log(buildDeviceCodeList('abc'));

var url ="http://122.227.179.90:40000/device?action=getdeviceinfo&html=1&log=1" +
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
    var arrEntities = {'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
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

var ids = [1,2,3];

console.log(ids.indexOf(2))

if(ids.indexOf(2)>0) {
    ids.splice(ids.indexOf(2),1);
}




var f = '{ww60}*1+{AC_}-[51]+[51]';

var r = /\{([\w\d]+)\}/g;

console.log(f.match(r))

console.log($.isArray(f.match(r)))

var mc = f.match(r);
for(var m in mc){
    console.log('m:',mc[m]);
}

console.log(eval('('+'1<2?3:4'+')'));

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

console.log(n===v);

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


var obj = {txt: 'hello'};
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
console.log($.base64.decode(code+'ab'))
console.log(code.base64decode())

console.log('ab cd+ah '.trim().replace(/[\-\s]/g, '+'));

console.log(/[\-\s]/g.test('ab'))




console.log('a,bc,d'.replace(/[,]/g,''))

console.log('{0:E}'.format(1234567890123));


var obj = {
    "deviceid":"002104","curtime":"2020-01-16 08:31:03",
    "gpsinfo":{"latitude":"","longitude":"","gpsdir":"","speed":"","ns":"","height":""},
    "netinfo":{"signal":"25","netstatus":"FDD LTE"},
    "other":{"voltage":"116","electricity":"540"}
};

console.log(typeof obj)

var val = $.getValue(obj, 'other.voltage.voltage', 5);

console.log(val);

var numbers = '1,3,6-9,,12-16,99';

console.log($.expandNumbers(numbers));

var numbers = [1,2,3,5,6,9,21,22,23,99];

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

console.log({"length":20,"start":0,"ClientType":5,"searchtext":"","TypeID": "\"" + channelid + "\""})

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
var str2 = str.replace(/[.](jpg|png|gif)$/gi, function(val) {
    return '_260_360' + val;
});

console.log(str2);

function test2({id,name}){

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
console.log(win&&win.id)

var num = 11111111111111;
console.log(num + 2);



console.log( 128 & 128)


console.log($.buildAjaxData('setMode', {id:1,name:'acc'}, {id:1,name:'acc'},))

console.log(new Date().getTime())


var obj33 = {
    'A123': 'a123',
    'C123': 'c123',
    'B123': 'b123'
};

for(var k in obj33) {
    console.log(obj33[k]);
}


var items = [
    {host: 'abc', len: 3},
    {host: 'acc', len: 2},
    {host: 'asd', len: 5}
];

items.sort(function(a, b) {
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

console.log(str.format({type:0}))
console.log(str.format({id:5}))


console.log(505 - 505 % 20);

console.log('2010-11-15 10:39:30'.toDate().format('ts'))

console.log('2021-05-20 14:28:31'.toDate().format('ts'));


//ac32fc60


function parseCapturePlan(plan) {
    //010103000aff0000ff1600ff
    if(plan.length < 24) {
        return plan;
    }
    var c = parseInt(plan.substr(4, 2), 10);
    var times = [];
    for(var n = 0; n < parseInt(c / 3, 10); n++) {
        var len = 3 * 2 * 3;
        var con = plan.substr(6 + len * n, len);
        var t = '';
        var j = 0;
        for(var i = 0; i < con.length; i += 6) {
            var h = hexToInt(con.substr(i, 2)),
                m = hexToInt(con.substr(i + 2, 2)),
                p = hexToInt(con.substr(i + 4, 2));

            j++;
            switch(j % 3) {
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
    for(var i = 0; i < len / 2; i++) {
        arr[len - i * 2 - 1] = hex[i * 2 + 1];
        arr[len - i * 2 - 2] = hex[i * 2];
    }
    return arr.join('');
}

function hexToInt(hex, reverse) {
    if(reverse) {
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

console.log((parseInt(new Date().format('ts')/1000)-300482).toDate().format())

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
    if(len < 13) {
        ts *= Math.pow(10, 13 - len);
    }
    var date = new Date(ts + 8 * 3600 * 1000);
    return date.toISOString().substr(0, 19).replace('T', ' ');
}
console.log(toTime(1636514639)); // "2018.08.09 18:25:54"

var arr = ['abc','acc'];
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
$$.isChrome = function() {
    return false;
};

console.log('$$.isChrome:', $$.isChrome);

var css = '1  2    3 4';
var arr = css.split(/[A]+/);
console.log(arr);

console.log(-1000>>>2)
console.log(-1000>>2);

var ts = parseInt('4102415999000', 10) + 1;
console.log('ts:',ts)


var opt = [
    [5, '5'], [10, '10']
];

console.log(1.5 * 60 * 60);


 var getTimeNumber = function() {
    var dt = new Date(),
        h = dt.getHours(),
        m = dt.getMinutes(),
        s = dt.getSeconds(),
        val = h + '' + (m < 10 ? '0' + m : m) + '' + (m < 10 ? '0' + s : s),
        num = parseInt(val, 10);
    return num;
};

console.log(getTimeNumber());


var points = [{"start":800,"end":1000}, {"start":600,"end":750}];
points.sort(function(a, b){ return a.start - b.start });

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

                console.log(filesize % mb/mb);

                console.log(mb);


var url = 'http://112.54.97.178:81/api/?id=123&type=udp&line=-1';
url = url.setUrlParam({line:0,transmode:"udp"}, false);
console.log(url);

var val = false;
console.log($.isBoolean(val, true))

console.log($.setUrlParam('key','val', true));

var str = 'line={line|-1_1}&type={type;type2|udp}';
console.log(str.format({line:2,type3:123}));

var str = 'line={data.key2,key|a}';
console.log(str.format({data:{key3:'abc'}}));

var str ="val2={val}"; 
console.log(str.formatError(false).format({val2:123}));

var str ="val3={data.val}"; 
console.log(str.format({data:{val:12345}}));

var str ="id={data>id,code|-1}"; 
console.log(str.format({data:{ids:"abc"}}));

var str ="id={0:d3}"; 
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


console.log((1+100)*50)


var x = 2, y = 100;
var z = (x + y) * (y - x + 1) / 2;

console.log(z);