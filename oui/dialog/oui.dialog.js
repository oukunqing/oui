
!function($){

    var thisFilePath = $.getScriptSelfPath(true);
    //先加载样式文件
    $.loadLinkStyle($.getFilePath(thisFilePath) + $.getFileName(thisFilePath, true).replace('.min', '') + '.css');

    function MyDialog(content, options){
        this.id = 1;
        this.options = options;
        this.docOverflow();
        this.controls = {
            shade: null, container: null, box: null, top: null, title: null, body: null, content: null, bottom: null
        };
        this.buttons = {
            ok: null, cancel: null, close: null, min: null, max: null
        };
        this.isMin = false;
        this.isMax = false;
        this.initial(content);
    }

    MyDialog.prototype = {
        docOverflow: function (close) {
            if(close) {
                if(this._overflow !== 'hidden') {
                    $.doc.body.style.overflow = this._overflow;
                }
            } else {
                var overflow = $.doc.body.style.overflow;
                if(overflow !== 'hidden') {
                    $.doc.body.style.overflow ='hidden';
                    this._overflow = overflow;
                }
            }
        },
        initial: function(content, options){
            this.build(content, options);
        },
        build: function(content, options){
            var _ = this;
            var _ctls = this.controls;
            //遮罩层
            _ctls.shade = $.doc.createElement('div');
            _ctls.shade.className = 'oui-dialog-shade';

            //对话框容器
            _ctls.container = $.doc.createElement('div');
            _ctls.container.className = 'oui-dialog-container';

            $.addEventListener(_ctls.container, 'dblclick', function() {
                _.close();
            });

            document.onkeyup = function(e){
                if(27 === $.getKeyCode(e)) { //esc
                    _.close();
                }
            };
            /*
            document.onkeypress = function(e) {
                console.log('onkeypress:', $.getKeyCode(e));
            }
            */

            //对话框
            _ctls.box = $.doc.createElement('div');
            _ctls.box.className = 'oui-dialog';

            _ctls.top = this.buildTop();
            _ctls.box.appendChild(_ctls.top);

            _ctls.body = this.buildBody(content);
            _ctls.box.appendChild(_ctls.body);
            
            _ctls.bottom = this.buildBottom();
            _ctls.box.appendChild(_ctls.bottom);

            _ctls.box.appendChild(this.buildSwitch('top'));
            _ctls.box.appendChild(this.buildSwitch('bottom'));
            _ctls.box.appendChild(this.buildSwitch('left'));
            _ctls.box.appendChild(this.buildSwitch('right'));
            _ctls.box.appendChild(this.buildSwitch('top-left'));
            _ctls.box.appendChild(this.buildSwitch('top-right'));
            _ctls.box.appendChild(this.buildSwitch('bottom-left'));
            _ctls.box.appendChild(this.buildSwitch('bottom-right'));

            _ctls.container.appendChild(_ctls.box);

            $.doc.body.appendChild(_ctls.shade);
            $.doc.body.appendChild(_ctls.container);
        },
        buildTop: function(str){
            var _ = this;
            var div = $.doc.createElement('div');
            div.className = 'top';

            $.addEventListener(div, 'dblclick', function() {
                _.max();
            });

            $.addEventListener(div, 'mousedown', function() {

            });

            var title = $.doc.createElement('div');
            title.className = 'title';
            title.innerHTML =  str || '标题';
            div.appendChild(title);

            this.controls.title = title;

            var btn = $.doc.createElement('div');
            btn.className = 'dialog-btn-panel';
            btn.innerHTML = '<a class="btn btn-min">最小化</a>'
                + '<a class="btn btn-max">最大化</a>'
                + '<a class="btn btn-close">×</a>';
            btn.style.cssText = 'float:right;';
            div.appendChild(btn);

            this.setEvent(btn.childNodes, 'click', false);

            return div;
        },
        buildBody: function(content) {
            var div = $.doc.createElement('div');
            div.className = 'body';

            var con = $.doc.createElement('div');
            con.className = 'content';
            con.innerHTML = content;

            this.controls.content = con;

            div.appendChild(con);

            return div;
        },
        buildBottom: function(type) {
            var div = $.doc.createElement('div');
            div.className = 'bottom';

            var html = '<a class="btn btn-ok btn-mr" href="javascript:void(0);" shortcutKey="Y">\u786e\u5b9a</a>'
                + '<a class="btn btn-cancel btn-ml" href="javascript:void(0);" shortcutKey="N">\u53d6\u6d88</a>';

            div.innerHTML = html;

            this.setEvent(div.childNodes, 'click', true);

            return div;
        },
        buildSwitch: function(dir) {
            var div = $.doc.createElement('div');
            div.className = 'border-switch';
            $.addClass(div, (dir || 'bottom-right') + '-switch');
            return div;
        },
        showSwitch: function() {
            $('.border-switch').each(function(){
                $(this).show();
            });
        },
        hideSwitch: function() {
            $('.border-switch').each(function(i, obj, args){
                $(this).hide();
            });
        },
        show: function (content){
            console.log('show: ' + content);


        },
        update: function(content){
            this.body.innerHTML = content;

            console.log('update: ' + content);
        },
        check: function(obj) {
            var parent = obj.parentNode;
            while(parent !== null) {
                if(parent == this.controls.box) {
                    return true;
                }
                parent = parent.parentNode;
            }
            return false;
        },
        setEvent: function(controls, eventName, keypress) {
            var _ = this;
            for(var i = 0; i < controls.length; i++) {
                var obj = controls[i];
                if(obj.tagName === 'A') {
                    $.addEventListener(obj, eventName || 'click', function() {
                        _.action(this);
                    });

                    if(keypress) {
                        $.addEventListener(obj, 'keypress', function(e){
                            var keyCode = $.getKeyCode(e);
                            var strKeyCode = String.fromCharCode(keyCode).toUpperCase();
                            var shortcutKey = this.getAttribute('shortcutKey') || '';
                            //if(32 == keyCode || (shkey >= 3 && strKeyCode == cg.shortcutKey[2].toUpperCase())){FuncCancel();}
                            // 判断是否为空格键 或 是否按下快捷键
                            if(32 === keyCode || strKeyCode === shortcutKey) {
                                _.action(this);
                            }
                        });
                    }
                }
            }
        },
        action: function(obj) {
            var _ = this, css = '';
            if(typeof obj === 'string') {
                css = obj;
            } else {
                if(!_.check(obj)) {
                    return false;
                }
                css = obj.className;
            }
            if(css.indexOf('close') >= 0 || css.indexOf('cancel') >= 0) {
                _.close();
            } else if(css.indexOf('min') >= 0) {
                _.min();
            } else if(css.indexOf('max') >= 0) {
                _.max();
            } else {
                _.close();
            }
        },
        focus: function(obj) {
            obj.focus();
        },
        close: function() {
            console.log('dialog close');
            $.doc.body.removeChild(this.controls.container);
            $.doc.body.removeChild(this.controls.shade);

            this.docOverflow(true);

            $.Dialog.remove(this.id);        
        },
        min: function() {
            console.log('dialog min');
            $.addClass(this.controls.box, 'oui-dialog-min');
            $.addClass(this.controls.bottom, 'dialog-display-none');

            this.isMin = true;

            this.hideSwitch();
        },
        max: function() {
            var _ = this;
            console.log('dialog max');
            var css = _.controls.box.className.trim();

            if(this.isMin) {
                this.isMax = !this.isMax;
                $.removeClass(_.controls.box, 'oui-dialog-min');
                $.removeClass(_.controls.bottom, 'dialog-display-none');
            }

            if(this.isMax) {
                this.showSwitch();

                $.removeClass(_.controls.box, 'oui-dialog-max');
                $.removeClass(_.controls.container, 'dialog-overflow-hidden');

                if(_.controls.body.hasHeight) {
                    if(_.controls.body.oldHeight) {
                        _.controls.body.style.height = _.controls.body.oldHeight + 'px';
                    }
                } else {
                    _.controls.body.style['height'] = null;
                }
                this.isMax = false;
            } else {
                this.hideSwitch();

                var bs = $.getBodySize();
                var topHeight = _.controls.top ? _.controls.top.offsetHeight + 1 : 0, 
                    bottomHeight = _.controls.bottom ? _.controls.bottom.offsetHeight + 1 : 0;

                _.controls.body.oldHeight = _.controls.body.offsetHeight;

                _.controls.body.hasHeight = _.controls.body.style.height || 0;
                _.controls.body.style.height = (bs.height - topHeight - bottomHeight) + 'px';

                $.addClass(_.controls.box, 'oui-dialog-max');
                $.addClass(_.controls.container, 'dialog-overflow-hidden');

                this.isMax = true;
            }
            this.isMin = false;
        },
        setSize: function() {

        },
        setPosition: function() {

        },
        setContent: function() {

        }
    };

    var DialogType = {

    };

    function Dialog(){
        this.DialogCache = {};
    }

    Dialog.prototype = {
        get: function(id) {
            if(typeof this.DialogCache[id] !== 'undefined') {
                return this.DialogCache[id];
            }
            return null;
        },
        set: function(id, dialog) {
            if(typeof this.DialogCache[id] !== 'undefined') {
                this.DialogCache[id] = null;
            }
            this.DialogCache[id] = dialog;

            console.log('DialogCache: ', this.DialogCache);
            return dialog;
        },
        show: function(content, options) {
            var id = 1;
            var d = this.get(id);

            if(d === null) {
                d = this.set(id, new MyDialog(content, options));
                d.show(content);
            } else {
                d.update(content);
            }

            return d;
        },
        remove: function(id) {
            if(typeof this.DialogCache[id] !== 'undefined') {
                this.DialogCache[id] = null;
            }
        }
    };

    $.Dialog = new Dialog();

    $.extend({
        alert: function(content, options){
            return $.Dialog.show(content, options);
        },
        confirm: function(content, options){

        },
        msg: function(content){

        },
        tips: function(content){

        },
        tooltip: function(content){

        }
    });
}(OUI);