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

                for(var n = 0; n < c; n++) {
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

var arr3 = ['Tom', 'Jack', 'John', 'Bill'];
var arr2 = ['张三', '李四', '王五', '赵六'];

console.log(buildResult(arr3, arr2));

var str = '';
for(var i=1; i<13;i++) {
    str += "'" + (i < 10 ? '0'+i : i) + "',";
}
    console.log(str);




    var s = 'ag我们𠨰奋斗marray jack多,。！、，-+=!年𠨰'.filterRareWord();
    console.log(s)



var d2 = null;
function showTree() {
    if(d2 !== null) {
        d2.show();
    }
    d2 = $.dialog('<div id="tree"></div>', '标题', {
        title: '这也是标题',
        width: 300,
        height: 400
    });

    var o2 = new oTree('o2', document.getElementById('tree'), {});
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


console.log('1587916832189'.toDate().format())


var pattern = /^[1-8][1-9][\d]{4}(19|20)[\d]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[0-1])[\d]{3}[\dX]$/i;

console.log(pattern.test('452402198906571258'))

console.log($.base64)
var code = $.base64.encode('12345');
console.log(code)
console.log($.base64.decode(code+'ab'))
console.log(code.base64decode())

console.log('ab cd+ah '.trim().replace(/[\-\s]/g, '+'));

console.log(/[\-\s]/g.test('ab'))