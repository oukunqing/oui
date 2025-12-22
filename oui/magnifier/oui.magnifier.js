
/*
 @Title: oui.picturebox.js
 @Description：图片放大镜插件
 @Author: oukunqing
 @License：MIT
*/

!function ($) {
    'use strict';

    const Config = {
        FilePath: $.getScriptSelfPath(true),
        FileName: 'oui.magnifier.'
    };

    //先加载样式文件
    $.loadJsScriptCss(Config.FilePath, '', function () { }, Config.FileName);

    const Cache = {
        caches: {},
        timers: {},
        magnifiers: {},
        getCache: function (id) {
            return Cache.caches['mag_' + id];
        },
        setCache: function (id, mag) {
            Cache.caches['mag_' + id] = {
                id: id,
                mag: mag,
            };
            return this;
        },
        magnifier: function (id, mag) {
            if (mag) {
                Cache.magnifiers['mag_' + id] = mag;
                return this;
            } else {
                return Cache.magnifiers['mag_' + id];
            }
        }
    };

    const Factory = {
        loadCss: function (skin, func) {
            $.loadJsScriptCss(Config.FilePath, skin, func, Config.FileName);
            return this;
        },
        buildMagnifier: function (options) {
            var opt = $.extend({}, options);

            var cache = Cache.getCache(opt.id), mag;
            if (cache) {
                mag = cache.mag;
            } else {
                mag = new Magnifier(opt);
                Cache.setCache(opt.id, mag);
            }
            return mag;
        },
        getBigImgUrl: function (url) {
            let arr = url.split('.'),
                ext = $.getExtension(url),
                path = url.substr(0, url.length - ext.length),
                bigUrl = url;

            if (path.endsWith('_thumb') || path.endsWith('_small')) {
                bigUrl = path.substr(0, path.length - 6) + ext;
            }

            return bigUrl;
        },
        getImgSize: function (url) {
            return $.getImgSize(url);
        },
        getPosition: function (ev, opt, bs) {
            let left = ev.clientX,
                top = ev.clientY;

            switch (opt.position) {
                default:
                    if (left + opt.width >= bs.width) {
                        left = ev.clientX - opt.width - 10;
                    }
                    if (top + opt.height >= bs.height) {
                        top = ev.clientY - opt.height - 10;
                    }
                    break;
            }
            return { left: left, top: top };
        },
        showMagnifier: function (ev, that, box, url) {
            let opt = that.options,
                mag = Cache.magnifier(that.id),
                bs = $.getBodySize(),
                rect = box.getBoundingClientRect();

            if (!mag) {
                let radius = $.getParamCon(opt.radius, (opt.width + opt.height) / 4);

                mag = document.createElement('DIV');
                mag.className = 'oui-magnifier';
                mag.innerHTML = '<img class="magnifier-img" src="' + url + '" />';
                mag.style.cssText = [
                    'width:', opt.width, 'px;height:', opt.width, 'px;',
                    'border-radius:', radius, 'px;',
                    $.isNumber(opt.opacity) ? 'opacity:' + opt.opacity + ';' : '',
                    'z-index:', $.isNumber(opt.zindex) ? opt.zindex : 99999, ';'
                ].join('') + opt.cssText;

                document.body.appendChild(mag);
                Cache.magnifier(that.id, mag);

                that.magnifier = mag;
                that.magnifierImg = mag.childNodes[0];

            } else if (that.magnifier.style.display === 'none') {
                that.magnifier.style.display = 'block';
            }

            let elem = that.magnifier,
                img = that.magnifierImg,
                left = ev.clientX,
                top = ev.clientY,
                oldUrl = img.src,
                pos = Factory.getPosition(ev, opt, bs);

            elem.style.left = pos.left + 'px';
            elem.style.top = pos.top + 'px';

            let size = box.getBoundingClientRect(),
                imgPos = {
                    x: ev.clientX - size.left,
                    y: ev.clientY - size.top
                },
                imgSize = Factory.getImgSize(url),
                bigUrl = Factory.getBigImgUrl(url),
                bigSize = Factory.getImgSize(bigUrl),
                widthScale = size.width / imgSize.width,
                heightScale = size.height / imgSize.height,
                bigWidthScale = imgSize.width / bigSize.width / opt.scaleRatio,
                bigHeightScale = imgSize.height / bigSize.height / opt.scaleRatio,
                css = [
                    'left:', -imgPos.x / widthScale / bigWidthScale + opt.width / 2, 'px;',
                    'top:', -imgPos.y / heightScale / bigHeightScale + opt.height / 2, 'px;'
                ];

            if (bigUrl !== oldUrl) {
                img.src = bigUrl;
            }
            if (opt.scaleRatio > 1) {
                css.push('width:', bigSize.width * opt.scaleRatio, 'px;');
            }

            img.style.cssText = css.join('');
        },
        hideMagnifier: function (that) {
            let mag = Cache.magnifier(that.id);
            if (mag) {
                mag.style.display = 'none';
            }
            return this;
        }
    };

    function Magnifier(options) {
        let opt = $.extend({
            width: 150,
            height: 150,
            //radius: 0
            //大图缩放比例，默认为1
            scaleRatio: 1,
            // 指定图片的样式
            imgClass: '',
            // 指定图片的鼠标样式：zoom-in - 放大镜, crosshair - 十字
            // 若为空表示不指定
            cursor: 'zoom-in'
        }, options);

        if (!$.isNumber(opt.scaleRatio) || opt.scaleRatio < 1) {
            opt.scaleRatio = 1;
        }
        if (!$.isString(opt.cursor)) {
            opt.cursor = '';
        }

        this.options = opt;
        this.initial(opt);
    }

    Magnifier.prototype = {
        initial: function (options) {
            let that = this, opt = options, elem = options.target;

            if ($.isElement(elem)) {
                $.addListener(elem, 'pointermove', function (ev) {
                    $.debounce({
                        id: 'oui-magnifier-move', delay: 5, timeout: 2000
                    }, function (e) {
                        let img = ev.target, tag = img.tagName, css = img.className;
                        //if (tag === 'IMG' && css.indexOf('magnifier') < 0) {
                        if (tag === 'IMG') {
                            if (!img.oriCursor) {
                                img.oriCursor = img.style.cursor;
                                img.style.cursor = opt.cursor;
                            }
                            if (!opt.imgClass || css.indexOf(opt.imgClass) > -1) {
                                Factory.showMagnifier(ev, that, img, img.src);
                            }
                        } else {
                            Factory.hideMagnifier(that);
                            if (img.oriCursor) {
                                img.style.cursor = img.oriCursor;
                                delete img.oriCursor;
                            }
                        }
                    });
                });

                $.addListener(elem, 'pointerout', function (ev) {
                    Factory.hideMagnifier(that);
                });
            }

            return that;
        }
    };

    $.extend({
        magnifier: function (options) {
            return Factory.buildMagnifier(options);
        }
    })
}(OUI);