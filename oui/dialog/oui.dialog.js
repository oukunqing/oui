
/*
 @Title: OUI
 @Description：JS通用代码库
 @Author: oukunqing
 @License：MIT
*/

!function ($) {

    var dialogIndex = 1,
        KEY_CODE = {
            Enter: 13,
            Esc: 27,
            Space: 32
        },
        DialogStatus = {
            Close: 'close',
            Max: 'max',
            Min: 'min',
            Normal: 'normal'
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
        DialogButtons = {
            None: -1,
            OK: 0,
            OKCancel: 1,
            AbortRetryIgnore: 2,
            YesNoCancel: 3,
            YesNo: 4,
            RetryCancel: 5
        },
        DialogIcons = {
            None: 0,
            Hand: 16,
            Stop: 16,
            Error: 16,
            Warning: 48,
            Question: 32,
            Exclamation: 48,
            Warning: 48,
            Asterisk: 64,
            Infomation: 64
        },
        ButtonConfig = {
            None: { code: 'None', text: '\u5173\u95ed', result: 0, skey: '', css: 'btn-default' },
            OK: { code: 'OK', text: '\u786e\u5b9a', result: 1, skey: 'Y', css: 'btn-primary' },
            Cancel: { code: 'Cancel', text: '\u53d6\u6d88', result: 2, skey: 'N', css: 'btn-default' },
            Abort: { code: 'Abort', text: '\u4e2d\u6b62', result: 3, skey: 'A', css: 'btn-danger' },
            Retry: { code: 'Retry', text: '\u91cd\u8bd5', result: 4, skey: 'R', css: 'btn-warning' },
            Ignore: { code: 'Ignore', text: '\u5ffd\u7565', result: 5, skey: 'I', css: 'btn-default' },
            Yes: { code: 'Yes', text: '\u662f', result: 6, skey: 'Y', css: 'btn-primary' },
            No: { code: 'No', text: '\u5426', result: 7, skey: 'N', css: 'btn-default' }
        },
        ButtonMaps = [
            ['OK'],
            ['OK', 'Cancel'],
            ['Abort', 'Retry', 'Ignore'],
            ['Yes', 'No', 'Cancel'],
            ['Yes', 'No'],
            ['Retry', 'Cancel']
        ],
        checkStyleUnit = function (s) {
            if ($.isString(s, true)) {
                s = s.toLowerCase();
                var arr = ['px', '%', 'em', 'auto', 'pt'];
                for (var i in arr) {
                    if (s.endsWith(arr[i])) {
                        return s;
                    }
                }
                return s + 'px';
            } else if ($.isNumber(s)) {
                return s + 'px';
            }
            return s;
        },
        isNumberSize = function (num) {
            return num !== 'auto' && num !== '100%' && !isNaN(parseInt(num, 10));
        },
        getTs = function (start, len) {
            var tick = new Date().getTime();
            return parseInt(('' + tick).substr(start || 4, len || 8), 10);
        },
        getId = function (id) {
            if (!$.isString(id, true) && !$.isNumber(id)) {
                return getTs(5, 8) + '-' + dialogIndex++;
            }
            return id;
        },
        buildId = function (id) {
            return 'out-dialog-' + id;
        },
        buildZindex = function (start, len) {
            return getTs(start, len);
        },
        checkTiming = function(opt) {
            if(!$.isNumber(opt.closeTiming)) {
                opt.closeTiming = opt.timeout || opt.timing || opt.time;
            }
            opt.closeTiming = Math.abs(parseInt('0' + opt.closeTiming, 10));
            return opt;
        },
        checkOptions = function (content, title, opt) {
            var host = null, elem = null;
            if(content && $.isElement(content)) {
                elem = content;
                content = '';
            }
            if (content && $.isObject(content)) {
                opt = content;
                content = title = '';
            } else if (title && $.isObject(title) && !$.isElement(title)) {
                opt = title;
                title = '';
            } else if ($.isElement(title)) {
                host = title;
            }
            if (!$.isObject(opt)) {
                opt = {};
            }
            opt.element = elem || opt.element || undefined;
            opt.content = content || opt.content || undefined;
            opt.title = title || opt.title || undefined;
            opt.host = host || opt.host || undefined;

            return checkTiming(opt);
        },
        checkType = function (type, isBuild) {
            if (!$.isString(type, true) && !isBuild) {
                return type;
            }
            if (['message', 'msg'].indexOf(type) >= 0) {
                return 'message';
            } else if (['tooltip', 'tips'].indexOf(type) >= 0) {
                return 'tooltip';
            }
            return type || (isBuild ? 'dialog' : '');
        },
        toCssText = function (styles, type) {
            return $.toCssText(styles);
        },
        hasEvent = function(elem) {
            var keys = ['onclick', 'ondblclick', 'mousedown'], attr;
            for(var i in keys) {
                attr = elem.getAttribute(keys[i]);
                if(attr) {
                    return true;
                }
            }
            return false;
        },
        isPlainText = function(obj) {
            var childs = obj.getElementsByTagName('*'), 
                len = childs.length,
                pass = ['BR', 'IFRAME', 'P', 'FONT'],
                tags = ['INPUT', 'A', 'TEXTAREA', 'BUTTON'],
                isText = true,
                elem, tag, attr;

            if(len === 0) {
                return isText;
            }
            for(var i = 0; i < len; i++) {
                elem = childs[i];
                tag = elem.tagName;
                if(pass.indexOf(tag) >= 0) {
                    continue;
                }
                if(tags.indexOf(tag) >= 0 || hasEvent(elem)) {
                    isText = false;
                    break;
                }
            }
            return isText;
        };

    $.DialogButtons = DialogButtons;

    var thisFilePath = $.getScriptSelfPath(true);
    //先加载样式文件
    $.loadLinkStyle($.getFilePath(thisFilePath) + $.getFileName(thisFilePath, true).replace('.min', '') + '.css');

    function MyDialog(content, title, options) {
        var _ = this, op = checkOptions(content, title, options);
        _.options = _.opt = $.extend({
            id: null,
            group: '',
            type: 'alert', //alert,confirm,message,tooltip,window,iframe
            status: 'normal',
            zindex: buildZindex(),
            minWidth: '192px',
            minHeight: '128px',
            maxWidth: '100%',
            maxHeight: '100%',
            width: '400px',
            height: '240px',
            opacity: null,
            lock: true,                             //是否锁屏
            title: '\u6807\u9898\u680f',
            content: '',        //文字内容
            url: '',            //加载的URL
            element: null,      //加载的Element元素
            loading: '正在努力加载，请稍候',          //loading提示文字
            position: 5,
            x: 0,
            y: 0,
            host: null,             //宿主控件，用于 tooltip
            fixed: false,
            topMost: false,
            closeAble: true,
            clickBgClose: null,     //'dblclick', // dblclick | click
            escClose: false,
            autoClose: false,
            closeTiming: 5000,      // closeTiming timeout time timing 四个字段
            showTimer: false,       // 是否显示定时关闭倒计时
            dragRangeLimit: true,                  //窗体拖动范围限制 true,false
            dragPosition: true,
            dragSize: true,
            maxAble: true,
            minAble: true,
            callback: null,
            success: null,
            parameter: null,
            buttons: DialogButtons.OKCancel,
            buttonPosition: 'center',               //按钮位置 left center right
            showTitle: true,
            showBottom: true,
            showClose: true,
            showMin: true,
            showMax: true,
            cancelBubble: false,                    //是否阻止背景层事件冒泡
            dialogStyle: '',        //对话框样式
            bodyStyle: '',          //主体样式
            contentStyle: '',       //内容样式
            topStyle: '',           //顶部样式
            titleStyle: '',         //标题样式
            bottomStyle: ''         //底部样式
        }, op);

        _.controls = {
            shade: null, container: null, box: null,
            top: null, title: null, panel: null,
            body: null, content: null, loading: null,
            iframe: null, iframeShade: null,
            bottom: null
        };

        _.btns = { close: null, min: null, max: null };
        _.buttons = {};

        _.events = {
            btnMouseDown: false,
            dragingSize: false
        };

        _.status = {
            min: false, max: false, normal: false
        };

        // 定时器对象组
        _.timer = {};

        _.lastStatus = ''; //normal
        _.closed = false;

        _.initial(_.opt);
    }

    MyDialog.prototype = {
        hideDocOverflow: function (isShow) {
            if (isShow) {
                if (this._overflow !== 'hidden') {
                    document.body.style.overflow = this._overflow;
                }
            } else {
                var overflow = document.body.style.overflow;
                if (overflow !== 'hidden') {
                    document.body.style.overflow = 'hidden';
                    this._overflow = overflow;
                }
            }
            return this;
        },
        initial: function (opt) {
            this.dialogId = buildId(opt.id);
            opt.type = checkType(opt.type, true);

            if (!opt.showTitle && !opt.showBottom && !opt.lock &&
                $.isBoolean(opt.closeAble, true) &&
                opt.type !== 'tooltip') {
                opt.escClose = true;
                //opt.clickBgClose = opt.clickBgClose || 'click';
            }
            if(opt.lock) {
                opt.fixed = false;
            }

            return this.build(opt);
        },
        isShow: function (key) {
            switch (key) {
                case 'shade':
                    break;
                case 'bottom':
                    break;
            }
            return true;
        },
        isDialog: function (obj) {
            if (null !== obj && obj.identifier.startsWith('oui-dialog-identifier-')) {
                return true;
            }
            return false;
        },
        isSelf: function (obj) {
            if (!this.isDialog(obj)) {
                return false;
            }
            return obj.opt.id === this.opt.id && obj.controls.box.id === this.controls.box.id;
        },
        getId: function () {
            return this.opt.id;
        },
        build: function (options) {
            var _ = this, ctls = this.controls, opt = options;

            _.identifier = 'oui-dialog-identifier-' + buildZindex();

            if (opt.type === 'tooltip') {
                //不需要遮罩层
                _.opt.lock = opt.lock = false;
                return _.buildTooltip(options);
            } else if (opt.lock) {
                _.hideDocOverflow().buildShade().buildContainer();
            }

            _.buildBox().buildTop(opt.title, ctls.box).buildBody(opt.content, ctls.box).buildBottom(ctls.box);

            if (opt.fixed) {
                ctls.box.style.position = 'fixed';
            }

            if (opt.dragSize) {
                _.setDragSize();
            }

            if (ctls.shade) {
                document.body.appendChild(ctls.shade);
            }

            if (ctls.container !== null) {
                ctls.container.appendChild(ctls.box);
                document.body.appendChild(ctls.container);
            } else {
                document.body.appendChild(ctls.box);
            }

            _.setSize({ type: _.opt.status, width: _.opt.width, height: _.opt.height });
            _.setPosition({ pos: _.opt.position, x: _.opt.x, y: _.opt.y });
            _.setCache().dragPosition().dragSize().setClickBgClose();

            if (opt.escClose) {
                DialogCenter.setEscClose();
            }
            DialogCenter.setWindowResize();

            if(!opt.showTitle || ctls.iframe || isPlainText(ctls.content)) {
                $.addListener([ctls.body, ctls.box], 'mousedown', function () {
                    _.setTopMost();
                });

                $.addListener(ctls.box, ['click', 'dblclick', 'mousedown'], function () {
                    $.cancelBubble();
                });
            }

            if (ctls.container && opt.cancelBubble) {
                // 取消背景层 mousedown，防止冒泡 document.mousedown
                $.addListener(ctls.container, ['click', 'mousedown'], function () {
                    $.cancelBubble();
                });
            }
            return this.buildCloseTiming().focus();
        },
        setClickBgClose: function () {
            var _ = this, op = _.opt, ctls = _.controls;
            if (!('' + op.clickBgClose).toLowerCase().in(['dblclick', 'click'])) {
                return this;
            }
            if (op.lock && ctls.container) {
                $.addListener(ctls.container, op.clickBgClose, function () {
                    _.close();
                });
            } else {
                window.setTimeout(function () {
                    DialogCenter.setClickDocClose(op.id, op.clickBgClose);
                }, 100);
            }
            return this;
        },
        getControls: function (className) {
            return $('#' + this.dialogId + ' ' + className);
        },
        appendChild: function (elem, parentNode) {
            if ($.isUndefined(parentNode)) {
                parentNode = this.controls.content;
            }
            $.appendChild(parentNode, elem);
            return this;
        },
        buildShade: function () {
            var _ = this, opt = _.opt, ctls = _.controls, css;
            if (!opt.lock) {
                return _;
            }
            ctls.shade = $.createElement('div');
            ctls.shade.className = 'oui-dialog-shade';
            ctls.shade.style.zIndex = opt.zindex;

            if ((css = toCssText({ opacity: opt.opacity }))) {
                ctls.shade.style.cssText = css;
            }
            return _;
        },
        buildContainer: function () {
            var _ = this, opt = _.opt, ctls = _.controls;
            if (!opt.lock) {
                return _;
            }
            ctls.container = $.createElement('div');
            ctls.container.className = 'oui-dialog-container';
            ctls.container.style.zIndex = this.opt.zindex;

            return _;
        },
        buildBox: function () {
            var _ = this, opt = _.opt, ctls = _.controls, css;
            ctls.box = $.createElement('div');
            ctls.box.className = 'oui-dialog';
            ctls.box.style.zIndex = opt.zindex;
            ctls.box.id = _.dialogId;

            if ((css = toCssText(opt.dialogStyle || opt.boxStyle, 'box'))) {
                ctls.box.style.cssText = css;
            }
            return _;
        },
        buildTop: function (title, parentNode) {
            var _ = this, opt = _.opt, ctls = _.controls, elem = $.createElement('div'), css;
            if (!opt.showTitle) {
                return _;
            }
            elem.className = 'top';

            if ((css = toCssText(opt.topStyle || opt.titleStyle, 'top'))) {
                elem.style.cssText = css;
            }

            $.addListener(elem, 'dblclick', function () {
                $.cancelBubble();
                if (opt.maxAble) {
                    _.max();
                }
            });

            $.addListener(elem, ['mousedown', 'click'], function () {
                $.cancelBubble();
                _.setTopMost();
            });

            var div = $.createElement('div');
            div.className = 'title';
            div.innerHTML = title || opt.title;
            if ((css = toCssText(opt.titleStyle, 'title'))) {
                div.style.cssText = css;
            }
            elem.appendChild((ctls.title = div));

            var isMin = opt.minAble && opt.showMin,
                isMax = opt.maxAble && opt.showMax;

            var panel = $.createElement('div');
            panel.className = 'dialog-btn-panel';
            panel.innerHTML = (isMin ? '<a class="btn btn-min" code="min" title="Minimize"></a>' : '')
                + (isMax || isMin ? '<a class="btn btn-max" code="max" title="Maximize"></a>' : '')
                + (opt.closeAble && opt.showClose ? '<a class="btn btn-close" code="close" title="Close"></a>' : '');
            panel.style.cssText = 'float:right;';

            elem.appendChild((ctls.panel = panel));

            for (var i = 0; i < panel.childNodes.length; i++) {
                var obj = panel.childNodes[i], key = obj.getAttribute('code');
                _.btns[key] = obj;
            }

            _.setButtonEvent(panel.childNodes, 'click', false);

            return _.appendChild((ctls.top = elem), parentNode), _;
        },
        buildCloseTiming: function () {
            var _ = this, opt = _.opt;
            if (!opt.autoClose || !opt.closeAble) {
                return _;
            }
            _.clearTimer();

            if(opt.showTimer) {
                var i = opt.closeTiming / 100;
                if (i > 20 && opt.showTitle) {
                    this.controls.top.appendChild($.createElement('label', 'timing', function (elem) {
                        elem.innerHTML = '';
                        elem.className = 'timing';
                    }));

                    _.timer.timingTimer = window.setInterval(function () {
                        $('#timing').html((i--) / 10 + ' 秒后关闭');
                    }, 100);
                }
            }

            _.timer.closeTimer = window.setInterval(function () {
                _.clearTimer();
                _.close();
            }, opt.closeTiming);

            return this;
        },
        clearTimer: function () {
            for (var i in this.timer) {
                if (this.timer[i]) {
                    window.clearInterval(this.timer[i]);
                    this.timer[i] = null;
                }
            }
            return this;
        },
        buildBody: function (content, parentNode) {
            var _ = this, opt = _.opt, ctls = _.controls, elem = $.createElement('div'), css;
            elem.className = 'body';

            if ((css = toCssText(opt.bodyStyle, 'body'))) {
                elem.style.cssText = css;
            }

            ctls.content = _.buildContent(elem);

            if (ctls.iframe) {
                //elem.style.overflow = 'hidden';
                //ctls.content.style.padding = '0px';
            }
            return _.appendChild((ctls.body = elem), parentNode), _;
        },
        buildContent: function (parentNode) {
            var _ = this, ctls = this.controls, opt = this.opt, elem = ctls.content;
            if (!elem) {
                elem = $.createElement('div');
                elem.className = 'content';
            }

            if ((css = toCssText(opt.contentStyle, 'content'))) {
                elem.style.cssText = css;
            }

            if (['url', 'iframe', 'load'].indexOf(opt.type) >= 0) {
                if($.isElement(opt.element) && opt.type === 'load') {
                    elem.innerHTML = opt.element.innerHTML || opt.element.value || '';
                } else {
                    elem.innerHTML = _.buildIframe(opt.content);
                    //隐藏dialog.body的滚动条（启用iframe滚动条，防止出现双滚动）
                    parentNode.style.overflow = 'hidden';
                    //清除dialog.content边距
                    elem.style.padding = '0px';
                    elem.style.margin = '0px';

                    var isLoaded = false, childs = elem.childNodes;

                    $.extend(ctls, {iframe: childs[0], iframeShade: childs[1], loading: childs[2]});

                    ctls.iframe.onload = ctls.iframe.onreadystatechange = function () {
                        if (!this.readyState || this.readyState == "complete") {
                            _.showIframeShade(false).showLoading(false);
                            isLoaded = true;
                        }
                    };
                    //若15秒还没有加载完成，则隐藏Iframe遮罩
                    window.setTimeout(function () {
                        if (!isLoaded) {
                            _.showIframeShade(false).showLoading(false);
                        }
                    }, 15 * 1000);
                }
            } else {
                elem.innerHTML = opt.content;
            }
            return _.appendChild(elem, parentNode || null), elem;
        },
        buildIframe: function (url) {
            var height = '100%';
            return ['<iframe class="iframe" width="100%"',
                ' id="{0}-iframe" height="{1}" src="{2}"',
                ' frameborder="0" scrolling="auto"></iframe>',
                '<div id="{0}-iframe-shade" class="iframe-shade"></div>',
                '<div id="{0}-loading" class="loading">正在努力加载，请稍候</div>'
            ].join('').format(this.dialogId, height, url.setUrlParam());
        },
        showIframeShade: function (isShow) {
            if (this.controls.iframeShade) {
                this.controls.iframeShade.style.display = isShow ? 'block' : 'none';
            }
            return this;
        },
        showLoading: function (isShow) {
            if (this.controls.loading) {
                this.controls.loading.style.display = isShow ? 'block' : 'none';
            }
            return this;
        },
        buildBottom: function (parentNode) {
            var _ = this, opt = _.opt, ctls = _.controls, elem = $.createElement('div'), css;
            if (!opt.showBottom) {
                return _;
            }
            elem.className = 'bottom-panel';

            if ((css = toCssText(opt.bottomStyle, 'bottom'))) {
                elem.style.cssText = css;
            }

            var div = $.createElement('div');
            div.className = 'bottom';
            div.innerHTML = _.buildButtons();
            if (['left', 'center', 'right'].indexOf(_.opt.buttonPosition) >= 0) {
                div.style.cssText = 'text-align:{0};'.format(_.opt.buttonPosition);
            }
            elem.appendChild(div);

            for (var i = 0; i < div.childNodes.length; i++) {
                var obj = div.childNodes[i], key = obj.getAttribute('code');
                _.buttons[key] = obj;
            }

            $.addListener(elem, ['mousedown','dblclick', 'click'], function () {
                $.cancelBubble();
                _.setTopMost();
            });

            _.setButtonEvent(div.childNodes, 'click', true).setShortcutKeyEvent(div.childNodes);

            return _.appendChild((ctls.bottom = elem), parentNode), _;
        },
        buildButtons: function () {
            var _ = this, keys = DialogButtons, html = [];
            if (!$.isNumber(_.opt.buttons) || _.opt.buttons < 0) {
                return '';
            }
            var keys = ButtonMaps[_.opt.buttons];
            for (var i in keys) {
                var config = ButtonConfig[keys[i]],
                    css = i > 0 ? ' btn-ml' : '';
                text = '<a class="btn {css}{1}" code="{code}" result="{result}" href="{{0}}" shortcut-key="{skey}">{text}</a>';
                if (config) {
                    html.push(text.format(config, css));
                }
            }
            return html.join('').format('javascript:void(0);');
        },
        buildSwitch: function (dir) {
            if ($.isUndefined(dir)) {
                dir = 'bottom-right';
            }
            var id = this.opt.id + '-switch-' + dir;
            if (document.getElementById(id) !== null) {
                return false;
            }
            var div = $.createElement('div');
            div.className = 'border-switch';
            div.pos = dir;
            div.id = id;
            div.dialogId = this.opt.id;
            $.addClass(div, dir + '-switch');
            return div;
        },
        getSwicths: function () {
            return this.getControls('.border-switch');
        },
        showSwitch: function () {
            this.getSwicths().each(function () {
                $(this).show();
            });
            return this;
        },
        hideSwitch: function () {
            this.getSwicths().each(function (i, obj, args) {
                $(this).hide();
            });
            return this;
        },
        show: function (content, title, isHide) {
            if ($.isBoolean(content)) {
                isHide = content;
                title = undefined;
                content = undefined;
            } else if ($.isBoolean(title)) {
                isHide = title;
                title = undefined;
            }
            var _ = this, ctls = this.controls, display = isHide ? 'none' : '';

            if (isHide && !_.opt.closeAble) {
                return this;
            }

            this.closed = isHide || false;

            if (!$.isUndefined(content)) {
                ctls.body.innerHTML = content;
            }
            if (!$.isUndefined(title)) {
                ctls.title.innerHTML = title;
            }

            if (ctls.container) {
                ctls.container.style.display = display;
            } else {
                ctls.box.style.display = display;
            }
            if (ctls.shade) {
                ctls.shade.style.display = display;
            }

            if (_.opt.lock && !isHide) {
                _.hideDocOverflow(isHide);
            }

            //return _.hideDocOverflow(isHide), _;
            return _;
        },
        hide: function () {
            return this.show(true);
        },
        close: function (action, dialogResult) {
            var _ = this, ctls = this.controls;

            if (!$.isString(action)) {
                action = 'None';
            }
            if (!$.isNumber(dialogResult)) {
                dialogResult = DialogResult.None;
            }
            if (!_.opt.closeAble || _.closed) {
                return false;
            }

            $.removeChild(document.body, ctls.container || ctls.box);
            if (ctls.shade) {
                $.removeChild(document.body, ctls.shade);
            }
            DialogCenter.remove(_.opt.id);

            this.closed = true;

            return _.clearTimer().callback(action, dialogResult).hideDocOverflow(true).dispose();
        },
        callback: function (action, dialogResult) {
            var _ = this, op = this.opt;
            var dr = {}, parameter = op.parameter || op.param;
            dr[action] = dialogResult;
            if ($.isFunction(op.success)) {
                if ([1, 6].indexOf(dialogResult) >= 0) {
                    op.success(dr, _, parameter);
                }
            } else if ($.isFunction(op.callback)) {
                op.callback(dr, _, parameter);
            }
            return _;
        },
        dispose: function () {
            for (var i in this.controls) {
                this.controls[i] = null;
            }
            for (var i in this.btns) {
                this.btns[i] = null;
            }
            for (var i in this.buttons) {
                this.buttons[i] = null;
            }
            for (var i in this.options) {
                this.options[i] = null;
            }
            return this;
        },
        update: function (content, title, options) {
            if ($.isString(options)) {
                if (options === 'autosize') {
                    options = { width: 'auto', height: 'auto' };
                } else if (options === 'autoheight') {
                    options = { height: 'auto' };
                } else if (options === 'autowidth') {
                    options = { width: 'auto' };
                } else {
                    options = {};
                }
            }
            var opt = checkOptions(content, title, options);
            var _ = this, ctls = this.controls, isAutoSize = false;

            if ($.extend(_.opt, opt).type === 'tooltip') {
                _.updateTooltip(content, opt.host, opt);
                return _;
            }
            if (ctls.content) {
                if (opt.width === 'auto') {
                    ctls.box.style.width = 'auto';
                    ctls.body.style.width = 'auto';
                    ctls.content.style.width = 'auto';
                    isAutoSize = true;
                }
                if (opt.height === 'auto') {
                    ctls.box.style.height = 'auto';
                    ctls.body.style.height = 'auto';
                    ctls.content.style.height = 'auto';
                    isAutoSize = true;
                }
                ctls.content = _.buildContent();

                if (ctls.title && opt.title) {
                    ctls.title.innerHTML = opt.title;
                }
                _.setBodySize().setCache();

                if (isAutoSize) {
                    _.setPosition();
                }
            }
            return _;
        },
        append: function (content, title, options) {
            if (!this.controls.content) {
                return this;
            }
            var html = this.controls.content.innerHTML;
            return this.update(html + content, title, options);
        },
        insert: function (content, title, options) {
            if (!this.controls.content) {
                return this;
            }
            var html = this.controls.content.innerHTML;
            return this.update(content + html, title, options);
        },
        focus: function (obj) {
            if ($.isElement(obj)) {
                return obj.focus(), this;
            } else if (!this.closed) {
                var btn = null;
                for (var k in this.buttons) {
                    btn = this.buttons[k];
                }
                return btn && btn.focus(), this;
            }
            return this;
        },
        min: function () {
            return this.setSize({ type: DialogStatus.Min });
        },
        normal: function () {
            return this.setSize({ type: DialogStatus.Normal });
        },
        max: function () {
            var _ = this;
            if (_.status.max || (_.status.min && _.lastStatus === DialogStatus.Normal)) {
                return _.setSize({ type: DialogStatus.Normal });
            } else {
                return _.setSize({ type: DialogStatus.Max });
            }
        },
        check: function (obj) {
            if (!$.isElement(obj)) {
                return false;
            }
            var parent = obj.parentNode;
            while (parent !== null) {
                if (parent == this.controls.box) {
                    return true;
                }
                parent = parent.parentNode;
            }
            return false;
        },
        action: function (obj) {
            var _ = this, code = '';
            if (typeof obj === 'string') {
                code = obj;
            } else {
                if (!_.check(obj)) {
                    return false;
                }
                code = obj.getAttribute('code');
            }
            if (code === DialogStatus.Min) {
                _.min();
            } else if (code === DialogStatus.Max) {
                _.max();
            } else if (code === DialogStatus.Close) {
                _.close();
            } else {
                var result = parseInt(obj.getAttribute('result'), 10);
                _.close(code, result);
            }
            return this;
        },
        setConfig: function (key, value) {
            var opt = this.opt;
            if (typeof key === 'object') {
                for (var k in key) {
                    if ($.containsKey(opt, k)) {
                        opt[k] = key[k];
                    }
                }
            } else if (typeof key === 'string') {
                if ($.containsKey(opt, key)) {
                    opt[key] = value;
                }
            }
            return this;
        },
        setOption: function (key, value) {
            return this.setConfig(key, value);
        },
        setButtonEvent: function (controls, eventName, keypress) {
            var _ = this;
            for (var i = 0; i < controls.length; i++) {
                var obj = controls[i];
                if (obj.tagName !== 'A') {
                    continue;
                }
                $.addListener(obj, eventName || 'click', function () {
                    _.action(this);
                    $.cancelBubble();
                });

                $.addListener(obj, 'mousedown', function () {
                    _.events.btnMouseDown = true;
                });

                $.addListener(obj, 'mouseup', function () {
                    _.events.btnMouseDown = false;
                });

                if (keypress) {
                    $.addListener(obj, 'keypress', function (e) {
                        var keyCode = $.getKeyCode(e);
                        var strKeyCode = String.fromCharCode(keyCode).toUpperCase();
                        var shortcutKey = this.getAttribute('shortcut-key') || '';
                        //if(32 == keyCode || (shkey >= 3 && strKeyCode == cg.shortcutKey[2].toUpperCase())){FuncCancel();}
                        // 判断是否为空格键 或 是否按下快捷键
                        if (KEY_CODE.Space === keyCode || strKeyCode === shortcutKey) {
                            _.action(this);
                        }
                    });
                }
            }
            return _;
        },
        setShortcutKeyEvent: function (controls) {
            var _ = this;
            _.dic = {};
            for (var i = 0; i < controls.length; i++) {
                var obj = controls[i];
                if (obj.tagName !== 'A') {
                    continue;
                }
                var shortcutKey = obj.getAttribute('shortcut-key') || '';
                if (shortcutKey) {
                    _.dic[shortcutKey] = obj;
                }
            }

            $.addListener(document, 'keypress', function (e) {
                if (!e.shiftKey) {
                    return false;
                }
                var keyCode = $.getKeyCode(e),
                    strKeyCode = String.fromCharCode(keyCode).toUpperCase(),
                    btn = _.dic[strKeyCode];

                if ($.isElement(btn)) {
                    _.action(btn);
                }
            });
        },
        setStatus: function (key, isLast) {
            this.lastStatus = this.getStatus();
            for (var k in this.status) {
                this.status[k] = false;
            }
            this.status[key] = true;
            return this;
        },
        getStatus: function (key) {
            if (typeof key === 'string') {
                return this.status[key];
            } else {
                for (var k in this.status) {
                    if (this.status[k]) {
                        return k;
                    }
                }
            }
        },
        setCache: function () {
            var obj = this.controls.box;

            var size = {
                width: obj.offsetWidth,
                height: obj.offsetHeight,
                bs: $.getBodySize()
            };

            this.lastSize = this.opt.height === 'auto' ? size : $.extend({
                top: obj.offsetTop,
                left: obj.offsetLeft,
                right: (obj.offsetLeft + obj.offsetWidth),
                bottom: (obj.offsetTop + obj.offsetHeight)
            }, size);

            return this;
        },
        setSize: function (options) {
            var _ = this, op = _.opt, ctls = _.controls, btns = _.btns, obj = ctls.box, par = {};

            if ($.isString(options)) {
                options = { type: options };
            }
            var p = $.extend({
                type: DialogStatus.Normal,
                width: 0,
                height: 0
            }, options);

            p.width = parseInt(p.width, 10);
            p.height = parseInt(p.height, 10);

            if (p.type === '' || (isNaN(p.width) && isNaN(p.height)) || _.getStatus() === p.type) {
                return this;
            }

            if (_.status.normal) {
                _.setCache();
            }

            if (_.status.max && p.type !== DialogStatus.Max && ctls.container) {
                $.removeClass(ctls.container, 'dialog-overflow-hidden');
            } else if (p.type !== DialogStatus.Min) {
                $.removeClass(ctls.bottom, 'display-none');
            }

            if (p.type !== DialogStatus.Max && !op.lock) {
                _.hideDocOverflow(true);
            }

            if (btns.max) {
                btns.max.title = p.type === DialogStatus.Max ? 'Restore Down' : 'Maximize';
            }

            var bs = $.getBodySize(), isSetBodySize = false, isSetPosition = false, isFullScreen = false;

            if (p.type === DialogStatus.Max) {
                if (!op.maxAble) {
                    return _;
                }
                var scrollTop = op.lock ? 0 : document.documentElement.scrollTop;
                par = { width: '100%', height: '100%', top: scrollTop, left: 0, right: 0, bottom: 0 };
                isSetBodySize = isFullScreen = true;

                $.addClass(obj, 'oui-dialog-max').addClass(btns.max, 'btn-normal');

                if (_.controls.container) {
                    $.addClass(ctls.container, 'dialog-overflow-hidden');
                }
                if (_.status.min) {
                    $.removeClass(obj, 'oui-dialog-min');
                }

                _.hideDocOverflow().hideSwitch().setStatus(DialogStatus.Max);
            } else if (p.type === DialogStatus.Min) {
                if (!op.minAble) {
                    return _;
                }
                var minW = parseInt(op.minWidth, 10), minH = 36;
                if (isNaN(minW)) { minW = 180; }

                par = { width: minW, height: minH };
                $.addClass(ctls.bottom, 'display-none').addClass(obj, 'oui-dialog-min').removeClass(btns.max, 'btn-normal');
                if (_.status.max) {
                    $.removeClass(obj, 'oui-dialog-max');
                }
                _.hideSwitch().setStatus(DialogStatus.Min).setPosition({ pos: op.position });
            } else {
                isSetBodySize = true;

                $.removeClass(btns.max, 'btn-normal');

                if (_.status.max) {
                    $.removeClass(obj, 'oui-dialog-max');
                } else if (_.status.min) {
                    $.removeClass(obj, 'oui-dialog-min');
                }
                _.showSwitch().setStatus('normal');

                if (p.type === 'resize' || p.type === 'size') {
                    par = { width: p.width, height: p.height };
                } else if (p.type === 'scale') {
                    isSetBodySize = false;
                    _.setScale(options);
                } else {  //p.type === 'normal'
                    if (!$.isUndefined(_.lastSize)) {
                        isSetPosition = bs.width !== _.lastSize.bs.width || bs.height !== _.lastSize.bs.height;
                        $.setStyle(ctls.box, _.lastSize, 'px');
                    } else {
                        par = { width: p.width, height: p.height };
                    }
                }
            }

            for (var name in par) {
                var val = par[name];
                if (!$.isNullOrUndefined(val)) {
                    obj.style[name] = checkStyleUnit(val);
                }
            }
            if (isSetBodySize) {
                _.setBodySize(isFullScreen);
            }
            if (isSetPosition) {
                _.setPosition();
            }
            return _;
        },
        setDragSize: function (dir) {
            var _ = this, ctls = this.controls;
            var arr = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

            dir = $.isString(dir) ? [dir] : arr;

            if (_.opt.dragSize) {
                for (var i in dir) {
                    ctls.box.appendChild(_.buildSwitch(dir[i]));
                }
                _.showSwitch();
            } else {
                _.hideSwitch();
            }
        },
        setScale: function (options, isDrag, dp) {
            var _ = this, opt = _.opt, obj = _.controls.box;
            if (!obj || (!opt.dragSize && isDrag)) {
                return this;
            }
            var par = $.extend({
                type: '',
                dir: 'bottom-right',
                x: 0,
                y: 0
            }, options);

            par.x = parseInt(par.x, 10);
            par.y = parseInt(par.y, 10);

            if (par.dir === '' || isNaN(par.x) || isNaN(par.y)) {
                return this;
            } else if (par.x === 0 && par.y === 0) {
                return this;
            }

            if (!isDrag) {
                dp = {
                    width: obj.offsetWidth,
                    height: obj.offsetHeight,
                    top: obj.offsetTop,
                    left: obj.offsetLeft,
                    right: obj.offsetWidth + obj.offsetLeft,
                    bottom: obj.offsetHeight + obj.offsetTop,
                    minWidth: parseInt(opt.minWidth, 10),
                    minHeight: parseInt(opt.minHeight, 10)
                };
            }

            var bs = $.getBodySize(),
                w = dp.width + par.x,
                h = dp.height + par.y,
                newWidth = w < dp.minWidth ? dp.minWidth : w,
                newHeight = h < dp.minHeight ? dp.minHeight : h,
                newLeft = 0,
                newTop = 0,
                x = 0,
                y = 0;

            var mw = parseInt(opt.maxWidth, 10);
            if (opt.maxWidth !== '100%' && !isNaN(mw) && newWidth > mw) {
                newWidth = mw;
            } else {
                x = par.x;
            }

            var mh = parseInt(opt.maxHeight, 10);
            if (opt.maxHeight !== '100%' && !isNaN(mh) && newHeight > mh) {
                newHeight = mh;
            } else {
                y = par.y;
            }

            if (par.dir === 'center') {
                x = parseInt(Math.abs(x) / 2, 10);
                y = parseInt(Math.abs(y) / 2, 10);
                newLeft = dp.left - par.x;
                newTop = dp.top - par.y;
            } else {
                x *= par.dir.indexOf('left') >= 0 ? -1 : 1;
                y *= par.dir.indexOf('top') >= 0 ? -1 : 1;
                newLeft = (dp.left + x + newWidth) > dp.right ? dp.right - newWidth : dp.left + x;
                newTop = (dp.top + y + newHeight) > dp.bottom ? dp.bottom - newHeight : dp.top + y;
            }

            //拖动缩放尺寸，窗口范围限制
            if (isDrag && opt.dragRangeLimit) {
                if (newWidth > bs.width - obj.offsetLeft) {
                    newWidth = bs.width - obj.offsetLeft;
                }
                if (newHeight > bs.height - obj.offsetTop) {
                    newHeight = bs.height - obj.offsetTop;
                }
                if (newTop < 0) {
                    newTop = 0;
                }
            }

            if (par.dir.indexOf('-') >= 0 || par.dir === 'center') {
                $.setStyle(obj, { width: newWidth, height: newHeight }, 'px');
            }

            switch (par.dir) {
                case 'bottom-right':
                case 'right-bottom': //不用处理
                    break;
                case 'right':
                    $.setStyle(obj, { width: newWidth, height: dp.height }, 'px');
                    break;
                case 'bottom':
                    $.setStyle(obj, { width: dp.width, height: newHeight }, 'px');
                    break;
                case 'left':
                    $.setStyle(obj, { width: newWidth, height: dp.height, left: newLeft }, 'px');
                    break;
                case 'top':
                    $.setStyle(obj, { width: dp.width, height: newHeight, top: newTop }, 'px');
                    break;
                case 'top-left':
                case 'left-top':
                case 'center':
                    $.setStyle(obj, { left: newLeft, top: newTop }, 'px');
                    break;
                case 'top-right':
                case 'right-top':
                    $.setStyle(obj, { top: newTop }, 'px');
                    break;
                case 'bottom-left':
                case 'left-bottom':
                    $.setStyle(obj, { left: newLeft }, 'px');
                    break;
            }
            _.setBodySize(false);

            if (!isDrag && par.dir === 'center') {
                _.setPosition(par);
            }

            return _;
        },
        setBodySize: function (isFullScreen, isDrag) {
            var _ = this, opt = _.opt, obj = _.controls.box, ctls = _.controls, bs = $.getBodySize();
            if (!obj) {
                return false;
            }
            var titleHeight = ctls.top ? ctls.top.offsetHeight : 0,
                bottomHeight = ctls.bottom ? ctls.bottom.offsetHeight : 0,
                paddingHeight = parseInt('0' + $.getElementStyle(obj, 'paddingTop'), 10),
                conPaddingHeight = parseInt('0' + $.getElementStyle(ctls.content, 'padding'), 10),
                boxWidth = obj.clientWidth,
                boxHeight = obj.clientHeight;

            if (opt.height !== 'auto') {
                /*
                if(boxHeight < opt.height && !_.events.dragingSize) {
                    boxHeight = opt.height;
                    obj.style.height = boxHeight + 'px';
                } else 
                */
                if (!isFullScreen) {
                    if (isNumberSize(opt.maxHeight)) {
                        var mh = parseInt(opt.maxHeight, 10);
                        if (boxHeight > mh) {
                            boxHeight = mh;
                            obj.style.height = boxHeight + 'px';
                        }
                    }
                }
            }

            if (boxWidth > bs.width) {
                boxWidth = bs.width - 20;
                obj.style.width = boxWidth + 'px';
            }

            if (boxHeight > bs.height) {
                boxHeight = bs.height - 20;
                obj.style.height = boxHeight + 'px';
            }

            boxWidth = obj.clientWidth;
            boxHeight = ctls.top && ctls.bottom ? obj.offsetHeight : obj.clientHeight;

            var size = {
                width: '100%',
                height: (boxHeight - titleHeight - bottomHeight - paddingHeight * 2) + 'px'
            };
            if (ctls.bottom) {
                size.marginBottom = ctls.bottom.clientHeight + 'px';
            }
            if (ctls.iframe) {
                $.setStyle(ctls.iframe, { height: size.height });
            }
            return $.setStyle(ctls.body, size), _;
        },
        clearPositionStyle: function (obj) {
            var arr = obj.style.cssText.split(';');
            var cssText = [];
            for (var i in arr) {
                var name = arr[i].split(':')[0].trim();
                if (!name.in(['top', 'left', 'right', 'bottom'])) {
                    cssText.push(arr[i]);
                }
            }
            return obj.style.cssText = cssText.join(';'), this;
        },
        checkPosition: function (key, pos) {
            if (!$.isNumber(pos)) {
                pos = this.opt.position;
            }
            var dic = {
                top: [1, 2, 3], middle: [4, 5, 6], bottom: [7, 8, 9],
                left: [1, 4, 7], center: [2, 5, 8], right: [3, 6, 9],
                custom: [0, 10]
            },
                keys = $.isArray(key) ? key : [key];
            for (var i in keys) {
                if ((dic[keys[i]] || []).indexOf(pos) >= 0) {
                    return true;
                }
            }
            return false;
        },
        setPosition: function (options) {
            var _ = this, opt = _.opt, obj = _.controls.box;
            if (!obj) {
                return false;
            }
            if ($.isString(options) || $.isNumber(options)) {
                options = { pos: options };
            } else if ($.isUndefined(options)) {
                options = { pos: opt.position };
            }
            var p = $.extend({
                event: '',
                pos: opt.position,
                x: opt.x,
                y: opt.y
            }, options);

            p.pos = p.pos === 'custom' ? 10 : parseInt(p.pos, 10);
            p.x = Math.abs(p.x);
            p.y = Math.abs(p.y);

            if (isNaN(p.pos) || isNaN(p.x) || isNaN(p.y)) {
                return this;
            }

            var bs = $.getBodySize(),
                cp = $.getScrollPosition(),
                width = obj.offsetWidth,
                height = obj.offsetHeight,
                posX = _.checkPosition('center', p.pos) ? bs.width / 2 - width / 2 : p.x,
                posY = _.checkPosition('middle', p.pos) ? bs.height / 2 - height / 2 : p.y;

            if (!opt.lock) {
                if (_.checkPosition('center', p.pos)) {
                    posX += opt.fixed ? 0 : cp.left;
                } else {
                    posX += opt.fixed ? 0 : (_.checkPosition('right', p.pos) ? - cp.left : cp.left);
                }
                if (_.checkPosition('middle', p.pos)) {
                    posY += opt.fixed ? 0 : cp.top;
                } else {
                    //posY += opt.fixed ? 0 : (_.checkPosition('bottom', p.pos) ? - cp.top : cp.top);
                    //启用top，不用bottom
                    posY = (_.checkPosition('bottom', p.pos) ? bs.height - p.y - height - (opt.fixed ? 0 : cp.top) : cp.top + p.y);

                }
            }
            posX = Math.abs(posX);
            posY = Math.abs(posY);

            //清除cssText上下左右4个样式
            _.clearPositionStyle(obj);

            switch (p.pos) {
                case 0:
                case 1:
                case 2:
                case 4:
                case 5:
                case 10:    //custom
                    $.setStyle(obj, { left: posX, top: posY }, 'px');
                    break;
                case 3:
                case 6:
                    $.setStyle(obj, { right: posX, top: posY }, 'px');
                    break;
                case 7:
                case 8:
                    $.setStyle(obj, { left: posX, top: posY }, 'px');
                    break;
                case 9:
                    $.setStyle(obj, { right: posX, top: posY }, 'px');
                    break;
            }

            return this;
        },
        setTopMost: function () {
            if (this.closed || !this.opt.topMost) {
                return false;
            }
            var topBox = DialogCenter.getTop(),
                isDialog = this.isDialog(topBox),
                isSelf = this.isSelf(topBox);
            if (!isDialog || isSelf) {
                return this;
            }

            var zindex = topBox.opt.zindex;
            topBox.setZindex(this.opt.zindex);
            return this.setZindex(zindex);
        },
        setZindex: function (zindex) {
            var ctls = this.controls;
            if (typeof zindex !== 'number') {
                zindex = this.buildZindex();
            }
            if (ctls.container) {
                ctls.container.style.zIndex = zindex;
            } else {
                ctls.box.style.zIndex = zindex;
            }
            return this.setOption('zindex', zindex);
        },
        dragToNormal: function (evt, bs, moveX, moveY) {
            var _ = this, ctls = _.controls, obj = ctls.box;

            //对话框最大化时，拖动对话框，先切换到标准模式（尺寸、定位）
            _.setSize({ type: 'normal' });

            var offsetRateX = (evt.clientX / bs.width),
                offsetX = evt.clientX,
                offsetY = evt.clientY - moveY,
                btnPanelWidth = ctls.panel ? ctls.panel.offsetWidth : 0;

            if (offsetRateX > 0.5) {
                offsetX = evt.clientX - obj.offsetWidth + (obj.offsetWidth) * (1 - offsetRateX) + btnPanelWidth * offsetRateX;
            } else if (offsetX > (obj.offsetWidth) / 2) {
                offsetX = evt.clientX - (obj.offsetWidth) / 2;
            } else {
                offsetX = evt.clientX - moveX;
            }

            //移动对话框到当前鼠标位置
            _.setPosition({ pos: 'custom', event: 'drag', x: offsetX, y: offsetY });

            return this;
        },
        dragPosition: function () {
            var _ = this,
                op = this.opt,
                ctls = this.controls,
                obj = ctls.box,
                docMouseMove = document.onmousemove,
                docMouseUp = document.onmouseup;

            function moveDialog() {
                if (!op.dragPosition) {
                    return $.cancelBubble(), false;
                }
                var evt = $.getEvent(),
                    cp = $.getScrollPosition(),
                    bs = $.getBodySize(),
                    clientWidth = bs.width,
                    clientHeight = bs.height,
                    moveX = evt.clientX,
                    moveY = evt.clientY,
                    moveTop = obj.offsetTop,
                    moveLeft = obj.offsetLeft,
                    moveAble = true,
                    isToNormal = false;

                document.onmousemove = function () {
                    if (!op.dragPosition || !moveAble || _.events.btnMouseDown) {
                        return false;
                    }
                    _.showIframeShade(true);
                    var evt = $.getEvent(),
                        x = moveLeft + evt.clientX - moveX,
                        y = moveTop + evt.clientY - moveY,
                        w = obj.offsetWidth,
                        h = obj.offsetHeight,
                        posX = x,
                        posY = y;

                    if (!isToNormal && _.status.max && (posX > 2 || posY > 2)) {
                        isToNormal = true;
                        _.dragToNormal(evt, bs, moveX, moveY);
                        moveTop = obj.offsetTop;
                        moveLeft = obj.offsetLeft;
                    }
                    if (op.dragRangeLimit) {
                        if (posX < 0) {
                            posX = 0;
                        }
                        if (posY < 0) {
                            posY = 0;
                        }
                        if ((posX + w) > bs.width) {
                            posX = bs.width - w;
                        }
                        if ((posY + h) > bs.height) {
                            posY = bs.height - h;
                        }
                    }
                    $.setStyle(obj, { width: w, height: h, left: posX, top: posY }, 'px');
                };
                document.onmouseup = function () {
                    if (!op.dragPosition || !moveAble) {
                        return false;
                    }
                    document.onmousemove = docMouseMove;
                    document.onmouseup = docMouseUp;
                    moveAble = false;
                    _.events.btnMouseDown = false;
                    _.showIframeShade(false);
                };
            }

            if (op.showTitle && ctls.top) {
                $.addListener(ctls.top, 'mousedown', function () {
                    moveDialog();
                });
            } else {
                $.addListener([ctls.box, ctls.body, ctls.content], 'mousedown', function () {
                    moveDialog();
                });
            }

            return this;
        },
        dragSize: function () {
            var _ = this,
                op = this.opt,
                ctls = this.controls,
                obj = _.controls.box,
                docMouseMove = document.onmousemove,
                docMouseUp = document.onmouseup;

            function resizeDialog(dir) {
                if (!op.dragSize) {
                    return $.cancelBubble(), false;
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
                document.onmousemove = function () {
                    if (!op.dragSize || !moveAble) {
                        return false;
                    }
                    _.events.dragingSize = true;
                    var e = $.getEvent(),
                        x = (e.clientX - moveX) * (dir.indexOf('left') >= 0 ? -1 : 1),
                        y = (e.clientY - moveY) * (dir.indexOf('top') >= 0 ? -1 : 1);

                    _.showIframeShade(true);
                    _.setScale({ dir: dir, x: x, y: y }, true, par);
                };
                document.onmouseup = function () {
                    if (!op.dragSize || !moveAble) {
                        return false;
                    }
                    document.onmousemove = docMouseMove;
                    document.onmouseup = docMouseUp;
                    moveAble = false;
                    _.events.dragingSize = false;
                    _.showIframeShade(false);
                };
            }

            _.getSwicths().each(function (i, obj) {
                $.addListener(obj, 'mousedown', function () {
                    _.setTopMost();
                    resizeDialog(obj.pos);
                });
            });
            return this;
        },
        //以下方法为tooltip
        buildTooltip: function (options) {
            var _ = this, ctls = _.controls, opt = options, host = opt.host;
            var tipId = null, d = null;
            try { tipId = host.getAttribute('tipid'); } catch (e) { }

            if (tipId && (d = DialogCenter.get(tipId)) !== null) {
                _.controls = d.controls;
                _.updateTooltip(opt.content, host, opt, _);
            } else {
                //对话框
                ctls.box = $.createElement('div');
                ctls.box.className = 'oui-tooltip';
                ctls.box.style.zIndex = opt.zindex;
                ctls.box.id = _.dialogId;

                ctls.body = _.buildBody(opt.content, ctls.box);

                $.setAttribute(host, 'tipid', _.opt.id);
                document.body.appendChild(ctls.box);
            }
            DialogCenter.setWindowResize();

            return _.setTooltipPosition(_);
        },
        updateTooltip: function (content, host, options, _) {
            _ = _ || this;
            if (_.controls.content) {
                _.controls.content.innerHTML = content;
            }
            return _.setTooltipPosition();
        },
        setTooltipPosition: function (_) {
            var _ = _ || this, obj = _.controls.box, opt = _.opt, host = opt.host;
            if (!$.isElement(obj) || !$.isElement(host)) {
                return false;
            }
            var dir = opt.position,
                p = $.getOffset(host),
                w = obj.offsetWidth,
                h = obj.offsetHeight,
                bs = $.getBodySize(),
                fs = {
                    w: p.width,
                    h: p.height,
                    x: p.left,
                    y: p.top
                },
                arrowSize = 7,
                left = fs.x,
                top = fs.y,
                css = '';

            switch (dir) {
                case 2:
                case 'top':
                    top = fs.y - h - arrowSize;
                    css = 'top';
                    break;
                case 6:
                case 'right':
                    if ((fs.x + fs.w + w + arrowSize) > bs.width) {
                        left = fs.x - w - arrowSize;
                        css = 'left';
                    } else {
                        left = fs.x + fs.w + arrowSize;
                        css = 'right';
                    }
                    break;
                case 8:
                case 'bottom':
                    top = fs.y + fs.h + arrowSize;
                    css = 'bottom';
                    break;
                case 4:
                case 'left':
                    if ((fs.x - w - arrowSize) < 0) {
                        left = fs.x + fs.w + arrowSize;
                        css = 'right';
                    } else {
                        left = fs.x - w - arrowSize;
                        css = 'left';
                    }
                    break;
            }
            obj.className = 'oui-tooltip oui-tip-' + css;
            $.setStyle(obj, { left: left, top: top }, 'px');

            return _;
        }
    };

    var DialogType = {

    };

    function DialogUtil() {
        this.caches = {};
        this.keys = [];
        this.docCloses = [];
        this.events = {};
    }

    DialogUtil.prototype = {
        isRepeat: function (name) {
            if (this.events[name]) {
                return true;
            }
            this.events[name] = true;
            return false;
        },
        buildId: function (id) {
            return 'd_' + id;
        },
        get: function (id) {
            id = this.buildId(id);
            if ($.containsKey(this.caches, id)) {
                return this.caches[id];
            }
            return null;
        },
        getTop: function () {
            var max = -1, key = '';
            for (var i = this.keys.length - 1; i >= 0; i--) {
                var k = this.keys[i], d = this.caches[k];
                if (d && !d.closed && d.opt.zindex > max) {
                    max = d.opt.zindex;
                    key = k;
                }
            }
            return max >= 0 ? this.caches[key] : null;
        },
        getLast: function () {
            for (var i = this.keys.length - 1; i >= 0; i--) {
                var k = this.keys[i], d = this.caches[k];
                if (d && !d.closed) {
                    return d;
                }
            }
            return null;
        },
        set: function (id, dialog) {
            id = this.buildId(id);
            this.keys.push(id);
            this.caches[id] = dialog;
            return dialog;
        },
        show: function (content, title, options, type, host) {
            options = checkOptions(content, title, options);
            var opt = {
                id: getId(options.id),
                type: checkType(type || options.type, true)
            };
            $.extend(options, { host: host });

            switch (opt.type) {
                case 'alert':
                    opt.buttons = DialogButtons.OK;
                    break;
                case 'confirm':
                    opt.buttons = DialogButtons.OKCancel;
                    break;
                case 'dialog':
                    break;
                case 'win':
                    opt.showBottom = $.isBoolean(options.showBottom, false);
                    break;
                case 'url':
                case 'load':
                case 'iframe':
                    opt.showBottom = $.isBoolean(options.showBottom, false);
                    break;
                default:
                    opt.buttons = DialogButtons.None;
                    opt.showTitle = opt.showBottom = opt.dragSize = false;
                    opt.height = opt.minHeight = 'auto';
                    opt.minAble = opt.maxAble = opt.lock = false;
                    break;
            }
            var d = this.get($.extend(opt, options).id);

            //设置 tooltip 默认位置为 right
            if (opt.type === 'tooltip' && !opt.position) {
                opt.position = 6; //right
            }

            if (d === null) {
                d = this.set(opt.id, new MyDialog(opt.content, opt.title, opt));
            } else {
                d.update(opt.content, opt.title, opt);
            }

            return d;
        },
        remove: function (id) {
            id = this.buildId(id);
            if ($.containsKey(this.caches, id)) {
                delete this.caches[id];
            }
            var idx = this.keys.indexOf(id);
            if (idx >= 0) {
                this.keys.splice(idx, 1);
            }
            return this;
        },
        close: function (options) {
            var op = $.isObject(options) ? options : { id: options };
            if (op.type) {
                this.closeAll(op.type);
            } else if (op.id) {
                var d = this.get(op.id);
                if (d && d.opt.closeAble) {
                    d.close();
                }
            }
            return this;
        },
        closeAll: function (type) {
            var isType = $.isString(checkType(type), true);
            for (var k in this.caches) {
                var d = this.caches[k];
                if (d && !d.closed && d.opt.closeAble &&
                    (!isType || (isType && d.opt.type === type))) {
                    d.close();
                }
            }
            return this;
        },
        setEscClose: function () {
            if (this.isRepeat('escClose')) {
                return false;
            }
            $.addListener(document, 'keyup', function (e) {
                if (KEY_CODE.Esc === $.getKeyCode(e)) {
                    var d = DialogCenter.getLast();
                    if (d && !d.closed && d.opt.escClose) {
                        d.close();
                    }
                }
            });
            return this;
        },
        setClickDocClose: function (id, eventName) {
            var _ = this;
            _.docCloses.push(id);

            if (_.isRepeat('doc' + eventName)) {
                return false;
            }
            $.addListener(document, eventName, function (e) {
                for (var i = _.docCloses.length - 1; i >= 0; i--) {
                    var d = _.get(_.docCloses[i]);
                    if (d && !d.closed) {
                        _.docCloses.splice(i, 1);
                        d.close();
                        break;
                    }
                }
            });
            return _;
        },
        setWindowResize: function () {
            var _ = this;
            if (_.isRepeat('resize')) {
                return false;
            }
            $.addListener(window, 'resize', function (e) {
                for (var i = _.keys.length - 1; i >= 0; i--) {
                    var k = _.keys[i], d = _.caches[k];
                    if (d && !d.closed) {
                        if (d.opt.type === 'tooltip') {
                            d.setTooltipPosition();
                        } else {
                            if (d.status.max) {
                                d.setBodySize();
                            }
                            /*
                            if(d.checkPosition(['center','middle'])) {
                                d.setPosition({event: 'resize'});
                            }
                            */
                            d.setPosition({ event: 'resize' });
                        }
                    }
                }
            });
            return _;
        }
    };

    var DialogCenter = new DialogUtil();

    $.extend({
        dialog: function (content, title, options) {
            return DialogCenter.show(content, title, options);
        },
        alert: function (content, title, options) {
            return DialogCenter.show(content, title, options, 'alert');
        },
        confirm: function (content, title, options) {
            return DialogCenter.show(content, title, options, 'confirm');
        },
        message: function (content, options) {
            return DialogCenter.show(content, undefined, options, 'message');
        },
        tips: function (content, element, options) {
            return DialogCenter.show(content, undefined, options, 'tooltip', element);
        },
        tooltip: function (content, element, options) {
            return DialogCenter.show(content, undefined, options, 'tooltip', element);
        }
    });

    $.extend($.dialog, {
        msg: function (content, options) {
            return DialogCenter.show(content, undefined, options, 'message');
        },
        win: function (content, title, options) {
            return DialogCenter.show(content, title, options, 'win');
        },
        load: function (urlOrElement, title, options) {
            return DialogCenter.show(urlOrElement, title, options, 'load');
        },
        iframe: function(url, title, options) {
            return DialogCenter.show(url, title, options, 'iframe');
        },
        url: function(url, title, options) {
            return DialogCenter.show(url, title, options, 'url');
        },
        close: function (id) {
            return DialogCenter.close(id), $;
        },
        closeAll: function (type) {
            return DialogCenter.closeAll(type), $;
        }
    });

    $.extend($.tooltip, {
        close: function (id) {
            if ($.isElement(id)) {
                id = id.getAttribute('tipId');
            }
            return DialogCenter.close(id), $;
        },
        closeAll: function (type) {
            return DialogCenter.closeAll(type || 'tooltip'), $;
        }
    });

}(OUI);