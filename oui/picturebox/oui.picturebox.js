
/*
 @Title: oui.picturebox.js
 @Description：自定义图片框插件
 @Author: oukunqing
 @License：MIT
*/

!function ($) {
    'use strict';

    var Config = {
        FilePath: $.getScriptSelfPath(true),
        FileName: 'oui.picturebox.'
    },
    Factory = {
        loadCss: function (skin, func) {
            $.loadJsScriptCss(Config.FilePath, skin, func, Config.FileName);
            return this;
        },
        getSize: function(boxWidth, boxHeight, width, height, defZoom, minZoom) {
            var w, h, left, top;
            if (width > height) {
                w = width > boxWidth ? boxWidth * defZoom : width;
                h = parseInt(w / width * height, 10);
                if (h > boxHeight * defZoom) {
                    h = boxHeight * defZoom;
                    w = parseInt(h / height * width, 10);
                }
            } else {
                h = height > boxHeight ? boxHeight * defZoom : height;
                w = parseInt(h / height * width, 10);
                if (w > boxWidth * defZoom) {
                    w = boxWidth * defZoom;
                    h = parseInt(w / width * height, 10);
                }
            }

            left = parseInt((boxWidth - w) / 2, 10);
            top = parseInt((boxHeight - h) / 2, 10); 

            var imgRatio = Factory.setRatio(width / height),
                curScale = Factory.setRatio(w / width),
                boxScale = Factory.setRatio(curScale / defZoom),
                minScale = Factory.setRatio(boxScale * minZoom);

            return { 
                width: w, height: h, left: left, top: top, imgRatio: imgRatio,
                curScale: curScale, boxScale: boxScale, minScale: minScale
            };
        },
        showRange: function (p1, p2, div, box) {
            if ($.isNullOrUndefined(div)) {
                div = document.createElement('DIV');
                div.className = 'oui-picbox-range';
                div.style.left = p1.x + 'px';
                div.style.top = p1.y + 'px';
                div.innerHTML = '<div class="oui-picbox-range-panel"></div>';
                box.appendChild(div);
            } else if(p2) {
                div.style.left = (p1.x < p2.x ? p1.x : p2.x) + 'px';
                div.style.top = (p1.y < p2.y ? p1.y : p2.y) + 'px';
                div.style.width = Math.abs(p2.x - p1.x) + 'px';
                div.style.height = Math.abs(p2.y - p1.y) + 'px';
                div.style.display = 'block';
            }
            return div;
        },
        hideRange: function (div) {
            div.style.display = 'none';
            return div;
        },
        checkRange: function (point, cfg) {
            //console.log('checkRange: ', point, cfg.left, cfg.top, cfg.w, cfg.h);
            if (point.x < cfg.left) {
                point.x = cfg.left;
            } else if(point.x > cfg.left + cfg.w) {
                point.x = cfg.left + cfg.w;
            }
            if (point.y < cfg.top) {
                point.y = cfg.top;
            } else if(point.y > cfg.top + cfg.h) {
                point.y = cfg.top + cfg.h;
            }
            return point;
        },        
        setImgSize: function (that) {
            that.img.style.width = that.cfg.w + 'px';
            that.img.style.height = that.cfg.h + 'px';
            that.img.style.left = that.cfg.left + 'px';
            that.img.style.top = that.cfg.top + 'px';

            //图片尺寸是否大于容器框
            var bigImg = that.cfg.width > that.cfg.offset.width || that.cfg.height > that.cfg.offset.height;

            return bigImg;
        },
        getOffsetSize: function(elem) {
            if (elem === null) {
                return { width: 0, height: 0, left: 0, top: 0 };
            }
            var bs = $.getOffsetSize(elem);
            if (!bs.width || !bs.height) {
                bs.width = parseInt('0' + elem.style.width, 10);
                bs.height = parseInt('0' + elem.style.height, 10);
                bs.left = parseInt('0' + elem.style.left, 10);
                bs.top = parseInt('0' + elem.style.top, 10);
            }
            return bs;
        },
        setRatio: function(num, ratio) {
            if (!ratio) {
                ratio = 10000;
            }
            return Math.round(num * ratio) / ratio;
        }
    };

    //先加载样式文件
    Factory.loadCss();

    function PictureBox(options) {
        return this.initial(options);
    }

    PictureBox.prototype = {
        initial: function(options) {
            var that = this,
                opt = $.extend({
                    showBorder: true,
                    showTitle: true,
                    showScale: true,
                    fill: false,
                    margin: 0,
                    fullScreen: true
                }, options),
                update = false;

            if(that.img) {
                that.box.removeChild(that.img);
                $.extend(that.opt, opt);
                update = true;
            } else {
                that.opt = opt;
            }

            var box = $.toElement(that.opt.box || that.opt.obj);
            box.className += ' oui-picbox-box';
            box.style.cssText += 'overflow:hidden;position:relative;' + (!opt.showBorder ? 'border:none;' : '');
            that.box = box;

            if (that.opt.fill) {
                that.resize(null, that.opt.fill, that.opt.margin)
            } else {
                if(that.opt.width) {
                    box.style.width = that.opt.width + 'px';
                }
                if(that.opt.height) {
                    box.style.height = that.opt.height + 'px';
                }
            }

            var img = document.createElement('IMG'),
                picurl = that.opt.img || that.opt.pic;

            if (location.href.indexOf('http') === 0) {
                //设置图片跨域
                //img.setAttribute('crossorigin', 'anonymous');
                img.crossOrigin = 'anonymous';
            }
            img.className = 'oui-picbox-img oui-picbox-unselect';
            img.style.cssText = 'position:absolute;border:none;margin:0;padding:0;';
            img.src = picurl.cleanSlash();
            that.box.appendChild(img);
            that.img = img;

            var minZoom = $.isNumber(that.opt.minScale || that.opt.minZoom) ? (that.opt.minScale || that.opt.minZoom) : 1,
                defZoom = $.isNumber(that.opt.defaultScale || that.opt.defScale || that.opt.defaultZoom || that.opt.defZoom) ? 
                    (that.opt.defaultScale || that.opt.defScale || that.opt.defaultZoom || that.opt.defZoom) : 1,
                maxZoom = $.isNumber(that.opt.maxScale || that.opt.maxZoom) ? (that.opt.maxScale || that.opt.maxZoom) : 1;

            if(minZoom <= 0 || minZoom > 1) {
                minZoom = 1;
            }
            if(defZoom <= 0 || defZoom > 1) {
                defZoom = 1;
            }
            if(maxZoom <= 0 || maxZoom > 5) {
                maxZoom = 1;
            }

            $.addListener(that.img, 'load', function(ev) {
                var bs = Factory.getOffsetSize(that.box),
                    size = Factory.getSize(bs.width, bs.height, img.naturalWidth, img.naturalHeight, defZoom, minZoom);
     
                that.cfg = {
                    filePath: that.img.src,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    imgRatio: size.imgRatio,
                    boxScale: size.boxScale,
                    curScale: size.curScale,
                    minScale: size.minScale,
                    maxScale: maxZoom,
                    minZoom: minZoom,
                    defaultZoom: defZoom,
                    maxZoom: maxZoom,
                    fill: that.opt.fill,
                    margin: that.opt.margin,
                    w: size.width,
                    h: size.height,
                    left: size.left,
                    top: size.top,
                    x: parseInt(size.width / 2 + size.left, 10),
                    y: parseInt(size.height / 2 + size.top, 10),
                    offset: {
                        width: bs.width, height: bs.height,
                        left: bs.left, top: bs.top
                    },
                    showScale: that.opt.showScale,
                    showTitle: that.opt.showTitle
                };

                Factory.setImgSize(that);

                if(!update) {
                    that.select().control();
                }                    
                that.drag().wheelZoom().touchZoom().status().title();
                
                $.getFileSize(that.cfg.filePath, function(size) {
                    var fileSize = size >= 0 ? size : (opt.fileSize || 0);
                    fileSize = fileSize > 0 ? fileSize.toFileSize(2) : '';
                    that.title(null, fileSize);
                });

                if ($.isFunction(that.opt.callback)){
                    that.opt.callback(that, that.cfg);
                }
            });

            $.addListener(window, 'resize', function() {
                //console.log('pic resize:', that.opt.fill, that.opt.margin);
                that.resize(null, that.opt.fill, that.opt.margin);
            });

            if (that.opt.fullScreen) {
                //Full Screen
                $.addKeyListener(document, 'keyup', 'F', function (e, n) {
                    $.fullScreen(that.box);
                }, true);
                //Quan Ping
                $.addKeyListener(document, 'keyup', 'Q', function (e, n) {
                    $.fullScreen(that.box);
                }, true);
            }

            return this;
        },
        update: function (opt) {
            return this.initial(opt);
        },
        control: function () {
            var that = this;

            var titlebar = document.createElement('DIV');
            titlebar.className = 'oui-picbox-title oui-picbox-unselect';
            $.addListener(titlebar, 'dblclick', function() {
                $.cancelBubble();
                that.scale(that.cfg.boxScale).center();
            });
            titlebar.oncontextmenu = function() {
                that.scale(1).center();
                return false;
            };
            that.titlebar = titlebar;
            that.box.appendChild(titlebar);

            var statusbar = document.createElement('DIV');
            statusbar.className = 'oui-picbox-status oui-picbox-unselect';
            $.addListener(statusbar, 'dblclick', function() {
                $.cancelBubble();
                that.center();
            });
            that.statusbar = statusbar;
            that.box.appendChild(statusbar);

            if (!that.cfg.showTitle) {
                statusbar.oncontextmenu = function() {
                    that.scale(1).center();
                    return false;
                };
            }

            return this;
        },
        title: function (title, fileSize) {
            var that = this;
            if (!that.titlebar || !that.cfg.showTitle) {
                return that;
            }
            if ($.isNullOrUndefined(title)) {
                var html = [
                    '&nbsp;',
                    '[', that.cfg.width, '×', that.cfg.height, '] ',
                    (fileSize ? '[' + fileSize + '] ' : ''), 
                    $.getFileName(that.img.src),
                    '&nbsp;',
                    ''
                ];
                that.titlebar.innerHTML = html.join('');
                return that;
            }
            that.titlebar.innerHTML = title || '';

            return this;
        },
        status: function () {
            var that = this;

            if (!that.statusbar || !that.cfg.showScale) {
                return that;
            }
            var ratio = Factory.setRatio(that.cfg.width / that.cfg.w, 100);
            var html = ['1:', ratio];
            if (ratio < 1) {
                ratio = Factory.setRatio(1 / ratio, 100);
                html = [ratio, ':1'];
            }

            that.statusbar.innerHTML = '&nbsp;' + html.join('') + '&nbsp;';

            return this;
        },
        drag: function () {
            var that = this;
            $.addListener(that.img, 'pointerdown', function (ev) {
                if (0 == ev.button) {
                    $.cancelBubble(ev);
                    that.cfg.pointerdown = true;
                    that.img.setPointerCapture(ev.pointerId);
                    that.cfg.lastpointer = $.getEventPos(ev);
                    that.cfg.diffpointer = { x: 0, y: 0 };
                }
            });
            $.addListener(that.img, 'pointermove', function (ev) {
                if (that.cfg.pointerdown) {
                    $.cancelBubble(ev);
                    if (ev.target.className.indexOf('oui-picbox-img') < 0) {
                        return false;
                    }
                    var cur = $.getEventPos(ev);
                    that.cfg.diffpointer.x = cur.x - that.cfg.lastpointer.x;
                    that.cfg.diffpointer.y = cur.y - that.cfg.lastpointer.y;
                    that.cfg.lastpointer = { x: cur.x, y: cur.y };

                    that.cfg.x += that.cfg.diffpointer.x;
                    that.cfg.y += that.cfg.diffpointer.y;

                    var left = that.cfg.x - that.cfg.w / 2,
                        top = that.cfg.y - that.cfg.h / 2;

                    that.img.style.left = left + 'px';
                    that.img.style.top = top + 'px';

                    that.cfg.left = left;
                    that.cfg.top = top;
                }
                ev.preventDefault();
            });
            $.addListener(that.img, 'pointerup', function (ev) {
                if (that.cfg.pointerdown) {
                    $.cancelBubble(ev);
                    that.cfg.pointerdown = false;
                }
            });
            $.addListener(that.img, 'pointerout', function (ev) {
                if (that.cfg.pointerdown) {
                    $.cancelBubble(ev);
                    that.cfg.pointerdown = false;
                }
            });
            $.addListener(that.img, 'pointercancel', function (ev) {
                if (that.cfg.pointerdown) {
                    $.cancelBubble(ev);
                    that.cfg.pointerdown = false;
                }
            });

            return this;
        },
        select: function () {
            var that = this;
            that.box.oncontextmenu = function(ev) {
                //鼠标右键若有拖动动作，或者鼠标位置不在图片范围内，则不显示默认的右键菜单
                if (that.cfg.selectdrag || !that.cfg.selectonpic || ev.target.nodeName !== 'IMG') {
                    return false;
                }
            };
            $.addListener(that.box, 'pointerdown', function (ev) {
                if (2 == ev.button) {
                    $.cancelBubble(ev);
                    var pos = $.getEventPos(ev);
                    that.cfg.selectdown = true;
                    //鼠标右键是否有拖动动作
                    that.cfg.selectdrag = false;
                    that.cfg.startpointer = { x: pos.x - that.cfg.offset.left, y: pos.y - that.cfg.offset.top };
                    that.cfg.selection = Factory.showRange(that.cfg.startpointer, null, that.cfg.selection, that.box);
                    //鼠标位置是否在图片范围内
                    that.cfg.selectonpic = that.onpicture(that.cfg.startpointer, that.cfg);
                }
            });
            $.addListener(that.box, 'pointermove', function (ev) {
                if (that.cfg.selectdown) {
                    $.cancelBubble(ev);
                    var pos = $.getEventPos(ev);
                    that.cfg.endpointer = { x: pos.x - that.cfg.offset.left, y: pos.y - that.cfg.offset.top };
                    that.cfg.selection = Factory.showRange(that.cfg.startpointer, that.cfg.endpointer, that.cfg.selection, that.box);
                }
                ev.preventDefault();
            });
            $.addListener(that.box, 'pointerup', function (ev) {
                if (that.cfg.selectdown) {
                    $.cancelBubble(ev);
                    var pos = $.getEventPos(ev);
                    that.cfg.selectdown = false;
                    that.cfg.endpointer = { x: pos.x - that.cfg.offset.left, y: pos.y - that.cfg.offset.top };

                    that.cfg.startpointer = Factory.checkRange(that.cfg.startpointer, that.cfg);
                    that.cfg.endpointer = Factory.checkRange(that.cfg.endpointer, that.cfg);
                    that.cfg.selection = Factory.hideRange(that.cfg.selection);
                    that.rangeScale(that.cfg.startpointer, that.cfg.endpointer);
                }
            });
            $.addListener(that.box, 'pointercancel', function (ev) {
                if (that.cfg.selectdown) {
                    $.cancelBubble(ev);
                    that.cfg.selection = Factory.hideRange(that.cfg.selection);
                    that.cfg.selectdown = false;
                }
            });

            return this;
        },
        rangeScale: function (p1, p2) {
            var that = this;
            if (p1.x === p2.x && p1.y === p2.y) {
                return that;
            }
            that.cfg.selectdrag = true;

            var w = Math.abs(p1.x - p2.x),
                h = Math.abs(p1.y - p2.y),
                //small = p1.x > p2.x && p1.y > p2.y,
                small = p1.y > p2.y,
                scale = that.cfg.curScale,
                left, top, ratio,
                p0 = {
                    x: p1.x < p2.x ? p1.x : p2.x, 
                    y: p1.y < p2.y ? p1.y : p2.y
                };

            if (small) {
                ratio = 0.5;
            } else if (w >= h ) {
                ratio = Factory.setRatio(that.cfg.offset.width / w);
                if (h * ratio > that.cfg.offset.height) {
                    ratio = Factory.setRatio(that.cfg.offset.height / h);
                }
            } else {
                ratio = Factory.setRatio(that.cfg.offset.height / h);
                if (w * ratio > that.cfg.offset.width) {
                    ratio = Factory.setRatio(that.cfg.offset.width / w);
                }
            }
            scale = ratio * that.cfg.curScale;

            if(scale < that.cfg.minScale) {
                scale = that.cfg.minScale;
            } else if(scale > that.cfg.maxScale) {
                scale = that.cfg.maxScale;
            }
            ratio = scale / that.cfg.curScale;

            left = (that.cfg.left - p0.x) * ratio - (w * ratio - that.cfg.offset.width) / 2;
            top = (that.cfg.top - p0.y) * ratio - (h * ratio - that.cfg.offset.height) / 2;

            that.cfg.left = parseInt(left, 10);
            that.cfg.top = parseInt(top, 10);

            return that.scale(scale);
        },
        scale: function (scaleRatio) {
            var that = this;

            if (scaleRatio < that.cfg.minScale) {
                scaleRatio = that.cfg.minScale;
            } else if(scaleRatio > that.cfg.maxScale) {
                scaleRatio = that.cfg.maxScale;
            }

            that.cfg.curScale = Factory.setRatio(scaleRatio);
            that.cfg.w = parseInt(that.cfg.width * scaleRatio, 10);
            that.cfg.h = parseInt(that.cfg.height * scaleRatio, 10);
            that.cfg.x = that.cfg.left + that.cfg.w / 2;
            that.cfg.y = that.cfg.top + that.cfg.h / 2;

            Factory.setImgSize(that);

            return that.status().move();
        },
        zoom: function (action, ev, zoomratio) {
            var that = this,
                w = parseInt(that.img.style.width, 10),
                h = parseInt(that.img.style.height, 10),
                ratio = $.isNumber(zoomratio) ? zoomratio : 1.1,
                scale = that.cfg.curScale;

            if((!action && scale <= that.cfg.minScale) || (action && scale >= that.cfg.maxScale)) {
                return that;
            }

            if(!action) {
                ratio = 1 / ratio;
            }
            //计算缩放后的比率         
            scale = Factory.setRatio(w * ratio / that.cfg.width);

            if(scale < that.cfg.minScale) {
                scale = that.cfg.minScale;
            } else if(scale > that.cfg.maxScale) {
                scale = that.cfg.maxScale;
            }
            
            w = parseInt(that.cfg.width * scale, 10);
            h = parseInt(that.cfg.height * scale, 10);

            if (ev) {
                var tar = ev.target, pos = $.getEventPos(ev);
                if (tar.className.indexOf('oui-picbox-img') >= 0) {
                    //计算中心点的偏移量
                    //算出百分比：当前宽度减去原来宽度，除以原来宽度，算出尺寸改变的百分比
                    //算出偏移量：当前鼠标坐标减去原来鼠标坐标（再减去图片外框的偏移量）
                    that.cfg.x -= (w - that.cfg.w) * (pos.x - that.cfg.x - that.cfg.offset.left) / that.cfg.w;
                    that.cfg.y -= (h - that.cfg.h) * (pos.y - that.cfg.y - that.cfg.offset.top) / that.cfg.h;
                }
            }
            that.cfg.w = w;
            that.cfg.h = h;
            that.cfg.left = that.cfg.x - w / 2;
            that.cfg.top = that.cfg.y - h / 2;
            that.cfg.curScale = scale;
            
            Factory.setImgSize(that);

            return that.status().move();
        },
        center: function (opt) {
            var that = this;
            if ($.isNullOrUndefined(opt)) {
                opt = {
                    x: parseInt(that.cfg.w / 2, 10) / that.cfg.curScale,
                    y: parseInt(that.cfg.h / 2, 10) / that.cfg.curScale
                };
            }
            var x = that.cfg.curScale * opt.x,
                y = that.cfg.curScale * opt.y,
                w = that.cfg.w,
                h = that.cfg.h,
                targetX = that.cfg.offset.width / 2,
                targetY = that.cfg.offset.height / 2;

            var targetLeft = parseInt(targetX - x, 10),
                targetTop = parseInt(targetY - y, 10);

            that.cfg.left = targetLeft;
            that.cfg.top = targetTop;        
            that.cfg.x = parseInt(targetLeft + w / 2, 10);
            that.cfg.y = parseInt(targetTop + h / 2, 10);

            that.img.style.left = targetLeft + 'px';
            that.img.style.top = targetTop + 'px';

            return that.move();
        },
        move: function () {
            return this;
        },
        outside: function () {
            var that = this;
            //判断是否在左外
            if ((that.cfg.w + that.cfg.left <= 0) ||
                (that.cfg.h + that.cfg.top <= 0) ||
                (that.cfg.left >= that.cfg.offset.width) ||
                (that.cfg.top >= that.cfg.offset.height)) {
                return true;
            }
            return false;
        },
        wheelZoom: function () {
            var that = this;
            $.addListener(that.box, 'wheel', function (ev) {
                $.cancelBubble(ev);
                that.zoom(ev.deltaY < 0, ev);
            });
            $.addListener(that.box, 'dblclick', function (ev) {
                $.cancelBubble(ev);
                if (that.outside()) {
                    that.center();
                }
                ev.preventDefault();
            });
            $.addListener(that.img, 'dblclick', function (ev) {
                $.cancelBubble(ev);
                that.zoom(true, ev, 1.25);
                ev.preventDefault();
            });
            return that;
        },
        touchZoom: function() {
            var that = this;
            /*
            $.addListener(that.img, 'touchstart', function(ev) {
                if (e.touches.length === 2) {
                    var x = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
                    var y = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
                    var startDistance = Math.sqrt(x * x + y * y);
                    that.cfg.startDistance = startDistance
                }
            });

            $.addListener(that.img, 'touchmove', function(ev) {
                if (e.touches.length === 2) {
                    e.preventDefault();
                    var x = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
                    var y = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
                    var currentDistance = Math.sqrt(x * x + y * y),
                        startDistance = that.cfg.startDistance,
                        curScale = that.cfg.curScale,
                        newScale = curScale * (currentDistance / startDistance);

                    //that.img.style.transform = `scale(${newScale})`;

                    that.cfg.curScale = newScale;

                    that.scale(newScale);
                }
            });

            $.addListener(that.img, 'touchend', function(ev) {
                if (e.touches.length === 0) {
                    var x = Math.abs(e.changedTouches[0].clientX - e.changedTouches[1].clientX);
                    var y = Math.abs(e.changedTouches[0].clientY - e.changedTouches[1].clientY);
                    var endDistance = Math.sqrt(x * x + y * y),
                        startDistance = that.cfg.startDistance,
                        curScale = that.cfg.curScale;

                    curScale = curScale * (endDistance / startDistance);

                    that.cfg.curScale = curScale;
                }
            });
            */
            return that;
        },
        resize: function(size, fill, margin) {
            var that = this, bs, ms;
            if (size && (size.width || size.height)) {
                if (size.width) {
                    that.box.style.width = size.width + 'px';
                }
                if (size.height) {
                    that.box.style.height = size.height + 'px';
                }
            } else if (fill) {
                bs = $.getBodySize();
                ms = $.getMarginSize(margin);
                that.box.style.width = bs.width - (ms ? ms.marginWidth : 0) + 'px';
                that.box.style.height = bs.height - (ms ? ms.marginHeight : 0) + 'px';
            }
            if(that.cfg) {
                bs = Factory.getOffsetSize(that.box);
                that.cfg.offset = {
                    width: bs.width, height: bs.height,
                    left: bs.left, top: bs.top
                };
                var size = Factory.getSize(bs.width, bs.height, that.cfg.width, that.cfg.height, that.cfg.defaultZoom, that.cfg.minZoom);
                that.cfg.imgRatio = size.imgRatio;
                that.cfg.boxScale = size.boxScale;
                that.cfg.curScale = size.curScale;
                that.cfg.minScale = size.minScale;
            }            
            return that;
        },
        //判断鼠标位置是否在图片范围内（图片位置不是固定的）
        onpicture: function(p, cfg) {
            return p.x >= cfg.left && p.x <= cfg.left + cfg.w && p.y >= cfg.top && p.y <= cfg.top + cfg.h;
        }
    };

    $.extend({
        picturebox: function(opt, callback) {
            return new PictureBox($.extend(opt, { callback: callback })); 
        },
        picbox: function(opt, callback) {
            return $.picturebox(opt, callback);
        }
    });

}(OUI);