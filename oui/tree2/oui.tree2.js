

!function ($) {
    'use strict';

    var doc = document,
        head = document.getElementsByTagName('head')[0],
        thisFilePath = $.getScriptSelfPath(true),
        ID_PREFIX = {
            ROOT: 'oui_tree_root_',
            NODE: 'oui_tree_node_',
            BOX: 'oui_tree_box_'
        },
        Tree_Index = 1,
        Data_Store = {},
        buildId = function (that, id, prefix) {
            return (prefix ? ID_PREFIX[prefix] : ID_PREFIX.NODE) + that.id + (id ? '_' + id : '');
        },
        buildKey = function (id) {
            return 'k_' + id;
        },
        buildDatas = function (datas) {
            return $.isArray(datas) ? datas : $.isObject(datas) ? [datas] : [];
        },
        checkData = function (data) {
            if ($.isObject(data)) {
                return ($.isString(data.id) || $.isNumber(data.id)) &&
                    ($.isString(data.pid) || $.isNumber(data.pid));
            }
            return false;
        },
        createBox = function(that, nodes){

        },
        createNode = function (that, nodes, pnode) {
            if(pnode instanceof Node){
                return createChildNode(that, nodes, pnode);
            }

            for(var i=0, c=nodes.length; i<c; i++){
                var node = nodes[i];
                var elem = node.setElement();

                if(node.childs.length > 0){
                    createNode(that, node.childs);
                }
            }
        },
        createChildNode = function(that, nodes, pnode) {
            if(!pnode instanceof Node){
                return false;
            }
            var frag = doc.createDocumentFragment();
            for(var i=0, c=nodes.length; i<c; i++){
                var node = nodes[i];
                var elem = node.setElement(frag);
            }
            var container = pnode.getContainer();
            //$.setStyle(container, 'display', 'none');
            container.appendChild(frag);
        },
        callback = function (func, that, value) {
            $.isFunction(func) && func(that, value);
        };


    function Tree(options, datas, func) {
        $.loadLinkStyle($.getFilePath(thisFilePath) + $.getFileName(thisFilePath, true).replace('.min', '') + '.css');

        if ($.isString(options, true) || $.isElement(options)) {
            options = { element: options };
        }
        var that = this, op = $.extend({
            id: '',
            element: '',
            parent: $.doc.body,

        }, options);

        if (!$.isElement(op.element, 'UL')) {
            if ($.isString(op.element)) {
                op.element = $I(op.element);
            }
            if (op.element === null) {
                op.element = $.doc.createElement('UL');
                op.parent.appendChild(op.element);
            }
        }
        if (op.element !== null) {
            op.parent = op.element.parentNode;
        } else {
            return false;
        }

        that.id = op.id || ('otree' + Tree_Index++);
        that.options = op;
        that.element = op.element;

        //数据存储
        that.store = new Store(that);

        that.initial(datas, func);
    }

    Tree.prototype = {
        initial: function (datas, func) {
            this.root = $.createElement('ul', buildId(this, '', 'ROOT'), function (elem) {
                elem.className = 'oui-tree';
            }, this.options.element);

            console.log('this.root: ', this.root)
        },
        add: function (datas, pid, func) {
            if($.isFunction(pid)) {
                func = pid;
                pid = null;
            }
            datas = buildDatas(datas);

            var nodes = [], pnode = this.store.get(pid);
            for (var i = 0; i < datas.length; i++) {
                var data = datas[i];
                var node = this.store.add(data);
                if(node !== null){
                    nodes.push(node);
                }
            }

            //升序排列节点
            nodes.sort(function(a, b){
                if(a.level === b.level){
                    return a.pid === b.pid ? a.id - b.id : a.pid - b.pid;
                } else {
                    return a.level - b.level;
                }
            });

            createNode(this, nodes, pnode);

            return callback(func, this), this;
        },
        move: function (id, action, targetId) {

        },
        expandParent: function (id, func) {

            return callback(func, this), this;
        },
        get: function (ids, func) {
            var nodes = new Nodes();

            return callback(func, this, nodes), nodes;
        },
        remove: function (ids, func) {

            return callback(func, this), this;
        },
        show: function (ids, func) {

            return callback(func, this), this;
        },
        hide: function (ids, func) {

            return callback(func, this), this;
        },
        toggle: function (ids, collapse, func) {

            return callback(func, this), this;
        },
        expand: function (ids, func) {
            return this.toggle(ids, false, func);
        },
        collapse: function (ids, func) {
            return this.toggle(ids, true, func);
        },
        toggleLevel: function (level, collapse, func) {

            return callback(func, this), this;
        },
        expandLevel: function (level, func) {
            return this.toggleLevel(level, false, func);
        },
        collapseLevel: function (level, func) {
            return this.toggleLevel(level, true, func);
        }
    };

    function Node(data, tree) {
        var that = this;
        $.extend(that, {
            id: '',
            pid: '',
            level: 0,
            text: '',
            name: '',
            title: '',
            class: '',
            prefix: '',
            postfix: '',

        }, data);

        that.tree = tree;

        that.keys = {};
        that.childs = [];
        that.parent = null;
        that.expand = true;

        this.initial(data, tree);
    }

    Node.prototype = {
        initial: function (data) {

        },
        setParent: function(node){
            return this.parent = node, this;
        },
        setLevel: function(level){
            return this.level = level, this;
        },
        addChild: function(node){
            var key = 'N_' + node.id;
            if(!this.keys[key]){
                this.keys[key] = 1;
                this.childs.push(node);
            }
            return this;
        },
        removeChild: function(node, removeElement){
            var key = 'N_' + node.id;
            if(this.keys[key]){
                var idx = this.keys.indexOf(key);
                this.childs.splice(idx, 1);
                delete this.keys[key];
            }
            return this;
        },
        setElement: function(frag) {
            var that = this, parentNode = frag;
            if(!parentNode){
                parentNode = that.getContainer(that.parent) || that.tree.root;
            }
            return $.createElement('li', buildId(that.tree, that.id, 'NODE'), function (elem) {
                elem.className = 'node level' + that.level;
                elem.innerHTML = that.text;
            }, parentNode, frag !== undefined);
        },
        getElement: function(node) {
            if(node === null){
                return null;
            }
            return $I(buildId(this.tree, (node || this).id, 'NODE'));
        },
        getContainer: function(node) {
            if(node === null){
                return null;
            }
            var id = buildId(this.tree, (node || this).id, 'BOX');
            return $I(id) || $.createElement('ul', id, function (elem) {

            }, this.getElement(node));
        },
        removeElement: function(){

        }
    };


    function Store(tree) {
        this.tree = tree;

        this.keys = {};
        this.nodes = {};
        this.length = 0;
    }

    Store.prototype = {
        each: function (func) {
            var i = 0;
            for (var key in this.nodes) {
                func(i++, key, this.nodes[key]);
            }
            return this;
        },
        container: function (id) {
            var key = buildKey(id);
            return !$.isUndefined(this.nodes[key]);
        },
        get: function(id){
            var key = buildKey(id);
            return this.nodes[key] || null;
        },
        add: function (data) {
            var id = data.id, node = null;
            if (!this.container(id)) {
                var key = buildKey(id);
                this.keys[key] = id;
                node = new Node(data, this.tree);
                var pnode = this.get(data.pid);
                if(pnode !== null){
                    node.setParent(pnode).setLevel(pnode.level + 1);
                    pnode.addChild(node);
                } else {
                    node.level = 0;
                }
                this.nodes[key] = node;
                this.length += 1;
            }
            return node;
        },
        remove: function (node) {
            if (this.container(node)) {
                var key = buildKey(node.id);
                delete this.keys[key];
                delete this.nodes[key];
                this.length -= 1;
            }
            return this;
        }
    };

    $.extend($, { Tree: Tree });
}(OUI);