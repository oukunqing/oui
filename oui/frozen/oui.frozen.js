
/*
 @Title: oui.frozen.js
 @Description：表头锁定插件
 @Author: oukunqing
 @License：MIT
*/

!function ($) {
    'use strict';

    var Factory = {

    };

    function Frozen() {

    }

    Frozen.prototype = {
        initial: function() {
            var that = this;

            $.addListener(window, 'resize', function() {
                that.resize();
            });

            return that;
        },
        show: function() {

            return this;
        },
        hide: function() {

            return this;
        },
        clear: function() {

            return this;
        },
        update: function() {

            return this;
        },
        resize: function() {

            return this;
        }
    };

    $.extend({
        frozen: function(obj, options) {
            
        }
    });

}(OUI);