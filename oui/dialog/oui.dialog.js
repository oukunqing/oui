
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
        if($.isObject(content)) {
            options = content;
            content = '';
            title = '';
        } else if($.isObject(title)) {
            options = title;
            title = '';
        }
        var _ = this;
        _.options = _.opt = $.extend({
            id: '',
            type: 'alert', //alert,confirm,message,tooltip,window
            status: 'normal',
            zindex: _.buildZindex(),
            minWidth: '180px',
            minHeight: '160px',
            maxWidth: '100%',
            maxHeight: '100%',
            width: '400px',
            height: '180px',
            lock: true,                             //是否锁屏
            title: title || '\u6807\u9898\u680f',
            content: content || '',
            url: '',
            position: 5,
            x: 0,
            y: 0,
            topMost: false,
            closeAble: true,
            clickBgClose: 'dblclick', // dblclick | click
            escClose: false,
            autoClose: false,
            closeTiming: 5000,
            dragRangeLimit: false,                  //窗体拖动范围限制 true,false
            dragPosition: true,
            dragSize: true,
            maxAble: true,
            minAble: true,
            callback: null,
            buttons: []

        }, options);


        _.docOverflow();

        _.controls = {
            shade: null, container: null, box: null, 
            top: null, title: null, panel: null,
            body: null, content: null, 
            bottom: null
        };

        _.buttons = {
            ok: null, cancel: null, close: null, min: null, max: null
        };

        _.status = {
            min: false, max: false, normal: false
        };

        _.lastStatus = ''; //normal
        _.closed = false;

        _.dialogId = _.buildId(_.opt.id);

        _.initial(_.opt);
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
        isShow: function(key) {
            switch(key) {
                case 'shade':
                    break;
                case 'bottom':
                    break;
            }
            return true;
        },
        isDialog: function(obj) {
            if(null !== obj && obj.identifier.startsWith('oui-dialog-identifier-')){
                return true;
            }
            return false;
        },
        isSelf: function(obj) {
            if(!this.isDialog(obj)) {
                return false;
            }
            return obj.opt.id === this.opt.id && obj.controls.box.id === this.controls.box.id;
        },
        build: function(options){
            var _ = this, _ctls = this.controls, opt = options;

            _.identifier = 'oui-dialog-identifier-' + _.buildZindex();

            if(opt.type === 'tooltip') {
                //不需要遮罩层
                
            } else {
                if(_.opt.lock) {
                    //遮罩层
                    _ctls.shade = document.createElement('div');
                    _ctls.shade.className = 'oui-dialog-shade';
                    _ctls.shade.style.zIndex = opt.zindex;

                    //对话框容器
                    _ctls.container = document.createElement('div');
                    _ctls.container.className = 'oui-dialog-container';
                    _ctls.container.style.zIndex = opt.zindex;
                }
            }
            /*
            document.onkeypress = function(e) {
                console.log('onkeypress:', $.getKeyCode(e));
            }
            */

            //对话框
            _ctls.box = document.createElement('div');
            _ctls.box.className = 'oui-dialog';
            _ctls.box.style.zIndex = opt.zindex;
            _ctls.box.id = _.dialogId;

            _ctls.box.cache = {};

            _ctls.top = _.buildTop(opt.title);
            _ctls.box.appendChild(_ctls.top);

            _ctls.body = _.buildBody(opt.content);
            _ctls.box.appendChild(_ctls.body);
            
            if(opt.type !== 'message' && opt.type !== 'tooltip') {
                _ctls.bottom = _.buildBottom();
                _ctls.box.appendChild(_ctls.bottom);
/*
                _ctls.box.appendChild(_.buildSwitch('top'));
                _ctls.box.appendChild(_.buildSwitch('bottom'));
                _ctls.box.appendChild(_.buildSwitch('left'));
                _ctls.box.appendChild(_.buildSwitch('right'));
                _ctls.box.appendChild(_.buildSwitch('top-left'));
                _ctls.box.appendChild(_.buildSwitch('top-right'));
                _ctls.box.appendChild(_.buildSwitch('bottom-left'));
                _ctls.box.appendChild(_.buildSwitch('bottom-right'));
                */
                _.setDragSize();
            }

            if(_ctls.shade) {
                document.body.appendChild(_ctls.shade);
            }

            if(_ctls.container !== null) {
                _ctls.container.appendChild(_ctls.box);
                document.body.appendChild(_ctls.container);
            } else {
                //$.addClass(_ctls.box, 'oui-dialog-fixed');
                document.body.appendChild(_ctls.box);
            }

            _.setCache().dragPosition().dragSize();

            _.setSize({type: _.opt.status, width: _.opt.width, height: _.opt.height});
            _.setPosition({pos: _.opt.position, x: _.opt.x, y: _.opt.y});


            if(opt.clickBgClose.in(['dblclick', 'click'])) {
                $.addEventListener(_ctls.container, opt.clickBgClose, function() {
                    _.close();
                });
            }

            if(opt.escClose) {
                $.Dialog.setEscClose();
                /*
                $.addEventListener(document, 'keyup', function(e) {
                    if(KEY_CODE.Esc === $.getKeyCode(e)) {
                        //TODO:
                        var d = $.Dialog.getLast();
                        if(d !== null && !d.closed) {
                            d.close();
                        }
                    }
                });
                */
            }

            if(_.opt.topMost) {
                $.addEventListener(_ctls.box, 'mousedown', function() {
                    _.setTopMost();
                });
            }

            $.addEventListener(_ctls.box, 'click', function(){
                $.cancelBubble();
            });

            $.addEventListener(_ctls.box, 'dblclick', function(){
                $.cancelBubble();
            });

            if(opt.autoClose) {
                window.setTimeout(function() {
                    _.close();
                }, opt.closeTiming);
            }

            //console.log(_.controls.body.offsetHeight, _.controls.body.scrollHeight);

            //this.setPosition(3);
        },
        buildId: function(id) {
            if(!$.isString(id) && !$.isNumber(id)) {
                id = buildZindex(0, 13);
            }
            return 'out-dialog-' + id;
        },
        buildZindex: function(start, len) {
            var tick = new Date().getTime();
            return parseInt(('' + tick).substr(start || 4, len || 8), 10);
        },
        getControls: function(className) {
            return $('#' + this.dialogId + ' ' + className);
        },
        buildTop: function(title){
            var _ = this;
            var top = document.createElement('div');
            top.className = 'top';

            $.addEventListener(top, 'dblclick', function() {
                if(_.opt.maxAble) {
                    _.max();
                }
                $.cancelBubble();
            });

            $.addEventListener(top, 'mousedown', function() {
                if(_.opt.topMost) {
                    _.setTopMost();
                }
                $.cancelBubble();
            });

            var div = document.createElement('div');
            div.className = 'title';
            div.innerHTML =  title || _.opt.title;
            top.appendChild(div);

            _.controls.title = div;

            var panel = document.createElement('div');
            panel.className = 'dialog-btn-panel';
            panel.innerHTML = (_.opt.minAble ? '<a class="btn btn-min" code="min"></a>' : '')
                + (_.opt.maxAble ? '<a class="btn btn-max" code="max"></a>' : '')
                + (_.opt.closeAble ? '<a class="btn btn-close" code="close"></a>' : '');
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
            var _ = this;
            var div = document.createElement('div');
            div.className = 'body';

            var con = document.createElement('div');
            con.className = 'content';
            con.innerHTML = content;

            this.controls.content = con;

            div.appendChild(con);

            $.addEventListener(div, 'mousedown', function() {
                if(_.opt.topMost) {
                    _.setTopMost();
                }
                $.cancelBubble();
            });

            return div;
        },
        buildBottom: function(type) {
            var _ = this;
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

            $.addEventListener(panel, 'mousedown', function() {
                if(_.opt.topMost) {
                    _.setTopMost();
                }
                $.cancelBubble();
            });

            this.setEvent(div.childNodes, 'click', true);

            this.setShortcutKeyEvent(div.childNodes);

            return panel;
        },
        buildSwitch: function(dir) {
            if($.isUndefined(dir)) {
                dir = 'bottom-right';
            }
            var id = this.opt.id + '-switch-' + dir;
            if(document.getElementById(id) !== null) {
                return false;
            }
            var div = document.createElement('div');
            div.className = 'border-switch';
            div.pos = dir;
            div.id = id;
            div.dialogId = this.opt.id;
            $.addClass(div, dir + '-switch');
            return div;
        },
        getSwicths: function() {
            return this.getControls('.border-switch');
        },
        showSwitch: function() {
            this.getSwicths().each(function(){
                $(this).show();
            });
            return this;
        },
        hideSwitch: function() {
            this.getSwicths().each(function(i, obj, args){
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

            if(isHide && !_.opt.closeAble) {
                return false;
            }

            this.closed = isHide || false;

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
            if(!_.opt.closeAble) {
                return false;
            }
            //console.log('_ctls.box: ', _.opt.id, _ctls.box, this.disposed);
            if(this.closed) {
                return false;
            }
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

            $.Dialog.remove(_.opt.id);

            this.closed = true;
            
            return _.dispose();
        },
        dispose: function(){
            for(var i in this.controls){
                this.controls[i] = null;
            }
            for(var i in this.buttons){
                this.buttons[i] = null;
            }
            for(var i in this.options){
                this.options[i] = null;
            }
            return this;
        },
        update: function(content, title, options) {
            if($.isObject(content)) {
                options = content;
                content = '';
                title = '';
            } else if($.isObject(title)) {
                options = title;
                title = '';
            } else if($.isString(options)){
                if(options === 'autosize') {
                    options = {width: 'auto', height: 'auto'};
                } else if(options === 'autoheight') {
                    options = {height: 'auto'};
                } else if(options === 'autowidth') {
                    options = {width: 'auto'};
                } else {
                    options = {};
                }
            }
            var opt = $.extend({
                content: content,
                title: title,
            }, options);

            var _ = this, _ctls = this.controls;
            if(_ctls.content){
                if(opt.width === 'auto') {
                    _ctls.box.style.width = 'auto';
                    _ctls.body.style.width = 'auto';
                    _ctls.content.style.width = 'auto';
                }
                if(opt.height === 'auto') {
                    _ctls.box.style.height = 'auto';
                    _ctls.body.style.height = 'auto';
                    _ctls.content.style.height = 'auto';
                }

                _ctls.content.innerHTML = opt.content;

                if(_ctls.title && opt.title) {
                    _ctls.title.innerHTML = opt.title;
                }

                this.setBodySize().setCache().setPosition();
            }

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
        setConfig: function(key, value) {
            var opt = this.opt;
            if(typeof key === 'object') {
                for(var k in key) {
                    if($.containsKey(opt, k)){
                        opt[k] = key[k];
                    }
                }
            } else if(typeof key === 'string') {
                if($.containsKey(opt, key)){
                    opt[key] = value;
                }
            }
            return this;
        },
        setOption: function(key, value) {
            return this.setConfig(key, value);
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

            var size = {
                width: obj.offsetWidth,
                height: obj.offsetHeight
            };

            this.lastSize = this.opt.heigh === 'auto' ? size : $.extend({
                top: obj.offsetTop,
                left: obj.offsetLeft,
                right: (obj.offsetLeft + obj.offsetWidth),
                bottom: (obj.offsetTop + obj.offsetHeight)
            }, size);

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

            console.log('setSize:', options);

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
        setDragSize: function(dir) {
            var _ = this, _ctls = this.controls;
            var arr = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
            
            dir = $.isString(dir) ? [dir] : arr;

            if(_.opt.dragSize) {                
                for(var i in dir) {
                    _ctls.box.appendChild(_.buildSwitch(dir[i]));
                }
                _.showSwitch();
            } else {
                _.hideSwitch();
            }
        },
        setScale: function(options, isDrag, dp) {
            var _ = this, obj = _.controls.box;
            if(!_.opt.dragSize && isDrag) {
                return this;
            }
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
            var _ = this, obj = _.controls.box, bs = $.getBodySize();

            var topHeight = _.controls.top ? _.controls.top.offsetHeight + 1 : 0, 
                bottomHeight = _.controls.bottom ? _.controls.bottom.offsetHeight + 1 : 0,
                paddingHeight = parseInt('0' + $.getElementStyle(obj, 'paddingTop'), 10),
                boxHeight = obj.offsetHeight;

            if(boxHeight > bs.height) {
                boxHeight = bs.height - 20;
                obj.style.height = boxHeight + 'px';
            }

            var size = {
                width: '100%',
                height: (boxHeight - topHeight - bottomHeight - paddingHeight) + 'px'
            };

            console.log('size:', _.opt.id, size);

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
        setTopMost: function() {
            if(!this.opt.dragSize) {
                return false;
            }
            var topBox = $.Dialog.getTop(), 
                isDialog = this.isDialog(topBox), 
                isSelf = this.isSelf(topBox);
            if(!isDialog || isSelf) {
                return this;
            }

            var zindex = topBox.opt.zindex;
            topBox.setZindex(this.opt.zindex);
            return this.setZindex(zindex);
        },
        setZindex: function(zindex) {
            var _ctls = this.controls;
            if(typeof zindex !== 'number') {
                zindex = this.buildZindex();
            }
            if(_ctls.container) {
                _ctls.container.style.zIndex = zindex;
            } else {
                _ctls.box.style.zIndex = zindex;
            }
            return this.setOption('zindex', zindex);
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
                docMouseMoveEvent = document.onmousemove,
                docMouseUpEvent = document.onmouseup;

            function moveDialog() {
                if(!_.opt.dragPosition) {
                    return false;
                }
                var evt = $.getEvent(),
                    moveX = evt.clientX,
                    moveY = evt.clientY,
                    moveTop = obj.offsetTop,
                    moveLeft = obj.offsetLeft,
                    moveAble = true;

                var isToNormal = false;

                var cp = $.getScrollPosition();
                var posX = posXOld = evt.clientX;
                var posY = posYOld = evt.clientY;
                

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
                    //console.log('mouseup');
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
                docMouseMoveEvent = document.onmousemove,
                docMouseUpEvent = document.onmouseup;

            function _dragSize(dir) {
                if(!_.opt.dragSize) {
                    return false;
                }
                var evt = $.getEvent(),
                    moveX = evt.clientX,
                    moveY = evt.clientY,
                    moveAble = true;

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
                };
                document.onmouseup = _.controls.box.onmouseup = function(){
                    moveAble = false;
                };
            }

            _.getSwicths().each(function(i, obj){
                $.addEventListener(obj, 'mousedown', function() {
                    _.setTopMost();
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
        this.caches = {};
        this.keys = [];
    }

    Dialog.prototype = {
        buildId: function(id) {
            return 'd_' + id;
        },
        get: function(id) {
            id = this.buildId(id);
            if($.containsKey(this.caches, id)) {
                return this.caches[id];
            }
            return null;
        },
        getTop: function() {
            var max = -1, key = '';
            for(var i=this.keys.length-1; i>=0; i--) {
                var k = this.keys[i];
                var d = this.caches[k];
                //console.log('d.opt.zindex: ', i, d.opt.zindex);
                if(null !== d && !d.closed && d.opt.zindex > max) {
                    max = d.opt.zindex;
                    key = k;
                }
            }
            return max >= 0 ? this.caches[key] : null;
        },
        getLast: function() {
            for(var i=this.keys.length-1; i>=0; i--) {
                var key = this.keys[i];
                var d = this.caches[key];
                if(null !== d && !d.closed) {
                    return d;
                }
            }
            return null;
        },
        set: function(id, dialog) {
            id = this.buildId(id);
            this.keys.push(id);
            this.caches[id] = dialog;
            return dialog;
        },
        show: function(content, title, options, type) {
            if($.isObject(content)) {
                options = content;
                content = '';
                title = '';
            } else if($.isObject(title)) {
                options = title;
                title = '';
            }
            if(typeof type === 'string') {
                options.type = type;
            }

            var opt = $.extend({
                id: 0
            }, options);

            var d = this.get(opt.id);
            if(d === null) {
                d = this.set(opt.id, new MyDialog(content, title, options));
            } else {
                d.update(content, title, options);
            }

            return d;
        },
        remove: function(id) {
            id = this.buildId(id);
            if($.containsKey(this.caches, id)) {
                delete this.caches[id];
            }
            var idx = this.keys.indexOf(id);
            if(idx >= 0) {
                this.keys.splice(idx, 1);
            }
        },
        closeAll: function() {
            for(var k in this.caches) {
                var d = this.caches[k];
                if(d && !d.closed) {
                    d.close();
                }
            }
        },
        setEscClose: function() {
            if(this.escClose) {
                return false;
            }
            this.escClose = true;
            $.addEventListener(document, 'keyup', function(e) {
                if(KEY_CODE.Esc === $.getKeyCode(e)) {
                    var d = $.Dialog.getLast();
                    if(d !== null && !d.closed) {
                        d.close();
                    }
                }
            });
        }
    };

    $.Dialog = new Dialog();

    $.extend({
        alert: function(content, title, options){
            return $.Dialog.show(content, title, options);
        },
        confirm: function(content, title, options){

        },
        msg: function(content, options){

        },
        tips: function(content, options){

        },
        tooltip: function(content, options){
            return $.Dialog.show(content, undefined, options, 'tooltip');
        }
    });
}(OUI);