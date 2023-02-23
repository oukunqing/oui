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
        DefaultSkin: 'default',
        IsDefaultSkin: function(skin) {
            return (!$.isUndefined(skin) ? skin : Config.GetSkin()) === Config.DefaultSkin;
        },
        Skin: '',
        GetSkin: function() {
            if(!Config.Skin) {
                Config.Skin = $.getQueryString(Config.FilePath, 'skin') || Config.DefaultSkin;
            }
            return Config.Skin;
        },
        //是否显示logo小图标
        ShowLogo: function() {
            var show = $.getQueryString(Config.FilePath, 'logo');
            return show !== '0' && show !== 'false';
        },
        //重载图标的位置 left 或 right
        ReloadPosition: function() {
            return $.getQueryString(Config.FilePath, ['reloadPosition','reloadPos']) || 'right';
        },
        GetLang: function() {
            return $.getQueryString(Config.FilePath, ['lang']) || 'chinese';
        },
        Index: 1,
        IdIndex: 1,
        Identifier: 'oui-dialog-identifier-',
        TargetAttributeName: 'dialog-id',
        TooltipAttributeName: 'tooltip-id',
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
        DialogType: {
            dialog: 'dialog',
            alert: 'alert',
            confirm: 'confirm',
            form: 'form',
            win: 'win',
            window: 'window',
            iframe: 'iframe',
            url: 'url',
            load: 'load',
            tooltip: 'tooltip',
            tips: 'tips',
            message: 'message',
            msg: 'msg',
            info: 'info',
            about: 'about',
            toolwindow: 'toolwindow',
            toolwin: 'toolwin',
            panel: 'panel',
            box: 'box',
            blank: 'blank'
        },
        DialogStatus: {
            normal: 'normal',
            max: 'max',
            min: 'min',
            close: 'close',
            hide: 'hide',
            tooltip: 'tooltip',
            reload: 'reload'
        },
        DialogStatusText: {
            min: { english: 'Minimize', chinese: '\u6700\u5c0f\u5316' },                  //最小化
            max: { english: 'Maximize', chinese: '\u6700\u5927\u5316' },                  //最大化
            close: { english: 'Close', chinese: '\u5173\u95ed' },                         //关闭
            restore: { english: 'Restore', chinese: '\u8fd8\u539f' },                     //还原
            reload: { english: 'Reload', chinese: '\u91cd\u65b0\u52a0\u8f7d' }            //重新加载
        },
        CloseType: {
            close: 'Close',
            child: 'Child',
            code: 'Code'
        },
        DialogResult: {
            close: 0,
            ok: 1,
            cancel: 2,
            abort: 3,
            retry: 4,
            ignore: 5,
            yes: 6,
            no: 7,
            child: 8,
            code: 9
        },
        DefaultResult: {
            'close': { key: 'close', code: 'close', result: 0 },
            'child': { key: 'child', code: 'child', result: 8 },
            'code': { key: 'code', code: 'code', result: 9 }
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
            ['ok'],
            ['ok', 'cancel'],
            ['abort', 'retry', 'ignore'],
            ['yes', 'no', 'cancel'],
            ['yes', 'no'],
            ['retry', 'cancel']
        ],
        DialogIcon: {
            none: '',
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
            happy: 'smile',
            loading: 'loading',
        },
        ButtonConfig: {
            none: { key: 'None', text: '\u5173\u95ed', result: 0, skey: '', css: 'btn-default' },
            close: { key: 'Close', text: '\u5173\u95ed', result: 0, skey: 'W', css: 'btn-default' },
            ok: { key: 'OK', text: '\u786e\u5b9a', result: 1, skey: 'Y', css: 'btn-primary' },
            cancel: { key: 'Cancel', text: '\u53d6\u6d88', result: 2, skey: 'N', css: 'btn-default' },
            abort: { key: 'Abort', text: '\u4e2d\u6b62', result: 3, skey: 'A', css: 'btn-danger' },
            retry: { key: 'Retry', text: '\u91cd\u8bd5', result: 4, skey: 'R', css: 'btn-warning' },
            ignore: { key: 'Ignore', text: '\u5ffd\u7565', result: 5, skey: 'I', css: 'btn-default' },
            yes: { key: 'Yes', text: '\u662f', result: 6, skey: 'Y', css: 'btn-primary' },
            no: { key: 'No', text: '\u5426', result: 7, skey: 'N', css: 'btn-default' }
        },
        CustomButtonConfig: function (code, opt) {
            var key = (opt.key || '').toLowerCase(),
                cfg = this.ButtonConfig[key] || {},
                result = cfg.result || 0;
            return {
                key: (key || 'none').toLowerCase(), text: opt.text || '',
                result: opt.result || result, skey: opt.skey || '', css: opt.css || 'btn-default'
            };
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
            },
            About: {
                english: 'About',
                chinese: '\u5173\u4e8e'
            }
        }
    },
        Common = {
            isInKeys: function (key, keys, config) {
                var hasConfig = $.isObject(config);
                for (var i = 0; i < keys.length; i++) {
                    if (hasConfig) {
                        var cfg = config[keys[i]];
                        if (!$.isUndefined(cfg) && cfg === key) {
                            return true;
                        }
                    } else if (keys[i] === key) {
                        return true;
                    }
                }
                return false;
            },
            isChildFocus: function (elem, parent) {
                if ($.isString(elem, true)) {
                    elem = document.getElementById(elem.replace('#', ''));
                }
                if (!$.isElement(elem) || elem === parent || elem.disabled
                    || !this.isInKeys(elem.tagName, ['A', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'])
                    || $.getElementStyle(elem, 'display') === 'none'
                    || $.getElementStyle(elem, 'visibility') === 'hidden') {
                    return false;
                }
                var pNode = elem.parentNode;
                while (pNode) {
                    if (pNode === parent) {
                        return elem.focus(), true;
                    }
                    pNode = pNode.parentNode;
                }
                return false;
            },
            getDialogText: function (key, lang) {
                var txt = Config.DialogText[key];
                if (txt) {
                    return txt[(lang || '').toLowerCase()];
                }
                return '';
            },
            getStatusText: function (key, lang) {
                var txt = Config.DialogStatusText[(key || '').toLowerCase()];
                if (txt) {
                    return txt[(lang || '').toLowerCase()];
                }
                return '';
            },
            getButtonText: function (key, lang) {
                var txt = Config.ButtonText[(key || '').toLowerCase()];
                if (txt) {
                    return txt[(lang || '').toLowerCase()];
                }
                return '';
            },
            getDialogButtons: function (type) {
                var buttons = Config.DialogButtons.None;
                switch (type) {
                    case Config.DialogType.alert:
                        buttons = Config.DialogButtons.OK;
                        break;
                    case Config.DialogType.confirm:
                        buttons = Config.DialogButtons.OKCancel;
                        break;
                    case Config.DialogType.dialog:
                        buttons = Config.DialogButtons.OKCancel;
                        break;
                }
                return buttons;
            },
            checkStyleUnit: function (s) {
                if ($.isNumber(s)) {
                    return s + 'px';
                }
                if ($.isString(s, true)) {
                    if (s.toLowerCase() === 'auto' || $.isStyleUnit(s)) {
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
                var tick = new Date().getTime(),
                    num = ('' + tick).substr(start || 4, len || 8);
                if(num.indexOf('0') === 0) {
                    num = '1' + num;
                }
                return parseInt(num, 10);
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
            checkTiming: function (opt) {
                if (!$.isNumber(opt.closeTiming)) {
                    opt.closeTiming = opt.timeout || opt.timing || opt.time;
                }
                opt.closeTiming = Math.abs(parseInt('0' + opt.closeTiming, 10));
                return opt;
            },
            checkCustomStyle: function (opt, isUpdate) {
                if (isUpdate && opt.styles === null) {
                    opt.newStyles = null;
                }
                //检测自定义样式设置
                if (!opt.styles || !$.isObject(opt.styles)) {
                    opt.styles = {};
                }
                if (!isUpdate) {
                    opt.styles = $.extend({}, Config.CustomStyles, opt.styles);
                }
                //合并自定义的样式
                for (var k in opt.styles) {
                    $.extend(opt.styles[k], opt[k + 'Style']);
                }
                return this;
            },
            checkOptions: function (content, title, opt, isUpdate, dialogType) {
                var target = null,  //目标控件，用于位置停靠
                    elem = null,    //内容控件，用于加载内容
                    func = null;    //回调函数

                if (arguments.length <= 1 || title === undefined) {
                    title = '';
                }
                if (content && $.isElement(content)) {
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
                    title = '';
                } else if ($.isFunction(title)) {
                    if(dialogType === Config.DialogType.confirm) {
                        opt = { ok: title };
                    } else {
                        func = title;
                    }
                    title = '';
                }
                if ($.isFunction(opt)) {
                    opt = dialogType === Config.DialogType.confirm ? { ok: opt } : { callback: opt };
                }
                if (!$.isObject(opt)) {
                    opt = {};
                }
                opt.element = elem || opt.element;
                opt.content = content || opt.content || content;
                opt.title = title || opt.title || title;
                opt.target = target || opt.anchor || opt.target;
                opt.callback = func || opt.callback;
                opt.complete = opt.complete || opt.onload || opt.ready;
                opt.coverOCX = opt.coverOCX || opt.coverOcx || opt.cover;

                if (!$.isString(opt.title) && !$.isNumber(opt.title)) {
                    opt.title = undefined;
                }

                //对话框关闭后，要获取焦点的HTML控件
                opt.focusTo = opt.focusTo || opt.focus;
                if (!$.isElement(opt.focusTo)) {
                    opt.focusTo = $.isString(opt.focusTo, true) ? $I(opt.focusTo) : undefined;
                }

                //对话框尺寸改变后，要回调的函数
                opt.resize = opt.resize || opt.onresize;

                opt.type = this.checkType(opt.type, false);

                if (!$.isElement(opt.target) && $.isString(opt.target, true)) {
                    opt.target = document.getElementById(opt.target);
                }

                if (!$.isElement(opt.parent) && $.isString(opt.parent, true)) {
                    opt.parent = document.getElementById(opt.parent);
                }

                opt.forname = (opt.forname || opt.forName) || (opt.forid || opt.forId) || opt.for;
                if($.isElement(opt.forname)) {
                    opt.forname = opt.forname.id || opt.forname.name || '';
                }

                if ($.isBoolean(opt.boxShadow) || opt.boxShadow === 'none') {
                    opt.shadow = opt.boxShadow;
                }

                if ($.isNumeric(opt.closeIcon)) {
                    opt.closeIcon = 'close' + opt.closeIcon;
                } else {
                    opt.closeIcon = ('' + (opt.closeIcon || '')).toLowerCase();
                }

                if ($.isUndefined(opt.parameter) && !$.isUndefined(opt.param)) {
                    opt.parameter = opt.param;
                }

                if ($.isBoolean(opt.clickBgClose)) {
                    if (opt.clickBgClose) {
                        opt.clickBgClose = 'click';
                    }
                } else {
                    if (!('' + opt.clickBgClose).toLowerCase().in(['dblclick', 'click'])) {
                        opt.clickBgClose = false;
                    }
                }

                if ($.isString(opt.skin, true)) {
                    opt.skin = opt.skin.toLowerCase();
                } else {
                    //opt.skin = Config.DefaultSkin;
                    //指定默认样式
                    opt.skin = Config.GetSkin();
                }

                if($.isBoolean(opt.copyAble, false) || $.isBoolean(opt.selectAble || opt.selectable, false)) {
                    opt.copyAble = true;
                }

                opt.reloadPosition = opt.reloadPosition || opt.reloadPos;
                if (!$.isString(opt.reloadPosition, true)) {
                    opt.reloadPosition = Config.ReloadPosition(); 
                }

                //关于窗口内容重新加载：点击重载按钮，可以实现内容重新加载，具体实现由回调函数实现
                if ($.isFunction(opt.reload)) {
                    opt.showReload = true;
                    opt.reloadCallback = opt.reload;
                }
                opt.showReload = opt.showReload || opt.showLoad;
                opt.reloadCallback = opt.reloadCallback || opt.reloadFunc;

                return this.checkCustomStyle(opt, isUpdate).checkTiming(opt), opt;
            },
            getCssAttrSize: function (val, options) {
                var p = $.extend({
                    attr: 'margin',      // margin, padding, border
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
                if (Common.isInKeys(type, ['message', 'msg'], Config.DialogType)) {
                    return Config.DialogType.message;
                } else if (Common.isInKeys(type, ['tooltip', 'tips'], Config.DialogType)) {
                    return Config.DialogType.tooltip;
                } else if (Common.isInKeys(type, ['panel', 'box'], Config.DialogType)) {
                    return Config.DialogType.panel;
                }
                return type || (isBuild ? Config.DialogType.dialog : '');
            },
            checkIcon: function (opt) {
                if (!$.isString(opt.icon, true)) {
                    return false;
                }
                var icon = ('' + opt.icon).toLowerCase();
                if (Config.DialogIcon[icon]) {
                    opt.icon = Config.DialogIcon[icon];
                    return true;
                }
                return false;
            },
            isPercentSize: function (width, height) {
                return $.isPercent(width) || (typeof height !== 'undefined' && $.isPercent(height));
            },
            toCssText: function (styles, type) {
                //TODO:
                switch (type) {
                    case 'shade':
                        break;
                    case 'dialog':
                        break;

                }
                return $.toCssText(styles);
            },
            hasEvent: function (elem) {
                var keys = ['onclick', 'ondblclick', 'onmousedown'], attr;
                for (var i in keys) {
                    attr = elem.getAttribute(keys[i]);
                    if (attr) {
                        return true;
                    }
                }
                return false;
            },
            isPlainText: function (obj) {
                var childs = obj.getElementsByTagName('*'),
                    len = childs.length,
                    pass = ['BR', 'IFRAME', 'P', 'FONT'],
                    tags = ['INPUT', 'A', 'TEXTAREA', 'BUTTON'],
                    isText = true,
                    elem, tag, attr;

                if (len === 0) {
                    return isText;
                }
                for (var i = 0; i < len; i++) {
                    elem = childs[i];
                    tag = elem.tagName;
                    if (pass.indexOf(tag) >= 0) {
                        continue;
                    }
                    if (tags.indexOf(tag) >= 0 || this.hasEvent(elem)) {
                        isText = false;
                        break;
                    }
                }
                return isText;
            },
            getDefaultSize: function () {
                var screenWidth = window.screen.width, size = {};
                if (screenWidth <= 1366) {
                    size = { width: 360, height: 180 };
                } else if (screenWidth <= 1440) {
                    size = { width: 400, height: 200 };
                } else if (screenWidth <= 1920) {
                    size = { width: 500, height: 250 };
                } else {
                    size = { width: 600, height: 300 };
                }
                return size;
            },
            getSizeNumber: function (num) {
                var n = ('' + num).indexOf('%') < 0 ? parseInt(num, 10) : 0;
                return isNaN(n) ? 0 : n;
            },
            getMaxSize: function (opt) {
                var size = {
                    minWidth: this.getSizeNumber(opt.minWidth),
                    minHeight: this.getSizeNumber(opt.minHeight),
                    maxWidth: this.getSizeNumber(opt.maxWidth),
                    maxHeight: this.getSizeNumber(opt.maxHeight)
                };
                return size;
            },
            getRealSize: function (txt, opt) {
                if($.isString(txt, true)) {
                    return $.getContentSize(txt, {className: 'oui-dialog-title-size', id: 'div-oui-dialog-text-size-01'});
                }
                if(opt) {
                    return {width: opt.width, height: opt.height};
                }
                return { width: 0, height: 0 };
            },
            isPanelType: function(type) {
                return type === Config.DialogType.panel || type === Config.DialogType.blank;
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
                Cache.ids.push({ key: key, id: id });
                Cache.dialogs[key] = {
                    dialog: dialog,
                    parent: document.body,
                    hasParent: false,
                    options: {},
                    controls: {},
                    btns: {},
                    buttons: {},
                    defaultButton: '',
                    buttonCallback: { //自定义按钮回调函数

                    },
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
                    debounceActions: {},
                    debounceTimers: {},
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
                if (cache) {
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
                if (cache) {
                    if ($.isString(key, true)) {
                        if (!$.isUndefined(value)) {
                            cache[key][subKey] = value;
                        } else if (!$.isUndefined(subKey)) {
                            cache[key] = subKey;
                        }
                    } else if ($.isObject(key)) {
                        cache['options'] = key;
                    }
                }
                return this;
            },
            getTop: function () {
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
            getLast: function () {
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
            closeFor: function (forname) {
                for (var k in Cache.dialogs) {
                    var p = Cache.dialogs[k], d = p.dialog;
                    if (p && p.controls.dialog && p.options && p.options.forname === forname
                        && d && !d.isClosed() && d.getOptions().closeAble) {
                        d.close();
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
            closeParent: function (id, param) {
                if (!$.isUndefined(id)) {
                    var cache = this.getOptions(id), dialog = cache.dialog;
                    if (cache && dialog && dialog.getOptions().closeAble) {
                        Util.setAction(dialog, Config.CloseType.child, param);
                    }
                }
                return this;
            },
            //根据子页面设置当前对话框尺寸
            resizeParent: function (id, param) {
                if (!$.isUndefined(id)) {
                    var cache = this.getOptions(id), dialog = cache.dialog;
                    if (cache && dialog && !dialog.isClosed()) {
                        dialog.resizeTo($.extend(param, { isBody: true })).position();
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
            allowClose: function (curTime, buildTime) {
                return curTime - buildTime > 500;
            },
            setClickDocClose: function (id, eventName) {
                var _ = this;
                if (Cache.docCloses[eventName].indexOf(id) < 0) {
                    Cache.docCloses[eventName].push(id);
                }
                if (_.isRepeat('doc' + eventName)) {
                    return _;
                }
                $.addListener(document, eventName, function (e) {
                    var list = Cache.docCloses[eventName], ts = new Date().getTime();
                    for (var i = list.length - 1; i >= 0; i--) {
                        var p = Factory.getOptions(list[i]) || {}, d = p.dialog;
                        if (d && !d.isClosed() && !d.isHide() && _.allowClose(ts, p.buildTime)) {
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
                            if (opt.type === Config.DialogType.tooltip) {
                                Util.setTooltipPosition(d);
                            } else {
                                var par = { event: 'window.resize' }, fullScreen = d.isMaximized();
                                if (fullScreen || d.isPercent()) {
                                    Util.setBodySize(d, $.extend(par, { fullScreen: fullScreen }));
                                }
                                Util.setPosition(d, par);
                            }
                        }
                    }
                });
                return this;
            },
            //表单容器缓存，防止重复设置
            FormCache: {},
            //设置表单滚动事件
            setFormScroll: function(obj) {
                var parent = obj.parentNode;
                while(parent.tagName === 'DIV') {
                    var id = parent.id;                    
                    if(id && !Factory.FormCache[id]) {
                        var style = $.getElementStyle(parent, 'overflow');
                        //判断表单容器overflow是否为auto
                        if(style && style.toLowerCase() === 'auto') {
                            //表单输入框父级DIV容器滚动时，重新定位提示框
                            $.addListener(parent, 'scroll', function(e) {
                                for (var i = 0; i < Cache.ids.length; i++) {
                                    var d = Factory.getDialog(Cache.ids[i].id);
                                    if (d && !d.isClosed()) {
                                        var p = Util.getParam(d), opt = p.options;
                                        if (opt.type === Config.DialogType.tooltip) {
                                            Util.setTooltipPosition(d);
                                        }
                                    }
                                }
                            });
                        }
                        Factory.FormCache[id] = id;
                    }
                    parent = parent.parentNode;
                }
                return this;
            },
            show: function (content, title, options, type, target, okButton) {
                var par = Common.checkOptions(content, title, options, false, type),
                    opt = {
                        id: Common.buildId(par.id),
                        type: Common.checkType(type || par.type, true)
                    };

                $.extend(par, { target: target });

                switch (opt.type) {
                    case Config.DialogType.alert:
                        opt.buttons = Config.DialogButtons.OK;
                        opt.showMin = opt.showMax = opt.maxAble = false;
                        opt.keyClose = opt.escClose = opt.clickBgClose = false;
                        opt.buttonPosition = 'right';
                        break;
                    case Config.DialogType.confirm:
                        opt.buttons = Config.DialogButtons.OKCancel;
                        opt.showMin = opt.showMax = opt.maxAble = false;
                        opt.keyClose = opt.escClose = opt.clickBgClose = false;
                        opt.buttonPosition = 'right';
                        if($.isBoolean(okButton, false) || $.isUndefined(okButton)) {
                            opt.defaultButton = 'OK';
                        } else if($.isString(okButton, true) || $.isNumber(okButton)) {
                            opt.defaultButton = okButton;
                        }
                        break;
                    case Config.DialogType.dialog:
                        opt.height = 'auto';
                        break;
                    case Config.DialogType.win:
                        opt.showFoot = $.isBoolean(par.showFoot, false);
                        opt.height = 'auto';
                        break;
                    case Config.DialogType.form:
                        opt.height = 'auto';
                        opt.delayClose = true;
                        opt.form = true;
                        break;
                    case Config.DialogType.url:
                    case Config.DialogType.load:
                    case Config.DialogType.iframe:
                        opt.showFoot = $.isBoolean(par.showFoot, false);
                        opt.codeCallback = true;
                        opt.keyClose = opt.escClose = opt.clickBgClose = false;
                        break;
                    case Config.DialogType.about:
                    case Config.DialogType.toolwindow:
                    case Config.DialogType.toolwin:
                        opt.minAble = opt.maxAble = opt.sizeAble = opt.dragSize = false;
                        opt.showLogo = false;
                        opt.showFoot = false;
                        break;
                    case Config.DialogType.panel:
                    case Config.DialogType.blank:
                        opt.minAble = opt.maxAble = opt.sizeAble = opt.dragSize = false;
                        opt.showLogo = opt.showMin = opt.showMax = opt.showClose = false;
                        opt.showFoot = opt.showHead = false;
                        opt.form = true;

                        if (opt.type === Config.DialogType.blank) {
                            opt.padding = opt.radius = opt.border = 0;
                        }
                        break;
                    case Config.DialogType.message:
                    case Config.DialogType.msg:
                    case Config.DialogType.tooltip:
                    default:
                        opt.buttons = Config.DialogButtons.None;
                        opt.showHead = opt.showFoot = opt.dragSize = false;
                        //opt.width = opt.minWidth = 'auto';
                        opt.height = opt.minHeight = 'auto';
                        opt.minAble = opt.maxAble = opt.lock = false;
                        break;
                }
                //设置 tooltip 默认位置为 right
                if (opt.type === Config.DialogType.tooltip && !opt.position) {
                    opt.position = 6; //right
                }

                if(opt.type === Config.DialogType.about) {
                    //opt.title = '关于';
                    opt.title = Common.getDialogText('About', opt.lang) || '';
                }

                var p = this.getOptions($.extend(opt, par).id);
                if (!p && (opt.target || opt.type === Config.DialogType.tooltip)) {
                    var attrName = opt.type === Config.DialogType.tooltip ? Config.TooltipAttributeName : Config.TargetAttributeName;
                    var tid = $.getAttribute(opt.target, attrName);
                    if (tid) {
                        p = this.getOptions(tid);
                    }
                }

                var d = p ? p.dialog : undefined;
                if (p && d && p.controls && p.controls.dialog) {
                    d.update(opt.content, opt.title, opt).show();
                } else {
                    this.initCache(opt.id, null);
                    d = new Dialog(opt.content, opt.title, opt);
                }

                return d;
            },
            loadCss: function (skin, func) {
                var path = Config.FilePath,
                    name = $.getFileName(path, true),
                    dir = $.getFilePath(path);

                if ($.isString(skin, true)) {
                    dir += 'skin/' + skin + '/';
                }
                $.loadLinkStyle(dir + name.replace('.min', '') + '.css', function () {
                    if ($.isFunction(func)) {
                        func();
                    }
                });
            }
        },
        Util = {
            loads: {},
            getParam: function (_) {
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
            isWap: function() {
                return $.isWap;
            },
            isSelf: function (_, dialog) {
                if (!dialog || !Factory.getDialog(dialog.id)) {
                    return false;
                }
                return dialog.getOptions().id === _.getOptions().id;
            },
            isIframe: function (opt) {
                return Common.isInKeys(opt.type, ['url', 'iframe', 'load'], Config.DialogType);
            },
            isSure: function (result) {
                return [Config.DialogResult.ok, Config.DialogResult.yes].indexOf(result) >= 0;
            },
            isDefaultResult: function (code) {
                return Common.isInKeys(code, ['close', 'child', 'code'], Config.CloseType);
            },
            appendChild: function (elem, pNode) {
                return $.appendChild(pNode, elem), this;
            },
            getCache: function (_, key, defaultValue) {
                return Factory.getOptions(_.id, key, defaultValue);
            },
            setStatus: function (_, key) {
                var obj = { key: key };
                obj[key] = true;
                var lastStatus = this.getCache(_, 'status').key;
                return this.setOptions(_, 'lastStatus', lastStatus).setOptions(_, 'status', obj);
            },
            hideDocOverflow: function (_, isShow) {
                var overflow;
                if (isShow) {
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
            //判断对话框是否在窗口可见范围内
            isVisible: function(ctls) {
                var bs = $.getBodySize(),
                    ds = $.getOffset(ctls.dialog);

                //判断对话框是否在窗口范围外（保留20像素）
                if(ds.left >= bs.width - 20 || ds.top >= bs.height - 20) {
                    return false;
                }
                return true;
            },
            showDialog: function (ctls, isShow, content, title) {
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
            close: function (_) {
                return _.close(), this;
            },
            build: function (_, options) {
                var util = this, p = Util.getParam(_), opt = p.options, ctls = p.controls;
                var status = opt.status || Config.DialogStatus.normal, isWap = util.isWap();

                opt.type = Common.checkType(opt.type, true);

                if (status !== Config.DialogStatus.normal) {
                    opt.status = Config.DialogStatus.normal;
                }

                if (opt.type === Config.DialogType.tooltip) {
                    //不需要遮罩层
                    opt.lock = false;
                    return util.buildTooltip(_, options), util;
                } else if (opt.lock) {
                    util.hideDocOverflow(_)
                        .buildShade(_)
                        .buildContainer(_);
                }

                //设置创建时间，防止被document事件关闭
                p.buildTime = new Date().getTime();

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

                var cover = $I(_.getDialogId() + '-cover');
                if (opt.coverOCX && cover !== null) {
                    ctls.cover = cover;
                }

                util.setSize(_, { type: opt.status, width: opt.width, height: opt.height });

                if (util.isAutoSize(_)) {
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

                if (!opt.form && (!opt.showHead || ctls.iframe || Common.isPlainText(ctls.content))) {
                    $.addListener([ctls.body, ctls.dialog], isWap ? 'touchstart' : 'mousedown', function (ev) {
                        $.cancelBubble();
                        _.topMost();
                        if(isWap) {
                            ev.preventDefault();
                        }
                    });

                    $.addListener(ctls.dialog, isWap ? ['touchstart'] : ['click', 'dblclick'], function (ev) {
                        $.cancelBubble();
                        if(isWap) {
                            ev.preventDefault();
                        }
                    });

                    if (!opt.copyAble) {
                        $.addListener(ctls.dialog, [isWap ? 'touchstart' : 'mousedown'], function (ev) {
                            $.cancelBubble();
                            if(isWap) {
                                ev.preventDefault();
                            }
                        });
                    }
                }

                if (ctls.container && opt.cancelBubble) {
                    // 取消背景层 mousedown，防止冒泡 document.mousedown
                    $.addListener(ctls.container, [isWap ? 'touchstart' : 'click'], function (ev) {
                        $.cancelBubble();
                        if(isWap) {
                            ev.preventDefault();
                        }
                    });

                    if (!opt.copyAble) {
                        $.addListener(ctls.container, [isWap ? 'touchstart' : 'mousedown'], function (ev) {
                            $.cancelBubble();
                            if(isWap) {
                                ev.preventDefault();
                            }
                        });
                    }
                }

                //初始最小化或最大化对话框
                if ([Config.DialogStatus.min, Config.DialogStatus.max].indexOf(status) > -1) {
                    _[status]();
                } else if([Config.DialogStatus.hide, Config.DialogStatus.close].indexOf(status) > -1) {
                    //初始化即隐藏
                    _.hide('initial-hide');
                }

                util.buildCloseTiming(_), _.focus();

                if(opt.hide) {
                    _.hide('initial-hide');
                }
                return util;
            },
            setClickBgClose: function (_) {
                var p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none) { return this; }

                if (!opt.clickBgClose) {
                    return this;
                }
                if (opt.lock && ctls.container) {
                    $.addListener(ctls.container, opt.clickBgClose, function (ev) {
                        //判断鼠标点击位置是否在对话框范围，如果在范围内则不关闭
                        if(!$.isOnElement(ctls.dialog, ev)) {
                            _.close();
                        }
                    });
                } else {
                    window.setTimeout(function () {
                        Factory.setClickDocClose(opt.id, opt.clickBgClose);
                    }, 100);
                }
                return this;
            },
            buildShade: function (_) {
                var p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none || !opt.lock) { return this; }
                ctls.shade = $.createElement('div');
                ctls.shade.className = 'oui-dialog-shade';
                ctls.shade.style.zIndex = opt.zindex;
                ctls.shade.contentEditable = false;
                var css,
                    shadeStyle = $.extend({ opacity: opt.opacity }, opt.styles.shade);

                if ((css = Common.toCssText(shadeStyle, 'shade'))) {
                    ctls.shade.style.cssText = css;
                }
                return this;
            },
            buildContainer: function (_) {
                var p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none || !opt.lock) { return this; }
                ctls.container = $.createElement('div');
                ctls.container.className = 'oui-dialog-container';
                ctls.container.style.zIndex = opt.zindex;
                ctls.container.contentEditable = false;
                return this;
            },
            buildCover: function (_, obj) {
                obj.innerHTML = '<iframe id="' + _.getDialogId() + '-cover" src="about:blank"'
                    + ' style="position:absolute; visibility:inherit; top:-1px; left:-1px;'
                    + ' width:0px; height:0px; border:none; z-index:-1;'
                    + ' filter=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';"></iframe>';
                return this;
            },
            setCoverSize: function (_) {
                var p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (ctls.cover) {
                    var size = { w: ctls.dialog.offsetWidth, h: ctls.dialog.offsetHeight };
                    ctls.cover.style.width = size.w + 'px';
                    ctls.cover.style.height = size.h + 'px';
                }
                return this;
            },
            buildDialog: function (_) {
                var p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none) { return this; }
                var css, shadow = opt.shadow, className = 'oui-dialog';
                if (opt.skin !== Config.DefaultSkin) {
                    className += ' oui-dialog-' + opt.skin;
                }
                ctls.dialog = $.createElement('div');
                ctls.dialog.className = className;
                ctls.dialog.id = _.getDialogId();

                ctls.dialog.contentEditable = false;

                if (opt.coverOCX) {
                    Util.buildCover(_, ctls.dialog);
                }

                if ((css = Common.toCssText(opt.styles.dialog, 'dialog'))) {
                    ctls.dialog.style.cssText = css;
                }
                //注意：需先等设置完cssText，再设置zindex
                ctls.dialog.style.zIndex = opt.zindex;

                if (!$.isBoolean(shadow, false) || shadow === 'none') {
                    ctls.dialog.style.boxShadow = 'none';
                }
                ctls.dialog.style.padding = Common.getCssAttrSize(opt.padding, {
                    attr: 'padding', unit: 'px', isArray: true, isLimit: true, max: 10, val: 4
                }).join(' ');

                //增加了边框和圆角参数定制，主要是为了实现空白面板
                var border = opt.border;
                if ($.isNumber(border)) {
                    ctls.dialog.style.borderWidth = border + 'px';
                } else if (border) {
                    if('0' === border || 'none' == border) {
                        ctls.dialog.style.border = 'none 0';
                    } else {
                        ctls.dialog.style.border = border;
                    }
                }

                var radius = parseInt(opt.radius, 10);
                if (!isNaN(radius)) {
                    ctls.dialog.style.borderRadius = radius + (('' + opt.radius).indexOf('%') > 0 ? '' : 'px');
                }
                return this;
            },
            buildMain: function (_, pNode) {
                var p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none || _.isClosed()) { return this; }
                var elem = $.createElement('div'), css;
                elem.className = 'dialog-main' + (opt.copyAble ? '' : ' dialog-unselect');
                elem.tabIndex = 1;
                elem.contentEditable = false;
                if ((css = Common.toCssText(opt.styles.main, 'main'))) {
                    elem.style.cssText = css;
                }
                return this.appendChild((ctls.main = elem), pNode);
            },
            buildHead: function (_, pNode, rebuild) {
                var p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none || _.isClosed() || !opt.showHead || (ctls.head && !rebuild)) {
                    return this;
                }
                var elem, css, btns = p.btns;
                if (rebuild && ctls.head) {
                    $.removeChild(ctls.head, [ctls.logo, ctls.title, ctls.btnPanel]);
                    elem = ctls.head;
                }
                if (!rebuild) {
                    elem = $.createElement('div');
                    elem.className = 'dialog-head';
                    elem.contentEditable = false;

                    if ((css = Common.toCssText(opt.styles.top, 'head'))) {
                        elem.style.cssText = css;
                    }

                    $.disabledEvent(elem, 'contextmenu');
                    
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

                if (opt.showLogo && Config.ShowLogo()) {
                    var logo = $.createElement('div');
                    logo.className = 'dialog-logo';
                    if ($.isString(opt.logoIcon, true)) {
                        logo.style.background = 'transparent url(\'' + opt.logoIcon + '\') no-repeat center';
                    }
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

                //设置标题栏鼠标样式
                elem.style.cursor = opt.moveAble ? 'move' : 'default';

                return !rebuild ? this.appendChild((ctls.head = elem), pNode) : null, this;
            },
            buildCloseTiming: function (_) {
                var p = this.getParam(_), opt = p.options, ctls = p.controls, timers = p.timers;
                if (p.none || !opt.autoClose || !opt.closeAble) {
                    return this;
                }
                this.clearTimer(timers);

                if (opt.showTimer) {
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
                    Util.setAction(_, Config.CloseType.close).clearTimer(timers).close(_);
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
            buildClose: function (_, pNode, isTop) {
                var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls, html = [];
                if (!ctls.dialog) {
                    return util;
                }
                if (opt.reloadAble) {
                    if (util.isIframe(opt) || (opt.showReload && $.isFunction(opt.reloadCallback))) {
                        var reload = Common.getStatusText('reload', opt.lang);
                        if(opt.reloadPosition === 'right') {
                            html.push('<a class="dialog-btn btn-reload" code="reload" key="reload" title="' + reload + '"></a>');
                        } else {
                            $.createElement('a', function (elem) {
                                elem.className = 'dialog-btn btn-reload left-reload';
                                elem.style.margin = '4px 0 0 2px';
                                $.setAttribute(elem, { title: reload, code: 'reload', key: 'reload'});
                                pNode.insertBefore((ctls.reload = elem), ctls.title);
                                util.setButtonEvent(_, [elem], 'click', true);
                            });
                        }
                    }
                }

                if (isTop) {
                    var isMin = opt.minAble && opt.showMin,
                        isMax = opt.maxAble && opt.showMax,
                        min = Common.getStatusText('min', opt.lang),
                        max = Common.getStatusText('max', opt.lang);

                    if (isMin) {
                        html.push('<a class="dialog-btn btn-min" code="min" key="min" title="' + min + '"></a>');
                    }
                    //if(isMax || isMin) {
                    if (isMax) {
                        html.push('<a class="dialog-btn btn-max" code="max" key="max" title="' + max + '"></a>');
                    }
                }
                if (opt.closeAble && opt.showClose) {
                    var config = Config.ButtonConfig['close'],
                        close = Common.getStatusText('close', opt.lang),
                        text = '<a class="dialog-btn btn-close {1}" title="{2}" code="close" key="close"'
                            + ' result="{result}" shortcut-key="{skey}"></a>';
                    html.push(text.format(config, opt.closeIcon, close));
                }

                if (html.length > 0) {
                    var panel = $.createElement('div'), ctls = p.controls, btns = p.btns;
                    panel.className = 'btn-panel';
                    panel.innerHTML = html.join('');
                    panel.style.cssText = 'float:right';
                    pNode.appendChild((ctls.btnPanel = panel));

                    var childs = panel.childNodes, c = childs.length, btnClose;

                    for (var i = 0; i < c; i++) {
                        var obj = childs[i], key = obj.getAttribute('code');
                        btns[key] = obj;
                        if (key === 'Close') {
                            btnClose = obj;
                        }
                    }
                    util.setButtonEvent(_, childs, 'click', false)
                        .setShortcutKeyEvent(_, btnClose ? [btnClose] : []);
                }
                return util;
            },
            buildBody: function (_, pNode) {
                var p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none || _.isClosed()) { return this; }
                var elem = $.createElement('div'), css;
                elem.className = 'dialog-body' + (opt.copyAble ? '' : ' dialog-unselect');
                elem.contentEditable = false;

                if (!opt.showHead) {
                    this.buildClose(_, elem, false);
                }
                if ((css = Common.toCssText(opt.styles.body, 'body'))) {
                    elem.style.cssText = css;
                }
                return this.buildContent(_, elem).appendChild((ctls.body = elem), pNode);
            },
            buildContent: function (_, pNode) {
                var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none || _.isClosed()) { return util; }
                var elem = ctls.content, css, isUpdate = pNode === true;
                if (!elem) {
                    elem = $.createElement('div');
                    elem.className = 'dialog-content';
                }
                elem.contentEditable = false;

                if ((css = Common.toCssText(opt.styles.content, 'content')) || (isUpdate)) {
                    elem.style.cssText = css;
                }
                if (util.isIframe(opt)) {
                    if ($.isElement(opt.element) && opt.type === Config.DialogType.load) {
                        elem.innerHTML = opt.element.innerHTML || opt.element.value || '';
                    } else {
                        elem.innerHTML = util.buildIframe(_, opt, opt.content);
                        //隐藏dialog.body的滚动条（启用iframe滚动条，防止出现双滚动
                        if ($.isElement(pNode)) {
                            pNode.style.overflow = 'hidden';
                        }
                        //清除dialog.content边距
                        elem.style.padding = '0px';
                        elem.style.margin = '0px';
                        elem.style.borderRadius = '0px';

                        var isLoaded = false, childs = elem.childNodes;
                        $.extend(ctls, { iframe: childs[0], iframeShade: childs[1], loading: childs[2] });

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
                    if (Common.isPanelType(opt.type)) {                     
                        //清除dialog.content边距
                        elem.style.padding = '0px';
                        elem.style.margin = '0px';
                        elem.style.borderRadius = '0px';
                    }                    
                    //elem.innerHTML = opt.content;
                    util.buildIconContent(_, true, elem);
                    if (!opt.showHead && ctls.btnPanel) {
                        elem.style.marginRight = ctls.btnPanel.offsetWidth + 'px';
                    }
                }
                return util.appendChild((ctls.content = elem), pNode || null);
            },
            buildIconContent: function (_, isShow, elem) {
                var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none || _.isClosed()) { return util; }
                elem = elem || ctls.content;

                if (isShow && Common.checkIcon(opt)) {
                    if (!ctls.icon) {
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
            showIcon: function (_, elem) {
                var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
                var isShow = Common.checkIcon(opt),
                    isMin = p.status.min;

                if (!elem) {
                    elem = ctls.content;
                }
                if (elem && ctls.icon) {
                    ctls.icon.className = isShow ? 'dialog-icon icon-' + opt.icon : 'dialog-icon-none';
                    elem.className = isShow ? 'dialog-content icon-padding' : 'dialog-content';
                }
                if (ctls.logo) {
                    ctls.logo.className = isShow && isMin ? 'dialog-logo dialog-icon icon-' + opt.icon : 'dialog-logo';
                }
                return util;
            },
            buildIframe: function (_, opt, url) {
                var height = '100%',
                    html = ['<iframe class="dialog-iframe" width="100%"',
                        ' id="{0}-iframe" height="{1}" src="{2}"',
                        ' frameborder="0" scrolling="{3}"></iframe>',
                        '<div id="{0}-iframe-shade" class="iframe-shade"></div>',
                        '<div id="{0}-loading" class="dialog-loading">{4}</div>'
                    ].join(''),
                    param = $.isObject(opt.parameter) ? $.toJsonString(opt.parameter) : opt.parameter;

                return html.format(_.getDialogId(),
                    height,
                    url.setUrlParam('dialog_id', _.id).setUrlParam('dialog_param', param),
                    opt.iframeScroll || opt.iframeScrolling ? 'auto' : 'no',
                    opt.loading || Common.getDialogText('Loading', opt.lang));
            },
            reload: function(_) {
                var util = this, p = util.getParam(_), opt = p.options,
                    iframe = $I(_.getDialogId() + '-iframe');

                if (opt.reloadAble) {
                    if (util.isIframe(opt) && iframe !== null && iframe.src) {
                        iframe.src = iframe.src.setUrlParam();
                    }
                    if (opt.showReload && $.isFunction(opt.reloadCallback)) {
                        opt.reloadCallback(_, opt.parameter);
                    }
                }
                return util;
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
            buildFoot: function (_, pNode, rebuild) {
                var p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none || _.isClosed() || !opt.showFoot || (ctls.foot && !rebuild)) {
                    return this;
                }
                var elem, css, buttons = p.buttons, util = this;
                if (rebuild && ctls.foot) {
                    $.removeChild(ctls.foot, [ctls.button]);
                    elem = ctls.foot;
                }
                if (!rebuild) {
                    elem = $.createElement('div');
                    elem.className = 'dialog-foot';

                    if ((css = Common.toCssText(opt.styles.foot, 'foot'))) {
                        elem.style.cssText = css;
                    }
                }

                var panel = $.createElement('div');
                panel.className = 'button-panel';
                panel.innerHTML = util.buildButtons(_);
                if (Common.isInKeys(opt.buttonPosition, ['Left', 'Center', 'Right'], Config.Position)) {
                    panel.style.cssText = 'text-align:{0};'.format(opt.buttonPosition);
                }
                elem.appendChild((ctls.buttonPanel = panel));
                elem.contentEditable = false;

                for (var i = 0; i < panel.childNodes.length; i++) {
                    var obj = panel.childNodes[i],
                        code = obj.getAttribute('code'),
                        key = obj.getAttribute('key');
                    buttons[code || key] = obj;
                }
                $.addListener(elem, ['mousedown', 'dblclick', 'click'], function () {
                    $.cancelBubble();
                    _.topMost();
                });

                util.setButtonEvent(_, panel.childNodes, 'click', true)
                    .setShortcutKeyEvent(_, panel.childNodes);

                return !rebuild ? util.appendChild((ctls.foot = elem), pNode) : null, util;
            },
            buildButtons: function (_) {
                var p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none) { return this; }

                var keys = [], codes = [], html = [], txts = {}, i = 0, tabindex = 1, isCustom = false;

                if ($.isArray(opt.buttons) && opt.buttons.length > 0) {
                    keys = opt.buttons;
                } else if ($.isNumber(opt.buttons) && opt.buttons >= 0) {
                    keys = Config.ButtonMaps[opt.buttons];
                } else if ($.isObject(opt.buttons)) {
                    isCustom = true;
                    keys = opt.buttons;
                }

                if (keys.length <= 0) {
                    return '';
                }

                //自定义按钮文字
                if ($.isObject(opt.buttonText)) {
                    var copy = opt.buttonText;
                    for (var k in copy) {
                        txts[k.toLowerCase()] = copy[k];
                    }

                } else if ($.isString(opt.buttonText, true)) {
                    txts = { ok: opt.buttonText };
                }

                for (var k in keys) {
                    var config = {}, key = '', code = '', txt = '',
                        func = null, par = null,
                        css = i++ > 0 ? ' btn-ml' : '';

                    if (isCustom) {
                        key = k.toLowerCase();
                        config = Config.ButtonConfig[key];

                        if ($.isString(keys[k])) {
                            txt = keys[k];
                        } else if ($.isFunction(keys[k])) {
                            func = keys[k];
                            code = key;
                        } else if ($.isObject(keys[k])) {
                            var cfg = keys[k];
                            //记录code,用于获取自定义的回调函数                        
                            code = key;
                            txt = cfg.text || '';
                            key = (cfg.key || key).toLowerCase();
                            func = cfg['callback'] || cfg['func'];
                            par = cfg['parameter'] || cfg['param'];
                            //若自定义按钮指定了默认选项，则该按钮为默认按钮
                            if ($.isBoolean(cfg['default'], false)) {
                                opt.defaultButton = code;
                            }
                            if (!config) {
                                config = Config.CustomButtonConfig(k.toLowerCase(), cfg);
                            }
                        }
                        if (config) {
                            config.key = key || config.key;
                            config.text = txt || config.text;
                            //根据自定义按钮的编码 来设置按钮自定义回调函数
                            if ($.isFunction(func)) {
                                p.buttonCallback[code] = { func: func, param: par };
                            }
                        }
                    } else {
                        config = Config.ButtonConfig[keys[k].toLowerCase()];
                        //根据语言获取相应的按钮文字
                        config.text = Common.getButtonText(config.key, opt.lang) || config.text;
                        //启用外部参数中的按钮文字
                        $.extend(config, { text: txts[config.key] });
                        key = keys[k];
                    }

                    if (config) {
                        var wapAttr = Util.isWap() ? ' style="outline:none;" onfocus="this.blur();"' : '';
                        text = '<a class="dialog-btn {css}{1}" code="{2}" key="{key}" result="{result}" href="{{0}}"'
                            + ' tabindex="{3}" shortcut-key="{skey}" {4}>{text}</a>';
                        html.push(text.format(config, css, code, tabindex++, wapAttr));

                        codes.push(key);
                    }
                }
                //设置默认按钮
                if ($.isString(opt.defaultButton, true)) {
                    if (codes.indexOf(opt.defaultButton) >= 0) {
                        p.defaultButton = opt.defaultButton;
                    }
                } else if ($.isNumber(opt.defaultButton)) {
                    var db = codes[opt.defaultButton] || '';
                    if (db) {
                        p.defaultButton = db;
                    }
                }
                return html.join('').format('javascript:void(0);');
            },
            setDragSwitch: function (_, dir) {
                var p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none || !ctls.dialog) { return this; }
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

                if (opt.sizeAble && opt.dragSize) {
                    var padding = Common.getCssAttrSize(opt.padding, { attr: 'padding', unit: 'px', isLimit: true });
                    for (var i in dir) {
                        ctls.dialog.appendChild(this.buildDragSwitch(_, dir[i], padding));
                    }
                    this.showDragSwitch(_);
                } else {
                    this.hideDragSwitch(_);
                }
                return this;
            },
            buildDragSwitch: function (_, dir, padding) {
                var p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none) { return this; }
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
                switch (dir) {
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
                var util = this, p = util.getParam(_), opt = p.options;
                if (p.none) { return this; }
                var events = p.events, c = elements.length, isWap = util.isWap();
                for (var i = 0; i < c; i++) {
                    var obj = elements[i];
                    if (obj.tagName !== 'A') {
                        continue;
                    }
                    $.addListener(obj, isWap ? 'touchstart' : (evName || 'click'), function (e) {
                        $.cancelBubble(e);
                        if(isWap) {
                            e.preventDefault();
                        }
                        util.setAction(_, this);
                    });

                    //设置dblclick并阻止冒泡，防止点击按钮时触发标题栏双击事件
                    $.addListener(obj, 'dblclick', function (e) {
                        $.cancelBubble(e);
                        if(isWap) {
                            e.preventDefault();
                        }
                    });

                    $.addListener(obj, isWap ? 'touchstart' : 'mousedown', function (e) {
                        $.cancelBubble(e);
                        if(isWap) {
                            e.preventDefault();
                        }
                        events.btnMouseDown = true;
                    });

                    $.addListener(obj, isWap ? 'touchend' : 'mouseup', function (e) {
                        $.cancelBubble(e);
                        if(isWap) {
                            e.preventDefault();
                        }
                        events.btnMouseDown = false;
                    });

                    if (keyEvent) {
                        $.addListener(obj, 'keyup', function (e) {
                            var keyCode = $.cancelBubble().getKeyCode(e),
                                keyChar = String.fromCharCode(keyCode).toUpperCase(),
                                shortcutKey = this.getAttribute('shortcut-key') || '',
                                next;
                            //if(32 == keyCode || (shkey >= 3 && keyChar == cg.shortcutKey[2].toUpperCase())){FuncCancel();}
                            // 判断是否为空格键 或 是否按下快捷键
                            if (Config.KEY_CODE.Space === keyCode || keyChar === shortcutKey) {
                                util.setAction(_, this);
                            } else if (Common.isInKeys(keyCode, [37, 39])) {
                                next = keyCode === 37 ? this.previousSibling : this.nextSibling;
                                if ($.isElement(next) && next.className.indexOf('dialog-btn') >= 0) {
                                    next.focus();
                                }
                            } else if (Common.isInKeys(keyCode, [38, 40])) {
                                next = keyCode === 38 ? elements[0] : elements[c - 1];
                                next.focus();
                            }
                        });
                    }
                }
                return util;
            },
            isPass: function (key, minInterval) {
                var util = this, ts = new Date().getTime();
                if (!util[key]) {
                    util[key] = 0;
                }
                if (ts - util[key] < minInterval) {
                    return false;
                }
                return util[key] = ts, true;
            },
            setShortcutKeyEvent: function (_, btns) {
                var util = this, p = util.getParam(_);
                if (!p.dics) {
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
                $.addListener(document, 'keyup', function (e) {
                    if (!e.shiftKey || !util.isPass('ShortcutKeyEvent', 5)) {
                        return false;
                    }
                    var keyCode = $.cancelBubble().getKeyCode(e),
                        keyChar = String.fromCharCode(keyCode).toUpperCase(),
                        btn = p.dics[keyChar],
                        last = Factory.getLast();

                    if (!last || last.id !== p.dialog.id || (btn === p.btns.close && !p.options.keyClose)) {
                        return false;
                    } else if ($.isElement(btn)) {
                        util.setAction(_, btn);
                    } else if (keyChar === 'F') {
                        _.focus();
                    }

                    //var act = document.activeElement.id;
                });

                return util;
            },
            checkEventObj: function (_, obj) {
                var p = this.getParam(_), ctls = p.controls;
                if (p.none) { return this; }

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
                var util = this, p = util.getParam(_), opt = p.options, code = '', key = '', click = false;
                if (typeof obj === 'string') {
                    key = obj.toLowerCase();
                    obj = null;
                } else {
                    if (!util.checkEventObj(_, obj)) {
                        return util;
                    }
                    click = true;
                    key = (obj.getAttribute('key') || '').toLowerCase();
                    code = (obj.getAttribute('code') || '').toLowerCase();
                }
                if(key === Config.DialogStatus.reload) {
                    var curTime = new Date().getTime(), lastTime = _.lastReloadTime || 0;
                    //限制连击间隔，防止连击狂刷新
                    if(!lastTime || curTime - lastTime > opt.reloadInterval) {
                        _.lastReloadTime = curTime;
                        _.reload();
                    } else {
                        //防抖
                        _.lastReloadTime = curTime;
                        window.clearTimeout(_.lastReloadTimer);
                        _.lastReloadTimer = window.setTimeout(function() {
                            _.reload();
                        }, 320);
                    }
                } else if (key === Config.DialogStatus.min) {
                    _.min();
                } else if (key === Config.DialogStatus.max) {
                    _.max();
                } else {
                    var cfg = {
                        obj: obj, code: code, key: key, param: param
                    };
                    //如果采用了延迟关闭，并且启用防抖功能，则延迟调用关闭
                    if (click && p.options.delayClose && opt.debounce && opt.debounceDelay > 0) {
                        util.delayClose(_, p, (code || key), opt.debounceDelay, cfg);
                    } else {
                        util.setActionParam(p, cfg);
                        _.close();
                    }
                }
                return util;
            },
            setActionParam: function (p, cfg) {
                if (this.isDefaultResult(cfg.code || cfg.key)) {
                    p.actions = Config.DefaultResult[cfg.key];
                } else if (cfg.obj !== null) {
                    var result = parseInt(cfg.obj.getAttribute('result'), 10);
                    p.actions = { key: cfg.key, code: cfg.code, result: result };
                }
                if (cfg.param) {
                    $.extend(p.actions, { param: cfg.param });
                }
                return this;
            },
            isFirstAction: function (_, key) {
                var p = this.getParam(_), opt = p.options, ts = new Date().getTime();
                //上次点击若超过5秒钟，则不启用延时
                if (!p.debounceActions[key] || (ts - p.debounceActions[key] > opt.debounceLimit)) {
                    return p.debounceActions[key] = ts, true;
                }
                return false;
            },
            //延时触发关闭，防止无意义的快速连续点击
            delayClose: function (_, p, key, delay, cfg) {
                var util = this;
                if (!delay || util.isFirstAction(_, key)) {
                    util.setActionParam(p, cfg);
                    return _.close(), util;
                }
                if (p.debounceTimers[key]) {
                    window.clearTimeout(p.debounceTimers[key]);
                }
                return p.debounceTimers[key] = window.setTimeout(function () {
                    util.setActionParam(p, cfg);
                    _.close();
                }, delay), util;
            },
            getAction: function (_) {
                var p = this.getParam(_);
                if (p.options.codeCallback || p.options.alwaysCallback) {
                    return $.extend({}, Config.DefaultResult['close'], p.actions);
                }
                return $.extend({}, p.actions);
            },
            delAction: function (_) {
                var p = this.getParam(_);
                return p.actions = null, this;
            },
            getBoundary: function (parent) {
                var boundary = {
                    x: 0,
                    y: 0
                };
                if ($.isElement(parent)) {
                    var offset = $.getOffset(parent);
                    return $.extend(boundary, {
                        x: offset.left,
                        y: offset.top,
                        width: offset.left + offset.width,
                        height: offset.top + offset.height
                    });
                }
                return $.extend(boundary, $.getBodySize());
            },
            setCache: function (_) {
                var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none) { return util; }

                var obj = ctls.dialog,
                    bs = util.getBoundary(opt.parent),
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
            setSize: function (_, options, loop) {
                var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none) { return this; }

                var opt = p.options,
                    ctls = p.controls,
                    btns = p.btns,
                    obj = ctls.dialog,
                    par = {};

                if(!$.isElement(obj)) {
                    if(!loop) {
                        if(util.timerLoopSize) {
                            window.clearTimeout(util.timerLoopSize);
                        }
                        util.timerLoopSize = window.setTimeout(function() {
                            util.setSize(_, options, true);
                        }, 300);
                    }
                    return this;
                }
                if ($.isString(options)) {
                    options = { type: options };
                }
                var sp = $.extend({
                    type: Config.DialogStatus.normal,
                    width: 0,
                    height: 0
                }, options);

                if (sp.type === '' || (sp.width.isNaN() && sp.height.isNaN()) || _.getStatus()[sp.type]) {
                    return util;
                }

                if (p.status.normal) {
                    util.setCache(_);
                }

                if (p.status.max && sp.type !== Config.DialogStatus.max && ctls.container) {
                    $.removeClass(ctls.container, 'dialog-overflow-hidden');
                } else if (sp.type !== Config.DialogStatus.min) {
                    $.removeClass(ctls.foot, 'display-none');
                }

                if (sp.type !== Config.DialogStatus.max && !opt.lock) {
                    util.hideDocOverflow(_, true);
                }

                if (btns.max) {
                    var maxKey = sp.type !== Config.DialogStatus.normal ? 'restore' : 'max';
                    btns.max.title = Common.getStatusText(maxKey, opt.lang);
                }

                if (btns.min) {
                    var minKey = sp.type !== Config.DialogStatus.min ? 'min' : 'restore';
                    btns.min.title = Common.getStatusText(minKey, opt.lang);
                }

                var cp = $.getScrollPosition(),
                    bs = util.getBoundary(opt.parent),
                    isSetBodySize = false,
                    isSetPosition = false,
                    isFullScreen = false;

                if (sp.type === Config.DialogStatus.max) {
                    if (!opt.maxAble) {
                        return this;
                    }
                    var hasParent = $.isElement(opt.parent);
                    if (hasParent) {
                        par = { 
                            width: opt.parent.offsetWidth + 'px', 
                            height: opt.parent.offsetHeight + 'px', 
                            top: opt.parent.offsetTop - cp.top,
                            left: opt.parent.offsetLeft - cp.left
                        };
                    } else {
                        par = { width: '100%', height: '100%', top: bs.y, left: bs.x };
                    }
                    isSetBodySize = isFullScreen = true;

                    $.addClass(obj, 'oui-dialog-max').addClass(btns.max, 'btn-normal');
                    ctls.dialog.style.borderRadius = '0px';

                    if (ctls.container) {
                        $.addClass(ctls.container, 'dialog-overflow-hidden');
                    }
                    if (p.status.min) {
                        $.removeClass(obj, 'oui-dialog-min');
                    }
                    util.hideDocOverflow(_)
                        .hideDragSwitch(_)
                        .setStatus(_, Config.DialogStatus.max);

                } else if (sp.type === Config.DialogStatus.min) {
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
                        .setStatus(_, Config.DialogStatus.min)
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
                    util.showDragSwitch(_).setStatus(_, Config.DialogStatus.normal);

                    if (sp.type === 'resize' || sp.type === 'size') {
                        par = { width: sp.width, height: sp.height };
                    } else if (sp.type === 'scale') {
                        isSetBodySize = false;
                        util.changeSize(_, options);
                    } else {  //sp.type === 'normal'
                        if (!$.isUndefined(p.lastSize)) {
                            isSetPosition = bs.width !== p.lastSize.bs.width || bs.height !== p.lastSize.bs.height;
                            if (p.lastSize.percent && isSetPosition) {
                                par = $.extend({}, p.lastSize, { width: opt.width, height: opt.height });
                            } else {
                                $.setStyle(obj, p.lastSize, 'px');
                            }
                        } else {
                            //宽度跟随目标控件的宽度
                            if(opt.target && (sp.width === 'follow' || sp.width === 'inherit')) {
                                sp.width = opt.target.offsetWidth;
                            }
                            par = { width: sp.width, height: sp.height };
                        }
                    }
                }
                if (sp.type !== Config.DialogStatus.max) {
                    //不是最大化状态，需要设置border-radius
                    var radius = parseInt(opt.radius, 10);
                    if (!isNaN(radius)) {
                        ctls.dialog.style.borderRadius = radius + (('' + opt.radius).indexOf('%') > 0 ? '' : 'px');
                    }
                }

                for (var name in par) {
                    var val = par[name];
                    if (!$.isNullOrUndefined(val)) {
                        obj.style[name] = Common.checkStyleUnit(val);
                    }
                }
                if (isSetBodySize) {
                    util.setBodySize(_, { fullScreen: isFullScreen });
                }
                if (isSetPosition) {
                    util.setPosition(_);
                }

                return util.showIcon(_);
            },
            setTitleSize: function (_, width) {
                var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none) { return this; }

                if (_.isClosed() || !ctls.head) {
                    return this;
                }
                var topWidth = width || ctls.head.clientWidth,
                    logoWidth = ctls.logo ? ctls.logo.offsetWidth : 0,
                    reloadWidth = ctls.reload ? ctls.reload.offsetWidth : 0,
                    btnWidth = ctls.btnPanel ? ctls.btnPanel.offsetWidth : 0,
                    timerWidth = ctls.timer ? ctls.timer.offsetWidth : 0,
                    titleWidth = topWidth - logoWidth - reloadWidth - timerWidth - btnWidth - 10;

                if (ctls.title) {
                    ctls.title.style.maxWidth = (titleWidth) + 'px';
                    var realSize = Common.getRealSize(ctls.title.innerHTML);

                    if (realSize && realSize.width > titleWidth) {
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
            convertPositionNumber: function (_, opt) {
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
                if ($.isNumeric(opt.position)) {
                    opt.position = parseInt(opt.position, 10);
                    if (opt.position < 0 || opt.position > 10) {
                        opt.position = 5;
                    }
                } else {
                    var pos = ('' + opt.position).replace('-', '').toLowerCase();
                    opt.position = !$.isUndefined(keys[pos]) ? keys[pos] : 5;
                }
                return this;
            },
            setPosition: function (_, options, isDragTo) {
                var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls, obj = ctls.dialog;
                if (p.none || !obj) { return this; }

                if ($.isString(options) || $.isNumber(options)) {
                    options = { position: options };
                } else if ($.isUndefined(options)) {
                    options = { position: opt.position };
                }
                var par = $.extend({
                    event: '',              //window.resize
                    fullScreen: false,
                    target: opt.target,
                    direction: opt.direction,
                    parent: opt.parent,
                    position: opt.position,
                    width: opt.width,
                    height: opt.height,
                    x: opt.x,
                    y: opt.y
                }, options),
                    posLeft, posTop, posRight, posBottom,
                    bs = util.getBoundary(opt.parent);

                //window.resize
                if (par.event === 'window.resize') {
                    if (p.status.max) {
                        posLeft = bs.x;
                        posTop = bs.y;
                        var boxSize = $.getOffset(obj),
                            boxWidth = boxSize.width,
                            boxHeight = boxSize.height;

                        if(opt.maxWidth !== '100%') {                            
                            //当对话框最大化的宽度小于容器宽度时，可以设置对话框水平位置
                            switch(opt.maxPosition) {
                            case 0:
                                break;
                            case 1:case 4:case 7:
                                posLeft = bs.x + opt.x;
                                break;
                            case 2:case 5:case 8:
                                posLeft = parseInt((bs.width - boxWidth) / 2, 10) + opt.x;
                                break;
                            case 3:case 6:case 9:
                                posLeft = bs.width - boxWidth - opt.x;
                                break;
                            }
                        }

                        if(opt.maxHeight !== '100%') {
                            //当对话框最大化的高度小于容器高度时，可以设置对话框垂直位置
                            switch(opt.maxPosition) {
                            case 0:
                                break;
                            case 1:case 2:case 3:
                                posTop = bs.y + opt.y;
                                break;
                            case 4:case 5:case 6:
                                posTop = parseInt((bs.height - boxHeight) / 2, 10) + opt.y;
                                break;
                            case 7:case 8:case 9:
                                posTop = bs.height - boxHeight - opt.y;
                                break;
                            }                            
                        }

                        return $.setStyle(obj, { left: posLeft, top: posTop }, 'px'), util;
                    } else {

                        //TODO:
                        //在窗口大小改变时
                        //看是否需要怎么控制对话框位置
                    }
                }
                if ($.isElement(par.target)) {
                    if (opt.type === Config.DialogType.tooltip) {
                        par.x = 7;
                        par.y = 7;
                    }
                    //目标位置停靠
                    return util.setTargetPosition(par, obj), util;
                }

                //par.position = par.position === 'custom' ? 10 : parseInt(par.position, 10);
                //转换Position关键字为数字
                util.convertPositionNumber(_, par);
                par.x = Math.abs(par.x);
                par.y = Math.abs(par.y);

                if (isNaN(par.position) || isNaN(par.x) || isNaN(par.y)) {
                    return util;
                }

                var cp = $.getScrollPosition(),
                    w = obj.offsetWidth,
                    h = obj.offsetHeight,
                    //锁定界面相当于固定位置
                    fixed = opt.lock || opt.fixed,
                    cpTop = fixed ? bs.y : cp.top,
                    cpLeft = fixed ? bs.x : cp.left,
                    isCenter = util.checkPosition(_, Config.Position.Center, par.position),
                    isMiddle = util.checkPosition(_, Config.Position.Middle, par.position),
                    isBottom = false,
                    isRight = false;

                if ($.isPercent(opt.width)) {
                    posLeft = opt.margin.left || 0;
                    posRight = opt.margin.right || 0;
                } else if (isCenter) {
                    posLeft = (bs.width / 2 - w / 2) + cpLeft;
                } else {
                    isRight = util.checkPosition(_, Config.Position.Right, par.position);
                    posLeft = isRight ? (bs.width - par.x - w + cpLeft - bs.x) : cpLeft + par.x;
                }
                if ($.isPercent(opt.height)) {
                    posTop = opt.margin.top || 0;
                    posBottom = opt.margin.bottom || 0;
                } else if (isMiddle) {
                    posTop = bs.height / 2 - h / 2 + cpTop;
                } else {
                    isBottom = util.checkPosition(_, Config.Position.Bottom, par.position);
                    posTop = isBottom ? (bs.height - par.y - h + cpTop - bs.y) : cpTop + par.y;
                }

                //清除cssText上下左右4个样式
                util.clearPositionStyle(obj);

                if(opt.animate && !isDragTo) {
                    return util.moveToPosition(_, { left: posLeft, top: posTop, right: posRight, bottom: posBottom });
                }
                return $.setStyle(obj, { left: posLeft, top: posTop, right: posRight, bottom: posBottom }, 'px'), util;
            },
            movePosition: function (_, options, isMoveTo) {
                var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls, obj = ctls.dialog;
                if (p.none || !obj || !opt.moveAble) { return util; }

                var par = $.extend({
                    target: null,
                    direction: opt.direction,
                    parent: null,
                    position: 7,    //默认停靠在目标控件左下方位置
                    x: null,
                    y: null
                }, options);

                if ($.isElement(par.target)) {
                    //目标位置停靠
                    return util.setTargetPosition(par, obj), util;
                }

                var cp = $.getScrollPosition(),
                    moveTo = $.isBoolean(isMoveTo, false),
                    bs = util.getBoundary(opt.parent),
                    left = obj.offsetLeft,
                    top = obj.offsetTop,
                    w = obj.offsetWidth,
                    h = obj.offsetHeight,
                    x = parseInt(par.x || par.left, 10),
                    y = parseInt(par.y || par.top, 10);

                if (isNaN(x)) { x = moveTo ? left : bs.x; }
                if (isNaN(y)) { y = moveTo ? top : bs.y; }

                var posX = moveTo ? x : left + x,
                    posY = moveTo ? y : top + y;

                if (opt.limitRange) {
                    if (posX < bs.x) {
                        posX = bs.x;
                    }
                    if (posY < bs.y) {
                        posY = bs.y;
                    }
                    if ((posX + w) > bs.width) {
                        posX = bs.width - w;
                    }
                    if ((posY + h) > bs.height) {
                        posY = bs.height - h;
                    }
                }
                if($.isElement(opt.parent)) {
                    posX -= cp.left;
                    posY -= cp.top;
                }
                $.setStyle(obj, { width: w, height: h, left: posX, top: posY }, 'px');

                return util;
            },
            getMoveDirection: function(pos) {
                var dir = '';
                switch(pos) {
                    case 1: case 2: case 3:
                    case 7: case 8: case 9:
                        dir = 'vertical';
                        break;
                    case 4:
                    case 6:
                        dir = 'horizontal';
                        break;
                    case 5:
                        dir = 'animate';
                        break;
                }
                return dir;
            },
            isAnimetePosOver: function(add, v, pos, key) {
                if((add && v >= pos[key]) || (!add && v <= pos[key])) {
                    return true;
                }
                return false;
            },
            setAnimetePos: function(add, v, pos, key, obj) {
                var util = this;
                if((add && v >= pos[key]) || (!add && v <= pos[key])) {
                    v = pos[key];
                    window.clearInterval(util.timerMoveTo);
                }
                obj.style[key] = v + 'px';
                return this;
            },
            moveToPosition: function(_, pos) {
                var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls, obj = ctls.dialog;
                if (p.none || !obj) { return this; }

                var cp = $.getScrollPosition(),
                    x = pos.left, 
                    y = pos.top,
                    ani = opt.animate,
                    dir = ani.direction || ani.dir || util.getMoveDirection(opt.position), 
                    distance = ani.distance || 10,
                    interval = ani.interval || 5,
                    start = ani.start || 7,
                    add = false,
                    addX = false,
                    addY = false,
                    os = $.elemSize(obj),
                    bs = util.getBoundary(opt.parent),
                    rate = (pos.left - bs.x) / (pos.top - bs.y);

                //转换Position关键字为数字
                util.convertPositionNumber(_, opt);

                if(dir === 'animate') {
                    //如果不是居中显示的，起始位置从本位置开始
                    if(opt.position % 5 !== 0) {
                        start = opt.position;
                    }
                    if(start === 2 || start === 8) {
                        dir = 'vertical';
                    } else if(start === 4 || start === 6) {
                        dir = 'horizontal';
                    } else {
                        if(start === 5) {
                            start = 7;
                        }
                        addX = start % 3 !== 0;
                        addY = start < 7;
                        x = addX ? bs.x - os.outer.width : bs.width;
                        y = addY ? bs.y - os.outer.height : bs.height;
                    }
                }
                if(dir === 'vertical') {
                    add = opt.position < 4;
                    y = add ? bs.y - os.outer.height : bs.height;
                } else if(dir === 'horizontal') {
                    add = opt.position % 3 !== 0;
                    x = add ? bs.x - os.outer.width : bs.width;
                }
                $.setStyle(obj, { left: x - cp.left, top: y - cp.top }, 'px');

                window.clearInterval(util.timerMoveTo);
                util.timerMoveTo = window.setInterval(function() {
                    if(dir === 'vertical') {
                        y += distance * (add ? 1 : -1);
                        util.setAnimetePos(add, y, pos, 'top', obj);
                    } else if(dir === 'horizontal') {
                        x += distance * (add ? 1 : -1);
                        util.setAnimetePos(add, x, pos, 'left', obj);
                    } else if(dir === 'animate') {
                        x += distance * rate * (addX ? 1 : -1);
                        y += distance * (addY ? 1 : -1);

                        if(util.isAnimetePosOver(addX, x, pos, 'left')
                            && util.isAnimetePosOver(addY, y, pos, 'top')) {
                            x = pos.left;
                            y = pos.top;
                            window.clearInterval(util.timerMoveTo);
                        } else {                            
                            if(util.isAnimetePosOver(addX, x, pos, 'left')) {
                                x = pos.left;
                            }
                            if(util.isAnimetePosOver(addY, y, pos, 'top')) {
                                y = pos.top;
                            }
                        }

                        $.setStyle(obj, { left: x - cp.left, top: y - cp.top }, 'px');
                    }
                }, interval);

                return util;
            },
            convertPositionKey: function (opt) {
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

                if ($.isNumeric(opt.position)) {
                    var pos = parseInt(opt.position, 10);
                    if (pos < 0 || pos >= 10) {
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
            setFinalPosition: function (pos, w, h, res, xs, ys, parent) {
                var bs = this.getBoundary(parent),
                    f = 0, s = 0;

                if (pos.indexOf('left') === 0) {
                    res.dir = 'left';
                    res.left = xs.left;
                    if (res.left < bs.x) {
                        pos = pos.replace('left', 'right');
                    }
                }
                if (pos.indexOf('right') === 0) {
                    res.dir = 'right';
                    res.left = xs.right;
                    if (res.left + w > bs.width) {
                        pos = pos.replace('right', 'left');
                    }
                }
                if (pos.indexOf('top') === 0) {
                    res.dir = 'top';
                    res.top = ys.top;
                    if (res.top < bs.y) {
                        pos = pos.replace('top', 'bottom');
                    }
                }
                if (pos.indexOf('bottom') === 0) {
                    res.dir = 'bottom';
                    res.top = ys.bottom;
                    if (res.top + h > bs.height) {
                        pos = pos.replace('bottom', 'top');
                    }
                }

                return pos;
            },
            setTargetPosition: function (options, obj, isFixedSize) {
                var util = this,
                    par = $.extend({
                        target: null,
                        direction: 'auto',
                        parent: null,
                        position: 'bottomleft',    //默认停靠在目标控件左下方位置
                        x: null,
                        y: null
                    }, options);

                if (!$.isElement(par.target) || !$.isElement(obj)) {
                    return {};
                }
                par.position = (par.position || par.pos);

                //转换Position关键字（处理大小写）
                util.convertPositionKey(par);

                var pos = par.position,
                    p = $.getOffset(par.target),
                    w = obj.offsetWidth,
                    h = obj.offsetHeight,
                    bs = util.getBoundary(par.parent),
                    ps = $.getScrollPosition(),
                    fs = {
                        w: p.width,
                        h: p.height,
                        x: p.left,
                        y: p.top
                    },
                    res = {
                        left: fs.x,
                        top: fs.y,
                        moveX: 0,
                        moveY: 0,
                        css: ''
                    },
                    newTop = res.top,
                    newLeft = res.left,
                    isOver = true;

                var ys = { top: fs.y - h - par.y, bottom: fs.y + fs.h + par.y },
                    xs = { left: fs.x - w - par.x, right: fs.x + fs.w + par.x },
                    distance = 12;

                //如果左右边距小于100px，则将左右位置改为上下位置
                if(xs.left < 100 && (bs.width - xs.right) < 100 && (pos.startsWith('left') || pos.startsWith('right'))) {
                    pos = 'bottomleft';
                }

                if (par.direction === 'auto') {
                    pos = Util.setFinalPosition(pos, w, h, res, xs, ys, par.parent);
                }

                if (pos.indexOf('left') === 0) {
                    res.dir = 'left';
                    res.left = xs.left;
                    if (res.left < bs.x) {
                        w += res.left - distance - bs.x;
                        res.left = bs.x;
                        $.setStyle(obj, { width: w }, 'px');
                    }
                } else if (pos.indexOf('right') === 0) {
                    res.dir = 'right';
                    res.left = xs.right;
                    if (res.left + w > bs.width) {
                        w += bs.width - (res.left + w) - distance;
                        res.left = bs.width - w - distance;
                        $.setStyle(obj, { width: w }, 'px');
                    }
                } else if (pos.indexOf('top') === 0) {
                    res.dir = 'top';
                    res.top = ys.top;
                    if (res.top < bs.y) {
                        ////这里不用重新计算高度了
                        //h += res.top - distance - bs.y;
                        w = Common.getRealSize(par.content, par).width;
                        res.top = bs.y;
                        $.setStyle(obj, { height: h, width: w }, 'px');
                    }
                } else if (pos.indexOf('bottom') === 0) {
                    res.dir = 'bottom';
                    res.top = ys.bottom;
                    if (res.top + h > bs.height) {
                        h += bs.height - (res.top + h) - distance;
                        w = Common.getRealSize(par.content, par).width;
                        res.top = bs.height - h - distance;
                        $.setStyle(obj, { height: h, width: w }, 'px');
                    }
                }

                switch (pos) {
                    case 'top':
                    case 'bottom':
                        res.left = fs.x - (w - fs.w) / 2;
                        if (res.left < ps.left || (res.left + w) > (bs.width + ps.left)) {
                            newLeft = res.left < ps.left ? ps.left : bs.width + ps.left - h;
                            res.moveX = res.left - newLeft;
                            res.left = newLeft;
                        }
                        if (fs.w < w) {
                            res.css = 'left: ' + (w / 2 + res.moveX) + 'px;';
                        }

                        if(res.left + w > bs.width) {
                            res.left = fs.x - (w - fs.w);
                            res.css = 'left: ' + (w - distance) + 'px;';
                        } else if(res.left < bs.x) {
                            res.left = fs.x;
                            res.css = 'left: ' + distance + 'px;';
                        }
                        break;
                    case 'left':
                    case 'right':
                        res.top = fs.y - (h - fs.h) / 2;
                        //注释以下代码，当DIV容器滚动时，以便让提示框跟随目标输入框移动位置
                        /* 
                        if (res.top < ps.top || (res.top + h) > (bs.height + ps.top)) {
                            newTop = res.top < ps.top ? ps.top + 2 : bs.height + ps.top - h - 2;
                            res.moveY = res.top - newTop;
                            res.top = newTop;
                        }
                        */
                        if (fs.h < h) {
                            res.css = 'top: ' + (h / 2 + res.moveY) + 'px;';
                        }

                        if(res.top + h > bs.height) {
                            res.top = fs.y - (h - fs.h);
                            res.css = 'top: ' + (h - distance) + 'px;';
                        } else if(res.top < bs.y) {
                            res.top = fs.y;
                            res.css = 'top: ' + distance + 'px;';
                        }
                        break;
                    case 'topleft':
                    case 'bottomleft':
                        res.left = fs.x;
                        res.css = 'left: ' + distance + 'px;';

                        if(res.left + w > bs.width) {
                            res.left = fs.x - (w - fs.w);
                            res.css = 'left: ' + (w - distance) + 'px;';

                            if(res.left < bs.x) {
                                res.left = fs.x - (w - fs.w) / 2;
                                if (fs.w < w) {
                                    res.css = 'left: ' + (w / 2 + res.moveX) + 'px;';
                                }
                            }
                        }
                        break;
                    case 'topright':
                    case 'bottomright':
                        res.left = fs.x - (w - fs.w);
                        res.css = 'left: ' + (w - distance) + 'px;';

                        if(res.left < bs.x) {
                            res.left = fs.x;
                            res.css = 'left: ' + distance + 'px;';

                            if(res.left + w > bs.width) {
                                res.left = fs.x - (w - fs.w) / 2;
                                if (fs.w < w) {
                                    res.css = 'left: ' + (w / 2 + res.moveX) + 'px;';
                                }
                            }
                        }
                        break;
                    case 'lefttop':
                    case 'righttop':
                        res.top = fs.y;
                        res.css = 'top: ' + distance + 'px;';

                        if(res.top + h > bs.height) {
                            res.top = fs.y - (h - fs.h);
                            res.css = 'top: ' + (h - distance) + 'px;';

                            if(res.top < bs.y) {
                                res.top = fs.y - (h - fs.h) / 2;
                                if (fs.h < h) {
                                    res.css = 'top: ' + (h / 2 + res.moveY) + 'px;';
                                }
                            }
                        }
                        break;
                    case 'leftbottom':
                    case 'rightbottom':
                        res.top = fs.y - (h - fs.h);
                        res.css = 'top: ' + (h - distance) + 'px;';

                        if(res.top < bs.y) {
                            res.top = fs.y;
                            res.css = 'top: ' + distance + 'px;';

                            if(res.top + h > bs.height) {
                                res.top = fs.y - (h - fs.h) / 2;
                                if (fs.h < h) {
                                    res.css = 'top: ' + (h / 2 + res.moveY) + 'px;';
                                }
                            }
                        }
                        break;
                }
                if (isFixedSize) {
                    $.setStyle(obj, { width: w, height: h }, 'px');
                }

                $.setStyle(obj, { left: res.left, top: res.top }, 'px');

                return res;
            },
            dragPosition: function (_) {
                var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none) { return this; }

                var isWap = util.isWap(),
                    evNameDown = isWap ? 'ontouchstart' : 'onmousedown',
                    evNameUp = isWap ? 'ontouchend' : 'onmouseup',
                    evNameMove = isWap ? 'ontouchmove' : 'onmousemove';

                var obj = ctls.dialog,
                    docMouseMove = document[evNameMove],
                    docMouseUp = document[evNameUp];

                function moveDialog(ev) {
                    if (!opt.moveAble || !opt.dragMove) {
                        return $.cancelBubble(), false;
                    }
                    var evt = ev || $.getEvent(),
                        cp = $.getScrollPosition(),
                        bs = util.getBoundary(opt.parent),
                        clientWidth = bs.width,
                        clientHeight = bs.height,
                        moveX = isWap ? evt.touches[0].clientX : evt.clientX,
                        moveY = isWap ? evt.touches[0].clientY : evt.clientY,
                        top = obj.offsetTop,
                        left = obj.offsetLeft,
                        moveAble = true,
                        isToNormal = false;

                    if(isWap) {
                        evt.preventDefault();
                    }

                    document[evNameMove] = function (ev) {
                        if (!opt.moveAble || !opt.dragMove || !moveAble || p.events.btnMouseDown) {
                            return false;
                        }
                        util.showIframeShade(ctls, true);
                        var e = ev || $.getEvent(),
                            x = left + (isWap ? e.touches[0].clientX : e.clientX) - moveX,
                            y = top + (isWap ? e.touches[0].clientY : e.clientY) - moveY;

                        if (!isToNormal && p.status.max && (x > 2 || y > 2)) {
                            isToNormal = true;
                            util.dragToNormal(_, e, bs, moveX, moveY);
                            top = obj.offsetTop;
                            left = obj.offsetLeft;
                            return false;
                        }
                        util.movePosition(_, { x: x, y: y }, true);
                    };
                    document[evNameUp] = function () {
                        if (!opt.moveAble || !opt.dragMove || !moveAble) {
                            return false;
                        }
                        document[evNameMove] = docMouseMove;
                        document[evNameUp] = docMouseUp;
                        moveAble = false;
                        p.events.btnMouseDown = false;
                        util.showIframeShade(ctls, false);
                    };
                }

                if (opt.showHead && ctls.head) {
                    $.addListener(ctls.head, evNameDown.substr(2), function (event) {
                        moveDialog(event);
                    });
                } else if(!Common.isPanelType(opt.type) && !opt.form && opt.moveAble) {
                    $.addListener([ctls.dialog, ctls.body, ctls.content], evNameDown.substr(2), function (event) {
                        moveDialog(event);
                    });
                }

                return this;
            },
            changeSize: function (_, options, isDrag, dp) {
                var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls, obj = ctls.dialog;
                if (p.none) { return this; }

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

                par.x = parseInt(par.x || par.width || 0, 10);
                par.y = parseInt(par.y || par.height || 0, 10);

                if (par.dir === '' || isNaN(par.x) || isNaN(par.y)) {
                    return util;
                } else if (par.x === 0 && par.y === 0) {
                    return util;
                }

                //判断对话框当前状态是否被最小化，若最小化，需要先还原大小
                if (isMin) {
                    util.setSize(_, { type: Config.DialogStatus.normal });
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
                var bs = util.getBoundary(opt.parent),
                    headHeight = (ctls.head ? ctls.head.offsetHeight : 0),
                    footHeight = (ctls.foot ? ctls.foot.offsetHeight : 0),
                    w, h;

                if (par.resizeTo && !isDrag) {                    
                    w = par.x;
                    h = par.y;
                    var ds = util.getSize(_, opt, ctls, obj);
                    if (par.isBody) {
                        if(w <= 0){ w = ds.width; }
                        if(h <= 0) { h = ds.height; }
                        var padding = Common.getCssAttrSize(opt.padding, { attr: 'padding', isLimit: true }),
                            ph = padding.top + padding.bottom,
                            pw = padding.left + padding.right,
                            conPadding = Common.getCssAttrSize(ctls.content, { attr: 'padding', isLimit: true }),
                            cph = conPadding.top + conPadding.bottom,
                            cpw = conPadding.left + conPadding.right;

                        w += pw + cpw;
                        h += headHeight + footHeight + padding.top + ph + cph;
                    } else {
                        if(w <= 0){ w = ds.dialog.width; }
                        if(h <= 0) { h = ds.dialog.height; }
                    }
                } else {
                    w = dp.width + par.x;
                    h = dp.height + par.y;
                }

                var newWidth = w < dp.minWidth ? dp.minWidth : w,
                    newHeight = h < dp.minHeight ? dp.minHeight : h,
                    newLeft = bs.x,
                    newTop = bs.y,
                    x = bs.x,
                    y = bs.y;

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
                    if (newTop < bs.y) {
                        newTop = bs.y;
                    }
                    if (newLeft < bs.x) {
                        newLeft = bs.x;
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
                util.setBodySize(_, { fullScreen: false, drag: isDrag });

                if (ctls.foot && ctls.dialog.offsetHeight < minHeight) {
                    ctls.foot.style.visibility = 'hidden';
                    _.dragScaleHideBottom = true;
                } else if (_.dragScaleHideBottom) {
                    ctls.foot.style.visibility = 'visible';
                }

                if (!isDrag && par.dir === Config.Direction.Center) {
                    util.setPosition(_, par);
                }

                //判断对话框当前状态是否被最小化，若最小化，设置完尺寸之后需要重新最小化
                if (isMin) {
                    util.setSize(_, { type: Config.DialogStatus.min });
                }

                return util.showIcon(_);
            },
            isAutoSize: function (_, options) {
                var util = this, p = this.getParam(_), opt = options || p.options, ctls = p.controls;
                if (p.none) { return false; }

                var isAutoSize = false;
                if (_.isClosed()) {
                    return false;
                }
                if (opt.width === 'auto') {
                    ctls.dialog.style.width = 'auto';
                    ctls.main ? ctls.main.style.width = 'auto' : '';
                    ctls.body ? ctls.body.style.width = 'auto' : '';
                    ctls.content ? ctls.content.style.width = 'auto' : '';
                    isAutoSize = true;
                }
                if (opt.height === 'auto') {
                    ctls.dialog.style.height = 'auto';
                    ctls.main ? ctls.main.style.height = 'auto' : '';
                    ctls.body && ctls.body.style ? ctls.body.style.height = 'auto' : '';
                    ctls.content ? ctls.content.style.height = 'auto' : '';
                    isAutoSize = true;
                }

                return isAutoSize;
            },
            isChange: function (newContent, oldContent) {
                return newContent !== oldContent;
            },
            getAutoSize: function (_, isLimit) {
                var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none) { return this; }

                var pH = parseInt($.getElementStyle(ctls.dialog, 'padding', 0), 10),
                    cH = parseInt($.getElementStyle(ctls.main, 'padding', 0), 10),
                    s = {
                        width: ctls.content.offsetWidth + pH * 2 + cH * 2,
                        height: ctls.content.offsetHeight + pH * 2 + cH * 2
                    };

                if (ctls.head) {
                    s.height += ctls.head.offsetHeight;
                }

                if (ctls.foot) {
                    s.height += ctls.foot.offsetHeight;
                }

                //增加20px高度留白
                s.height += 20;

                if (isLimit) {
                    var mw = parseInt('0' + opt.minWidth, 10),
                        mh = parseInt('0' + opt.minHeight, 10);

                    if (s.width < mw) {
                        s.width = mw;
                    }

                    if (s.height < mh) {
                        s.height = mh;
                    }
                }
                return s;
            },
            setBodySize: function (_, options) {
                var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none) { return util; }

                var par = $.extend({
                    event: '',          //window.resize, show
                    drag: false,
                    lastSize: undefined
                }, options);

                var obj = ctls.dialog,
                    bs = util.getBoundary(opt.parent);
                if (!obj) {
                    return util;
                }

                var boxWidth = obj.clientWidth,
                    boxHeight = obj.clientHeight,
                    padding = Common.getCssAttrSize(opt.padding, { attr: 'padding', isLimit: true }),
                    //paddingHeight = parseInt('0' + $.getElementStyle(obj, 'padding'), 10),
                    paddingHeight = padding.top + padding.bottom,
                    conPaddingHeight = parseInt('0' + $.getElementStyle(ctls.content, 'padding'), 10),
                    maxSize = Common.getMaxSize(opt),
                    margin = Common.getCssAttrSize(opt.margin, { attr: 'margin' }),
                    marginHeight = margin.top + margin.bottom;

                if (par.event === 'show' && $.isObject(par.lastSize)) {
                    boxWidth = par.lastSize.width;
                    boxHeight = par.lastSize.height;
                    obj.style.width = boxWidth + 'px';
                    obj.style.height = boxHeight + 'px';
                }

                //在非拖动大小并且常态状态时，设置对话框百分比尺寸
                if (!par.drag && _.isNormal() && Common.isPercentSize(opt.width, opt.height)) {
                    if ($.isPercent(opt.width)) {
                        opt.margin = margin;
                        boxWidth = bs.width * parseInt(opt.width, 10) / 100 - margin.left - margin.right;
                    }
                    if ($.isPercent(opt.height)) {
                        opt.margin = margin;
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
                } else if (maxSize.maxWidth && boxWidth > maxSize.maxWidth) {
                    boxWidth = maxSize.maxWidth;
                    obj.style.width = boxWidth + 'px';
                    //当对话框最大化的宽度小于容器宽度时，可以设置对话框水平位置
                    switch(opt.maxPosition) {
                    case 0:
                        break;
                    case 1:case 4:case 7:
                        obj.style.left = bs.x + opt.x + 'px';
                        break;
                    case 2:case 5:case 8:
                        obj.style.left = parseInt((bs.width - boxWidth) / 2, 10) + opt.x + 'px';
                        break;
                    case 3:case 6:case 9:
                        obj.style.left = bs.width - boxWidth - opt.x + 'px';
                        break;
                    }
                } else if (maxSize.minWidth && boxWidth < maxSize.minWidth) {
                    boxWidth = maxSize.minWidth;
                    obj.style.width = boxWidth + 'px';
                }

                if (boxHeight > bs.height) {
                    boxHeight = bs.height - 20;
                    obj.style.height = boxHeight + 'px';
                } else if (maxSize.maxHeight && boxHeight > maxSize.maxHeight) {
                    boxHeight = maxSize.maxHeight;
                    obj.style.height = boxHeight + 'px';
                    //当对话框最大化的高度小于容器高度时，可以设置对话框垂直位置
                    switch(opt.maxPosition) {
                    case 0:
                        break;
                    case 1:case 2:case 3:
                        obj.style.top = bs.y + opt.y + 'px';
                        break;
                    case 4:case 5:case 6:
                        obj.style.top = parseInt((bs.height - boxHeight) / 2, 10) + opt.y + 'px';
                        break;
                    case 7:case 8:case 9:
                        obj.style.top = bs.height - boxHeight - opt.y + 'px';
                        break;
                    }
                } else if (maxSize.minHeight && boxHeight < maxSize.minHeight) {
                    boxHeight = maxSize.minHeight;
                    obj.style.height = boxHeight + 'px';
                }

                boxWidth = obj.clientWidth;
                boxHeight = obj.clientHeight;

                //拖动大小时，重新设置尺寸百分比
                if (par.drag) {
                    if ($.isPercent(opt.width)) {
                        opt.width = parseInt(((obj.offsetWidth + margin.left + margin.right) * 100 / bs.width), 10) + '%';
                    }
                    if ($.isPercent(opt.height)) {
                        opt.height = parseInt(((obj.offsetHeight + margin.top + margin.bottom) * 100 / bs.height), 10) + '%';
                    }
                }

                $.setStyle(ctls.main, { height: boxHeight - paddingHeight }, 'px');

                var mainHeight = ctls.main ? ctls.main.offsetHeight : ctls.dialog.offsetHeight,
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

                $.setStyle(ctls.body, size);

                if (p.timerCover) {
                    window.clearTimeout(p.timerCover);
                }
                p.timerCover = window.setTimeout(function () {
                    util.setCoverSize(_);
                }, 100);

                util.setTitleSize(_).showIcon(_);

                if($.isFunction(opt.resize)) {
                    if(par.drag && opt.resizeDebounce) {
                        if(p.timerResize) { window.clearTimeout(p.timerResize); }
                        p.timerResize = window.setTimeout(function() { util.resize(_); }, 30);
                    } else {
                        util.resize(_);
                    }
                }
                return util;
            },
            dragToNormal: function (_, evt, bs, moveX, moveY) {
                var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls, obj = ctls.dialog;
                if (p.none) { return this; }

                //对话框最大化时，拖动对话框，先切换到标准模式（尺寸、定位）
                util.setSize(_, { type: Config.DialogStatus.normal });

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
                util.setPosition(_, { position: 'custom', event: 'drag', x: offsetX, y: offsetY }, true);

                return this;
            },
            dragSize: function (_) {
                var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none || !opt.sizeAble || !opt.dragSize) { return this; }

                var isWap = util.isWap(),
                    evNameDown = isWap ? 'ontouchstart' : 'onmousedown',
                    evNameUp = isWap ? 'ontouchend' : 'onmouseup',
                    evNameMove = isWap ? 'ontouchmove' : 'onmousemove';

                var obj = ctls.dialog,
                    docMouseMove = document[evNameMove],
                    docMouseUp = document[evNameUp];

                function resizeDialog(ev, dir) {
                    if (!opt.sizeAble || !opt.dragSize) {
                        return $.cancelBubble(), false;
                    }
                    var evt = ev || $.getEvent(),
                        moveX = isWap ? evt.touches[0].clientX : evt.clientX,
                        moveY = isWap ? evt.touches[0].clientY :evt.clientY,
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

                    if(isWap) {
                        evt.preventDefault();
                    }

                    document[evNameMove] = function (ev) {
                        if (!opt.sizeAble || !opt.dragSize || !moveAble) {
                            return false;
                        }
                        p.events.dragingSize = true;
                        var e = ev || $.getEvent(),
                            x = ((isWap ? e.touches[0].clientX : e.clientX) - moveX) * (dir.indexOf(Config.Direction.Left) >= 0 ? -1 : 1),
                            y = ((isWap ? e.touches[0].clientY : e.clientY) - moveY) * (dir.indexOf(Config.Direction.Top) >= 0 ? -1 : 1);

                        util.showIframeShade(ctls, true);
                        util.changeSize(_, { dir: dir, x: x, y: y }, true, par);
                    };
                    document[evNameUp] = function () {
                        if (!opt.sizeAble || !opt.dragSize || !moveAble) {
                            return false;
                        }
                        document[evNameMove] = docMouseMove;
                        document[evNameUp] = docMouseUp;
                        moveAble = false;
                        p.events.dragingSize = false;
                        util.showIframeShade(ctls, false);
                    };
                }

                util.getZoomSwicths(_).each(function (i, obj) {
                    $.addListener(obj, evNameDown.substr(2), function (event) {
                        _.topMost();
                        resizeDialog(event, obj.pos);
                    });
                });
                return this;
            },
            showHeadFoot: function (_, isShow, type, rebuild, key) {
                var util = this, p = this.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none) { return this; }

                if (_.isClosed()) {
                    return util;
                }
                if ($.isString(isShow, true)) {
                    rebuild = type;
                    type = isShow;
                    isShow = true;
                } else if ($.isBoolean(type)) {
                    rebuild = type;
                    type = null;
                }

                var show = $.isBoolean(isShow, true),
                    has, obj, h, dir;

                if (key === 'head') {
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

                if (show) {
                    rebuild = rebuild || (type && opt.type !== type);
                    if (obj && !rebuild) {
                        obj.style.display = '';
                    } else {
                        util.setOptions(_, 'options', key === 'head' ? 'showHead' : 'showFoot', true);
                        if (key === 'head') {
                            util.buildHead(_, ctls.main, rebuild);
                        } else {
                            util.buildFoot(_, ctls.main, rebuild);
                        }
                    }
                } else if (obj) {
                    obj.style.display = 'none';
                }

                if (h !== 0) {
                    util.changeSize(_, { dir: dir, y: show ? h : -h });
                }
                return util.setBodySize(_), this;
            },
            setZindex: function (_, zindex) {
                var util = this, p = util.getParam(_), ctls = p.controls;
                if (p.none || !ctls.dialog) { return util; }

                if (typeof zindex !== 'number') {
                    zindex = Common.buildZindex();
                }
                if (ctls.container) {
                    ctls.container.style.zIndex = zindex;
                } else {
                    ctls.dialog.style.zIndex = zindex;
                }
                return p.options.zindex = zindex, util;
            },
            checkCallback: function (p, actions) {
                var opt = p.options,
                    actions = actions || {},
                    callback = $.isFunction(opt.callback) ? opt.callback : undefined;

                //如果没有设置回调函数callback，则查找自定义的回调函数
                if (!callback) {
                    var custom = p.buttonCallback[(actions.code || '').toLowerCase()];
                    if (custom && $.isFunction(custom.func)) {
                        callback = custom.func;
                    }
                }
                //检测是否设置了 ok | success 以及 cancel 这些指定的回调函数
                var ok = $.isFunction(opt.ok) ? opt.ok : ($.isFunction(opt.success) ? opt.success : callback),
                    cancel = $.isFunction(opt.cancel) ? opt.cancel : callback;

                return (ok || cancel) ? { callback: callback, ok: ok, cancel: cancel } : undefined;
            },
            callback: function (_, p, actions) {
                var util = this,
                    opt = p.options,
                    func = util.checkCallback(p, actions);

                if (!func || !$.isObject(actions)) {
                    if ($.isElement(opt.focusTo)) {
                        $.setFocus(opt.focusTo);
                    }
                    return util;
                }
                var dr = {},
                    parameter = actions.param || opt.parameter,
                    key = (actions.key || '').toLowerCase(),
                    code = (actions.code || '').toLowerCase(),
                    result = actions.result || 0;

                dr[key] = dr[key.toUpperCase()] = dr[key.firstLetterCapital()] = true;
                if (code && code !== key) {
                    dr['code'] = code;
                }
                dr['key'] = key;
                dr['value'] = result;

                //根据按钮code 获取自定义的回调函数与参数
                var custom = p.buttonCallback[code];
                if (custom && $.isFunction(custom.func)) {
                    custom.func(dr, _, custom.param || parameter);
                } else if (Common.isInKeys(result, ['ok', 'yes'], Config.DialogResult)) {
                    func.ok && func.ok(dr, _, parameter);
                } else if (Common.isInKeys(result, ['cancel', 'ignore', 'no'], Config.DialogResult)) {
                    func.cancel && func.cancel(dr, _, parameter);
                } else {
                    func.callback && func.callback(dr, _, parameter);
                }

                if ($.isElement(opt.focusTo)) {
                    $.setFocus(opt.focusTo);
                }
                return util;
            },
            compare: function(obj1, obj2) {
                if($.isUndefined(obj1) || $.isUndefined(obj2)) {
                    return false;
                }
                for(var k in obj1) {
                    if(obj1[k] !== obj2[k]) {
                        return false;
                    }
                }
                return true;
            },
            getSize: function(_, opt, ctls, obj) {
                var util = this, p = util.getParam(_);
                if(!opt) {
                    opt = p.options;
                    ctls = p.controls;
                    obj = ctls.body;
                }
                if (p.none || !ctls || !ctls.dialog || !$.isElement(obj)) { return {}; } 
                var box = ctls.dialog,
                    ds = $.getElementSize(box),
                    ps = $.getElementStyleSize(obj, 'padding'),
                    psCon = $.getElementStyleSize(ctls.content, 'padding'),
                    bodyW = (opt.noScroll ? obj.offsetWidth : obj.clientWidth) - ps.width - psCon.width,
                    bodyH = (opt.noScroll ? obj.offsetHeight : obj.clientHeight) - ps.height - psCon.height;

                return {
                    width: bodyW,
                    height: bodyH,
                    body: {
                        width: bodyW,
                        height: bodyH,
                    },
                    dialog: ds
                };
            },
            resize: function (_) {
                var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none || !ctls.dialog) { return util; }
                var obj = ctls.body;
                if ($.isFunction(opt.resize) && $.isElement(obj)) {
                    var size = util.getSize(_, opt, ctls, obj);
                    //判断尺寸是否改变，防止重复回调相同的尺寸
                    if(!util.compare(p.lastResize, size)) {
                        p.lastResize = size;
                        opt.resize(size, _);
                    }
                }
                return util;
            },
            dispose: function (_) {
                var util = this, p = util.getParam(_);
                for (var k in p.controls) {
                    p.controls[k] = null;
                }
                for (var k in p.buttons) {
                    p.buttons[k] = null;
                }
                if (p.styleElement) {
                    p.styleElement.parentNode.removeChild(p.styleElement);
                }
                for (var k in p.debounceTimers) {
                    delete p.debounceTimers[k];
                }
                for (var k in p.debounceActions) {
                    delete p.debounceActions[k];
                }
                //TODO:

                return this;
            },
            remove: function (_) {
                return Factory.remove(_.id), this;
            },
            redirect: function (url) {
                if ($.isString(url, true)) {
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
                if (p.none || _.isClosed()) { return util; }

                if (!$.isElement(opt.target)) {
                    return false;
                }
                var tipId = undefined, d = undefined;
                try {
                    tipId = opt.target.getAttribute(Config.TooltipAttributeName);
                } catch (e) {
                    tipId = undefined;
                }
                if (tipId) {
                    d = Factory.getDialog(tipId);
                }

                if (tipId && d && ctls.content) {
                    p.controls = util.getParam(d).controls;
                    util.updateTooltip(_, opt.content, opt.target, opt);
                } else {
                    //对话框
                    ctls.dialog = $.createElement('div');
                    ctls.dialog.className = 'oui-tooltip';
                    ctls.dialog.style.zIndex = opt.zindex;
                    ctls.dialog.id = _.getDialogId();

                    ctls.body = util.buildBody(_, ctls.dialog);

                    $.setAttribute(ctls.dialog, 'target', opt.target.id || '');
                    //设置for属性
                    var forname = opt.forname || opt.target.id || '';
                    $.setAttribute(ctls.dialog, 'for', forname);

                    $.setAttribute(opt.target, Config.TooltipAttributeName, opt.id);
                    p.parent.appendChild(ctls.dialog);

                    if($.isElement(opt.target)) {
                        Factory.setFormScroll(opt.target);
                    }
                }

                //指定焦点目标，或默认焦点目标
                var focusObj = $.isBoolean(opt.focusTo, false) ? opt.target : opt.focusTo;

                if ($.isElement(focusObj) && $.isDisplay(focusObj, true)) {
                    $.setFocus(focusObj);
                }

                Factory.setWindowResize();

                util.buildCloseTiming(_);

                return util.setTooltipPosition(_);
            },
            updateTooltip: function (_, options) {
                var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
                if (p.none || _.isClosed()) { return util; }

                if (ctls.content) {
                    ctls.content.innerHTML = opt.content;
                }
                return util.setTooltipPosition(_);
            },
            setTooltipStyle: function (_, opt, keys) {
                var styles = {};
                for (var i in keys) {
                    var k = keys[i];
                    if (opt[k] !== 'auto') {
                        styles[k] = opt[k];
                    }
                }
                return styles;
            },
            setTooltipSize: function (_) {
                var util = this, p = util.getParam(_), opt = p.options, ctls = p.controls;
                var styles = util.setTooltipStyle(_, opt, [
                    'width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight'
                ]);
                $.setStyle(ctls.dialog, styles, 'px');
                return util;
            },
            buildTooltipStyle: function (_, par, p, isShow) {
                var util = this,
                    opt = p.options,
                    obj = p.controls.dialog;

                if (!opt || !obj) {
                    return false;
                }
                //设置自定义的样式
                var styles = opt.styles.tooltip || opt.styles.tips || {},
                    cssText = Common.toCssText(styles, 'tooltip');
                obj.style.cssText = cssText;
                obj.style.zIndex = opt.zindex;

                var res = util.setTooltipSize(_).setTargetPosition(par, obj), cssName = '';
                if (res.css || styles['border-color']) {
                    if (styles['border-color']) {
                        res.css += 'border-' + res.dir + '-color:' + styles['border-color'] + ';';
                    }
                    cssName = 'tip-pos-' + _.id;
                    var cssCon = '.{0}:after,.{0}:before{{{1}}}'.format(cssName, res.css);
                    $.createCssStyle(cssCon, 'tip-css-' + _.id, function (elem) {
                        p.styleElement = elem;
                    });
                }
                obj.className = 'oui-tooltip oui-tip-' + res.dir + ' ' + cssName;
                if (isShow) {
                    //图片加载完之后，显示对话框
                    obj.style.display = '';
                }
            },
            loadComplete: function (c, i, func) {
                if (i >= c) {
                    func();
                }
            },
            loadImg: function (_, imgs, func) {
                var util = this, c = imgs.length;
                util.loads[_.id] = { idx: 0 };

                for (var i = 0; i < c; i++) {
                    imgs[i].onload = function () {
                        util.loads[_.id].idx += 1;
                        util.loadComplete(c, util.loads[_.id].idx, func);
                    };
                    imgs[i].onerror = function () {
                        util.loads[_.id].idx += 1;
                        util.loadComplete(c, util.loads[_.id].idx, func);
                        //尝试加载默认的图片
                        var defaultSrc = this.getAttribute('default-src');
                        if (defaultSrc) {
                            //默认图片只加载一次，不管加载是否成功，都要清除默认图片设置，防止无限循环
                            this.setAttribute('default-src', '');
                            this.src = defaultSrc;
                        }
                    };
                }
            },
            setTooltipPosition: function (_) {
                var util = this,
                    p = util.getParam(_),
                    opt = p.options,
                    ctls = p.controls,
                    obj = p.controls.dialog;
                if (p.none || _.isClosed()) { return util; }

                var par = {
                    target: opt.target,
                    content: opt.content,
                    direction: opt.direction,
                    parent: opt.parent,
                    position: opt.position,    //默认停靠在目标控件左下方位置
                    x: opt.x || 7,
                    y: opt.y || 7
                };

                var imgs = ctls.content.getElementsByTagName('img');
                if (imgs.length > 0) {
                    obj.style.display = 'none';
                    util.loadImg(_, imgs, function () {
                        util.buildTooltipStyle(_, par, p, true);
                    });
                } else {
                    util.buildTooltipStyle(_, par, p);
                }

                return util;
            }
        };

    //先加载(默认)样式文件
    Factory.loadCss(Config.DefaultSkin);
    //加载指定的(默认)样式文件
    if(!Config.IsDefaultSkin()) {
        Factory.loadCss(Config.GetSkin());
    }

    function Dialog(content, title, options) {
        var ds = Common.getDefaultSize(),
            par = Common.checkOptions(content, title, options),
            opt = $.extend({
                id: null,                       //id
                skin: Config.DefaultSkin,       //样式: default, blue
                //lang: Config.Lang.Chinese,      //语言 Chinese,English
                lang: Config.GetLang(),         //语言 Chinese,English
                type: Config.DialogType.alert,  //alert,confirm,message,tooltip,window,iframe
                status: Config.DialogStatus.normal,     //初始状态  normal, min, max 三种状态
                zindex: Common.buildZindex(),   //css z-index值，控制显示层级
                minWidth: '240px',          //最小宽度
                minHeight: '125px',         //最小高度
                maxWidth: '100%',           //最大宽度
                maxHeight: '100%',          //最大高度
                position: 5,            //对话框初始位置, 0,1,2,3,4,5,6,7,8,9，共10种位置设置
                maxPosition: 0,         //对话框最大化时的位置, 0,1,2,3 (只有在最大化的宽度小于当前容器宽度时才启用)
                noScroll: false,        //对话框主体没有滚动条，固定宽高
                x: 0,                   //x轴(left)偏移量，单位：px
                y: 0,                   //y轴(top)偏移量，单位：px
                target: null,           //Element 要跟随位置的html控件 target || anchor
                forname: '',            //对话框DIV属性for值内容
                direction: 'auto',      //跟随位置的方向 auto | fixed
                width: ds.width + 'px',     //初始宽度      px, auto, %, follow|inherit
                //width: follow|inherit 并且设置了target，则width跟随target控件的宽度
                height: ds.height + 'px',   //初始高度      px, auto, %
                margin: 0,              //当宽度或高度设置为 % 百分比时，启用 margin，margin格式参考css [上右下左] 设置，单位为px
                padding: 4,             //内边距（拖动边框）宽度，格式参考css设置，单位为px
                radius: 4,              //对话框圆角半径，单位为px，默认为4px
                border: null,           //对话框边框宽度，如：'solid 1px #ccc', 0 或 none 表示不要边框，1-表示边框宽度为1px, null表示不处理
                parent: null,           //Element parentNode DIV
                limitRange: true,       //窗体范围(位置、大小)限制 true,false
                opacity: null,          //背景层透明度，默认为 0.2
                shadow: true,           //是否显示CSS阴影
                lock: true,             //是否锁屏
                hide: false,            //是否默认隐藏（创建立即隐藏）
                title: null,            //标题
                content: null,          //文字内容
                url: null,              //加载的URL
                form: false,            //是否为Form表单，Form表单则默认允许复制和选择内容
                reloadAble: true,       //是否可以重新加载
                reloadInterval: 3500,   //重新加载的时间间隔，单位：毫秒
                reloadPosition: Config.ReloadPosition(),//重新按钮位置 left,right, 默认：right
                element: null,          //Element 要加载内容的html控件
                icon: '',               //Icon图标  info, warning, question, error, success, loading
                loading: '',            //loading提示文字
                focusTo: null,          //要获取焦点的html控件(对话框关闭后获取焦点)
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
                copyAble: false,        //是否允许复制内容
                selectAble: false,      //是否可以选择文字内容
                sizeAble: true,         //是否允许改变大小
                dragSize: true,         //是否允许拖动改变大小
                moveAble: true,         //是否允许移动位置
                dragMove: true,         //是否允许拖动改变位置
                maxAble: true,          //是否允许最大化
                minAble: true,          //是否允许最小化
                delayClose: false,      //是否延时关闭，启用延时关闭，则点击“确定按钮”关闭时不会关闭，在callback回调中处理关闭
                callback: null,         //回调函数，默认情况下，只有点击按钮关闭时才会回调
                complete: null,         //对话框加载完成后的回调函数
                codeCallback: false,    //始终回调（当使用代码关闭窗口时也会回调）
                debounce: true,         //是否防抖
                debounceDelay: 320,     //防抖间隔，单位：毫秒
                debounceLimit: 5000,    //防抖时限，单位：毫秒
                ok: null,               //点击确定按钮后的回调函数
                cancel: null,           //点击取消按钮后的回调函数
                parameter: null,        //回调返回的参数， param || parameter
                resize: null,           //对话框大小改变后的回调函数
                resizeDebounce: false,  //尺寸改变回调防抖
                redirect: null,         //重定向跳转到指定的URL [target]
                buttons: Config.DialogButtons.OKCancel,               //按钮类型编码
                buttonPosition: Config.Position.Center,               //按钮位置 left center right
                buttonText: null,       // {OK: '确定', Cancel: '取消'}  ｛OK: '提交'}
                defaultButton: '',      //默认按钮，数字（按顺序），字符串（按编码）
                showHead: true,         //是否显示顶部标题栏 
                showLogo: false,        //是否显示logo图标，默认不显示logo
                logoIcon: '',           //可以指定LOGO图标URL,图标大小为20×20像素
                showReload: false,      //是否显示“重新加载”按钮，当对话框为iframe时默认显示
                reloadCallback: null,   //重新加载回调函数，与showReload参数配套使用
                reload: null,           //showReload + reloadCallback的简化版，若reload参数为Function，则showReload=ture,reloadCallback=reload
                showMin: true,          //是否显示最小化按钮
                showMax: true,          //是否显示最大化按钮
                showClose: true,        //是否显示关闭按钮
                showFoot: true,         //是否显示底部按钮栏
                cancelBubble: false,    //是否阻止背景层事件冒泡
                iframeScroll: true,     //是否允许iframe滚动条
                animate: false,         //是否启用动画
                /*
                //动画详细参数
                animate: {
                    direction: 'vertical',  // animate, vertical, horizontal
                    start: 7,               // 1, 3, 7, 9。 针对 animate 有效
                    distance: 10,           // 动画移动的像素距离
                    interval: 5             // 动画移动的频率，单位：毫秒
                }
                */
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
                tooltipStyle: '',       //Tooltip样式
                coverOCX: false         //是否覆盖在OCX控件之上
            }, par);

        return this.id = opt.id, this.initial(opt);
    }

    Dialog.prototype = {
        initial: function (options) {
            var _ = this, p = Util.getParam(_), opt = options || p.options, id = opt.id;

            if ($.isElement(opt.parent) &&
                ['DIV'].indexOf(opt.parent.tagName) >= 0) {
                p.parent = opt.parent;
                p.hasParent = true;
            }
            if (!$.isString(opt.title) && !$.isNumber(opt.title)) {
                opt.title = Common.getDialogText('Title', opt.lang);
            }

            if (!opt.showHead && !opt.showFoot && !opt.lock &&
                $.isBoolean(opt.closeAble, true) &&
                opt.type !== Config.DialogType.tooltip) {
                opt.escClose = true;
                //opt.clickBgClose = opt.clickBgClose || 'click';
                //没有标题没有底部的消息框，设置内容边距为1px
                opt.contentStyle = $.extend({ 'padding': '1px' }, opt.contentStyle);
            }
            if (opt.lock) {
                opt.fixed = false;
            }

            var dialog = Factory.getDialog(id);
            if (!dialog) {
                Factory.setDialog(id, _)
                    .setOptions(id, opt)
                    .setOptions(id, 'dialogId', Common.buildId(id, 'd-'));
            }

            Util.setOptions(_, 'options', opt);

            if (!Config.IsDefaultSkin(opt.skin)) {
                Factory.loadCss(opt.skin, function () {
                    Util.build(_, opt);
                });
            } else {
                Util.build(_, opt);
            }

            if($.isFunction(opt.complete)) {
                window.setTimeout(function() {
                    opt.complete(_);
                }, 50);
            }

            return _;
        },
        getOptions: function (key) {
            var opt = $.extend({}, Factory.getOptions(this.id, 'options'));
            return $.isString(key, true) ? opt[key] : opt;
        },
        setOptions: function (key, value) {
            var p = Util.getParam(this).options;
            if (!$.isObject(p)) { return this; }
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
        options: function (key, value) {
            if ($.isUndefined(value)) {
                return this.getOptions(key);
            }
            return this.setOptions(key, value);
        },
        getDialogId: function () {
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
        getContentWindow: function() {
            var id = this.getDialogId() + '-iframe',
                iframe = document.getElementById(id);

            return (iframe !== null ? iframe.contentWindow : null) || document.frames[id];
        },
        getStatus: function () {
            return $.extend({}, Factory.getOptions(this.id, 'status'));
        },
        isPercent: function () {
            var opt = this.getOptions();
            return Common.isPercentSize(opt.width, opt.height);
        },
        isClosed: function () {
            return $.isBoolean(Factory.getOptions(this.id, 'closed'), true);
        },
        isHide: function () {
            if ($.isBoolean(Factory.getOptions(this.id, 'hide'), false)) {
                return true;
            }
            var p = Util.getParam(this), ctls = p.controls || {};
            if (ctls.container) {
                return $.getElementStyle(ctls.container, 'display') === 'none';
            } else if (ctls.dialog) {
                return $.getElementStyle(ctls.dialog, 'display') === 'none';
            }
            return false;
        },
        isMaximized: function () {
            return this.getStatus().max;
        },
        isMax: function () {
            return this.isMaximized();
        },
        isMinimized: function () {
            return this.getStatus().min;
        },
        isMin: function () {
            return this.isMinimized();
        },
        isNormal: function () {
            return this.getStatus().normal;
        },
        show: function (content, title) {
            var _ = this, p = Util.getParam(_);
            if (_.isClosed() || !p || !_.isHide()) {
                return _;
            }
            Util.setOptions(_, 'hide', false)
                .showDialog(p.controls, true, content, title);

            if (p.options.lock) {
                Util.hideDocOverflow(_, false);
            }

            if (p.options.type !== 'tooltip') {
                Util.setBodySize(_, { event: 'show', lastSize: p.hideSize });
            }

            if (!p.options.lock) {
                Util.setClickBgClose(_);
            }

            if($.isBoolean(content, false) || !Util.isVisible(p.controls)) {
                _.position();
            }

            return _;
        },
        hide: function (action, dialogResult) {
            var _ = this, p = Util.getParam(_), opt = p.options;
            if (_.isClosed() || _.isHide() || !p || !opt.closeAble) {
                return _;
            }
            if(action === 'initial-hide') {
                console.log(action + ': ' + _.id);
            }
            var ctls = p.controls,
                timers = p.timers,
                url = opt.redirect || opt.targetUrl,
                actions = Util.getAction(_);

            if(!ctls.dialog) {
                return _;
            }

            //记录隐藏之前的对话框尺寸大小，以便再次显示时，还原尺寸大小
            Util.setOptions(_, 'hideSize', { width: ctls.dialog.offsetWidth, height: ctls.dialog.offsetHeight });

            Util.showDialog(ctls, false)
                .setOptions(_, 'hide', true)
                .delAction(_)
                .clearTimer(timers)
                //.hideDocOverflow(_, true)
                .callback(_, p, actions)
                .redirect(url);

            if (p.options.lock) {
                Util.hideDocOverflow(_, true);
            }

            return _;
        },
        close: function (force) {
            var _ = this, util = Util, p = util.getParam(_), opt = p.options;
            
            //是否强制关闭对话框，参数类型必须是 boolean 类型
            //当前forceClose为true时，将忽略closeAble和closeType
            var forceClose = $.isBoolean(force, false);

            if (_.isClosed() || !p || (!opt.closeAble && !forceClose)) {
                return _;
            }
            var ctls = p.controls,
                timers = p.timers,
                url = opt.redirect || opt.targetUrl,
                actions = util.getAction(_),
                func = util.checkCallback(p, actions);

            // 点击确定按钮时，若延时关闭，则仅回调而不关闭
            if (opt.delayClose
                && actions.result !== Config.DialogResult.close
                && (util.isIframe(opt) || util.isSure(actions.result))
                && func
                && (func.callback || func.ok)) {
                return util.delAction(_).callback(_, p, actions), _;
            }
            if (!forceClose && opt.closeType === 'hide') {
                return _.hide();
            }

            $.removeChild(p.parent, [ctls.container || ctls.dialog, ctls.shade]);

            util.setOptions(_, 'closed', true)
                .delAction(_)
                .clearTimer(timers)
                .hideDocOverflow(_, true)
                .callback(_, p, actions)
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

            //设置创建时间，防止被document事件关闭
            p.buildTime = new Date().getTime();

            if (opt.type && !opt.buttons) {
                opt.buttons = Common.getDialogButtons(opt.type);
            }

            //更新时，若样式设置为null,则清除之前的样式设置
            if (opt.newStyles === null) {
                this.setOptions('styles', {});
            }
            //更新时，若没有设置新的样式，则复制之前的样式设置
            if ($.isUndefined(opt.styles) || $.isEmpty(opt.styles)) {
                $.extend(opt.styles, p.options.styles);
            }

            // 判断内容是否改变，以决定是否需要重新设置位置
            var isChanged = Util.isChange(opt.content, p.options.content);

            if ($.extend(p.options, opt).type === Config.DialogType.tooltip) {
                Util.updateTooltip(_, p.options);
                return _;
            }
            if (ctls.content) {
                var isAutoSize = Util.isAutoSize(_),
                    isMin = p.status.min;

                if (ctls.title && opt.title) {
                    ctls.title.innerHTML = opt.title;
                }

                if (isMin) {
                    Util.setSize(_, { type: Config.DialogStatus.normal });
                    Util.setPosition(_);
                }
                Util.buildContent(_, true).setBodySize(_).setCache(_);

                if (isMin) {
                    Util.setSize(_, { type: Config.DialogStatus.min });
                }

                if (isAutoSize && isChanged) {
                    window.setTimeout(function () { Util.setPosition(_); }, 10);
                }

                if (!p.options.lock) {
                    Util.setClickBgClose(_);
                }

                if (_.isHide() && !_.isClosed()) {
                    _.show();
                }
            }
            return _;
        },
        append: function (content, title, options) {
            var _ = this, p = Util.getParam(_), ctls = p.controls;
            if (p.none || !ctls.content) {
                return this;
            }
            if (ctls.icon) {
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
            if (ctls.icon) {
                $.removeChild(ctls.content, ctls.icon);
            }
            var html = ctls.content.innerHTML;
            return _.update(content + html, title, options);
        },
        title: function(title) {
            var _ = this, p = Util.getParam(_), ctls = p.controls;
            if (p.none || !ctls.content) {
                return _;
            }
            var html = ctls.content.innerHTML;
            return _.update(html, title);
        },
        focus: function (obj) {
            var _ = this, p = Util.getParam(_), buttons = p.buttons;
            if (Util.isWap()) {
                return _;
            }
            if (p.none || _.isClosed() || _.isHide()) {
                return _;
            }

            if (Common.isChildFocus(obj, p.controls.dialog)) {
                return _;
            }

            var dbKey = p.options.defaultButton;
            if (dbKey && buttons[dbKey]) {
                buttons[dbKey].focus();
                return _;
            }

            var btn = null;
            for (var k in buttons) {
                btn = buttons[k];
            }
            return btn && btn.focus(), _;
        },
        min: function () {
            //return Util.setSize(this, { type: Config.DialogStatus.min });
            var _ = this, p = Util.getParam(_);
            if (p.none) { return _; }

            var type = Config.DialogStatus.min, lastStatus = p.lastStatus;
            if (p.status.min && lastStatus === Config.DialogStatus.max) {
                type = Config.DialogStatus.max;
            } else if (p.status.min) {
                type = Config.DialogStatus.normal;
            }
            return Util.setSize(_, { type: type }), _;
        },
        max: function () {
            var _ = this, p = Util.getParam(_);
            if (p.none) { return _; }

            var type = Config.DialogStatus.max, lastStatus = p.lastStatus;

            if (p.status.max || (p.status.min && lastStatus === Config.DialogStatus.normal)) {
                type = Config.DialogStatus.normal;
            }
            return Util.setSize(_, { type: type }), _;
        },
        reload: function() {
            var _ = this, p = Util.getParam(_);
            if (p.none || _.isClosed() || _.isHide() || _.isMin()) {
                return _;
            }
            return Util.reload(_), _;
        },
        restore: function () {
            return Util.setSize(this, { type: Config.DialogStatus.normal }), this;
        },
        normal: function () {
            return Util.setSize(this, { type: Config.DialogStatus.normal }), this;
        },
        size: function(options) {
            return $.isObject(options) ? this.resize(options) : Util.getSize(this);
        },
        resize: function (options) {
            $.extend(options, { resizeTo: false });
            return Util.changeSize(this, options), this;
        },
        resizeTo: function (options) {
            $.extend(options, { resizeTo: true });
            return Util.changeSize(this, options), this;
        },
        position: function (options) {
            var _ = this, p = Util.getParam(_);
            if (_.isClosed() || p.none) { return this; }
            return Util.setPosition(_, options), this;
        },
        move: function (options) {
            return Util.movePosition(this, options, false), this;
        },
        moveTo: function (options) {
            return Util.movePosition(this, options, true), this;
        },
        appendChild: function (elem, pNode) {
            return $.appendChild(pNode || this.getControls().content, elem), this;
        },
        zindex: function (zindex) {
            if ($.isUndefined(zindex)) {
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
        showHead: function (isShow, type, rebuild) {
            return Util.showHeadFoot(this, isShow, type, rebuild, 'head'), this;
        },
        showFoot: function (isShow, type, rebuild) {
            Util.showHeadFoot(this, isShow, type, rebuild, 'foot');
            return this.position(), this;
        }
    };

    $.extend({
        DialogButtons: $.extend({}, Config.DialogButtons),
        DialogType: $.extend({}, Config.DialogType),
        DialogIcon: $.extend({}, Config.DialogIcons),
        DialogButtonKey: (function () {
            var keys = {};
            for (var k in Config.ButtonConfig) {
                if (k !== 'None') {
                    keys[k] = k;
                }
            }
            return keys;
        })()
    });

    if ($.getQueryString(location.href, 'dialog_help')) {
        console.log('$.DialogType: ', $.DialogType);
        console.log('$.DialogIcon: ', $.DialogIcon);
        console.log('$.DialogButtons: ', $.DialogButtons);
        console.log('$.DialogButtonKey: ', $.DialogButtonKey);
    }

    $.extend({
        dialog: function (content, title, options) {
            return Factory.show(content, title, options);
        },
        alert: function (content, title, options) {
            return Factory.show(content, title, options, Config.DialogType.alert);
        },
        confirm: function (content, title, options, okButton) {
            if(arguments.length <= 3 && ($.isFunction(title) || $.isObject(title))) {
                okButton = options;
                options = title;
                title = '';
            }
            return Factory.show(content, title, options, Config.DialogType.confirm, null, okButton);
        },
        message: function (content, options) {
            return Factory.show(content, '', options, Config.DialogType.message);
        },
        tips: function (content, target, options) {
            return Factory.show(content, '', options, Config.DialogType.tips, target);
        },
        tooltip: function (content, target, options) {
            return Factory.show(content, '', options, Config.DialogType.tooltip, target);
        },
        toolwin: function(content, title, options) {
            return Factory.show(content, title, options, Config.DialogType.toolwin);
        },
        toolwindow: function(content, title, options) {
            return Factory.show(content, title, options, Config.DialogType.toolwindow);
        },
        window: function(content, title, options) {
            return Factory.show(content, title, options, Config.DialogType.window);
        }
    });

    $.extend($.dialog, {
        msg: function (content, options) {
            var opt = $.extend({
                autoClose: true, timing: 2560
            }, options);
            return Factory.show(content, '', opt, Config.DialogType.msg);
        },
        win: function (content, title, options) {
            return Factory.show(content, title, options, Config.DialogType.win);
        },
        form: function (content, title, options) {
            return Factory.show(content, title, options, Config.DialogType.form);
        },
        load: function (urlOrElement, title, options) {
            return Factory.show(urlOrElement, title, options, Config.DialogType.load);
        },
        iframe: function (url, title, options) {
            return Factory.show(url, title, options, Config.DialogType.iframe);
        },
        url: function (url, title, options) {
            return Factory.show(url, title, options, Config.DialogType.url);
        },
        about: function(content, title, options) {
            return Factory.show(content, title, options, Config.DialogType.about);
        },
        toolwin: function(content, title, options) {
            return Factory.show(content, title, options, Config.DialogType.toolwin);
        },
        panel: function(content, title, options) {
            return Factory.show(content, title, options, Config.DialogType.panel);
        },
        blank: function(content, title, options) {
            return Factory.show(content, title, options, Config.DialogType.blank);
        }
    });

    $.extend($.dialog, {
        get: function (id) {
            var p = Factory.getOptions(id) || {}, dialog = p.dialog;
            if (dialog && !dialog.isClosed()) {
                return dialog;
            }
            return null;
        },
        show: function (id) {
            var p = Factory.getOptions(id) || {}, dialog = p.dialog;
            if (dialog && !dialog.isClosed()) {
                dialog.show();
            }
            return $;
        },
        close: function (id) {
            return Factory.close(id), $;
        },
        closeFor: function(forname) {
            return Factory.closeFor(forname), $;
        },
        closefor: function(forname) {
            return Factory.closeFor(forname), $;
        },
        closeAll: function (type) {
            return Factory.closeAll(type), $;
        },
        closeall: function (type) {
            return Factory.closeAll(type), $;
        },
        closeParent: function (id, param) {
            return Factory.closeParent(id, param), $;
        },
        closeparent: function (id, param) {
            return Factory.closeParent(id, param), $;
        },
        resizeParent: function (id, param) {
            return Factory.resizeParent(id, param), $;
        },
        resizeparent: function (id, param) {
            return Factory.resizeParent(id, param), $;
        }
    });

    $.extend($.tooltip, {
        close: function (id) {
            if ($.isElement(id)) {
                id = id.getAttribute(Config.TooltipAttributeName);
            }
            return Factory.close(id), $;
        },
        closeFor: function(forname) {
            return Factory.closeFor(forname), $;
        },
        closefor: function(forname) {
            return Factory.closeFor(forname), $;
        },
        closeAll: function (type) {
            return Factory.closeAll(type || Config.DialogType.tooltip), $;
        },
        closeall: function (type) {
            return Factory.closeAll(type || Config.DialogType.tooltip), $;
        }
    });

}(OUI);