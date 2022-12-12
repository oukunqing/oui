
/*
 @Title: oui.omap.js
 @Description：自定义图片地图插件
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
        getSize: function(boxWidth, boxHeight, width, height, zoom) {
            var w, h, left, top;
            if (width > height) {
                w = width > boxWidth ? boxWidth * zoom : width;
                h = parseInt(w / width * height, 10);
            } else {
                h = height > boxHeight ? boxHeight * zoom : height;
                w = parseInt(h / height * width, 10);
            }

            left = parseInt((boxWidth - w) / 2, 10);
            top = parseInt((boxHeight - h) / 2, 10); 

            return { width: w, height: h, left: left, top: top };
        },
        checkIds: function (ids) {
            if (typeof ids === 'undefined' || ids === null) {
                return [];
            } else if ($.isArray(ids)) {
                return ids;
            } else if (typeof ids === 'number') {
                return [ids];
            } else if (typeof ids === 'string') {
                if (ids.indexOf(',') >= 0) {
                    return ids.split(',');
                } else if (ids.indexOf('|') >= 0) {
                    return ids.split('|');
                }
                return [ids];
            }
            return [];
        },
    };

    Config.FileDir = $.getFilePath(Config.FilePath);

    //先加载样式文件
    Factory.loadCss();

    function Map(options) {
        return this.initial(options);
    }

    Map.prototype = {
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

            box.className += ' oui-omap-box';
            box.style.cssText += 'overflow:hidden;position:relative;';

            var img = document.createElement('IMG');
            img.className = 'oui-omap-img oui-omap-map oui-omap-unselect';
            img.style.cssText = 'position:absolute;margin:0;padding:0;';
            img.src = opt.img || opt.pic;
            box.appendChild(img);

            var bs = $.getOffsetSize(box);

            _.opt = opt;
            _.img = img;
            _.box = box;
            _.markers = {};

            var minZoom = typeof _.opt.minZoom === 'number' ? _.opt.minZoom : 1,
                defaultZoom = typeof _.opt.defaultZoom === 'number' ? _.opt.defaultZoom : 1;

            if(minZoom <= 0 || minZoom > 1) {
                minZoom = 1;
            }
            if(defaultZoom <= 0 || defaultZoom > 1) {
                defaultZoom = 1;
            }

            $.addListener(img, 'load', function(ev) {
                var size = Factory.getSize(bs.width, bs.height, img.naturalWidth, img.naturalHeight, defaultZoom);
                _.cfg = {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    sizeRatio: img.naturalWidth / img.naturalHeight,
                    minZoom: minZoom,
                    defaultZoom: defaultZoom,
                    w: size.width,
                    h: size.height,
                    left: size.left,
                    top: size.top,
                    x: parseInt(size.width / 2 + size.left, 10),
                    y: parseInt(size.height / 2 + size.top, 10),
                    scale: size.width / img.naturalWidth,
                    offset: {
                        width: bs.width, height: bs.height,
                        left: bs.left, top: bs.top
                    },
                    icon: opt.icon || ''
                };

                console.log(_.cfg);

                _.img.style.width = _.cfg.w + 'px';
                _.img.style.height = _.cfg.h + 'px';
                _.img.style.left = _.cfg.left + 'px';
                _.img.style.top = _.cfg.top + 'px';

                if (_.cfg.width > _.cfg.offset.width || _.cfg.height > _.cfg.offset.height) {                    
                    _.control().drag().wheelZoom().status();
                }

                if ($.isFunction(opt.callback)){
                    opt.callback(_, _.cfg);
                }
            });

            return this;
        },
        control: function () {
            var _ = this;
            var statusbar = document.createElement('DIV');
            statusbar.className = 'oui-omap-status oui-omap-unselect';
            $.addListener(statusbar, 'dblclick', function() {
                _.center();
            });

            _.statusbar = statusbar;

            _.box.appendChild(statusbar);

            return this;
        },
        status: function () {
            if (!this.statusbar) {
                return this;
            }
            var ratio = Math.round(this.cfg.width / this.cfg.w * 100) / 100;
            var html = ['1:', ratio];

            this.statusbar.innerHTML = html.join('');

            return this;
        },
        resize: function (size) {
            if($.isElement(this.box)) {
                this.box.style.width = (size.width || size.w) + 'px';
                this.box.style.height = (size.height || size.h) + 'px';

                var bs = $.getOffsetSize(this.box);
                this.cfg.offset = {
                    width: bs.width, height: bs.height,
                    left: bs.left, top: bs.top
                };
            }
            return this;
        },
        drag: function () {
            var _ = this;
            console.log('drag');
            $.addListener(_.img, 'pointerdown', function (ev) {
                //console.log('pointerdown');
                _.cfg.pointerdown = true;
                _.img.setPointerCapture(ev.pointerId);
                _.cfg.lastpointer = { x: ev.clientX, y: ev.clientY };
                _.cfg.diffpointer = { x: 0, y: 0 };

                console.log('down:', _.cfg.x, _.cfg.y);
            });
            $.addListener(_.img, 'pointermove', function (ev) {
                if (ev.target.className.indexOf('oui-omap-img') < 0) {
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

                    _.move();
                }
                ev.preventDefault();
            });
            $.addListener(_.img, 'pointerup', function (ev) {
                if (ev.target.className.indexOf('oui-omap-img') < 0) {
                    return false;
                }
                if (_.cfg.pointerdown) {
                    _.cfg.pointerdown = false;
                }
            });
            $.addListener(_.img, 'pointercancel', function (ev) {                
                if (ev.target.className.indexOf('oui-omap-img') < 0) {
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
                if(_.opt.minZoom > 1) {
                    _.opt.minZoom = 1;
                }
                if(_.cfg.sizeRatio >= 1) {
                    var minWidth = _.cfg.offset.width;
                    if (typeof _.opt.minZoom === 'number') {
                        if (_.cfg.width < _.cfg.offset.width) {
                            minWidth = _.cfg.width;
                        } if (_.opt.minZoom > 0 && _.opt.minZoom < 1) {
                            minWidth = parseInt(_.cfg.offset.width * _.opt.minZoom, 10);
                        }
                    }
                    if (w <= minWidth) {
                        return false;
                    }
                } else {
                    var minHeight = _.cfg.offset.height;
                    if (typeof _.opt.minZoom === 'number') {
                        if (_.cfg.height < _.cfg.offset.height) {
                            minHeight = _.cfg.height;
                        } else if(_.opt.minZoom > 0 && _.opt.minZoom < 1) {
                            minHeight = parseInt(_.cfg.offset.height * _.opt.minZoom, 10);
                        }
                    }
                    if (h <= minHeight) {
                        return false;
                    }
                }
            } else if (scale >= 100) {
                scale = 100;
                return false;
            }

            w *= ratio;
            h = w / _.cfg.width * _.cfg.height;

            if (ev) {
                var tar = ev.target;
                if (tar.className.indexOf('oui-omap-map') >= 0) {
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

            //console.log('zoom: ', _.cfg);

            _.status().move();

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

            _.move();

            return this;
        },
        setCenter: function () {
            return this.center(opt);
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
        buildKey: function (id) {
            return 'marker' + id;
        },
        buildMarker: function (opt) {
            var _ = this;
            if (typeof opt === 'undefined' || opt === null) {
                return _;
            }
            if ($.isUndefinedOrNull(opt.id) || !$.isNumeric(opt.x) || !$.isNumeric(opt.y)) {
                return _;
            }
            var key = _.buildKey(opt.id);
            if (typeof _.markers[key] !== 'undefined') {
                if (opt.update) {
                    _.delete(opt.id);
                } else {
                    return _;
                }
            }
            
            var pos = {
                left: _.cfg.left + opt.x * _.cfg.scale,
                top: _.cfg.top + opt.y * _.cfg.scale
            };

            var marker = document.createElement('IMG'),
                iconSize = $.extend({ width: 32, height: 32 }, opt.iconSize);

            marker.className = 'oui-omap-marker oui-omap-map oui-omap-unselect';
            marker.src = opt.icon || _.cfg.icon || (Config.FileDir + 'imgs/icon.png');

            marker.style.left = (pos.left - iconSize.width / 2) + 'px';
            marker.style.top = (pos.top - iconSize.height) + 'px';

            $.addListener(marker, 'click', function (ev) {
                if ($.isFunction(opt.callback)) {
                    opt.callback(this, _, opt);
                }
            });

            _.box.appendChild(marker);

            var label = null;
            // 是否显示文字标签
            if(opt.showLabel) {
                label = document.createElement('LABEL');
                label.innerHTML = opt.name;
                label.className = 'oui-omap-label oui-omap-map oui-omap-unselect';

                label.style.left = pos.left + 'px';
                label.style.top = pos.top + 'px';
                
                $.addListener(label, 'click', function (ev) {
                    if ($.isFunction(opt.callback)) {
                        opt.callback(this, _, opt);
                    }
                });
                _.box.appendChild(label);
            }

            _.markers[key] = {
                marker: marker,
                label: label,
                pointer: { x: opt.x, y: opt.y }
            };
            // 是否设置当前位置为中心点
            if(opt.setCenter || opt.center) {
                _.center({ x: opt.x, y: opt.y });
            }

            return this;
        },
        marker: function (opt) {
            return this.buildMarker(opt);
        },
        update: function (opt) {
            return this.buildMarker($.extend(opt, { update: true }));
        },
        move: function () {
            var _ = this;
            //console.log(_.markers);
            for (var k in _.markers) {
                var dr = _.markers[k];

                var marker = dr.marker,
                    label = dr.label,
                    pointer = dr.pointer,
                    pos = {
                        left: _.cfg.left + pointer.x * _.cfg.scale,
                        top: _.cfg.top + pointer.y * _.cfg.scale
                    };

                if(marker) {
                    marker.style.left = (pos.left - 16) + 'px';
                    marker.style.top = (pos.top - 32) + 'px';
                }

                if(label) {
                    label.style.left = pos.left + 'px';
                    label.style.top = pos.top + 'px';
                }
            }

            return this;
        },
        clear: function () {
            var _ = this;
            for (var k in _.markers) {
                var dr = _.markers[k];
                if (dr.marker) {
                    dr.marker.parentNode.removeChild(dr.marker);
                }
                if (dr.label) {
                    dr.label.parentNode.removeChild(dr.label);
                }
            }
            _.markers = {};

            return this;
        },
        delete: function (ids) {
            ids = Factory.checkIds(ids);
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i],
                    key = this.buildKey(id),
                    dr = this.markers[key];
                if (dr) {
                    if (dr.marker) {
                        dr.marker.parentNode.removeChild(dr.marker);
                    }
                    if (dr.label) {
                        dr.label.parentNode.removeChild(dr.label);
                    }
                    delete _.markers[key];
                }
            }
            return this;
        },
        show: function (ids) {
            ids = Factory.checkIds(ids);
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i],
                    key = this.buildKey(id),
                    dr = this.markers[key];
                if (dr) {
                    if (dr.marker) {
                        dr.marker.style.display = 'block';
                    }
                    if (dr.label) {
                        dr.label.style.display = 'block';
                    }
                }
            }
            return this;
        },
        hide: function (ids) {
            ids = Factory.checkIds(ids);
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i],
                    key = this.buildKey(id),
                    dr = this.markers[key];
                if (dr) {
                    if (dr.marker) {
                        dr.marker.style.display = 'none';
                    }
                    if (dr.label) {
                        dr.label.style.display = 'none';
                    }
                }
            }
            return this;
        },
        showMarker: function (opt) {
            return this.buildMarker(opt);
        },
        clearMarker: function() {
            return this.clear();
        },
        hideMarker: function(ids) {
            return this.hide(ids);
        }
    };

    $.extend({
        omap: function(opt, callback) {
            return new Map($.extend(opt, { callback: callback })); 
        }
    });

    $.extend($.omap, {

    });

}(OUI);