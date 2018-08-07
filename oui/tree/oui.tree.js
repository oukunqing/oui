

!function($) {
    'use strict';

    var ID_PREFIX = {
        NODE: 'node_'
    },
        Tree_Index = 1,
        Data_Store = {},
        buildId = function(id, prefix) {
            return ($.isUndefined(prefix) ? ID_PREFIX[prefix] : ID_PREFIX.NODE) + id
        },
        buildKey = function(id) {
            return 'k_' + id;
        },
        buildDatas = function(datas) {
            return $.isArray(datas) ? datas : $.isObject(datas) ? [datas] : [];
        },
        checkData = function(data) {
            if ($.isObject(data)) {
                return ($.isString(data.id) || $.isNumber(data.id)) &&
                    ($.isString(data.pid) || $.isNumber(data.pid));
            }
            return false;
        },
        createNode = function(node, element){
            $.createElement('li', '', function(elem){
                elem.innerHTML = node.text;
            }, element);
        },
        callback = function(func, that, value) {
            $.isFunction(func) && func(that, value);
        };


    function Tree(options, datas, func) {
        if ($.isString(options, true) || $.isElement(options)) {
            options = { element: options };
        }
        var that = this, op = $.extend({
            parent: $.doc.body,
            element: ''

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
        if(op.element !== null){
            op.parent = op.element.parentNode;
        } else {
            return false;
        }

        that.id = Tree_Index++;
        that.options = op;
        that.element = op.element;
        that.nodes = new Nodes();
        //数据存储
        that.store = [];

        that.initial(datas, func);

        console.log('element: ', op.element);
    }

    Tree.prototype = {
        initial: function(datas, func) {
            this.root = $.createElement('ul', '', function(elem){
                elem.id = '1';
            }, this.options.element);
        },
        add: function(datas, func) {
            datas = buildDatas(datas);

            for(var i=0; i<datas.length; i++){
                this.store.push(datas[i]);

                var node = new Node(datas[i], this);
                this.nodes.add(node);

                //createNode.call(this, node, this.root);
            }
            return callback(func, this), this;
        },
        move: function(id, action, targetId) {

        },
        expandParent: function(id, func) {

            return callback(func, this), this;
        },
        get: function(ids, func) {
            var nodes = new Nodes();

            return callback(func, this, nodes), nodes;
        },
        remove: function(ids, func) {

            return callback(func, this), this;
        },
        show: function(ids, func) {

            return callback(func, this), this;
        },
        hide: function(ids, func) {

            return callback(func, this), this;
        },
        toggle: function(ids, collapse, func) {

            return callback(func, this), this;
        },
        expand: function(ids, func) {
            return this.toggle(ids, false, func);
        },
        collapse: function(ids, func) {
            return this.toggle(ids, true, func);
        },
        toggleLevel: function(level, collapse, func) {

            return callback(func, this), this;
        },
        expandLevel: function(level, func) {
            return this.toggleLevel(level, false, func);
        },
        collapseLevel: function(level, func) {
            return this.toggleLevel(level, true, func);
        }
    };

    function Node(data, tree) {
        var that = this;
        $.extend(that, {
            id: '',
            pid: '',
            text: '',
            name: '',
            title: '',
            class: '',
            prefix: '',
            postfix: '',

        }, data);

        that.childs = [];
        that.parent = null;
        that.expand = true;

        this.initial(data, tree);
    }

    Node.prototype = {
        initial: function(data, tree) {

        }
    };


    function Nodes() {
        this.keys = {};
        this.nodes = {};
        this.length = 0;
    }

    Nodes.prototype = {
        key: function(id) {
            return 'N_' + id;
        },
        each: function(func) {
            var i = 0;
            for (var key in this.nodes) {
                func(i++, key, this.nodes[key]);
            }
            return this;
        },
        container: function(node) {
            var key = this.key(node.id);
            return !$.isUndefined(this.nodes[key])
        },
        add: function(node) {
            if (!this.container(node)) {
                var key = this.key(node.id);
                this.keys[key] = node.id;
                this.nodes[key] = node;
                this.length += 1;
            }
            return this;
        },
        remove: function(node) {
            if (this.container(node)) {
                var key = this.key(node.id);
                delete this.keys[key];
                delete this.nodes[key];
                this.length -= 1;
            }
            return this;
        }
    };

    $.extend($, { Tree: Tree });
}(OUI);