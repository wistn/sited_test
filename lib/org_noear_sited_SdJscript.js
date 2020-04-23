/*
 * Author:wistn
 * since:2019-09-19
 * LastEditors:Do not edit
 * LastEditTime:2020-04-13
 * Description:
 */
var Util = require('./org_noear_sited_Util');
var TextUtils = require('./mytool').TextUtils;
var SdNode = require('./org_noear_sited_SdNode');
var fs = require('fs');
var readlineSync = require('./mytool.js').readlineSync;
var Log = require('./android_util_Log.js');
var HttpMessage = require('./org_noear_sited_HttpMessage.js');

class SdJscript {
    constructor(source, node) {
        this.require;
        this.code;
        this.s = source;
        if (node == null) {
            this.code = '';
            this.require = new SdNode(source).buildForNode(null);
        } else {
            this.code = Util.getElement(node, 'code').text();
            this.require = new SdNode(source).buildForNode(
                Util.getElement(node, 'require')
            );
        }
    }
    loadJs(app, js) {
        if (this.require.isEmpty() == false) {
            for (let n1 of this.require.items()) {
                // 1.如果本地可以加载并且没有出错
                if (TextUtils.isEmpty(n1.lib) == false) {
                    if (this.loadLib(app, js, n1.lib)) continue;
                }
                // 2.尝试网络加载
                Log.v('SdJscript', n1.url.value);
                if (n1.cache == 0) {
                    n1.cache = 1; // 长久缓存js文件 //默认长久缓存
                }
                let msg = new HttpMessage(n1, n1.url.value);
                msg.callback = (code, sender, text, url302) => {
                    if (code == 1) {
                        js.loadJs(text);
                    }
                };
                Util.http(this.s, false, msg); // java版是异步请求Http，所以插件运行时第一次调用网络库失败，但后面会缓存到sited文件夹，再刷新主进程就行了因为第二次自动改为从sited文件夹缓存同步读取库代码。nodejs版也是
            }
        }
        if (TextUtils.isEmpty(this.code) == false) {
            js.loadJs(this.code); // 预加载插件script/code(兼容旧格式jscript/code)节点即js代码部分
        }
    }
    //---------------------
    //
    loadLib(app, js, lib) {
        // Resources asset = app.getResources();
        let asset = __dirname;
        switch (lib) {
            case 'md5':
                return SdJscript.tryLoadLibItem(asset, 'R.raw.md5', js);
            case 'sha1':
                return SdJscript.tryLoadLibItem(asset, 'R.raw.sha1', js);
            case 'base64':
                return SdJscript.tryLoadLibItem(asset, 'R.raw.base64', js);
            case 'cheerio':
                return SdJscript.tryLoadLibItem(asset, 'R.raw.cheerio', js);
            default:
                return false;
        }
    }
    static tryLoadLibItem(asset, resID, js) {
        try {
            let is =
                asset + '/main_res_raw_' + resID.match(/[^.]+$/)[0] + '.js';
            let fd_in = fs.openSync(is, 'r');
            let code = this.doToString(fd_in);
            fs.closeSync(fd_in);
            js.loadJs(code);
            return true;
        } catch (ex) {
            return false;
        }
    }
    static doToString(fd_in) {
        let buffer = [];
        readlineSync(fd_in, function (line) {
            // readlineSync是自定义的同步方式按行读取文本的方法
            buffer.push(line, '\r\n'); // 要加换行，不然库文件只有一行时会被里面注释破坏
        });
        return buffer.join('');
    }
}
exports = module.exports = SdJscript;
