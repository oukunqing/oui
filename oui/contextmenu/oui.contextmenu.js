
!function(){

    var Config = {
        FilePath: $.getScriptSelfPath(true)
    },
    Cache = {
        menus: {},
        count: 0
    },
    Util = {

    },
    Factory = {
        buildContextMenu: function(options) {

        }
    };

    function ContextMenu(options){

    }

    $.extend({
        contextmenu: function(options) {
            return Factory.buildContextMenu(options);
        }
    });

    $.extend($.contextmenu, {
        add: function(options) {

        },
        insert: function(options, insertIndex) {

        },
        remove: function(menuId, itemId) {

        },
        close: function(menuId) {

        },
        closeAll: function() {

        },
        hideParentContextMenu: function() {

        }
    });

}(OUI);