!function($) {

    var Util = {
        checkOption: function(options) {
            var opt = {
                x: 0,
                y: 0,
                text: ''
            };
            $.extend(opt, options);
            return opt;
        },
        setLocation: function(obj, options) {

        }
    };

    function Marker(options) {
        this.icon = null;
        this.label = null;

        this.options = Util.checkOption(options);

        this.initial(this.options);
    }

    Marker.prototype = {
        initial: function(options) {
            
            return this.build(options);
        },
        build: function(options) {

            return this.show(true);
        },
        move: function(options) {
            var x = options.x || options.left || options.lng,
                y = options.y || options.top || options.lat;

            return this;
        },
        show: function(options, isShow) {
            var show = $.isBoolean(isShow, true);

            if(show) {
                this.icon.style.display = 'block';
                this.label.style.display = 'block';
            } else {
                this.icon.style.display = 'none';
                this.icon.style.display = 'none';
            }

            return this; 
        },
        hide: function(options) {
            return this.hide(options, false);
        },
        remove: function() {

            return this;
        }
    };

    function EMap() {

    }

    EMap.prototype = {
        initial: function() {

        },
        show: function() {

        },
        hide: function() {

        },
        move: function() {

        },
        zoom: function() {

        },
        showMarker: function() {

        },
        removeMarker: function() {

        }
    };

    

}(OUI);