! function($) {
    'use strict';

    $.extendNative($, {
        protocol: {
            i1: {
                body_len: 0,
                msg_len: 0,
                device_id: '',
                frame_type: 0,
                packet_type: 0,
                frame_no: 0,
                body: '',
                crc: ''
            }
        }
    });

    var STEP = 2;

    var Config = {
        MIN_LEN: 27,
        HEAD_LEN: 2,
        FLAG_LEN: 2,
        DEV_LEN: 17,
        PRE_LEN: 21,
        BASE_LEN: 24,
        CRC_LEN: 2
    };

    var Factory = {
        getHeadPos: function(msg) {
            var pos = msg.indexOf('a55a');
            return pos;
        },
        parse: function(msg_hex) {
            var o = $.protocol.i1;

            var len = msg_hex.length;
            if (len < Config.MIN_LEN * STEP) {
                return o;
            }

            var posHead = Factory.getHeadPos(msg_hex);
            if (posHead < 0) {
                return o;
            }
            o.body_len = msg_hex.substr(posHead + Config.HEAD_LEN * STEP, Config.FLAG_LEN * STEP).hexToInt(true);
            o.msg_len = o.body_len + Config.MIN_LEN;
            o.device_id = msg_hex.substr(posHead + Config.HEAD_LEN * STEP + Config.FLAG_LEN * STEP, Config.DEV_LEN * STEP).getHexStr().hexToStr();
            o.frame_type = msg_hex.substr(posHead + Config.PRE_LEN * STEP, STEP).hexToInt();
            o.packet_type = msg_hex.substr(posHead + Config.PRE_LEN * STEP + STEP, STEP).hexToInt();
            o.packet_type_hex = msg_hex.substr(posHead + Config.PRE_LEN * STEP + STEP, STEP);
            o.frame_no = msg_hex.substr(posHead + Config.PRE_LEN * STEP + 2 * STEP, STEP).hexToInt();
            o.crc = msg_hex.substr(posHead + Config.BASE_LEN * STEP + o.body_len * STEP, Config.CRC_LEN * STEP);
            o.body = msg_hex.substr(posHead + Config.BASE_LEN * STEP, o.body_len * STEP);
            o.con = o.body.hexToStr();

            var pos = o.con.indexOf('{'), posEnd = o.con.lastIndexOf('}');
            if (pos >= 0 && posEnd > 0) {
                o.cmd = o.con.substr(pos, posEnd - pos + 1).toJson();
            }

            return o;
        }
    };

    $.extendNative(String.prototype, {
        parsei1: function() {

        },
        buildi1: function() {

        }

    }, 'String.prototype');


    $.extend({
        i1: function(msg_hex) {
            return Factory.parse(msg_hex);
        }
    });

}(OUI);