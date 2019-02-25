
!function($){

    var KEY_CODE = {
        Enter: 13,
        Esc: 27,
        Space: 32
    };

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
                    document.body.style.overflow = this._overflow;
                }
            } else {
                var overflow = document.body.style.overflow;
                if(overflow !== 'hidden') {
                    document.body.style.overflow ='hidden';
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
            _ctls.shade = document.createElement('div');
            _ctls.shade.className = 'oui-dialog-shade';

            //对话框容器
            _ctls.container = document.createElement('div');
            _ctls.container.className = 'oui-dialog-container';

            $.addEventListener(_ctls.container, 'dblclick', function() {
                _.close();
            });

            document.onkeyup = function(e){
                if(KEY_CODE.Esc === $.getKeyCode(e)) {
                    _.close();
                }
            };
            /*
            document.onkeypress = function(e) {
                console.log('onkeypress:', $.getKeyCode(e));
            }
            */

            //对话框
            _ctls.box = document.createElement('div');
            _ctls.box.className = 'oui-dialog';

            _ctls.box.cache = {};

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

            document.body.appendChild(_ctls.shade);

            if(_ctls.container !== null) {
                _ctls.container.appendChild(_ctls.box);
                document.body.appendChild(_ctls.container);
            } else {
                $.addClass(_ctls.box, 'oui-dialog-fixed');
                document.body.appendChild(_ctls.box);
            }

            this.dragPosition();

            this.dragSize();

            //this.setPosition(3);
        },
        buildTop: function(str){
            var _ = this;
            var div = document.createElement('div');
            div.className = 'top';

            $.addEventListener(div, 'dblclick', function() {
                _.max();
                $.cancelBubble();
            });

            $.addEventListener(div, 'mousedown', function() {

            });

            var title = document.createElement('div');
            title.className = 'title';
            title.innerHTML =  str || '标题';
            div.appendChild(title);

            this.controls.title = title;

            var btn = document.createElement('div');
            btn.className = 'dialog-btn-panel';
            btn.innerHTML = '<a class="btn btn-min">小</a>'
                + '<a class="btn btn-max">大</a>'
                + '<a class="btn btn-close">关</a>';
            btn.style.cssText = 'float:right;';
            div.appendChild(btn);

            this.setEvent(btn.childNodes, 'click', false);

            return div;
        },
        buildBody: function(content) {
            var div = document.createElement('div');
            div.className = 'body';

            var con = document.createElement('div');
            con.className = 'content';
            con.innerHTML = content;

            this.controls.content = con;

            div.appendChild(con);

            return div;
        },
        buildBottom: function(type) {
            var div = document.createElement('div');
            div.className = 'bottom';

            var html = '<a class="btn btn-ok btn-primary btn-mr" href="javascript:void(0);" shortcutKey="Y">\u786e\u5b9a</a>'
                + '<a class="btn btn-cancel btn-default btn-ml" href="javascript:void(0);" shortcutKey="N">\u53d6\u6d88</a>';

            div.innerHTML = html;

            this.setEvent(div.childNodes, 'click', true);

            this.setShortcutKeyEvent(div.childNodes);

            return div;
        },
        buildSwitch: function(dir) {
            var div = document.createElement('div');
            div.className = 'border-switch';
            div.pos = dir;
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
            if(!$.isElement(obj)) {
                return false;
            }
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
                if(obj.tagName !== 'A') {
                    continue;
                }
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
                        if(KEY_CODE.Space === keyCode || strKeyCode === shortcutKey) {
                            _.action(this);
                        }
                    });
                }
            }
        },
        setShortcutKeyEvent: function(controls) {
            var _ = this;
            _.dic = {};
            for(var i = 0; i < controls.length; i++) {
                var obj = controls[i];
                if(obj.tagName !== 'A') {
                    continue;
                }
                var shortcutKey = obj.getAttribute('shortcutKey') || '';
                if(shortcutKey) {
                    _.dic[shortcutKey] = obj;
                }
            }

            $.addEventListener(document, 'keypress', function(e){
                if(!e.shiftKey) {
                    return false;
                }
                var keyCode = $.getKeyCode(e);
                var strKeyCode = String.fromCharCode(keyCode).toUpperCase();
                var btn = _.dic[strKeyCode];

                if($.isElement(btn)) {
                    _.action(btn);
                }
            });
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
            var _ = this, _ctls = this.controls;
            if(_ctls.container) {
                //$.removeChild(document.body, _ctls.container);
                document.body.removeChild(_ctls.container);
            } else {
                document.body.removeChild(_ctls.box);
            }
            if(_ctls.shade) {
                document.body.removeChild(_ctls.shade);
            }

            this.docOverflow(true);

            $.Dialog.remove(this.id);        
        },
        min: function() {
            console.log('dialog min');
            $.addClass(this.controls.box, 'oui-dialog-min');
            $.addClass(this.controls.bottom, 'display-none');

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
                $.removeClass(_.controls.bottom, 'display-none');
            }

            if(this.isMax) {
                this.showSwitch();

                $.removeClass(_.controls.box, 'oui-dialog-max');

                if(_.controls.container) {
                    $.removeClass(_.controls.container, 'dialog-overflow-hidden');
                }

                // 从最大化窗口返回常规尺寸，重新设置dialog body尺寸
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

                if(_.controls.container) {
                    $.addClass(_.controls.container, 'dialog-overflow-hidden');
                }

                this.isMax = true;
            }
            this.isMin = false;
        },
        setSize: function() {
            var _ = this;
            var boxH = _.controls.box.offsetHeight;

            var topHeight = _.controls.top ? _.controls.top.offsetHeight + 1 : 0, 
                bottomHeight = _.controls.bottom ? _.controls.bottom.offsetHeight + 1 : 0;

            _.controls.body.style.height = (boxH - topHeight - bottomHeight) + 'px';
        },
        setPosition: function(pos) {
            var _ = this, _ctls = this.controls;

            $.addClass(_ctls.box, 'oui-dialog-pos');

            switch(pos) {
                case 1:
                    _ctls.box.style.left = '0px';
                    break;
                case 2:
                    $.addClass(_ctls.box, 'dialog-margin-center');
                    break;
                case 3:
                    _ctls.box.style.right = '0px';
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    break;
                case 7:
                    _ctls.box.style.bottom = '0px';
                    break;
                case 8:
                    break;
                case 9:
                    break;
                case 10:
                    break;
            }
        },
        setContent: function() {

        },
        dragPosition: function () {
            var _ = this,
                bodySize = $.getBodySize(),
                clientWidth = bodySize.width,
                clientHeight = bodySize.height,
                moveX = 0,
                moveY = 0,
                moveTop = 0,
                moveLeft = 0,
                moveAble = false,
                docMouseMoveEvent = document.onmousemove,
                docMouseUpEvent = document.onmouseup;

            function moveDialog() {
                var evt = $.getEvent();

                var cp = $.getScrollPosition();
                var posX = posXOld = evt.clientX;
                var posY = posYOld = evt.clientY;
                moveAble = true;
                moveX = evt.clientX;
                moveY = evt.clientY;
                
                moveTop = parseInt(_.controls.box.offsetTop, 10);
                moveLeft = parseInt(_.controls.box.offsetLeft, 10);

                document.onmousemove = function(){
                    if(!moveAble) {
                        return false;
                    }
                    var evt = $.getEvent();
                    var x = moveLeft + evt.clientX - moveX,
                        y = moveTop + evt.clientY - moveY;
                    var w = _.controls.box.offsetWidth,
                        h = _.controls.box.offsetHeight;

                    posX = x;
                    posY = y;

                    _.controls.box.style.left = posX + 'px';
                    _.controls.box.style.top = posY + 'px';

                    console.log('mousemove: ', evt.clientX, evt.clientY, moveTop, moveLeft, x, y);
                    /*
                    _.pwMask.style.display = popwin.isIE6 || !cg.dragMask ? 'none' : 'block';
                    if(moveAble) {
                        var evt = GetEvent();
                        var x = moveLeft + evt.clientX - moveX;
                        var y = moveTop + evt.clientY - moveY;
                        var w = popwin.isIE6 || !cg.dragMask ? parseInt(_.pwBox.style.width, 10) + 2 : parseInt(_.pwMask.style.width, 10);
                        var h = popwin.isIE6 || !cg.dragMask ? parseInt(_.pwBox.style.height, 10) + 2 : parseInt(_.pwMask.style.height, 10);
                        if(cg.dragRangeLimit){ //窗体在当前页面范围(浏览器屏幕范围)内拖动
                            if(popwin.isIE6){ //IE6浏览器特殊处理
                                var lc = '' + cg.position == '5';
                                var w2 = lc ? w/2 : w;
                                var h2 = lc ? h/2 : h;
                                posX = x <= 0 || (lc && x-w2 <= 0)? (lc ? w2 : 0) : ((x + w2) > clientWidth ? clientWidth - w2: x);
                                posY = y <= 0 ? 0 : ((y + h2) > clientHeight ? clientHeight - h2: y);
                            }
                            else{
                                posX = x <= 0 ? 0 : ((x + w) > clientWidth ? clientWidth - w: x);
                                posY = y <= 0 ? 0 : ((y + h) > clientHeight ? clientHeight - h: y);
                            }
                        } else {
                            posX = x;
                            posY = y;
                        }
                        if(popwin.isIE6 || !cg.dragMask){
                            _.pwBox.style.left = posX + 'px';
                            _.pwBox.style.top = posY + 'px';
                        } else {
                            _.pwMask.style.left = (posX + cp.left) + 'px';
                            _.pwMask.style.top = (posY + cp.top) + 'px';
                        }

                        if(Math.abs(evt.clientX - moveX) >= cg.dragAnchor || Math.abs(evt.clientY - moveY) >= cg.dragAnchor){
                            cg.leftX = posX;
                            cg.topY = posY;
                            cg.anchor = true; //当窗体拖离初始位置锚定范围时，标记窗体被锚定
                        }
                    }
                        */
                };
                document.onmouseup = function(){
                    moveAble = false;
                    /*
                    if(moveAble){
                        document.onmousemove = docMouseMoveEvent;
                        document.onmouseup = docMouseUpEvent;
                        moveable = false;
                        moveX = 0;
                        moveY = 0;
                        moveTop = 0;
                        moveLeft = 0;
                    }
                    if(_.pwMask.style.left != '' && !popwin.isIE6 && cg.dragMask && posX != posXOld){
                        _.pwMask.style.display = 'none';
                        _.pwBox.style.left = posX + 'px';
                        _.pwBox.style.top = posY + 'px'
                    }
                    */
                    console.log('mouseup');
                };
            }

            $.addEventListener(_.controls.top, 'mousedown', moveDialog);
        },
        dragSize: function() {
            var _ = this,
                moveX = 0,
                moveY = 0,
                moveTop = 0,
                moveLeft = 0,
                moveAble = false,
                docMouseMoveEvent = document.onmousemove,
                docMouseUpEvent = document.onmouseup;

            function _dragSize(pos) {
                console.log('_dragSize: ', pos);

                var evt = $.getEvent();

                var cp = $.getScrollPosition();
                var posX = posXOld = evt.clientX;
                var posY = posYOld = evt.clientY;
                moveAble = true;
                moveX = evt.clientX;
                moveY = evt.clientY;
                
                var width = _.controls.box.offsetWidth,
                    height = _.controls.box.offsetHeight;
                var top = parseInt(_.controls.box.offsetTop, 10);
                var left = parseInt(_.controls.box.offsetLeft, 10);
                var right = left + width;
                var bottom = top + height;


                document.onmousemove = function(){
                    if(!moveAble) {
                        return false;
                    }
                    var evt = $.getEvent();
                    var x = evt.clientX - moveX, 
                        y = evt.clientY - moveY;
                    var newX = width + x, 
                        newY = height + y;

                    switch(pos) {
                        case 'right':
                            _.controls.box.style.width = newX + 'px';
                            break;
                        case 'bottom':
                            _.controls.box.style.height = newY + 'px';
                            break;
                        case 'bottom-right':
                            //_.controls.box.style.top =
                            _.controls.box.style.width = newX + 'px';
                            _.controls.box.style.height = newY + 'px';
                            break;
                        case 'bottom-left':
                            _.controls.box.style.left = (left + x) + 'px';
                            _.controls.box.style.top = top + 'px';
                            break;
                    }

                    _.setSize();

                    console.log('mousemove: ', pos, evt.clientX, evt.clientY, moveTop, moveLeft, x, y);
                };
                document.onmouseup = function(){
                    moveAble = false;
                    
                    console.log('mouseup');
                };
            }


            $('.border-switch').each(function(i, obj){
                $.addEventListener(obj, 'mousedown', function() {
                    _dragSize(obj.pos);
                });
            });
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