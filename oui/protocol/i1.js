
!function($) {
    'use strict';

    $.extendNative($, {
        protocol: {
            i1: {
                packet_type: 0,
                frame_type: 0,
                frame_no: 0,
                body: ''
            }
        }
    });

    $.extendNative(String.prototype, {
        parsei1: function() {

        },
        buildi1: function() {

        }

    }, 'String.prototype');

}(OUI);