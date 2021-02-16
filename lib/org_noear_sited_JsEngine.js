/*
 * Author:wistn
 * since:2019-09-16
 * LastEditors:Do not edit
 * LastEditTime:2021-02-17
 * Description:
 */
var vm = require('vm');
var Log = require('./android_util_Log');
var SdApi = require('./org_noear_sited_SdApi');
var SdExt = require('./org_noear_sited_SdExt');
class JsEngine {
    release() {
        if (this.engine != null) {
            // engine.getLocker().release();
            this.engine = null;
            this.source = null;
        }
    }
    constructor(app, sd) {
        this.source = sd;
        this.engine = vm;
        var callback = (...parameters) => {
            if (parameters.length > 0) {
                var arg1 = parameters[0];
                var jsType1 = {}.toString.call(arg1);
                if (jsType1.match(/string/i) || jsType1.match(/null/i)) {
                    SdApi.log(this.source, 'JsEngine.print', arg1);
                } else {
                    throw new Error(
                        '收到参数类型' +
                            jsType1 +
                            ' 插件print函数要求(第一个)参数是字符串'
                    );
                }
            }
        };
        this.contextObject = Object.create(null);
        this.contextObject.print = callback;
        var ext = new SdExt(sd);
        var v8Ext = {};
        v8Ext.get = (key) => {
            var jsType1 = {}.toString.call(key);
            if (jsType1.match(/string/i) || jsType1.match(/null/i)) {
                return ext.get(key);
            } else {
                throw new Error(
                    '收到参数类型' + jsType1 + ' 函数要求参数是字符串'
                );
            }
        };
        v8Ext.set = (key, val) => {
            var jsType1 = {}.toString.call(key);
            var jsType2 = {}.toString.call(val);
            if (
                (jsType1.match(/string/i) || jsType1.match(/null/i)) &&
                (jsType2.match(/string/i) || jsType2.match(/null/i))
            ) {
                ext.set(key, val);
            } else {
                throw new Error(
                    '收到参数类型' +
                        jsType1 +
                        ',' +
                        jsType2 +
                        ' 函数要求参数是字符串'
                );
            }
        };
        this.contextObject.SdExt = v8Ext;
        this.loadJs(enhanceObj); // 格式化对象方便打印
    }
    loadJs(code) {
        try {
            this.engine.runInNewContext(code, this.contextObject);
            // 在nodejs子对象方法内：eval声明全局变量/函数须要间接调用，有eval.call(null, code)或新变量指向eval。
            // 间接调用eval读取全局作用域中的变量会失败；eval.call(global, code)(md5和sha1库)的里面require("crypto")、require("buffer")时报错require is not defined，eval()的参数需要是字符串不能是require函数，Function全局引入不使用require的原生js函数new Base64().encode('xxx')失败且不能声明全局变量/函数。所以要vm虚拟机声明。
        } catch (ex) {
            console.trace(ex);
            SdApi.log(this.source, 'JsEngine.loadJs', ex);
            throw ex;
        }
        return this;
    }
    callJs(fun, atts) {
        if (this.source.schema >= 2) return this.callJs2(fun, atts.getJson());
        else return this.callJs1(fun, atts.getValues());
    }
    // 调用函数;可能传参数
    callJs1(fun, args) {
        // args类型是字符串组成的数组
        try {
            let temp = this.contextObject[fun](...args);
            // 或者用以下。(callJs1/callJs2不要vm.runInNewContext，不然遇到debugger效果不好)
            // let temp = new Function(fun, 'args', 'return ' + fun + '(...args)')(
            //     this.contextObject[fun],
            //     args
            // );
            return temp;
        } catch (ex) {
            console.trace(ex);
            SdApi.log(this.source, 'JsEngine.callJs:' + fun, ex);
            return null;
        }
    }
    callJs2(fun, json) {
        let jscode = [];
        jscode.push(fun);
        jscode.push('(');
        jscode.push(json);
        jscode.push(');');
        let code = jscode.join('');
        Log.v('jscode:', code);
        try {
            let temp = new Function(fun, 'return ' + code)(
                this.contextObject[fun]
            );
            return temp;
        } catch (ex) {
            console.trace(ex);
            SdApi.log(this.source, 'JsEngine.callJs:' + code, ex);
            return null;
        }
    }
}
exports = module.exports = JsEngine;
/* 把字符串当作代码表达式执行时需要双倍反斜杠，或者用原始字符串格式 */
var enhanceObj = String.raw`
function enhanceObj() {
    'use strict';
    var backslashN = '\n';
    function pretty(obj, space) {
        var indent = '',
        subIndents = '';
        if (space == null) space = 4;
        if (typeof space == 'number') {
            for (var i = 0; i < space; i++) {
                indent += ' ';
            }
        } else if (typeof space == 'string') {
            indent = space;
        }
        function str(obj) {
            var jsType = Object.prototype.toString.call(obj);
            if (
                jsType.match(/object (String|Date|Function|JSON|Math|RegExp)/)
            ) {
                return JSON.stringify(String(obj));
            } else if (jsType.match(/object (Number|Boolean|Null)/)) {
                return JSON.stringify(obj);
            } else if (jsType.match(/object Undefined/)) {
                return JSON.stringify('undefined');
            } else {
                if (jsType.match(/object (Array|Arguments|Map|Set)/)) {
                    if (jsType.match(/object (Map|Set)/)) {
                        /* es6新增的方法和参数类型 */
                        obj = Array.from(obj);
                    }
                    var partial = [];
                    subIndents = subIndents + indent;
                    var len = obj.length;
                    for (var i = 0; i < len; i++) {
                        partial.push(str(obj[i]));
                    }
                    var result =
                        len == 0
                            ? '[]'
                            : indent.length
                            ? '[' +
                              backslashN +
                              subIndents +
                              partial.join(',' + backslashN + subIndents) +
                              backslashN +
                              subIndents.slice(indent.length) +
                              ']'
                            : '[' + partial.join(',') + ']';
                    subIndents = subIndents.slice(indent.length);
                    return result;
                } else if (
                    jsType.match(
                        /object (Object|Error|global|Window|HTMLDocument)/i
                    ) ||
                    obj instanceof Error
                ) {
                    var partial = [];
                    subIndents = subIndents + indent;
                    var ownProps = Object.getOwnPropertyNames(obj);
                    /* Object.keys 为自身非继承属性(不用for in因为for遍历继承的祖先属性)，Object.getOwnPropertyNames 在前者基础上包括不可枚举属性  */
                    var len = ownProps.length;
                    for (var i = 0; i < len; i++) {
                        partial.push(
                            str(ownProps[i]) +
                                (indent.length ? ': ' : ':') +
                                str(obj[ownProps[i]])
                        );
                    }
                    var result =
                        len == 0
                            ? '{}'
                            : indent.length
                            ? '{' +
                              backslashN +
                              subIndents +
                              partial.join(',' + backslashN + subIndents) +
                              backslashN +
                              subIndents.slice(indent.length) +
                              '}'
                            : '{' + partial.join(',') + '}';
                    subIndents = subIndents.slice(indent.length);
                    return result;
                } else {
                    return JSON.stringify(String(obj));
                }
            }
        }
        function decycle(obj) {
            /* the function can solve circular structure like JSON.decycle, the return value can be decoded by JSON.retrocycle(JSON.parse()) */
            var arrParents = [];
            return (function derez(obj, path) {
                var jsType = Object.prototype.toString.call(obj);
                if (
                    jsType.match(
                        /object (String|Date|Function|JSON|Math|RegExp|Number|Boolean|Null|Undefined)/
                    )
                ) {
                    return obj;
                } else {
                    if (jsType.match(/object (Array|Arguments|Map|Set)/)) {
                        var len = arrParents.length;
                        for (var i = 0; i < len; i++) {
                            /* arr like [obj, '$'] */
                            var arr = arrParents[i];
                            if (obj === arr[0]) {
                                return { $ref: arr[1] };
                            }
                        }
                        arrParents.push([obj, path]);
                        var newObj = [];
                        if (jsType.match(/object (Map|Set)/)) {
                            /* es6新增的方法和参数类型 */
                            obj = Array.from(obj);
                        }
                        var length = obj.length;
                        for (var i = 0; i < length; i++) {
                            newObj[i] = derez(obj[i], path + '[' + i + ']');
                        }
                        return newObj;
                    } else {
                        var len = arrParents.length;
                        for (var i = 0; i < len; i++) {
                            /* arr like [obj, '$'] */
                            var arr = arrParents[i];
                            if (obj === arr[0]) {
                                return { $ref: arr[1] };
                            }
                        }
                        arrParents.push([obj, path]);
                        var newObj = {};
                        var ownProps = Object.getOwnPropertyNames(obj);
                        var length = ownProps.length;
                        for (var i = 0; i < length; i++) {
                            newObj[ownProps[i]] = derez(
                                obj[ownProps[i]],
                                path + '[' + JSON.stringify(ownProps[i]) + ']'
                            );
                        }
                        return newObj;
                    }
                }
            })(obj, '$');
        }
        return str(decycle(obj));
    }
    if (typeof window == 'undefined') {
        /* 插件环境用，可在多多猫和js/py版SiteD插件引擎执行 */
        if (typeof this.WebAssembly != 'undefined') {
            delete this.WebAssembly // 删除是因为py版虚拟机ChakraCore打印this.WebAssembly有无穷循环
        }
        if (typeof pretty != 'undefined') {
            var tmp = this.print;
            var console_log = function () {
                var arr = [];
                var len = arguments.length;
                for (var i = 0; i < len; i++) {
                    arr.push(pretty(arguments[i]));
                }
                tmp(String(arr));
            };
            this.print = console_log;
        }
    }
}
enhanceObj.call(this);
`;
