/*
Number.prototype.padLeft = function(totalWidth, paddingChar, isRight) {
    var s = '' + this;
    console.log('s:', s);
    var char = paddingChar || '0', c = totalWidth - s.length;
    for (var i = 0; i < c; i++) {
        s = isRight ? s + char : char + s;
    }
    return s;
};

function toTime(seconds) {
            var h = parseInt(seconds / 3600, 10);
            seconds -= (h * 3600);
            var m = parseInt(seconds / 60);
            var s = seconds % 60;
            return h.padLeft(2) + ':' + m.padLeft(2) + ':' + s.padLeft(2);
}

function toSecond(time) {
    var arr = time.split(':');
    var s = parseInt(arr[0], 10) * 3600;
    s += parseInt(arr[1], 10) * 60;
    s += parseInt(arr[2], 10);

    return s;
}

console.log(toTime(3750));

console.log(toSecond('01:05:12'));
*/

//idx: 目标索引
//num: 列表数量
function getNavList(datas, idx, num) {
    var len = datas.length, 
        //前列表
        pre = [], 
        //后列表
        next = [], 
        nc = 0;

    if(idx > len) {
        idx = len;
    }
    //先循环一遍，找到 目标索引idx 之后的数据条数，只要超过列表数量num 即可
    for(var i = idx + 1; i < len; i++) {
        nc++;
        if(nc >= num) {
            break;
        }
    }
    //计算前列表需要补足的数据条数（根据后列表的数量决定，比如后列表如果小于目标数量2条的话，那前列表就要补2条）
    var pac = nc < num ? num - nc : 0, 
        //计算前列表起始位置，这里主要是为了考虑程序性能
        pos = idx - (num + pac);
    if(pos < 0) {
        pos = 0;
    }
    for(var i = pos; i < idx; i++) {
        pre.push(datas[i]);
    }
    //获取前列表的数据量，计算后列表截止的位置
    var pc = pre.length, end = idx + num * 2 - pc + 1;
    if(end > len) {
        end = len;
    }
    for(var i = idx + 1; i < end; i++) {
        next.push(datas[i]);
    }
    return pre.concat(next);
}

var items = [
    {id:0, name:'tom0'},
    {id:1, name:'tom1'},
    {id:2, name:'tom2'},
    
    {id:3, name:'tom3'},
    {id:4, name:'tom4'},
    {id:5, name:'tom5'},
    {id:6, name:'tom6'},
    {id:7, name:'tom7'},
    {id:8, name:'tom8'},
    {id:9, name:'tom9'},
    {id:10, name:'tom10'},
    {id:11, name:'tom11'},
    {id:12, name:'tom12'},
    {id:13, name:'tom13'},
    {id:14, name:'tom14'},
    {id:15, name:'tom15'},
    {id:16, name:'tom16'},
    {id:17, name:'tom17'},
    {id:18, name:'tom18'},
    {id:19, name:'tom19'},
    {id:20, name:'tom20'},
    {id:21, name:'tom21'},
    {id:22, name:'tom22'},
    {id:23, name:'tom23'},
    {id:24, name:'tom24'},
    {id:25, name:'tom25'},
    {id:26, name:'tom26'},
    {id:27, name:'tom27'}
    
];

var arr = getNavList(items, 12, 6);
console.log(arr);