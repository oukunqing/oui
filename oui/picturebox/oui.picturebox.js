
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
        getSize: function(boxWidth, boxHeight, width, height) {
            var w, h, left, top;
            if (width > height) {
                w = width > boxWidth ? boxWidth : width;
                h = parseInt(w / width * height, 10);
            } else {
                h = height > boxHeight ? boxHeight : height;
                w = parseInt(h / height * width, 10);
            }

            left = parseInt((boxWidth - w) / 2, 10);
            top = parseInt((boxHeight - h) / 2, 10); 

            return { width: w, height: h, left: left, top: top };
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
                box = $.toElement(opt.box || opt.obj);

            if(opt.width) {
                box.style.width = opt.width + 'px';
            }
            if(opt.height) {
                box.style.height = opt.height + 'px';
            }

            box.className += 'oui-picbox-box';

            var img = document.createElement('IMG');
            img.className = 'oui-picbox-img oui-picbox-unselect';
            img.src = opt.img || opt.pic;
            box.appendChild(img);

            var bs = $.getOffsetSize(box);

            _.img = img;
            _.box = box;

            $.addListener(img, 'load', function(ev) {
                var size = Factory.getSize(bs.width, bs.height, img.naturalWidth, img.naturalHeight);
                _.cfg = {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    w: size.width,
                    h: size.height,
                    left: size.left,
                    top: size.top,
                    x: parseInt(size.width / 2 + size.left, 10),
                    y: parseInt(size.height / 2 + size.top, 10),
                    offset: {
                        width: bs.width, height: bs.height,
                        left: bs.left, top: bs.top
                    }
                };

                console.log(_.cfg);

                _.img.style.width = _.cfg.w + 'px';
                _.img.style.height = _.cfg.h + 'px';
                _.img.style.left = _.cfg.left + 'px';
                _.img.style.top = _.cfg.top + 'px';

                _.drag().wheelZoom();

                if($.isFunction(opt.callback)){
                    opt.callback(_.cfg);
                }
            });

            return this;
        },
        resize: function (size) {
            if($.isElement(this.box)) {
                this.box.style.width = (size.width || size.w) + 'px';
                this.box.style.height = (size.height || size.h) + 'px';
            }
            return this;
        },
        drag: function () {
            var _ = this;
            console.log('drag');
            $.addListener(_.img, 'pointerdown', function (ev) {
                console.log('pointerdown');
                _.cfg.pointerdown = true;
                _.img.setPointerCapture(ev.pointerId);
                _.cfg.lastpointer = { x: ev.clientX, y: ev.clientY };
                _.cfg.diffpointer = { x: 0, y: 0 };

                console.log('down:', _.cfg.x, _.cfg.y);
            });
            $.addListener(_.img, 'pointermove', function (ev) {
                if (ev.target.className.indexOf('oui-picbox-img') < 0) {
                    return false;
                }
                if (_.cfg.pointerdown) {
                    var cur = { x: ev.clientX, y: ev.clientY };
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
            $.addListener(_.img, 'pointerup', function (ev) {
                if (ev.target.className.indexOf('oui-picbox-img') < 0) {
                    return false;
                }
                if (_.cfg.pointerdown) {
                    _.cfg.pointerdown = false;
                }
            });
            $.addListener(_.img, 'pointercancel', function (ev) {                
                if (ev.target.className.indexOf('oui-picbox-img') < 0) {
                    return false;
                }
                if (_.cfg.pointerdown) {
                    _.cfg.pointerdown = false;
                }
            });

            return this;
        },
        zoom: function (action, ev) {
            var _ = this;
            var pos = $.getEventPosition(ev);
            var w = parseInt(_.img.style.width, 10),
                h = parseInt(_.img.style.height, 10),
                left = parseInt(_.img.style.left, 10),
                top = parseInt(_.img.style.top, 10),
                ratio = 1.1,
                scale = parseInt(w * 100 / _.cfg.width, 10);

            if (!action) {
                ratio = 1 / 1.1;
                if (w < _.cfg.offset.width / 4) {
                    return false;
                }
            }else if (scale > 100) {
                scale = 100;
                return false;
            }

            w *= ratio;
            h = w / _.cfg.width * _.cfg.height;

            if (ev) {
                var tar = ev.target;
                if (tar.className.indexOf('oui-picbox-img') >= 0) {
                    //计算中心点的偏移量
                    //鼠标当前位置要减去图片外框的偏移量
                    _.cfg.x -= (ratio - 1) * (ev.clientX - _.cfg.x - _.cfg.offset.left);
                    _.cfg.y -= (ratio - 1) * (ev.clientY - _.cfg.y - _.cfg.offset.top);
                }
            }
            scale = w / _.cfg.width;

            left = parseInt(_.cfg.x - w / 2, 10);
            top = parseInt(_.cfg.y - h / 2, 10);
            
            _.cfg.w = w;
            _.cfg.h = h;
            _.cfg.left = left;
            _.cfg.top = top;
            _.cfg.scale = scale;
            
            _.img.style.width = w + 'px';
            _.img.style.height = h + 'px';

            _.img.style.left = left + 'px';
            _.img.style.top = top + 'px';

            console.log('zoom: ', _.cfg);

            return this;
        },
        center: function (opt) {
            var _ = this;
            if ($.isNullOrUndefined(opt)) {
                opt = {
                    x: parseInt(_.cfg.w / 2, 10) / _.cfg.scale,
                    y: parseInt(_.cfg.h / 2, 10) / _.cfg.scale
                };
                console.log('opt:', opt);
            }
            var x = _.cfg.scale * opt.x,
                y = _.cfg.scale * opt.y,
                w = _.cfg.w,
                h = _.cfg.h,
                targetX = _.cfg.offset.width / 2,
                targetY = _.cfg.offset.height / 2;

            var targetLeft = targetX - x,
                targetTop = targetY - y;

            _.cfg.left = targetLeft;
            _.cfg.top = targetTop;            
            _.cfg.x = targetLeft + w / 2;
            _.cfg.y = targetTop + h / 2;

            _.img.style.left = targetLeft + 'px';
            _.img.style.top = targetTop + 'px';

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
                _.zoom(ev.deltaY < 0, ev);
            });
            $.addListener(_.box, 'dblclick', function (ev) {
                if (_.outside()) {
                    _.center();
                }
                ev.preventDefault();
            });
            $.addListener(_.img, 'dblclick', function (ev) {
                _.zoom(true, ev);
                ev.preventDefault();
            });
            return this;
        },
        resize: function(size) {
            var _ = this;
            _.box.style.width = size.width + 'px';
            _.box.style.heigth = size.height + 'px';

            return this;
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

    $.extend($.picturebox, {

    });


}(OUI);