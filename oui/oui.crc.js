
!function($){
    'use strict';

    var CRC = function(){
        var CRC16 = function(bytes, isReverse) {
            var len = bytes.length, crc = 0xFFFF;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    crc = (crc ^ (bytes[i]));
                    for (var j = 0; j < 8; j++) {
                        crc = (crc & 1) !== 0 ? ((crc >> 1) ^ 0xA001) : (crc >> 1);
                    }
                }
                var high = (crc & 0xFF00) >> 8, low = crc & 0x00FF;
                return isReverse ? (high + low * 0x100) : (high * 0x100 + low);
            }
            return 0;
        }, strToByte = function(s) {
            if ($.isArray(s) && typeof s[0] === 'number') {return s; }
            var chars = s.split(''), len = chars.length, arr = [];
            for (var i = 0; i < len; i++) {
                var char = encodeURI(chars[i]);
                if (char.length === 1) {
                    arr.push(char.charCodeAt());
                } else {
                    var byte = char.split('%'), c = byte.length;
                    for (var j = 1; j < c; j++) {
                        arr.push(parseInt('0x' + byte[j]));
                    }
                }
            }
            return arr;
        }, strToHexByte = function(str, isFilter) {
            var hex = strToHexChar(str, isFilter).join('').replace(/\s/g, "");
            //若字符个数为奇数，补一个空格
            hex += hex.length % 2 != 0 ? " " : "";

            var c = hex.length / 2, arr = [];
            for (var i = 0; i < c; i++) {
                arr.push(parseInt(hex.substr(i * 2, 2), 16));
            }
            return arr;
        }, strToHexChar = function(str, isFilter) {
            var tmp = str.split(''), arr = [];
            for (var i = 0, c = tmp.length; i < c; i++) {
                var s = tmp[i].charCodeAt();
                if (s > 0 && s < 127) {
                    arr.push(tmp[i]);
                } else if (!isFilter) {
                    arr.push(s.toString(16));
                }
            }
            return arr;
        }, toHex = function(n, w){
            return n.toString(16).toUpperCase().padStart(w, '0');
        };

        return {
            toCRC16: function(s, isReverse) {
                return toHex(CRC16(strToByte(s), isReverse), 4);
            },
            toModbusCRC16: function(s, isReverse) {
                return toHex(CRC16(strToHexByte(s), isReverse), 4);
            }
        };
    };
    
    $.CRC = CRC;
}(OUI);
