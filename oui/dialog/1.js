!
function($) {
    var l = {
        FilePath: $.getScriptSelfPath(true),
        Index: 1,
        IdIndex: 1,
        Identifier: 'oui-dialog-identifier-',
        TitleHeight: 30,
        BottomHeight: 40,
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
            min: {
                english: 'Minimize',
                chinese: '\u6700\u5c0f\u5316'
            },
            max: {
                english: 'Maximize',
                chinese: '\u6700\u5927\u5316'
            },
            close: {
                english: 'Close',
                chinese: '\u5173\u95ed'
            },
            restore: {
                english: 'Restore',
                chinese: '\u8fd8\u539f'
            }
        },
        DialogResult: {
            None: 0,
            OK: 1,
            Cancel: 2,
            Abort: 3,
            Retry: 4,
            Ignore: 5,
            Yes: 6,
            No: 7
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
        ButtonMaps: [['OK'], ['OK', 'Cancel'], ['Abort', 'Retry', 'Ignore'], ['Yes', 'No', 'Cancel'], ['Yes', 'No'], ['Retry', 'Cancel']],
        DialogIcons: {
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
        ButtonConfig: {
            None: {
                key: 'None',
                text: '\u5173\u95ed',
                result: 0,
                skey: '',
                css: 'btn-default'
            },
            OK: {
                key: 'OK',
                text: '\u786e\u5b9a',
                result: 1,
                skey: 'Y',
                css: 'btn-primary'
            },
            Cancel: {
                key: 'Cancel',
                text: '\u53d6\u6d88',
                result: 2,
                skey: 'N',
                css: 'btn-default'
            },
            Abort: {
                key: 'Abort',
                text: '\u4e2d\u6b62',
                result: 3,
                skey: 'A',
                css: 'btn-danger'
            },
            Retry: {
                key: 'Retry',
                text: '\u91cd\u8bd5',
                result: 4,
                skey: 'R',
                css: 'btn-warning'
            },
            Ignore: {
                key: 'Ignore',
                text: '\u5ffd\u7565',
                result: 5,
                skey: 'I',
                css: 'btn-default'
            },
            Yes: {
                key: 'Yes',
                text: '\u662f',
                result: 6,
                skey: 'Y',
                css: 'btn-primary'
            },
            No: {
                key: 'No',
                text: '\u5426',
                result: 7,
                skey: 'N',
                css: 'btn-default'
            }
        },
        ButtonText: {
            close: {
                english: 'Close',
                chinese: '\u5173\u95ed'
            },
            ok: {
                english: 'OK',
                chinese: '\u786e\u5b9a'
            },
            cancel: {
                english: 'Cancel',
                chinese: '\u53d6\u6d88'
            },
            abort: {
                english: 'Abort',
                chinese: '\u4e2d\u6b62'
            },
            retry: {
                english: 'Retry',
                chinese: '\u91cd\u8bd5'
            },
            ignore: {
                english: 'Ignore',
                chinese: '\u5ffd\u7565'
            },
            yes: {
                english: 'Yes',
                chinese: '\u662f'
            },
            no: {
                english: 'No',
                chinese: '\u5426'
            }
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
            Title: {
                english: 'Dialog Title',
                chinese: '\u5bf9\u8bdd\u6846\u6807\u9898'
            },
            CloseTiming: {
                english: 'Close after the countdown is over.',
                chinese: '\u5012\u8ba1\u65f6\u7ed3\u675f\u540e\u5173\u95ed'
            },
            Loading: {
                english: 'Loading, please wait a moment.',
                chinese: '\u6b63\u5728\u52aa\u529b\u52a0\u8f7d\uff0c\u8bf7\u7a0d\u5019'
            }
        }
    },
    Common = {
        getDialogText: function(a, b) {
            var c = l.DialogText[a];
            if (c) {
                return c[(b || '').toLowerCase()]
            }
            return ''
        },
        getStatusText: function(a, b) {
            var c = l.DialogStatusText[(a || '').toLowerCase()];
            if (c) {
                return c[(b || '').toLowerCase()]
            }
            return ''
        },
        getButtonText: function(a, b) {
            var c = l.ButtonText[(a || '').toLowerCase()];
            if (c) {
                return c[(b || '').toLowerCase()]
            }
            return ''
        },
        getDialogButtons: function(a) {
            var b = l.DialogButtons.None;
            switch (a) {
            case l.DialogType.Alert:
                b = l.DialogButtons.OK;
                break;
            case l.DialogType.Confirm:
                b = l.DialogButtons.OKCancel;
                break;
            case l.DialogType.Dialog:
                b = l.DialogButtons.OKCancel;
                break
            }
            return b
        },
        checkStyleUnit: function(s) {
            if ($.isString(s, true)) {
                s = s.toLowerCase();
                var a = ['px', '%', 'em', 'auto', 'pt'];
                for (var i in a) {
                    if (s.endsWith(a[i])) {
                        return s
                    }
                }
                return s + 'px'
            } else if ($.isNumber(s)) {
                return s + 'px'
            }
            return s
        },
        isNumberSize: function(a) {
            return a !== 'auto' && a !== '100%' && !isNaN(parseInt(a, 10))
        },
        getTs: function(a, b) {
            var c = new Date().getTime();
            return parseInt(('' + c).substr(a || 4, b || 8), 10)
        },
        buildId: function(a, b) {
            if (!$.isString(a, true) && !$.isNumber(a)) {
                return this.getTs(5, 8) + '-' + l.Index++
            }
            return (b || '') + a
        },
        buildZindex: function(a, b) {
            return this.getTs(a, b)
        },
        checkTiming: function(a) {
            if (!$.isNumber(a.closeTiming)) {
                a.closeTiming = a.timeout || a.timing || a.time
            }
            a.closeTiming = Math.abs(parseInt('0' + a.closeTiming, 10));
            return a
        },
        checkOptions: function(a, b, c) {
            var d = null,
            elem = null;
            if (a && $.isElement(a)) {
                elem = a;
                a = ''
            }
            if (a && $.isObject(a)) {
                c = a;
                a = b = ''
            } else if (b && $.isObject(b) && !$.isElement(b)) {
                c = b;
                b = ''
            } else if ($.isElement(b)) {
                d = b
            }
            if (!$.isObject(c)) {
                c = {}
            }
            c.element = elem || c.element || undefined;
            c.content = a || c.content || undefined;
            c.title = b || c.title || undefined;
            c.target = d || c.target || undefined;
            return this.checkTiming(c)
        },
        getMargin: function(a) {
            var b = {};
            if (typeof a === 'number' || typeof a === 'string') {
                b = {
                    top: a,
                    right: a,
                    bottom: a,
                    left: a
                }
            } else if ($.isArray(a)) {
                b.top = a[0] || 0;
                b.right = a.length >= 2 ? a[1] : b.top;
                b.bottom = a.length >= 3 ? a[2] : b.top;
                b.left = a.length >= 4 ? a[3] : b.right
            } else if ($.isObject(a)) {
                b = {
                    top: a.top || 0,
                    right: a.right || 0,
                    bottom: a.bottom || 0,
                    left: a.left || 0
                }
            }
            for (var i in b) {
                b[i] = parseInt('0' + b[i], 10)
            }
            return b
        },
        checkType: function(a, b) {
            if (!$.isString(a, true) && !b) {
                return a
            }
            if ([l.DialogType.Message, l.DialogType.Msg].indexOf(a) >= 0) {
                return l.DialogType.Message
            } else if ([l.DialogType.Tooltip, l.DialogType.Tips].indexOf(a) >= 0) {
                return l.DialogType.Tooltip
            }
            return a || (b ? l.DialogType.Dialog: '')
        },
        isPercentSize: function(a, b) {
            return $.isPercent(a) || (typeof b !== 'undefined' && $.isPercent(b))
        },
        toCssText: function(a, b) {
            return $.toCssText(a)
        },
        hasEvent: function(a) {
            var b = ['onclick', 'ondblclick', 'onmousedown'],
            attr;
            for (var i in b) {
                attr = a.getAttribute(b[i]);
                if (attr) {
                    return true
                }
            }
            return false
        },
        isPlainText: function(a) {
            var b = a.getElementsByTagName('*'),
            len = b.length,
            pass = ['BR', 'IFRAME', 'P', 'FONT'],
            tags = ['INPUT', 'A', 'TEXTAREA', 'BUTTON'],
            isText = true,
            elem,
            tag,
            attr;
            if (len === 0) {
                return isText
            }
            for (var i = 0; i < len; i++) {
                elem = b[i];
                tag = elem.tagName;
                if (pass.indexOf(tag) >= 0) {
                    continue
                }
                if (tags.indexOf(tag) >= 0 || this.hasEvent(elem)) {
                    isText = false;
                    break
                }
            }
            return isText
        },
        getDefaultSize: function() {
            var a = window.screen.width,
            size = {};
            if (a <= 1366) {
                size = {
                    width: 360,
                    height: 180
                }
            } else if (a <= 1440) {
                size = {
                    width: 400,
                    height: 200
                }
            } else if (a <= 1920) {
                size = {
                    width: 500,
                    height: 250
                }
            } else {
                size = {
                    width: 600,
                    height: 300
                }
            }
            return size
        },
        getSizeNumber: function(a) {
            var n = ('' + a).indexOf('%') < 0 ? parseInt(a, 10) : 0;
            return isNaN(n) ? 0 : n
        },
        getMaxSize: function(a) {
            var b = {
                minWidth: this.getSizeNumber(a.minWidth),
                minHeight: this.getSizeNumber(a.minHeight),
                maxWidth: this.getSizeNumber(a.maxWidth),
                maxHeight: this.getSizeNumber(a.maxHeight)
            };
            return b
        },
        getTitleSize: function(a) {
            var b = 'div-oui-dialog-text-size-01';
            var c = document.getElementById(b);
            if (!c) {
                c = document.createElement('div');
                c.id = b;
                c.className = 'oui-dialog-title-size';
                document.body.appendChild(c)
            }
            c.innerHTML = a;
            var d = {
                width: c.offsetWidth,
                height: c.offsetHeight
            };
            return c.innerHTML = '',
            d
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
        isRepeat: function(a) {
            return Cache.events[a] ? true: (Cache.events[a] = true, false)
        },
        buildCacheId: function(a) {
            return 'd-' + a
        },
        initCache: function(a, b) {
            var c = this.buildCacheId(a);
            Cache.ids.push({
                key: c,
                id: a
            });
            Cache.dialogs[c] = {
                dialog: b,
                options: {},
                controls: {},
                btns: {},
                buttons: {},
                closed: false,
                hid: false,
                status: {},
                lastStatus: undefined,
                lastSize: undefined,
                events: {},
                timers: {},
                dics: {}
            };
            return b
        },
        getDialog: function(a) {
            a = this.buildCacheId(a);
            if (typeof Cache.dialogs[a] !== 'undefined') {
                return Cache.dialogs[a]['dialog']
            }
            return null
        },
        setDialog: function(a, b) {
            var c = this.getOptions(a);
            if (c) {
                c['dialog'] = b
            }
            return this
        },
        getOptions: function(a, b, c) {
            a = this.buildCacheId(a);
            if (typeof Cache.dialogs[a] !== 'undefined') {
                var d = Cache.dialogs[a];
                return b ? d[b] : d
            }
            return c
        },
        setOptions: function(a, b, c, d) {
            var e = this.getOptions(a);
            if (e) {
                if ($.isString(b, true)) {
                    if (!$.isUndefined(d)) {
                        e[b][c] = d
                    } else if (!$.isUndefined(c)) {
                        e[b] = c
                    }
                } else if ($.isObject(b)) {
                    e['options'] = b
                }
            }
            return this
        },
        getTop: function() {
            var a = -1,
            id = '';
            for (var i = Cache.ids.length - 1; i >= 0; i--) {
                var k = Cache.ids[i].id,
                d = Factory.getDialog(k);
                if (d && !d.isClosed() && d.getOptions().zindex > a) {
                    a = d.getOptions().zindex;
                    id = k
                }
            }
            return a >= 0 ? Factory.getDialog(id) : null
        },
        getLast: function() {
            for (var i = Cache.ids.length - 1; i >= 0; i--) {
                var d = Factory.getDialog(Cache.ids[i].id);
                if (d && !d.isClosed()) {
                    return d
                }
            }
            return null
        },
        remove: function(a) {
            a = this.buildCacheId(a);
            if ($.containsKey(Cache.dialogs, a)) {
                delete Cache.dialogs[a]
            }
            var b = Cache.ids.indexOf(a);
            if (b >= 0) {
                Cache.ids.splice(b, 1)
            }
            return this
        },
        close: function(a) {
            var b = $.isObject(a) ? a: {
                id: a
            };
            if (b.type) {
                this.closeAll(b.type)
            } else if (b.id) {
                var c = this.getCache(b.id);
                if (c && c.dialog.getOptions().closeAble) {
                    c.dialog.close()
                }
            }
            return this
        },
        closeAll: function(a) {
            var b = $.isString(Common.checkType(a), true);
            for (var k in Cache.dialogs) {
                var d = Cache.dialogs[k];
                if (d && !d.isClosed() && d.getOptions().closeAble && (!b || (b && d.getOptions().type === a))) {
                    d.close()
                }
            }
            return this
        },
        setEscClose: function() {
            if (this.isRepeat('escClose')) {
                return false
            }
            $.addListener(document, 'keyup',
            function(e) {
                if (l.KEY_CODE.Esc === $.getKeyCode(e)) {
                    var d = Factory.getLast();
                    if (d && !d.isClosed() && d.getOptions().escClose) {
                        d.close()
                    }
                }
            });
            return this
        },
        allowClose: function(a, b) {
            return a - b > 500
        },
        setClickDocClose: function(b, c) {
            var _ = this;
            Cache.docCloses[c].push(b);
            if (_.isRepeat('doc' + c)) {
                return _
            }
            $.addListener(document, c,
            function(e) {
                var a = Cache.docCloses[c],
                ts = new Date().getTime();
                for (var i = a.length - 1; i >= 0; i--) {
                    var p = Factory.getOptions(a[i]) || {},
                    d = p.dialog;
                    if (d && !d.isClosed() && _.allowClose(ts, p.buildTime)) {
                        a.splice(i, 1);
                        d.close();
                        break
                    }
                }
            });
            return _
        },
        setWindowResize: function() {
            if (this.isRepeat('resize')) {
                return this
            }
            $.addListener(window, 'resize',
            function(e) {
                for (var i = Cache.ids.length - 1; i >= 0; i--) {
                    var d = Factory.getDialog(Cache.ids[i].id);
                    if (d && !d.isClosed()) {
                        if (d.getOptions().type === l.DialogType.Tooltip) {
                            d.setTooltipPosition()
                        } else {
                            var a = {
                                event: 'window.resize'
                            },
                            fullScreen = d.isMaximized();
                            if (fullScreen || d.isPercent()) {
                                Util.setBodySize(d, $.extend(a, {
                                    fullScreen: fullScreen
                                }))
                            }
                            Util.setPosition(d, a)
                        }
                    }
                }
            });
            return this
        },
        show: function(a, b, c, e, f) {
            c = Common.checkOptions(a, b, c);
            var g = {
                id: Common.buildId(c.id),
                type: Common.checkType(e || c.type, true)
            };
            $.extend(c, {
                target: f
            });
            switch (g.type) {
            case l.DialogType.Alert:
                g.buttons = l.DialogButtons.OK;
                g.showMin = g.showMax = false;
                break;
            case l.DialogType.Confirm:
                g.buttons = l.DialogButtons.OKCancel;
                g.showMin = g.showMax = false;
                break;
            case l.DialogType.Dialog:
                g.height = 'auto';
                break;
            case l.DialogType.Win:
                g.showBottom = $.isBoolean(c.showBottom, false);
                g.height = 'auto';
                break;
            case l.DialogType.Form:
                g.height = 'auto';
                g.delayClose = true;
                break;
            case l.DialogType.Url:
            case l.DialogType.Load:
            case l.DialogType.Iframe:
                g.showBottom = $.isBoolean(c.showBottom, false);
                break;
            default:
                g.buttons = l.DialogButtons.None;
                g.showTitle = g.showBottom = g.dragSize = false;
                g.height = g.minHeight = 'auto';
                g.minAble = g.maxAble = g.lock = false;
                break
            }
            var d = this.getDialog($.extend(g, c).id);
            if (g.type === l.DialogType.Tooltip && !g.position) {
                g.position = 6
            }
            if (d === null) {
                this.initCache(g.id, null);
                d = new Dialog(g.content, g.title, g)
            } else {
                d.update(g.content, g.title, g)
            }
            return d
        },
        loadCss: function() {
            var a = l.FilePath;
            $.loadLinkStyle($.getFilePath(a) + $.getFileName(a, true).replace('.min', '') + '.css')
        }
    },
    Util = {
        getParam: function(_) {
            var p = Factory.getOptions(_.id);
            return p || {
                none: true,
                options: {},
                controls: {},
                status: {},
                events: {},
                buttons: {},
                btns: {}
            }
        },
        setOptions: function(_, a, b, c) {
            var d = $.isString(_, true) ? _: _.id;
            return Factory.setOptions(d, a, b, c),
            this
        },
        isSelf: function(_, a) {
            if (!a || !Factory.getDialog(a.id)) {
                return false
            }
            return a.getOptions().id === _.getOptions().id
        },
        appendChild: function(a, b) {
            return $.appendChild(b, a),
            this
        },
        getCache: function(_, a, b) {
            return Factory.getOptions(_.id, a, b)
        },
        setStatus: function(_, a) {
            var b = {
                key: a
            };
            b[a] = true;
            var c = this.getCache(_, 'status').key;
            return this.setOptions(_, 'lastStatus', c).setOptions(_, 'status', b)
        },
        hideDocOverflow: function(_, a) {
            var b;
            if (a) {
                b = Cache.docOverflow[_.id];
                if (b !== 'hidden') {
                    document.body.style.overflow = b
                }
            } else {
                b = document.body.style.overflow;
                if (b !== 'hidden') {
                    document.body.style.overflow = 'hidden';
                    Cache.docOverflow[_.id] = b
                }
            }
            return this
        },
        build: function(_, a) {
            var b = this,
            p = Util.getParam(_),
            opt = p.options,
            ctls = p.controls;
            var c = opt.status || l.DialogStatus.Normal;
            opt.type = Common.checkType(opt.type, true);
            if (c !== l.DialogStatus.Normal) {
                opt.status = l.DialogStatus.Normal
            }
            if (opt.type === l.DialogType.Tooltip) {
                opt.lock = false;
                return b.buildTooltip(_, a),
                b
            } else if (opt.lock) {
                b.hideDocOverflow(_).buildShade(_).buildContainer(_)
            }
            b.buildBox(_).buildMain(_, ctls.box).buildTop(_, ctls.main, false).buildBody(_, ctls.main).buildBottom(_, ctls.main, false);
            if (opt.fixed) {
                ctls.box.style.position = 'fixed'
            }
            if (opt.dragSize) {
                b.setZoomSwitch(_)
            }
            if (ctls.shade) {
                document.body.appendChild(ctls.shade)
            }
            if (ctls.container) {
                ctls.container.appendChild(ctls.box);
                document.body.appendChild(ctls.container)
            } else {
                document.body.appendChild(ctls.box)
            }
            b.setSize(_, {
                type: opt.status,
                width: opt.width,
                height: opt.height
            });
            if (b.isAutoSize(_)) {
                b.setBodySize(_);
                $.extend(opt, b.getAutoSize(_, true));
                b.setSize(_, {
                    type: opt.status,
                    width: opt.width,
                    height: opt.height
                })
            }
            b.setPosition(_, {
                position: opt.position,
                x: opt.x,
                y: opt.y
            });
            b.setCache(_).dragPosition(_).dragSize(_).setClickBgClose(_);
            if (opt.escClose) {
                Factory.setEscClose()
            }
            Factory.setWindowResize();
            if (!opt.showTitle || ctls.iframe || Common.isPlainText(ctls.content)) {
                $.addListener([ctls.body, ctls.box], 'mousedown',
                function() {
                    _.topMost()
                });
                $.addListener(ctls.box, ['click', 'dblclick', 'mousedown'],
                function() {
                    $.cancelBubble()
                })
            }
            if (ctls.container && opt.cancelBubble) {
                $.addListener(ctls.container, ['click', 'mousedown'],
                function() {
                    $.cancelBubble()
                })
            }
            if ([l.DialogStatus.Min, l.DialogStatus.Max].indexOf(c) >= 0) {
                _[c]()
            }
            return b.buildCloseTiming(_),
            _.focus(),
            b
        },
        setClickBgClose: function(_) {
            var p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none) {
                return this
            }
            if (! ('' + opt.clickBgClose).toLowerCase(). in (['dblclick', 'click'])) {
                return this
            }
            if (opt.lock && ctls.container) {
                $.addListener(ctls.container, opt.clickBgClose,
                function() {
                    _.close()
                })
            } else {
                window.setTimeout(function() {
                    Factory.setClickDocClose(opt.id, opt.clickBgClose)
                },
                100)
            }
            return this
        },
        buildShade: function(_) {
            var p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none || !opt.lock) {
                return this
            }
            ctls.shade = $.createElement('div');
            ctls.shade.className = 'oui-dialog-shade';
            ctls.shade.style.zIndex = opt.zindex;
            var a;
            if ((a = Common.toCssText({
                opacity: opt.opacity
            }))) {
                ctls.shade.style.cssText = a
            }
            return this
        },
        buildContainer: function(_) {
            var p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none || !opt.lock) {
                return this
            }
            ctls.container = $.createElement('div');
            ctls.container.className = 'oui-dialog-container';
            ctls.container.style.zIndex = opt.zindex;
            return this
        },
        buildBox: function(_) {
            var p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none) {
                return this
            }
            var a;
            ctls.box = $.createElement('div');
            ctls.box.className = 'oui-dialog';
            ctls.box.style.zIndex = opt.zindex;
            ctls.box.id = _.getDialogId();
            if ((a = Common.toCssText(opt.dialogStyle || opt.boxStyle, 'box'))) {
                ctls.box.style.cssText = a
            }
            return this
        },
        buildMain: function(_, a) {
            var p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none || _.isClosed()) {
                return this
            }
            var b = $.createElement('div'),
            css;
            b.className = 'main';
            if ((css = Common.toCssText(opt.mainStyle, 'main'))) {
                b.style.cssText = css
            }
            return this.appendChild((ctls.main = b), a)
        },
        buildTop: function(_, a, b) {
            var p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none || _.isClosed() || !opt.showTitle || (ctls.top && !b)) {
                return this
            }
            var c, css, btns = p.btns;
            if (b && ctls.top) {
                $.removeChild(ctls.top, [ctls.logo, ctls.title, ctls.btnPanel]);
                c = ctls.top
            }
            if (!b) {
                c = $.createElement('div');
                c.className = 'top';
                if ((css = Common.toCssText(opt.topStyle || opt.titleStyle, 'top'))) {
                    c.style.cssText = css
                }
                $.addListener(c, 'dblclick',
                function() {
                    $.cancelBubble();
                    if (opt.maxAble) {
                        _.max()
                    }
                });
                $.addListener(c, ['mousedown', 'click'],
                function() {
                    $.cancelBubble();
                    _.topMost()
                })
            }
            if (opt.showLogo) {
                var d = $.createElement('div');
                d.className = 'logo';
                c.appendChild((ctls.logo = d))
            }
            var e = $.createElement('div');
            e.className = 'title';
            e.innerHTML = opt.title;
            if ((css = Common.toCssText(opt.titleStyle, 'title'))) {
                e.style.cssText = css
            }
            c.appendChild((ctls.title = e));
            this.buildClose(_, c, true);
            return ! b ? this.appendChild((ctls.top = c), a) : null,
            this
        },
        buildCloseTiming: function(_) {
            var p = this.getParam(_),
            opt = p.options,
            ctls = p.controls,
            timers = p.timers;
            if (p.none || !opt.autoClose || !opt.closeAble) {
                return this
            }
            this.clearTimer(timers);
            if (opt.showTimer) {
                var i = opt.closeTiming / 100;
                if (i > 20 && opt.showTitle) {
                    var b = $.createElement('label', 'timing',
                    function(a) {
                        a.className = 'timing';
                        a.title = Common.getDialogText('CloseTiming', opt.lang) || ''
                    });
                    ctls.top.appendChild((ctls.timer = b));
                    timers.timingTimer = window.setInterval(function() {
                        ctls.timer.innerHTML = (i--) / 10
                    },
                    100)
                }
            }
            return timers.closeTimer = window.setInterval(function() {
                Util.clearTimer(timers);
                _.close()
            },
            opt.closeTiming),
            this
        },
        clearTimer: function(a) {
            for (var i in a) {
                if (a[i]) {
                    window.clearInterval(a[i]);
                    delete a[i]
                }
            }
            return this
        },
        buildClose: function(_, a, b) {
            var p = this.getParam(_),
            opt = p.options,
            ctls = p.controls,
            html = [];
            if (!ctls.box) {
                return this
            }
            if (b) {
                var c = opt.minAble && opt.showMin,
                isMax = opt.maxAble && opt.showMax,
                min = Common.getStatusText('min', opt.lang),
                max = Common.getStatusText('max', opt.lang);
                if (c) {
                    html.push('<a class="btn btn-min" code="min" title="' + min + '"></a>')
                }
                if (isMax || c) {
                    html.push('<a class="btn btn-max" code="max" title="' + max + '"></a>')
                }
            }
            if (opt.closeAble && opt.showClose) {
                var d = Common.getStatusText('close', opt.lang);
                html.push('<a class="btn btn-close" code="close" title="' + d + '"></a>')
            }
            if (html.length > 0) {
                var e = $.createElement('div'),
                ctls = p.controls,
                btns = p.btns;
                e.className = 'btn-panel';
                e.innerHTML = html.join('');
                e.style.cssText = 'float:right';
                a.appendChild((ctls.btnPanel = e));
                for (var i = 0; i < e.childNodes.length; i++) {
                    var f = e.childNodes[i],
                    key = f.getAttribute('code');
                    btns[key] = f
                }
                return this.setButtonEvent(_, e.childNodes, 'click', false),
                this
            }
            return this
        },
        buildBody: function(_, a) {
            var p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none || _.isClosed()) {
                return this
            }
            var b = $.createElement('div'),
            css;
            b.className = 'body';
            if (!opt.showTitle) {
                this.buildClose(_, b, false)
            }
            if ((css = Common.toCssText(opt.bodyStyle, 'body'))) {
                b.style.cssText = css
            }
            return this.buildContent(_, b).appendChild((ctls.body = b), a)
        },
        buildContent: function(_, a) {
            var p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none || _.isClosed()) {
                return this
            }
            var b = ctls.content,
            css, util = this;
            if (!b) {
                b = $.createElement('div');
                b.className = 'content'
            }
            if ((css = Common.toCssText(opt.contentStyle, 'content'))) {
                b.style.cssText = css
            }
            if ([l.DialogType.Url, l.DialogType.Iframe, l.DialogType.Load].indexOf(opt.type) >= 0) {
                if ($.isElement(opt.element) && opt.type === l.DialogType.Load) {
                    b.innerHTML = opt.element.innerHTML || opt.element.value || ''
                } else {
                    b.innerHTML = this.buildIframe(_, opt, opt.content);
                    a.style.overflow = 'hidden';
                    b.style.padding = '0px';
                    b.style.margin = '0px';
                    var c = false,
                    childs = b.childNodes;
                    $.extend(ctls, {
                        iframe: childs[0],
                        iframeShade: childs[1],
                        loading: childs[2]
                    });
                    ctls.iframe.onload = ctls.iframe.onreadystatechange = function() {
                        if (!this.readyState || this.readyState == "complete") {
                            util.showIframeShade(false).showLoading(ctls, false);
                            c = true
                        }
                    };
                    window.setTimeout(function() {
                        if (!c) {
                            util.showIframeShade(ctls, false).showLoading(ctls, false)
                        }
                    },
                    15 * 1000)
                }
            } else {
                b.innerHTML = opt.content
            }
            return this.appendChild((ctls.content = b), a || null)
        },
        buildIframe: function(_, a, b) {
            var c = '100%';
            var d = ['<iframe class="iframe" width="100%"', ' id="{0}-iframe" height="{1}" src="{2}"', ' frameborder="0" scrolling="auto"></iframe>', '<div id="{0}-iframe-shade" class="iframe-shade"></div>', '<div id="{0}-loading" class="loading">{3}</div>'].join('');
            return d.format(_.getDialogId(), c, b.setUrlParam(), a.loading || Common.getDialogText('Loading', a.lang))
        },
        showIframeShade: function(a, b) {
            if (a.iframeShade) {
                a.iframeShade.style.display = b ? 'block': 'none'
            }
            return this
        },
        showLoading: function(a, b) {
            if (a.loading) {
                a.loading.style.display = b ? 'block': 'none'
            }
            return this
        },
        buildBottom: function(_, a, b) {
            var p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none || _.isClosed() || !opt.showBottom || (ctls.bottom && !b)) {
                return this
            }
            var c, css, buttons = p.buttons,
            util = this;
            if (b && ctls.bottom) {
                $.removeChild(ctls.bottom, [ctls.button]);
                c = ctls.bottom
            }
            if (!b) {
                c = $.createElement('div');
                c.className = 'bottom';
                if ((css = Common.toCssText(opt.bottomStyle, 'bottom'))) {
                    c.style.cssText = css
                }
            }
            var d = $.createElement('div');
            d.className = 'button-panel';
            d.innerHTML = util.buildButtons(_);
            if ([l.Position.Left, l.Position.Center, l.Position.Right].indexOf(opt.buttonPosition) >= 0) {
                d.style.cssText = 'text-align:{0};'.format(opt.buttonPosition)
            }
            c.appendChild((ctls.buttonPanel = d));
            for (var i = 0; i < d.childNodes.length; i++) {
                var e = d.childNodes[i],
                key = e.getAttribute('code');
                buttons[key] = e
            }
            $.addListener(c, ['mousedown', 'dblclick', 'click'],
            function() {
                $.cancelBubble();
                _.topMost()
            });
            util.setButtonEvent(_, d.childNodes, 'click', true).setShortcutKeyEvent(_, d.childNodes);
            return ! b ? util.appendChild((ctls.bottom = c), a) : null,
            util
        },
        buildButtons: function(_) {
            var p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none) {
                return this
            }
            var a = l.DialogButtons,
            html = [];
            if (!$.isNumber(opt.buttons) || opt.buttons < 0) {
                return ''
            }
            var a = l.ButtonMaps[opt.buttons],
            txts = {};
            if ($.isObject(opt.buttonText)) {
                txts = opt.buttonText
            } else if ($.isString(opt.buttonText, true)) {
                txts = {
                    OK: opt.buttonText
                }
            }
            for (var i in a) {
                var b = l.ButtonConfig[a[i]],
                css = i > 0 ? ' btn-ml': '';
                b.text = Common.getButtonText(b.key, opt.lang) || b.text;
                $.extend(b, {
                    text: txts[b.code]
                });
                text = '<a class="btn {css}{1}" code="{key}" result="{result}" href="{{0}}" shortcut-key="{skey}">{text}</a>';
                if (b) {
                    html.push(text.format(b, css))
                }
            }
            return html.join('').format('javascript:void(0);')
        },
        setZoomSwitch: function(_, a) {
            var p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none) {
                return this
            }
            var b = [l.Direction.Top, l.Direction.Right, l.Direction.Bottom, l.Direction.Left, l.Direction.TopLeft, l.Direction.TopRight, l.Direction.BottomLeft, l.Direction.BottomRight];
            a = $.isString(a) ? [a] : b;
            if (opt.dragSize) {
                for (var i in a) {
                    ctls.box.appendChild(this.buildZoomSwitch(_, a[i]))
                }
                this.showZoomSwitch(_)
            } else {
                this.hideZoomSwitch(_)
            }
            return this
        },
        buildZoomSwitch: function(_, a) {
            var p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none) {
                return this
            }
            if ($.isUndefined(a)) {
                a = l.Direction.BottomRight
            }
            var b = opt.id + '-switch-' + a;
            if (document.getElementById(b) !== null) {
                return false
            }
            var c = $.createElement('div');
            c.className = 'border-switch';
            c.pos = a;
            c.id = b;
            c.dialogId = opt.id;
            $.addClass(c, a + '-switch');
            return c
        },
        getElements: function(_, a) {
            return $('#' + _.getDialogId() + ' ' + a)
        },
        getZoomSwicths: function(_) {
            return this.getElements(_, '.border-switch')
        },
        showZoomSwitch: function(_) {
            this.getZoomSwicths(_).each(function() {
                $(this).show()
            });
            return this
        },
        hideZoomSwitch: function(_) {
            this.getZoomSwicths(_).each(function(i, a, b) {
                $(this).hide()
            });
            return this
        },
        setButtonEvent: function(_, d, f, g) {
            var p = this.getParam(_),
            opt = p.options;
            if (p.none) {
                return this
            }
            var h = this,
            events = p.events;
            for (var i = 0; i < d.length; i++) {
                var j = d[i];
                if (j.tagName !== 'A') {
                    continue
                }
                $.addListener(j, f || 'click',
                function() {
                    h.setAction(_, this);
                    $.cancelBubble()
                });
                $.addListener(j, 'mousedown',
                function() {
                    events.btnMouseDown = true
                });
                $.addListener(j, 'mouseup',
                function() {
                    events.btnMouseDown = false
                });
                if (g) {
                    $.addListener(j, 'keypress',
                    function(e) {
                        var a = $.getKeyCode(e);
                        var b = String.fromCharCode(a).toUpperCase();
                        var c = this.getAttribute('shortcut-key') || '';
                        if (l.KEY_CODE.Space === a || b === c) {
                            h.setAction(_, this)
                        }
                    })
                }
            }
            return this
        },
        setShortcutKeyEvent: function(_, b) {
            var c = this,
            dics = {};
            c.setOptions(_, 'dics', dics);
            for (var i = 0; i < b.length; i++) {
                var d = b[i];
                if (d.tagName !== 'A') {
                    continue
                }
                var f = d.getAttribute('shortcut-key') || '';
                if (f) {
                    dics[f] = d
                }
            }
            $.addListener(document, 'keypress',
            function(e) {
                if (!e.shiftKey) {
                    return false
                }
                var a = $.getKeyCode(e),
                strKeyCode = String.fromCharCode(a).toUpperCase(),
                btn = dics[strKeyCode];
                if ($.isElement(btn)) {
                    c.setAction(_, btn)
                }
            });
            return c
        },
        checkEventObj: function(_, a) {
            var p = this.getParam(_),
            ctls = p.controls;
            if (p.none) {
                return this
            }
            if (!$.isElement(a)) {
                return false
            }
            var b = a.parentNode;
            while (b !== null) {
                if (b == ctls.box) {
                    return true
                }
                b = b.parentNode
            }
            return false
        },
        setAction: function(_, a) {
            var b = '';
            if (typeof a === 'string') {
                b = a
            } else {
                if (!this.checkEventObj(_, a)) {
                    return false
                }
                b = a.getAttribute('code')
            }
            if (b === l.DialogStatus.Min) {
                _.min()
            } else if (b === l.DialogStatus.Max) {
                _.max()
            } else if (b === l.DialogStatus.Close) {
                _.close()
            } else {
                var c = parseInt(a.getAttribute('result'), 10);
                _.close(b, c)
            }
            return this
        },
        setCache: function(_) {
            var a = this,
            p = a.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none) {
                return a
            }
            var b = ctls.box,
            bs = $.getBodySize(),
            w = b.offsetWidth,
            h = b.offsetHeight,
            size = {
                percent: Common.isPercentSize(opt.width, opt.height),
                width: w,
                height: h,
                bs: bs
            },
            lastSize = opt.height === 'auto' ? size: $.extend({
                top: b.offsetTop,
                left: b.offsetLeft,
                right: bs.width - (b.offsetLeft + b.offsetWidth),
                bottom: bs.height - (b.offsetTop + b.offsetHeight)
            },
            size);
            return a.setOptions(_, 'lastSize', lastSize),
            this
        },
        setSize: function(_, a) {
            var b = this,
            p = this.getParam(_),
            c = p.options,
            ctls = p.controls;
            if (p.none) {
                return this
            }
            var c = p.options,
            ctls = p.controls,
            btns = p.btns,
            obj = ctls.box,
            par = {};
            if ($.isString(a)) {
                a = {
                    type: a
                }
            }
            var d = $.extend({
                type: l.DialogStatus.Normal,
                width: 0,
                height: 0
            },
            a);
            if (d.type === '' || (d.width.isNaN() && d.height.isNaN()) || _.getStatus()[d.type]) {
                return b
            }
            if (p.status.normal) {
                b.setCache(_)
            }
            if (p.status.max && d.type !== l.DialogStatus.Max && ctls.container) {
                $.removeClass(ctls.container, 'dialog-overflow-hidden')
            } else if (d.type !== l.DialogStatus.Min) {
                $.removeClass(ctls.bottom, 'display-none')
            }
            if (d.type !== l.DialogStatus.Max && !c.lock) {
                b.hideDocOverflow(_, true)
            }
            if (btns.max) {
                btns.max.title = Common.getStatusText(d.type === l.DialogStatus.Max ? 'restore': 'max', c.lang)
            }
            var e = $.getBodySize(),
            isSetBodySize = false,
            isSetPosition = false,
            isFullScreen = false;
            if (d.type === l.DialogStatus.Max) {
                if (!c.maxAble) {
                    return this
                }
                var f = c.lock ? 0 : document.documentElement.scrollTop;
                par = {
                    width: '100%',
                    height: '100%',
                    top: f,
                    left: 0,
                    right: 0,
                    bottom: 0
                };
                isSetBodySize = isFullScreen = true;
                $.addClass(obj, 'oui-dialog-max').addClass(btns.max, 'btn-normal');
                if (ctls.container) {
                    $.addClass(ctls.container, 'dialog-overflow-hidden')
                }
                if (p.status.min) {
                    $.removeClass(obj, 'oui-dialog-min')
                }
                b.hideDocOverflow(_).hideZoomSwitch(_).setStatus(_, l.DialogStatus.Max)
            } else if (d.type === l.DialogStatus.Min) {
                if (!c.minAble) {
                    return this
                }
                var g = parseInt(c.minWidth, 10),
                minH = 36;
                if (isNaN(g)) {
                    g = 180
                }
                par = {
                    width: g,
                    height: minH
                };
                $.addClass(ctls.bottom, 'display-none').addClass(obj, 'oui-dialog-min').removeClass(btns.max, 'btn-normal');
                if (p.status.max) {
                    $.removeClass(obj, 'oui-dialog-max')
                }
                $.setStyle(obj, {
                    width: g,
                    height: minH
                },
                'px');
                b.hideZoomSwitch(_).setStatus(_, l.DialogStatus.Min).setPosition(_, {
                    position: c.position
                });
                var h = $.getPaddingSize(obj),
                topWidth = g - h.left - h.right;
                b.setTitleSize(_, topWidth)
            } else {
                isSetBodySize = true;
                $.removeClass(btns.max, 'btn-normal');
                if (p.status.max) {
                    $.removeClass(obj, 'oui-dialog-max')
                } else if (p.status.min) {
                    $.removeClass(obj, 'oui-dialog-min')
                }
                b.showZoomSwitch(_).setStatus(_, l.DialogStatus.Normal);
                if (d.type === 'resize' || d.type === 'size') {
                    par = {
                        width: d.width,
                        height: d.height
                    }
                } else if (d.type === 'scale') {
                    isSetBodySize = false;
                    b.changeSize(_, a)
                } else {
                    if (!$.isUndefined(p.lastSize)) {
                        isSetPosition = e.width !== p.lastSize.bs.width || e.height !== p.lastSize.bs.height;
                        if (p.lastSize.percent && isSetPosition) {
                            par = $.extend({},
                            p.lastSize, {
                                width: c.width,
                                height: c.height
                            })
                        } else {
                            $.setStyle(obj, p.lastSize, 'px')
                        }
                    } else {
                        par = {
                            width: d.width,
                            height: d.height
                        }
                    }
                }
            }
            for (var i in par) {
                var j = par[i];
                if (!$.isNullOrUndefined(j)) {
                    obj.style[i] = Common.checkStyleUnit(j)
                }
            }
            if (isSetBodySize) {
                b.setBodySize(_, {
                    fullScreen: isFullScreen
                })
            }
            if (isSetPosition) {
                b.setPosition(_)
            }
            return this
        },
        setTitleSize: function(_, a) {
            var b = this,
            p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none) {
                return this
            }
            if (_.isClosed() || !ctls.top) {
                return this
            }
            var c = a || ctls.top.clientWidth,
            logoWidth = ctls.logo ? ctls.logo.offsetWidth: 0,
            btnWidth = ctls.btnPanel ? ctls.btnPanel.offsetWidth: 0,
            timerWidth = ctls.timer ? ctls.timer.offsetWidth: 0,
            titleWidth = c - logoWidth - timerWidth - btnWidth - 10;
            if (ctls.title) {
                ctls.title.style.maxWidth = (titleWidth) + 'px';
                var d = Common.getTitleSize(ctls.title.innerHTML, '');
                if (d.width > titleWidth) {
                    ctls.title.title = $.filterHtmlCode(opt.title)
                } else {
                    ctls.title.title = ''
                }
            }
            return this
        },
        clearPositionStyle: function(a) {
            var b = a.style.cssText.split(';');
            var c = [];
            for (var i in b) {
                var d = b[i].split(':')[0].trim();
                if (!d. in (['top', 'left', 'right', 'bottom'])) {
                    c.push(b[i])
                }
            }
            return a.style.cssText = c.join(';'),
            this
        },
        checkPosition: function(_, a, b) {
            if (!$.isNumber(b)) {
                b = _.getOptions().position
            }
            var c = {
                top: [1, 2, 3],
                middle: [4, 5, 6],
                bottom: [7, 8, 9],
                left: [1, 4, 7],
                center: [2, 5, 8],
                right: [3, 6, 9],
                custom: [0, 10]
            },
            keys = $.isArray(a) ? a: [a];
            for (var i in keys) {
                if ((c[keys[i]] || []).indexOf(b) >= 0) {
                    return true
                }
            }
            return false
        },
        setPosition: function(_, a) {
            var b = this,
            p = this.getParam(_),
            opt = p.options,
            ctls = p.controls,
            obj = ctls.box;
            if (p.none || !obj) {
                return this
            }
            if ($.isString(a) || $.isNumber(a)) {
                a = {
                    position: a
                }
            } else if ($.isUndefined(a)) {
                a = {
                    position: opt.position
                }
            }
            var c = $.extend({
                event: '',
                fullScreen: false,
                target: opt.target,
                parent: opt.parent,
                position: opt.position,
                x: opt.x,
                y: opt.y
            },
            a),
            posX,
            posY;
            if (c.event === 'window.resize') {
                if (p.status.max) {
                    return $.setStyle(obj, {
                        left: 0,
                        top: 0
                    },
                    'px'),
                    b
                } else {}
            }
            if ($.isElement(c.target)) {
                return b.setTargetPosition(c, obj),
                b
            }
            c.position = c.position === 'custom' ? 10 : parseInt(c.position, 10);
            c.x = Math.abs(c.x);
            c.y = Math.abs(c.y);
            if (isNaN(c.position) || isNaN(c.x) || isNaN(c.y)) {
                return b
            }
            var d = $.getBodySize(),
            cp = $.getScrollPosition(),
            w = obj.offsetWidth,
            h = obj.offsetHeight,
            fixed = opt.lock || opt.fixed,
            cpTop = fixed ? 0 : cp.top,
            cpLeft = fixed ? 0 : cp.left,
            isCenter = b.checkPosition(_, l.Position.Center, c.position),
            isMiddle = b.checkPosition(_, l.Position.Middle, c.position),
            isBottom = false,
            isRight = false;
            if (isCenter) {
                posX = (d.width / 2 - w / 2) + cpLeft
            } else {
                isRight = b.checkPosition(_, l.Position.Right, c.position) posX = isRight ? (d.width - c.x - w + cpLeft) : cpLeft + c.x
            }
            if (isMiddle) {
                posY = d.height / 2 - h / 2 + cpTop
            } else {
                isBottom = b.checkPosition(_, l.Position.Bottom, c.position);
                posY = isBottom ? (d.height - c.y - h + cpTop) : cpTop + c.y
            }
            b.clearPositionStyle(obj);
            return $.setStyle(obj, {
                left: posX,
                top: posY
            },
            'px'),
            b
        },
        movePosition: function(_, a, b) {
            var c = this,
            p = this.getParam(_),
            opt = p.options,
            ctls = p.controls,
            obj = ctls.box;
            if (p.none || !obj || !opt.moveAble) {
                return c
            }
            var d = $.extend({
                target: null,
                parent: null,
                position: 7,
                x: null,
                y: null
            },
            a);
            if ($.isElement(d.target)) {
                return c.setTargetPosition(d, obj),
                c
            }
            var e = $.isBoolean(b, false),
            bs = $.getBodySize(),
            left = obj.offsetLeft,
            top = obj.offsetTop,
            w = obj.offsetWidth,
            h = obj.offsetHeight,
            x = parseInt(d.x || d.left, 10),
            y = parseInt(d.y || d.top, 10);
            if (isNaN(x)) {
                x = e ? left: 0
            }
            if (isNaN(y)) {
                y = e ? top: 0
            }
            var f = e ? x: left + x,
            posY = e ? y: top + y;
            if (opt.limitRange) {
                if (f < 0) {
                    f = 0
                }
                if (posY < 0) {
                    posY = 0
                }
                if ((f + w) > bs.width) {
                    f = bs.width - w
                }
                if ((posY + h) > bs.height) {
                    posY = bs.height - h
                }
            }
            $.setStyle(obj, {
                width: w,
                height: h,
                left: f,
                top: posY
            },
            'px');
            return c
        },
        setTargetPosition: function(a, b, c) {
            var d = $.extend({
                target: null,
                parent: null,
                position: 7,
                x: null,
                y: null
            },
            a);
            if (!$.isElement(d.target) || !$.isElement(b)) {
                return {}
            }
            var e = d.position || d.pos || 7,
            p = $.getOffset(d.target),
            w = b.offsetWidth,
            h = b.offsetHeight,
            bs = $.getBodySize(),
            fs = {
                w: p.width,
                h: p.height,
                x: p.left,
                y: p.top
            },
            left = fs.x,
            top = fs.y,
            css = '';
            switch (e) {
            case 2:
            case l.Position.Top:
                top = fs.y - h - d.y;
                css = l.Position.Top;
                break;
            case 6:
            case l.Position.Right:
                if ((fs.x + fs.w + w + d.x) > bs.width) {
                    left = fs.x - w - d.x;
                    css = l.Position.Left
                } else {
                    left = fs.x + fs.w + d.x;
                    css = l.Position.Right
                }
                break;
            case 7:
            case 8:
            case l.Position.Bottom:
                top = fs.y + fs.h + d.y;
                css = l.Position.Bottom;
                break;
            case 4:
            case l.Position.Left:
                if ((fs.x - w - d.x) < 0) {
                    left = fs.x + fs.w + d.x;
                    css = l.Position.Right
                } else {
                    left = fs.x - w - d.x;
                    css = l.Position.Left
                }
                break
            }
            if (c) {
                $.setStyle(b, {
                    width: w,
                    height: h
                },
                'px')
            }
            $.setStyle(b, {
                left: left,
                top: top
            },
            'px');
            return css
        },
        dragPosition: function(_) {
            var b = this,
            p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none) {
                return this
            }
            var c = ctls.box,
            docMouseMove = document.onmousemove,
            docMouseUp = document.onmouseup;
            function moveDialog() {
                if (!opt.moveAble || !opt.dragMove) {
                    return $.cancelBubble(),
                    false
                }
                var a = $.getEvent(),
                cp = $.getScrollPosition(),
                bs = $.getBodySize(),
                clientWidth = bs.width,
                clientHeight = bs.height,
                moveX = a.clientX,
                moveY = a.clientY,
                top = c.offsetTop,
                left = c.offsetLeft,
                moveAble = true,
                isToNormal = false;
                document.onmousemove = function() {
                    if (!opt.moveAble || !opt.dragMove || !moveAble || p.events.btnMouseDown) {
                        return false
                    }
                    b.showIframeShade(ctls, true);
                    var e = $.getEvent(),
                    x = left + e.clientX - moveX,
                    y = top + e.clientY - moveY;
                    if (!isToNormal && p.status.max && (x > 2 || y > 2)) {
                        isToNormal = true;
                        b.dragToNormal(_, e, bs, moveX, moveY);
                        top = c.offsetTop;
                        left = c.offsetLeft;
                        return false
                    }
                    b.movePosition(_, {
                        x: x,
                        y: y
                    },
                    true)
                };
                document.onmouseup = function() {
                    if (!opt.moveAble || !opt.dragMove || !moveAble) {
                        return false
                    }
                    document.onmousemove = docMouseMove;
                    document.onmouseup = docMouseUp;
                    moveAble = false;
                    p.events.btnMouseDown = false;
                    b.showIframeShade(ctls, false)
                }
            }
            if (opt.showTitle && ctls.top) {
                $.addListener(ctls.top, 'mousedown',
                function() {
                    moveDialog()
                })
            } else {
                $.addListener([ctls.box, ctls.body, ctls.content], 'mousedown',
                function() {
                    moveDialog()
                })
            }
            return this
        },
        changeSize: function(_, a, b, c) {
            var d = this,
            p = this.getParam(_),
            opt = p.options,
            ctls = p.controls,
            obj = ctls.box;
            if (p.none) {
                return this
            }
            if (!obj || !opt.sizeAble || (!opt.dragSize && b)) {
                return d
            }
            var e = $.extend({
                type: '',
                resizeTo: false,
                dir: l.Direction.BottomRight,
                x: 0,
                y: 0
            },
            a);
            e.x = parseInt(e.x, 10);
            e.y = parseInt(e.y, 10);
            if (e.dir === '' || isNaN(e.x) || isNaN(e.y)) {
                return d
            } else if (e.x === 0 && e.y === 0) {
                return d
            }
            if (!b) {
                c = {
                    width: obj.offsetWidth,
                    height: obj.offsetHeight,
                    top: obj.offsetTop,
                    left: obj.offsetLeft,
                    right: obj.offsetWidth + obj.offsetLeft,
                    bottom: obj.offsetHeight + obj.offsetTop,
                    minWidth: parseInt(opt.minWidth, 10),
                    minHeight: parseInt(opt.minHeight, 10)
                }
            }
            var f = $.getBodySize(),
            w = c.width + e.x,
            h = c.height + e.y,
            newWidth = w < c.minWidth ? c.minWidth: w,
            newHeight = h < c.minHeight ? c.minHeight: h,
            newLeft = 0,
            newTop = 0,
            x = 0,
            y = 0;
            var g = parseInt(opt.maxWidth, 10);
            if (opt.maxWidth !== '100%' && !isNaN(g) && newWidth > g) {
                newWidth = g
            } else {
                x = e.x
            }
            var i = parseInt(opt.maxHeight, 10);
            if (opt.maxHeight !== '100%' && !isNaN(i) && newHeight > i) {
                newHeight = i
            } else {
                y = e.y
            }
            if (e.dir === l.Direction.Center) {
                x = parseInt(Math.abs(x) / 2, 10);
                y = parseInt(Math.abs(y) / 2, 10);
                newLeft = c.left - e.x;
                newTop = c.top - e.y
            } else {
                x *= e.dir.indexOf(l.Direction.Left) >= 0 ? -1 : 1;
                y *= e.dir.indexOf(l.Direction.Top) >= 0 ? -1 : 1;
                newLeft = (c.left + x + newWidth) > c.right ? c.right - newWidth: c.left + x;
                newTop = (c.top + y + newHeight) > c.bottom ? c.bottom - newHeight: c.top + y
            }
            if (b && opt.limitRange) {
                if (newWidth > f.width - obj.offsetLeft) {
                    newWidth = f.width - obj.offsetLeft
                }
                if (newHeight > f.height - obj.offsetTop) {
                    newHeight = f.height - obj.offsetTop
                }
                if (newTop < 0) {
                    newTop = 0
                }
            }
            var j = (ctls.top ? ctls.top.offsetHeight: 0) + (ctls.bottom ? ctls.bottom.offsetHeight: 0) + ctls.body.offsetHeight;
            if (ctls.bottom && newHeight < j) {
                ctls.bottom.style.visibility = 'hidden';
                _.dragScaleHideBottom = true
            } else if (_.dragScaleHideBottom) {
                ctls.bottom.style.visibility = 'visible'
            }
            if (e.dir.indexOf('-') >= 0 || e.dir === l.Direction.Center) {
                $.setStyle(obj, {
                    width: newWidth,
                    height: newHeight
                },
                'px')
            }
            switch (e.dir) {
            case l.Direction.BottomRight:
            case l.Direction.RightBottom:
                break;
            case l.Direction.Right:
                $.setStyle(obj, {
                    width: newWidth,
                    height: c.height
                },
                'px');
                break;
            case l.Direction.Bottom:
                $.setStyle(obj, {
                    width: c.width,
                    height: newHeight
                },
                'px');
                break;
            case l.Direction.Left:
                $.setStyle(obj, {
                    width: newWidth,
                    height: c.height,
                    left: newLeft
                },
                'px');
                break;
            case l.Direction.Top:
                $.setStyle(obj, {
                    width: c.width,
                    height: newHeight,
                    top: newTop
                },
                'px');
                break;
            case l.Direction.TopLeft:
            case l.Direction.LeftTop:
            case l.Direction.Center:
                $.setStyle(obj, {
                    left: newLeft,
                    top: newTop
                },
                'px');
                break;
            case l.Direction.TopRight:
            case l.Direction.RightTop:
                $.setStyle(obj, {
                    top: newTop
                },
                'px');
                break;
            case l.Direction.BottomLeft:
            case l.Direction.LeftBottom:
                $.setStyle(obj, {
                    left: newLeft
                },
                'px');
                break
            }
            d.setBodySize(_, {
                fullScreen: false,
                drag: b
            });
            if (!b && e.dir === l.Direction.Center) {
                d.setPosition(_, e)
            }
            return d
        },
        isAutoSize: function(_) {
            var a = this,
            p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none) {
                return this
            }
            var b = false;
            if (_.isClosed()) {
                return false
            }
            if (opt.width === 'auto') {
                ctls.box.style.width = 'auto';
                ctls.main.style.width = 'auto';
                ctls.body.style.width = 'auto';
                ctls.content.style.width = 'auto';
                b = true
            }
            if (opt.height === 'auto') {
                ctls.box.style.height = 'auto';
                ctls.main.style.height = 'auto';
                ctls.body.style.height = 'auto';
                ctls.content.style.height = 'auto';
                b = true
            }
            return b
        },
        getAutoSize: function(_, a) {
            var b = this,
            p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none) {
                return this
            }
            var c = parseInt($.getElementStyle(ctls.box, 'padding', 0), 10),
            cH = parseInt($.getElementStyle(ctls.main, 'padding', 0), 10),
            s = {
                width: ctls.content.offsetWidth + c * 2 + cH * 2,
                height: ctls.content.offsetHeight + c * 2 + cH * 2
            };
            if (ctls.top) {
                s.height += ctls.top.offsetHeight
            }
            if (ctls.bottom) {
                s.height += ctls.bottom.offsetHeight
            }
            s.height += 20;
            if (a) {
                var d = parseInt('0' + opt.minWidth, 10),
                mh = parseInt('0' + opt.minHeight, 10);
                if (s.width < d) {
                    s.width = d
                }
                if (s.height < mh) {
                    s.height = mh
                }
            }
            return s
        },
        setBodySize: function(_, a) {
            var b = this,
            p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none) {
                return this
            }
            var c = $.extend({
                event: '',
                drag: false
            },
            a);
            var d = ctls.box,
            bs = $.getBodySize();
            if (!d) {
                return this
            }
            var e = d.clientWidth,
            boxHeight = d.clientHeight,
            paddingHeight = parseInt('0' + $.getElementStyle(d, 'padding'), 10),
            conPaddingHeight = parseInt('0' + $.getElementStyle(ctls.content, 'padding'), 10),
            maxSize = Common.getMaxSize(opt),
            margin = Common.getMargin(opt.margin);
            if (!c.drag && _.isNormal() && Common.isPercentSize(opt.width, opt.height)) {
                if ($.isPercent(opt.width)) {
                    e = bs.width * parseInt(opt.width, 10) / 100 - margin.left - margin.right
                }
                if ($.isPercent(opt.height)) {
                    boxHeight = bs.height * parseInt(opt.height, 10) / 100 - margin.top - margin.bottom
                }
                $.setStyle(ctls.box, {
                    width: e,
                    height: boxHeight
                },
                'px')
            }
            if (opt.height !== 'auto') {
                if (!c.fullScreen) {
                    if (Common.isNumberSize(opt.maxHeight)) {
                        var f = parseInt(opt.maxHeight, 10);
                        if (boxHeight > f) {
                            boxHeight = f;
                            d.style.height = boxHeight + 'px'
                        }
                    }
                }
            }
            if (e > bs.width) {
                e = bs.width - 20;
                d.style.width = e + 'px'
            } else if (maxSize.maxWidth && e > maxSize.maxWidth) {
                e = maxSize.maxWidth;
                d.style.width = e + 'px'
            } else if (maxSize.minWidth && e < maxSize.minWidth) {
                e = maxSize.minWidth;
                d.style.width = e + 'px'
            }
            if (boxHeight > bs.height) {
                boxHeight = bs.height - 20;
                d.style.height = boxHeight + 'px'
            } else if (maxSize.maxHeight && boxHeight > maxSize.maxHeight) {
                boxHeight = maxSize.maxHeight;
                d.style.height = boxHeight + 'px'
            } else if (maxSize.minHeight && boxHeight < maxSize.minHeight) {
                boxHeight = maxSize.minHeight;
                d.style.height = boxHeight + 'px'
            }
            e = d.clientWidth;
            boxHeight = d.clientHeight;
            if (c.drag) {
                if ($.isPercent(opt.width)) {
                    opt.width = parseInt(((d.offsetWidth + margin.left + margin.right) * 100 / bs.width), 10) + '%'
                }
                if ($.isPercent(opt.height)) {
                    opt.height = parseInt(((d.offsetHeight + margin.top + margin.bottom) * 100 / bs.height), 10) + '%'
                }
            }
            $.setStyle(ctls.main, {
                height: boxHeight - paddingHeight * 2
            },
            'px');
            var g = ctls.main.offsetHeight,
            titleHeight = ctls.top ? ctls.top.offsetHeight: 0,
            bottomHeight = ctls.bottom ? ctls.bottom.offsetHeight: 0,
            size = {
                width: '100%',
                height: (g - titleHeight - bottomHeight) + 'px'
            };
            if (ctls.bottom) {
                size.marginBottom = ctls.bottom.offsetHeight + 'px'
            }
            if (ctls.iframe) {
                $.setStyle(ctls.iframe, {
                    height: size.height
                })
            }
            return $.setStyle(ctls.body, size),
            this.setTitleSize(_),
            this
        },
        dragToNormal: function(_, a, b, c, d) {
            var e = this,
            p = this.getParam(_),
            opt = p.options,
            ctls = p.controls,
            obj = ctls.box;
            if (p.none) {
                return this
            }
            e.setSize(_, {
                type: l.DialogStatus.Normal
            });
            var f = (a.clientX / b.width),
            offsetX = a.clientX,
            offsetY = a.clientY - d,
            btnPanelWidth = ctls.btnPanel ? ctls.btnPanel.offsetWidth: 0;
            if (f > 0.5) {
                offsetX = a.clientX - obj.offsetWidth + (obj.offsetWidth) * (1 - f) + btnPanelWidth * f
            } else if (offsetX > (obj.offsetWidth) / 2) {
                offsetX = a.clientX - (obj.offsetWidth) / 2
            } else {
                offsetX = a.clientX - c
            }
            e.setPosition(_, {
                position: 'custom',
                event: 'drag',
                x: offsetX,
                y: offsetY
            });
            return this
        },
        dragSize: function(_) {
            var d = this,
            p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none || !opt.sizeAble || !opt.dragSize) {
                return this
            }
            var f = ctls.box,
            docMouseMove = document.onmousemove,
            docMouseUp = document.onmouseup;
            function resizeDialog(a) {
                if (!opt.sizeAble || !opt.dragSize) {
                    return $.cancelBubble(),
                    false
                }
                var b = $.getEvent(),
                moveX = b.clientX,
                moveY = b.clientY,
                moveAble = true;
                var c = {
                    width: f.offsetWidth,
                    height: f.offsetHeight,
                    top: f.offsetTop,
                    left: f.offsetLeft,
                    right: f.offsetWidth + f.offsetLeft,
                    bottom: f.offsetHeight + f.offsetTop,
                    minWidth: parseInt(opt.minWidth, 10),
                    minHeight: parseInt(opt.minHeight, 10)
                };
                document.onmousemove = function() {
                    if (!opt.sizeAble || !opt.dragSize || !moveAble) {
                        return false
                    }
                    p.events.dragingSize = true;
                    var e = $.getEvent(),
                    x = (e.clientX - moveX) * (a.indexOf(l.Direction.Left) >= 0 ? -1 : 1),
                    y = (e.clientY - moveY) * (a.indexOf(l.Direction.Top) >= 0 ? -1 : 1);
                    d.showIframeShade(ctls, true);
                    d.changeSize(_, {
                        dir: a,
                        x: x,
                        y: y
                    },
                    true, c)
                };
                document.onmouseup = function() {
                    if (!opt.sizeAble || !opt.dragSize || !moveAble) {
                        return false
                    }
                    document.onmousemove = docMouseMove;
                    document.onmouseup = docMouseUp;
                    moveAble = false;
                    p.events.dragingSize = false;
                    d.showIframeShade(ctls, false)
                }
            }
            d.getZoomSwicths(_).each(function(i, a) {
                $.addListener(a, 'mousedown',
                function() {
                    _.topMost();
                    resizeDialog(a.pos)
                })
            });
            return this
        },
        showTopBottom: function(_, a, b, c, d) {
            var e = this,
            p = this.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none) {
                return this
            }
            if (_.isClosed()) {
                return e
            }
            if ($.isString(a, true)) {
                c = b;
                b = a;
                a = true
            } else if ($.isBoolean(b)) {
                c = b;
                b = null
            }
            var f = $.isBoolean(a, true),
            has,
            obj,
            h,
            dir;
            if (d === 'top') {
                has = ctls.top && ctls.top.style.display !== 'none';
                obj = ctls.top;
                h = has ? obj.offsetHeight: l.TitleHeight;
                dir = l.Direction.Top
            } else {
                has = ctls.bottom && ctls.bottom.style.display !== 'none';
                obj = ctls.bottom;
                h = has ? obj.offsetHeight: l.BottomHeight;
                dir = l.Direction.Bottom
            }
            h = (obj && f) || (!obj && !f) ? 0 : h;
            if (f) {
                c = c || (b && opt.type !== b);
                if (obj && !c) {
                    obj.style.display = ''
                } else {
                    e.setOptions(_, 'options', d === 'top' ? 'showTitle': 'showBottom', true);
                    if (d === 'top') {
                        e.buildTop(_, ctls.main, c)
                    } else {
                        e.buildBottom(_, ctls.main, c)
                    }
                }
            } else if (obj) {
                obj.style.display = 'none'
            }
            if (h !== 0) {
                e.changeSize(_, {
                    dir: dir,
                    y: f ? h: -h
                })
            }
            return e.setBodySize(_),
            this
        },
        setZindex: function(_, a) {
            var b = this,
            p = Util.getParam(_),
            ctls = p.controls;
            if (p.none || !ctls.box) {
                return this
            }
            if (typeof a !== 'number') {
                a = Common.buildZindex()
            }
            if (ctls.container) {
                ctls.container.style.zIndex = a
            } else {
                ctls.box.style.zIndex = a
            }
            return p.options.zindex = a,
            this
        },
        callback: function(_, a, b, c) {
            var d = this.checkCallback(a);
            if (!d) {
                return this
            }
            var e = {},
            parameter = a.parameter || a.param;
            e[b] = e[b.toLowerCase()] = true;
            e['key'] = b;
            e['value'] = c;
            if ([1, 6].indexOf(c) >= 0) {
                d.ok && d.ok(e, _, parameter)
            } else if ([2, 5, 7].indexOf(c) >= 0) {
                d.cancel && d.cancel(e, _, parameter)
            } else {
                d.callback && d.callback(e, _, parameter)
            }
            return this
        },
        dispose: function(_) {
            return this
        },
        checkCallback: function(a) {
            var b = $.isFunction(a.callback) ? a.callback: undefined,
            ok = $.isFunction(a.ok) ? a.ok: ($.isFunction(a.success) ? a.success: b),
            cancel = $.isFunction(a.cancel) ? a.cancel: b;
            return ok || cancel ? {
                callback: b,
                ok: ok,
                cancel: cancel
            }: undefined
        },
        redirect: function(a) {
            if ($.isString(a, true)) {
                var b = a.toLowerCase();
                if (b.startsWith('http:') || b.startsWith('https:')) {
                    location.href = a.setUrlParam('_t_s_', new Date().getMilliseconds());
                    return true
                }
            }
            return false
        },
        buildTooltip: function(_, a) {
            var b = this,
            p = b.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none || _.isClosed()) {
                return b
            }
            if (!$.isElement(opt.target) && $.isString(opt.target, true)) {
                opt.target = document.getElementById(opt.target)
            }
            if (!$.isElement(opt.target)) {
                return false
            }
            var c = null,
            d = null;
            try {
                c = opt.target.getAttribute('tipid')
            } catch(e) {}
            if (c && (d = Factory.getDialog(c)) !== null) {
                p.controls = b.getParam(d).controls;
                b.updateTooltip(_, opt.content, opt.target, opt)
            } else {
                ctls.box = $.createElement('div');
                ctls.box.className = 'oui-tooltip';
                ctls.box.style.zIndex = opt.zindex;
                ctls.box.id = _.getDialogId();
                ctls.body = b.buildBody(_, ctls.box);
                $.setAttribute(p.target, 'tipid', opt.id);
                document.body.appendChild(ctls.box)
            }
            Factory.setWindowResize();
            return b.setTooltipPosition(_)
        },
        updateTooltip: function(_, a) {
            var b = this,
            p = b.getParam(_),
            opt = p.options,
            ctls = p.controls;
            if (p.none || _.isClosed()) {
                return b
            }
            if (ctls.content) {
                ctls.content.innerHTML = opt.content
            }
            return b.setTooltipPosition(_)
        },
        setTooltipPosition: function(_) {
            var a = this,
            p = a.getParam(_),
            opt = p.options,
            obj = p.controls.box;
            if (p.none || _.isClosed()) {
                return a
            }
            var b = {
                target: opt.target,
                parent: opt.parent,
                position: opt.position,
                x: opt.x || 7,
                y: opt.y || 7
            };
            var c = Common.toCssText(opt.tooltipStyle || opt.tipStyle, 'tooltip');
            if (c) {
                obj.style.cssText = c
            }
            var d = a.setTargetPosition(b, obj);
            obj.className = 'oui-tooltip oui-tip-' + d;
            return a
        }
    };
    Factory.loadCss();
    function Dialog(a, b, c) {
        var d = Common.getDefaultSize(),
        opt = $.extend({
            id: null,
            lang: l.Lang.Chinese,
            type: l.DialogType.Alert,
            status: l.DialogStatus.Normal,
            zindex: Common.buildZindex(),
            minWidth: '240px',
            minHeight: '125px',
            maxWidth: '100%',
            maxHeight: '100%',
            width: d.width + 'px',
            height: d.height + 'px',
            margin: 0,
            parent: null,
            limitRange: true,
            opacity: null,
            lock: true,
            title: null,
            content: null,
            url: null,
            element: null,
            loading: '',
            position: 5,
            x: 0,
            y: 0,
            target: null,
            fixed: false,
            topMost: false,
            closeAble: true,
            clickBgClose: false,
            escClose: false,
            autoClose: false,
            closeTiming: 5000,
            showTimer: false,
            sizeAble: true,
            dragSize: true,
            moveAble: true,
            dragMove: true,
            maxAble: true,
            minAble: true,
            delayClose: false,
            callback: null,
            ok: null,
            cancel: null,
            parameter: null,
            redirect: null,
            buttons: l.DialogButtons.OKCancel,
            buttonPosition: l.Position.Center,
            buttonText: null,
            showTitle: true,
            showLogo: true,
            showMin: true,
            showMax: true,
            showClose: true,
            showBottom: true,
            cancelBubble: false,
            dialogStyle: '',
            mainStyle: '',
            bodyStyle: '',
            contentStyle: '',
            topStyle: '',
            titleStyle: '',
            bottomStyle: '',
            tipStyle: ''
        },
        Common.checkOptions(a, b, c));
        return this.id = opt.id,
        this.initial(opt)
    }
    Dialog.prototype = {
        initial: function(a) {
            var p = Util.getParam(this),
            opt = a || p.options,
            id = opt.id;
            if (!$.isString(opt.title) && !$.isNumber(opt.title)) {
                opt.title = Common.getDialogText('Title', opt.lang)
            }
            if ($.isBoolean(opt.clickBgClose)) {
                opt.clickBgClose = opt.clickBgClose ? 'click': ''
            }
            if (!opt.showTitle && !opt.showBottom && !opt.lock && $.isBoolean(opt.closeAble, true) && opt.type !== l.DialogType.Tooltip) {
                opt.escClose = true;
                opt.clickBgClose = opt.clickBgClose || 'click';
                opt.contentStyle = $.extend({
                    'padding': '1px'
                },
                opt.contentStyle)
            }
            if (opt.lock) {
                opt.fixed = false
            }
            var b = Factory.getDialog(id);
            if (!b) {
                Factory.setDialog(id, this).setOptions(id, opt).setOptions(id, 'dialogId', Common.buildId(id, 'd-'))
            }
            return Util.build(this, opt),
            p.buildTime = new Date().getTime(),
            this
        },
        getOptions: function(a) {
            var b = $.extend({},
            Factory.getOptions(this.id, 'options'));
            return $.isString(a, true) ? b[a] : b
        },
        setOptions: function(a, b) {
            var p = Util.getParam(this).options;
            if (!$.isObject(p)) {
                return this
            }
            if ($.isObject(a)) {
                for (var k in a) {
                    if ($.containsKey(p, k)) {
                        p[k] = a[k]
                    }
                }
            } else if ($.isString(a, true)) {
                if ($.containsKey(p, a)) {
                    p[a] = b
                }
            }
            return this
        },
        getDialogId: function() {
            return Factory.getOptions(this.id, 'dialogId', '')
        },
        getStatus: function() {
            return $.extend({},
            Factory.getOptions(this.id, 'status'))
        },
        isPercent: function() {
            var a = this.getOptions();
            return Common.isPercentSize(a.width, a.height)
        },
        isClosed: function() {
            return $.isBoolean(Factory.getOptions(this.id, 'closed'), true)
        },
        isMaximized: function() {
            return this.getStatus().max
        },
        isMax: function() {
            return this.isMaximized()
        },
        isMinimized: function() {
            return this.getStatus().min
        },
        isMin: function() {
            return this.isMinimized()
        },
        isNormal: function() {
            return this.getStatus().normal
        },
        show: function(a, b, c) {
            if ($.isBoolean(a)) {
                c = a;
                b = undefined;
                a = undefined
            } else if ($.isBoolean(b)) {
                c = b;
                b = undefined
            }
            var _ = this,
            cache = Factory.getOptions(_.id);
            if (!cache) {
                return this
            }
            var d = cache.options,
            ctls = cache.controls,
            display = c ? 'none': '';
            if (c && !d.closeAble) {
                return this
            }
            Util.setOptions(_, 'closed', c || false);
            if (!$.isUndefined(a)) {
                ctls.body.innerHTML = a
            }
            if (!$.isUndefined(b)) {
                ctls.title.innerHTML = b
            }
            if (ctls.container) {
                ctls.container.style.display = display
            } else {
                ctls.box.style.display = display
            }
            if (ctls.shade) {
                ctls.shade.style.display = display
            }
            if (d.lock && !c) {
                Util.hideDocOverflow(_, c)
            }
            return _
        },
        hide: function() {
            return this.show(true)
        },
        close: function(a, b) {
            var _ = this,
            cache = Factory.getOptions(_.id);
            if (_.isClosed() || !cache) {
                return this
            }
            var c = cache.options,
            ctls = cache.controls,
            timers = cache.timers,
            url = c.redirect || c.target;
            if (!$.isString(a)) {
                a = 'None'
            }
            if (!$.isNumber(b)) {
                b = l.DialogResult.None
            }
            if (!c.closeAble || _.closed) {
                return false
            }
            var d = Util.checkCallback(c);
            if (c.delayClose && [1, 6].indexOf(b) >= 0 && d && (d.callback || d.ok)) {
                return Util.callback(_, c, a, b)
            }
            $.removeChild(document.body, ctls.container || ctls.box);
            if (ctls.shade) {
                $.removeChild(document.body, ctls.shade)
            }
            Factory.remove(c.id);
            Util.setOptions(_, 'closed', true).clearTimer(timers).callback(_, c, a, b).hideDocOverflow(_, true).dispose(_).redirect(url);
            return this
        },
        update: function(a, b, c) {
            if ($.isString(c)) {
                if (c === 'autosize') {
                    c = {
                        width: 'auto',
                        height: 'auto'
                    }
                } else if (c === 'autoheight') {
                    c = {
                        height: 'auto'
                    }
                } else if (c === 'autowidth') {
                    c = {
                        width: 'auto'
                    }
                } else {
                    c = {}
                }
            }
            var d = Common.checkOptions(a, b, c);
            var _ = this,
            p = Util.getParam(_),
            ctls = p.controls;
            if (d.type && !d.buttons) {
                d.buttons = Common.getDialogButtons(d.type)
            }
            if ($.extend(p.options, d).type === l.DialogType.Tooltip) {
                Util.updateTooltip(_, d);
                return _
            }
            if (ctls.content) {
                var e = Util.isAutoSize(_);
                if (ctls.title && d.title) {
                    ctls.title.innerHTML = d.title
                }
                Util.buildContent(_).setBodySize(_).setCache(_);
                if (e) {
                    Util.setPosition(_)
                }
            }
            return _
        },
        append: function(a, b, c) {
            var _ = this,
            p = Util.getParam(_),
            ctls = p.controls;
            if (p.none || !ctls.content) {
                return this
            }
            var d = ctls.content.innerHTML;
            return this.update(d + a, b, c)
        },
        insert: function(a, b, c) {
            var _ = this,
            p = Util.getParam(_),
            ctls = p.controls;
            if (p.none || !ctls.content) {
                return _
            }
            var d = ctls.content.innerHTML;
            return _.update(a + d, b, c)
        },
        focus: function(a) {
            var _ = this,
            p = Util.getParam(_),
            buttons = p.buttons;
            if (p.none) {
                return _
            }
            if ($.isElement(a)) {
                return a.focus(),
                _
            } else if (!_.isClosed()) {
                var b = null;
                for (var k in buttons) {
                    b = buttons[k]
                }
                return b && b.focus(),
                _
            }
            return _
        },
        min: function() {
            return Util.setSize(this, {
                type: l.DialogStatus.Min
            })
        },
        max: function() {
            var _ = this,
            p = Util.getParam(_);
            if (p.none) {
                return _
            }
            var a = l.DialogStatus.Max,
            status = p.status,
            lastStatus = p.lastStatus;
            if (p.status.max || (p.status.min && lastStatus === l.DialogStatus.Normal)) {
                a = l.DialogStatus.Normal
            }
            return Util.setSize(_, {
                type: a
            })
        },
        restore: function() {
            return Util.setSize(this, {
                type: l.DialogStatus.Normal
            })
        },
        normal: function() {
            return Util.setSize(this, {
                type: l.DialogStatus.Normal
            })
        },
        resize: function(a) {
            $.extend(a, {
                resizeTo: false
            });
            return Util.changeSize(this, a),
            this
        },
        resizeTo: function(a) {
            $.extend(a, {
                resizeTo: true
            });
            return Util.changeSize(this, a),
            this
        },
        position: function(a) {
            var _ = this,
            p = Util.getParam(_);
            if (_.isClosed() || p.none) {
                return false
            }
            var b = _.options,
            ctls = _.controls;
            return Util.setPosition(_, a),
            this
        },
        move: function(a) {
            return Util.movePosition(this, a, false),
            this
        },
        moveTo: function(a) {
            return Util.movePosition(this, a, true),
            this
        },
        appendChild: function(a, b) {
            return $.appendChild(b || this.getControls().content, a),
            this
        },
        zindex: function(a) {
            if ($.isUndefined(a)) {
                return this.getOptions().zindex
            }
            return Util.setZindex(this, a),
            this
        },
        topMost: function() {
            var _ = this,
            p = Util.getParam(_);
            if (p.none || _.isClosed() || !p.options.topMost) {
                return false
            }
            var d = Factory.getTop();
            if (d && !Util.isSelf(_, d)) {
                var a = d.getOptions().zindex;
                Util.setZindex(d, _.getOptions().zindex);
                return Util.setZindex(_, a)
            }
            return _
        },
        showTitle: function(a, b, c) {
            return Util.showTopBottom(this, a, b, c, 'top')
        },
        showBottom: function(a, b, c) {
            Util.showTopBottom(this, a, b, c, 'bottom');
            return this.position(),
            this
        }
    };
    $.extend({
        DialogType: l.DialogType,
        DialogButtons: l.DialogButtons
    });
    $.extend({
        dialog: function(a, b, c) {
            return Factory.show(a, b, c)
        },
        alert: function(a, b, c) {
            return Factory.show(a, b, c, l.DialogType.Alert)
        },
        confirm: function(a, b, c) {
            return Factory.show(a, b, c, l.DialogType.Confirm)
        },
        message: function(a, b) {
            return Factory.show(a, undefined, b, l.DialogType.Message)
        },
        tips: function(a, b, c) {
            return Factory.show(a, undefined, c, l.DialogType.Tips, b)
        },
        tooltip: function(a, b, c) {
            return Factory.show(a, undefined, c, l.DialogType.Tooltip, b)
        }
    });
    $.extend($.dialog, {
        msg: function(a, b) {
            return Factory.show(a, undefined, b, l.DialogType.Msg)
        },
        win: function(a, b, c) {
            return Factory.show(a, b, c, l.DialogType.Win)
        },
        form: function(a, b, c) {
            return Factory.show(a, b, c, l.DialogType.Form)
        },
        load: function(a, b, c) {
            return Factory.show(a, b, c, l.DialogType.Load)
        },
        iframe: function(a, b, c) {
            return Factory.show(a, b, c, l.DialogType.Iframe)
        },
        url: function(a, b, c) {
            return Factory.show(a, b, c, l.DialogType.Url)
        },
        close: function(a) {
            return Factory.close(a),
            $
        },
        closeAll: function(a) {
            return Factory.closeAll(a),
            $
        }
    });
    $.extend($.tooltip, {
        close: function(a) {
            if ($.isElement(a)) {
                a = a.getAttribute('tipId')
            }
            return Factory.close(a),
            $
        },
        closeAll: function(a) {
            return Factory.closeAll(a || DialogType.Tooltip),
            $
        }
    })
} (OUI);