
/*
    @Title: OUI
    @Description：JS通用代码库
    @Author: oukunqing
    @License：MIT

    $.form 表单验证插件
*/

!function ($) {
    'use strict';

    var customAttrs = {
        DATE_FORMAT: "date-format,dateformat",
        DATA_FORMAT: "data-format,dataformat,value-format,valueformat",
        OLD_VALUE: "old-value,oldvalue",
        DATA_TYPE: "data-type,datatype,value-type,valuetype",
        DATA_SHOW: "data-show,data-auto",
        MIN_VALUE: "min-value,minvalue,minValue,min-val",
        MAX_VALUE: "max-value,maxvalue,maxValue,max-val",
        DEFAULT_VALUE: "default-value,defaultvalue,def-val,defval,dval,dv"
    };
    var isElement = function (element) {
        return element !== null && typeof element === 'object' && typeof element.nodeType === 'number';
    },
        initFormConfig = function (formElement, options, elements) {
            if ($.isString(formElement)) { formElement = document.getElementById(formElement.replace(/^[#]+/, '')); }
            if (!$.isElement(formElement) || !formElement.getElementsByTagName) {
                throw new Error('element 参数错误');
            }
            var id = formElement.id || '',
                opt = $.extend({}, options),
                messages = {
                    required: '请输入{0}',
                    select: '请选择{0}',
                    minLength: '{0}请勿小于{1}个字符',
                    maxLength: '{0}请勿超过{1}个字符',
                    minValue: '请输入大于或等于{0}的{1}',
                    maxValue: '请输入小于或等于{0}的{1}',
                    minMax: '请输入{0} - {1}之间的{2}',
                    number: '请输入{0}',
                    pattern: '请输入正确的{0}'
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
                        tagName: '*',   //指定要获取的HTML标签类型
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
                        md5: false,
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
                        if (!$.isObject(element) || !element.getElementsByTagName) { throw new Error('element 参数输入错误'); }
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
                        var configs = element.configs, messages = $.extend({}, op.messages, field.messages);
                        if (value === 'on') {
                            value = element.checked ? 1 : 0;
                        } else {
                            if (element.checked && field.dataType !== 'string' && $.isNumeric(value)) {
                                switch (field.dataType) {
                                    case 'int': value = parseInt(value, 10); break;
                                    case 'float': case 'decimal': value = parseFloat(value, 10); break;
                                }
                            } else if (!element.checked) {
                                value = isSingle && $.isNumeric(value) ? 0 : '';
                            }
                        }
                        if (field.required && isSingle && !element.checked) {
                            var msg = (messages.select || configs.messages.select).format(field.title || '');
                            return { pass: false, value: value, message: msg };
                        }
                        return { pass: true, value: value, message: '' };
                    },
                    checkValue: function (element, value, field, configs) {
                        var isEvent = typeof configs === 'undefined';
                        value = value || op.getValue(element);
                        field = field || element.field;
                        configs = configs || element.configs;

                        //获取元素内容时，若元素指定了dataformat，则需要去除自动添加的分隔符
                        var fmt = $.getAttribute(element, customAttrs.DATA_FORMAT);
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
                            title = getTitle(field, '');

                        if (field.required && !field.empty && '' === value) {   // 空值验证
                            if (field.tag === 'SELECT' || op.isLegalName(field.attribute)) {
                                return result(false, (messages.select || messages.required || configs.messages.select).format(title));
                            } else {
                                return result(false, (messages.required || configs.messages.required).format(title));
                            }
                        }
                        if (field.dataType === 'string') {
                            if ('' === value) { return result(true, value); }
                            var pattern = field.pattern || op.valuePattern[field.type], validate = field.validate || configs.validate;
                            var minLen = field.minLength || field.minLen,
                                maxLen = field.maxLength || field.maxLen;
                            if ($.isFunction(validate)) {    // 外部验证函数（优先）
                                if (!validate(value, element)) { return result(false); }
                            } else if ($.isInteger(minLen) && len < minLen) {
                                return result(false, (messages.minLength || configs.messages.minLength).format(title, minLen));
                            } else if ($.isInteger(maxLen) && len > maxLen) {
                                return result(false, (messages.maxLength || configs.messages.maxLength).format(title, maxLen));
                            } else if (pattern && !pattern.test(value)) {   // 正则表达式验证
                                return result(false, (messages.pattern || configs.messages.pattern).format(title));
                            }
                        } else {
                            // 验证数字输入，大小值范围限定，其中 type="hidden" 默认值至少为0
                            var val = value, numType = '数字', strict = field.strict || configs.strict;
                            //不是必填项的数字，如果没有填写，则取默认值或0
                            if (value === '' && !field.required) {
                                value = field.value || 0;
                                //var dataShow = $.getAttribute(element, 'data-show,data-auto', '1').toInt();
                                var dataShow = $.getAttribute(element, customAttrs.DATA_SHOW, '1').toInt();
                                if (!isEvent && dataShow === 1 && typeof element.value !== 'undefined') {
                                    element.value = value;
                                }
                            }
                            switch (field.dataType) {
                                case 'int':
                                    value = parseInt(value, 10);
                                    numType = '整数';
                                    break;
                                case 'float':
                                case 'decimal':
                                    value = parseFloat(value, 10);
                                    numType = '小数';
                                    break;
                                case 'port':
                                    value = parseInt(value, 10);
                                    if (!isNaN(value) && (value < 0 || value > 65535)) {
                                        return result(false, '端口数值应介于0 - 65535之间');
                                    }
                                    numType = '端口';
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
                                    min = parseFloat($.getAttribute(element, customAttrs.MIN_VALUE, ''), 10);
                                }
                                if ($.isUndefined(max)) {
                                    max = parseFloat($.getAttribute(element, customAttrs.MAX_VALUE, ''), 10);
                                }

                                if ($.isNumeric(min) && $.isNumeric(max)) {
                                    msg = (messages.minMax || configs.messages.minMax).format(min, max, numType);
                                } else if ($.isNumeric(min)) {
                                    msg = (messages.minValue || configs.messages.minValue).format(min, numType);
                                } else if ($.isNumeric(max)) {
                                    msg = (messages.maxValue || configs.messages.maxValue).format(max, numType);
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
                            }
                        }
                        //相同内容检测
                        if ($.isObject(field.same) && field.same.id) {
                            var target = document.getElementById(field.same.id);
                            if (target && target.value !== value) {
                                return result(false, field.same.message || field.same.msg || '两次输入的内容不一样');
                            }
                        }
                        //内容去重检测
                        if ($.isObject(field.distinct) && field.distinct.id) {
                            var target = document.getElementById(field.distinct.id);
                            if (target && target.value === value) {
                                return result(false, field.distinct.message || field.distinct.msg || '内容不能重复');
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
                                var options = { time: $.isNumber(time) ? time : 0, tipsMore: true, for: forname };
                                var position = (element.field || {}).position || configs.position;
                                var tooltipStyle = configs.tooltipStyle ||
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
                    getFieldConfig: function (element, fields) {
                        var isValue = function (s) { return !$.isUndefined(s) && !$.isObject(s); },
                            checkField = function (field, elem) {
                                var arr = ['string', 'int', 'float', 'decimal'];
                                if (!$.isString(field.dataType) || arr.indexOf(field.dataType) < 0) {
                                    //var elemDataType = $.getAttribute(elem, 'data-type,datatype,value-type,valuetype', '');
                                    var elemDataType = $.getAttribute(elem, customAttrs.DATA_TYPE, '');
                                    field.dataType = elemDataType || arr[0];
                                }
                                //默认值字段设置
                                if (field.value === '') {
                                    field.value = isValue(field.val) ? field.val : isValue(field.defaultValue) ? field.defaultValue : field.value;
                                }
                                //如果没有设置默认值，则取用（自定义的）默认值属性的值
                                if (field.value === '') {
                                    var defVal = $.getAttribute(elem, customAttrs.DEFAULT_VALUE, '');
                                    if (!$.isUndefined(defVal)) {
                                        field.value = defVal;
                                    }
                                }
                                if (field.required === null) {
                                    field.required = $.getAttribute(elem, 'required', '') === 'required' || false;
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
                            minValue: '', maxValue: '',   //最小值、最大值（用于验证输入的数字大小）
                            required: null,            //是否必填项
                            empty: false,               //是否允许空值
                            strict: false,              //是否严格模式（检测输入内容的类型）
                            md5: false,                 //是否MD5加密
                            minLength: '', maxLength: '', //字符长度
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
                                keyup: function () { op.showTooltip(op.checkValue(this), this, false, fid); }
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
                    setValue: function (element, value, fieldConfig, isArray) {
                        var attr = fieldConfig.field.attribute || fieldConfig.field.attr;
                        var val = isArray ? value.join(',') : value;
                        if (!isArray && ('' + val).trim() !== '') {
                            var dtfmt = $.getAttribute(element, customAttrs.DATE_FORMAT);
                            if (dtfmt && val.toDate(true).isDate()) {
                                val = val.toDateString(dtfmt);
                            } else {
                                var fmt = $.getAttribute(element, customAttrs.DATA_FORMAT);
                                if (fmt) {
                                    val = fmt.format(val);
                                }
                            }
                        }
                        if (!op.isLegalName(attr)) {
                            if (typeof element.value === 'undefined') {
                                element.innerHTML = val;
                            } else {
                                element.value = val;
                            }
                        } else {
                            element.setAttribute(attr, val);
                        }
                        return true;
                    },
                    setSelectOption: function (element, value, fieldConfig, isArray) {
                        var text = value, val = value, isEmptyArray = false;
                        if (isArray) {
                            isEmptyArray = 0 === value.length, val = value[0] || '', text = value[1] || val;
                        }
                        element.value = value;
                        //当下拉选项不存在时，是否追加选项
                        if (fieldConfig.field.appendOption && element.selectedIndex < 0) {
                            if (isEmptyArray) {
                                return false;
                            }
                            element.options.add(new Option(text, val));
                            //element.value = value;
                            element.selectedIndex = element.options.length - 1;
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
        getElementsData = function (warns, arr, op, formElem) {
            formElem = $.toElement(formElem);
            var data = {}, configs = op.configs, len = arr.length;
            for (var i = 0; i < len; i++) {
                var obj = arr[i], tag = obj.tagName, type = obj.type, key = '';
                if (op.tagPattern.test(tag) && op.typePattern.test(type)) {
                    //获取字段参数配置
                    var fc = op.getFieldConfig(obj, op.fields), result = {};
                    //console.log('obj: ', obj, ', tag: ', tag, ', type: ', type, ', nc: ', fc);
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
                            if (fc.field.md5 && $.isString(result.value, true)) {
                                data[fc.dataKey || fc.key] = $.md5(result.value);
                            } else {
                                data[fc.dataKey || fc.key] = result.value;
                            }
                        }
                    } else {
                        if ((key = fc.dataKey || fc.nameKey || fc.key) !== '') {
                            if ($.isUndefined(data[key])) {
                                data[key] = [];
                            }
                            if (!$.isArray(data[key])) {
                                $.console.warn('The name is repeated with the id.', obj);
                            } else if ('' !== $.trim(result.value)) {
                                data[key].push(result.value);
                            }
                        }
                    }
                }
            }
            if (warns.length > 0) {
                //if (configs.focusInvalid) {
                if (!configs.focusInvalid) {
                    op.setFocus(warns[0].element);
                }
                return false;
            } else {
                for (var k in data) {
                    var v = data[k];
                    if ($.isArray(v)) {
                        if (v.length <= 1) {
                            //data[k] = v[0] || '';
                            data[k] = ($.isUndefined(v[0]) || v[0] === '') ? '' : v[0];
                        } else if (configs.isJoin) {
                            data[k] = v.join(configs.joinSeparate);
                        }
                    }
                }
                return data;
            }
        },
        getFormData = function (formElement, options, elements) {
            //获取表单参数配置
            var warns = [], arr = [], op = initFormConfig(formElement, options), configs = op.configs;
            if ($.isObject(elements) && elements.length > 0 && !configs.dynamic) {
                arr = elements;
            } else {
                arr = op.formElement.getElementsByTagName(configs.tagName || "*");
            }
            var data = getElementsData(warns, arr, op, formElement);
            if ($.isDebug()) {
                console.log('data: ', data, ', warns: ', warns);
            }
            return data;
        },
        getFormParam = function (formElement, options, elements) {
            var opt = $.extend({ tagName: '' }, options);
            var param = {}, appointTag = opt.tagName.trim() !== '';
            if ($.isArray(elements)) {
                for (var i = 0; i < elements.length; i++) {
                    var obj = elements[i], id = obj.id;
                    if (id) {
                        param[obj.id] = obj.value.trim();
                    }
                }
            } else {
                var form = $.toElement(formElement);
                elements = form.getElementsByTagName(opt.tagName || "*");
                for (var i = 0; i < elements.length; i++) {
                    var obj = elements[i], id = obj.id, tag = obj.tagName.toUpperCase(), type = obj.type;
                    if (id) {
                        if ((appointTag && tag === opt.tagName) ||
                            (!appointTag && ['INPUT', 'SELECT', 'TEXTAREA'].indexOf(tag) > -1 &&
                                ['button', 'submit', 'hidden', 'password'].indexOf(type) < 0)) {
                            param[obj.id] = obj.value.trim();
                        }
                    }
                }
            }
            return param;
        },
        filterData = function (options, formData) {
            if (!$.isObject(formData)) {
                formData = options.formData || options.datas || options.data;
            }
            return formData;
        },
        setElementsData = function (data, arr, op, isTable) {
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
                    var fc = op.getFieldConfig(obj, op.fields), value = data[fc.key], isArray = $.isArray(value);
                    if ($.isUndefined(value)) {
                        value = data[fc.nameKey];
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
                            op.setValue(obj, value, fc, isArray);
                        } else {
                            var tmp = document.getElementsByName(fc.name), vals = isArray ? value : value.split(',');
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
        setFormData = function (formElement, options, formData) {
            var data = filterData(options, formData), list = [];
            if (!$.isEmpty(data)) {
                var op = initFormConfig(formElement, options), configs = op.configs,
                    arr = op.formElement.getElementsByTagName(configs.tagName || "*");
                list = setElementsData(data, arr, op);
            }
            return list;
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
        };


    /*
        MD5算法摘取自网络
    */
    function md5(string) {
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
        return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
    }

    $.extend({
        form: {
            isElement: isElement,
            setFormVerify: setFormVerify,
            getFormData: getFormData,
            getFormParam: getFormParam,
            setFormData: setFormData,
            getTableData: getTableData,
            setTableData: setTableData,
            filterData: filterData,
            findElement: findElement,
            validate: function (element) {
                var elems = $.isArray(element) ? element : [element];
                for (var i = 0; i < elems.length; i++) {
                    var elem = $.toElement(element);
                    if ($.isElement(elem) && $.isFunction(elem.validate)) {
                        elem.validate();
                    }
                }
            }
        },
        md5: md5
    });

    $.extend($.form, {
        //还原输入框原始值，原始值保存在输入框 自定义属性 old-value 中
        restoreValue: function (elements) {
            var elems = $.isArray(elements) ? elements : [elements];
            for (var i = 0; i < elems.length; i++) {
                var elem = $.toElement(elems[i]);
                if ($.isElement(elem)) {
                    elem.value = $.isValue($.getAttribute(elem, customAttrs.OLD_VALUE), '');
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
    });

    var showAjaxError = function (jqXHR, textStatus, errorThrown) {
        if (0 === jqXHR.status) { return false; }
        //jquery ajax 中出现的12031错误状态码的原因没有查到，如果有出现，暂时先屏蔽
        if (12031 === jqXHR.status || jqXHR.status > 12000) {
            console.log(jqXHR.status, textStatus, errorThrown);
            return false;
        }

        var html = [
            '应用程序服务端异常，详细信息如下：',
            'status: ' + jqXHR.status,
            'textStatus: ' + textStatus,
            'errorThrown: ' + errorThrown
        ];
        //指定对话框ID appServerError，防止重复出现多个对话框
        $.alert(html.join('<br />'), '服务异常', { id: 'appServerError', icon: 'error', copyAble: true });
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
                html.push('可能的原因：');
                html.push(error);
            }
            var dialogId = data.dialogId || data.dialog || '';
            var callback = null;
            if ($.isFunction(window.showAjaxFail)) {
                callback = function () {
                    window.showAjaxFail(data);
                };
            }
            $.alert(html.join('<br />'), '提示信息', { icon: 'warning', copyAble: true, id: dialogId, callback: callback });
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
                receiveAll: false
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
                            console.log('data: ', data);
                        }
                        var callback = opt.callback || opt.success;
                        if ($.isFunction(callback)) {
                            if (opt.getJSON || opt.getJson) {
                                callback(data, opt.param, textStatus, jqXHR);
                            } else if (opt.receiveAll || 1 === data.result || 1 === data.Result) {
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
                $.alert('表单验证参数错误');
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
                complete = options.complete;

            //1. 赋值（不验证规则）
            if ($.isObject(formData)) {
                elements = $f.setFormData(element, options, formData);
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
                            var formData = $f.getFormData(element, options, elements);
                            return debounce ? delayCallback(callback, formData) : callback(formData), false;
                        };
                    } else {
                        $(this).submit(function () {
                            var formData = $f.getFormData(element, options, elements);
                            return debounce ? delayCallback(callback, formData) : callback(formData), false;
                        });
                    }
                } else if (handler) {
                    $(handler).click(function () {
                        var formData = $f.getFormData(element, options, elements);
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

!function ($) {
    'use strict';

    var Cache = {
        debounces: {}
    };

    var Factory = {
        buildDebounce: function(options, callback) {
            if ($.isFunction(options)) {
                callback = options;
                options = {};
            }
            var opt = $.extend({ id: 'debounce' }, options);
            if ($.isFunction(callback)) {
                opt.callback = callback;
            }
            var cache = Factory.getCache(opt.id);
            if (cache !== null) {
                return cache.debounce.initial($.extend(cache.options, opt));
            } else {
                return new Debounce(opt);
            }
        },
        initCache: function (debounce, options) {
            var key = 'debounce-' + debounce.id;
            Cache.debounces[key] = {
                id: debounce.id,
                debounce: debounce,
                options: options
            };
            return this;
        },
        updateCache: function (debounce, options) {
            var key = 'debounce-' + debounce.id;
            $.extend(Cache.debounces[key], options);
            return this;
        },
        getCache: function (id) {
            var key = 'debounce-' + id;
            return Cache.debounces[key] || null;
        },
        isFirst: function (debounce, timeout) {
             var ts = new Date().getTime();
            //上次点击若超过5秒钟，则不启用延时
            if (!debounce.lastTime || (ts - debounce.lastTime > timeout)) {
                return debounce.lastTime = ts, true;
            }
            return false;
        }
    };

    function Debounce (options) {
        var opt = $.extend({
            id: 'debounce',
            enable: true,
            //延时时长，默认300毫秒
            delay: 300,
            //防抖时限，默认5000毫秒
            timeout: 5000,
            callback: function () {
                console.log('debounce: ');
            }
        }, options);

        this.id = opt.id;
        this.timer = null;
        this.lastTime = 0;

        this.initial(opt);
    }

    Debounce.prototype = {
        initial: function (opt) {
            Factory.initCache(this, opt);

            return this.callback(opt);
        },
        callback: function(opt) {
            if (!opt.enable || !opt.delay) {
                if ($.isFunction(opt.callback)) {
                    opt.callback();
                }
            } else {
                this.delayCallback(opt);
            }
            return this;
        },
        delayCallback: function(opt) {
            var _ = this;
            var func = opt.callback;
            if (!$.isFunction(func)) {
                return _;
            }
            if (Factory.isFirst(_, opt.timeout)) {
                return func(), _;
            }
            if (_.timer) {
                window.clearTimeout(_.timer);
            }
            _.timer = window.setTimeout(function() {
                func();
            }, opt.delay);

            return _;
        }
    };

    $.extend({
        debounce: function(options, callback) {
            return Factory.buildDebounce(options, callback);
        }
    });
}(OUI);