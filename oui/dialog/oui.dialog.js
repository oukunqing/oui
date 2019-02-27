
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

    function MyDialog(content, title, options){
        this.id = 1;
        if($.isObject(content)) {
            options = content;
            content = '';
            title = '';
        } else if($.isObject(title)) {
            options = title;
            title = '';
        }
        this.opt = $.extend({
            status: 'normal',
            minWidth: '180px',
            minHeight: '160px',
            maxWidth: '100%',
            maxHeight: '100%',
            width: '400px',
            height: '240px',
            content: content || '',
            title: title || '标题栏',
            position: 5,
            x: 0,
            y: 0,

        }, options);

        console.log('opt11:', this.opt);

        this.docOverflow();

        this.controls = {
            shade: null, container: null, box: null, 
            top: null, title: null, panel: null,
            body: null, content: null, 
            bottom: null
        };

        this.buttons = {
            ok: null, cancel: null, close: null, min: null, max: null
        };

        this.status = {
            min: false, max: false, normal: false
        };

        this.lastStatus = '';

        this.initial(this.opt);
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
        initial: function(options){
            this.build(options);
        },
        build: function(options){
            var _ = this, _ctls = this.controls, opt = options;

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

            _ctls.top = _.buildTop(opt.title);
            _ctls.box.appendChild(_ctls.top);

            _ctls.body = _.buildBody(opt.content);
            _ctls.box.appendChild(_ctls.body);
            
            _ctls.bottom = _.buildBottom();
            _ctls.box.appendChild(_ctls.bottom);

            _ctls.box.appendChild(_.buildSwitch('top'));
            _ctls.box.appendChild(_.buildSwitch('bottom'));
            _ctls.box.appendChild(_.buildSwitch('left'));
            _ctls.box.appendChild(_.buildSwitch('right'));
            _ctls.box.appendChild(_.buildSwitch('top-left'));
            _ctls.box.appendChild(_.buildSwitch('top-right'));
            _ctls.box.appendChild(_.buildSwitch('bottom-left'));
            _ctls.box.appendChild(_.buildSwitch('bottom-right'));

            document.body.appendChild(_ctls.shade);

            if(_ctls.container !== null) {
                _ctls.container.appendChild(_ctls.box);
                document.body.appendChild(_ctls.container);
            } else {
                $.addClass(_ctls.box, 'oui-dialog-fixed');
                document.body.appendChild(_ctls.box);
            }

            _.dragPosition().dragSize();

            _.setSize({type: _.opt.status, width: _.opt.width, height: _.opt.height});
            _.setPosition({pos: _.opt.position, x: _.opt.x, y: _.opt.y});

            console.log(_.controls.body.offsetHeight, _.controls.body.scrollHeight);

            //this.setPosition(3);
        },
        buildTop: function(title){
            var _ = this;
            var top = document.createElement('div');
            top.className = 'top';

            $.addEventListener(top, 'dblclick', function() {
                _.max();
                $.cancelBubble();
            });

            $.addEventListener(top, 'mousedown', function() {

            });

            var div = document.createElement('div');
            div.className = 'title';
            div.innerHTML =  title || _.opt.title;
            top.appendChild(div);

            _.controls.title = div;

            var panel = document.createElement('div');
            panel.className = 'dialog-btn-panel';
            panel.innerHTML = '<a class="btn btn-min" code="min"></a>'
                + '<a class="btn btn-max" code="max"></a>'
                + '<a class="btn btn-close" code="close"></a>';
            panel.style.cssText = 'float:right;';

            top.appendChild(panel);

            _.controls.panel = panel;

            for(var i = 0; i < panel.childNodes.length; i++) {
                var obj = panel.childNodes[i], key = obj.getAttribute('code');
                _.buttons[key] = obj;
            }

            _.setEvent(panel.childNodes, 'click', false);

            return top;
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

            var html = '<a class="btn btn-primary btn-mr" code="ok" href="javascript:void(0);" shortcutKey="Y">\u786e\u5b9a</a>'
                + '<a class="btn btn-default btn-ml" code="cancel" href="javascript:void(0);" shortcutKey="N">\u53d6\u6d88</a>';

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
        show: function (content, title, isHide){
            if($.isBoolean(content)) {
                isHide = content;
                title = undefined;
                content = undefined;
            } else if($.isBoolean(title)) {
                isHide = title;
                title = undefined;
            }
            var _ = this, _ctls = this.controls, display = isHide ? 'none' : '';

            if(!$.isUndefined(content)) {
                _ctls.body.innerHTML = content;
            }
            if(!$.isUndefined(title)) {
                _ctls.title.innerHTML = title;
            }

            if(_ctls.container) {
                _ctls.container.style.display = display;
            } else {
                _ctls.box.style.display = display;
            }
            if(_ctls.shade) {
                _ctls.shade.style.display = display;
            }

            return _.docOverflow(isHide), _;
        },
        hide: function() {
            return this.show(true);
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

            _.docOverflow(true);

            $.Dialog.remove(_.id);

            return _;
        },
        update: function(content, title, options){
            var _ = this, _ctls = this.controls;
            _ctls.body.innerHTML = content;
            _ctls.title.innerHTML = title;

            return this;
        },
        focus: function(obj) {
            obj.focus();
            return this;
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
        action: function(obj) {
            var _ = this, code = '';
            if(typeof obj === 'string') {
                code = obj;
            } else {
                if(!_.check(obj)) {
                    return false;
                }
                code = obj.getAttribute('code');
            }
            if(code.in(['close', 'cancel'])) {
                _.close();
            } else if(code === 'min') {
                _.min();
            } else if(code === 'max') {
                _.max();
            } else {
                _.close();
            }
            return this;
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
                width: obj.offsetWidth,
                height: obj.offsetHeight,
                top: obj.offsetTop,
                left: obj.offsetLeft,
                right: (obj.offsetLeft + obj.offsetWidth),
                bottom: (obj.offsetTop + obj.offsetHeight)
            };
            return this;
        },
        setSize: function(options) {
            var _ = this, _ctls = _.controls, _btns = _.buttons, obj = _ctls.box, par = {};
            var isSetBodySize = false;

            if($.isString(options)) {
                options = { type: options };
            }
            var opt = $.extend({
                type: 'normal',
                width: 0,
                height: 0
            }, options);

            opt.width = parseInt(opt.width, 10);
            opt.height = parseInt(opt.height, 10);

            if(opt.type === '' || isNaN(opt.width) || isNaN(opt.height) || _.getStatus() === opt.type) {
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
                par = {width: '100%', height: '100%', top: 0, left: 0, right: 0, bottom: 0};

                $.addClass(obj, 'oui-dialog-max');
                $.addClass(_btns.max, 'btn-normal');

                if(_.controls.container) {
                    $.addClass(_ctls.container, 'dialog-overflow-hidden');
                }

                if(_.status.min) {
                    $.removeClass(obj, 'oui-dialog-min');
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

                _.hideSwitch().setStatus('min').setPosition({pos: _.opt.position});
            } else {
                isSetBodySize = true;
                $.removeClass(_btns.max, 'btn-normal');

                if(_.status.max) {
                    $.removeClass(obj, 'oui-dialog-max');
                } else if(_.status.min) {
                    $.removeClass(obj, 'oui-dialog-min');
                }
                _.showSwitch().setStatus('normal');

                if(opt.type === 'resize' || opt.type === 'size') {
                    par = {width: opt.width, height: opt.height};
                } else if(opt.type === 'scale') {
                    isSetBodySize = false;
                    _.setScale(options);
                } else {  //opt.type === 'normal'
                    if(!$.isUndefined(_.lastSize)) {
                        $.setStyle(_ctls.box, _.lastSize, 'px');
                    } else {
                        par = {width: opt.width, height: opt.height};
                    }
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

            opt.x = parseInt(opt.x, 10);
            opt.y = parseInt(opt.y, 10);

            if(opt.dir === '' || isNaN(opt.x) || isNaN(opt.y)) {
                return this;
            } else if(opt.x === 0 && opt.y === 0) {
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
                newLeft = (dp.left + opt.x + newWidth) > dp.right ? dp.right - newWidth : dp.left + opt.x;
                newTop = (dp.top + opt.y + newHeight) > dp.bottom ? dp.bottom - newHeight : dp.top + opt.y;
            }

            if(opt.dir.indexOf('-') >= 0 || opt.dir === 'center') {
                $.setStyle(obj, {width: newWidth, height: newHeight}, 'px');
            }

            switch(opt.dir) {
                case 'bottom-right':
                case 'right-bottom': //不用处理
                    break;
                case 'right':
                    $.setStyle(obj, {width: newWidth, height: dp.height}, 'px');
                    break;
                case 'bottom':
                    $.setStyle(obj, {width: dp.width, height: newHeight}, 'px');
                    break;
                case 'left':
                    $.setStyle(obj, {width: newWidth, height: dp.height, left: newLeft}, 'px');
                    break;
                case 'top':
                    $.setStyle(obj, {width: dp.width, height: newHeight, top: newTop}, 'px');
                    break;
                case 'top-left':
                case 'left-top':
                case 'center':
                    $.setStyle(obj, {left: newLeft, top: newTop}, 'px');
                    break;
                case 'top-right':
                case 'right-top':
                    $.setStyle(obj, {top: newTop}, 'px');
                    break;
                case 'bottom-left':
                case 'left-bottom':
                    $.setStyle(obj, {left: newLeft}, 'px');
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
        clearPositionStyle: function(obj) {
            var arr = obj.style.cssText.split(';');
            var cssText = [];
            for(var i in arr) {
                var name = arr[i].split(':')[0].trim();
                if(!name.in(['top', 'left', 'right', 'bottom'])) {
                    cssText.push(arr[i]);
                }
            }
            obj.style.cssText = cssText.join(';');
            return this;
        },
        setPosition: function(options) {
            var _ = this, obj = _.controls.box;

            if($.isString(options) || $.isNumber(options)) {
                options = { pos: options };
            }
            var opt = $.extend({
                pos: 5,
                x: 0,
                y: 0
            }, options);

            opt.pos = opt.pos === 'custom' ? 10 : parseInt(opt.pos, 10);

            if(isNaN(opt.pos) || isNaN(opt.x) || isNaN(opt.y)) {
                return this;
            }

            var bs = $.getBodySize(),
                width = obj.offsetWidth,
                height = obj.offsetHeight,
                posX = bs.width / 2 - width / 2,
                posY = bs.height / 2 - height / 2;

            //清除cssText上下左右4个样式
            _.clearPositionStyle(obj);

            switch(opt.pos) {
                case 1:
                    $.setStyle(obj, {left: opt.x, top: opt.y}, 'px');
                    break;
                case 2:
                    $.setStyle(obj, {left: posX, top: opt.y}, 'px');
                    break;
                case 3:
                    $.setStyle(obj, {right: opt.x,  top: opt.y}, 'px');
                    break;
                case 4:
                    $.setStyle(obj, {left: opt.x, top: posY}, 'px');
                    break;
                case 5:
                    $.setStyle(obj, {left: posX, top: posY}, 'px');
                    break;
                case 6:
                    $.setStyle(obj, {right: opt.x, bottom: posY}, 'px');
                    break;
                case 7:
                    $.setStyle(obj, {left: opt.x, bottom: opt.y}, 'px');
                    break;
                case 8:
                    $.setStyle(obj, {left: posX, bottom: opt.y}, 'px');
                    break;
                case 9:
                    $.setStyle(obj, {right: opt.x, bottom: opt.y}, 'px');
                    break;
                case 10:    //custom

                    $.setStyle(obj, {top: opt.y, left: opt.x}, 'px');
                    break;
            }
            return this;
        },
        setContent: function() {

            return this;
        },
        dragToNormal: function(evt, bs, moveX, moveY) {
            var _ = this, _ctls = _.controls, obj = _ctls.box;

            //对话框最大化时，拖动对话框，先切换到标准模式（尺寸、定位）
            _.setSize({type: 'normal'})

            var offsetRateX = (evt.clientX / bs.width),
                offsetX = evt.clientX,
                offsetY = evt.clientY - moveY,
                btnPanelWidth = _ctls.panel ? _ctls.panel.offsetWidth : 0;

            if(offsetRateX > 0.5) {
                offsetX = evt.clientX - obj.offsetWidth + (obj.offsetWidth) * (1 - offsetRateX) + btnPanelWidth * offsetRateX;
            } else if(offsetX > (obj.offsetWidth) / 2) {
                offsetX = evt.clientX - (obj.offsetWidth) / 2;
            } else {
                offsetX = evt.clientX - moveX;
            }

            //移动对话框到当前鼠标位置
            _.setPosition({pos: 'custom', x: offsetX, y: offsetY});

            return this;
        },
        dragPosition: function () {
            var _ = this,
                obj = _.controls.box,
                bs = $.getBodySize(),
                clientWidth = bs.width,
                clientHeight = bs.height,
                moveX = 0,
                moveY = 0,
                moveTop = 0,
                moveLeft = 0,
                moveAble = false,
                docMouseMoveEvent = document.onmousemove,
                docMouseUpEvent = document.onmouseup;

            function moveDialog() {
                var evt = $.getEvent();
                var isToNormal = false;

                var cp = $.getScrollPosition();
                var posX = posXOld = evt.clientX;
                var posY = posYOld = evt.clientY;
                moveAble = true;
                moveX = evt.clientX;
                moveY = evt.clientY;
                
                moveTop = obj.offsetTop;
                moveLeft = obj.offsetLeft;

                document.onmousemove = function(){
                    if(!moveAble) {
                        return false;
                    }

                    var evt = $.getEvent();

                    if(!isToNormal && _.status.max) {
                        isToNormal = true;
                        _.dragToNormal(evt, bs, moveX, moveY);
                        moveTop = obj.offsetTop;
                        moveLeft = obj.offsetLeft;
                    }

                    var x = moveLeft + evt.clientX - moveX,
                        y = moveTop + evt.clientY - moveY,
                        w = obj.offsetWidth,
                        h = obj.offsetHeight;

                    posX = x;
                    posY = y;

                    $.setStyle(obj, {left: posX, top: posY}, 'px');
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

            return $.addEventListener(_.controls.top, 'mousedown', function(){
                moveDialog();
                $.cancelBubble();
            }), this;
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
                    var e = $.getEvent(),
                        x = (e.clientX - moveX) * (dir.indexOf('left') >= 0 ? -1 : 1), 
                        y = (e.clientY - moveY) * (dir.indexOf('top') >= 0 ? -1 : 1);

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
                    */
                };
                document.onmouseup = _.controls.box.onmouseup = function(){
                    moveAble = false;
                };
            }

            $('.border-switch').each(function(i, obj){
                $.addEventListener(obj, 'mousedown', function() {
                    _dragSize(obj.pos);
                    $.cancelBubble();
                });
            });
            return this;
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
        show: function(content, title, options) {
            var id = 1;
            var d = this.get(id);

            if(d === null) {
                d = this.set(id, new MyDialog(content, title, options));
            } else {
                d.update(content, title, options);
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
        alert: function(content, title, options){
            return $.Dialog.show(content, title, options);
        },
        confirm: function(content, options){

        },
        msg: function(content, options){

        },
        tips: function(content, options){

        },
        tooltip: function(content, options){

        }
    });
}(OUI);