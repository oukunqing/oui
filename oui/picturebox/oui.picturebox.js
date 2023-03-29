
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

    },
    Factory = {
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
        setImgSize: function (_) {
            _.img.style.width = _.cfg.w + 'px';
            _.img.style.height = _.cfg.h + 'px';
            _.img.style.left = _.cfg.left + 'px';
            _.img.style.top = _.cfg.top + 'px';

            //图片尺寸是否大于容器框
            var bigImg = _.cfg.width > _.cfg.offset.width || _.cfg.height > _.cfg.offset.height;

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
            var _ = this,
                opt = options,
                update = false;

            if(_.img) {
                _.box.removeChild(_.img);
                $.extend(_.opt, opt);
                update = true;
            } else {
                _.opt = opt;
            }

            var box = $.toElement(_.opt.box || _.opt.obj);

            if(_.opt.width) {
                box.style.width = _.opt.width + 'px';
            }
            if(_.opt.height) {
                box.style.height = _.opt.height + 'px';
            }

            box.className += ' oui-picbox-box';
            box.style.cssText += 'overflow:hidden;position:relative;';
            _.box = box;

            var img = document.createElement('IMG'),
                picurl = _.opt.img || _.opt.pic;

            if (location.href.indexOf('http') === 0) {
                //设置图片跨域
                //img.setAttribute('crossorigin', 'anonymous');
                img.crossOrigin = 'anonymous';
            }
            img.className = 'oui-picbox-img oui-picbox-unselect';
            img.style.cssText = 'position:absolute;border:none;margin:0;padding:0;';
            img.src = picurl;
            _.box.appendChild(img);
            _.img = img;

            var minZoom = $.isNumber(_.opt.minScale || _.opt.minZoom) ? (_.opt.minScale || _.opt.minZoom) : 1,
                defZoom = $.isNumber(_.opt.defaultScale || _.opt.defScale || _.opt.defaultZoom || _.opt.defZoom) ? 
                    (_.opt.defaultScale || _.opt.defScale || _.opt.defaultZoom || _.opt.defZoom) : 1,
                maxZoom = $.isNumber(_.opt.maxScale || _.opt.maxZoom) ? (_.opt.maxScale || _.opt.maxZoom) : 1;

            if(minZoom <= 0 || minZoom > 1) {
                minZoom = 1;
            }
            if(defZoom <= 0 || defZoom > 1) {
                defZoom = 1;
            }
            if(maxZoom <= 0 || maxZoom > 5) {
                maxZoom = 1;
            }

            $.addListener(_.img, 'load', function(ev) {
                var bs = Factory.getOffsetSize(_.box);
                var size = Factory.getSize(bs.width, bs.height, img.naturalWidth, img.naturalHeight, defZoom, minZoom);
                console.log('size:', size);
                _.cfg = {
                    filePath: _.img.src,
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
                    showScale: $.isBoolean(_.opt.showScale, true),
                    showTitle: $.isBoolean(_.opt.showTitle, false)
                };
                //console.log(_.cfg);

                Factory.setImgSize(_);

                if(!update) {
                    _.select().control();
                }                    
                _.drag().wheelZoom().title().status().title();

                $.getFileSize(_.cfg.filePath, function(size) {
                    var fileSize = size >= 0 ? size.toFileSize(2) : '';
                    _.title(null, fileSize);
                });

                if ($.isFunction(_.opt.callback)){
                    _.opt.callback(_, _.cfg);
                }
            });

            return this;
        },
        update: function (opt) {
            return this.initial(opt);
        },
        control: function () {
            var _ = this;
            var statusbar = document.createElement('DIV');
            statusbar.className = 'oui-picbox-status oui-picbox-unselect';
            $.addListener(statusbar, 'dblclick', function() {
                $.cancelBubble();
                _.center();
            });
            _.statusbar = statusbar;
            _.box.appendChild(statusbar);

            var titlebar = document.createElement('DIV');
            titlebar.className = 'oui-picbox-title oui-picbox-unselect';
            $.addListener(titlebar, 'dblclick', function() {
                $.cancelBubble();
                _.scale(_.cfg.boxScale).center();
            });
            _.titlebar = titlebar;
            _.box.appendChild(titlebar);

            return this;
        },
        title: function (title, fileSize) {
            var _ = this;
            if (!_.titlebar || !_.cfg.showTitle) {
                return _;
            }
            if ($.isNullOrUndefined(title)) {
                var html = [
                    '&nbsp;',
                    '[', _.cfg.width, '×', _.cfg.height, '] ',
                    (fileSize ? '[' + fileSize + '] ' : ''), 
                    $.getFileName(_.img.src),
                    '&nbsp;',
                    ''
                ];
                _.titlebar.innerHTML = html.join('');
                return _;
            }
            _.titlebar.innerHTML = title || '';

            return this;
        },
        status: function () {
            var _ = this;

            if (!_.statusbar || !_.cfg.showScale) {
                return _;
            }
            var ratio = Factory.setRatio(_.cfg.width / _.cfg.w, 100);
            var html = ['1:', ratio];
            if (ratio < 1) {
                ratio = Factory.setRatio(1 / ratio, 100);
                html = [ratio, ':1'];
            }

            _.statusbar.innerHTML = '&nbsp;' + html.join('') + '&nbsp;';

            return this;
        },
        drag: function () {
            var _ = this,
                ie = $.browser.isIE();
            $.addListener(_.img, ie ? 'mousedown' : 'pointerdown', function (ev) {
                if (0 == ev.button) {
                    console.log('map pointerdown', ev);
                    $.cancelBubble(ev);
                    _.cfg.pointerdown = true;
                    _.img.setPointerCapture(ev.pointerId);
                    _.cfg.lastpointer = $.getEventPos(ev);
                    _.cfg.diffpointer = { x: 0, y: 0 };
                    console.log('down:', _.cfg.x, _.cfg.y);
                }
            });
            $.addListener(_.img, ie ? 'mousemove' : 'pointermove', function (ev) {
                if (_.cfg.pointerdown) {
                    $.cancelBubble(ev);
                    if (ev.target.className.indexOf('oui-picbox-img') < 0) {
                        return false;
                    }
                    var cur = $.getEventPos(ev);
                    _.cfg.diffpointer.x = cur.x - _.cfg.lastpointer.x;
                    _.cfg.diffpointer.y = cur.y - _.cfg.lastpointer.y;
                    _.cfg.lastpointer = { x: cur.x, y: cur.y };

                    _.cfg.x += _.cfg.diffpointer.x;
                    _.cfg.y += _.cfg.diffpointer.y;

                    var left = _.cfg.x - _.cfg.w / 2,
                        top = _.cfg.y - _.cfg.h / 2;

                    _.img.style.left = left + 'px';
                    _.img.style.top = top + 'px';

                    _.cfg.left = left;
                    _.cfg.top = top;
                }
                ev.preventDefault();
            });
            $.addListener(_.img, ie ? 'mouseup' : 'pointerup', function (ev) {
                if (_.cfg.pointerdown) {
                    $.cancelBubble(ev);
                    _.cfg.pointerdown = false;
                }
            });
            $.addListener(_.img, 'pointerout', function (ev) {
                if (_.cfg.pointerdown) {
                    $.cancelBubble(ev);
                    _.cfg.pointerdown = false;
                }
            });
            $.addListener(_.img, 'pointercancel', function (ev) {
                if (_.cfg.pointerdown) {
                    $.cancelBubble(ev);
                    _.cfg.pointerdown = false;
                }
            });

            return this;
        },
        select: function () {
            var _ = this,
                ie = $.browser.isIE();
            _.box.oncontextmenu = function() {
                //鼠标右键若有拖动动作，或者鼠标位置不在图片范围内，则不显示默认的右键菜单
                if (_.cfg.selectdrag || !_.cfg.selectonpic) {
                    return false;
                }
            };
            $.addListener(_.box, ie ? 'mousedown' : 'pointerdown', function (ev) {
                if (2 == ev.button) {
                    $.cancelBubble(ev);
                    var pos = $.getEventPos(ev);
                    _.cfg.selectdown = true;
                    //鼠标右键是否有拖动动作
                    _.cfg.selectdrag = false;
                    _.cfg.startpointer = { x: pos.x - _.cfg.offset.left, y: pos.y - _.cfg.offset.top };
                    _.cfg.selection = Factory.showRange(_.cfg.startpointer, null, _.cfg.selection, _.box);
                    //鼠标位置是否在图片范围内
                    _.cfg.selectonpic = _.onpicture(_.cfg.startpointer, _.cfg);
                }
            });
            $.addListener(_.box, ie ? 'mousemove' : 'pointermove', function (ev) {
                if (_.cfg.selectdown) {
                    $.cancelBubble(ev);
                    var pos = $.getEventPos(ev);
                    _.cfg.endpointer = { x: pos.x - _.cfg.offset.left, y: pos.y - _.cfg.offset.top };
                    _.cfg.selection = Factory.showRange(_.cfg.startpointer, _.cfg.endpointer, _.cfg.selection, _.box);
                }
                ev.preventDefault();
            });
            $.addListener(_.box, ie ? 'mouseup' : 'pointerup', function (ev) {
                if (_.cfg.selectdown) {
                    $.cancelBubble(ev);
                    var pos = $.getEventPos(ev);
                    _.cfg.selectdown = false;
                    _.cfg.endpointer = { x: pos.x - _.cfg.offset.left, y: pos.y - _.cfg.offset.top };

                    _.cfg.startpointer = Factory.checkRange(_.cfg.startpointer, _.cfg);
                    _.cfg.endpointer = Factory.checkRange(_.cfg.endpointer, _.cfg);
                    _.cfg.selection = Factory.hideRange(_.cfg.selection);
                    _.rangeScale(_.cfg.startpointer, _.cfg.endpointer);
                }
            });
            $.addListener(_.box, 'pointercancel', function (ev) {
                if (_.cfg.selectdown) {
                    $.cancelBubble(ev);
                    _.cfg.selection = Factory.hideRange(_.cfg.selection);
                    _.cfg.selectdown = false;
                }
            });

            return this;
        },
        rangeScale: function (p1, p2) {
            var _ = this;
            if (p1.x === p2.x && p1.y === p2.y) {
                return _;
            }
            _.cfg.selectdrag = true;

            var w = Math.abs(p1.x - p2.x),
                h = Math.abs(p1.y - p2.y),
                small = p1.x > p2.x && p1.y > p2.y,
                scale = _.cfg.curScale,
                left, top, ratio,
                p0 = { 
                    x: p1.x < p2.x ? p1.x : p2.x, 
                    y: p1.y < p2.y ? p1.y : p2.y
                };

            if (small) {
                ratio = 0.5;
            } else if (w >= h ) {
                ratio = Factory.setRatio(_.cfg.offset.width / w);
                if (h * ratio > _.cfg.offset.height) {
                    ratio = Factory.setRatio(_.cfg.offset.height / h);
                }
            } else {
                ratio = Factory.setRatio(_.cfg.offset.height / h);
                if (w * ratio > _.cfg.offset.width) {
                    ratio = Factory.setRatio(_.cfg.offset.width / w);
                }
            }
            scale = ratio * _.cfg.curScale;

            if(scale < _.cfg.minScale) {
                scale = _.cfg.minScale;
            } else if(scale > _.cfg.maxScale) {
                scale = _.cfg.maxScale;
            }
            ratio = scale / _.cfg.curScale;

            left = (_.cfg.left - p0.x) * ratio - (w * ratio - _.cfg.offset.width) / 2;
            top = (_.cfg.top - p0.y) * ratio - (h * ratio - _.cfg.offset.height) / 2;

            _.cfg.left = parseInt(left, 10);
            _.cfg.top = parseInt(top, 10);

            return _.scale(scale);
        },
        scale: function (scaleRatio) {
            var _ = this;

            if (scaleRatio < _.cfg.minScale) {
                scaleRatio = _.cfg.minScale;
            } else if(scaleRatio > _.cfg.maxScale) {
                scaleRatio = _.cfg.maxScale;
            }

            _.cfg.curScale = Factory.setRatio(scaleRatio);
            _.cfg.w = parseInt(_.cfg.width * scaleRatio, 10);
            _.cfg.h = parseInt(_.cfg.height * scaleRatio, 10);
            _.cfg.x = _.cfg.left + _.cfg.w / 2;
            _.cfg.y = _.cfg.top + _.cfg.h / 2;

            Factory.setImgSize(_);

            return this.status().move();
        },
        zoom: function (action, ev, zoomratio) {
            var _ = this,
                pos = $.getEventPosition(ev),
                w = parseInt(_.img.style.width, 10),
                h = parseInt(_.img.style.height, 10),
                left = parseInt(_.img.style.left, 10),
                top = parseInt(_.img.style.top, 10),
                ratio = $.isNumber(zoomratio) ? zoomratio : 1.1,
                scale = _.cfg.curScale;

            if((!action && scale <= _.cfg.minScale) || (action && scale >= _.cfg.maxScale)) {
                return this;
            }

            if(!action) {
                ratio = 1 / ratio;
            }
            //计算缩放后的比率         
            scale = Factory.setRatio(w * ratio / _.cfg.width);

            if(scale < _.cfg.minScale) {
                scale = _.cfg.minScale;
            } else if(scale > _.cfg.maxScale) {
                scale = _.cfg.maxScale;
            }

            w = parseInt(_.cfg.width * scale, 10);
            h = parseInt(_.cfg.height * scale, 10);

            if (ev) {
                var tar = ev.target, pos = $.getEventPos(ev);
                if (tar.className.indexOf('oui-picbox-img') >= 0) {
                    //计算中心点的偏移量
                    //鼠标当前位置要减去图片外框的偏移量
                    _.cfg.x -= parseInt((ratio - 1) * (pos.x - _.cfg.x - _.cfg.offset.left), 10);
                    _.cfg.y -= parseInt((ratio - 1) * (pos.y - _.cfg.y - _.cfg.offset.top), 10);
                }
            }
            left = parseInt(_.cfg.x - w / 2, 10);
            top = parseInt(_.cfg.y - h / 2, 10);
            
            _.cfg.w = w;
            _.cfg.h = h;
            _.cfg.left = left;
            _.cfg.top = top;
            _.cfg.curScale = scale;
            
            Factory.setImgSize(_);

            return this.status().move();
        },
        center: function (opt) {
            var _ = this;
            if ($.isNullOrUndefined(opt)) {
                opt = {
                    x: parseInt(_.cfg.w / 2, 10) / _.cfg.curScale,
                    y: parseInt(_.cfg.h / 2, 10) / _.cfg.curScale
                };
                console.log('opt:', opt);
            }
            var x = _.cfg.curScale * opt.x,
                y = _.cfg.curScale * opt.y,
                w = _.cfg.w,
                h = _.cfg.h,
                targetX = _.cfg.offset.width / 2,
                targetY = _.cfg.offset.height / 2;

            var targetLeft = parseInt(targetX - x, 10),
                targetTop = parseInt(targetY - y, 10);

            _.cfg.left = targetLeft;
            _.cfg.top = targetTop;        
            _.cfg.x = parseInt(targetLeft + w / 2, 10);
            _.cfg.y = parseInt(targetTop + h / 2, 10);

            _.img.style.left = targetLeft + 'px';
            _.img.style.top = targetTop + 'px';

            return this.move();
        },
        move: function () {
            return this;
        },
        outside: function () {
            var _ = this;
            //判断是否在左外
            if ((_.cfg.w + _.cfg.left <= 0) ||
                (_.cfg.h + _.cfg.top <= 0) ||
                (_.cfg.left >= _.cfg.offset.width) ||
                (_.cfg.top >= _.cfg.offset.height)) {
                return true;
            }
            return false;
        },
        wheelZoom: function () {
            var _ = this;
            $.addListener(_.box, 'wheel', function (ev) {
                $.cancelBubble(ev);
                _.zoom(ev.deltaY < 0, ev);
            });
            $.addListener(_.box, 'dblclick', function (ev) {
                $.cancelBubble(ev);
                if (_.outside()) {
                    _.center();
                }
                ev.preventDefault();
            });
            $.addListener(_.img, 'dblclick', function (ev) {
                $.cancelBubble(ev);
                _.zoom(true, ev, 1.25);
                ev.preventDefault();
            });
            return this;
        },
        resize: function(size) {
            var _ = this;
            _.box.style.width = size.width + 'px';
            _.box.style.height = size.height + 'px';

            if(_.cfg) {
                var bs = Factory.getOffsetSize(_.box);
                _.cfg.offset = {
                    width: bs.width, height: bs.height,
                    left: bs.left, top: bs.top
                };
                var size = Factory.getSize(bs.width, bs.height, _.cfg.width, _.cfg.height, _.cfg.defaultZoom, _.cfg.minZoom);
                _.cfg.imgRatio = size.imgRatio;
                _.cfg.boxScale = size.boxScale;
                _.cfg.curScale = size.curScale;
                _.cfg.minScale = size.minScale;
            }
            return this;
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