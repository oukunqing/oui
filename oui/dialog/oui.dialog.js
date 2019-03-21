!function($){
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
            group: '',
            type: 'alert', //alert,confirm,message,tooltip,window,iframe
            status: 'normal',
            zindex: _.buildZindex(),
            minWidth: '180px',
            minHeight: '160px',
            maxWidth: '100%',
            maxHeight: '100%',
            width: '300px',
            height: '200px',
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
            dragRangeLimit: true,                  //窗体拖动范围限制 true,false
            dragPosition: true,
            dragSize: true,
            maxAble: true,
            minAble: true,
            callback: null,
            parameter: null,
            buttons: $.DialogButtons.OKCancel,
            showTitle: true,
            showBottom: true,
            showClose: true,
            showMin: true,
            showMax: true

        }, options);

        console.log('_.opt:', _.opt, options);

        _.controls = {
            shade: null, container: null, box: null, 
            top: null, title: null, panel: null,
            body: null, content: null, iframe: null,
            bottom: null
        };

        _.buttons = {
            close: null, min: null, max: null
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
        hideDocOverflow: function (isShow) {
            if(isShow) {
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
            return this;
        },
        initial: function(options){
            return this.build(options);
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
            var _ = this, ctl = this.controls, opt = options;

            if(_.opt.lock) {
                _.hideDocOverflow();
            }

            _.identifier = 'oui-dialog-identifier-' + _.buildZindex();

            if(opt.type === 'tooltip') {
                //不需要遮罩层
                
            } else {
                if(opt.lock) {
                    //遮罩层
                    ctl.shade = document.createElement('div');
                    ctl.shade.className = 'oui-dialog-shade';
                    ctl.shade.style.zIndex = opt.zindex;

                    //对话框容器
                    ctl.container = document.createElement('div');
                    ctl.container.className = 'oui-dialog-container';
                    ctl.container.style.zIndex = opt.zindex;
                }
            }
            /*
            document.onkeypress = function(e) {
                console.log('onkeypress:', $.getKeyCode(e));
            }
            */

            //对话框
            ctl.box = document.createElement('div');
            ctl.box.className = 'oui-dialog';
            ctl.box.style.zIndex = opt.zindex;
            ctl.box.id = _.dialogId;

            ctl.box.cache = {};

            if(opt.showTitle) {
                ctl.top = _.buildTop(opt.title, ctl.box);
            }

            ctl.body = _.buildBody(opt.content, ctl.box);

            if(opt.showBottom) {
                ctl.bottom = _.buildBottom(ctl.box);
            }
            
            if(opt.type !== 'message' && opt.type !== 'tooltip') {
                _.setDragSize();
            }

            if(ctl.shade) {
                document.body.appendChild(ctl.shade);
            }

            if(ctl.container !== null) {
                ctl.container.appendChild(ctl.box);
                document.body.appendChild(ctl.container);
            } else {
                //$.addClass(ctl.box, 'oui-dialog-fixed');
                document.body.appendChild(ctl.box);
            }

            _.setSize({type: _.opt.status, width: _.opt.width, height: _.opt.height});
            _.setPosition({pos: _.opt.position, x: _.opt.x, y: _.opt.y});

            _.setCache().dragPosition().dragSize();

            if(opt.clickBgClose.in(['dblclick', 'click'])) {
                $.addEventListener(ctl.container, opt.clickBgClose, function() {
                    _.close();
                });
            }

            if(opt.escClose) {
                $.Dialog.setEscClose();
            }
            $.Dialog.setWindowResize();

            if(opt.topMost) {
                $.addEventListener(ctl.box, 'mousedown', function() {
                    _.setTopMost();
                });
            }

            $.addEventListener(ctl.box, 'click', function(){
                $.cancelBubble();
            });

            $.addEventListener(ctl.box, 'dblclick', function(){
                $.cancelBubble();
            });

            //this.setPosition(3);
            return this.buildCloseTiming();
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
        appendChild: function(elem, parentNode) {
            if($.isUndefined(parentNode)) {
                parentNode = this.controls.content;
            }
            if($.isElement(parentNode) && $.isElement(elem)) {
                parentNode.appendChild(elem);
            }
            return this;
        },
        buildTop: function(title, parentNode){
            var _ = this, p = _.opt;
            var elem = document.createElement('div');
            elem.className = 'top';

            $.addEventListener(elem, 'dblclick', function() {
                if(p.maxAble) {
                    _.max();
                }
                $.cancelBubble();
            });

            $.addEventListener(elem, 'mousedown', function() {
                if(p.topMost) {
                    _.setTopMost();
                }
                $.cancelBubble();
            });

            var div = document.createElement('div');
            div.className = 'title';
            div.innerHTML =  title || p.title;
            elem.appendChild(div);

            _.controls.title = div;

            var isMin = p.minAble && p.showMin,
                isMax = p.maxAble && p.showMax;

            var panel = document.createElement('div');
            panel.className = 'dialog-btn-panel';
            panel.innerHTML = (isMin ? '<a class="btn btn-min" code="min"></a>' : '')
                + (isMax || isMin? '<a class="btn btn-max" code="max"></a>' : '')
                + (p.closeAble && p.showClose ? '<a class="btn btn-close" code="close"></a>' : '');
            panel.style.cssText = 'float:right;';

            elem.appendChild(panel);

            _.controls.panel = panel;

            for(var i = 0; i < panel.childNodes.length; i++) {
                var obj = panel.childNodes[i], key = obj.getAttribute('code');
                _.buttons[key] = obj;
            }

            _.setEvent(panel.childNodes, 'click', false);

            return _.appendChild(elem, parentNode), elem;
        },
        buildCloseTiming: function() {
            var _ = this, op = _.opt;
            if(!op.autoClose) {
                return _;
            }
            if(_._closeTimingTimer) {
                window.clearInterval(_._closeTimingTimer);
            }
            var i = op.closeTiming / 100;
            if(i > 20) {
                this.controls.top.appendChild($.createElement('label', 'timing', function(elem) {
                    elem.innerHTML = '';
                    elem.className = 'timing';
                }));

                this._closeTimingTimer = window.setInterval(function(){
                    $('#timing').html((i--) / 10 + ' 秒后关闭');
                }, 100);
            }

            window.setTimeout(function() {
                _.close();
            }, op.closeTiming);

            return this;
        },
        buildBody: function(content, parentNode) {
            var _ = this, ctl = _.controls, elem = document.createElement('div');
            elem.className = 'body';

            ctl.content = _.buildContent(content, elem);

            if(ctl.iframe) {
                elem.style.overflow = 'hidden';
                ctl.content.style.padding = '0px';
            }

            $.addEventListener(elem, 'mousedown', function() {
                if(_.opt.topMost) {
                    _.setTopMost();
                }
                $.cancelBubble();
            });
            return _.appendChild(elem, parentNode), elem;
        },
        buildContent: function(content, parentNode) {
            var _ = this, ctl = this.controls, op = this.opt, elem = ctl.content;
            if(elem === null) {
                elem = document.createElement('div');
                elem.className = 'content';
            }
            if(['url', 'iframe', 'load'].indexOf(op.type) >= 0) {
                if(elem){
                    console.log('tagName: ', elem.tagName);
                }
                elem.innerHTML = _.buildIframe(content);
                ctl.iframe = elem.childNodes[0] || null;
            } else {
                elem.innerHTML = content;
            }
            return _.appendChild(elem, parentNode || null), elem;
        },
        buildIframe: function(url) {
            var height = '100%';
            return ['<iframe class="iframe" width="100%"',
                ' id="{0}-iframe" height="{1}" src="{2}"',
                ' frameborder="0" scrolling="auto"></iframe>'
            ].join('').format(this.dialogId, height, url.setUrlParam());
        },
        buildBottom: function(parentNode) {
            var _ = this, elem = document.createElement('div');
            elem.className = 'bottom-panel';

            var div = document.createElement('div');
            div.className = 'bottom';
            div.innerHTML = _.buildButtons();
            elem.appendChild(div);

            for(var i = 0; i < div.childNodes.length; i++) {
                var obj = div.childNodes[i], key = obj.getAttribute('code');
                _.buttons[key] = obj;
            }

            $.addEventListener(elem, 'mousedown', function() {
                if(_.opt.topMost) {
                    _.setTopMost();
                }
                $.cancelBubble();
            });

            _.setEvent(div.childNodes, 'click', true).setShortcutKeyEvent(div.childNodes);

            return _.appendChild(elem, parentNode), elem;
        },
        buildButtons: function() {
            var _ = this, keys = $.DialogButtons, html = [];
            if(!$.isNumber(_.opt.buttons) || _.opt.button < 0) {
                return '';
            }
            var keys = ButtonMaps[_.opt.buttons];
            for(var i in keys) {
                var config = ButtonConfig[keys[i]];
                if(config) {
                    html.push('<a class="btn {css} btn-mr" code="{code}" result="{result}" href="{{0}}" shortcut-key="{skey}">{text}</a>'.format(config));
                }
            }
            return html.join('').format('javascript:void(0);');
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
            var _ = this, ctl = this.controls, display = isHide ? 'none' : '';

            if(isHide && !_.opt.closeAble) {
                return this;
            }

            this.closed = isHide || false;

            if(!$.isUndefined(content)) {
                ctl.body.innerHTML = content;
            }
            if(!$.isUndefined(title)) {
                ctl.title.innerHTML = title;
            }

            if(ctl.container) {
                ctl.container.style.display = display;
            } else {
                ctl.box.style.display = display;
            }
            if(ctl.shade) {
                ctl.shade.style.display = display;
            }

            if(_.opt.lock && !isHide) {
                _.hideDocOverflow(isHide);
            }

            //return _.hideDocOverflow(isHide), _;
            return _;
        },
        hide: function() {
            return this.show(true);
        },
        close: function(action, dialogResult) {
            var _ = this, ctl = this.controls;

            if(!$.isString(action)) {
                action = 'None';
            }
            if(!$.isNumber(dialogResult)) {
                dialogResult = DialogResult.None;
            }
            if(!_.opt.closeAble || _.closed) {
                return false;
            }
            document.body.removeChild(ctl.container || ctl.box);

            if(ctl.shade) {
                document.body.removeChild(ctl.shade);
            }
            $.Dialog.remove(_.opt.id);

            this.closed = true;

            return _.callback(action, dialogResult).hideDocOverflow(true).dispose();
        },
        callback: function(action, dialogResult) {
            var _ = this, op = this.opt;
            var dr = {}, parameter = op.parameter || op.param;
            dr[action] = dialogResult;
            if($.isFunction(op.success)) {
                if([1, 6].indexOf(dialogResult) >= 0) {
                    op.success(dr, _, parameter);
                }
            } else if($.isFunction(op.callback)) {
                op.callback(dr, _, parameter);
            }
            return _;
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

            var _ = this, ctl = this.controls;
            if(ctl.content) {
                if(opt.width === 'auto') {
                    ctl.box.style.width = 'auto';
                    ctl.body.style.width = 'auto';
                    ctl.content.style.width = 'auto';
                }
                if(opt.height === 'auto') {
                    ctl.box.style.height = 'auto';
                    ctl.body.style.height = 'auto';
                    ctl.content.style.height = 'auto';
                }
                ctl.content = _.buildContent(opt.content);

                if(ctl.title && opt.title) {
                    ctl.title.innerHTML = opt.title;
                }
                _.setBodySize().setCache();

                if(!opt.fixed) {
                    _.setPosition();
                }
            }

            return _;
        },
        append: function(content, title, options) {
            if(!this.controls.content) {
                return this;
            }
            var html = this.controls.content.innerHTML;
            return this.update(html + content, title, options);
        },
        insert: function(content, title, options) {
            if(!this.controls.content) {
                return this;
            }
            var html = this.controls.content.innerHTML;
            return this.update(content + html, title, options);
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
            if(code === 'min') {
                _.min();
            } else if(code === 'max') {
                _.max();
            } else if(code === 'close') {
                _.close();
            } else {
                var result = parseInt(obj.getAttribute('result'), 10);
                _.close(code, result);
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
                    $.cancelBubble();
                });

                if(keypress) {
                    $.addEventListener(obj, 'keypress', function(e){
                        var keyCode = $.getKeyCode(e);
                        var strKeyCode = String.fromCharCode(keyCode).toUpperCase();
                        var shortcutKey = this.getAttribute('shortcut-key') || '';
                        console.log('keypress: ', keyCode, strKeyCode, shortcutKey);
                        //if(32 == keyCode || (shkey >= 3 && strKeyCode == cg.shortcutKey[2].toUpperCase())){FuncCancel();}
                        // 判断是否为空格键 或 是否按下快捷键
                        if(KEY_CODE.Space === keyCode || strKeyCode === shortcutKey) {
                            _.action(this);
                        }
                    });
                }
            }
            return _;
        },
        setShortcutKeyEvent: function(controls) {
            var _ = this;
            _.dic = {};
            for(var i = 0; i < controls.length; i++) {
                var obj = controls[i];
                if(obj.tagName !== 'A') {
                    continue;
                }
                var shortcutKey = obj.getAttribute('shortcut-key') || '';
                if(shortcutKey) {
                    _.dic[shortcutKey] = obj;
                }
            }

            $.addEventListener(document, 'keypress', function(e){
                if(!e.shiftKey) {
                    return false;
                }
                var keyCode = $.getKeyCode(e),
                    strKeyCode = String.fromCharCode(keyCode).toUpperCase(),
                    btn = _.dic[strKeyCode];

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

            this.lastSize = this.opt.height === 'auto' ? size : $.extend({
                top: obj.offsetTop,
                left: obj.offsetLeft,
                right: (obj.offsetLeft + obj.offsetWidth),
                bottom: (obj.offsetTop + obj.offsetHeight)
            }, size);

            return this;
        },
        setSize: function(options) {
            var _ = this, ctl = _.controls, _btns = _.buttons, obj = ctl.box, par = {};
            var isSetBodySize = false, isFullScreen = false;

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

            if(opt.type === '' || (isNaN(opt.width) && isNaN(opt.height)) || _.getStatus() === opt.type) {
                return this;
            }

            console.log('setSize:', options);

            if(_.status.normal) {
                _.setCache();
            }

            if(_.status.max && opt.type !== 'max' && ctl.container) {
                $.removeClass(ctl.container, 'dialog-overflow-hidden');
            } else if(opt.type !== 'min') {
                $.removeClass(ctl.bottom, 'display-none');
            }
            if(opt.type !== 'max' && !_.opt.lock) {
                _.hideDocOverflow(true);
            }

            if(opt.type === 'max') {
                if(!_.opt.maxAble) {
                    return _;
                }
                var scrollTop = _.opt.lock ? 0 : document.documentElement.scrollTop;
                par = {width: '100%', height: '100%', top: scrollTop, left: 0, right: 0, bottom: 0};
                isSetBodySize = true;
                isFullScreen = true;

                $.addClass(obj, 'oui-dialog-max').addClass(_btns.max, 'btn-normal');

                if(_.controls.container) {
                    $.addClass(ctl.container, 'dialog-overflow-hidden');
                }
                if(_.status.min) {
                    $.removeClass(obj, 'oui-dialog-min');
                }

                _.hideDocOverflow().hideSwitch().setStatus('max');
            } else if(opt.type === 'min') {
                if(!_.opt.minAble) {
                    return _;
                }
                var minW = parseInt(_.opt.minWidth, 10), minH = 36;
                if(isNaN(minW)) { minW = 180; }

                par = {width: minW, height: minH};
                $.addClass(ctl.bottom, 'display-none').addClass(obj, 'oui-dialog-min').removeClass(_btns.max, 'btn-normal');
                if(_.status.max) {
                    $.removeClass(obj, 'oui-dialog-max');
                }
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
                        $.setStyle(ctl.box, _.lastSize, 'px');
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
                _.setBodySize(isFullScreen);
            }
            return _;
        },
        setDragSize: function(dir) {
            var _ = this, ctl = this.controls;
            var arr = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
            
            dir = $.isString(dir) ? [dir] : arr;

            if(_.opt.dragSize) {                
                for(var i in dir) {
                    ctl.box.appendChild(_.buildSwitch(dir[i]));
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
                newTop = 0,
                x = 0,
                y = 0;

            var mw = parseInt(_.opt.maxWidth, 10);
            if(_.opt.maxWidth !== '100%' && !isNaN(mw) && newWidth > mw) {
                newWidth = mw;
            } else {
                x = opt.x;
            }

            var mh = parseInt(_.opt.maxHeight, 10);
            if(_.opt.maxHeight !== '100%' && !isNaN(mh) && newHeight > mh) {
                newHeight = mh;
            } else {
                y = opt.y;
            }

            if(opt.dir === 'center') {
                x = parseInt(Math.abs(x) / 2, 10);
                y = parseInt(Math.abs(y) / 2, 10);
                newLeft = dp.left - opt.x;
                newTop = dp.top - opt.y;
            } else {
                x *= opt.dir.indexOf('left') >= 0 ? -1 : 1;
                y *= opt.dir.indexOf('top') >= 0 ? -1 : 1;
                newLeft = (dp.left + x + newWidth) > dp.right ? dp.right - newWidth : dp.left + x;
                newTop = (dp.top + y + newHeight) > dp.bottom ? dp.bottom - newHeight : dp.top + y;
            }

            console.log(newWidth, newHeight, x, y, newLeft, newTop);

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
        setBodySize: function(isFullScreen) {
            var _ = this, opt = _.opt, obj = _.controls.box, ctl = _.controls, bs = $.getBodySize();

            var titleHeight = ctl.top ? ctl.top.offsetHeight + 1 : 0, 
                bottomHeight = ctl.bottom ? ctl.bottom.offsetHeight + 1 : 0,
                paddingHeight = parseInt('0' + $.getElementStyle(obj, 'paddingTop'), 10),
                conPaddingHeight = parseInt('0' + $.getElementStyle(ctl.content, 'padding'), 10),
                boxWidth = obj.clientWidth,
                boxHeight = obj.clientHeight;

            if(opt.height !== 'auto') {
                if(boxHeight < opt.height) {
                    boxHeight = opt.height;
                    obj.style.height = boxHeight + 'px';
                } else if(!isFullScreen) {
                    if(isNumberSize(opt.maxHeight)) {
                        var mh = parseInt(opt.maxHeight, 10);
                        if(boxHeight > mh) {
                            boxHeight = mh;
                            obj.style.height = boxHeight + 'px';
                        }
                    }
                }
            }
            if(boxWidth > bs.width) {
                boxWidth = bs.width - 20;
                obj.style.width = boxWidth + 'px';
            }

            if(boxHeight > bs.height) {
                boxHeight = bs.height - 20;
                obj.style.height = boxHeight + 'px';
            }

            boxWidth = obj.clientWidth;
            boxHeight = obj.clientHeight;

            var size = {
                width: '100%',
                height: (boxHeight - titleHeight - bottomHeight - paddingHeight * 2) + 'px'
            };

            if(ctl.bottom){
                size.marginBottom = ctl.bottom.offsetHeight + 'px';
            }
            if(ctl.iframe) {
                $.setStyle(ctl.iframe, {height: size.height});
            }
            return $.setStyle(ctl.body, size), _;
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
        checkPosition: function(key, pos) {
            if(!$.isNumber(pos)) {
                pos = this.opt.position;
            }
            var keys = {
                top: [1,2,3], middle: [4,5,6], bottom: [7,8,9],
                left: [1,4,7], center: [2,5,8], right: [3,6,9],
                custom: [0, 10]
            };
            return (keys[key] || [0]).indexOf(pos) >= 0;
        },
        setPosition: function(options) {
            var _ = this, obj = _.controls.box;

            if($.isString(options) || $.isNumber(options)) {
                options = { pos: options };
            } else if($.isUndefined(options)) {
                options = { pos: _.opt.position };
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
            console.log('setPosition: ', options, opt);
            
            var bs = $.getBodySize(),
                cp = $.getScrollPosition(),
                width = obj.offsetWidth,
                height = obj.offsetHeight,
                posX = _.checkPosition('center', opt.pos) ? bs.width / 2 - width / 2 : opt.x,
                posY = _.checkPosition('middle', opt.pos) ? bs.height / 2 - height / 2 : opt.y;

            if(!_.opt.lock) {
                if(_.checkPosition('center', opt.pos)) {
                    posX += cp.left;
                } else {
                    posX += _.checkPosition('right', opt.pos) ? - cp.left : cp.left;
                }
                if(_.checkPosition('middle', opt.pos)) {
                    posY += cp.top;
                } else {
                    posY += _.checkPosition('bottom', opt.pos) ? - cp.top : cp.top;
                }
            }

            //清除cssText上下左右4个样式
            _.clearPositionStyle(obj);

            switch(opt.pos) {
                case 0:
                case 1:
                case 2:
                case 4:
                case 5:
                case 10:    //custom
                    $.setStyle(obj, {left: posX, top: posY}, 'px');
                    break;
                case 3:
                case 6:
                    $.setStyle(obj, {right: posX,  top: posY}, 'px');
                    break;
                case 7:
                case 8:
                    $.setStyle(obj, {left: posX, bottom: posY}, 'px');
                    break;
                case 9:
                    $.setStyle(obj, {right: posX, bottom: posY}, 'px');
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
            var ctl = this.controls;
            if(typeof zindex !== 'number') {
                zindex = this.buildZindex();
            }
            if(ctl.container) {
                ctl.container.style.zIndex = zindex;
            } else {
                ctl.box.style.zIndex = zindex;
            }
            return this.setOption('zindex', zindex);
        },
        dragToNormal: function(evt, bs, moveX, moveY) {
            var _ = this, ctl = _.controls, obj = ctl.box;

            //对话框最大化时，拖动对话框，先切换到标准模式（尺寸、定位）
            _.setSize({type: 'normal'})

            var offsetRateX = (evt.clientX / bs.width),
                offsetX = evt.clientX,
                offsetY = evt.clientY - moveY,
                btnPanelWidth = ctl.panel ? ctl.panel.offsetWidth : 0;

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
                op = this.opt,
                ctl = this.controls,
                obj = ctl.box,
                bs = $.getBodySize(),
                clientWidth = bs.width,
                clientHeight = bs.height,
                docMouseMoveEvent = document.onmousemove,
                docMouseUpEvent = document.onmouseup;

            function moveDialog() {
                $.cancelBubble();

                if(!op.dragPosition) {
                    return false;
                }
                var evt = $.getEvent(),
                    cp = $.getScrollPosition(),
                    moveX = evt.clientX,
                    moveY = evt.clientY,
                    moveTop = obj.offsetTop,
                    moveLeft = obj.offsetLeft,
                    moveAble = true,
                    isToNormal = false,
                    posX = posXOld = evt.clientX,
                    posY = posYOld = evt.clientY;
                
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

                    if(op.dragRangeLimit) {
                        if(posX < 0) {
                            posX = 0;
                        }
                        if(posY < 0) {
                            posY = 0;
                        }
                        if((posX + w) > bs.width) {
                            posX = bs.width - w;
                        }
                        if((posY + h) > bs.height) {
                            posY = bs.height - h;
                        }
                    }

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

            if(op.showTitle && ctl.top) {
                $.addEventListener(ctl.top, 'mousedown', function(){
                    moveDialog();
                });
            } else {
                $.addEventListener([ctl.box, ctl.body, ctl.content], 'mousedown', function() {
                    moveDialog();
                });
            }

            return this;
        },
        dragSize: function() {
            var _ = this,
                op = this.opt,
                obj = _.controls.box,
                docMouseMoveEvent = document.onmousemove,
                docMouseUpEvent = document.onmouseup;

            function _dragSize(dir) {
                $.cancelBubble();

                if(!op.dragSize) {
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
                    minWidth: parseInt(op.minWidth, 10),
                    minHeight: parseInt(op.minHeight, 10)
                };
                docMouseMoveEvent = function() {
                    if(!moveAble) {
                        return false;
                    }
                    var e = $.getEvent(),
                        x = (e.clientX - moveX) * (dir.indexOf('left') >= 0 ? -1 : 1), 
                        y = (e.clientY - moveY) * (dir.indexOf('top') >= 0 ? -1 : 1);

                    _.setScale({ dir: dir, x: x, y: y }, true, par);
                };


                if(_.controls.iframe) {
                    _.controls.iframe.onmousemove = docMouseMoveEvent;
                    console.log('iframe:', window.frames[_.dialogId+'-iframe'].document);
                }

                document.onmousemove = docMouseMoveEvent;/*function(){
                    if(!moveAble) {
                        return false;
                    }
                    var e = $.getEvent(),
                        x = (e.clientX - moveX) * (dir.indexOf('left') >= 0 ? -1 : 1), 
                        y = (e.clientY - moveY) * (dir.indexOf('top') >= 0 ? -1 : 1);

                    _.setScale({ dir: dir, x: x, y: y }, true, par);
                };*/
                document.onmouseup = _.controls.box.onmouseup = function(){
                    moveAble = false;
                };
            }

            _.getSwicths().each(function(i, obj){
                $.addEventListener(obj, 'mousedown', function() {
                    _.setTopMost();
                    _dragSize(obj.pos);
                });
            });
            return this;
        }
    };

    var DialogType = {

    };



    var KEY_CODE = {
        Enter: 13,
        Esc: 27,
        Space: 32
    },
    DialogResult = {
        None: 0,
        OK: 1,
        Cancel: 2,
        Abort: 3,
        Retry: 4,
        Ignore: 5,
        Yes: 6,
        No: 7
    },
    ButtonConfig = {
        None: { code: 'None', text: '\u5173\u95ed', result: 0, skey: '', css: 'btn-default'},
        OK: { code: 'OK', text: '\u786e\u5b9a', result: 1, skey: 'Y', css: 'btn-primary' },
        Cancel: { code: 'Cancel', text: '\u53d6\u6d88', result: 2, skey: 'N', css: 'btn-default' },
        Abort: { code: 'Abort', text: '\u4e2d\u6b62', result: 3, skey: 'A', css: 'btn-danger' },
        Retry: { code: 'Retry', text: '\u91cd\u8bd5', result: 4, skey: 'R', css: 'btn-warning' }, 
        Ignore: { code: 'Ignore', text: '\u5ffd\u7565', result: 5, skey: 'I', css: 'btn-default' },
        Yes: { code: 'Yes', text: '\u662f', result: 6, skey: 'Y', css: 'btn-primary' },
        No: { code: 'No', text: '\u5426', result: 7, skey: 'N', css: 'btn-default' }
    },
    DialogButtons = {
        None: -1,
        OK: 0,
        OKCancel: 1,
        AbortRetryIgnore: 2,
        YesNoCancel: 3,
        YesNo: 4,
        RetryCancel: 5
    },
    ButtonMaps = [
        ['OK'],
        ['OK', 'Cancel'],
        ['Abort', 'Retry', 'Ignore'],
        ['Yes', 'No', 'Cancel'],
        ['Yes', 'No'],
        ['Retry', 'Cancel']
    ];

    $.DialogButtons = DialogButtons;

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

    function isNumberSize(num) {
        return num !== 'auto' && num !== '100%' && !isNaN(parseInt(num, 10));
    }
 

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
            if(!$.isObject(options)) {
                options = {};
            }
            if(typeof type === 'string') {
                options.type = type;
            }
            var opt = {id: 0};
            switch(options.type) {
                case 'alert':
                    opt.buttons = DialogButtons.OK;
                    break;
                case 'confirm':
                    opt.buttons = DialogButtons.OKCancel;
                    break;
                case 'dialog':
                    break;
                case 'url':
                case 'load':
                    opt.showBottom = false;
                    break;
                default:
                    opt.buttons = DialogButtons.None;
                    opt.showTitle = opt.showBottom = opt.dragSize = false;
                    opt.height = opt.minHeight = 'auto';
                    opt.minAble = opt.maxAble = false;
                    break;
            }
            var d = this.get($.extend(opt, options).id);
            if(d === null) {
                d = this.set(opt.id, new MyDialog(content, title, opt));
            } else {
                d.update(content, title, opt);
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
        },
        setWindowResize: function() {
            var _ = this;
            if(_.resizeEvent) {
                return false;
            }
            _.resizeEvent = true;
            $.addEventListener(window, 'resize', function(e) {
                for(var i=_.keys.length-1; i>=0; i--) {
                    var key = _.keys[i];
                    var d = _.caches[key];
                    if(null !== d && !d.closed && d.checkPosition('center') || d.checkPosition('middle')) {
                        d.setPosition();
                    }
                }
            });
        }
    };

    $.Dialog = new Dialog();

    $.extend({
        dialog: function(content, title, options) {
            return $.Dialog.show(content, title, options, 'dialog');
        },
        alert: function(content, title, options){
            return $.Dialog.show(content, title, options, 'alert');
        },
        confirm: function(content, title, options){
            return $.Dialog.show(content, title, options, 'confirm');
        },
        message: function(content, options){
            return $.Dialog.show(content, undefined, options, 'message');
        },
        msg: function(content, options){
            return $.Dialog.show(content, undefined, options, 'msg');
        },
        tips: function(content, options){
            return $.Dialog.show(content, undefined, options, 'tips');
        },
        tooltip: function(content, options){
            return $.Dialog.show(content, undefined, options, 'tooltip');
        }
    });

    $.extend($.dialog, {
        win: function(content, title, options){
            return $.Dialog.show(content, title, options, 'dialog');
        },
        load: function(url, title, options) {
            return $.Dialog.show(url, title, options, 'load');
        }
    });
}(OUI);