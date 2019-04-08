/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.dialog 对话框插件
*/

!function ($) {

    var Config = {
        FilePath: $.getScriptSelfPath(true),
        Index: 1,
        IdIndex: 1,
        Identifier: 'oui-dialog-identifier-',
        TitleHeight: 30,        //标题栏高度，单位：px
        BottomHeight: 40,       //底部栏高度，单位：px
        Padding: 4,             //拖动边框宽度，单位：px
        MinPadding: 0,          //拖动边框最小宽度，单位：px
        MaxPadding: 10,         //拖动边框最大宽度，单位：px
        CustomStyles: {
            shade: {},          //遮罩层样式
            dialog: {},         //对话框样式
            main: {},           //主体框样式
            body: {},           //主体样式
            content: {},        //内容样式
            head: {},           //顶部样式
            title: {},          //标题样式
            foot: {},           //底部样式
            tooltip: {}         //Tooltip样式
        },
        KEY_CODE: {
            Enter: 13,
            Esc: 27,
            Space: 32
        },
        Lang: {
            Chinese: 'chinese',
            English: 'english'
        },
        DialogType: {
            Dialog: 'dialog',
            Alert: 'alert',
            Confirm: 'confirm',
            Form: 'form',
            Win: 'win',
            Window: 'window',
            Iframe: 'iframe',
            Url: 'url',
            Load: 'load',
            Tooltip: 'tooltip',
            Tips: 'tips',
            Message: 'message',
            Msg: 'msg',
            Info: 'info'
        },
        DialogStatus: {
            Close: 'close',
            Max: 'max',
            Min: 'min',
            Normal: 'normal',
            Tooltip: 'tooltip'
        },
        Position: {
            Top: 'top',
            Right: 'right',
            Bottom: 'bottom',
            Left: 'left',
            Center: 'center',
            Middle: 'middle'
        },
        Direction: {
            Top: 'top',
            Right: 'right',
            Bottom: 'bottom',
            Left: 'left',
            TopLeft: 'top-left',
            LeftTop: 'top-left',
            TopRight: 'top-right',
            RightTop: 'top-right',
            BottomRight: 'bottom-right',
            RightBottom: 'bottom-right',
            BottomLeft: 'bottom-left',
            LeftBottom: 'bottom-left',
            Center: 'center'
        },
        DialogStatusText: {
            min: {english: 'Minimize', chinese: '\u6700\u5c0f\u5316'},                  //最小化
            max: {english: 'Maximize', chinese: '\u6700\u5927\u5316'},                  //最大化
            close: {english: 'Close', chinese: '\u5173\u95ed'},                         //关闭
            restore: {english: 'Restore', chinese: '\u8fd8\u539f'}                      //还原
        },
        CloseType: {
            Close: 'close',
            Child: 'child',
            Code: 'code'
        },
        DialogResult: {
            Close: 0,
            OK: 1,
            Cancel: 2,
            Abort: 3,
            Retry: 4,
            Ignore: 5,
            Yes: 6,
            No: 7,
            Child: 8,
            Code: 9
        },
        DefaultResult: {
            'close': { code: 'Close', result: 0 },
            'child': { code: 'Child', result: 8 },
            'code': { code: 'Code', result: 9 }
        },
        DialogButtons: {
            None: -1,
            OK: 0,
            OKCancel: 1,
            AbortRetryIgnore: 2,
            YesNoCancel: 3,
            YesNo: 4,
            RetryCancel: 5
        },
        ButtonMaps: [
            ['OK'],
            ['OK', 'Cancel'],
            ['Abort', 'Retry', 'Ignore'],
            ['Yes', 'No', 'Cancel'],
            ['Yes', 'No'],
            ['Retry', 'Cancel']
        ],
        DialogIcons: {
            None: 0,
            Hand: 16,
            Stop: 16,
            Error: 16,
            Question: 32,
            Exclamation: 48,
            Warning: 48,
            Asterisk: 64,
            Infomation: 64
        },
        DialogIconKeys: {
            hand: 'error',
            stop: 'stop',
            error: 'error',
            question: 'question',
            warning: 'warning',
            exclamation: 'warning',
            success: 'success',
            failed: 'warning',
            asterisk: 'info',
            infomation: 'info',
            info: 'info',
            cry: 'cry',
            sad: 'cry',
            smile: 'smile',
            happy: 'smile'
        },
        ButtonConfig: {
            None: { key: 'None', text: '\u5173\u95ed', result: 0, skey: '', css: 'btn-default' },
            Close: { key: 'Close', text: '\u5173\u95ed', result: 0, skey: 'W', css: 'btn-default' },
            OK: { key: 'OK', text: '\u786e\u5b9a', result: 1, skey: 'Y', css: 'btn-primary' },
            Cancel: { key: 'Cancel', text: '\u53d6\u6d88', result: 2, skey: 'N', css: 'btn-default' },
            Abort: { key: 'Abort', text: '\u4e2d\u6b62', result: 3, skey: 'A', css: 'btn-danger' },
            Retry: { key: 'Retry', text: '\u91cd\u8bd5', result: 4, skey: 'R', css: 'btn-warning' },
            Ignore: { key: 'Ignore', text: '\u5ffd\u7565', result: 5, skey: 'I', css: 'btn-default' },
            Yes: { key: 'Yes', text: '\u662f', result: 6, skey: 'Y', css: 'btn-primary' },
            No: { key: 'No', text: '\u5426', result: 7, skey: 'N', css: 'btn-default' }
        },
        ButtonText: {
            close: { english: 'Close', chinese: '\u5173\u95ed' },
            ok: { english: 'OK', chinese: '\u786e\u5b9a' },
            cancel: { english: 'Cancel', chinese: '\u53d6\u6d88' },
            abort: { english: 'Abort', chinese: '\u4e2d\u6b62' },
            retry: { english: 'Retry', chinese: '\u91cd\u8bd5' },
            ignore: { english: 'Ignore', chinese: '\u5ffd\u7565' },
            yes: { english: 'Yes', chinese: '\u662f' },
            no: { english: 'No', chinese: '\u5426' }
        },
        EventName: {
            Click: 'click',
            Dblclick: 'dblclick',
            Clicks: ['click', 'dblclick'],
            MouseDown: 'mousedown',
            MouseMove: 'mousemove',
            MouseUp: 'mouseup'
        },
        DialogText: {
            //对话框标题
            Title: {
                english: 'Dialog Title', chinese: '\u5bf9\u8bdd\u6846\u6807\u9898'
            },
            //自动关闭定时提示： 倒计时结束后关闭
            CloseTiming: {
                english: 'Close after the countdown is over.', chinese: '\u5012\u8ba1\u65f6\u7ed3\u675f\u540e\u5173\u95ed'
            },
            //iframe加载提示： 正在努力加载，请稍候
            Loading: {
                english: 'Loading, please wait a moment.', 
                chinese: '\u6b63\u5728\u52aa\u529b\u52a0\u8f7d\uff0c\u8bf7\u7a0d\u5019'
            }
        }
    },
    Common = {
        getDialogText: function(key, lang) {
            var txt = Config.DialogText[key];
            if(txt) {
                return txt[(lang || '').toLowerCase()];
            }
            return '';
        },
        getStatusText: function(key, lang) {
            var txt = Config.DialogStatusText[(key || '').toLowerCase()];
            if(txt) {
                return txt[(lang || '').toLowerCase()];
            }
            return '';
        },
        getButtonText: function(key, lang) {
            var txt = Config.ButtonText[(key || '').toLowerCase()];
            if(txt) {
                return txt[(lang || '').toLowerCase()];
            }
            return '';
        },
        getDialogButtons: function(type) {
            var buttons = Config.DialogButtons.None;
            switch(type) {
                case Config.DialogType.Alert:
                    buttons = Config.DialogButtons.OK;
                    break;
                case Config.DialogType.Confirm:
                    buttons = Config.DialogButtons.OKCancel;
                    break;
                case Config.DialogType.Dialog:
                    buttons = Config.DialogButtons.OKCancel;
                    break;
            }
            return buttons;
        },
        checkStyleUnit: function (s) {
            if ($.isNumber(s)) {
                return s + 'px';
            }
            if($.isString(s, true)) {
                if(s.toLowerCase() === 'auto' || $.isStyleUnit(s)) {
                    return s;
                }
                return s + 'px';
            }
            return s;
        },
        isNumberSize: function (num) {
            return $.isNumberSize(num);
        },
        getTs: function (start, len) {
            var tick = new Date().getTime();
            return parseInt(('' + tick).substr(start || 4, len || 8), 10);
        },
        buildId: function (id, prefix) {
            if (!$.isString(id, true) && !$.isNumber(id)) {
                return this.getTs(5, 8) + '-' + Config.Index++;
            }
            return (prefix || '') + id;
        },
        buildZindex: function (start, len) {
            return this.getTs(start, len);
        },
        checkTiming: function(opt) {
            if(!$.isNumber(opt.closeTiming)) {
                opt.closeTiming = opt.timeout || opt.timing || opt.time;
            }
            opt.closeTiming = Math.abs(parseInt('0' + opt.closeTiming, 10));
            return opt;
        },
        checkCustomStyle: function(opt, isUpdate) {
            if(isUpdate && opt.styles === null) {
                opt.newStyles = null;
            }
            //检测自定义样式设置
            if(!opt.styles || !$.isObject(opt.styles)) {
                opt.styles = {};
            }
            if(!isUpdate) {
                opt.styles = $.extend({}, Config.CustomStyles, opt.styles);
            }
            //合并自定义的样式
            for(var k in opt.styles) {
                $.extend(opt.styles[k], opt[k + 'Style']);
            }
            return this;
        },
        checkOptions: function (content, title, opt, isUpdate) {
            var target = null,  //目标控件，用于位置停靠
                elem = null;    //内容控件，用于加载内容
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
                target = title;
            }
            if (!$.isObject(opt)) {
                opt = {};
            }
            opt.element = elem || opt.element || undefined;
            opt.content = content || opt.content || undefined;
            opt.title = title || opt.title || undefined;
            opt.target = target || opt.target || undefined;

            if($.isBoolean(opt.boxShadow) || opt.boxShadow === 'none') {
                opt.shadow = opt.boxShadow;
            }

            if($.isNumeric(opt.closeIcon)) {
                opt.closeIcon = 'close' + opt.closeIcon;
            } else {
                opt.closeIcon = ('' + opt.closeIcon).toLowerCase();
            }
            return this.checkCustomStyle(opt, isUpdate).checkTiming(opt), opt;
        },
        getCssAttrSize: function(val, options) {
            var p = $.extend({
                attr: 'margin',      //margin, padding, border
                unit: '',
                isArray: false,
                isLimit: false,
                min: Config.MinPadding,
                max: Config.MaxPadding,
                val: Config.Padding
            }, options);
            return $.getCssAttrSize(val, p);
        },
        checkType: function (type, isBuild) {
            if (!$.isString(type, true) && !isBuild) {
                return type;
            }
            if ([Config.DialogType.Message, Config.DialogType.Msg].indexOf(type) >= 0) {
                return Config.DialogType.Message;
            } else if ([Config.DialogType.Tooltip, Config.DialogType.Tips].indexOf(type) >= 0) {
                return Config.DialogType.Tooltip;
            }
            return type || (isBuild ? Config.DialogType.Dialog : '');
        },
        checkIcon: function(opt) {
            if(!$.isString(opt.icon, true)) {
                return false;
            }
            var icon = ('' + opt.icon).toLowerCase();
            if(Config.DialogIconKeys[icon]) {
                opt.icon = Config.DialogIconKeys[icon];
                return true;
            }
            return false;
        },
        isPercentSize: function(width, height) {
            return $.isPercent(width) || (typeof height !== 'undefined' && $.isPercent(height));
        },
        toCssText: function (styles, type) {
            //TODO:
            switch(type) {
                case 'shade':
                    break;
                case 'dialog':
                    break;

            }
            return $.toCssText(styles);
        },
        hasEvent: function(elem) {
            var keys = ['onclick', 'ondblclick', 'onmousedown'], attr;
            for(var i in keys) {
                attr = elem.getAttribute(keys[i]);
                if(attr) {
                    return true;
                }
            }
            return false;
        },
        isPlainText: function(obj) {
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
                if(tags.indexOf(tag) >= 0 || this.hasEvent(elem)) {
                    isText = false;
                    break;
                }
            }
            return isText;
        },
        getDefaultSize: function() {
            var screenWidth = window.screen.width, size = {};
            if(screenWidth <= 1366) {
                size = {width: 360, height: 180};
            } else if(screenWidth <= 1440) {
                size = {width: 400, height: 200};
            } else if(screenWidth <= 1920) {
                size = {width: 500, height: 250};
            } else {
                size = {width: 600, height: 300};
            }
            return size;
        },
        getSizeNumber: function(num) {
            var n = ('' + num).indexOf('%') < 0 ? parseInt(num, 10) : 0;
            return isNaN(n) ? 0 : n;
        },
        getMaxSize: function(opt) {
            var size = {
                minWidth: this.getSizeNumber(opt.minWidth),
                minHeight: this.getSizeNumber(opt.minHeight),
                maxWidth: this.getSizeNumber(opt.maxWidth),
                maxHeight: this.getSizeNumber(opt.maxHeight)
            };
            return size;
        },
        getTitleSize: function(txt) {
            var id = 'div-oui-dialog-text-size-01';
            var div = document.getElementById(id);
            if(!div) {
                div = document.createElement('div');
                div.id = id;
                div.className = 'oui-dialog-title-size';
                document.body.appendChild(div);
            }
            div.innerHTML = txt;

            var size = {width: div.offsetWidth, height: div.offsetHeight};

            return div.innerHTML = '', size;
        }
    },
    Cache = {
        ids: [],
        dialogs: {},
        events: {},
        docCloses: {
            click: [],
            dblclick: [],
            mousedown: []
        },
        docOverflow: {}
    },
    Factory = {
        isRepeat: function (name) {
            return Cache.events[name] ? true : (Cache.events[name] = true, false);
        },
        buildCacheId: function (id) {
            return 'd-' + id;
        },
        initCache: function (id, dialog) {
            var key = this.buildCacheId(id);
            Cache.ids.push({key: key, id: id});
            Cache.dialogs[key] = {
                dialog: dialog,
                parent: document.body,
                hasParent: false,                
                options: {},
                controls: {},
                btns: {},
                buttons: {},
                icon: undefined,
                closed: false,
                hid: false,
                status: {},
                lastStatus: undefined,
                lastSize: undefined,
                hideSize: undefined,        //隐藏之前的对话框尺寸
                actions: {},                //按钮事件
                events: {},
                timers: {},
                dics: {},
                styleElement: undefined     //动态创建的css样式
            };
            return dialog;
        },
        getDialog: function (id) {
            id = this.buildCacheId(id);
            if (typeof Cache.dialogs[id] !== 'undefined') {
                return Cache.dialogs[id]['dialog'];
            }
            return null;
        },
        setDialog: function (id, dialog) {
            var cache = this.getOptions(id);
            if(cache) {
                cache['dialog'] = dialog;
            }
            return this;
        },
        getOptions: function (id, key, defaultValue) {
            id = this.buildCacheId(id);
            if (typeof Cache.dialogs[id] !== 'undefined') {
                var cache = Cache.dialogs[id];
                return key ? cache[key] : cache;
            }
            return defaultValue;
        },
        setOptions: function (id, key, subKey, value) {
            var cache = this.getOptions(id);
            if(cache) {
                if($.isString(key, true)) {
                    if(!$.isUndefined(value)) {
                        cache[key][subKey] = value;
                    } else if(!$.isUndefined(subKey)) {
                        cache[key] = subKey;
                    }
                } else if($.isObject(key)) {
                    cache['options'] = key;
                }
            }
            return this;
        },
        getTop: function() {
            var max = -1, id = '';
            for (var i = Cache.ids.length - 1; i >= 0; i--) {
                var k = Cache.ids[i].id, d = Factory.getDialog(k);
                if (d && !d.isClosed() && d.getOptions().zindex > max) {
                    max = d.getOptions().zindex;
                    id = k;
                }
            }
            return max >= 0 ? Factory.getDialog(id) : null;
        },
        getLast: function() {
            for (var i = Cache.ids.length - 1; i >= 0; i--) {
                var d = Factory.getDialog(Cache.ids[i].id);
                if (d && !d.isClosed()) {
                    return d;
                }
            }
            return null;
        },
        remove: function (id) {
            id = this.buildCacheId(id);
            if ($.containsKey(Cache.dialogs, id)) {
                delete Cache.dialogs[id];
            }
            var idx = Cache.ids.indexOf(id);
            if (idx >= 0) {
                Cache.ids.splice(idx, 1);
            }
            return this;
        },
        close: function (options) {
            var op = $.isObject(options) ? options : { id: options };
            if (op.type) {
                this.closeAll(op.type);
            } else if (op.id) {
                var cache = this.getOptions(op.id);
                if (cache && cache.dialog.getOptions().closeAble) {
                    cache.dialog.close();
                }
            }
            return this;
        },
        closeAll: function (type) {
            var isType = $.isString(Common.checkType(type), true);
            for (var k in Cache.dialogs) {
                var p = Cache.dialogs[k], d = p.dialog;
                if (p && p.controls.dialog 
                    && d && !d.isClosed() && d.getOptions().closeAble 
                    && (!isType || (isType && d.getOptions().type === type))) {
                    d.close();
                }
            }
            return this;
        },
        //子页面关闭父页面当前对话框，并返回参数
        closeParent: function(id, param) {
            if (!$.isUndefined(id)) {
                var cache = this.getOptions(id), dialog = cache.dialog;
                if (cache && dialog && dialog.getOptions().closeAble) {
                    Util.setAction(dialog, Config.CloseType.Child, param);
                }
            }
            return this;
        },
        //根据子页面设置当前对话框尺寸
        resizeParent: function(id, param) {
            if (!$.isUndefined(id)) {
                var cache = this.getOptions(id), dialog = cache.dialog;
                if (cache && dialog && !dialog.isClosed()) {
                    dialog.resizeTo($.extend(param, {isBody: true})).position();
                }
            }
            return this;
        },
        setEscClose: function () {
            if (this.isRepeat('escClose')) {
                return false;
            }
            $.addListener(document, 'keyup', function (e) {
                if (Config.KEY_CODE.Esc === $.getKeyCode(e)) {
                    var d = Factory.getLast();
                    if (d && !d.isClosed() && d.getOptions().escClose) {
                        d.close();
                    }
                }
            });
            return this;
        },
        //检测是否可以关闭对话框，当创建时长超过500毫秒时才可以关闭
        //这是为了防止当document点击事件时，不会导致刚创建的对话框被立即关闭
        allowClose: function(curTime, buildTime) {
            return curTime - buildTime > 500;
        },
        setClickDocClose: function (id, eventName) {
            var _ = this;
            Cache.docCloses[eventName].push(id);

            if (_.isRepeat('doc' + eventName)) {
                return _;
            }
            $.addListener(document, eventName, function (e) {
                var list = Cache.docCloses[eventName], ts = new Date().getTime();
                for (var i = list.length - 1; i >= 0; i--) {
                    var p = Factory.getOptions(list[i]) || {}, d = p.dialog;
                    if (d && !d.isClosed() && _.allowClose(ts, p.buildTime)) {
                        list.splice(i, 1);
                        d.close();
                        break;
                    }
                }
            });
            return _;
        },
        setWindowResize: function () {
            if (this.isRepeat('resize')) {
                return this;
            }
            $.addListener(window, 'resize', function (e) {
                //for (var i = Cache.ids.length - 1; i >= 0; i--) {
                for (var i = 0; i < Cache.ids.length; i++) {
                    var d = Factory.getDialog(Cache.ids[i].id);
                    if (d && !d.isClosed()) {
                        var p = Util.getParam(d), opt = p.options;
                        if (opt.type === Config.DialogType.Tooltip) {
                            Util.setTooltipPosition(d);
                        } else {
                            var par = { event: 'window.resize' }, fullScreen = d.isMaximized();
                            if (fullScreen || d.isPercent()) {
                                Util.setBodySize(d, $.extend(par, {fullScreen: fullScreen}));
                            }
                            Util.setPosition(d, par);
                        }
                    }
                }
            });
            return this;
        },
        show: function (content, title, options, type, target) {
            options = Common.checkOptions(content, title, options);
            var opt = {
                id: Common.buildId(options.id),
                type: Common.checkType(type || options.type, true)
            };
            $.extend(options, { target: target });

            switch (opt.type) {
                case Config.DialogType.Alert:
                    opt.buttons = Config.DialogButtons.OK;
                    opt.showMin = opt.showMax = opt.maxAble = false;
                    opt.keyClose = opt.escClose = opt.clickBgClose = false;
                    opt.buttonPosition = 'right';
                    break;
                case Config.DialogType.Confirm:
                    opt.buttons = Config.DialogButtons.OKCancel;
                    opt.showMin = opt.showMax = opt.maxAble = false;
                    opt.keyClose = opt.escClose = opt.clickBgClose = false;
                    opt.buttonPosition = 'right';
                    break;
                case Config.DialogType.Dialog:
                    opt.height = 'auto';
                    break;
                case Config.DialogType.Win:
                    opt.showFoot = $.isBoolean(options.showFoot, false);
                    opt.height = 'auto';
                    break;
                case Config.DialogType.Form:
                    opt.height = 'auto';
                    opt.delayClose = true;
                    break;
                case Config.DialogType.Url:
                case Config.DialogType.Load:
                case Config.DialogType.Iframe:
                    opt.showFoot = $.isBoolean(options.showFoot, false);
                    opt.codeCallback = true;
                    opt.keyClose = opt.escClose = opt.clickBgClose = false;
                    break;
                default:
                    opt.buttons = Config.DialogButtons.None;
                    opt.showHead = opt.showFoot = opt.dragSize = false;
                    //opt.width = opt.minWidth = 'auto';
                    opt.height = opt.minHeight = 'auto';
                    opt.minAble = opt.maxAble = opt.lock = false;
                    break;
            }
            var d = this.getDialog($.extend(opt, options).id);

            //设置 tooltip 默认位置为 right
            if (opt.type === Config.DialogType.Tooltip && !opt.position) {
                opt.position = 6; //right
            }

            if (d === null) {
                this.initCache(opt.id, null);
                d = new Dialog(opt.content, opt.title, opt);
            } else {
                d.update(opt.content, opt.title, opt);
            }

            return d;
        },
        loadCss: function() {
            var path = Config.FilePath;
            $.loadLinkStyle($.getFilePath(path) + $.getFileName(path, true).replace('.min', '') + '.css');
        }
    },
    Util = {
        loads: {},
        getParam: function(_) {
            var p = Factory.getOptions(_.id);
            return p || {
                none: true,
                options: {}, controls: {}, status: {}, events: {}, buttons: {}, btns: {}
            };
        },
        setOptions: function (_, key, subKey, value) {
            var id = $.isString(_, true) ? _ : _.id;
            return Factory.setOptions(id, key, subKey, value), this;
        },
        isSelf: function (_, dialog) {
            if(!dialog || !Factory.getDialog(dialog.id)) {
                return false;
            }
            return dialog.getOptions().id === _.getOptions().id;
        },
        isIframe: function(opt) {
            return [
                Config.DialogType.Url, 
                Config.DialogType.Iframe, 
                Config.DialogType.Load
            ].indexOf(opt.type) >= 0;
        },
        isSure: function(result) {
            return [Config.DialogResult.OK, Config.DialogResult.Yes].indexOf(result) >= 0;
        },
        isDefaultResult: function(code) {
            return [
                Config.CloseType.Close, 
                Config.CloseType.Child, 
                Config.CloseType.Code
            ].indexOf(code) >= 0;
        },
        appendChild: function (elem, pNode) {
            return $.appendChild(pNode, elem), this;
        },
        getCache: function(_, key, defaultValue) {
            return Factory.getOptions(_.id, key, defaultValue);
        },
        setStatus: function(_, key) {
            var obj = {key: key};
            obj[key] = true;
            var lastStatus = this.getCache(_, 'status').key;
            return this.setOptions(_, 'lastStatus', lastStatus).setOptions(_, 'status', obj);
        },
        hideDocOverflow: function (_, isShow) {
            var overflow;
            if(isShow) {
                overflow = Cache.docOverflow[_.id];
                if (overflow !== 'hidden') {
                    document.body.style.overflow = overflow;
                }
            } else {
                overflow = document.body.style.overflow;
                if (overflow !== 'hidden') {
                    document.body.style.overflow = 'hidden';
                    Cache.docOverflow[_.id] = overflow;
                }
            }
            return this;
        },
        showDialog: function(ctls, isShow, content, title) {
            var display = isShow ? '' : 'none';
            if (ctls.container) {
                ctls.container.style.display = display;
            } else {
                ctls.dialog.style.display = display;
            }
            if (ctls.shade) {
                ctls.shade.style.display = display;
            }

            if ($.isString(content, true)) {
                ctls.content.innerHTML = content;
            }
            if ($.isString(title, true)) {
                ctls.title.innerHTML = title;
            }

            return this;
        },
        close: function(_) {
            return _.close(), this;
        },
        build: function(_, options) {
            var util = this, p = Util.getParam(_), opt = p.options, ctls = p.controls;
            var status = opt.status || Config.DialogStatus.Normal;

            opt.type = Common.checkType(opt.type, true);

            if(status !== Config.DialogStatus.Normal) {
                opt.status = Config.DialogStatus.Normal;
            }

            if (opt.type === Config.DialogType.Tooltip) {
                //不需要遮罩层
                opt.lock = false;
                return util.buildTooltip(_, options), util;
            } else if (opt.lock) {
                util.hideDocOverflow(_)
                    .buildShade(_)
                    .buildContainer(_);
            }

            util.buildDialog(_)
                .buildMain(_, ctls.dialog)
                .buildHead(_, ctls.main, false)
                .buildBody(_, ctls.main)
                .buildFoot(_, ctls.main, false);

            if (opt.fixed) {
                ctls.dialog.style.position = 'fixed';
            }

            if (opt.dragSize) {
                util.setDragSwitch(_);
            }

            if (ctls.shade) {
                p.parent.appendChild(ctls.shade);
            }

            if (ctls.container) {
                ctls.container.appendChild(ctls.dialog);
                p.parent.appendChild(ctls.container);
            } else {
                p.parent.appendChild(ctls.dialog);
            }

            util.setSize(_, { type: opt.status, width: opt.width, height: opt.height });

            if(util.isAutoSize(_)) {
                util.setBodySize(_);
                $.extend(opt, util.getAutoSize(_, true));
                util.setSize(_, { type: opt.status, width: opt.width, height: opt.height });
            }            
            util.setPosition(_, { position: opt.position, x: opt.x, y: opt.y });

            util.setCache(_)
                .dragPosition(_)
                .dragSize(_)
                .setClickBgClose(_);

            if (opt.escClose) {
                Factory.setEscClose();
            }
            Factory.setWindowResize();

            if(!opt.showHead || ctls.iframe || Common.isPlainText(ctls.content)) {
                $.addListener([ctls.body, ctls.dialog], 'mousedown', function () {
                    _.topMost();
                });

                $.addListener(ctls.dialog, ['click', 'dblclick', 'mousedown'], function () {
                    $.cancelBubble();
                });
            }

            if (ctls.container && opt.cancelBubble) {
                // 取消背景层 mousedown，防止冒泡 document.mousedown
                $.addListener(ctls.container, ['click', 'mousedown'], function () {
                    $.cancelBubble();
                });
            }

            //初始最小化或最大化对话框
            if([Config.DialogStatus.Min, Config.DialogStatus.Max].indexOf(status) >= 0) {
                _[status]();
            }

            return util.buildCloseTiming(_), _.focus(), util;
        },
        setClickBgClose: function (_) {
            var p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none) { return this; }
            if (!('' + opt.clickBgClose).toLowerCase().in(['dblclick', 'click'])) {
                return this;
            }
            if (opt.lock && ctls.container) {
                $.addListener(ctls.container, opt.clickBgClose, function () {
                    _.close();
                });
            } else {
                window.setTimeout(function () {
                    Factory.setClickDocClose(opt.id, opt.clickBgClose);
                }, 100);
            }
            return this;
        },
        buildShade: function(_) {
            var p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none || !opt.lock) { return this; }
            ctls.shade = $.createElement('div');
            ctls.shade.className = 'oui-dialog-shade';
            ctls.shade.style.zIndex = opt.zindex;
            var css, 
                shadeStyle = $.extend({ opacity: opt.opacity }, opt.styles.shade);

            if ((css = Common.toCssText(shadeStyle, 'shade'))) {
                ctls.shade.style.cssText = css;
            }
            return this;
        },
        buildContainer: function(_){
            var p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none || !opt.lock) { return this; }
            ctls.container = $.createElement('div');
            ctls.container.className = 'oui-dialog-container';
            ctls.container.style.zIndex = opt.zindex;
            return this;
        },
        buildDialog: function(_) {
            var p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none) { return this; }
            var css, shadow = opt.shadow;
            ctls.dialog = $.createElement('div');
            ctls.dialog.className = 'oui-dialog';
            ctls.dialog.style.zIndex = opt.zindex;
            ctls.dialog.id = _.getDialogId();
            if ((css = Common.toCssText(opt.styles.dialog, 'dialog'))) {
                ctls.dialog.style.cssText = css;
            }
            if(!$.isBoolean(shadow, false) || shadow === 'none') {
                ctls.dialog.style.boxShadow = 'none';
            }
            ctls.dialog.style.padding = Common.getCssAttrSize(opt.padding, {
                attr: 'padding', unit:'px', isArray: true, isLimit: true, max: 10, val: 4
            }).join(' ');
            return this;
        },
        buildMain: function(_, pNode) {
            var p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none || _.isClosed()) { return this; }
            var elem = $.createElement('div'), css;
            elem.className = 'dialog-main';
            elem.tabIndex = 1;
            if ((css = Common.toCssText(opt.styles.main, 'main'))) {
                elem.style.cssText = css;
            }
            return this.appendChild((ctls.main = elem), pNode);
        },
        buildHead: function(_, pNode, rebuild) {
            var p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none || _.isClosed() || !opt.showHead || (ctls.head && !rebuild)) {
                return this; 
            }
            var elem, css, btns = p.btns;
            if(rebuild && ctls.head) {
                $.removeChild(ctls.head, [ctls.logo, ctls.title, ctls.btnPanel]);
                elem = ctls.head;
            }
            if(!rebuild) {
                elem = $.createElement('div');
                elem.className = 'dialog-head';

                if ((css = Common.toCssText(opt.styles.top, 'head'))) {
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
                    _.topMost();
                });
            }

            if(opt.showLogo) {
                var logo = $.createElement('div');
                logo.className = 'dialog-logo';
                elem.appendChild((ctls.logo = logo));
            }
           
            var div = $.createElement('div');
            div.className = 'dialog-title';
            div.innerHTML = opt.title;
            if ((css = Common.toCssText(opt.styles.title, 'title'))) {
                div.style.cssText = css;
            }
            elem.appendChild((ctls.title = div));

            this.buildClose(_, elem, true);

            return !rebuild ? this.appendChild((ctls.head = elem), pNode) : null, this;
        },
        buildCloseTiming: function(_) {
            var p = this.getParam(_), opt = p.options, ctls = p.controls, timers = p.timers;
            if (p.none || !opt.autoClose || !opt.closeAble) {
                return this;
            }
            this.clearTimer(timers);

            if(opt.showTimer) {
                var i = opt.closeTiming / 100;
                if (i > 20 && opt.showHead) {
                    var div = $.createElement('label', 'timing', function (elem) {
                        elem.className = 'dialog-timing';
                        elem.title = Common.getDialogText('CloseTiming', opt.lang) || '';
                    });
                    ctls.head.appendChild((ctls.timer = div));

                    timers.timingTimer = window.setInterval(function () {
                        ctls.timer.innerHTML = (i--) / 10;
                    }, 100);
                }
            }
            return timers.closeTimer = window.setInterval(function () {
                Util.setAction(_, Config.CloseType.Close).clearTimer(timers).close(_);
            }, opt.closeTiming), this;
        },
        clearTimer: function (timers) {
            for (var i in timers) {
                if (timers[i]) {
                    window.clearInterval(timers[i]);
                    delete timers[i];
                }
            }
            return this;
        },
        buildClose: function(_, pNode, isTop) {
            var p = this.getParam(_), opt = p.options, ctls = p.controls, html = [];
            if(!ctls.dialog) {
                return this;
            }
            if(isTop) {
                var isMin = opt.minAble && opt.showMin,
                    isMax = opt.maxAble && opt.showMax,                
                    min = Common.getStatusText('min', opt.lang),
                    max = Common.getStatusText('max', opt.lang);

                if(isMin) {
                    html.push('<a class="dialog-btn btn-min" code="min" title="' + min + '"></a>');
                }
                if(isMax || isMin) {
                    html.push('<a class="dialog-btn btn-max" code="max" title="' + max + '"></a>');
                }
            }
            if(opt.closeAble && opt.showClose) {
                var config = Config.ButtonConfig['Close'];
                var close = Common.getStatusText('close', opt.lang);
                html.push('<a class="dialog-btn btn-close {0}" code="close" title="{1}" shortcut-key="{2}"></a>'.format(
                    opt.closeIcon, close, config.skey
                ));
            }

            if(html.length > 0) {
                var panel = $.createElement('div'), ctls = p.controls, btns = p.btns;
                panel.className = 'btn-panel';
                panel.innerHTML = html.join('');
                panel.style.cssText = 'float:right';
                pNode.appendChild((ctls.btnPanel = panel));

                var childs = panel.childNodes, c = childs.length, btnClose;

                for (var i = 0; i < c; i++) {
                    var obj = childs[i], key = obj.getAttribute('code');
                    btns[key] = obj;
                    if(key === 'close') {
                        btnClose = obj;
                    }
                }
                this.setButtonEvent(_, childs, 'click', false)
                    .setShortcutKeyEvent(_, btnClose ? [btnClose] : []);
            }
            return this;
        },
        buildBody: function(_, pNode) {
            var p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none || _.isClosed()) { return this; }
            var elem = $.createElement('div'), css;
            elem.className = 'dialog-body';

            if(!opt.showHead) {
                this.buildClose(_, elem, false);
            }
            if ((css = Common.toCssText(opt.styles.body, 'body'))) {
                elem.style.cssText = css;
            }
            return this.buildContent(_, elem).appendChild((ctls.body = elem), pNode);
        },
        buildContent: function(_, pNode) {
            var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none || _.isClosed()) { return util; }
            var elem = ctls.content, css, isUpdate = pNode === true;
            if (!elem) {
                elem = $.createElement('div');
                elem.className = 'dialog-content';
            }

            if ((css = Common.toCssText(opt.styles.content, 'content')) || (isUpdate)) {
                elem.style.cssText = css;
            }
            if (util.isIframe(opt)) {
                if($.isElement(opt.element) && opt.type === Config.DialogType.Load) {
                    elem.innerHTML = opt.element.innerHTML || opt.element.value || '';
                } else {
                    elem.innerHTML = util.buildIframe(_, opt, opt.content);
                    //隐藏dialog.body的滚动条（启用iframe滚动条，防止出现双滚动）
                    pNode.style.overflow = 'hidden';
                    //清除dialog.content边距
                    elem.style.padding = '0px';
                    elem.style.margin = '0px';

                    var isLoaded = false, childs = elem.childNodes;
                    $.extend(ctls, {iframe: childs[0], iframeShade: childs[1], loading: childs[2]});
                    
                    ctls.iframe.onload = ctls.iframe.onreadystatechange = function () {
                        if (!this.readyState || this.readyState == "complete") {
                            util.showIframeShade(ctls, false).showLoading(ctls, false);
                            isLoaded = true;
                        }
                    };
                    //若15秒还没有加载完成，则隐藏Iframe遮罩
                    window.setTimeout(function () {
                        if (!isLoaded) {
                            util.showIframeShade(ctls, false).showLoading(ctls, false);
                        }
                    }, 15 * 1000);
                }
            } else {
                //elem.innerHTML = opt.content;
                util.buildIconContent(_, true, elem);
                if(!opt.showHead && ctls.btnPanel) {
                    elem.style.marginRight = ctls.btnPanel.offsetWidth + 'px';
                }
            }
            return util.appendChild((ctls.content = elem), pNode || null);
        },
        buildIconContent: function(_, isShow, elem) {
            var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none || _.isClosed()) { return util; }
            elem = elem || ctls.content;

            if(isShow && Common.checkIcon(opt)) {
                if(!ctls.icon) {
                    ctls.icon = $.createElement('div');
                }
                elem.className = 'dialog-content icon-padding';
                elem.innerHTML = opt.content;
                elem.appendChild(ctls.icon);
            } else {
                elem.innerHTML = opt.content;
            }
            return util.showIcon(_, elem);
        },
        showIcon: function(_, elem) {
            var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
            var isShow = Common.checkIcon(opt),
                isMin = p.status.min;

            if(!elem) {
                elem = ctls.content;
            }
            if(elem && ctls.icon) {
                ctls.icon.className = isShow ? 'dialog-icon icon-' + opt.icon : 'dialog-icon-none';                
                elem.className = isShow ? 'dialog-content icon-padding' : 'dialog-content';
            }
            if(ctls.logo) {
                ctls.logo.className = isShow && isMin ? 'dialog-logo dialog-icon icon-' + opt.icon : 'dialog-logo';
            }
            return util;
        },
        buildIframe: function (_, opt, url) {
            var height = '100%';
            var html = ['<iframe class="dialog-iframe" width="100%"',
                ' id="{0}-iframe" height="{1}" src="{2}"',
                ' frameborder="0" scrolling="{3}"></iframe>',
                '<div id="{0}-iframe-shade" class="iframe-shade"></div>',
                '<div id="{0}-loading" class="dialog-loading">{4}</div>'
            ].join('');
            return html.format(_.getDialogId(), 
                height, 
                url.setUrlParam('dialog-id', _.id), 
                opt.iframeScroll || opt.iframeScrolling ? 'auto' : 'no',
                opt.loading || Common.getDialogText('Loading', opt.lang));
        },
        showIframeShade: function (ctls, isShow) {
            if (ctls.iframeShade) {
                ctls.iframeShade.style.display = isShow ? 'block' : 'none';
            }
            return this;
        },
        showLoading: function (ctls, isShow) {
            if (ctls.loading) {
                ctls.loading.style.display = isShow ? 'block' : 'none';
            }
            return this;
        },
        buildFoot: function(_, pNode, rebuild) {
            var p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none || _.isClosed() || !opt.showFoot || (ctls.foot && !rebuild)) {
                return this;
            }
            var elem, css, buttons = p.buttons, util = this;
            if(rebuild && ctls.foot) {
                $.removeChild(ctls.foot, [ctls.button]);
                elem = ctls.foot;
            }
            if(!rebuild) {
                elem = $.createElement('div');
                elem.className = 'dialog-foot';

                if ((css = Common.toCssText(opt.styles.foot, 'foot'))) {
                    elem.style.cssText = css;
                }
            }

            var panel = $.createElement('div');
            panel.className = 'button-panel';
            panel.innerHTML = util.buildButtons(_);
            if ([Config.Position.Left, Config.Position.Center, Config.Position.Right].indexOf(opt.buttonPosition) >= 0) {
                panel.style.cssText = 'text-align:{0};'.format(opt.buttonPosition);
            }
            elem.appendChild((ctls.buttonPanel = panel));

            for (var i = 0; i < panel.childNodes.length; i++) {
                var obj = panel.childNodes[i], key = obj.getAttribute('code');
                buttons[key] = obj;
            }
            $.addListener(elem, ['mousedown','dblclick', 'click'], function () {
                $.cancelBubble();
                _.topMost();
            });

            util.setButtonEvent(_, panel.childNodes, 'click', true)
                .setShortcutKeyEvent(_, panel.childNodes);

            return !rebuild ? util.appendChild((ctls.foot = elem), pNode) : null, util;
        },
        buildButtons: function(_) {
            var p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none) { return this; }
            var keys = Config.DialogButtons, html = [];
            if (!$.isNumber(opt.buttons) || opt.buttons < 0) {
                return '';
            }
            var keys = Config.ButtonMaps[opt.buttons], txts = {}, tabindex = 1;
            //自定义按钮文字
            if($.isObject(opt.buttonText)) {
                txts = opt.buttonText;
            } else if($.isString(opt.buttonText, true)) {
                txts = {OK: opt.buttonText};
            }

            for (var i in keys) {
                var config = Config.ButtonConfig[keys[i]], css = i > 0 ? ' btn-ml' : '';

                //根据语言获取相应的按钮文字
                config.text = Common.getButtonText(config.key, opt.lang) || config.text;

                //启用外部参数中的按钮文字
                $.extend(config, {text: txts[config.code]});

                if (config) {
                    text = '<a class="dialog-btn {css}{1}" code="{key}" result="{result}" href="{{0}}" tabindex="{2}" shortcut-key="{skey}">{text}</a>';
                    html.push(text.format(config, css, tabindex++));
                }
            }
            return html.join('').format('javascript:void(0);');
        },
        setDragSwitch: function (_, dir) {
            var p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none) { return this; }
            var arr = [ 
                Config.Direction.Top, 
                Config.Direction.Right, 
                Config.Direction.Bottom, 
                Config.Direction.Left,
                Config.Direction.TopLeft,
                Config.Direction.TopRight,
                Config.Direction.BottomLeft,
                Config.Direction.BottomRight
            ];
            dir = $.isString(dir) ? [dir] : arr;

            if (opt.dragSize) {
                var padding = Common.getCssAttrSize(opt.padding, {attr:'padding', unit: 'px', isLimit: true});
                for (var i in dir) {
                    ctls.dialog.appendChild(this.buildDragSwitch(_, dir[i], padding));
                }
                this.showDragSwitch(_);
            } else {
                this.hideDragSwitch(_);
            }
            return this;
        },
        buildDragSwitch: function(_, dir, padding) {
            var p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none) { return this; }
            if ($.isUndefined(dir)) {
                dir = Config.Direction.BottomRight;
            }
            var id = opt.id + '-switch-' + dir;
            if (document.getElementById(id) !== null) {
                return false;
            }
            var div = $.createElement('div');
            div.className = 'drag-switch';
            div.pos = dir;
            div.id = id;
            div.dialogId = opt.id;
            $.addClass(div, dir + '-switch');
            switch(dir) {
                case 'top':
                case 'bottom':
                //div.style.height = opt.padding + 'px';
                div.style.height = padding[dir]; 
                    break;
                case 'left':
                case 'right':
                //div.style.width = opt.padding + 'px';
                div.style.width = padding[dir];
                    break;
            }
            return div;
        },
        getElements: function (_, className) {
            return $('#' + _.getDialogId() + ' ' + className);
        },
        getZoomSwicths: function (_) {
            return this.getElements(_, '.drag-switch');
        },
        showDragSwitch: function (_) {
            this.getZoomSwicths(_).each(function () {
                $(this).show();
            });
            return this;
        },
        hideDragSwitch: function (_) {
            this.getZoomSwicths(_).each(function (i, obj, args) {
                $(this).hide();
            });
            return this;
        },
        setButtonEvent: function (_, elements, evName, keyEvent) {
            var p = this.getParam(_), opt = p.options;
            if(p.none) { return this; }
            var util = this, events = p.events, c = elements.length;
            for (var i = 0; i < c; i++) {
                var obj = elements[i];
                if (obj.tagName !== 'A') {
                    continue;
                }
                $.addListener(obj, evName || 'click', function () {
                    util.setAction(_, this);
                    $.cancelBubble();
                });

                $.addListener(obj, 'mousedown', function () {
                    events.btnMouseDown = true;
                });

                $.addListener(obj, 'mouseup', function () {
                    events.btnMouseDown = false;
                });

                if (keyEvent) {
                    $.addListener(obj, 'keyup', function (e) {
                        var keyCode = $.getKeyCode(e),
                            strKeyCode = String.fromCharCode(keyCode).toUpperCase(),
                            shortcutKey = this.getAttribute('shortcut-key') || '',
                            next;
                        //if(32 == keyCode || (shkey >= 3 && strKeyCode == cg.shortcutKey[2].toUpperCase())){FuncCancel();}
                        // 判断是否为空格键 或 是否按下快捷键
                        if (Config.KEY_CODE.Space === keyCode || strKeyCode === shortcutKey) {
                            util.setAction(_, this);
                        } else if([37, 39].indexOf(keyCode) >= 0) {
                            next = keyCode === 37 ? this.previousSibling : this.nextSibling;
                            if($.isElement(next) && next.className.indexOf('dialog-btn') >= 0) {
                                next.focus();
                            }
                        } else if([38, 40].indexOf(keyCode) >= 0) {
                            next = keyCode === 38 ? elements[0] : elements[c - 1];
                            next.focus();
                        }
                    });
                }
            }
            return this;
        },
        setShortcutKeyEvent: function (_, btns) {
            var util = this, p = util.getParam(_);
            if(!p.dics) {
                p.dics = {};
            }
            for (var i = 0; i < btns.length; i++) {
                var obj = btns[i];
                if (obj.tagName !== 'A') {
                    continue;
                }
                var shortcutKey = obj.getAttribute('shortcut-key') || '';
                if (shortcutKey) {
                    p.dics[shortcutKey] = obj;
                }
            }
            $.addListener(document, 'keypress', function (e) {
                if (!e.shiftKey ) {
                    return false;
                }
                var keyCode = $.getKeyCode(e),
                    strKeyCode = String.fromCharCode(keyCode).toUpperCase(),
                    btn = p.dics[strKeyCode],
                    last = Factory.getLast();

                if(!last || last.id !== p.dialog.id) {
                    return util;
                }

                if(btn === p.btns.close && !p.options.keyClose) {
                    return util;
                }

                if ($.isElement(btn)) {
                    util.setAction(_, btn);
                } else if(strKeyCode === 'F') {
                    _.focus();
                }
            });

            return util;
        },
        checkEventObj: function (_, obj) {
            var p = this.getParam(_), ctls = p.controls;
            if(p.none) { return this; }

            if (!$.isElement(obj)) {
                return false;
            }
            var parent = obj.parentNode;
            while (parent !== null) {
                if (parent == ctls.dialog) {
                    return true;
                }
                parent = parent.parentNode;
            }
            return false;
        },
        setAction: function (_, obj, param) {
            var util = this, code = '', p = util.getParam(_);
            if (typeof obj === 'string') {
                code = obj;
                obj = null;
            } else {
                if (!util.checkEventObj(_, obj)) {
                    return util;
                }
                code = obj.getAttribute('code');
            }
            if (code === Config.DialogStatus.Min) {
                _.min();
            } else if (code === Config.DialogStatus.Max) {
                _.max();
            } else {
                if(util.isDefaultResult(code)) {
                   p.actions = Config.DefaultResult[code]; 
                } else {
                    var result = parseInt(obj.getAttribute('result'), 10);
                    p.actions = { code: code, result: result };
                }
                if(param) {
                    $.extend(p.actions, { param: param });
                }                
                _.close();
            }
            return util;
        },
        getAction: function(_) {
            var p = this.getParam(_);
            if(p.options.codeCallback || p.options.alwaysCallback) {
                return $.extend({}, Config.DefaultResult.close, p.actions);
            }
            return $.extend({}, p.actions);
        },
        delAction: function(_) {
            var p = this.getParam(_);
            return p.actions = null, this;
        },
        setCache: function(_) {
            var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none) { return util; }

            var obj = ctls.dialog,
                bs = $.getBodySize(),
                w = obj.offsetWidth,
                h = obj.offsetHeight,
                size = {
                    percent: Common.isPercentSize(opt.width, opt.height),
                    width: w,
                    height: h,
                    bs: bs
                },
                lastSize = opt.height === 'auto' ? size : $.extend({
                    top: obj.offsetTop,
                    left: obj.offsetLeft,
                    //right: (obj.offsetLeft + obj.offsetWidth),
                    //bottom: (obj.offsetTop + obj.offsetHeight)
                    right: bs.width - (obj.offsetLeft + obj.offsetWidth),
                    bottom: bs.height - (obj.offsetTop + obj.offsetHeight)
                }, size);

            return util.setOptions(_, 'lastSize', lastSize), this;
        },
        setSize: function (_, options) {
            var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none) { return this; }

            var opt = p.options, 
                ctls = p.controls, 
                btns = p.btns, 
                obj = ctls.dialog, 
                par = {};

            if ($.isString(options)) {
                options = { type: options };
            }
            var sp = $.extend({
                type: Config.DialogStatus.Normal,
                width: 0,
                height: 0
            }, options);

            if (sp.type === '' || (sp.width.isNaN() && sp.height.isNaN()) || _.getStatus()[sp.type]) {
                return util;
            }

            if (p.status.normal) {
                util.setCache(_);
            }

            if (p.status.max && sp.type !== Config.DialogStatus.Max && ctls.container) {
                $.removeClass(ctls.container, 'dialog-overflow-hidden');
            } else if (sp.type !== Config.DialogStatus.Min) {
                $.removeClass(ctls.foot, 'display-none');
            }

            if (sp.type !== Config.DialogStatus.Max && !opt.lock) {
                util.hideDocOverflow(_, true);
            }

            if (btns.max) {
                //btns.max.title = sp.type === DialogStatus.Max ? 'Restore Down' : 'Maximize';
                btns.max.title = Common.getStatusText(sp.type === Config.DialogStatus.Max ? 'restore' : 'max', opt.lang);
            }

            var bs = $.getBodySize(), isSetBodySize = false, isSetPosition = false, isFullScreen = false;

            if (sp.type === Config.DialogStatus.Max) {
                if (!opt.maxAble) {
                    return this;
                }
                var scrollTop = opt.lock ? 0 : document.documentElement.scrollTop;
                par = { width: '100%', height: '100%', top: scrollTop, left: 0, right: 0, bottom: 0 };
                isSetBodySize = isFullScreen = true;

                $.addClass(obj, 'oui-dialog-max').addClass(btns.max, 'btn-normal');

                if (ctls.container) {
                    $.addClass(ctls.container, 'dialog-overflow-hidden');
                }
                if (p.status.min) {
                    $.removeClass(obj, 'oui-dialog-min');
                }
                util.hideDocOverflow(_)
                    .hideDragSwitch(_)
                    .setStatus(_, Config.DialogStatus.Max);

            } else if (sp.type === Config.DialogStatus.Min) {
                if (!opt.minAble) {
                    return this;
                }
                var minW = parseInt(opt.minWidth, 10), minH = 36;
                if (isNaN(minW)) { minW = 180; }

                par = { width: minW, height: minH };
                $.addClass(ctls.foot, 'display-none')
                    .addClass(obj, 'oui-dialog-min')
                    .removeClass(btns.max, 'btn-normal');
                if (p.status.max) {
                    $.removeClass(obj, 'oui-dialog-max');
                }
                $.setStyle(obj, { width: minW, height: minH }, 'px');

                util.hideDragSwitch(_)
                    .setStatus(_, Config.DialogStatus.Min)
                    .setPosition(_, { position: opt.position })
                    .showIcon(_);

                var pSize = $.getPaddingSize(obj), 
                    topWidth = minW - pSize.left - pSize.right;                    
                util.setTitleSize(_, topWidth);
            } else {
                isSetBodySize = true;

                $.removeClass(btns.max, 'btn-normal');

                if (p.status.max) {
                    $.removeClass(obj, 'oui-dialog-max');
                } else if (p.status.min) {
                    $.removeClass(obj, 'oui-dialog-min');
                }
                util.showDragSwitch(_).setStatus(_, Config.DialogStatus.Normal);

                if (sp.type === 'resize' || sp.type === 'size') {
                    par = { width: sp.width, height: sp.height };
                } else if (sp.type === 'scale') {
                    isSetBodySize = false;
                    util.changeSize(_, options);
                } else {  //sp.type === 'normal'
                    if (!$.isUndefined(p.lastSize)) {
                        isSetPosition = bs.width !== p.lastSize.bs.width || bs.height !== p.lastSize.bs.height;
                        if(p.lastSize.percent && isSetPosition) {
                            par = $.extend({}, p.lastSize, {width: opt.width, height: opt.height});
                        } else {
                            $.setStyle(obj, p.lastSize, 'px');
                        }
                    } else {
                        par = { width: sp.width, height: sp.height };
                    }
                }
            }

            for (var name in par) {
                var val = par[name];
                if (!$.isNullOrUndefined(val)) {
                    obj.style[name] = Common.checkStyleUnit(val);
                }
            }
            if (isSetBodySize) {
                util.setBodySize(_, {fullScreen: isFullScreen});
            }
            if (isSetPosition) {
                util.setPosition(_);
            }

            return util.showIcon(_);
        },
        setTitleSize: function(_, width) {
            var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none) { return this; }

            if(_.isClosed() || !ctls.head) {
                return this;
            }
            var topWidth = width || ctls.head.clientWidth,
                logoWidth = ctls.logo ? ctls.logo.offsetWidth : 0,
                btnWidth = ctls.btnPanel ? ctls.btnPanel.offsetWidth : 0,
                timerWidth = ctls.timer ? ctls.timer.offsetWidth : 0,
                titleWidth = topWidth - logoWidth - timerWidth - btnWidth - 10;

            if(ctls.title) {
                ctls.title.style.maxWidth = (titleWidth) + 'px';
                var realSize = Common.getTitleSize(ctls.title.innerHTML,'');

                if(realSize.width > titleWidth) {
                    ctls.title.title = $.filterHtmlCode(opt.title);
                } else {
                    ctls.title.title = '';
                }
            }
            return this;
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
        checkPosition: function (_, key, pos) {
            if (!$.isNumber(pos)) {
                pos = _.getOptions().position;
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
        convertPositionNumber: function(_, opt) {
            var keys = {
                custom: 0,
                topleft: 1, lefttop: 1,
                top: 2,
                topright: 3, righttop: 3,
                left: 4,
                center: 5,
                right: 6,
                bottomleft: 7, leftbottom: 7,
                bottom: 8,
                bottomright: 9, rightbottom: 9
            };
            if($.isNumeric(opt.position)) {
                opt.position = parseInt(opt.position, 10);
                if(opt.position < 0 || opt.position > 10) {
                    opt.position = 5;
                }
            } else {
                var pos = ('' + opt.position).replace('-', '').toLowerCase();
                opt.position = !$.isUndefined(keys[pos]) ? keys[pos] : 5;
            }
            return this;
        },
        setPosition: function (_, options) {
            var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls, obj = ctls.dialog;
            if(p.none || !obj) { return this; }

            if ($.isString(options) || $.isNumber(options)) {
                options = { position: options };
            } else if ($.isUndefined(options)) {
                options = { position: opt.position };
            }
            var par = $.extend({
                event: '',              //window.resize
                fullScreen: false,
                target: opt.target,
                parent: opt.parent,
                position: opt.position,
                x: opt.x,
                y: opt.y
            }, options), posX, posY;

            //window.resize
            if(par.event === 'window.resize') {
                if(p.status.max) {
                    return $.setStyle(obj, { left: 0, top: 0 }, 'px'), util;
                } else {

                    //TODO:
                    //在窗口大小改变时
                    //看是否需要怎么控制对话框位置
                }
            }
            if($.isElement(par.target)) {
                //目标位置停靠
                return util.setTargetPosition(par, obj), util;
            }

            //par.position = par.position === 'custom' ? 10 : parseInt(par.position, 10);
            util.convertPositionNumber(_, par);
            par.x = Math.abs(par.x);
            par.y = Math.abs(par.y);

            if (isNaN(par.position) || isNaN(par.x) || isNaN(par.y)) {
                return util;
            }

            var bs = $.getBodySize(),
                cp = $.getScrollPosition(),
                w = obj.offsetWidth,
                h = obj.offsetHeight,
                //锁定界面相当于固定位置
                fixed = opt.lock || opt.fixed,
                cpTop = fixed ? 0 : cp.top,
                cpLeft = fixed ? 0 : cp.left,
                isCenter = util.checkPosition(_, Config.Position.Center, par.position),
                isMiddle = util.checkPosition(_, Config.Position.Middle, par.position),
                isBottom = false,
                isRight = false;

            if (isCenter) {
                posX = (bs.width / 2 - w / 2) + cpLeft;
            } else {
                isRight = util.checkPosition(_, Config.Position.Right, par.position);
                posX = isRight ? (bs.width - par.x - w + cpLeft) : cpLeft + par.x;
            }
            if (isMiddle) {
                posY = bs.height / 2 - h / 2 + cpTop;
            } else {
                isBottom = util.checkPosition(_, Config.Position.Bottom, par.position);
                posY = isBottom ? (bs.height - par.y - h + cpTop) : cpTop + par.y;
            }

            //清除cssText上下左右4个样式
            util.clearPositionStyle(obj);

            //TODO: margin setting


            return $.setStyle(obj, { left: posX, top: posY }, 'px'), util;
        },
        movePosition: function(_, options, isMoveTo) {
            var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls, obj = ctls.dialog;
            if(p.none || !obj || !opt.moveAble) { return util; }

            var par = $.extend({
                target: null,
                parent: null,
                position: 7,    //默认停靠在目标控件左下方位置
                x: null,
                y: null
            }, options);

            if($.isElement(par.target)) {
                //目标位置停靠
                return util.setTargetPosition(par, obj), util;
            }

            var moveTo = $.isBoolean(isMoveTo, false),
                bs = $.getBodySize(),
                left = obj.offsetLeft,
                top = obj.offsetTop,
                w = obj.offsetWidth,
                h = obj.offsetHeight,
                x = parseInt(par.x || par.left, 10),
                y = parseInt(par.y || par.top, 10);

            if(isNaN(x)) { x = moveTo ? left : 0; }
            if(isNaN(y)) { y = moveTo ? top : 0; }

            var posX = moveTo ? x : left + x,
                posY = moveTo ? y : top + y;

            if (opt.limitRange) {
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

            return util;
        },
        convertPositionKey: function(opt) {
            var positions = [
                'bottom',
                'topleft',
                'top',
                'topright',
                'left',
                'center',
                'right',
                'bottomleft',
                'bottom',
                'bottomright'
            ];
            var keys = {
                topleft: 1, lefttop: 1,
                top: 2,
                topright: 3, righttop: 3,
                left: 4,
                center: 5,
                right: 6,
                bottomleft: 7, leftbottom: 7,
                bottom: 8,
                bottomright: 9, rightbottom: 9
            };

            if($.isNumeric(opt.position)) {
                var pos = parseInt(opt.position, 10);
                if(pos < 0 || pos >= 10) {
                    opt.position = 'bottom';
                } else {
                    opt.position = positions[pos];
                }
            } else {
                var pos = ('' + opt.position).replace('-', '').toLowerCase();
                opt.position = !$.isUndefined(keys[pos]) ? pos : 'bottom';
            }
            return this;
        },
        setFinalPosition: function() {

        },
        setTargetPosition: function(options, obj, isFixedSize) {
            var par = $.extend({
                target: null,
                parent: null,
                position: 'bottomleft',    //默认停靠在目标控件左下方位置
                x: null,
                y: null
            }, options);

            if(!$.isElement(par.target) || !$.isElement(obj)) {
                return {};
            }
            //TODO:

            par.position = (par.position || par.pos);

            this.convertPositionKey(par);

            var pos = par.position,
                p = $.getOffset(par.target),
                w = obj.offsetWidth,
                h = obj.offsetHeight,
                bs = $.getBodySize(),
                fs = {
                    w: p.width,
                    h: p.height,
                    x: p.left,
                    y: p.top
                },
                left = fs.x,
                top = fs.y,
                result = {
                    css: ''
                },
                isOver = true;

            var ys = {top: fs.y - h - par.y, bottom: fs.y + fs.h + par.y},
                xs = {left: fs.x - w - par.x, right: fs.x + fs.w + par.x},
                loop = 0, value = 0;

            ys.value = ys.bottom + h - bs.height;
            xs.value = xs.right + w - bs.width;

            do{
                isOver = true;

                if(pos.startsWith('top')) {
                    top = ys.top;
                    result.dir = 'top';
                    if(ys.top < 0 && (ys.value < 0 || ys.value < Math.abs(ys.top))) {
                        isOver = false;
                        pos = pos.replace('top', 'bottom');
                    }
                } else if(pos.startsWith('bottom')) {
                    top = ys.bottom;
                    result.dir = 'bottom';
                    if(ys.value > 0 && (ys.top >= 0 || Math.abs(ys.top) < ys.value) ) {
                        isOver = false;
                        pos = pos.replace('bottom', 'top');
                    }
                }

                if(pos.startsWith('left')) {
                    left = xs.left;
                    result.dir = 'left';
                    if(xs.left < 0 && (xs.value < 0 || xs.value < Math.abs(xs.left))) {
                        isOver = false;
                        pos = pos.replace('left', 'right');
                    }
                } else if(pos.startsWith('right')) {
                    left = xs.right;
                    result.dir = 'right';
                    if(xs.value > 0 && (xs.left >= 0 || Math.abs(xs.left) < xs.value) ) {
                        isOver = false;
                        pos = pos.replace('right', 'left');
                    }
                }

                switch(pos) {
                    case 'topleft':
                    case 'bottomleft':
                        left = fs.x;
                        if(fs.w < w) {
                            result.css = 'left: ' + (fs.w / 2) + 'px;';
                        }
                        break;
                    case 'top':
                    case 'bottom':
                        left = fs.x - (w - fs.w) / 2;
                        break;
                    case 'topright':
                    case 'bottomright':
                        left = fs.x - (w - fs.w);
                        if(fs.w < w) {
                            result.css = 'left: ' + (fs.w / 2 + (w - fs.w)) + 'px;';
                        }
                        break;
                    case 'lefttop':
                    case 'righttop':
                        top = fs.y;
                        if(fs.h < h) {
                            result.css = 'top: ' + (fs.h / 2) + 'px;';
                        }
                        break;
                    case 'left':
                    case 'right':
                        top = fs.y - (h - fs.h) / 2;
                        break;
                    case 'leftbottom':
                    case 'rightbottom':
                        top = fs.y - (h - fs.h);
                        if(fs.h < h) {
                            result.css = 'top: ' + (fs.h / 2 + (h - fs.h)) + 'px;';
                        }
                        break;
                }
                loop++;
            } while(!isOver && loop < 3);

            if(isFixedSize) {
                $.setStyle(obj, {width: w, height: h }, 'px');
            }

            $.setStyle(obj, { left: left, top: top }, 'px');
            
            return result;
        },
        dragPosition: function (_) {
            var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none) { return this; }

            var obj = ctls.dialog,
                docMouseMove = document.onmousemove,
                docMouseUp = document.onmouseup;

            function moveDialog() {
                if (!opt.moveAble || !opt.dragMove) {
                    return $.cancelBubble(), false;
                }
                var evt = $.getEvent(),
                    cp = $.getScrollPosition(),
                    bs = $.getBodySize(),
                    clientWidth = bs.width,
                    clientHeight = bs.height,
                    moveX = evt.clientX,
                    moveY = evt.clientY,
                    top = obj.offsetTop,
                    left = obj.offsetLeft,
                    moveAble = true,
                    isToNormal = false;

                document.onmousemove = function () {
                    if (!opt.moveAble || !opt.dragMove || !moveAble || p.events.btnMouseDown) {
                        return false;
                    }
                    util.showIframeShade(ctls, true);
                    var e = $.getEvent(),
                        x = left + e.clientX - moveX,
                        y = top + e.clientY - moveY;

                    if (!isToNormal && p.status.max && (x > 2 || y > 2)) {
                        isToNormal = true;
                        util.dragToNormal(_, e, bs, moveX, moveY);
                        top = obj.offsetTop;
                        left = obj.offsetLeft;
                        return false;
                    }
                    util.movePosition(_, {x: x, y: y}, true);
                };
                document.onmouseup = function () {
                    if (!opt.moveAble || !opt.dragMove || !moveAble) {
                        return false;
                    }
                    document.onmousemove = docMouseMove;
                    document.onmouseup = docMouseUp;
                    moveAble = false;
                    p.events.btnMouseDown = false;
                    util.showIframeShade(ctls, false);
                };
            }

            if (opt.showHead && ctls.head) {
                $.addListener(ctls.head, 'mousedown', function () {
                    moveDialog();
                });
            } else {
                $.addListener([ctls.dialog, ctls.body, ctls.content], 'mousedown', function () {
                    moveDialog();
                });
            }

            return this;
        },
        changeSize: function (_, options, isDrag, dp) {
            var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls, obj = ctls.dialog;
            if(p.none) { return this; }

            if (!obj || !opt.sizeAble || (!opt.dragSize && isDrag)) {
                return util;
            }

            var par = $.extend({
                    type: '',
                    resizeTo: false,
                    isBody: false,
                    dir: Config.Direction.BottomRight,
                    x: 0,
                    y: 0
                }, options),
                isMin = p.status.min;

            par.x = parseInt(par.x || par.width, 10);
            par.y = parseInt(par.y || par.height, 10);

            if (par.dir === '' || isNaN(par.x) || isNaN(par.y)) {
                return util;
            } else if (par.x === 0 && par.y === 0) {
                return util;
            }

            //判断对话框当前状态是否被最小化，若最小化，需要先还原大小
            if(isMin) {
                util.setSize(_, { type: Config.DialogStatus.Normal });
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
                headHeight = (ctls.head ? ctls.head.offsetHeight : 0),
                footHeight = (ctls.foot ? ctls.foot.offsetHeight : 0),
                w, h;

            if(par.resizeTo && !isDrag) {
                w = par.x;
                h = par.y;

                if(par.isBody) {
                    var padding = Common.getCssAttrSize(opt.padding, {attr: 'padding', isLimit: true}),
                        ph = padding.top + padding.bottom,
                        pw = padding.left + padding.right,
                        conPadding = Common.getCssAttrSize(ctls.content, {attr: 'padding', isLimit: true}),
                        cph = conPadding.top + conPadding.bottom,
                        cpw = conPadding.left + conPadding.right;

                    w += pw + cpw;
                    h += headHeight + footHeight + padding.top + ph + cph;
                }
            } else {
                w = dp.width + par.x;
                h = dp.height + par.y;
            }

            var newWidth = w < dp.minWidth ? dp.minWidth : w,
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

            if (par.dir === Config.Direction.Center) {
                x = parseInt(Math.abs(x) / 2, 10);
                y = parseInt(Math.abs(y) / 2, 10);
                newLeft = dp.left - par.x;
                newTop = dp.top - par.y;
            } else {
                x *= par.dir.indexOf(Config.Direction.Left) >= 0 ? -1 : 1;
                y *= par.dir.indexOf(Config.Direction.Top) >= 0 ? -1 : 1;
                newLeft = (dp.left + x + newWidth) > dp.right ? dp.right - newWidth : dp.left + x;
                newTop = (dp.top + y + newHeight) > dp.bottom ? dp.bottom - newHeight : dp.top + y;
            }

            //拖动缩放尺寸，窗口范围限制
            if (isDrag && opt.limitRange) {
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

            //检测最小高度，当高度小于最小高度时，隐藏底部按钮栏
            //var minHeight = headHeight + footHeight + ctls.body.offsetHeight;
            var minHeight = headHeight + footHeight + 5;

            if (par.dir.indexOf('-') >= 0 || par.dir === Config.Direction.Center) {
                $.setStyle(obj, { width: newWidth, height: newHeight }, 'px');
            }

            switch (par.dir) {
                case Config.Direction.BottomRight:
                case Config.Direction.RightBottom: //不用处理
                    break;
                case Config.Direction.Right:
                    $.setStyle(obj, { width: newWidth, height: dp.height }, 'px');
                    break;
                case Config.Direction.Bottom:
                    $.setStyle(obj, { width: dp.width, height: newHeight }, 'px');
                    break;
                case Config.Direction.Left:
                    $.setStyle(obj, { width: newWidth, height: dp.height, left: newLeft }, 'px');
                    break;
                case Config.Direction.Top:
                    $.setStyle(obj, { width: dp.width, height: newHeight, top: newTop }, 'px');
                    break;
                case Config.Direction.TopLeft:
                case Config.Direction.LeftTop:
                case Config.Direction.Center:
                    $.setStyle(obj, { left: newLeft, top: newTop }, 'px');
                    break;
                case Config.Direction.TopRight:
                case Config.Direction.RightTop:
                    $.setStyle(obj, { top: newTop }, 'px');
                    break;
                case Config.Direction.BottomLeft:
                case Config.Direction.LeftBottom:
                    $.setStyle(obj, { left: newLeft }, 'px');
                    break;
            }
            util.setBodySize(_, { fullScreen : false, drag: isDrag });

            if(ctls.foot && ctls.dialog.offsetHeight < minHeight) {
                ctls.foot.style.visibility = 'hidden';
                _.dragScaleHideBottom = true;
            } else if(_.dragScaleHideBottom) {
                ctls.foot.style.visibility = 'visible';
            }

            if (!isDrag && par.dir === Config.Direction.Center) {
                util.setPosition(_, par);
            }

            //判断对话框当前状态是否被最小化，若最小化，设置完尺寸之后需要重新最小化
            if(isMin) {
                util.setSize(_, { type: Config.DialogStatus.Min });
            }

            return util.showIcon(_);
        },
        isAutoSize: function(_, options) {
            var util = this, p = this.getParam(_), opt = options || p.options, ctls = p.controls;
            if(p.none) { return false; }

            var isAutoSize = false;
            if (_.isClosed()) {
                return false;
            }
            if (opt.width === 'auto') {
                ctls.dialog.style.width = 'auto';
                ctls.main.style.width = 'auto';
                ctls.body.style.width = 'auto';
                ctls.content.style.width = 'auto';
                isAutoSize = true;
            }
            if (opt.height === 'auto') {
                ctls.dialog.style.height = 'auto';
                ctls.main.style.height = 'auto';
                ctls.body.style.height = 'auto';
                ctls.content.style.height = 'auto';
                isAutoSize = true;
            }

            return isAutoSize;
        },
        getAutoSize: function(_, isLimit) {
            var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none) { return this; }

            var pH = parseInt($.getElementStyle(ctls.dialog, 'padding', 0), 10),
                cH = parseInt($.getElementStyle(ctls.main, 'padding', 0), 10),
                s = {
                    width: ctls.content.offsetWidth + pH * 2 + cH * 2,
                    height: ctls.content.offsetHeight + pH * 2 + cH * 2
                };

            if(ctls.head){
                s.height += ctls.head.offsetHeight;
            }
            
            if(ctls.foot){
                s.height += ctls.foot.offsetHeight;
            }

            //增加20px高度留白
            s.height += 20;

            if(isLimit) {
                var mw = parseInt('0' + opt.minWidth, 10),
                    mh = parseInt('0' + opt.minHeight, 10);

                if(s.width < mw) {
                    s.width = mw;
                }

                if(s.height < mh) {
                    s.height = mh;
                }
            }
            return s;
        },
        setBodySize: function (_, options) {
            var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none) { return this; }

            var par = $.extend({
                event: '',          //window.resize, show
                drag: false,
                lastSize: undefined
            }, options);

            var obj = ctls.dialog, bs = $.getBodySize();
            if (!obj) {
                return this;
            }

            var boxWidth = obj.clientWidth,
                boxHeight = obj.clientHeight,
                padding = Common.getCssAttrSize(opt.padding, {attr: 'padding', isLimit: true}),
                //paddingHeight = parseInt('0' + $.getElementStyle(obj, 'padding'), 10),
                paddingHeight = padding.top + padding.bottom,
                conPaddingHeight = parseInt('0' + $.getElementStyle(ctls.content, 'padding'), 10),
                maxSize = Common.getMaxSize(opt),
                margin = Common.getCssAttrSize(opt.margin, {attr: 'margin'}),
                marginHeight = margin.top + margin.bottom;

            if(par.event === 'show' && $.isObject(par.lastSize)) {
                boxWidth = par.lastSize.width;
                boxHeight = par.lastSize.height;
                obj.style.width = boxWidth + 'px';
                obj.style.height = boxHeight + 'px';
            }

            //在非拖动大小并且常态状态时，设置对话框百分比尺寸
            if(!par.drag && _.isNormal() && Common.isPercentSize(opt.width, opt.height)) {
                if($.isPercent(opt.width)) {
                    boxWidth = bs.width * parseInt(opt.width, 10) / 100 - margin.left - margin.right;
                }
                if($.isPercent(opt.height)) {
                    boxHeight = bs.height * parseInt(opt.height, 10) / 100 - margin.top - margin.bottom;
                }
                $.setStyle(ctls.dialog, { width: boxWidth, height: boxHeight }, 'px');
            }

            if (opt.height !== 'auto') {
                /*
                if(boxHeight < opt.height && !_.events.dragingSize) {
                    boxHeight = opt.height;
                    obj.style.height = boxHeight + 'px';
                } else 
                */
                if (!par.fullScreen) {
                    if (Common.isNumberSize(opt.maxHeight)) {
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
            } else if(maxSize.maxWidth && boxWidth > maxSize.maxWidth) {
                boxWidth = maxSize.maxWidth;
                obj.style.width = boxWidth + 'px';
            } else if(maxSize.minWidth && boxWidth < maxSize.minWidth) {
                boxWidth = maxSize.minWidth;
                obj.style.width = boxWidth + 'px';
            }

            if (boxHeight > bs.height) {
                boxHeight = bs.height - 20;
                obj.style.height = boxHeight + 'px';
            } else if(maxSize.maxHeight && boxHeight > maxSize.maxHeight) {
                boxHeight = maxSize.maxHeight;
                obj.style.height = boxHeight + 'px';
            } else if(maxSize.minHeight && boxHeight < maxSize.minHeight) {
                boxHeight = maxSize.minHeight;
                obj.style.height = boxHeight + 'px';
            }

            boxWidth = obj.clientWidth;
            boxHeight = obj.clientHeight;

            //拖动大小时，重新设置尺寸百分比
            if(par.drag) {
                if($.isPercent(opt.width)) {
                    opt.width = parseInt(((obj.offsetWidth + margin.left + margin.right) * 100 / bs.width), 10) + '%';
                }
                if($.isPercent(opt.height)) {
                    opt.height =  parseInt(((obj.offsetHeight + margin.top + margin.bottom) * 100 / bs.height), 10) + '%';
                }
            }

            $.setStyle(ctls.main, { height: boxHeight - paddingHeight }, 'px');

            var mainHeight = ctls.main.offsetHeight,
                titleHeight = ctls.head ? ctls.head.offsetHeight : 0,
                bottomHeight = ctls.foot ? ctls.foot.offsetHeight : 0,
                size = {
                    width: '100%',
                    height: (mainHeight - titleHeight - bottomHeight) + 'px'
                };

            if (ctls.foot) {
                size.marginBottom = ctls.foot.offsetHeight + 'px';
            }
            if (ctls.iframe) {
                $.setStyle(ctls.iframe, { height: size.height });
            }
            return $.setStyle(ctls.body, size), util.setTitleSize(_).showIcon(_), util;
        },        
        dragToNormal: function (_, evt, bs, moveX, moveY) {
            var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls, obj = ctls.dialog;
            if(p.none) { return this; }

            //对话框最大化时，拖动对话框，先切换到标准模式（尺寸、定位）
            util.setSize(_, { type: Config.DialogStatus.Normal });

            var offsetRateX = (evt.clientX / bs.width),
                offsetX = evt.clientX,
                offsetY = evt.clientY - moveY,
                btnPanelWidth = ctls.btnPanel ? ctls.btnPanel.offsetWidth : 0;

            if (offsetRateX > 0.5) {
                offsetX = evt.clientX - obj.offsetWidth + (obj.offsetWidth) * (1 - offsetRateX) + btnPanelWidth * offsetRateX;
            } else if (offsetX > (obj.offsetWidth) / 2) {
                offsetX = evt.clientX - (obj.offsetWidth) / 2;
            } else {
                offsetX = evt.clientX - moveX;
            }
            //移动对话框到当前鼠标位置
            util.setPosition(_, { position: 'custom', event: 'drag', x: offsetX, y: offsetY });

            return this;
        },
        dragSize: function (_) {
            var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none || !opt.sizeAble || !opt.dragSize) { return this; }

            var obj = ctls.dialog,
                docMouseMove = document.onmousemove,
                docMouseUp = document.onmouseup;

            function resizeDialog(dir) {
                if (!opt.sizeAble || !opt.dragSize) {
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
                    minWidth: parseInt(opt.minWidth, 10),
                    minHeight: parseInt(opt.minHeight, 10)
                };
                document.onmousemove = function () {
                    if (!opt.sizeAble || !opt.dragSize || !moveAble) {
                        return false;
                    }
                    p.events.dragingSize = true;
                    var e = $.getEvent(),
                        x = (e.clientX - moveX) * (dir.indexOf(Config.Direction.Left) >= 0 ? -1 : 1),
                        y = (e.clientY - moveY) * (dir.indexOf(Config.Direction.Top) >= 0 ? -1 : 1);

                    util.showIframeShade(ctls, true);
                    util.changeSize(_, { dir: dir, x: x, y: y }, true, par);
                };
                document.onmouseup = function () {
                    if (!opt.sizeAble || !opt.dragSize || !moveAble) {
                        return false;
                    }
                    document.onmousemove = docMouseMove;
                    document.onmouseup = docMouseUp;
                    moveAble = false;
                    p.events.dragingSize = false;
                    util.showIframeShade(ctls, false);
                };
            }

            util.getZoomSwicths(_).each(function (i, obj) {
                $.addListener(obj, 'mousedown', function () {
                    _.topMost();
                    resizeDialog(obj.pos);
                });
            });
            return this;
        },
        showHeadFoot: function(_, isShow, type, rebuild, key) {
            var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none) { return this; }

            if(_.isClosed()) {
                return util;
            }
            if($.isString(isShow, true)) {
                rebuild = type;
                type = isShow;
                isShow = true;
            } else if($.isBoolean(type)) {
                rebuild = type;
                type = null;
            }

            var show = $.isBoolean(isShow, true),
                has, obj, h, dir;

            if(key === 'head') {
                has = ctls.head && ctls.head.style.display !== 'none';
                obj = ctls.head;
                h = has ? obj.offsetHeight : Config.TitleHeight;
                dir = Config.Direction.Top;
            } else {
                has = ctls.foot && ctls.foot.style.display !== 'none';
                obj = ctls.foot;
                h = has ? obj.offsetHeight : Config.BottomHeight;
                dir = Config.Direction.Bottom;
            }
            h = (obj && show) || (!obj && !show) ? 0 : h;

            if(show) {
                rebuild = rebuild || (type && opt.type !== type);
                if(obj && !rebuild) {
                    obj.style.display = '';
                } else {
                    util.setOptions(_, 'options', key === 'head' ? 'showHead' : 'showFoot', true);
                    if(key === 'head'){
                        util.buildHead(_, ctls.main, rebuild);
                    } else {
                        util.buildFoot(_, ctls.main, rebuild);
                    }
                }
            } else if(obj) {
                obj.style.display = 'none';
            }

            if(h !== 0) {
                util.changeSize(_, {dir: dir, y: show ? h : -h});
            }
            return util.setBodySize(_), this;
        },
        setZindex: function (_, zindex) {
            var url = this, p = Util.getParam(_), ctls = p.controls;
            if(p.none || !ctls.dialog) { return this; }

            if (typeof zindex !== 'number') {
                zindex = Common.buildZindex();
            }
            if (ctls.container) {
                ctls.container.style.zIndex = zindex;
            } else {
                ctls.dialog.style.zIndex = zindex;
            }
            return p.options.zindex = zindex, this;
        },
        checkCallback: function(opt) {
            var callback = $.isFunction(opt.callback) ? opt.callback : undefined,
                ok =  $.isFunction(opt.ok) ? opt.ok : ($.isFunction(opt.success) ? opt.success : callback),
                cancel = $.isFunction(opt.cancel) ? opt.cancel : callback;
            return ok || cancel ? {callback: callback, ok: ok, cancel: cancel} : undefined;
        },
        callback: function (_, opt, actions) {
            var func = this.checkCallback(opt);
            if(!func || !$.isObject(actions)) {
                return this;
            }
            var dr = {},
                parameter = actions.param || opt.parameter || opt.param,
                code = actions.code || '',
                result = actions.result || 0;

            dr[code] = dr[code.toLowerCase()] = true;
            dr['key'] = code;
            dr['value'] = result;

            if ([Config.DialogResult.OK, Config.DialogResult.Yes].indexOf(result) >= 0) {
                func.ok && func.ok(dr, _, parameter);
            } else if([Config.DialogResult.Cancel, Config.DialogResult.Ignore, Config.DialogResult.No].indexOf(result) >= 0) {
                func.cancel && func.cancel(dr, _, parameter);
            } else {
                func.callback && func.callback(dr, _, parameter);
            }
            return this;
        },
        dispose: function (_) {
            var url = this, p = Util.getParam(_);
            for(var k in p.controls) {
                p.controls[k] = null;
            }
            for(var k in p.buttons) {
                p.buttons[k] = null;
            }
            if(p.styleElement) {
                p.styleElement.parentNode.removeChild(p.styleElement);
            }
            //TODO:

            return this;
        },
        remove: function(_) {
            return Factory.remove(_.id), this;
        },
        redirect: function(url) {
            if($.isString(url, true)) {
                /*
                var str = url.toLowerCase();
                if(str.startsWith('http:') || str.startsWith('https:')) {
                    location.href = url.setUrlParam('_t_s_', new Date().getMilliseconds());
                    return true;
                }
                */
                location.href = url.setUrlParam('_t_s_', new Date().getMilliseconds());
            }
            return false;
        },
        //以下方法为 tooltip        
        buildTooltip: function (_, options) {
            var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none || _.isClosed()) { return util; }

            if(!$.isElement(opt.target) && $.isString(opt.target, true)){
                opt.target = document.getElementById(opt.target);
            }
            if(!$.isElement(opt.target)){
                return false;
            }
            var tipId = null, d = null;
            try { tipId = opt.target.getAttribute('tipid'); } catch (e) { }

            if (tipId && (d = Factory.getDialog(tipId)) !== null) {
                p.controls = util.getParam(d).controls;
                util.updateTooltip(_, opt.content, opt.target, opt);
            } else {
                //对话框
                ctls.dialog = $.createElement('div');
                ctls.dialog.className = 'oui-tooltip';
                ctls.dialog.style.zIndex = opt.zindex;
                ctls.dialog.id = _.getDialogId();

                ctls.body = util.buildBody(_, ctls.dialog);

                $.setAttribute(opt.target, 'tipid', opt.id);
                p.parent.appendChild(ctls.dialog);
            }
            Factory.setWindowResize();

            return util.setTooltipPosition(_);
        },
        updateTooltip: function (_, options) {
            var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
            if(p.none || _.isClosed()) { return util; }

            if (ctls.content) {
                ctls.content.innerHTML = opt.content;
            }
            return util.setTooltipPosition(_);
        },
        setTooltipStyle: function(_, opt, keys) {
            var styles = {};
            for(var i in keys) {
                var k = keys[i];
                if(opt[k] !== 'auto') {
                    styles[k] = opt[k];
                }
            }
            return styles;
        },
        setTooltipSize: function(_) {
            var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
            var styles = util.setTooltipStyle(_, opt, [
                'width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight'
            ]);
            $.setStyle(ctls.dialog, styles, 'px');
            return util;
        },
        buildTooltipStyle: function(_, par, p) {
            var util = this, 
                opt = p.options,
                obj = p.controls.dialog;
            //设置自定义的样式
            var styles = opt.styles.tooltip || opt.styles.tips || {},
                cssText = Common.toCssText(styles, 'tooltip');
            obj.style.cssText = cssText;
            obj.style.zIndex = opt.zindex;

            var res = util.setTooltipSize(_).setTargetPosition(par, obj), cssName = '';
            if(res.css || styles['border-color']) {
                if(styles['border-color']) {
                    res.css += 'border-' + res.dir + '-color:' + styles['border-color'] + ';';
                }
                cssName = 'tip-pos-' + _.id;
                var cssCon = '.{0}:after,.{0}:before{{{1}}}'.format(cssName, res.css);
                $.createCssStyle(cssCon, 'tip-css-' + _.id, function(elem) {
                    p.styleElement = elem;
                });
            }
            obj.className = 'oui-tooltip oui-tip-' + res.dir + ' ' + cssName;
        },
        loadComplete: function(c, i, func) {
            if(i >= c) {
                func();
            }
        },
        loadImg: function(_, imgs, func) {
            var util = this, c = imgs.length;
            util.loads[_.id] = {idx: 0};

            for(var i=0; i<c; i++) {
                imgs[i].onload = function() {
                    util.loads[_.id].idx += 1;
                    util.loadComplete(c, util.loads[_.id].idx, func);
                };
            }
        },
        setTooltipPosition: function (_) {
            var util = this, 
                p = util.getParam(_), 
                opt = p.options, 
                ctls = p.controls, 
                obj = p.controls.dialog;
            if(p.none || _.isClosed()) { return util; }

            var par = {
                target: opt.target,
                parent: opt.parent,
                position: opt.position,    //默认停靠在目标控件左下方位置
                x: opt.x || 7,
                y: opt.y || 7
            };

            var imgs = ctls.content.getElementsByTagName('img');
            if(imgs.length > 0) {
                util.loadImg(_, imgs, function() {
                    util.buildTooltipStyle(_, par, p);
                });
            } else {
                util.buildTooltipStyle(_, par, p);
            }

            return util;
        }
    };

    //先加载样式文件
    Factory.loadCss();

    function Dialog (content, title, options) {
        var ds = Common.getDefaultSize(),
            opt = $.extend({
                id: null,                       //id
                lang: Config.Lang.Chinese,      //语言 Chinese,English
                type: Config.DialogType.Alert,  //alert,confirm,message,tooltip,window,iframe
                status: Config.DialogStatus.Normal,     //初始状态  normal, min, max 三种状态
                zindex: Common.buildZindex(),   //css z-index值，控制显示层级
                minWidth: '240px',          //最小宽度
                minHeight: '125px',         //最小高度
                maxWidth: '100%',           //最大宽度
                maxHeight: '100%',          //最大高度
                width: ds.width + 'px',     //初始宽度      px, auto, %
                height: ds.height + 'px',   //初始高度      px, auto, %
                margin: 0,              //当宽度或高度设置为 % 百分比时，启用 margin，margin格式参考css [上右下左] 设置，单位为px
                padding: 4,             //内边距（拖动边框）宽度，格式参考css设置,单位为px
                parent: null,           //Element parentNode DIV
                limitRange: true,       //窗体范围(位置、大小)限制 true,false
                opacity: null,          //背景层透明度，默认为 0.2
                shadow: true,           //是否显示CSS阴影
                lock: true,             //是否锁屏
                title: null,            //标题
                content: null,          //文字内容
                url: null,              //加载的URL
                element: null,          //Element 要加载内容的html控件
                icon: '',               //Icon图标  info, warning, question, error, success
                loading: '',            //loading提示文字
                position: 5,            //对话框初始位置, 0,1,2,3,4,5,6,7,8,9，共10种位置设置
                x: 0,                   //x轴(left)偏移量，单位：px
                y: 0,                   //y轴(top)偏移量，单位：px
                target: null,           //Element 要跟随位置的html控件
                fixed: false,           //是否固定位置
                topMost: false,         //是否允许置顶显示
                closeAble: true,        //是否允许关闭
                closeIcon: '',          //Close关闭按钮图标，close0, close1, close2, close3, 默认为空
                closeType: 'close',     //关闭方式， close | hide
                clickBgClose: false,    //'dblclick', // dblclick | click
                escClose: false,        //是否允许按Esc关闭
                keyClose: true,         //是否允许快捷键关闭
                autoClose: false,       //是否自动关闭
                closeTiming: 5000,      //closeTiming timeout time timing 四个字段
                showTimer: false,       //是否显示定时关闭倒计时
                sizeAble: true,         //是否允许改变大小
                dragSize: true,         //是否允许拖动改变大小
                moveAble: true,         //是否允许移动位置
                dragMove: true,         //是否允许拖动改变位置
                maxAble: true,          //是否允许最大化
                minAble: true,          //是否允许最小化
                delayClose: false,      //是否延时关闭，启用延时关闭，则点击“确定按钮”关闭时不会关闭，在callback回调中处理关闭
                callback: null,         //回调参数，默认情况下，只有点击按钮关闭时才会回调
                codeCallback: false,  //始终回调（当使用代码关闭窗口时也会回调）
                ok: null,               //点击确定按钮后的回调函数
                cancel: null,           //点击取消按钮后的回调函数
                parameter: null,        //回调返回的参数
                redirect: null,         //重定向跳转到指定的URL [target]
                buttons: Config.DialogButtons.OKCancel,               //按钮类型编码
                buttonPosition: Config.Position.Center,               //按钮位置 left center right
                buttonText: null,       // {OK: '确定', Cancel: '取消'}  ｛OK: '提交'}
                showHead: true,         //是否显示顶部标题栏 
                showLogo: true,         //是否显示logo图标
                showMin: true,          //是否显示最小化按钮
                showMax: true,          //是否显示最大化按钮
                showClose: true,        //是否显示关闭按钮
                showFoot: true,         //是否显示底部按钮栏
                cancelBubble: false,    //是否阻止背景层事件冒泡
                iframeScroll: true,     //是否允许iframe滚动条
                //自定义样式
                styles: Config.CustomStyles,
                //样式也可以采用单独设置，会自动合并到styles中
                shadeStyle: '',         //遮罩层样式
                dialogStyle: '',        //对话框样式
                mainStyle: '',          //主体框样式
                headStyle: '',          //顶部样式
                titleStyle: '',         //标题样式
                bodyStyle: '',          //主体样式
                contentStyle: '',       //内容样式
                footStyle: '',          //底部样式
                tooltipStyle: ''        //Tooltip样式
            }, Common.checkOptions(content, title, options));

        return this.id = opt.id, this.initial(opt);
    }

    Dialog.prototype = {
        initial: function(options) {
            var p = Util.getParam(this), opt = options || p.options, id = opt.id;

            if($.isElement(opt.parent) && 
                ['DIV'].indexOf(opt.parent.tagName) >= 0) {
                p.parent = opt.parent;
                p.hasParent = true;
            }

            if(!$.isString(opt.title) && !$.isNumber(opt.title)) {
                opt.title = Common.getDialogText('Title', opt.lang);
            }

            if($.isBoolean(opt.clickBgClose)) {
                opt.clickBgClose = opt.clickBgClose ? 'click' : '';
            }

            if (!opt.showHead && !opt.showFoot && !opt.lock &&
                $.isBoolean(opt.closeAble, true) &&
                opt.type !== Config.DialogType.Tooltip) {
                opt.escClose = true;
                opt.clickBgClose = opt.clickBgClose || 'click';
                //没有标题没有底部的消息框，设置内容边距为1px
                opt.contentStyle = $.extend({'padding': '1px'}, opt.contentStyle);
            }
            if(opt.lock) {
                opt.fixed = false;
            }

            var dialog = Factory.getDialog(id);
            if(!dialog) {
                Factory.setDialog(id, this)
                    .setOptions(id, opt)
                    .setOptions(id, 'dialogId', Common.buildId(id, 'd-'));
            }

            return Util.build(this, opt), p.buildTime = new Date().getTime(), this;
        },
        getOptions: function(key) {
            var opt = $.extend({}, Factory.getOptions(this.id, 'options'));
            return $.isString(key, true) ? opt[key] : opt;
        },
        setOptions: function(key, value) {
            var p = Util.getParam(this).options;
            if(!$.isObject(p)) { return this; }
            if ($.isObject(key)) {
                for (var k in key) {
                    if ($.containsKey(p, k)) {
                        p[k] = key[k];
                    }
                }
            } else if ($.isString(key, true)) {
                if ($.containsKey(p, key)) {
                    p[key] = value;
                }
            }
            //检测参数
            Common.checkOptions(p.options);

            return this;
        },
        options: function(key, value) {
            if($.isUndefined(value)) {
                return this.getOptions(key);
            }
            return this.setOptions(key, value);
        },
        getDialogId: function() {
            return Factory.getOptions(this.id, 'dialogId', '');
        },
        /*
        getControls: function() {
            return $.extend({}, Factory.getOptions(this.id, 'controls'));
        },
        getButtons: function() {
            return $.extend({}, Factory.getOptions(this.id, 'buttons'));
        },
        */
        getStatus: function() {
            return $.extend({}, Factory.getOptions(this.id, 'status'));
        },
        isPercent: function() {
            var opt = this.getOptions();
            return Common.isPercentSize(opt.width, opt.height);
        },
        isClosed: function() {
            return $.isBoolean(Factory.getOptions(this.id, 'closed'), true);
        },
        isHide: function() {
            return $.isBoolean(Factory.getOptions(this.id, 'hide'), false);
        },
        isMaximized: function() {
            return this.getStatus().max;
        },
        isMax: function() {
            return this.isMaximized();
        },
        isMinimized: function() {
            return this.getStatus().min;
        },
        isMin: function() {
            return this.isMinimized();
        },
        isNormal: function() {
            return this.getStatus().normal;
        },
        show: function (content, title) {
            var _ = this, p = Util.getParam(_);
            if(_.isClosed() || !p || !_.isHide()) {
                return _;
            }
            Util.setOptions(_, 'hide', false)
                .hideDocOverflow(_, false)
                .showDialog(p.controls, true, content, title)
                .setBodySize(_, {event: 'show', lastSize: p.hideSize});

            return _;
        },
        hide: function (action, dialogResult) {
            var _ = this, p = Util.getParam(_), opt = p.options;
            if(_.isClosed() || _.isHide() || !p || !opt.closeAble) {
                return _;   
            }
            var ctls = p.controls,
                timers = p.timers,
                url = opt.redirect || opt.targetUrl,
                actions = Util.getAction(_);

            //记录隐藏之前的对话框尺寸大小，以便再次显示时，还原尺寸大小
            Util.setOptions(_, 'hideSize', {width: ctls.dialog.offsetWidth, height: ctls.dialog.offsetHeight});
            
            Util.showDialog(ctls, false)
                .setOptions(_, 'hide', true)
                .delAction(_)
                .clearTimer(timers)
                .hideDocOverflow(_, true)
                .callback(_, opt, actions)
                .redirect(url);

            return _;
        },
        close: function () {
            var _ = this, util = Util, p = util.getParam(_), opt = p.options;
            if(_.isClosed() || !p || !opt.closeAble) {
                return _;
            }
            var ctls = p.controls,
                timers = p.timers,
                url = opt.redirect || opt.targetUrl,
                actions = util.getAction(_);

            var func = util.checkCallback(opt);

            // 点击确定按钮时，若延时关闭，则仅回调而不关闭
            if(opt.delayClose 
                && actions.result !== Config.DialogResult.Close
                && (util.isIframe(opt) || util.isSure(actions.result))
                && func 
                && (func.callback || func.ok)) {
                return util.delAction(_).callback(_, opt, actions), _;
            }
            if(opt.closeType === 'hide') {
                return _.hide();
            }

            $.removeChild(p.parent, [ctls.container || ctls.dialog, ctls.shade]);

            util.setOptions(_, 'closed', true)
                .delAction(_)
                .clearTimer(timers)
                .hideDocOverflow(_, true)
                .callback(_, opt, actions)
                .dispose(_)
                .remove(_)
                .redirect(url);

            return _;
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
            var opt = Common.checkOptions(content, title, options, true);
            var _ = this, p = Util.getParam(_), ctls = p.controls;

            if(opt.type && !opt.buttons) {
                opt.buttons = Common.getDialogButtons(opt.type);
            }

            //更新时，若样式设置为null,则清除之前的样式设置
            if(opt.newStyles === null) {
                this.setOptions('styles', {});
            }
            //更新时，若没有设置新的样式，则复制之前的样式设置
            if($.isUndefined(opt.styles) || $.isEmpty(opt.styles)) {
                $.extend(opt.styles, p.options.styles);
            }

            if ($.extend(p.options, opt).type === Config.DialogType.Tooltip) {
                Util.updateTooltip(_, p.options);
                return _;
            }
            if (ctls.content) {
                var isAutoSize = Util.isAutoSize(_),
                    isMin = p.status.min;

                if (ctls.title && opt.title) {
                    ctls.title.innerHTML = opt.title;
                }
                if(isMin) {
                    Util.setSize(_, {type: Config.DialogStatus.Normal});
                }
                Util.buildContent(_, true).setBodySize(_).setCache(_);

                if(isMin) {
                    Util.setSize(_, {type: Config.DialogStatus.Min});
                }

                if (isAutoSize) {
                    Util.setPosition(_);
                }
            }
            return _;
        },
        append: function (content, title, options) {
            var _ = this, p = Util.getParam(_), ctls = p.controls;
            if (p.none || !ctls.content) {
                return this;
            }
            if(ctls.icon) {
                $.removeChild(ctls.content, ctls.icon);
            }
            var html = ctls.content.innerHTML;
            return this.update(html + content, title, options);
        },
        insert: function (content, title, options) {
            var _ = this, p = Util.getParam(_), ctls = p.controls;
            if (p.none || !ctls.content) {
                return _;
            }
            if(ctls.icon) {
                $.removeChild(ctls.content, ctls.icon);
            }
            var html = ctls.content.innerHTML;
            return _.update(content + html, title, options);
        },
        focus: function (obj) {
            var _ = this, p = Util.getParam(_), buttons = p.buttons;
            if (p.none) {
                return _;
            }
            if ($.isElement(obj)) {
                return obj.focus(), _;
            } else if (!_.isClosed()) {
                var btn = null;
                for (var k in buttons) {
                    btn = buttons[k];
                }
                return btn && btn.focus(), _;
            }
            return _;
        },
        min: function () {
            return Util.setSize(this, { type: Config.DialogStatus.Min });
        },
        max: function () {
            var _ = this, p = Util.getParam(_);
            if(p.none) { return _; }

            var type = Config.DialogStatus.Max, status = p.status, lastStatus = p.lastStatus;

            if (p.status.max || (p.status.min && lastStatus === Config.DialogStatus.Normal)) {
                type = Config.DialogStatus.Normal;
            }
            return Util.setSize(_, { type: type });
        },
        restore: function() {
            return Util.setSize(this, { type: Config.DialogStatus.Normal });
        },
        normal: function () {
            return Util.setSize(this, { type: Config.DialogStatus.Normal });
        },
        resize: function(options) {
            $.extend(options, {resizeTo: false});
            return Util.changeSize(this, options), this;
        },
        resizeTo: function(options) {
            $.extend(options, {resizeTo: true});
            return Util.changeSize(this, options), this;
        },
        position: function(options) {
            var _ = this, p = Util.getParam(_);
            if(_.isClosed() || p.none) { return false; }
            var opt = _.options, ctls = _.controls;
            return Util.setPosition(_, options), this;
        },
        move: function(options) {
            return Util.movePosition(this, options, false), this;
        },
        moveTo: function(options) {
            return Util.movePosition(this, options, true), this;
        },
        appendChild: function (elem, pNode) {
            return $.appendChild(pNode || this.getControls().content, elem), this;
        },
        zindex: function (zindex) {
            if($.isUndefined(zindex)) {
                return this.getOptions().zindex;
            }
            return Util.setZindex(this, zindex), this;
        },
        topMost: function () {
            var _ = this, p = Util.getParam(_);
            if (p.none || _.isClosed() || !p.options.topMost) {
                return false;
            }
            var d = Factory.getTop();
            if (d && !Util.isSelf(_, d)) {
                var zindex = d.getOptions().zindex;
                Util.setZindex(d, _.getOptions().zindex);
                return Util.setZindex(_, zindex);
            }
            return _;
        },
        showHead: function(isShow, type, rebuild) {
            return Util.showHeadFoot(this, isShow, type, rebuild, 'head');
        },
        showFoot: function(isShow, type, rebuild) {
            Util.showHeadFoot(this, isShow, type, rebuild, 'foot');
            return this.position(), this;
        }
    };

    $.extend({
        DialogType: Config.DialogType,
        DialogButtons: Config.DialogButtons
    });

    $.extend({
        dialog: function (content, title, options) {
            return Factory.show(content, title, options);
        },
        alert: function (content, title, options) {
            return Factory.show(content, title, options, Config.DialogType.Alert);
        },
        confirm: function (content, title, options) {
            return Factory.show(content, title, options, Config.DialogType.Confirm);
        },
        message: function (content, options) {
            return Factory.show(content, undefined, options, Config.DialogType.Message);
        },
        tips: function (content, target, options) {
            return Factory.show(content, undefined, options, Config.DialogType.Tips, target);
        },
        tooltip: function (content, target, options) {
            return Factory.show(content, undefined, options, Config.DialogType.Tooltip, target);
        }
    });

    $.extend($.dialog, {
        msg: function (content, options) {
            return Factory.show(content, undefined, options, Config.DialogType.Msg);
        },
        win: function (content, title, options) {
            return Factory.show(content, title, options, Config.DialogType.Win);
        },
        form: function (content, title, options) {
            return Factory.show(content, title, options, Config.DialogType.Form);
        },
        load: function (urlOrElement, title, options) {
            return Factory.show(urlOrElement, title, options, Config.DialogType.Load);
        },
        iframe: function(url, title, options) {
            return Factory.show(url, title, options, Config.DialogType.Iframe);
        },
        url: function(url, title, options) {
            return Factory.show(url, title, options, Config.DialogType.Url);
        },
        close: function (id) {
            return Factory.close(id), $;
        },
        closeAll: function (type) {
            return Factory.closeAll(type), $;
        },
        closeParent: function(id, param) {
            return Factory.closeParent(id, param), $;
        },
        resizeParent: function(id, param) {
            return Factory.resizeParent(id, param), $;
        }
    });

    $.extend($.tooltip, {
        close: function (id) {
            if ($.isElement(id)) {
                id = id.getAttribute('tipId');
            }
            return Factory.close(id), $;
        },
        closeAll: function (type) {
            return Factory.closeAll(type || Config.DialogType.Tooltip), $;
        }
    });

}(OUI);