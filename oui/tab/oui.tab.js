
/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.tab Tab插件
*/

!function($) {
    'use strict';

    var Config = {
        IE: $.browser.isIE(),
        FilePath: $.getScriptSelfPath(true),
        FileName: 'oui.tab.',
        DefaultSkin: 'default',
        IsDefaultSkin: function(skin) {
            return (!$.isUndefined(skin) ? skin : Config.GetSkin()) === Config.DefaultSkin;
        },
        Skin: '',
        GetSkin: function() {
            if(!Config.Skin) {
                Config.Skin = Config.FilePath.getQueryString('skin') || Config.DefaultSkin;
            }
            return Config.Skin;
        },
        GetLang: function() {
            return Config.FilePath.getQueryString(['lang']) || 'chinese';
        },
        CMenuItemHeight: 28,    //右键菜单项高度，单位：像素
        CMenuSwitchWidth: 16,   //左右切换按钮宽度，单位：像素
        CMenuItemPaddingHeight: 4,  //菜单项间距，单位：像素
        CMenuBorderHeight: 2,       //菜单边框高度，单位：像素
        ItemCloseHeight: 17,        //选项卡关闭按钮高度，单位：像素
        LongPressTime: 512,      //长按最小时长，单位：毫秒
        LongPressInterval: 40,   //长按滚动间隔，单位：毫秒
        LongPressMinInterval: 10,   //长按滚动间隔，单位：毫秒
        LongPressScrollDistance: 10,     //长按时一次滚动的距离，单位：px
        LongPressScrollMaxDistance: 50,     //长按时一次滚动的距离，单位：px
        LangText: {
            loading: { chinese: '正在努力加载，请稍候...', english: 'Loading, please wait a moment!' },
            overrun: { chinese: '标签页数量已超出限制', english: 'Tabs count exceeded limit.' },
            closetab: { chinese: '关闭', english: 'Close tab' },
            close: { chinese: '关闭标签页', english: 'Close tab' },
            closeCon: { chinese: '关闭标签内容', english: 'Close tab\'s content' },
            closeall: { chinese: '关闭全部标签页', english: 'Close all tabs' },
            closeother: { chinese: '关闭其他标签页', english: 'Close other tabs' },
            closeleft: { chinese: '关闭左侧标签页', english: 'Close tabs to the left' },
            closeright: { chinese: '关闭右侧标签页', english: 'Close tabs to the right' },
            reload: { chinese: '重新加载', english: 'Reload' },
            reloadall: { chinese: '全部重新加载', english: 'Reload all' },
            reopen: { chinese: '重新打开关闭的标签页', english: 'Reopen closed tabs' },
            reopenall: { chinese: '重新打开关闭的全部标签页', english: 'Reopen all closed tabs' }
        },
        IdPrefix: 'oui-tabs-'
    },
    Util = {
        getLangText: function(key, lang) {
            lang = (lang || '').toLowerCase();
            if(['chinese', 'english'].indexOf(lang) < 0) {
                lang = 'chinese';
            }
            var txt = Config.LangText[key];
            return txt ? txt[lang] : '';
        },
        buildId: function(objId, itemId, prefix) {
            return prefix + '-' + objId + '-' + itemId;
        },
        buildItemId: function(objId, itemId) {
            //return objId + '-' + itemId;
            return Util.buildId(objId, itemId, 'oui-tab');
        },
        buildPanelId: function(objId, itemId) {
            return Util.buildId(objId, itemId, 'oui-tab-panel');
        },
        buildIframeId: function(objId, itemId) {
            return Util.buildId(objId, itemId, 'oui-tab-iframe');
        },
        buildLoadingId: function(objId, itemId) {
            return Util.buildId(objId, itemId, 'oui-tab-loading');
        },
        buildSwitch: function(t, opt, dir, func) {
            var span = $.createElement('SPAN', '', function(elem) {
                elem.className = 'tab-switch tab-switch-' + dir;
                var style = '';
                if(opt.tabHeight) {
                    var height = opt.tabHeight - Config.CMenuBorderHeight;
                    elem.style.cssText = 'height:' + height + 'px;display:none;';
                    style = 'margin-top:' + (height - 12) / 2 + 'px;';
                }
                elem.innerHTML = '<a class="arrow arrow-' + dir + '" style="' + style + '"></a>';
                $.disableEvent(elem, 'contextmenu');

                if ($.isFunction(func)) {
                    func(elem);
                }
            }, t.tabContainer);
            return this;
        },
        checkOptions: function(opt) {
            if (!$.isObject(opt)) {
                opt = {};
            }
            if ($.isString(opt.skin, true)) {
                opt.skin = opt.skin.toLowerCase();
            } else {
                //指定默认样式
                opt.skin = Config.GetSkin();
            }
            //event参数名重载
            opt.event = $.getParam(opt, ['event','eventName','evtName']);            

            return opt;
        },
        checkOptionItem: function(dr) {
            if (dr === null || $.isUndefinedOrNull(dr.id) || $.isUndefinedOrNull(dr.name)) {
                return false;
            }
            return true;
        },
        initialTab: function(t, opt) {
            Util.buildSwitch(t, opt, 'left', function(elem) {
                t.left = elem;
                Util.scrollAction(t, t.left, 'left');
            });

            if(t.box) {
                return this;
            }

            var div = $.createElement('div', '', function(elem) {
                elem.className = 'tab-box';
                elem['oncontextmenu'] = function(ev) {
                    //当有Tab项时，禁用Tab容器右键菜单
                    if(elem.childNodes[0].childNodes.length > 0) {
                        return false;
                    }
                    if (opt.type !== 'scroll') {
                        Util.buildContextMenu(t, ev, null);
                    }
                    return false;
                };
                if(opt.style.box) {
                    elem.style.cssText = opt.style.box;
                }
                if(opt.tabHeight) {
                    elem.style.height = (opt.tabHeight - Config.CMenuBorderHeight) + 'px';
                }
            }, t.tabContainer);
            t.box = div;

            var ul = $.createElement('ul', '', function(elem) {
                elem.className = 'tab-container';
                //限制一下高度，可以解决（在非chrome浏览器中）div换行的问题
                if(opt.tabHeight) {
                    elem.style.height = (opt.tabHeight - 2) + 'px';
                }
            }, div);
            t.container = ul;

            Util.buildSwitch(t, opt, 'right', function(elem) {
                t.right = elem;
                Util.scrollAction(t, t.right, 'right');
            });

            if (opt.tabsep) {
                $.createElement('DIV', '', function(elem) {
                    elem.className = 'tab-sep';
                }, t.tabContainer);
            }

            return this;
        },
        buildTab: function(t, opt, cfg, insertIndex, tabType) {
            var cache = Factory.getCache(t.id),
                objId = cfg.id,
                itemId = opt.id || opt.itemId;
            if(!cache) {
                return this;
            }
            if(cache.items[itemId]) {
                t.show(itemId);
                return this;
            }

            if (opt.element) {
                opt.element = $.toElement(opt.element);
            }
            var isElem = $.isElement(opt.element) && opt.element.parentNode === t.conContainer;

            var tab = $.createElement('li', '', function(elem) {
                elem.className = 'tab-item';
                elem.id = Util.buildItemId(objId, itemId);
                elem.itemId = itemId;

                if(cfg.style.tab) {
                    elem.style.cssText = cfg.style.tab;
                }
                var txtStyle = '', closeTitle = '', closeStyle = '';
                if(cfg.style.txt) {
                    txtStyle = cfg.style.txt;
                }
                if(cfg.tabHeight) {
                    var height = cfg.tabHeight - Config.CMenuBorderHeight,
                        //行高要低于选项高度，因为选项卡位置下调
                        lineHeight = height - ($.isFirefox ? 3 : 2);
                    elem.style.height = height + 'px';
                    closeStyle = 'margin-top:' + parseInt((lineHeight - Config.ItemCloseHeight) / 2, 10) + 'px;';
                    txtStyle += ';line-height:' + lineHeight + 'px;';
                }
                var has_icon = opt.icon && opt.icon.path ? true : false;
                var con = [
                    '<a class="tab-txt', has_icon ? ' tab-txt-icon' : '', '" href="javascript:void(0);" style="{1}">', 
                    has_icon ? [
                        '<span class="tab-icon" style="background:url(\'', opt.icon.path, '\') no-repeat center;',
                        'background-size:cover;"></span>'
                    ].join('') : '',
                    '{name}</a>',
                    opt.closeAble && !isElem ? '<i class="tab-close" title="{2}" style="{3}">×</i>' : ''
                ].join('');

                closeTitle = Util.getLangText('closetab', opt.lang);
                elem.innerHTML = con.format(opt, txtStyle, closeTitle, closeStyle);
                
                if($.isNumber(insertIndex)) {
                    t.container.insertBefore(elem, t.container.childNodes[insertIndex]);
                } else if($.isString(insertIndex, true)) {
                    var existingItem = document.getElementById(objId + '-' + insertIndex);
                    t.container.insertBefore(elem, existingItem);
                } else {
                    t.container.appendChild(elem);
                }

                var txt = elem.childNodes[0],
                    txtW = $.getOuterSize(txt).width,
                    btn = opt.closeAble ? elem.childNodes[1] : null,
                    btnW = $.getOuterSize(btn).width;

                if($.isNumber(cfg.maxWidth) && cfg.maxWidth > 60 && (txtW + btnW) > cfg.maxWidth) {
                    var ps = $.getPaddingSize(txt),
                        ms = $.getMarginSize(txt),
                        es = $.getElementSize(elem);
                    elem.style.width = cfg.maxWidth + 'px';
                    //txt.style.width = (cfg.maxWidth - ps.width - ms.width - btnW - es.border.width - 2) + 'px';
                    //减去14是因为文字缩略显示之后多出省略号
                    txt.style.width = (cfg.maxWidth - ms.width - btnW - es.border.width - 14) + 'px';
                    txt.title = $.getInnerText(txt);
                }
            });

            var childs = tab.childNodes;
            for(var i = 0; i < childs.length; i++) {
                if(childs[i].className.endsWith('close')) {
                    childs[i]['onclick'] = function() {
                        t.close(itemId);
                        $.cancelBubble();
                    };
                }
            }

            tab['on' + cfg.event] = function() {
                t.show(itemId);
            };

            if(cfg.showContextMenu && cfg.type !== 'scroll') {
                tab['oncontextmenu'] = function(ev) {
                    $.cancelBubble();
                    Util.buildContextMenu(t, ev, this.itemId);
                    return false;
                };
            }

            if (isElem) {
                opt.element.className += ' tab-panel';
                Factory.setCache(t.id, opt, tab, opt.element, undefined);
                return this;
            }

            var panelId = Util.buildPanelId(objId, itemId),
                isIframe = false,
                iframeId = '',
                loadingId = '';

            var div = $.createElement('div', panelId, function(elem) {
                elem.className = 'tab-panel';
                if(cfg.style.panel) {
                    elem.style.cssText = cfg.style.panel;
                }
                //var html = '<a class="pos-mark" name="' + itemId + '"></a>';
                var html = '';
                if($.isString(opt.url, true)) {
                    isIframe = true;
                    iframeId = Util.buildIframeId(objId, itemId);
                    loadingId = Util.buildLoadingId(objId, itemId);
                    html += '<div id="' + loadingId + '" class="tab-loading">' 
                        + Util.getLangText('loading', opt.lang) + '</div>'
                        + '<iframe id="' + iframeId + '" class="tab-iframe"'
                        + ' style="width:100%;height:' + cfg.conHeight + 'px;"'
                        + ' src="about:block;" frameborder="0" scrolling="auto"></iframe>';
                } else {
                    html += opt.html || '';
                }
                elem.innerHTML = html;

                if (tabType !== 'scroll') {
                    elem.style.display = 'none';
                }

                var iframe = isIframe ? $I(iframeId) : undefined;
                if(iframe) {
                    iframe.itemId = itemId;
                    if(opt.load) {
                        Util.loadPage(t, iframe, Util.buildPageUrl(opt.url, itemId));
                    } else {
                        $.addClass(tab, 'pre');
                    }
                }

                t.setContentSize(itemId, false, cfg);

                Factory.setCache(t.id, opt, tab, elem, iframe);
            }, t.conContainer);

            return this;
        },
        getTabElem: function(elem) {
            if (elem && elem.tagName) {
                return elem.tagName === 'A' && elem.parentNode && elem.parentNode.tagName === 'LI' ? elem.parentNode : elem
            }
            return null;
        },
        buildPageUrl: function(url, itemId) {
            return url.setUrlParam('tab_item_id', itemId).setUrlParam();
        },
        loadPage: function(t, iframe, url, forceLoad) {
            try{
                if(!iframe || !url || (iframe.loaded && !forceLoad)) {
                    return this;
                }
                var loading = $I(Util.buildLoadingId(t.id, iframe.itemId));
                //loading.style.display = '';
                iframe.onload = iframe.onreadystatechange = function () {
                    if (!this.readyState || this.readyState === 'complete') {
                        loading.style.visibility = 'hidden';
                    }
                };
                //设置加载标记，表示iframe已经加载过
                iframe.loaded = true;
                iframe.src = $.setQueryString(url);
            } catch(e) {

            }
            return this;
        },
        checkSize: function(size) {
            return size < 0 ? Math.abs(size) : size;
        },
        setSize: function(t, func, par) {
            window.clearTimeout(t.sizeTimer);
            t.sizeTimer = window.setTimeout(function() {
                var ts = $.getInnerSize(t.tabContainer),
                    s = $.elemSize(t.box), 
                    tw = Config.IE ? Util.getItemSize(t) : t.container.offsetWidth,
                    als = $.getOuterSize(t.left).width,
                    ars = $.getOuterSize(t.right).width,
                    w = ts.width- s.margin.width - s.padding.width - s.border.width,
                    bw = Util.checkSize(w - als - ars);

                if(tw <= bw) {
                    t.left.style.display = 'none';
                    t.right.style.display = 'none';
                } else {
                    t.left.style.display = '';
                    t.right.style.display = '';
                    //获取HTML元素宽度有时会出错，不知道是什么原因
                    //发现获取到的宽度尺寸可能出错的情况下，触发window.resize事件
                }

                var als2 = $.getOuterSize(t.left).width,
                    ars2 = $.getOuterSize(t.right).width,
                    bw2 = Util.checkSize(w - als2 - ars2);


                //设置 tab box 宽度
                t.box.style.width = bw2 + 'px';
                t.box.style.left = als2 + 'px';

                if (Config.IE) {
                    //设置 tab 项实际总宽度
                    t.container.style.width = (tw < bw2 ? bw2 : tw) + 'px';
                }

                if($.isFunction(func)) {
                    func(par);
                }
            }, 20);
            return this;
        },
        getItemSize: function(t) {
            var w = 0, 
                s = $.elemSize(t.container),
                childs = t.container.childNodes,
                len = childs.length;

            for(var i = len - 1; i >= 0; i--) {
                var iw = $.getElementSize(childs[i]).outerWidth;
                w += iw;
            }
            w += s.padding.width + s.margin.width + s.border.width;
            return w;
        },
        scrollAction: function(t, btn, dir) {
            if(t.getOptions().dblclickScroll) {                
                $.addEventListener(btn, 'dblclick', function () {
                    Util.scrollTo(t, dir, 0, true);
                });
            }
            $.addEventListener(btn, 'mousedown', function () {
                window.clearTimeout(t.timerLongPress);
                t.timerLongPress = window.setTimeout(function () {
                    Util.longPressScroll(t, dir, false);
                }, Config.LongPressTime);

                Util.scrollTo(t, dir);
            });
            
            $.addEventListener(btn, 'mouseup', function () {
                Util.longPressScroll(t, dir, true);
            });
            $.addEventListener(btn, 'mouseout', function () {
                Util.longPressScroll(t, dir, true);
            });
            return this;
        },
        longPressScroll: function(t, dir, isStop) {
            if(isStop) {
                window.clearTimeout(t.timerLongPress);
                window.clearInterval(t.timerLongPress2);
                return this;
            }
            var distance = Config.LongPressScrollDistance;
            t.timerLongPress2 = window.setInterval(function () {
                if(isStop || Util.scrollOver(t)) {
                    window.clearInterval(t.timerLongPress2);
                    return false;
                }
                Util.scrollTo(t, dir, distance, null, isStop);
                //滚动加速，每次加5px
                if(distance < Config.LongPressScrollMaxDistance) {
                    distance += 5;
                }
            }, Config.LongPressInterval);
            return this;
        },
        scrollTo: function(t, dir, pos, goto, isStop) {
            if(isStop) {
                return this;
            }
            var distance = Config.LongPressScrollDistance;
            if($.isNumber(pos)) {
                distance = pos;
            }
            if($.isBoolean(goto, false)) {                
                t.box.scrollLeft = dir === 'left' ? distance : t.container.clientWidth - distance;
                return this;
            }
            t.box.scrollLeft += (dir === 'left' ? -distance : distance);

            return this;
        },
        scrollOver: function(t) {
            return t.box.scrollLeft <= 0 || (t.box.scrollLeft + t.box.clientWidth) >= t.box.scrollWidth;
        },
        setTabPosition: function(t, item, isCenter) {
            var bs = $.getInnerSize(t.box),
                ts = $.getOuterSize(item),
                isCenter = $.isBoolean(isCenter, t.getOptions().center),
                centerOffset = isCenter ? ts.width / 2 - bs.width / 2 : 0;

            if(item.offsetLeft < t.box.scrollLeft) {
                Util.scrollTo(t, 'left', item.offsetLeft + centerOffset, true);
            } else if((item.offsetLeft + item.offsetWidth - bs.width) > t.box.scrollLeft) {
                Util.scrollTo(t, 'right', item.offsetLeft + item.offsetWidth - bs.width - t.box.scrollLeft - centerOffset);
            }
            return this;
        },
        getItemStatus: function(t, itemId) {
            var cache = Factory.getCache(t.id);
            if(!cache) {
                return null;
            }
            //如果不在Tab项上右键菜单，是没有当前项的，因此加个空对象
            var curItem = Factory.getTabItem(t, itemId) || {},
                iframeCount = 0,
                closedCount = cache.closeIds.length;
            for(var k in cache.items) {
                if(cache.items[k].iframe) {
                    iframeCount++;
                }
            }
            var count = 0;
            for(var k in cache.items) {
                count++;
            }

            var data = {
                count: count,
                close: curItem.closeAble,
                other: count - 1,
                left: this.getSiblingCount(curItem.tab, 'previousSibling'),
                right: this.getSiblingCount(curItem.tab, 'nextSibling'),
                iframe: curItem.iframe,
                iframeCount: iframeCount,
                closedCount: closedCount,
                item: curItem
            };

            return data;
        },
        buildMenuContent: function(t, itemId) {
            var s = this.getItemStatus(t, itemId);
            if(!s) {
                return this;
            }
            var cache = Factory.getCache(t.id), opt = cache.options, dis = ' disabled';
            var html = [
                '<a class="cmenu-item{0}" code="cur">{1}</a>'.format(s.close ? '' : dis, Util.getLangText('close', opt.lang)),
                s.iframe && s.iframe.loaded ? '<a class="cmenu-item{0}" code="con">{1}</a>'.format(s.close ? '' : dis, Util.getLangText('closeCon', opt.lang)) : '',
                '<div class="cmenu-sep"></div>',
                '<a class="cmenu-item{0}" code="all">{1}</a>'.format(s.count > 0 ? '' : dis, Util.getLangText('closeall', opt.lang)),
                '<a class="cmenu-item{0}" code="other">{1}</a>'.format(s.other > 0 ? '' : dis, Util.getLangText('closeother', opt.lang)),
                '<a class="cmenu-item{0}" code="left">{1}</a>'.format(s.left > 0 ? '' : dis, Util.getLangText('closeleft', opt.lang)),
                '<a class="cmenu-item{0}" code="right">{1}</a>'.format(s.right > 0 ? '' : dis, Util.getLangText('closeright', opt.lang)),
                '<div class="cmenu-sep"></div>',
                '<a class="cmenu-item{0}" code="reload">{1}</a>'.format(s.iframe ? '' : dis, Util.getLangText('reload', opt.lang)),
                '<a class="cmenu-item{0}" code="reloadAll">{1}</a>'.format(s.iframeCount > 0 ? '' : dis, Util.getLangText('reloadall', opt.lang)),
                '<div class="cmenu-sep"></div>',
                '<a class="cmenu-item{0}" code="reopen">{1}</a>'.format(s.closedCount > 0 ? '' : dis, Util.getLangText('reopen', opt.lang)),
                '<a class="cmenu-item{0}" code="reopenAll">{1}</a>'.format(s.closedCount > 0 ? '' : dis, Util.getLangText('reopenall', opt.lang))
            ];
            var width = 256, height = 0;
            for(var i = 0; i<html.length; i++) {
                if(html[i].indexOf('<a') === 0) {
                    height += Config.CMenuItemHeight + Config.CMenuItemPaddingHeight;
                } else {
                    height += Config.CMenuItemPaddingHeight + 1;
                }
            }
            //height + padding + border
            return { text: html.join(''), width: width, height: height + Config.CMenuItemPaddingHeight + Config.CMenuBorderHeight };
        },
        setContextMenuPos: function(pos, size) {
            var bs = $.getBodySize(),
                ss = $.getScrollPos();

            if(pos.x < 0 || size.width >= bs.width) {
                pos.x = 0 + ss.left;
            } else if((pos.x + size.width)> bs.width + ss.left) {
                pos.x = bs.width - size.width;
            }

            if(pos.y < 0 || size.height >= bs.height) {
                pos.y = 0 + ss.top;
            } else if((pos.y + size.height)> bs.height + ss.top) {
                pos.y = pos.y - size.height;
            }
            return pos;
        },
        buildContextMenu: function(t, ev, itemId) {
            var menuId = 'oui-tabs-context-menu-' + t.id,
                obj = $I(menuId),
                con = this.buildMenuContent(t, itemId),
                pos = this.setContextMenuPos($.getEventPosition(ev), con);

            if(obj) {
                obj.innerHTML = con.text;
                obj.style.left = pos.x + 'px';
                obj.style.top = pos.y + 'px';
            } else {
                obj = $.createElement('div', menuId, function(elem) {
                    elem.className = 'oui-tabs-context-menu';
                    elem.style.cssText = 'left:{x}px;top:{y}px;width:{1}px;height:{2}px;'.format(pos, con.width, con.height);
                    elem.innerHTML = con.text;
                    elem.tabId = t.id;
                    $.disableEvent(elem, 'contextmenu');
                }, document.body);
            }

            var childs = obj.childNodes, len = childs.length;
            for(var i = 0; i < len; i++) {
                var elem = childs[i];
                //$.disableEvent(elem, 'contextmenu');
                if(elem.tagName === 'A' && elem.className.indexOf('disabled') < 0) {
                    $.addListener(elem, 'click', function() {
                        var action = $.getAttribute(this, 'code');
                        Util.setMenuAction(t, action, itemId, this).hideContextMenu(ev, t, true);
                    });
                }
            }
            $.addListener(document, 'keydown', Util.escContextMenu);

            return this;
        },
        hideContextMenu: function(ev, t, hide) {
            var obj = $I('oui-tabs-context-menu-' + t.id),
                pos = $.getEventPosition(ev);
            if(obj) {
                var offset = $.getOffsetSize(obj);
                if(hide
                    || pos.x < offset.left || pos.y < offset.top
                    || pos.x > (offset.left + offset.width)
                    || pos.y > (offset.top + offset.height)) {
                    $.removeElement(obj);
                    $.removeListener(document, 'keydown', Util.escContextMenu);
                }
            }
            return this;
        },
        escContextMenu: function(e) {
            if($.getKeyCode(e) === $.keyCode.Esc) {
                Util.hideAllContextMenu();
            }
            return this;
        },
        hideAllContextMenu: function() {
            if(Cache.count > 0) {
                $('.oui-tabs-context-menu').each(function(i, obj){
                    $.removeElement(obj);
                });
                $.removeListener(document, 'keydown', Util.escContextMenu);
            }
            return this;
        },
        setMenuAction: function(t, action, itemId, elem) {
            var cache = Factory.getCache(t.id),
                curItem = Factory.getTabItem(t, itemId),
                lastId = '';
            if(!cache) {
                return this;
            }
            switch(action) {
                case 'cur':
                    t.close(itemId);
                    break;
                case 'con':
                    t.close(itemId, true);
                    break;
                case 'all':
                    t.closeAll();
                    break;
                case 'other':
                    t.closeAll(itemId);
                    break;
                case 'left':
                    this.removeSibling(t, curItem, 'previousSibling');
                    break;
                case 'right':
                    this.removeSibling(t, curItem, 'nextSibling');
                    break;
                case 'reload':
                    if(curItem.iframe) {
                        this.loadPage(t, curItem.iframe, curItem.opt.url, true);
                    }
                    break;
                case 'reloadAll':
                    for(var k in cache.items) {
                        var dr = cache.items[k];
                        if(dr.iframe) {
                            this.loadPage(t, dr.iframe, dr.opt.url, true);
                        }
                    }
                    break;
                case 'reopen':
                    lastId = cache.closeIds[cache.closeIds.length - 1];
                    this.reopen(t, cache, lastId);
                    break;
                case 'reopenAll':
                    for(var k in cache.closeItems) {
                        lastId = cache.closeItems[k].itemId;
                        this.reopen(t, cache, lastId);
                    }
                    break;
            }

            return this;
        },
        getSiblingCount: function(elem, dir) {
            if(!elem) {
                return 0;
            }
            var sibling = elem[dir],
                count = 0;
            while(sibling) {
                count++;
                sibling = sibling[dir];
            }
            return count;
        },
        removeSibling: function(t, elem, dir) {
            var sibling = elem.tab[dir];
            while(sibling) {
                var itemId = sibling.itemId;
                sibling = sibling[dir];
                Factory.delItem(t, itemId);
            }
            var cur = Factory.getCur(t);
            if(!cur || $I(Util.buildItemId(cur.objId, cur.itemId)) === null) {
                Factory.setCur(t, elem, true);
                t.show(elem.itemId);
            } else {
                Util.setSize(t);
            }
            return this;
        },
        reopen: function(t, cache, itemId) {
            var opt = (cache.closeItems[itemId] || {}).opt;
            if(opt) {
                t.add(opt, true);
            }
            return this;
        }
    },
    Cache = {
        tabs: {},
        count: 0,
        index: 0
    },
    Factory = {
        initCache: function(objId, options, obj) {
            var key = this.buildKey(objId);
            Cache.tabs[key] = {
                objId: objId,
                obj: obj,
                options: options,
                items: {},
                ids: [],
                closeItems: {},
                closeIds: [],
                cur: null
            };
            Cache.count += 1;
            return this;
        },
        buildKey: function(objId) {
            return 't_' + objId;
        },
        setCache: function(objId, opt, tab, con, iframe) {
            var cache = this.getCache(objId);
            if(cache) {
                var itemId = opt.id, idx = cache.ids.length;
                cache.items[itemId] = {
                    objId: objId,
                    itemId: itemId,
                    closeAble: opt.closeAble,
                    iframe: iframe,
                    opt: opt,
                    tab: tab,
                    con: con,
                    //标签页添加的顺序(不会改变)
                    idx: idx,
                    //标签页显示的位置(会改变)
                    pos: idx
                };
                cache.ids.push(itemId);

                this.setClosedItem(cache, itemId, opt, true);
            }
            return this;
        },
        getCache: function(objId) {
            var key = this.buildKey(objId);
            return Cache.tabs[key] || null;
        },
        setClosedItem: function(cache, itemId, opt, isRemove) {
            if(isRemove) {
                if(cache.closeItems[itemId]) {
                    delete cache.closeItems[itemId];
                }
                var c = cache.closeIds.length;
                for(var i = c - 1; i >= 0; i--) {
                    if(cache.closeIds[i] === itemId) {
                        cache.closeIds.splice(i, 1);
                    }
                }
            } else {
                cache.closeIds.push(itemId);
                cache.closeItems[itemId] = {
                    itemId: itemId,
                    opt: opt
                };
            }
            return this;
        },
        getCount: function(cache) {
            return cache ? cache.count : 0;
        },
        getTabItem: function(t, itemId) {
            var cache = this.getCache(t.id);
            if(cache) {
                return cache.items[itemId];
            }
            return null;
        },
        getItem: function(cache, itemId, idx) {
            if(!cache) {
                return null;
            }
            if(!$.isUndefined(itemId)) {
                return cache.items[itemId];
            }
            if(!$.isNumber(idx)) {
                idx = 0;
            }
            var i = 0;
            for(var k in cache.items) {
                if(i++ === idx) {
                    return cache.items[k];
                }
            }
            return null;
        },
        delItem: function(t, itemId, exceptItemId) {
            var cache = Factory.getCache(t.id);
            if(!cache) {
                return this;
            }
            if($.isBoolean(itemId, false)) {
                for(var k in cache.items) {
                    if($.isUndefined(exceptItemId) || exceptItemId.toString() !== k.toString()) {
                        this.setClosedItem(cache, k, cache.items[k].opt);
                        this.delCache(cache, k);
                    }
                }
            } else {
                this.setClosedItem(cache, itemId, cache.items[itemId].opt);
                this.delCache(cache, itemId);
            }
            return this;
        },
        delItemUrl: function(t, itemId, exceptItemId) {
            var cache = Factory.getCache(t.id);
            if(!cache) {
                return this;
            }
            if($.isBoolean(itemId, false)) {
                for(var k in cache.items) {
                    if($.isUndefined(exceptItemId) || exceptItemId.toString() !== k.toString()) {
                        _clear(itemId, cache);
                    }
                }
            } else {
                _clear(itemId, cache);
            }

            function _clear(itemId, cache) {
                var item = cache.items[itemId];
                if (!item || !item.iframe) {
                    return false;
                }
                item.iframe.src = '';
                item.iframe.loaded = false;
                item.iframe.closed = true;
                console.log('item:', item);
            }
            return this;
        },
        delCache: function(cache, itemId) {
            var item = cache.items[itemId];
            if(item && item.closeAble) {
                $.removeElement(item.con);
                $.removeElement(item.tab);
                delete cache.items[itemId];
                var c = cache.ids.length;
                for(var i = c - 1; i >= 0; i--) {
                    if(cache.ids[i].toString() === itemId.toString()) {
                        cache.ids.splice(i, 1);
                    }
                }
            }
            return this;
        },
        getLast: function(objId) {
            var cache = this.getCache(objId);
            if(cache && cache.ids.length > 0) {
                var itemId = cache.ids[cache.ids.length - 1];
                return cache.items[itemId];
            }
            return null;
        },
        getNext: function(objId, itemId, curPos) {
            var cache = this.getCache(objId), items = [];
            if (!cache || !cache.ids.length) {
                return null;
            }
            for (var k in cache.items) {
                items.push(cache.items[k]);
            }
            items.sort(function(a, b) {
                return a.pos - b.pos;
            });

            // 关闭标签后，查找下一个或上一个相邻的标签
            // 优先查找已经打开（或加载）的标签
            // 其次查找曾经打开（或加载）过的标签
            function _find(items, len, curPos, reverse, loaded, closed) {
                var i, j, t;
                for (i = 0; i < len; i++) {
                    j = reverse ? len - 1 - i : i;
                    t = items[j];
                    if ((reverse ? t.pos < curPos : t.pos > curPos) && 
                        (!loaded || (!t.iframe || t.iframe.loaded)) &&
                        (!closed || (!t.iframe || t.iframe.closed))) {
                        return t;
                    }
                }
            }
            var len = items.length;

            //1.找下一个已经打开的标签
            //2.找上一个已经打开的标签
            //3.找下一个曾经打开的标签
            //4.找上一个曾经打开的标签
            //5.找下一个标签
            //6.找上一个标签
            return _find(items, len, curPos, false, true, false) ||
                _find(items, len, curPos, true, true, false) ||
                _find(items, len, curPos, false, false, true) ||
                _find(items, len, curPos, true, false, true) ||
                _find(items, len, curPos, false, false, false) ||
                _find(items, len, curPos, true, false, false) ||
                null;
        },
        getCur: function(t, cache) {
            cache = cache || this.getCache(t.id);
            return cache.cur;
        },
        setCur: function(t, cur, force) {
            var cache = this.getCache(t.id),
                oldCur = Factory.getCur(t, cache);
            if(!force && oldCur && Factory.getItem(cache, oldCur.itemId)) {
                return this;
            }
            cache.cur = cur;
            return this;
        },
        getOptions: function(objId) {
            var key = 't_' + objId;
            var cache = Cache.tabs[key];
            if(cache) {
                return cache.options;
            }
            return null;
        },
        loadCss: function (skin, func) {
            $.loadJsScriptCss(Config.FilePath, skin, func, Config.FileName);
            return this;
        },
        buildTab: function(tabContainer, conContainer, options) {
            var tab = $.toElement(tabContainer),
                con = $.toElement(conContainer);

            if(!$.isElement(tab) || !$.isElement(con)) {
                console.log('oui.tab: ', '参数输入错误');
                return null;
            }
            var par = $.extend({}, options),
                id = Config.IdPrefix + (par.id || tab.id || Cache.index++),
                opt = $.extend({}, options, {id: id}),
                cache = Factory.getCache(opt.id);

            if(!cache) {
                return new Tab(tab, con, opt);
            }
            return cache.obj;
        },
        getObjIds: function(objId, itemId) {
            var opt = {};
            if($.isObject(objId)) {
                opt.objId = objId.objId || objId.tabId;
                if($.isUndefined(itemId)) {
                    opt.itemId = objId.itemId || objId.id;
                }
            } else {
                opt.objId = objId;
                opt.itemId = itemId;
            }
            return opt;
        },
        insert: function(options, insertIndex, show) {
            var opt = this.getObjIds(options),
                //这里要加上前缀 oui-tabs-
                cache = this.getCache(Config.IdPrefix + opt.objId);
            return cache ? cache.obj.insert(options, insertIndex, show) : null;
        },
        show: function(objId, itemId, func, reload) {
            var opt = this.getObjIds(objId, itemId),
                cache = this.getCache(Config.IdPrefix +opt.objId);
            return cache ? cache.obj.show(opt.itemId, func, reload) : null;
        },
        remove: function(objId, itemId) {
            var opt = this.getObjIds(objId, itemId),
                cache = this.getCache(Config.IdPrefix +opt.objId);
            return cache ? cache.obj.close(itemId) : null;
        },
        removeAll: function(objId, exceptItemId) {
            var opt = this.getObjIds(objId, exceptItemId),
                //这里要加上前缀 oui-tabs-
                cache = this.getCache(Config.IdPrefix + opt.objId);
            return cache ? cache.obj.closeAll(exceptItemId) : null;
        },
        reload: function(objId, itemId, isAll) {
            var opt = this.getObjIds(objId, itemId),
                cache = this.getCache(Config.IdPrefix +opt.objId);
            return cache ? (isAll ? cache.objId.reloadAll() : cache.obj.reload(opt.itemId)) : null;
        },
        hideParentTabMenu: function() {
            Util.hideAllContextMenu();
            return this;
        }
    };

    //先加载(默认)样式文件
    Factory.loadCss(Config.DefaultSkin);
    //加载指定的(默认)样式文件
    if(!Config.IsDefaultSkin()) {
        Factory.loadCss(Config.GetSkin());
    }

    function Tab(tabContainer, conContainer, options) {
        var that = this, cssTab = '', cssCon = '';
        that.tabContainer = $.toElement(tabContainer);
        that.conContainer = $.toElement(conContainer);
        if(!$.isElement(that.tabContainer) || !$.isElement(that.conContainer)) {
            return false;
        }

        var cfg = {
            id: 'oui-tabs',
            skin: Config.DefaultSkin,       //样式: default, blue
            //lang: 'chinese',              //chinese, english
            lang: Config.GetLang(),         //语言 Chinese,English
            type: 'switch',     //switch, scroll
            event: 'click',     //click, mouseover
            dblclickScroll: false,
            showContextMenu: true,
            //切换按钮宽度
            tabSwitchWidth: Config.CMenuSwitchWidth,
            tabsep: false,
            // Tab最大数量
            maxCount: 30,
            // Tab标签最大宽度
            maxWidth: 240,
            // Tab高度
            tabHeight: 32,
            conHeight: 400,
            //是否隐藏选项卡
            hideTab: false,
            style: {
                //box: 'margin: 0 5px;',
                //tab: 'margin: 0 1px 0 1px;',
                //txt: 'font-size:14px;',
                //panel: 'overflow: hidden;'
            },
            items: []
        };
        options = Util.checkOptions(options);
        $.extend(cfg.style, options.style);
        //再删除参数中的style，防止参数覆盖
        delete options.style;

        var opt = $.extend(cfg, options);

        that.id = opt.id || '';
        that.cur = '';

        if (opt.skin !== Config.DefaultSkin) {
            cssTab = ' oui-tabs-' + opt.skin;
            cssCon = ' oui-tabs-' + opt.skin + '-contents';
            Factory.loadCss(opt.skin);
        }
        if (opt.tabsep) {
            cssTab += ' oui-tabs-sep';
        }
        $.addClass(that.tabContainer, 'oui-tabs' + cssTab);
        $.addClass(that.conContainer, 'oui-tabs-contents' + cssCon);

        that.initial(opt);
    }

    Tab.prototype = {
        initial: function(opt) {
            var that = this;
            if(that.box) {
                return this;
            }
            Factory.initCache(that.id, opt, that);

            if (opt.hideTab) {
                that.showTab(false);
            }

            Util.initialTab(that, opt);
            
            $.addListener(window, 'resize', function() {
                Util.setSize(that);
            });
            $.addListener(document, 'mousedown', function(ev) {
                Util.hideContextMenu(ev, that);
            });

            if($.isArray(opt.items) && opt.items.length > 0) {
                var showId = '';
                for(var i = 0; i < opt.items.length; i++) {
                    var dr = opt.items[i];
                    if(dr) {
                        if(dr.show && !showId) {
                            showId = dr.id;
                        }
                        that.add(dr);
                    }
                }
                if(showId) {
                    that.show(showId);
                }
            }

            //如果content没有设置高度，则设置一个默认的高度
            //content高度可以通过setContentSize()
            if (opt.conHeight && isNaN(parseInt(that.conContainer.style.height))) {
                that.conContainer.style.height = opt.conHeight + 'px';
            }

            //滚动模式
            if (opt.type === 'scroll') {
                that.conContainer.style.overflow = 'auto';

                var cache = Factory.getCache(that.id);
                that.scrollTimer = null;
                $.addListener(that.conContainer, 'scroll', function(ev, par) {
                    var box = that.conContainer;
                    if (that.scrollTimer) {
                        window.clearTimeout(that.scrollTimer);
                    }
                    that.scrollTimer = window.setTimeout(function() {
                        var bs = $.getOffset(box);
                        for(var k in cache.items) {
                            var cs = $.getOffset(cache.items[k].con);
                            if ((cs.top <= bs.top && (cs.top + cs.height > bs.top + bs.height)) ||
                                (cs.top >= bs.top && cs.top < bs.top + bs.height)) {
                                if (cache.items[k].tab.className.indexOf('cur') < 0) {
                                    that.scrollSwitch(cache.items[k].tab);
                                }
                                break;
                            }
                        }
                    }, 100);
                });
            }

            return that;
        },
        getOptions: function() {
            return Factory.getOptions(this.id);
        },
        add: function(options, show, reopen) {
            return this.insert(options, null, show, reopen);
        },
        insert: function(options, insertIndex, show, reopen) {
            var that = this,
                cache = Factory.getCache(that.id),
                cfg = that.getOptions(),
                opt = $.extend({
                    closeAble: true,
                    //是否加载iframe内容
                    load: true,
                    //默认显示
                    show: false
                }, options),
                isShow = $.isBoolean(show, false);

            if (!Util.checkOptionItem(opt)) {
                return this;
            }

            opt.closeAble = $.keywordOverload(opt, ['closeAble', 'close']);

            //判断数量是否超出限制
            if(cache.ids.length >= cfg.maxCount) {
                if(typeof $.alert !== 'undefined') {
                    $.alert(Util.getLangText('overrun', opt.lang), { id:'oui-tabs-count-limit-001' });
                } else if(!reopen) {
                    alert(Util.getLangText('overrun'), opt.lang);
                }
                return that;
            }
            Util.buildTab(that, opt, that.getOptions(), insertIndex, opt.type)
                .setSize(that, function() {
                    if(isShow) {
                        that.show(opt.id);
                        Util.setSize(that);
                    }
                });

            if($.isFunction(opt.func)) {
                opt.func(opt, that);
            } else if($.isFunction(cfg.callback)) {
                cfg.callback(opt, that);
            }

            //再设置一次尺寸大小，原因不确定
            window.setTimeout(function(){
                Util.setSize(that);
            }, 25);

            return that;
        },
        show: function(itemId, func, reload) {
            var that = this,
                cfg = that.getOptions(),
                cache = Factory.getCache(that.id);
            if(null === cache) {
                return that;
            }
            if ($.isBoolean(func) && $.isUndefined(reload)) {
                reload = func;
                func = null;
            }
            for(var k in cache.items) {
                $.removeClass(cache.items[k].tab, 'cur');
                if (cfg.type !== 'scroll') {
                    $(cache.items[k].con).hide();
                }
            }
            var cur = cache.items[itemId]  
                || Factory.getCur(that, cache)
                || Factory.getItem(cache);

            if(cur) {
                $.addClass(cur.tab, 'cur');

                if (cfg.type !== 'scroll') {
                    $(cur.con).show();
                } else {
                    $.scrollTo(cur.con);
                }
                /*
                if(cur.iframe && !cur.iframe.loaded) {
                    Util.loadPage(that, cur.iframe, cur.opt.url);
                }
                */
                if(cur.iframe) {
                    Util.loadPage(that, cur.iframe, cur.opt.url, reload);
                    $.removeClass(cur.tab, 'pre');
                }
                Factory.setCur(that, cur, true);
                Util.setTabPosition(that, cur.tab);
            }

            Util.setSize(that);

            if($.isFunction(func)) {
                func(itemId, that);
            } else if($.isFunction(cfg.callback)) {
                cfg.callback(itemId, that);
            }

            if(itemId) {
                that.cur = itemId;
                window.setTimeout(function() { that.show(); }, 20);
            }

            return that;
        },
        showTab: function (show) {
            var that = this;
            that.tabContainer.style.display = show ? 'block' : 'none';
            return that;
        },
        close: function(itemId, onlyCloseContent) {
            var that = this,
                cache = Factory.getCache(that.id),
                item = Factory.getItem(cache, itemId),
                cur = Factory.getCur(that),
                change = false,
                newId = '';

            if(!item || !item.closeAble) {
                return that;
            }

            if (onlyCloseContent) {
                Factory.delItemUrl(that, itemId);
                $.addClass(item.tab, 'pre');
            } else {
                Factory.delItem(that, itemId);
            }

            if(cur) {
                //关闭当前页，需要重新设置一个新的当前页
                if(itemId === cur.itemId) {
                    change = true;
                    //var item = Factory.setCur(that, null, true).getLast(that.id);
                    var curIdx = cur.idx,
                        item = Factory.setCur(that, null, true).getNext(that.id, itemId, curIdx);

                    if(item) {
                        newId = item.itemId;
                    }
                }
            }

            if(change) {
                that.show(newId);
            } else {
                Util.setSize(that);
            }
            return that;
        },
        closeAll: function(exceptItemId) {
            var that = this;
            Factory.delItem(that, true, exceptItemId).setCur(that, null);
            Util.setSize(that, function() {
                that.show('');
            });
            return that;
        },
        reload: function(itemId) {
            var that = this,
                cache = Factory.getCache(that.id),
                item = Factory.getItem(cache, itemId || that.cur);

            //$.console.log('reload:', itemId || that.cur);

            if(item && item.iframe) {
                Util.loadPage(that, item.iframe, item.opt.url, true);
            }
            return that;
        },
        reloadAll: function() {
            var that = this,
                cache = Factory.getCache(that.id);

            for(var k in cache.items) {
                var dr = cache.items[k];
                if(dr.iframe) {
                    this.loadPage(that, dr.iframe, dr.opt.url, true);
                }
            }
            return that;
        },
        update: function (id, content, append) {
            var that = this,
                panel = $I(Util.buildPanelId(that.id, id));

            if (!panel) {
                return that;
            }
            if (append) {
                panel.innerHTML += content;
            } else {
                panel.innerHTML = content;
            }

            return that;
        },
        setContentSize: function(size, isContent, opt) {
            var that = this, tabHeight = 0, itemId = '',
                cfg = that.getOptions(),
                parent = that.conContainer.parentNode;

            opt = $.extend(cfg, opt);

            //若是纯内容框高度，则选项卡高度不参与计算
            tabHeight = isContent ? 0 : $.getOuterSize(that.tabContainer).height;

            if($.isObject(size)) {
                that.conContainer.style.height = (size.height - tabHeight) + 'px';
            } else {
                if($.isString(size)) {
                    itemId = size;
                }
                size = { width: that.conContainer.clientWidth, height: that.conContainer.clientHeight || opt.conHeight };
                size.height += tabHeight;
            }
            //获取父级容器的内宽和内高
            var psize = { width: parent.clientWidth, height: parent.clientHeight - 2 };
            if (size.height <= opt.tabHeight) {
                size.height = psize.height;
            }

            //减去选项卡高度
            size.height -= tabHeight;

            if(itemId) {
                var panel = $I(Util.buildPanelId(that.id, itemId)),
                    iframe = $I(Util.buildIframeId(that.id, itemId));
                    if(panel) {
                        var es = $.elemSize(panel);
                        panel.style.height = (size.height - es.padding.height - es.margin.height - es.border.height) + 'px';
                    }
                    if(iframe) {
                        iframe.style.height = size.height + 'px';
                    }
            } else {
                $('#' + that.conContainer.id + ' .tab-panel').each(function(i, obj) {
                    var es = $.elemSize(obj);
                    obj.style.height = (size.height - es.padding.height - es.margin.height - es.border.height) + 'px';
                });

                $('#' + that.conContainer.id + ' .tab-iframe').each(function(i, obj) {
                    obj.style.height = size.height + 'px';
                });
            }
            return that;
        },
        size: function(size, isContent, opt) {
            this.setContentSize(size, isContent, opt);
            Util.setSize(this);
            return this;
        },
        scrollSwitch: function (tab) {
            var that = this,
                cache = Factory.getCache(that.id);
            if(null === cache) {
                return that;
            }
            for(var k in cache.items) {
                $.removeClass(cache.items[k].tab, 'cur');
            }
            $.addClass(tab, 'cur');

            return that;
        }
    };

    function Tabs(tabContainer, conContainer, options) {
        var that = this, cssTab = '', cssCon = '';
        that.tabContainer = $.toElement(tabContainer);
        that.conContainer = $.toElement(conContainer);
        if (!$.isElement(that.tabContainer) || !$.isElement(that.conContainer)) {
            return false;
        }

        var cfg = {
            type: 'switch',     //switch, scroll
            event: 'click',     //click, mouseover
            skin: 'default',
            tabsep: false,
            style: {
                //box: 'margin: 0 5px;',
                //tab: 'margin: 0 1px;',
                //txt: 'font-size:14px;',
                //panel: 'overflow: hidden;'
            },
            callback: function (key, tab) {
                //$.console.log('callback:', key, tab);
            }
        }, opt = Util.checkOptions(options);

        $.extend(cfg.style, opt.style);
        //再删除参数中的style，防止参数覆盖
        delete opt.style;

        that.options = $.extend(cfg, opt);
        that.initial(that.options);
    }

    Tabs.prototype = {
        initial: function(opt) {
            var that = this, isScroll = opt.type === 'scroll', cssTab = '', cssCon = '';

            if (opt.skin !== Config.DefaultSkin) {
                cssTab = ' oui-tabs-' + opt.skin;
                cssCon = ' oui-tabs-' + opt.skin + '-contents';
                Factory.loadCss(opt.skin);
            }
            if (opt.tabsep) {
                cssTab += ' oui-tabs-sep';
            }
            $.addClass(that.tabContainer, 'oui-tabs' + cssTab);
            $.addClass(that.conContainer, 'oui-tabs-contents' + cssCon);

            //var tabs = that.tabContainer.childNodes, cons = that.conContainer.childNodes;
            var tabs = that.tabContainer.querySelectorAll('a'),
                cons = that.conContainer.querySelectorAll('div'),
                i;

            that.tabs = tabs;
            that.cons = [];
            for (i = 0; i < cons.length; i++) {
                if (cons[i].parentNode === that.conContainer) {
                    that.cons.push(cons[i]);
                }
            }

            if (that.tabs.length > 0) {
                var parent = tabs[0].parentNode;
                if (parent.className.indexOf('oui-tabs') > -1) {
                    $.createElement('DIV', '', function(elem) {
                        elem.className = 'tab-box';
                        if (opt.style.box) {
                            elem.style.cssText = opt.style.box;
                        }
                        for (var i = 0; i < that.tabs.length; i++) {
                            elem.appendChild(that.tabs[i]);
                        }
                        elem.oncontextmenu = function(ev) {
                            return false;
                        };                
                        that.tabContainer.appendChild(elem);
                    });
                    if (opt.tabsep) {
                        $.createElement('DIV', '', function(elem) {
                            elem.className = 'tab-sep';
                            that.tabContainer.appendChild(elem);
                        });
                    }
                } else {
                    $.addClass(parent, 'tab-box');
                    if (opt.style.box) {
                        parent.style.cssText = opt.style.box;
                    }
                    parent.oncontextmenu = function(ev) {
                        return false;
                    };
                    if (opt.tabsep) {
                        $.createElement('DIV', '', function(elem) {
                            elem.className = 'tab-sep';
                            parent.parentNode.appendChild(elem);
                        });
                    }
                }
            }
            for(var i = 0; i < that.tabs.length; i++) {
                $.addClass(that.tabs[i], 'tab-item');
                if (opt.style.tab) {
                    that.tabs[i].style.cssText = opt.style.tab;
                }
                $.addListener(that.tabs[i], opt.event, function() {
                    var key = $.getAttribute(this, 'tab|key|rel');
                    that.show(key);
                });
            }
            if(isScroll) {
                that.conContainer.style.overflow = 'auto';

                that.scrollTimer = null;
                $.addListener(that.conContainer, 'scroll', function(ev, par) {
                    var box = that.conContainer;
                    if (that.scrollTimer) {
                        window.clearTimeout(that.scrollTimer);
                    }
                    that.scrollTimer = window.setTimeout(function() {
                        var bs = $.getOffset(box);
                        for (var i = 0; i < that.cons.length; i++) {
                            var cs = $.getOffset(that.cons[i]);
                            if ((cs.top <= bs.top && (cs.top + cs.height > bs.top + bs.height)) ||
                                (cs.top >= bs.top && cs.top < bs.top + bs.height)) {
                                if (that.tabs[i].className.indexOf('cur') < 0) {
                                    that.scrollSwitch(i);
                                }
                                break;
                            }
                        }
                    }, 100);
                });
            }

            for(var i = 0; i < that.cons.length; i++) {
                if(!isScroll) {
                    that.cons[i].style.display = 'none';
                }
                $.addClass(that.cons[i], 'tab-panel');
            }
            return that;
        },
        show: function(key) {
            var that = this, 
                opt = that.options, 
                isScroll = opt.type === 'scroll',
                isIndex = $.isNumber(key);

            var tabs = that.tabs,
                cons = that.cons;

            for(var i = 0; i < cons.length; i++) {
                $.removeClass(Util.getTabElem(tabs[i]), 'cur');
                if (!isScroll) {
                    cons[i].style.display = 'none';
                }
            }
            if($.isUndefined(key)) {
                if(tabs.length > 0) {
                    $.addClass(Util.getTabElem(tabs[0]), 'cur');
                }
                if (!isScroll) {
                    if(cons.length > 0) {
                        cons[0].style.display = '';
                    }
                }
            } else {
                //设置当前TAB项样式
                for(var i = 0; i < tabs.length; i++) {
                    var k = $.getAttribute(tabs[i], 'tab|key|rel');
                    if((isIndex && i === key) || key === k) {
                        $.addClass(Util.getTabElem(tabs[i]), 'cur');
                        break;
                    }
                }
                //显示当前TAB项内容
                for(var i = 0; i < cons.length; i++) {
                    var k = $.getAttribute(tabs[i], 'tab|key|rel');
                    if((isIndex && i === key) || key === k) {
                        if (isScroll) {
                            $.scrollTo(cons[i]);
                        } else {
                            cons[i].style.display = '';
                        }
                        break;
                    }
                }
            }
            if ($.isFunction(opt.callback)) {
                opt.callback(key, that);
            }
            return that;
        },
        scrollSwitch: function (key) {
            var that = this, 
                isIndex = $.isNumber(key),
                tabs = that.tabs,
                cons = that.cons;

            for(var i = 0; i < tabs.length; i++) {
                var k = $.getAttribute(tabs[i], 'tab|key|rel');
                if((isIndex && i === key) || key === k) {
                    $.addClass(Util.getTabElem(tabs[i]), 'cur');
                } else {
                    $.removeClass(Util.getTabElem(tabs[i]), 'cur');
                }
            }
            return that;
        }
    };

    $.extend({
        tab: function(tabContainer, conContainer, options) {
            return Factory.buildTab(tabContainer, conContainer, options);
        },
        tabs: function(tabContainer, conContainer, options) {
            return new Tabs(tabContainer, conContainer, options);
        }
    });

    $.extend($.tab, {
        add: function(options, show) {
            return Factory.insert(options, null, show);
        },
        insert: function(options, insertIndex, show) {
            return Factory.insert(options, insertIndex, show);
        },
        show: function(objId, itemId, func, reload) {
            return Factory.show(objId, itemId, func, reload);
        },
        remove: function(objId, itemId) {
            return Factory.remove(objId, itemId);
        },
        close: function(objId, itemId) {
            return Factory.remove(objId, itemId);
        },
        closeAll: function(objId, exceptItemId) {
            return Factory.removeAll(objId, exceptItemId);
        },
        reload: function(objId, itemId) {
            return Factory.reload(objId, itemId, false);
        },
        reloadAll: function(objId, itemId) {
            return Factory.reload(objId, itemId, true);
        },
        hideParentTabMenu: function() {
            return Factory.hideParentTabMenu();
        }
    });
}(OUI);