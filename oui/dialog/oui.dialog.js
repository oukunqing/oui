
!function($){

    var KEY_CODE = {
        Enter: 13,
        Esc: 27,
        Space: 32
    };

    var thisFilePath = $.getScriptSelfPath(true);
    //先加载样式文件
    $.loadLinkStyle($.getFilePath(thisFilePath) + $.getFileName(thisFilePath, true).replace('.min', '') + '.css');

    function checkStyleUnit(s) {
        if($.isString(s, true)) {
            s = s.toLowerCase();
            var arr = ['px', '%', 'em', 'auto', 'pt'];
            for(var i in arr) {
                if(s.endsWith(arr[i])) {
                    return s;
                }
            }
            return s + 'px';
        } else if($.isNumber(s)) {
            return s + 'px';
        }
        return s;
    }

    function MyDialog(content, options){
        this.id = 1;
        this.opt = $.extend({
            minWidth: '180px',
            minHeight: '160px',
            maxWidth: '100%',
            maxHeight: '100%',
            width: '400px',
            height: '240px',
            position: 5,
            title: '标题栏',

        }, options);

        this.docOverflow();

        this.controls = {
            shade: null, container: null, box: null, top: null, title: null, body: null, content: null, bottom: null
        };

        this.buttons = {
            ok: null, cancel: null, close: null, min: null, max: null
        };

        this.status = {
            min: false, max: false, normal: true
        };

        this.lastStatus = 'normal';

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

            //$.setStyle(_ctls.box, {minWidth: _.opt.minWidth, minHeight: _.opt.minHeight});

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
            btn.innerHTML = '<a class="btn btn-min" code="min"></a>'
                + '<a class="btn btn-max" code="max"></a>'
                + '<a class="btn btn-close" code="close"></a>';
            btn.style.cssText = 'float:right;';

            div.appendChild(btn);

            for(var i = 0; i < btn.childNodes.length; i++) {
                var obj = btn.childNodes[i], key = obj.getAttribute('code');
                this.buttons[key] = obj;
            }

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
            var panel = document.createElement('div');
            panel.className = 'bottom-panel';

            var div = document.createElement('div');
            div.className = 'bottom';

            var html = '<a class="btn btn-ok btn-primary btn-mr" code="ok" href="javascript:void(0);" shortcutKey="Y">\u786e\u5b9a</a>'
                + '<a class="btn btn-cancel btn-default btn-ml" code="cancel" href="javascript:void(0);" shortcutKey="N">\u53d6\u6d88</a>';

            div.innerHTML = html;

            panel.appendChild(div);

            for(var i = 0; i < div.childNodes.length; i++) {
                var obj = div.childNodes[i], key = obj.getAttribute('code');
                this.buttons[key] = obj;
            }

            this.setEvent(div.childNodes, 'click', true);

            this.setShortcutKeyEvent(div.childNodes);

            return panel;
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
            return this;
        },
        hideSwitch: function() {
            $('.border-switch').each(function(i, obj, args){
                $(this).hide();
            });
            return this;
        },
        show: function (content){
            console.log('show: ' + content);


            return this;
        },
        update: function(content){
            this.body.innerHTML = content;

            console.log('update: ' + content);
            return this;
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
            return this;
        },
        focus: function(obj) {
            obj.focus();
            return this;
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
            return this.setSize({type: 'min'});
        },
        normal: function() {
            return this.setSize({type: 'normal'});
        },
        max: function() {
            var _ = this;
            if(_.status.max || (_.status.min && _.lastStatus === 'normal')) {
                return _.setSize({type: 'normal'});                
            } else {
                return _.setSize({type: 'max'});
            }
        },
        setStatus: function(key, isLast) {
            this.lastStatus = this.getStatus();
            for(var k in this.status) {
                this.status[k] = false;
            }
            this.status[key] = true;
            return this;
        },
        getStatus: function(key) {
            if(typeof key === 'string') {
                return this.status[key];
            } else {
                for(var k in this.status) {
                    if(this.status[k]) {
                        return k;
                    }
                }
            }
        },
        setCache: function() {
            var obj = this.controls.box;

            this.lastSize = {
                width: obj.offsetWidth + 'px',
                height: obj.offsetHeight + 'px',
                top: obj.offsetTop + 'px',
                left: obj.offsetLeft + 'px',
                right: (obj.offsetLeft + obj.offsetWidth) + 'px',
                bottom: (obj.offsetTop + obj.offsetHeight) + 'px'
            };
            return this;
        },
        setSize: function(options) {
            var _ = this, _ctls = _.controls, _btns = _.buttons, obj = _ctls.box, par = {};
            var isSetBodySize = false;
            var opt = $.extend({
                type: 'normal',
                width: 0,
                height: 0
            }, options);

            if(_.getStatus() === opt.type) {
                return this;
            }

            if(_.status.normal) {
                _.setCache();
            }

            if(_.status.max && opt.type !== 'max' && _ctls.container) {
                $.removeClass(_ctls.container, 'dialog-overflow-hidden');
            } else if(opt.type !== 'min') {
                $.removeClass(_ctls.bottom, 'display-none');
            }

            if(opt.type === 'max') {
                par = {width: '100%', height: '100%', top: 0, left: 0, right: 0, botton: 0};

                $.addClass(obj, 'oui-dialog-max');
                $.addClass(_btns.max, 'btn-normal');

                if(_.status.min) {
                    $.removeClass(obj, 'oui-dialog-min');
                }

                if(_.controls.container) {
                    $.addClass(_ctls.container, 'dialog-overflow-hidden');
                }

                _.hideSwitch().setStatus('max');
                isSetBodySize = true;
            } else if(opt.type === 'min') {
                par = {width: 200, height: 36};
                $.addClass(_ctls.bottom, 'display-none');
                $.addClass(obj, 'oui-dialog-min');
                if(_.status.max) {
                    $.removeClass(obj, 'oui-dialog-max');
                }
                $.removeClass(_btns.max, 'btn-normal');

                _.hideSwitch().setStatus('min');
            } else {
                isSetBodySize = true;
                $.removeClass(_btns.max, 'btn-normal');

                if(_.status.max) {
                    $.removeClass(obj, 'oui-dialog-max');
                } else if(_.status.min) {
                    $.removeClass(obj, 'oui-dialog-min');
                }
                _.showSwitch().setStatus('normal');

                if(opt.type === 'normal') {
                    $.setStyle(_ctls.box, _.lastSize);
                } else if(opt.type === 'resize') {
                    par = {width: opt.width, height: opt.height};
                } else if(opt.type === 'scale') {
                    isSetBodySize = false;
                    _.setScale(options);
                } else {

                }
            }

            for(var name in par) {
                var val = par[name];
                if(!$.isNullOrUndefined(val)) {
                    obj.style[name] = checkStyleUnit(val);
                }
            }
            if(isSetBodySize) {
                _.setBodySize();
            }
            return _;
        },
        setScale: function(options, isDrag, dp) {
            var _ = this, obj = _.controls.box;
            var opt = $.extend({
                type: '',
                dir: 'bottom-right',
                x: 0,
                y: 0
            }, options);

            if(opt.dir === '' || (opt.x === 0 && opt.y === 0)) {
                return this;
            }

            if(!isDrag) {                
                dp = {
                    width: obj.offsetWidth,
                    height: obj.offsetHeight,
                    top: obj.offsetTop,
                    left: obj.offsetLeft,
                    right: obj.offsetWidth + obj.offsetLeft,
                    bottom: obj.offsetHeight + obj.offsetTop,
                    minWidth: parseInt(_.opt.minWidth, 10),
                    minHeight: parseInt(_.opt.minHeight, 10)
                };
            }

            var w = dp.width + opt.x,
                h = dp.height + opt.y,
                newWidth = w < dp.minWidth ? dp.minWidth : w, 
                newHeight = h < dp.minHeight ? dp.minHeight : h,
                newLeft = 0,
                newTop = 0;

            if(opt.dir === 'center') {
                opt.x = parseInt(Math.abs(opt.x) / 2, 10);
                opt.y = parseInt(Math.abs(opt.y) / 2, 10);
                newLeft = dp.left - opt.x;
                newTop = dp.top - opt.y;
            } else {
                opt.x *= opt.dir.indexOf('left') >= 0 ? -1 : 1;
                opt.y *= opt.dir.indexOf('top') >= 0 ? -1 : 1;
                newLeft = dp.left + opt.x + newWidth > dp.right ? dp.right - newWidth : dp.left + opt.x,
                newTop = dp.top + opt.y + newHeight > dp.bottom ? dp.bottom - newHeight : dp.top + opt.y;
            }

            if(opt.dir.indexOf('-') >= 0 || opt.dir === 'center') { 
                obj.style.width = newWidth + 'px';
                obj.style.height = newHeight + 'px';
            }

            switch(opt.dir) {
                case 'top':
                    obj.style.width = dp.width + 'px';
                    obj.style.height = newHeight + 'px';
                    obj.style.top = newTop + 'px';
                    break;
                case 'right':
                    obj.style.width = newWidth + 'px';
                    obj.style.height = dp.height + 'px';
                    break;
                case 'bottom':
                    obj.style.width = dp.width + 'px';
                    obj.style.height = newHeight + 'px';
                    break;
                case 'left':
                    obj.style.width = newWidth + 'px';
                    obj.style.height = dp.height + 'px';
                    obj.style.left = newLeft + 'px';
                    break;
                case 'top-left':
                case 'left-top':
                    obj.style.left = newLeft + 'px';
                    obj.style.top = newTop + 'px';
                    break;
                case 'top-right':
                case 'right-top':
                    obj.style.top = newTop + 'px';
                    break;
                case 'bottom-right':
                case 'right-bottom':
                    break;
                case 'bottom-left':
                case 'left-bottom':
                    obj.style.left = newLeft + 'px';
                    break;
                case 'center':
                    obj.style.left = newLeft + 'px';
                    obj.style.top = newTop + 'px';
                    break;
            }
            return _.setBodySize();
        },
        setBodySize: function() {
            var _ = this, obj = _.controls.box;

            var topHeight = _.controls.top ? _.controls.top.offsetHeight + 1 : 0, 
                bottomHeight = _.controls.bottom ? _.controls.bottom.offsetHeight + 1 : 0,
                paddingHeight = parseInt('0' + $.getElementStyle(obj, 'paddingTop'), 10);

            var size = {
                width: '100%',
                height: (obj.offsetHeight - topHeight - bottomHeight - paddingHeight) + 'px'
            };

            return $.setStyle(_.controls.body, size), _;
        },
        setPosition: function(pos) {
            var _ = this, obj = _.controls.box;

            $.addClass(_ctls.box, 'oui-dialog-pos');

            switch(pos) {
                case 1:
                    obj.style.top = '0px';
                    obj.style.left = '0px';
                    break;
                case 2:
                    obj.style.top = '0px';
                    $.addClass(obj, 'dialog-margin-center');
                    break;
                case 3:
                    obj.style.right = '0px';
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    break;
                case 7:
                    obj.style.left = '0px';
                    obj.style.bottom = '0px';
                    break;
                case 8:
                    break;
                case 9:
                    break;
                case 10:
                    break;
            }
            return this;
        },
        setContent: function() {

            return this;
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

                    //console.log('mousemove: ', evt.clientX, evt.clientY, moveTop, moveLeft, x, y);
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
                obj = _.controls.box,
                moveX = 0,
                moveY = 0,
                moveAble = false,
                docMouseMoveEvent = document.onmousemove,
                docMouseUpEvent = document.onmouseup;

            function _dragSize(dir) {
                var evt = $.getEvent();

                moveAble = true;
                moveX = evt.clientX;
                moveY = evt.clientY;

                var par = {
                    width: obj.offsetWidth,
                    height: obj.offsetHeight,
                    top: obj.offsetTop,
                    left: obj.offsetLeft,
                    right: obj.offsetWidth + obj.offsetLeft,
                    bottom: obj.offsetHeight + obj.offsetTop,
                    minWidth: parseInt(_.opt.minWidth, 10),
                    minHeight: parseInt(_.opt.minHeight, 10)
                };

                document.onmousemove = function(){
                    if(!moveAble) {
                        return false;
                    }
                    var evt = $.getEvent();
                    
                    var x = (evt.clientX - moveX) * (dir.indexOf('left') >= 0 ? -1 : 1), 
                        y = (evt.clientY - moveY) * (dir.indexOf('top') >= 0 ? -1 : 1);

                    _.setScale({ dir: dir, x: x, y: y }, true, par);

                        /*,
                        w = dir.indexOf('left') >= 0 ? width - x : width + x,
                        h = dir.indexOf('top') >= 0 ? height - y : height + y;

                        console.log('x: ', x, ', y: ', y);

                    var enabled = w > minWidth && h > minHeight;

                    console.log('minWidth: ',minWidth, minHeight);

                    console.log('mousemove: ', dir, left, top, left + x, top + y, x, y);

                    var newWidth = w < minWidth ? minWidth : w, 
                        newHeight = h < minHeight ? minHeight : h,
                        newLeft = left + x + newWidth > right ? right - newWidth : left + x,
                        newTop = top + y + newHeight > bottom ? bottom - newHeight : top + y;

                    if(dir.indexOf('-') >= 0) { 
                        _.controls.box.style.width = newWidth + 'px';
                        _.controls.box.style.height = newHeight + 'px';
                    }

                    switch(dir) {
                        case 'top':
                            _.controls.box.style.width = width + 'px';
                            _.controls.box.style.height = newHeight + 'px';
                            _.controls.box.style.top = newTop + 'px';
                            break;
                        case 'left':
                            _.controls.box.style.width = newWidth + 'px';
                            _.controls.box.style.height = height + 'px';
                            _.controls.box.style.left = newLeft + 'px';
                            break;
                        case 'right':
                            _.controls.box.style.width = newWidth + 'px';
                            _.controls.box.style.height = height + 'px';
                            break;
                        case 'bottom':
                            _.controls.box.style.width = width + 'px';
                            _.controls.box.style.height = newHeight + 'px';
                            break;
                        case 'top-left':
                            _.controls.box.style.left = newLeft + 'px';
                            _.controls.box.style.top = newTop + 'px';
                            break;
                        case 'top-right':
                            _.controls.box.style.top = newTop + 'px';
                            break;
                        case 'bottom-right':
                            //_.controls.box.style.width = newWidth + 'px';
                            //_.controls.box.style.height = newHeight + 'px';
                            break;
                        case 'bottom-left':
                            _.controls.box.style.left = newLeft + 'px';
                            break;
                    }

                    _.setBodySize();
                    */
                };
                document.onmouseup = _.controls.box.onmouseup = function(){
                    moveAble = false;
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