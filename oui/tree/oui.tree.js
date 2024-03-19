
/*
	@Title: OUI
	@Description：JS通用代码库
	@Author: oukunqing
	@License：MIT

	$.tree 树形菜单
*/

!function ($) {
	var SelfPath = $.getScriptSelfPath(true);

	var Config = {
		FilePath: SelfPath,
		FileDir: $.getFilePath(SelfPath),
		IdPrefix: 'oui_tree_id_',
		NodePrefix: 'oui_tree_node_'
	},
	Cache = {

	},
	Factory = {
		buildTree: (id, par) {

		}
	};

	//先加载样式文件
	Factory.loadCss();

	function Node() {

	}

	Node.prototype = {

	};

	function Tree() {

	}

	Tree.prototype = {

	};

	$.extend({
		tree: function (id, par) {
			return Factory.buildTree(id, par);
		}
	});

}(OUI);