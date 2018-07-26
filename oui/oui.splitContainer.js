
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
            background: '#dbebfe',
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

        op.element.style.cssText += 'position:relative;overflow:hidden;display:block;padding:0px;box-sizing:border-box;';

        $.extend(op, {Panel1 : new Panel(options.panel1 || options.Panel1)} );
        $.extend(op, {Panel2 : new Panel(options.panel2 || options.Panel2)} );
        $.extend(op, {Splitter : new Splitter(options.splitter || options.Splitter)} );

        $.extend(this, op);

        if(op.parent){
            op.parent.setChild(this);
        }
        this.move = $.bindEventListener(this, move);
        this.stop = bind(this, stop);
        this.initial();

        console.log('this: ', this);
    }

    SplitContainer.prototype = {
        initial: function(resize){
            if(resize){
                console.log('resize: ', this.id,  new Date().getTime());
                this.resize();
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
        resize: function(isChild){
            if(!isChild){
                createPanel.call(this, true);
            }

            if(this.Child){
                this.Child.resize();
            }
        },
        setChild: function(obj){
            this.Child = obj;
        }
    };

    var doc = document, isIE = (doc.all) ? true : false;

    var isVertical = function(that) {
        return that.orientation === 'vertical';
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
        //console.log(ele.id, ele.clientWidth, style['width']);
        var width = (style['width']||'').indexOf('%') >= 0 ? ele.clientWidth : parseInt(style['width'], 10), 
            height = (style['height']||'').indexOf('%') >= 0 ? ele.clientHeight : parseInt(style['height'], 10);

            //console.log(ele.id, 'width: ', width, ', height: ', height);
        return {width: width, height: height};
    },
    getPosition = function(ele){
        var left = ele.offsetLeft || 0, top = ele.offsetTop || 0;
        return {left: left, top: top};
    },
    setStyle = function(ele, args){
        for(var k in args){
            if(args[k]){
                var s = args[k].toString();
                ele.style[k] = s + (s.indexOf('%') < 0 && s.indexOf('px') < 0 ? 'px' : '');
            }
        }
    },
    getPercent = function(num, total, noPostfix){
        if($.isNumber(num)){
            num = parseFloat(num, 10);
        }
        return noPostfix ? num.div(total).mul(100).round(2) : '{0:P2}'.format(num.div(total));
    },
    createPanel = function(resize){
        var that = this, size = getSize(that.element), p1Show = !that.Panel1.collapsed, p2Show = !that.Panel2.collapsed, w = 0, h = 0, css = '';
        var vertical = isVertical(this), splitterRate = getPercent(this.Splitter.width, vertical ? size.width : size.height, true);
        var panel1Rate = 0;
        console.log('size: ', size);
        console.log('splitterRate: ', splitterRate, splitterRate*size.height/100);

        if(that.Splitter.distance < 0){
            that.Splitter.distance += size.width;
        }

        if(p1Show){
            if(vertical){
                w = p2Show ? that.Splitter.distance : size.width;
                w = getPercent(w, size.width, true);
                console.log('1: w:', w);
            } else {
                h = p2Show ? that.Splitter.distance : size.height;
                h = getPercent(h, size.height, true);
                console.log('1: h:', h, h*size.height/100);
            }

            panel1Rate = vertical ? w : h;
            //console.log('w1: ', w);
            if(resize){
                that.Panel1.size(vertical ? {width: w + '%', height: '100%'} : {width: '100%', height: h + '%'});
            } else {
                that.Panel1.set($.createElement('div', that.element, function(ele){
                    ele.innerHTML = that.Panel1.content || '';
                    if(vertical){
                        css = 'width:{0};height:{1};float:left;background:{2};overflow:auto;position:relative;'.format(w + '%', '100%', that.Panel1.background);
                    } else {
                        css = 'width:{0};height:{1};background:{2};overflow:auto;position:relative;clear:both;'.format('100%', h + '%', that.Panel1.background);
                    }
                    ele.style.cssText = css;
                }));
            }
        }

        //console.log('size: ', size);
        if(p1Show && p2Show){
                console.log('3: w:', splitterRate);
            if(resize){
                var ss = getSize(this.Panel1.element);
                
                that.Splitter.size(vertical ? {left: getPercent(ss['width'], size.width)} : {top:getPercent(ss['height'], size.height)});

                //console.log('ps: ', this.id, left);
                //that.Splitter.size({height:size.height});
                //console.log('rs: ', this.id, 'that.Splitter.element.style.left:', that.Splitter.element.style.left);
            } else {
                that.Splitter.set($.createElement('div', that.element, function(ele){
                    var cursor = that.Splitter.fixed ? 'default' : vertical ? 'ew-resize' : 'ns-resize';
                    if(vertical){
                        css = 'width:{width}px;height:{1};left:{3};background:{background};cursor:{2};position:absolute;'.format(
                            that.Splitter, '100%', cursor, getPercent(that.Splitter.distance, size.width));
                    } else {
                        css = 'width:{1};height:{width}px;top:{3};background:{background};cursor:{2};'.format(
                            that.Splitter, '100%', cursor, getPercent(that.Splitter.distance, size.height));
                    }
                    ele.style.cssText = css;
                }));
            }
        }

        if(p2Show){
            
            if(vertical){
                w = size.width - (p1Show ? that.Splitter.distance + that.Splitter.width + 0 : 0);
                w = getPercent(w, size.width);

            w = 100 - panel1Rate - splitterRate;
                console.log('2: w:', w);
            } else {
                h = size.height - (p1Show ? that.Splitter.distance + that.Splitter.height + 0 : 0);
                h = getPercent(h, size.height);
            h = 100 - panel1Rate - splitterRate;
                console.log('2: h:', h, h*size.height/100);
            }
            //console.log('w2: ', w);
            if(resize){
                that.Panel2.size(vertical ? {width: w + '%', height: '100%'} : {width: '100%', height: h + '%'});
            } else {
                that.Panel2.set($.createElement('div', that.element, function(ele){
                    ele.innerHTML = that.Panel2.content || '';
                    if(vertical){
                        css = 'width:{0};height:{1};float:right;background:{2};overflow:auto;position:relative;'.format(w + '%', '100%', that.Panel2.background);
                    } else {
                        css = 'width:{0};height:{1};background:{2};overflow:auto;position:relative;clear:both;'.format('100%', h + '%', that.Panel2.background);
                    }
                    ele.style.cssText = css;
                }));
            }
        }


        return that.Splitter.get() && !that.Splitter.fixed;
    },
    start = function (e, isDrag) {
        if (!isDrag) { $.cancelBubble(e); }

        var vertical = isVertical(this), pos = this.Splitter.position(), x = e.clientX - pos.left, y = e.clientY - pos.top;
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

        var vertical = isVertical(this), 
            size = this.size(), 
            start = this.Splitter.start(), 
            sw = this.Splitter.width,
            x = Math.max(e.clientX - start.x, this.Panel1.minSize), 
            y = Math.max(e.clientY - start.y, this.Panel1.minSize);

            x = Math.min(x, size.width - this.Panel2.minSize - sw);
            y = Math.min(y, size.height - this.Panel2.minSize - sw);

            console.log('x: ', x, y);
            /*
        if(vertical){
            this.Splitter.position({left: Math.max(x, 0)});
            this.Panel2.size({width: size.width - x - this.Splitter.width - 2});
            this.Panel1.size({width: x});
        } else {
            this.Splitter.position({top: Math.max(y, 0)});
            this.Panel2.size({height: size.height - y - this.Splitter.height - 2});
            this.Panel1.size({height: y});
        }*/
        console.log(this.id, ':', x, y);
        if(vertical){
            this.Splitter.position({left: Math.max(x, 0)});
            this.Panel2.size({width: getPercent(size.width - x - this.Splitter.width - 0, size.width)});
            this.Panel1.size({width: getPercent(x, size.width)});
        } else {
            this.Splitter.position({top: Math.max(y, 0)});
            this.Panel2.size({height: getPercent(size.height - y - this.Splitter.width - 0, size.height)});
            this.Panel1.size({height: getPercent(y, size.height)});
        }
        this.resize(true);
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