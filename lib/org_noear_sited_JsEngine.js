/*
 * Author:wistn
 * since:2019-09-16
 * LastEditors:Do not edit
 * LastEditTime:2020-04-24
 * Description:
 */
var Log = require('./android_util_Log');
var SdApi = require('./org_noear_sited_SdApi.js');
var SdExt = require('./org_noear_sited_SdExt.js');
var vm = require('vm');
class JsEngine {
    release() {
        if (this.engine != null) {
            // engine.getLocker().release();
            this.engine = null;
            this.source = null;
        }
    }
    constructor(app, sd) {
        this.engine = null;
        this.source = sd;
        // this.engine = V8.createV8Runtime(null, app.getApplicationInfo().dataDir); java用j2v8引擎
        var callback = (...parameters) => {
            if (parameters.length > 0) {
                var arg1 = parameters[0];
                SdApi.log(this.source, 'JsEngine.print', arg1.toString());
            }
        };
        global.print = callback;
    }
    loadJs(code) {
        try {
            vm.runInContext(
                code,
                vm.createContext(
                    Object.assign(global, {
                        require: require
                    })
                )
            );
            // 预加载了批函数。
            // 在nodejs子对象方法内：需要间接调用eval，有eval.call(null, code)或新变量指向eval，来声明全局的变量/函数；间接调用eval读取全局作用域中的变量会失败；
            // eval.call(global, code)(md5和sha1库)的里面require("crypto")、require("buffer")时报错require is not defined，eval()的参数需要是字符串不能是require函数，Function全局引入不使用require的原生js函数new Base64().encode('xxx')失败且不能声明全局的变量/函数。不想判断2种处理所以vm虚拟机运行
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
            let temp = new Function('args', 'return ' + fun + '(...args)')(
                args
            ); // 或者global[fun](...args);或者
            // let temp = vm.runInContext(
            //     fun + '(...args)',
            //     vm.createContext(
            //         Object.assign(global, {
            //             args: args
            //         })
            //     )
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
            let temp = new Function('return ' + code)();
            return temp;
        } catch (ex) {
            console.trace(ex);
            SdApi.log(this.source, 'JsEngine.callJs:' + code, ex);
            return null;
        }
    }
}
exports = module.exports = JsEngine;
