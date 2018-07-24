
!function($) {
    'use strict';

    function Panel(options){
        var op = $.extend({
            background: '#fff',
            fixed: false,
            collapsed: false,
            minSize: 0,
            element: null,
            content: '',
            width: 0,
            height: 0,
            x: 0,
            y: 0
        }, options || {});

        $.extend(this, op);
    }

    Panel.prototype = {
        get: function(){
            return this.element;
        },
        set: function(ele, args){
            return this.element = ele, this;
        },
        size: function(args) {
            if($.isUndefined(args)){
                return getSize(this.element);
            } else {
                $.extend(this, args);
                return setStyle(this.element, args), this;
            }
        },
        position: function(args){
            if($.isUndefined(args)){
                return getPosition(this.element);
            } else {
                return setStyle(this.element, args), this;
            }
        },
        start: function(args){
            if($.isUndefined(args)){
                return {x: this.x, y: this.y};
            } else {
                return $.extend(this, args), this;
            }
        }
    };

    function Splitter(options){
        var op = $.extend({
            width: 4,
            background: '#f00',
            distance: 400,
            fixed: false,
            element: null,
            x: 0,
            y: 0
        }, options || {});

        $.extend(this, op);
    }
    Splitter.prototype = new Panel();


    function SplitContainer (options){
        console.log('options: ', options);
        var op = $.extend({
            id: 0,
            element: null,
            orientation: 'vertical',    // vertical, horizontal
            Splitter: null,
            Panel1: null,
            Panel2: null,
            Child: null
        }, options || {});

        op.element = op.parent || op.element;
        op.element.style.cssText += 'position:relative;overflow:hidden;display:block;padding:0px;box-sizing:border-box;';

        $.extend(op, {Panel1 : new Panel(options.panel1 || options.Panel1)} );
        $.extend(op, {Panel2 : new Panel(options.panel2 || options.Panel2)} );
        $.extend(op, {Splitter : new Splitter(options.splitter || options.Splitter)} );

        $.extend(this, op);

        this.move = $.bindEventListener(this, move);
        this.stop = bind(this, stop);
        this.initial();

        console.log('this: ', this);
    }

    SplitContainer.prototype = {
        initial: function(resize){
            if(resize){
                console.log('resize: ', this.id,  new Date().getTime());
            } else if(createPanel.apply(this)){
                $.addEventListener(this.Splitter.element, 'mousedown', $.bindEventListener(this, start, true));
            }
        },
        size: function(args) {
            if($.isUndefined(args)){
                console.log('borderWidth: ', $.getElementStyle(this.element, 'borderWidth'))
                return getSize(this.element);
            } else {
                return setStyle(this.element, args), this;
            }
        },
        resize: function(){
                createPanel.call(this, true);

                if(this.Child){
                    this.Child.resize();
                }
        },
        setChild: function(obj){
            this.Child = obj;
        }
    };

    var doc = document, isIE = (doc.all) ? true : false;

    var isVertical = function() {
        return this.orientation === 'vertical';
    },
    bind = function (obj, func, args) {
        if (!$.isObject(obj) || !$.isFunction(func)) {
            return false;
        }
        return function () {
            return func.apply(obj, args || []);
        };
    },
    getSize = function(ele){
        var style = $.getElementStyle(ele);
        var width = (style['width']||'').indexOf('%') >= 0 ? ele.clientWidth : parseInt(style['width'], 10), 
            height = (style['height']||'').indexOf('%') >= 0 ? ele.clientHeight : parseInt(style['height'], 10);

            console.log('width: ', width, ', height: ', height);
        return {width: width, height: height};
    },
    getPosition = function(ele){
        var left = ele.offsetLeft || 0, top = ele.offsetTop || 0;
        return {left: left, top: top};
    },
    setStyle = function(ele, args){
        for(var k in args){
            ele.style[k] = args[k] + 'px';
        }
    },
    createPanel = function(resize){
        var that = this, size = getSize(that.element), p1Show = !that.Panel1.collapsed, p2Show = !that.Panel2.collapsed, w = 0, css = '';

        if(that.Splitter.distance < 0){
            that.Splitter.distance += size.width;
        }
        console.log('size: ', size);
        if(p1Show){
            w = p2Show ? that.Splitter.distance : size.width;
            if(resize){
                that.Panel1.size({width: w, height: size.height});
            } else {
                that.Panel1.set($.createElement('div', that.element, function(ele){
                    ele.innerHTML = that.Panel1.content || '';
                    css = 'width:{0}px;height:{1}px;float:left;background:{2};overflow:auto;position:relative;'.format(w, size.height, that.Panel1.background);
                    ele.style.cssText = css;
                }));
            }
        }

        if(p1Show && p2Show){
            if(resize){
                that.Splitter.size({height:size.height});
            } else {
                that.Splitter.set($.createElement('div', that.element, function(ele){
                    var cursor = that.Splitter.fixed ? 'default' : 'ew-resize';
                    css = 'width:{width}px;height:{1}px;left:{distance}px;background:{background};cursor:{2};position:absolute;'.format(
                        that.Splitter, size.height, cursor);
                    ele.style.cssText = css;
                }));
            }
        }

        if(p2Show){
            w = size.width - (p1Show ? that.Splitter.distance + that.Splitter.width + 2 : 0);
            if(resize){
                that.Panel2.size({width: w, height: size.height});
            } else {
                that.Panel2.set($.createElement('div', that.element, function(ele){
                    ele.innerHTML = that.Panel2.content || '';
                    css = 'width:{0}px;height:{1}px;float:right;background:{2};overflow:auto;position:relative;'.format(w, size.height, that.Panel2.background);
                    ele.style.cssText = css;
                }));
            }
        }
        return that.Splitter.get() && !that.Splitter.fixed;
    },
    start = function (e, isDrag) {
        if (!isDrag) { $.cancelBubble(e); }

        var vertical = isVertical.call(this), pos = this.Splitter.position(), x = e.clientX - pos.left, y = e.clientY - pos.top;
        this.Splitter.start({x: x, y: y});
        /*
        if (isIE) {
            $.addEventListener(this.Splitter.element, "losecapture", this.stop);
            this.Splitter.element.setCapture();
        }
        else {
            e.preventDefault();
            $.addEventListener(window, "blur", this.stop);
        }
        */
        $.addEventListener(doc, 'mousemove', this.move)
        $.addEventListener(doc, 'mouseup', this.stop)
    },
    move= function (e) {
        window.getSelection ? window.getSelection().removeAllRanges() : doc.selection.empty();

        var vertical = isVertical.call(this), 
            size = this.size(), 
            start = this.Splitter.start(), 
            sw = this.Splitter.width,
            x = Math.max(e.clientX - start.x, this.Panel1.minSize), 
            y = Math.max(e.clientY - start.y, this.Panel1.minSize);

            x = Math.min(x, size.width - this.Panel2.minSize - sw);
            y = Math.min(y, size.height - this.Panel2.minSize - sw);

            console.log('x: ', x);

        if(vertical){
            this.Splitter.position({left: Math.max(x, 0)});
            this.Panel2.size({width: size.width - x - this.Splitter.width - 2});
            this.Panel1.size({width: x});
        } else {
            this.Splitter.position({top: Math.max(y, 0)});
            this.Panel2.size({height: size.height - y - this.Splitter.height - 2});
            this.Panel1.size({height: y});
        }
    },
    stop= function(){
        console.log('stop:stop:')
        $.removeEventListener(doc, 'mousemove', this.move);
        $.removeEventListener(doc, 'mouseup', this.stop);
        if (false) {
            $.removeEventListener(this.Splitter.get(), "losecapture", this.stop);
            this.Splitter.get().releaseCapture();
        }
        else {
            $.removeEventListener(window, "blur", this.stop);
        };
    };

    $.SplitContainer = SplitContainer;
}(OUI);