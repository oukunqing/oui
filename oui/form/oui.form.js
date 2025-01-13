
/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.form plugin

    $.input 输入框控制: $.input.setFormat, $.setInputFormat, $.setInputIcon
*/

// $.form
!function ($) {
    'use strict';

    var Config = {
        DATE_FORMAT: 'data-time,data-timeformat,date-format,dateformat',
        DATA_FORMAT: 'data-format,dataformat,value-format,valueformat',
        OLD_VALUE: 'old-value,oldvalue',
        DATA_EXCEPT: 'data-except,except',
        DATA_REQUIRED: 'required,data-required', 
        DATA_READONLY: 'readonly,data-readonly',
        DATA_EDITABLE: 'editable,data-editable',
        DATA_TYPE: 'data-type,datatype,value-type,valuetype',
        ENCODE: 'data-encode,encode,encode-html,encodeHtml,encodeHTML',
        DECODE: 'data-decode,decode,decode-html,decodeHtml,decodeHTML',
        FILTER: 'data-filter,filter,filter-html,filterHtml,filterHTML',
        DATA_SHOW: 'data-show,data-auto',
        MIN_VALUE: 'data-min,min-value,minvalue,minValue,min-val',
        MAX_VALUE: 'data-max,max-value,maxvalue,maxValue,max-val',
        VAL_LENGTH: 'data-length,data-len,value-length,val-length,val-len',
        MIN_LENGTH: 'min-length,min-len',
        MAX_LENGTH: 'max-length,max-len',
        DEFAULT_VALUE: 'data-value,data-val,data-default,data-def,default-value,defaultvalue,dv',
        OPPTION_VALUE: 'data-options,data-option,option-value,values,options,opt-val'
    };

    var isElement = function (element) {
        return element !== null && typeof element === 'object' && typeof element.nodeType === 'number';
    },
    initFormConfig = function (formElement, options, elements) {
        if ($.isString(formElement)) { formElement = document.getElementById(formElement.replace(/^[#]+/, '')); }
        if (!$.isElement(formElement) || !formElement.getElementsByTagName) {
            //throw new Error('element 参数错误');
            //throw new Error('element \u53c2\u6570\u9519\u8bef');
            console.error('element \u53c2\u6570\u9519\u8bef');
            return false;
        }
        var id = formElement.id || '',
            opt = $.extend({}, options);

        opt.tagPattern = opt.tagPattern || opt.tagAppend || opt.tagNames || opt.tagName;

        var messages = {
            required: '\u8bf7\u8f93\u5165{0}',//请输入
            select: '\u8bf7\u9009\u62e9{0}',//请选择
            minLength: '{0}\u8bf7\u52ff\u5c0f\u4e8e{1}\u4e2a\u5b57\u7b26',
            maxLength: '{0}\u8bf7\u52ff\u8d85\u8fc7{1}\u4e2a\u5b57\u7b26',
            //{0}长度为{1}个字符
            valLength: '{0}\u957f\u5ea6\u4e3a{1}\u4e2a\u5b57\u7b26',
            //请输入 u5165大于或等于 的
            minValue: '\u8bf7\u8f93\u5165\u5927\u4e8e\u6216\u7b49\u4e8e{0}\u7684{1}',
            //请输入 小于或等于 的
            maxValue: '\u8bf7\u8f93\u5165\u5c0f\u4e8e\u6216\u7b49\u4e8e{0}\u7684{1}',
            //请输入  之间的
            minMax: '\u8bf7\u8f93\u5165{0} - {1}\u4e4b\u95f4\u7684{2}',
            //请输入
            number: '\u8bf7\u8f93\u5165{0}',
            //请输入正确的
            pattern: '\u8bf7\u8f93\u5165\u6b63\u786e\u7684{0}',
            //输入有误
            optionValue: '{0}\u8f93\u5165\u6709\u8bef'
        },
            highLight = {
                styleId: 'form-validate-css-' + id,
                className: 'form-validate-css-' + id,
                cssText: 'border:solid 1px #f00;'
            },
            op = {
                tagPattern: new RegExp('INPUT|SELECT|TEXTAREA' + (opt.tagPattern ? '|' + opt.tagPattern : ''), 'i'),
                typePattern: /text|hidden|password|select-one|checkbox|radio|email|url|number|range|date|search/,
                valuePattern: {
                    email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
                    url: /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/,
                    date: /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/,
                    identity: /(^\d{15}$)|(^\d{17}(x|X|\d)$)/
                },
                formElement: formElement,
                submitHandler: opt.submitHandler || opt.submit,
                // 如果 opt参数中没有包含 fields 或者 rules 字段，则取整个opt参数作为字段规则
                // 这个情况会出现在直接调用 getFormData 的时候
                fields: opt.fields || opt.rules ? $.extend({}, opt.fields, opt.rules) : $.extend({}, opt),
                configs: $.extend({
                    defaultValue: '',
                    minValue: '',
                    maxValue: '',
                    minLength: '',
                    maxLength: '',
                    valLength: '',
                    optionValue: '',    //选项值
                    tagName: '*',       //指定要获取的HTML标签类型
                    prefix: '',
                    removePrefix: true,
                    checkNumber: true,
                    isJoin: true,
                    joinSeparate: ',',
                    focusInvalid: false,
                    //是否允许空值
                    empty: false,
                    //是否严格模式（检测输入内容的类型）
                    strict: false,
                    //是否显示默认数字,数字型字段，若值为空，则显示默认值或0
                    dataShow: true,
                    md5: false,
                    readonly: null,
                    editable: null,
                    same: { id: '', msg: '' },
                    distinct: { id: '', msg: '' },
                    //检测字段内容是否已存在
                    exists: null,
                    //提示信息回调 function(status, message, element){}
                    //status 验证状态：true-表示通过，false-表示失败
                    tooltip: null,
                    //提示信息显示时长（毫秒），0-表示一直显示，若大于0表示会定时关闭
                    tooltipTime: null,
                    tooltipStyle: null,
                    //外部验证回调函数 function(value, element){} 返回值为 boolean （true|false）
                    //返回 true - 表示验证通过，false-表示验证失败
                    validate: null,
                    singleStep: false,  //单步执行验证
                    highLight: false,   //是否高亮显示
                    highLightStyle: 'border:solid 1px #f00;',   //高亮显示的样式，默认为红色边框
                    ignore: false,
                    dynamic: false,     //表单内容是否动态改变
                    messages: {}
                }, opt.configs),
                messages: $.extend({}, messages, opt.messages),
                trim: function (s) { return ('' + s).replace(/(^[\s]*)|([\s]*$)/g, ''); },
                isMatch: function (key, pattern) {
                    return (pattern || /^[a-z0-9_]+[A-Z]/).test(key) || (pattern || /(^[a-z0-9]+_)[A-Za-z\d]/).test(key);
                },
                checkElement: function (element) {
                    if ($.isString(element)) { element = document.getElementById(element); }
                    if (!$.isObject(element) || !element.getElementsByTagName) { throw new Error('element \u53c2\u6570\u8f93\u5165\u9519\u8bef'); } //参数输入错误
                    return element;
                },
                isCheckBox: function (element, type) { return /^checkbox|radio$/.test(type); },
                isChecked: function (element, type) { return /^checkbox|radio$/.test(type) ? element.checked : true; },
                isSelect: function (element, tag) { return /^SELECT$/.test(tag); },
                isLegalName: function (name) { return name && /^[_A-Za-z]/.test(name); },
                swap: function (o) {
                    var tmp;
                    if (o.minValue && o.maxValue && o.minValue > o.maxValue) {
                        tmp = o.minValue; o.minValue = o.maxValue, o.maxValue = tmp;
                    }
                    if (o.minLength && o.maxLength && o.minLength > o.maxLength) {
                        tmp = o.minLength; o.minLength = o.maxLength, o.maxLength = tmp;
                    }
                    return o;
                },
                getLabels: function () {
                    var arr = formElement.getElementsByTagName('label'),
                        labels = {};

                    for (var i = 0; i < arr.length; i++) {
                        var o = arr[i],
                            f = o.getAttribute('for'),
                            k = op.getKey(f),
                            t = $.getInnerText(o);
                        labels[k] = { title: t, obj: o };
                    }
                    return labels;
                },
                getKey: function (key, configs) {
                    if (!$.isString(key)) {
                        key = '';
                    }
                    if (!$.isObject(configs)) {
                        configs = op.configs;
                    }
                    if (configs.removePrefix && ($.isString(configs.prefix) || $.isBoolean(configs.prefix, false))) {
                        if (op.isMatch(key)) {
                            key = key.replace(/(^[a-z\d]+_)|(^txt|ddl|lbl|chb)[_]?/g, '');
                        } else if ($.isString(configs.prefix) && configs.prefix !== '') {
                            var pos = key.indexOf(configs.prefix);
                            if (pos >= 0) {
                                key = key.substr(pos + configs.prefix.length);
                            }
                        }
                    }
                    return key;
                },
                getValue: function (element, noDefault) {
                    //console.log('getValue: ', element.id, ', field: ', element.field, ', value: ', element.value);
                    var val = element.value;
                    if (element.field) {
                        var attr = element.field.attribute || element.field.attr;
                        // 获取 value 或 指定的属性值 或 默认值
                        return op.trim((!op.isLegalName(attr) ? val : element.getAttribute(attr)) || (!noDefault ? element.field.defaultValue : ''));
                    }
                    return op.trim(val);
                },
                getCheckValue: function (element, value, field, isSingle) {
                    value = value || op.getValue(element);
                    field = field || element.field;
                    isSingle = isSingle || element.isSingle;
                    var configs = element.configs,
                        messages = $.extend({}, op.messages, field.messages),
                        required = !$.isUndefined($.getAttribute(element, Config.DATA_REQUIRED));

                    required = $.isBoolean($.getParamCon(field.required, required), false);
                    $.console.log('get:', element.id, $.getAttribute(element, Config.DATA_REQUIRED), field.required);

                    if (value === 'on') {
                        value = element.checked ? 1 : 0;
                    } else {
                        if (element.checked && field.dataType !== 'string' && $.isNumeric(value)) {
                            switch (field.dataType) {
                                case 'int': case 'long': value = parseInt(value, 10); break;
                                case 'float': case 'double': case 'decimal': value = parseFloat(value, 10); break;
                            }
                        } else if (!element.checked) {
                            value = isSingle && $.isNumeric(value) ? 0 : '';
                        }
                    }
                    if (required && isSingle && !element.checked) {
                        var msg = (messages.select || configs.messages.select).format(field.title || '');
                        return { pass: false, value: value, message: msg };
                    }
                    return { pass: true, value: value, message: '' };
                },
                checkValue: function (element, value, field, configs) {
                    var isEvent = typeof configs === 'undefined', keyCode = 0;
                    if (isEvent && value) {
                        keyCode = $.getKeyCode(value);
                        value = null;
                    }
                    value = value || op.getValue(element);
                    field = field || element.field;
                    configs = configs || element.configs;

                    //获取元素内容时，若元素指定了dataformat，则需要去除自动添加的分隔符
                    var fmt = $.getAttribute(element, Config.DATA_FORMAT);
                    if (value !== '' && fmt) {
                        var p = fmt.indexOf(':');
                        //这里一定要把大写的S转换成小写的s
                        //因为在正则表达式中\s表示空白字符，\S表示非空白字符，意思完全相反
                        var k = (p > 0 ? fmt.substr(p + 1, 1) : '').replace('S', 's');
                        if (k) {
                            value = value.replace(new RegExp('\\' + k, 'gi'), '');
                        }
                    }

                    var len = value.length,
                        messages = $.extend({}, op.messages, field.messages),
                        getTitle = function (field, title) {
                            var str = field.title || title,
                                lbl = op.labels[field.key] || {};
                            return str || lbl.title || '';
                        },
                        result = function (pass, value, message) {
                            if (!pass && arguments.length <= 2) { message = value; value = ''; }
                            return { pass: pass, value: value, message: message || '' };
                        },
                        title = getTitle(field, '').replace(/\s/g, ''),
                        required = field.required || !$.isUndefined($.getAttribute(element, Config.DATA_REQUIRED)),
                        readonly = field.readonly || !$.isUndefined($.getAttribute(element, Config.DATA_READONLY)), 
                        editable = field.editable || ['1','true', 'editable'].indexOf($.getAttribute(element, Config.DATA_EDITABLE)) > -1;

                    if (required && !field.empty && '' === value) {   // 空值验证
                        if (field.tag === 'SELECT' || op.isLegalName(field.attribute)) {
                            return result(false, (messages.select || messages.required || configs.messages.select).format(title));
                        } else {
                            return result(false, (messages.required || configs.messages.required).format(title));
                        }
                    }

                    if (field.dataType === 'string') {
                        var pattern = field.pattern || op.valuePattern[field.type], validate = field.validate || configs.validate,
                            minLen = field.minLength || field.minLen,
                            maxLen = field.maxLength || field.maxLen,
                            valLen = field.valLength || field.valLen,
                            optionValue = field.optionValue;

                        if (!$.isInteger(minLen)) {
                            minLen = parseInt($.getAttribute(element, Config.MIN_LENGTH, ''), 10);
                        }
                        if (!$.isInteger(maxLen)) {
                            maxLen = parseInt($.getAttribute(element, Config.MAX_LENGTH, ''), 10);
                        }
                        if (!$.isInteger(valLen)) {
                            valLen = parseInt($.getAttribute(element, Config.VAL_LENGTH, ''), 10);
                        }

                        /*
                            字符串输入验证规则
                            1.外部验证
                            2.若为必填项，无输入，则验证不通过
                            3.若为有输入，不管是否必填，都需要验证字符长度和输入格式
                        */
                        if ($.isFunction(validate)) {    // 外部验证函数（优先）
                            if (!validate(value, element)) { return result(false); }
                        } else if (required && ('' === value || len <= 0)) {
                            return result(false, (messages.required || configs.messages.required).format(title));
                        } else if (len > 0) {
                            if ($.isInteger(valLen) && valLen > 0 && len !== valLen) {
                                return result(false, (messages.valLength || configs.messages.valLength).format(title, valLen));
                            } else if ($.isInteger(minLen) && len < minLen) {      //验证内容长度
                                return result(false, (messages.minLength || configs.messages.minLength).format(title, minLen));
                            } else if ($.isInteger(maxLen) && len > maxLen) {
                                return result(false, (messages.maxLength || configs.messages.maxLength).format(title, maxLen));
                            } else if (pattern && !pattern.test(value)) {   // 正则表达式验证
                                return result(false, (messages.pattern || configs.messages.pattern).format(title));
                            }
                            //字符选项模式
                            if ($.isUndefined(optionValue)) {
                                optionValue = $.getAttribute(element, Config.OPPTION_VALUE, '');
                            }
                            optionValue = optionValue.length > 0 ? optionValue.split(/[,;\|]/) : [];
                            //验证输入内容是否在选项中
                            if ((!editable || readonly) && optionValue.length > 0) {
                                for (var i = 0; i < optionValue.length; i++) {
                                    var ps = optionValue[i].split(/[:\|]/);
                                    if (ps[0] === value) {
                                        return result(true, value);
                                    }
                                }
                                return result(false, (messages.optionValue || configs.messages.optionValue).format(title) + '<br />可选项：' + optionValue);
                            }
                        }
                    } else if (['ip','ipv4'].indexOf(field.dataType) > -1) {
                        //限制内容长度为15个字节
                        element.maxLength = 15;

                        var KEY_CODE_BACKSPACE = 8, KEY_CODE_DELETE = 46;
                        if ([KEY_CODE_BACKSPACE, KEY_CODE_DELETE].indexOf(keyCode) < 0 && /^(local|route|127.|192.|255.|::1)$/i.test(value)) {
                            element.value = (value = value.replace(/^(local|127.|::1)$/i, '127.0.0.1')
                                .replace(/^(route|192.)$/i, '192.168.1.1')
                                .replace(/^255.$/, '255.255.255.0'));
                        } else if (!$.PATTERN.Ip.test(value) && $.isString(value, true)) {
                            return result(false, ('{0}\u683c\u5f0f\u8f93\u5165\u9519\u8bef').format(title));    //格式输入错误
                        }
                    } else {
                        // 验证数字输入，大小值范围限定，其中 type="hidden" 默认值至少为0
                        //数字
                        var val = value.trim(), numType = '\u6570\u5b57', 
                            strict = field.strict || configs.strict;

                        //不是必填项的数字，如果没有填写，则取默认值或0
                        if (value === '' && !required) {
                            value = field.value || 0;
                            var attrShow = $.getAttribute(element, Config.DATA_SHOW, '1').toInt() === 1,
                                dataShow = $.isBoolean($.getParamCon(field.dataShow, attrShow), true);
                            //若指定了不显示默认值（或0），则不显示
                            if (!isEvent && dataShow && typeof element.value !== 'undefined') {
                                element.value = value;
                            }
                        }
                        switch (field.dataType) {
                            case 'int':
                            case 'long':
                                value = parseInt(value, 10);
                                numType = '\u6574\u6570';//整数
                                break;
                            case 'float':
                            case 'double':
                            case 'decimal':
                                value = parseFloat(value, 10);
                                numType = '\u5c0f\u6570';//小数
                                break;
                            case 'port':
                                value = parseInt(value, 10);
                                if (!isNaN(value) && (value < 0 || value > 65535)) {
                                    return result(false, '\u7aef\u53e3\u6570\u503c\u5e94\u4ecb\u4e8e0 - 65535\u4e4b\u95f4'); //端口数值应介于 之间
                                }
                                numType = '\u7aef\u53e3';//端口
                                break;
                            case 'bool':    //布尔值只有2种状态 0 或 1
                                if (!/^([01\s]+|true|false|yes|no)$/i.test(value)) {
                                    return result(false, '\u8bf7\u8f93\u5165\u5e03\u5c14\u503c0\u62161');  //请输入布尔值0或1
                                }
                                if (/^([01][01\s]+|true|false|yes|no)$/i.test(value)) {
                                    value = ('' + value).replace(/^(true|[1][01\s]+|yes)$/i, 1).replace(/^(false|[0][01\s]+|no)$/i, 0);
                                    //value = /^true$/i.test(value) ? 1 : 0;
                                    element.value = value;
                                }
                                value = parseInt(value, 10);
                                //重新赋值
                                val = value.toString();
                                break;
                        } 
                        if (isNaN(value)) {
                            var dv = $.isNumeric(field.value) ? field.value :
                                ($.isNumeric(configs.defaultValue) ? configs.defaultValuel : (element.type === 'hidden' ? 0 : ''));

                            if ($.isNumeric(dv)) {
                                value = dv;
                            } else if (configs.checkNumber) {
                                return result(false, (messages.number || configs.messages.number).format(numType));
                            }
                        }
                        if (configs.checkNumber) {
                            var min = field.minValue || configs.minValue || field.minVal || configs.minVal || field.min || configs.min,
                                max = field.maxValue || configs.maxValue || field.maxVal || configs.maxVal || field.max || configs.max,
                                msg = '';

                            if ($.isUndefined(min)) {
                                min = parseFloat($.getAttribute(element, Config.MIN_VALUE, ''), 10);
                            }
                            if ($.isUndefined(max)) {
                                max = parseFloat($.getAttribute(element, Config.MAX_VALUE, ''), 10);
                            }

                            if (element.tagName.toLowerCase() === 'select') {
                                msg = (messages.select || messages.required || configs.messages.select).format(title);
                            } else {
                                if ($.isNumeric(min) && $.isNumeric(max)) {
                                    msg = (messages.minMax || configs.messages.minMax).format(min, max, numType);
                                } else if ($.isNumeric(min)) {
                                    msg = (messages.minValue || configs.messages.minValue).format(min, numType);
                                } else if ($.isNumeric(max)) {
                                    msg = (messages.maxValue || configs.messages.maxValue).format(max, numType);
                                }
                            }

                            //严格模式，需要验证输入的内容格式，比如验证是否是整数
                            if (strict) {
                                //验证输入的(原始)内容是否是整数
                                if (field.dataType === 'int' && !$.isInteger(val)) {
                                    return result(false, msg);
                                }
                            }
                            if (($.isNumeric(min) && value < min) || ($.isNumeric(max) && value > max)) {
                                return result(false, msg);
                            }

                            var optionValue = field.optionValue;
                            if ($.isUndefined(optionValue)) {
                                optionValue = $.getAttribute(element, Config.OPPTION_VALUE, '');
                            }
                            optionValue = optionValue.length > 0 ? optionValue.split(/[,;\|]/) : [];
                            if ((!editable || readonly) && optionValue.length > 0) {
                                if (val.length <= 0) {
                                    return !required ? result(true, value) : result(false, (messages.required || configs.messages.required).format(title));
                                }
                                for (var i = 0; i < optionValue.length; i++) {
                                    var pv = field.dataType === 'float' ? parseFloat(optionValue[i], 10) : parseInt(optionValue[i], 10);
                                    //parseInt parseFloat 自带容错，比如 0123abc parseInt()之后的结果是数字 123
                                    //虽然结果是数字，但是严格来说，输入是错误的，真正的输入内容应该是 只有123才对
                                    //所以为了严谨起见，不但要比较数值还要比较输入内容
                                    if (pv === value && optionValue[i] === val) {
                                        return result(true, value);
                                    }
                                }
                                return result(false, (messages.optionValue || configs.messages.optionValue).format(title) + 
                                    '<br />\u53ef\u9009\u9879\uff1a' + optionValue.join(', '));     //可选项
                            }
                        }
                    }
                    //相同内容检测
                    if ($.isObject(field.same) && field.same.id) {
                        var target = document.getElementById(field.same.id);
                        if (target && target.value !== value) {
                            //两次输入的内容不一样
                            return result(false, field.same.message || field.same.msg || '\u4e24\u6b21\u8f93\u5165\u7684\u5185\u5bb9\u4e0d\u4e00\u6837');
                        }
                    }
                    //内容去重检测
                    if ($.isObject(field.distinct) && field.distinct.id) {
                        var target = document.getElementById(field.distinct.id);
                        if (target && target.value === value) {
                            return result(false, field.distinct.message || field.distinct.msg || '\u5185\u5bb9\u4e0d\u80fd\u91cd\u590d');//内容不能重复
                        }
                    }
                    //检测内容是否存在
                    if ($.isFunction(field.exists)) {
                        field.exists(element);
                    }
                    return result(true, value);
                },
                showTooltip: function (result, element, isSubmit, forname) {
                    //记录提示信息隐藏次数，防止重复隐藏
                    if ($.isUndefined(element.hideTooltip)) {
                        element.hideTooltip = 0;
                    }
                    var configs = element.configs;
                    var tooltip = element.field.tooltip || configs.tooltip || function (status, message, element) {
                        if (status) {
                            $.tooltip.close(element);
                            $(element).removeClass(highLight.className);
                        } else {
                            var time = element.field.tooltipTime;
                            if (!$.isNumber(time) || time < -1) {
                                time = configs.tooltipTime;
                            }
                            var options = { time: $.isNumber(time) ? time : 0, tipsMore: true, for: forname },
                                position = (element.field || {}).position || configs.position,
                                tooltipStyle = configs.tooltipStyle ||
                                    (configs.styles || configs.style || {}).tooltip ||
                                    op.configs.tooltipStyle ||
                                    (op.configs.styles || op.configs.style || {}).tooltip;

                            if ($.isString(position, true) || $.isNumber(position)) {
                                options.position = position;
                            }
                            if (tooltipStyle) {
                                options.tooltipStyle = tooltipStyle;
                            }
                            $.tooltip(message, element, options);
                            if (configs.highLight) {
                                $(element).removeClass(highLight.className);
                                $(element).addClass(highLight.className);
                            }
                            //单步模式，若输入不为空时，焦点锁定
                            if (configs.singleStep && configs.focusInvalid && (op.getValue(element, true) !== '' || isSubmit)) {
                                op.setFocus(element);
                            }
                        }
                    };
                    if ($.isFunction(tooltip)) { tooltip(result.pass, result.message, element); }
                },
                loadCssCode: function (code) {
                    var head = document.getElementsByTagName('head')[0];
                    if (document.getElementById(highLight.styleId) != null || !head) { return false; }

                    var css = '.' + highLight.className + '{' + (code || highLight.cssText || '') + '}',
                        style = document.createElement('style');

                    style.id = highLight.styleId; style.type = 'text/css'; style.rel = 'stylesheet';

                    if (style.appendChild) {
                        style.appendChild(document.createTextNode(css));    //for Chrome Firefox Opera Safari
                    } else {
                        style.styleSheet.cssText = css; //for IE
                    }
                    head.appendChild(style);
                },
                getFieldConfig: function (element, fields, ignoreCase) {
                    var isValue = function (s) { return !$.isUndefined(s) && !$.isObject(s); },
                        checkField = function (field, elem) {
                            var arr = ['string', 'int', 'float', 'decimal'];
                            if (!$.isString(field.dataType) || arr.indexOf(field.dataType) < 0) {
                                //var elemDataType = $.getAttribute(elem, 'data-type,datatype,value-type,valuetype', '');
                                var elemDataType = $.getAttribute(elem, Config.DATA_TYPE, '');
                                field.dataType = elemDataType || arr[0];
                            }
                            if (!$.isTrue(field.encode)) {
                                field.encode = $.getAttribute(elem, Config.ENCODE, '').isTrue();
                            }
                            if (!$.isTrue(field.decode)) {
                                field.decode = $.getAttribute(elem, Config.DECODE, '').isTrue();
                            }
                            if (!$.isTrue(field.filter)) {
                                field.filter = $.getAttribute(elem, Config.FILTER, '').isTrue();
                            }

                            //默认值字段设置
                            if (field.value === '') {
                                field.value = isValue(field.val) ? field.val : isValue(field.defaultValue) ? field.defaultValue : field.value;
                            }
                            //如果没有设置默认值，则取用（自定义的）默认值属性的值
                            if (field.value === '') {
                                var defVal = $.getAttribute(elem, Config.DEFAULT_VALUE, '');
                                if (!$.isUndefined(defVal)) {
                                    field.value = defVal;
                                }
                            }
                            if (!$.isTrue(field.required) && !$.isFalse(field.required)) {
                                field.required = !$.isUndefined($.getAttribute(elem, Config.DATA_REQUIRED)) || false;
                            }
                            return field;
                        },
                        id = element.id, name = element.name, nodeType = element.nodeType,
                        key = op.getKey(id || name), nameKey = op.getKey(name),
                        keyField = fields[key],
                        isAppointId = fields[op.getKey(id)] || false,
                        isSingle = isAppointId || document.getElementsByName(name || '').length <= 1,
                        dataType = '';

                    if ($.isString(keyField, true)) {
                        dataType = keyField;
                        keyField = {};
                    } else if ($.isObject(keyField)) {
                        if (!$.isBoolean(keyField.required)) {
                            keyField.required = keyField.require || null;
                        }
                        keyField.pattern = keyField.regex || keyField.pattern || '';
                    }

                    var field = checkField(op.swap($.extend({
                        title: '',                  //字段名称（用于提示信息）
                        type: '',                   //字段类型（email,url等），用于格式验证
                        dataKey: '',                //指定值关键字（默认不用指定）
                        dataType: dataType,         //值类型（string,int,float)
                        defaultValue: '',           //默认值 (val, value, defaultValue)
                        value: '',                  //获取到的字段内容
                        attribute: '',              //获取指定的属性值作为value
                        minValue: '', maxValue: '', //最小值、最大值（用于验证输入的数字大小）
                        required: null,             //是否必填项
                        empty: false,               //是否允许空值
                        dataShow: null,             //是否显示默认数字,数字型字段，若值为空，则显示默认值或0
                        strict: false,              //是否严格模式（检测输入内容的类型）
                        md5: false,                 //是否MD5加密
                        encode: false,              //是否进行html标记编码
                        decode: false,              //是否进行html标记解码
                        readonly: null,             //控件是否只读
                        editable: null,             //控件是否可编辑（用于选项输入框）
                        //为加强数据安全，默认过滤HTML标记
                        filter: true,              //是否过滤html标记
                        minLength: '',              //字节最小长度
                        maxLength: '',              //字符最大长度
                        pattern: '',                //正则表达式（内部验证）
                        //提示信息回调 function(status, message, element){}
                        //status 验证状态：true-表示通过，false-表示失败
                        tooltip: null,
                        //提示信息显示时长（毫秒），0-表示一直显示，若大于0表示会定时关闭
                        tooltipTime: null,
                        //给SELECT赋值时，当下拉选项值不存在时，是否追加（特殊情况使用）
                        appendOption: false,
                        //外部验证回调函数 function(value, element){} 返回值为 boolean （true|false）
                        //返回 true - 表示验证通过，false-表示验证失败
                        validate: null,
                        messages: {},               //验证失败时显示的提示信息（为空则显示默认的信息）
                        //tooltip position
                        position: '',
                        tooltipStyle: null,
                        same: { id: '', msg: '' },
                        distinct: { id: '', msg: '' },
                        //检测字段内容是否已存在
                        exists: null
                    }, keyField)), element);

                    if (!$.isObject(field.messages)) {
                        field.messages = { required: field.messages };
                    }
                    field.key = key;
                    //缓存控件Tag类型
                    field.tag = element.tagName;
                    //缓存字段配置
                    element.field = field, element.key = key;
                    //标记元素是Id模式，还是Name数组模式
                    element.isSingle = isSingle;

                    return {
                        id: id, name: name, key: key, nameKey: nameKey, value: op.getValue(element),
                        dataKey: field.dataKey, isSingle: isSingle, field: field
                    };
                },
                setControlEvent: function (element, configs, fieldConfig, formElement) {
                    if (!element.isSetEvent) {
                        var fid = formElement.id;
                        var events = {
                            focus: function () { op.showTooltip(op.checkValue(this), this, false, fid); },
                            blur: function () { op.showTooltip(op.checkValue(this), this, false, fid); },
                            change: function () { op.showTooltip(op.checkValue(this), this, false, fid); },
                            click: function () { op.showTooltip(op.getCheckValue(this), this, false, fid); },
                            keyup: function (ev) { op.showTooltip(op.checkValue(this, ev), this, false, fid); }
                        };

                        if (typeof $.OUI === 'boolean') {
                            if (!configs.focusInvalid) {
                                $.addListener(element, 'focus', events['focus']);
                            }
                            $.addListener(element, 'blur', events['blur']);

                            if (fieldConfig.field.tag === 'SELECT') {
                                $.addListener(element, 'change', events['change']);
                            } else if (op.isCheckBox(element, element.type)) {
                                $.addListener(element, 'click', events['click']);
                            } else {
                                $.addListener(element, 'keyup', events['keyup']);
                            }
                        } else {
                            if (!configs.focusInvalid) {
                                $(element).focus(events['focus']);
                            }
                            $(element).blur(events['blur']);

                            if (fieldConfig.field.tag === 'SELECT') {
                                $(element).change(events['change']);
                            } else if (op.isCheckBox(element, element.type)) {
                                $(element).click(events['click']);
                            } else {
                                $(element).keyup(events['keyup']);
                            }
                        }

                        element.validate = function () {
                            op.showTooltip(op.checkValue(element), element, false, fid);
                        };
                    }
                    //记录是否被创建事件，防止重复创建
                    element.isSetEvent = 1;
                },
                encodeHtml: function (val, encode) {
                    if ($.isString(val, true) && encode) {
                        return val.encodeHtml();
                    }
                    return val;
                },
                decodeHtml: function (val, decode) {
                    if ($.isString(val, true) && decode) {
                        return val.decodeHtml();
                    }
                    return val;
                },
                filterHtml: function (val, filter) {
                    if ($.isString(val, true) && filter) {
                        return val.filterHtml();
                    }
                    return val;
                },
                setValue: function (element, value, fieldConfig, isArray) {
                    var fc = fieldConfig.field || {},
                        attr = fc.attribute || fc.attr,
                        val = isArray ? value.join(',') : value,
                        con = '',
                        elem = $I(element.id) || element;

                    if (!isArray && ('' + val).trim() !== '') {
                        var dtfmt = $.getAttribute(elem, Config.DATE_FORMAT);
                        if (dtfmt && $.isDate(val)) {
                            val = val.format($.isTrue(dtfmt) ? '' : dtfmt || '');
                        } else if (dtfmt && $.isDate(val.toDate(true))) {
                            val = val.toDateString($.isTrue(dtfmt) ? '' : dtfmt || '');
                        } else {
                            var fmt = $.getAttribute(elem, Config.DATA_FORMAT);
                            if (fmt) {
                                val = fmt.format(val);
                            }
                        }
                    }
                    if (!op.isLegalName(attr)) {
                        if (typeof elem.value === 'undefined') {
                            elem.innerHTML = op.encodeHtml(val, fc.decode);
                        } else {
                            elem.value = (con = op.decodeHtml(val, fc.decode));
                            //设置elem.val是为了与$.dropdownlist数据绑定联动
                            elem.val = con;
                        }
                    } else {
                        elem.setAttribute(attr, (con = op.encodeHtml(val, fc.decode)));
                        elem.setAttribute('val', con);
                    }
                    return true;
                },
                setSelectOption: function (element, value, fieldConfig, isArray) {
                    var text = value, val = value, isEmptyArray = false,
                        elem = $I(element.id) || element;

                    if (isArray) {
                        isEmptyArray = 0 === value.length, val = value[0] || '', text = value[1] || val;
                    }
                    elem.value = value;
                    //设置elem.val是为了与$.dropdownlist数据绑定联动
                    elem.val = value;
                    //当下拉选项不存在时，是否追加选项
                    if (fieldConfig.field.appendOption && element.selectedIndex < 0) {
                        if (isEmptyArray) {
                            return false;
                        }
                        elem.options.add(new Option(text, val));
                        //elem.value = value;
                        elem.selectedIndex = element.options.length - 1;
                    }
                },
                setCheckBoxChecked: function (element, value, fieldConfig, isArray) {
                    if (isArray) {
                        if (value.length > 0) {
                            //检测首尾是否是数字，如果是数字，则转换成字符，便于Array.indexOf比较
                            value = $.isNumber(value[0]) || $.isNumber(value[value.length - 1]) ? value.join(',').split(',') : value;
                            var arr = document.getElementsByName(fieldConfig.name), len = arr.length;
                            //检测是否是选框组
                            if (fieldConfig.name && len > 1) {
                                for (var i = 0; i < len; i++) {
                                    if (value.indexOf(arr[i].value) >= 0) {
                                        arr[i].checked = true;
                                    }
                                }
                            } else {
                                if (value.indexOf(element.value) >= 0) {
                                    element.checked = true;
                                }
                            }
                        }
                    } else {
                        value = '' + value;
                        element.checked = element.value === value || (element.value === 'on' && value === '1');
                    }
                },
                setFocus: function (element) {
                    //$(element).focus();
                    element.focus();
                }
            };

        //将默认提示信息附加到configs.messages参数中
        $.extend(op.configs.messages, messages);

        if (op.configs.highLight) {
            op.loadCssCode(op.configs.highLightStyle);
        }
        //单独设置表单内容或简化参数设置时，把prefix参数字段加到options中
        //比如整个options只有一个参数prefix
        //这样就不用嵌套把prefix写成{configs:{prefix:false}},只需要写成{prefix:false}即可
        if (!$.isUndefined(opt.prefix) && !op.configs.prefix) {
            op.configs.prefix = opt.prefix;
        }

        op.labels = op.getLabels();

        return op;
    },
    setFormVerify = function (formElement, options, elements) {
        var op = initFormConfig(formElement, options),
            configs = op.configs,
            list = [],
            arr = ($.isObject(elements) && elements.length > 0 && !configs.dynamic) ? elements :
                op.formElement.getElementsByTagName(configs.tagName || "*"),
            len = arr.length;

        for (var i = 0; i < len; i++) {
            var obj = arr[i], tag = obj.tagName, type = obj.type;
            //if (tagPattern.test(tag) && (tag != 'input' || typePattern.test(type))) {
            if (op.tagPattern.test(tag) && op.typePattern.test(type)) {
                var fc = op.getFieldConfig(obj, op.fields);
                obj.configs = op.configs;
                op.setControlEvent(obj, op.configs, fc, formElement);
                list.push(obj);
            }
        }
        return list;
    },
    isDataExcept = function (elem) {
        var except = $.getAttribute(elem, Config.DATA_EXCEPT);
        if (typeof except === 'undefined') {
            return false;
        }
        if (except === '1' || except === '' || except === 'true') {
            return true;
        }
        return false;
    },
    getElementsData = function (warns, arr, op, formElem, camelCase) {
        formElem = $.toElement(formElem);
        var data = {}, configs = op.configs, len = arr.length;
        for (var i = 0; i < len; i++) {
            var obj = arr[i], tag = obj.tagName, type = obj.type, key = '', val = '';
            if (isDataExcept(obj)) {
                continue;
            }
            if (op.tagPattern.test(tag) && op.typePattern.test(type)) {
                //获取字段参数配置
                var fc = op.getFieldConfig(obj, op.fields), fcf = fc.field || {}, result = {};
                obj.configs = configs;

                // 判断是否为复选框
                if (op.isCheckBox(obj, type)) {
                    if (!fc.key) {
                        fc.key = 'CheckBox';
                    }
                    result = op.getCheckValue(obj, fc.value, fc.field, obj.isSingle);
                } else {
                    result = op.checkValue(obj, fc.value, fc.field, configs);
                }
                op.showTooltip(result, obj, true, formElem.id);

                val = result.value;

                if (!result.pass) {
                    warns.push({ element: obj, message: result.message });
                    op.setControlEvent(obj, configs, fc, formElem);
                    if (configs.singleStep) {
                        if (!configs.focusInvalid) {
                            op.setFocus(obj);
                        }
                        return false;
                    }
                } else if (obj.isSingle) {
                    if (fc.key) {
                        key = fc.dataKey || fc.key;
                        if (camelCase) {
                            key = key.substr(0, 1).toLowerCase() + key.substr(1);
                        }
                        if (fcf.md5 && $.isString(val, true)) {
                            data[key] = $.md5(val);
                        } else {
                            val = op.filterHtml(val, fcf.filter);
                            data[key] = op.encodeHtml(val, fcf.encode);
                        }
                    }
                } else {
                    if ((key = fc.dataKey || fc.nameKey || fc.key) !== '') {
                        if (camelCase) {
                            key = key.substr(0, 1).toLowerCase() + key.substr(1);
                        }
                        if ($.isUndefined(data[key])) {
                            data[key] = [];
                        }
                        if (!$.isArray(data[key])) {
                            $.console.warn('The name is repeated with the id.', obj);
                        } else if ('' !== $.trim(val)) {
                            val = op.filterHtml(val, fcf.filter);
                            data[key].push(op.encodeHtml(val, fcf.encode));
                        }
                    }
                }
            }
        }
        if (warns.length > 0) {
            if (!configs.focusInvalid) {
                op.setFocus(warns[0].element);
            }
            return false;
        } else {
            for (var k in data) {
                var v = data[k];
                if ($.isArray(v)) {
                    if (v.length <= 1) {
                        data[k] = ($.isUndefined(v[0]) || v[0] === '') ? '' : v[0];
                    } else if (configs.isJoin) {
                        data[k] = v.join(configs.joinSeparate);
                    }
                }
            }
            return data;
        }
    },
    getFormData = function (formElement, options, elements, camelCase) {
        //获取表单参数配置
        var warns = [], arr = [], op = initFormConfig(formElement, options), configs = op.configs;
        if ($.isObject(elements) && elements.length > 0 && !configs.dynamic) {
            arr = elements;
        } else {
            arr = op.formElement.getElementsByTagName(configs.tagName || "*");
        }
        var data = getElementsData(warns, arr, op, formElement, camelCase);
        if ($.isDebug()) {
            console.log('data: ', data, ', warns: ', warns);
        }
        return data;
    },
    getFormParam = function (formElement, options, elements) {
        var opt = $.extend({ tagName: '' }, options);
        var param = {}, appointTag = opt.tagName.trim() !== '', 
            i, obj, id, tag, dataType;

        function _getParVal (obj) {
            var dataType = $.getAttribute(obj, 'data-type|dataType|datatype'),
                tag = obj.tagName.toUpperCase(),
                type = obj.type.toLowerCase(),
                val = obj.value.trim();
            if (tag === 'INPUT' && ['checkbox', 'radio'].indexOf(type) > -1) {
                val = obj.checked ? obj.value || '1' : '0';
            }
            switch (dataType) {
            case 'int': case 'long': case 'port':
                val = parseInt(val, 10);
                val = isNaN(val) ? 0 : val;
                break;
            case 'float': case 'double': case 'decimal': 
                val = parseFloat(val, 10);
                val = isNaN(val) ? 0 : val;
                break;
            case 'bool':
                val = val.startWith('1') || val.toLowerCase().startWith('true') ? 1 : 0;
                break;
            }
            return val;
        }
        if ($.isArray(elements)) {
            for (i = 0; i < elements.length; i++) {
                obj = $.toElement(elements[i]);
                id = obj.id;
                if ($.isElement(obj) && id) {
                    param[id] = _getParVal(obj);
                }
            }
        } else {
            var form = $.toElement(formElement);
            elements = form.getElementsByTagName(opt.tagName || "*");
            for (i = 0; i < elements.length; i++) {
                obj = elements[i];
                tag = obj.tagName.toUpperCase();
                id = obj.id;
                if (id && !isDataExcept(obj)) {
                    if ((appointTag && tag === opt.tagName) ||
                        (!appointTag && ['INPUT', 'SELECT', 'TEXTAREA'].indexOf(tag) > -1 &&
                            ['button', 'submit', 'hidden', 'password'].indexOf(obj.type) < 0)) {
                        param[id] = _getParVal(obj);;
                    }
                }
            }
        }
        return param;
    },
    filterData = function (options, formData) {
        if ($.isObject(options) && !$.isObject(formData)) {
            formData = options.formData || options.datas || options.data || options;
        }
        return formData;
    },
    setElementsData = function (data, arr, op, isTable, ignoreCase) {
        if (!$.isObject(data)) {
            data = {};
        }
        var len = arr.length, list = [];
        for (var i = 0; i < len; i++) {
            if (!arr[i]) {
                continue;
            }
            var obj = arr[i], tag = obj.tagName, type = obj.type;
            if (!op.tagPattern.test(tag) || (typeof type !== 'undefined' && !op.typePattern.test(type))) {
                continue;
            }
            var pass = true;
            if (pass || !obj.isValueSet) {
                var fc = op.getFieldConfig(obj, op.fields, ignoreCase),
                    keyCase = ignoreCase ? fc.key.substr(0, 1).toLowerCase() + fc.key.substr(1) : fc.key,
                    //value = data[fc.key] || data[keyCase],
                    value = $.getParam(data, [fc.key, keyCase].join(',')),
                    isArray = $.isArray(value);
                if ($.isUndefined(value)) {
                    value = data[fc.nameKey];
                }
                if ($.isUndefined(value)) {
                    value = data[obj.id];
                }
                if ($.isUndefined(value)) {
                    continue;
                }
                if (op.isCheckBox(obj, type)) {
                    op.setCheckBoxChecked(obj, value, fc, isArray);
                } else if (tag === 'SELECT') {
                    op.setSelectOption(obj, value, fc, isArray);
                } else {
                    if (fc.isSingle || isTable) {
                        var dataType = $.getAttribute(obj, Config.DATA_TYPE, '').toLowerCase(),
                            dataShow = $.getAttribute(obj, Config.DATA_SHOW, '1') === 1;
                        if (['int', 'float', 'double', 'long'].indexOf(dataType) > -1 && !dataShow && ('' + value).toFloat() === 0) {
                            value = '';
                        }
                        op.setValue(obj, value, fc, isArray);
                    } else {
                        var tmp = document.getElementsByName(fc.name), vals = isArray ? value : value.toString().split(',');
                        for (var j = 0, c = arr.length; j < c; j++) {
                            if (!$.isUndefined(vals[j])) {
                                op.setValue(arr[j], vals[j], fc, false);
                            }
                            tmp[j].isValueSet = true;
                        }
                    }
                }
            }
            list.push(obj);
        }
        return list;
    },
    setFormData = function (formElement, options, formData, ignoreCase) {
        var data = filterData(options, formData), arr = [], list = [];
        if (!$.isEmpty(data)) {
            var op = initFormConfig(formElement, options), configs = op.configs;
            if (op) {
                arr = op.formElement.getElementsByTagName(configs.tagName || "*");
            }
            list = setElementsData(data, arr, op, false, $.isBoolean(ignoreCase, true));
        }
        return list;
    },
    setSelectData = function (elem, val, txt, clear) {
        if (!$.isElement(elem = $.toElement(elem))) {
            return this;
        }
        if ($.isString(val, true) || $.isNumber(val)) {
            val = val.toString().trim();
        } else {
            return this;
        }
        if (!$.isString(txt, true) && !$.isNumber(txt)) {
            txt = val;
        }
        var options = elem.options,
            c = options.length, i, d, v, t;
        for (i = 0; i < c; i++) {
            d = options[i];
            v = d.value.toString();
            t = d.text.trim();
            if (val === v && txt === t) {
                elem.selectedIndex = i;
                return this;
            }
        }
        if (clear) {
            elem.options.length = 0;
            c = 0;
        }
        elem.options.add(new Option(txt, val));
        elem.selectedIndex = c;

        return this;
    },
    getTableData = function (tableElement, options) {
        var list = [], rows = tableElement.rows.length, tHead = tableElement.tHead, rowIndex = tHead ? tHead.rows.length : 0;
        for (var i = rowIndex; i < rows; i++) {
            var warns = [], op = initFormConfig(tableElement, options), configs = op.configs;
            var tr = tableElement.rows[i], arr = tr.getElementsByTagName(configs.tagName || "*");
            var data = getElementsData(warns, arr, op, tableElement);
            if (data) {
                list.push(data);
            }
        }
        return list;
    },
    setTableData = function (tableElement, options, tableDatas) {
        var findId = function (tr) {
            var cells = tr.cells;
            if (cells) {
                var arr = cells[0].getElementsByTagName(configs.tagName || "*");
                for (var i = 0; i < arr.length; i++) {
                    var key = op.getKey(arr[i].id || arr[i].name);
                    if (key.toUpperCase() === 'ID') {
                        return arr[i].value;
                    }
                }
            }
        },
            findData = function (datas, len, id) {
                for (var i = 0; i < len; i++) {
                    var data = datas[i], _id = data.ID || data.Id || data.id;
                    if (_id) {
                        if (_id === id) {
                            return data;
                        }
                    } else {
                        return data;
                    }
                }
                return null;
            };
        var op = initFormConfig(tableElement, options), configs = op.configs;
        var list = [], len = tableDatas.length, rows = tableElement.rows.length, tHead = tableElement.tHead, rowIndex = tHead ? tHead.rows.length : 0;
        for (var i = rowIndex; i < rows; i++) {
            var tr = tableElement.rows[i], arr = tr.getElementsByTagName(configs.tagName || "*");
            var id = findId(tr), data = id ? findData(tableDatas, len, id) : tableDatas[i] || {}, isTable = true;
            list.push(setElementsData(data, arr, op, isTable));
        }
        return list;
    },
    findElement = function (elements, tagName) {
        var tags = [];
        if ($.isUndefined(tagName)) {
            return $.toElement(elements[0]);
        }
        if (tagName.indexOf('|') > -1) {
            tags = tagName.split('|');
        }

        for (var i = 0; i < elements.length; i++) {
            var elem = $.toElement(elements[i]);
            for (var j = 0; j < tags.length; j++) {
                var ts = tags[j].split(':');
                if (elem.tagName === ts[0]) {
                    if (!ts[1] || (ts[1] && elem.type === ts[1])) {
                        return elem;
                    }
                }
            }
            if (elem.tagName === tagName) {
                return elem;
            }
        }
        return null;
    },
    formEnter = function (elements, func) {
        var elems = $.isArray(elements) ? elements : $.isString(elements) ? elements.split(/[,\|;]/) : [elements],
            len = elems.length;
        for (var i = 0; i < len; i++) {
            var elem = $.toElement(elems[i]);
            $.addListener(elem, 'keyup', function(ev) {
                var keyCode = $.getKeyCode(ev);
                if (keyCode === $.KEY_CODE.Enter && $.isFunction(func)) {
                    func();
                }
            });
        }
        return this;
    };

    $.extend({
        form: {
            isElement: isElement,
            setFormVerify: setFormVerify,
            getFormData: getFormData,
            getFormParam: getFormParam,
            setFormData: setFormData,
            setSelectData: setSelectData,
            getTableData: getTableData,
            setTableData: setTableData,
            filterData: filterData,
            findElement: findElement,
            formEnter: formEnter,
            validate: function (element) {
                var elems = $.isArray(element) ? element : [element];
                for (var i = 0; i < elems.length; i++) {
                    var elem = $.toElement(element);
                    if ($.isElement(elem) && $.isFunction(elem.validate)) {
                        elem.validate();
                    }
                }
            },
            //还原输入框原始值，原始值保存在输入框 自定义属性 old-value 中
            restoreValue: function (elements) {
                var elems = $.isArray(elements) ? elements : [elements];
                for (var i = 0; i < elems.length; i++) {
                    var elem = $.toElement(elems[i]);
                    if ($.isElement(elem)) {
                        elem.value = $.isValue($.getAttribute(elem, Config.OLD_VALUE), '');
                    }
                }
                return this;
            },
            //把数组中的数据分别赋值给（ID)输入框和（Name）输入框
            //数组格式：[{"Id":1,"Name":"名称1"},{"Id":2,"Name":"名称2"}]
            setIdAndName: function (datas, idElem, nameElem) {
                idElem = $.toElement(idElem);
                nameElem = $.toElement(nameElem);
                var ids = [], names = [];
                for (var i = 0; i < datas.length; i++) {
                    var dr = datas[i];
                    ids.push($.getValue(dr, ['Id', 'id']));
                    names.push($.getValue(dr, ['Name', 'name']));
                }
                idElem.value = ids.join(',');
                nameElem.value = names.join(',');
                $.setAttribute(idElem, 'old-value', idElem.value);
                $.setAttribute(nameElem, 'old-value', nameElem.value);
                return this;
            }
        }
    });

    var showAjaxError = function (jqXHR, textStatus, errorThrown) {
        if (0 === jqXHR.status) { return false; }
        //jquery ajax 中出现的12031错误状态码的原因没有查到，如果有出现，暂时先屏蔽
        if (12031 === jqXHR.status || jqXHR.status > 12000) {
            console.log(jqXHR.status, textStatus, errorThrown);
            return false;
        }

        var html = [
            //应用程序服务端异常，详细信息如下：
            '\u5e94\u7528\u7a0b\u5e8f\u670d\u52a1\u7aef\u5f02\u5e38\uff0c\u8be6\u7ec6\u4fe1\u606f\u5982\u4e0b\uff1a',
            'status: ' + jqXHR.status,
            'textStatus: ' + textStatus,
            'errorThrown: ' + errorThrown
        ];
        //指定对话框ID appServerError，防止重复出现多个对话框
        //服务异常
        $.alert(html.join('<br />'), '\u670d\u52a1\u5f02\u5e38', { id: 'appServerError', icon: 'error', copyAble: true });
    },
    showAjaxFail = function (data, textStatus, jqXHR) {
        var msg = data.msg || data.Msg || data.message || data.Message || '',
            error = data.error || data.Error || '';

        //定制功能，如果页面上有定制了window.showAjaxFailAlert函数，并且错误信息是noauth（未登录）
        //则不直接弹出提示信息，而且跳转到定制函数中处理
        if (error.toLowerCase() === 'noauth' && $.isFunction(window.showAjaxFailAlert)) {
            window.showAjaxFailAlert(data, msg, error);
            return false;
        }

        var html = [msg];
        if (error) {
            //可能的原因：
            html.push('\u53ef\u80fd\u7684\u539f\u56e0\uff1a');
            html.push(error);
        }
        var dialogId = data.dialogId || data.dialog || '';
        var callback = null;
        if ($.isFunction(window.showAjaxFail)) {
            callback = function () {
                window.showAjaxFail(data);
            };
        }
        //提示信息
        $.alert(html.join('<br />'), '\u63d0\u793a\u4fe1\u606f', { icon: 'warning', copyAble: true, id: dialogId, callback: callback });
    };

    $.extend($, {
        ajaxRequest: function (options) {
            if (arguments.length >= 3) {
                options = {
                    url: arguments[0], data: arguments[1], callback: arguments[2],
                    dataType: 'JSON', getJSON: true, param: arguments[3] || null
                };
            }
            var opt = $.extend({
                type: 'POST', async: true,
                url: '', data: null, callback: null,
                dataType: 'JSON', getJSON: false, param: null,
                //返回除异常信息外的所有数据（由调用者完全处理数据结果）
                receiveAll: false,
                //指定的表示状态的字段，默认字段是：result
                resultField: 'result'
            }, options),
                config = {
                    type: opt.type, async: opt.async !== false,
                    dataType: opt.dataType,   //xml,html,script,json,jsonp,text
                    //contentType: "application/json",
                    url: opt.url, data: opt.data,
                    error: function (jqXHR, textStatus, errorThrown) {
                        showAjaxError(jqXHR, textStatus, errorThrown);
                    },
                    success: function (data, textStatus, jqXHR) {
                        if ($.isDebug()) {
                            console.log('req: ', opt.data, ', rsp: ', data);
                        }
                        var callback = opt.callback || opt.success;
                        if ($.isFunction(callback)) {
                            if (opt.getJSON || opt.getJson) {
                                callback(data, opt.param, textStatus, jqXHR);
                            } else if (opt.receiveAll || (opt.resultField && 1 === data[opt.resultField])) {
                                callback(data, opt.param);
                            } else {
                                showAjaxFail(data, textStatus, jqXHR);
                            }
                        }
                        if ($.isFunction(opt.finallyCallback)) { opt.finallyCallback(); }
                    },
                    complete: function (jqXHR, status) {
                        jqXHR = null;
                        if (typeof CollectGarbage !== 'undefined' && $.isFunction(CollectGarbage)) { CollectGarbage(); }
                    }
                };
            if (config.datatype === 'jsonp') {
                config.jsonp = 'callback';
                config.jsonpCallback = cfg.jsonpCallback || 'flightHandler';
            }
            $.ajax(config);
        }
    });

    $.extend($, {
        formValidate: function (controls, options) {
            var $f = $.form, element = $f.findElement(controls), len = $(this).length;

            if (!$.isObject(options) || !$f.isElement(element)) {
                $.alert('\u8868\u5355\u9a8c\u8bc1\u53c2\u6570\u9519\u8bef');//表单验证参数错误
                return $(this);
            }

            var id = element.id || '',
                table = $f.findElement(controls, 'TABLE'),
                handler = $f.findElement(controls, 'INPUT:submit|BUTTON:submit|INPUT:button|BUTTON'),
                callback = options.submitHandler || options.submit,
                //debounce = options.debounce || false,       //是否防抖节流，默认不启用
                debounce = $.isBoolean(options.debounce, true),       //是否防抖节流，默认启用
                delay = options.delay || 320,               //延时时长，默认320毫秒
                timeLimit = options.timeLimit || 5000,      //防抖时限，默认5000毫秒
                isForm = element.tagName === 'FORM',
                isTable = $f.isElement(table) && table.tagName === 'TABLE',
                formData = $f.filterData(options),
                tableDatas = options.tableDatas,
                elements = [], tableElements = [],
                complete = options.complete,
                camelCase = options.camelCase,
                ignoreCase = options.ignoreCase;

            //1. 赋值（不验证规则）
            if ($.isObject(formData)) {
                elements = $f.setFormData(element, options, formData, ignoreCase);
            }
            if ($.isObject(tableDatas)) {
                tableElements = $f.setTableData(table, options, tableDatas);
            }
            //2.设置验证规则
            elements = $f.setFormVerify(element, options, elements);

            //设置定时器，防抖
            var timer = null, lastSubmit = undefined,
                isFirst = function () {
                    var ts = new Date().getTime();
                    //上次点击若超过5秒钟，则不启用延时
                    if (!lastSubmit || (ts - lastSubmit > timeLimit)) {
                        return lastSubmit = ts, true;
                    }
                    return false;
                },
                delayCallback = function (func, formData, tableData) {
                    if (isFirst()) {
                        return func(formData, tableData), false;
                    }
                    if (timer) {
                        window.clearTimeout(timer);
                    }
                    return timer = window.setTimeout(function () {
                        func(formData, tableData);
                    }, delay), false;
                };

            //3.创建取值事件
            if ($.isFunction(callback)) {
                if (isForm) {
                    if (typeof $.OUI === 'boolean') {
                        element.onsubmit = function () {
                            var formData = $f.getFormData(element, options, elements, camelCase);
                            return debounce ? delayCallback(callback, formData) : callback(formData), false;
                        };
                    } else {
                        $(this).submit(function () {
                            var formData = $f.getFormData(element, options, elements, camelCase);
                            return debounce ? delayCallback(callback, formData) : callback(formData), false;
                        });
                    }
                } else if (handler) {
                    $(handler).click(function () {
                        var formData = $f.getFormData(element, options, elements, camelCase);
                        if (isTable) {
                            var tableData = !formData ? [] : $f.getTableData(table, options);
                            return debounce ? delayCallback(callback, formData, tableData) : callback(formData, tableData), false;
                        } else {
                            return debounce ? delayCallback(callback, formData) : callback(formData), false;
                        }
                    });
                }
            }

            //4.设置完成，返回控件列表
            if ($.isFunction(complete)) {
                complete(elements, tableElements);
            }
            return $;
        }
    });

    // formValidate
    $.extend($.fn, {
        formValidate: function (options) {
            $.formValidate($(this), options);
            return $(this);
        }
    });
}(OUI);

// $.input {}, $.setInputFormat ()
!function ($) {
    var KC = $.KEY_CODE,
        KCA = KC.Arrow,
        KCC = KC.Char,
        CloseLinkageClassName = 'oui-popup-panel';

    var FilePath = $.getScriptSelfPath(true),
        FileDir = FilePath.substr(0, FilePath.lastIndexOf('/') + 1);

    var IconCss = [
        '.oui-form-txt-icon{cursor:pointer;position:absolute;border:none;overflow:hidden;',
        'box-sizing:border-box;text-align:center;font-size:28px;font-family:Arial;font-weight:normal;',
        'width:30px;height:30px;color:#999;margin:0;padding:0;',
        'background:url("',FileDir,'form-icon.png") no-repeat 0 0;}',
        '.oui-form-txt-icon:hover{color:#000;background-position-y:-30px;}',

        '.oui-form-icon-del{background-position:0 0;}',
        '.oui-form-icon-del:hover{background-position:0 -30px;}',

        '.oui-form-icon-pwd{background-position:-30px 0;}',
        '.oui-form-icon-pwd:hover{background-position:-30px -30px;}',
        '.oui-form-icon-txt{background-position:-60px 0;}',
        '.oui-form-icon-txt:hover{background-position:-60px -30px;}',

        '.oui-form-icon-query{background-position:-90px 0;}',
        '.oui-form-icon-query:hover{background-position:-90px -30px;}',

        'input[type="password"]::-webkit-credentials-cramble-button{appearance: none;}',
        'input[type="password"]::-ms-reveal{display: none;}',
        'input[type="password"]::-ms-clear{display: none;}'
    ].join('');

    var Util = {
        timer: {},
        checkElemArray: function (elements) {
            var elems = [];
            if ($.isArrayLike(elements) || $.isArray(elements)) {
                elems = elements;
            } else if ($.isElement(elements)) {
                elems = [elements];
            } else if ($.isString(elements, true)) {
                elems = elements.split(/[,;\|]/).length > 1 ? elements.split(/[,;\|]/) : [elements];
            }
            return elems;
        },
        buildStyle: function (id, content) {
            if (document.getElementById(id) === null) {
                var css = document.createElement('style');
                css.id = id;
                css.innerHTML = content;
                document.head.appendChild(css);
            }
            return this;
        },
        buildOptionStyle: function (id) {
            Util.buildStyle('oui_form_option_style_001', [
                '.oui-input-fmt{ime-mode:disabled;}',
                '.input-opt-elem{outline:none;}',
                '.input-opt-elem:focus {outline:none;border-color:#66afe9;box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);',
                ' -webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);}',
                '.input-opt-elem-top{border-top-left-radius:0;border-top-right-radius:0;}',
                '.input-opt-elem-bottom{border-bottom-left-radius:0;border-bottom-right-radius:0;}',
                '.input-opt-elem-bottom:focus{border-bottom-color:#eee;}',
                '.input-opt-panel-box{position:absolute;border:solid 1px #66afe9;background:#fff;border-radius:5px;overflow:auto;opacity:1;',
                ' box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);margin:0;padding:0;box-sizing:border-box;',
                ' -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);}',
                '.input-opt-panel-box-top{border-bottom-left-radius:0;border-bottom-right-radius:0;margin-top:1px;}',
                '.input-opt-panel-box-bottom{border-top-left-radius:0;border-top-right-radius:0;margin-top:-1px;}',
                '.input-opt-ul{margin:0;padding:1px 0;border:none;background:transparent;}',
                '.input-opt-ul i{font-style:normal;color:#ccc;display:inline-block;text-align:right;',
                ' border:none;margin:0 7px 0 0;padding:0;font-size:14px;}',
                '.input-opt-ul li{margin:0 1px;list-style:none;line-height:30px;height:30px;overflow:hidden;font-size:14px;',
                '   border:none;cursor:default;}',
                '.input-opt-ul li:last-child{border-bottom:none;}',
                '.input-opt-ul li:hover,.input-opt-ul li.cur:hover{background:#f5f5f5;color:#000;}',
                '.input-opt-ul li.cur{background:#dfe8f6;color:#000;}',
                '.input-opt-ul li:hover i,.input-opt-ul li.cur:hover i{color:#f50;}',
                '.input-opt-ul li.cur i{color:#f00;}',
                '.input-opt-ul li a{margin:0;padding:0;font-size:14px;display:block;border:none;background:none;text-decoration:none;color:#000;cursor:default;}',
                '.input-opt-ul li span{margin:0;padding:0;font-size:14px;border:none;margin:0;padding:0;}',
                '.input-opt-ul li u{text-decoration:none;color:#999;font-size:14px;margin:03px;padding:0;border:0;background:none;}',
                '.input-opt-ul li span.i-t{color:#999;margin:0 0 0 8px;padding:0;font-size:14px;border:none;background:none;}'
            ].join(''));

            return this;
        },
        buildIconStyle: function (id) {
            Util.buildStyle('oui_form_icon_style_001', [
                '.oui-form-txt-icon{cursor:pointer;position:absolute;border:none;overflow:hidden;',
                'box-sizing:border-box;text-align:center;font-size:28px;font-family:Arial;font-weight:normal;',
                'width:30px;height:30px;color:#999;margin:0;padding:0;',
                'background:url("',FileDir,'form-icon.png") no-repeat 0 0;}',
                '.oui-form-txt-icon:hover{color:#000;background-position-y:-30px;}',

                '.oui-form-icon-del{background-position:0 0;}',
                '.oui-form-icon-del:hover{background-position:0 -30px;}',

                '.oui-form-icon-pwd{background-position:-30px 0;}',
                '.oui-form-icon-pwd:hover{background-position:-30px -30px;}',
                '.oui-form-icon-txt{background-position:-60px 0;}',
                '.oui-form-icon-txt:hover{background-position:-60px -30px;}',

                '.oui-form-icon-query{background-position:-90px 0;}',
                '.oui-form-icon-query:hover{background-position:-90px -30px;}',

                'input[type="password"]::-webkit-credentials-cramble-button{appearance: none;}',
                'input[type="password"]::-ms-reveal{display: none;}',
                'input[type="password"]::-ms-clear{display: none;}'
            ].join(''));

            return this;
        }
    };

    // $.input
    $.extend($, {
        input: {
            checkKey: function (ev, codes, excepts, opt) {
                var e = ev || window.event,
                    keyCode = $.getKeyCode(e);

                //不允许shift键的情况下，只允许 shift + tab 组合键
                if (!opt.shift && e.shiftKey && keyCode !== 9) {
                    return false;
                } else {
                    return (codes || []).indexOf(keyCode) >= 0 && (excepts || []).indexOf(keyCode) < 0;
                }
            },
            checkVal: function(val, types, opt, keydown, elem) {
                opt = $.extend({}, opt);
                types = $.extend([], types);
                var patterns = $.extend([], opt.patterns), pass = false;
                if (patterns && patterns.length > 0) {
                    for (var i = 0; i < patterns.length; i++) {
                        var p = patterns[i];
                        //3种模式，1-正则验证，2-function(val)，3-字符串比较
                        if (($.isRegexp(p) && p.test(val)) || ($.isFunction(p) && p(val)) || p.toString() === val) {
                            pass = true;
                            break;
                        }
                    }
                    return !pass ? false : $.input.checkValLen(val, opt, false, keydown, elem);
                }
                var pc = {
                    number: [/^[\-]?[0-9]{0,}$/i],
                    char: [/^[A-Z\-]{0,}$/i],
                    char_number: [/^[A-Z0-9\-]{0,}$/i],
                    //word: [/^[\w]{0,}$/i],
                    word: [/[\w]{0,}/i],
                    name: [/^[\w-]{0,}$/i],
                    bool: [/^([01]?)$/],
                    int: [$.PATTERN.Int, /^([0]?|[-])$/],
                    long: [$.PATTERN.Long, /^([0]?|[-])$/],
                    float: [$.PATTERN.Float, /^([0]?|[-]|[.])$/],
                    double: [$.PATTERN.Double, /^([0]?|[-]|[.])$/],
                    port: [$.PATTERN.Port, /^[0]?$/],
                    angle: [opt.minus ? /^[\-]?360(\.[0]{0,8})?$|^([1-3][0-5][0-9]|[1-2][0-9]+|[0-9]{1,2})([.][\d]{0,8})?$/ : 
                        /^360(\.[0]{0,8})?$|^([1-3][0-5][0-9]|[1-2][0-9]+|[0-9]{1,2})([.][\d]{0,8})?$/, opt.minus ? /^[\-]?[0]?$/ : /^[0]?$/],
                    hex: [opt.space ? /^[A-F0-9\s]{1,}$/i : /^[A-F0-9]{1,}$/i, /^[0]{0}$/],
                    md5: [/^[A-F0-9]{32}$/i, /^[0]{0}$/]
                }, pn = {
                    port: 5,
                    md5: 32
                }, ps = [], nc = 0;

                for (var i = 0; i < types.length; i++) {
                    var t = types[i], p = pc[t] || null;
                    if (p) {
                        ps = ps.concat(p);
                    }
                }

                for (var j = 0; j < ps.length; j++) {
                    if (!ps[j].test(val)) {
                        nc++;
                    }
                }

                if (nc > 0 && nc === ps.length) {
                    return false;
                }
                return $.input.checkValLen(val, opt, false, keydown, elem);
            },
            checkExcept: function (val, opt) {
                var exceptions = $.extend([], opt.exceptions), pass = false;
                for (var i = 0; i < exceptions.length; i++) {
                    var p = exceptions[i];
                    if (($.isRegexp(p) && p.test(val)) || ($.isFunction(p) && p(val)) || p.toString() === val) {
                        return true;
                    }
                }
                return false;
            },
            getElementOptionConfig: function (elem) {
                var options = [], arr = [], i;
                if (!$.isElement(elem = $.toElement(elem))) {
                    return options;
                }
                if (elem.tagName === 'SELECT') {
                    arr = elem.options;
                    for (i = 0; i < arr.length; i++) {
                        options.push({val: arr[i].value, txt: arr[i].text});
                    }
                } else {
                    arr = ($.getAttribute(elem, 'options') || '').split(/[,;\|]/);
                    for (i = 0; i < arr.length; i++) {
                        if (arr[i] !== '') {
                            if (arr[i].indexOf(':') > 0) {
                                var tmp = arr[i].split(':');
                                options.push({val: tmp[0], txt: tmp[1] || tmp[0]});
                            } else {
                                options.push({val: arr[i], txt: arr[i]});
                            }
                        }
                    }
                }
                return options;
            },
            getOptionValues: function (opt) {
                var values = [];
                for (var i = 0; i < opt.length; i++) {
                    values.push($.isObject(opt[i]) ? $.getParam(opt[i], 'value,val,v') : $.isArray(opt[i]) ? opt[i][0] : opt[i]);
                }
                return values;
            },
            setOptionValues: function (opt) {
                var values = [], p, val, txt;
                for (var i = 0; i < opt.length; i++) {
                    p = opt[i];
                    if ($.isArray(p)) {
                        val = p[0];
                        txt = p[1] || p[0];
                    } else if ($.isObject(p)) {
                        val = $.getParam(p, 'value,val,v,text,txt,t');
                        txt = $.getParam(p, 'text,txt,t');
                    } else if ($.isString(p, true)) {
                        var ps = p.split(/[:\|]/);
                        val = ps[0];
                        txt = $.getParamCon(ps[1], ps[0]);
                    } else {
                        val = txt = p;
                    }
                    values.push({ val: val, txt: txt });
                }
                return values;
            },
            isInputTyped: function (opt, val) {
                if (val === '') {
                    return false;
                }
                for (var i = 0; i < opt.length; i++) {
                    if (opt[i].toString() === val.toString()) {
                        return false;
                    }
                }
                return true;
            },
            isInOption: function (opt, val) {
                if (!$.isArray(opt)) {
                    return false;
                }
                for (var i = 0; i < opt.length; i++) {
                    if (opt[i].toString() === val.toString()) {
                        return true;
                    }
                }
                return false;
            },
            checkFormat: function (elem, options, isPattern, editable) {
                var v = elem.value.trim(), vs = $.extend([], options);
                if ('' === v || vs.length <= 0) {
                    return $.input.setWarnColor(elem, true);
                }
                for (var i = 0; i < vs.length; i++) {
                    if (isPattern) {
                        var p = vs[i];
                        if (($.isRegexp(p) && p.test(v)) || ($.isFunction(p) && p(v)) || p.toString() === v) {
                            return $.input.setWarnColor(elem, true);
                        }
                    } else {
                        var val = $.isObject(vs[i]) ? $.getParam(vs[i], 'value,val,v') : $.isArray(vs[i]) ? vs[i][0] : vs[i];
                        if (editable || val.toString().trim() === v) {
                            return $.input.setWarnColor(elem, true);
                        }
                    }
                }
                return $.input.setWarnColor(elem, false);
            },
            replaceValue: function (ev, elem, val, isCnAble, converts, optionValues) {
                var replace = false;
                //当没有选项并且也不允许中文输入的情况，清除中文（包括标点符号）
                if (!$.input.isInOption(optionValues, val) && !isCnAble && 
                    /([。，、：；‘’“”！……~｛【《》】｝]|[\u3220-\uFA29]|[`·])+/ig.test(val)) {
                    val = val.replace(/([。，、：；‘’“”！……~｛【《》】｝]|[\u3220-\uFA29]|[`·])+/ig, '');
                    elem.value = val;
                }
                var kc = $.getKeyCode(ev) || 0;
                if (!$.isArray(converts) || kc.inArray([8, 46])) {
                    return { replace: replace, val: val };
                }
                for (var i = 0; i < converts.length; i++) {
                    var p = $.getParamValue(converts[i].src, converts[i][0]),
                        v = $.getParamValue(converts[i].dest, converts[i][1], val);

                    if ($.isRegexp(p)) {
                        if (p.test(val)) {
                            val = v;
                            replace = true;
                        }
                    } else if (p === val) {
                        val = v;
                        replace = true;
                    }
                    if (replace) {
                        elem.value = val;
                    }
                }
                return { replace: replace, val: val };
            },
            setWarnColor: function (elem, pass, focus) {
                if (!pass) {
                    if (!elem.oldColor) {
                        elem.oldColor  = $.getElementStyle(elem, 'color');
                    }
                    if (focus) {
                        elem.focus();
                    }
                    elem.style.color = '#f00';
                } else if (elem.oldColor) {
                    elem.style.color = elem.oldColor;
                }
                return pass;
            },
            checkValLen: function (val, opt, paste, keydown, elem) {
                opt = $.extend({}, opt);
                if (val.length > 0) {
                    if (paste) {
                        if ((opt.maxLen && opt.maxLen > 0 && val.length >= opt.maxLen) || (opt.valLen && opt.valLen > 0 && val.length >= opt.valLen)) {
                            return false;
                        }
                        if (opt.maxVal && parseFloat('0' + val, 10) >= opt.maxVal) {
                            return false;
                        }
                        if (opt.minVal && parseFloat('0' + val, 10) < opt.minVal) {
                            return false;
                        }
                    } else {
                        if ((opt.maxLen && opt.maxLen > 0 && val.length > opt.maxLen) || (opt.valLen && opt.valLen > 0 && val.length > opt.valLen)) {
                            return false;
                        }
                        if (opt.maxVal && parseFloat('0' + val, 10) > opt.maxVal) {
                            return false;
                        }
                        if (!keydown && opt.minVal && parseFloat('0' + val, 10) < opt.minVal) {
                            return false;
                        }
                    }

                    if (opt.valLen && opt.valLen > 0 && val.length !== opt.valLen) {
                        $.input.setWarnColor(elem, false, true);
                    } else if(opt.minLen && opt.minLen > 0 && val.length < opt.minLen) {
                        $.input.setWarnColor(elem, false, true);
                    }
                }
                return true;
            },
            setCurrentOption: function (elem, div) {
                var arr = div.querySelectorAll('li'), i, cur = -1;
                if ($.isNumber(elem)) {
                    for (i = 0; i < arr.length; i++) {
                        if (elem === i) {
                            $.addClass(arr[i], 'cur');
                            cur = i;
                        } else {
                            $.removeClass(arr[i], 'cur');
                        }
                    }
                } else {
                    var val = elem.value.trim();
                    for (i = 0; i < arr.length; i++) {
                        if (val === $.getAttribute(arr[i], 'data-value')) {
                            $.addClass(arr[i], 'cur');
                            cur = i;
                        } else {
                            $.removeClass(arr[i], 'cur');
                        }
                    }
                }
                if (cur >= 0) {
                    $.scrollTo(arr[cur], div);
                }
                return this;
            },
            hidePanel: function (div, elem, hide) {
                div.style.display = $.isBoolean(hide, true) ? 'none' : '';
                $.removeClass(div, 'input-opt-panel-box-top,input-opt-panel-box-bottom');
                if (elem) {
                    $.removeClass(elem, 'input-opt-elem-top,input-opt-elem-bottom');
                }
                return this;
            },
            hideOptionPanel: function (curPanel) {
                var arr = document.querySelectorAll('.input-opt-panel-box'),
                    elems = document.querySelectorAll('.input-opt-elem'),
                    i;
                for (i = 0; i < arr.length; i++) {
                    if ((!curPanel || arr[i] !== curPanel) && arr[i].style.display !== 'none') {
                        arr[i].style.display = 'none';
                        $.removeClass(arr[i], 'input-opt-panel-box-top,input-opt-panel-box-bottom');
                    }
                }
                for (i = 0; i < elems.length; i++) {
                    $.removeClass(elems[i], 'input-opt-elem-top,input-opt-elem-bottom');
                }
                return this;
            },
            showOptionValue: function (elem, item, empty) {
                var val = $.getAttribute(item, 'data-value') || '',
                    txt = $.getAttribute(item, 'data-text') || '';
                if (elem.tagName === 'SELECT') {
                    elem.options.length = 0;
                    if (empty) {
                        elem.options.add(new Option(val, ''));
                    } else {
                        elem.options.add(new Option(txt, val));
                    }
                    $.trigger(elem, 'change');
                } else {
                    elem.value = empty ? '' : val || '';
                    if (empty) {
                        $.setAttribute(elem, 'placeholder', $.getAttribute(elem, 'opt-title'));
                    }
                    $.trigger(elem, 'change');
                }
                return elem;
            },
            selectOptionItem: function (item, keyCode, elem, div, shortcut) {
                var that = this,
                    isArrowKey = $.isNumber(item),
                    cur = $.getAttribute(elem, 'opt-idx').toInt(),
                    lines = 12,
                    half = Math.ceil(lines / 2);

                if (!$.isElement(div = $.toElement(div))) {
                    return that;
                }

                if (isArrowKey) {
                    var arr = div.querySelectorAll('li'),
                        len = arr.length,
                        idx = item < 0 ? 0 : item > len ? len : item, 
                        //n = item,
                        n = idx;

                    if (shortcut) {
                        if (len >= 10) {
                            var ni = cur * 10 + idx;
                            if (ni > len) {
                                ni = idx;
                            }
                            idx = ni;
                        }
                    } else {
                        if ($.isNumber(keyCode)) {
                            switch(keyCode) {
                                case 37: idx = 1; break;
                                case 39: idx = len; break;
                                case 77: idx = Math.ceil(len / 2); break;
                                // 68 - D (向下半屏)
                                case 68: idx = cur + half; break;
                                // 85 - U (向上半屏)
                                case 85: idx = cur - half; break;
                                // 70 - F (向下一屏)
                                case 70: idx = cur + lines; break;
                                // 66 - B (向上一屏)
                                case 66: idx = cur - lines; break;
                            }
                            idx = idx <= 0 ? 1 : idx > len ? len : idx;
                        }
                        if ((idx > 0 && idx === cur) || !arr[idx - 1]) {
                            return that;
                        }
                    }
                    //设置当前索引编号
                    $.setAttribute(elem, 'opt-idx', idx--);

                    //如果索引序号为-1表示输入框中的内容选项被清除，当前没有选项被选中
                    //所以要清除选项中的当前选项标记
                    $.input.setCurrentOption(n >= 0 ? idx : n, div);
                    $.scrollTo(arr[idx < 0 ? 0 : idx], div);

                    item = arr[idx];
                }
                if (!item) {
                    $.input.showOptionValue(elem, null, true);
                    return that;
                }
                var val = $.getAttribute(item, 'data-value'),
                    num = $.getAttribute(item, 'opt-idx').toInt();

                if (num > 0 && num === cur && val === elem.value.trim()) {
                    $.input.hideOptionPanel();
                    return that;
                }
                $.setAttribute($.input.showOptionValue(elem, item), 'opt-idx', num);

                if (!isArrowKey) {
                    $.input.hidePanel(div, elem);
                }
                $.trigger(elem, 'blur');

                return that;
            },
            setTitle: function (box) {
                var spans = document.querySelectorAll('#' + box.id + ' span'),
                    itemHeight = 30;

                for (i = 0; i < spans.length; i++) {
                    spans[i].title = $.getOffset(spans[i]).height > itemHeight ? spans[i].innerHTML.filterHtml() : '';
                }
                return this;
            },
            buildOption: function (options) {
                return $.isArray(options) ? 
                    options : $.isUndefinedOrNull(options) ? 
                    [] : $.isString(options, true) ? 
                    options.split(/[,;\|]/) : [options];
            },
            //action: 0 - hide, 1 - toggle, 2 - show
            setOption: function (elem, options, config, action) {
                var cfg = $.extend({}, config),
                    opt = $.input.buildOption(options),
                    show = true, display = '';

                if (!$.isNumber(action)) {
                    action = 1;
                }

                cfg.relative = $.getParam(cfg, 'relativePosition,relative,follow', false);

                if (!$.isElement(elem = $.toElement(elem)) || opt.length <= 0) {
                    return null;
                }
                if (elem.optbox) {
                    show = !action ? 'none' : 2 === action ? true : elem.optbox.style.display === 'none';
                    $.input.setCurrentOption(elem, elem.optbox);
                    $.input.setTitle(elem.optbox);
                    $.input.hidePanel(elem.optbox, elem, !show);
                    if (!show) {
                        return opt;
                    }
                    var pos = $.setPanelPosition(elem, elem.optbox, cfg);
                    $.addClass(elem.optbox, 'input-opt-panel-box-' + pos.position);
                    $.addClass(elem, 'input-opt-elem-' + pos.position);
                    if (cfg.x) {
                        elem.optbox.style.left = parseFloat(elem.optbox.style.left, 10) + cfg.x + 'px';
                    }
                    return opt;
                }

                var es = $.getOffset(elem, cfg.relative),
                    div = document.createElement('div'),
                    len = opt.length,
                    top = es.top + es.height + 1,
                    idx = 0,
                    curIdx = 0,
                    n = len.toString().length,
                    elemVal = elem.value.trim(),
                    html = [ '<ul class="input-opt-ul">' ],
                    isSelect = elem.tagName === 'SELECT';

                div.target = elem.tagName;
                div.className = 'input-opt-panel-box';
                div.id = 'input-opt-panel-' + (elem.id || new Date().getTime());

                //设置关联关闭样式
                div.className = div.className.addClass(CloseLinkageClassName);
                //设置关联关闭函数 
                div.hide = function () {
                    $.input.hidePanel(this, elem, true);
                };

                div.style.cssText = [
                    'box-sizing:border-box;',
                    'max-height:' + (parseInt('0' + cfg.height, 10) || cfg.MAX_HEIGHT) + 'px;',
                    'top:' + top + 'px;',
                    'left:' + (es.left) + 'px;',
                    'width:' + (es.width - 2) + 'px;',
                    cfg.relative ? '' : 'z-index:' + (cfg.zindex || cfg.ZINDEX) + ';',
                    !action ? 'display:none;' : ''
                ].join(';');

                for (var i = 0; i < len; i++) {
                    var val = opt[i].val, 
                        txt = opt[i].txt,
                        con = txt,
                        cur = elemVal === val.toString();

                    if ($.isString(txt, true) || $.isNumber(txt) || $.isString(val, true) || $.isNumber(val)) {
                        idx++;
                        if (cfg.display && val.toString() !== '' && val.toString() !== txt.toString()) {
                            con = val + '<span class="i-t">' + txt + '</span>';
                        }
                        if (cur) {
                            curIdx = idx;
                        }
                        html.push([
                            '<li class="input-opt-panel-item', cur ? ' cur' : '', '"',
                            ' style="padding:', (cfg.number ? '0 5px 0 0' : '0 5px'), ';"',
                            ' opt-idx="', (i + 1), '"',
                            ' data-value="', val.toString().replace(/["]/g, '&quot;'), '"',
                            ' data-text="', txt.toString().replace(/["]/g, '&quot;'), '"',
                            '>',
                            cfg.number ? ('<i style="width:' + (n * (n > 1 ? 10 : 12)) + 'px;">' + idx + '</i>') : '',
                            '<span>', con, '</span>',
                            '</li>'
                        ].join(''));
                    }
                }
                html.push('</ul>');

                $.setAttribute(elem, 'opt-len', len);
                $.setAttribute(elem, 'opt-idx', curIdx);
                $.setAttribute(elem, 'opt-id', div.id);
                var title = (cfg.title || '') + (cfg.name || '');
                $.setAttribute(elem, 'opt-title', title.toString().replace(/["]/g, '&quot;'));

                div.innerHTML = html.join('');
                if (cfg.relative) {
                    //elem.parentNode.insertBefore((elem.optbox = div), elem);
                    elem.parentNode.appendChild((elem.optbox = div));
                } else {
                    document.body.appendChild((elem.optbox = div));
                }
                var pos = $.setPanelPosition(elem, elem.optbox, cfg);
                if (cfg.x) {
                    elem.optbox.style.left = parseFloat(elem.optbox.style.left, 10) + cfg.x + 'px';
                }
                if (action) {
                    $.addClass(elem.optbox, 'input-opt-panel-box-' + pos.position);
                    $.addClass(elem, 'input-opt-elem-' + pos.position);
                }
                $.input.setCurrentOption(elem, elem.optbox);
                $.input.setTitle(elem.optbox);

                elem.div = div;

                window.inputFormatTimers = {};
                if (!window.inputOptionDocEventListener) {
                    window.inputOptionDocEventListener = 1;
                    $.addListener(document, 'mousedown', function(ev) {
                        if ((ev.target.tagName === 'LI' && ev.target.className.indexOf('input-opt-panel-item') > -1) || 
                            (ev.target.tagName === 'SELECT' && ev.target.className.indexOf('input-opt-panel-select') > -1)) {
                            return false;
                        }
                        $.input.hideOptionPanel();
                    });
                    $.addListener(window, 'resize', function(ev) {
                        $.input.hideOptionPanel();
                    });
                }
                
                var arr = div.querySelectorAll('li');
                for (var i = 0; i < arr.length; i++) {
                    var li = arr[i];
                    $.addListener(li, 'mousedown', function(ev) {
                        $.cancelBubble(ev);
                        return false;
                    });
                    $.addListener(li, 'click', function(ev) {
                        $.cancelBubble(ev);
                        $.input.selectOptionItem(this, null, elem, div);
                    });
                }
                /*
                $.addListener(div, 'mousedown', function(ev) {
                    $.cancelBubble(ev);
                    var obj = ev.target;
                    if (obj.tagName !== 'LI') {
                        return false;
                    }
                    $.input.selectOptionItem(obj, null, elem, div);
                    return false;
                });
                */
                $.addListener(document, 'wheel', function (ev) {
                    if (div.style.display !== 'none' && !$.isOnElement(elem.optbox, ev)) {
                        $.input.hidePanel(elem.optbox, elem);
                    }
                    return false;
                });

                $.addListener(elem, 'wheel', function (ev) {
                    if (div.style.display !== 'none') {
                        $.input.hidePanel(elem.optbox, elem);
                    }
                    return false;
                });

                return opt;
            },
            buildIcon: function (elem, opt) {
                var icons = $.extend({}, opt.icon), idx = 0;

                if (!elem.icons) {
                    elem.icons = {};
                }
                Util.buildIconStyle();

                function _build(key, icon) {
                    elem.icons[key] = {
                        icon: icon,
                        show: true
                    };
                }

                function _listen(elem) {
                    $.addListener(window, 'resize', function(ev) {
                        $.input.setIcon(ev, elem);
                    });
                    $.addListener(elem, 'mouseover', function(ev) {
                        $.input.setIcon(ev, elem);
                    });
                }

                function _enter(elem, func) {
                    $.addListener(elem, 'keyup', function(ev) {
                        var val = elem.value.trim(),
                            kc = $.getKeyCode(ev);
                        if (val.length > 0 && kc === $.KEY_CODE.Enter) {
                            func(elem);
                        }
                    });
                }

                function _create(elem, key, func, idx) {
                    $.createElement('A', '', function(el) {
                        var ps = $.getOffset(elem), h = (ps.height > 30 ? 30 : ps.height),
                            zIndex = parseInt('0' + $.getElementStyle(elem, 'z-index'), 10) + 1;

                        el.key = key;
                        el.className = 'oui-form-txt-icon oui-form-icon-' + key;
                        el.style.cssText = [
                            'position:absolute;background-color:transparent;height:',h, 'px;line-height:', h, 'px;',
                            'z-index:', zIndex, ';'
                        ].join('');

                        _build(key, el);
                        _listen(elem);

                        $.input.showIcon(elem, key, idx);

                        $.addListener(el, 'click', function(ev) {
                            if (['del', 'query'].indexOf(key) > -1) {
                                if (el.key === 'del') {
                                    el.style.display = 'none';
                                    elem.value = '';
                                }
                                if ($.isFunction(func)) {
                                    func(elem);
                                }
                            } else if ('pwd' === key) {
                                if (el.className.indexOf('oui-form-icon-pwd') > -1) {
                                    $.replaceClass(el, 'oui-form-icon-pwd', 'oui-form-icon-txt');
                                    elem.type = 'text';
                                } else {
                                    $.replaceClass(el, 'oui-form-icon-txt', 'oui-form-icon-pwd');
                                    elem.type = 'password';
                                }
                            }
                            elem.focus();
                        });
                    }, document.body);
                }

                for (var k in icons) {
                    if (k === 'del') {
                        _create(elem, k, icons[k], idx++);
                    } else if (k === 'pwd') {
                        _create(elem, k, icons[k], idx++);
                    } else if (k === 'query') {
                        _create(elem, k, icons[k], idx++);
                    } else if (k === 'enter' && $.isFunction(icons[k])) {
                        _enter(elem, icons[k]);
                    }
                }
                return this;
            },
            showIcon: function (elem, key, idx) {
                var d = elem.icons[key];
                if (!d) {
                    return this;
                }
                var show = true;
                if (key === 'del' ) {
                    var val = elem.value.trim();
                    show = val.length > 0;
                    d.icon.style.display = show ? '' : 'none';
                    d.show = show;
                }
                if (!show) {
                    return this;
                }
                var ps = $.getOffset(elem),
                    top = ps.top - (30 - ps.height) / 2, 
                    left = ps.left + ps.width - 30 * (idx + 1) - 1;
                    
                d.icon.style.top = top + 'px';
                d.icon.style.left = left + 'px';

                return this;
            },
            setIcon: function (ev, elem) {
                function _set(elem) {
                    for (var k in elem.icons) {
                        $.input.showIcon(elem, k, idx++);
                    }
                }
                var val = elem.value.trim(), len = val.length, idx = 0;
                if (len === 1) {
                    _set(elem);
                } else {
                    if (Util.timer['icon']) {
                        window.clearTimeout(Util.timer['icon']);
                    }
                    Util.timer['icon'] = window.setTimeout(function() {
                        _set(elem);
                    }, 256);
                }
                return this;
            },
            // 设置输入框内容格式
            // 需要设置输入格式的文本框，默认情况下是不允许空格和特殊字符的
            setFormat: function (elements, options) {
                var elems = Util.checkElemArray(elements), element, keyTypes = [
                    'open', 'none', //open | none 表示不限制输入，但需要验证选项等特殊格式
                    'char', 'number', 'char_number', 'word', 'int', 'long', 'float', 'double', 'bool', 'control', 'symbol', 
                    'option', 'ipv4', 'ipv6', 'port', 'hex', 'md5', 'angle', 'at'
                ];

                if ((!$.isArrayLike(elems) && !$.isArray(elems)) || !(element = $.toElement(elems[0]))) {
                    return this;
                }
                
                Util.buildOptionStyle();

                var par = $.extend({}, options),
                    opt = $.extend({
                        shift: true,            //是否允许shift键
                        space: false,           //是否允许空格
                        paste: true,            //是否允许粘贴
                        minus: null,            //是否允许减号（负号）
                        dot: null,              //是否允许小数点号
                        minLen: null,           //内容最小长度，-1表示不限制
                        maxLen: null,           //内容最大长度，-1表示不限制
                        valLen: null,           //内容固定长度，-1表示不限制
                        minVal: null,           //最小数值（整数、小数）
                        maxVal: null,           //最大数值（整数、小数）
                        types: null,
                        chinese: null,          //是否允许输入中文（默认不允许）
                        patterns: [],           //正则表达式，用于验证数据值是否正确
                        exceptions: [],         //例外的正则表达式，用于验证数据输入是否异常
                        codes: [],
                        excepts: [],
                        options: [],            //内容选项
                        editable: null,         //选项模式时是否可编辑
                        value: null,            //默认值
                        change: false,          //是否触发change事件
                        empty: null,            //允许空值
                        placeholder: null,      //提示信息
                        config: {},             //配置项，用于options选项框
                        icon: {}                //图标项，用于功能联动，如：删除、显示/隐藏、查询等
                    }, par),
                    MAX_HEIGHT = 364,
                    ZINDEX = 999999999,
                    cfg = $.extend({
                        append: null,           //是否追加选项，true-表示options参数 + element属性options
                        title: '',              //选项默认标题（当没有选择选项时显示）
                        name: '',               //选项名称
                        editable: null,         //选项是否可编辑，true-表示可以自由扩展选项
                        relative: null,         //相对位置(用于弹出层中的表单)，默认是绝对位置
                        number: null,           //是否显示序号(行号)
                        readonly: false,        //是否禁用输入(选项模式,只能选择不能输入)
                        display: true,          //是否显示值(value)
                        topPriority: false,     //是否优先显示在顶部
                        height: MAX_HEIGHT,     //选项框最大显示高度
                        width: null,            //选项框宽度
                        minWidth: 120,          //最小宽度
                        maxWidth: null,         //最大宽度
                        zindex: 0,              //选项框层级
                        show: false,            //是否显示可选项提示
                        x: null,
                        y: null
                    }, par.config), i, j;

                $.extend(cfg, {
                    MAX_HEIGHT: MAX_HEIGHT,
                    ZINDEX: ZINDEX
                });

                cfg.number = $.getParam(cfg, 'showNumber,number', null);
                cfg.display = $.getParam(cfg, 'showValue,display,show', null);
                cfg.show = $.isBoolean($.getParam(cfg, 'show'), false);
                cfg.x = $.getParam(cfg, 'left,x', 0);
                cfg.y = $.getParam(cfg, 'top,y', 0);

                //获取默认参数值，如果没有明确配置参数值，则从element属性中获取
                var ks = [['append'], ['editable'],['relative'],['number']];
                for (var k = 0 ; k < ks.length; k++) {
                    if (!$.isBoolean(cfg[ks[k][0]])) {
                        cfg[ks[k][0]] = $.getAttribute(element, 'opt-' + (ks[k][1] || ks[k][0]), 'false').inArray(['true', '1']);
                    }
                }
                var ns = [['width'],['height', 'maxHeight,height'],['zindex', 'zindex,zIndex']];
                for (var n = 0; n < ns.length; n++) {
                    if (!(cfg[ns[n][0]] = $.getParam(cfg, ns[n][1] || ns[n][0], 0))) {
                        cfg[ns[n][0]] = $.getAttribute(element, 'opt-' + ns[n][0], 0);
                    }
                }

                opt.config = cfg;

                opt.change = $.isBoolean($.getParam(opt, 'change,trigger'), false);
                opt.minLen = $.getParam(opt, 'minLength,minLen');
                opt.maxLen = $.getParam(opt, 'maxLength,maxLen');
                opt.valLen = $.getParam(opt, 'valueLength,valueLen,valLen');
                opt.minVal = $.getParam(opt, 'minValue,minVal');
                opt.maxVal = $.getParam(opt, 'maxValue,maxVal');

                opt.empty = $.getParam(opt, 'allowEmpty,empty');
                if (($.isBoolean(opt.empty) && opt.empty) || (!$.isNumber(opt.empty) && opt.empty)) {
                    opt.empty = {val: '', txt: '&nbsp;'};
                } else if ($.isString(opt.empty, true)) {
                    opt.empty = {val: '', txt: opt.empty};
                } else if (!$.isObject(opt.empty)) {
                    opt.empty = null;
                }

                if (!$.isArray(opt.options)) {
                    opt.options = [];
                }

                if ($.isDebug()) {
                    $.console.log('$.input.setFormat:', element.id, element, opt);
                }

                if (opt.config.append) {
                    opt.options = $.input.getElementOptionConfig(element).concat(opt.options);
                } else if (opt.options.length <= 0) {
                    //如果没有配置选项，则尝试从元素属性中获取
                    opt.options = $.input.getElementOptionConfig(element);
                }

                if ((!opt.patterns || opt.patterns.length <= 0) && $.isRegexp(opt.pattern)) {
                    opt.patterns = [opt.pattern];
                } else if ($.isRegexp(opt.patterns)) {
                    opt.patterns = [opt.patterns];
                }
                if ((!opt.exceptions || opt.exceptions.length <= 0) && $.isRegexp(opt.exception)) {
                    opt.exceptions = [opt.exception];
                } else if ($.isRegexp(opt.exceptions)) {
                    opt.exceptions = [opt.exceptions];
                }

                if ($.isNumber(opt.config.minWidth) && opt.config.minWidth &&  opt.config.minWidth < 50) {
                    opt.config.minWidth = 50;
                }
                if ($.isNumber(opt.config.width) && opt.config.width && opt.config.width < 50) {
                    opt.config.width = 50;
                }
                if ($.isBoolean(opt.types) && !opt.types) {
                    opt.types = ['none'];
                } else if ($.isString(opt.types, true)) {
                    opt.types = opt.types.split(/[,\|]/);
                }
                if ((!$.isArray(opt.types) || opt.types.length <= 0) && $.isString(opt.type, true)) {
                    opt.types = opt.type.split(/[,\|]/);
                }

                var types = $.isArray(opt.types) && opt.types.length > 0 ? opt.types : keyTypes,
                    excepts = $.isArray(opt.excepts) && opt.excepts.length > 0 ? opt.excepts : [],
                    ctls = [
                        8,      // backspace
                        9,      // tab
                        27,     // esc
                        13,     // enter
                        108,    // enter
                        37,     // left arrow
                        38,     // up arrow
                        39,     // right arrow
                        40,     // down arrow
                        46,     // delete
                    ],
                    // F1-F12功能键
                    funs = KC.FuncList,
                    keys = ctls.concat(opt.codes || []).concat(funs),
                    patterns = $.extend([], opt.patterns),
                    exceptions = $.extend([], opt.exceptions),
                    isNum = false,
                    isOpt = false,
                    isVal = false,
                    isBool = false,
                    isCnAble = $.isBoolean(opt.chinese, false),   //是否允许输入中文
                    isSelect = false,   //是否select控件元素
                    //是否要限制内容输入，如果配置的限制类型不匹配，则不限制内容输入
                    limit = 0,
                    decimalLen = $.isNumber(opt.decimalLen) ? opt.decimalLen : 8,
                    converts = [];

                keys = !opt.space ? keys : keys.concat([KC.Space]);
                keys = !opt.minus ? keys : keys.concat([KC.Min.Symbol['-'], KC.Symbol['-']]);
                keys = !opt.dot ? keys : keys.concat([KC.Min.Symbol['.'], KC.Symbol['.']]);

                if (1 === types.length) {
                    if (types[0].inArray(['options', 'option']) && !opt.config.readonly) {
                        types.push('open');
                        if (!opt.config.editable) {
                            opt.config.readonly = $.isBoolean((par.config || {}).readonly, true);
                        }
                    } else if (types[0].inArray(['boolean', 'bool'])) {
                        opt.config.readonly = $.isBoolean(par.config.readonly, true);
                    }
                }
                var _minus = opt.minus ? '[-]?' : '';

                for (i = 0; i < types.length; i++) {
                    var type = (types[i] || '').toLowerCase();
                    if (keyTypes.indexOf(type) > -1) {
                        limit++;
                    }
                    if (['options', 'option'].indexOf(type) > -1) {
                        isOpt = true;
                        continue;
                    }
                    if (type.inArray(['open', 'none', 'number', 'char_number', 'int', 'float', 'word', 'ipv4', 'ipv6', 'port', 'hex', 'md5', 'angle', 'at'])) {
                        keys = keys.concat(KC.NumList);       // 0-9键
                        keys = keys.concat(KC.Min.NumList); // 0-9键（小键盘）
                        if (type.inArray(['number', 'int', 'float', 'angle'])) {
                            isNum = true;
                        }
                        if (!type.inArray(['open', 'none', 'ipv6', 'word', 'at'])) {
                            opt.shift = false;
                        }
                    }
                    if (type.inArray(['open', 'none', 'control', 'at'])) {
                        // ;: =+ ,< -_ .> /? `~
                        keys = keys.concat([opt.space ? KC.Space : 0, 186, 187, 188, 189, 190, 191, 192]);
                        // [{ \| ]} '"
                        keys = keys.concat([219, 220, 221, 222]);
                    }
                    if (type.inArray(['open', 'none', 'symbol'])) {
                        // * + - . / (小键盘)  * + - . / (主键盘)
                        keys = keys.concat([106, 107, 109, 110, 111, 56, 187, 189, 190, 191]);
                    }

                    if (type.inArray(['open', 'none', 'char', 'char_number', 'word', 'at'])) {
                        for (j = KCC.A; j <= KCC.Z; j++) { keys.push(j); } // A-Z 键
                    } else if (type.inArray(['hex', 'ipv6', 'md5'])) {
                        for (j = KCC.A; j <= KCC.F; j++) { keys.push(j); } // A-F 键
                    } else if (type.inArray(['boolean', 'bool'])) {   // 0, 1
                        keys = keys.concat([KCC[0], KCC[1]]);
                        if (!opt.config.readonly) {
                            //true false yes no
                            keys = keys.concat([KCC.A, KCC.E, KCC.F, KCC.L, KCC.N, KCC.O, KCC.R, KCC.S, KCC.T, KCC.U, KCC.Y]);
                        }
                        if (opt.options.length <= 0) {
                            opt.options = [{ val: 1, txt: '是' }, { val: 0, txt: '否' }];
                        }
                        converts = converts.concat([[/^(true|yes|[1]{2,}|[1][01A-Z]+)$/i, 1], [/^(false|no|[0]{2,}|[0][01A-Z]+)$/i, 0]]);
                        opt.shift = false;
                        opt.maxLen = 5;
                        isBool = true;
                    } else if (type === 'int') {
                        // - (小键盘) - (主键盘)
                        //keys = keys.concat([KC.Symbol['-'], KC.Min.Symbol['-']]);
                    } else if (type === 'float') {
                        // - . (小键盘) - . (主键盘)
                        //keys = keys.concat([KC.Symbol['-'], KC.Min.Symbol['-'], KC.Symbol['.'], KC.Min.Symbol['.']]);
                        // . (小键盘) . (主键盘)
                        keys = keys.concat([KC.Symbol['.'], KC.Min.Symbol['.']]);
                        patterns = patterns.concat([
                            new RegExp('^(' + _minus + '[1-9][0-9]{0,23}[.]?[0-9]{0,' + decimalLen + '}|' + _minus + '[0]([.][0-9]{0,' + decimalLen + '})?)$'), 
                            opt.minus ? /^([0]?|[-])$/ : /^[0]?$/
                        ]);
                    } else if (type === 'angle') {
                        if (opt.dot === null || opt.dot) {
                            keys = keys.concat([KC.Symbol['.'], KC.Min.Symbol['.']]);
                        }
                        opt.maxVal = opt.maxVal || 360;
                        patterns = patterns.concat([
                            new RegExp('^360(\.[0]{0,' + decimalLen + '})?$|^([1-3][0-5][0-9]|[1-2][0-9]+|[0-9]{1,2})([.][0-9]{0,' + decimalLen + '})?$'), 
                            /^[0]?$/
                        ]);
                    } else if (type === 'port') {
                        patterns = patterns.concat([$.PATTERN.Port, /^[0]?$/]);
                        opt.maxLen = 5;
                    }
                    //ipv4 ipv6
                    if (type === 'ipv4') {
                        keys = keys.concat([KC.Symbol['.'], KC.Min.Symbol['.']]);
                        isVal = true;
                        patterns = patterns.concat([$.PATTERN.Ip, /^[0]{0}$/]);
                        //错误的IPv4输入格式
                        exceptions = exceptions.concat([/(\.\.)+|^([\d]{1,3}\.){4,}$|([\d]{4,})|(25[6-9]|(0|[3-9])[\d]{2})/]);
                        opt.maxLen = 15;
                        converts = converts.concat([{src: '127.', dest: '127.0.0.1'}, ['192.', '192.168.'], ['255.', '255.255.255.0']]);
                    } else if (type === 'ipv6') {
                        keys = keys.concat([KC.Symbol[':']]);
                        isVal = true;
                        patterns = patterns.concat([$.isIPv6, /^[0]{0}$/]);
                        //错误的IPv6输入格式
                        exceptions = exceptions.concat([/[^A-F0-9:]+|[:]{3,}|([\dA-F]{5,})|([\dA-F]{0,4}::|::[\dA-F]{0,4}){2,}|([\dA-F]{0,4}:[\dA-F]{0,4}){8,}/i]);
                        opt.maxLen = 39;
                    }
                    if (type === 'word') {
                        keys = keys.concat([KC.Symbol['-']]);
                    }
                    if (type==='md5' && !opt.valLen) {
                        opt.valLen = 32;
                    }
                }
                opt.patterns = patterns;
                opt.exceptions = exceptions;

                //$.console.log('keys: ', keys, ', patterns: ', opt.patterns);

                for (i = 0; i < elems.length; i++) {
                    var elem = $.toElement(elems[i]);
                    if (!$.isElement(elem) || !limit) {
                        continue;
                    }
                    isSelect = elem.tagName === 'SELECT';
                    elem.className = elem.className.addClass('oui-input-fmt');

                    if (isSelect) {
                        if (opt.config.minWidth) {
                            elem.style.minWidth = opt.config.minWidth + 'px';
                        }
                        if ($.isNumber(opt.config.maxWidth) && opt.config.maxWidth && opt.config.maxWidth >= opt.config.minWidth) {
                            elem.style.maxWidth = opt.config.maxWidth + 'px';
                        }
                        if ($.isNumber(opt.config.width) && opt.config.width) {
                            elem.style.width = opt.config.width + 'px';
                        }
                    } else {
                        $.input.buildIcon(elem, opt);
                    }

                    if (isOpt || isBool) {
                        opt.options = $.input.setOptionValues(opt.options);
                        elem.className = elem.className.addClass('input-opt-elem');

                        if (opt.empty && opt.empty.txt) {
                            opt.options.unshift({ val: opt.empty.val || '', txt: opt.empty.txt });
                        }

                        function _showOption(ev, elem, opt, action) {
                            $.input.hideOptionPanel(elem.optbox);
                            //这里不能用options，因为options是select元素的自有属性
                            elem.values = $.input.setOption(elem, opt.options, opt.config, action);
                        }
                        function _haveOption(elem) {
                            var id = $.getAttribute(elem, 'opt-id');
                            return id && $I(id) !== null;
                        }

                        if (!isSelect) {
                            if (opt.config.readonly) {
                                $.setAttribute(elem, 'readonly', 'readonly');
                                elem.style.cursor = 'default';
                                elem.placeholder = opt.placeholder || cfg.title || elem.placeholder || '\u8bf7\u9009\u62e9'; //请选择
                            } else {
                                var str = $.input.getOptionValues(opt.options).join(',');
                                if (opt.placeholder || cfg.title) {
                                    elem.placeholder = opt.placeholder || cfg.title;
                                } else if (str.length > 0 && elem.placeholder.indexOf(str) < 0) {
                                    //\u9009\u62e9\u6216\u8f93\u5165  选择或输入
                                    //\u53ef\u9009\u9879\uff1a  可选项：
                                    var prompt = (elem.placeholder ? ' ' : '\u9009\u62e9\u6216\u8f93\u5165 ');
                                    if (opt.config.show) {
                                        prompt += '\u53ef\u9009\u9879\uff1a' + str;
                                    }
                                    elem.placeholder += prompt;
                                } else if (!elem.placeholder) {
                                    elem.placeholder = '\u8bf7\u9009\u62e9';    //请选择
                                }
                            }
                            if (!$.isUndefinedOrNull(opt.value)) {
                                elem.value = opt.value;
                            }
                        } else {
                            elem.className = elem.className.addClass('input-opt-panel-select');
                            elem.options.length = 0;
                            if (opt.options.length > 0) {
                                var p = opt.options[0];
                                if (!$.isUndefinedOrNull(opt.value)) {
                                    for (var j = 0; j < opt.options.length; j++) {
                                        if (opt.options[j].val === opt.value) {
                                            p = opt.options[j];
                                            break;
                                        }
                                    }
                                }
                                var txt = opt.config.display && p.val !== p.txt ? p.val + ' - ' + p.txt : p.txt;
                                elem.options.add(new Option(txt, p.val));
                            }
                        }
                        //这里为什么不用$.addListener？
                        //因为这里需要阻止非法输入，而$.addListener不是独占式的
                        elem.onkeydown = function(ev) {
                            if (opt.types[0] === 'none') {
                                //设置功能图标
                                $.input.setIcon(ev, elem, opt);
                                return true;
                            }
                            var kc = $.getKeyCode(ev), 
                                ddl = this.tagName === 'SELECT', 
                                typed = $.getAttribute(this, 'opt-typed', '0').toInt(),
                                div = $I($.getAttribute(this, 'opt-id')),
                                ArrList = [KCA.Left, KCA.Top, KCA.Bottom, KCA.Right], //左 上 下 右
                                VimList = [KCA.H, KCA.K, KCA.J, KCA.L], //vim方向键 H  K  J  L
                                // 77 - M(中间); 85 - U(向上半屏); 60 - D(向下半屏）; 66 - B(向上一屏); 70 - F(向下一屏)
                                VimKey = [KCC.M, KCC.U, KCC.D, KCC.B, KCC.F],
                                shortcut = kc >= KCC[0] && kc % KCC[0] < 10;

                            if (kc.inArray([KC.Enter, KC.Min.Enter]) || ((ddl || keys.indexOf(KC.Space) < 0) && kc === KC.Space)) {
                                this.focus();
                                _showOption(ev, this, opt);
                                return false;
                            }
                            if (opt.change) {
                                $.trigger(elem, 'change');
                            }
                            if ((kc.inArray(ArrList) || 
                                ((ddl || opt.config.readonly || !kc.inArray(keys)) && 
                                    (kc.inArray(VimList) || kc.inArray(VimKey) || shortcut))) && 
                                (ddl || opt.config.readonly || !typed)) {
                                $.cancelBubble(ev);
                                var idx = ($.getAttribute(this, 'opt-idx') || '').toInt(),
                                    val = this.value.trim(),
                                    ps = $.input.getOptionValues(opt.options);

                                if (!_haveOption(this)) {
                                    _showOption(ev, this, opt, 0);
                                    idx = 0;
                                }
                                if (shortcut) {
                                    idx = kc % KCC[0];
                                } else {
                                    if (!idx && '' === val && ps.indexOf(val) < 0) {
                                        idx = 0;
                                    }
                                    if (kc.inArray(VimList)) {
                                        kc = ArrList[VimList.indexOf(kc)] || kc;
                                    }
                                    idx = kc.inArray([KCA.Left, KCA.Top]) ? idx - 1 : idx + 1;
                                }
                                $.input.selectOptionItem(idx, kc, this, $.getAttribute(this, 'opt-id'), shortcut);
                                return true;
                            }
                            if ($.input.checkKey(ev, ctls, excepts, opt) || $.input.checkKey(ev, funs, excepts, opt)) {
                                //9 - tab, 27 - esc
                                if (kc.inArray([KC.Tab, KC.Esc])) {
                                    //如果选项框弹出时，隐藏选项框，焦点不切换
                                    //如果选项框隐藏时，切换焦点
                                    if (div != null && div.style.display !== 'none') {
                                        $.cancelBubble(ev);
                                    }
                                    _showOption(ev, this, opt, 0);
                                    $.setTextCursorPosition(this);
                                } else if (!ddl && cfg.readonly && kc.inArray([KC.Backspace, KC.Delete])) {
                                    //backspace, delete键，表示选项被取消，用-1表示索引
                                    $.input.selectOptionItem(-1, null, this, $.getAttribute(this, 'opt-id'));
                                    this.value = '';
                                }
                                return true;
                            }
                            if (ddl) {
                                return true;
                            }
                            //允许输入的情况下
                            //若只指定选项，而没有指定其他输入类型，则不限制输入键
                            //当指定了输入类型(option除外)，则需要验证输入键值
                            if (!opt.config.readonly && ($.input.checkKey(ev, keys, excepts, opt) || types.length > 1)) {
                                if ($.getSelectedText(this)) {
                                    return true;
                                }
                                //设置功能图标
                                $.input.setIcon(ev, elem, opt);

                                var pos = $.getTextCursorPosition(this),
                                    key = ev.key,
                                    txt = this.value.trim(),
                                    val = pos <= 0 ? key + txt : txt.substr(0, pos + 1) + key + txt.substr(pos),
                                    ctl;

                                if ((ctl = $.input.replaceValue(ev, this, val, isCnAble, converts, $.input.getOptionValues(opt.options))).replace) {
                                    return false;
                                }
                                val = ctl.val;

                                if (!isVal && !isBool) {
                                    if (!$.input.checkVal(val, types, opt, true, this)) {
                                        if (!$.isCtrlKey(ev)) {
                                            _showOption(ev, this, opt, 2);
                                        }
                                        return false;
                                    }
                                } else if (exceptions.length > 0) {
                                    if ($.input.checkExcept(val, opt)) {
                                        return false;
                                    }
                                }
                                return (!isVal && !isBool) || $.input.checkValLen(val, opt, false, true, this);
                            } else if (opt.config.readonly && !$.isCtrlKey(ev)) {
                                _showOption(ev, elem, opt, 2);
                            }
                            return false;
                        };

                        if (!isSelect) {
                            $.addListener(elem, 'keyup', function(ev) {
                                if (opt.types[0] === 'none') {
                                    //设置功能图标
                                    $.input.setIcon(ev, elem, opt);
                                    return true;
                                }
                                var kc = $.getKeyCode(ev),
                                    val = this.value.trim(),
                                    ps = $.input.getOptionValues(opt.options),
                                    ctl;

                                if (kc.inArray([KCA.Left, KCA.Top, KCA.Right, KCA.Bottom])) {
                                    $.setAttribute(this, 'opt-typed', $.input.isInputTyped(ps, val) ? 1 : 0);
                                    return true;
                                }
                                if ((ctl = $.input.replaceValue(ev, elem, val, isCnAble, converts, ps)).replace) {
                                    $.setAttribute(this, 'opt-typed', $.input.isInputTyped(ps, ctl.val) ? 1 : 0);
                                    return false;
                                }
                                //设置功能图标
                                $.input.setIcon(ev, elem, opt);

                                val = ctl.val;

                                if(!$.input.checkFormat(this, $.extend([], opt.options), false, opt.config.editable)) {
                                    this.focus();
                                    return false;
                                }
                                $.setAttribute(this, 'opt-typed', $.input.isInputTyped(ps, val) ? 1 : 0);
                                if (opt.change) {
                                    $.trigger(elem, 'change');
                                }
                                return true;
                            });
                            
                            //内容指定，当输入的内容与选项不匹配时，输入框锁定焦点
                            $.addListener(elem, 'blur', function(ev) {
                                $.input.replaceValue(ev, this, this.value.trim(), isCnAble, converts, $.input.getOptionValues(opt.options));
                                if(!$.input.checkFormat(this, $.extend([], opt.options), false, opt.config.editable)) {
                                    this.focus();
                                }
                            });
                        }

                        //选项模式，默认显示选项框，若不想显示选项，需设置 showOption:false
                        if ($.isBoolean(opt.showOption, true)) {
                            //非只读（即可选可输入），若用mousedown则光标位置没法指定
                            $.addListener(elem, 'mousedown', function(ev) {
                                this.focus();
                                if (isSelect || opt.config.readonly) {
                                    $.cancelBubble(ev);
                                    _showOption(ev, this, opt);
                                } else if (elem.optbox) {
                                    elem.boxshow = elem.optbox.style.display !== 'none';
                                }
                                $.hidePopupPanel(elem.optbox);
                                return false;
                            });
                            if (!isSelect && !opt.config.readonly) {
                                $.addListener(elem, 'click', function(ev) {
                                    $.cancelBubble(ev);
                                    if (elem.optbox) {
                                        //mousedown冒泡事件中已切换显示列表框，所以这里需要恢复列表框的显示/隐藏
                                        elem.optbox.style.display = elem.boxshow ? '' : 'none';
                                    }
                                    _showOption(ev, this, opt, null);
                                    $.hidePopupPanel(elem.optbox);
                                    return false;
                                });
                            }
                        }
                        if (typeof elem.val === 'undefined') {
                            Object.defineProperty(elem, 'val', {
                                /*value: 'hello',
                                writable: true,
                                configurable: true,
                                */
                                get: function () {
                                    return elem.value;
                                },
                                set: function (val) {
                                    if (!elem.values) {
                                        _showOption(null, elem, opt, 0);
                                    }
                                    for (var i = 0; i < elem.values.length; i++) {
                                        var v = elem.values[i].val;
                                        if (v === val || v.toString() === val.toString()) {
                                            $.input.selectOptionItem(i + 1, null, elem, elem.div);
                                            break;
                                        }
                                    }
                                }
                            });
                        }
                    } else if (!isSelect) {
                        elem.placeholder = opt.placeholder || cfg.title || elem.placeholder;

                        //控制输入，当输入值不匹配时，输入框禁止输入
                        elem.onkeydown = function(ev) {
                            if (opt.types[0] === 'none') {
                                //设置功能图标
                                $.input.setIcon(ev, elem, opt);
                                return true;
                            }
                            if (opt.change) {
                                $.trigger(elem, 'change');
                            }
                            //设置功能图标
                            $.input.setIcon(ev, elem, opt);

                            var kc = $.getKeyCode(ev), selected = $.getSelectedText(this) ? true : false;
                            if ($.input.checkKey(ev, ctls, excepts, opt) || $.input.checkKey(ev, funs, excepts, opt)) {
                                return true;
                            }
                            //Ctrl + A / C, Ctrl + V
                            if ((ev.ctrlKey && (kc === KCC.A || kc === KCC.C)) || (opt.paste && ev.ctrlKey && (kc === KCC.V))) {
                                return true;
                            }
                            if (!opt.config.readonly && $.input.checkKey(ev, keys, excepts, opt)) {
                                if ($.getSelectedText(this)) {
                                    return true;
                                }
                                var pos = $.getTextCursorPosition(this),
                                    key = ev.key,
                                    txt = this.value.trim(),
                                    val = pos <= 0 ? key + txt : txt.substr(0, pos) + key + txt.substr(pos),
                                    ctl;

                                if ((ctl = $.input.replaceValue(ev, this, val, isCnAble, converts, $.input.getOptionValues(opt.options))).replace) {
                                    return false;
                                }
                                val = ctl.val;

                                if (!isVal) {
                                    if (!$.input.checkVal(val, types, opt, true, this)) {
                                        return false;
                                    }
                                } else if (exceptions.length > 0) {
                                    if ($.input.checkExcept(val, opt)) {
                                        return false;
                                    }
                                }
                                return !isVal || $.input.checkValLen(val, opt, false, true, this);
                            }
                            return false;
                        };
                        $.addListener(elem, 'keyup', function(ev) {
                            if (opt.types[0] === 'none') {
                                //设置功能图标
                                $.input.setIcon(ev, elem, opt);
                                return true;
                            }
                            var kc = $.getKeyCode(ev), val = this.value.trim(), ctl;
                            if ((ctl = $.input.replaceValue(ev, this, val, isCnAble, converts, $.input.getOptionValues(opt.options))).replace) {
                                return false;
                            }
                            if (opt.change) {
                                $.trigger(elem, 'change');
                            }
                            //设置功能图标
                            $.input.setIcon(ev, elem, opt);

                            val = ctl.val;
                            if (isVal) {
                                if(!$.input.checkFormat(this, patterns, true, opt.config.editable)) {
                                    return $.input.setWarnColor(this, false, true);
                                }
                            } else {
                                if ((!isVal && !$.input.checkVal(val, types, opt, false, this)) || !$.input.checkValLen(val, opt, false, false, this)) {
                                    return $.input.setWarnColor(this, false);
                                }
                            }
                            return $.input.setWarnColor(elem, true);
                        });
                        $.addListener(elem, 'blur', function(ev) {
                            if (opt.types[0] === 'none') {
                                return true;
                            }
                            if (opt.change) {
                                $.trigger(elem, 'change');
                            }
                            var val = this.value.trim(), len = val.length;
                            $.input.replaceValue(ev, this, val, isCnAble, converts, $.input.getOptionValues(opt.options));
                            if (isNum && (val.endsWith('-') || val.endsWith('.'))) {
                                return $.input.setWarnColor(this, false, true);
                            } else if (!$.input.checkVal(val, types, opt, false, this)) {
                                return $.input.setWarnColor(this, false, true);
                            } else if (isVal && (!$.input.checkFormat(this, patterns, true, opt.config.editable) || $.input.checkExcept(val, opt))) {
                                $.console.log('\u5185\u5bb9\u683c\u5f0f\u9519\u8bef', val);   //内容格式错误
                                return $.input.setWarnColor(this, false, true);
                            }
                            if (len > 0 && opt.minVal && parseFloat('0' + val, 10) < opt.minVal) {
                                return $.input.setWarnColor(this, false, true);
                            }
                            return $.input.setWarnColor(this, true);
                        });
                        if (!opt.paste) {
                            elem.onpaste = function() {
                                return false;
                            };
                        } else {
                            elem.onpaste = function(ev) {
                                if (opt.types[0] === 'none') {
                                    //设置功能图标
                                    $.input.setIcon(ev, elem, opt);
                                    return true;
                                }
                                //如果输入框的内容已经超出长度限制，则不能再粘贴内容
                                if (!$.input.checkValLen(this.value.trim(), opt, true, false, this)) {
                                    return $.input.setWarnColor(this, false);
                                }
                                //设置功能图标
                                $.input.setIcon(ev, elem, opt);
                            };
                        }

                        Object.defineProperty(elem, 'val', {
                            get: function () {
                                return elem.value;
                            },
                            set: function (val) {
                                elem.value = val;
                                $.trigger(elem, 'blur');
                            }
                        });
                    }
                }
                return $;
            }
        },
        setInputFormat: function (elements, options) {
            var elems = Util.checkElemArray(elements);
            for (var i = 0; i < elems.length; i++) {
                $.input.setFormat(elems[i], options);
            }
            return this;
        },
        setInputIcon: function (elements, options) {
            var elems = Util.checkElemArray(elements),
                opt = { icon: $.extend({}, options) };

            for (var i = 0; i < elems.length; i++) {
                if ($.isElement(elem = $.toElement(elems[i]))) {
                    $.input.buildIcon(elem, opt);
                    _setEvent(elem);
                }
            }
            function _setEvent(elem) {
                $.addListener(elem, 'keydown', function(ev) {
                    $.input.setIcon(ev, elem);
                });
                $.addListener(elem, 'keyup', function(ev) {
                    $.input.setIcon(ev, elem);
                });
            }
            return $;
        }
    });
}(OUI);

// md5
!function ($) {
    /*
        MD5算法（摘取自网络）
    */
    function md5(string, shorter) {
        function md5_RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }
        function md5_AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }
        function md5_F(x, y, z) {
            return (x & y) | ((~x) & z);
        }
        function md5_G(x, y, z) {
            return (x & z) | (y & (~z));
        }
        function md5_H(x, y, z) {
            return (x ^ y ^ z);
        }
        function md5_I(x, y, z) {
            return (y ^ (x | (~z)));
        }
        function md5_FF(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };
        function md5_GG(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };
        function md5_HH(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };
        function md5_II(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };
        function md5_ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };
        function md5_WordToHex(lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };
        function md5_Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
        string = md5_Utf8Encode(string);
        x = md5_ConvertToWordArray(string);
        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
            AA = a; BB = b; CC = c; DD = d;
            a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = md5_AddUnsigned(a, AA);
            b = md5_AddUnsigned(b, BB);
            c = md5_AddUnsigned(c, CC);
            d = md5_AddUnsigned(d, DD);
        }
        var code = (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
        return shorter ? code.substr(8, 16) : code;
    }

    $.extend({
        md5: md5
    });

    $.extendNative(String.prototype, {
        md5: function (shorter) {
            return $.md5(this, shorter);
        }
    });
}(OUI);
