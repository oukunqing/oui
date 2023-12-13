var $ = {
	isArray: Array.isArray || function (a) { return Object.prototype.toString.call(a) === '[object Array]'; },
	isObject: function(data) {
	    return typeof data === 'object';
	}
};


;!function ($) {

	
	function Node () {

	}

	Node.prototype = {

	};

	function Tree () {

	}

	Tree.prototype = {
		initial: function () {
			var that = this;

			return that;
		}
	};

	$.tree = function(options) {
		return new Tree(options);
	};

} ($);


console.log($.tree().initial());


function findJsonNode(json, key, val) {
	for (var k in json) {
		if (key === k) {
			return json[k];
		} else if ($.isArray(json[k])) {
			for (var i = 0; i < json[k].length; i++) {

			}
		} else if ($.isObject(json[k])) {
			return findJsonNode(json[k], key);
		}
	}

	return null;
}


var obj = {"type":"request","command":"setworkmode","sequence":12345,"device":"12345678901234009","body":{"mode":1,"time":1639996782,"duration":0,"expire":1639996782,"action":0,"update_time":1639996782}};

console.log(findJsonNode(obj, 'mode'));

var list = [
    {
        "id": 1,
        "name": "主控制中心",
        "pid": 0,
        "level": 0,
        "parent_tree": "(1)",
        "tree": "1"
    },
    {
        "id": 2,
        "name": "中研瑞华",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(2)",
        "tree": "1,2"
    },
    {
        "id": 6,
        "name": "宁夏",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(6)",
        "tree": "1,6"
    },
    {
        "id": 9,
        "name": "浙江",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(9)",
        "tree": "1,9"
    },
    {
        "id": 22,
        "name": "广东",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(22)",
        "tree": "1,22"
    },
    {
        "id": 24,
        "name": "江西",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(24)",
        "tree": "1,24"
    },
    {
        "id": 35,
        "name": "河北",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(35)",
        "tree": "1,35"
    },
    {
        "id": 75,
        "name": "河南",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(75)",
        "tree": "1,75"
    },
    {
        "id": 76,
        "name": "山东",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(76)",
        "tree": "1,76"
    },
    {
        "id": 87,
        "name": "安徽",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(87)",
        "tree": "1,87"
    },
    {
        "id": 97,
        "name": "福建",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(97)",
        "tree": "1,97"
    },
    {
        "id": 100,
        "name": "湖南",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(100)",
        "tree": "1,100"
    },
    {
        "id": 131,
        "name": "四川",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(131)",
        "tree": "1,131"
    },
    {
        "id": 152,
        "name": "广西",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(152)",
        "tree": "1,152"
    },
    {
        "id": 164,
        "name": "湖北",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(164)",
        "tree": "1,164"
    },
    {
        "id": 181,
        "name": "江苏",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(181)",
        "tree": "1,181"
    },
    {
        "id": 190,
        "name": "山西",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(190)",
        "tree": "1,190"
    },
    {
        "id": 290,
        "name": "上海",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(290)",
        "tree": "1,290"
    },
    {
        "id": 400,
        "name": "云南",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(400)",
        "tree": "1,400"
    },
    {
        "id": 412,
        "name": "重庆",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(412)",
        "tree": "1,412"
    },
    {
        "id": 416,
        "name": "陕西",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(416)",
        "tree": "1,416"
    },
    {
        "id": 503,
        "name": "北京",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(503)",
        "tree": "1,503"
    },
    {
        "id": 524,
        "name": "吉林",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(524)",
        "tree": "1,524"
    },
    {
        "id": 554,
        "name": "海南",
        "pid": 1,
        "level": 1,
        "parent_tree": "(1),(554)",
        "tree": "1,554"
    },
    {
        "id": 5,
        "name": "WMP测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(5)",
        "tree": "1,2,5"
    },
    {
        "id": 66,
        "name": "中研广汇",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(66)",
        "tree": "1,35,66"
    },
    {
        "id": 74,
        "name": "116测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(74)",
        "tree": "1,2,74"
    },
    {
        "id": 77,
        "name": "日照振东",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(77)",
        "tree": "1,76,77"
    },
    {
        "id": 78,
        "name": "310测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(78)",
        "tree": "1,2,78"
    },
    {
        "id": 79,
        "name": "对接研发测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(79)",
        "tree": "1,2,79"
    },
    {
        "id": 83,
        "name": "杭州华进",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(83)",
        "tree": "1,9,83"
    },
    {
        "id": 85,
        "name": "咸亨国际科研中心",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(85)",
        "tree": "1,9,85"
    },
    {
        "id": 86,
        "name": "余姚城管",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(86)",
        "tree": "1,9,86"
    },
    {
        "id": 103,
        "name": "101测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(103)",
        "tree": "1,2,103"
    },
    {
        "id": 104,
        "name": "百盛源电力",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(104)",
        "tree": "1,35,104"
    },
    {
        "id": 106,
        "name": "A-815测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(106)",
        "tree": "1,2,106"
    },
    {
        "id": 136,
        "name": "青岛鸿升沃达",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(136)",
        "tree": "1,76,136"
    },
    {
        "id": 140,
        "name": "福建四创",
        "pid": 97,
        "level": 2,
        "parent_tree": "(1),(97),(140)",
        "tree": "1,97,140"
    },
    {
        "id": 150,
        "name": "青岛亿信联盟",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(150)",
        "tree": "1,76,150"
    },
    {
        "id": 157,
        "name": "姚然",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(157)",
        "tree": "1,35,157"
    },
    {
        "id": 165,
        "name": "奋进电力",
        "pid": 164,
        "level": 2,
        "parent_tree": "(1),(164),(165)",
        "tree": "1,164,165"
    },
    {
        "id": 168,
        "name": "防外破演示",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(168)",
        "tree": "1,2,168"
    },
    {
        "id": 170,
        "name": "浙江信电",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(170)",
        "tree": "1,9,170"
    },
    {
        "id": 174,
        "name": "朗天通信",
        "pid": 131,
        "level": 2,
        "parent_tree": "(1),(131),(174)",
        "tree": "1,131,174"
    },
    {
        "id": 182,
        "name": "华创",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(182)",
        "tree": "1,181,182"
    },
    {
        "id": 206,
        "name": "莒县人民法院",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(206)",
        "tree": "1,76,206"
    },
    {
        "id": 212,
        "name": "710测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(212)",
        "tree": "1,2,212"
    },
    {
        "id": 218,
        "name": "福建特检院",
        "pid": 97,
        "level": 2,
        "parent_tree": "(1),(97),(218)",
        "tree": "1,97,218"
    },
    {
        "id": 233,
        "name": "815临时",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(233)",
        "tree": "1,2,233"
    },
    {
        "id": 234,
        "name": "安客讯",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(234)",
        "tree": "1,181,234"
    },
    {
        "id": 238,
        "name": "咸亨物联网中心",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(238)",
        "tree": "1,9,238"
    },
    {
        "id": 246,
        "name": "余姚GPS",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(246)",
        "tree": "1,9,246"
    },
    {
        "id": 262,
        "name": "美兰机场",
        "pid": 131,
        "level": 2,
        "parent_tree": "(1),(131),(262)",
        "tree": "1,131,262"
    },
    {
        "id": 264,
        "name": "京华",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(264)",
        "tree": "1,181,264"
    },
    {
        "id": 271,
        "name": "达州",
        "pid": 131,
        "level": 2,
        "parent_tree": "(1),(131),(271)",
        "tree": "1,131,271"
    },
    {
        "id": 288,
        "name": "720测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(288)",
        "tree": "1,2,288"
    },
    {
        "id": 291,
        "name": "威斯莱克",
        "pid": 290,
        "level": 2,
        "parent_tree": "(1),(290),(291)",
        "tree": "1,290,291"
    },
    {
        "id": 293,
        "name": "金塘高速",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(293)",
        "tree": "1,9,293"
    },
    {
        "id": 296,
        "name": "青岛九瑞汽车",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(296)",
        "tree": "1,76,296"
    },
    {
        "id": 300,
        "name": "宣化区指挥中心",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(300)",
        "tree": "1,35,300"
    },
    {
        "id": 301,
        "name": "张家口",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(301)",
        "tree": "1,35,301"
    },
    {
        "id": 302,
        "name": "宁波气象局",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(302)",
        "tree": "1,9,302"
    },
    {
        "id": 312,
        "name": "郑州热力总公司",
        "pid": 75,
        "level": 2,
        "parent_tree": "(1),(75),(312)",
        "tree": "1,75,312"
    },
    {
        "id": 313,
        "name": "江苏惠海船舶",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(313)",
        "tree": "1,181,313"
    },
    {
        "id": 332,
        "name": "郑煤集团",
        "pid": 75,
        "level": 2,
        "parent_tree": "(1),(75),(332)",
        "tree": "1,75,332"
    },
    {
        "id": 337,
        "name": "故障排查",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(337)",
        "tree": "1,2,337"
    },
    {
        "id": 338,
        "name": "安卓测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(338)",
        "tree": "1,2,338"
    },
    {
        "id": 341,
        "name": "烟台业达集团",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(341)",
        "tree": "1,76,341"
    },
    {
        "id": 343,
        "name": "810测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(343)",
        "tree": "1,2,343"
    },
    {
        "id": 349,
        "name": "常州市市场监督管理局",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(349)",
        "tree": "1,181,349"
    },
    {
        "id": 353,
        "name": "南通五健",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(353)",
        "tree": "1,181,353"
    },
    {
        "id": 380,
        "name": "软件评测",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(380)",
        "tree": "1,2,380"
    },
    {
        "id": 386,
        "name": "28181",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(386)",
        "tree": "1,2,386"
    },
    {
        "id": 394,
        "name": "世纪航信",
        "pid": 164,
        "level": 2,
        "parent_tree": "(1),(164),(394)",
        "tree": "1,164,394"
    },
    {
        "id": 397,
        "name": "深圳",
        "pid": 22,
        "level": 2,
        "parent_tree": "(1),(22),(397)",
        "tree": "1,22,397"
    },
    {
        "id": 399,
        "name": "711测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(399)",
        "tree": "1,2,399"
    },
    {
        "id": 401,
        "name": "火星人",
        "pid": 400,
        "level": 2,
        "parent_tree": "(1),(400),(401)",
        "tree": "1,400,401"
    },
    {
        "id": 405,
        "name": "象山气象屏",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(405)",
        "tree": "1,9,405"
    },
    {
        "id": 406,
        "name": "嘉禾通达",
        "pid": 152,
        "level": 2,
        "parent_tree": "(1),(152),(406)",
        "tree": "1,152,406"
    },
    {
        "id": 408,
        "name": "青岛悦峰",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(408)",
        "tree": "1,76,408"
    },
    {
        "id": 411,
        "name": "上海铁路局",
        "pid": 290,
        "level": 2,
        "parent_tree": "(1),(290),(411)",
        "tree": "1,290,411"
    },
    {
        "id": 413,
        "name": "郫县水务",
        "pid": 412,
        "level": 2,
        "parent_tree": "(1),(412),(413)",
        "tree": "1,412,413"
    },
    {
        "id": 417,
        "name": "军盾",
        "pid": 416,
        "level": 2,
        "parent_tree": "(1),(416),(417)",
        "tree": "1,416,417"
    },
    {
        "id": 419,
        "name": "柳州机场",
        "pid": 152,
        "level": 2,
        "parent_tree": "(1),(152),(419)",
        "tree": "1,152,419"
    },
    {
        "id": 424,
        "name": "智能安防机器人",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(424)",
        "tree": "1,76,424"
    },
    {
        "id": 430,
        "name": "815_未出货",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(430)",
        "tree": "1,2,430"
    },
    {
        "id": 431,
        "name": "国中新创",
        "pid": 416,
        "level": 2,
        "parent_tree": "(1),(416),(431)",
        "tree": "1,416,431"
    },
    {
        "id": 442,
        "name": "东部新城城市管理中心",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(442)",
        "tree": "1,9,442"
    },
    {
        "id": 443,
        "name": "内部监控",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(443)",
        "tree": "1,2,443"
    },
    {
        "id": 444,
        "name": "车载主机",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(444)",
        "tree": "1,2,444"
    },
    {
        "id": 484,
        "name": "义乌水务局",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(484)",
        "tree": "1,9,484"
    },
    {
        "id": 485,
        "name": "科鼎机电",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(485)",
        "tree": "1,35,485"
    },
    {
        "id": 488,
        "name": "中煤安科",
        "pid": 190,
        "level": 2,
        "parent_tree": "(1),(190),(488)",
        "tree": "1,190,488"
    },
    {
        "id": 492,
        "name": "唐山市气象局",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(492)",
        "tree": "1,35,492"
    },
    {
        "id": 495,
        "name": "浙江石化",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(495)",
        "tree": "1,9,495"
    },
    {
        "id": 496,
        "name": "布控球",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(496)",
        "tree": "1,2,496"
    },
    {
        "id": 501,
        "name": "912测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(501)",
        "tree": "1,2,501"
    },
    {
        "id": 504,
        "name": "北京国网信通",
        "pid": 503,
        "level": 2,
        "parent_tree": "(1),(503),(504)",
        "tree": "1,503,504"
    },
    {
        "id": 509,
        "name": "宁波交通检测",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(509)",
        "tree": "1,9,509"
    },
    {
        "id": 519,
        "name": "无为水务局",
        "pid": 87,
        "level": 2,
        "parent_tree": "(1),(87),(519)",
        "tree": "1,87,519"
    },
    {
        "id": 525,
        "name": "油田通信",
        "pid": 524,
        "level": 2,
        "parent_tree": "(1),(524),(525)",
        "tree": "1,524,525"
    },
    {
        "id": 535,
        "name": "徐州科源",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(535)",
        "tree": "1,181,535"
    },
    {
        "id": 537,
        "name": "青岛索尔汽车",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(537)",
        "tree": "1,76,537"
    },
    {
        "id": 542,
        "name": "江苏星诺",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(542)",
        "tree": "1,181,542"
    },
    {
        "id": 545,
        "name": "北斗院物联",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(545)",
        "tree": "1,76,545"
    },
    {
        "id": 551,
        "name": "普望（上海）信息咨询有限公司",
        "pid": 131,
        "level": 2,
        "parent_tree": "(1),(131),(551)",
        "tree": "1,131,551"
    },
    {
        "id": 553,
        "name": "宁波送变电建设有限公司",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(553)",
        "tree": "1,9,553"
    },
    {
        "id": 558,
        "name": "新航致远",
        "pid": 131,
        "level": 2,
        "parent_tree": "(1),(131),(558)",
        "tree": "1,131,558"
    },
    {
        "id": 559,
        "name": "湖南警翼信安智能科技",
        "pid": 100,
        "level": 2,
        "parent_tree": "(1),(100),(559)",
        "tree": "1,100,559"
    },
    {
        "id": 562,
        "name": "石家庄市一方科技有限公司",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(562)",
        "tree": "1,35,562"
    },
    {
        "id": 563,
        "name": "青岛三利中德",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(563)",
        "tree": "1,76,563"
    },
    {
        "id": 567,
        "name": "中咨公路项目",
        "pid": 503,
        "level": 2,
        "parent_tree": "(1),(503),(567)",
        "tree": "1,503,567"
    },
    {
        "id": 569,
        "name": "西安圣点世纪科技有限公司",
        "pid": 416,
        "level": 2,
        "parent_tree": "(1),(416),(569)",
        "tree": "1,416,569"
    },
    {
        "id": 574,
        "name": "正云科技",
        "pid": 503,
        "level": 2,
        "parent_tree": "(1),(503),(574)",
        "tree": "1,503,574"
    },
    {
        "id": 575,
        "name": "云南文鼎",
        "pid": 400,
        "level": 2,
        "parent_tree": "(1),(400),(575)",
        "tree": "1,400,575"
    },
    {
        "id": 577,
        "name": "225测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(577)",
        "tree": "1,2,577"
    },
    {
        "id": 578,
        "name": "索福尔汽车",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(578)",
        "tree": "1,76,578"
    },
    {
        "id": 580,
        "name": "威海杜",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(580)",
        "tree": "1,76,580"
    },
    {
        "id": 581,
        "name": "上海寻正智能",
        "pid": 290,
        "level": 2,
        "parent_tree": "(1),(290),(581)",
        "tree": "1,290,581"
    },
    {
        "id": 584,
        "name": "河北天创",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(584)",
        "tree": "1,35,584"
    },
    {
        "id": 585,
        "name": "西安峪北",
        "pid": 416,
        "level": 2,
        "parent_tree": "(1),(416),(585)",
        "tree": "1,416,585"
    },
    {
        "id": 586,
        "name": "山西华承",
        "pid": 190,
        "level": 2,
        "parent_tree": "(1),(190),(586)",
        "tree": "1,190,586"
    },
    {
        "id": 587,
        "name": "程旭",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(587)",
        "tree": "1,35,587"
    },
    {
        "id": 588,
        "name": "无锡市高桥检测科技",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(588)",
        "tree": "1,181,588"
    },
    {
        "id": 589,
        "name": "北京酷成长",
        "pid": 503,
        "level": 2,
        "parent_tree": "(1),(503),(589)",
        "tree": "1,503,589"
    },
    {
        "id": 594,
        "name": "电力卫士",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(594)",
        "tree": "1,181,594"
    },
    {
        "id": 596,
        "name": "秦滨高速",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(596)",
        "tree": "1,35,596"
    },
    {
        "id": 597,
        "name": "武汉擎安云",
        "pid": 164,
        "level": 2,
        "parent_tree": "(1),(164),(597)",
        "tree": "1,164,597"
    },
    {
        "id": 598,
        "name": "河南建功",
        "pid": 75,
        "level": 2,
        "parent_tree": "(1),(75),(598)",
        "tree": "1,75,598"
    },
    {
        "id": 600,
        "name": "宁波智享智能",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(600)",
        "tree": "1,9,600"
    },
    {
        "id": 603,
        "name": "蜀锐电话",
        "pid": 131,
        "level": 2,
        "parent_tree": "(1),(131),(603)",
        "tree": "1,131,603"
    },
    {
        "id": 609,
        "name": "山东拓远项目管理公司",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(609)",
        "tree": "1,76,609"
    },
    {
        "id": 610,
        "name": "康振电气",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(610)",
        "tree": "1,181,610"
    },
    {
        "id": 611,
        "name": "恋茶文化",
        "pid": 152,
        "level": 2,
        "parent_tree": "(1),(152),(611)",
        "tree": "1,152,611"
    },
    {
        "id": 613,
        "name": "昱鑫测控",
        "pid": 164,
        "level": 2,
        "parent_tree": "(1),(164),(613)",
        "tree": "1,164,613"
    },
    {
        "id": 615,
        "name": "赣州机场消防",
        "pid": 152,
        "level": 2,
        "parent_tree": "(1),(152),(615)",
        "tree": "1,152,615"
    },
    {
        "id": 618,
        "name": "浙江龙驰建设",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(618)",
        "tree": "1,9,618"
    },
    {
        "id": 620,
        "name": "上海思允",
        "pid": 290,
        "level": 2,
        "parent_tree": "(1),(290),(620)",
        "tree": "1,290,620"
    },
    {
        "id": 621,
        "name": "年泰电力",
        "pid": 87,
        "level": 2,
        "parent_tree": "(1),(87),(621)",
        "tree": "1,87,621"
    },
    {
        "id": 627,
        "name": "南京奥联信息",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(627)",
        "tree": "1,181,627"
    },
    {
        "id": 629,
        "name": "江苏柏勋科技",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(629)",
        "tree": "1,181,629"
    },
    {
        "id": 632,
        "name": "苏能电力工程",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(632)",
        "tree": "1,181,632"
    },
    {
        "id": 633,
        "name": "天勤网络",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(633)",
        "tree": "1,181,633"
    },
    {
        "id": 634,
        "name": "河北联强",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(634)",
        "tree": "1,35,634"
    },
    {
        "id": 640,
        "name": "衡水市安捷电子",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(640)",
        "tree": "1,35,640"
    },
    {
        "id": 643,
        "name": "郑州祥和集团",
        "pid": 75,
        "level": 2,
        "parent_tree": "(1),(75),(643)",
        "tree": "1,75,643"
    },
    {
        "id": 650,
        "name": "宁波天弘电力",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(650)",
        "tree": "1,9,650"
    },
    {
        "id": 652,
        "name": "遵义机场",
        "pid": 152,
        "level": 2,
        "parent_tree": "(1),(152),(652)",
        "tree": "1,152,652"
    },
    {
        "id": 653,
        "name": "安徽天元",
        "pid": 87,
        "level": 2,
        "parent_tree": "(1),(87),(653)",
        "tree": "1,87,653"
    },
    {
        "id": 656,
        "name": "郑州优碧科技",
        "pid": 75,
        "level": 2,
        "parent_tree": "(1),(75),(656)",
        "tree": "1,75,656"
    },
    {
        "id": 661,
        "name": "沈阳永成烽火",
        "pid": 76,
        "level": 2,
        "parent_tree": "(1),(76),(661)",
        "tree": "1,76,661"
    },
    {
        "id": 678,
        "name": "宁波瑞奥",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(678)",
        "tree": "1,9,678"
    },
    {
        "id": 684,
        "name": "如东县住建局",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(684)",
        "tree": "1,181,684"
    },
    {
        "id": 685,
        "name": "重庆安之然",
        "pid": 412,
        "level": 2,
        "parent_tree": "(1),(412),(685)",
        "tree": "1,412,685"
    },
    {
        "id": 691,
        "name": "甘肃省电力应急中心",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(691)",
        "tree": "1,35,691"
    },
    {
        "id": 693,
        "name": "宁波交投三分公司",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(693)",
        "tree": "1,9,693"
    },
    {
        "id": 694,
        "name": "珞珈天铭",
        "pid": 164,
        "level": 2,
        "parent_tree": "(1),(164),(694)",
        "tree": "1,164,694"
    },
    {
        "id": 714,
        "name": "宁波高等级公司养护",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(714)",
        "tree": "1,9,714"
    },
    {
        "id": 718,
        "name": "金童矿区",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(718)",
        "tree": "1,9,718"
    },
    {
        "id": 722,
        "name": "象山城管",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(722)",
        "tree": "1,9,722"
    },
    {
        "id": 726,
        "name": "防外破视频装置",
        "pid": 87,
        "level": 2,
        "parent_tree": "(1),(87),(726)",
        "tree": "1,87,726"
    },
    {
        "id": 730,
        "name": "818测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(730)",
        "tree": "1,2,730"
    },
    {
        "id": 732,
        "name": "安徽瞳声",
        "pid": 87,
        "level": 2,
        "parent_tree": "(1),(87),(732)",
        "tree": "1,87,732"
    },
    {
        "id": 748,
        "name": "十二月份发的货",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(748)",
        "tree": "1,2,748"
    },
    {
        "id": 765,
        "name": "4.10测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(765)",
        "tree": "1,2,765"
    },
    {
        "id": 767,
        "name": "陕西华宏隆兴",
        "pid": 416,
        "level": 2,
        "parent_tree": "(1),(416),(767)",
        "tree": "1,416,767"
    },
    {
        "id": 771,
        "name": "大理宾川水务局",
        "pid": 400,
        "level": 2,
        "parent_tree": "(1),(400),(771)",
        "tree": "1,400,771"
    },
    {
        "id": 772,
        "name": "i1-test",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(772)",
        "tree": "1,2,772"
    },
    {
        "id": 773,
        "name": "象山影视城",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(773)",
        "tree": "1,9,773"
    },
    {
        "id": 779,
        "name": "EMC-TEST",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(779)",
        "tree": "1,2,779"
    },
    {
        "id": 780,
        "name": "国标演示测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(780)",
        "tree": "1,2,780"
    },
    {
        "id": 781,
        "name": "机芯ping测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(781)",
        "tree": "1,2,781"
    },
    {
        "id": 782,
        "name": "天能电力",
        "pid": 35,
        "level": 2,
        "parent_tree": "(1),(35),(782)",
        "tree": "1,35,782"
    },
    {
        "id": 785,
        "name": "4月份测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(785)",
        "tree": "1,2,785"
    },
    {
        "id": 789,
        "name": "833测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(789)",
        "tree": "1,2,789"
    },
    {
        "id": 790,
        "name": "优尔电子",
        "pid": 87,
        "level": 2,
        "parent_tree": "(1),(87),(790)",
        "tree": "1,87,790"
    },
    {
        "id": 792,
        "name": "2021/6/16 10个矮球机",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(792)",
        "tree": "1,2,792"
    },
    {
        "id": 797,
        "name": "南京悠阔",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(797)",
        "tree": "1,181,797"
    },
    {
        "id": 801,
        "name": "30+3普通球机带音频",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(801)",
        "tree": "1,2,801"
    },
    {
        "id": 805,
        "name": "9月7号T型测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(805)",
        "tree": "1,2,805"
    },
    {
        "id": 812,
        "name": "2021/12/16-10套",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(812)",
        "tree": "1,2,812"
    },
    {
        "id": 813,
        "name": "两个带AI模块球机",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(813)",
        "tree": "1,2,813"
    },
    {
        "id": 819,
        "name": "农业科学院腰果研究中心",
        "pid": 554,
        "level": 2,
        "parent_tree": "(1),(554),(819)",
        "tree": "1,554,819"
    },
    {
        "id": 821,
        "name": "2022/3/2-920主板3个",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(821)",
        "tree": "1,2,821"
    },
    {
        "id": 826,
        "name": "20220331测试3台T型云台",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(826)",
        "tree": "1,2,826"
    },
    {
        "id": 827,
        "name": "2507N黑球测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(827)",
        "tree": "1,2,827"
    },
    {
        "id": 828,
        "name": "2507N测试用的球机",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(828)",
        "tree": "1,2,828"
    },
    {
        "id": 829,
        "name": "江苏移动",
        "pid": 181,
        "level": 2,
        "parent_tree": "(1),(181),(829)",
        "tree": "1,181,829"
    },
    {
        "id": 848,
        "name": "160套测试5个",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(848)",
        "tree": "1,2,848"
    },
    {
        "id": 860,
        "name": "铜陵万通",
        "pid": 87,
        "level": 2,
        "parent_tree": "(1),(87),(860)",
        "tree": "1,87,860"
    },
    {
        "id": 877,
        "name": "电网",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(877)",
        "tree": "1,9,877"
    },
    {
        "id": 892,
        "name": "维修",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(892)",
        "tree": "1,2,892"
    },
    {
        "id": 895,
        "name": "20230320-三个小球机",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(895)",
        "tree": "1,2,895"
    },
    {
        "id": 897,
        "name": "850主板发常德",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(897)",
        "tree": "1,2,897"
    },
    {
        "id": 899,
        "name": "I1定制测试",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(899)",
        "tree": "1,2,899"
    },
    {
        "id": 900,
        "name": "大华测试",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(900)",
        "tree": "1,9,900"
    },
    {
        "id": 901,
        "name": "海康硬盘录像机",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(901)",
        "tree": "1,2,901"
    },
    {
        "id": 903,
        "name": "象山造船厂",
        "pid": 9,
        "level": 2,
        "parent_tree": "(1),(9),(903)",
        "tree": "1,9,903"
    },
    {
        "id": 907,
        "name": "20230509-15片V2-850主板",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(907)",
        "tree": "1,2,907"
    },
    {
        "id": 910,
        "name": "测试枪机",
        "pid": 2,
        "level": 2,
        "parent_tree": "(1),(2),(910)",
        "tree": "1,2,910"
    },
    {
        "id": 92,
        "name": "613避险车道",
        "pid": 77,
        "level": 3,
        "parent_tree": "(1),(76),(77),(92)",
        "tree": "1,76,77,92"
    },
    {
        "id": 105,
        "name": "智能安全帽",
        "pid": 104,
        "level": 3,
        "parent_tree": "(1),(35),(104),(105)",
        "tree": "1,35,104,105"
    },
    {
        "id": 133,
        "name": "电莞电力",
        "pid": 85,
        "level": 3,
        "parent_tree": "(1),(9),(85),(133)",
        "tree": "1,9,85,133"
    },
    {
        "id": 137,
        "name": "甘肃省环境应急与事故调查中心",
        "pid": 136,
        "level": 3,
        "parent_tree": "(1),(76),(136),(137)",
        "tree": "1,76,136,137"
    },
    {
        "id": 138,
        "name": "客户b",
        "pid": 136,
        "level": 3,
        "parent_tree": "(1),(76),(136),(138)",
        "tree": "1,76,136,138"
    },
    {
        "id": 139,
        "name": "客户C",
        "pid": 136,
        "level": 3,
        "parent_tree": "(1),(76),(136),(139)",
        "tree": "1,76,136,139"
    },
    {
        "id": 142,
        "name": "检测站",
        "pid": 136,
        "level": 3,
        "parent_tree": "(1),(76),(136),(142)",
        "tree": "1,76,136,142"
    },
    {
        "id": 151,
        "name": "建筑",
        "pid": 150,
        "level": 3,
        "parent_tree": "(1),(76),(150),(151)",
        "tree": "1,76,150,151"
    },
    {
        "id": 166,
        "name": "奋进测试",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(166)",
        "tree": "1,164,165,166"
    },
    {
        "id": 169,
        "name": "车载",
        "pid": 77,
        "level": 3,
        "parent_tree": "(1),(76),(77),(169)",
        "tree": "1,76,77,169"
    },
    {
        "id": 172,
        "name": "安顺水利局",
        "pid": 140,
        "level": 3,
        "parent_tree": "(1),(97),(140),(172)",
        "tree": "1,97,140,172"
    },
    {
        "id": 175,
        "name": "应急指挥",
        "pid": 174,
        "level": 3,
        "parent_tree": "(1),(131),(174),(175)",
        "tree": "1,131,174,175"
    },
    {
        "id": 185,
        "name": "铁路桥",
        "pid": 77,
        "level": 3,
        "parent_tree": "(1),(76),(77),(185)",
        "tree": "1,76,77,185"
    },
    {
        "id": 196,
        "name": "保山水利局",
        "pid": 140,
        "level": 3,
        "parent_tree": "(1),(97),(140),(196)",
        "tree": "1,97,140,196"
    },
    {
        "id": 213,
        "name": "杭州市局禁毒大队",
        "pid": 83,
        "level": 3,
        "parent_tree": "(1),(9),(83),(213)",
        "tree": "1,9,83,213"
    },
    {
        "id": 214,
        "name": "迎宾大桥",
        "pid": 77,
        "level": 3,
        "parent_tree": "(1),(76),(77),(214)",
        "tree": "1,76,77,214"
    },
    {
        "id": 235,
        "name": "akx01",
        "pid": 234,
        "level": 3,
        "parent_tree": "(1),(181),(234),(235)",
        "tree": "1,181,234,235"
    },
    {
        "id": 239,
        "name": "张家界机场",
        "pid": 238,
        "level": 3,
        "parent_tree": "(1),(9),(238),(239)",
        "tree": "1,9,238,239"
    },
    {
        "id": 240,
        "name": "akx02",
        "pid": 234,
        "level": 3,
        "parent_tree": "(1),(181),(234),(240)",
        "tree": "1,181,234,240"
    },
    {
        "id": 263,
        "name": "机场",
        "pid": 262,
        "level": 3,
        "parent_tree": "(1),(131),(262),(263)",
        "tree": "1,131,262,263"
    },
    {
        "id": 270,
        "name": "上海厉基",
        "pid": 234,
        "level": 3,
        "parent_tree": "(1),(181),(234),(270)",
        "tree": "1,181,234,270"
    },
    {
        "id": 273,
        "name": "akx03",
        "pid": 234,
        "level": 3,
        "parent_tree": "(1),(181),(234),(273)",
        "tree": "1,181,234,273"
    },
    {
        "id": 298,
        "name": "客户A",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(298)",
        "tree": "1,164,165,298"
    },
    {
        "id": 317,
        "name": "前景光电",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(317)",
        "tree": "1,76,296,317"
    },
    {
        "id": 318,
        "name": "手持2",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(318)",
        "tree": "1,76,296,318"
    },
    {
        "id": 319,
        "name": "手持3",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(319)",
        "tree": "1,76,296,319"
    },
    {
        "id": 329,
        "name": "akx05",
        "pid": 234,
        "level": 3,
        "parent_tree": "(1),(181),(234),(329)",
        "tree": "1,181,234,329"
    },
    {
        "id": 331,
        "name": "黄花机场",
        "pid": 85,
        "level": 3,
        "parent_tree": "(1),(9),(85),(331)",
        "tree": "1,9,85,331"
    },
    {
        "id": 335,
        "name": "茶陵县",
        "pid": 140,
        "level": 3,
        "parent_tree": "(1),(97),(140),(335)",
        "tree": "1,97,140,335"
    },
    {
        "id": 366,
        "name": "长热集团",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(366)",
        "tree": "1,76,296,366"
    },
    {
        "id": 369,
        "name": "2017年9套监控",
        "pid": 302,
        "level": 3,
        "parent_tree": "(1),(9),(302),(369)",
        "tree": "1,9,302,369"
    },
    {
        "id": 370,
        "name": "宁夏2017",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(370)",
        "tree": "1,164,165,370"
    },
    {
        "id": 371,
        "name": "客户B",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(371)",
        "tree": "1,164,165,371"
    },
    {
        "id": 373,
        "name": "银川",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(373)",
        "tree": "1,164,165,373"
    },
    {
        "id": 378,
        "name": "定位设备",
        "pid": 66,
        "level": 3,
        "parent_tree": "(1),(35),(66),(378)",
        "tree": "1,35,66,378"
    },
    {
        "id": 387,
        "name": "应急救援",
        "pid": 136,
        "level": 3,
        "parent_tree": "(1),(76),(136),(387)",
        "tree": "1,76,136,387"
    },
    {
        "id": 389,
        "name": "2017年球机",
        "pid": 302,
        "level": 3,
        "parent_tree": "(1),(9),(302),(389)",
        "tree": "1,9,302,389"
    },
    {
        "id": 403,
        "name": "福建电力公司",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(403)",
        "tree": "1,164,165,403"
    },
    {
        "id": 407,
        "name": "消防大队",
        "pid": 406,
        "level": 3,
        "parent_tree": "(1),(152),(406),(407)",
        "tree": "1,152,406,407"
    },
    {
        "id": 420,
        "name": "沧源水利局",
        "pid": 140,
        "level": 3,
        "parent_tree": "(1),(97),(140),(420)",
        "tree": "1,97,140,420"
    },
    {
        "id": 422,
        "name": "黄浦水利局",
        "pid": 140,
        "level": 3,
        "parent_tree": "(1),(97),(140),(422)",
        "tree": "1,97,140,422"
    },
    {
        "id": 426,
        "name": "奔驰指挥车",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(426)",
        "tree": "1,76,296,426"
    },
    {
        "id": 427,
        "name": "演示",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(427)",
        "tree": "1,76,296,427"
    },
    {
        "id": 428,
        "name": "晋城水务局",
        "pid": 136,
        "level": 3,
        "parent_tree": "(1),(76),(136),(428)",
        "tree": "1,76,136,428"
    },
    {
        "id": 435,
        "name": "313-3-3",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(435)",
        "tree": "1,164,165,435"
    },
    {
        "id": 441,
        "name": "瑞风消防指挥车",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(441)",
        "tree": "1,76,296,441"
    },
    {
        "id": 449,
        "name": "上海工商",
        "pid": 234,
        "level": 3,
        "parent_tree": "(1),(181),(234),(449)",
        "tree": "1,181,234,449"
    },
    {
        "id": 450,
        "name": "青海",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(450)",
        "tree": "1,164,165,450"
    },
    {
        "id": 451,
        "name": "上海",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(451)",
        "tree": "1,164,165,451"
    },
    {
        "id": 454,
        "name": "福建",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(454)",
        "tree": "1,164,165,454"
    },
    {
        "id": 456,
        "name": "河北",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(456)",
        "tree": "1,164,165,456"
    },
    {
        "id": 458,
        "name": "湖北",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(458)",
        "tree": "1,164,165,458"
    },
    {
        "id": 461,
        "name": "浙江",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(461)",
        "tree": "1,164,165,461"
    },
    {
        "id": 463,
        "name": "河南",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(463)",
        "tree": "1,164,165,463"
    },
    {
        "id": 468,
        "name": "山东",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(468)",
        "tree": "1,164,165,468"
    },
    {
        "id": 474,
        "name": "江西",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(474)",
        "tree": "1,164,165,474"
    },
    {
        "id": 493,
        "name": "曹妃甸气象局",
        "pid": 492,
        "level": 3,
        "parent_tree": "(1),(35),(492),(493)",
        "tree": "1,35,492,493"
    },
    {
        "id": 494,
        "name": "乐亭县气象局",
        "pid": 492,
        "level": 3,
        "parent_tree": "(1),(35),(492),(494)",
        "tree": "1,35,492,494"
    },
    {
        "id": 499,
        "name": "山东电力演示",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(499)",
        "tree": "1,164,165,499"
    },
    {
        "id": 502,
        "name": "淄博桓台县供电公司",
        "pid": 165,
        "level": 3,
        "parent_tree": "(1),(164),(165),(502)",
        "tree": "1,164,165,502"
    },
    {
        "id": 508,
        "name": "智能安全帽",
        "pid": 77,
        "level": 3,
        "parent_tree": "(1),(76),(77),(508)",
        "tree": "1,76,77,508"
    },
    {
        "id": 510,
        "name": "安全帽",
        "pid": 66,
        "level": 3,
        "parent_tree": "(1),(35),(66),(510)",
        "tree": "1,35,66,510"
    },
    {
        "id": 511,
        "name": "济南人防",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(511)",
        "tree": "1,76,296,511"
    },
    {
        "id": 512,
        "name": "鼎文学校项目",
        "pid": 618,
        "level": 3,
        "parent_tree": "(1),(9),(618),(512)",
        "tree": "1,9,618,512"
    },
    {
        "id": 538,
        "name": "金华创业机电设备",
        "pid": 537,
        "level": 3,
        "parent_tree": "(1),(76),(537),(538)",
        "tree": "1,76,537,538"
    },
    {
        "id": 539,
        "name": "样车",
        "pid": 537,
        "level": 3,
        "parent_tree": "(1),(76),(537),(539)",
        "tree": "1,76,537,539"
    },
    {
        "id": 544,
        "name": "菠萝救援队",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(544)",
        "tree": "1,76,296,544"
    },
    {
        "id": 546,
        "name": "客户",
        "pid": 545,
        "level": 3,
        "parent_tree": "(1),(76),(545),(546)",
        "tree": "1,76,545,546"
    },
    {
        "id": 561,
        "name": "四川",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(561)",
        "tree": "1,76,296,561"
    },
    {
        "id": 564,
        "name": "A",
        "pid": 563,
        "level": 3,
        "parent_tree": "(1),(76),(563),(564)",
        "tree": "1,76,563,564"
    },
    {
        "id": 572,
        "name": "兰州机场",
        "pid": 238,
        "level": 3,
        "parent_tree": "(1),(9),(238),(572)",
        "tree": "1,9,238,572"
    },
    {
        "id": 579,
        "name": "A",
        "pid": 578,
        "level": 3,
        "parent_tree": "(1),(76),(578),(579)",
        "tree": "1,76,578,579"
    },
    {
        "id": 595,
        "name": "青岛海运",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(595)",
        "tree": "1,76,296,595"
    },
    {
        "id": 607,
        "name": "测试",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(607)",
        "tree": "1,76,296,607"
    },
    {
        "id": 617,
        "name": "海曙气象局",
        "pid": 302,
        "level": 3,
        "parent_tree": "(1),(9),(302),(617)",
        "tree": "1,9,302,617"
    },
    {
        "id": 638,
        "name": "8套",
        "pid": 537,
        "level": 3,
        "parent_tree": "(1),(76),(537),(638)",
        "tree": "1,76,537,638"
    },
    {
        "id": 651,
        "name": "高压视频",
        "pid": 650,
        "level": 3,
        "parent_tree": "(1),(9),(650),(651)",
        "tree": "1,9,650,651"
    },
    {
        "id": 662,
        "name": "千喜救援队",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(662)",
        "tree": "1,76,296,662"
    },
    {
        "id": 668,
        "name": "创新研究院",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(668)",
        "tree": "1,76,296,668"
    },
    {
        "id": 680,
        "name": "张掖市",
        "pid": 691,
        "level": 3,
        "parent_tree": "(1),(35),(691),(680)",
        "tree": "1,35,691,680"
    },
    {
        "id": 681,
        "name": "4台黄色",
        "pid": 684,
        "level": 3,
        "parent_tree": "(1),(181),(684),(681)",
        "tree": "1,181,684,681"
    },
    {
        "id": 686,
        "name": "北京卫星发射中心",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(686)",
        "tree": "1,76,296,686"
    },
    {
        "id": 687,
        "name": "3套白色",
        "pid": 501,
        "level": 3,
        "parent_tree": "(1),(2),(501),(687)",
        "tree": "1,2,501,687"
    },
    {
        "id": 692,
        "name": "陇南市",
        "pid": 691,
        "level": 3,
        "parent_tree": "(1),(35),(691),(692)",
        "tree": "1,35,691,692"
    },
    {
        "id": 704,
        "name": "2个红色",
        "pid": 501,
        "level": 3,
        "parent_tree": "(1),(2),(501),(704)",
        "tree": "1,2,501,704"
    },
    {
        "id": 707,
        "name": "驭道",
        "pid": 627,
        "level": 3,
        "parent_tree": "(1),(181),(627),(707)",
        "tree": "1,181,627,707"
    },
    {
        "id": 708,
        "name": "携奥",
        "pid": 627,
        "level": 3,
        "parent_tree": "(1),(181),(627),(708)",
        "tree": "1,181,627,708"
    },
    {
        "id": 709,
        "name": "奥联",
        "pid": 627,
        "level": 3,
        "parent_tree": "(1),(181),(627),(709)",
        "tree": "1,181,627,709"
    },
    {
        "id": 711,
        "name": "国标测试",
        "pid": 694,
        "level": 3,
        "parent_tree": "(1),(164),(694),(711)",
        "tree": "1,164,694,711"
    },
    {
        "id": 712,
        "name": "669592",
        "pid": 694,
        "level": 3,
        "parent_tree": "(1),(164),(694),(712)",
        "tree": "1,164,694,712"
    },
    {
        "id": 715,
        "name": "天津恒安",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(715)",
        "tree": "1,76,296,715"
    },
    {
        "id": 716,
        "name": "青岛应急管理局",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(716)",
        "tree": "1,76,296,716"
    },
    {
        "id": 724,
        "name": "669504",
        "pid": 694,
        "level": 3,
        "parent_tree": "(1),(164),(694),(724)",
        "tree": "1,164,694,724"
    },
    {
        "id": 735,
        "name": "西周中队",
        "pid": 722,
        "level": 3,
        "parent_tree": "(1),(9),(722),(735)",
        "tree": "1,9,722,735"
    },
    {
        "id": 736,
        "name": "大徐中队",
        "pid": 722,
        "level": 3,
        "parent_tree": "(1),(9),(722),(736)",
        "tree": "1,9,722,736"
    },
    {
        "id": 737,
        "name": "新桥中队",
        "pid": 722,
        "level": 3,
        "parent_tree": "(1),(9),(722),(737)",
        "tree": "1,9,722,737"
    },
    {
        "id": 741,
        "name": "26个带音频和电池",
        "pid": 748,
        "level": 3,
        "parent_tree": "(1),(2),(748),(741)",
        "tree": "1,2,748,741"
    },
    {
        "id": 750,
        "name": "发一台维修的机器至东北",
        "pid": 748,
        "level": 3,
        "parent_tree": "(1),(2),(748),(750)",
        "tree": "1,2,748,750"
    },
    {
        "id": 751,
        "name": "一台2507机芯",
        "pid": 748,
        "level": 3,
        "parent_tree": "(1),(2),(748),(751)",
        "tree": "1,2,748,751"
    },
    {
        "id": 752,
        "name": "济宁国祥投资有限公司",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(752)",
        "tree": "1,76,296,752"
    },
    {
        "id": 753,
        "name": "2020.12.09发4",
        "pid": 748,
        "level": 3,
        "parent_tree": "(1),(2),(748),(753)",
        "tree": "1,2,748,753"
    },
    {
        "id": 754,
        "name": "2020.12.11.发13",
        "pid": 748,
        "level": 3,
        "parent_tree": "(1),(2),(748),(754)",
        "tree": "1,2,748,754"
    },
    {
        "id": 755,
        "name": "20201211发刘星建2个",
        "pid": 748,
        "level": 3,
        "parent_tree": "(1),(2),(748),(755)",
        "tree": "1,2,748,755"
    },
    {
        "id": 757,
        "name": "2020 12 16发",
        "pid": 748,
        "level": 3,
        "parent_tree": "(1),(2),(748),(757)",
        "tree": "1,2,748,757"
    },
    {
        "id": 758,
        "name": "饶东",
        "pid": 714,
        "level": 3,
        "parent_tree": "(1),(9),(714),(758)",
        "tree": "1,9,714,758"
    },
    {
        "id": 759,
        "name": "南接线",
        "pid": 714,
        "level": 3,
        "parent_tree": "(1),(9),(714),(759)",
        "tree": "1,9,714,759"
    },
    {
        "id": 760,
        "name": "20201219维修常德",
        "pid": 748,
        "level": 3,
        "parent_tree": "(1),(2),(748),(760)",
        "tree": "1,2,748,760"
    },
    {
        "id": 761,
        "name": "20201220 3个",
        "pid": 748,
        "level": 3,
        "parent_tree": "(1),(2),(748),(761)",
        "tree": "1,2,748,761"
    },
    {
        "id": 763,
        "name": "20201222发9个长沙",
        "pid": 748,
        "level": 3,
        "parent_tree": "(1),(2),(748),(763)",
        "tree": "1,2,748,763"
    },
    {
        "id": 764,
        "name": "20201222发5个2507有开关",
        "pid": 722,
        "level": 3,
        "parent_tree": "(1),(9),(722),(764)",
        "tree": "1,9,722,764"
    },
    {
        "id": 766,
        "name": "20201228发15个",
        "pid": 748,
        "level": 3,
        "parent_tree": "(1),(2),(748),(766)",
        "tree": "1,2,748,766"
    },
    {
        "id": 774,
        "name": "西宁市城西区疾病预防控制中心",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(774)",
        "tree": "1,76,296,774"
    },
    {
        "id": 777,
        "name": "在线监测装置",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(777)",
        "tree": "1,87,726,777"
    },
    {
        "id": 778,
        "name": "视频监控",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(778)",
        "tree": "1,87,726,778"
    },
    {
        "id": 784,
        "name": "2628测试",
        "pid": 694,
        "level": 3,
        "parent_tree": "(1),(164),(694),(784)",
        "tree": "1,164,694,784"
    },
    {
        "id": 794,
        "name": "20210701",
        "pid": 537,
        "level": 3,
        "parent_tree": "(1),(76),(537),(794)",
        "tree": "1,76,537,794"
    },
    {
        "id": 795,
        "name": "8路NVR",
        "pid": 537,
        "level": 3,
        "parent_tree": "(1),(76),(537),(795)",
        "tree": "1,76,537,795"
    },
    {
        "id": 798,
        "name": "象鼻岭水电站",
        "pid": 797,
        "level": 3,
        "parent_tree": "(1),(181),(797),(798)",
        "tree": "1,181,797,798"
    },
    {
        "id": 799,
        "name": "20210714",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(799)",
        "tree": "1,76,296,799"
    },
    {
        "id": 800,
        "name": "akx09",
        "pid": 234,
        "level": 3,
        "parent_tree": "(1),(181),(234),(800)",
        "tree": "1,181,234,800"
    },
    {
        "id": 802,
        "name": "4G手持单兵22",
        "pid": 537,
        "level": 3,
        "parent_tree": "(1),(76),(537),(802)",
        "tree": "1,76,537,802"
    },
    {
        "id": 803,
        "name": "输电线路在线监测",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(803)",
        "tree": "1,87,726,803"
    },
    {
        "id": 804,
        "name": "烟台中石化工",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(804)",
        "tree": "1,76,296,804"
    },
    {
        "id": 806,
        "name": "展会",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(806)",
        "tree": "1,76,296,806"
    },
    {
        "id": 808,
        "name": "上海",
        "pid": 694,
        "level": 3,
        "parent_tree": "(1),(164),(694),(808)",
        "tree": "1,164,694,808"
    },
    {
        "id": 809,
        "name": "静乐县自来水公司",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(809)",
        "tree": "1,76,296,809"
    },
    {
        "id": 811,
        "name": "20211122-13pc",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(811)",
        "tree": "1,87,726,811"
    },
    {
        "id": 815,
        "name": "通化恒泰热力",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(815)",
        "tree": "1,76,296,815"
    },
    {
        "id": 818,
        "name": "20220125-1pc",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(818)",
        "tree": "1,76,296,818"
    },
    {
        "id": 824,
        "name": "20220318-8pc",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(824)",
        "tree": "1,87,726,824"
    },
    {
        "id": 830,
        "name": "镇江",
        "pid": 829,
        "level": 3,
        "parent_tree": "(1),(181),(829),(830)",
        "tree": "1,181,829,830"
    },
    {
        "id": 831,
        "name": "无锡",
        "pid": 829,
        "level": 3,
        "parent_tree": "(1),(181),(829),(831)",
        "tree": "1,181,829,831"
    },
    {
        "id": 832,
        "name": "苏州",
        "pid": 829,
        "level": 3,
        "parent_tree": "(1),(181),(829),(832)",
        "tree": "1,181,829,832"
    },
    {
        "id": 833,
        "name": "徐州",
        "pid": 829,
        "level": 3,
        "parent_tree": "(1),(181),(829),(833)",
        "tree": "1,181,829,833"
    },
    {
        "id": 834,
        "name": "连云港",
        "pid": 829,
        "level": 3,
        "parent_tree": "(1),(181),(829),(834)",
        "tree": "1,181,829,834"
    },
    {
        "id": 835,
        "name": "淮安",
        "pid": 829,
        "level": 3,
        "parent_tree": "(1),(181),(829),(835)",
        "tree": "1,181,829,835"
    },
    {
        "id": 836,
        "name": "常州",
        "pid": 829,
        "level": 3,
        "parent_tree": "(1),(181),(829),(836)",
        "tree": "1,181,829,836"
    },
    {
        "id": 837,
        "name": "扬州",
        "pid": 829,
        "level": 3,
        "parent_tree": "(1),(181),(829),(837)",
        "tree": "1,181,829,837"
    },
    {
        "id": 838,
        "name": "宿迁",
        "pid": 829,
        "level": 3,
        "parent_tree": "(1),(181),(829),(838)",
        "tree": "1,181,829,838"
    },
    {
        "id": 839,
        "name": "南通",
        "pid": 829,
        "level": 3,
        "parent_tree": "(1),(181),(829),(839)",
        "tree": "1,181,829,839"
    },
    {
        "id": 840,
        "name": "盐城",
        "pid": 829,
        "level": 3,
        "parent_tree": "(1),(181),(829),(840)",
        "tree": "1,181,829,840"
    },
    {
        "id": 841,
        "name": "南京",
        "pid": 829,
        "level": 3,
        "parent_tree": "(1),(181),(829),(841)",
        "tree": "1,181,829,841"
    },
    {
        "id": 842,
        "name": "泰州",
        "pid": 829,
        "level": 3,
        "parent_tree": "(1),(181),(829),(842)",
        "tree": "1,181,829,842"
    },
    {
        "id": 844,
        "name": "涞水消防大队",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(844)",
        "tree": "1,76,296,844"
    },
    {
        "id": 846,
        "name": "20220701-4pc",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(846)",
        "tree": "1,87,726,846"
    },
    {
        "id": 847,
        "name": "20220620-26pc",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(847)",
        "tree": "1,87,726,847"
    },
    {
        "id": 850,
        "name": "智能走板",
        "pid": 650,
        "level": 3,
        "parent_tree": "(1),(9),(650),(850)",
        "tree": "1,9,650,850"
    },
    {
        "id": 852,
        "name": "SongYgdgs",
        "pid": 694,
        "level": 3,
        "parent_tree": "(1),(164),(694),(852)",
        "tree": "1,164,694,852"
    },
    {
        "id": 854,
        "name": "青州华润燃气",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(854)",
        "tree": "1,76,296,854"
    },
    {
        "id": 855,
        "name": "山东滨华新材料",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(855)",
        "tree": "1,76,296,855"
    },
    {
        "id": 856,
        "name": "穿好",
        "pid": 714,
        "level": 3,
        "parent_tree": "(1),(9),(714),(856)",
        "tree": "1,9,714,856"
    },
    {
        "id": 857,
        "name": "慈余",
        "pid": 714,
        "level": 3,
        "parent_tree": "(1),(9),(714),(857)",
        "tree": "1,9,714,857"
    },
    {
        "id": 858,
        "name": "三门湾",
        "pid": 714,
        "level": 3,
        "parent_tree": "(1),(9),(714),(858)",
        "tree": "1,9,714,858"
    },
    {
        "id": 859,
        "name": "象山港",
        "pid": 714,
        "level": 3,
        "parent_tree": "(1),(9),(714),(859)",
        "tree": "1,9,714,859"
    },
    {
        "id": 862,
        "name": "余姚矿山",
        "pid": 170,
        "level": 3,
        "parent_tree": "(1),(9),(170),(862)",
        "tree": "1,9,170,862"
    },
    {
        "id": 863,
        "name": "维修好后发回去设备",
        "pid": 694,
        "level": 3,
        "parent_tree": "(1),(164),(694),(863)",
        "tree": "1,164,694,863"
    },
    {
        "id": 864,
        "name": "20220826-40pc",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(864)",
        "tree": "1,87,726,864"
    },
    {
        "id": 865,
        "name": "20220913-27pc",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(865)",
        "tree": "1,87,726,865"
    },
    {
        "id": 866,
        "name": "202209",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(866)",
        "tree": "1,87,726,866"
    },
    {
        "id": 867,
        "name": "20220909-1pc",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(867)",
        "tree": "1,87,726,867"
    },
    {
        "id": 872,
        "name": "20220930-12pc",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(872)",
        "tree": "1,87,726,872"
    },
    {
        "id": 873,
        "name": "20221008-6pc",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(873)",
        "tree": "1,87,726,873"
    },
    {
        "id": 878,
        "name": "20221103-1pc",
        "pid": 296,
        "level": 3,
        "parent_tree": "(1),(76),(296),(878)",
        "tree": "1,76,296,878"
    },
    {
        "id": 888,
        "name": "20230106-5pc",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(888)",
        "tree": "1,87,726,888"
    },
    {
        "id": 893,
        "name": "i1接入-机芯",
        "pid": 781,
        "level": 3,
        "parent_tree": "(1),(2),(781),(893)",
        "tree": "1,2,781,893"
    },
    {
        "id": 894,
        "name": "远程控制",
        "pid": 781,
        "level": 3,
        "parent_tree": "(1),(2),(781),(894)",
        "tree": "1,2,781,894"
    },
    {
        "id": 906,
        "name": "GB28181",
        "pid": 726,
        "level": 3,
        "parent_tree": "(1),(87),(726),(906)",
        "tree": "1,87,726,906"
    },
    {
        "id": 909,
        "name": "其它",
        "pid": 714,
        "level": 3,
        "parent_tree": "(1),(9),(714),(909)",
        "tree": "1,9,714,909"
    },
    {
        "id": 197,
        "name": "腾冲县",
        "pid": 196,
        "level": 4,
        "parent_tree": "(1),(97),(140),(196),(197)",
        "tree": "1,97,140,196,197"
    },
    {
        "id": 199,
        "name": "龙陵县",
        "pid": 196,
        "level": 4,
        "parent_tree": "(1),(97),(140),(196),(199)",
        "tree": "1,97,140,196,199"
    },
    {
        "id": 200,
        "name": "隆阳区",
        "pid": 196,
        "level": 4,
        "parent_tree": "(1),(97),(140),(196),(200)",
        "tree": "1,97,140,196,200"
    },
    {
        "id": 201,
        "name": "昌宁县",
        "pid": 196,
        "level": 4,
        "parent_tree": "(1),(97),(140),(196),(201)",
        "tree": "1,97,140,196,201"
    },
    {
        "id": 255,
        "name": "客户E",
        "pid": 139,
        "level": 4,
        "parent_tree": "(1),(76),(136),(139),(255)",
        "tree": "1,76,136,139,255"
    },
    {
        "id": 258,
        "name": "施甸县",
        "pid": 196,
        "level": 4,
        "parent_tree": "(1),(97),(140),(196),(258)",
        "tree": "1,97,140,196,258"
    },
    {
        "id": 295,
        "name": "whjd",
        "pid": 235,
        "level": 4,
        "parent_tree": "(1),(181),(234),(235),(295)",
        "tree": "1,181,234,235,295"
    },
    {
        "id": 334,
        "name": "普定县",
        "pid": 172,
        "level": 4,
        "parent_tree": "(1),(97),(140),(172),(334)",
        "tree": "1,97,140,172,334"
    },
    {
        "id": 382,
        "name": "保山球机",
        "pid": 196,
        "level": 4,
        "parent_tree": "(1),(97),(140),(196),(382)",
        "tree": "1,97,140,196,382"
    },
    {
        "id": 452,
        "name": "崇明",
        "pid": 451,
        "level": 4,
        "parent_tree": "(1),(164),(165),(451),(452)",
        "tree": "1,164,165,451,452"
    },
    {
        "id": 453,
        "name": "嘉定",
        "pid": 451,
        "level": 4,
        "parent_tree": "(1),(164),(165),(451),(453)",
        "tree": "1,164,165,451,453"
    },
    {
        "id": 455,
        "name": "南平",
        "pid": 454,
        "level": 4,
        "parent_tree": "(1),(164),(165),(454),(455)",
        "tree": "1,164,165,454,455"
    },
    {
        "id": 457,
        "name": "廊坊",
        "pid": 456,
        "level": 4,
        "parent_tree": "(1),(164),(165),(456),(457)",
        "tree": "1,164,165,456,457"
    },
    {
        "id": 459,
        "name": "十堰",
        "pid": 458,
        "level": 4,
        "parent_tree": "(1),(164),(165),(458),(459)",
        "tree": "1,164,165,458,459"
    },
    {
        "id": 460,
        "name": "沧州",
        "pid": 456,
        "level": 4,
        "parent_tree": "(1),(164),(165),(456),(460)",
        "tree": "1,164,165,456,460"
    },
    {
        "id": 462,
        "name": "东阳",
        "pid": 461,
        "level": 4,
        "parent_tree": "(1),(164),(165),(461),(462)",
        "tree": "1,164,165,461,462"
    },
    {
        "id": 464,
        "name": "中牟",
        "pid": 463,
        "level": 4,
        "parent_tree": "(1),(164),(165),(463),(464)",
        "tree": "1,164,165,463,464"
    },
    {
        "id": 465,
        "name": "郑州",
        "pid": 463,
        "level": 4,
        "parent_tree": "(1),(164),(165),(463),(465)",
        "tree": "1,164,165,463,465"
    },
    {
        "id": 466,
        "name": "保定",
        "pid": 456,
        "level": 4,
        "parent_tree": "(1),(164),(165),(456),(466)",
        "tree": "1,164,165,456,466"
    },
    {
        "id": 467,
        "name": "唐山",
        "pid": 456,
        "level": 4,
        "parent_tree": "(1),(164),(165),(456),(467)",
        "tree": "1,164,165,456,467"
    },
    {
        "id": 469,
        "name": "菏泽",
        "pid": 468,
        "level": 4,
        "parent_tree": "(1),(164),(165),(468),(469)",
        "tree": "1,164,165,468,469"
    },
    {
        "id": 470,
        "name": "新乡",
        "pid": 463,
        "level": 4,
        "parent_tree": "(1),(164),(165),(463),(470)",
        "tree": "1,164,165,463,470"
    },
    {
        "id": 471,
        "name": "濮阳",
        "pid": 463,
        "level": 4,
        "parent_tree": "(1),(164),(165),(463),(471)",
        "tree": "1,164,165,463,471"
    },
    {
        "id": 472,
        "name": "邯郸",
        "pid": 456,
        "level": 4,
        "parent_tree": "(1),(164),(165),(456),(472)",
        "tree": "1,164,165,456,472"
    },
    {
        "id": 473,
        "name": "武义",
        "pid": 461,
        "level": 4,
        "parent_tree": "(1),(164),(165),(461),(473)",
        "tree": "1,164,165,461,473"
    },
    {
        "id": 475,
        "name": "上饶",
        "pid": 474,
        "level": 4,
        "parent_tree": "(1),(164),(165),(474),(475)",
        "tree": "1,164,165,474,475"
    },
    {
        "id": 476,
        "name": "磐安",
        "pid": 461,
        "level": 4,
        "parent_tree": "(1),(164),(165),(461),(476)",
        "tree": "1,164,165,461,476"
    },
    {
        "id": 477,
        "name": "邢台",
        "pid": 456,
        "level": 4,
        "parent_tree": "(1),(164),(165),(456),(477)",
        "tree": "1,164,165,456,477"
    },
    {
        "id": 478,
        "name": "杭州",
        "pid": 461,
        "level": 4,
        "parent_tree": "(1),(164),(165),(461),(478)",
        "tree": "1,164,165,461,478"
    },
    {
        "id": 479,
        "name": "衡水",
        "pid": 456,
        "level": 4,
        "parent_tree": "(1),(164),(165),(456),(479)",
        "tree": "1,164,165,456,479"
    },
    {
        "id": 480,
        "name": "石家庄",
        "pid": 456,
        "level": 4,
        "parent_tree": "(1),(164),(165),(456),(480)",
        "tree": "1,164,165,456,480"
    },
    {
        "id": 481,
        "name": "秦皇岛",
        "pid": 456,
        "level": 4,
        "parent_tree": "(1),(164),(165),(456),(481)",
        "tree": "1,164,165,456,481"
    },
    {
        "id": 810,
        "name": "2021/11/11-436套设备1台",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(810)",
        "tree": "1,164,694,863,810"
    },
    {
        "id": 825,
        "name": "2022/3/18-436套设备",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(825)",
        "tree": "1,164,694,863,825"
    },
    {
        "id": 851,
        "name": "江苏泰州",
        "pid": 850,
        "level": 4,
        "parent_tree": "(1),(9),(650),(850),(851)",
        "tree": "1,9,650,850,851"
    },
    {
        "id": 853,
        "name": "GQSP",
        "pid": 852,
        "level": 4,
        "parent_tree": "(1),(164),(694),(852),(853)",
        "tree": "1,164,694,852,853"
    },
    {
        "id": 861,
        "name": "湖北输检",
        "pid": 850,
        "level": 4,
        "parent_tree": "(1),(9),(650),(850),(861)",
        "tree": "1,9,650,850,861"
    },
    {
        "id": 868,
        "name": "20220903",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(868)",
        "tree": "1,164,694,863,868"
    },
    {
        "id": 869,
        "name": "20220915",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(869)",
        "tree": "1,164,694,863,869"
    },
    {
        "id": 874,
        "name": "20221010",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(874)",
        "tree": "1,164,694,863,874"
    },
    {
        "id": 876,
        "name": "20221011",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(876)",
        "tree": "1,164,694,863,876"
    },
    {
        "id": 879,
        "name": "20221121",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(879)",
        "tree": "1,164,694,863,879"
    },
    {
        "id": 880,
        "name": "20221126",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(880)",
        "tree": "1,164,694,863,880"
    },
    {
        "id": 881,
        "name": "202212-常州10pc",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(881)",
        "tree": "1,164,694,863,881"
    },
    {
        "id": 883,
        "name": "202212月份 5套436的设备",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(883)",
        "tree": "1,164,694,863,883"
    },
    {
        "id": 884,
        "name": "20221228",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(884)",
        "tree": "1,164,694,863,884"
    },
    {
        "id": 885,
        "name": "20230103一台436设备",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(885)",
        "tree": "1,164,694,863,885"
    },
    {
        "id": 886,
        "name": "20230106-10台长沙设备",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(886)",
        "tree": "1,164,694,863,886"
    },
    {
        "id": 889,
        "name": "20230109-436套7pc",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(889)",
        "tree": "1,164,694,863,889"
    },
    {
        "id": 890,
        "name": "20230203-怀化",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(890)",
        "tree": "1,164,694,863,890"
    },
    {
        "id": 891,
        "name": "20230222-怀化",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(891)",
        "tree": "1,164,694,863,891"
    },
    {
        "id": 896,
        "name": "杭州演示",
        "pid": 850,
        "level": 4,
        "parent_tree": "(1),(9),(650),(850),(896)",
        "tree": "1,9,650,850,896"
    },
    {
        "id": 902,
        "name": "20230421-衡阳4台",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(902)",
        "tree": "1,164,694,863,902"
    },
    {
        "id": 904,
        "name": "20230505-10台436套",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(904)",
        "tree": "1,164,694,863,904"
    },
    {
        "id": 905,
        "name": "不发",
        "pid": 863,
        "level": 4,
        "parent_tree": "(1),(164),(694),(863),(905)",
        "tree": "1,164,694,863,905"
    }
];

var list = [
	{ id: 1, pid: 0, name: 'node1' },
	{ id: 2, pid: 0, name: 'node2' },
	{ id: 3, pid: 1, name: 'node3' },
	{ id: 4, pid: 1, name: 'node4' },
	{ id: 5, pid: 2, name: 'node5' },
	{ id: 6, pid: 2, name: 'node6' },
	{ id: 7, pid: 3, name: 'node7' },
	{ id: 8, pid: 3, name: 'node8' }
];

function getJsonObj(json, pid) {
	for (var i = 0; i < json.length; i++) {
		var dr = json[i],
			id = dr.data.id;

		if (id === pid) {
			return dr;
		} else if (dr.childs && dr.childs.length > 0) {
			return getJsonObj(dr.childs, pid);
		}
	}
	return null;
}

function buildJsonData(list) {
	var json = [], level = 0;
	var nodes = [];

	for (var i = 0; i < list.length; i++) {
		var dr = list[i];
		console.log('i:', i, dr);

		if (!dr.pid) {
			var node = {
				level: level++,
				id: dr.id,
				data: dr,
				childs: []
			};
			json.push(node);
			nodes.push(node);
		} else {
			var pnode = getJsonObj(json, dr.pid);
			if (pnode) {
			console.log('pnode:', pnode.id, pnode.level);
				var node = {
					level: pnode.level + 1,
					id: dr.id,
					data: dr,
					childs: []
				};
				pnode.childs.push(node);
			}
			//pnode.childs.push(node);
		}
	}
	return json;
}

console.log(buildJsonData(list));