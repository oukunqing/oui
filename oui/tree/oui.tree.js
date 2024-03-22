
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
		checkOptions: function (options) {
			var opt = $.extend({}, options);

			return opt;
		},
		buildId: function(id, type) {
			return 'oui-tree-' + type + '-' + id;
		},
		buildTree: (id, par) {

		}
	};

	//先加载样式文件
	Factory.loadCss();

	function Node(par) {
		this.initial(par);
	}

	Node.prototype = {
		initial: function(par) {
			var that = this;
			that.elem = par.elem || par.li;
			that.box = par.box || par.ul;

			that.data = par.data;
			that.type = par.type;
			that.id = par.id;

			return that;
		}
	};

	function Tree(id, options) {
		if ($.isObject(id) && $.isUndefined(options)) {
			options = id;
			id = null;			
		}
		var opt = $.extend({}, options, id ? {id: id} : null);

		this.id = opt.id;
		this.initial(opt);
	}

	Tree.prototype = {
		initial: function (options) {
			var that = this,
				opt = Factory.checkOptions($.extend({
					items: [],
					callback: function () {

					}
				}, options));

			that.cache = {
				nodes: [],

			};

			$.createElement('DIV', Factory.buildId(that.id, 'box'), function(elem) {
				that.treebox = elem;

			});

			return that;
		},
		clear: function () {
			var that = this;

			return that;
		}
	};

	$.extend({
		tree: function (treeId, par) {
			return Factory.buildTree(id, par);
		}
	});

	$.extend($.tree, {
		add: function (treeId, items, type) {

		},
		update: function (treeId, items, type) {

		},
		select: function (treeId, items, type) {

		},
		focus: function (treeId, id, type) {

		},
		get: function (treeId) {

		}
	})

}(OUI);