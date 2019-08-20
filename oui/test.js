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

console.log((1562229347).toDate().format());

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

var n22 = 1565399308;

console.log(n22.toDate().format())